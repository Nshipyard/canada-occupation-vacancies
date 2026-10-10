"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n";

function MapleLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="-1860 -2000 3720 4030" aria-hidden="true" fill="currentColor" className={className}>
      <path d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z"></path>
    </svg>
  );
}

export default function Nav() {
  const { t, lang, setLang } = useLang();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
  const linkCls = (href: string, base: string) =>
    `${base} ${pathname === href ? "text-canada" : "text-ink/70"}`;
  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_2px_16px_rgba(10,15,30,0.08)]" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Open Nshipyard home">
          <MapleLeaf className="h-7 w-7 shrink-0 text-canada" />
          <span className="min-w-0 leading-none">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/55">
              Open Nshipyard
            </span>
            <span className="display mt-1 block truncate text-[15px] font-semibold tracking-tight text-ink">
              {t.siteName}
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={linkCls(l.href, "text-[14.5px] font-medium transition hover:text-canada")}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://canada.nshipyard.com"
            className="whitespace-nowrap text-[14.5px] font-medium text-ink/70 transition hover:text-canada"
          >
            ← {t.nav.allProjects}
          </a>
          <button
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            className="rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold text-ink/70 transition hover:border-canada hover:text-canada"
            aria-label="Toggle language"
          >
            {t.nav.langLabel}
          </button>
        </nav>
        <div className="flex shrink-0 items-center gap-3 md:hidden">
          <button
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            className="rounded-full border border-line px-3 py-1.5 text-[13px] font-semibold text-ink/70"
            aria-label="Toggle language"
          >
            {t.nav.langLabel}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full border border-line px-4 py-1.5 text-[13px] font-semibold text-ink/70"
            aria-expanded={menuOpen}
            aria-label={t.nav.menu}
          >
            {t.nav.menu}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="border-t border-line px-6 py-3 md:hidden" aria-label="Primary">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={linkCls(l.href, "whitespace-nowrap py-1.5 text-[14px] font-medium")}
              >
                {l.label}
              </Link>
            ))}
            <a
              href="https://canada.nshipyard.com"
              className="whitespace-nowrap py-1.5 text-[14px] font-medium text-ink/70"
            >
              ← {t.nav.allProjects}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
