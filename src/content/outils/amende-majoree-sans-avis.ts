import { defineGuide, type Helpers } from '../../lib/guide-types';

const C = (h: Helpers) => h.P.classes;
const D = (h: Helpers) => h.P.delais;
const ENVOI = '2026-10-01';
const DECLA = '2026-10-20';
const R = (h: Helpers) => h.M.reevaluation(ENVOI, DECLA);

export default defineGuide({
  id: 'amende-majoree-sans-avis',
  group: 'avis',
  order: 5,
  tool: 'delais',
  outil: { defaultJours: 50, defaultClasse: '4' },
  related: ['amende-majoree', 'flash-radar-delai', 'contester-une-amende', 'conducteur-etranger', 'bareme-points'],
  sources: ['spMajoreeSansAvis', 'spFlash', 'spAmende', 'antai'],
  fr: {
    slug: 'amende-majoree-sans-avis',
    nav: 'Majorée sans avis reçu',
    card: 'Avis initial jamais reçu : 3 mois pour revenir au montant forfaitaire.',
    title: 'Amende majorée sans avoir reçu l’avis : 3 mois pour agir',
    description: 'Amende majorée sans avoir reçu le premier avis : 3 mois pour justifier du changement d’adresse, puis 45 jours pour payer l’amende forfaitaire, sans minoration.',
    h1: 'Amende majorée sans avoir reçu la première : revenir au montant initial',
    intro: 'Entrez la date d’envoi de l’avis majoré : le calcul dit s’il est encore temps de demander la réévaluation, et ce que vous paierez alors.',
    resume: (h) => `Recevoir un avis d’amende majorée sans jamais avoir vu l’avis de contravention qui le précède arrive surtout après un déménagement non déclaré sur la carte grise : l’avis initial est parti à l’ancienne adresse, les ${h.num(D(h).forfaitaire_jours)} jours de paiement ont couru, et l’amende a été majorée. Pour une infraction relevée par radar automatique, l’avis majoré est envoyé en lettre recommandée. La fiche Service Public vérifiée le 24 juin 2025 décrit alors une réévaluation : dans les ${h.num(D(h).reevaluation_adresse_mois)} mois qui suivent l’envoi de l’avis majoré, il faut justifier avoir déclaré le changement d’adresse au service des cartes grises ; on dispose ensuite de ${h.num(D(h).reevaluation_paiement_jours)} jours, à partir de cette déclaration, pour payer l’amende forfaitaire. Ce paiement annule la majoration, mais le tarif minoré n’est plus possible. Pour une 4e classe, cela fait ${h.eur(C(h)['4'].forfaitaire)} au lieu de ${h.eur(C(h)['4'].majoree)}. Exemple : avis majoré envoyé le 1er octobre 2026, justificatif à produire avant le ${h.date(R(h).justifierAvant)} ; adresse déclarée le 20 octobre, paiement jusqu’au ${h.date(R(h).payerAvant!)}.`,
    faqs: (h) => [
      { q: 'Faut-il d’abord changer l’adresse de la carte grise ?', a: `Oui. La réévaluation suppose une déclaration de changement d’adresse au service des cartes grises, faite au plus tard dans les ${h.num(D(h).reevaluation_adresse_mois)} mois de l’envoi de l’avis majoré. C’est la date de cette déclaration qui ouvre les ${h.num(D(h).reevaluation_paiement_jours)} jours pour payer le montant forfaitaire.` },
      { q: 'Et si je conteste l’infraction elle-même ?', a: 'La réévaluation ne porte que sur le montant. Si vous contestez avoir commis l’infraction, il faut faire une réclamation, en ligne ou par courrier, selon la procédure indiquée sur l’avis d’amende majorée. Elle s’accompagne d’une consignation égale au montant majoré, remboursée en cas de classement ou de relaxe.' },
      { q: 'Qu’est-ce que la lettre de rappel du Trésor public ?', a: `Si l’avis majoré envoyé en recommandé revient avec la mention « n’habite plus à l’adresse indiquée », le comptable public recherche la nouvelle adresse. S’il la trouve dans l’année qui suit le premier envoi, il adresse une lettre de rappel : on peut alors payer le montant forfaitaire, et non majoré, après avoir mis la carte grise à jour dans les ${h.num(D(h).reevaluation_adresse_mois)} mois.` },
    ],
    body: (h) => `<h2>Ce que vous payez avec et sans réévaluation</h2>
${h.table(['Classe', 'Majorée', 'Après réévaluation', 'Économie'], (['2', '3', '4'] as const).map((k) => [`${k}e classe`, h.eur(C(h)[k].majoree), h.eur(C(h)[k].forfaitaire), h.eur(C(h)[k].majoree - C(h)[k].forfaitaire)]), 'Montants des avis (fiche Service Public F18509) et réévaluation (fiche F18510)', ['l', 'r', 'r', 'r'])}
<p>La réévaluation ramène au montant forfaitaire, jamais au minoré. ${h.src('spMajoreeSansAvis', 'La fiche Service Public')} la réserve au cas où l’avis majoré a été envoyé par lettre recommandée, ce qui est la règle pour les infractions relevées par radar automatique.</p>
<!--mini:reevaluation-->
<h2>Les deux délais, pas à pas</h2>
<p>Premier délai : ${h.num(D(h).reevaluation_adresse_mois)} mois à partir de la date d’envoi imprimée sur l’avis majoré, pour justifier du changement d’adresse. Second délai : ${h.num(D(h).reevaluation_paiement_jours)} jours à partir de la déclaration de la nouvelle adresse, pour payer. Avec un avis majoré envoyé le ${h.date(ENVOI)} et une adresse déclarée le ${h.date(DECLA)}, le justificatif est à produire avant le ${h.date(R(h).justifierAvant)} et le paiement avant le ${h.date(R(h).payerAvant!)}.</p>
<h2>Pour que cela ne se reproduise pas</h2>
<p>L’adresse de la carte grise doit être mise à jour dans le mois qui suit un déménagement, rappelle ${h.src('spFlash', 'Service Public')}. Un avis qui tarde après un flash est souvent le premier signe d’une adresse périmée : la page ${h.a('flash-radar-delai', 'du délai après un flash')} donne les durées habituelles. Une amende majorée reçue normalement, après un avis bien arrivé, suit les règles de la page ${h.a('amende-majoree', 'amende majorée')}.</p>`,
  },
  en: {
    slug: 'increased-fine-without-first-notice',
    nav: 'Increased fine, no notice',
    card: 'First notice never received: 3 months to go back to the standard amount.',
    title: 'Increased fine in France with no first notice: 3 months',
    description: 'A French increased fine with no first notice: 3 months to prove your change of address, then 45 days to pay the standard amount, without the reduced rate.',
    h1: 'Increased fine without the first notice: back to the original amount',
    intro: 'Enter when the increased-fine notice was sent: the calculation says whether you can still ask for the review, and what you would then pay.',
    resume: (h) => `Getting an increased-fine notice (amende forfaitaire majorée) without ever seeing the penalty notice before it mostly happens after a move that was not recorded on the registration certificate: the first notice went to the old address, the ${h.num(D(h).forfaitaire_jours)} days to pay ran out, and the fine was increased. For an offence recorded by an automatic camera, the increased notice is sent by registered post. The Service Public page checked on 24 June 2025 then describes a review: within ${h.num(D(h).reevaluation_adresse_mois)} months of the increased notice being sent, you must show that you declared the change of address to the registration service; you then have ${h.num(D(h).reevaluation_paiement_jours)} days from that declaration to pay the standard fine. That payment cancels the increase, but the reduced rate is no longer available. For a class 4 offence, that means ${h.eur(C(h)['4'].forfaitaire)} instead of ${h.eur(C(h)['4'].majoree)}. Example: increased notice sent on 1 October 2026, proof due before ${h.date(R(h).justifierAvant)}; new address declared on 20 October, payment due by ${h.date(R(h).payerAvant!)}.`,
    faqs: (h) => [
      { q: 'Must I update the registration certificate first?', a: `Yes. The review requires a change-of-address declaration to the registration service, made no later than ${h.num(D(h).reevaluation_adresse_mois)} months after the increased notice was sent. The date of that declaration starts the ${h.num(D(h).reevaluation_paiement_jours)} days to pay the standard amount, so declaring early leaves the most time to gather the documents.` },
      { q: 'What if I dispute the offence itself?', a: 'The review only changes the amount. If you deny committing the offence, you file a claim (réclamation), online or by post, following the procedure printed on the increased-fine notice. It comes with a deposit equal to the increased amount, refunded if the case is dropped or you are acquitted.' },
      { q: 'What is the Treasury’s reminder letter?', a: `If the registered increased notice comes back marked “no longer lives at this address”, the public accountant looks for the new address. If found within a year of the first registered letter, a reminder letter is sent: you can then pay the standard amount, not the increased one, once the registration certificate is updated within ${h.num(D(h).reevaluation_adresse_mois)} months.` },
    ],
    body: (h) => `<h2>What you pay with and without the review</h2>
${h.table(['Class', 'Increased', 'After review', 'Saving'], (['2', '3', '4'] as const).map((k) => [`Class ${k}`, h.eur(C(h)[k].majoree), h.eur(C(h)[k].forfaitaire), h.eur(C(h)[k].majoree - C(h)[k].forfaitaire)]), 'Notice amounts (Service Public page F18509) and review (page F18510)', ['l', 'r', 'r', 'r'])}
<p>The review brings you back to the standard amount, never the reduced one. ${h.src('spMajoreeSansAvis', 'The Service Public page')} limits it to increased notices sent by registered post, which is the rule for offences recorded by automatic cameras.</p>
<!--mini:reevaluation-->
<h2>The two deadlines, step by step</h2>
<p>First deadline: ${h.num(D(h).reevaluation_adresse_mois)} months from the sending date printed on the increased notice, to prove the change of address. Second deadline: ${h.num(D(h).reevaluation_paiement_jours)} days from declaring the new address, to pay. With an increased notice sent on ${h.date(ENVOI)} and the address declared on ${h.date(DECLA)}, the proof is due before ${h.date(R(h).justifierAvant)} and payment before ${h.date(R(h).payerAvant!)}.</p>
<h2>So it does not happen again</h2>
<p>The address on the registration certificate must be updated within a month of moving, ${h.src('spFlash', 'Service Public')} reminds drivers. A notice that is slow to arrive after a flash is often the first sign of an out-of-date address: the ${h.a('flash-radar-delai', 'time after a flash page')} gives the usual delays. An increased fine received normally, after the first notice arrived, follows the rules on the ${h.a('amende-majoree', 'increased fine page')}.</p>`,
  },
});
