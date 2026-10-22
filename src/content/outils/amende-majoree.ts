import { defineGuide, type Helpers } from '../../lib/guide-types';

const C = (h: Helpers) => h.P.classes;
const D = (h: Helpers) => h.P.delais;
const ex = (h: Helpers) => h.M.echeances('2026-10-01', false);
const exWeb = (h: Helpers) => h.M.echeances('2026-10-01', true);

export default defineGuide({
  id: 'amende-majoree',
  group: 'avis',
  order: 1,
  tool: 'delais',
  outil: { defaultJours: 50, defaultClasse: '4' },
  related: ['amende-majoree-sans-avis', 'contester-une-amende', 'flash-radar-delai', 'amende-stationnement', 'conducteur-etranger'],
  sources: ['spAmende', 'spMajoreeSansAvis', 'cpp529_7', 'cpp529_8', 'r49_9', 'antai'],
  fr: {
    slug: 'amende-majoree',
    nav: 'Amende majorée',
    card: '375 € au lieu de 135 € : quand l’amende est majorée, et comment la réduire.',
    title: 'Amende majorée non payée, contestation : montant et délais',
    description: 'Amende majorée : 375 € pour une 4e classe, 180 € pour une 3e, après 45 jours sans paiement. Réduite de 20 % si payée sous 30 jours, contestable en 30 jours.',
    h1: 'Amende majorée non payée : à partir de quand, combien, et comment la réduire',
    intro: 'Entrez la classe et la date d’envoi de l’avis : l’outil donne le montant dû aujourd’hui, la date où il change et la consignation pour contester.',
    resume: (h) => `L’amende forfaitaire devient majorée quand elle n’a été ni payée ni contestée dans les quarante-cinq jours suivant l’envoi de l’avis de contravention, ou soixante jours en cas de paiement en ligne. Le montant fait plus que doubler : ${h.eur(C(h)['4'].majoree)} au lieu de ${h.eur(C(h)['4'].forfaitaire)} pour une 4e classe, ${h.eur(C(h)['3'].majoree)} au lieu de ${h.eur(C(h)['3'].forfaitaire)} pour une 3e, ${h.eur(C(h)['2'].majoree)} au lieu de ${h.eur(C(h)['2'].forfaitaire)} pour une 2e, selon la fiche de Service Public et l’article R49-9 du Code de procédure pénale. Le recouvrement passe alors au Trésor public, qui envoie un avis d’amende forfaitaire majorée. Une seconde chance existe : payée dans les trente jours suivant l’envoi de cet avis, ou quarante-cinq jours en ligne, l’amende majorée est réduite de ${h.pct(D(h).majoree_reduction_pct, 0)}, soit ${h.eur(h.M.majoreeReduite(C(h)['4'].majoree))} pour une 4e classe. Exemple : un avis envoyé le 1er octobre 2026 se paie au tarif minoré jusqu’au ${h.date(ex(h).minoree)}, au tarif forfaitaire jusqu’au ${h.date(ex(h).forfaitaire)} ; passé cette date, il est majoré. Contester un avis majoré reste possible, dans les trente jours, contre une consignation égale à l’amende majorée.`,
    faqs: (h) => [
      { q: 'J’ai contesté l’avis, et une amende majorée arrive quand même : que faire ?', a: `Vérifiez d’abord l’avancement de la contestation sur le service en ligne de consultation du dossier d’infraction. Puis contestez l’avis majoré lui-même dans les ${h.num(D(h).contestation_majoree_jours)} jours de son envoi, ou ${h.num(D(h).contestation_majoree_recommande_mois)} mois s’il est arrivé en recommandé, en joignant la preuve de la première contestation : accusé de réception ou confirmation en ligne.` },
      { q: 'Combien de temps pour contester une amende majorée ?', a: `${h.num(D(h).contestation_majoree_jours)} jours à partir de l’envoi de l’avis d’amende forfaitaire majorée, et ${h.num(D(h).contestation_majoree_recommande_mois)} mois si cet avis a été envoyé par lettre recommandée, selon la fiche de Service Public. Il faut joindre une consignation égale au montant majoré, remboursée en cas de classement ou de relaxe.` },
      { q: 'L’amende majorée retire-t-elle plus de points ?', a: 'Non. Les points dépendent de l’infraction, pas du montant payé. Ils sont retirés quand l’amende est payée ou quand le titre exécutoire de l’amende majorée est émis, ce qui rend le retrait définitif. Attendre la majoration ne fait donc rien gagner sur le permis.' },
      { q: 'Que se passe-t-il si je ne paie pas la majorée ?', a: 'Le Trésor public peut procéder au recouvrement forcé : saisie sur le compte bancaire, sur le salaire ou opposition sur les sommes que vous doit l’administration, avec des frais supplémentaires. L’amende ne disparaît pas avec le temps avant plusieurs années de prescription de la peine.' },
    ],
    body: (h) => `<h2>Les trois montants de chaque classe</h2>
${h.table(['Classe', 'Minorée', 'Forfaitaire', 'Majorée', 'Majorée réduite'], (['2', '3', '4'] as const).map((k) => [`${k}e classe`, h.eur(C(h)[k].minoree!), h.eur(C(h)[k].forfaitaire), h.eur(C(h)[k].majoree), h.eur(h.M.majoreeReduite(C(h)[k].majoree))]), 'Montants des amendes (article R49-9 du Code de procédure pénale, fiche Service Public F18509)', ['l', 'r', 'r', 'r', 'r'])}
<p>La majorée réduite est le montant de l’amende majorée payée dans les ${h.num(D(h).majoree_reduction_jours)} jours de l’envoi de son avis, ou ${h.num(D(h).majoree_reduction_telepaiement_jours)} jours en ligne. ${h.src('spAmende', 'La fiche Service Public')} décrit ces délais.</p>
<!--mini:delais-->
<h2>Le calendrier d’un avis</h2>
<p>Avis envoyé le 1er octobre 2026, paiement par chèque ou timbre : minorée jusqu’au ${h.date(ex(h).minoree)}, forfaitaire jusqu’au ${h.date(ex(h).forfaitaire)}, contestation jusqu’au ${h.date(ex(h).contestation)}. En ligne, les deux premières dates passent au ${h.date(exWeb(h).minoree)} et au ${h.date(exWeb(h).forfaitaire)}. Les délais se comptent à partir de la date d’envoi imprimée sur l’avis, pas de sa réception.</p>
<h2>Sans avoir reçu le premier avis</h2>
<p>Si l’avis majoré arrive sans que l’avis de contravention soit jamais parvenu, la cause habituelle est une adresse non mise à jour sur la carte grise. ${h.src('spMajoreeSansAvis', 'Service Public')} prévoit alors une réévaluation au montant forfaitaire, à demander dans les ${h.num(D(h).reevaluation_adresse_mois)} mois : la procédure est sur la page ${h.a('amende-majoree-sans-avis', 'de l’amende majorée reçue sans avis')}.</p>
<h2>Une règle qui va changer</h2>
<p>Les articles 529-7 et 529-8 du Code de procédure pénale, qui organisent l’amende minorée, sont abrogés à compter du 1er janvier 2029 d’après Légifrance. Les montants et délais de cette page valent pour les avis reçus aujourd’hui ; nous les mettrons à jour quand la nouvelle rédaction sera publiée.</p>`,
  },
  en: {
    slug: 'increased-fine-amende-majoree',
    nav: 'Increased fine',
    card: '€375 instead of €135: when a French fine is increased, and how to cut it.',
    title: 'Amende majorée in France: increased fine, 20% reduction',
    description: 'The amende majorée: €375 for class 4, €180 for class 3, after 45 days unpaid. Cut by 20% if paid within 30 days, contestable within 30 days. Your dates.',
    h1: 'The increased fine (amende majorée): when, how much, how to cut it',
    intro: 'Enter the class and the date the notice was sent: the tool gives the amount due today, when it changes and the deposit needed to contest.',
    resume: (h) => `A French fixed fine becomes an increased fine (amende forfaitaire majorée) when it has been neither paid nor contested within forty-five days of the notice being sent, or sixty days when paying online. The amount more than doubles: ${h.eur(C(h)['4'].majoree)} instead of ${h.eur(C(h)['4'].forfaitaire)} for class 4, ${h.eur(C(h)['3'].majoree)} instead of ${h.eur(C(h)['3'].forfaitaire)} for class 3, ${h.eur(C(h)['2'].majoree)} instead of ${h.eur(C(h)['2'].forfaitaire)} for class 2, according to the Service Public page and article R49-9 of the Code of Criminal Procedure. Collection then passes to the Treasury, which sends an increased-fine notice. There is a second chance: paid within thirty days of that notice being sent, or forty-five days online, the increased fine is cut by ${h.pct(D(h).majoree_reduction_pct, 0)}, to ${h.eur(h.M.majoreeReduite(C(h)['4'].majoree))} for class 4. Example: a notice sent on 1 October 2026 can be paid at the reduced rate until ${h.date(ex(h).minoree)}, at the standard rate until ${h.date(ex(h).forfaitaire)}; after that it is increased. Contesting an increased notice is still possible, within thirty days, against a deposit equal to the increased fine.`,
    faqs: (h) => [
      { q: 'I contested the notice and an increased fine still arrived: what now?', a: `First check how the contest is progressing on the online case-file service. Then contest the increased notice itself within ${h.num(D(h).contestation_majoree_jours)} days of its sending, or ${h.num(D(h).contestation_majoree_recommande_mois)} months if it came by registered post, enclosing proof of the first contest: the delivery receipt or the online confirmation.` },
      { q: 'How long do I have to contest an increased fine?', a: `${h.num(D(h).contestation_majoree_jours)} days from the increased-fine notice being sent, and ${h.num(D(h).contestation_majoree_recommande_mois)} months if it was sent by registered post, according to Service Public. You must attach a deposit equal to the increased amount, refunded if the case is dropped or you are acquitted.` },
      { q: 'Does the increased fine take more points?', a: 'No. Points depend on the offence, not on the amount paid. They are taken when the fine is paid or when the enforceable order for the increased fine is issued, which makes the deduction final. Waiting for the increase gains nothing on the licence.' },
      { q: 'I live abroad: will an unpaid increased fine follow me?', a: 'It can. The Treasury may enforce it in France, for instance against a French bank account, and EU rules allow fines to be collected in other member states. Enforcement can add fees, so paying within the 20% window remains the cheapest way out.' },
    ],
    body: (h) => `<h2>The three amounts for each class</h2>
${h.table(['Class', 'Reduced', 'Standard', 'Increased', 'Increased, cut'], (['2', '3', '4'] as const).map((k) => [`Class ${k}`, h.eur(C(h)[k].minoree!), h.eur(C(h)[k].forfaitaire), h.eur(C(h)[k].majoree), h.eur(h.M.majoreeReduite(C(h)[k].majoree))]), 'Fine amounts (article R49-9 of the Code of Criminal Procedure, Service Public page F18509)', ['l', 'r', 'r', 'r', 'r'])}
<p>“Increased, cut” is the increased fine paid within ${h.num(D(h).majoree_reduction_jours)} days of its notice being sent, or ${h.num(D(h).majoree_reduction_telepaiement_jours)} days online. ${h.src('spAmende', 'The Service Public page')} sets out these deadlines.</p>
<!--mini:delais-->
<h2>The timeline of a notice</h2>
<p>Notice sent on 1 October 2026, paid by cheque or stamp: reduced until ${h.date(ex(h).minoree)}, standard until ${h.date(ex(h).forfaitaire)}, contest until ${h.date(ex(h).contestation)}. Online, the first two dates move to ${h.date(exWeb(h).minoree)} and ${h.date(exWeb(h).forfaitaire)}. Deadlines run from the sending date printed on the notice, not from when you receive it.</p>
<h2>Without the first notice</h2>
<p>If the increased notice arrives without the penalty notice ever having reached you, the usual cause is an out-of-date address on the registration certificate. ${h.src('spMajoreeSansAvis', 'Service Public')} then provides for a review back to the standard amount, to be requested within ${h.num(D(h).reevaluation_adresse_mois)} months: the procedure is on the ${h.a('amende-majoree-sans-avis', 'increased fine without a first notice page')}.</p>
<h2>A rule that will change</h2>
<p>Articles 529-7 and 529-8 of the Code of Criminal Procedure, which govern the reduced fine, are repealed from 1 January 2029 according to Légifrance. The amounts and deadlines on this page apply to notices received today; we will update them when the new wording is published.</p>`,
  },
});
