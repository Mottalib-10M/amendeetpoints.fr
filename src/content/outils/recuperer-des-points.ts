import { defineGuide, type Helpers } from '../../lib/guide-types';

const Pm = (h: Helpers) => h.P.permis;

export default defineGuide({
  id: 'recuperer-des-points',
  group: 'points',
  order: 2,
  tool: 'points',
  outil: { defaults: [['tel', 20], ['v1b', 9], ['0', 0]] },
  related: ['combien-de-points', 'stage-recuperation-points', 'permis-probatoire', 'exces-20-km-h', 'bareme-points'],
  sources: ['l223_6', 'spRecup', 'l223_1', 'spBareme'],
  fr: {
    slug: 'recuperer-des-points',
    nav: 'Récupérer des points',
    card: '6 mois, 2 ans, 3 ans, 10 ans ou un stage : quelle règle joue pour vous.',
    title: 'Récupérer des points : 6 mois, 2 ans, 3 ans ou stage, daté',
    description: 'Récupérer des points de permis : un point après 6 mois, tous après 2 ou 3 ans sans infraction, 4 points par stage une fois par an. La date exacte pour vous.',
    h1: 'Récupérer des points : la date exacte pour votre cas',
    intro: 'Quatre règles, une seule qui joue en premier selon vos infractions. Indiquez-les : l’outil donne la prochaine date de retour et l’effet d’un stage.',
    resume: (h) => `Les points perdus reviennent de quatre façons, fixées par l’article L223-6 du Code de la route et rappelées par la fiche Service Public vérifiée le 17 septembre 2025. Un point retiré seul est rendu au bout de six mois si aucune infraction entraînant un retrait n’est commise dans cet intervalle. Tous les points reviennent après deux ans sans nouvelle infraction ; le délai passe à trois ans si l’une des infractions de la période est une contravention de 4e ou 5e classe ou un délit, ce qui couvre la plupart des excès de vitesse en ville, le téléphone, la ceinture et le feu rouge. À défaut, les points de chaque contravention des quatre premières classes reviennent dix ans après leur retrait. Enfin, un stage de sensibilisation rend jusqu’à ${h.num(Pm(h).stage_points)} points par an, dans la limite de douze, tant que le permis n’est pas invalidé. Tous ces délais partent du jour où l’infraction est établie : paiement de l’amende, titre exécutoire de l’amende majorée ou condamnation définitive, pas le jour du flash. Une seule nouvelle infraction suffit à relancer le compteur des deux ou trois ans.`,
    faqs: (h) => [
      { q: 'Je viens de perdre un point : dois-je attendre deux ans ?', a: 'Non : si c’est la seule infraction, le point revient en six mois, à condition de n’en commettre aucune autre entre-temps. Si un autre retrait est intervenu dans ces six mois, le point attend le retour total, deux ou trois ans après la dernière infraction.' },
      { q: 'Le délai part-il du jour de l’infraction ?', a: 'Non, du jour où elle est établie : en pratique le paiement de l’amende forfaitaire, l’émission du titre exécutoire si l’amende a été majorée, ou la date à laquelle la condamnation devient définitive. Un flash en janvier payé en mars fait courir le délai à partir de mars.' },
      { q: 'Peut-on cumuler le stage et le retour automatique ?', a: `Oui. Le stage rend ${h.num(Pm(h).stage_points)} points tout de suite, et le retour au maximum après deux ou trois ans sans infraction a lieu quand même, puisque le solde ne dépasse jamais douze. Le stage n’arrête pas le compteur des deux ou trois ans : seule une nouvelle infraction le relance.` },
    ],
    body: (h) => `<h2>Les quatre règles, côte à côte</h2>
${h.table(['Règle', 'Condition', 'Effet'], [['Six mois', 'un seul point retiré, aucune infraction dans les six mois', '+1 point'], ['Deux ans', 'aucune infraction pendant deux ans, que des contraventions de 1re à 3e classe', 'retour à 12'], ['Trois ans', 'aucune infraction pendant trois ans, avec une 4e ou 5e classe ou un délit', 'retour à 12'], ['Dix ans', 'les règles précédentes n’ont pas joué', 'les points de chaque contravention de 1re à 4e classe'], ['Stage', 'permis non invalidé, un stage par an au plus', `+${h.num(Pm(h).stage_points)} points`]], 'Récupération des points (article L223-6, fiche Service Public F1685)', ['l', 'l', 'l'])}
<p>${h.src('spRecup', 'La fiche Service Public')} détaille chaque condition. Le calcul ci-dessus applique les règles des six mois, des deux ans, des trois ans et du stage ; la règle des dix ans n’y figure pas.</p>
<!--mini:recup-->
<h2>Pourquoi la plupart des conducteurs attendent trois ans</h2>
<p>Le délai de deux ans ne vaut que si toutes les infractions de la période sont de 3e classe au plus, comme un excès de moins de 20 km/h sur une route limitée à plus de 50 km/h. Dès qu’une infraction de 4e classe s’y trouve, le délai passe à trois ans pour l’ensemble : un excès de moins de 20 km/h en ville, voir la page ${h.a('exces-moins-de-20', 'des petits excès')}, suffit à le faire basculer.</p>`,
  },
  en: {
    slug: 'getting-points-back-french-licence',
    nav: 'Getting points back',
    card: '6 months, 2 years, 3 years, 10 years or a course: which rule applies to you.',
    title: 'Getting points back on a French licence: the exact date',
    description: 'Getting points back on a French licence: one point after 6 months, all after 2 or 3 years with no offence, 4 points per course once a year. Your exact date.',
    h1: 'Getting points back: the exact date for your case',
    intro: 'Four rules, and only one applies first depending on your offences. Enter them: the tool gives the next return date and the effect of a course.',
    resume: (h) => `Lost points come back in four ways, set by article L223-6 of the French Highway Code and restated on the Service Public page checked on 17 September 2025. A single point is restored after six months if no offence costing points is committed in that time. All points come back after two years with no new offence; the period rises to three years if any offence in that time is a class 4 or 5 offence or a criminal one, which covers most speeding in towns, phones, seat belts and red lights. Failing that, the points from each offence of the first four classes return ten years after they were taken. Finally, an awareness course gives back up to ${h.num(Pm(h).stage_points)} points a year, up to twelve, as long as the licence has not been invalidated. All these periods start on the day the offence is established: payment of the fine, the enforceable order for an increased fine or a final conviction, not the day of the flash. A single new offence is enough to restart the two- or three-year clock.`,
    faqs: (h) => [
      { q: 'I just lost one point: must I wait two years?', a: 'No: if it is the only offence, the point returns in six months, provided you commit no other in the meantime. If another deduction comes within those six months, the point waits for the full return, two or three years after the last offence.' },
      { q: 'Does the clock start on the day of the offence?', a: 'No, on the day it is established: in practice when the fixed fine is paid, when the enforceable order is issued if the fine was increased, or when a conviction becomes final. A flash in January paid in March starts the clock in March.' },
      { q: 'Does paying quickly speed up getting points back?', a: 'In a way, yes. The points go as soon as the fine is paid, but the recovery clock also starts on that day. Paying the reduced fine in the first fortnight therefore brings the return date forward compared with waiting for the increased fine, and saves money too.' },
    ],
    body: (h) => `<h2>The four rules side by side</h2>
${h.table(['Rule', 'Condition', 'Effect'], [['Six months', 'a single point taken, no offence within six months', '+1 point'], ['Two years', 'no offence for two years, only class 1 to 3 offences', 'back to 12'], ['Three years', 'no offence for three years, with a class 4 or 5 or a criminal offence', 'back to 12'], ['Ten years', 'the rules above did not apply', 'the points of each class 1 to 4 offence'], ['Course', 'licence not invalidated, one course a year at most', `+${h.num(Pm(h).stage_points)} points`]], 'Getting points back (article L223-6, Service Public page F1685)', ['l', 'l', 'l'])}
<p>${h.src('spRecup', 'The Service Public page')} sets out each condition. The calculator above applies the six-month, two-year, three-year and course rules; the ten-year rule is not included.</p>
<!--mini:recup-->
<h2>Why most drivers wait three years</h2>
<p>The two-year period only applies if every offence in that time is class 3 or below, such as less than 20 km/h over on a road limited to more than 50 km/h. As soon as a class 4 offence is among them, the period becomes three years for all: less than 20 km/h over in town, see the ${h.a('exces-moins-de-20', 'small excess page')}, is enough to tip it.</p>`,
  },
});
