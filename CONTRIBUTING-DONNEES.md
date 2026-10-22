# Données d'Amende et Points (fr-amendes-points)

Deux sources : le barème des sanctions, relu à la main sur les textes, et le fichier public des radars
fixes, relu chaque semaine par un script. Aucun montant n'est écrit à la main dans une page.

## Barème : `src/data/params-2026.json`

- Classes et montants (minoré, forfaitaire, majoré) : article R49-9 du Code de procédure pénale.
- Tranches de l'excès de vitesse, points et suspensions : article R413-14 du Code de la route
  (version du 1er janvier 2024) ; délit à partir de 50 km/h : article L413-1, en vigueur depuis le
  29 décembre 2025 (décret n° 2025-1269).
- Marges des cinémomètres : arrêté du 4 juin 2009, article 6 (fixe : 5 km/h sous 100 km/h, 5 % au-dessus ;
  en mouvement : 10 km/h ou 10 %). L'arrondi à l'entier inférieur est notre choix, écrit sur la page Méthode.
- Points et récupération : articles L223-1, L223-2, L223-6 ; suspension préfectorale : L224-2 ;
  alcool et stupéfiants : L234-1, L235-1, R234-1, modifiés par la loi n° 2026-798 du 18 août 2026.
- Délais de paiement et de contestation : articles 529-7 à 530 du Code de procédure pénale, fiches
  Service Public citées.

Chaque valeur porte sa source (`sources`, avec l'URL Légifrance ou Service Public) et la date de relecture
(`retrieved_at`). Les exemples des textes sont rejoués par `src/lib/engine/sanctions.test.ts` (vitest) : un
changement de barème se fait dans le JSON, puis dans les tests, puis `npm run check`.
À surveiller : l'abrogation des articles 529-7 et 529-8 du CPP au 1er janvier 2029 (montant minoré) et
la version de R417-11 valable jusqu'au 1er janvier 2027.

## Radars : `scripts/update-data.mjs`

- **Source** : « Liste des radars fixes en France », ministère de l'Intérieur, data.gouv.fr
  (jeu `6712583387af110196942793`), CSV `;` en ISO-8859-1, **Licence Ouverte 2.0 (Etalab)** : réutilisation
  libre à condition de citer la source et la date du fichier (affichée sur les pages radars).
- **Communes et départements** : API Découpage administratif (`geo.api.gouv.fr`, même licence), une requête
  par radar nouveau, cache `scripts/data/geo-radars.json`.

```
node scripts/update-data.mjs                     # lit la ressource CSV la plus récente du jeu
node scripts/update-data.mjs --csv fichier.csv   # rejoue un CSV local
node scripts/update-data.mjs --date 2026-10-22   # force la date de relevé
```

1. Refuse un fichier de moins de 2 000 radars (téléchargement coupé) : rien n'est écrit.
2. Écrit `public/data/radars.json` (tous les radars, format compact, chargé par l'outil à la demande),
   `src/data/radars/stats.json` (France et départements, par type et par limite) et
   `src/data/radars/fichier.json` (nom et date du fichier).

Fichier du 30 décembre 2025 : 3 309 radars, 2 sans commune (côte de Menton), aucun à Mayotte.

## Mise à jour automatique

`.github/workflows/deploy.yml` : chaque lundi à 04:40 UTC, relevé, `vitest`, build, recommit de
`src/data/radars`, `public/data` et du cache, publication GitHub Pages, ping IndexNow. Un relevé raté garde le
fichier précédent ; un test raté bloque la publication.

## Ce que le site ne publie pas

Radars mobiles, voitures radars et radars de chantier (positions non publiées) ; prix des stages de
récupération de points (prix libres, sans source officielle) ; montants non vérifiés sur un texte en vigueur.
