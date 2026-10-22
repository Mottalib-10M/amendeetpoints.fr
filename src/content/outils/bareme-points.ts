import { defineGuide, type Helpers } from '../../lib/guide-types';

type Inf = (typeof import('../../data/params-2026.json'))['infractions'][number];
const ligne = (h: Helpers, i: Inf) => {
  const x = h.M.infraction(i.id);
  const fr = h.lang === 'fr';
  const amende = x.amendes ? h.eur(x.amendes.forfaitaire) : fr ? `délit, ${h.eur((i as { amende_max?: number }).amende_max ?? 0)} max.` : `offence, up to ${h.eur((i as { amende_max?: number }).amende_max ?? 0)}`;
  return [i[h.lang], x.delit ? (fr ? 'délit' : 'offence') : String(x.classe), amende, String(i.points)];
};
const vit = (h: Helpers) => {
  const fr = h.lang === 'fr';
  const C = h.P.classes;
  return [
    [fr ? 'Excès < 5 km/h' : 'Under 5 km/h over', '3 / 4', `${h.eur(C['3'].forfaitaire)} / ${h.eur(C['4'].forfaitaire)}`, '0'],
    [fr ? 'Excès de 5 à 19 km/h' : '5 to 19 km/h over', '3 / 4', `${h.eur(C['3'].forfaitaire)} / ${h.eur(C['4'].forfaitaire)}`, '1'],
    [fr ? 'Excès de 20 à 29 km/h' : '20 to 29 km/h over', '4', h.eur(C['4'].forfaitaire), '2'],
    [fr ? 'Excès de 30 à 39 km/h' : '30 to 39 km/h over', '4', h.eur(C['4'].forfaitaire), '3'],
    [fr ? 'Excès de 40 à 49 km/h' : '40 to 49 km/h over', '4', h.eur(C['4'].forfaitaire), '4'],
    [fr ? 'Excès de 50 km/h et plus' : '50 km/h over or more', fr ? 'délit' : 'offence', h.eur(h.P.vitesse.delit.afd.forfaitaire) + (fr ? ' (AFD)' : ' (fixed)'), String(h.P.vitesse.delit.points)],
  ];
};

