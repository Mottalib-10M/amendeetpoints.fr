import { defineGuide, type Helpers } from '../../lib/guide-types';

const M = (h: Helpers) => h.P.marge;
const ret = (h: Helpers, v: number, a: 'fixe' | 'embarque' = 'fixe') => h.M.vitesseRetenue(v, a);

export default defineGuide({
  id: 'marge-erreur-radar',
  group: 'radars',
  order: 3,
  tool: 'exces',
  outil: { defaultVitesse: 136, defaultLimite: 110 },
  related: ['carte-radars', 'radar-troncon', 'exces-moins-de-20', 'contester-une-amende', 'radar-fixe'],
  sources: ['arreteCinemometres', 'r413_14', 'antai', 'spVitesse'],
  fr: {
    slug: 'marge-erreur-radar',
    nav: 'Marge d’erreur des radars',
    card: '5 km/h ou 5 %, 10 km/h ou 10 % : de la vitesse mesurée à la vitesse retenue.',
    title: 'Marge d’erreur radar : 5 km/h ou 5 %, vitesse retenue',
    description: 'Marge d’erreur des radars : 5 km/h sous 100 km/h et 5 % au-dessus pour un radar fixe, le double pour un radar embarqué. Vitesse retenue calculée, exemples.',
    h1: 'Marge d’erreur des radars : de la vitesse mesurée à la vitesse retenue',
    intro: 'Votre avis porte deux vitesses. La première est celle que l’appareil a lue, la seconde celle qui sert à la sanction. L’écart est fixé par un arrêté.',
    resume: (h) => `La marge d’erreur des radars, que l’administration appelle marge technique, est l’erreur maximale tolérée des cinémomètres fixée par l’article 6 de l’arrêté du 4 juin 2009. Pour un appareil fixe ou installé à poste fixe, elle est de ${h.num(M(h).fixe_kmh)} km/h quand la vitesse mesurée est inférieure à ${h.num(M(h).seuil_kmh)} km/h et de ${h.num(M(h).fixe_pct * 100)} % de la vitesse au-delà. Pour un appareil utilisé en mouvement, comme le radar embarqué d’une voiture banalisée, elle double : ${h.num(M(h).embarque_kmh)} km/h et ${h.num(M(h).embarque_pct * 100)} %. Cette marge est retirée de la vitesse mesurée pour obtenir la vitesse retenue, la seule qui compte pour l’amende et les points. Ainsi ${h.num(136)} km/h mesurés par un radar fixe deviennent ${h.num(ret(h, 136))} km/h retenus, et ${h.num(98)} km/h deviennent ${h.num(ret(h, 98))} km/h. Les deux chiffres figurent sur l’avis de contravention. Nous arrondissons la vitesse retenue au kilomètre-heure inférieur, choix favorable au conducteur que le texte ne tranche pas : à un kilomètre-heure près, fiez-vous à l’avis.`,
    faqs: (h) => [
      { q: 'Pourquoi la marge est-elle plus grande pour un radar embarqué ?', a: 'Un appareil qui mesure en roulant cumule sa propre incertitude et celle du mouvement du véhicule qui le porte. L’arrêté de 2009 lui accorde donc une erreur maximale tolérée double de celle d’un appareil fixe : 10 km/h sous 100 km/h, 10 % au-dessus. Le seuil de sanction mesuré est plus haut d’autant.' },
      { q: 'La marge s’applique-t-elle aussi au radar tronçon ?', a: `Oui : le radar tronçon est un appareil fixe qui calcule une vitesse moyenne entre deux points. La marge de ${h.num(M(h).fixe_kmh)} km/h ou ${h.num(M(h).fixe_pct * 100)} % est retirée de cette moyenne. Le calcul à partir de la distance et du temps de parcours est sur la page du radar tronçon.` },
      { q: 'Peut-on contester en invoquant un défaut d’étalonnage ?', a: 'Les cinémomètres sont soumis à une vérification périodique, et l’avis peut être contesté si l’appareil n’était pas en règle. La preuve est difficile à apporter seul : il faut demander la photo et le carnet de l’appareil, sans garantie de résultat. La marge, elle, est déjà déduite : on ne peut pas la réclamer deux fois.' },
      { q: 'La vitesse de mon compteur compte-t-elle ?', a: 'Non. Un compteur de voiture affiche en général un peu plus que la vitesse réelle, ce qui joue plutôt en faveur du conducteur, mais seule la mesure de l’appareil homologué fait foi. Une application GPS n’a aucune valeur de preuve face à un cinémomètre vérifié.' },
    ],
    body: (h) => `<h2>Le calcul, cas par cas</h2>
${h.table(['Vitesse mesurée', 'Radar fixe : retenue', 'Radar embarqué : retenue'], [55, 85, 99, 100, 120, 136, 145, 160].map((v) => [`${h.num(v)} km/h`, `${h.num(ret(h, v))} km/h`, `${h.num(ret(h, v, 'embarque'))} km/h`]), 'Vitesse retenue après la marge, arrondie à l’unité inférieure', ['l', 'r', 'r'])}
<p>Le changement de règle à ${h.num(M(h).seuil_kmh)} km/h crée un saut : ${h.num(99)} km/h mesurés deviennent ${h.num(ret(h, 99))} km/h, ${h.num(100)} km/h deviennent ${h.num(ret(h, 100))} km/h. À partir de là, la marge grandit avec la vitesse : ${h.num(160)} km/h mesurés valent ${h.num(ret(h, 160))} km/h retenus. ${h.src('arreteCinemometres', 'L’arrêté du 4 juin 2009 est sur Légifrance')}.</p>
<!--mini:marge-->
<h2>Ce que la marge change pour la sanction</h2>
<p>Parce que l’excès se calcule sur la vitesse retenue, la marge déplace tous les seuils du barème. Sur une route à 110, le premier point tombe à ${h.num(h.M.mesureePourRetenue(115, 'fixe'))} km/h mesurés par un radar fixe, la tranche de deux points à ${h.num(h.M.mesureePourRetenue(130, 'fixe'))} km/h, celle de trois points à ${h.num(h.M.mesureePourRetenue(140, 'fixe'))} km/h. Le tableau sous le calculateur donne ces seuils pour la limite que vous choisissez.</p>
<h2>Lire son avis</h2>
<p>L’avis de contravention envoyé par l’ANTAI indique la vitesse mesurée, la vitesse retenue et la vitesse maximale autorisée. Si vous connaissez seulement la vitesse retenue, choisissez « Retenu » dans le calculateur : la marge n’est alors pas déduite une seconde fois.</p>`,
  },
  en: {
    slug: 'speed-camera-margin-of-error',
    nav: 'Camera margin of error',
    card: '5 km/h or 5%, 10 km/h or 10%: from measured speed to recorded speed.',
    title: 'Speed camera margin of error in France: 5 km/h or 5%',
    description: 'French speed camera margin of error: 5 km/h below 100 km/h and 5% above for a fixed camera, double for an in-car camera. Recorded speed worked out, examples.',
    h1: 'Speed camera margin: from measured speed to recorded speed',
    intro: 'Your notice shows two speeds. The first is what the device read, the second is what the penalty is based on. The gap is set by a ministerial order.',
    resume: (h) => `The speed camera margin of error, which the French authorities call the technical margin, is the maximum permitted error of speed-measuring devices set by article 6 of the order of 4 June 2009. For a fixed device, or one set up in a fixed position, it is ${h.num(M(h).fixe_kmh)} km/h when the measured speed is below ${h.num(M(h).seuil_kmh)} km/h and ${h.num(M(h).fixe_pct * 100)}% of the speed above that. For a device used on the move, such as the in-car camera of an unmarked car, it doubles: ${h.num(M(h).embarque_kmh)} km/h and ${h.num(M(h).embarque_pct * 100)}%. The margin is subtracted from the measured speed to give the recorded speed, the only one that counts for the fine and points. So ${h.num(136)} km/h measured by a fixed camera becomes ${h.num(ret(h, 136))} km/h recorded, and ${h.num(98)} km/h becomes ${h.num(ret(h, 98))} km/h. Both figures appear on the notice. We round the recorded speed down to the unit, a choice in the driver’s favour that the text does not settle: if it differs by one km/h, trust the notice.`,
    faqs: (h) => [
      { q: 'Why is the margin bigger for an in-car camera?', a: 'A device measuring on the move combines its own uncertainty with the movement of the vehicle carrying it. The 2009 order therefore gives it double the permitted error of a fixed device: 10 km/h below 100 km/h, 10% above. The measured speed that triggers a penalty is higher by as much.' },
      { q: 'Does the margin apply to average-speed cameras too?', a: `Yes: an average-speed camera is a fixed device that works out an average between two points. The ${h.num(M(h).fixe_kmh)} km/h or ${h.num(M(h).fixe_pct * 100)}% margin is taken off that average. The calculation from distance and travel time is on the average-speed camera page.` },
      { q: 'Can I contest on the ground of faulty calibration?', a: 'Speed cameras must be checked periodically, and a notice can be contested if the device was not compliant. That is hard to prove alone: you have to request the photo and the device’s records, with no guarantee. The margin is already deducted: it cannot be claimed twice.' },
      { q: 'My speedometer showed less: does that matter?', a: 'No. A car speedometer usually reads slightly above true speed, which tends to help the driver, but only the approved device’s measurement counts. A GPS app has no evidential weight against a checked speed camera, which is inspected every year by an approved body.' },
    ],
    body: (h) => `<h2>The calculation, case by case</h2>
${h.table(['Measured speed', 'Fixed camera: recorded', 'In-car camera: recorded'], [55, 85, 99, 100, 120, 136, 145, 160].map((v) => [`${h.num(v)} km/h`, `${h.num(ret(h, v))} km/h`, `${h.num(ret(h, v, 'embarque'))} km/h`]), 'Recorded speed after the margin, rounded down to the unit', ['l', 'r', 'r'])}
<p>The change of rule at ${h.num(M(h).seuil_kmh)} km/h creates a jump: ${h.num(99)} km/h measured becomes ${h.num(ret(h, 99))} km/h, ${h.num(100)} km/h becomes ${h.num(ret(h, 100))} km/h. From there the margin grows with speed: ${h.num(160)} km/h measured counts as ${h.num(ret(h, 160))} km/h recorded. ${h.src('arreteCinemometres', 'The order of 4 June 2009 is on Légifrance')}.</p>
<!--mini:marge-->
<h2>What the margin changes for the penalty</h2>
<p>Because the excess is worked out on the recorded speed, the margin shifts every threshold of the scale. On a 110 road, the first point goes at ${h.num(h.M.mesureePourRetenue(115, 'fixe'))} km/h measured by a fixed camera, the two-point band at ${h.num(h.M.mesureePourRetenue(130, 'fixe'))} km/h, the three-point band at ${h.num(h.M.mesureePourRetenue(140, 'fixe'))} km/h. The table under the calculator gives these thresholds for the limit you choose.</p>
<h2>Reading your notice</h2>
<p>The notice sent by the ANTAI shows the measured speed, the recorded speed (vitesse retenue) and the speed limit. If you only know the recorded speed, set “Figure from” to “Notice” in the calculator: the margin is then not deducted a second time.</p>`,
  },
});
