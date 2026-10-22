import { defineGuide, type Helpers } from '../../lib/guide-types';

const C4 = (h: Helpers) => h.P.classes['4'];
const ex = (h: Helpers) => ({ a: h.M.sanctionVitesse(118, 80), b: h.M.sanctionVitesse(85, 50), c: h.M.sanctionVitesse(127, 90) });

export default defineGuide({
  id: 'exces-30-km-h',
  group: 'vitesse',
  order: 3,
  tool: 'exces',
  outil: { defaultVitesse: 118, defaultLimite: 80 },
  related: ['exces-40-km-h', 'suspension-permis', 'stage-recuperation-points', 'exces-20-km-h', 'permis-probatoire'],
  sources: ['r413_14', 'l223_6', 'r49_9', 'spBareme', 'spRecup', 'spEtranger'],
  fr: {
    slug: 'exces-de-vitesse-30-km-h',
    nav: 'De 30 à 39 km/h',
    card: '135 €, 3 points et jusqu’à 3 ans de suspension par le juge.',
    title: 'Excès de vitesse de 30 km/h : 135 €, 3 points, suspension',
    description: 'Excès de vitesse de 30 à 39 km/h : 135 € d’amende, 3 points, suspension du permis possible jusqu’à 3 ans, stage obligatoire en probatoire. Votre seuil.',
    h1: 'Excès de vitesse de 30 à 39 km/h : 3 points et une suspension possible',
    intro: 'À 30 km/h d’excès retenu, l’amende ne change pas, mais deux choses apparaissent : un troisième point et la suspension du permis par le juge.',
    resume: (h) => {
      const e = ex(h);
      return `Un excès de vitesse compris entre 30 et 39 km/h reste une contravention de 4e classe, avec la même amende que la tranche précédente : ${h.eur(C4(h).forfaitaire)}, ${h.eur(C4(h).minoree!)} en paiement rapide, ${h.eur(C4(h).majoree)} majorée. Ce qui change est ailleurs. L’article R413-14 retire trois points et ajoute une peine complémentaire : la suspension du permis de conduire pour trois ans au plus, que seul un juge peut prononcer, si l’affaire passe devant le tribunal de police au lieu d’être réglée par l’amende forfaitaire. Le texte prévoit aussi l’obligation possible d’accomplir un stage de sensibilisation à la sécurité routière. Pour un permis probatoire, perdre trois points d’un coup rend ce stage obligatoire. Exemple : ${h.num(e.a.mesuree)} km/h mesurés par un radar fixe sur une route à 80 donnent ${h.num(e.a.retenue)} km/h retenus, ${h.num(e.a.exces)} km/h d’excès et ${h.num(e.a.points)} points. En pratique, avec un avis envoyé par l’ANTAI après un flash, le paiement éteint l’action publique et aucune suspension n’est prononcée.`;
    },
    faqs: (h) => [
      { q: 'Un excès de 30 km/h flashé par un radar entraîne-t-il automatiquement une suspension ?', a: 'Non. La suspension est une peine complémentaire que seul un juge prononce. Après un flash, l’avis de l’ANTAI propose l’amende forfaitaire : la payer clôt l’affaire, avec trois points en moins mais sans suspension. Le risque existe surtout si l’amende est contestée et que le dossier va au tribunal de police, ou en cas d’interception avec une autre infraction.' },
      { q: 'Le préfet peut-il suspendre le permis pour 30 km/h d’excès ?', a: `Pas sur ce seul motif. La rétention immédiate et la suspension préfectorale de ${h.num(h.P.vitesse.suspension_prefet_max_mois)} mois au plus visent l’excès d’au moins 40 km/h constaté avec interception du conducteur. À 30 km/h, la suspension ne peut venir que du juge, au tribunal de police, et elle reste rare pour un premier excès.` },
      { q: 'Je suis en permis probatoire : que se passe-t-il avec trois points en moins ?', a: 'Une lettre recommandée (formulaire 48N) vous impose un stage de sensibilisation dans les quatre mois. Le stage rend des points, dans la limite du capital du moment, mais la perte prive aussi des majorations annuelles restantes : la période probatoire se termine sans atteindre douze points d’office.' },
      { q: 'Trois points, combien de temps pour les retrouver ?', a: 'Trois ans sans nouvelle infraction entraînant un retrait de points, puisque l’excès de 30 km/h est une contravention de 4e classe. Le délai court à partir du paiement de l’amende. Un stage permet d’en récupérer quatre plus tôt, une fois par an.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>Les seuils de la tranche</h2>
${h.table(['Limite', 'Retenu de… à…', 'Radar fixe : mesuré de… à…'], [50, 70, 80, 90, 110, 130].map((l) => [`${l} km/h`, `${h.num(l + 30)} – ${h.num(l + 39)} km/h`, `${h.num(h.M.mesureePourRetenue(l + 30, 'fixe'))} – ${h.num(h.M.mesureePourRetenue(l + 40, 'fixe') - 1)} km/h`]), 'Vitesses correspondant à un excès de 30 à 39 km/h', ['l', 'r', 'r'])}
<p>En ville, ${h.num(e.b.mesuree)} km/h mesurés pour 50 autorisés suffisent : ${h.num(e.b.retenue)} km/h retenus, ${h.num(e.b.exces)} km/h d’excès. Sur une route à 90, il faut ${h.num(e.c.mesuree)} km/h mesurés pour ${h.num(e.c.exces)} km/h d’excès.</p>
<h2>Ce que la suspension change</h2>
<p>Une suspension judiciaire interdit de conduire tout véhicule pour lequel le permis est exigé, pendant la durée fixée. Elle ne retire pas de points supplémentaires, mais conduire pendant la suspension est un délit distinct. Le juge peut la limiter à la conduite hors activité professionnelle. Le détail, avec la rétention à partir de 40 km/h, est sur la page ${h.a('suspension-permis', 'de la suspension pour excès de vitesse')}.</p>
<!--mini:suspension_35-->
<h2>Le poids des trois points</h2>
<p>Trois points, c’est le quart d’un permis plein et la moitié d’un permis probatoire neuf. Avec ${h.num(h.P.permis.points_max - e.a.points)} points restants, deux autres excès de cette tranche suffiraient presque à invalider le permis. Le ${h.a('stage-recuperation-points', 'stage de récupération')} rend quatre points, une fois par an.</p>`;
    },
  },
  en: {
    slug: 'speeding-30-km-h-over',
    nav: '30 to 39 km/h over',
    card: '€135, 3 points and up to 3 years’ suspension by a court.',
    title: 'Speeding 30 km/h over in France: €135, 3 points, ban risk',
    description: 'Speeding 30 to 39 km/h over in France: a €135 fine, 3 points, a possible licence suspension of up to 3 years, a compulsory course on probation. Your threshold.',
    h1: 'Speeding 30 to 39 km/h over: 3 points and a possible suspension',
    intro: 'At 30 km/h over, the fine does not change, but two things appear: a third point and a court’s power to suspend the licence.',
    resume: (h) => {
      const e = ex(h);
      return `Speeding by 30 to 39 km/h remains a class 4 offence, with the same fine as the band below: ${h.eur(C4(h).forfaitaire)}, ${h.eur(C4(h).minoree!)} if paid quickly, ${h.eur(C4(h).majoree)} increased. What changes lies elsewhere. Article R413-14 takes three points and adds an additional penalty: suspension of the driving licence for up to three years, which only a judge can impose, if the case goes to the police court instead of being settled by the fixed fine. The text also allows a court to order a road-safety awareness course. On a probationary licence, losing three points at once makes that course compulsory. Example: ${h.num(e.a.mesuree)} km/h measured by a fixed camera on an 80 road gives ${h.num(e.a.retenue)} km/h recorded, ${h.num(e.a.exces)} km/h over and ${h.num(e.a.points)} points. In practice, with a notice sent by the ANTAI after a camera flash, paying ends the case and no suspension is imposed.`;
    },
    faqs: (h) => [
      { q: 'Does a camera flash at 30 km/h over mean an automatic suspension?', a: 'No. Suspension is an additional penalty only a judge can impose. After a flash, the ANTAI notice offers the fixed fine: paying it closes the case, with three points gone but no suspension. The risk mainly arises if you contest and the case goes to the police court, or if you are stopped with another offence.' },
      { q: 'Can the prefect suspend my licence for 30 km/h over?', a: `Not on that ground alone. Immediate seizure and the prefect’s suspension of up to ${h.num(h.P.vitesse.suspension_prefet_max_mois)} months apply from 40 km/h over, when the driver is stopped. At 30 km/h over, suspension can only come from a court, the police court, and it remains rare for a first offence.` },
      { q: 'I hold a probationary licence: what happens after losing three points?', a: 'A registered letter (form 48N) requires you to take an awareness course within four months. The course restores points within your current maximum, but the loss also costs the remaining yearly top-ups: the probation period ends without reaching twelve points automatically.' },
      { q: 'I have a foreign licence: what does 30 km/h over mean for me?', a: 'The fine is the same. If you were flashed and not stopped, the notice can follow you home through the European exchange of vehicle data, written in your language. If you are stopped and live outside France, you must pay a deposit set by the seriousness of the offence, or the vehicle can be kept and then impounded at your cost.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>Where the band starts</h2>
${h.table(['Limit', 'Recorded from… to…', 'Fixed camera: measured from… to…'], [50, 70, 80, 90, 110, 130].map((l) => [`${l} km/h`, `${h.num(l + 30)} – ${h.num(l + 39)} km/h`, `${h.num(h.M.mesureePourRetenue(l + 30, 'fixe'))} – ${h.num(h.M.mesureePourRetenue(l + 40, 'fixe') - 1)} km/h`]), 'Speeds that mean 30 to 39 km/h over', ['l', 'r', 'r'])}
<p>In town, ${h.num(e.b.mesuree)} km/h measured where 50 is allowed is enough: ${h.num(e.b.retenue)} km/h recorded, ${h.num(e.b.exces)} km/h over. On a 90 road you need ${h.num(e.c.mesuree)} km/h measured for ${h.num(e.c.exces)} km/h over.</p>
<h2>What a suspension means</h2>
<p>A court suspension bans you from driving any vehicle that requires a licence, for the period set. It takes no extra points, but driving while suspended is a separate criminal offence. The judge may limit it to driving outside work. The details, including seizure from 40 km/h over, are on the ${h.a('suspension-permis', 'licence suspension page')}.</p>
<!--mini:suspension_35-->
<h2>What three points weigh</h2>
<p>Three points are a quarter of a full licence and half of a new probationary one. With ${h.num(h.P.permis.points_max - e.a.points)} points left, two more offences in this band would come close to cancelling the licence. The ${h.a('stage-recuperation-points', 'points-recovery course')} gives back four points, once a year.</p>`;
    },
  },
});
