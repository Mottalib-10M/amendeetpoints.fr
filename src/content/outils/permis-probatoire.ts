import { defineGuide, type Helpers } from '../../lib/guide-types';

const Pm = (h: Helpers) => h.P.permis;
const pb = (h: Helpers, m: number, aac: boolean, r: Array<{ mois: number; points: number }> = []) => h.M.probatoire(m, aac, r);

export default defineGuide({
  id: 'permis-probatoire',
  group: 'points',
  order: 4,
  tool: 'points',
  outil: { mode: 'probatoire', defaults: [['v1h', 4], ['0', 0], ['0', 0]] },
  related: ['combien-de-points', 'stage-recuperation-points', 'limitations-de-vitesse', 'alcool-au-volant', 'exces-moins-de-20'],
  sources: ['l223_1', 'spProbatoire', 'l223_6', 'spRecup', 'spVitesse', 'r234_1'],
  fr: {
    slug: 'permis-probatoire-points',
    nav: 'Permis probatoire',
    card: '6 points, +2 par an (+3 en conduite accompagnée), perdus à la première faute.',
    title: 'Permis probatoire : 6 points, majorations et stage en 2026',
    description: 'Permis probatoire : 6 points au départ, +2 par an pendant 3 ans (+3 pendant 2 ans en conduite accompagnée), majorations perdues dès une infraction, stage.',
    h1: 'Permis probatoire : votre capital de points aujourd’hui',
    intro: 'Indiquez depuis quand vous avez le permis, si vous avez fait la conduite accompagnée et vos éventuelles infractions : l’outil donne votre capital et ce qu’il deviendra.',
    resume: (h) => `Un permis probatoire commence avec ${h.num(Pm(h).probatoire_initial)} points. L’article L223-1 du Code de la route le majore chaque année, pendant la période probatoire, d’un sixième du nombre maximal de points, soit ${h.num(Pm(h).probatoire_gain_annuel)} points par an pendant ${h.num(Pm(h).probatoire_duree_ans)} ans, ou d’un quart, ${h.num(Pm(h).probatoire_aac_gain_annuel)} points par an pendant ${h.num(Pm(h).probatoire_aac_duree_ans)} ans, après l’apprentissage anticipé de la conduite. La condition est stricte : aucune infraction ayant donné lieu à un retrait de points ne doit avoir été commise depuis le début de la période probatoire. Une seule infraction suffit donc à perdre toutes les majorations restantes, en plus des points retirés. Exemple : un conducteur titulaire du permis depuis trente mois, sans conduite accompagnée et sans infraction, a ${h.num(pb(h, 30, false).capital)} points ; le même conducteur ayant perdu un point au dix-huitième mois n’en a que ${h.num(pb(h, 30, false, [{ mois: 18, points: 1 }]).capital)}. Un retrait d’au moins trois points rend le stage obligatoire, dans les quatre mois. Une formation complémentaire facultative, entre le sixième et le douzième mois, raccourcit la période probatoire, selon la fiche Service Public.`,
    faqs: (h) => [
      { q: 'Les majorations perdues reviennent-elles à la fin de la période ?', a: 'Non. Le texte subordonne chaque majoration à l’absence d’infraction depuis le début de la période. Une fois perdues, elles ne reviennent pas, et le capital ne monte plus que par la récupération ordinaire de l’article L223-6 : retour au maximum après deux ou trois ans sans infraction, ou par un stage.' },
      { q: 'Quelle est la limite d’alcool en permis probatoire ?', a: `${h.num(h.P.alcool.seuil_probatoire_g_sang, 1)} g/l de sang, soit ${h.num(h.P.alcool.seuil_probatoire_mg_air, 2)} mg/l d’air expiré, au lieu de ${h.num(h.P.alcool.seuil_general_g_sang, 1)} g/l pour les autres conducteurs. En pratique, cela revient à ne pas boire du tout avant de conduire. L’infraction retire six points, soit tout le capital d’un permis probatoire neuf.` },
      { q: 'Que se passe-t-il si je perds les six points la première année ?', a: 'Le permis est invalidé, comme tout permis dont le solde tombe à zéro. Il faut le restituer, attendre le délai prévu, puis repasser l’examen. Avec six points seulement, une seule infraction lourde, comme l’alcool à 0,2 g/l ou le refus de priorité à un piéton, y suffit.' },
    ],
    body: (h) => `<h2>Le capital, année par année, sans infraction</h2>
${h.table(['Fin de l’année', 'Formation classique', 'Conduite accompagnée'], [1, 2, 3].map((a) => [`${h.num(a)}${a === 1 ? 're' : 'e'} année`, `${h.num(pb(h, a * 12, false).capital)} points`, `${h.num(pb(h, a * 12, true).capital)} points`]), 'Permis probatoire : capital sans infraction (article L223-1)', ['l', 'r', 'r'])}
<p>${h.src('l223_1', 'L’article L223-1')} fixe la règle ; la fiche Service Public précise qu’une formation complémentaire suivie entre le sixième et le douzième mois réduit la durée de la période probatoire.</p>
<!--mini:probatoire-->
<h2>Les limites de vitesse du jeune conducteur</h2>
<p>Pendant toute la période, les vitesses maximales sont abaissées : 110 km/h sur autoroute, 100 sur les routes à chaussées séparées, 80 sur les sections à deux voies dans le même sens. Le tableau complet est sur la page ${h.a('limitations-de-vitesse', 'des limitations de vitesse')}. Un excès se calcule sur cette limite réduite.</p>`,
  },
  en: {
    slug: 'probationary-licence-points-france',
    nav: 'Probationary licence',
    card: '6 points, +2 a year (+3 after accompanied driving), lost at the first offence.',
    title: 'Probationary licence in France: 6 points, yearly top-ups',
    description: 'French probationary licence: 6 points at the start, +2 a year for 3 years (+3 a year for 2 years after accompanied driving), top-ups lost at the first offence.',
    h1: 'French probationary licence: your points today',
    intro: 'Enter how long you have held your licence, whether you did accompanied driving and any offences: the tool gives your points and what they will become.',
    resume: (h) => `A French probationary licence (permis probatoire) starts with ${h.num(Pm(h).probatoire_initial)} points. Article L223-1 of the Highway Code tops it up every year of the probationary period by one sixth of the maximum, ${h.num(Pm(h).probatoire_gain_annuel)} points a year for ${h.num(Pm(h).probatoire_duree_ans)} years, or by a quarter, ${h.num(Pm(h).probatoire_aac_gain_annuel)} points a year for ${h.num(Pm(h).probatoire_aac_duree_ans)} years, after early accompanied driving (AAC). The condition is strict: no offence costing points may have been committed since the start of the probationary period. A single offence is therefore enough to lose every remaining top-up, on top of the points taken. Example: a driver who has held the licence for thirty months, without accompanied driving and with no offence, has ${h.num(pb(h, 30, false).capital)} points; the same driver having lost one point in the eighteenth month has only ${h.num(pb(h, 30, false, [{ mois: 18, points: 1 }]).capital)}. Losing three points or more makes a course compulsory, within four months. An optional additional training session, between the sixth and twelfth month, shortens the probationary period, according to Service Public.`,
    faqs: (h) => [
      { q: 'Do the lost top-ups come back at the end of probation?', a: 'No. The text makes each top-up conditional on no offence since the start of the period. Once lost, they do not return, and the balance only rises through ordinary recovery under article L223-6: back to the maximum after two or three years with no offence, or through a course.' },
      { q: 'What is the alcohol limit on a probationary licence?', a: `${h.num(h.P.alcool.seuil_probatoire_g_sang, 1)} g/l of blood, or ${h.num(h.P.alcool.seuil_probatoire_mg_air, 2)} mg/l of breath, instead of ${h.num(h.P.alcool.seuil_general_g_sang, 1)} g/l for other drivers. In practice it means not drinking at all before driving. The offence costs six points, the whole balance of a new probationary licence, which is then invalid.` },
      { q: 'Can the probationary period be shortened?', a: 'Yes. According to Service Public, an optional additional training day (seven hours) taken between the sixth and twelfth month after passing, at a driving school with the quality label, shortens the period: to two years instead of three with standard training, and to eighteen months instead of two after accompanied driving.' },
    ],
    body: (h) => `<h2>Points year by year, with no offence</h2>
${h.table(['End of year', 'Standard training', 'Accompanied driving'], [1, 2, 3].map((a) => [`Year ${h.num(a)}`, `${h.num(pb(h, a * 12, false).capital)} points`, `${h.num(pb(h, a * 12, true).capital)} points`]), 'Probationary licence: points with no offence (article L223-1)', ['l', 'r', 'r'])}
<p>${h.src('l223_1', 'Article L223-1')} sets the rule; the Service Public page adds that additional training taken between the sixth and twelfth month shortens the probationary period.</p>
<!--mini:probatoire-->
<h2>Speed limits for new drivers</h2>
<p>Throughout the period, lower maximum speeds apply: 110 km/h on motorways, 100 on dual carriageways, 80 on sections with two lanes in the same direction. The full table is on the ${h.a('limitations-de-vitesse', 'speed limits page')}. Any excess is measured from that lower limit.</p>`,
  },
});
