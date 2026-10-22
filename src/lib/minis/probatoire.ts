/** Permis probatoire (L223-1) : capital selon l'ancienneté, la conduite accompagnée et une infraction. */
import { T, yesNoOpts, type L } from './_kit';
import { probatoire } from '../engine/sanctions';
import { P } from '../engine/params';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'Mes points en permis probatoire', 'My points on a probationary licence'),
  cta: T(l, 'Simulation avec mes infractions', 'Simulation with my offences'),
  inputs: [
    { id: 'm', label: T(l, 'Permis obtenu il y a', 'Licence obtained'), def: 26, max: 60, unit: T(l, 'mois', 'mo. ago') },
    { id: 'a', label: T(l, 'Conduite accompagnée', 'Accompanied driving'), def: 0, options: yesNoOpts(l) },
    { id: 'p', label: T(l, 'Points déjà retirés', 'Points already lost'), def: 0, max: 6 },
  ],
  run: (v) => {
    const r = probatoire(v.m, v.a === 1, v.p ? [{ mois: Math.max(0, v.m - 1), points: v.p }] : []);
    return {
      head: [T(l, 'Capital aujourd’hui', 'Points today'), `${r.capital} / ${P.permis.points_max}`],
      rows: [
        [T(l, 'Durée de la période', 'Probation length'), T(l, `${r.ans} ans, +${r.gain} par an`, `${r.ans} years, +${r.gain} a year`)],
        [T(l, 'Fin de la période', 'End of probation'), r.enCours ? T(l, `dans ${r.moisRestants} mois`, `in ${r.moisRestants} months`) : T(l, 'terminée', 'over')],
        [T(l, 'Stage obligatoire', 'Compulsory course'), r.stageObligatoire ? T(l, 'oui (retrait ≥ 3 points)', 'yes (3+ points lost)') : T(l, 'non', 'no')],
      ],
      note: v.p ? T(l, 'Hypothèse : infraction commise il y a un mois.', 'Assumption: offence committed a month ago.') : undefined,
    };
  },
});
