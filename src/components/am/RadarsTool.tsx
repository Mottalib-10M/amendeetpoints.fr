/**
 * Radars fixes d'un département : effectifs par type et par limite (src/data/radars/stats.json, servis
 * dans le HTML), puis la liste des radars, chargée à la demande (public/data/radars.json), avec pour
 * chacun la vitesse mesurée qui coûte un point puis la vitesse du délit. Données : « Liste des radars
 * fixes en France », ministère de l'Intérieur, data.gouv.fr, Licence Ouverte 2.0 (scripts/update-data.mjs).
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { Shell, Head, Rows, Note, MethodLink, type L } from '../calc/kit';
import { mesureePourRetenue, sanctionRetenue } from '../../lib/engine/sanctions';
import { P } from '../../lib/engine/params';
import { formatNumber, displayDate } from '../../lib/format';
import { readParams, updateURL } from '../../lib/url-state';
import S from '../../data/radars/stats.json';

const T = <A,>(l: L, fr: A, en: A) => (l === 'en' ? en : fr);
type Dep = { nom: string; total: number; types: Record<string, number>; vma: Record<string, number>; recents: number; communes: number; topCommunes: Array<[string, number]>; plusRecent: string };
const DEPS = S.deps as unknown as Record<string, Dep>;
export const TYPE_LABEL: Record<string, { fr: string; en: string }> = {
  ETT: { fr: 'Radar tourelle', en: 'Tower camera' },
  ETF: { fr: 'Radar fixe classique', en: 'Standard fixed camera' },
  ETD: { fr: 'Radar discriminant', en: 'Discriminating camera' },
  ETFR: { fr: 'Radar feu rouge', en: 'Red-light camera' },
  ETPN: { fr: 'Radar passage à niveau', en: 'Level-crossing camera' },
  ETVM: { fr: 'Radar tronçon', en: 'Average-speed camera' },
  ETU: { fr: 'Radar urbain', en: 'Urban camera' },
};
const ORDRE = ['ETT', 'ETF', 'ETD', 'ETFR', 'ETVM', 'ETPN', 'ETU'];
type Radar = [string, string, number, number, number, string, string, string];

export default function RadarsTool({ lang: l, id = 'radars', defaultDep = '75', defaultType = '', methodHref }: { lang: L; id?: string; defaultDep?: string; defaultType?: string; methodHref?: string }) {
  const [dep, setDep] = useState(defaultDep);
  const [typ, setTyp] = useState(defaultType);
  const [liste, setListe] = useState<Radar[] | null>(null);
  const [voir, setVoir] = useState(false);
  useEffect(() => {
    const u = readParams(window.location.search);
    const d = u.get('d'), t = u.get('t');
    if (d && DEPS[d]) setDep(d);
    if (t && TYPE_LABEL[t]) setTyp(t);
  }, []);
  useEffect(() => { updateURL({ d: dep, t: typ || undefined }); }, [dep, typ]);
  useEffect(() => {
    if (!voir || liste) return;
    fetch(`${import.meta.env.BASE_URL.replace(/\/$/, '')}/data/radars.json`).then((r) => r.json()).then(setListe).catch(() => setListe([]));
  }, [voir, liste]);

  const x = DEPS[dep];
  const rang = useMemo(() => Object.entries(DEPS).filter(([, v]) => v.total > 0).sort((a, b) => b[1].total - a[1].total).findIndex(([c]) => c === dep) + 1, [dep]);
  const nbDeps = Object.values(DEPS).filter((v) => v.total > 0).length;
  const nTyp = typ ? x.types[typ] ?? 0 : x.total;
  const vmaTop = Object.entries(x.vma).sort((a, b) => b[1] - a[1])[0];
  const d = (s: string) => displayDate(s, l === 'en' ? 'en-GB' : 'fr-FR');
  const rows = (liste ?? []).filter((r) => r[6] === dep && (!typ || r[1] === typ));
  const opts = Object.entries(DEPS).sort(([a], [b]) => a.localeCompare(b)).map(([c, v]) => ({ value: c, label: `${c} · ${v.nom}` }));

  const form = (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <SelectField id={`${id}-dep`} label={T(l, 'Département', 'Département')} value={dep} onChange={(v) => { setDep(v); }} options={opts} />
        <SelectField id={`${id}-type`} label={T(l, 'Type de radar', 'Camera type')} value={typ} onChange={setTyp} options={[{ value: '', label: T(l, 'Tous les types', 'All types') }, ...ORDRE.map((t) => ({ value: t, label: TYPE_LABEL[t][l] }))]} />
      </div>
      <Note>{T(l, `Fichier du ministère de l’Intérieur du ${d(S.meta.fichier)} : ${formatNumber(S.meta.radars, 0, l)} radars fixes en France. Les radars mobiles et les voitures radars n’y figurent pas.`, `Interior Ministry file of ${d(S.meta.fichier)}: ${formatNumber(S.meta.radars, 0, l)} fixed cameras in France. Mobile units and camera cars are not listed.`)}</Note>
    </>
  );
  const result = (
    <>
      <Head label={T(l, `${typ ? TYPE_LABEL[typ].fr : 'Radars fixes'} · ${x.nom}`, `${typ ? TYPE_LABEL[typ].en : 'Fixed cameras'} · ${x.nom}`)} value={formatNumber(nTyp, 0, l)}
        sub={x.total ? T(l, `${rang}e département sur ${nbDeps} par nombre de radars`, `Ranked ${rang} of ${nbDeps} départements by number`) : T(l, 'Aucun radar fixe dans le fichier', 'No fixed camera in the file')} />
      <Rows rows={[
        ...ORDRE.filter((t) => x.types[t]).slice(0, 4).map((t) => [TYPE_LABEL[t][l], formatNumber(x.types[t], 0, l)] as [string, string]),
        ...(vmaTop ? [[T(l, 'Limite la plus contrôlée', 'Most-checked limit'), `${vmaTop[0]} km/h (${vmaTop[1]})`] as [string, string]] : []),
        [T(l, 'Communes équipées', 'Towns with a camera'), formatNumber(x.communes, 0, l)],
        [T(l, 'Mis en service depuis 2023', 'Installed since 2023'), formatNumber(x.recents, 0, l)],
      ]} />
      <MethodLink href={methodHref} lang={l} />
    </>
  );
  return (
    <div>
      <Shell id={id} form={form} result={result} />
      <div data-chrome className="not-prose mt-4 rounded-xl border border-navy-200">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-200 bg-navy-50 px-4 py-2 text-sm">
          <p className="font-semibold text-navy-900">{T(l, `Chaque radar de ${x.nom} et la vitesse qui coûte des points`, `Every camera in ${x.nom} and the speed that costs points`)}</p>
          {!voir && x.total > 0 && <button type="button" onClick={() => setVoir(true)} className="rounded border border-accent-500 bg-white px-3 py-1 font-semibold text-accent-700">{T(l, `Carte et liste des ${nTyp} radars`, `Map and list of the ${nTyp} cameras`)}</button>}
        </div>
        {voir && liste && rows.length > 0 && <Carte rows={rows} l={l} />}
        {voir && (
          <div className="max-h-[32rem] overflow-auto">
            {!liste ? <p className="px-4 py-3 text-sm text-navy-600">{T(l, 'Chargement…', 'Loading…')}</p> : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white"><tr className="text-left text-navy-700">
                  <th scope="col" className="px-3 py-2 font-semibold">{T(l, 'Commune', 'Town')}</th>
                  <th scope="col" className="px-3 py-2 font-semibold">{T(l, 'Type', 'Type')}</th>
                  <th scope="col" className="px-3 py-2 text-right font-semibold">{T(l, 'Limite', 'Limit')}</th>
                  <th scope="col" className="px-3 py-2 text-right font-semibold">{T(l, '1er point dès', '1st point from')}</th>
                  <th scope="col" className="px-3 py-2 text-right font-semibold">{T(l, 'Délit dès', 'Offence from')}</th>
                  <th scope="col" className="px-3 py-2 font-semibold">{T(l, 'Depuis', 'Since')}</th>
                </tr></thead>
                <tbody className="divide-y divide-navy-100">
                  {rows.map((r) => {
                    const v = r[2];
                    const p1 = v ? mesureePourRetenue(v + P.vitesse.tranches[1].de, 'fixe') : 0;
                    const dl = v ? mesureePourRetenue(v + P.vitesse.delit_a_partir_de, 'fixe') : 0;
                    return (
                      <tr key={r[0]}>
                        <td className="px-3 py-1.5"><a className="text-accent-700 underline" href={`https://www.openstreetmap.org/?mlat=${r[3]}&mlon=${r[4]}#map=16/${r[3]}/${r[4]}`} target="_blank" rel="nofollow noopener noreferrer">{r[5] || '—'}</a></td>
                        <td className="px-3 py-1.5">{TYPE_LABEL[r[1]]?.[l] ?? r[1]}</td>
                        <td className="tabular-nums px-3 py-1.5 text-right">{v ? `${v} km/h` : '—'}</td>
                        <td className="tabular-nums px-3 py-1.5 text-right">{v ? `${p1} km/h` : '—'}</td>
                        <td className="tabular-nums px-3 py-1.5 text-right">{v ? `${dl} km/h` : '—'}</td>
                        <td className="tabular-nums px-3 py-1.5">{r[7] ? r[7].slice(0, 4) : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
        <p className="px-4 py-2 text-xs text-navy-600">{T(l, `Vitesses mesurées par le radar, marge de ${P.marge.fixe_kmh} km/h déduite (${formatNumber(P.marge.fixe_pct * 100, 0, l)} % au-dessus de ${P.marge.seuil_kmh} km/h). « — » : limite non publiée dans le fichier (feu rouge, passage à niveau, certains radars tourelles).`, `Speeds as measured by the camera, with the ${P.marge.fixe_kmh} km/h margin deducted (${formatNumber(P.marge.fixe_pct * 100, 0, l)}% above ${P.marge.seuil_kmh} km/h). “—”: limit not published in the file (red light, level crossing, some tower cameras).`)}</p>
      </div>
    </div>
  );
}
export { sanctionRetenue };

const COULEUR: Record<string, string> = { ETT: '#A3271D', ETF: '#1f4e79', ETD: '#6b4fa0', ETFR: '#d97706', ETVM: '#047857', ETPN: '#475569', ETU: '#be185d' };
/** Carte simple des radars du département : projection équirectangulaire, un point par radar, lien OpenStreetMap. */
function Carte({ rows, l }: { rows: Radar[]; l: L }) {
  const la = rows.map((r) => r[3]), lo = rows.map((r) => r[4]);
  const [a, b, c, d] = [Math.min(...la), Math.max(...la), Math.min(...lo), Math.max(...lo)];
  const k = Math.cos(((a + b) / 2) * Math.PI / 180);
  const w = Math.max(0.02, (d - c) * k), hgt = Math.max(0.02, b - a);
  const W = 600, H = Math.min(520, Math.max(240, (W * hgt) / w));
  const sx = (W - 20) / w, sy = (H - 20) / hgt, s = Math.min(sx, sy);
  const types = [...new Set(rows.map((r) => r[1]))];
  return (
    <div className="border-b border-navy-200 px-4 py-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-2xl" role="img" aria-label={T(l, 'Position des radars du département', 'Position of the département’s cameras')}>
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" />
        {rows.map((r) => (
          <a key={r[0]} href={`https://www.openstreetmap.org/?mlat=${r[3]}&mlon=${r[4]}#map=16/${r[3]}/${r[4]}`} target="_blank" rel="nofollow noopener noreferrer">
            <circle cx={10 + (r[4] - c) * k * s} cy={10 + (b - r[3]) * s} r="5" fill={COULEUR[r[1]] ?? '#334155'} fillOpacity="0.8"><title>{`${r[5]} · ${TYPE_LABEL[r[1]]?.[l] ?? r[1]}${r[2] ? ` · ${r[2]} km/h` : ''}`}</title></circle>
          </a>
        ))}
      </svg>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-700">{types.map((t) => <span key={t}><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: COULEUR[t] }} />{TYPE_LABEL[t]?.[l] ?? t}</span>)}</p>
    </div>
  );
}
