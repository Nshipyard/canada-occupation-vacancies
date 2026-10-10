# Data-fixes log entry - Vacancy Duration vs Offered Wage

## EN

**Project:** Vacancy Duration vs Offered Wage
**Datasets:** StatCan table 14-10-0443, Job Vacancy and Wage Survey (quarterly, unadjusted for seasonality, current series 2015Q1 to 2026Q2). Archived predecessor: table 14-10-0328 (2015Q1 to 2023Q3, inactive).
**Vintage:** 2026Q2 latest. Built 2026-10-10.
**Methods:** dedup, quarantine, name-based classification mapping

### What was wrong

Three problems in the raw material, each caught before analysis:

1. **Archived and current series overlap.** StatCan replaced table 14100328 with table 14100443. The two series overlap for 35 quarters (2015Q1 to 2023Q3). Treating both files as sources would count every overlapping quarter twice: vacancy levels would double and every rate built on them would be wrong.
2. **Suppressed and unreliable cells.** 322,588 cells carry a status of suppressed (x) or too unreliable to publish (F), or hold non-numeric values. Averaging them in would poison vacancy counts and offered wages, especially for small occupations where one bad cell dominates.
3. **The NOC 2016 to 2021 code change.** Occupation names in the current series carry a trailing classification code like [NOC 2021]. The same occupation in earlier quarters carries [NOC 2016]. Matching by raw name splits one occupation into two series at the code change, breaking every trend line.

### The fix

1. **Current-series-wins dedup rule.** The build reads the current 14100443 file only. Archived 14100328 rows contribute zero observations. Recorded in every data file as `dedup_rule`.
2. **Quarantine log.** Suppressed (x), unreliable (F), and non-numeric cells are excluded before aggregation, along with negative vacancy counts and wages at or below zero or above $500 an hour. Result: 322,588 cells quarantined, 0 negative vacancies, 0 out-of-range wages, 0 unknown occupation names. Counts ship in every data file as `quarantine`.
3. **Name-based NOC mapping.** Occupation names strip the trailing `[NOC 20xx]` code before matching, so one occupation keeps one series across the classification change. Result: 0 unknown occupation names across 67,508,672 scanned rows and 824 mapped NOC members.

### Before / after

- Before: 35 quarters of health vacancies present in both the archived and current files. After: one 2020Q1 health observation (current series only). The archived copy contributes nothing.
- Before: `"Registered nurses and registered psychiatric nurses [NOC 2016]"` and `"Registered nurses and registered psychiatric nurses [NOC 2021]"` as two separate occupations with broken trend lines. After: one occupation, one 44-quarter series, 17,275 vacancies in 2026Q2.
- Before: 322,588 suppressed or unreliable cells mixed into the averages. After: excluded before aggregation, with the count published in `public/data/broad.json` under `meta.quarantine`.

### Result counts

- Rows scanned: 67,508,672. Cells quarantined: 322,588.
- 10 broad occupation categories (439 quarterly rows: nine groups from 2015Q1, senior management from 2015Q2, all through 2026Q2, minus the 2020Q2 and 2020Q3 suspension).
- 59 minor groups and 393 unit-group occupations for 2026Q2.
- National quarterly series: 44 quarters, 2015Q1 to 2026Q2.

## FR

**Projet:** Durée des vacances vs salaire offert
**Jeux de données:** Tableau 14-10-0443 de Statistique Canada, Enquête sur les postes vacants et les salaires (trimestriel, non désaisonnalisé, série courante 2015T1 à 2026T2). Prédécesseur archivé: tableau 14-10-0328 (2015T1 à 2023T3, inactif).
**Millésime:** Dernier trimestre T2 2026. Compilé le 2026-10-10.
**Méthodes:** déduplication, quarantaine, appariement par nom de classification

### Ce qui n'allait pas

Trois problèmes dans la matière brute, chacun détecté avant l'analyse:

1. **Chevauchement des séries archivée et courante.** Statistique Canada a remplacé le tableau 14100328 par le tableau 14100443. Les deux séries se chevauchent sur 35 trimestres (2015T1 à 2023T3). Traiter les deux fichiers comme sources compterait chaque trimestre de chevauchement deux fois: les niveaux de postes vacants doubleraient et chaque taux construit dessus serait faux.
2. **Cellules supprimées et peu fiables.** 322 588 cellules portent un statut supprimé (x) ou trop peu fiable pour publication (F), ou contiennent des valeurs non numériques. Les inclure dans les moyennes empoisonnerait les nombres de postes vacants et les salaires offerts, surtout pour les petites professions où une mauvaise cellule domine.
3. **Le passage de la CNP 2016 à la CNP 2021.** Les noms de professions dans la série courante portent un code de classification final comme [CNP 2021]. La même profession dans les trimestres antérieurs porte [CNP 2016]. Un appariement par nom brut coupe une profession en deux séries au changement de code, brisant chaque courbe de tendance.

### La correction

1. **Règle de déduplication: la série courante l'emporte.** La construction lit seulement le fichier courant 14100443. Les lignes archivées 14100328 apportent zéro observation. Consigné dans chaque fichier de données comme `dedup_rule`.
2. **Journal de quarantaine.** Les cellules supprimées (x), peu fiables (F) et non numériques sont exclues avant l'agrégation, ainsi que les nombres de postes vacants négatifs et les salaires nuls ou négatifs ou supérieurs à 500 $ l'heure. Résultat: 322 588 cellules en quarantaine, 0 postes vacants négatifs, 0 salaires hors limites, 0 noms de professions inconnus. Les comptes sont livrés dans chaque fichier de données comme `quarantine`.
3. **Appariement CNP par nom.** Les noms de professions sont dépouillés de leur code `[CNP 20xx]` final avant l'appariement, pour qu'une profession garde une seule série malgré le changement de classification. Résultat: 0 noms de professions inconnus sur 67 508 672 lignes lues et 824 membres CNP appariés.

### Avant / après

- Avant: 35 trimestres de postes vacants en santé présents à la fois dans les fichiers archivé et courant. Après: une seule observation au T1 2020 pour la santé (série courante seulement). La copie archivée n'apporte rien.
- Avant: `"Registered nurses and registered psychiatric nurses [NOC 2016]"` et `"Registered nurses and registered psychiatric nurses [NOC 2021]"` comme deux professions séparées avec des courbes brisées. Après: une profession, une série de 44 trimestres, 17 275 postes vacants au T2 2026.
- Avant: 322 588 cellules supprimées ou peu fiables mélangées aux moyennes. Après: exclues avant l'agrégation, avec le compte publié dans `public/data/broad.json` sous `meta.quarantine`.

### Comptes de résultats

- Lignes lues: 67 508 672. Cellules en quarantaine: 322 588.
- 10 grandes catégories de professions (439 lignes trimestrielles: neuf groupes dès 2015T1, la haute direction dès 2015T2, tous jusqu'au T2 2026, moins la suspension des T2 et T3 2020).
- 59 groupes intermédiaires et 393 professions de groupes de base pour le T2 2026.
- Série trimestrielle nationale: 44 trimestres, 2015T1 à 2026T2.
