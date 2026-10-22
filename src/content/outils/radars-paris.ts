import { defineGuide, type Helpers } from '../../lib/guide-types';

type Dep = { nom: string; total: number; types: Record<string, number>; vma: Record<string, number>; recents: number; plusAncien: string; plusRecent: string };
const DEP = (h: Helpers, c: string) => (h.S.deps as unknown as Record<string, Dep>)[c];
const PA = (h: Helpers) => DEP(h, '75');
const ty = (h: Helpers, k: string) => PA(h).types[k] ?? 0;
const vm = (h: Helpers, k: string) => PA(h).vma[k] ?? 0;
/** Exemple : 62 km/h mesurés par un radar fixe sur le périphérique à 50. */
const ex = (h: Helpers) => h.M.sanctionVitesse(62, 50, 'fixe');
const COURONNE = ['92', '93', '94'];
const DANS: Record<string, string> = { '92': 'dans les ', '93': 'en ', '94': 'dans le ' };

export default defineGuide({
  id: 'radars-paris',
  group: 'radars',
  order: 2,
  tool: 'radars',
  outil: { defaultDep: '75' },
  related: ['carte-radars', 'amende-feu-rouge', 'radar-troncon', 'exces-moins-de-20', 'amende-stationnement'],
  sources: ['radarsDataset', 'parisPeriph', 'r413_14', 'arreteCinemometres'],
  fr: {
    slug: 'radars-paris',
    nav: 'Radars à Paris',
    card: 'Les radars fixes de Paris, le périphérique à 50 km/h, et ce que coûte un flash.',
    title: 'Radars à Paris : radars fixes, périphérique à 50 km/h',
    description: 'Radars à Paris : les radars fixes du fichier officiel par type, feux rouges compris, aucun radar tronçon, et le périphérique à 50 km/h depuis octobre 2024.',
    h1: 'Radars à Paris et radar tronçon du périphérique : ce que dit le fichier',
    intro: 'La liste et la carte des radars fixes de Paris sont ouvertes ci-dessous ; changez de département pour la petite couronne.',
    resume: (h) => `Le fichier des radars fixes publié par le ministère de l’Intérieur sur data.gouv.fr, daté du ${h.date(h.S.meta.fichier)}, compte ${h.num(PA(h).total)} radars dans Paris : ${h.num(ty(h, 'ETF'))} radars fixes classiques, ${h.num(ty(h, 'ETFR'))} radars de feu rouge et ${h.num(ty(h, 'ETD'))} radar discriminant. Il n’y a dans ce fichier ni radar tourelle, ni radar tronçon : aucun contrôle de vitesse moyenne n’est donc listé sur le boulevard périphérique. Parmi les radars dont la limite est publiée, ${h.num(vm(h, '50'))} contrôlent du 50 km/h et ${h.num(vm(h, '30'))} du 30. Le périphérique, lui, est passé de 70 à 50 km/h à partir du 1er octobre 2024, sur toute sa longueur le 10 octobre, d’après la Ville de Paris. Sur une limite à 50, un radar fixe retire la marge de ${h.num(h.P.marge.fixe_kmh)} km/h : mesuré à 62 km/h, on est retenu à ${h.num(ex(h).retenue)} km/h, ce qui coûte ${h.eur(ex(h).amendes!.forfaitaire)} et ${h.num(ex(h).points)} point. Les radars mobiles et les voitures radars, nombreux en ville, ne figurent dans aucun fichier public.`,
    faqs: (h) => [
      { q: 'Y a-t-il un radar tronçon sur le périphérique parisien ?', a: `Pas dans le fichier officiel du ${h.date(h.S.meta.fichier)} : il ne recense aucun radar de vitesse moyenne à Paris, et ${h.num(h.S.national.types.ETVM)} dans toute la France. Les radars de Paris sont des radars fixes classiques, des radars de feu rouge et un radar discriminant, qui mesurent une vitesse instantanée ou le franchissement d’un feu.` },
      { q: 'Depuis quand le périphérique est-il limité à 50 km/h ?', a: 'Depuis octobre 2024. La Ville de Paris a abaissé la limite de 70 à 50 km/h à partir du 1er octobre, d’abord sur la chaussée intérieure entre la porte des Lilas et la porte d’Orléans, puis sur tout le boulevard le 10 octobre, au fil de la pose d’environ 160 panneaux.' },
      { q: 'À partir de quelle vitesse un radar du périphérique retire-t-il un point ?', a: `À ${h.num(h.M.mesureePourRetenue(55, 'fixe'))} km/h mesurés par un radar fixe. La marge de ${h.num(h.P.marge.fixe_kmh)} km/h ramène la vitesse retenue à 55 km/h, soit 5 km/h d’excès, le premier palier qui retire un point. En dessous, l’excès de moins de 5 km/h coûte une amende sans retrait de point.` },
      { q: 'La petite couronne compte-t-elle plus de radars que Paris ?', a: `Oui. Le fichier en compte ${COURONNE.map((c) => `${h.num(DEP(h, c).total)} ${DANS[c]}${DEP(h, c).nom}`).join(', ')}, contre ${h.num(PA(h).total)} à Paris. La Seine-Saint-Denis est la seule des trois où les tourelles dominent, avec ${h.num(DEP(h, '93').types.ETT ?? 0)} radars de ce type, alors que Paris n’en compte aucune.` },
    ],
    body: (h) => `<h2>Les radars fixes de Paris par type</h2>
${h.table(['Type', 'Paris', ...COURONNE.map((c) => DEP(h, c).nom)], [['Fixe classique', 'ETF'], ['Feu rouge', 'ETFR'], ['Discriminant', 'ETD'], ['Tourelle', 'ETT'], ['Tronçon', 'ETVM'], ['Urbain', 'ETU']].map(([n, k]) => [n, h.num(ty(h, k)), ...COURONNE.map((c) => h.num(DEP(h, c).types[k] ?? 0))]), `Radars fixes par type, fichier du ${h.date(h.S.meta.fichier)} (data.gouv.fr)`, ['l', 'r', 'r', 'r', 'r'])}
<p>Paris se distingue par la part de ses radars de feu rouge, ${h.num(ty(h, 'ETFR'))} sur ${h.num(PA(h).total)}, et par l’absence de tourelles, qui sont pourtant le type le plus répandu en France. Le plus ancien radar parisien du fichier date de ${PA(h).plusAncien.slice(0, 4)}, le plus récent de ${PA(h).plusRecent.slice(0, 4)}. ${h.src('radarsDataset', 'Le jeu de données')} est sous Licence Ouverte ; la limite affichée sur place fait foi si elle diffère de celle du fichier.</p>
<!--mini:periph-->
<h2>Le périphérique à 50 km/h</h2>
<p>D’après ${h.src('parisPeriph', 'la Ville de Paris')}, la limite du boulevard périphérique est passée de 70 à 50 km/h à partir du 1er octobre 2024, d’abord sur la chaussée intérieure de la porte des Lilas à la porte d’Orléans, puis partout le 10 octobre. Sur une limite à 50, les paliers de l’article R413-14 tombent vite : 20 km/h d’excès retenu, soit ${h.num(h.M.mesureePourRetenue(70, 'fixe'))} km/h mesurés, coûtent 2 points ; 30 km/h d’excès, soit ${h.num(h.M.mesureePourRetenue(80, 'fixe'))} km/h mesurés, 3 points et une suspension possible. Le détail des seuils est sur la page ${h.a('exces-moins-de-20', 'des excès de moins de 20 km/h')}.</p>
<h2>Feux rouges et stationnement</h2>
<p>Un radar de feu rouge ne mesure pas de vitesse : il photographie le franchissement du feu, puni de ${h.eur(h.M.infraction('feu_rouge').amendes!.forfaitaire)} et ${h.num(h.M.infraction('feu_rouge').points)} points, comme l’explique la page ${h.a('amende-feu-rouge', 'de l’amende pour feu rouge')}. Le stationnement payant non réglé ne passe par aucun radar : il donne lieu à un forfait post-stationnement fixé par la Ville, détaillé sur la page ${h.a('amende-stationnement', 'des amendes de stationnement')}.</p>`,
  },
  en: {
    slug: 'speed-cameras-paris',
    nav: 'Cameras in Paris',
    card: 'Paris’s fixed cameras, the 50 km/h ring road, and what a flash costs.',
    title: 'Speed cameras in Paris: fixed cameras, ring road at 50 km/h',
    description: 'Speed cameras in Paris: the fixed cameras in the official file by type, red-light cameras included, no average-speed camera, and the ring road at 50 since 2024.',
    h1: 'Speed cameras in Paris and on the ring road: what the file shows',
    intro: 'The list and map of Paris’s fixed cameras are open below; switch département for the inner suburbs.',
    resume: (h) => `The list of fixed cameras published by the French Interior Ministry on data.gouv.fr, dated ${h.date(h.S.meta.fichier)}, counts ${h.num(PA(h).total)} cameras in Paris: ${h.num(ty(h, 'ETF'))} standard fixed cameras, ${h.num(ty(h, 'ETFR'))} red-light cameras and ${h.num(ty(h, 'ETD'))} discriminating camera. The file contains no tower camera and no average-speed camera, so no average-speed check is listed on the boulevard périphérique, the ring road. Of the cameras with a published limit, ${h.num(vm(h, '50'))} check 50 km/h and ${h.num(vm(h, '30'))} check 30. The ring road itself went from 70 to 50 km/h from 1 October 2024, along its whole length on 10 October, according to the City of Paris. On a 50 limit, a fixed camera takes off a ${h.num(h.P.marge.fixe_kmh)} km/h margin: measured at 62 km/h, you are recorded at ${h.num(ex(h).retenue)} km/h, which costs ${h.eur(ex(h).amendes!.forfaitaire)} and ${h.num(ex(h).points)} point. Mobile cameras and camera cars, common in the city, appear in no public file.`,
    faqs: (h) => [
      { q: 'Is there an average-speed camera on the Paris ring road?', a: `Not in the official file of ${h.date(h.S.meta.fichier)}: it lists no average-speed camera in Paris, and ${h.num(h.S.national.types.ETVM)} across France. Paris’s cameras are standard fixed cameras, red-light cameras and one discriminating camera, which measure an instant speed or a red-light crossing.` },
      { q: 'Since when has the ring road been limited to 50 km/h?', a: 'Since October 2024. The City of Paris lowered the limit from 70 to 50 km/h from 1 October, first on the inner carriageway between Porte des Lilas and Porte d’Orléans, then on the whole road on 10 October, as about 160 signs went up.' },
      { q: 'From what speed does a ring-road camera take a point?', a: `From ${h.num(h.M.mesureePourRetenue(55, 'fixe'))} km/h measured by a fixed camera. The ${h.num(h.P.marge.fixe_kmh)} km/h margin brings the recorded speed to 55 km/h, 5 km/h over, the first step that costs a point. Below that, an excess of under 5 km/h means a fine with no points.` },
      { q: 'Do the inner suburbs have more cameras than Paris?', a: `Yes. The file lists ${COURONNE.map((c) => `${h.num(DEP(h, c).total)} in ${DEP(h, c).nom}`).join(', ')}, against ${h.num(PA(h).total)} in Paris. Seine-Saint-Denis is the only one of the three where tower cameras dominate, with ${h.num(DEP(h, '93').types.ETT ?? 0)} of them, while Paris itself has none in the official file.` },
    ],
    body: (h) => `<h2>Paris’s fixed cameras by type</h2>
${h.table(['Type', 'Paris', ...COURONNE.map((c) => DEP(h, c).nom)], [['Standard fixed', 'ETF'], ['Red light', 'ETFR'], ['Discriminating', 'ETD'], ['Tower', 'ETT'], ['Average speed', 'ETVM'], ['Urban', 'ETU']].map(([n, k]) => [n, h.num(ty(h, k)), ...COURONNE.map((c) => h.num(DEP(h, c).types[k] ?? 0))]), `Fixed cameras by type, file of ${h.date(h.S.meta.fichier)} (data.gouv.fr)`, ['l', 'r', 'r', 'r', 'r'])}
<p>Paris stands out for its share of red-light cameras, ${h.num(ty(h, 'ETFR'))} of ${h.num(PA(h).total)}, and for having no tower cameras, even though they are the most common type in France. The oldest Paris camera in the file dates from ${PA(h).plusAncien.slice(0, 4)}, the newest from ${PA(h).plusRecent.slice(0, 4)}. ${h.src('radarsDataset', 'The dataset')} is under an open licence; the limit posted on site prevails if it differs from the file.</p>
<!--mini:periph-->
<h2>The ring road at 50 km/h</h2>
<p>According to ${h.src('parisPeriph', 'the City of Paris')}, the boulevard périphérique limit went from 70 to 50 km/h from 1 October 2024, first on the inner carriageway from Porte des Lilas to Porte d’Orléans, then everywhere on 10 October. On a 50 limit, the steps of article R413-14 come quickly: 20 km/h recorded excess, or ${h.num(h.M.mesureePourRetenue(70, 'fixe'))} km/h measured, costs 2 points; 30 km/h excess, or ${h.num(h.M.mesureePourRetenue(80, 'fixe'))} km/h measured, 3 points and a possible suspension. The thresholds are set out on the ${h.a('exces-moins-de-20', 'under 20 km/h over page')}.</p>
<h2>Red lights and parking</h2>
<p>A red-light camera measures no speed: it photographs the vehicle crossing on red, which costs ${h.eur(h.M.infraction('feu_rouge').amendes!.forfaitaire)} and ${h.num(h.M.infraction('feu_rouge').points)} points, as the ${h.a('amende-feu-rouge', 'red light fine page')} explains. Unpaid street parking involves no camera: it leads to a post-parking charge set by the City, covered on the ${h.a('amende-stationnement', 'parking fines page')}.</p>`,
  },
});
