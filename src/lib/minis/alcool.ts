/** Alcool au volant : contravention ou délit selon le taux (R234-1, L234-1, loi du 18 août 2026). */
import { T, eur, yesNoOpts, type L } from './_kit';
import { P } from '../engine/params';
import { amendesClasse } from '../engine/sanctions';
import { formatNumber } from '../format';
import type { MiniSpec } from '../mini-types';
export default (l: L): MiniSpec => ({
  title: T(l, 'Mon taux d’alcool : quelle sanction ?', 'My alcohol level: what penalty?'),
  cta: T(l, 'Barème complet des infractions', 'Full table of offences'),
  inputs: [
    { id: 't', label: T(l, 'Taux dans le sang', 'Blood alcohol'), def: 0.6, max: 5, unit: 'g/l', decimals: 2 },
    { id: 'p', label: T(l, 'Permis probatoire', 'Probationary licence'), def: 0, options: yesNoOpts(l) },
  ],
  run: (v) => {
    const A = P.alcool;
    const seuil = v.p ? A.seuil_probatoire_g_sang : A.seuil_general_g_sang;
    const c = amendesClasse(4);
    if (v.t >= A.seuil_delit_g_sang) return { head: [T(l, 'Délit : amende jusqu’à', 'Criminal offence: fine up to'), eur(A.delit_amende_max, l)], rows: [[T(l, 'Prison encourue', 'Prison risked'), T(l, `${A.delit_prison_ans} ans`, `${A.delit_prison_ans} years`)], [T(l, 'Points', 'Points'), String(P.permis.delit_retrait)], [T(l, 'Air expiré équivalent', 'Breath equivalent'), `${formatNumber(v.t / 2, 2, l)} mg/l`]] };
    if (v.t >= seuil) return { head: [T(l, 'Amende forfaitaire, 4e classe', 'Standard fine, class 4'), eur(c.forfaitaire, l)], rows: [[T(l, 'Points', 'Points'), String(A.contravention_points)], [T(l, 'Suspension encourue', 'Suspension risked'), T(l, `jusqu’à ${A.contravention_suspension_ans} ans`, `up to ${A.contravention_suspension_ans} years`)], [T(l, 'Seuil du délit', 'Offence threshold'), `${formatNumber(A.seuil_delit_g_sang, 1, l)} g/l`]] };
    return { head: [T(l, 'Sous le seuil', 'Below the limit'), eur(0, l)], rows: [[T(l, 'Seuil pour vous', 'Your limit'), `${formatNumber(seuil, 1, l)} g/l`], [T(l, 'Air expiré', 'Breath'), `${formatNumber(v.p ? A.seuil_probatoire_mg_air : A.seuil_general_mg_air, 2, l)} mg/l`], [T(l, 'Points', 'Points'), '0']] };
  },
});
