/**
 * Barème d'une infraction (hors vitesse) : amende minorée, forfaitaire et majorée, points, suspension,
 * et ce qui reste sur un permis de 12 points ou un permis probatoire. Catalogue : params-2026.json
 * (« infractions »), chaque ligne avec son article ou sa fiche Service Public.
 */
import { useEffect, useState } from 'react';
import SelectField from '../ui/SelectField';
import NumberField from '../ui/NumberField';
import { Shell, Head, Rows, Note, MethodLink, Row2, eur, type L } from '../calc/kit';
import { infraction, cumulSimultane } from '../../lib/engine/sanctions';
import { P } from '../../lib/engine/params';
import { readParams, updateURL } from '../../lib/url-state';

const T = <A,>(l: L, fr: A, en: A) => (l === 'en' ? en : fr);
const ALL = P.infractions.map((i) => i.id);

export default function InfractionTool({ lang: l, id = 'inf', ids = ALL, defaultId, methodHref }: { lang: L; id?: string; ids?: string[]; defaultId?: string; methodHref?: string }) {
  const liste = ids.filter((x) => ALL.includes(x));
  const [sel, setSel] = useState(defaultId && liste.includes(defaultId) ? defaultId : liste[0]);
  const [solde, setSolde] = useState(12);
  useEffect(() => { const u = readParams(window.location.search).get('i'); if (u && liste.includes(u)) setSel(u); }, []);
  useEffect(() => { updateURL({ i: sel }); }, [sel]);
  const x = infraction(sel);
  const reste = Math.max(0, solde - x.points);
  const susp = (x as { suspension_ans?: number }).suspension_ans ?? 0;
  const delit = x.delit ? (x as unknown as { prison_ans: number; amende_max: number }) : null;

  const form = (
    <>
      <SelectField id={`${id}-sel`} label={T(l, 'Infraction', 'Offence')} value={sel} onChange={setSel} options={liste.map((i) => ({ value: i, label: P.infractions.find((y) => y.id === i)![l] }))} />
      <Row2>
        <NumberField id={`${id}-solde`} label={T(l, 'Points sur le permis', 'Points on the licence')} value={solde} onChange={setSolde} max={12} />
        <p className="self-end pb-3 text-sm text-navy-600">{T(l, `Permis probatoire : ${P.permis.probatoire_initial} points au départ.`, `Probationary licence: ${P.permis.probatoire_initial} points at the start.`)}</p>
      </Row2>
      {(x as { stationnement?: boolean }).stationnement && <Note>{T(l, 'Stationnement : pas d’amende minorée (Code de procédure pénale, art. 529-7).', 'Parking: no reduced fine (Code of Criminal Procedure, art. 529-7).')}</Note>}
    </>
  );
  const rows: Array<[string, string] | [string, string, boolean]> = [];
  if (x.amendes) {
    rows.push([T(l, 'Minorée (15 jours, 30 en ligne)', 'Reduced (15 days, 30 online)'), x.amendes.minoree == null ? T(l, 'non prévue', 'none') : eur(x.amendes.minoree, l)]);
    rows.push([T(l, 'Majorée (après 45 jours)', 'Increased (after 45 days)'), eur(x.amendes.majoree, l)]);
  } else if (delit) {
    rows.push([T(l, 'Prison encourue', 'Prison risked'), T(l, `${delit.prison_ans} ans`, `${delit.prison_ans} years`)]);
  }
  rows.push([T(l, 'Points retirés', 'Points deducted'), String(x.points), true]);
  if (x.points) rows.push([T(l, 'Points restants', 'Points left'), reste === 0 ? T(l, '0 : permis invalidé', '0: licence cancelled') : String(reste)]);
  rows.push([T(l, 'Suspension encourue', 'Suspension risked'), susp ? T(l, `jusqu’à ${susp} ans`, `up to ${susp} years`) : delit ? T(l, 'oui, par le juge', 'yes, by the court') : T(l, 'non', 'no')]);
  if (x.points >= P.permis.probatoire_stage_obligatoire_si_retrait) rows.push([T(l, 'En permis probatoire', 'On a probationary licence'), T(l, 'stage obligatoire', 'course compulsory')]);
  const result = (
    <>
      {x.amendes
        ? <Head label={T(l, `Amende forfaitaire · ${x.classe}e classe`, `Standard fine · class ${x.classe}`)} value={eur(x.amendes.forfaitaire, l)} sub={x[l]} />
        : <Head label={T(l, 'Délit : amende jusqu’à', 'Criminal offence: fine up to')} value={eur(delit!.amende_max, l)} sub={x[l]} />}
      <Rows rows={rows} />
      <MethodLink href={methodHref} lang={l} />
    </>
  );
  return <Shell id={id} form={form} result={result} />;
}
export { cumulSimultane };
