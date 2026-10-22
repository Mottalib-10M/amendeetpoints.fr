/** Limite de vitesse selon la route, la pluie et le permis probatoire (fiche Service Public F19460). */
import { T, yesNoOpts, type L } from './_kit';
import { kmh } from './_am';
import { limiteRoute, seuilsLimite, type Route } from '../engine/sanctions';
import type { MiniSpec } from '../mini-types';
const R: Route[] = ['autoroute', 'voie_separee', 'deux_voies_meme_sens', 'bidirectionnelle', 'agglomeration'];
export default (l: L): MiniSpec => ({
  title: T(l, 'Quelle est la limite sur cette route ?', 'What is the limit on this road?'),
  cta: T(l, 'Calculer un excès sur cette route', 'Work out speeding on this road'),
  inputs: [
    { id: 'r', label: T(l, 'Route', 'Road'), def: 0, options: [T(l, 'Autoroute', 'Motorway'), T(l, 'Chaussées séparées', 'Dual carriageway'), T(l, '2 voies même sens', '2 lanes each way'), T(l, 'Double sens', 'Single carriageway'), T(l, 'Agglomération', 'Built-up area')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'p', label: T(l, 'Pluie', 'Rain'), def: 0, options: yesNoOpts(l) },
    { id: 'j', label: T(l, 'Permis probatoire', 'Probationary licence'), def: 0, options: yesNoOpts(l) },
  ],
  run: (v) => {
    const lim = limiteRoute(R[v.r], v.p === 1, v.j === 1);
    const s = seuilsLimite(lim);
    return {
      head: [T(l, 'Vitesse maximale', 'Speed limit'), kmh(lim, l)],
      rows: [
        [T(l, 'Flashé (radar fixe) dès', 'Flashed (fixed camera) from'), kmh(s[0].mesuree, l)],
        [T(l, 'Premier point dès', 'First point from'), kmh(s[1].mesuree, l)],
        [T(l, 'Brouillard, visibilité < 50 m', 'Fog, visibility < 50 m'), kmh(50, l)],
      ],
      note: T(l, 'L’autorité locale peut abaisser ces vitesses par panneau, ou porter une route à double sens à 90 km/h.', 'Local authorities may lower these limits by sign, or raise a single carriageway road to 90 km/h.'),
    };
  },
});
