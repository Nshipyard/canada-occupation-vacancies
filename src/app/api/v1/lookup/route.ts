import { NextResponse } from "next/server";
import { searchUnits, META, LATEST_Q, broadShort, verdictFor } from "@/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json({ error: "q must be at least 2 characters" }, { status: 400 });
  }
  const matches = searchUnits(q, 25).map((o) => ({
    id: o.id,
    broad: o.broad,
    broad_en: broadShort(o.broad, "en"),
    broad_fr: broadShort(o.broad, "fr"),
    code: o.code,
    label_en: o.label_en,
    label_fr: o.label_fr,
    vacancies: o.vacancies,
    lt90_share: o.lt90_share,
    wage: o.wage,
    verdict: verdictFor(o.lt90_share, o.wage),
  }));
  return NextResponse.json({ meta: META, quarter: LATEST_Q, query: q, count: matches.length, data: matches });
}
