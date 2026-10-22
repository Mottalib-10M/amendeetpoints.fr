import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemples de la page : petit excès hors agglomération (3e classe) et en ville (4e classe). */
const ex = (h: Helpers) => ({ route: h.M.sanctionVitesse(92, 80), ville: h.M.sanctionVitesse(62, 50), quatre: h.M.sanctionVitesse(88, 80) });
const C = (h: Helpers) => h.P.classes;

export default defineGuide({
  id: 'exces-moins-de-20',
  group: 'vitesse',
  order: 1,
  tool: 'exces',
  outil: { defaultVitesse: 92, defaultLimite: 80 },
  related: ['exces-20-km-h', 'marge-erreur-radar', 'recuperer-des-points', 'amende-majoree', 'limitations-de-vitesse'],
  sources: ['r413_14', 'arreteCinemometres', 'r49_9', 'spAmende', 'l223_6', 'spEtranger'],
  fr: {
    slug: 'exces-de-vitesse-moins-de-20-km-h',
    nav: 'Moins de 20 km/h',
    card: '68 € ou 135 € selon la limite, 0 ou 1 point : le calcul exact.',
    title: 'Excès de vitesse de moins de 20 km/h : amende et point',
    description: 'Excès de vitesse de moins de 20 km/h : 68 € hors agglomération, 135 € si la limite est de 50 km/h ou moins, aucun point sous 5 km/h, sinon un point. Calcul.',
    h1: 'Excès de vitesse de moins de 20 km/h : 68 € ou 135 €',
    intro: 'Le plus courant des excès, et le plus mal expliqué : le montant dépend de la limite de la route, et le point du dépassement réel après la marge du radar.',
    resume: (h) => {
      const e = ex(h);
      return `Un excès de vitesse de moins de 20 km/h est une contravention dont la classe dépend de la vitesse autorisée, selon l’article R413-14 du Code de la route. Sur une route limitée à plus de 50 km/h, c’est une contravention de 3e classe : ${h.eur(C(h)['3'].forfaitaire)} d’amende forfaitaire, ${h.eur(C(h)['3'].minoree!)} si vous payez dans les quinze jours, ${h.eur(C(h)['3'].majoree)} si vous laissez passer quarante-cinq jours. Dans une rue ou sur une route limitée à 50 km/h ou moins, c’est la 4e classe : ${h.eur(C(h)['4'].forfaitaire)}, ${h.eur(C(h)['4'].minoree!)} minorée, ${h.eur(C(h)['4'].majoree)} majorée. Côté permis, aucun point n’est retiré si l’excès retenu est inférieur à 5 km/h ; de 5 à 19 km/h, un point. L’excès se compte sur la vitesse retenue, après déduction de la marge du radar : ${h.num(e.route.mesuree)} km/h mesurés par un radar fixe sur une route à 80 deviennent ${h.num(e.route.retenue)} km/h retenus, soit ${h.num(e.route.exces)} km/h d’excès, ${h.eur(e.route.amendes!.forfaitaire)} et ${h.num(e.route.points)} point. Ce point revient au bout de six mois sans nouvelle infraction.`;
    },
    faqs: (h) => [
      { q: 'Pourquoi mon voisin a payé 135 € pour un petit excès et moi 68 € ?', a: `Parce que la classe dépend de la limite de la route. Au-dessus de 50 km/h, un excès de moins de 20 km/h est de 3e classe, ${h.eur(C(h)['3'].forfaitaire)}. À 50 km/h ou moins, en ville, dans une zone 30 ou sur une petite route limitée à 50, il passe en 4e classe, ${h.eur(C(h)['4'].forfaitaire)}. Le même dépassement de 10 km/h coûte donc deux fois plus cher en agglomération.` },
      { q: 'Combien de temps pour récupérer le point perdu ?', a: `Six mois, à compter du jour où l’infraction est devenue définitive (en général le paiement), à condition de ne commettre aucune autre infraction entraînant un retrait de points pendant ces six mois. C’est la règle de l’article L223-6 pour un retrait d’un seul point. Une nouvelle infraction efface ce délai : le point revient alors avec les autres, après deux ou trois ans.` },
      { q: 'Un excès de 3 km/h donne-t-il une amende ?', a: `Oui, s’il est retenu après la marge du radar. Depuis le 1er janvier 2024, un excès inférieur à 5 km/h ne retire plus de point, mais l’amende reste due : ${h.eur(C(h)['3'].forfaitaire)} hors agglomération, ${h.eur(C(h)['4'].forfaitaire)} à 50 km/h ou moins. Sur un radar fixe, il faut avoir été mesuré au moins 6 km/h au-dessus de la limite, en dessous de 100 km/h, pour qu’un excès d’un kilomètre-heure soit retenu.` },
      { q: 'Le petit excès entraîne-t-il une hausse de mon assurance ?', a: 'La loi ne prévoit pas de majoration d’assurance pour un excès de vitesse sanctionné d’une simple amende. Le contrat peut contenir ses propres clauses, et l’assureur peut tenir compte d’une suspension ou d’une annulation de permis, qui ne sont pas encourues pour un excès inférieur à 20 km/h. Relisez les conditions générales de votre contrat en cas de doute.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>Ce que dit l’article R413-14</h2>
<p>Le texte, dans sa version issue du décret de 2023, fait deux choses. Il range l’excès de moins de 20 km/h en 3e classe quand la vitesse maximale autorisée est supérieure à 50 km/h, et en 4e classe quand elle est égale ou inférieure. Puis il fixe les points : aucun en dessous de 5 km/h, un de 5 à 19 km/h. ${h.src('r413_14', 'Le texte en vigueur est sur Légifrance')}.</p>
${h.table(['Excès retenu', 'Limite > 50 km/h', 'Limite ≤ 50 km/h', 'Points'], [['1 à 4 km/h', h.eur(C(h)['3'].forfaitaire), h.eur(C(h)['4'].forfaitaire), '0'], ['5 à 19 km/h', h.eur(C(h)['3'].forfaitaire), h.eur(C(h)['4'].forfaitaire), '1']], 'Amende forfaitaire et points pour un excès de moins de 20 km/h', ['l', 'r', 'r', 'r'])}
<h2>Deux exemples chiffrés</h2>
<p>Sur une départementale à 80 km/h, un radar fixe mesure ${h.num(e.route.mesuree)} km/h. Marge déduite, la vitesse retenue est de ${h.num(e.route.retenue)} km/h : ${h.num(e.route.exces)} km/h d’excès, ${h.eur(e.route.amendes!.forfaitaire)}, ${h.num(e.route.points)} point. En ville, ${h.num(e.ville.mesuree)} km/h mesurés pour 50 autorisés donnent ${h.num(e.ville.retenue)} km/h retenus, ${h.num(e.ville.exces)} km/h d’excès : ${h.eur(e.ville.amendes!.forfaitaire)} et ${h.num(e.ville.points)} point. La différence d’amende tient seulement à la limite de la route.</p>
<p>À ${h.num(e.quatre.mesuree)} km/h mesurés sur la même route à 80, l’excès retenu tombe à ${h.num(e.quatre.exces)} km/h : l’amende reste de ${h.eur(e.quatre.amendes!.forfaitaire)}, mais aucun point n’est retiré.</p>
<h2>Payer vite divise presque l’amende par deux</h2>
<p>Pour une 3e classe, payer dans les quinze jours suivant l’envoi de l’avis (trente en ligne) ramène la note à ${h.eur(C(h)['3'].minoree!)} ; attendre plus de quarante-cinq jours la porte à ${h.eur(C(h)['3'].majoree)}. Le calcul jour par jour est sur la page ${h.a('amende-majoree', 'de l’amende majorée')}.</p>
<!--mini:delais-->
<h2>Ce qui ne s’applique pas à ce niveau d’excès</h2>
<p>Ni suspension de permis, ni rétention sur le bord de la route : ces mesures commencent à 30 km/h et 40 km/h d’excès. Le seul effet sur le permis est le point retiré, qui revient en six mois sans nouvelle infraction. En permis probatoire, un point perdu prive en revanche des majorations annuelles : voir la page ${h.a('permis-probatoire', 'du permis probatoire')}.</p>`;
    },
  },
  en: {
    slug: 'speeding-less-than-20-km-h-over',
    nav: 'Under 20 km/h over',
    card: '€68 or €135 depending on the limit, 0 or 1 point: the exact figure.',
    title: 'Speeding under 20 km/h over in France: fine and point',
    description: 'Speeding under 20 km/h over in France: €68 outside towns, €135 where the limit is 50 km/h or less, no point under 5 km/h, otherwise one. Worked out for you.',
    h1: 'Under 20 km/h over the limit in France: €68 or €135',
    intro: 'The most common speeding fine, and the least well explained: the amount depends on the road’s limit, the point on the real excess after the camera margin.',
    resume: (h) => {
      const e = ex(h);
      return `Speeding by less than 20 km/h is a minor offence whose class depends on the speed limit, under article R413-14 of the French Highway Code. On a road limited to more than 50 km/h it is a class 3 offence: a standard fine of ${h.eur(C(h)['3'].forfaitaire)}, ${h.eur(C(h)['3'].minoree!)} if you pay within fifteen days, ${h.eur(C(h)['3'].majoree)} if you let forty-five days pass. In a street or on a road limited to 50 km/h or less it is class 4: ${h.eur(C(h)['4'].forfaitaire)}, ${h.eur(C(h)['4'].minoree!)} reduced, ${h.eur(C(h)['4'].majoree)} increased. On the licence, no point is taken if the recorded excess is under 5 km/h; from 5 to 19 km/h, one point. The excess is measured on the recorded speed, after the camera margin is deducted: ${h.num(e.route.mesuree)} km/h measured by a fixed camera on an 80 road becomes ${h.num(e.route.retenue)} km/h recorded, ${h.num(e.route.exces)} km/h over, ${h.eur(e.route.amendes!.forfaitaire)} and ${h.num(e.route.points)} point. That point comes back after six months with no new offence.`;
    },
    faqs: (h) => [
      { q: 'Why did a friend pay €135 for a small excess when I paid €68?', a: `Because the class depends on the road’s limit. Above 50 km/h, under 20 km/h over is class 3, ${h.eur(C(h)['3'].forfaitaire)}. At 50 km/h or less, in town, in a 30 zone or on a small road limited to 50, it becomes class 4, ${h.eur(C(h)['4'].forfaitaire)}. The same 10 km/h over therefore costs twice as much in a built-up area.` },
      { q: 'How long until the lost point comes back?', a: 'Six months from the day the offence became final (usually when you paid), provided you commit no other offence costing points in those six months. That is the rule in article L223-6 for a single point. A new offence cancels that window: the point then comes back with the others, after two or three years.' },
      { q: 'Does 3 km/h over really mean a fine?', a: `Yes, if it is the recorded excess after the camera margin. Since 1 January 2024 an excess under 5 km/h no longer costs a point, but the fine is still due: ${h.eur(C(h)['3'].forfaitaire)} outside towns, ${h.eur(C(h)['4'].forfaitaire)} where the limit is 50 or less. With a fixed camera below 100 km/h you must have been measured at least 6 km/h over the limit to be recorded 1 km/h over.` },
      { q: 'I am driving a hire car with foreign plates: does this apply to me?', a: 'Yes. The amount and the class are the same for every driver. The fine is due whatever licence you hold; a notice sent to the hire company is passed on to you, and a flash can also reach your home country through the European exchange of vehicle data. Paying within the reduced-fine window is the cheapest option.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>What article R413-14 says</h2>
<p>The text, as worded since the 2023 decree, does two things. It puts speeding by less than 20 km/h in class 3 when the maximum speed is above 50 km/h, and in class 4 when it is 50 or below. Then it sets the points: none below 5 km/h over, one from 5 to 19 km/h. ${h.src('r413_14', 'The text in force is on Légifrance')}.</p>
${h.table(['Recorded excess', 'Limit > 50 km/h', 'Limit ≤ 50 km/h', 'Points'], [['1 to 4 km/h', h.eur(C(h)['3'].forfaitaire), h.eur(C(h)['4'].forfaitaire), '0'], ['5 to 19 km/h', h.eur(C(h)['3'].forfaitaire), h.eur(C(h)['4'].forfaitaire), '1']], 'Standard fine and points for under 20 km/h over', ['l', 'r', 'r', 'r'])}
<h2>Two worked examples</h2>
<p>On a country road limited to 80 km/h, a fixed camera measures ${h.num(e.route.mesuree)} km/h. With the margin deducted the recorded speed is ${h.num(e.route.retenue)} km/h: ${h.num(e.route.exces)} km/h over, ${h.eur(e.route.amendes!.forfaitaire)}, ${h.num(e.route.points)} point. In town, ${h.num(e.ville.mesuree)} km/h measured where 50 is allowed gives ${h.num(e.ville.retenue)} km/h recorded, ${h.num(e.ville.exces)} km/h over: ${h.eur(e.ville.amendes!.forfaitaire)} and ${h.num(e.ville.points)} point. The difference in the fine is due to the road’s limit alone.</p>
<p>At ${h.num(e.quatre.mesuree)} km/h measured on the same 80 road, the recorded excess drops to ${h.num(e.quatre.exces)} km/h: the fine is still ${h.eur(e.quatre.amendes!.forfaitaire)}, but no point is taken.</p>
<h2>Paying quickly almost halves the fine</h2>
<p>For class 3, paying within fifteen days of the notice being sent (thirty online) brings the bill down to ${h.eur(C(h)['3'].minoree!)}; waiting more than forty-five days raises it to ${h.eur(C(h)['3'].majoree)}. The day-by-day calculation is on the ${h.a('amende-majoree', 'increased fine page')}.</p>
<!--mini:delais-->
<h2>What does not apply at this level</h2>
<p>No suspension and no roadside licence seizure: those start at 30 km/h and 40 km/h over. The only effect on a French licence is the point taken, which returns in six months with no new offence. On a probationary licence, however, one lost point means losing the yearly top-ups: see the ${h.a('permis-probatoire', 'probationary licence page')}.</p>`;
    },
  },
});
