/** Stationnement : gênant, très gênant, dangereux, abusif (R417-10, R417-11, fiche Service Public). */
import { T, eur, type L } from './_kit';
import { infraction } from '../engine/sanctions';
import type { MiniSpec } from '../mini-types';
const IDS = ['stat_genant', 'stat_tres_genant', 'stat_dangereux', 'stat_abusif'];
export default (l: L): MiniSpec => ({
  title: T(l, 'Amende de stationnement', 'Parking fine'),
  cta: T(l, 'Payer ou contester : les dates', 'Pay or contest: the dates'),
  inputs: [{ id: 'i', label: T(l, 'Situation', 'Situation'), def: 0, options: [T(l, 'Gênant (double file, livraison…)', 'Obstructive (double parking…)'), T(l, 'Très gênant (trottoir, passage piéton…)', 'Seriously obstructive (pavement…)'), T(l, 'Dangereux (virage, sommet de côte…)', 'Dangerous (bend, brow of hill…)'), T(l, 'Abusif (plus de 7 jours)', 'Abandoned (over 7 days)')].map((x, i) => ({ value: String(i), label: x })) }],
  run: (v) => {
    const x = infraction(IDS[v.i]);
    return {
      head: [T(l, 'Amende forfaitaire', 'Standard fine'), eur(x.amendes!.forfaitaire, l)],
      rows: [
        [T(l, 'Majorée', 'Increased'), eur(x.amendes!.majoree, l)],
        [T(l, 'Minorée', 'Reduced'), T(l, 'non prévue', 'none')],
        [T(l, 'Points', 'Points'), String(x.points)],
      ],
    };
  },
});
