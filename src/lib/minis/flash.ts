/** Après un flash : l'avis devrait-il déjà être arrivé, et quand la contravention est-elle prescrite (F364). */
import { T, num, type L } from './_kit';
import { apresFlash, etatAttente } from '../engine/sanctions';
import { addDays, daysBetween } from '../engine/dates';
import type { MiniSpec } from '../mini-types';
/** Jour de référence fictif : seuls les écarts en jours comptent. */
const REF = '2026-01-01';
export default (l: L): MiniSpec => ({
  title: T(l, 'Flashé il y a combien de jours ?', 'Flashed how many days ago?'),
  cta: T(l, 'Payer ou contester un avis reçu', 'Pay or contest a notice'),
  inputs: [
    { id: 'j', label: T(l, 'Flash il y a', 'Flash'), def: 20, max: 800, unit: T(l, 'jours', 'days ago') },
  ],
  run: (v) => {
    const f = apresFlash(REF);
    const auj = addDays(REF, v.j);
    const e = etatAttente(REF, auj);
    const etat = {
      tot: T(l, 'Trop tôt pour s’inquiéter', 'Too early to worry'),
      normal: T(l, 'Dans le délai habituel', 'Within the usual time'),
      retard: T(l, 'Avis en retard', 'Notice overdue'),
      prescrit: T(l, 'Plus de poursuite possible', 'No longer prosecutable'),
    }[e];
    const reste = daysBetween(auj, f.prescription);
    return {
      head: [T(l, 'Où en êtes-vous', 'Where you stand'), etat],
      rows: [
        [T(l, 'Avis attendu entre', 'Notice expected between'), T(l, `le jour ${num(daysBetween(REF, f.avisDes), l)} et 1 mois`, `day ${num(daysBetween(REF, f.avisDes), l)} and 1 month`)],
        [T(l, 'Jours avant la prescription', 'Days until time-barred'), reste > 0 ? num(reste, l) : T(l, 'atteinte', 'reached')],
        [T(l, 'À faire', 'What to do'), e === 'retard' ? T(l, 'vérifier l’adresse de la carte grise', 'check the address on the V5') : e === 'prescrit' ? T(l, 'rien, pour une contravention', 'nothing, for a minor offence') : T(l, 'attendre le courrier', 'wait for the letter')],
      ],
      note: T(l, 'Contravention : prescription d’un an jour pour jour après le flash.', 'Minor offence: time-barred one year to the day after the flash.'),
    };
  },
});
