import { defineGuide, type Helpers } from '../../lib/guide-types';

const FLASH = '2026-10-01';
const F = (h: Helpers) => h.M.apresFlash(FLASH);
const D = (h: Helpers) => h.P.delais;
/** Avis supposé envoyé au dernier jour de la fenêtre habituelle, pour l'exemple de calendrier. */
const ech = (h: Helpers) => h.M.echeances(F(h).avisJusqua, true);

export default defineGuide({
  id: 'flash-radar-delai',
  group: 'avis',
  order: 4,
  tool: 'delais',
  outil: { defaultJours: 5, defaultClasse: '4' },
  related: ['radar-fixe', 'amende-majoree-sans-avis', 'contester-une-amende', 'marge-erreur-radar', 'carte-radars'],
  sources: ['spFlash', 'spAmende', 'spMajoreeSansAvis', 'antai'],
  fr: {
    slug: 'radar-fixe-flash-delai-amende',
    nav: 'Délai après un flash',
    card: 'De 10 jours à 1 mois pour recevoir l’avis ; un an sans courrier, plus de poursuite.',
    title: 'Radar fixe : combien de temps pour recevoir l’amende ?',
    description: 'Après un flash, l’avis arrive en moyenne entre 10 jours et 1 mois. Sans courrier au bout d’un an, la contravention est prescrite. Comptez vos jours ici.',
    h1: 'Flashé par un radar : le délai de l’avis, puis la prescription',
    intro: 'Entrez le nombre de jours depuis le flash : le calcul dit si l’avis est en retard et combien de jours restent avant la prescription.',
    resume: (h) => `Quand un radar automatique flashe un véhicule, l’avis de contravention part vers le titulaire du certificat d’immatriculation, la carte grise, sauf exception, par exemple un cliché non conforme. D’après la fiche Service Public vérifiée le 16 octobre 2025, le courrier arrive en moyenne entre ${h.num(D(h).avis_envoi_moyen_jours_min)} jours et ${h.num(D(h).avis_envoi_moyen_mois_max)} mois après le flash, selon le type de radar. Passé ce délai, la première chose à vérifier est l’adresse de la carte grise : un changement d’adresse doit y être déclaré dans le mois, faute de quoi l’avis part à l’ancienne adresse et c’est un avis d’amende majorée qui finit par arriver. Si rien n’est arrivé au bout d’un an, la contravention ne peut plus être poursuivie : la prescription de l’action publique est d’un an à compter du jour de l’infraction. Exemple : flashé le 1er octobre 2026, l’avis est attendu entre le ${h.date(F(h).avisDes)} et le ${h.date(F(h).avisJusqua)} ; sans courrier, la contravention est prescrite le ${h.date(F(h).prescription)}. Une fois l’avis reçu, les délais de paiement partent de sa date d’envoi.`,
    faqs: (h) => [
      { q: 'Un flash veut-il toujours dire une amende ?', a: 'Non. La fiche Service Public rappelle qu’un avis n’est pas envoyé dans certains cas, par exemple quand le cliché pris par le radar n’est pas conforme. Le flash seul ne prouve donc rien : seul l’avis de contravention, envoyé au titulaire de la carte grise, ouvre les délais de paiement et de contestation.' },
      { q: 'Mon avis n’est pas arrivé au bout de deux mois : que vérifier ?', a: 'L’adresse inscrite sur la carte grise. Elle doit être mise à jour dans le mois qui suit un déménagement ; sinon, l’avis initial se perd et un avis d’amende majorée peut arriver directement. Dans ce cas, une procédure permet de revenir au montant forfaitaire, décrite sur la page de l’amende majorée reçue sans avis.' },
      { q: 'La prescription d’un an vaut-elle pour un grand excès de vitesse ?', a: `Non. Le délai d’un an concerne les contraventions. Le dépassement de ${h.num(h.P.vitesse.delit_a_partir_de)} km/h ou plus est un délit depuis le 29 décembre 2025, et un délit se prescrit sur une durée plus longue. Ne pas avoir reçu de courrier au bout d’un an ne met donc pas fin aux poursuites dans ce cas.` },
      { q: 'Les délais de paiement partent-ils du jour du flash ?', a: `Non, de la date d’envoi imprimée sur l’avis. Payé en ligne, l’avis reste au tarif minoré pendant ${h.num(D(h).minoree_telepaiement_jours)} jours, puis au tarif forfaitaire jusqu’au ${h.num(D(h).forfaitaire_telepaiement_jours)}e jour. Le temps passé à attendre le courrier ne réduit aucun de ces délais, même si l’avis arrive plusieurs semaines après le flash.` },
    ],
    body: (h) => `<h2>Du flash au paiement : un calendrier</h2>
${h.table(['Étape', 'Date'], [['Flash', h.date(FLASH)], ['Avis attendu à partir du', h.date(F(h).avisDes)], ['Avis attendu au plus tard vers le', h.date(F(h).avisJusqua)], ['Si l’avis part ce jour-là : minorée en ligne jusqu’au', h.date(ech(h).minoree)], ['Forfaitaire en ligne jusqu’au', h.date(ech(h).forfaitaire)], ['Sans aucun avis : prescription le', h.date(F(h).prescription)]], 'Exemple d’un flash du 1er octobre 2026 (fiches Service Public F364 et F18509)', ['l', 'r'])}
<p>Les ${h.num(D(h).avis_envoi_moyen_jours_min)} jours à ${h.num(D(h).avis_envoi_moyen_mois_max)} mois sont une moyenne, pas un délai légal : ${h.src('spFlash', 'la fiche Service Public')} précise qu’ils varient selon le type de radar, fixe, mobile ou de feu rouge. Le seul délai fixé par la loi est celui de la prescription.</p>
<!--mini:flash-->
<h2>Vérifier la photo avant de payer</h2>
<p>Un avis reçu pour un radar automatique peut être suivi d’une demande de photographie, en ligne ou par courrier au centre de Rennes, selon ${h.src('spAmende', 'la fiche Service Public sur l’amende forfaitaire')}. Elle se fait avec une copie de la carte grise, d’une pièce d’identité et de l’avis. Si le conducteur était quelqu’un d’autre, la désignation se fait sur le site de l’${h.src('antai', 'ANTAI')} ; les délais de contestation sont sur la page ${h.a('contester-une-amende', 'contester une amende')}.</p>
<h2>Quand c’est l’amende majorée qui arrive</h2>
<p>Un avis d’amende majorée sans avis initial signale presque toujours une adresse périmée sur la carte grise. ${h.src('spMajoreeSansAvis', 'Service Public')} décrit une procédure pour revenir au montant forfaitaire, avec un délai de ${h.num(D(h).reevaluation_adresse_mois)} mois : elle est détaillée sur la page ${h.a('amende-majoree-sans-avis', 'de l’amende majorée reçue sans avis')}.</p>`,
  },
  en: {
    slug: 'speed-camera-flash-how-long-for-fine',
    nav: 'Time after a flash',
    card: '10 days to 1 month for the notice; after a year with no letter, no prosecution.',
    title: 'Speed camera flash in France: how long until the fine?',
    description: 'After a French speed camera flash, the notice tends to come within 10 days to 1 month. With no letter after a year, the offence is time-barred. Count the days.',
    h1: 'Flashed by a French camera: when the notice comes, and when it lapses',
    intro: 'Enter the number of days since the flash: the calculation says whether the notice is late and how many days remain before it is time-barred.',
    resume: (h) => `When a French automatic camera flashes a vehicle, the penalty notice goes to the registered keeper shown on the registration certificate, except in some cases, such as an unusable photo. According to the Service Public page checked on 16 October 2025, the letter arrives on average between ${h.num(D(h).avis_envoi_moyen_jours_min)} days and ${h.num(D(h).avis_envoi_moyen_mois_max)} month after the flash, depending on the type of camera. Beyond that, the first thing to check is the address on the registration certificate: a change of address must be recorded within a month, or the notice goes to the old address and an increased-fine notice eventually turns up instead. If nothing has arrived after a year, the minor offence can no longer be prosecuted: the limitation period is one year from the day of the offence. Example: flashed on 1 October 2026, the notice is expected between ${h.date(F(h).avisDes)} and ${h.date(F(h).avisJusqua)}; with no letter, the offence is time-barred on ${h.date(F(h).prescription)}. Once the notice arrives, the payment deadlines run from its sending date.`,
    faqs: (h) => [
      { q: 'Does a flash always mean a fine?', a: 'No. The Service Public page notes that no notice is sent in some cases, for instance when the camera’s photo is not compliant. The flash alone proves nothing: only the penalty notice, sent to the registered keeper, starts the payment and contest deadlines.' },
      { q: 'Two months and no notice: what should I check?', a: 'The address on the registration certificate. It must be updated within a month of moving; otherwise the first notice goes astray and an increased-fine notice may arrive directly. There is then a procedure to go back to the standard amount, set out on the page about increased fines received without a first notice.' },
      { q: 'Does the one-year limit apply to speeding by 50 km/h or more?', a: `No. The one-year period covers minor offences. Exceeding the limit by ${h.num(h.P.vitesse.delit_a_partir_de)} km/h or more has been a criminal offence since 29 December 2025, and criminal offences lapse over a longer period. Receiving no letter within a year does not end the case then.` },
      { q: 'Do payment deadlines start on the day of the flash?', a: `No, on the sending date printed on the notice. Paid online, the notice stays at the reduced rate for ${h.num(D(h).minoree_telepaiement_jours)} days, then at the standard rate until day ${h.num(D(h).forfaitaire_telepaiement_jours)}. Time spent waiting for the letter does not shorten any of these deadlines.` },
    ],
    body: (h) => `<h2>From flash to payment: a timeline</h2>
${h.table(['Step', 'Date'], [['Flash', h.date(FLASH)], ['Notice expected from', h.date(F(h).avisDes)], ['Notice expected by about', h.date(F(h).avisJusqua)], ['If sent that day: reduced online until', h.date(ech(h).minoree)], ['Standard online until', h.date(ech(h).forfaitaire)], ['No notice at all: time-barred on', h.date(F(h).prescription)]], 'Example of a flash on 1 October 2026 (Service Public pages F364 and F18509)', ['l', 'r'])}
<p>The ${h.num(D(h).avis_envoi_moyen_jours_min)} days to ${h.num(D(h).avis_envoi_moyen_mois_max)} month are an average, not a legal deadline: ${h.src('spFlash', 'the Service Public page')} says they vary with the type of camera, fixed, mobile or red-light. The only deadline set by law is the limitation period.</p>
<!--mini:flash-->
<h2>Check the photo before paying</h2>
<p>A notice from an automatic camera can be followed by a request for the photo, online or by post to the Rennes centre, according to ${h.src('spAmende', 'the Service Public page on fixed fines')}. It needs a copy of the registration certificate, an identity document and the notice. If someone else was driving, you name them on the ${h.src('antai', 'ANTAI')} website; the contest deadlines are on the ${h.a('contester-une-amende', 'contesting a fine page')}.</p>
<h2>When the increased fine arrives instead</h2>
<p>An increased-fine notice with no first notice nearly always points to an out-of-date address on the registration certificate. ${h.src('spMajoreeSansAvis', 'Service Public')} describes a way back to the standard amount, with a ${h.num(D(h).reevaluation_adresse_mois)}-month window: it is set out on the ${h.a('amende-majoree-sans-avis', 'increased fine without a first notice page')}.</p>`,
  },
});
