/**
 * Moteur des sanctions routières (fonctions pures, aucune lecture d'horloge ni d'URL).
 * Toutes les valeurs viennent de data/params-2026.json ; les sources sont citées là-bas.
 */
import { P } from './params';
import { addDays, addMonths, addYears } from './dates';

export type Appareil = 'fixe' | 'embarque';
export type Classe = 1 | 2 | 3 | 4;
export interface Amendes { minoree: number | null; forfaitaire: number; majoree: number }

/** Montants d'une contravention de la classe donnée (CPP R49-9 pour la minorée, fiche Service Public F18509). */
export function amendesClasse(classe: Classe, stationnement = false): Amendes {
  const c = P.classes[String(classe) as '1' | '2' | '3' | '4'];
  // L'amende minorée ne s'applique pas au stationnement (CPP art. 529-7).
  return { minoree: stationnement ? null : c.minoree, forfaitaire: c.forfaitaire, majoree: c.majoree };
}

/** Marge technique (erreur maximale tolérée, arrêté du 4 juin 2009, art. 6) en km/h. */
export function marge(mesuree: number, appareil: Appareil): number {
  const m = P.marge;
  if (mesuree < m.seuil_kmh) return appareil === 'fixe' ? m.fixe_kmh : m.embarque_kmh;
  return mesuree * (appareil === 'fixe' ? m.fixe_pct : m.embarque_pct);
}

/** Vitesse retenue : vitesse mesurée moins la marge, arrondie à l'unité inférieure. */
export function vitesseRetenue(mesuree: number, appareil: Appareil): number {
  if (!(mesuree > 0)) return 0;
  return Math.floor(mesuree - marge(mesuree, appareil) + 1e-9);
}

/** Plus petite vitesse MESURÉE (km/h entier) dont la vitesse retenue atteint `retenue`. */
export function mesureePourRetenue(retenue: number, appareil: Appareil): number {
  let v = Math.max(1, Math.floor(retenue));
  while (vitesseRetenue(v, appareil) < retenue) v++;
  return v;
}

export interface SanctionVitesse {
  mesuree: number;
  limite: number;
  appareil: Appareil;
  marge: number;
  retenue: number;
  exces: number;
  infraction: boolean;
  delit: boolean;
  /** Classe de la contravention (3 ou 4), null pour le délit ou l'absence d'infraction. */
  classe: Classe | null;
  amendes: Amendes | null;
  /** Délit : amende forfaitaire délictuelle possible (L413-1 IV). */
  afd: { minoree: number; forfaitaire: number; majoree: number } | null;
  amendeMax: number | null;
  points: number;
  /** Suspension judiciaire encourue, en années (0 = aucune prévue par le texte). */
  suspensionAns: number;
  /** Rétention immédiate et suspension préfectorale possibles si le conducteur est intercepté. */
  retention: boolean;
  /** Tranche lue dans le barème : « 5 à 19 », « 20 à 29 »… */
  tranche: [number, number | null];
}

export function sanctionVitesse(mesuree: number, limite: number, appareil: Appareil = 'fixe'): SanctionVitesse {
  const m = mesuree > 0 ? marge(mesuree, appareil) : 0;
  return sanctionRetenue(vitesseRetenue(mesuree, appareil), limite, { mesuree, appareil, marge: m });
}

/** Même calcul à partir de la vitesse RETENUE imprimée sur l'avis (marge déjà déduite). */
export function sanctionRetenue(retenue: number, limite: number, base: { mesuree: number; appareil: Appareil; marge: number } = { mesuree: retenue, appareil: 'fixe', marge: 0 }): SanctionVitesse {
  const V = P.vitesse;
  const exces = Math.max(0, retenue - limite);
  const b = { ...base, limite, retenue, exces };
  if (exces <= 0 || limite <= 0) {
    return { ...b, infraction: false, delit: false, classe: null, amendes: null, afd: null, amendeMax: null, points: 0, suspensionAns: 0, retention: false, tranche: [0, 0] };
  }
  if (exces >= V.delit_a_partir_de) {
    const d = V.delit;
    return { ...b, infraction: true, delit: true, classe: null, amendes: null, afd: d.afd, amendeMax: d.amende_max, points: d.points, suspensionAns: d.suspension_max_ans, retention: true, tranche: [V.delit_a_partir_de, null] };
  }
  const t = V.tranches.find((x) => exces >= x.de && exces < x.a)!;
  const classe = (limite > V.limite_classe3_au_dessus_de ? t.classe_haute_limite : t.classe_basse_limite) as Classe;
  return {
    ...b, infraction: true, delit: false, classe, amendes: amendesClasse(classe), afd: null, amendeMax: null,
    points: t.points, suspensionAns: t.suspension_ans, retention: exces >= V.retention_a_partir_de, tranche: [t.de === 0 ? 1 : t.de, t.a - 1],
  };
}

