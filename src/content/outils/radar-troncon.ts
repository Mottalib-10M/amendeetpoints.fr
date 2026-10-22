import { defineGuide, type Helpers } from '../../lib/guide-types';

type Dep = { nom: string; types: Record<string, number> };
const N = (h: Helpers) => h.S.national;
/** Départements qui comptent le plus de radars tronçons dans le fichier. */
const topVm = (h: Helpers) => Object.values(h.S.deps as unknown as Record<string, Dep>).filter((d) => (d.types.ETVM ?? 0) > 0).sort((a, b) => b.types.ETVM - a.types.ETVM || a.nom.localeCompare(b.nom)).slice(0, 4);
const moy = (h: Helpers, km: number, s: number) => h.M.vitesseMoyenne(km, s);

export default defineGuide({
  id: 'radar-troncon',
  group: 'radars',
  order: 4,
  tool: 'exces',
  outil: { mode: 'troncon', defaultKm: 3.2, defaultSecondes: 110, defaultLimite: 90 },
  related: ['carte-radars', 'marge-erreur-radar', 'radar-fixe', 'exces-moins-de-20', 'limitations-de-vitesse'],
  sources: ['radarsDataset', 'arreteCinemometres', 'r413_14', 'radarsCarte'],
  fr: {
    slug: 'radar-troncon',
    nav: 'Radar tronçon',
    card: 'Vitesse moyenne entre deux points : distance, temps, amende.',
    title: 'Radar tronçon : calcul de la vitesse moyenne et de l’amende',
    description: 'Radar tronçon : la vitesse moyenne se calcule sur la distance et le temps entre deux points, marge de 5 km/h ou 5 % déduite. Calculez la vôtre et l’amende.',
    h1: 'Radar tronçon : votre vitesse moyenne et l’amende',
    intro: 'Le radar tronçon ne vous flashe pas à un endroit : il divise une distance par un temps. Entrez les deux, l’outil fait le reste.',
    resume: (h) => `Un radar tronçon, ou radar de vitesse moyenne, photographie chaque véhicule à l’entrée et à la sortie d’une section de route de quelques kilomètres, puis divise la distance par le temps de parcours. Le fichier du ministère de l’Intérieur en recense ${h.num(N(h).types.ETVM)} en France au ${h.date(h.S.meta.fichier)}. Sa vitesse moyenne est traitée comme celle d’un radar fixe : la marge de ${h.num(h.P.marge.fixe_kmh)} km/h, ou de ${h.num(h.P.marge.fixe_pct * 100)} % au-dessus de ${h.num(h.P.marge.seuil_kmh)} km/h, en est déduite, puis l’excès suit le barème ordinaire de l’article R413-14. Ralentir brutalement à la sortie ne sert à rien, puisque seule la moyenne compte, et rouler vite au début puis lentement à la fin peut donner une moyenne conforme. Exemple : ${h.num(3.2, 1)} km parcourus en 1 minute 50 donnent une moyenne de ${h.num(moy(h, 3.2, 110), 1)} km/h ; sur une section à 90, la vitesse retenue est de ${h.num(h.M.vitesseRetenue(moy(h, 3.2, 110), 'fixe'))} km/h, sans infraction. En 1 minute 40, la moyenne monte à ${h.num(moy(h, 3.2, 100), 1)} km/h, et l’excès apparaît.`,
    faqs: (h) => [
      { q: 'Le radar tronçon peut-il flasher en plus pour un excès ponctuel ?', a: 'Le radar tronçon calcule une moyenne : un pic de vitesse au milieu de la section n’est pas sanctionné en tant que tel s’il est compensé. En revanche, un radar fixe ou une voiture radar peuvent se trouver sur la même route et mesurer une vitesse instantanée. Les deux constats sont indépendants.' },
      { q: 'Que se passe-t-il si je m’arrête sur la section ?', a: 'Un arrêt allonge le temps de parcours et fait baisser la moyenne calculée. Le radar ne sait pas pourquoi le temps est long : il compare seulement l’heure d’entrée et l’heure de sortie. Un temps de parcours inférieur à celui de la limite reste, lui, un excès, quoi qu’il se soit passé entre les deux points.' },
      { q: 'Où se trouvent les radars tronçons ?', a: `Le fichier public en compte ${h.num(N(h).types.ETVM)} ; les départements qui en ont le plus sont ${topVm(h).map((d) => `${d.nom} (${h.num(d.types.ETVM)})`).join(', ')}. La carte par département les affiche avec le filtre « Radar tronçon », position à l’appui, avec la limite contrôlée sur la section.` },
    ],
    body: (h) => `<h2>La formule</h2>
<p>Vitesse moyenne = distance en kilomètres × 3 600 ÷ temps en secondes. La longueur de la section est fixée par l’administration ; le temps est celui qui sépare les deux photographies. La marge de l’${h.src('arreteCinemometres', 'arrêté du 4 juin 2009')} est ensuite retirée, comme pour un radar fixe.</p>
${h.table(['Temps sur 5 km', 'Vitesse moyenne', 'Retenue', 'Sur une section à 90'], [[`3 min 30`, 210], [`3 min 20`, 200], [`3 min 10`, 190], [`3 min`, 180], [`2 min 45`, 165], [`2 min 30`, 150]].map(([t, s]) => { const v = moy(h, 5, s as number); const r = h.M.sanctionVitesse(Math.floor(v * 10) / 10, 90, 'fixe'); return [t as string, `${h.num(v, 1)} km/h`, `${h.num(r.retenue)} km/h`, r.infraction ? `${h.eur(r.amendes!.forfaitaire)}, ${h.num(r.points)} pt` : 'pas d’infraction']; }), 'Temps de parcours d’une section de 5 km et sanction', ['l', 'r', 'r', 'r'])}
<!--mini:troncon-->
<h2>Pourquoi le temps compte plus que le compteur</h2>
<p>Sur cinq kilomètres, dix secondes de moins suffisent à faire passer une moyenne de ${h.num(moy(h, 5, 200), 1)} à ${h.num(moy(h, 5, 190), 1)} km/h. Le régulateur de vitesse calé sur la limite est le moyen le plus simple de rester sous le seuil, puisque la marge du radar absorbe les petits écarts du compteur. Les autres seuils du barème, et le passage en 4e classe sur une section limitée à 50 km/h, sont détaillés sur la page ${h.a('exces-moins-de-20', 'des petits excès')}.</p>`,
  },
  en: {
    slug: 'average-speed-cameras-france',
    nav: 'Average-speed cameras',
    card: 'Average speed between two points: distance, time, fine.',
    title: 'Average speed cameras in France: work out your fine',
    description: 'Average speed cameras in France (radar tronçon): distance over time between two points, minus the 5 km/h or 5% margin. Work out your speed and the fine.',
    h1: 'Average speed cameras: your average speed and the fine',
    intro: 'An average-speed camera does not catch you at one spot: it divides a distance by a time. Enter both and the tool does the rest.',
    resume: (h) => `An average-speed camera, known in France as a radar tronçon, photographs every vehicle at the start and end of a stretch of road a few kilometres long, then divides the distance by the travel time. The Interior Ministry’s file lists ${h.num(N(h).types.ETVM)} in France as of ${h.date(h.S.meta.fichier)}. Its average speed is treated like that of a fixed camera: the margin of ${h.num(h.P.marge.fixe_kmh)} km/h, or ${h.num(h.P.marge.fixe_pct * 100)}% above ${h.num(h.P.marge.seuil_kmh)} km/h, is subtracted, then the excess follows the ordinary scale of article R413-14. Braking hard at the exit achieves nothing, since only the average counts, and driving fast at the start and slowly at the end can give a lawful average. Example: ${h.num(3.2, 1)} km covered in 1 minute 50 gives an average of ${h.num(moy(h, 3.2, 110), 1)} km/h; on a 90 section the recorded speed is ${h.num(h.M.vitesseRetenue(moy(h, 3.2, 110), 'fixe'))} km/h, no offence. In 1 minute 40, the average rises to ${h.num(moy(h, 3.2, 100), 1)} km/h and the excess appears.`,
    faqs: (h) => [
      { q: 'Can an average-speed camera also catch a brief burst of speed?', a: 'It calculates an average: a peak in the middle of the section is not penalised as such if it is offset. But a fixed camera or a camera car may stand on the same road and measure an instant speed. The two records are independent of each other.' },
      { q: 'What if I stop on the section?', a: 'A stop lengthens the travel time and lowers the calculated average. The camera does not know why the time is long: it only compares the entry and exit times. A travel time shorter than the limit allows is still an excess, whatever happened between the two points.' },
      { q: 'Where are the average-speed cameras?', a: `The public file lists ${h.num(N(h).types.ETVM)}; the départements with the most are ${topVm(h).map((d) => `${d.nom} (${h.num(d.types.ETVM)})`).join(', ')}. The map by département shows them with the “Average-speed camera” filter, with their position and the limit enforced over the section.` },
    ],
    body: (h) => `<h2>The formula</h2>
<p>Average speed = distance in kilometres × 3,600 ÷ time in seconds. The section length is set by the authorities; the time is the gap between the two photographs. The margin from the ${h.src('arreteCinemometres', 'order of 4 June 2009')} is then taken off, as for a fixed camera.</p>
${h.table(['Time over 5 km', 'Average speed', 'Recorded', 'On a 90 section'], [[`3 min 30`, 210], [`3 min 20`, 200], [`3 min 10`, 190], [`3 min`, 180], [`2 min 45`, 165], [`2 min 30`, 150]].map(([t, s]) => { const v = moy(h, 5, s as number); const r = h.M.sanctionVitesse(Math.floor(v * 10) / 10, 90, 'fixe'); return [t as string, `${h.num(v, 1)} km/h`, `${h.num(r.retenue)} km/h`, r.infraction ? `${h.eur(r.amendes!.forfaitaire)}, ${h.num(r.points)} pt` : 'no offence']; }), 'Travel time over a 5 km section and the penalty', ['l', 'r', 'r', 'r'])}
<!--mini:troncon-->
<h2>Why time matters more than the speedometer</h2>
<p>Over five kilometres, ten seconds less is enough to take an average from ${h.num(moy(h, 5, 200), 1)} to ${h.num(moy(h, 5, 190), 1)} km/h. Cruise control set at the limit is the simplest way to stay under the threshold, since the camera margin absorbs small speedometer gaps. The other bands of the scale, and the switch to class 4 on a section limited to 50 km/h, are on the ${h.a('exces-moins-de-20', 'small excess page')}.</p>`,
  },
});
