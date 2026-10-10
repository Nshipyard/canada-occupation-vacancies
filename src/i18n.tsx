"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "fr";

const en = {
  siteName: "Vacancy Duration vs Offered Wage",
  nav: {
    explorer: "Explorer",
    showcase: "Showcase",
    methodology: "Methodology",
    data: "Data",
    back: "Open Nshipyard",
    allProjects: "All projects",
    menu: "Menu",
    langLabel: "FR",
  },
  home: {
    kicker: "An Open Nshipyard project",
    title: "Vacancy Duration vs Offered Wage",
    lede:
      "Some job vacancies sit open for months. Others fill in weeks. The Job Vacancy and Wage Survey records how long each post stays open and what wage the employer offers. The question: which unfilled jobs are wage problems vs supply problems?",
    explore: "Explore the data",
    method: "Read the methodology",
    chartTitle: "Duration vs wage: where each occupation group lands",
    chartSub:
      "Each bubble is a broad occupation group in 2026Q2, sized by vacancies. The dashed lines are the medians: 22.2% of vacancies open 90+ days, $30.95 an hour offered. Wages are what employers post, not what workers are paid.",
    wageTitle: "Offered wages by headline group, 2015 to 2026",
    wageSub:
      "Average hourly wage employers offered for vacant posts, in Canadian dollars. Health and sciences pull away after 2020. Sales and service stays near the bottom. Offered wage is what employers post, not what workers are paid.",
    stats: [
      { value: "548,400", label: "job vacancies in Canada in 2026Q2" },
      { value: "45.9%", label: "of health vacancies open 90+ days, the longest of any group" },
      { value: "$17.75", label: "offered per hour to food counter attendants, vs $36.35 to registered nurses (offered wages, what employers post)" },
      { value: "10", label: "broad occupation groups tracked from 2015 to 2026" },
    ],
    whatTitle: "What this project does",
    whatBody:
      "StatCan's Job Vacancy and Wage Survey publishes vacancy counts, how long posts stay open, and the wage employers offer. This project turns 67.5 million raw table cells into one ranked dataset: every broad occupation group on two axes, duration and wage, so wage problems separate from supply problems. Everything is downloadable and citable.",
    longestKicker: "Longest-open group · 2026Q2",
    longestTitle: "Health: 45.9% open 90+ days",
    longestBody:
      "63,850 vacancies at $34.85 an hour offered. Pay beats the $30.95 median and the posts still sit open longest: a supply problem.",
    showcaseTeaser: "Four findings, each quotable",
    dataTeaser: "Download the dataset",
  },
  explorer: {
    title: "Explorer",
    lede: "Filter 59 minor occupation groups by category, duration band, and wage band. Search 393 unit-group occupations by name.",
    category: "Broad category",
    allCategories: "All categories",
    duration: "Long-term share band",
    allDurations: "All durations",
    durationBands: ["Under 15%", "15% to 25%", "25% to 35%", "35% and over"],
    wage: "Offered wage band",
    allWages: "All wages",
    wageBands: ["Under $20", "$20 to $30", "$30 to $40", "$40 and over"],
    colOccupation: "Occupation",
    colBroad: "Broad group",
    colVacancies: "Vacancies",
    colLt90: "Open 90+ days",
    colWage: "Offered wage",
    colVerdict: "Verdict",
    results: "groups match",
    of: "of",
    searchTitle: "Look up an occupation",
    searchHint: "Searches 393 unit-group occupations by English or French name or NOC code.",
    searchPlaceholder: "e.g. nurse, electrician, soudeur",
    noResults: "No occupations match that search.",
    unitNote:
      "Long-term share is the percent of vacancies open 90+ days. Wages are offered hourly wages in CAD: what employers post, not what workers are paid.",
  },
  showcase: {
    title: "Showcase",
    lede: "Four findings from the duration vs wage dataset. Each one carries its numbers, its chart, and a citation you can copy.",
    cite: "Cite this",
    copied: "Copied",
    findings: [
      {
        q: "Health care vacancies sit open the longest",
        a: "Health occupations had 63,850 vacancies in 2026Q2 and 45.9% had been open 90 days or more, the highest long-term share of any broad group. The offered wage was $34.85 an hour, above the $30.95 median, so pay is not the binding constraint. Registered nurses: 17,275 vacancies, 45.1% open 90+ days at $36.35 an hour. Nurse aides: 13,050 vacancies, 43.0% open 90+ days at $25.90 an hour. Verdict: a supply problem. Pay beats the median and posts still do not fill.",
        cite:
          "Richardson Dackam, Vacancy Duration vs Offered Wage (Open Nshipyard), StatCan table 14-10-0443 (JVWS), 2026Q2. vacancies.canada.nshipyard.com.",
      },
      {
        q: "Trades and manufacturing cannot fill posts at the wages they offer",
        a: "Trades, transport and equipment operators had 105,255 vacancies in 2026Q2 with 27.7% open 90+ days, but the offered wage was $29.70 an hour, below the $30.95 median. Manufacturing: 21,215 vacancies, 25.6% open 90+ days, $26.05 an hour offered. Food counter attendants and kitchen helpers: 34,005 vacancies, 28.1% open 90+ days, $17.75 an hour offered. Verdict: a wage problem. Posts sit open because the offered pay trails the market median.",
        cite:
          "Richardson Dackam, Vacancy Duration vs Offered Wage (Open Nshipyard), StatCan table 14-10-0443 (JVWS), 2026Q2. vacancies.canada.nshipyard.com.",
      },
      {
        q: "The 2022 peak and the COVID freeze",
        a: "National vacancies reached 855,965 in 2022Q4 with 39.5% open 90+ days, matching StatCan's published figure. In 2020Q1 the long-term share spiked in every broad category as hiring froze: sales and service jumped from a 9.3% trailing average to 25.9% in a single quarter. StatCan suspended the survey for 2020Q2, and 2020Q3 was not collected either, leaving a two-quarter gap in the series. By 2026Q2 the market had cooled to 548,400 vacancies with 25.9% open 90+ days.",
        cite:
          "Richardson Dackam, Vacancy Duration vs Offered Wage (Open Nshipyard), StatCan table 14-10-0443 (JVWS), national series 2015Q1 to 2026Q2. vacancies.canada.nshipyard.com.",
      },
      {
        q: "Sales and service has the most vacancies and fills them",
        a: "Sales and service occupations had 171,750 vacancies in 2026Q2, the largest of any broad group, but only 21.8% had been open 90+ days, below the 22.2% median. The offered wage was $20.60 an hour. This is high churn, not a shortage: posts turn over fast enough that few go stale.",
        cite:
          "Richardson Dackam, Vacancy Duration vs Offered Wage (Open Nshipyard), StatCan table 14-10-0443 (JVWS), 2026Q2. vacancies.canada.nshipyard.com.",
      },
    ],
  },
  methodology: {
    title: "Methodology",
    lede: "Every rule that turns 67.5 million raw cells into one ranked dataset.",
    rulesTitle: "The build rules",
    rules: [
      {
        t: "Current series wins",
        d: "Table 14100443 is the current Job Vacancy and Wage Survey series. Its archived predecessor 14100328, covering 2015Q1 to 2023Q3, is fully superseded. Archived rows contribute zero observations, so no quarter is counted twice.",
      },
      {
        t: "Suppressed cells quarantined",
        d: "322,588 cells were excluded before any aggregation: cells StatCan suppressed (x) or flagged too unreliable (F), non-numeric values, negative vacancy counts, and wages at or below zero or above $500 an hour. The quarantine counts ship in every data file.",
      },
      {
        t: "Name-based NOC mapping",
        d: "Occupation names strip the trailing classification code before matching, so an occupation keeps one series across the NOC 2016 to NOC 2021 change. Matching by raw name would have split occupations into two series at the code change.",
      },
      {
        t: "Wages are offered, in CAD",
        d: "The survey asks employers what hourly wage they offer for the vacant post. It is not what workers end up being paid. Every chart and table that shows a wage states this.",
      },
      {
        t: "The quadrant rule",
        d: "Each broad group lands in a quadrant by comparing its 2026Q2 values to the medians: 22.2% of vacancies open 90+ days and $30.95 an hour offered (the upper-middle value of the 10 groups). Above the duration median and at or above the wage median: supply problem. Above the duration median and below the wage median: wage problem. Below the duration median: filling.",
      },
      {
        t: "The 2020 suspension",
        d: "StatCan suspended JVWS collection in 2020Q2 during the first COVID wave, and 2020Q3 was not collected either. Every quarterly series in this project has a two-quarter gap, drawn as a break, not a zero.",
      },
      {
        t: "Unadjusted for seasonality",
        d: "JVWS quarterly figures are not seasonally adjusted. Compare year over year, not quarter over quarter.",
      },
    ],
    limitsTitle: "Honest limits",    limits: [
      "Nine of the ten broad groups start in 2015Q1. Senior management starts in 2015Q2 because StatCan published no 2015Q1 breakdown for it.",
      "The 322,588 quarantined cells thin out small occupations. Minor and unit-group figures are published for 2026Q2 only, where coverage is thickest.",
      "Offered wages are not accepted wages. The gap between what employers post and what workers are paid is unmeasured here.",
      "The quadrant is a descriptive cut at two medians, not a causal diagnosis. Wage problem means pay trails the median while duration beats it. It does not prove raising pay would fill the posts.",
      "Duration bands and constantly-recruiting shares are in the data files but not charted on this site.",
      "Senior management had 835 vacancies in 2026Q2. Small cells are noisier than large ones.",
    ],
    fixTitle: "What was wrong with the raw data",
    fixBody:
      "Three problems, each fixed before analysis. The archived and current StatCan series overlap for 35 quarters. The fix is a current-series-wins dedup rule. Suppressed and unreliable cells would poison averages. The fix is a quarantine log that excludes 322,588 cells. The NOC 2016 to 2021 code change would split occupations into two series. The fix is name-based mapping that strips classification codes. The data-fixes entry records the before and after.",
    metaLine: "cells scanned",
  },
  dataPage: {
    title: "Data",
    lede: "Every number on this site, downloadable. Vintage: StatCan table 14-10-0443 (JVWS), 2026Q2 latest. Built 2026-10-10.",
    downloads: "Downloads",
    files: [
      { href: "/downloads/broad_quarterly.csv", kind: "CSV", label: "Broad categories, quarterly", rows: "439 rows: 10 categories, 2015Q1 to 2026Q2" },
      { href: "/downloads/minor_latest.csv", kind: "CSV", label: "Minor groups, 2026Q2", rows: "59 rows" },
      { href: "/downloads/unit_latest.csv", kind: "CSV", label: "Unit groups, 2026Q2", rows: "393 rows" },
      { href: "/data/broad.json", kind: "JSON", label: "Full dataset: broad series, medians, quarantine counts", rows: "broad.json, minor.json, unit.json, national.json, anomalies.json" },
    ],
    apiTitle: "API",
    apiBody: "REST endpoints with JSON responses, plus an OpenAPI 3.1 document and an MCP server for agents.",
    endpoints: [
      { m: "GET", p: "/api/v1/national", d: "National series. Optional query: quarter=2026Q2." },
      { m: "GET", p: "/api/v1/categories", d: "The 10 broad categories with latest values and quadrants." },
      { m: "GET", p: "/api/v1/category/[id]", d: "Full quarterly series for one category, e.g. /api/v1/category/5." },
      { m: "GET", p: "/api/v1/ranking", d: "59 minor groups ranked by long-term share (2026Q2)." },
      { m: "GET", p: "/api/v1/lookup?q=", d: "Search 393 unit-group occupations by name or NOC code." },
      { m: "GET", p: "/api/openapi.json", d: "OpenAPI 3.1 document." },
      { m: "POST", p: "/mcp", d: "MCP server (Streamable HTTP): occupation_lookup, duration_wage_ranking, trend." },
    ],
  },
  footer: {
    honestyKicker: "An independent project",
    honesty: "Independent project. Not affiliated with Statistics Canada or any government.",
    author: "Built by Richardson Dackam",
    sources: "Sources: StatCan table 14-10-0443, Job Vacancy and Wage Survey.",
  },
  mcp: {
    title: "Connect your agent",
    body: "Point any MCP-capable agent at this project's MCP server. Three tools: occupation_lookup, duration_wage_ranking, trend.",
    tabs: ["ChatGPT", "Claude", "CLI", "Other"],
  },
  quadrants: {
    wage_problem: {
      label: "Wage problem",
      desc: "Long-term share above 22.2%, wage below $30.95. Posts sit open at pay employers could raise.",
    },
    supply_problem: {
      label: "Supply problem",
      desc: "Above both medians. Posts sit open even though pay beats the median.",
    },
    filling: {
      label: "Filling",
      desc: "Long-term share below 22.2%. Posts turn over before they go stale.",
    },
  },
  charts: {
    lt90Axis: "Share of vacancies open 90+ days (%)",
    wageAxis: "Offered wage ($/hr, what employers post)",
    vacanciesAxis: "Vacancies",
    medianWage: "median $30.95/hr",
    medianLt: "median 22.2%",
    wageProblem: "Wage problem",
    supplyProblem: "Supply problem",
    filling: "Filling",
    nationalTitle: "National vacancies and long-term share, 2015 to 2026",
    covidNote: "2020Q1: hiring freezes, long-term share spikes",
    peakNote: "2022Q4: 855,965 vacancies, 39.5% open 90+ days",
    gapNote: "Survey suspended: no 2020Q2 or 2020Q3",
    healthTitle: "Health occupations: the longest-open posts, 2026Q2",
    wageGapTitle: "Offered wages in the wage-problem corner, 2026Q2",
    wageGapSub: "Dashed line is the $30.95 median. Offered wage is what employers post, not what workers are paid.",
    rankingTitle: "Long-term share by broad group, 2026Q2",
    rankingSub: "Dashed line is the 22.2% median. Sales and service has the most vacancies and sits below the median.",
  },
};

