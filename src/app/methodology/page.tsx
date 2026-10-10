"use client";

import Link from "next/link";
import { useLang } from "@/i18n";
import { META } from "@/data";

export default function MethodologyPage() {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-14 md:pt-20">
      <h1 className="display text-[clamp(34px,4.6vw,54px)]">{t.methodology.title}</h1>
      <p className="mt-4 max-w-[680px] text-[16px] text-ink/65">{t.methodology.lede}</p>

      <h2 className="display mt-12 text-[28px]">{t.methodology.rulesTitle}</h2>
      <div className="mt-6 flex flex-col gap-5">
        {t.methodology.rules.map((r, i) => (
          <div key={i} className="rounded-[24px] border border-line bg-paper p-6 md:p-8">
            <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-canada">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="display mt-2 text-[22px]">{r.t}</h3>
            <p className="mt-3 max-w-[760px] text-[15px] leading-relaxed text-ink/70">{r.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-[24px] border border-line bg-paper-warm p-6 md:p-8">
        <p className="font-mono text-[12.5px] leading-relaxed text-ink/60">
          {META.source} · {META.series} · {META.geography} · {META.rows_scanned.toLocaleString()} {t.methodology.metaLine}
        </p>
        <p className="mt-2 font-mono text-[12.5px] leading-relaxed text-ink/60">{META.dedup_rule}</p>
      </div>

      <h2 className="display mt-12 text-[28px]">{t.methodology.limitsTitle}</h2>
      <ul className="mt-6 flex flex-col gap-4">
        {t.methodology.limits.map((l, i) => (
          <li key={i} className="flex gap-3.5 rounded-[20px] border border-line bg-paper p-5">
            <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-canada" />
            <span className="text-[15px] leading-relaxed text-ink/75">{l}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10 rounded-[24px] bg-ink p-6 text-white md:p-8">
        <h2 className="display text-[24px]">{t.methodology.fixTitle}</h2>
        <p className="mt-3 max-w-[700px] text-[15px] leading-relaxed text-white/75">{t.methodology.fixBody}</p>
        <Link href="/data" className="mt-5 inline-block rounded-full bg-canada px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-canada-dark">
          {t.home.dataTeaser} →
        </Link>
      </div>
    </div>
  );
}
