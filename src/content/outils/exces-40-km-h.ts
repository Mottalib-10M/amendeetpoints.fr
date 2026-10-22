import { defineGuide, type Helpers } from '../../lib/guide-types';

const C4 = (h: Helpers) => h.P.classes['4'];
const ex = (h: Helpers) => ({ a: h.M.sanctionVitesse(128, 80), b: h.M.sanctionVitesse(96, 50), c: h.M.sanctionVitesse(137, 80) });

export default defineGuide({
  id: 'exces-40-km-h',
  group: 'vitesse',
  order: 4,
  tool: 'exces',
  outil: { defaultVitesse: 128, defaultLimite: 80 },
  related: ['grand-exces', 'suspension-permis', 'exces-30-km-h', 'stage-recuperation-points', 'combien-de-points'],
  sources: ['r413_14', 'l224_2', 'l223_6', 'r49_9', 'spBareme', 'spEtranger'],
  fr: {
    slug: 'exces-de-vitesse-40-km-h',
    nav: 'De 40 à 49 km/h',
    card: '4 points, rétention immédiate du permis, suspension par le préfet.',
    title: 'Excès de vitesse de 40 km/h : 4 points, rétention du permis',
    description: 'Excès de vitesse de 40 à 49 km/h : 135 €, 4 points, permis retenu si vous êtes arrêté, suspension préfectorale jusqu’à 6 mois, judiciaire jusqu’à 3 ans.',
    h1: 'Excès de vitesse de 40 à 49 km/h : 4 points, permis retenu',
    intro: 'Dernière tranche avant le délit. L’amende reste de 4e classe, mais si les gendarmes vous arrêtent, vous repartez sans permis.',
    resume: (h) => {
      const e = ex(h);
      return `Un excès de vitesse compris entre 40 et 49 km/h est une contravention de 4e classe : ${h.eur(C4(h).forfaitaire)} d’amende forfaitaire, ${h.eur(C4(h).minoree!)} minorée, ${h.eur(C4(h).majoree)} majorée. L’article R413-14 retire quatre points et permet au juge de suspendre le permis pendant trois ans au plus. La différence avec la tranche précédente tient à l’interception : lorsque le conducteur est arrêté sur le bord de la route, les forces de l’ordre retiennent son permis sur-le-champ, pour soixante-douze heures, et le préfet peut ensuite le suspendre jusqu’à ${h.num(h.P.vitesse.suspension_prefet_max_mois)} mois en application de l’article L224-2, dans sa version en vigueur depuis le 20 août 2026. Après un simple flash, l’avis de l’ANTAI suit le circuit ordinaire de l’amende forfaitaire. Exemple : ${h.num(e.a.mesuree)} km/h mesurés par un radar fixe sur une route à 80 donnent ${h.num(e.a.retenue)} km/h retenus, ${h.num(e.a.exces)} km/h d’excès et ${h.num(e.a.points)} points. Un kilomètre-heure retenu de plus au-delà de 49, et c’est le délit de grand excès de vitesse.`;
    },
    faqs: (h) => [
      { q: 'Que se passe-t-il pendant les 72 heures de rétention ?', a: 'Vous ne pouvez plus conduire. Le permis est conservé par les forces de l’ordre et le préfet dispose de ce délai pour prendre un arrêté de suspension provisoire. S’il ne le fait pas, le permis vous est rendu. Pendant la rétention, le véhicule peut être immobilisé si aucun autre conducteur ne peut le prendre.' },
      { q: 'La suspension du préfet s’ajoute-t-elle à celle du juge ?', a: 'Non : la durée de la suspension préfectorale s’impute sur celle que le juge prononcera éventuellement. Si le tribunal fixe une suspension plus courte que celle déjà subie, rien de plus n’est exécuté. Si l’affaire se règle par l’amende forfaitaire, la suspension administrative reste la seule mesure appliquée.' },
      { q: 'Peut-on conduire avec un permis suspendu pour aller travailler ?', a: 'Pas pendant une suspension préfectorale. Le juge, lui, peut aménager sa propre suspension en la limitant à la conduite en dehors de l’activité professionnelle. Conduire malgré une suspension est un délit, plus lourdement puni que l’excès lui-même, et il expose à l’annulation du permis.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>Les vitesses qui mènent à cette tranche</h2>
${h.table(['Limite', 'Retenu', 'Radar fixe : mesuré', 'Délit dès (mesuré)'], [50, 70, 80, 90, 110, 130].map((l) => [`${l} km/h`, `${h.num(l + 40)} – ${h.num(l + 49)} km/h`, `${h.num(h.M.mesureePourRetenue(l + 40, 'fixe'))} – ${h.num(h.M.mesureePourRetenue(l + 50, 'fixe') - 1)} km/h`, `${h.num(h.M.mesureePourRetenue(l + 50, 'fixe'))} km/h`]), 'Excès de 40 à 49 km/h et seuil du délit, radar fixe', ['l', 'r', 'r', 'r'])}
<p>En agglomération, ${h.num(e.b.mesuree)} km/h mesurés pour 50 autorisés suffisent à atteindre ${h.num(e.b.exces)} km/h d’excès retenu. Sur une route à 80, la marge en pourcentage au-dessus de 100 km/h repousse la limite du délit : il faut ${h.num(e.c.mesuree)} km/h mesurés pour être retenu à ${h.num(e.c.retenue)} km/h.</p>
<h2>Arrêté ou flashé : deux suites différentes</h2>
<p>Flashé par un radar automatique, vous recevez un avis de contravention à 4e classe : paiement, points retirés, pas de rétention. Arrêté par une patrouille, vous recevez le même procès-verbal, mais aussi un avis de rétention du permis, puis, le plus souvent, un arrêté de suspension du préfet. ${h.src('l224_2', 'L’article L224-2 en vigueur')} fixe le maximum à ${h.num(h.P.vitesse.suspension_prefet_max_mois)} mois pour l’excès de vitesse. La page ${h.a('suspension-permis', 'suspension de permis')} détaille la procédure.</p>
<!--mini:suspension_45-->
<h2>Quatre points d’un coup</h2>
<p>Avec ${h.num(h.P.permis.points_max - e.a.points)} points restants sur un permis plein, la marge devient étroite ; sur un permis probatoire de six points, il en reste deux, et le stage est obligatoire. Les quatre points reviennent après trois ans sans nouvelle infraction, ou par un ${h.a('stage-recuperation-points', 'stage')}.</p>`;
    },
  },
  en: {
    slug: 'speeding-40-km-h-over',
    nav: '40 to 49 km/h over',
    card: '4 points, licence seized on the spot, suspension by the prefect.',
    title: 'Speeding 40 km/h over in France: 4 points, licence seized',
    description: 'Speeding 40 to 49 km/h over in France: €135, 4 points, licence seized on the spot if you are stopped, a prefect’s suspension of up to 6 months, a court’s 3.',
    h1: 'Speeding 40 to 49 km/h over: 4 points, licence seized',
    intro: 'The last band before the criminal offence. The fine is still class 4, but if the police stop you, you drive away without your licence.',
    resume: (h) => {
      const e = ex(h);
      return `Speeding by 40 to 49 km/h is a class 4 offence: a ${h.eur(C4(h).forfaitaire)} standard fine, ${h.eur(C4(h).minoree!)} reduced, ${h.eur(C4(h).majoree)} increased. Article R413-14 takes four points and allows a court to suspend the licence for up to three years. The difference from the band below lies in being stopped: when the driver is pulled over at the roadside, police seize the licence on the spot for seventy-two hours, and the prefect may then suspend it for up to ${h.num(h.P.vitesse.suspension_prefet_max_mois)} months under article L224-2, as in force since 20 August 2026. After a mere camera flash, the ANTAI notice follows the usual fixed-fine route. Example: ${h.num(e.a.mesuree)} km/h measured by a fixed camera on an 80 road gives ${h.num(e.a.retenue)} km/h recorded, ${h.num(e.a.exces)} km/h over and ${h.num(e.a.points)} points. One more recorded km/h beyond 49 over, and it becomes the criminal offence of extreme speeding.`;
    },
    faqs: (h) => [
      { q: 'What happens during the 72-hour seizure?', a: 'You may not drive. Police keep the licence and the prefect has that time to issue a provisional suspension order. If no order is made, the licence is returned. During the seizure, the vehicle may be immobilised if no other driver can take it.' },
      { q: 'Is the prefect’s suspension added to the court’s?', a: 'No: time served under the prefect’s suspension counts towards any suspension the court later imposes. If the court sets a shorter period than already served, nothing more applies. If the case is settled by the fixed fine, the administrative suspension is the only measure applied.' },
      { q: 'A foreign driver is stopped at 45 km/h over: what happens?', a: 'The licence can be seized and the right to drive in France suspended, whatever the issuing country. A driver with no residence in France must pay a deposit (consignation) set by the seriousness of the offence: the vehicle can be kept until it is paid, and impounded at the driver’s cost otherwise. The public prosecutor decides within 24 hours.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>The speeds that lead to this band</h2>
${h.table(['Limit', 'Recorded', 'Fixed camera: measured', 'Offence from (measured)'], [50, 70, 80, 90, 110, 130].map((l) => [`${l} km/h`, `${h.num(l + 40)} – ${h.num(l + 49)} km/h`, `${h.num(h.M.mesureePourRetenue(l + 40, 'fixe'))} – ${h.num(h.M.mesureePourRetenue(l + 50, 'fixe') - 1)} km/h`, `${h.num(h.M.mesureePourRetenue(l + 50, 'fixe'))} km/h`]), '40 to 49 km/h over and the offence threshold, fixed camera', ['l', 'r', 'r', 'r'])}
<p>In a built-up area, ${h.num(e.b.mesuree)} km/h measured where 50 is allowed is enough for ${h.num(e.b.exces)} km/h recorded over. On an 80 road the percentage margin above 100 km/h pushes back the offence threshold: you need ${h.num(e.c.mesuree)} km/h measured to be recorded at ${h.num(e.c.retenue)} km/h.</p>
<h2>Stopped or flashed: two different outcomes</h2>
<p>Flashed by an automatic camera, you receive a class 4 notice: payment, points taken, no seizure. Stopped by a patrol, you receive the same report, plus a licence-seizure notice and, most often, a suspension order from the prefect. ${h.src('l224_2', 'Article L224-2 in force')} sets the maximum at ${h.num(h.P.vitesse.suspension_prefet_max_mois)} months for speeding. The ${h.a('suspension-permis', 'licence suspension page')} sets out the procedure.</p>
<!--mini:suspension_45-->
<h2>Four points in one go</h2>
<p>With ${h.num(h.P.permis.points_max - e.a.points)} points left on a full licence, the margin gets thin; on a six-point probationary licence two remain, and a course becomes compulsory. The four points return after three years with no new offence, or through a ${h.a('stage-recuperation-points', 'course')}.</p>`;
    },
  },
});
