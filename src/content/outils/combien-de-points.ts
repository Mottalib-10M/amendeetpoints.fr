import { defineGuide, type Helpers } from '../../lib/guide-types';

const Pm = (h: Helpers) => h.P.permis;
/** Exemple de la page : deux infractions, 2 points il y a 14 mois puis 1 point il y a 4 mois. */
const ex = (h: Helpers) => h.M.soldePoints([{ date: '2025-08-22', points: 2, gravite: 'lourde' }, { date: '2026-06-22', points: 1, gravite: 'legere' }], '2026-10-22');

export default defineGuide({
  id: 'combien-de-points',
  group: 'points',
  order: 1,
  tool: 'points',
  outil: { defaults: [['v1h', 4], ['v2', 14], ['0', 24]] },
  related: ['recuperer-des-points', 'stage-recuperation-points', 'bareme-points', 'permis-probatoire', 'exces-moins-de-20'],
  sources: ['l223_1', 'l223_6', 'spRecup', 'spBareme', 'l223_2'],
  fr: {
    slug: 'combien-de-points-sur-mon-permis',
    nav: 'Combien de points ?',
    card: 'Votre solde estimé et la date où chaque point revient.',
    title: 'Points sur mon permis : combien il en reste, retour daté',
    description: 'Points sur mon permis : estimez votre solde à partir de vos infractions et de leur date de paiement, et la date où les points reviennent. Relevé officiel.',
    h1: 'Combien de points me reste-t-il sur mon permis ?',
    intro: 'Indiquez vos infractions des dernières années et quand vous les avez payées : l’outil estime votre solde et donne la date du prochain retour de points.',
    resume: (h) => {
      const e = ex(h);
      return `Un permis de conduire français compte ${h.num(Pm(h).points_max)} points, ou ${h.num(Pm(h).probatoire_initial)} au départ pour un permis probatoire. Chaque infraction retire le nombre de points prévu par le barème, le jour où elle devient définitive : paiement de l’amende, émission du titre exécutoire de l’amende majorée ou condamnation. Les points reviennent ensuite selon l’article L223-6 du Code de la route : tous après deux ans sans nouvelle infraction, trois ans si l’une des infractions de la période est une contravention de 4e ou 5e classe ou un délit ; un point isolé après six mois. Le seul solde qui fait foi est celui du relevé officiel, consultable en ligne sur le service Mes points permis avec un compte FranceConnect. Ce calculateur sert à vérifier ce relevé et à savoir quand les points reviendront. Exemple : deux points perdus pour un excès de 20 km/h payé il y a quatorze mois, puis un point pour un petit excès hors agglomération payé il y a quatre mois : le solde est de ${h.num(e.solde)} points, et les douze reviennent le ${h.date(e.retourTotal!)} sans nouvelle infraction.`;
    },
    faqs: (h) => [
      { q: 'Où consulter officiellement mon solde de points ?', a: 'Sur le service en ligne Mes points permis du ministère de l’Intérieur, accessible avec FranceConnect, ou au guichet de la préfecture. Le relevé intégral, qui liste toutes les infractions et leurs dates, peut aussi être demandé. Ce site n’a accès à aucun fichier : il calcule à partir de vos seules saisies.' },
      { q: 'Pourquoi mon solde officiel ne correspond-il pas au calcul ?', a: 'Le plus souvent parce que la date retenue n’est pas celle que vous pensez : le délai court du paiement ou de la décision définitive, pas du jour de l’infraction. Un retrait peut aussi être enregistré plusieurs semaines après le paiement. Enfin, une infraction oubliée remet le compteur des deux ou trois ans à zéro.' },
      { q: 'Suis-je prévenu quand je perds des points ?', a: 'Oui : chaque retrait est notifié par une lettre simple (formulaire 48), et le passage à zéro par une lettre recommandée (48SI) qui invalide le permis. Le titulaire d’un permis probatoire qui perd trois points ou plus reçoit une lettre recommandée 48N qui impose le stage.' },
      { q: 'Que veut dire « règle des dix ans » ?', a: 'Si les règles des deux ou trois ans ne jouent jamais, faute de période sans infraction, l’article L223-6 rend malgré tout les points de chaque contravention des quatre premières classes dix ans après leur retrait. L’outil ne la calcule pas, car elle ne concerne que les conducteurs qui accumulent des infractions sans interruption.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>Comment l’outil calcule</h2>
<p>Pour chaque infraction, vous choisissez son type, qui donne les points et la gravité, et le nombre de mois écoulés depuis son paiement. L’outil rejoue les événements dans l’ordre : retrait, puis, si aucune infraction ne suit dans le délai, retour d’un point à six mois ou de tous les points à deux ou trois ans. ${h.src('l223_6', 'L’article L223-6')} fixe ces délais ; le ${h.a('bareme-points', 'barème des points')} donne le retrait de chaque infraction.</p>
${h.table(['Date', 'Événement', 'Solde'], e.evenements.map((v) => [h.date(v.date), v.type === 'retrait' ? `retrait de ${h.num(v.points)} point${v.points > 1 ? 's' : ''}` : v.type === 'total' ? 'retour aux 12 points' : v.type === 'un_point' ? 'retour d’un point' : 'invalidation', h.num(v.solde)]), 'Exemple : 2 points payés en août 2025, 1 point payé en juin 2026', ['l', 'l', 'r'])}
<p>Dans cet exemple, le point retiré en juin 2026 revient seul six mois plus tard, à condition qu’aucune nouvelle infraction ne soit commise d’ici là : la règle des six mois ne regarde que cet intervalle. Les deux autres points attendent le retour total, trois ans après la dernière infraction, parce que l’excès de 20 km/h est une contravention de 4e classe.</p>
<!--mini:recup-->
<h2>Quand le solde tombe à zéro</h2>
<p>À zéro point, le permis est invalidé : il faut le restituer à la préfecture dans les dix jours suivant la lettre 48SI, puis attendre six mois avant de repasser le code et, selon l’ancienneté, la conduite. Un ${h.a('stage-recuperation-points', 'stage')} n’est plus possible une fois le solde à zéro.</p>`;
    },
  },
  en: {
    slug: 'how-many-points-on-my-licence',
    nav: 'How many points?',
    card: 'Your estimated balance and the date each point comes back.',
    title: 'Points on a French licence: your balance and return date',
    description: 'How many points are left on your French licence: estimate your balance from your offences and payment dates, and the date they come back. Official record.',
    h1: 'How many points are left on my French licence?',
    intro: 'Enter your offences from recent years and when you paid them: the tool estimates your balance and gives the date of the next return of points.',
    resume: (h) => {
      const e = ex(h);
      return `A French driving licence carries ${h.num(Pm(h).points_max)} points, or ${h.num(Pm(h).probatoire_initial)} at the start for a probationary licence. Each offence takes the number of points in the scale on the day it becomes final: payment of the fine, issue of the enforceable order for an increased fine, or a conviction. Points then return under article L223-6 of the French Highway Code: all of them after two years with no new offence, three years if any offence in the period is a class 4 or 5 offence or a criminal offence; a single point after six months. The only balance that counts is the official record, available online on the Mes points permis service with a FranceConnect account. This calculator helps you check that record and know when points will return. Example: two points lost for 20 km/h over paid fourteen months ago, then one point for a small excess outside a town paid four months ago: the balance is ${h.num(e.solde)} points, and all twelve return on ${h.date(e.retourTotal!)} with no new offence.`;
    },
    faqs: (h) => [
      { q: 'Where can I check my points officially?', a: 'On the Interior Ministry’s Mes points permis online service, using FranceConnect, or at the prefecture. A full record listing every offence and its dates can also be requested. This site has access to no file: it works only from what you enter.' },
      { q: 'Why does my official balance differ from the calculation?', a: 'Most often because the date used is not the one you think: the clock runs from payment or the final decision, not from the day of the offence. A deduction may also be recorded weeks after payment. Finally, a forgotten offence restarts the two- or three-year clock.' },
      { q: 'Am I told when I lose points?', a: 'Yes: every deduction is notified by an ordinary letter (form 48), and reaching zero by a registered letter (48SI) that invalidates the licence. A probationary licence holder who loses three points or more receives a registered letter 48N requiring a course.' },
      { q: 'I swapped my foreign licence for a French one: do I start at 12?', a: 'An exchanged licence is a French licence and carries points like any other. Whether it starts as probationary depends on how long you had held the original licence. Check the balance shown on Mes points permis once the exchange is complete, and use the tool for later offences.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>How the tool calculates</h2>
<p>For each offence you choose its type, which gives the points and the seriousness, and the number of months since it was paid. The tool replays events in order: deduction, then, if no offence follows within the window, one point back at six months or all points back at two or three years. ${h.src('l223_6', 'Article L223-6')} sets these periods; the ${h.a('bareme-points', 'points table')} gives the deduction for each offence.</p>
${h.table(['Date', 'Event', 'Balance'], e.evenements.map((v) => [h.date(v.date), v.type === 'retrait' ? `${h.num(v.points)} point${v.points > 1 ? 's' : ''} taken` : v.type === 'total' ? 'back to 12 points' : v.type === 'un_point' ? 'one point back' : 'invalidation', h.num(v.solde)]), 'Example: 2 points paid in August 2025, 1 point paid in June 2026', ['l', 'l', 'r'])}
<p>In this example, the point taken in June 2026 comes back on its own six months later, provided no new offence is committed in the meantime: the six-month rule only looks at that interval. The other two points wait for the full return, three years after the last offence, because 20 km/h over is a class 4 offence.</p>
<!--mini:recup-->
<h2>When the balance hits zero</h2>
<p>At zero points the licence is invalidated: it must be handed back to the prefecture within ten days of the 48SI letter, then you wait six months before retaking the theory test and, depending on how long you had held it, the driving test. A ${h.a('stage-recuperation-points', 'course')} is no longer possible once the balance is zero.</p>`;
    },
  },
});
