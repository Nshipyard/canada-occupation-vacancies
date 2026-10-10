"use client";

import { useState } from "react";
import { useLang } from "@/i18n";

export default function CiteButton({ text }: { text: string }) {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  };
  return (
    <button
      onClick={copy}
      className={`rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition ${
        done ? "bg-green-700 text-white" : "bg-ink text-white hover:bg-canada"
      }`}
    >
      {done ? t.showcase.copied : t.showcase.cite}
    </button>
  );
}
