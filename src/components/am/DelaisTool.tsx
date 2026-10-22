/**
 * Avis reçu : quel montant payer aujourd'hui, jusqu'à quand, et comment contester. Classe de la
 * contravention, jours écoulés depuis l'envoi de l'avis, paiement en ligne ou non (CPP art. 529-1,
 * 529-2, 529-7, 529-8, 530 ; délais de la fiche Service Public F18509). Le jour est lu après hydratation.
 */
import { useEffect, useState } from 'react';
import SelectField from '../ui/SelectField';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { Shell, Head, Rows, Note, MethodLink, Row2, eur, type L } from '../calc/kit';
import { amendesClasse, echeances, type Classe } from '../../lib/engine/sanctions';
import { addDays, daysBetween } from '../../lib/engine/dates';
import { P } from '../../lib/engine/params';
import { displayDate } from '../../lib/format';
import { parisNow } from '../../lib/today';
import { readParams, updateURL } from '../../lib/url-state';

const T = <A,>(l: L, fr: A, en: A) => (l === 'en' ? en : fr);
const CLASSES = ['4', '3', '2', '1', 's4', 's2'];

export default function DelaisTool({ lang: l, id = 'delais', today, defaultClasse = '4', defaultJours = 10, methodHref }: { lang: L; id?: string; today: string; defaultClasse?: string; defaultJours?: number; methodHref?: string }) {
  const [jour, setJour] = useState(today);
  const [cl, setCl] = useState(defaultClasse);
  const [jours, setJours] = useState(defaultJours);
  const [web, setWeb] = useState(true);
  useEffect(() => {
    setJour(parisNow().date);
    const u = readParams(window.location.search);
    if (u.get('c') && CLASSES.includes(u.get('c')!)) setCl(u.get('c')!);
    if (u.has('j')) setJours(Number(u.get('j')) || 0);
  }, []);
  useEffect(() => { updateURL({ c: cl, j: jours, w: web ? undefined : 0 }); }, [cl, jours, web]);
  const stat = cl.startsWith('s');
  const a = amendesClasse(Number(cl.replace('s', '')) as Classe, stat);
  const envoi = addDays(jour, -Math.max(0, jours));
  const e = echeances(envoi, web);
  const d = (s: string) => displayDate(s, l === 'en' ? 'en-GB' : 'fr-FR');
  const phase = a.minoree != null && jour <= e.minoree ? 'minoree' : jour <= e.forfaitaire ? 'forfaitaire' : 'majoree';
  const montant = phase === 'minoree' ? a.minoree! : phase === 'forfaitaire' ? a.forfaitaire : a.majoree;
  const limite = phase === 'minoree' ? e.minoree : phase === 'forfaitaire' ? e.forfaitaire : null;
  const reste = limite ? daysBetween(jour, limite) : 0;
  const lab = (c: string) => c.startsWith('s')
    ? T(l, `Stationnement, ${c.slice(1)}e classe (${eur(amendesClasse(Number(c.slice(1)) as Classe).forfaitaire, l)})`, `Parking, class ${c.slice(1)} (${eur(amendesClasse(Number(c.slice(1)) as Classe).forfaitaire, l)})`)
    : T(l, `${c}e classe (${eur(amendesClasse(Number(c) as Classe).forfaitaire, l)})`, `Class ${c} (${eur(amendesClasse(Number(c) as Classe).forfaitaire, l)})`);

  const form = (
    <>
      <Row2>
        <SelectField id={`${id}-c`} label={T(l, 'Classe sur l’avis', 'Class on the notice')} value={cl} onChange={setCl} options={CLASSES.map((c) => ({ value: c, label: lab(c) }))} />
        <NumberField id={`${id}-j`} label={T(l, 'Avis envoyé il y a', 'Notice sent')} value={jours} onChange={setJours} unit={T(l, 'jours', 'days ago')} max={400} />
      </Row2>
      <Toggle id={`${id}-w`} label={T(l, 'Paiement', 'Payment')} value={web ? '1' : '0'} onChange={(x) => setWeb(x === '1')} options={[{ value: '1', label: T(l, 'En ligne, appli', 'Online, app') }, { value: '0', label: T(l, 'Hors ligne', 'Offline') }]} />
      <Note>{T(l, `La date d’envoi est imprimée sur l’avis. Avis envoyé le ${d(envoi)}.`, `The sending date is printed on the notice. Notice sent on ${d(envoi)}.`)}</Note>
    </>
  );
  const result = (
    <>
      <Head label={phase === 'minoree' ? T(l, 'À payer aujourd’hui : amende minorée', 'Due today: reduced fine') : phase === 'forfaitaire' ? T(l, 'À payer aujourd’hui : amende forfaitaire', 'Due today: standard fine') : T(l, 'Amende majorée (avis à attendre)', 'Increased fine (wait for the notice)')}
        value={eur(montant, l)} sub={limite ? T(l, `jusqu’au ${d(limite)} inclus, encore ${reste} jours`, `until ${d(limite)} inclusive, ${reste} days left`) : T(l, 'Le Trésor public envoie l’avis d’amende forfaitaire majorée', 'The Treasury sends the increased-fine notice')} />
      <Rows rows={[
        ...(a.minoree != null ? [[T(l, 'Minorée jusqu’au', 'Reduced until'), `${d(e.minoree)} · ${eur(a.minoree, l)}`] as [string, string]] : [[T(l, 'Minorée', 'Reduced'), T(l, 'non prévue', 'none')] as [string, string]]),
        [T(l, 'Forfaitaire jusqu’au', 'Standard until'), `${d(e.forfaitaire)} · ${eur(a.forfaitaire, l)}`],
        [T(l, 'Contester jusqu’au', 'Contest until'), d(e.contestation)],
        [T(l, 'Consignation pour contester', 'Deposit to contest'), eur(phase === 'majoree' ? a.majoree : a.forfaitaire, l), true],
        [T(l, 'Ensuite : majorée', 'After that: increased'), eur(a.majoree, l)],
        [T(l, `Majorée payée sous ${web ? P.delais.majoree_reduction_telepaiement_jours : P.delais.majoree_reduction_jours} j. après son avis`, `Increased, paid within ${web ? P.delais.majoree_reduction_telepaiement_jours : P.delais.majoree_reduction_jours} days of its notice`), eur(Math.round(a.majoree * (1 - P.delais.majoree_reduction_pct) * 100) / 100, l, Number.isInteger(a.majoree * (1 - P.delais.majoree_reduction_pct)) ? 0 : 2)],
      ]} />
      <Note>{T(l, `Le forfait post-stationnement (FPS, stationnement payant non réglé) n’est pas une amende et suit d’autres règles : il se conteste auprès de la commune.`, `An unpaid pay-and-display charge (forfait post-stationnement, FPS) is not a fine and follows other rules: it is contested with the town.`)}</Note>
      <MethodLink href={methodHref} lang={l} />
    </>
  );
  return <Shell id={id} form={form} result={result} />;
}
export { P };
