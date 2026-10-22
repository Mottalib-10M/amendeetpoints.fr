import { defineGuide, type Helpers } from '../../lib/guide-types';

const A = (h: Helpers) => h.P.alcool;
const g = (h: Helpers, x: number) => `${h.num(x, x * 10 % 1 ? 2 : 1)} g/l`;
const mg = (h: Helpers, x: number) => `${h.num(x, 2)} mg/l`;

export default defineGuide({
  id: 'alcool-au-volant',
  group: 'infractions',
  order: 5,
  tool: 'infraction',
  outil: { ids: ['alcool_contravention', 'alcool_delit', 'stupefiants', 'stupefiants_alcool'], defaultId: 'alcool_contravention' },
  related: ['suspension-permis', 'grand-exces', 'bareme-points', 'permis-probatoire', 'stage-recuperation-points'],
  sources: ['r234_1', 'l234_1', 'l235_1', 'loi2026', 'l224_2', 'spBareme'],
  fr: {
    slug: 'alcool-au-volant-sanction',
    nav: 'Alcool et stupéfiants',
    card: '135 € et 6 points dès 0,5 g/l ; délit à 0,8 g/l, alourdi en août 2026.',
    title: 'Alcool au volant : sanction 2026, amende, points, prison',
    description: 'Alcool au volant, sanctions 2026 : 135 € et 6 points de 0,5 à 0,8 g/l (0,2 en probatoire), délit au-delà, 3 ans et 9 000 € depuis la loi du 18 août 2026.',
    h1: 'Alcool au volant : les sanctions depuis la loi du 18 août 2026',
    intro: 'Deux seuils, deux régimes : une contravention à partir de 0,5 g/l, un délit à partir de 0,8 g/l. La loi du 18 août 2026 a durci le délit et les stupéfiants.',
    resume: (h) => `Conduire avec un taux d’alcool compris entre ${g(h, A(h).seuil_general_g_sang)} et ${g(h, A(h).seuil_delit_g_sang)} de sang, soit ${mg(h, A(h).seuil_general_mg_air)} à ${mg(h, A(h).seuil_delit_mg_air)} d’air expiré, est une contravention de 4e classe selon l’article R234-1 du Code de la route : ${h.eur(h.P.classes['4'].forfaitaire)} d’amende forfaitaire, ${h.num(A(h).contravention_points)} points retirés et une suspension possible de trois ans. Pour un permis probatoire, un conducteur de transport en commun ou un élève, le seuil tombe à ${g(h, A(h).seuil_probatoire_g_sang)}. À partir de ${g(h, A(h).seuil_delit_g_sang)}, c’est un délit : depuis la loi n° 2026-798 du 18 août 2026, l’article L234-1 prévoit ${h.num(A(h).delit_prison_ans)} ans d’emprisonnement et ${h.eur(A(h).delit_amende_max)} d’amende, avec six points retirés. La conduite après usage de stupéfiants est punie des mêmes peines par l’article L235-1, portées à ${h.num(A(h).stupefiants_alcool_prison_ans)} ans et ${h.eur(A(h).stupefiants_alcool_amende_max)} si l’alcool s’y ajoute, avec ${h.num(h.P.permis.stupefiants_alcool_retrait)} points retirés. Le préfet doit suspendre le permis, jusqu’à ${h.num(A(h).suspension_prefet_max_mois)} mois, quand l’alcoolémie ou l’usage de stupéfiants est établi.`,
    faqs: (h) => [
      { q: 'Combien de verres pour atteindre 0,5 g/l ?', a: 'Aucun chiffre fiable ne vaut pour tout le monde : le taux dépend du poids, du sexe, de l’alimentation, de la vitesse de consommation et du temps écoulé. C’est pourquoi ce site ne propose pas de calculateur de verres. Le seul moyen sûr est de ne pas boire avant de conduire, ou de souffler dans un éthylotest homologué.' },
      { q: 'Le refus de souffler est-il puni comme l’alcool ?', a: 'Oui, le refus de se soumettre aux vérifications est un délit puni des mêmes peines que la conduite sous l’empire d’un état alcoolique, et il entraîne la suspension obligatoire du permis par le préfet, selon l’article L224-2. Refuser ne protège donc pas le conducteur.' },
      { q: 'Qu’a changé la loi du 18 août 2026 ?', a: `Elle a alourdi les peines du délit d’alcool, portées à ${h.num(A(h).delit_prison_ans)} ans et ${h.eur(A(h).delit_amende_max)}, et celles des stupéfiants ; la combinaison des deux est punie de ${h.num(A(h).stupefiants_alcool_prison_ans)} ans et ${h.eur(A(h).stupefiants_alcool_amende_max)}, avec un retrait des trois quarts des points. Les nouvelles règles s’appliquent depuis le 20 août 2026.` },
      { q: 'Peut-on récupérer six points après une alcoolémie ?', a: `Oui, par un stage qui en rend ${h.num(h.P.permis.stage_points)} une fois par an, ou après trois ans sans nouvelle infraction, puisqu’il s’agit d’une contravention de 4e classe ou d’un délit. Sur un permis probatoire de six points, six points retirés invalident le permis : le stage n’est alors plus possible.` },
    ],
    body: (h) => `<h2>Les seuils et les sanctions</h2>
${h.table(['Taux (sang / air)', 'Régime', 'Amende', 'Points'], [[`moins de ${g(h, A(h).seuil_general_g_sang)} / ${mg(h, A(h).seuil_general_mg_air)}`, 'autorisé (hors probatoire)', '—', '0'], [`${g(h, A(h).seuil_probatoire_g_sang)} à ${g(h, A(h).seuil_general_g_sang)}, probatoire`, '4e classe', h.eur(h.P.classes['4'].forfaitaire), String(A(h).contravention_points)], [`${g(h, A(h).seuil_general_g_sang)} à ${g(h, A(h).seuil_delit_g_sang)}`, '4e classe', h.eur(h.P.classes['4'].forfaitaire), String(A(h).contravention_points)], [`${g(h, A(h).seuil_delit_g_sang)} et plus / ${mg(h, A(h).seuil_delit_mg_air)}`, 'délit', `${h.eur(A(h).delit_amende_max)} max.`, String(h.P.permis.delit_retrait)]], 'Alcool au volant : seuils de l’article R234-1 et du délit L234-1', ['l', 'l', 'r', 'r'])}
<!--mini:alcool-->
<h2>Stupéfiants : le dépistage suffit</h2>
<p>Pour les stupéfiants, il n’y a pas de seuil : un dépistage positif, confirmé par une analyse, établit l’infraction. ${h.src('l235_1', 'L’article L235-1')}, modifié par ${h.src('loi2026', 'la loi du 18 août 2026')}, prévoit ${h.num(A(h).stupefiants_prison_ans)} ans et ${h.eur(A(h).stupefiants_amende_max)}, et ${h.num(A(h).stupefiants_alcool_prison_ans)} ans et ${h.eur(A(h).stupefiants_alcool_amende_max)} avec de l’alcool.</p>
<h2>Le permis le jour même</h2>
<p>Depuis le 20 août 2026, ${h.src('l224_2', 'l’article L224-2')} oblige le préfet à suspendre le permis quand l’alcoolémie, l’usage de stupéfiants ou le refus de se soumettre aux vérifications est établi, pour ${h.num(A(h).suspension_prefet_max_mois)} mois au plus ; il a cent vingt heures pour le faire quand une analyse est nécessaire. Voir la page ${h.a('suspension-permis', 'suspension de permis')}.</p>`,
  },
  en: {
    slug: 'drink-driving-penalties-france',
    nav: 'Alcohol and drugs',
    card: '€135 and 6 points from 0.5 g/l; an offence from 0.8 g/l, toughened in August 2026.',
    title: 'Drink-driving in France: 2026 penalties, fine, points',
    description: 'Drink-driving in France, 2026: €135 and 6 points from 0.5 to 0.8 g/l (0.2 for new drivers), a criminal offence above, 3 years and €9,000 since August 2026.',
    h1: 'Drink-driving in France: the penalties since 18 August 2026',
    intro: 'Two limits, two regimes: a minor offence from 0.5 g/l, a criminal offence from 0.8 g/l. The law of 18 August 2026 made the offence and drug-driving tougher.',
    resume: (h) => `Driving with a blood alcohol level between ${g(h, A(h).seuil_general_g_sang)} and ${g(h, A(h).seuil_delit_g_sang)}, that is ${mg(h, A(h).seuil_general_mg_air)} to ${mg(h, A(h).seuil_delit_mg_air)} of exhaled air, is a class 4 offence under article R234-1 of the French Highway Code: a ${h.eur(h.P.classes['4'].forfaitaire)} standard fine, ${h.num(A(h).contravention_points)} points off a French licence and a possible three-year suspension. For probationary licence holders, public-transport drivers and learners, the limit drops to ${g(h, A(h).seuil_probatoire_g_sang)}. From ${g(h, A(h).seuil_delit_g_sang)} it is a criminal offence: since law 2026-798 of 18 August 2026, article L234-1 provides ${h.num(A(h).delit_prison_ans)} years in prison and a ${h.eur(A(h).delit_amende_max)} fine, with six points taken. Driving after taking drugs carries the same penalties under article L235-1, rising to ${h.num(A(h).stupefiants_alcool_prison_ans)} years and ${h.eur(A(h).stupefiants_alcool_amende_max)} when alcohol is added, with ${h.num(h.P.permis.stupefiants_alcool_retrait)} points taken. The prefect must suspend the licence, for up to ${h.num(A(h).suspension_prefet_max_mois)} months, once alcohol or drug use is established.`,
    faqs: (h) => [
      { q: 'How many drinks to reach 0.5 g/l?', a: 'No figure holds for everyone: the level depends on weight, sex, food, how fast you drink and how long ago. That is why this site offers no drinks calculator. The only safe course is not to drink before driving, or to use an approved breathalyser.' },
      { q: 'Is refusing a breath test punished like drink-driving?', a: 'Yes, refusing the checks is a criminal offence carrying the same penalties as drink-driving, and it triggers a compulsory suspension by the prefect under article L224-2. Refusing does not protect the driver: the points, the fine and the suspension follow as if the test had been positive.' },
      { q: 'What did the law of 18 August 2026 change?', a: `It raised the penalties for the drink-driving offence to ${h.num(A(h).delit_prison_ans)} years and ${h.eur(A(h).delit_amende_max)}, and for drug-driving; the combination of both carries ${h.num(A(h).stupefiants_alcool_prison_ans)} years and ${h.eur(A(h).stupefiants_alcool_amende_max)}, with three quarters of the points taken. The new rules apply since 20 August 2026.` },
      { q: 'I am visiting with a foreign licence: which limit applies?', a: `The general limit of ${g(h, A(h).seuil_general_g_sang)} applies to every driver in France. The lower ${g(h, A(h).seuil_probatoire_g_sang)} limit in article R234-1 targets French probationary licences, learners and public-transport drivers. The French limit can be stricter or looser than at home: what counts is where you drive.` },
    ],
    body: (h) => `<h2>The limits and the penalties</h2>
${h.table(['Level (blood / breath)', 'Regime', 'Fine', 'Points'], [[`under ${g(h, A(h).seuil_general_g_sang)} / ${mg(h, A(h).seuil_general_mg_air)}`, 'allowed (except probation)', '—', '0'], [`${g(h, A(h).seuil_probatoire_g_sang)} to ${g(h, A(h).seuil_general_g_sang)}, probation`, 'class 4', h.eur(h.P.classes['4'].forfaitaire), String(A(h).contravention_points)], [`${g(h, A(h).seuil_general_g_sang)} to ${g(h, A(h).seuil_delit_g_sang)}`, 'class 4', h.eur(h.P.classes['4'].forfaitaire), String(A(h).contravention_points)], [`${g(h, A(h).seuil_delit_g_sang)} and over / ${mg(h, A(h).seuil_delit_mg_air)}`, 'criminal offence', `up to ${h.eur(A(h).delit_amende_max)}`, String(h.P.permis.delit_retrait)]], 'Drink-driving: limits in article R234-1 and the L234-1 offence', ['l', 'l', 'r', 'r'])}
<!--mini:alcool-->
<h2>Drugs: a positive test is enough</h2>
<p>For drugs there is no threshold: a positive screening test, confirmed by analysis, establishes the offence. ${h.src('l235_1', 'Article L235-1')}, amended by ${h.src('loi2026', 'the law of 18 August 2026')}, provides ${h.num(A(h).stupefiants_prison_ans)} years and ${h.eur(A(h).stupefiants_amende_max)}, and ${h.num(A(h).stupefiants_alcool_prison_ans)} years and ${h.eur(A(h).stupefiants_alcool_amende_max)} with alcohol.</p>
<h2>The licence the same day</h2>
<p>Since 20 August 2026, ${h.src('l224_2', 'article L224-2')} requires the prefect to suspend the licence once alcohol, drug use or refusal of the checks is established, for up to ${h.num(A(h).suspension_prefet_max_mois)} months; there are a hundred and twenty hours to do so when an analysis is needed. See the ${h.a('suspension-permis', 'licence suspension page')}.</p>`,
  },
});
