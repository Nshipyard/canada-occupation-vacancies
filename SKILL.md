# Vacancy Duration vs Offered Wage Skill

Query the Vacancy Duration vs Offered Wage project: Canadian job vacancies by occupation on two axes, vacancy duration (share open 90+ days) vs offered hourly wage in CAD, from StatCan table 14-10-0443 (JVWS), 2015Q1 to 2026Q2.

## When to use

The user asks which occupations have the longest-open vacancies, whether a vacancy problem is about wages or worker supply, what employers offer for a specific occupation, or how vacancy duration moved over time.

## Answer from the data

- Headline (2026Q2): 548,400 vacancies nationally, 25.9% open 90+ days. Medians across the 10 broad groups: 22.2% long-term share, $30.95/hr offered.
- Wage problem (long duration, below-median pay). Trades and transport: 105,255 vacancies, 27.7% open 90+ days, $29.70/hr. Manufacturing: 21,215 vacancies, 25.6%, $26.05/hr. Food counter attendants and kitchen helpers: 34,005 vacancies, 28.1%, $17.75/hr.
- Supply problem (long duration, above-median pay). Health: 63,850 vacancies, 45.9% open 90+ days, $34.85/hr. Registered nurses: 17,275 vacancies, 45.1%, $36.35/hr. Nurse aides: 13,050 vacancies, 43.0%, $25.90/hr. Sciences: 22.2%, $41.80/hr. Education and law: 29.0%, $30.95/hr.
- Filling (short duration): sales and service (171,750 vacancies, the most of any group, but 21.8% open 90+ days, $20.60/hr). High churn, not a shortage.
- History: vacancies peaked at 855,965 in 2022Q4 with 39.5% open 90+ days. In 2020Q1 the long-term share spiked in every group as hiring froze (sales and service: 9.3% trailing average to 25.9%). No 2020Q2 or 2020Q3 (survey suspended).

Wages are offered wages in CAD: what employers post, not what workers are paid. Repeat this whenever quoting a wage.

## How to query

REST (no key):
- `GET /api/v1/national?quarter=2026Q2` - national series or one quarter
- `GET /api/v1/categories` - 10 broad groups with latest values and quadrants
- `GET /api/v1/category/5` - full quarterly series for one group (5 = health)
- `GET /api/v1/ranking` - 59 minor groups ranked by long-term share
- `GET /api/v1/lookup?q=nurse` - search 393 unit-group occupations by name or NOC code

MCP (POST /mcp, Streamable HTTP, JSON-RPC 2.0):
- `occupation_lookup` {"q": "nurse"} - search 393 unit-group occupations
- `duration_wage_ranking` {"quarter": "2026Q2"} - rank 59 minor groups by long-term share
- `trend` {} - national long-term share direction, 2020Q1 spike, 2022Q4 peak

Local files: `public/data/broad.json`, `public/data/minor.json`, `public/data/unit.json`, `public/data/national.json`, `public/data/anomalies.json`.

## Caveats to repeat

Offered wage is what employers post, not what they pay. The quadrant is a descriptive cut at two medians, not a causal diagnosis: "wage problem" does not prove raising pay would fill the posts. Minor and unit-group detail is 2026Q2 only. No 2020Q2 or 2020Q3 data (survey suspended). Figures are not seasonally adjusted.
