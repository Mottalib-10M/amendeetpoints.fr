import { defineGuide, type Helpers } from '../../lib/guide-types';

const C4 = (h: Helpers) => h.P.classes['4'];
const tel = (h: Helpers) => h.M.infraction('telephone');

export default defineGuide({
  id: 'amende-telephone',
  group: 'infractions',
  order: 3,
  tool: 'infraction',
  outil: { ids: ['telephone', 'ceinture', 'ligne_continue', 'feu_rouge', 'depassement'], defaultId: 'telephone' },
  related: ['amende-ceinture', 'suspension-permis', 'bareme-points', 'combien-de-points', 'permis-probatoire'],
  sources: ['r412_6_1', 'l224_2', 'spBareme', 'r49_9', 'l223_2'],
  fr: {
    slug: 'amende-telephone-au-volant',
    nav: 'Téléphone au volant',
    card: '135 € et 3 points ; avec une autre infraction, permis retenu.',
    title: 'Amende téléphone au volant : 135 €, 3 points, rétention',
    description: 'Amende pour téléphone au volant : 135 € (90 € minorée), 3 points, suspension possible ; avec une autre infraction en même temps, permis retenu sur place.',
    h1: 'Téléphone au volant : 135 €, 3 points et parfois le permis retenu',
    intro: 'Tenir son téléphone en main, ou porter des écouteurs, coûte trois points. Combiné à une autre faute, il peut coûter le permis le jour même.',
    resume: (h) => `L’article R412-6-1 du Code de la route interdit au conducteur d’un véhicule en circulation de tenir en main un téléphone et de porter à l’oreille tout dispositif susceptible d’émettre du son, comme des écouteurs ou une oreillette ; seuls les appareils correcteurs de surdité échappent à la seconde interdiction. L’infraction est une contravention de 4e classe : ${h.eur(C4(h).forfaitaire)} d’amende forfaitaire, ${h.eur(C4(h).minoree!)} minorée, ${h.eur(C4(h).majoree)} majorée, et ${h.num(tel(h).points)} points retirés. Le juge peut suspendre le permis jusqu’à trois ans. Surtout, l’article L224-2 permet au préfet de suspendre le permis lorsque le conducteur, intercepté avec un téléphone en main, commet en même temps une autre infraction de la liste fixée par décret, en matière de conduite, de vitesse ou de priorité : le permis est alors retenu sur place, puis suspendu jusqu’à ${h.num(h.P.vitesse.suspension_prefet_max_mois)} mois. Un téléphone et un franchissement de ligne continue au même contrôle font perdre ${h.num(h.M.cumulSimultane([3, 3]))} points.`,
    faqs: (h) => [
      { q: 'Le téléphone posé sur un support est-il autorisé ?', a: 'Le texte vise le téléphone tenu en main. Un téléphone fixé sur un support et utilisé comme GPS n’est pas, en lui-même, tenu en main. Le manipuler en roulant reste risqué : un agent peut estimer que vous l’avez pris en main, et c’est sa constatation qui figurera sur le procès-verbal.' },
      { q: 'Et à l’arrêt au feu rouge ?', a: 'Le véhicule arrêté à un feu ou dans un embouteillage est toujours en circulation : la règle s’applique. Seul un véhicule stationné, garé hors de la circulation, échappe à l’interdiction. Pour téléphoner, il faut donc se garer, moteur coupé ou non, hors du flux de circulation.' },
      { q: 'Les écouteurs sans fil sont-ils concernés ?', a: 'Oui : l’article R412-6-1 interdit tout dispositif susceptible d’émettre du son porté à l’oreille, avec ou sans fil, y compris une seule oreillette. Le système audio du véhicule et le kit mains libres qui passe par les haut-parleurs restent autorisés. Les appareils correcteurs de surdité sont exclus de l’interdiction.' },
    ],
    body: (h) => `<h2>Le barème du téléphone et des fautes qui l’accompagnent</h2>
${h.table(['Infraction', 'Amende', 'Points', 'Seul', 'Avec téléphone, même contrôle'], ['telephone', 'ceinture', 'ligne_continue', 'feu_rouge'].map((id) => { const x = h.M.infraction(id); return [x.fr, h.eur(x.amendes!.forfaitaire), String(x.points), String(x.points), id === 'telephone' ? '—' : `${h.num(h.M.cumulSimultane([3, x.points]))} pts, ${h.eur(x.amendes!.forfaitaire + C4(h).forfaitaire)}`]; }), 'Téléphone au volant et cumul au même contrôle (plafond de 8 points, article L223-2)', ['l', 'r', 'r', 'r', 'r'])}
<p>${h.src('r412_6_1', 'L’article R412-6-1')} pose l’interdiction ; ${h.src('l224_2', 'l’article L224-2')} permet la suspension par le préfet en cas de cumul avec une infraction de la liste. Les amendes s’additionnent, les points sont plafonnés à huit pour un même contrôle.</p>
<!--mini:cumul-->
<h2>Les trois points et leur retour</h2>
<p>Trois points pour une contravention de 4e classe reviennent après trois ans sans nouvelle infraction. En permis probatoire, ce retrait égal au quart du capital rend le stage obligatoire. Le calcul de votre solde est sur la page ${h.a('combien-de-points', 'combien de points')}.</p>`,
  },
  en: {
    slug: 'phone-while-driving-fine-france',
    nav: 'Phone at the wheel',
    card: '€135 and 3 points; with another offence, licence seized.',
    title: 'Phone while driving fine in France: €135, 3 points',
    description: 'Phone while driving in France: €135 (€90 reduced), 3 points, possible suspension; with another offence at the same time, the licence can be seized on the spot.',
    h1: 'Using a phone while driving in France: €135 and 3 points',
    intro: 'Holding your phone, or wearing earphones, costs three points. Combined with another offence, it can cost you your licence the same day.',
    resume: (h) => `Article R412-6-1 of the French Highway Code bans the driver of a moving vehicle from holding a phone and from wearing in the ear any device that can emit sound, such as earphones or a headset; only hearing aids are excluded from the second ban. The offence is class 4: a ${h.eur(C4(h).forfaitaire)} standard fine, ${h.eur(C4(h).minoree!)} reduced, ${h.eur(C4(h).majoree)} increased, and ${h.num(tel(h).points)} points off a French licence. A court may suspend the licence for up to three years. Above all, article L224-2 lets the prefect suspend the licence when a driver stopped with a phone in hand commits at the same time another offence on the list set by decree, relating to driving, speed or priority: the licence is then seized on the spot and suspended for up to ${h.num(h.P.vitesse.suspension_prefet_max_mois)} months. A phone and crossing a solid line at the same stop cost ${h.num(h.M.cumulSimultane([3, 3]))} points.`,
    faqs: (h) => [
      { q: 'Is a phone in a holder allowed?', a: 'The rule targets a phone held in the hand. A phone fixed in a holder and used as a satnav is not, in itself, held in the hand. Handling it while driving is still risky: an officer may consider you picked it up, and that is what the report will record.' },
      { q: 'What about at a red light?', a: 'A vehicle stopped at lights or in a traffic jam is still in traffic: the rule applies. Only a vehicle parked out of traffic escapes the ban. To make a call, you need to park, with the engine running or not, away from the flow of traffic.' },
      { q: 'Are wireless earbuds covered?', a: 'Yes: article R412-6-1 bans any sound-emitting device worn in the ear, wired or wireless, including a single earpiece. The car’s audio system and a hands-free kit using the speakers remain allowed. Hearing aids are excluded from the ban, and the fine is the same as for a hand-held phone.' },
    ],
    body: (h) => `<h2>The phone and the offences that come with it</h2>
${h.table(['Offence', 'Fine', 'Points', 'Alone', 'With phone, same stop'], ['telephone', 'ceinture', 'ligne_continue', 'feu_rouge'].map((id) => { const x = h.M.infraction(id); return [x.en, h.eur(x.amendes!.forfaitaire), String(x.points), String(x.points), id === 'telephone' ? '—' : `${h.num(h.M.cumulSimultane([3, x.points]))} pts, ${h.eur(x.amendes!.forfaitaire + C4(h).forfaitaire)}`]; }), 'Phone at the wheel and combined offences at one stop (8-point cap, article L223-2)', ['l', 'r', 'r', 'r', 'r'])}
<p>${h.src('r412_6_1', 'Article R412-6-1')} sets the ban; ${h.src('l224_2', 'article L224-2')} allows a prefect’s suspension when combined with an offence on the list. Fines add up; points are capped at eight for one stop.</p>
<!--mini:cumul-->
<h2>The three points and getting them back</h2>
<p>Three points for a class 4 offence return after three years with no new offence. On a probationary licence, losing a quarter of the maximum makes a course compulsory. Your balance is worked out on the ${h.a('combien-de-points', 'how many points page')}.</p>`,
  },
});
