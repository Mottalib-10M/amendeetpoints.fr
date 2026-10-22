import { defineGuide, type Helpers } from '../../lib/guide-types';

type Dep = { nom: string; total: number; types: Record<string, number>; vma: Record<string, number>; recents: number; communes: number };
const D = (h: Helpers) => h.S.deps as unknown as Record<string, Dep>;
/** Départements classés par nombre de radars fixes (Mayotte, sans radar, à part). */
const rang = (h: Helpers) => Object.entries(D(h)).filter(([, d]) => d.total > 0).sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0]));
const top = (h: Helpers, n: number) => rang(h).slice(0, n).map(([c, d]) => `${d.nom} (${h.num(d.total)})`).join(', ');
const bas = (h: Helpers, n: number) => rang(h).slice(-n).reverse().map(([c, d]) => `${d.nom} (${h.num(d.total)})`).join(', ');
const N = (h: Helpers) => h.S.national;
/** Part des radars dont la limite contrôlée est connue et vaut 80 ou 90 km/h. */
const vmaN = (h: Helpers, v: string) => (N(h).vma as Record<string, number>)[v] ?? 0;
const vmaTotal = (h: Helpers) => Object.values(N(h).vma as Record<string, number>).reduce((a, b) => a + b, 0);

export default defineGuide({
  id: 'carte-radars',
  group: 'radars',
  order: 1,
  tool: 'radars',
  outil: { defaultDep: '13' },
  related: ['radars-paris', 'radar-fixe', 'radar-troncon', 'marge-erreur-radar', 'amende-feu-rouge'],
  sources: ['radarsDataset', 'radarsCarte', 'geoApi', 'arreteCinemometres'],
  fr: {
    slug: 'carte-des-radars',
    nav: 'Radars par département',
    card: 'Les 3 309 radars fixes, département par département, avec leur limite.',
    title: 'Radars autour de moi : carte des 3 309 radars fixes',
    description: 'Carte des radars fixes en France : nombre par département et par type, limite contrôlée, et pour chaque radar la vitesse mesurée qui coûte un point ou le délit.',
    h1: 'Carte des radars fixes autour de moi, département par département',
    intro: 'Choisissez un département : le nombre de radars par type, puis la carte et la liste de chacun, avec la vitesse à partir de laquelle il retire des points.',
    resume: (h) => `Le ministère de l’Intérieur publie sur data.gouv.fr la liste des radars automatiques fixes, avec leur type, leur date de mise en service, la vitesse qu’ils contrôlent et leurs coordonnées. Le fichier lu ici, daté du ${h.date(h.S.meta.fichier)}, en compte ${h.num(h.S.meta.radars)}. Nous avons rattaché chacun à sa commune et à son département : ${top(h, 4)} sont les départements les plus équipés ; ${bas(h, 3)} les moins équipés, Mayotte n’en ayant aucun. Les radars tourelles, posés sur un mât et capables de contrôler plusieurs voies dans les deux sens, sont désormais les plus nombreux (${h.num(N(h).types.ETT)}). Pour chaque radar dont la limite est publiée, l’outil donne la vitesse mesurée à partir de laquelle un point est retiré, puis celle du délit de grand excès. Ce fichier ne contient ni les radars mobiles, ni les voitures radars, ni les radars de chantier déplacés au fil des travaux.`,
    faqs: (h) => [
      { q: 'Les radars mobiles et les voitures radars sont-ils sur la carte ?', a: 'Non. Le fichier public du ministère ne liste que les équipements fixes : radars classiques, tourelles, discriminants, tronçons, feux rouges, passages à niveau et radars urbains. Les voitures banalisées équipées d’un radar embarqué, les jumelles des forces de l’ordre et les radars de chantier ne sont pas publiés, et leur position change tous les jours.' },
      { q: 'Un radar annoncé dans le fichier peut-il être éteint ?', a: 'Oui. Le fichier est mis à jour environ une fois par an, et un radar peut être vandalisé, en maintenance ou déplacé entre deux versions. La date du fichier est affichée au-dessus de l’outil. Un radar présent sur la liste reste à considérer comme actif : rouler à la limite est la seule protection fiable.' },
      { q: 'Est-il légal de consulter la position des radars ?', a: `Oui : la liste est publiée par l’administration elle-même, sous Licence Ouverte. Ce qui est interdit, c’est l’usage au volant d’un détecteur qui repère les radars par leurs émissions. Les applications d’aide à la conduite signalent des zones de danger, sans position exacte des contrôles. Ce site ne propose aucun avertissement en temps réel.` },
      { q: `Pourquoi l’Oise compte-t-elle autant de radars ?`, a: `Le fichier ne donne pas les raisons d’implantation. On peut seulement constater que l’Oise, avec ${h.num(D(h)['60'].total)} radars fixes, est traversée par de grands axes vers Paris et le nord du pays, et que ${h.num(D(h)['60'].types.ETT ?? 0)} de ses radars sont des tourelles, presque toutes mises en service depuis 2018. Les implantations sont décidées par l’État à partir des relevés d’accidents.` },
    ],
    body: (h) => {
      const t = N(h).types;
      return `<h2>Ce que contient le fichier</h2>
<p>Chaque ligne décrit un radar : son numéro, son type, la date de mise en service, la vitesse maximale contrôlée (VMA) et sa position. La vitesse contrôlée manque pour les radars de feu rouge et de passage à niveau, qui ne mesurent pas une vitesse, et pour une partie des radars tourelles. Sur les ${h.num(vmaTotal(h))} radars dont la limite est publiée, ${h.num(vmaN(h, '80'))} contrôlent du 80 km/h, ${h.num(vmaN(h, '90'))} du 90, ${h.num(vmaN(h, '50'))} du 50 et ${h.num(vmaN(h, '70'))} du 70 ; les autoroutes à 130 n’en comptent que ${h.num(vmaN(h, '130'))}. ${h.src('radarsDataset', 'Le jeu de données est sur data.gouv.fr')}.</p>
${h.table(['Type', 'Nombre', 'Ce qu’il contrôle'], [['Tourelle', h.num(t.ETT), 'vitesse, souvent plusieurs voies et deux sens'], ['Fixe classique', h.num(t.ETF), 'vitesse, un sens'], ['Discriminant', h.num(t.ETD), 'vitesse, distingue voitures et poids lourds'], ['Feu rouge', h.num(t.ETFR), 'franchissement du feu'], ['Passage à niveau', h.num(t.ETPN), 'franchissement du passage'], ['Tronçon', h.num(t.ETVM), 'vitesse moyenne entre deux points'], ['Urbain', h.num(t.ETU), 'vitesse et feux en ville']], `Radars fixes par type, fichier du ${h.date(h.S.meta.fichier)}`, ['l', 'r', 'l'])}
<h2>Lire la colonne « 1er point dès »</h2>
<p>Un radar fixe retient votre vitesse après une marge de ${h.num(h.P.marge.fixe_kmh)} km/h, ou de ${h.num(h.P.marge.fixe_pct * 100)} % au-dessus de ${h.num(h.P.marge.seuil_kmh)} km/h. Le premier point tombe quand l’excès retenu atteint 5 km/h. Sur un radar à 80 km/h, il faut donc avoir été mesuré à ${h.num(h.M.mesureePourRetenue(85, 'fixe'))} km/h ; sur un radar à 130, à ${h.num(h.M.mesureePourRetenue(135, 'fixe'))} km/h. La colonne « délit dès » applique la même règle au seuil de 50 km/h d’excès retenu. Le détail est sur la page de la ${h.a('marge-erreur-radar', 'marge d’erreur des radars')}.</p>
<!--mini:seuils-->
<h2>Les radars récents</h2>
<p>${h.num(N(h).recents)} radars du fichier ont été mis en service depuis janvier 2023, en grande majorité des tourelles, avec des radars discriminants et les radars urbains. Le plus ancien encore listé date de ${h.S.national.plusAncien.slice(0, 4)}. Les types sont décrits un par un sur la page ${h.a('radar-fixe', 'des radars fixes')}.</p>`;
    },
  },
  en: {
    slug: 'speed-camera-map-france',
    nav: 'Cameras by département',
    card: 'All 3,309 fixed cameras, département by département, with their limit.',
    title: 'Speed cameras near me in France: map of 3,309 cameras',
    description: 'Map of fixed speed cameras in France: number by département and type, the limit checked, and for each camera the measured speed that costs a point. Free.',
    h1: 'Fixed speed cameras near you, département by département',
    intro: 'Pick a département: the number of cameras of each type, then the map and list of each one, with the speed from which it costs points.',
    resume: (h) => `The French Interior Ministry publishes on data.gouv.fr the list of fixed automatic speed cameras, with their type, installation date, the speed they check and their coordinates. The file read here, dated ${h.date(h.S.meta.fichier)}, lists ${h.num(h.S.meta.radars)}. We have attached each one to its town and département: ${top(h, 4)} are the best-equipped départements; ${bas(h, 3)} the least, with Mayotte having none. Tower cameras, mounted on a pole and able to check several lanes in both directions, are now the most common (${h.num(N(h).types.ETT)}). For every camera whose limit is published, the tool gives the measured speed from which a point is lost, then that of the 50 km/h-over criminal offence. The file does not include mobile units, camera cars or roadworks cameras moved as works progress.`,
    faqs: (h) => [
      { q: 'Are mobile cameras and camera cars on the map?', a: 'No. The ministry’s public file only lists fixed equipment: standard, tower, discriminating, average-speed, red-light, level-crossing and urban cameras. Unmarked cars with an on-board camera, police speed guns and roadworks cameras are not published, and their position changes every day, so no list of them can be complete.' },
      { q: 'Can a camera in the file be switched off?', a: 'Yes. The file is updated roughly once a year, and a camera can be vandalised, under maintenance or moved between two versions. The file date is shown above the tool. A listed camera is best treated as active: driving at the limit is the only reliable protection.' },
      { q: 'Is it legal to look up camera locations in France?', a: 'Yes: the list is published by the government itself, under an open licence. What is banned is using, while driving, a detector that picks up cameras from their emissions. Driving apps signal danger zones rather than exact enforcement points. This site gives no real-time alerts.' },
      { q: 'Why are there so many cameras in the Oise?', a: `The file gives no reasons. One can only note that the Oise, with ${h.num(D(h)['60'].total)} fixed cameras, is crossed by major routes into Paris and the north, and that ${h.num(D(h)['60'].types.ETT ?? 0)} of its cameras are tower units, mostly installed since 2018. Sites are chosen by the State from accident records.` },
    ],
    body: (h) => {
      const t = N(h).types;
      return `<h2>What the file contains</h2>
<p>Each row describes one camera: its number, type, installation date, the maximum speed checked (VMA) and its position. The speed is missing for red-light and level-crossing cameras, which do not measure speed, and for some tower cameras. Of the ${h.num(vmaTotal(h))} cameras with a published limit, ${h.num(vmaN(h, '80'))} check 80 km/h, ${h.num(vmaN(h, '90'))} check 90, ${h.num(vmaN(h, '50'))} check 50 and ${h.num(vmaN(h, '70'))} check 70; 130 km/h motorways have only ${h.num(vmaN(h, '130'))}. ${h.src('radarsDataset', 'The dataset is on data.gouv.fr')}.</p>
${h.table(['Type', 'Number', 'What it checks'], [['Tower', h.num(t.ETT), 'speed, often several lanes and both directions'], ['Standard fixed', h.num(t.ETF), 'speed, one direction'], ['Discriminating', h.num(t.ETD), 'speed, tells cars from lorries'], ['Red light', h.num(t.ETFR), 'running the light'], ['Level crossing', h.num(t.ETPN), 'crossing on red'], ['Average speed', h.num(t.ETVM), 'average speed between two points'], ['Urban', h.num(t.ETU), 'speed and lights in town']], `Fixed cameras by type, file of ${h.date(h.S.meta.fichier)}`, ['l', 'r', 'l'])}
<h2>Reading the “1st point from” column</h2>
<p>A fixed camera records your speed after a margin of ${h.num(h.P.marge.fixe_kmh)} km/h, or ${h.num(h.P.marge.fixe_pct * 100)}% above ${h.num(h.P.marge.seuil_kmh)} km/h. The first point goes when the recorded excess reaches 5 km/h. On an 80 km/h camera you must therefore have been measured at ${h.num(h.M.mesureePourRetenue(85, 'fixe'))} km/h; on a 130 camera, at ${h.num(h.M.mesureePourRetenue(135, 'fixe'))} km/h. The “offence from” column applies the same rule to the 50 km/h recorded-excess threshold. Details are on the ${h.a('marge-erreur-radar', 'camera margin of error page')}.</p>
<!--mini:seuils-->
<h2>Recent cameras</h2>
<p>${h.num(N(h).recents)} cameras in the file have been installed since January 2023, mostly tower units, plus discriminating and urban cameras. The oldest still listed dates from ${h.S.national.plusAncien.slice(0, 4)}. The types are described one by one on the ${h.a('radar-fixe', 'fixed camera types page')}.</p>`;
    },
  },
});
