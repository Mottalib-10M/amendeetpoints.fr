import { defineGuide, type Helpers } from '../../lib/guide-types';

const D = (h: Helpers) => h.P.vitesse.delit;
const ex = (h: Helpers) => ({ a: h.M.sanctionVitesse(140, 80), b: h.M.sanctionVitesse(106, 50), c: h.M.sanctionVitesse(190, 130) });

export default defineGuide({
  id: 'grand-exces',
  group: 'vitesse',
  order: 5,
  tool: 'exces',
  outil: { defaultVitesse: 140, defaultLimite: 80 },
  related: ['exces-40-km-h', 'suspension-permis', 'combien-de-points', 'conducteur-etranger', 'alcool-au-volant'],
  sources: ['l413_1', 'decret2025', 'l224_2', 'l223_2', 'r413_14'],
  fr: {
    slug: 'grand-exces-de-vitesse',
    nav: '50 km/h et plus : le délit',
    card: 'Délit dès le premier dépassement : 300 € ou tribunal, 6 points, confiscation.',
    title: 'Grand excès de vitesse : délit, 300 € et 6 points en 2026',
    description: 'Grand excès de vitesse de 50 km/h ou plus : délit dès la première fois, amende forfaitaire délictuelle de 300 €, 3 750 € au tribunal, 6 points, confiscation.',
    h1: 'Grand excès de vitesse : un délit dès la première fois',
    intro: 'Depuis la fin de décembre 2025, dépasser la limite de 50 km/h ou plus n’est plus une contravention de 5e classe : c’est un délit, inscrit au casier.',
    resume: (h) => {
      const e = ex(h);
      return `Le grand excès de vitesse, un dépassement de 50 km/h ou plus de la vitesse autorisée, est un délit dès la première infraction depuis l’entrée en vigueur, fin décembre 2025, de l’article L413-1 du Code de la route dans sa nouvelle rédaction ; il était auparavant une contravention de 5e classe, et ne devenait un délit qu’en récidive. La peine encourue est de ${h.num(D(h).prison_mois)} mois d’emprisonnement et ${h.eur(D(h).amende_max)} d’amende. Le parquet peut aussi proposer une amende forfaitaire délictuelle de ${h.eur(D(h).afd.forfaitaire)}, ramenée à ${h.eur(D(h).afd.minoree)} en paiement rapide et portée à ${h.eur(D(h).afd.majoree)} en cas de retard, qui éteint les poursuites. Le permis perd la moitié de son nombre maximal de points, soit ${h.num(D(h).points)}. Le juge peut prononcer une suspension de trois ans au plus, sans aménagement pour le travail, une annulation avec interdiction de repasser le permis pendant trois ans, et la confiscation du véhicule, obligatoire en récidive sauf décision motivée. Exemple : ${h.num(e.a.mesuree)} km/h mesurés par un radar fixe sur une route à 80 donnent ${h.num(e.a.retenue)} km/h retenus, ${h.num(e.a.exces)} km/h d’excès : le délit.`;
    },
    faqs: (h) => [
      { q: 'L’amende forfaitaire délictuelle évite-t-elle le casier judiciaire ?', a: 'Non. Payer l’amende forfaitaire délictuelle éteint l’action publique, donc évite le tribunal, mais la condamnation est inscrite au casier judiciaire, comme pour les autres délits traités par cette procédure. C’est la principale différence avec l’ancienne contravention de 5e classe, qui n’y figurait pas.' },
      { q: 'Peut-on récupérer les six points plus vite que trois ans ?', a: `Par un stage, qui rend ${h.num(h.P.permis.stage_points)} points une fois par an, dans la limite de douze. Sans stage, l’article L223-6 rend tous les points après trois ans sans nouvelle infraction, puisqu’il s’agit d’un délit. Le délai court à partir du paiement de l’amende forfaitaire délictuelle ou de la condamnation devenue définitive.` },
      { q: 'Le véhicule de location ou de société peut-il être confisqué ?', a: 'La confiscation prévue par l’article L413-1 vise le véhicule dont le condamné est propriétaire. Une voiture de location ou de fonction, appartenant à un tiers, n’est pas concernée par cette peine, ce qui n’empêche pas une immobilisation ou une mise en fourrière le jour de l’interception.' },
      { q: 'Un radar automatique peut-il constater un délit ?', a: `Oui. Le radar enregistre la vitesse ; l’avis qui suit relève alors de la procédure délictuelle, souvent par l’amende forfaitaire délictuelle de ${h.eur(D(h).afd.forfaitaire)}. Le conducteur n’est pas toujours identifié, et le titulaire de la carte grise doit désigner celui qui conduisait.` },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>À partir de quelle vitesse</h2>
${h.table(['Limite', 'Retenu dès', 'Radar fixe : mesuré dès', 'Radar embarqué : mesuré dès'], [30, 50, 70, 80, 90, 110, 130].map((l) => [`${l} km/h`, `${h.num(l + 50)} km/h`, `${h.num(h.M.mesureePourRetenue(l + 50, 'fixe'))} km/h`, `${h.num(h.M.mesureePourRetenue(l + 50, 'embarque'))} km/h`]), 'Seuil du délit de grand excès de vitesse selon la limite', ['l', 'r', 'r', 'r'])}
<p>En ville, ${h.num(e.b.mesuree)} km/h mesurés pour 50 autorisés suffisent. Sur autoroute, ${h.num(e.c.mesuree)} km/h mesurés par un radar fixe sont retenus à ${h.num(e.c.retenue)} km/h : ${h.num(e.c.exces)} km/h d’excès, donc le délit, alors que ${h.num(e.c.mesuree - 2)} km/h resteraient une contravention de 4e classe.</p>
<h2>Les peines, une par une</h2>
<p>${h.src('l413_1', 'L’article L413-1')} prévoit à titre principal ${h.num(D(h).prison_mois)} mois d’emprisonnement et ${h.eur(D(h).amende_max)} d’amende, et à titre complémentaire : la suspension du permis pour trois ans au plus, que le juge ne peut pas limiter à la conduite hors travail ; l’interdiction de conduire certains véhicules pendant ${h.num(D(h).interdiction_conduire_max_ans)} ans au plus ; l’annulation du permis avec interdiction d’en solliciter un nouveau pendant ${h.num(D(h).annulation_interdiction_max_ans)} ans au plus ; un stage de sensibilisation aux frais du condamné ; la confiscation du véhicule dont il est propriétaire.</p>
<p>Avant la réforme, le dépassement de 50 km/h était une contravention de 5e classe (1 500 € au plus), délictuelle seulement en récidive. Le décret n° 2025-1269 a abrogé l’article R413-14-1 qui la prévoyait.</p>
<!--mini:delit-->
<h2>Avec interception : rétention et suspension immédiate</h2>
<p>Arrêté sur le bord de la route, le conducteur voit son permis retenu, puis suspendu par le préfet pour ${h.num(h.P.vitesse.suspension_prefet_max_mois)} mois au plus, en attendant la décision judiciaire. Le véhicule peut être immobilisé et placé en fourrière. La procédure est détaillée sur la page ${h.a('suspension-permis', 'suspension de permis')}.</p>`;
    },
  },
  en: {
    slug: 'speeding-50-km-h-over-criminal-offence',
    nav: '50+ km/h over: the offence',
    card: 'A criminal offence from the first time: €300 or court, 6 points, confiscation.',
    title: 'Speeding 50 km/h over in France: a criminal offence, €300',
    description: 'Speeding 50 km/h or more over the limit in France: a criminal offence the first time, a €300 fixed fine or up to €3,750 in court, 6 points, confiscation.',
    h1: 'Speeding 50 km/h or more over: a criminal offence',
    intro: 'Since late December 2025, going 50 km/h or more over the limit is no longer a class 5 minor offence: it is a criminal offence that goes on your record.',
    resume: (h) => {
      const e = ex(h);
      return `Extreme speeding, 50 km/h or more over the limit, has been a criminal offence (délit) from the very first time since the new wording of article L413-1 of the French Highway Code came into force at the end of December 2025; it used to be a class 5 minor offence, criminal only for repeat offenders. The penalty is up to ${h.num(D(h).prison_mois)} months in prison and a ${h.eur(D(h).amende_max)} fine. Prosecutors may instead offer a fixed criminal fine of ${h.eur(D(h).afd.forfaitaire)}, cut to ${h.eur(D(h).afd.minoree)} if paid quickly and raised to ${h.eur(D(h).afd.majoree)} if late, which ends the proceedings. A French licence loses half its maximum points, that is ${h.num(D(h).points)}. A court may suspend the licence for up to three years with no work exemption, cancel it with a ban on reapplying for up to three years, and confiscate the vehicle, which is compulsory for a repeat offence unless the court gives specific reasons. Example: ${h.num(e.a.mesuree)} km/h measured by a fixed camera on an 80 road gives ${h.num(e.a.retenue)} km/h recorded, ${h.num(e.a.exces)} km/h over: the offence.`;
    },
    faqs: (h) => [
      { q: 'Does the fixed criminal fine keep me off the criminal record?', a: 'No. Paying the fixed criminal fine ends the prosecution, so there is no court hearing, but the conviction is entered on the criminal record, as for other offences handled this way. That is the main difference from the old class 5 minor offence.' },
      { q: 'Can a rental car be confiscated?', a: 'The confiscation in article L413-1 targets a vehicle the offender owns. A hire or company car belonging to someone else is not covered by that penalty, although it can still be immobilised or impounded on the day the driver is stopped.' },
      { q: 'Can a camera record a criminal offence?', a: `Yes. The camera records the speed; the notice that follows then belongs to the criminal procedure, often as the ${h.eur(D(h).afd.forfaitaire)} fixed criminal fine. The driver is not always identified, and the registered keeper must name whoever was driving, following the instructions on the notice.` },
      { q: 'I live abroad: can this follow me home?', a: 'Notices for speeding can be sent to drivers living in other EU countries through the European exchange of vehicle data, in their own language. If you are stopped in France with no residence there, a deposit is required on the spot, and the vehicle can be kept until it is paid.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>From what speed</h2>
${h.table(['Limit', 'Recorded from', 'Fixed camera: measured from', 'In-car camera: measured from'], [30, 50, 70, 80, 90, 110, 130].map((l) => [`${l} km/h`, `${h.num(l + 50)} km/h`, `${h.num(h.M.mesureePourRetenue(l + 50, 'fixe'))} km/h`, `${h.num(h.M.mesureePourRetenue(l + 50, 'embarque'))} km/h`]), 'Threshold of the extreme speeding offence by limit', ['l', 'r', 'r', 'r'])}
<p>In town, ${h.num(e.b.mesuree)} km/h measured where 50 is allowed is enough. On a motorway, ${h.num(e.c.mesuree)} km/h measured by a fixed camera is recorded as ${h.num(e.c.retenue)} km/h: ${h.num(e.c.exces)} km/h over, hence the offence, whereas ${h.num(e.c.mesuree - 2)} km/h would stay a class 4 minor offence.</p>
<h2>The penalties, one by one</h2>
<p>${h.src('l413_1', 'Article L413-1')} provides up to ${h.num(D(h).prison_mois)} months in prison and a ${h.eur(D(h).amende_max)} fine, plus, as additional penalties: suspension of the licence for up to three years, which the court may not limit to driving outside work; a ban on driving certain vehicles for up to ${h.num(D(h).interdiction_conduire_max_ans)} years; cancellation of the licence with a ban on applying for a new one for up to ${h.num(D(h).annulation_interdiction_max_ans)} years; an awareness course at the offender’s expense; confiscation of a vehicle the offender owns.</p>
<p>Before the reform, 50 km/h over was a class 5 minor offence (up to €1,500), criminal only for a repeat. Decree 2025-1269 repealed article R413-14-1, which provided for it.</p>
<!--mini:delit-->
<h2>When stopped: seizure and immediate suspension</h2>
<p>A driver stopped at the roadside has the licence seized, then suspended by the prefect for up to ${h.num(h.P.vitesse.suspension_prefet_max_mois)} months pending the court’s decision. The vehicle may be immobilised and impounded. The procedure is on the ${h.a('suspension-permis', 'licence suspension page')}.</p>`;
    },
  },
});
