#!/usr/bin/env python3
"""Build the occupation-vacancies dataset from StatCan JVWS table 14100443.

Source: https://www150.statcan.gc.ca/n1/tbl/csv/14100443-eng.zip
  "Job vacancies, proportion of job vacancies and average offered hourly wage
   by occupation and selected characteristics, quarterly, unadjusted for
   seasonality" (CURRENT series, 2015Q1 to 2026Q2).

Dedup rule (archived predecessor 14100328, 2015Q1-2023Q3, INACTIVE): the
current series fully supersedes the archived series for every overlapping
quarter, so archived rows contribute zero observations to this build.

Outputs: public/data/*.json, public/downloads/*.csv
"""
import csv
import json
import math
import os
import sys
import zipfile
from collections import defaultdict

import pandas as pd

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(BASE, "raw")
DATA = os.path.join(BASE, "public", "data")
DL = os.path.join(BASE, "public", "downloads")
LOG = []

def log(msg):
    LOG.append(msg)
    print(msg, flush=True)

# ---- fixed mappings ---------------------------------------------------------
SHORT_EN = {2: "Senior management", 3: "Business and finance", 4: "Sciences",
            5: "Health", 6: "Education and law", 7: "Arts and sport",
            8: "Sales and service", 9: "Trades and transport",
            10: "Resources and agriculture", 11: "Manufacturing"}
SHORT_FR = {2: "Haute direction", 3: "Affaires et finance", 4: "Sciences",
            5: "Sante", 6: "Enseignement et droit", 7: "Arts et sports",
            8: "Vente et services", 9: "Metiers et transport",
            10: "Ressources et agriculture", 11: "Fabrication"}

DUR_ALL = 23
DUR_BANDS = {24: "lt15", 25: "d15_29", 26: "d30_59", 27: "d60_89",
             28: "d90p", 45: "d90_119", 46: "d120p"}
KEEP_CHARS = {23, 24, 25, 26, 27, 28, 45, 46, 29, 48, 49}

STAT_VAC = "Job vacancies"
STAT_WAGE = "Average offered hourly wage"

COLS = ["REF_DATE", "GEO", "National Occupational Classification",
        "Job vacancy characteristics", "Statistics", "VALUE", "STATUS"]

