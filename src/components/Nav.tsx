"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n";

export default function Nav() {
  const { t, lang, setLang } = useLang();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    { href: "/explorer", label: t.nav.explorer },
    { href: "/showcase", label: t.nav.showcase },
    { href: "/methodology", label: t.nav.methodology },
    { href: "/data", label: t.nav.data },
  ];
  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_2px_16px_rgba(10,15,30,0.08)]" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-6">
        <Link href="/" className="display text-[19px] font-semibold tracking-tight">
          <span className="text-canada">●</span> {t.siteName}
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[14.5px] font-medium transition hover:text-canada ${
                pathname === l.href ? "text-canada" : "text-ink/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            className="rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold text-ink/70 transition hover:border-canada hover:text-canada"
            aria-label="Toggle language"
          >
            {t.nav.langLabel}
          </button>
        </nav>
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            className="rounded-full border border-line px-3 py-1.5 text-[13px] font-semibold text-ink/70"
            aria-label="Toggle language"
          >
            {t.nav.langLabel}
          </button>
        </div>
      </div>
      <nav className="flex gap-6 overflow-x-auto border-t border-line px-6 py-2.5 md:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap text-[14px] font-medium ${
              pathname === l.href ? "text-canada" : "text-ink/70"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
