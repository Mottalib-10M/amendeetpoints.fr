/** Plusieurs infractions constatées en même temps : 8 points au plus (L223-2). */
import { T, type L } from './_kit';
import { cumulSimultane } from '../engine/sanctions';
import { P } from '../engine/params';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'Plusieurs infractions au même contrôle', 'Several offences at one stop'),
  cta: T(l, 'Le barème de chaque infraction', 'Each offence’s penalty'),
  inputs: [
    { id: 'a', label: T(l, 'Points, 1re infraction', 'Points, 1st offence'), def: 3, max: 6 },
    { id: 'b', label: T(l, 'Points, 2e infraction', 'Points, 2nd offence'), def: 4, max: 6 },
    { id: 'c', label: T(l, 'Points, 3e infraction', 'Points, 3rd offence'), def: 3, max: 6 },
  ],
  run: (v) => {
    const somme = v.a + v.b + v.c, r = cumulSimultane([v.a, v.b, v.c]);
    return {
      head: [T(l, 'Points retirés', 'Points deducted'), String(r)],
      rows: [[T(l, 'Somme des barèmes', 'Sum of the scales'), String(somme)], [T(l, 'Plafond', 'Cap'), String(P.permis.plafond_simultane)], [T(l, 'Points restants sur 12', 'Points left out of 12'), String(Math.max(0, 12 - r))]],
      note: T(l, 'Les amendes, elles, s’additionnent toutes.', 'The fines, however, all add up.'),
    };
  },
});
