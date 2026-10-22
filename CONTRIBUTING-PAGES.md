# Ajouter ou modifier une page d'Amende et Points (fr-amendes-points)

À lire avec `~/Documents/GitHub/RECETTE-SITE.md` §6 (unicité), §7 (FAQ), §9 (écriture), §9.3
(mini-simulateurs), §11 (titres), §21 (bloc citable). Éditeur : Radif Partners. Aucun lien vers un stage,
un avocat, une auto-école, un assureur ni un autre site du portefeuille. Le site ne se présente jamais comme
l'ANTAI ni comme un service de l'État.

## Une page = un fichier

- Page outil : `src/content/outils/<id>.ts`, champ `tool: 'exces' | 'infraction' | 'points' | 'radars' | 'delais'`,
  réglages de l'outil dans `outil` (ex. `{ defaultVitesse: 108, defaultLimite: 80 }`, `{ defaultId: 'feu_rouge' }`, `{ defaultDep: '60' }`).
  Guide sans outil principal : `src/content/guides/<id>.ts`.
- Le fichier porte les deux langues (`fr`, `en`) : slug, nav, card, title (50–60 car., terme-clé en tête),
  description (150–160 car.), h1, intro, `resume(h)` (un paragraphe ≥ 120 mots), `faqs(h)` (questions
  uniques sur tout le site, réponses de 40 à 90 mots), `body(h)`.
- L'accueil (page pilier, 2 000 à 3 000 mots, ≥ 3 sources officielles) est dans `src/content/accueil.ts`.
- Le cœur (routes, menus, sitemap, hreflang, schémas) lit ces fichiers seul : ne pas le modifier pour
  ajouter une page. Plafond du lot : 100 pages HTML toutes langues.

## Aucun chiffre en dur

Montants, points, délais, marges et limites viennent de `h.P` (`src/data/params-2026.json`) et du moteur
`h.M` (`src/lib/engine/sanctions.ts`) ; les radars de `h.S` (`src/data/radars/stats.json`). Un exemple chiffré
(« 98 km/h sur une route à 80 ») est calculé par `h.M.sanctionVitesse`, jamais recopié. Formats : `h.eur`,
`h.num`, `h.pct`, `h.date` ; liens internes `h.a(id, texte)`, sources `h.src(clé)`.

## Mini-simulateurs

`<!--mini:KIND-->` dans le corps. Disponibles (`src/lib/minis/`) : alcool, contester, cumul, delais, delit,
exces, infraction, limite, marge, probatoire, recup, seuils, stage, stationnement, suspension, troncon.

## Contrôles

`npm run check` (build, tests, typographie, légal, SEO, unicité, trame, liens, layout, sources,
simulateurs, hreflang, anglais, portefeuille, cookies, URL, premier écran), plus
`python3 scripts/check-regles.py .`, `node scripts/check-contraste.mjs .`,
`node scripts/check-saisie.mjs . --max=60`, `node scripts/check-nombres.mjs .`.
Les contrôles qui lancent Playwright passent sous le verrou `~/Documents/GitHub/.playwright.lock`.
