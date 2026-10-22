/**
 * Excès de vitesse → sanction exacte. Trois façons d'entrer la vitesse :
 *  - `vitesse` : le chiffre lu sur l'avis (mesuré, ou déjà retenu) et la limite ;
 *  - `troncon` : distance et temps entre deux points d'un radar tronçon (vitesse moyenne) ;
 *  - `route`   : la limite se déduit du type de route, de la pluie et du permis probatoire.
 * Le calcul vient de lib/engine/sanctions.ts (articles R413-14 et L413-1, arrêté du 4 juin 2009).
 * Premier rendu = valeurs par défaut de la page ; l'URL n'est lue qu'après hydratation (§17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { Shell, Head, Rows, Note, MethodLink, Row2, eur, type L } from '../calc/kit';
import { sanctionVitesse, sanctionRetenue, seuilsLimite, delaiRetour, limiteRoute, vitesseMoyenne, marge as margeDe, type Appareil, type Route } from '../../lib/engine/sanctions';
import { P } from '../../lib/engine/params';
import { formatNumber } from '../../lib/format';
import { readParams, updateURL } from '../../lib/url-state';

const T = <A,>(l: L, fr: A, en: A) => (l === 'en' ? en : fr);
export const LIMITES = [20, 30, 50, 70, 80, 90, 100, 110, 130];
const ROUTES: Route[] = ['autoroute', 'voie_separee', 'deux_voies_meme_sens', 'bidirectionnelle', 'agglomeration'];
const ROUTE_LABEL: Record<Route, { fr: string; en: string }> = {
  autoroute: { fr: 'Autoroute', en: 'Motorway' },
  voie_separee: { fr: 'Route à chaussées séparées', en: 'Dual carriageway' },
  deux_voies_meme_sens: { fr: 'Route à 2 voies dans le même sens', en: 'Road with 2 lanes each way' },
  bidirectionnelle: { fr: 'Route à double sens sans séparateur', en: 'Single carriageway road' },
  agglomeration: { fr: 'En agglomération', en: 'Built-up area' },
};
const kmh = (n: number, l: L) => `${formatNumber(n, 0, l)} km/h`;
const mois = (m: number, l: L) => (m < 12 ? T(l, `${m} mois`, `${m} months`) : T(l, `${m / 12} ans`, `${m / 12} years`));

export interface ExcesProps {
  lang: L; id?: string; mode?: 'vitesse' | 'troncon' | 'route';
  defaultVitesse?: number; defaultLimite?: number; defaultAppareil?: Appareil; defaultRetenue?: boolean;
  defaultRoute?: Route; defaultKm?: number; defaultSecondes?: number; methodHref?: string; seuils?: boolean;
}

export default function ExcesTool({ lang: l, id = 'exces', mode = 'vitesse', defaultVitesse = 97, defaultLimite = 80, defaultAppareil = 'fixe', defaultRetenue = false, defaultRoute = 'bidirectionnelle', defaultKm = 3.2, defaultSecondes = 110, methodHref, seuils = true }: ExcesProps) {
  const [v, setV] = useState(defaultVitesse);
  const [lim, setLim] = useState(defaultLimite);
  const [app, setApp] = useState<Appareil>(defaultAppareil);
  const [ret, setRet] = useState(defaultRetenue);
  const [route, setRoute] = useState<Route>(defaultRoute);
  const [pluie, setPluie] = useState(false);
  const [proba, setProba] = useState(false);
  const [km, setKm] = useState(defaultKm);
  const [mn, setMn] = useState(Math.floor(defaultSecondes / 60));
  const [sec, setSec] = useState(defaultSecondes % 60);

  useEffect(() => {
    const u = readParams(window.location.search);
    const n = (k: string) => { const x = Number(u.get(k)); return u.has(k) && Number.isFinite(x) ? x : null; };
    if (n('v') !== null) setV(n('v')!);
    if (n('l') !== null && LIMITES.includes(n('l')!)) setLim(n('l')!);
    if (u.get('a') === 'embarque' || u.get('a') === 'fixe') setApp(u.get('a') as Appareil);
    if (u.get('r') === '1') setRet(true);
    if (n('km') !== null) setKm(n('km')!);
    if (n('s') !== null) { setMn(Math.floor(n('s')! / 60)); setSec(n('s')! % 60); }
  }, []);
  const secondes = mn * 60 + sec;
  useEffect(() => { updateURL(mode === 'troncon' ? { km, s: secondes, l: lim } : { v, l: mode === 'route' ? undefined : lim, a: app, r: ret ? 1 : undefined }); }, [v, lim, app, ret, km, secondes, mode]);

  const limite = mode === 'route' ? limiteRoute(route, pluie, proba) : lim;
  const s = useMemo(() => {
    if (mode === 'troncon') { const moy = Math.floor(vitesseMoyenne(km, secondes) * 10) / 10; return sanctionVitesse(moy, limite, 'fixe'); }
    if (ret && mode === 'vitesse') return sanctionRetenue(v, limite);
    return sanctionVitesse(v, limite, app);
  }, [mode, km, secondes, limite, ret, v, app]);
  const retour = delaiRetour(s);
  const limOpts = LIMITES.map((x) => ({ value: String(x), label: kmh(x, l) }));
  const appToggle = <Toggle id={`${id}-app`} label={T(l, 'Radar', 'Camera')} value={app} onChange={(x) => setApp(x as Appareil)} options={[{ value: 'fixe', label: T(l, 'Fixe', 'Fixed') }, { value: 'embarque', label: T(l, 'Mobile', 'In-car') }]} />;

  const form = mode === 'troncon' ? (
    <>
      <Row2>
        <NumberField id={`${id}-km`} label={T(l, 'Longueur du tronçon', 'Section length')} value={km} onChange={setKm} unit="km" decimals={1} max={100} />
        <SelectField id={`${id}-lim`} label={T(l, 'Limite sur le tronçon', 'Limit on the section')} value={String(lim)} onChange={(x) => setLim(Number(x))} options={limOpts} />
      </Row2>
      <Row2>
        <NumberField id={`${id}-mn`} label={T(l, 'Temps : minutes', 'Time: minutes')} value={mn} onChange={setMn} unit="min" max={600} />
        <NumberField id={`${id}-sec`} label={T(l, 'et secondes', 'and seconds')} value={sec} onChange={setSec} unit="s" max={59} />
      </Row2>
      <Note>{T(l, `Vitesse moyenne : ${formatNumber(vitesseMoyenne(km, secondes), 1, l)} km/h. La marge du radar fixe (${P.marge.fixe_kmh} km/h, ou ${formatNumber(P.marge.fixe_pct * 100, 0, l)} % au-dessus de ${P.marge.seuil_kmh} km/h) s’applique ensuite.`, `Average speed: ${formatNumber(vitesseMoyenne(km, secondes), 1, l)} km/h. The fixed-camera margin (${P.marge.fixe_kmh} km/h, or ${formatNumber(P.marge.fixe_pct * 100, 0, l)}% above ${P.marge.seuil_kmh} km/h) is then deducted.`)}</Note>
    </>
  ) : mode === 'route' ? (
    <>
      <Row2>
        <NumberField id={`${id}-v`} label={T(l, 'Vitesse mesurée', 'Measured speed')} value={v} onChange={setV} unit="km/h" max={400} />
        <SelectField id={`${id}-route`} label={T(l, 'Type de route', 'Type of road')} value={route} onChange={(x) => setRoute(x as Route)} options={ROUTES.map((r) => ({ value: r, label: ROUTE_LABEL[r][l] }))} />
      </Row2>
      <Row2>
        <Toggle id={`${id}-pluie`} label={T(l, 'Pluie', 'Rain')} value={pluie ? '1' : '0'} onChange={(x) => setPluie(x === '1')} options={[{ value: '0', label: T(l, 'Non', 'No') }, { value: '1', label: T(l, 'Oui', 'Yes') }]} />
        <Toggle id={`${id}-proba`} label={T(l, 'Permis probatoire', 'Probationary licence')} value={proba ? '1' : '0'} onChange={(x) => setProba(x === '1')} options={[{ value: '0', label: T(l, 'Non', 'No') }, { value: '1', label: T(l, 'Oui', 'Yes') }]} />
      </Row2>
      <Note>{T(l, `Limite applicable : ${kmh(limite, l)}, sauf panneau qui fixe une autre vitesse.`, `Limit that applies: ${kmh(limite, l)}, unless a sign sets another speed.`)}</Note>
    </>
  ) : (
    <>
      <Row2>
        <NumberField id={`${id}-v`} label={T(l, ret ? 'Vitesse retenue (avis)' : 'Vitesse mesurée', ret ? 'Recorded speed (notice)' : 'Measured speed')} value={v} onChange={setV} unit="km/h" max={400} />
        <SelectField id={`${id}-lim`} label={T(l, 'Vitesse autorisée', 'Speed limit')} value={String(lim)} onChange={(x) => setLim(Number(x))} options={limOpts} />
      </Row2>
      <Row2>
        <Toggle id={`${id}-ret`} label={T(l, 'Ce chiffre est', 'Figure from')} value={ret ? '1' : '0'} onChange={(x) => setRet(x === '1')} options={[{ value: '0', label: T(l, 'Mesuré', 'Radar') }, { value: '1', label: T(l, 'Retenu', 'Notice') }]} />
        {ret ? <p className="self-end pb-3 text-sm text-navy-600">{T(l, 'Marge déjà déduite sur l’avis.', 'Margin already deducted on the notice.')}</p> : appToggle}
      </Row2>
    </>
  );

  const head = !s.infraction
    ? <Head label={T(l, 'Pas d’excès retenu', 'No speeding offence')} value={eur(0, l)} sub={T(l, `Vitesse retenue ${kmh(s.retenue, l)} pour ${kmh(limite, l)} autorisés`, `Recorded speed ${kmh(s.retenue, l)} for a ${kmh(limite, l)} limit`)} />
    : s.delit
      ? <Head label={T(l, 'Délit : amende jusqu’à', 'Criminal offence: fine up to')} value={eur(s.amendeMax!, l)} sub={T(l, `${s.points} points, ${P.vitesse.delit.prison_mois} mois de prison encourus · excès de ${kmh(s.exces, l)}`, `${s.points} points, up to ${P.vitesse.delit.prison_mois} months in prison · ${kmh(s.exces, l)} over`)} />
      : <Head label={T(l, `Amende forfaitaire · ${s.classe}e classe`, `Standard fine · class ${s.classe}`)} value={eur(s.amendes!.forfaitaire, l)} sub={T(l, `${s.points === 0 ? 'Aucun point' : s.points === 1 ? '1 point' : `${s.points} points`} · excès retenu de ${kmh(s.exces, l)}`, `${s.points === 0 ? 'No points' : s.points === 1 ? '1 point' : `${s.points} points`} · ${kmh(s.exces, l)} over the limit`)} />;

  const rows: Array<[string, string] | [string, string, boolean]> = [];
  if (!(ret && mode === 'vitesse')) rows.push([T(l, `Vitesse retenue (marge ${formatNumber(margeDe(s.mesuree, s.appareil), s.mesuree >= P.marge.seuil_kmh ? 1 : 0, l)} km/h)`, `Recorded speed (margin ${formatNumber(margeDe(s.mesuree, s.appareil), s.mesuree >= P.marge.seuil_kmh ? 1 : 0, l)} km/h)`), kmh(s.retenue, l)]);
  if (s.infraction && !s.delit) {
    rows.push([T(l, 'Minorée, payée sous 15 jours', 'Reduced, paid within 15 days'), eur(s.amendes!.minoree ?? s.amendes!.forfaitaire, l)]);
    rows.push([T(l, 'Majorée, après 45 jours', 'Increased, after 45 days'), eur(s.amendes!.majoree, l)]);
  }
  if (s.delit) {
    rows.push([T(l, 'Amende forfaitaire délictuelle possible', 'Possible fixed criminal fine'), eur(s.afd!.forfaitaire, l), true]);
    rows.push([T(l, 'minorée / majorée', 'reduced / increased'), `${eur(s.afd!.minoree, l)} / ${eur(s.afd!.majoree, l)}`]);
  }
  if (s.infraction) {
    rows.push([T(l, 'Points retirés', 'Points deducted'), String(s.points), true]);
    rows.push([T(l, 'Suspension du permis encourue', 'Licence suspension risked'), s.suspensionAns ? T(l, `jusqu’à ${s.suspensionAns} ans`, `up to ${s.suspensionAns} years`) : T(l, 'non', 'no')]);
    if (s.retention) rows.push([T(l, 'Si interception : permis retenu', 'If stopped: licence seized'), T(l, `72 h, puis jusqu’à ${P.vitesse.suspension_prefet_max_mois} mois`, `72 h, then up to ${P.vitesse.suspension_prefet_max_mois} months`)]);
    if (s.points > 0) rows.push([T(l, 'Points rendus sans nouvelle infraction', 'Points back with no new offence'), T(l, `après ${mois(retour.mois, l)}`, `after ${mois(retour.mois, l)}`)]);
  }
  const result = <>{head}<Rows rows={rows} /><MethodLink href={methodHref} lang={l} /></>;

  const table = seuils && mode !== 'troncon' ? seuilsLimite(limite, mode === 'vitesse' && !ret ? app : 'fixe') : [];
  return (
    <div>
      <Shell id={id} form={form} result={result} />
      {table.length > 0 && (
        <div data-chrome className="not-prose mt-4 overflow-x-auto rounded-xl border border-navy-200">
          <p className="border-b border-navy-200 bg-navy-50 px-4 py-2 text-sm font-semibold text-navy-900">{T(l, `Sur une route à ${kmh(limite, l)}, radar ${mode === 'vitesse' && !ret && app === 'embarque' ? 'embarqué' : 'fixe'} : la sanction selon la vitesse mesurée`, `On a ${kmh(limite, l)} road, ${mode === 'vitesse' && !ret && app === 'embarque' ? 'in-car' : 'fixed'} camera: penalty by measured speed`)}</p>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-navy-700">
              <th scope="col" className="px-3 py-2 font-semibold">{T(l, 'Mesuré à partir de', 'Measured from')}</th>
              <th scope="col" className="px-3 py-2 font-semibold">{T(l, 'Retenu', 'Recorded')}</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">{T(l, 'Amende', 'Fine')}</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">{T(l, 'Points', 'Points')}</th>
            </tr></thead>
            <tbody className="divide-y divide-navy-100">
              {table.map((t) => (
                <tr key={t.exces} className={s.infraction && t.sanction.tranche[0] === s.tranche[0] ? 'bg-accent-50 font-semibold' : ''}>
                  <td className="tabular-nums px-3 py-1.5">{kmh(t.mesuree, l)}</td>
                  <td className="tabular-nums px-3 py-1.5">{kmh(t.retenue, l)}</td>
                  <td className="tabular-nums px-3 py-1.5 text-right">{t.sanction.delit ? T(l, `délit, ${eur(t.sanction.afd!.forfaitaire, l)} (AFD)`, `offence, ${eur(t.sanction.afd!.forfaitaire, l)} (fixed)`) : eur(t.sanction.amendes!.forfaitaire, l)}</td>
                  <td className="tabular-nums px-3 py-1.5 text-right">{t.sanction.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
