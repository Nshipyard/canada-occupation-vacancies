import broadData from "../public/data/broad.json";
import minorData from "../public/data/minor.json";
import unitData from "../public/data/unit.json";
import nationalData from "../public/data/national.json";
import anomaliesData from "../public/data/anomalies.json";

export type Quadrant = "wage_problem" | "supply_problem" | "filling";

export interface DurationBands {
  lt15: number;
  d15_29: number;
  d30_59: number;
  d60_89: number;
  d90p: number;
}

export interface QuarterPoint {
  q: string;
  vacancies: number;
  lt90_share: number | null;
  wage: number;
  bands: DurationBands;
  constantly_recruiting: number;
  constantly_recruiting_share: number | null;
}

export interface BroadCategory {
  id: number;
  label_en: string;
  label_fr: string;
  short_en: string;
  short_fr: string;
  code: string;
  series: QuarterPoint[];
  latest: QuarterPoint & { quadrant: Quadrant };
  quadrant: Quadrant;
}

export interface MinorGroup {
  id: number;
  broad: number;
  code: string;
  label_en: string;
  label_fr: string;
  vacancies: number;
  lt90_share: number | null;
  wage: number;
}

export interface UnitOccupation {
  id: number;
  broad: number;
  code: string;
  label_en: string;
  label_fr: string;
  vacancies: number;
  lt90_share: number | null;
  wage: number;
}

export interface NationalPoint {
  q: string;
  vacancies: number;
  lt90_share: number | null;
  wage: number;
}

export interface Anomaly {
  broad: string;
  broad_fr: string;
  quarter: string;
  lt90_share: number;
  trailing_mean: number;
  z: number;
}

export const META = broadData.meta as {
  built: string;
  source: string;
  series: string;
  latest_quarter: string;
  geography: string;
  quarantine: {
    suppressed_or_unreliable: number;
    negative_vacancies: number;
    wage_out_of_range: number;
    unknown_noc_name: number;
  };
  rows_scanned: number;
  dedup_rule: string;
};

/** Medians are the upper-middle value of the 10 broad categories in 2026Q2. */
export const MEDIANS = broadData.medians as { lt90_share: number; wage: number };

export const LATEST_Q: string = broadData.meta.latest_quarter;

export const CATEGORIES = broadData.categories as BroadCategory[];

export const MINOR_GROUPS = minorData.groups as MinorGroup[];

export const UNIT_OCCUPATIONS = unitData.occupations as UnitOccupation[];

export const NATIONAL = nationalData.series as NationalPoint[];

export const ANOMALIES = anomaliesData.anomalies as Anomaly[];

export const QUADRANT_COLORS: Record<Quadrant, string> = {
  wage_problem: "#d80621",
  supply_problem: "#16224a",
  filling: "#98a0b3",
};

export function verdictFor(lt90_share: number | null, wage: number): Quadrant {
  if (lt90_share !== null && lt90_share >= MEDIANS.lt90_share) {
    return wage >= MEDIANS.wage ? "supply_problem" : "wage_problem";
  }
  return "filling";
}

export function categoryById(id: number): BroadCategory | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function broadShort(id: number, lang: "en" | "fr"): string {
  const c = categoryById(id);
  if (!c) return "";
  return lang === "fr" ? c.short_fr : c.short_en;
}

/** 59 minor groups ranked by long-term share, descending (latest quarter). */
export const MINOR_RANKED = [...MINOR_GROUPS].sort(
  (a, b) => (b.lt90_share ?? -1) - (a.lt90_share ?? -1)
);

/** 10 broad categories ranked by long-term share, descending (latest quarter). */
export const BROAD_RANKED = [...CATEGORIES].sort(
  (a, b) => (b.latest.lt90_share ?? -1) - (a.latest.lt90_share ?? -1)
);

export function searchUnits(query: string, limit = 25): UnitOccupation[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const scored = UNIT_OCCUPATIONS.map((o) => {
    const en = o.label_en.toLowerCase();
    const fr = o.label_fr.toLowerCase();
    const code = o.code.toLowerCase();
    let score = -1;
    if (code === q) score = 100;
    else if (code.startsWith(q)) score = 90;
    else if (en.startsWith(q) || fr.startsWith(q)) score = 80;
    else if (en.includes(q) || fr.includes(q)) score = 50;
    return { o, score };
  }).filter((s) => s.score > 0);
  scored.sort((a, b) => b.score - a.score || b.o.vacancies - a.o.vacancies);
  return scored.slice(0, limit).map((s) => s.o);
}
