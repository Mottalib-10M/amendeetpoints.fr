/** Outils propres aux mini-simulateurs du site (préfixe « _ » : ignoré par le registre). */
import { T, eur, type L } from './_kit';
import { formatNumber } from '../format';
import type { SanctionVitesse } from '../engine/sanctions';
export const LIMITES = [30, 50, 70, 80, 90, 110, 130];
export const limOpts = (l: L) => LIMITES.map((x, i) => ({ value: String(i), label: `${x} km/h` }));
export const kmh = (n: number, l: L) => `${formatNumber(n, 0, l)} km/h`;
export const appOpts = (l: L) => [{ value: '0', label: T(l, 'Radar fixe', 'Fixed camera') }, { value: '1', label: T(l, 'Radar embarqué', 'In-car camera') }];
/** Montant principal d'une sanction de vitesse, pour l'en-tête d'un mini. */
export const montant = (s: SanctionVitesse, l: L) => (!s.infraction ? eur(0, l) : s.delit ? T(l, `délit, ${eur(s.afd!.forfaitaire, l)}`, `offence, ${eur(s.afd!.forfaitaire, l)}`) : eur(s.amendes!.forfaitaire, l));
export const pts = (n: number, l: L) => (n === 0 ? T(l, 'aucun', 'none') : n === 1 ? T(l, '1 point', '1 point') : T(l, `${n} points`, `${n} points`));
