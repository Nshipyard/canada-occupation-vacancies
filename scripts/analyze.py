#!/usr/bin/env python3
"""Analyze the JVWS occupation cells into the app's public datasets.

Reads raw/cells.json + raw/meta.json (built by build_data.py).
Writes public/data/*.json and public/downloads/*.csv.
"""
import csv
import json
import math
import os
from collections import defaultdict

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(BASE, "raw")
DATA = os.path.join(BASE, "public", "data")
DL = os.path.join(BASE, "public", "downloads")

SHORT_EN = {2: "Senior management", 3: "Business and finance", 4: "Sciences",
            5: "Health", 6: "Education and law", 7: "Arts and sport",
            8: "Sales and service", 9: "Trades and transport",
            10: "Resources and agriculture", 11: "Manufacturing"}
SHORT_FR = {2: "Haute direction", 3: "Affaires et finance", 4: "Sciences",
            5: "Santé", 6: "Enseignement et droit", 7: "Arts et sports",
            8: "Vente et services", 9: "Métiers et transport",
            10: "Ressources et agriculture", 11: "Fabrication"}

BROAD = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
VAC, WAGE = "Job vacancies", "Average offered hourly wage"

def load():
    cells_raw = json.load(open(os.path.join(RAW, "cells.json")))
    meta = json.load(open(os.path.join(RAW, "meta.json")))
    noc = {int(k): v for k, v in meta["noc"].items()}
    cells = defaultdict(dict)
    for k, v in cells_raw.items():
        a, b, c, d = k.split("|", 3)
        cells[(int(a), int(b), c)][d] = v
    quarters = sorted({c for (_, _, c) in cells})
    return cells, noc, quarters, meta

def get(cells, noc_id, char, q, stat):
    return cells.get((noc_id, char, q), {}).get(stat)

