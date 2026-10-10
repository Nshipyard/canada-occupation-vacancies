import { NextResponse } from "next/server";
import {
  NATIONAL,
  MINOR_RANKED,
  UNIT_OCCUPATIONS,
  CATEGORIES,
  MEDIANS,
  LATEST_Q,
  broadShort,
  searchUnits,
  verdictFor,
} from "@/data";

const TOOLS = [
  {
    name: "occupation_lookup",
    description:
      "Search 393 Canadian unit-group occupations by name (English or French) or NOC code. Returns vacancies, long-term vacancy share (percent open 90+ days), offered hourly wage in CAD, and the duration-vs-wage verdict for 2026Q2.",
    inputSchema: {
      type: "object",
      properties: {
        q: { type: "string", description: "Search text, e.g. nurse, soudeur, 31301" },
      },
      required: ["q"],
    },
  },
  {
    name: "duration_wage_ranking",
    description:
      "Rank the 59 minor occupation groups by long-term vacancy share for a quarter. Each row carries vacancies, offered wage, and the verdict: wage_problem, supply_problem, or filling. Detail is published for the latest quarter only.",
    inputSchema: {
      type: "object",
      properties: {
        quarter: { type: "string", description: "e.g. 2026Q2. Defaults to the latest quarter." },
      },
    },
  },
  {
    name: "trend",
    description:
      "Direction of the national long-term vacancy share: latest value, the 2020Q1 COVID spike, the 2022Q4 peak, and the change from the 2022 peak to the latest quarter.",
    inputSchema: { type: "object", properties: {} },
  },
];

function callTool(name: string, args: Record<string, unknown>) {
  if (name === "occupation_lookup") {
    const q = String(args.q ?? "").trim();
    if (q.length < 2) throw new Error("q must be at least 2 characters");
    return {
      quarter: LATEST_Q,
      results: searchUnits(q, 25).map((o) => ({
        code: o.code,
        label_en: o.label_en,
        label_fr: o.label_fr,
        broad_en: broadShort(o.broad, "en"),
        broad_fr: broadShort(o.broad, "fr"),
        vacancies: o.vacancies,
        lt90_share: o.lt90_share,
        wage: o.wage,
        verdict: verdictFor(o.lt90_share, o.wage),
      })),
    };
  }
  if (name === "duration_wage_ranking") {
    const quarter = String(args.quarter ?? LATEST_Q);
    if (quarter !== LATEST_Q) throw new Error(`minor-group detail is published for ${LATEST_Q} only`);
    return {
      quarter,
      medians: MEDIANS,
      ranking: MINOR_RANKED.map((g, i) => ({
        rank: i + 1,
        code: g.code,
        label_en: g.label_en,
        label_fr: g.label_fr,
        vacancies: g.vacancies,
        lt90_share: g.lt90_share,
        wage: g.wage,
        verdict: verdictFor(g.lt90_share, g.wage),
      })),
    };
  }
  if (name === "trend") {
    const latest = NATIONAL[NATIONAL.length - 1];
    const q = (qq: string) => NATIONAL.find((r) => r.q === qq);
    const peak = q("2022Q4");
    const spike = q("2020Q1");
    const cat = (id: number) => CATEGORIES.find((c) => c.id === id);
    return {
      latest_quarter: latest.q,
      latest_vacancies: latest.vacancies,
      latest_lt90_share: latest.lt90_share,
      spike_2020Q1_lt90_share: spike?.lt90_share,
      peak_2022Q4_vacancies: peak?.vacancies,
      peak_2022Q4_lt90_share: peak?.lt90_share,
      change_lt90_pp_peak_to_latest:
        peak && peak.lt90_share !== null && latest.lt90_share !== null
          ? +(latest.lt90_share - peak.lt90_share).toFixed(1)
          : null,
      broad_2026Q2: CATEGORIES.map((c) => ({
        short_en: c.short_en,
        short_fr: c.short_fr,
        vacancies: c.latest.vacancies,
        lt90_share: c.latest.lt90_share,
        wage: c.latest.wage,
        quadrant: c.quadrant,
      })),
      health: cat(5)?.latest,
      unit_occupations: UNIT_OCCUPATIONS.length,
    };
  }
  throw new Error(`unknown tool ${name}`);
}

export async function POST(req: Request) {
  let body: { jsonrpc?: string; id?: unknown; method?: string; params?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "parse error" } },
      { status: 400 }
    );
  }
  const { id = null, method, params = {} } = body;
  const ok = (result: unknown) => NextResponse.json({ jsonrpc: "2.0", id, result });
  const err = (code: number, message: string) => NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } });
  try {
    if (method === "initialize") {
      return ok({
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "vacancy-duration-wage", version: "1.0.0" },
      });
    }
    if (method === "notifications/initialized" || method === "ping") return ok({});
    if (method === "tools/list") return ok({ tools: TOOLS });
    if (method === "tools/call") {
      const p = (params ?? {}) as { name?: string; arguments?: Record<string, unknown> };
      const result = callTool(p.name ?? "", p.arguments ?? {});
      return ok({ content: [{ type: "text", text: JSON.stringify(result) }] });
    }
    return err(-32601, `method not found: ${method}`);
  } catch (e) {
    return err(-32603, e instanceof Error ? e.message : "internal error");
  }
}

export async function GET() {
  return NextResponse.json({ error: "use POST with JSON-RPC 2.0 (Streamable HTTP)" }, { status: 405 });
}
