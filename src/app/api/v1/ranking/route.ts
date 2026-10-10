import { NextResponse } from "next/server";
import { MINOR_RANKED, META, LATEST_Q, broadShort, verdictFor } from "@/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const quarter = searchParams.get("quarter") ?? LATEST_Q;
  if (quarter !== LATEST_Q) {
    return NextResponse.json(
      { error: `minor-group detail is published for ${LATEST_Q} only` },
      { status: 400 }
    );
  }
  const ranking = MINOR_RANKED.map((g, i) => ({
    rank: i + 1,
    id: g.id,
    broad: g.broad,
    broad_en: broadShort(g.broad, "en"),
    broad_fr: broadShort(g.broad, "fr"),
    code: g.code,
    label_en: g.label_en,
    label_fr: g.label_fr,
    vacancies: g.vacancies,
    lt90_share: g.lt90_share,
    wage: g.wage,
    verdict: verdictFor(g.lt90_share, g.wage),
  }));
  return NextResponse.json({ meta: META, quarter, data: ranking });
}
