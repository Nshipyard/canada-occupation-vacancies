"use client";

import { useMemo, useState } from "react";
import { useLang, fmtNum, fmtMoney } from "@/i18n";
import {
  CATEGORIES,
  MINOR_GROUPS,
  QUADRANT_COLORS,
  broadShort,
  searchUnits,
  verdictFor,
  type Quadrant,
} from "@/data";

const DURATION_BANDS: [number, number][] = [
  [0, 15],
  [15, 25],
  [25, 35],
  [35, 100],
];
const WAGE_BANDS: [number, number][] = [
  [0, 20],
  [20, 30],
  [30, 40],
  [40, 1000],
];

function VerdictPill({ verdict }: { verdict: Quadrant }) {
  const { t } = useLang();
  const label = t.quadrants[verdict].label;
  const bg =
    verdict === "wage_problem"
      ? "bg-canada/10 text-canada"
      : verdict === "supply_problem"
        ? "bg-[#16224a]/10 text-[#16224a]"
        : "bg-muted text-ink/60";
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[12.5px] font-semibold ${bg}`}>
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: QUADRANT_COLORS[verdict] }} />
      {label}
    </span>
  );
}

export default function ExplorerPage() {
  const { t, lang } = useLang();
  const [broad, setBroad] = useState<string>("all");
  const [durBand, setDurBand] = useState<string>("all");
  const [wageBand, setWageBand] = useState<string>("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    return MINOR_GROUPS.filter((g) => {
      if (broad !== "all" && g.broad !== parseInt(broad, 10)) return false;
      if (durBand !== "all") {
        const [lo, hi] = DURATION_BANDS[parseInt(durBand, 10)];
        const v = g.lt90_share ?? -1;
        if (v < lo || v >= hi) return false;
      }
      if (wageBand !== "all") {
        const [lo, hi] = WAGE_BANDS[parseInt(wageBand, 10)];
        if (g.wage < lo || g.wage >= hi) return false;
      }
      return true;
    }).map((g) => ({ ...g, verdict: verdictFor(g.lt90_share, g.wage) }));
  }, [broad, durBand, wageBand]);

  const results = useMemo(() => searchUnits(query, 12), [query]);

  const selectCls =
    "min-w-[220px] rounded-2xl border border-line bg-paper px-4 py-2.5 text-[14.5px]";

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-14 md:pt-20">
      <h1 className="display text-[clamp(34px,4.6vw,54px)]">{t.explorer.title}</h1>
      <p className="mt-4 max-w-[640px] text-[16px] text-ink/65">{t.explorer.lede}</p>

      <div className="mt-8 flex flex-wrap gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink/50">{t.explorer.category}</span>
          <select value={broad} onChange={(e) => setBroad(e.target.value)} className={selectCls}>
            <option value="all">{t.explorer.allCategories}</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {lang === "fr" ? c.short_fr : c.short_en}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink/50">{t.explorer.duration}</span>
          <select value={durBand} onChange={(e) => setDurBand(e.target.value)} className={selectCls}>
            <option value="all">{t.explorer.allDurations}</option>
            {t.explorer.durationBands.map((b, i) => (
              <option key={b} value={i}>
                {b}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink/50">{t.explorer.wage}</span>
          <select value={wageBand} onChange={(e) => setWageBand(e.target.value)} className={selectCls}>
            <option value="all">{t.explorer.allWages}</option>
            {t.explorer.wageBands.map((b, i) => (
              <option key={b} value={i}>
                {b}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {(Object.keys(t.quadrants) as Quadrant[]).map((q) => (
          <span key={q} className="inline-flex items-start gap-2 rounded-2xl border border-line bg-paper p-3 text-[12.5px] text-ink/65">
            <span className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: QUADRANT_COLORS[q] }} />
            <span>
              <span className="font-semibold text-ink">{t.quadrants[q].label}.</span> {t.quadrants[q].desc}
            </span>
          </span>
        ))}
      </div>

      <p className="mt-8 text-[13.5px] font-semibold text-ink/60">
        {fmtNum(rows.length, lang)} {t.explorer.of} 59 {t.explorer.results}
      </p>
      <div className="mt-3 overflow-x-auto rounded-[24px] border border-line">
        <table className="w-full min-w-[860px] text-left text-[14px]">
          <thead>
            <tr className="border-b border-line bg-paper-warm text-[12.5px] uppercase tracking-[0.08em] text-ink/55">
              <th className="px-5 py-3.5 font-semibold">{t.explorer.colOccupation}</th>
              <th className="px-5 py-3.5 font-semibold">{t.explorer.colBroad}</th>
              <th className="px-5 py-3.5 font-semibold">{t.explorer.colVacancies}</th>
              <th className="px-5 py-3.5 font-semibold">{t.explorer.colLt90}</th>
              <th className="px-5 py-3.5 font-semibold">{t.explorer.colWage}</th>
              <th className="px-5 py-3.5 font-semibold">{t.explorer.colVerdict}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((g) => (
              <tr key={g.id} className="border-b border-line/60 last:border-0 hover:bg-paper-warm">
                <td className="px-5 py-3">
                  <span className="font-medium">{lang === "fr" ? g.label_fr : g.label_en}</span>
                  <span className="ml-2 font-mono text-[12px] text-ink/45">{g.code}</span>
                </td>
                <td className="px-5 py-3 text-ink/65">{broadShort(g.broad, lang)}</td>
                <td className="px-5 py-3 font-semibold">{fmtNum(g.vacancies, lang)}</td>
                <td className="px-5 py-3 font-semibold text-canada">{fmtNum(g.lt90_share ?? 0, lang, 1)}%</td>
                <td className="px-5 py-3">{fmtMoney(g.wage, lang)}</td>
                <td className="px-5 py-3">
                  <VerdictPill verdict={g.verdict} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[13px] text-ink/50">{t.explorer.unitNote}</p>

      <div className="mt-14 rounded-[32px] border border-line bg-paper-warm p-6 md:p-10">
        <h2 className="display text-[26px] md:text-[30px]">{t.explorer.searchTitle}</h2>
        <p className="mt-2 text-[14.5px] text-ink/60">{t.explorer.searchHint}</p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.explorer.searchPlaceholder}
          className="mt-5 w-full max-w-[520px] rounded-2xl border border-line bg-paper px-5 py-3 text-[15px] outline-none placeholder:text-ink/35 focus:border-canada"
        />
        {query.trim().length >= 2 && (
          <div className="mt-5">
            {results.length === 0 ? (
              <p className="text-[14.5px] text-ink/60">{t.explorer.noResults}</p>
            ) : (
              <div className="overflow-x-auto rounded-[20px] border border-line bg-paper">
                <table className="w-full min-w-[760px] text-left text-[14px]">
                  <tbody>
                    {results.map((o) => (
                      <tr key={o.id} className="border-b border-line/60 last:border-0">
                        <td className="px-5 py-3">
                          <span className="font-medium">{lang === "fr" ? o.label_fr : o.label_en}</span>
                          <span className="ml-2 font-mono text-[12px] text-ink/45">{o.code}</span>
                        </td>
                        <td className="px-5 py-3 text-ink/65">{broadShort(o.broad, lang)}</td>
                        <td className="px-5 py-3 font-semibold">{fmtNum(o.vacancies, lang)}</td>
                        <td className="px-5 py-3 font-semibold text-canada">{fmtNum(o.lt90_share ?? 0, lang, 1)}%</td>
                        <td className="px-5 py-3">{fmtMoney(o.wage, lang)}</td>
                        <td className="px-5 py-3">
                          <VerdictPill verdict={verdictFor(o.lt90_share, o.wage)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
