"use client";

import dynamic from "next/dynamic";
import { useLang } from "@/i18n";
import { META } from "@/data";

const McpConnect = dynamic(() => import("@/components/McpConnect"), { ssr: false });

export default function DataPage() {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-14 md:pt-20">
      <h1 className="display text-[clamp(34px,4.6vw,54px)]">{t.dataPage.title}</h1>
      <p className="mt-4 max-w-[680px] text-[16px] text-ink/65">{t.dataPage.lede}</p>

      <h2 className="display mt-12 text-[28px]">{t.dataPage.downloads}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {t.dataPage.files.map((d) => (
          <a
            key={d.href}
            href={d.href}
            download={d.kind === "CSV"}
            className="group rounded-[24px] border border-line bg-paper p-6 transition hover:border-canada"
          >
            <p className="font-mono text-[13px] text-ink/50">{d.kind}</p>
            <p className="mt-2 text-[16px] font-semibold group-hover:text-canada">{d.label}</p>
            <p className="mt-1 font-mono text-[12px] text-ink/45">{d.rows}</p>
            <p className="mt-3 text-[14px] font-medium text-canada">↓</p>
          </a>
        ))}
      </div>

      <h2 className="display mt-12 text-[28px]">{t.dataPage.apiTitle}</h2>
      <p className="mt-3 max-w-[680px] text-[15px] text-ink/65">{t.dataPage.apiBody}</p>
      <div className="mt-6 overflow-x-auto rounded-[24px] border border-line">
        <table className="w-full min-w-[640px] text-left text-[14px]">
          <tbody>
            {t.dataPage.endpoints.map((e) => (
              <tr key={e.p} className="border-b border-line/60 last:border-0">
                <td className="px-5 py-4">
                  <span className="rounded-full bg-ink px-3 py-1 font-mono text-[12px] font-semibold text-white">{e.m}</span>
                </td>
                <td className="px-5 py-4 font-mono text-[13px] text-canada">{e.p}</td>
                <td className="px-5 py-4 text-ink/70">{e.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 font-mono text-[12px] text-ink/45">
        {META.source} · {META.series} · {META.built}
      </p>

      <div className="mt-10">
        <McpConnect />
      </div>
    </div>
  );
}
