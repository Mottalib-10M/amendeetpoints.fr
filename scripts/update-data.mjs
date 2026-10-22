#!/usr/bin/env node
/**
 * Relit la « Liste des radars fixes en France » (ministère de l'Intérieur, data.gouv.fr, Licence
 * Ouverte 2.0) et régénère les données radars du site. Aucune dépendance : Node 22.
 *
 * Source : https://www.data.gouv.fr/datasets/liste-des-radars-fixes-en-france
 *   (jeu 6712583387af110196942793, fréquence annoncée : annuelle ; CSV « ; » en ISO-8859-1 :
 *   Numéro de radar ; Type de radar ; Date de mise en service ; VMA ; Latitude ; Longitude)
 *   Le script prend la ressource CSV la plus récente déclarée par l'API du jeu.
 * Commune et département de chaque radar : API Découpage administratif (geo.api.gouv.fr, Etalab),
 *   recherche par coordonnées, mise en cache dans scripts/data/geo-radars.json (une requête par
 *   radar nouveau seulement).
 *
 * Écrit :
 *   public/data/radars.json         tous les radars, format compact (chargé par l'outil à la demande)
 *   src/data/radars/stats.json      France et départements : effectifs par type et par limite
 *   src/data/radars/fichier.json    date et nom du fichier lu
 *
 * Usage : node scripts/update-data.mjs [--csv fichier.csv] [--date AAAA-MM-JJ]
 * Un fichier de moins de 2 000 radars est refusé (téléchargement coupé) : rien n'est écrit.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATASET = 'https://www.data.gouv.fr/api/1/datasets/6712583387af110196942793/';
const GEO = (lat, lon) => `https://geo.api.gouv.fr/communes?lat=${lat}&lon=${lon}&fields=nom,code,codeDepartement&format=json`;
const DEPS = 'https://geo.api.gouv.fr/departements?fields=nom,code';
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const OUT_PUBLIC = path.join(ROOT, 'public/data');
const OUT_SRC = path.join(ROOT, 'src/data/radars');
const CACHE = path.join(ROOT, 'scripts/data/geo-radars.json');
for (const d of [OUT_PUBLIC, OUT_SRC, path.dirname(CACHE)]) fs.mkdirSync(d, { recursive: true });

async function get(url, as = 'text') {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'amende-et-points-update/1.0 (site statique, relevé des radars fixes)' } });
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      if (as === 'json') return await r.json();
      if (as === 'latin1') return new TextDecoder('latin1').decode(await r.arrayBuffer());
      return await r.text();
    } catch (e) { if (i === 2) throw e; await new Promise((s) => setTimeout(s, 2000 * (i + 1))); }
  }
}

/** Types publiés dans le fichier (description du jeu de données). */
export const TYPES = ['ETF', 'ETD', 'ETT', 'ETU', 'ETVM', 'ETFR', 'ETPN'];

