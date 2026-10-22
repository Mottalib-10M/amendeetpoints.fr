import { defineGuide, type Helpers } from '../../lib/guide-types';

const V = (h: Helpers) => h.P.vitesse;
const ex = (h: Helpers) => ({ a: h.M.sanctionVitesse(135, 90), b: h.M.sanctionVitesse(124, 90) });

export default defineGuide({
  id: 'suspension-permis',
  group: 'vitesse',
  order: 7,
  tool: 'exces',
  outil: { defaultVitesse: 135, defaultLimite: 90 },
  related: ['exces-40-km-h', 'grand-exces', 'exces-30-km-h', 'alcool-au-volant', 'amende-telephone'],
  sources: ['l224_2', 'r413_14', 'l413_1', 'spVitesse'],
  fr: {
    slug: 'suspension-permis-exces-de-vitesse',
    nav: 'Suspension du permis',
    card: 'Rétention 72 h, préfet jusqu’à 6 mois, juge jusqu’à 3 ans : selon l’excès.',
    title: 'Suspension de permis pour excès de vitesse : quand, combien',
    description: 'Suspension de permis pour excès de vitesse : juge jusqu’à 3 ans dès 30 km/h, rétention 72 h et préfet jusqu’à 6 mois dès 40 km/h avec interception. Votre cas.',
    h1: 'Suspension de permis pour excès de vitesse : à partir de quand',
    intro: 'Deux autorités peuvent suspendre un permis pour vitesse : le préfet, tout de suite, et le juge, plus tard. Leurs seuils et leurs durées ne sont pas les mêmes.',
    resume: (h) => {
      const e = ex(h);
      return `Un excès de vitesse peut conduire à deux suspensions distinctes. La suspension judiciaire est une peine complémentaire prévue par l’article R413-14 du Code de la route à partir de 30 km/h d’excès retenu, pour trois ans au plus, et par l’article L413-1 pour le délit de 50 km/h ou plus. Elle n’est prononcée que par un juge, si l’affaire va devant le tribunal. La suspension administrative relève du préfet : l’article L224-2, en vigueur depuis le 20 août 2026, lui permet de suspendre le permis jusqu’à ${h.num(V(h).suspension_prefet_max_mois)} mois quand un conducteur est intercepté après un excès de 40 km/h ou plus, mesuré par un appareil homologué. Les forces de l’ordre retiennent alors le permis sur place ; le préfet a soixante-douze heures pour décider, faute de quoi le permis est rendu. La durée subie s’impute sur la suspension que le juge prononcera. Exemple : ${h.num(e.a.mesuree)} km/h mesurés sur une route à 90 donnent ${h.num(e.a.retenue)} km/h retenus, soit ${h.num(e.a.exces)} km/h d’excès : suspension judiciaire encourue, pas de suspension préfectorale.`;
    },
    faqs: (h) => [
      { q: 'Un flash par radar automatique peut-il entraîner une suspension ?', a: 'Pas une suspension préfectorale, qui suppose l’interception du conducteur. Après un flash, l’avis propose l’amende forfaitaire ; la payer règle l’affaire sans suspension, même pour un excès de 40 km/h. Pour le délit de 50 km/h ou plus, en revanche, le tribunal peut être saisi et prononcer une suspension, même sans interception.' },
      { q: 'Qu’est-ce que le permis blanc ?', a: 'C’est le nom courant de la suspension aménagée : le juge limite la suspension à la conduite en dehors de l’activité professionnelle. Cette faculté n’existe pas pour la suspension du préfet, ni pour le délit de grand excès de vitesse, dont l’article L413-1 exclut expressément l’aménagement.' },
      { q: 'Faut-il repasser le permis après une suspension ?', a: 'Non. À la fin d’une suspension, le permis est restitué ; pour une suspension de plus d’un mois, un examen médical et parfois psychotechnique est demandé avant la restitution. Repasser le permis n’est nécessaire qu’après une annulation ou une invalidation pour solde de points nul.' },
      { q: 'La suspension retire-t-elle des points ?', a: 'Non : les points sont retirés au titre de l’infraction, selon le barème, que le permis soit suspendu ou non. Un excès de 40 km/h coûte quatre points, avec ou sans suspension. La suspension interdit seulement de conduire pendant sa durée.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>Qui suspend, quand, pour combien</h2>
${h.table(['Excès retenu', 'Suspension par le juge', 'Rétention et préfet (si intercepté)'], [['moins de 30 km/h', 'non prévue', 'non'], ['30 à 39 km/h', '3 ans au plus', 'non'], ['40 à 49 km/h', '3 ans au plus', `oui, ${h.num(V(h).suspension_prefet_max_mois)} mois au plus`], ['50 km/h et plus (délit)', '3 ans au plus, sans aménagement', `oui, ${h.num(V(h).suspension_prefet_max_mois)} mois au plus`]], 'Suspension du permis selon l’excès de vitesse retenu', ['l', 'l', 'l'])}
<p>Juste en dessous du seuil de 30 km/h, ${h.num(e.b.mesuree)} km/h mesurés sur la même route à 90 donnent ${h.num(e.b.exces)} km/h d’excès retenu : aucune suspension n’est encourue. ${h.src('l224_2', 'L’article L224-2')} porte la durée maximale à un an pour d’autres motifs (alcool, stupéfiants, accident corporel, refus d’obtempérer) et la double pour les conducteurs professionnels de transport de personnes.</p>
<!--mini:suspension-->
<h2>La procédure après une interception</h2>
<p>Le permis est retenu contre un avis de rétention, qui interdit de conduire. Dans les soixante-douze heures, le préfet prend un arrêté de suspension, notifié au conducteur, ou ne fait rien, et le permis est rendu. L’arrêté peut être contesté devant le tribunal administratif, sans effet suspensif. L’excès lui-même est ensuite jugé ou réglé par l’amende ; les points sont retirés à ce moment-là.</p>
<h2>Le téléphone peut s’ajouter</h2>
<p>L’article L224-2 permet aussi au préfet de suspendre le permis d’un conducteur intercepté avec un téléphone tenu en main en même temps qu’une autre infraction de la liste fixée par décret. Voir la page ${h.a('amende-telephone', 'du téléphone au volant')}.</p>`;
    },
  },
  en: {
    slug: 'licence-suspension-for-speeding',
    nav: 'Licence suspension',
    card: '72-hour seizure, prefect up to 6 months, court up to 3 years: by the excess.',
    title: 'Licence suspension for speeding in France: when, how long',
    description: 'Licence suspension for speeding in France: a court can suspend for 3 years from 30 km/h over; seizure and a prefect’s suspension of 6 months from 40 km/h.',
    h1: 'Licence suspension for speeding in France: from when',
    intro: 'Two authorities can suspend a licence for speeding: the prefect, at once, and the court, later. Their thresholds and maximum lengths differ.',
    resume: (h) => {
      const e = ex(h);
      return `Speeding can lead to two separate suspensions. A court suspension is an additional penalty that article R413-14 of the French Highway Code allows from 30 km/h over the limit, for up to three years, and that article L413-1 allows for the criminal offence of 50 km/h or more over. Only a judge can impose it, if the case goes to court. An administrative suspension belongs to the prefect: article L224-2, in force since 20 August 2026, lets the prefect suspend the licence for up to ${h.num(V(h).suspension_prefet_max_mois)} months when a driver is stopped after speeding by 40 km/h or more, measured by an approved device. Police seize the licence on the spot; the prefect has seventy-two hours to decide, otherwise the licence is returned. Time served counts towards any suspension a court later imposes. Example: ${h.num(e.a.mesuree)} km/h measured on a 90 road gives ${h.num(e.a.retenue)} km/h recorded, ${h.num(e.a.exces)} km/h over: a court suspension is possible, a prefect’s suspension is not.`;
    },
    faqs: (h) => [
      { q: 'Can a camera flash lead to a suspension?', a: 'Not a prefect’s suspension, which requires the driver to be stopped. After a flash, the notice offers the fixed fine; paying it settles the case without suspension, even at 40 km/h over. For the 50 km/h-over offence, however, the case can go to court and a suspension can be imposed without the driver ever being stopped.' },
      { q: 'What is a “permis blanc”?', a: 'It is the everyday name for a work-only suspension: the court limits the suspension to driving outside working activity. That option does not exist for a prefect’s suspension, nor for the 50 km/h-over offence, where article L413-1 expressly rules it out.' },
      { q: 'Do I need to retake my test after a suspension?', a: 'No. At the end of a suspension the licence is returned; for a suspension of more than a month, a medical check, sometimes with aptitude tests, is required first. Retaking the test is only needed after a cancellation, or after the licence has been invalidated for running out of points.' },
      { q: 'Can a foreign licence be suspended in France?', a: 'The suspension stops you from driving in France, whatever country issued the licence. If you are stopped, the licence can be seized on the spot like a French one. What happens in your home country afterwards depends on its own rules and on any agreement with France.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>Who suspends, when, for how long</h2>
${h.table(['Recorded excess', 'Court suspension', 'Seizure and prefect (if stopped)'], [['under 30 km/h', 'not provided', 'no'], ['30 to 39 km/h', 'up to 3 years', 'no'], ['40 to 49 km/h', 'up to 3 years', `yes, up to ${h.num(V(h).suspension_prefet_max_mois)} months`], ['50 km/h and over (offence)', 'up to 3 years, no work exemption', `yes, up to ${h.num(V(h).suspension_prefet_max_mois)} months`]], 'Licence suspension by recorded excess', ['l', 'l', 'l'])}
<p>Just under the 30 km/h threshold, ${h.num(e.b.mesuree)} km/h measured on the same 90 road gives ${h.num(e.b.exces)} km/h recorded over: no suspension is possible. ${h.src('l224_2', 'Article L224-2')} raises the maximum to one year for other grounds (alcohol, drugs, injury accident, refusing to stop) and doubles it for professional passenger-transport drivers.</p>
<!--mini:suspension-->
<h2>The procedure after being stopped</h2>
<p>The licence is taken in exchange for a seizure notice, which forbids driving. Within seventy-two hours the prefect issues a suspension order, served on the driver, or does nothing, and the licence is returned. The order can be challenged before the administrative court, without suspending its effect. The speeding itself is then tried or settled by the fine; points are taken at that point.</p>
<h2>A phone can add to it</h2>
<p>Article L224-2 also lets the prefect suspend the licence of a driver stopped with a hand-held phone at the same time as another offence on the list set by decree. See the ${h.a('amende-telephone', 'phone at the wheel page')}.</p>`;
    },
  },
});