/** Délai sans nouvelle infraction au bout duquel les points reviennent tous (L223-6), en années,
 *  et « 0,5 » quand la règle des six mois s'applique (un seul point retiré). */
export function delaiRetour(s: Pick<SanctionVitesse, 'points' | 'classe' | 'delit'>): { mois: number; un_point: boolean } {
  if (s.points <= 0) return { mois: 0, un_point: false };
  if (s.points === 1) return { mois: P.permis.recup_un_point_mois, un_point: true };
  const lourde = s.delit || (s.classe ?? 0) >= 4;
  return { mois: 12 * (lourde ? P.permis.recup_totale_ans_si_classe4_ou_delit : P.permis.recup_totale_ans), un_point: false };
}

/** Pour une limite et un appareil : vitesse MESURÉE à partir de laquelle on entre dans chaque tranche. */
export function seuilsLimite(limite: number, appareil: Appareil = 'fixe') {
  const V = P.vitesse;
  const bornes = [...V.tranches.map((t) => (t.de === 0 ? 1 : t.de)), V.delit_a_partir_de];
  return bornes.map((de) => {
    const s = sanctionRetenue(limite + de, limite);
    return { exces: de, mesuree: mesureePourRetenue(limite + de, appareil), retenue: limite + de, sanction: s };
  });
}

/** Échéances de paiement et de contestation à partir de la date d'envoi de l'avis (ISO). */
export function echeances(envoi: string, telepaiement: boolean) {
  const D = P.delais;
  return {
    minoree: addDays(envoi, telepaiement ? D.minoree_telepaiement_jours : D.minoree_jours),
    forfaitaire: addDays(envoi, telepaiement ? D.forfaitaire_telepaiement_jours : D.forfaitaire_jours),
    contestation: addDays(envoi, D.contestation_forfaitaire_jours),
  };
}

/** Limite de vitesse selon la route, la météo et le permis (fiche Service Public F19460). */
export type Route = keyof Omit<typeof P.limites, 'brouillard_moins_50m'>;
export function limiteRoute(route: Route, pluie: boolean, probatoire: boolean, brouillard = false): number {
  if (brouillard) return P.limites.brouillard_moins_50m;
  const l = P.limites[route];
  return Math.min(pluie ? l.pluie : l.sec, probatoire ? l.probatoire : l.sec);
}

/** Vitesse moyenne sur un tronçon (km, secondes) en km/h. */
export const vitesseMoyenne = (km: number, secondes: number) => (km > 0 && secondes > 0 ? (km * 3600) / secondes : 0);

/* ---------------- Points ---------------- */

export type Gravite = 'legere' | 'lourde';
/** Une infraction retenue : date à laquelle elle est devenue définitive (paiement, condamnation…). */
export interface Retrait { date: string; points: number; gravite: Gravite }

export interface Evenement { date: string; type: 'retrait' | 'un_point' | 'total' | 'invalidation'; points: number; solde: number }

/**
 * Solde du permis définitif (12 points) à une date donnée, selon L223-6 :
 * - retour au maximum 2 ans après la dernière infraction définitive sans nouvelle infraction
 *   (3 ans si l'une des infractions de la période est une contravention de 4e ou 5e classe ou un délit) ;
 * - un point rendu 6 mois après une infraction qui n'en a retiré qu'un, sans nouvelle infraction entre-temps ;
 * - la règle des 10 ans ne joue que si les deux précédentes n'ont pas joué (affichée à part).
 */
