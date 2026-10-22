/**
 * Solde de points et date de restitution (L223-6) pour un permis de 12 points : jusqu'à trois
 * infractions, chacune avec son type (qui donne les points et la gravité) et son ancienneté en mois.
 * Mode `probatoire` : capital d'un permis probatoire selon L223-1 (majorations perdues après une
 * infraction). La date du jour n'est lue qu'après hydratation (premier rendu = jour du build).
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { Shell, Head, Rows, Note, MethodLink, Row2, type L } from '../calc/kit';
import { soldePoints, apresStage, probatoire, type Retrait } from '../../lib/engine/sanctions';
import { addMonths } from '../../lib/engine/dates';
import { P } from '../../lib/engine/params';
import { displayDate } from '../../lib/format';
import { parisNow } from '../../lib/today';
import { readParams, updateURL } from '../../lib/url-state';

const T = <A,>(l: L, fr: A, en: A) => (l === 'en' ? en : fr);
/** Types proposés : points et gravité (« lourde » = 4e ou 5e classe, ou délit : retour en 3 ans). */
export const TYPES: Array<{ id: string; points: number; lourde: boolean; fr: string; en: string }> = [
  { id: '0', points: 0, lourde: false, fr: '—', en: '—' },
  { id: 'v1h', points: 1, lourde: false, fr: 'Excès < 20 km/h, route > 50 (1 pt)', en: 'Under 20 km/h over, limit > 50 (1 pt)' },
  { id: 'v1b', points: 1, lourde: true, fr: 'Excès < 20 km/h, limite ≤ 50 (1 pt)', en: 'Under 20 km/h over, limit ≤ 50 (1 pt)' },
  { id: 'v2', points: 2, lourde: true, fr: 'Excès de 20 à 29 km/h (2 pts)', en: '20–29 km/h over (2 pts)' },
  { id: 'v3', points: 3, lourde: true, fr: 'Excès de 30 à 39 km/h (3 pts)', en: '30–39 km/h over (3 pts)' },
  { id: 'v4', points: 4, lourde: true, fr: 'Excès de 40 à 49 km/h (4 pts)', en: '40–49 km/h over (4 pts)' },
  { id: 'tel', points: 3, lourde: true, fr: 'Téléphone, ceinture, ligne continue (3 pts)', en: 'Phone, seat belt, solid line (3 pts)' },
  { id: 'feu', points: 4, lourde: true, fr: 'Feu rouge, stop, priorité (4 pts)', en: 'Red light, stop, give way (4 pts)' },
  { id: 'six', points: 6, lourde: true, fr: 'Alcool, piéton, grand excès (6 pts)', en: 'Alcohol, pedestrian, 50+ km/h over (6 pts)' },
];
const type = (id: string) => TYPES.find((t) => t.id === id) ?? TYPES[0];

