import { NextResponse } from "next/server";
import { CATEGORIES, META } from "@/data";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cat = CATEGORIES.find((c) => c.id === parseInt(id, 10));
  if (!cat) return NextResponse.json({ error: `unknown category ${id}` }, { status: 404 });
  return NextResponse.json({ meta: META, data: cat });
}
