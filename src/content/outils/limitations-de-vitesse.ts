import { defineGuide, type Helpers } from '../../lib/guide-types';

const L = (h: Helpers) => h.P.limites;

export default defineGuide({
  id: 'limitations-de-vitesse',
  group: 'vitesse',
  order: 6,
  tool: 'exces',
  outil: { mode: 'route', defaultVitesse: 100, defaultRoute: 'bidirectionnelle' },
  related: ['exces-moins-de-20', 'permis-probatoire', 'radar-troncon', 'conducteur-etranger', 'marge-erreur-radar'],
  sources: ['spVitesse', 'r413_14', 'arreteCinemometres'],
  fr: {
    slug: 'limitations-de-vitesse',
    nav: 'Limitations de vitesse',
    card: '130, 110, 90, 80, 50 : la limite par route, sous la pluie et en probatoire.',
    title: 'Limitations de vitesse en France : route, pluie, probatoire',
    description: 'Limitations de vitesse en France : 130 km/h sur autoroute, 110 sous la pluie ou en probatoire, 80 sur route à double sens, 50 en ville et dans le brouillard.',
    h1: 'Limitations de vitesse : la limite exacte de votre route',
    intro: 'Type de route, pluie, permis probatoire : choisissez votre situation, l’outil donne la limite qui s’applique et la sanction pour la vitesse mesurée.',
    resume: (h) => `En France, la vitesse maximale autorisée dépend du type de route, de la météo et de l’ancienneté du permis, selon la fiche de Service Public vérifiée le 29 décembre 2025. Par temps sec, elle est de ${h.num(L(h).autoroute.sec)} km/h sur autoroute, ${h.num(L(h).voie_separee.sec)} km/h sur une route à deux chaussées séparées par un terre-plein central, ${h.num(L(h).deux_voies_meme_sens.sec)} km/h sur une section d’au moins deux voies dans le même sens, ${h.num(L(h).bidirectionnelle.sec)} km/h sur une route à double sens sans séparateur et ${h.num(L(h).agglomeration.sec)} km/h en agglomération. Sous la pluie, les trois premières descendent à ${h.num(L(h).autoroute.pluie)}, ${h.num(L(h).voie_separee.pluie)} et ${h.num(L(h).deux_voies_meme_sens.pluie)} km/h. Un conducteur en permis probatoire applique en permanence ces vitesses réduites, et ${h.num(100)} km/h sur les sections d’autoroute limitées à moins de 130. Quand la visibilité tombe sous 50 mètres, la limite est de ${h.num(L(h).brouillard_moins_50m)} km/h partout. L’autorité locale peut abaisser ces vitesses, et porter une route à double sens de sa compétence à 90 km/h : le panneau prime alors sur la règle générale.`,
    faqs: (h) => [
      { q: 'Quand la limitation par temps de pluie s’applique-t-elle ?', a: `Dès que la chaussée est mouillée par la pluie ou d’autres précipitations, sans qu’un panneau soit nécessaire. Sur autoroute, la limite passe de ${h.num(L(h).autoroute.sec)} à ${h.num(L(h).autoroute.pluie)} km/h ; sur une voie à chaussées séparées, de ${h.num(L(h).voie_separee.sec)} à ${h.num(L(h).voie_separee.pluie)}. Un radar ne sait pas toujours qu’il pleut, mais un contrôle avec interception, si.` },
      { q: 'Une route départementale peut-elle être à 90 km/h ?', a: 'Oui. Depuis l’assouplissement de la règle des 80 km/h, le président du conseil départemental, ou le maire sur les routes communales, peut relever la limite à 90 km/h sur certaines routes à double sens. Ces sections sont signalées par des panneaux ; en leur absence, c’est 80 km/h.' },
      { q: 'Les limites probatoires s’appliquent-elles après la fin de la période ?', a: 'Non. Elles valent pendant toute la période probatoire, deux ou trois ans selon la formation suivie, et cessent ensuite. Un disque « A » doit être apposé à l’arrière du véhicule pendant cette période ; il rappelle aux autres usagers que le conducteur roule moins vite.' },
    ],
    body: (h) => `<h2>Le tableau des limites</h2>
${h.table(['Route', 'Temps sec', 'Pluie', 'Probatoire', 'Visibilité < 50 m'], [['Autoroute', L(h).autoroute.sec, L(h).autoroute.pluie, L(h).autoroute.probatoire, L(h).brouillard_moins_50m], ['Deux chaussées séparées', L(h).voie_separee.sec, L(h).voie_separee.pluie, L(h).voie_separee.probatoire, L(h).brouillard_moins_50m], ['Deux voies dans le même sens', L(h).deux_voies_meme_sens.sec, L(h).deux_voies_meme_sens.pluie, L(h).deux_voies_meme_sens.probatoire, L(h).brouillard_moins_50m], ['Double sens sans séparateur', L(h).bidirectionnelle.sec, L(h).bidirectionnelle.pluie, L(h).bidirectionnelle.probatoire, L(h).brouillard_moins_50m], ['Agglomération', L(h).agglomeration.sec, L(h).agglomeration.pluie, L(h).agglomeration.probatoire, L(h).brouillard_moins_50m]], 'Vitesses maximales en km/h (fiche Service Public F19460)', ['l', 'r', 'r', 'r', 'r'])}
<p>${h.src('spVitesse', 'La fiche Service Public')} précise aussi qu’en permis probatoire, la limite est de 100 km/h sur les sections d’autoroute dont la vitesse maximale est inférieure à 130.</p>
<!--mini:limite-->
<h2>Une limite plus basse coûte plus cher</h2>
<p>L’excès de moins de 20 km/h est de 3e classe au-dessus de 50 km/h, de 4e classe à 50 ou moins. Le même dépassement coûte donc ${h.eur(h.P.classes['3'].forfaitaire)} sur une route à 80 et ${h.eur(h.P.classes['4'].forfaitaire)} en ville ou dans une zone 30. Les deux montants sont comparés sur la page ${h.a('exces-moins-de-20', 'des excès de moins de 20 km/h')}.</p>
<h2>Pluie et probatoire : l’excès se compte sur la limite réduite</h2>
<p>Un jeune conducteur à ${h.num(125)} km/h sur autoroute ne roule pas à 5 km/h au-dessus de 130 : il dépasse sa propre limite de 110. Mesurée par un radar fixe, cette vitesse est retenue à ${h.num(h.M.vitesseRetenue(125, 'fixe'))} km/h, soit ${h.num(h.M.vitesseRetenue(125, 'fixe') - 110)} km/h d’excès et un point, sur un capital qui n’en compte que six au départ.</p>`,
  },
  en: {
    slug: 'french-speed-limits',
    nav: 'Speed limits',
    card: '130, 110, 90, 80, 50: the limit by road, in rain and on probation.',
    title: 'Speed limits in France: by road, in rain, new drivers',
    description: 'French speed limits: 130 km/h on motorways, 110 in rain or for new drivers, 80 on single carriageways, 50 in towns and in fog. Pick your road, get your limit.',
    h1: 'French speed limits: the exact limit for your road',
    intro: 'Type of road, rain, probationary licence: pick your situation and the tool gives the limit that applies and the penalty for the measured speed.',
    resume: (h) => `In France the maximum speed depends on the type of road, the weather and how long you have held your licence, as set out on the Service Public page checked on 29 December 2025. In dry weather it is ${h.num(L(h).autoroute.sec)} km/h on motorways, ${h.num(L(h).voie_separee.sec)} km/h on dual carriageways with a central reservation, ${h.num(L(h).deux_voies_meme_sens.sec)} km/h on sections with at least two lanes in the same direction, ${h.num(L(h).bidirectionnelle.sec)} km/h on single carriageway roads with no central divider and ${h.num(L(h).agglomeration.sec)} km/h in built-up areas. In rain, the first three drop to ${h.num(L(h).autoroute.pluie)}, ${h.num(L(h).voie_separee.pluie)} and ${h.num(L(h).deux_voies_meme_sens.pluie)} km/h. A driver on a probationary licence always uses those lower speeds, and ${h.num(100)} km/h on motorway sections limited to less than 130. When visibility drops below 50 metres, the limit is ${h.num(L(h).brouillard_moins_50m)} km/h everywhere. Local authorities may lower these limits, and raise single carriageway roads under their control to 90 km/h: the sign then overrides the general rule.`,
    faqs: (h) => [
      { q: 'When does the wet-weather limit apply?', a: `As soon as the road is wet from rain or other precipitation, with no sign needed. On motorways the limit drops from ${h.num(L(h).autoroute.sec)} to ${h.num(L(h).autoroute.pluie)} km/h; on dual carriageways from ${h.num(L(h).voie_separee.sec)} to ${h.num(L(h).voie_separee.pluie)}. A camera does not always know it is raining, but a patrol that stops you does.` },
      { q: 'What does the fog rule mean in practice?', a: `When visibility falls below 50 metres, in fog, heavy rain or snow, the limit is ${h.num(L(h).brouillard_moins_50m)} km/h on every road, motorways included. It overrides whatever the signs say, and it applies to probationary and experienced drivers alike. Exceeding it is judged like any other speeding offence.` },
      { q: 'Why do some country roads show 90 and others 80?', a: 'The general limit on a single carriageway with no central divider is 80 km/h. Local authorities in charge of a road may raise it to 90 km/h on their own roads, by sign. Without a 90 sign, assume 80: the camera will.' },
    ],
    body: (h) => `<h2>The table of limits</h2>
${h.table(['Road', 'Dry', 'Rain', 'Probationary', 'Visibility < 50 m'], [['Motorway', L(h).autoroute.sec, L(h).autoroute.pluie, L(h).autoroute.probatoire, L(h).brouillard_moins_50m], ['Dual carriageway', L(h).voie_separee.sec, L(h).voie_separee.pluie, L(h).voie_separee.probatoire, L(h).brouillard_moins_50m], ['Two lanes in the same direction', L(h).deux_voies_meme_sens.sec, L(h).deux_voies_meme_sens.pluie, L(h).deux_voies_meme_sens.probatoire, L(h).brouillard_moins_50m], ['Single carriageway', L(h).bidirectionnelle.sec, L(h).bidirectionnelle.pluie, L(h).bidirectionnelle.probatoire, L(h).brouillard_moins_50m], ['Built-up area', L(h).agglomeration.sec, L(h).agglomeration.pluie, L(h).agglomeration.probatoire, L(h).brouillard_moins_50m]], 'Maximum speeds in km/h (Service Public page F19460)', ['l', 'r', 'r', 'r', 'r'])}
<p>${h.src('spVitesse', 'The Service Public page')} also states that on a probationary licence, the limit is 100 km/h on motorway sections where the maximum is below 130.</p>
<!--mini:limite-->
<h2>A lower limit costs more</h2>
<p>Under 20 km/h over is class 3 above 50 km/h and class 4 at 50 or below. The same excess therefore costs ${h.eur(h.P.classes['3'].forfaitaire)} on an 80 road and ${h.eur(h.P.classes['4'].forfaitaire)} in town or in a 30 zone. Both are compared on the ${h.a('exces-moins-de-20', 'under 20 km/h over page')}.</p>
<h2>Rain and probation: the excess counts from the lower limit</h2>
<p>A new driver at ${h.num(125)} km/h on a motorway is not 5 km/h under 130: they are over their own 110 limit. Measured by a fixed camera, that speed is recorded as ${h.num(h.M.vitesseRetenue(125, 'fixe'))} km/h, ${h.num(h.M.vitesseRetenue(125, 'fixe') - 110)} km/h over and one point, from a licence that starts with only six.</p>`,
  },
});
