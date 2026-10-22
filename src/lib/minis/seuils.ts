/** Pour une limite : à partir de quelle vitesse MESURÉE on perd 1, 2, 3, 4 points, puis le délit. */
import { T, type L } from './_kit';
import { LIMITES, limOpts, appOpts, kmh } from './_am';
import { seuilsLimite } from '../engine/sanctions';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'À partir de quelle vitesse je perds des points ?', 'From what speed do I lose points?'),
  cta: T(l, 'Calculer ma sanction', 'Work out my penalty'),
  inputs: [
    { id: 'l', label: T(l, 'Limite', 'Limit'), def: 3, options: limOpts(l) },
    { id: 'a', label: T(l, 'Radar', 'Camera'), def: 0, options: appOpts(l) },
  ],
  run: (v) => {
    const s = seuilsLimite(LIMITES[v.l], v.a ? 'embarque' : 'fixe');
    return {
      head: [T(l, 'Premier point retiré dès', 'First point lost from'), kmh(s[1].mesuree, l)],
      rows: [
        [T(l, '2 points dès', '2 points from'), kmh(s[2].mesuree, l)],
        [T(l, '3 points et suspension dès', '3 points and suspension from'), kmh(s[3].mesuree, l)],
        [T(l, 'Délit (6 points) dès', 'Criminal offence (6 points) from'), kmh(s[5].mesuree, l)],
      ],
      note: T(l, 'Vitesses lues par le radar, avant la marge.', 'Speeds read by the camera, before the margin.'),
    };
  },
});
