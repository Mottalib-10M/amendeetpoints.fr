/** Récupération des points (L223-6) : quand les points reviennent, selon les points perdus et la gravité. */
import { T, type L } from './_kit';
import { P } from '../engine/params';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'Quand mes points reviennent-ils ?', 'When do my points come back?'),
  cta: T(l, 'Calculer mon solde avec les dates', 'Work out my balance with dates'),
  inputs: [
    { id: 'p', label: T(l, 'Points perdus en tout', 'Points lost in total'), def: 2, max: 11 },
    { id: 'm', label: T(l, 'Dernière infraction payée il y a', 'Last offence paid'), def: 8, max: 120, unit: T(l, 'mois', 'mo. ago') },
    { id: 'g', label: T(l, 'Une infraction de 4e classe ou un délit ?', 'Any class-4 fine or criminal offence?'), def: 1, options: [{ value: '0', label: T(l, 'Non (3e classe ou moins)', 'No (class 3 or lower)') }, { value: '1', label: T(l, 'Oui', 'Yes') }] },
  ],
  run: (v) => {
    const ans = v.g ? P.permis.recup_totale_ans_si_classe4_ou_delit : P.permis.recup_totale_ans;
    const restants = Math.max(0, ans * 12 - v.m);
    const unPoint = v.p === 1 && v.m < P.permis.recup_un_point_mois;
    return {
      head: [T(l, 'Tous les points reviennent dans', 'All points back in'), restants === 0 ? T(l, 'déjà revenus', 'already back') : T(l, `${restants} mois`, `${restants} months`)],
      rows: [
        [T(l, 'Délai sans nouvelle infraction', 'Clean period needed'), T(l, `${ans} ans`, `${ans} years`)],
        [T(l, 'Règle des 6 mois (1 point)', '6-month rule (1 point)'), v.p === 1 ? (unPoint ? T(l, `dans ${P.permis.recup_un_point_mois - v.m} mois`, `in ${P.permis.recup_un_point_mois - v.m} months`) : T(l, 'déjà acquise', 'already met')) : T(l, 'ne s’applique pas', 'does not apply')],
        [T(l, 'Solde actuel', 'Current balance'), `${Math.max(0, P.permis.points_max - v.p)} / ${P.permis.points_max}`],
      ],
      note: T(l, 'Une nouvelle infraction payée remet le compteur à zéro.', 'A new offence, once paid, restarts the clock.'),
    };
  },
});
