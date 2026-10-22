/** Paris : vitesse mesurée par un radar fixe à 30, 50 ou 70 km/h → amende et points (R413-14). */
import { T, eur, type L } from './_kit';
import { kmh, montant, pts } from './_am';
import { sanctionVitesse, mesureePourRetenue } from '../engine/sanctions';
import type { MiniSpec } from '../mini-types';
const LIM = [50, 30, 70];
export default (l: L): MiniSpec => ({
  title: T(l, 'Flashé dans Paris : combien ?', 'Flashed in Paris: how much?'),
  cta: T(l, 'Calcul complet avec les seuils', 'Full calculation with thresholds'),
  inputs: [
    { id: 'v', label: T(l, 'Vitesse mesurée', 'Measured speed'), def: 62, max: 300, unit: 'km/h' },
    { id: 'l', label: T(l, 'Limite', 'Limit'), def: 0, options: [T(l, '50 km/h (périphérique, rues)', '50 km/h (ring road, streets)'), T(l, '30 km/h (rues)', '30 km/h (streets)'), '70 km/h'].map((x, i) => ({ value: String(i), label: x })) },
  ],
  run: (v) => {
    const lim = LIM[v.l];
    const s = sanctionVitesse(v.v, lim, 'fixe');
    return {
      head: [T(l, 'Amende forfaitaire', 'Standard fine'), montant(s, l)],
      rows: [
        [T(l, 'Vitesse retenue', 'Recorded speed'), kmh(s.retenue, l)],
        [T(l, 'Points retirés', 'Points deducted'), pts(s.points, l)],
        [T(l, 'Premier point dès', 'First point from'), kmh(mesureePourRetenue(lim + 5, 'fixe'), l)],
      ],
      note: s.amendes?.minoree ? T(l, `Minorée sous 15 jours : ${eur(s.amendes.minoree, l)}.`, `Reduced within 15 days: ${eur(s.amendes.minoree, l)}.`) : undefined,
    };
  },
});
