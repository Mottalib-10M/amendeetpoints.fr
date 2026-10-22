import { defineGuide, type Helpers } from '../../lib/guide-types';

type Dep = { nom: string; types: Record<string, number> };
const T = (h: Helpers) => h.S.national.types;
const top = (h: Helpers, t: string, n = 3) => Object.values(h.S.deps as unknown as Record<string, Dep>).filter((d) => (d.types[t] ?? 0) > 0).sort((a, b) => b.types[t] - a.types[t] || a.nom.localeCompare(b.nom)).slice(0, n).map((d) => `${d.nom} (${h.num(d.types[t])})`).join(', ');

export default defineGuide({
  id: 'radar-fixe',
  group: 'radars',
  order: 2,
  tool: 'radars',
  outil: { defaultDep: '60', defaultType: 'ETT' },
  related: ['carte-radars', 'flash-radar-delai', 'radar-troncon', 'amende-feu-rouge', 'marge-erreur-radar'],
  sources: ['radarsDataset', 'radarsCarte', 'arreteCinemometres', 'r412_30'],
  fr: {
    slug: 'radar-fixe',
    nav: 'Types de radars fixes',
    card: 'Tourelle, discriminant, feu rouge, passage à niveau, urbain : qui fait quoi.',
    title: 'Radar fixe : tourelle, discriminant, feu rouge, urbain',
    description: 'Radar fixe en France : les sept types du fichier officiel (tourelle, classique, discriminant, feu rouge, tronçon, urbain…), leur nombre et où ils sont.',
    h1: 'Radar fixe : les sept types et où ils se trouvent',
    intro: 'Le fichier public distingue sept familles de radars fixes. Choisissez un type et un département pour voir combien il y en a et où.',
    resume: (h) => `Le ministère de l’Intérieur classe les radars automatiques fixes en sept types dans le fichier qu’il publie sur data.gouv.fr, ici dans sa version du ${h.date(h.S.meta.fichier)}. Les radars tourelles (${h.num(T(h).ETT)}) sont les plus nombreux : installés depuis 2019 d’après le fichier, perchés sur un mât, ils peuvent surveiller plusieurs voies et les deux sens de circulation. Viennent ensuite les radars fixes classiques (${h.num(T(h).ETF)}), plus anciens, et les radars discriminants (${h.num(T(h).ETD)}), capables de distinguer un poids lourd d’une voiture et de lui appliquer sa propre limite. Les radars de feu rouge (${h.num(T(h).ETFR)}) et de passage à niveau (${h.num(T(h).ETPN)}) sanctionnent un franchissement, pas une vitesse. Les radars tronçons (${h.num(T(h).ETVM)}) calculent une vitesse moyenne, et les radars urbains (${h.num(T(h).ETU)}), les plus récents, contrôlent la vitesse en ville. Pour chaque radar de vitesse dont la limite est publiée, l’outil indique à quelle vitesse mesurée un point est retiré.`,
    faqs: (h) => [
      { q: 'Un radar tourelle flashe-t-il dans les deux sens ?', a: 'Il en a la capacité : le dispositif placé en hauteur peut couvrir plusieurs voies et les deux sens. Toutes les tourelles ne sont pas équipées pour verbaliser dans les deux sens en même temps, et rien ne permet de savoir, depuis la route, laquelle l’est. Le fichier public n’indique pas le sens contrôlé.' },
      { q: 'Que contrôle un radar discriminant ?', a: 'Il mesure la vitesse et reconnaît le type de véhicule, ce qui lui permet d’appliquer aux poids lourds leur limite propre, plus basse. Pour une voiture, il fonctionne comme un radar fixe ordinaire, avec la même marge. Le fichier en recense ' + h.num(T(h).ETD) + ', surtout sur les grands axes.' },
      { q: 'Combien coûte un radar de feu rouge ?', a: `Le franchissement d’un feu rouge est une contravention de 4e classe : ${h.eur(h.P.classes['4'].forfaitaire)} d’amende forfaitaire et 4 points, avec une suspension possible de trois ans par le juge. Les départements qui comptent le plus de radars de feu rouge sont ${top(h, 'ETFR')}.` },
    ],
    body: (h) => `<h2>Les sept types, en chiffres</h2>
${h.table(['Type', 'Nombre', 'Où il y en a le plus'], [['Tourelle (ETT)', h.num(T(h).ETT), top(h, 'ETT')], ['Fixe classique (ETF)', h.num(T(h).ETF), top(h, 'ETF')], ['Discriminant (ETD)', h.num(T(h).ETD), top(h, 'ETD')], ['Feu rouge (ETFR)', h.num(T(h).ETFR), top(h, 'ETFR')], ['Passage à niveau (ETPN)', h.num(T(h).ETPN), top(h, 'ETPN')], ['Tronçon (ETVM)', h.num(T(h).ETVM), top(h, 'ETVM')], ['Urbain (ETU)', h.num(T(h).ETU), top(h, 'ETU')]], `Radars fixes par type et départements les plus équipés, fichier du ${h.date(h.S.meta.fichier)}`, ['l', 'r', 'l'])}
<p>Les codes entre parenthèses sont ceux du ${h.src('radarsDataset', 'fichier publié sur data.gouv.fr')}. Les radars classiques datent pour la plupart des années 2000 et 2010 ; aucun n’a été mis en service après 2020 dans le fichier. Les tourelles et les radars urbains en ont pris le relais.</p>
<h2>Ce qui ne change pas d’un type à l’autre</h2>
<p>Quel que soit le type, un radar fixe applique la même marge technique, ${h.num(h.P.marge.fixe_kmh)} km/h sous ${h.num(h.P.marge.seuil_kmh)} km/h et ${h.num(h.P.marge.fixe_pct * 100)} % au-dessus, et le même barème. Un radar urbain qui contrôle du 50 km/h retire un point dès ${h.num(h.M.mesureePourRetenue(55, 'fixe'))} km/h mesurés et sanctionne en 4e classe, comme tout excès en agglomération.</p>
<!--mini:seuils_1-->
<h2>Ce que le fichier ne dit pas</h2>
<p>Ni le sens contrôlé, ni l’état de fonctionnement, ni les radars mobiles. La ${h.a('carte-radars', 'carte par département')} montre la position de chaque radar fixe ; pour les petits excès qu’ils relèvent le plus souvent, voir la page ${h.a('exces-moins-de-20', 'moins de 20 km/h')}.</p>`,
  },
  en: {
    slug: 'speed-camera-types-france',
    nav: 'Types of fixed cameras',
    card: 'Tower, discriminating, red-light, level-crossing, urban: what each does.',
    title: 'Fixed speed cameras in France: the 7 types and where',
    description: 'Fixed speed cameras in France: the seven types in the official file (tower, standard, discriminating, red light, average speed, urban…), how many and where.',
    h1: 'Fixed cameras in France: the seven types and where they are',
    intro: 'The public file sorts fixed cameras into seven families. Pick a type and a département to see how many there are and where.',
    resume: (h) => `The French Interior Ministry sorts fixed automatic cameras into seven types in the file it publishes on data.gouv.fr, here in its version of ${h.date(h.S.meta.fichier)}. Tower cameras (${h.num(T(h).ETT)}) are the most common: installed since 2019 according to the file and mounted on a pole, they can watch several lanes and both directions. Next come standard fixed cameras (${h.num(T(h).ETF)}), older, and discriminating cameras (${h.num(T(h).ETD)}), which can tell a lorry from a car and apply its own limit. Red-light cameras (${h.num(T(h).ETFR)}) and level-crossing cameras (${h.num(T(h).ETPN)}) penalise crossing, not speed. Average-speed cameras (${h.num(T(h).ETVM)}) work out a mean speed, and urban cameras (${h.num(T(h).ETU)}), the newest, check speed in towns. For every speed camera with a published limit, the tool shows the measured speed at which a point is lost.`,
    faqs: (h) => [
      { q: 'Does a tower camera flash in both directions?', a: 'It can: the raised unit can cover several lanes and both directions. Not every tower is set up to record both directions at once, and nothing at the roadside tells you which is. The public file does not state the direction checked.' },
      { q: 'What does a discriminating camera check?', a: 'It measures speed and recognises the vehicle type, so it can apply the lower limit for heavy goods vehicles. For a car it works like an ordinary fixed camera, with the same margin. The file lists ' + h.num(T(h).ETD) + ' of them, mostly on main roads.' },
      { q: 'How much is a red-light camera fine?', a: `Running a red light is a class 4 offence: a ${h.eur(h.P.classes['4'].forfaitaire)} standard fine and 4 points, with a possible three-year suspension by a court. The départements with the most red-light cameras are ${top(h, 'ETFR')}. The same amount applies when the offence is seen by a police officer.` },
    ],
    body: (h) => `<h2>The seven types in figures</h2>
${h.table(['Type', 'Number', 'Where there are most'], [['Tower (ETT)', h.num(T(h).ETT), top(h, 'ETT')], ['Standard fixed (ETF)', h.num(T(h).ETF), top(h, 'ETF')], ['Discriminating (ETD)', h.num(T(h).ETD), top(h, 'ETD')], ['Red light (ETFR)', h.num(T(h).ETFR), top(h, 'ETFR')], ['Level crossing (ETPN)', h.num(T(h).ETPN), top(h, 'ETPN')], ['Average speed (ETVM)', h.num(T(h).ETVM), top(h, 'ETVM')], ['Urban (ETU)', h.num(T(h).ETU), top(h, 'ETU')]], `Fixed cameras by type and best-equipped départements, file of ${h.date(h.S.meta.fichier)}`, ['l', 'r', 'l'])}
<p>The codes in brackets are those of the ${h.src('radarsDataset', 'file published on data.gouv.fr')}. Most standard cameras date from the 2000s and 2010s; none in the file was installed after 2020. Tower and urban cameras have taken over.</p>
<h2>What does not change from one type to another</h2>
<p>Whatever the type, a fixed camera applies the same technical margin, ${h.num(h.P.marge.fixe_kmh)} km/h below ${h.num(h.P.marge.seuil_kmh)} km/h and ${h.num(h.P.marge.fixe_pct * 100)}% above, and the same scale. An urban camera checking 50 km/h takes a point from ${h.num(h.M.mesureePourRetenue(55, 'fixe'))} km/h measured and fines at class 4, like any excess in a built-up area.</p>
<!--mini:seuils_1-->
<h2>What the file does not say</h2>
<p>Neither the direction checked, nor whether the unit works, nor mobile cameras. The ${h.a('carte-radars', 'map by département')} shows where every fixed camera is; for the small excesses they most often catch, see the ${h.a('exces-moins-de-20', 'under 20 km/h page')}.</p>`,
  },
});
