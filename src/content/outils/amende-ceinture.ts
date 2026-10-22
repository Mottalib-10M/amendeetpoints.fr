import { defineGuide, type Helpers } from '../../lib/guide-types';

const C4 = (h: Helpers) => h.P.classes['4'];

export default defineGuide({
  id: 'amende-ceinture',
  group: 'infractions',
  order: 4,
  tool: 'infraction',
  outil: { ids: ['ceinture', 'telephone', 'distances', 'bau', 'clignotant'], defaultId: 'ceinture' },
  related: ['amende-telephone', 'bareme-points', 'recuperer-des-points', 'amende-majoree', 'amende-stationnement'],
  sources: ['r412_1', 'spBareme', 'r49_9', 'l223_6'],
  fr: {
    slug: 'amende-ceinture',
    nav: 'Ceinture de sécurité',
    card: '135 € et 3 points pour le conducteur ; les dispenses prévues par le texte.',
    title: 'Amende ceinture de sécurité : 135 € et 3 points en 2026',
    description: 'Amende pour défaut de ceinture : 135 € (90 € minorée, 375 € majorée), 3 points pour le conducteur, amende pour le passager. Dispenses : certificat, taxi.',
    h1: 'Amende pour défaut de ceinture : 135 € et 3 points',
    intro: 'Le conducteur sans ceinture perd trois points ; le passager majeur paie sa propre amende, sans points. Les exceptions sont peu nombreuses et écrites dans le texte.',
    resume: (h) => `L’article R412-1 du Code de la route oblige tout conducteur et tout passager d’un véhicule à moteur à porter une ceinture de sécurité homologuée lorsque son siège en est équipé. Le manquement est une contravention de 4e classe : ${h.eur(C4(h).forfaitaire)} d’amende forfaitaire, ${h.eur(C4(h).minoree!)} minorée, ${h.eur(C4(h).majoree)} majorée. Lorsque c’est le conducteur qui ne la porte pas, trois points sont retirés de plein droit ; un passager qui ne la porte pas paie l’amende sans perdre de points. Le texte prévoit des dispenses : la personne dont la morphologie est manifestement inadaptée, le titulaire d’un certificat médical d’exemption qui mentionne sa durée de validité, les conducteurs et passagers d’un véhicule d’intérêt général prioritaire ou d’une ambulance en intervention, le chauffeur de taxi en service, et, en agglomération, les véhicules de livraison de porte à porte et ceux d’un service public qui s’arrêtent fréquemment. Les trois points reviennent après trois ans sans nouvelle infraction, la contravention étant de 4e classe.`,
    faqs: (h) => [
      { q: 'Qui paie si un passager n’a pas sa ceinture ?', a: 'Le passager majeur est lui-même verbalisé : l’amende de 4e classe est à son nom et aucun point n’est retiré, puisqu’il ne conduit pas. Le retrait de trois points, prévu par le paragraphe IV de l’article R412-1, ne vise que le conducteur qui commet l’infraction.' },
      { q: 'Le certificat médical d’exemption suffit-il ?', a: 'Oui, s’il est établi pour une exemption de port de la ceinture et qu’il mentionne sa durée de validité, comme l’exige l’article R412-1. Il faut pouvoir le présenter lors d’un contrôle. Un certificat sans durée de validité ne répond pas aux conditions du texte.' },
      { q: 'Un radar peut-il verbaliser l’absence de ceinture ?', a: 'Les radars fixes du fichier public mesurent la vitesse ou un franchissement de feu ; le défaut de ceinture est constaté par les forces de l’ordre, lors d’un contrôle ou au vu d’une photo exploitable. Aucun type de radar du fichier public n’est conçu pour ce contrôle : tourelles, radars classiques ou urbains mesurent une vitesse.' },
    ],
    body: (h) => `<h2>Les petites fautes de conduite à trois points</h2>
${h.table(['Infraction', 'Classe', 'Amende forfaitaire', 'Points'], ['ceinture', 'telephone', 'distances', 'bau', 'ligne_continue', 'clignotant'].map((id) => { const x = h.M.infraction(id); return [x.fr, String(x.classe), h.eur(x.amendes!.forfaitaire), String(x.points)]; }), 'Infractions à trois points (fiche Service Public F31551)', ['l', 'r', 'r', 'r'])}
<p>Le changement de direction sans clignotant fait exception : contravention de 2e classe à ${h.eur(h.P.classes['2'].forfaitaire)}, mais trois points comme les autres. ${h.src('r412_1', 'L’article R412-1')} fixe la règle de la ceinture et ses dispenses.</p>
<!--mini:infraction_2-->
<h2>Payer vite</h2>
<p>Pour ${h.eur(C4(h).forfaitaire)} d’amende forfaitaire, payer dans les quinze jours de l’envoi de l’avis (trente en ligne) coûte ${h.eur(C4(h).minoree!)}, attendre plus de quarante-cinq jours ${h.eur(C4(h).majoree)}. Les dates exactes se calculent sur la page ${h.a('amende-majoree', 'de l’amende majorée')} ; le retour des points, sur la page ${h.a('recuperer-des-points', 'récupérer des points')}.</p>`,
  },
  en: {
    slug: 'seat-belt-fine-france',
    nav: 'Seat belt',
    card: '€135 and 3 points for the driver; the exemptions in the text.',
    title: 'Seat belt fine in France: €135 and 3 points for the driver',
    description: 'Seat belt fine in France: €135 (€90 reduced, €375 increased), 3 points for the driver, a fine for the passenger. Exemptions: medical certificate, taxis.',
    h1: 'Not wearing a seat belt in France: €135 and 3 points',
    intro: 'A driver without a belt loses three points; an adult passenger pays their own fine, with no points. The exceptions are few and written into the text.',
    resume: (h) => `Article R412-1 of the French Highway Code requires every driver and passenger of a motor vehicle to wear an approved seat belt when their seat has one. Failing to do so is a class 4 offence: a ${h.eur(C4(h).forfaitaire)} standard fine, ${h.eur(C4(h).minoree!)} reduced, ${h.eur(C4(h).majoree)} increased. When the driver is the one not wearing it, three points are taken automatically; a passenger without a belt pays the fine and loses no points. The text provides exemptions: a person whose build is manifestly unsuited to a belt, a holder of a medical exemption certificate that states its period of validity, drivers and passengers of a priority emergency vehicle or an ambulance on call, a taxi driver on duty, and, in built-up areas, door-to-door delivery vehicles and public-service vehicles that stop frequently. The three points come back after three years with no new offence, since it is a class 4 offence.`,
    faqs: (h) => [
      { q: 'Who pays if a passenger is not belted?', a: 'An adult passenger is fined personally: the class 4 fine is in their name and no points are taken, since they are not driving. The three-point deduction in paragraph IV of article R412-1 only targets the driver who commits the offence.' },
      { q: 'Is a foreign medical exemption certificate valid?', a: 'Article R412-1 requires a medical exemption certificate that states its period of validity; it does not set out rules for certificates issued abroad. Carry the document, with a translation if possible, and be ready to show it at a check. An officer decides on the spot whether it meets the conditions.' },
      { q: 'Can a camera fine me for no seat belt?', a: 'The fixed cameras in the public file measure speed or red-light crossing; a missing seat belt is recorded by police during a check or from a usable photo. No camera type in the public file is designed for it: tower, standard and urban cameras measure speed.' },
    ],
    body: (h) => `<h2>Minor driving offences that cost three points</h2>
${h.table(['Offence', 'Class', 'Standard fine', 'Points'], ['ceinture', 'telephone', 'distances', 'bau', 'ligne_continue', 'clignotant'].map((id) => { const x = h.M.infraction(id); return [x.en, String(x.classe), h.eur(x.amendes!.forfaitaire), String(x.points)]; }), 'Three-point offences (Service Public page F31551)', ['l', 'r', 'r', 'r'])}
<p>Turning without indicating is the exception: a class 2 offence at ${h.eur(h.P.classes['2'].forfaitaire)}, but three points like the others. ${h.src('r412_1', 'Article R412-1')} sets the seat-belt rule and its exemptions.</p>
<!--mini:infraction_2-->
<h2>Pay quickly</h2>
<p>For a ${h.eur(C4(h).forfaitaire)} standard fine, paying within fifteen days of the notice being sent (thirty online) costs ${h.eur(C4(h).minoree!)}, waiting over forty-five days ${h.eur(C4(h).majoree)}. The exact dates are worked out on the ${h.a('amende-majoree', 'increased fine page')}; when the points come back, on the ${h.a('recuperer-des-points', 'getting points back page')}.</p>`,
  },
});
