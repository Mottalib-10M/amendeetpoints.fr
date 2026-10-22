/** Une infraction du catalogue (hors vitesse) : amende et points. Preset « infraction_N » : N-ième ligne. */
import { T, eur, type L } from './_kit';
import { infraction } from '../engine/sanctions';
import { P } from '../engine/params';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'Amende et points d’une infraction', 'Fine and points for an offence'),
  cta: T(l, 'Barème complet', 'Full table'),
  inputs: [{ id: 'i', label: T(l, 'Infraction', 'Offence'), def: 0, options: P.infractions.map((x, i) => ({ value: String(i), label: x[l] })) }],
  run: (v) => {
    const x = infraction(P.infractions[v.i].id);
    const d = x as unknown as { prison_ans?: number; amende_max?: number };
    return x.amendes
      ? { head: [T(l, 'Amende forfaitaire', 'Standard fine'), eur(x.amendes.forfaitaire, l)], rows: [[T(l, 'Minorée / majorée', 'Reduced / increased'), `${x.amendes.minoree == null ? '—' : eur(x.amendes.minoree, l)} / ${eur(x.amendes.majoree, l)}`], [T(l, 'Points', 'Points'), String(x.points)], [T(l, 'Classe', 'Class'), String(x.classe)]] }
      : { head: [T(l, 'Délit : jusqu’à', 'Offence: up to'), eur(d.amende_max!, l)], rows: [[T(l, 'Prison encourue', 'Prison risked'), T(l, `${d.prison_ans} ans`, `${d.prison_ans} years`)], [T(l, 'Points', 'Points'), String(x.points)]] };
  },
});
