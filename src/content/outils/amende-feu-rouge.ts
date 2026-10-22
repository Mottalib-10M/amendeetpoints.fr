import { defineGuide, type Helpers } from '../../lib/guide-types';

type Dep = { nom: string; types: Record<string, number> };
const C4 = (h: Helpers) => h.P.classes['4'];
const FR = (h: Helpers) => h.S.national.types.ETFR;
const top = (h: Helpers) => Object.values(h.S.deps as unknown as Record<string, Dep>).filter((d) => (d.types.ETFR ?? 0) > 0).sort((a, b) => b.types.ETFR - a.types.ETFR || a.nom.localeCompare(b.nom)).slice(0, 4).map((d) => `${d.nom} (${h.num(d.types.ETFR)})`).join(', ');

export default defineGuide({
  id: 'amende-feu-rouge',
  group: 'infractions',
  order: 2,
  tool: 'infraction',
  outil: { ids: ['feu_rouge', 'stop', 'cedez', 'priorite', 'pieton'], defaultId: 'feu_rouge' },
  related: ['bareme-points', 'radar-fixe', 'carte-radars', 'recuperer-des-points', 'contester-une-amende'],
  sources: ['r412_30', 'spBareme', 'r49_9', 'radarsDataset'],
  fr: {
    slug: 'amende-feu-rouge',
    nav: 'Feu rouge, stop, priorité',
    card: '135 € et 4 points, 6 pour un piéton : feu rouge, stop et priorité.',
    title: 'Amende feu rouge : 135 €, 4 points, radars de feu rouge',
    description: 'Amende pour feu rouge grillé : 135 € (90 € minorée), 4 points, suspension possible de 3 ans. Même barème pour le stop et la priorité ; 6 points pour un piéton.',
    h1: 'Amende pour feu rouge grillé : 135 € et 4 points',
    intro: 'Feu rouge, stop, cédez-le-passage : la même contravention de 4e classe et les mêmes points. Seule la priorité due à un piéton coûte plus cher en points.',
    resume: (h) => `Franchir un feu rouge, fixe ou clignotant, est une contravention de 4e classe prévue par l’article R412-30 du Code de la route : ${h.eur(C4(h).forfaitaire)} d’amende forfaitaire, ${h.eur(C4(h).minoree!)} si elle est payée dans les quinze jours, ${h.eur(C4(h).majoree)} après quarante-cinq jours. Quatre points sont retirés et le juge peut suspendre le permis pendant trois ans au plus. Le feu orange fixe doit aussi arrêter le conducteur, sauf s’il ne peut plus le faire dans des conditions de sécurité suffisantes. Le non-respect du stop, du cédez-le-passage ou d’une priorité coûte la même amende et les mêmes quatre points ; ne pas céder le passage à un piéton qui traverse en retire six. Le ministère de l’Intérieur recense ${h.num(FR(h))} radars de feu rouge fixes dans son fichier du ${h.date(h.S.meta.fichier)}, surtout dans les départements urbains : ${top(h)}. Ils photographient le véhicule qui franchit la ligne d’arrêt après le passage au rouge.`,
    faqs: (h) => [
      { q: 'Un radar de feu rouge flashe-t-il au feu orange ?', a: 'Le radar de feu rouge se déclenche quand le véhicule franchit la ligne d’arrêt alors que le feu est déjà rouge. Passer à l’orange n’est pas constaté par l’appareil. Le Code de la route impose pourtant de s’arrêter à l’orange fixe, sauf impossibilité en sécurité : un agent peut verbaliser ce cas sur place.' },
      { q: 'Peut-on contester en disant qu’on laissait passer une ambulance ?', a: 'Oui, la contestation est possible si un véhicule prioritaire vous a contraint à avancer. Il faut l’expliquer dans la requête, avec tout élément utile, et consigner le montant de l’amende. La photo du radar montre souvent le contexte ; demandez-la avant de contester pour vérifier qu’elle vous donne raison.' },
      { q: 'Pourquoi le refus de priorité à un piéton coûte-t-il six points ?', a: 'Le barème des points traite plus sévèrement l’infraction qui met directement en danger un usager vulnérable. Le refus de céder le passage à un piéton engagé sur la chaussée ou manifestant l’intention de traverser retire six points, soit la moitié d’un permis plein, pour la même amende de 4e classe que le feu rouge.' },
    ],
    body: (h) => `<h2>Le barème des infractions aux intersections</h2>
${h.table(['Infraction', 'Classe', 'Amende forfaitaire', 'Points'], ['feu_rouge', 'stop', 'cedez', 'priorite', 'pieton'].map((id) => { const x = h.M.infraction(id); return [x.fr, String(x.classe), h.eur(x.amendes!.forfaitaire), String(x.points)]; }), 'Intersections : amende et points (fiche Service Public F31551)', ['l', 'r', 'r', 'r'])}
<p>${h.src('r412_30', 'L’article R412-30')} prévoit aussi la suspension du permis pour trois ans au plus. Comme pour tout retrait de quatre points, ceux-ci reviennent après trois ans sans nouvelle infraction, puisqu’il s’agit d’une contravention de 4e classe.</p>
<!--mini:infraction-->
<h2>Où sont les radars de feu rouge</h2>
<p>Les ${h.num(FR(h))} radars de feu rouge du fichier public se trouvent surtout en ville, à des carrefours équipés de feux. La ${h.a('carte-radars', 'carte par département')} les affiche avec le filtre « Radar feu rouge ». Ils ne mesurent pas la vitesse : la colonne de la limite reste vide.</p>
<h2>Feu rouge et permis probatoire</h2>
<p>Quatre points sur un permis probatoire de six en laissent deux, et rendent le stage obligatoire. Le capital et le délai de retour se calculent sur la page ${h.a('permis-probatoire', 'du permis probatoire')}.</p>`,
  },
  en: {
    slug: 'red-light-fine-france',
    nav: 'Red light, stop, give way',
    card: '€135 and 4 points, 6 for a pedestrian: red lights, stops and priority.',
    title: 'Red light fine in France: €135, 4 points, red-light cameras',
    description: 'Red light fine in France: €135 (€90 reduced), 4 points, possible 3-year suspension. The same for stop signs and failing to give way; 6 for a pedestrian.',
    h1: 'Running a red light in France: €135 and 4 points',
    intro: 'Red light, stop sign, give way: the same class 4 offence and the same points. Only failing to give way to a pedestrian costs more points.',
    resume: (h) => `Running a red light, steady or flashing, is a class 4 offence under article R412-30 of the French Highway Code: a ${h.eur(C4(h).forfaitaire)} standard fine, ${h.eur(C4(h).minoree!)} if paid within fifteen days, ${h.eur(C4(h).majoree)} after forty-five days. Four points are taken off a French licence and a court may suspend the licence for up to three years. A steady amber light also requires the driver to stop, unless they can no longer do so safely. Ignoring a stop sign, a give-way sign or a priority rule costs the same fine and the same four points; failing to give way to a pedestrian crossing costs six. The Interior Ministry lists ${h.num(FR(h))} fixed red-light cameras in its file of ${h.date(h.S.meta.fichier)}, mostly in urban départements: ${top(h)}. They photograph the vehicle crossing the stop line after the light has turned red.`,
    faqs: (h) => [
      { q: 'Does a red-light camera flash on amber?', a: 'A red-light camera triggers when the vehicle crosses the stop line while the light is already red. Going through on amber is not recorded by the device. The Highway Code still requires you to stop at a steady amber, unless you cannot do so safely: an officer on the spot can fine that.' },
      { q: 'Can I contest because I was letting an ambulance through?', a: 'Yes, you may contest if an emergency vehicle forced you to move forward. Explain it in the request with any useful evidence, and lodge the deposit. The camera photo often shows the context; ask for it before contesting to check that it supports you.' },
      { q: 'Is “priorité à droite” really enforced?', a: 'Yes. At an unmarked junction, traffic from the right has priority, and failing to give way is the same class 4 offence as a stop sign, with the same four points. Visitors from countries without this rule are often caught out in villages and older town centres.' },
    ],
    body: (h) => `<h2>The scale for junction offences</h2>
${h.table(['Offence', 'Class', 'Standard fine', 'Points'], ['feu_rouge', 'stop', 'cedez', 'priorite', 'pieton'].map((id) => { const x = h.M.infraction(id); return [x.en, String(x.classe), h.eur(x.amendes!.forfaitaire), String(x.points)]; }), 'Junctions: fine and points (Service Public page F31551)', ['l', 'r', 'r', 'r'])}
<p>${h.src('r412_30', 'Article R412-30')} also provides for a licence suspension of up to three years. As for any four-point deduction, the points come back after three years with no new offence, since it is a class 4 offence.</p>
<!--mini:infraction-->
<h2>Where the red-light cameras are</h2>
<p>The ${h.num(FR(h))} red-light cameras in the public file are mostly in towns, at junctions with traffic lights. The ${h.a('carte-radars', 'map by département')} shows them with the “Red-light camera” filter. They do not measure speed, so the limit column stays empty.</p>
<h2>Red lights and the probationary licence</h2>
<p>Four points from a six-point probationary licence leave two, and make a course compulsory. The balance and the recovery date are worked out on the ${h.a('permis-probatoire', 'probationary licence page')}.</p>`,
  },
});
