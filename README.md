# Vacancy Duration vs Offered Wage

Which unfilled jobs are wage problems vs supply problems? An Open Nshipyard project by Richardson Dackam.

StatCan's Job Vacancy and Wage Survey (JVWS) records, for every occupation, how long vacancies stay open and what hourly wage employers offer. This project puts 10 broad Canadian occupation groups on two axes, vacancy duration (share of posts open 90+ days) and offered wage, and splits them into three quadrants at the medians: 22.2% open 90+ days, $30.95 an hour offered.

The headline split: health care posts sit open longest (45.9% open 90+ days) at above-median pay, a supply problem. Trades and manufacturing cannot fill posts at the wages they offer (below the $30.95 median), a wage problem. Sales and service has the most vacancies (171,750) and fills them.

Suggested domain: vacancies.canada.nshipyard.com

## Data sources

- StatCan table 14-10-0443, Job Vacancy and Wage Survey, quarterly, unadjusted for seasonality (current series, 2015Q1 to 2026Q2). Full table CSV: https://www150.statcan.gc.ca/n1/tbl/csv/14100443-eng.zip
- Table page: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1410044301
- Archived predecessor 14100328 (2015Q1 to 2023Q3, inactive) is fully superseded by the current series and contributes zero observations (see the dedup rule in `scripts/build_data.py` and the methodology page).

## How to rebuild the data

The dataset is already built and committed under `public/data/` and `public/downloads/`. To rebuild from the raw download:

1. Download the full table CSV into `raw/` as `t443.zip` (the zip containing `14100443.csv`), plus `14100443_MetaData.csv` and `cube_metadata_14100443.json` for the occupation and characteristic member names.
2. Run `python3 scripts/build_data.py`. It scans 67,508,672 rows, applies the current-series-wins dedup rule, quarantines 322,588 suppressed or unreliable cells, maps occupations by name with classification codes stripped (NOC 2016 to 2021 change), and writes `public/data/*.json` and `public/downloads/*.csv`.
3. Requires Python 3 with pandas.

Outputs: `public/data/broad.json` (10 categories, quarterly series), `public/data/minor.json` (59 minor groups, 2026Q2), `public/data/unit.json` (393 unit groups, 2026Q2), `public/data/national.json` (national quarterly series), `public/data/anomalies.json` (detected long-term-share spikes), plus CSVs under `public/downloads/`.

## Key numbers (2026Q2, verified against the data files)

- 548,400 vacancies nationally, 25.9% open 90+ days.
- Health: 63,850 vacancies, 45.9% open 90+ days, $34.85/hr offered. Registered nurses: 17,275 vacancies, 45.1% at $36.35/hr. Nurse aides: 13,050 vacancies, 43.0% at $25.90/hr.
- Trades and transport: 105,255 vacancies, 27.7% open 90+ days, $29.70/hr. Manufacturing: 21,215 vacancies, 25.6% at $26.05/hr. Food counter attendants and kitchen helpers: 34,005 vacancies, 28.1% at $17.75/hr.
- Sales and service: 171,750 vacancies, 21.8% open 90+ days, $20.60/hr.
- National peak: 855,965 vacancies in 2022Q4, 39.5% open 90+ days (matches StatCan's published figure). In 2020Q1 the long-term share spiked everywhere as hiring froze. The survey was suspended for 2020Q2 and 2020Q3 was not collected.

Wages are offered hourly wages in CAD: what employers post, not what workers are paid. Stated on every chart and table that shows a wage.

## Develop

- `npm install`
- `npm run dev` (Next.js 16, React 19, Tailwind 4)
- `npm run build`, `npm run lint`

## API and MCP

- `GET /api/v1/national` (optional `quarter=2026Q2`), `GET /api/v1/categories`, `GET /api/v1/category/[id]`, `GET /api/v1/ranking`, `GET /api/v1/lookup?q=nurse`
- `GET /api/openapi.json` (OpenAPI 3.1)
- `POST /mcp` (Streamable HTTP, JSON-RPC 2.0): tools `occupation_lookup`, `duration_wage_ranking`, `trend`

## Screenshots

`docs/screenshots/`: home, explorer, showcase, methodology, data at desktop 1440 and mobile 390.

## Author

Richardson Dackam · https://x.com/richardsondx · https://github.com/richardsondx

Independent project. Not affiliated with Statistics Canada or any government.
