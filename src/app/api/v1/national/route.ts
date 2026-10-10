import { NextResponse } from "next/server";
import { NATIONAL, META } from "@/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const quarter = searchParams.get("quarter");
  if (quarter) {
    const row = NATIONAL.find((r) => r.q === quarter);
    if (!row) return NextResponse.json({ error: `unknown quarter ${quarter}` }, { status: 404 });
    return NextResponse.json({ meta: META, data: row });
  }
  return NextResponse.json({ meta: META, data: NATIONAL });
}
