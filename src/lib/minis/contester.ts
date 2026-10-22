/** Contester un avis : délai restant et consignation à verser (CPP art. 529-2, 530). */
import { T, eur, type L } from './_kit';
import { amendesClasse, type Classe } from '../engine/sanctions';
import { P } from '../engine/params';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'Puis-je encore contester ?', 'Can I still contest?'),
  cta: T(l, 'Toutes les échéances de mon avis', 'Every deadline on my notice'),
  inputs: [
    { id: 'j', label: T(l, 'Avis reçu il y a', 'Notice received'), def: 30, max: 400, unit: T(l, 'jours', 'days ago') },
    { id: 'c', label: T(l, 'Classe', 'Class'), def: 0, options: [4, 3, 2].map((c, i) => ({ value: String(i), label: T(l, `${c}e classe`, `Class ${c}`) })) },
    { id: 'm', label: T(l, 'Avis', 'Notice'), def: 0, options: [{ value: '0', label: T(l, 'Avis de contravention', 'Offence notice') }, { value: '1', label: T(l, 'Amende majorée', 'Increased-fine notice') }] },
  ],
  run: (v) => {
    const a = amendesClasse(([4, 3, 2][v.c]) as Classe);
    const max = v.m ? P.delais.contestation_majoree_jours : P.delais.contestation_forfaitaire_jours;
    const reste = max - v.j;
    return {
      head: [T(l, 'Jours restants pour contester', 'Days left to contest'), reste >= 0 ? String(reste) : T(l, 'délai dépassé', 'too late')],
      rows: [
        [T(l, 'Délai total', 'Total time'), T(l, `${max} jours`, `${max} days`)],
        [T(l, 'Consignation à verser', 'Deposit to pay'), eur(v.m ? a.majoree : a.forfaitaire, l)],
        [T(l, 'Désignation du conducteur', 'Naming the driver'), T(l, 'sans consignation', 'no deposit')],
      ],
    };
  },
});