def to_quarter(s):
    return s.str.slice(0, 4) + "Q" + ((s.str.slice(5, 7).astype(int) - 1) // 3 + 1).astype(str)

def load_meta():
    noc, char = {}, {}
    with open(os.path.join(RAW, "14100443_MetaData.csv"), encoding="utf-8-sig") as f:
        lines = f.readlines()
    # find the member-section header (line 10): "Dimension ID","Member Name",...
    start = next(i for i, l in enumerate(lines)
                 if l.startswith('"Dimension ID","Member Name"'))
    rdr = csv.DictReader(lines[start:])
    for r in rdr:
        dim = (r.get("Dimension ID") or "").strip()
        if dim not in ("2", "3"):
            continue
        try:
            mid = int(r["Member ID"])
        except (ValueError, TypeError):
            continue
        p = (r.get("Parent Member ID") or "").strip()
        entry = {"name_en": (r.get("Member Name") or "").strip(),
                 "parent": int(p) if p else None,
                 "code": (r.get("Classification Code") or "").strip("[]")}
        (noc if dim == "2" else char)[mid] = entry
    # merge French member names from the WDS cube metadata
    with open(os.path.join(RAW, "cube_metadata_14100443.json"), encoding="utf-8") as f:
        wds = json.load(f)
    for d in wds:
        obj = d.get("object") or {}
        if str(obj.get("productId")) != "14100443":
            continue
        for m in obj.get("dimension", []):
            name = m.get("dimensionNameEn", "")
            target = None
            if "Occupational" in name:
                target = noc
            elif "characteristics" in name:
                target = char
            if target is None:
                continue
            for mem in m.get("member", []):
                mid = mem.get("memberId")
                if mid in target:
                    target[mid]["name_fr"] = (mem.get("memberNameFr") or "").strip()
    return noc, char

def main():
    os.makedirs(DATA, exist_ok=True)
    os.makedirs(DL, exist_ok=True)
    noc, char = load_meta()
    log(f"NOC members: {len(noc)}, characteristic members: {len(char)}")
    noc_name_to_id = {e["name_en"]: mid for mid, e in noc.items()}
    char_name_to_id = {e["name_en"]: mid for mid, e in char.items()}
    keep_char_names = {char[i]["name_en"] for i in KEEP_CHARS}

    children = defaultdict(list)
    for mid, e in noc.items():
        if e["parent"] is not None:
            children[e["parent"]].append(mid)

    z = zipfile.ZipFile(os.path.join(RAW, "t443.zip"))
    fh = z.open("14100443.csv")

    cells = {}  # (noc_id, char_id, quarter, stat) -> value
    quar = defaultdict(int)
    scanned = 0
    wage_vals = []

    chunks = pd.read_csv(fh, chunksize=400_000, usecols=COLS, dtype=str)
    for ci, ch in enumerate(chunks):
        scanned += len(ch)
        ch = ch[ch["GEO"] == "Canada"]
        ch = ch[ch["Statistics"].isin([STAT_VAC, STAT_WAGE])]
        ch = ch[ch["Job vacancy characteristics"].isin(keep_char_names)]
        if ch.empty:
            continue
        ch = ch.copy()
        noc_names = (ch["National Occupational Classification"].str.strip()
                       .str.replace(r"\s*\[[^\]]*\]$", "", regex=True))
        ch["noc_id"] = noc_names.map(noc_name_to_id)
        ch["char_id"] = ch["Job vacancy characteristics"].str.strip().map(char_name_to_id)
        ch["quarter"] = to_quarter(ch["REF_DATE"].str.strip())
        ch["val"] = pd.to_numeric(ch["VALUE"].str.strip().str.replace(",", "", regex=False),
                                  errors="coerce")
        st = ch["STATUS"].fillna("").str.strip()
        bad = st.isin(["x", "F"]) | ch["val"].isna()
        quar["suppressed_or_unreliable"] += int(bad.sum())
        ch = ch[~bad]
        neg = (ch["Statistics"] == STAT_VAC) & (ch["val"] < 0)
        quar["negative_vacancies"] += int(neg.sum())
        ch = ch[~neg]
        wbad = (ch["Statistics"] == STAT_WAGE) & ((ch["val"] <= 0) | (ch["val"] > 500))
        quar["wage_out_of_range"] += int(wbad.sum())
        wage_vals.extend(ch.loc[(ch["Statistics"] == STAT_WAGE) & ~wbad, "val"].tolist())
        ch = ch[~wbad]
        unk = ch["noc_id"].isna()
        quar["unknown_noc_name"] += int(unk.sum())
        ch = ch[~unk]
        ch["noc_id"] = ch["noc_id"].astype(int)
        ch["char_id"] = ch["char_id"].astype(int)
        g = ch.groupby(["noc_id", "char_id", "quarter", "Statistics"])["val"].last()
        for k, v in g.items():
            cells[k] = float(v)
        if ci % 20 == 0:
            log(f"  chunk {ci}: scanned {scanned:,}, cells {len(cells):,}")
    fh.close()
    log(f"total rows scanned: {scanned:,}; cells kept: {len(cells):,}")
    log(f"quarantine: {dict(quar)}")
    wage_vals.sort()
    n = len(wage_vals)
    log(f"wages kept: n={n:,}, min={wage_vals[0]:.2f}, p1={wage_vals[n//100]:.2f}, "
        f"median={wage_vals[n//2]:.2f}, p99={wage_vals[99*n//100]:.2f}, max={wage_vals[-1]:.2f}")

    # persist the cell store for the analysis step
    with open(os.path.join(RAW, "cells.json"), "w") as f:
        json.dump({f"{a}|{b}|{c}|{d}": v for (a, b, c, d), v in cells.items()}, f)
    with open(os.path.join(RAW, "meta.json"), "w") as f:
        json.dump({"noc": {str(k): v for k, v in noc.items()},
                   "char": {str(k): v for k, v in char.items()},
                   "quarantine": dict(quar), "scanned": scanned}, f)
    log("saved raw/cells.json and raw/meta.json")

if __name__ == "__main__":
    main()
