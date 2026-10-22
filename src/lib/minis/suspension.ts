/** Suspension et rétention du permis selon l'excès retenu (R413-14, L224-2, L413-1). */
import { T, type L } from './_kit';
import { LIMITES, limOpts, kmh } from './_am';
import { sanctionRetenue } from '../engine/sanctions';
import { P } from '../engine/params';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'Mon excès entraîne-t-il une suspension ?', 'Does my speeding mean a suspension?'),
  cta: T(l, 'Amende et points pour cet excès', 'Fine and points for this speed'),
  inputs: [
    { id: 'e', label: T(l, 'Excès retenu', 'Recorded excess'), def: 42, max: 200, unit: 'km/h' },
    { id: 'l', label: T(l, 'Limite', 'Limit'), def: 3, options: limOpts(l) },
  ],
  run: (v) => {
    const s = sanctionRetenue(LIMITES[v.l] + v.e, LIMITES[v.l]);
    return {
      head: [T(l, 'Suspension par le juge', 'Court suspension'), s.suspensionAns ? T(l, `jusqu’à ${s.suspensionAns} ans`, `up to ${s.suspensionAns} years`) : T(l, 'non prévue', 'not provided')],
      rows: [
        [T(l, 'Rétention sur place si interception', 'Licence seized if stopped'), s.retention ? T(l, `oui, 72 h puis ${P.vitesse.suspension_prefet_max_mois} mois max. (préfet)`, `yes, 72 h then up to ${P.vitesse.suspension_prefet_max_mois} months (prefect)`) : T(l, 'non', 'no')],
        [T(l, 'Vitesse retenue', 'Recorded speed'), kmh(s.retenue, l)],
        [T(l, 'Délit', 'Criminal offence'), s.delit ? T(l, 'oui', 'yes') : T(l, 'non', 'no')],
      ],
    };
  },
});
