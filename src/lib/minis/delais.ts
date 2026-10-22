/** Avis de contravention : montant à payer selon les jours écoulés (minorée, forfaitaire, majorée). */
import { T, eur, type L } from './_kit';
import { amendesClasse, type Classe } from '../engine/sanctions';
import { P } from '../engine/params';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'Combien payer aujourd’hui ?', 'How much do I pay today?'),
  cta: T(l, 'Dates exactes et contestation', 'Exact dates and contesting'),
  inputs: [
    { id: 'j', label: T(l, 'Avis envoyé il y a', 'Notice sent'), def: 20, max: 400, unit: T(l, 'jours', 'days ago') },
    { id: 'c', label: T(l, 'Classe', 'Class'), def: 0, options: [4, 3, 2].map((c, i) => ({ value: String(i), label: T(l, `${c}e classe`, `Class ${c}`) })) },
    { id: 'w', label: T(l, 'Paiement en ligne', 'Paying online'), def: 1, options: [{ value: '0', label: T(l, 'Non', 'No') }, { value: '1', label: T(l, 'Oui', 'Yes') }] },
  ],
  run: (v) => {
    const a = amendesClasse(([4, 3, 2][v.c]) as Classe);
    const D = P.delais;
    const lm = v.w ? D.minoree_telepaiement_jours : D.minoree_jours, lf = v.w ? D.forfaitaire_telepaiement_jours : D.forfaitaire_jours;
    const m = v.j <= lm ? a.minoree! : v.j <= lf ? a.forfaitaire : a.majoree;
    return {
      head: [v.j <= lm ? T(l, 'Amende minorée', 'Reduced fine') : v.j <= lf ? T(l, 'Amende forfaitaire', 'Standard fine') : T(l, 'Amende majorée', 'Increased fine'), eur(m, l)],
      rows: [
        [T(l, 'Minorée jusqu’au jour', 'Reduced until day'), String(lm)],
        [T(l, 'Forfaitaire jusqu’au jour', 'Standard until day'), String(lf)],
        [T(l, 'Économie si payé à temps', 'Saving if paid in time'), eur(a.majoree - a.minoree!, l)],
      ],
    };
  },
});
