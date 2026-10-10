"use client";

import { useLang } from "@/i18n";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-line bg-paper-warm">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="rounded-[24px] border border-line bg-paper p-6 md:p-8">
          <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-ink/45">
            {t.footer.honestyKicker}
          </p>
          <p className="mt-2 max-w-[720px] text-[14.5px] leading-relaxed text-ink/70">{t.footer.honesty}</p>
          <p className="mt-4 text-[13.5px] text-ink/55">{t.footer.sources}</p>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[14px] text-ink/60">
            {t.footer.author} ·{" "}
            <a href="https://x.com/richardsondx" target="_blank" rel="noreferrer" className="text-canada hover:text-canada-dark">
              X
            </a>{" "}
            ·{" "}
            <a
              href="https://github.com/richardsondx"
              target="_blank"
              rel="noreferrer"
              className="text-canada hover:text-canada-dark"
            >
              GitHub
            </a>
          </p>
          <p className="text-[13px] text-ink/45">{t.nav.back}</p>
        </div>
      </div>
    </footer>
  );
}
