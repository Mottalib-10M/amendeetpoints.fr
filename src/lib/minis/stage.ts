/** Stage de sensibilisation : 4 points, une fois par an, sans dépasser 12 (L223-6). */
import { T, type L } from './_kit';
import { P } from '../engine/params';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'Combien un stage me rendrait-il ?', 'How much would a course give back?'),
  cta: T(l, 'Calculer mon solde', 'Work out my balance'),
  inputs: [
    { id: 's', label: T(l, 'Points restants', 'Points left'), def: 6, max: 12 },
    { id: 'd', label: T(l, 'Dernier stage il y a', 'Last course'), def: 0, max: 240, unit: T(l, 'mois (0 = jamais)', 'mo. ago (0 = never)') },
  ],
  run: (v) => {
    const possible = v.s > 0 && v.s < P.permis.points_max && (v.d === 0 || v.d >= 12);
    const gain = possible ? Math.min(P.permis.stage_points, P.permis.points_max - v.s) : 0;
    return {
      head: [T(l, 'Points récupérés', 'Points regained'), `+${gain}`],
      rows: [
        [T(l, 'Solde après le stage', 'Balance after the course'), `${v.s + gain} / ${P.permis.points_max}`],
        [T(l, 'Stage possible', 'Course possible'), v.s === 0 ? T(l, 'non : permis invalidé', 'no: licence cancelled') : v.d > 0 && v.d < 12 ? T(l, `dans ${12 - v.d} mois`, `in ${12 - v.d} months`) : v.s >= P.permis.points_max ? T(l, 'inutile', 'pointless') : T(l, 'oui', 'yes')],
        [T(l, 'Fréquence', 'How often'), T(l, 'un stage par an au plus', 'one course a year at most')],
      ],
      note: T(l, 'Impossible si le permis est déjà invalidé (solde à zéro).', 'Not possible once the licence is cancelled (zero points).'),
    };
  },
});