export default defineGuide({
  id: 'bareme-points',
  group: 'infractions',
  order: 1,
  tool: 'infraction',
  outil: { defaultId: 'feu_rouge' },
  related: ['combien-de-points', 'amende-feu-rouge', 'amende-telephone', 'alcool-au-volant', 'exces-moins-de-20'],
  sources: ['spBareme', 'r49_9', 'l223_2', 'r413_14', 'r412_30', 'r412_6_1', 'r234_1'],
  fr: {
    slug: 'bareme-retrait-de-points',
    nav: 'Barème des points',
    card: 'Chaque infraction, sa classe, son amende et ses points, en un tableau.',
    title: 'Barème de retrait de points 2026 : amende, points par faute',
    description: 'Barème de retrait de points 2026 : pour chaque infraction, la classe, l’amende forfaitaire et les points retirés, de 1 à 9. Vitesse, feu rouge, alcool.',
    h1: 'Barème de retrait de points : l’amende et les points de chaque infraction',
    intro: 'Choisissez une infraction : sa classe, ses trois montants, ses points et ce qu’il resterait sur votre permis. Le tableau complet suit.',
    resume: (h) => `Le barème de retrait de points fixe, pour chaque infraction au Code de la route, le nombre de points retirés du permis, de un à six pour une infraction isolée, et jusqu’à neuf pour la conduite après usage de stupéfiants associée à l’alcool depuis la loi du 18 août 2026. Il se lit avec la classe de la contravention, qui détermine l’amende : ${h.eur(h.P.classes['2'].forfaitaire)} en 2e classe, ${h.eur(h.P.classes['3'].forfaitaire)} en 3e, ${h.eur(h.P.classes['4'].forfaitaire)} en 4e, selon l’article R49-9 du Code de procédure pénale. Les infractions les plus fréquentes coûtent quatre points (feu rouge, stop, refus de priorité), trois (téléphone tenu en main, ceinture, ligne continue) ou six (alcool, priorité à un piéton). Quand plusieurs infractions sont constatées en même temps, l’article L223-2 plafonne le retrait à ${h.num(h.P.permis.plafond_simultane)} points, alors que les amendes s’additionnent. Un délit retire la moitié du maximum, soit six points. Le permis plein compte douze points ; à zéro, il est invalidé. La source de chaque ligne figure en bas de page.`,
    faqs: (h) => [
      { q: 'Quelle est l’infraction qui retire le plus de points ?', a: `Depuis la loi du 18 août 2026, la conduite après usage de stupéfiants combinée à l’alcool retire les trois quarts du maximum, soit ${h.num(h.P.permis.stupefiants_alcool_retrait)} points. Les autres délits routiers (alcool à 0,8 g/l ou plus, stupéfiants seuls, grand excès de vitesse) retirent la moitié, six points, comme deux contraventions : le taux d’alcool de 0,5 g/l et le refus de priorité à un piéton.` },
      { q: 'Plusieurs infractions au même contrôle : tout s’additionne ?', a: `Les amendes, oui. Les points, non : l’article L223-2 limite le retrait à ${h.num(h.P.permis.plafond_simultane)} points pour des infractions constatées simultanément. Un conducteur arrêté pour téléphone, ceinture et ligne continue perd ${h.num(h.M.cumulSimultane([3, 3, 3]))} points au lieu de neuf. Le plafond vaut pour un même contrôle, pas pour des infractions commises à des dates différentes.` },
      { q: 'Le stationnement retire-t-il des points ?', a: `Seulement le stationnement dangereux, qui coûte trois points et ${h.eur(h.P.classes['4'].forfaitaire)}. Le stationnement gênant, très gênant ou abusif ne retire aucun point, et le forfait post-stationnement, qui remplace l’amende de stationnement payant, non plus. Son montant est fixé par chaque commune, pas par le Code de la route.` },
      { q: 'Le barème a-t-il changé en 2026 ?', a: 'Oui pour les délits d’alcool et de stupéfiants, alourdis par la loi du 18 août 2026, et depuis la fin de 2025 pour le grand excès de vitesse, devenu un délit dès la première fois. Les contraventions courantes, feu rouge, téléphone ou ceinture, gardent leurs montants et leurs points.' },
    ],
    body: (h) => {
      const fr = h.lang === 'fr';
      return `<h2>Le tableau complet</h2>
${h.table(['Infraction', 'Classe', 'Amende forfaitaire', 'Points'], [...vit(h), ...h.P.infractions.map((i) => ligne(h, i))], `Barème au ${h.date(h.P.retrieved_at)} (Code de la route, Code de procédure pénale, fiche Service Public F31551)`, ['l', 'l', 'r', 'r'])}
<p>Pour la vitesse, la classe dépend de la limite : 3e classe au-dessus de 50 km/h, 4e à 50 km/h ou moins, pour un excès de moins de 20 km/h. ${h.src('spBareme', 'La fiche Service Public du barème')} donne les points ; les montants viennent de l’article R49-9.</p>
<h2>Plusieurs infractions d’un coup</h2>
<!--mini:cumul-->
<p>Le plafond de ${h.num(h.P.permis.plafond_simultane)} points de l’article L223-2 protège le permis d’un retrait massif lors d’un seul contrôle, mais pas d’une invalidation : un conducteur à ${h.num(8)} points qui en perd ${h.num(8)} se retrouve à zéro. Le solde se calcule sur la page ${h.a('combien-de-points', 'combien de points')}.</p>
<h2>Amende minorée et majorée</h2>
<p>Chaque contravention des classes 2 à 4 a trois montants : minoré si l’on paie vite, forfaitaire, majoré passé quarante-cinq jours. Le stationnement n’a pas de montant minoré. Les dates exactes pour votre avis sont sur la page ${h.a('amende-majoree', 'de l’amende majorée')}.</p>`;
    },
  },
  en: {
    slug: 'french-traffic-fines-and-points-table',
    nav: 'Fines and points table',
    card: 'Every offence, its class, its fine and its points, in one table.',
    title: 'Traffic fines and points in France: the 2026 table',
    description: 'French traffic fines and points 2026: for every offence, the class, the standard fine and the points taken, from 1 to 9. Speeding, red light, phone, alcohol.',
    h1: 'French traffic fines and points: every offence',
    intro: 'Pick an offence: its class, its three amounts, its points and what would be left on your licence. The full table follows.',
    resume: (h) => `The French points scale sets, for each Highway Code offence, the number of points taken off the licence: one to six for a single offence, and up to nine for driving after taking drugs combined with alcohol since the law of 18 August 2026. It is read alongside the class of the offence, which sets the fine: ${h.eur(h.P.classes['2'].forfaitaire)} for class 2, ${h.eur(h.P.classes['3'].forfaitaire)} for class 3, ${h.eur(h.P.classes['4'].forfaitaire)} for class 4, under article R49-9 of the Code of Criminal Procedure. The most common offences cost four points (red light, stop sign, failing to give way), three (hand-held phone, seat belt, solid line) or six (alcohol, failing to give way to a pedestrian). When several offences are recorded at once, article L223-2 caps the deduction at ${h.num(h.P.permis.plafond_simultane)} points, while the fines all add up. A criminal offence takes half the maximum, six points. A full licence has twelve points; at zero it is invalidated. The source of every line is given at the foot of the page.`,
    faqs: (h) => [
      { q: 'Which offence takes the most points?', a: `Since the law of 18 August 2026, driving after taking drugs combined with alcohol takes three quarters of the maximum, ${h.num(h.P.permis.stupefiants_alcool_retrait)} points. Other criminal driving offences (0.8 g/l of alcohol or more, drugs alone, 50 km/h over) take half, six points, as do two minor offences: 0.5 g/l of alcohol and failing to give way to a pedestrian.` },
      { q: 'Several offences at one stop: does everything add up?', a: `The fines do. The points do not: article L223-2 caps the deduction at ${h.num(h.P.permis.plafond_simultane)} points for offences recorded at the same time. A driver stopped for phone, seat belt and solid line loses ${h.num(h.M.cumulSimultane([3, 3, 3]))} points instead of nine. The cap applies to one stop, not to offences committed on different dates.` },
      { q: 'Do parking fines cost points?', a: `Only dangerous parking, which costs three points and ${h.eur(h.P.classes['4'].forfaitaire)}. Obstructive, seriously obstructive or abandoned parking takes no points, and nor does the post-parking charge (forfait post-stationnement) that replaced fines for unpaid street parking. Those charges are set by each town, not by the Highway Code.` },
      { q: 'Do foreign licence holders lose points?', a: 'Points are recorded on French licences. Fines apply to every driver, whatever the licence, and can be collected abroad through the European exchange of vehicle data. If you are moving to France and will exchange your licence, ask the prefecture how earlier offences are handled.' },
    ],
    body: (h) => `<h2>The full table</h2>
${h.table(['Offence', 'Class', 'Standard fine', 'Points'], [...vit(h), ...h.P.infractions.map((i) => ligne(h, i))], `Scale as of ${h.date(h.P.retrieved_at)} (Highway Code, Code of Criminal Procedure, Service Public page F31551)`, ['l', 'l', 'r', 'r'])}
<p>For speeding, the class depends on the limit: class 3 above 50 km/h and class 4 at 50 or below, for under 20 km/h over. ${h.src('spBareme', 'The Service Public points page')} gives the points; the amounts come from article R49-9.</p>
<h2>Several offences at once</h2>
<!--mini:cumul-->
<p>The ${h.num(h.P.permis.plafond_simultane)}-point cap in article L223-2 protects the licence from a huge deduction at a single stop, but not from cancellation: a driver with ${h.num(8)} points who loses ${h.num(8)} is at zero. The balance is worked out on the ${h.a('combien-de-points', 'how many points page')}.</p>
<h2>Reduced and increased fines</h2>
<p>Every class 2 to 4 offence has three amounts: reduced if you pay quickly, standard, and increased after forty-five days. Parking has no reduced amount. The exact dates for your notice are on the ${h.a('amende-majoree', 'increased fine page')}.</p>`,
  },
});