async function main() {
  let text, fichier, nomFichier;
  if (opt('--csv')) {
    text = new TextDecoder('latin1').decode(fs.readFileSync(opt('--csv')));
    nomFichier = path.basename(opt('--csv'));
    fichier = opt('--date') ?? new Date().toISOString().slice(0, 10);
  } else {
    const meta = await get(DATASET, 'json');
    const csvs = meta.resources.filter((r) => (r.format || '').toLowerCase() === 'csv').sort((a, b) => String(b.last_modified).localeCompare(String(a.last_modified)));
    if (!csvs.length) throw new Error('aucune ressource CSV dans le jeu');
    text = await get(csvs[0].url, 'latin1');
    nomFichier = csvs[0].title;
    fichier = String(csvs[0].last_modified).slice(0, 10);
  }
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const head = lines.shift().split(';').map((s) => s.trim().toLowerCase());
  const col = (re) => { const i = head.findIndex((h) => re.test(h)); if (i < 0) throw new Error(`colonne introuvable : ${re}`); return i; };
  const iId = col(/num/), iType = col(/type/), iDate = col(/date/), iVma = col(/vma/), iLat = col(/lat/), iLon = col(/lon/);
  const rows = lines.map((l) => l.split(';').map((s) => s.trim())).filter((c) => c.length > iLon && c[iId]);
  if (rows.length < 2000) throw new Error(`fichier trop court (${rows.length} radars) : rien n'est écrit`);

  const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  const todo = rows.filter((c) => !cache[`${c[iLat]},${c[iLon]}`]);
  console.log(`${rows.length} radars, ${todo.length} à situer par l'API Découpage administratif`);
  const queue = [...todo];
  async function worker() {
    while (queue.length) {
      const c = queue.shift();
      const lat = Number(c[iLat]), lon = Number(c[iLon]);
      try {
        const res = await get(GEO(lat, lon), 'json');
        cache[`${c[iLat]},${c[iLon]}`] = res[0] ? [res[0].nom, res[0].code, res[0].codeDepartement] : null;
      } catch { cache[`${c[iLat]},${c[iLon]}`] = null; }
      await new Promise((s) => setTimeout(s, 60));
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  fs.writeFileSync(CACHE, JSON.stringify(cache));

  const deps = Object.fromEntries((await get(DEPS, 'json')).map((d) => [d.code, d.nom]));
  const radars = [];
  let sansCommune = 0;
  for (const c of rows) {
    const g = cache[`${c[iLat]},${c[iLon]}`];
    if (!g) sansCommune++;
    const [dd, mm, yy] = (c[iDate].split(' ')[0] || '').split('/');
    const vma = /^\d+$/.test(c[iVma]) ? Number(c[iVma]) : 0;
    radars.push({ id: c[iId], t: c[iType].toUpperCase(), v: vma, la: Number(Number(c[iLat]).toFixed(5)), lo: Number(Number(c[iLon]).toFixed(5)), c: g ? g[0] : '', ci: g ? g[1] : '', d: g ? g[2] : '', ms: yy && mm ? `${yy}-${mm}` : '' });
  }
  radars.sort((a, b) => a.d.localeCompare(b.d) || a.c.localeCompare(b.c, 'fr') || a.id.localeCompare(b.id));

  const vide = () => ({ total: 0, types: Object.fromEntries(TYPES.map((t) => [t, 0])), vma: {}, recents: 0, plusAncien: '9999', plusRecent: '0000', communes: 0 });
  const add = (s, r) => {
    s.total++; s.types[r.t] = (s.types[r.t] ?? 0) + 1;
    if (r.v) s.vma[r.v] = (s.vma[r.v] ?? 0) + 1;
    if (r.ms) { if (r.ms < s.plusAncien) s.plusAncien = r.ms; if (r.ms > s.plusRecent) s.plusRecent = r.ms; if (r.ms >= '2023-01') s.recents++; }
  };
  const national = vide();
  const parDep = {};
  for (const r of radars) {
    add(national, r);
    if (!r.d) continue;
    parDep[r.d] ??= { ...vide(), nom: deps[r.d] ?? r.d, communesSet: new Set(), top: {} };
    add(parDep[r.d], r);
    parDep[r.d].communesSet.add(r.ci);
    parDep[r.d].top[r.c] = (parDep[r.d].top[r.c] ?? 0) + 1;
  }
  const depsOut = {};
  for (const [code, s] of Object.entries(parDep).sort(([a], [b]) => a.localeCompare(b))) {
    const { communesSet, top, ...rest } = s;
    const topCommunes = Object.entries(top).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'fr')).slice(0, 5);
    depsOut[code] = { ...rest, communes: communesSet.size, topCommunes };
  }
  // Départements sans aucun radar fixe dans le fichier : listés avec 0 (la page le dit).
  for (const [code, nom] of Object.entries(deps)) depsOut[code] ??= { ...vide(), nom, communes: 0, topCommunes: [] };

  const stats = { meta: { fichier, nomFichier, radars: radars.length, sansCommune, releve: opt('--date') ?? new Date().toISOString().slice(0, 10) }, national, deps: depsOut };
  fs.writeFileSync(path.join(OUT_SRC, 'stats.json'), JSON.stringify(stats, null, 1));
  fs.writeFileSync(path.join(OUT_SRC, 'fichier.json'), JSON.stringify({ fichier, nomFichier }, null, 1));
  // Compact : [id, type, vma, lat, lon, commune, dep, mise en service AAAA-MM]
  fs.writeFileSync(path.join(OUT_PUBLIC, 'radars.json'), JSON.stringify(radars.map((r) => [r.id, r.t, r.v, r.la, r.lo, r.c, r.d, r.ms])));
  console.log(`écrit : ${radars.length} radars, ${Object.keys(depsOut).length} départements, ${sansCommune} sans commune ; fichier du ${fichier}`);
}

main().catch((e) => { console.error('Relevé interrompu :', e.message); process.exit(1); });
