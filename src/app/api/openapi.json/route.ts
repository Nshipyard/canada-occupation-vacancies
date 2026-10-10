import { NextResponse } from "next/server";

const spec = {
  openapi: "3.1.0",
  info: {
    title: "Vacancy Duration vs Offered Wage API",
    version: "1.0.0",
    description:
      "Canadian job vacancies by occupation on two axes: vacancy duration (share open 90+ days) and offered hourly wage in CAD. Source: StatCan table 14-10-0443, Job Vacancy and Wage Survey, 2015Q1 to 2026Q2. Wages are what employers post, not what workers are paid.",
  },
  paths: {
    "/api/v1/national": {
      get: {
        summary: "National quarterly series: vacancies and long-term share",
        parameters: [
          {
            name: "quarter",
            in: "query",
            required: false,
            schema: { type: "string", example: "2026Q2" },
          },
        ],
        responses: { "200": { description: "National series or single quarter" } },
      },
    },
    "/api/v1/categories": {
      get: {
        summary: "The 10 broad occupation categories with latest values and quadrants",
        responses: { "200": { description: "Categories with 2026Q2 values and quadrant verdicts" } },
      },
    },
    "/api/v1/category/{id}": {
      get: {
        summary: "Full quarterly series for one broad category",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 5 },
            description: "Broad category id (2-11); 5 is health occupations",
          },
        ],
        responses: { "200": { description: "Category with 44-quarter series" } },
      },
    },
    "/api/v1/ranking": {
      get: {
        summary: "59 minor groups ranked by long-term vacancy share",
        parameters: [
          {
            name: "quarter",
            in: "query",
            required: false,
            schema: { type: "string", example: "2026Q2" },
            description: "Only 2026Q2 is published for minor groups",
          },
        ],
        responses: { "200": { description: "Ranked minor groups with verdicts" } },
      },
    },
    "/api/v1/lookup": {
      get: {
        summary: "Search 393 unit-group occupations by name or NOC code",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string", example: "nurse" },
          },
        ],
        responses: { "200": { description: "Matching occupations with verdicts" } },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec);
}
