import { defineGuide, type Helpers } from '../../lib/guide-types';

const C = (h: Helpers) => h.P.classes;
const ex = (h: Helpers) => ({ a: h.M.sanctionVitesse(142, 130), b: h.M.sanctionVitesse(158, 130) });

export default defineGuide({
  id: 'conducteur-etranger',
  group: 'vitesse',
  order: 8,
  tool: 'exces',
  outil: { defaultVitesse: 142, defaultLimite: 130 },
  related: ['limitations-de-vitesse', 'marge-erreur-radar', 'amende-majoree', 'contester-une-amende', 'grand-exces'],
  sources: ['spEtranger', 'r413_14', 'r49_9', 'antai', 'spVitesse'],
  fr: {
    slug: 'amende-conducteur-etranger',
    nav: 'Conducteur étranger',
    card: 'Plaque étrangère, voiture de location : consignation, avis envoyé à l’étranger.',
    title: 'Amende d’un conducteur étranger en France : consignation',
    description: 'Amende d’un conducteur étranger flashé ou arrêté en France : montant identique, consignation sur place, véhicule retenu, avis envoyé dans son pays, sa langue.',
    h1: 'Conducteur étranger : l’amende en France et la consignation',
    intro: 'Un véhicule immatriculé à l’étranger paie la même amende qu’un autre. Ce qui change, c’est la façon de la recouvrer : sur place, ou par un avis envoyé chez soi.',
    resume: (h) => {
      const e = ex(h);
      return `Un conducteur étranger qui commet une infraction routière en France encourt exactement la même sanction qu’un résident : même barème de l’article R413-14 pour la vitesse, mêmes classes, mêmes montants. Deux situations se présentent ensuite, selon la fiche de Service Public mise à jour le 14 octobre 2026. Si le conducteur est intercepté et n’a pas de résidence en France, il doit verser une consignation dont le montant dépend de la gravité de l’infraction ; tant qu’elle n’est pas payée, le véhicule peut être retenu, puis mis en fourrière à ses frais, et le procureur de la République statue dans les vingt-quatre heures. S’il n’est pas intercepté, il peut recevoir chez lui un avis de contravention rédigé dans la langue de son pays, grâce à l’échange européen d’informations prévu par la directive 2015/413, modifiée en 2024. Exemple : ${h.num(e.a.mesuree)} km/h mesurés par un radar fixe sur autoroute donnent ${h.num(e.a.retenue)} km/h retenus, ${h.num(e.a.exces)} km/h d’excès et ${h.eur(e.a.amendes!.forfaitaire)} d’amende forfaitaire.`;
    },
    faqs: (h) => [
      { q: 'Un loueur peut-il transmettre mon identité ?', a: 'Oui. Le loueur, titulaire du certificat d’immatriculation, reçoit l’avis et désigne le locataire comme conducteur. Un nouvel avis est alors envoyé à l’adresse donnée lors de la location. Le loueur peut aussi facturer des frais de gestion prévus au contrat, distincts de l’amende.' },
      { q: 'Faut-il payer une amende française reçue à l’étranger ?', a: `Oui : l’avis est exécutoire et ses délais courent comme pour un résident. Le paiement se fait en ligne sur le site officiel de l’ANTAI, avec le numéro de l’avis. Payer dans le délai de l’amende minorée réduit le montant, par exemple à ${h.eur(C(h)['4'].minoree!)} au lieu de ${h.eur(C(h)['4'].forfaitaire)} pour une 4e classe.` },
      { q: 'L’échange européen couvre-t-il toutes les infractions ?', a: 'La directive vise les principales infractions de sécurité routière, dont l’excès de vitesse et le franchissement d’un feu rouge, citées par Service Public. La liste a été élargie par la directive de 2024, dont la transposition se poursuit dans les États membres.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>Les montants sont les mêmes pour tous</h2>
${h.table(['Classe', 'Minorée', 'Forfaitaire', 'Majorée'], (['2', '3', '4'] as const).map((k) => [`${k}e classe`, h.eur(C(h)[k].minoree!), h.eur(C(h)[k].forfaitaire), h.eur(C(h)[k].majoree)]), 'Montants des amendes forfaitaires (article R49-9 du Code de procédure pénale)', ['l', 'r', 'r', 'r'])}
<p>Un conducteur étranger qui roule à ${h.num(e.b.mesuree)} km/h sur une autoroute limitée à 130 est retenu à ${h.num(e.b.retenue)} km/h : ${h.num(e.b.exces)} km/h d’excès, ${h.eur(e.b.amendes!.forfaitaire)}. Les points, eux, s’inscrivent sur un permis français.</p>
<h2>Intercepté : la consignation</h2>
<p>${h.src('spEtranger', 'Service Public')} décrit la règle : sans résidence en France, le conducteur intercepté verse une consignation, dont le montant varie selon la gravité ; à défaut, le véhicule peut être retenu jusqu’au paiement, puis mis en fourrière. Le montant n’est pas fixé par la fiche : nous ne le publions pas.</p>
<!--mini:seuils_6-->
<h2>Flashé : l’avis vous suit</h2>
<p>Un radar automatique ne permet pas de consigner. L’avis est adressé au titulaire du certificat d’immatriculation, retrouvé grâce à l’échange d’informations entre États de l’Union. Les délais de paiement, de contestation et de ${h.a('amende-majoree', 'majoration')} sont ceux d’un avis ordinaire.</p>`;
    },
  },
  en: {
    slug: 'speeding-fine-france-foreign-driver',
    nav: 'Foreign drivers',
    card: 'Foreign plates, hire cars: the deposit, the notice sent abroad, the amount.',
    title: 'Speeding fine in France for foreign drivers: what to pay',
    description: 'Speeding fine in France for a foreign driver or hire car: same amounts as residents, a deposit if stopped, vehicle kept until paid, notices sent to your home.',
    h1: 'Caught speeding in France with a foreign licence or hire car',
    intro: 'Enter the speed on the photo or ticket and the limit: you get the French fine in euros, what it drops to if paid fast, and what happens next as a non-resident.',
    resume: (h) => {
      const e = ex(h);
      return `A foreign driver who commits a traffic offence in France faces exactly the same penalty as a resident: the same speeding scale in article R413-14 of the French Highway Code, the same classes, the same amounts. Two situations follow, according to the Service Public page updated on 14 October 2026. If the driver is stopped and has no residence in France, a deposit (consignation) must be paid, its amount depending on how serious the offence is; until it is paid the vehicle can be kept, then impounded at the driver’s cost, and the public prosecutor rules within twenty-four hours. If the driver is not stopped, a notice can arrive at home, written in the language of the driver’s country, through the European exchange of information set up by directive 2015/413, amended in 2024. Example: ${h.num(e.a.mesuree)} km/h measured by a fixed motorway camera gives ${h.num(e.a.retenue)} km/h recorded, ${h.num(e.a.exces)} km/h over and a standard fine of ${h.eur(e.a.amendes!.forfaitaire)}.`;
    },
    faqs: (h) => [
      { q: 'Will the hire company pass my details on?', a: 'Yes. The hire company, as registered keeper, receives the notice and names the renter as the driver. A new notice is then sent to the address you gave when renting. The company may also charge an admin fee set in your contract, separate from the fine itself.' },
      { q: 'Should I pay a French fine that reaches me abroad?', a: `Yes: the notice is enforceable and its deadlines run as for a resident. You pay online on the official ANTAI website, using the notice number. Paying within the reduced-fine window lowers the amount, for example to ${h.eur(C(h)['4'].minoree!)} instead of ${h.eur(C(h)['4'].forfaitaire)} for class 4.` },
      { q: 'What do “vitesse retenue” and “amende minorée” mean on the notice?', a: 'The vitesse retenue is the recorded speed, after the camera’s margin of error has been taken off the measured speed; the penalty is based on it. The amende minorée is the reduced fine, available if you pay within fifteen days of the notice being sent, or thirty days online. The amende majorée is the increased fine after forty-five days.' },
      { q: 'Does the European exchange cover every offence?', a: 'The directive covers the main road-safety offences, including speeding and running a red light, both named by Service Public. Its list was widened by the 2024 directive, which member states are still transposing. Fines for parking and other minor offences are not always exchanged.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>The amounts are the same for everyone</h2>
${h.table(['Class', 'Reduced', 'Standard', 'Increased'], (['2', '3', '4'] as const).map((k) => [`Class ${k}`, h.eur(C(h)[k].minoree!), h.eur(C(h)[k].forfaitaire), h.eur(C(h)[k].majoree)]), 'Fixed-fine amounts (article R49-9 of the Code of Criminal Procedure)', ['l', 'r', 'r', 'r'])}
<p>A foreign driver at ${h.num(e.b.mesuree)} km/h on a motorway limited to 130 is recorded at ${h.num(e.b.retenue)} km/h: ${h.num(e.b.exces)} km/h over, ${h.eur(e.b.amendes!.forfaitaire)}. Points are recorded on French licences.</p>
<h2>Stopped: the deposit</h2>
<p>${h.src('spEtranger', 'Service Public')} sets out the rule: with no residence in France, a driver who is stopped pays a deposit whose amount depends on how serious the offence is; otherwise the vehicle can be kept until it is paid, then impounded. The page does not give the amount, so we do not publish one.</p>
<!--mini:seuils_6-->
<h2>Flashed: the notice follows you</h2>
<p>An automatic camera cannot take a deposit. The notice goes to the registered keeper, traced through the exchange of information between EU states. The deadlines for paying, contesting and the ${h.a('amende-majoree', 'increased fine')} are those of an ordinary notice.</p>`;
    },
  },
});