def main():
    cells, noc, quarters, meta = load()
    LQ = quarters[-1]
    print("quarters:", quarters[0], "->", LQ, f"({len(quarters)})")

    # ---- tree levels -------------------------------------------------------
    def depth(mid):
        d, m = 0, mid
        while noc[m]["parent"] not in (None, 1):
            m = noc[m]["parent"]
            d += 1
        return d
    by_depth = defaultdict(list)
    for mid in noc:
        if mid != 1:
            by_depth[depth(mid)].append(mid)
    minor_ids = sorted(by_depth[2])   # 89 minor groups
    unit_ids = sorted(by_depth[4])    # 516 unit groups
    print("levels:", {d: len(v) for d, v in sorted(by_depth.items())})

    # ---- broad category series ---------------------------------------------
    broad = []
    for b in BROAD:
        series = []
        for q in quarters:
            v = get(cells, b, 23, q, VAC)
            if v is None:
                continue
            lt = get(cells, b, 28, q, VAC) or 0
            w = get(cells, b, 23, q, WAGE)
            bands = {name: (get(cells, b, cid, q, VAC) or 0)
                     for cid, name in [(24, "lt15"), (25, "d15_29"), (26, "d30_59"),
                                       (27, "d60_89"), (28, "d90p")]}
            cr = get(cells, b, 48, q, VAC)
            series.append({"q": q, "vacancies": v,
                           "lt90_share": round(lt / v * 100, 1) if v else None,
                           "wage": round(w, 2) if w else None,
                           "bands": {k: int(x) for k, x in bands.items()},
                           "constantly_recruiting": int(cr) if cr else 0,
                           "constantly_recruiting_share":
                               round(cr / v * 100, 1) if v and cr else None})
        latest = series[-1]
        broad.append({
            "id": b,
            "label_en": noc[b]["name_en"], "label_fr": noc[b].get("name_fr", ""),
            "short_en": SHORT_EN[b], "short_fr": SHORT_FR[b],
            "code": noc[b]["code"],
            "series": series, "latest": latest,
        })
    # quadrant on latest quarter: medians of lt90_share and wage
    lts = sorted(c["latest"]["lt90_share"] for c in broad if c["latest"]["lt90_share"] is not None)
    wgs = sorted(c["latest"]["wage"] for c in broad if c["latest"]["wage"] is not None)
    med_lt = lts[len(lts) // 2]
    med_w = wgs[len(wgs) // 2]
    print(f"median lt90_share={med_lt}, median wage={med_w}")
    for c in broad:
        lt, w = c["latest"]["lt90_share"], c["latest"]["wage"]
        if lt is None or w is None:
            c["quadrant"] = "unknown"
        elif lt >= med_lt and w < med_w:
            c["quadrant"] = "wage_problem"
        elif lt >= med_lt and w >= med_w:
            c["quadrant"] = "supply_problem"
        else:
            c["quadrant"] = "filling"
        c["latest"]["quadrant"] = c["quadrant"]
    for c in sorted(broad, key=lambda c: -(c["latest"]["lt90_share"] or 0)):
        l = c["latest"]
        print(f"  {c['short_en']:24s} vac={l['vacancies']:>8,.0f} lt90={l['lt90_share']:5.1f}% "
              f"wage=${l['wage']:5.2f} quad={c['quadrant']}")

    # ---- minor groups: latest quarter --------------------------------------
    minor = []
    for m in minor_ids:
        v = get(cells, m, 23, LQ, VAC)
        if not v:
            continue
        lt = get(cells, m, 28, LQ, VAC) or 0
        w = get(cells, m, 23, LQ, WAGE)
        # parent broad
        p, b = m, None
        while p is not None:
            p = noc[p]["parent"]
            if p in BROAD:
                b = p
                break
        minor.append({"id": m, "broad": b,
                      "label_en": noc[m]["name_en"], "label_fr": noc[m].get("name_fr", ""),
                      "code": noc[m]["code"],
                      "vacancies": int(v),
                      "lt90_share": round(lt / v * 100, 1),
                      "wage": round(w, 2) if w else None})
    minor.sort(key=lambda r: -r["vacancies"])
    print(f"minor groups with data: {len(minor)}")
    for r in minor[:12]:
        print(f"  {r['label_en'][:52]:54s} vac={r['vacancies']:>7,.0f} lt90={r['lt90_share']:5.1f}% wage=${r['wage']}")

    # ---- unit groups: lookup -----------------------------------------------
    unit = []
    for u in unit_ids:
        v = get(cells, u, 23, LQ, VAC)
        if not v:
            continue
        lt = get(cells, u, 28, LQ, VAC) or 0
        w = get(cells, u, 23, LQ, WAGE)
        p, b = u, None
        while p is not None:
            p = noc[p]["parent"]
            if p in BROAD:
                b = p
                break
        unit.append({"id": u, "broad": b, "code": noc[u]["code"],
                     "label_en": noc[u]["name_en"], "label_fr": noc[u].get("name_fr", ""),
                     "vacancies": int(v),
                     "lt90_share": round(lt / v * 100, 1),
                     "wage": round(w, 2) if w else None})
    unit.sort(key=lambda r: -r["vacancies"])
    print(f"unit groups with data: {len(unit)}")
    for r in unit[:12]:
        print(f"  {r['label_en'][:52]:54s} vac={r['vacancies']:>7,.0f} lt90={r['lt90_share']:5.1f}% wage=${r['wage']}")

    # ---- national series ----------------------------------------------------
    national = []
    for q in quarters:
        v = get(cells, 1, 23, q, VAC)
        if v is None:
            continue
        lt = get(cells, 1, 28, q, VAC) or 0
        w = get(cells, 1, 23, q, WAGE)
        national.append({"q": q, "vacancies": int(v),
                         "lt90_share": round(lt / v * 100, 1),
                         "wage": round(w, 2) if w else None})

    # ---- anomaly detection: long-term share spikes per broad category -------
    anomalies = []
    for c in broad:
        s = [(r["q"], r["lt90_share"]) for r in c["series"] if r["lt90_share"] is not None]
        vals = [x[1] for x in s]
        if len(vals) < 12:
            continue
        for i in range(8, len(vals)):
            window = vals[i - 8:i]
            mu = sum(window) / 8
            sd = (sum((x - mu) ** 2 for x in window) / 8) ** 0.5 or 0.01
            z = (vals[i] - mu) / sd
            if abs(z) > 2.5:
                anomalies.append({"broad": c["short_en"], "broad_fr": c["short_fr"],
                                  "quarter": s[i][0], "lt90_share": vals[i],
                                  "trailing_mean": round(mu, 1), "z": round(z, 2)})
    anomalies.sort(key=lambda r: -abs(r["z"]))
    print(f"anomalies: {len(anomalies)}")
    for a in anomalies[:8]:
        print(f"  {a['broad']} {a['quarter']}: {a['lt90_share']}% vs trailing {a['trailing_mean']}% (z={a['z']})")

    # ---- write outputs -------------------------------------------------------
    os.makedirs(DATA, exist_ok=True)
    os.makedirs(DL, exist_ok=True)
    meta_out = {"built": "2026-10-10", "source": "StatCan table 14100443 (JVWS, quarterly, unadjusted)",
                "series": "CURRENT, 2015Q1-2026Q2", "latest_quarter": LQ,
                "geography": "Canada",
                "quarantine": meta["quarantine"], "rows_scanned": meta["scanned"],
                "dedup_rule": "Archived predecessor 14100328 (2015Q1-2023Q3, ARCHIVED) fully "
                              "superseded by 14100443; archived rows contribute zero observations."}
    with open(os.path.join(DATA, "broad.json"), "w") as f:
        json.dump({"meta": meta_out, "medians": {"lt90_share": med_lt, "wage": round(med_w, 2)},
                   "categories": broad}, f)
    with open(os.path.join(DATA, "minor.json"), "w") as f:
        json.dump({"meta": meta_out, "latest_quarter": LQ, "groups": minor}, f)
    with open(os.path.join(DATA, "unit.json"), "w") as f:
        json.dump({"meta": meta_out, "latest_quarter": LQ, "occupations": unit}, f)
    with open(os.path.join(DATA, "national.json"), "w") as f:
        json.dump({"meta": meta_out, "series": national}, f)
    with open(os.path.join(DATA, "anomalies.json"), "w") as f:
        json.dump({"meta": meta_out, "anomalies": anomalies[:40]}, f)

    # downloads
    with open(os.path.join(DL, "broad_quarterly.csv"), "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["quarter", "broad_id", "label_en", "label_fr", "vacancies",
                    "lt90_share_pct", "offered_wage_cad_hr", "constantly_recruiting_share_pct",
                    "quadrant"])
        for c in broad:
            for r in c["series"]:
                w.writerow([r["q"], c["id"], c["label_en"], c["label_fr"],
                            int(r["vacancies"]), r["lt90_share"], r["wage"],
                            r["constantly_recruiting_share"], c["quadrant"]])
    with open(os.path.join(DL, "minor_latest.csv"), "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["broad_en", "minor_code", "label_en", "label_fr", "vacancies",
                    "lt90_share_pct", "offered_wage_cad_hr"])
        for r in minor:
            w.writerow([SHORT_EN.get(r["broad"], ""), r["code"], r["label_en"],
                        r["label_fr"], r["vacancies"], r["lt90_share"], r["wage"]])
    with open(os.path.join(DL, "unit_latest.csv"), "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["broad_en", "unit_code", "label_en", "label_fr", "vacancies",
                    "lt90_share_pct", "offered_wage_cad_hr"])
        for r in unit:
            w.writerow([SHORT_EN.get(r["broad"], ""), r["code"], r["label_en"],
                        r["label_fr"], r["vacancies"], r["lt90_share"], r["wage"]])
    print("wrote public/data/*.json and public/downloads/*.csv")

if __name__ == "__main__":
    main()
