/** Marge technique du radar (arrêté du 4 juin 2009, art. 6) : de la vitesse mesurée à la vitesse retenue. */
import { T, type L } from './_kit';
import { appOpts, kmh } from './_am';
import { vitesseRetenue, marge } from '../engine/sanctions';
import { formatNumber } from '../format';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'Vitesse retenue après la marge du radar', 'Recorded speed after the camera margin'),
  cta: T(l, 'Voir l’amende pour cette vitesse', 'See the fine for this speed'),
  inputs: [
    { id: 'v', label: T(l, 'Vitesse mesurée', 'Measured speed'), def: 136, max: 400, unit: 'km/h' },
    { id: 'a', label: T(l, 'Appareil', 'Device'), def: 0, options: appOpts(l) },
  ],
  run: (v) => {
    const app = v.a ? 'embarque' : 'fixe';
    const m = marge(v.v, app);
    return {
      head: [T(l, 'Vitesse retenue', 'Recorded speed'), kmh(vitesseRetenue(v.v, app), l)],
      rows: [
        [T(l, 'Marge déduite', 'Margin deducted'), `${formatNumber(m, Number.isInteger(m) ? 0 : 1, l)} km/h`],
        [T(l, 'Règle appliquée', 'Rule used'), v.v < 100 ? T(l, `${app === 'fixe' ? 5 : 10} km/h sous 100 km/h`, `${app === 'fixe' ? 5 : 10} km/h below 100 km/h`) : T(l, `${app === 'fixe' ? 5 : 10} % dès 100 km/h`, `${app === 'fixe' ? 5 : 10}% from 100 km/h`)],
        [T(l, 'Arrondi', 'Rounding'), T(l, 'à l’unité inférieure', 'down to the unit')],
      ],
    };
  },
});