export type Dict = typeof en;

const fr: Dict = {
  siteName: "Durée des vacances vs salaire offert",
  nav: {
    explorer: "Explorateur",
    showcase: "Vitrine",
    methodology: "Méthodologie",
    data: "Données",
    back: "Open Nshipyard",
    allProjects: "Tous les projets",
    menu: "Menu",
    langLabel: "EN",
  },
  home: {
    kicker: "Un projet Open Nshipyard",
    title: "Durée des vacances vs salaire offert",
    lede:
      "Certains postes vacants restent ouverts pendant des mois. D'autres se comblent en quelques semaines. L'Enquête sur les postes vacants et les salaires mesure la durée d'ouverture de chaque poste et le salaire offert par l'employeur. La question: quels postes non comblés sont des problèmes de salaire et quels sont des problèmes d'offre?",
    explore: "Explorer les données",
    method: "Lire la méthodologie",
    chartTitle: "Durée vs salaire: où se situe chaque groupe de professions",
    chartSub:
      "Chaque bulle est un grand groupe de professions au T2 2026, dimensionnée selon les postes vacants. Les lignes pointillées sont les médianes: 22,2 % des postes vacants ouverts depuis 90 jours ou plus, 30,95 $ l'heure offerts. Les salaires sont ce que les employeurs affichent, pas ce que les travailleurs reçoivent.",
    wageTitle: "Salaires offerts par grand groupe, 2015 à 2026",
    wageSub:
      "Salaire horaire moyen offert par les employeurs pour les postes vacants, en dollars canadiens. La santé et les sciences se détachent après 2020. La vente et les services restent près du bas. Le salaire offert est ce que les employeurs affichent, pas ce que les travailleurs reçoivent.",
    stats: [
      { value: "548 400", label: "postes vacants au Canada au T2 2026" },
      { value: "45,9 %", label: "des postes vacants en santé ouverts depuis 90 jours ou plus, la plus longue durée de tous les groupes" },
      { value: "17,75 $", label: "offerts l'heure aux serveurs au comptoir, contre 36,35 $ aux infirmiers autorisés (salaires offerts, ce que les employeurs affichent)" },
      { value: "10", label: "grands groupes de professions suivis de 2015 à 2026" },
    ],
    whatTitle: "Ce que fait ce projet",
    whatBody:
      "L'Enquête sur les postes vacants et les salaires de Statistique Canada publie le nombre de postes vacants, leur durée d'ouverture et le salaire offert par les employeurs. Ce projet transforme 67,5 millions de cellules brutes en un jeu de données classé: chaque grand groupe de professions sur deux axes, la durée et le salaire, pour séparer les problèmes de salaire des problèmes d'offre. Tout est téléchargeable et citable.",
    longestKicker: "Groupe ouvert le plus longtemps · T2 2026",
    longestTitle: "Santé: 45,9 % ouverts depuis 90 jours ou plus",
    longestBody:
      "63 850 postes vacants à 34,85 $ l'heure offerts. Le salaire bat la médiane de 30,95 $ et les postes restent ouverts le plus longtemps: un problème d'offre.",
    showcaseTeaser: "Quatre constats, chacun citable",
    dataTeaser: "Télécharger le jeu de données",
  },
  explorer: {
    title: "Explorateur",
    lede: "Filtrez 59 groupes intermédiaires de professions par catégorie, tranche de durée et tranche de salaire. Cherchez parmi 393 professions de groupes de base par nom.",
    category: "Grande catégorie",
    allCategories: "Toutes les catégories",
    duration: "Tranche de part de longue durée",
    allDurations: "Toutes les durées",
    durationBands: ["Moins de 15 %", "15 % à 25 %", "25 % à 35 %", "35 % et plus"],
    wage: "Tranche de salaire offert",
    allWages: "Tous les salaires",
    wageBands: ["Moins de 20 $", "20 $ à 30 $", "30 $ à 40 $", "40 $ et plus"],
    colOccupation: "Profession",
    colBroad: "Grand groupe",
    colVacancies: "Postes vacants",
    colLt90: "Ouverts 90 j et +",
    colWage: "Salaire offert",
    colVerdict: "Verdict",
    results: "groupes correspondent",
    of: "sur",
    searchTitle: "Chercher une profession",
    searchHint: "Cherche parmi 393 professions de groupes de base par nom français ou anglais ou code CNP.",
    searchPlaceholder: "p. ex. infirmier, soudeur, nurse",
    noResults: "Aucune profession ne correspond à cette recherche.",
    unitNote:
      "La part de longue durée est le pourcentage de postes vacants ouverts depuis 90 jours ou plus. Les salaires sont des salaires horaires offerts en $ CA: ce que les employeurs affichent, pas ce que les travailleurs reçoivent.",
  },
  showcase: {
    title: "Vitrine",
    lede: "Quatre constats tirés du jeu de données durée vs salaire. Chacun porte ses chiffres, son graphique et une citation à copier.",
    cite: "Citer",
    copied: "Copié",
    findings: [
      {
        q: "Les postes vacants en santé restent ouverts le plus longtemps",
        a: "Les professions de la santé comptaient 63 850 postes vacants au T2 2026 et 45,9 % étaient ouverts depuis 90 jours ou plus, la plus forte part de longue durée de tous les grands groupes. Le salaire offert était de 34,85 $ l'heure, au-dessus de la médiane de 30,95 $, donc le salaire n'est pas la contrainte. Infirmiers autorisés: 17 275 postes vacants, 45,1 % ouverts depuis 90 jours ou plus à 36,35 $ l'heure. Aides-infirmiers: 13 050 postes vacants, 43,0 % ouverts depuis 90 jours ou plus à 25,90 $ l'heure. Verdict: un problème d'offre. Le salaire bat la médiane et les postes ne se comblent toujours pas.",
        cite:
          "Richardson Dackam, Durée des vacances vs salaire offert (Open Nshipyard), tableau 14-10-0443 de Statistique Canada (EPVS), T2 2026. vacancies.canada.nshipyard.com.",
      },
      {
        q: "Les métiers et la fabrication ne comblent pas leurs postes aux salaires offerts",
        a: "Les métiers, le transport et la conduite de machinerie comptaient 105 255 postes vacants au T2 2026 avec 27,7 % ouverts depuis 90 jours ou plus, mais le salaire offert était de 29,70 $ l'heure, sous la médiane de 30,95 $. Fabrication: 21 215 postes vacants, 25,6 % ouverts depuis 90 jours ou plus, 26,05 $ l'heure offerts. Serveurs au comptoir et aides de cuisine: 34 005 postes vacants, 28,1 % ouverts depuis 90 jours ou plus, 17,75 $ l'heure offerts. Verdict: un problème de salaire. Les postes restent ouverts parce que le salaire offert est sous la médiane du marché.",
        cite:
          "Richardson Dackam, Durée des vacances vs salaire offert (Open Nshipyard), tableau 14-10-0443 de Statistique Canada (EPVS), T2 2026. vacancies.canada.nshipyard.com.",
      },
      {
        q: "Le sommet de 2022 et le gel de la COVID",
        a: "Les postes vacants à l'échelle nationale ont atteint 855 965 au T4 2022 avec 39,5 % ouverts depuis 90 jours ou plus, ce qui correspond au chiffre publié par Statistique Canada. Au T1 2020, la part de longue durée a bondi dans chaque grande catégorie pendant le gel des embauches: la vente et les services sont passés d'une moyenne mobile de 9,3 % à 25,9 % en un seul trimestre. Statistique Canada a suspendu l'enquête au T2 2020, et le T3 2020 n'a pas été collecté non plus, ce qui laisse un trou de deux trimestres dans la série. Au T2 2026, le marché s'était refroidi à 548 400 postes vacants avec 25,9 % ouverts depuis 90 jours ou plus.",
        cite:
          "Richardson Dackam, Durée des vacances vs salaire offert (Open Nshipyard), tableau 14-10-0443 de Statistique Canada (EPVS), série nationale 2015T1 à 2026T2. vacancies.canada.nshipyard.com.",
      },
      {
        q: "La vente et les services ont le plus de postes vacants et les comblent",
        a: "Les professions de la vente et des services comptaient 171 750 postes vacants au T2 2026, le plus grand nombre de tous les grands groupes, mais seulement 21,8 % étaient ouverts depuis 90 jours ou plus, sous la médiane de 22,2 %. Le salaire offert était de 20,60 $ l'heure. C'est un roulement élevé, pas une pénurie: les postes tournent assez vite pour que peu deviennent anciens.",
        cite:
          "Richardson Dackam, Durée des vacances vs salaire offert (Open Nshipyard), tableau 14-10-0443 de Statistique Canada (EPVS), T2 2026. vacancies.canada.nshipyard.com.",
      },
    ],
  },
  methodology: {
    title: "Méthodologie",
    lede: "Chaque règle qui transforme 67,5 millions de cellules brutes en un jeu de données classé.",
    rulesTitle: "Les règles de construction",
    rules: [
      {
        t: "La série courante l'emporte",
        d: "Le tableau 14100443 est la série courante de l'Enquête sur les postes vacants et les salaires. Son prédécesseur archivé 14100328, couvrant 2015T1 à 2023T3, est entièrement remplacé. Les lignes archivées apportent zéro observation, donc aucun trimestre n'est compté deux fois.",
      },
      {
        t: "Cellules supprimées mises en quarantaine",
        d: "322 588 cellules ont été exclues avant toute agrégation: les cellules supprimées par Statistique Canada (x) ou jugées trop peu fiables (F), les valeurs non numériques, les nombres de postes vacants négatifs et les salaires nuls ou négatifs ou supérieurs à 500 $ l'heure. Les comptes de quarantaine sont livrés dans chaque fichier de données.",
      },
      {
        t: "Appariement CNP par nom",
        d: "Les noms de professions sont dépouillés de leur code de classification final avant l'appariement, pour qu'une profession garde une seule série malgré le passage de la CNP 2016 à la CNP 2021. Un appariement par nom brut aurait coupé les professions en deux séries au changement de code.",
      },
      {
        t: "Les salaires sont offerts, en $ CA",
        d: "L'enquête demande aux employeurs quel salaire horaire ils offrent pour le poste vacant. Ce n'est pas ce que les travailleurs finissent par recevoir. Chaque graphique et chaque tableau qui montre un salaire le précise.",
      },
      {
        t: "La règle des quadrants",
        d: "Chaque grand groupe tombe dans un quadrant en comparant ses valeurs du T2 2026 aux médianes: 22,2 % de postes vacants ouverts depuis 90 jours ou plus et 30,95 $ l'heure offerts (la valeur médiane haute des 10 groupes). Au-dessus de la médiane de durée et au niveau ou au-dessus de la médiane de salaire: problème d'offre. Au-dessus de la médiane de durée et sous la médiane de salaire: problème de salaire. Sous la médiane de durée: comblement.",
      },
      {
        t: "La suspension de 2020",
        d: "Statistique Canada a suspendu la collecte de l'EPVS au T2 2020 pendant la première vague de COVID, et le T3 2020 n'a pas été collecté non plus. Chaque série trimestrielle de ce projet a un trou de deux trimestres, dessiné comme une rupture, pas comme un zéro.",
      },
      {
        t: "Données non désaisonnalisées",
        d: "Les chiffres trimestriels de l'EPVS ne sont pas désaisonnalisés. Comparez d'une année à l'autre, pas d'un trimestre à l'autre.",
      },
    ],
    limitsTitle: "Limites honnêtes",
    limits: [
      "Neuf des dix grands groupes commencent au T1 2015. La haute direction commence au T2 2015 parce que Statistique Canada n'a publié aucune ventilation au T1 2015 pour ce groupe.",
      "Les 322 588 cellules en quarantaine éclaircissent les petites professions. Les chiffres des groupes intermédiaires et des groupes de base sont publiés pour le T2 2026 seulement, où la couverture est la plus épaisse.",
      "Les salaires offerts ne sont pas les salaires acceptés. L'écart entre ce que les employeurs affichent et ce que les travailleurs reçoivent n'est pas mesuré ici.",
      "Le quadrant est une coupe descriptive à deux médianes, pas un diagnostic causal. Problème de salaire signifie que la paie est sous la médiane pendant que la durée la dépasse. Cela ne prouve pas qu'augmenter la paie comblerait les postes.",
      "Les tranches de durée et les parts de recrutement continu sont dans les fichiers de données mais ne sont pas illustrées sur ce site.",
      "La haute direction comptait 835 postes vacants au T2 2026. Les petites cellules sont plus bruyantes que les grandes.",
    ],
    fixTitle: "Ce qui n'allait pas dans les données brutes",
    fixBody:
      "Trois problèmes, chacun corrigé avant l'analyse. Les séries archivées et courantes de Statistique Canada se chevauchent sur 35 trimestres. La correction est une règle de déduplication qui fait gagner la série courante. Les cellules supprimées et peu fiables auraient empoisonné les moyennes. La correction est un journal de quarantaine qui exclut 322 588 cellules. Le passage de la CNP 2016 à la CNP 2021 aurait coupé les professions en deux séries. La correction est un appariement par nom qui retire les codes de classification. La fiche du journal des corrections consigne l'avant et l'après.",
    metaLine: "cellules lues",
  },
  dataPage: {
    title: "Données",
    lede: "Chaque chiffre de ce site, téléchargeable. Millésime: tableau 14-10-0443 de Statistique Canada (EPVS), dernier trimestre T2 2026. Compilé le 2026-10-10.",
    downloads: "Téléchargements",
    files: [
      { href: "/downloads/broad_quarterly.csv", kind: "CSV", label: "Grandes catégories, trimestriel", rows: "439 lignes: 10 catégories, 2015T1 à 2026T2" },
      { href: "/downloads/minor_latest.csv", kind: "CSV", label: "Groupes intermédiaires, T2 2026", rows: "59 lignes" },
      { href: "/downloads/unit_latest.csv", kind: "CSV", label: "Groupes de base, T2 2026", rows: "393 lignes" },
      { href: "/data/broad.json", kind: "JSON", label: "Jeu de données complet: séries, médianes, comptes de quarantaine", rows: "broad.json, minor.json, unit.json, national.json, anomalies.json" },
    ],
    apiTitle: "API",
    apiBody: "Des points d'accès REST avec réponses JSON, un document OpenAPI 3.1 et un serveur MCP pour les agents.",
    endpoints: [
      { m: "GET", p: "/api/v1/national", d: "Série nationale. Paramètre optionnel: quarter=2026Q2." },
      { m: "GET", p: "/api/v1/categories", d: "Les 10 grandes catégories avec dernières valeurs et quadrants." },
      { m: "GET", p: "/api/v1/category/[id]", d: "Série trimestrielle complète d'une catégorie, p. ex. /api/v1/category/5." },
      { m: "GET", p: "/api/v1/ranking", d: "59 groupes intermédiaires classés par part de longue durée (T2 2026)." },
      { m: "GET", p: "/api/v1/lookup?q=", d: "Cherche 393 professions de groupes de base par nom ou code CNP." },
      { m: "GET", p: "/api/openapi.json", d: "Document OpenAPI 3.1." },
      { m: "POST", p: "/mcp", d: "Serveur MCP (HTTP diffusable): occupation_lookup, duration_wage_ranking, trend." },
    ],
  },
  footer: {
    honestyKicker: "Un projet indépendant",
    honesty: "Projet indépendant. Sans affiliation avec Statistique Canada ni aucun gouvernement.",
    author: "Conçu par Richardson Dackam",
    sources: "Sources: tableau 14-10-0443 de Statistique Canada, Enquête sur les postes vacants et les salaires.",
  },
  mcp: {
    title: "Connectez votre agent",
    body: "Pointez tout agent compatible MCP vers le serveur MCP de ce projet. Trois outils: occupation_lookup, duration_wage_ranking, trend.",
    tabs: ["ChatGPT", "Claude", "CLI", "Autre"],
  },
  quadrants: {
    wage_problem: {
      label: "Problème de salaire",
      desc: "Part de longue durée au-dessus de 22,2 %, salaire sous 30,95 $. Les postes restent ouverts à une paie que les employeurs pourraient augmenter.",
    },
    supply_problem: {
      label: "Problème d'offre",
      desc: "Au-dessus des deux médianes. Les postes restent ouverts même si la paie bat la médiane.",
    },
    filling: {
      label: "Comblement",
      desc: "Part de longue durée sous 22,2 %. Les postes tournent avant de devenir anciens.",
    },
  },
  charts: {
    lt90Axis: "Part des postes vacants ouverts depuis 90 jours ou plus (%)",
    wageAxis: "Salaire offert ($/h, ce que les employeurs affichent)",
    vacanciesAxis: "Postes vacants",
    medianWage: "médiane 30,95 $/h",
    medianLt: "médiane 22,2 %",
    wageProblem: "Problème de salaire",
    supplyProblem: "Problème d'offre",
    filling: "Comblement",
    nationalTitle: "Postes vacants et part de longue durée à l'échelle nationale, 2015 à 2026",
    covidNote: "T1 2020: gel des embauches, la part de longue durée bondit",
    peakNote: "T4 2022: 855 965 postes vacants, 39,5 % ouverts depuis 90 jours ou plus",
    gapNote: "Enquête suspendue: pas de T2 2020 ni de T3 2020",
    healthTitle: "Professions de la santé: les postes ouverts le plus longtemps, T2 2026",
    wageGapTitle: "Salaires offerts dans le coin des problèmes de salaire, T2 2026",
    wageGapSub: "La ligne pointillée est la médiane de 30,95 $. Le salaire offert est ce que les employeurs affichent, pas ce que les travailleurs reçoivent.",
    rankingTitle: "Part de longue durée par grand groupe, T2 2026",
    rankingSub: "La ligne pointillée est la médiane de 22,2 %. La vente et les services ont le plus de postes vacants et se situent sous la médiane.",
  },
};

const dicts: Record<Lang, Dict> = { en, fr };

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "en",
  setLang: () => {},
  t: en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("vdw-lang");
    return saved === "fr" || saved === "en" ? saved : "en";
  });
  useEffect(() => {
    document.documentElement.lang = lang === "fr" ? "fr" : "en";
  }, [lang]);
  const apply = (l: Lang) => {
    setLang(l);
    window.localStorage.setItem("vdw-lang", l);
  };
  return <LangCtx.Provider value={{ lang, setLang: apply, t: dicts[lang] }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}

export function fmtNum(n: number, lang: Lang, digits = 0) {
  return n.toLocaleString(lang === "fr" ? "fr-CA" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function fmtMoney(n: number, lang: Lang) {
  const v = fmtNum(n, lang, 2);
  return lang === "fr" ? `${v} $` : `$${v}`;
}
