/** Excès de vitesse : vitesse mesurée, limite, radar → amende, points (R413-14, L413-1). */
import { T, eur, type L } from './_kit';
import { LIMITES, limOpts, appOpts, kmh, montant, pts } from './_am';
import { sanctionVitesse } from '../engine/sanctions';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'Mon excès de vitesse : amende et points', 'My speeding: fine and points'),
  cta: T(l, 'Calcul complet avec les seuils', 'Full calculation with thresholds'),
  inputs: [
    { id: 'v', label: T(l, 'Vitesse mesurée', 'Measured speed'), def: 97, max: 400, unit: 'km/h' },
    { id: 'l', label: T(l, 'Limite', 'Limit'), def: 3, options: limOpts(l) },
    { id: 'a', label: T(l, 'Radar', 'Camera'), def: 0, options: appOpts(l) },
  ],
  run: (v) => {
    const s = sanctionVitesse(v.v, LIMITES[v.l], v.a ? 'embarque' : 'fixe');
    return {
      head: [T(l, 'Amende forfaitaire', 'Standard fine'), montant(s, l)],
      rows: [
        [T(l, 'Vitesse retenue', 'Recorded speed'), kmh(s.retenue, l)],
        [T(l, 'Points retirés', 'Points deducted'), pts(s.points, l)],
        [T(l, 'Minorée (15 jours)', 'Reduced (15 days)'), s.amendes ? eur(s.amendes.minoree ?? 0, l) : s.afd ? eur(s.afd.minoree, l) : '—'],
      ],
    };
  },
});
