import { defineGuide, type Helpers } from '../../lib/guide-types';

const C = (h: Helpers) => h.P.classes;
const D = (h: Helpers) => h.P.delais;

export default defineGuide({
  id: 'contester-une-amende',
  group: 'avis',
  order: 2,
  tool: 'delais',
  outil: { defaultJours: 20, defaultClasse: '4' },
  related: ['amende-majoree', 'marge-erreur-radar', 'amende-stationnement', 'exces-20-km-h', 'amende-feu-rouge'],
  sources: ['spAmende', 'antai', 'spEntreprise', 'spFps', 'cpp529_7'],
  fr: {
    slug: 'contester-une-amende',
    nav: 'Contester une amende',
    card: '45 jours, une consignation, ou la désignation du conducteur : les trois voies.',
    title: 'Contester une amende : délai de 45 jours et consignation',
    description: 'Contester une amende : 45 jours après l’envoi de l’avis, consignation égale à l’amende forfaitaire, ou désignation du conducteur sans consignation. Vos délais.',
    h1: 'Contester une amende : délais, consignation et désignation',
    intro: 'Trois cas : vous n’étiez pas au volant, vous contestez les faits, ou l’avis est déjà majoré. L’outil donne la date limite et la somme à consigner.',
    resume: (h) => `Un avis de contravention se conteste dans les quarante-cinq jours qui suivent son envoi, selon la fiche de Service Public sur l’amende forfaitaire, en ligne sur le site de l’ANTAI ou par lettre recommandée à l’adresse indiquée sur l’avis. Trois situations se présentent. Si vous n’étiez pas le conducteur, vous désignez la personne qui conduisait, avec son identité, son adresse et la référence de son permis : aucune consignation n’est demandée, et un nouvel avis lui est envoyé. Si vous contestez les faits eux-mêmes, vous devez verser une consignation égale au montant de l’amende forfaitaire, ${h.eur(C(h)['4'].forfaitaire)} pour une 4e classe, ${h.eur(C(h)['3'].forfaitaire)} pour une 3e ; elle est remboursée en cas de classement sans suite ou de relaxe, et la verser ne retire pas de points. Si l’avis est déjà majoré, le délai est de ${h.num(D(h).contestation_majoree_jours)} jours, ou ${h.num(D(h).contestation_majoree_recommande_mois)} mois après un envoi recommandé, et la consignation égale à l’amende majorée. Payer l’amende, même pour en finir, vaut reconnaissance de l’infraction et rend la contestation impossible.`,
    faqs: (h) => [
      { q: 'Une entreprise doit-elle désigner le salarié qui conduisait ?', a: 'Oui. Quand un véhicule appartenant à une personne morale est flashé, son représentant légal doit désigner le conducteur dans les quarante-cinq jours. À défaut, l’entreprise reçoit une amende pour non-désignation, bien plus élevée que l’amende initiale, comme l’explique la fiche Service Public dédiée aux véhicules d’entreprise.' },
      { q: 'Que se passe-t-il après la contestation ?', a: 'L’officier du ministère public examine la requête. Il peut la classer sans suite, la rejeter si elle ne respecte pas les formes, ou saisir le tribunal de police. Devant le tribunal, le juge peut relaxer ou condamner, et l’amende prononcée peut alors dépasser l’amende forfaitaire, dans la limite du maximum de la classe.' },
      { q: 'Peut-on demander la photo du radar avant de contester ?', a: 'Oui, la demande de photo se fait auprès de l’ANTAI, sur son site ou par courrier, avec le numéro de l’avis. Elle ne suspend pas les délais : comptez le temps de la réponse pour rester dans les quarante-cinq jours. La photo permet souvent de savoir qui conduisait.' },
      { q: 'Contester un forfait post-stationnement suit-il la même règle ?', a: 'Non. Le forfait post-stationnement n’est pas une amende : il se conteste d’abord par un recours administratif auprès de la commune, puis devant la commission du contentieux du stationnement payant. Le délai et la procédure figurent sur l’avis de paiement du forfait.' },
    ],
    body: (h) => `<h2>Les trois voies</h2>
${h.table(['Situation', 'Délai', 'Consignation', 'Points'], [['Je n’étais pas au volant', `${h.num(D(h).contestation_forfaitaire_jours)} jours`, 'aucune', 'retirés au conducteur désigné'], ['Je conteste les faits', `${h.num(D(h).contestation_forfaitaire_jours)} jours`, `${h.eur(C(h)['4'].forfaitaire)} (4e classe)`, 'aucun tant que rien n’est jugé'], ['Avis déjà majoré', `${h.num(D(h).contestation_majoree_jours)} jours (${h.num(D(h).contestation_majoree_recommande_mois)} mois si recommandé)`, `${h.eur(C(h)['4'].majoree)} (4e classe)`, 'aucun tant que rien n’est jugé']], 'Contester un avis de contravention (fiche Service Public F18509)', ['l', 'l', 'r', 'l'])}
<p>${h.src('antai', 'Le site de l’ANTAI')} permet de désigner, de contester et de demander la photo en ligne. ${h.src('spAmende', 'La fiche Service Public')} détaille les pièces à joindre.</p>
<!--mini:contester-->
<h2>Ce qui fait une contestation recevable</h2>
<p>La requête doit être motivée, signée, accompagnée de l’avis original et, sauf désignation, de la preuve de la consignation. Une contestation qui se contente de dire que la marge du radar n’a pas été appliquée échoue : elle l’est toujours, et l’avis indique la vitesse mesurée et la vitesse retenue (voir la ${h.a('marge-erreur-radar', 'marge d’erreur')}). Les motifs qui tiennent sont concrets : véhicule vendu ou volé avant la date, plaque usurpée, conducteur identifiable sur la photo et différent du titulaire.</p>
<h2>Si vous payez par erreur</h2>
<p>Le paiement éteint l’action publique : l’infraction est reconnue et les points sont retirés. Une désignation reste possible uniquement si vous n’avez pas payé. Avant tout paiement, vérifiez donc qui conduisait.</p>`,
  },
  en: {
    slug: 'contesting-a-fine-france',
    nav: 'Contesting a fine',
    card: '45 days, a deposit, or naming the driver: the three routes.',
    title: 'Contesting a traffic fine in France: 45 days, the deposit',
    description: 'Contesting a French traffic fine: 45 days from the notice, a deposit equal to the standard fine, or naming the driver with no deposit. Deadlines and amounts.',
    h1: 'Contesting a French fine: deadlines, deposit, naming the driver',
    intro: 'Three cases: you were not driving, you dispute the facts, or the notice is already increased. The tool gives the deadline and the amount to deposit.',
    resume: (h) => `A French penalty notice can be contested within forty-five days of being sent, according to the Service Public page on fixed fines, online on the ANTAI website or by registered post to the address on the notice. There are three situations. If you were not the driver, you name the person who was, with their identity, address and licence reference: no deposit is required, and a new notice is sent to them. If you dispute the facts themselves, you must pay a deposit (consignation) equal to the standard fine, ${h.eur(C(h)['4'].forfaitaire)} for class 4, ${h.eur(C(h)['3'].forfaitaire)} for class 3; it is refunded if the case is dropped or you are acquitted, and paying it takes no points. If the notice is already increased, the deadline is ${h.num(D(h).contestation_majoree_jours)} days, or ${h.num(D(h).contestation_majoree_recommande_mois)} months after a registered letter, and the deposit equals the increased fine. Paying the fine, even just to be done with it, counts as admitting the offence and rules out any challenge.`,
    faqs: (h) => [
      { q: 'Must a company name the employee who was driving?', a: 'Yes. When a vehicle owned by a company is flashed, its legal representative must name the driver within forty-five days. Otherwise the company receives a fine for failing to name the driver, much higher than the original fine, as the Service Public page on company vehicles explains.' },
      { q: 'What happens after I contest?', a: 'The public prosecutor’s officer reviews the request. They can drop it, reject it if it does not follow the rules, or refer it to the police court. In court, the judge can acquit or convict, and the fine imposed can then exceed the fixed fine, up to the maximum for the class.' },
      { q: 'Can I ask for the camera photo before contesting?', a: 'Yes, you request the photo from the ANTAI, online or by post, with the notice number. It does not stop the clock: allow time for the reply to stay within the forty-five days. The photo often shows who was driving.' },
      { q: 'Can I contest in English?', a: 'The procedure is in French: the ANTAI online forms and any letter to the public prosecutor’s officer are expected in French. Keep the request short and factual, attach the original notice and proof of the deposit, and quote the notice number on every page.' },
    ],
    body: (h) => `<h2>The three routes</h2>
${h.table(['Situation', 'Deadline', 'Deposit', 'Points'], [['I was not driving', `${h.num(D(h).contestation_forfaitaire_jours)} days`, 'none', 'taken from the named driver'], ['I dispute the facts', `${h.num(D(h).contestation_forfaitaire_jours)} days`, `${h.eur(C(h)['4'].forfaitaire)} (class 4)`, 'none until judged'], ['Notice already increased', `${h.num(D(h).contestation_majoree_jours)} days (${h.num(D(h).contestation_majoree_recommande_mois)} months if registered)`, `${h.eur(C(h)['4'].majoree)} (class 4)`, 'none until judged']], 'Contesting a penalty notice (Service Public page F18509)', ['l', 'l', 'r', 'l'])}
<p>${h.src('antai', 'The ANTAI website')} lets you name the driver, contest and request the photo online. ${h.src('spAmende', 'The Service Public page')} lists the documents to attach.</p>
<!--mini:contester-->
<h2>What makes a challenge admissible</h2>
<p>The request must give reasons, be signed, include the original notice and, except when naming the driver, proof of the deposit. A challenge that only says the camera margin was not applied fails: it always is, and the notice shows both the measured and the recorded speed (see the ${h.a('marge-erreur-radar', 'margin of error')}). Grounds that hold are concrete: vehicle sold or stolen before the date, cloned plates, a driver visible on the photo who is not the keeper.</p>
<h2>If you paid by mistake</h2>
<p>Payment ends the case: the offence is admitted and points are taken. Naming another driver is only possible if you have not paid. Before paying anything, check who was driving.</p>`,
  },
});
