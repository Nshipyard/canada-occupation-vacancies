"use client";

import { useLang } from "@/i18n";
import { CATEGORIES, NATIONAL, UNIT_OCCUPATIONS } from "@/data";
import { NationalTrend, DurationRankingBars, HealthUnitBars, WageGapBars } from "@/components/charts";
import CiteButton from "@/components/CiteButton";

export default function ShowcasePage() {
  const { t } = useLang();
  const charts = [
    <HealthUnitBars key="hu" occupations={UNIT_OCCUPATIONS} />,
    <WageGapBars key="wg" />,
    <NationalTrend key="nt" series={NATIONAL} />,
    <DurationRankingBars key="dr" categories={CATEGORIES} />,
  ];
  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-14 md:pt-20">
      <h1 className="display text-[clamp(34px,4.6vw,54px)]">{t.showcase.title}</h1>
      <p className="mt-4 max-w-[680px] text-[16px] text-ink/65">{t.showcase.lede}</p>
      <div className="mt-10 flex flex-col gap-8">
        {t.showcase.findings.map((f, i) => (
          <article key={i} className="rounded-[32px] border border-line bg-paper p-6 md:p-10">
            <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-canada">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h2 className="display mt-3 max-w-[800px] text-[clamp(24px,3vw,36px)]">{f.q}</h2>
            <p className="mt-4 max-w-[760px] text-[16px] leading-relaxed text-ink/75">{f.a}</p>
            <div className="mt-6">{charts[i]}</div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <CiteButton text={f.cite} />
              <p className="max-w-[560px] font-mono text-[12px] leading-relaxed text-ink/50">{f.cite}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