export function soldePoints(retraits: Retrait[], aDate: string, max = P.permis.points_max): { solde: number; evenements: Evenement[]; retourTotal: string | null; invalide: boolean } {
  const R = [...retraits].filter((r) => r.points > 0 && r.date).sort((a, b) => a.date.localeCompare(b.date));
  const ev: Evenement[] = [];
  let solde = max;
  let lourde = false;
  let invalide = false;
  for (let i = 0; i < R.length; i++) {
    const r = R[i];
    // Le retour au maximum a-t-il eu lieu avant cette infraction ?
    if (i > 0) {
      const prev = R[i - 1];
      const total = addYears(prev.date, lourde ? P.permis.recup_totale_ans_si_classe4_ou_delit : P.permis.recup_totale_ans);
      if (solde < max && total <= r.date) { solde = max; lourde = false; ev.push({ date: total, type: 'total', points: max, solde }); }
      else {
        const six = addMonths(prev.date, P.permis.recup_un_point_mois);
        if (prev.points === 1 && six <= r.date && solde < max) { solde = Math.min(max, solde + 1); ev.push({ date: six, type: 'un_point', points: 1, solde }); }
      }
    }
    solde = Math.max(0, solde - r.points);
    if (r.gravite === 'lourde') lourde = true;
    ev.push({ date: r.date, type: 'retrait', points: r.points, solde });
    if (solde === 0) { invalide = true; ev.push({ date: r.date, type: 'invalidation', points: 0, solde: 0 }); break; }
  }
  let retourTotal: string | null = null;
  if (!invalide && R.length && solde < max) {
    const last = R[R.length - 1];
    retourTotal = addYears(last.date, lourde ? P.permis.recup_totale_ans_si_classe4_ou_delit : P.permis.recup_totale_ans);
    const six = addMonths(last.date, P.permis.recup_un_point_mois);
    if (last.points === 1 && six < retourTotal) ev.push({ date: six, type: 'un_point', points: 1, solde: Math.min(max, solde + 1) });
    ev.push({ date: retourTotal, type: 'total', points: max, solde: max });
  }
  // Solde à la date demandée : rejouer les événements jusqu'à elle.
  let s = max;
  for (const e of ev) if (e.date <= aDate) s = e.solde;
  return { solde: invalide && ev.some((e) => e.type === 'invalidation' && e.date <= aDate) ? 0 : s, evenements: ev, retourTotal, invalide };
}

/** Capital d'un permis probatoire à chaque anniversaire, sans infraction (L223-1). */
export function capitalProbatoire(obtention: string, aac: boolean) {
  const p = P.permis;
  const ans = aac ? p.probatoire_aac_duree_ans : p.probatoire_duree_ans;
  const gain = aac ? p.probatoire_aac_gain_annuel : p.probatoire_gain_annuel;
  const etapes = [{ date: obtention, points: p.probatoire_initial }];
  for (let i = 1; i <= ans; i++) etapes.push({ date: addYears(obtention, i), points: Math.min(p.points_max, p.probatoire_initial + gain * i) });
  return { fin: addYears(obtention, ans), etapes };
}

/** Points après un stage de sensibilisation (4 points, une fois par an, sans dépasser le maximum). */
export function apresStage(solde: number, max: number, dernierStage: string | null, aDate: string) {
  const possible = solde > 0 && (!dernierStage || addYears(dernierStage, 1) <= aDate);
  const apres = possible ? Math.min(max, solde + P.permis.stage_points) : solde;
  return { possible, apres, gagnes: apres - solde, prochainPossible: dernierStage ? addYears(dernierStage, 1) : aDate };
}

/** Une infraction du catalogue (feu rouge, téléphone…), ses montants et ses points. */
export type InfractionId = (typeof P.infractions)[number]['id'];
export function infraction(id: string) {
  const i = P.infractions.find((x) => x.id === id);
  if (!i) throw new Error(`Infraction inconnue : ${id}`);
  const delit = i.classe === 'delit';
  return { ...i, delit, amendes: delit ? null : amendesClasse(i.classe as Classe, !!(i as { stationnement?: boolean }).stationnement) };
}

/** Points retirés pour plusieurs contraventions constatées en même temps (L223-2 III : 8 points au plus). */
export function cumulSimultane(points: number[]): number {
  return Math.min(P.permis.plafond_simultane, points.reduce((a, b) => a + b, 0));
}

