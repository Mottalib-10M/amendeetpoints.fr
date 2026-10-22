import { defineGuide, type Helpers } from '../../lib/guide-types';

const X = (h: Helpers, id: string) => h.M.infraction(id);

export default defineGuide({
  id: 'amende-stationnement',
  group: 'infractions',
  order: 6,
  tool: 'infraction',
  outil: { ids: ['stat_genant', 'stat_tres_genant', 'stat_dangereux', 'stat_abusif'], defaultId: 'stat_tres_genant' },
  related: ['amende-majoree', 'contester-une-amende', 'bareme-points', 'amende-ceinture', 'conducteur-etranger'],
  sources: ['r417_10', 'r417_11', 'spStationnement', 'spFps', 'cpp529_7'],
  fr: {
    slug: 'amende-stationnement',
    nav: 'Stationnement',
    card: '35 € ou 135 €, sans minorée ; points pour le seul stationnement dangereux.',
    title: 'Amende de stationnement : 35 € ou 135 €, gênant, dangereux',
    description: 'Amende de stationnement : 35 € pour le gênant ou l’abusif, 135 € pour le très gênant et le dangereux (3 points), pas de minorée, la différence avec le FPS.',
    h1: 'Amende de stationnement : 35 €, 135 € et le cas du FPS',
    intro: 'Gênant, très gênant, dangereux, abusif : quatre catégories, deux montants, et une seule qui retire des points. Le stationnement payant non réglé, lui, n’est plus une amende.',
    resume: (h) => `Le Code de la route range les stationnements interdits en quatre catégories. Le stationnement gênant (double file, emplacement de livraison, borne de recharge occupée par un véhicule qui ne charge pas…), prévu par l’article R417-10, est une contravention de 2e classe : ${h.eur(X(h, 'stat_genant').amendes!.forfaitaire)} d’amende forfaitaire, ${h.eur(X(h, 'stat_genant').amendes!.majoree)} majorée. Le stationnement très gênant de l’article R417-11 (trottoir, passage piéton, piste cyclable, place réservée aux personnes handicapées…) est de 4e classe : ${h.eur(X(h, 'stat_tres_genant').amendes!.forfaitaire)}, ${h.eur(X(h, 'stat_tres_genant').amendes!.majoree)} majorée, sans retrait de points. Le stationnement dangereux, près d’un virage ou d’un sommet de côte par exemple, coûte ${h.eur(X(h, 'stat_dangereux').amendes!.forfaitaire)} et ${h.num(X(h, 'stat_dangereux').points)} points. Le stationnement abusif, plus de sept jours au même endroit, est de 2e classe. Aucune de ces amendes n’a de montant minoré : l’article 529-7 du Code de procédure pénale exclut le stationnement. Le stationnement payant non réglé donne lieu, depuis 2018, à un forfait post-stationnement fixé par chaque commune, qui n’est pas une amende.`,
    faqs: (h) => [
      { q: 'Le forfait post-stationnement se conteste-t-il comme une amende ?', a: 'Non. Le FPS est une redevance d’occupation du domaine public, fixée par la commune : il se conteste d’abord par un recours administratif préalable obligatoire auprès de la commune ou de son prestataire, puis devant la commission du contentieux du stationnement payant. Il ne passe ni par l’ANTAI pour la contestation, ni par l’officier du ministère public.' },
      { q: 'Peut-on être mis en fourrière pour un stationnement gênant ?', a: 'Oui. En plus de l’amende, les stationnements gênants, très gênants, dangereux et abusifs peuvent entraîner l’enlèvement du véhicule par la fourrière, dont les frais s’ajoutent à l’amende et restent à la charge du titulaire du certificat d’immatriculation. La fourrière ne rend le véhicule qu’une fois ces frais payés.' },
      { q: 'Pourquoi payer tout de suite ne réduit-il pas l’amende ?', a: `Parce que l’article 529-7 du Code de procédure pénale réserve l’amende minorée aux contraventions des quatre premières classes autres que celles relatives au stationnement. Pour le stationnement, il y a deux montants seulement : forfaitaire, puis majoré, par exemple ${h.eur(X(h, 'stat_genant').amendes!.forfaitaire)} puis ${h.eur(X(h, 'stat_genant').amendes!.majoree)} pour un stationnement gênant.` },
    ],
    body: (h) => `<h2>Les quatre catégories</h2>
${h.table(['Catégorie', 'Classe', 'Forfaitaire', 'Majorée', 'Points'], ['stat_genant', 'stat_tres_genant', 'stat_dangereux', 'stat_abusif'].map((id) => { const x = X(h, id); return [x.fr, String(x.classe), h.eur(x.amendes!.forfaitaire), h.eur(x.amendes!.majoree), String(x.points)]; }), 'Amendes de stationnement (articles R417-10 et R417-11, fiche Service Public)', ['l', 'r', 'r', 'r', 'r'])}
<p>Les listes complètes figurent dans ${h.src('r417_10', 'l’article R417-10')} pour le gênant et ${h.src('r417_11', 'l’article R417-11')} pour le très gênant. Le stationnement dangereux est le seul à pouvoir entraîner une suspension du permis, jusqu’à trois ans.</p>
<!--mini:stationnement-->
<h2>Amende ou FPS : regarder le papier</h2>
<p>Un avis de contravention porte une classe et un montant fixé par le Code de procédure pénale ; il se paie ou se conteste comme toute amende, avec les délais de la page ${h.a('contester-une-amende', 'contester une amende')}. Un avis de paiement de forfait post-stationnement porte le nom de la commune et un montant qu’elle a fixé : ${h.src('spFps', 'Service Public')} en décrit la procédure, distincte.</p>`,
  },
  en: {
    slug: 'parking-fines-france',
    nav: 'Parking',
    card: '€35 or €135, no reduced rate; points only for dangerous parking.',
    title: 'Parking fines in France: €35 or €135, and the FPS charge',
    description: 'Parking fines in France: €35 for obstructive or abandoned parking, €135 for seriously obstructive and dangerous parking (3 points), no reduced rate, the FPS.',
    h1: 'Parking fines in France: €35, €135 and the FPS',
    intro: 'Obstructive, seriously obstructive, dangerous, abandoned: four categories, two amounts, and only one that costs points. Unpaid street parking is no longer a fine at all.',
    resume: (h) => `The French Highway Code sorts banned parking into four categories. Obstructive parking (double parking, a delivery bay, a charging point taken by a vehicle that is not charging…), under article R417-10, is a class 2 offence: a ${h.eur(X(h, 'stat_genant').amendes!.forfaitaire)} standard fine, ${h.eur(X(h, 'stat_genant').amendes!.majoree)} increased. Seriously obstructive parking under article R417-11 (pavement, pedestrian crossing, cycle lane, disabled bay…) is class 4: ${h.eur(X(h, 'stat_tres_genant').amendes!.forfaitaire)}, ${h.eur(X(h, 'stat_tres_genant').amendes!.majoree)} increased, with no points. Dangerous parking, near a bend or the brow of a hill for example, costs ${h.eur(X(h, 'stat_dangereux').amendes!.forfaitaire)} and ${h.num(X(h, 'stat_dangereux').points)} points. Abandoned parking, more than seven days in one place, is class 2. None of these fines has a reduced amount: article 529-7 of the Code of Criminal Procedure excludes parking. Unpaid pay-and-display parking has, since 2018, led to a post-parking charge (forfait post-stationnement, FPS) set by each town, which is not a fine.`,
    faqs: (h) => [
      { q: 'Is the FPS contested like a fine?', a: 'No. The FPS is a charge for using public space, set by the town: you first make a compulsory administrative appeal to the town or its contractor, then go to the specialist parking disputes commission. It does not go through the ANTAI contest procedure or the public prosecutor’s officer.' },
      { q: 'Can my car be towed for obstructive parking?', a: 'Yes. On top of the fine, obstructive, seriously obstructive, dangerous and abandoned parking can lead to the vehicle being towed to the pound, with fees added to the fine and payable by the registered keeper. The pound only releases the car once those fees have been paid.' },
      { q: 'I got a parking ticket on a hire car: what now?', a: 'For a fine, the hire company receives the notice and names you as the driver; a new notice then reaches you. For an FPS, the town bills the registered keeper, and the hire company usually recharges it under your contract, often with an admin fee. Check the paper: a fine shows a class, an FPS shows the town.' },
    ],
    body: (h) => `<h2>The four categories</h2>
${h.table(['Category', 'Class', 'Standard', 'Increased', 'Points'], ['stat_genant', 'stat_tres_genant', 'stat_dangereux', 'stat_abusif'].map((id) => { const x = X(h, id); return [x.en, String(x.classe), h.eur(x.amendes!.forfaitaire), h.eur(x.amendes!.majoree), String(x.points)]; }), 'Parking fines (articles R417-10 and R417-11, Service Public page)', ['l', 'r', 'r', 'r', 'r'])}
<p>The full lists are in ${h.src('r417_10', 'article R417-10')} for obstructive parking and ${h.src('r417_11', 'article R417-11')} for seriously obstructive parking. Dangerous parking is the only one that can lead to a licence suspension, of up to three years.</p>
<!--mini:stationnement-->
<h2>Fine or FPS: read the paper</h2>
<p>A penalty notice shows a class and an amount set by the Code of Criminal Procedure; it is paid or contested like any fine, with the deadlines on the ${h.a('contester-une-amende', 'contesting a fine page')}. An FPS payment notice carries the town’s name and an amount the town set: ${h.src('spFps', 'Service Public')} describes its separate procedure.</p>`,
  },
});