export default function PointsTool({ lang: l, id = 'pts', mode = 'solde', today, methodHref, defaults = [['v1h', 4], ['0', 12], ['0', 24]] }: { lang: L; id?: string; mode?: 'solde' | 'probatoire'; today: string; methodHref?: string; defaults?: Array<[string, number]> }) {
  const [jour, setJour] = useState(today);
  const [lignes, setLignes] = useState(defaults);
  const [stage, setStage] = useState(false);
  const [moisPermis, setMoisPermis] = useState(14);
  const [aac, setAac] = useState(false);
  useEffect(() => {
    setJour(parisNow().date);
    const u = readParams(window.location.search);
    const L = [0, 1, 2].map((i) => [u.get(`t${i}`), Number(u.get(`m${i}`))] as [string | null, number]);
    if (L.some(([t]) => t)) setLignes(L.map(([t, m], i) => [t && TYPES.some((x) => x.id === t) ? t : defaults[i]?.[0] ?? '0', Number.isFinite(m) ? m : 0]));
    if (u.has('p')) setMoisPermis(Number(u.get('p')) || 0);
  }, []);
  useEffect(() => { updateURL({ ...Object.fromEntries(lignes.flatMap(([t, m], i) => (t !== '0' ? [[`t${i}`, t], [`m${i}`, m]] : []))), p: mode === 'probatoire' ? moisPermis : undefined }); }, [lignes, moisPermis, mode]);
  const set = (i: number, k: 0 | 1) => (v: string | number) => setLignes((o) => o.map((x, j) => (j === i ? (k === 0 ? [String(v), x[1]] : [x[0], Number(v)]) : x)) as Array<[string, number]>);
  const d = (iso: string) => displayDate(iso, l === 'en' ? 'en-GB' : 'fr-FR');

  const retraits: Retrait[] = useMemo(() => lignes.filter(([t]) => type(t).points > 0).map(([t, m]) => ({ date: addMonths(jour, -Math.max(0, m)), points: type(t).points, gravite: type(t).lourde ? 'lourde' : 'legere' })), [lignes, jour]);
  const r = soldePoints(retraits, jour);
  const st = apresStage(r.solde, P.permis.points_max, stage ? addMonths(jour, -6) : null, jour);
  const prochain = r.evenements.find((e) => e.date > jour && e.type !== 'retrait');
  const pb = probatoire(moisPermis, aac, lignes.filter(([t]) => type(t).points > 0).map(([t, m]) => ({ mois: Math.max(0, moisPermis - m), points: type(t).points })));

  const lignesForm = lignes.map(([t, m], i) => (
    <Row2 key={i}>
      <SelectField id={`${id}-t${i}`} label={T(l, `Infraction ${i + 1}`, `Offence ${i + 1}`)} value={t} onChange={set(i, 0)} options={TYPES.map((x) => ({ value: x.id, label: x[l] }))} />
      <NumberField id={`${id}-m${i}`} label={T(l, 'Payée il y a', 'Paid')} value={m} onChange={set(i, 1)} unit={T(l, 'mois', 'mo. ago')} max={240} />
    </Row2>
  ));
  const form = mode === 'probatoire' ? (
    <>
      <Row2>
        <NumberField id={`${id}-p`} label={T(l, 'Permis obtenu il y a', 'Licence obtained')} value={moisPermis} onChange={setMoisPermis} unit={T(l, 'mois', 'mo. ago')} max={60} />
        <Toggle id={`${id}-aac`} label={T(l, 'Conduite accompagnée', 'Accompanied driving')} value={aac ? '1' : '0'} onChange={(x) => setAac(x === '1')} options={[{ value: '0', label: T(l, 'Non', 'No') }, { value: '1', label: T(l, 'Oui', 'Yes') }]} />
      </Row2>
      {lignesForm.slice(0, 2)}
    </>
  ) : (
    <>
      {lignesForm}
      <Toggle id={`${id}-stage`} label={T(l, 'Stage suivi il y a moins d’un an', 'Course taken in the last year')} value={stage ? '1' : '0'} onChange={(x) => setStage(x === '1')} options={[{ value: '0', label: T(l, 'Non', 'No') }, { value: '1', label: T(l, 'Oui', 'Yes') }]} />
      <Note>{T(l, 'Comptez à partir du paiement de l’amende ou de la condamnation : c’est la date où le retrait devient définitif.', 'Count from when the fine was paid or the conviction became final: that is when the points are actually taken.')}</Note>
    </>
  );

  const result = mode === 'probatoire' ? (
    <>
      <Head label={T(l, 'Capital estimé aujourd’hui', 'Estimated points today')} value={`${pb.capital} / ${P.permis.points_max}`} sub={pb.enCours ? T(l, `Période probatoire : encore ${pb.moisRestants} mois`, `Probation: ${pb.moisRestants} more months`) : T(l, 'Période probatoire terminée', 'Probation over')} />
      <Rows rows={[
        [T(l, 'Majorations acquises', 'Annual increases earned'), `${pb.acquis} × ${pb.gain}`],
        [T(l, 'Points retirés', 'Points deducted'), String(pb.perdus)],
        [T(l, 'Fin de période sans infraction', 'End of probation, no offence'), pb.capitalFinSansInfraction ? T(l, '12 points', '12 points') : T(l, 'majorations perdues', 'increases lost')],
        [T(l, 'Stage obligatoire (retrait ≥ 3 pts)', 'Compulsory course (3+ pts lost)'), pb.stageObligatoire ? T(l, 'oui', 'yes') : T(l, 'non', 'no')],
      ]} />
      <MethodLink href={methodHref} lang={l} />
    </>
  ) : (
    <>
      <Head label={T(l, 'Solde estimé aujourd’hui', 'Estimated balance today')} value={r.invalide ? T(l, '0 : invalidé', '0: cancelled') : `${r.solde} / ${P.permis.points_max}`} sub={r.retourTotal ? T(l, `12 points le ${d(r.retourTotal)} sans nouvelle infraction`, `12 points on ${d(r.retourTotal)} with no new offence`) : T(l, 'Aucun point en attente de retour', 'No points waiting to come back')} />
      <Rows rows={[
        [T(l, 'Prochain retour', 'Next return'), prochain ? `${d(prochain.date)} (${prochain.type === 'un_point' ? T(l, '+1 point', '+1 point') : T(l, '12 points', '12 points')})` : '—'],
        [T(l, 'Avec un stage maintenant', 'With a course now'), st.possible ? T(l, `${st.apres} points (+${st.gagnes})`, `${st.apres} points (+${st.gagnes})`) : T(l, `pas avant le ${d(st.prochainPossible)}`, `not before ${d(st.prochainPossible)}`)],
        [T(l, 'Points retirés au total', 'Points deducted in total'), String(retraits.reduce((a, x) => a + x.points, 0))],
      ]} />
      <Note>{T(l, 'Estimation : seul le relevé intégral (Mes points permis) fait foi.', 'Estimate: only your official record (Mes points permis) is binding.')}</Note>
      <MethodLink href={methodHref} lang={l} />
    </>
  );
  return <Shell id={id} form={form} result={result} />;
}
