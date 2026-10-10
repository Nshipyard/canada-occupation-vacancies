import { NextResponse } from "next/server";
import { CATEGORIES, META, MEDIANS, LATEST_Q } from "@/data";

export async function GET() {
  const data = CATEGORIES.map((c) => ({
    id: c.id,
    code: c.code,
    label_en: c.label_en,
    label_fr: c.label_fr,
    short_en: c.short_en,
    short_fr: c.short_fr,
    latest: c.latest,
    quadrant: c.quadrant,
  }));
  return NextResponse.json({ meta: META, medians: MEDIANS, latest_quarter: LATEST_Q, data });
}
