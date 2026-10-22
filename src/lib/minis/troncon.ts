/** Radar tronçon : vitesse moyenne entre deux points, marge du radar fixe, sanction. */
import { T, type L } from './_kit';
import { LIMITES, limOpts, kmh, montant, pts } from './_am';
import { sanctionVitesse, vitesseMoyenne } from '../engine/sanctions';
import { formatNumber } from '../format';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'Radar tronçon : ma vitesse moyenne', 'Average-speed camera: my average'),
  cta: T(l, 'Calcul détaillé', 'Detailed calculation'),
  inputs: [
    { id: 'km', label: T(l, 'Longueur du tronçon', 'Section length'), def: 5, max: 100, unit: 'km', decimals: 1 },
    { id: 's', label: T(l, 'Temps de parcours', 'Time taken'), def: 180, max: 36000, unit: T(l, 'secondes', 'seconds') },
    { id: 'l', label: T(l, 'Limite', 'Limit'), def: 4, options: limOpts(l) },
  ],
  run: (v) => {
    const moy = vitesseMoyenne(v.km, v.s);
    const s = sanctionVitesse(Math.floor(moy * 10) / 10, LIMITES[v.l], 'fixe');
    return {
      head: [T(l, 'Vitesse moyenne', 'Average speed'), `${formatNumber(moy, 1, l)} km/h`],
      rows: [
        [T(l, 'Vitesse retenue', 'Recorded speed'), kmh(s.retenue, l)],
        [T(l, 'Amende', 'Fine'), montant(s, l)],
        [T(l, 'Points', 'Points'), pts(s.points, l)],
      ],
    };
  },
});
