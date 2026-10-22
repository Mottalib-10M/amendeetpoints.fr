/** Grand excès (50 km/h et plus) : délit depuis le 29 décembre 2025, amende forfaitaire délictuelle (L413-1). */
import { T, eur, type L } from './_kit';
import { LIMITES, limOpts, kmh } from './_am';
import { mesureePourRetenue } from '../engine/sanctions';
import { P } from '../engine/params';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'Grand excès de vitesse : le délit', 'Speeding 50 km/h over: the offence'),
  cta: T(l, 'Toutes les tranches', 'Every band'),
  inputs: [{ id: 'l', label: T(l, 'Limite', 'Limit'), def: 3, options: limOpts(l) }, { id: 'a', label: T(l, 'Radar', 'Camera'), def: 0, options: [{ value: '0', label: T(l, 'Fixe', 'Fixed') }, { value: '1', label: T(l, 'Mobile', 'In-car') }] }],
  run: (v) => {
    const d = P.vitesse.delit, lim = LIMITES[v.l];
    return {
      head: [T(l, 'Délit dès la vitesse mesurée de', 'Offence from a measured speed of'), kmh(mesureePourRetenue(lim + P.vitesse.delit_a_partir_de, v.a ? 'embarque' : 'fixe'), l)],
      rows: [
        [T(l, 'Amende forfaitaire délictuelle', 'Fixed criminal fine'), `${eur(d.afd.minoree, l)} / ${eur(d.afd.forfaitaire, l)} / ${eur(d.afd.majoree, l)}`],
        [T(l, 'Au tribunal : jusqu’à', 'In court: up to'), T(l, `${eur(d.amende_max, l)}, ${d.prison_mois} mois`, `${eur(d.amende_max, l)}, ${d.prison_mois} months`)],
        [T(l, 'Points', 'Points'), String(d.points)],
      ],
    };
  },
});
