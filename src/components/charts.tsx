"use client";

import { useLang, fmtNum } from "@/i18n";
import {
  MEDIANS,
  QUADRANT_COLORS,
  type BroadCategory,
  type NationalPoint,
  type UnitOccupation,
} from "@/data";

const RED = "#d80621";
const NAVY = "#16224a";
const INK = "#0a0f1e";

function qIndex(q: string): number {
  const y = parseInt(q.slice(0, 4), 10);
  const qq = parseInt(q.slice(5), 10);
  return y * 4 + qq;
}

/* ------------------------------------------------------------------ */
/* Money chart: duration vs offered wage scatter, 10 broad categories */
/* ------------------------------------------------------------------ */

export function ScatterChart({ categories }: { categories: BroadCategory[] }) {
  const { t, lang } = useLang();
  const W = 920;
  const H = 560;
  const padL = 58;
  const padR = 18;
  const padT = 38;
  const padB = 54;
  const xMin = 15;
  const xMax = 90;
  const yMax = 50;
  const x = (w: number) => padL + ((w - xMin) / (xMax - xMin)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / yMax) * (H - padT - padB);
  const maxVac = Math.max(...categories.map((c) => c.latest.vacancies));
  const r = (vac: number) => 8 + 40 * Math.sqrt(vac / maxVac);
  const xMed = x(MEDIANS.wage);
  const yMed = y(MEDIANS.lt90_share);
  const ordered = [...categories].sort((a, b) => b.latest.vacancies - a.latest.vacancies);

  const labelPos = (c: BroadCategory): { lx: number; ly: number; anchor: "start" | "middle" | "end"; lead?: [number, number] } => {
    const cx = x(c.latest.wage);
    const cy = y(c.latest.lt90_share ?? 0);
    const rr = r(c.latest.vacancies);
    switch (c.id) {
      case 2:
        return { lx: cx, ly: cy + rr + 18, anchor: "middle" };
      case 3:
        return { lx: cx + rr + 10, ly: cy + 5, anchor: "start" };
      case 4:
        return { lx: cx + rr + 10, ly: cy + 5, anchor: "start" };
      case 5:
        return { lx: cx, ly: cy - rr - 12, anchor: "middle" };
      case 6:
        return { lx: cx, ly: cy - rr - 13, anchor: "middle" };
      case 7:
        return { lx: cx + 26, ly: cy + rr + 26, anchor: "start" };
      case 8:
        return { lx: cx - 71, ly: cy + rr + 36, anchor: "start" };
      case 9:
        return { lx: cx + rr + 10, ly: cy + 5, anchor: "start" };
      case 10:
        return { lx: 210, ly: 448, anchor: "start", lead: [cx + 8, cy + rr - 3] };
      case 11:
        return { lx: 110, ly: 165, anchor: "middle", lead: [cx - 15, cy - 14] };
      default:
        return { lx: cx, ly: cy - rr - 10, anchor: "middle" };
    }
  };

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={t.home.chartTitle}>
        {/* quadrant tints */}
        <rect x={padL} y={padT} width={xMed - padL} height={yMed - padT} fill="rgba(216,6,33,0.055)" />
        <rect x={xMed} y={padT} width={W - padR - xMed} height={yMed - padT} fill="rgba(22,34,74,0.06)" />
        <rect x={padL} y={yMed} width={W - padL - padR} height={H - padB - yMed} fill="rgba(10,15,30,0.03)" />
        {/* gridlines */}
        {[0, 10, 20, 30, 40, 50].map((v) => (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="rgba(10,15,30,0.08)" />
            <text x={padL - 8} y={y(v) + 4} textAnchor="end" fontSize="11.5" fill="rgba(10,15,30,0.55)">
              {v}
            </text>
          </g>
        ))}
        {[20, 30, 40, 50, 60, 70, 80].map((w) => (
          <text key={w} x={x(w)} y={H - padB + 20} textAnchor="middle" fontSize="11.5" fill="rgba(10,15,30,0.55)">
            {w}
          </text>
        ))}
        <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="13" fill="rgba(10,15,30,0.7)">
          {t.charts.wageAxis}
        </text>
        <text
          x={18}
          y={H / 2}
          textAnchor="middle"
          fontSize="13"
          fill="rgba(10,15,30,0.7)"
          transform={`rotate(-90 18 ${H / 2})`}
        >
          {t.charts.lt90Axis}
        </text>
        {/* quadrant corner labels */}
        <text x={padL + 10} y={padT + 20} fontSize="11" fontWeight="700" letterSpacing="1.5" fill={RED} opacity="0.75">
          {t.charts.wageProblem.toUpperCase()}
        </text>
        <text x={W - padR - 10} y={padT + 20} textAnchor="end" fontSize="11" fontWeight="700" letterSpacing="1.5" fill={NAVY} opacity="0.75">
          {t.charts.supplyProblem.toUpperCase()}
        </text>
        <text x={W - padR - 10} y={H - padB - 12} textAnchor="end" fontSize="11" fontWeight="700" letterSpacing="1.5" fill="rgba(10,15,30,0.45)">
          {t.charts.filling.toUpperCase()}
        </text>
        {/* median lines */}
        <line x1={xMed} x2={xMed} y1={padT} y2={H - padB} stroke="rgba(10,15,30,0.45)" strokeDasharray="6 5" strokeWidth="1.5" />
        <line x1={padL} x2={W - padR} y1={yMed} y2={yMed} stroke="rgba(10,15,30,0.45)" strokeDasharray="6 5" strokeWidth="1.5" />
        <text x={xMed - 7} y={padT - 8} textAnchor="end" fontSize="11.5" fontWeight="600" fill="rgba(10,15,30,0.6)">
          {t.charts.medianWage}
        </text>
        <text x={W - padR - 4} y={yMed - 8} textAnchor="end" fontSize="11.5" fontWeight="600" fill="rgba(10,15,30,0.6)">
          {t.charts.medianLt}
        </text>
        {/* bubbles, largest first so small ones sit on top */}
        {ordered.map((c) => {
          const cx = x(c.latest.wage);
          const cy = y(c.latest.lt90_share ?? 0);
          const p = labelPos(c);
          const name = lang === "fr" ? c.short_fr : c.short_en;
          return (
            <g key={c.id}>
              <circle
                cx={cx}
                cy={cy}
                r={r(c.latest.vacancies)}
                fill={QUADRANT_COLORS[c.quadrant]}
                opacity="0.88"
                stroke="#ffffff"
                strokeWidth="2"
              />
              {p.lead && (
                <line x1={p.lead[0]} x2={p.lx + (p.anchor === "start" ? 4 : p.anchor === "middle" ? 44 : 84)} y1={p.lead[1]} y2={p.ly - 5} stroke="rgba(10,15,30,0.4)" strokeWidth="1" />
              )}
              <text
                x={p.lx}
                y={p.ly}
                textAnchor={p.anchor}
                fontSize="13"
                fontWeight="600"
                fill={INK}
                className="chart-label hidden md:block"
              >
                {name}
              </text>
            </g>
          );
        })}
      </svg>
      {/* legend: always visible, carries the chart on mobile where bubble labels hide */}
      <div className="mt-4 flex flex-wrap gap-2">
        {ordered.map((c) => {
          const name = lang === "fr" ? c.short_fr : c.short_en;
          const qlabel =
            c.quadrant === "wage_problem"
              ? t.charts.wageProblem
              : c.quadrant === "supply_problem"
                ? t.charts.supplyProblem
                : t.charts.filling;
          return (
            <span
              key={c.id}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-[12.5px]"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: QUADRANT_COLORS[c.quadrant] }} />
              <span className="font-semibold">{name}</span>
              <span className="text-ink/50">{qlabel}</span>
            </span>
          );
        })}
      </div>
      <figcaption className="mt-3 text-[13px] text-ink/60">
        {t.home.chartSub}{" "}
        {lang === "fr"
          ? "La surface des bulles est proportionnelle aux postes vacants."
          : "Bubble area scales with vacancies."}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Duration ranking bars: 10 broad groups by long-term share           */
/* ------------------------------------------------------------------ */

export function DurationRankingBars({ categories }: { categories: BroadCategory[] }) {
  const { t, lang } = useLang();
  const sorted = [...categories].sort((a, b) => (b.latest.lt90_share ?? -1) - (a.latest.lt90_share ?? -1));
  const W = 920;
  const rowH = 40;
  const padL = 208;
  const padR = 72;
  const padT = 10;
  const H = sorted.length * rowH + padT + 34;
  const xMax = 50;
  const x = (v: number) => padL + (v / xMax) * (W - padL - padR);
  return (
    <figure>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px]" role="img" aria-label={t.charts.rankingTitle}>
          {[0, 10, 20, 30, 40, 50].map((v) => (
            <g key={v}>
              <line x1={x(v)} x2={x(v)} y1={padT} y2={H - 30} stroke="rgba(10,15,30,0.08)" />
              <text x={x(v)} y={H - 10} textAnchor="middle" fontSize="11" fill="rgba(10,15,30,0.55)">
                {v}%
              </text>
            </g>
          ))}
          <line
            x1={x(MEDIANS.lt90_share)}
            x2={x(MEDIANS.lt90_share)}
            y1={padT}
            y2={H - 30}
            stroke="rgba(10,15,30,0.5)"
            strokeDasharray="6 5"
            strokeWidth="1.5"
          />
          <text x={x(MEDIANS.lt90_share) + 6} y={padT + 12} fontSize="11.5" fontWeight="600" fill="rgba(10,15,30,0.6)">
            {t.charts.medianLt}
          </text>
          {sorted.map((c, i) => {
            const yMid = padT + i * rowH + rowH / 2;
            const v = c.latest.lt90_share ?? 0;
            const name = lang === "fr" ? c.short_fr : c.short_en;
            return (
              <g key={c.id}>
                <text x={padL - 12} y={yMid + 4.5} textAnchor="end" fontSize="13" fill="rgba(10,15,30,0.85)">
                  {name}
                </text>
                <rect
                  x={padL}
                  y={yMid - 10}
                  width={Math.max(x(v) - padL, 3)}
                  height={20}
                  rx={6}
                  fill={QUADRANT_COLORS[c.quadrant]}
                  opacity="0.88"
                />
                <text x={x(v) + 8} y={yMid + 4.5} fontSize="12.5" fontWeight="700" fill={QUADRANT_COLORS[c.quadrant]}>
                  {fmtNum(v, lang, 1)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-2 text-[13px] text-ink/60">{t.charts.rankingSub}</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* National trend: vacancies + long-term share, 2015Q1 to 2026Q2       */
/* ------------------------------------------------------------------ */

export function NationalTrend({ series }: { series: NationalPoint[] }) {
  const { t, lang } = useLang();
  const W = 920;
  const H = 470;
  const padL = 66;
  const padR = 58;
  const padT = 26;
  const padB = 52;
  const vMax = 1_100_000;
  const sMax = 45;
  const x = (i: number) => padL + (i / (series.length - 1)) * (W - padL - padR);
  const yV = (v: number) => padT + (1 - v / vMax) * (H - padT - padB);
  const yS = (s: number) => padT + (1 - s / sMax) * (H - padT - padB);

  // split into continuous segments so the 2020Q2/2020Q3 suspension draws as a break
  const segments: NationalPoint[][] = [];
  let cur: NationalPoint[] = [];
  series.forEach((p, i) => {
    if (i > 0 && qIndex(p.q) - qIndex(series[i - 1].q) > 1) {
      segments.push(cur);
      cur = [];
    }
    cur.push(p);
  });
  if (cur.length) segments.push(cur);

  const segPath = (pts: NationalPoint[], get: (p: NationalPoint) => number, yy: (v: number) => number) =>
    pts
      .map((p, j) => {
        const i = series.indexOf(p);
        return `${j === 0 ? "M" : "L"}${x(i).toFixed(1)},${yy(get(p)).toFixed(1)}`;
      })
      .join(" ");

  const areaPath = (pts: NationalPoint[]) => {
    const i0 = series.indexOf(pts[0]);
    const i1 = series.indexOf(pts[pts.length - 1]);
    const top = pts
      .map((p, j) => `${j === 0 ? "M" : "L"}${x(series.indexOf(p)).toFixed(1)},${yV(p.vacancies).toFixed(1)}`)
      .join(" ");
    return `${top} L${x(i1).toFixed(1)},${yV(0).toFixed(1)} L${x(i0).toFixed(1)},${yV(0).toFixed(1)} Z`;
  };

  const years = [...new Set(series.map((p) => p.q.slice(0, 4)))].sort();
  const yearIdx = (yr: string) => series.findIndex((p) => p.q === `${yr}Q1`);
  const at = (q: string) => series.findIndex((p) => p.q === q);
  const fmtK = (v: number) => (lang === "fr" ? `${fmtNum(Math.round(v / 1000), lang)} k` : `${fmtNum(Math.round(v / 1000), lang)}k`);

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={t.charts.nationalTitle}>
        {[0, 250000, 500000, 750000, 1000000].map((v) => (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={yV(v)} y2={yV(v)} stroke="rgba(10,15,30,0.08)" />
            <text x={padL - 8} y={yV(v) + 4} textAnchor="end" fontSize="11" fill="rgba(10,15,30,0.55)">
              {fmtK(v)}
            </text>
          </g>
        ))}
        {[0, 15, 30, 45].map((s) => (
          <text key={s} x={W - padR + 8} y={yS(s) + 4} fontSize="11" fill={RED} opacity="0.8">
            {s}%
          </text>
        ))}
        {years.map((yr) => {
          if (yr === "2020") return null; // 2020Q1 and 2021Q1 ticks sit adjacent because of the suspension gap
          const i = yearIdx(yr);
          if (i < 0) return null;
          return (
            <text key={yr} x={x(i)} y={H - 16} textAnchor="middle" fontSize="11" fill="rgba(10,15,30,0.55)">
              {yr}
            </text>
          );
        })}
        {segments.map((seg, si) => (
          <g key={si}>
            <path d={areaPath(seg)} fill="rgba(22,34,74,0.08)" />
            <path d={segPath(seg, (p) => p.vacancies, yV)} fill="none" stroke={NAVY} strokeWidth="2.5" />
            <path
              d={segPath(seg, (p) => p.lt90_share ?? 0, yS)}
              fill="none"
              stroke={RED}
              strokeWidth="2.5"
            />
          </g>
        ))}
        {/* suspension gap shading */}
        {at("2020Q1") >= 0 && at("2020Q4") >= 0 && (
          <g>
            <rect
              x={x(at("2020Q1")) + 10}
              y={padT}
              width={Math.max(x(at("2020Q4")) - x(at("2020Q1")) - 20, 4)}
              height={H - padT - padB}
              fill="rgba(10,15,30,0.06)"
            />
            <text x={padL + 10} y={padT + 18} fontSize="12" fill="rgba(10,15,30,0.65)" className="chart-label">
              {t.charts.gapNote}
            </text>
          </g>
        )}
        {/* 2020Q1 spike annotation */}
        {at("2020Q1") >= 0 && (
          <g>
            <circle cx={x(at("2020Q1"))} cy={yS(series[at("2020Q1")].lt90_share ?? 0)} r="4.5" fill={RED} />
            <text x={x(at("2020Q1"))} y={yS(28.8) - 32} textAnchor="middle" fontSize="12" fill={INK} className="chart-label hidden md:block">
              {t.charts.covidNote}
            </text>
          </g>
        )}
        {/* 2022Q4 peak annotation */}
        {at("2022Q4") >= 0 && (
          <g>
            <circle cx={x(at("2022Q4"))} cy={yV(855965)} r="4.5" fill={NAVY} />
            <line
              x1={x(at("2022Q4"))}
              x2={x(at("2022Q4"))}
              y1={58}
              y2={yV(855965) - 8}
              stroke="rgba(10,15,30,0.35)"
              strokeWidth="1"
            />
            <text x={x(at("2022Q4"))} y={50} textAnchor="middle" fontSize="12" fill={INK} className="chart-label hidden md:block">
              {t.charts.peakNote}
            </text>
          </g>
        )}
      </svg>
      <figcaption className="mt-2 flex flex-wrap items-center gap-5 text-[13px] text-ink/60">
        <span className="flex items-center gap-2">
          <span className="inline-block h-[3px] w-6 rounded" style={{ background: NAVY }} />
          {t.charts.vacanciesAxis}
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-[3px] w-6 rounded" style={{ background: RED }} />
          {t.charts.lt90Axis}
        </span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Wage trend lines: the 4 headline categories                         */
/* ------------------------------------------------------------------ */

const WAGE_LINES = [
  { id: 5, color: RED },
  { id: 9, color: NAVY },
  { id: 11, color: "#b4531f" },
  { id: 8, color: "#98a0b3" },
];

export function WageTrendLines({ categories }: { categories: BroadCategory[] }) {
  const { t, lang } = useLang();
  const cats = WAGE_LINES.map((w) => ({ ...w, cat: categories.find((c) => c.id === w.id)! })).filter((w) => w.cat);
  const quarters = [...new Set(cats.flatMap((w) => w.cat.series.map((s) => s.q)))].sort();
  const W = 920;
  const H = 440;
  const padL = 52;
  const padR = 195;
  const padT = 20;
  const padB = 50;
  const yMin = 14;
  const yMax = 40;
  const x = (q: string) => padL + (quarters.indexOf(q) / (quarters.length - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB);

  const segmentsFor = (cat: BroadCategory): { q: string; wage: number }[][] => {
    const pts = cat.series.map((s) => ({ q: s.q, wage: s.wage }));
    const segs: { q: string; wage: number }[][] = [];
    let cur: { q: string; wage: number }[] = [];
    pts.forEach((p, i) => {
      if (i > 0 && qIndex(p.q) - qIndex(pts[i - 1].q) > 1) {
        segs.push(cur);
        cur = [];
      }
      cur.push(p);
    });
    if (cur.length) segs.push(cur);
    return segs;
  };

  const years = [...new Set(quarters.map((q) => q.slice(0, 4)))].sort();
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={t.home.wageTitle}>
        {[15, 20, 25, 30, 35, 40].map((v) => (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="rgba(10,15,30,0.08)" />
            <text x={padL - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="rgba(10,15,30,0.55)">
              ${v}
            </text>
          </g>
        ))}
        {years.map((yr) => {
          if (yr === "2020") return null; // 2020Q1 and 2021Q1 ticks sit adjacent because of the suspension gap
          const q = quarters.find((qq) => qq === `${yr}Q1`);
          if (!q) return null;
          return (
            <text key={yr} x={x(q)} y={H - 16} textAnchor="middle" fontSize="11" fill="rgba(10,15,30,0.55)">
              {yr}
            </text>
          );
        })}
        <text x={padL} y={H - 2} fontSize="12" fill="rgba(10,15,30,0.55)">
          {lang === "fr" ? "Salaire horaire moyen offert, $ CA" : "Average offered hourly wage, CAD"}
        </text>
        {cats.map((w) =>
          segmentsFor(w.cat).map((seg, si) => (
            <path
              key={`${w.id}-${si}`}
              d={seg.map((p, j) => `${j === 0 ? "M" : "L"}${x(p.q).toFixed(1)},${y(p.wage).toFixed(1)}`).join(" ")}
              fill="none"
              stroke={w.color}
              strokeWidth="2.5"
            />
          ))
        )}
        {cats.map((w) => {
          const last = w.cat.series[w.cat.series.length - 1];
          const name = lang === "fr" ? w.cat.short_fr : w.cat.short_en;
          return (
            <g key={`lbl-${w.id}`}>
              <circle cx={x(last.q)} cy={y(last.wage)} r="4" fill={w.color} />
              <text x={x(last.q) + 9} y={y(last.wage) + 4.5} fontSize="12.5" fontWeight="600" fill={w.color}>
                {name} {lang === "fr" ? `${fmtNum(last.wage, lang, 2)} $` : `$${fmtNum(last.wage, lang, 2)}`}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-[13px] text-ink/60">{t.home.wageSub}</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Health unit bars: longest-open health occupations, 2026Q2           */
/* ------------------------------------------------------------------ */

export function HealthUnitBars({ occupations }: { occupations: UnitOccupation[] }) {
  const { t, lang } = useLang();
  const top = [...occupations]
    .filter((o) => o.broad === 5)
    .sort((a, b) => b.vacancies - a.vacancies)
    .slice(0, 8);
  const W = 920;
  const rowH = 44;
  const padL = 300;
  const padR = 118;
  const padT = 10;
  const H = top.length * rowH + padT + 34;
  const xMax = 75;
  const x = (v: number) => padL + (v / xMax) * (W - padL - padR);
  const shortName = (o: UnitOccupation) => {
    const n = lang === "fr" ? o.label_fr : o.label_en;
    return n.length > 40 ? n.slice(0, 39) + "…" : n;
  };
  return (
    <figure>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[600px]" role="img" aria-label={t.charts.healthTitle}>
          {[0, 15, 30, 45, 60, 75].map((v) => (
            <g key={v}>
              <line x1={x(v)} x2={x(v)} y1={padT} y2={H - 30} stroke="rgba(10,15,30,0.08)" />
              <text x={x(v)} y={H - 10} textAnchor="middle" fontSize="11" fill="rgba(10,15,30,0.55)">
                {v}%
              </text>
            </g>
          ))}
          {top.map((o, i) => {
            const yMid = padT + i * rowH + rowH / 2;
            const v = o.lt90_share ?? 0;
            const quad = o.lt90_share !== null && o.lt90_share >= 22.2 ? (o.wage >= 30.95 ? "supply_problem" : "wage_problem") : "filling";
            return (
              <g key={o.id}>
                <text x={padL - 12} y={yMid - 1} textAnchor="end" fontSize="12.5" fill="rgba(10,15,30,0.85)">
                  {shortName(o)}
                </text>
                <text x={padL - 12} y={yMid + 14} textAnchor="end" fontSize="11" fill="rgba(10,15,30,0.5)">
                  {fmtNum(o.vacancies, lang)} {lang === "fr" ? "vacants" : "vacancies"}
                </text>
                <rect
                  x={padL}
                  y={yMid - 9}
                  width={Math.max(x(v) - padL, 3)}
                  height={18}
                  rx={6}
                  fill={QUADRANT_COLORS[quad]}
                  opacity="0.88"
                />
                <text x={x(v) + 8} y={yMid + 4.5} fontSize="12" fontWeight="700" fill={QUADRANT_COLORS[quad]}>
                  {fmtNum(v, lang, 1)}%
                </text>
                <text x={W - padR + 8} y={yMid + 4.5} fontSize="11.5" fill="rgba(10,15,30,0.6)">
                  {lang === "fr" ? `${fmtNum(o.wage, lang, 2)} $/h` : `$${fmtNum(o.wage, lang, 2)}/h`}
                </text>
              </g>
            );
          })}
          <text x={W - padR + 8} y={padT + 2} fontSize="11" fontWeight="600" fill="rgba(10,15,30,0.5)">
            {lang === "fr" ? "Salaire offert" : "Offered wage"}
          </text>
        </svg>
      </div>
      <figcaption className="mt-2 text-[13px] text-ink/60">
        {lang === "fr"
          ? "Les 8 professions de la santé avec le plus de postes vacants au T2 2026, classées par postes vacants. Barres: part ouverte depuis 90 jours ou plus. Le salaire offert est ce que les employeurs affichent."
          : "The 8 health occupations with the most vacancies in 2026Q2, ranked by vacancies. Bars: share open 90+ days. Offered wage is what employers post."}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Wage gap bars: the wage-problem corner vs the median                */
/* ------------------------------------------------------------------ */

export function WageGapBars() {
  const { t, lang } = useLang();
  const rows = [
    { label: lang === "fr" ? "Métiers et transport" : "Trades and transport", wage: 29.7, note: "105,255" },
    { label: lang === "fr" ? "Fabrication" : "Manufacturing", wage: 26.05, note: "21,215" },
    {
      label: lang === "fr" ? "Serveurs au comptoir, aides de cuisine" : "Food counter attendants, kitchen helpers",
      wage: 17.75,
      note: "34,005",
    },
  ];
  const W = 920;
  const rowH = 56;
  const padL = 300;
  const padR = 90;
  const padT = 12;
  const H = rows.length * rowH + padT + 40;
  const xMax = 36;
  const x = (v: number) => padL + (v / xMax) * (W - padL - padR);
  return (
    <figure>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[560px]" role="img" aria-label={t.charts.wageGapTitle}>
          {[0, 10, 20, 30].map((v) => (
            <g key={v}>
              <line x1={x(v)} x2={x(v)} y1={padT} y2={H - 34} stroke="rgba(10,15,30,0.08)" />
              <text x={x(v)} y={H - 12} textAnchor="middle" fontSize="11" fill="rgba(10,15,30,0.55)">
                ${v}
              </text>
            </g>
          ))}
          <line
            x1={x(MEDIANS.wage)}
            x2={x(MEDIANS.wage)}
            y1={padT}
            y2={H - 34}
            stroke="rgba(10,15,30,0.55)"
            strokeDasharray="6 5"
            strokeWidth="1.5"
          />
          <text x={x(MEDIANS.wage) + 6} y={padT + 12} fontSize="11.5" fontWeight="600" fill="rgba(10,15,30,0.6)">
            {t.charts.medianWage}
          </text>
          {rows.map((r, i) => {
            const yMid = padT + i * rowH + rowH / 2;
            return (
              <g key={r.label}>
                <text x={padL - 12} y={yMid - 1} textAnchor="end" fontSize="13" fill="rgba(10,15,30,0.85)">
                  {r.label}
                </text>
                <text x={padL - 12} y={yMid + 15} textAnchor="end" fontSize="11" fill="rgba(10,15,30,0.5)">
                  {r.note} {lang === "fr" ? "vacants" : "vacancies"}
                </text>
                <rect x={padL} y={yMid - 11} width={Math.max(x(r.wage) - padL, 3)} height={22} rx={7} fill={RED} opacity="0.88" />
                <text x={x(r.wage) + 8} y={yMid + 4.5} fontSize="12.5" fontWeight="700" fill={RED}>
                  {lang === "fr" ? `${fmtNum(r.wage, lang, 2)} $/h` : `$${fmtNum(r.wage, lang, 2)}/h`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-2 text-[13px] text-ink/60">{t.charts.wageGapSub}</figcaption>
    </figure>
  );
}