/**
 * Permis probatoire (L223-1) : 6 points au départ ; à chaque anniversaire, +2 points (+3 en conduite
 * accompagnée) « si aucune infraction ayant donné lieu à un retrait de points n'a été commise depuis
 * le début de la période probatoire ». `retraits` : mois écoulés depuis l'obtention et points retirés.
 */
export function probatoire(moisDepuis: number, aac: boolean, retraits: Array<{ mois: number; points: number }> = []) {
  const p = P.permis;
  const ans = aac ? p.probatoire_aac_duree_ans : p.probatoire_duree_ans;
  const gain = aac ? p.probatoire_aac_gain_annuel : p.probatoire_gain_annuel;
  const R = retraits.filter((r) => r.points > 0 && r.mois >= 0 && r.mois <= moisDepuis).sort((a, b) => a.mois - b.mois);
  const premier = R.length ? R[0].mois : Infinity;
  const anniv = Math.min(ans, Math.floor(moisDepuis / 12));
  // Anniversaires atteints avant la première infraction : majorations acquises.
  const acquis = Array.from({ length: anniv }, (_, i) => (i + 1) * 12).filter((m) => m <= premier).length;
  const perdus = R.reduce((a, r) => a + r.points, 0);
  const capital = Math.max(0, Math.min(p.points_max, p.probatoire_initial + gain * acquis) - perdus);
  const stageObligatoire = R.some((r) => r.points >= p.probatoire_stage_obligatoire_si_retrait);
  const enCours = moisDepuis < ans * 12;
  const capitalFinSansInfraction = R.length ? null : p.points_max;
  return { ans, gain, capital, acquis, perdus, enCours, stageObligatoire, capitalFinSansInfraction, moisRestants: Math.max(0, ans * 12 - moisDepuis) };
}

/** Amende majorée payée dans les 30 jours de l'envoi de son avis (45 en ligne) : réduite de 20 % (fiche F18509). */
export const majoreeReduite = (majoree: number) => Math.round(majoree * (1 - P.delais.majoree_reduction_pct) * 100) / 100;

/** Après un flash : fenêtre habituelle de réception de l'avis et prescription d'une contravention
 *  (fiche Service Public F364 : 10 jours à 1 mois en moyenne ; 1 an sans avis = plus de poursuite). */
export function apresFlash(flash: string) {
  const D = P.delais;
  return {
    avisDes: addDays(flash, D.avis_envoi_moyen_jours_min),
    avisJusqua: addMonths(flash, D.avis_envoi_moyen_mois_max),
    prescription: addYears(flash, D.prescription_contravention_ans),
  };
}
/** État de l'attente d'un avis, `aDate` étant le jour où l'on regarde. */
export function etatAttente(flash: string, aDate: string): 'tot' | 'normal' | 'retard' | 'prescrit' {
  const f = apresFlash(flash);
  return aDate < f.avisDes ? 'tot' : aDate <= f.avisJusqua ? 'normal' : aDate < f.prescription ? 'retard' : 'prescrit';
}

/** Amende majorée reçue sans l'avis initial, radar automatique (fiche Service Public F18510) :
 *  justifier du changement d'adresse dans les 3 mois de l'envoi de l'avis majoré, puis payer
 *  l'amende forfaitaire (sans minoration) dans les 45 jours de la déclaration. */
export function reevaluation(envoiMajoree: string, declaration: string | null) {
  const D = P.delais;
  return {
    justifierAvant: addMonths(envoiMajoree, D.reevaluation_adresse_mois),
    payerAvant: declaration ? addDays(declaration, D.reevaluation_paiement_jours) : null,
  };
}

/** Forfait post-stationnement impayé après 3 mois : majoration de 20 %, au moins 50 €, réduite de
 *  20 % si tout est payé dans le mois de l'avertissement (fiche Service Public F34440). */
export function fpsMajore(fps: number) {
  const F = P.fps;
  const majoration = Math.max(Math.round(fps * F.majoration_pct * 100) / 100, F.majoration_min);
  const majorationReduite = Math.round(majoration * (1 - F.reduction_majoration_pct) * 100) / 100;
  return { majoration, total: fps + majoration, totalReduit: fps + majorationReduite };
}
