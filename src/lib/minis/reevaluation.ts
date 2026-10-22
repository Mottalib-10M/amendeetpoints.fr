/** Amende majorée sans avoir reçu l'avis (radar automatique) : réévaluation encore possible ? (F18510) */
import { T, eur, num, type L } from './_kit';
import { amendesClasse, reevaluation, type Classe } from '../engine/sanctions';
import { addDays, daysBetween } from '../engine/dates';
import { P } from '../engine/params';
import type { MiniSpec } from '../mini-types';
const REF = '2026-01-01';
export default (l: L): MiniSpec => ({
  title: T(l, 'Puis-je revenir au montant initial ?', 'Can I go back to the original amount?'),
  cta: T(l, 'Toutes les échéances de mon avis', 'Every deadline on my notice'),
  inputs: [
    { id: 'j', label: T(l, 'Avis majoré envoyé il y a', 'Increased notice sent'), def: 20, max: 400, unit: T(l, 'jours', 'days ago') },
    { id: 'c', label: T(l, 'Classe', 'Class'), def: 0, options: [4, 3, 2].map((c, i) => ({ value: String(i), label: T(l, `${c}e classe`, `Class ${c}`) })) },
  ],
  run: (v) => {
    const a = amendesClasse(([4, 3, 2][v.c]) as Classe);
    const r = reevaluation(REF, null);
    const reste = daysBetween(addDays(REF, v.j), r.justifierAvant);
    return {
      head: [T(l, 'Jours restants pour justifier l’adresse', 'Days left to prove the address'), reste >= 0 ? num(reste, l) : T(l, 'délai dépassé', 'too late')],
      rows: [
        [T(l, 'Montant après réévaluation', 'Amount after review'), eur(a.forfaitaire, l)],
        [T(l, 'Au lieu de', 'Instead of'), eur(a.majoree, l)],
        [T(l, 'Pour payer ensuite', 'Then to pay'), T(l, `${num(P.delais.reevaluation_paiement_jours, l)} jours`, `${num(P.delais.reevaluation_paiement_jours, l)} days`)],
      ],
      note: T(l, 'Délai de 3 mois compté sur un envoi du 1er janvier ; lisez la date de votre avis.', '3-month window counted from a 1 January posting; check the date on your notice.'),
    };
  },
});
