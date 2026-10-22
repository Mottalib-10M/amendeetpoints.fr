import { defineGuide, type Helpers } from '../../lib/guide-types';

const C4 = (h: Helpers) => h.P.classes['4'];
const ex = (h: Helpers) => ({ a: h.M.sanctionVitesse(108, 80), b: h.M.sanctionVitesse(76, 50), c: h.M.sanctionVitesse(156, 130) });

export default defineGuide({
  id: 'exces-20-km-h',
  group: 'vitesse',
  order: 2,
  tool: 'exces',
  outil: { defaultVitesse: 108, defaultLimite: 80 },
  related: ['exces-moins-de-20', 'exces-30-km-h', 'recuperer-des-points', 'combien-de-points', 'contester-une-amende'],
  sources: ['r413_14', 'r49_9', 'l223_6', 'spBareme', 'arreteCinemometres'],
  fr: {
    slug: 'exces-de-vitesse-20-km-h',
    nav: 'De 20 à 29 km/h',
    card: '135 € et 2 points, quelle que soit la route : à partir de quelle vitesse.',
    title: 'Excès de vitesse de 20 à 29 km/h : 135 € et 2 points',
    description: 'Excès de vitesse de 20 à 29 km/h : amende de 135 € (90 € minorée, 375 € majorée), 2 points, retour des points en trois ans. La vitesse mesurée qui déclenche.',
    h1: 'Excès de vitesse de 20 à 29 km/h : 135 € et 2 points',
    intro: 'À partir de 20 km/h d’excès retenu, la route ne compte plus : partout, c’est la 4e classe et deux points. Voici où commence cette tranche pour votre limite.',
    resume: (h) => {
      const e = ex(h);
      return `Un excès de vitesse compris entre 20 et 29 km/h est une contravention de 4e classe sur toutes les routes, selon l’article R413-14 du Code de la route. L’amende forfaitaire est de ${h.eur(C4(h).forfaitaire)} ; elle tombe à ${h.eur(C4(h).minoree!)} si elle est payée dans les quinze jours suivant l’envoi de l’avis, et monte à ${h.eur(C4(h).majoree)} après quarante-cinq jours. Deux points sont retirés du permis. Le texte ne prévoit pas de suspension pour cette tranche, et le conducteur intercepté garde son permis. Le seuil se calcule sur la vitesse retenue : sur une route à 80 km/h, un radar fixe qui mesure ${h.num(e.a.mesuree)} km/h retient ${h.num(e.a.retenue)} km/h, soit ${h.num(e.a.exces)} km/h d’excès et ${h.num(e.a.points)} points. Parce qu’il s’agit d’une contravention de 4e classe, les points ne reviennent d’un bloc qu’après trois ans sans nouvelle infraction, contre deux pour un excès de 3e classe ; la règle des six mois ne joue pas, puisque plus d’un point a été retiré.`;
    },
    faqs: (h) => [
      { q: 'À partir de quelle vitesse mesurée passe-t-on à deux points sur autoroute ?', a: `Sur autoroute à 130 km/h, il faut une vitesse retenue de 150 km/h. La marge de 5 % du radar fixe porte la vitesse mesurée nécessaire à ${h.num(h.M.mesureePourRetenue(150, 'fixe'))} km/h. Avec un radar embarqué dans une voiture banalisée, la marge est de 10 % et le seuil monte à ${h.num(h.M.mesureePourRetenue(150, 'embarque'))} km/h mesurés.` },
      { q: 'Deux points, est-ce récupérable plus vite qu’en trois ans ?', a: `Oui, par un stage de sensibilisation, qui rend ${h.num(h.P.permis.stage_points)} points une fois par an et couvre donc largement les deux points perdus. Sans stage, l’article L223-6 fixe le retour au maximum à trois ans sans nouvelle infraction, parce qu’un excès de 20 km/h ou plus est une contravention de 4e classe. Le calcul daté est sur la page des points.` },
      { q: 'Faut-il désigner le conducteur si ce n’est pas moi qui conduisais ?', a: 'Oui, si vous êtes titulaire du certificat d’immatriculation et que vous n’étiez pas au volant : la requête en exonération, avec l’identité et le numéro de permis du conducteur, se fait dans les quarante-cinq jours sur le site de l’ANTAI ou par courrier. Les points sont alors retirés du permis de la personne désignée.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>Une seule classe, quelle que soit la route</h2>
<p>Pour un excès de moins de 20 km/h, l’amende varie avec la limite de la route. À partir de 20 km/h, cette distinction disparaît : en ville comme sur autoroute, l’article R413-14 retient la 4e classe. ${h.num(e.b.mesuree)} km/h mesurés en agglomération donnent ${h.num(e.b.retenue)} km/h retenus et ${h.num(e.b.exces)} km/h d’excès ; ${h.num(e.c.mesuree)} km/h sur autoroute donnent ${h.num(e.c.retenue)} km/h retenus et ${h.num(e.c.exces)} km/h. Les deux conducteurs paient ${h.eur(C4(h).forfaitaire)} et perdent ${h.num(e.c.points)} points.</p>
${h.table(['Limite', 'Vitesse retenue', 'Mesurée par un radar fixe', 'Mesurée par un radar embarqué'], [30, 50, 70, 80, 90, 110, 130].map((l) => [`${l} km/h`, `${h.num(l + 20)} à ${h.num(l + 29)} km/h`, `${h.num(h.M.mesureePourRetenue(l + 20, 'fixe'))} à ${h.num(h.M.mesureePourRetenue(l + 30, 'fixe') - 1)} km/h`, `${h.num(h.M.mesureePourRetenue(l + 20, 'embarque'))} à ${h.num(h.M.mesureePourRetenue(l + 30, 'embarque') - 1)} km/h`]), 'Vitesses qui tombent dans la tranche de 20 à 29 km/h d’excès', ['l', 'r', 'r', 'r'])}
<h2>Pourquoi le seuil mesuré grimpe au-dessus de 100 km/h</h2>
<p>En dessous de 100 km/h, la marge d’un radar fixe est de 5 km/h ; au-dessus, de 5 % de la vitesse mesurée. Sur une route à 80, il faut ${h.num(h.M.mesureePourRetenue(100, 'fixe'))} km/h mesurés pour être retenu à 100 ; sur autoroute, l’écart entre vitesse mesurée et vitesse retenue atteint 8 km/h. Le détail est sur la page de la ${h.a('marge-erreur-radar', 'marge d’erreur')}.</p>
<h2>Après l’avis</h2>
<p>Payer l’amende vaut reconnaissance de l’infraction : les deux points sont retirés dès que le paiement est enregistré. Si vous contestez, il faut consigner ${h.eur(C4(h).forfaitaire)} dans les quarante-cinq jours. Le retour des deux points se calcule avec l’outil de la page ${h.a('recuperer-des-points', 'récupérer des points')}.</p>
<!--mini:recup-->`;
    },
  },
  en: {
    slug: 'speeding-20-km-h-over',
    nav: '20 to 29 km/h over',
    card: '€135 and 2 points, whatever the road: from what speed.',
    title: 'Speeding 20–29 km/h over in France: €135 and 2 points',
    description: 'Speeding 20 to 29 km/h over in France: a €135 fine (€90 reduced, €375 increased), 2 points, back after three years. The measured speed at which it starts.',
    h1: 'Speeding 20 to 29 km/h over: €135 and 2 points',
    intro: 'From 20 km/h over the limit, the type of road no longer matters: everywhere it is class 4 and two points. Here is where that band starts for your limit.',
    resume: (h) => {
      const e = ex(h);
      return `Speeding by 20 to 29 km/h is a class 4 offence on every road under article R413-14 of the French Highway Code. The standard fine is ${h.eur(C4(h).forfaitaire)}; it drops to ${h.eur(C4(h).minoree!)} if paid within fifteen days of the notice being sent, and rises to ${h.eur(C4(h).majoree)} after forty-five days. Two points are taken off a French licence. The text provides no suspension for this band, and a driver who is stopped keeps the licence. The threshold uses the recorded speed: on an 80 km/h road, a fixed camera measuring ${h.num(e.a.mesuree)} km/h records ${h.num(e.a.retenue)} km/h, ${h.num(e.a.exces)} km/h over and ${h.num(e.a.points)} points. Because it is a class 4 offence, the points only come back in full after three years with no new offence, against two for a class 3 excess; the six-month rule does not apply, since more than one point was taken.`;
    },
    faqs: (h) => [
      { q: 'From what measured speed is it two points on a motorway?', a: `On a 130 km/h motorway you need a recorded 150 km/h. The fixed camera’s 5% margin puts the measured speed needed at ${h.num(h.M.mesureePourRetenue(150, 'fixe'))} km/h. With an in-car camera in an unmarked vehicle the margin is 10%, and the threshold rises to ${h.num(h.M.mesureePourRetenue(150, 'embarque'))} km/h measured.` },
      { q: 'Can two points come back faster than three years?', a: `Yes, through an awareness course, which gives back ${h.num(h.P.permis.stage_points)} points once a year and so more than covers two lost points. Without one, article L223-6 restores the maximum after three years with no new offence, because 20 km/h over or more is a class 4 offence. The dated calculation is on the points page.` },
      { q: 'I was not driving: what do I do with the notice?', a: 'If you are the registered keeper and were not at the wheel, you name the driver: the exemption request, with the driver’s identity and licence number, is made within forty-five days on the ANTAI website or by post. The points are then taken from the named person’s licence. Companies must name the driver too.' },
    ],
    body: (h) => {
      const e = ex(h);
      return `<h2>One class, whatever the road</h2>
<p>For less than 20 km/h over, the fine depends on the road’s limit. From 20 km/h over, that distinction goes: in town or on a motorway, article R413-14 applies class 4. ${h.num(e.b.mesuree)} km/h measured in a built-up area gives ${h.num(e.b.retenue)} km/h recorded and ${h.num(e.b.exces)} km/h over; ${h.num(e.c.mesuree)} km/h on a motorway gives ${h.num(e.c.retenue)} km/h recorded and ${h.num(e.c.exces)} km/h over. Both drivers pay ${h.eur(C4(h).forfaitaire)} and lose ${h.num(e.c.points)} points.</p>
${h.table(['Limit', 'Recorded speed', 'Measured by a fixed camera', 'Measured by an in-car camera'], [30, 50, 70, 80, 90, 110, 130].map((l) => [`${l} km/h`, `${h.num(l + 20)} to ${h.num(l + 29)} km/h`, `${h.num(h.M.mesureePourRetenue(l + 20, 'fixe'))} to ${h.num(h.M.mesureePourRetenue(l + 30, 'fixe') - 1)} km/h`, `${h.num(h.M.mesureePourRetenue(l + 20, 'embarque'))} to ${h.num(h.M.mesureePourRetenue(l + 30, 'embarque') - 1)} km/h`]), 'Speeds that fall in the 20–29 km/h over band', ['l', 'r', 'r', 'r'])}
<h2>Why the measured threshold climbs above 100 km/h</h2>
<p>Below 100 km/h, a fixed camera’s margin is 5 km/h; above it, 5% of the measured speed. On an 80 road you need ${h.num(h.M.mesureePourRetenue(100, 'fixe'))} km/h measured to be recorded at 100; on a motorway the gap between measured and recorded speed reaches 8 km/h. Details on the ${h.a('marge-erreur-radar', 'margin of error page')}.</p>
<h2>After the notice</h2>
<p>Paying the fine counts as admitting the offence: the two points go as soon as payment is recorded. To contest, you must lodge a ${h.eur(C4(h).forfaitaire)} deposit within forty-five days. When the two points return is worked out by the tool on the ${h.a('recuperer-des-points', 'getting points back page')}.</p>
<!--mini:recup-->`;
    },
  },
});
