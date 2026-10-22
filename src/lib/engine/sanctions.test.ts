import { describe, it, expect } from 'vitest';
import { sanctionVitesse, vitesseRetenue, mesureePourRetenue, echeances, soldePoints, capitalProbatoire, apresStage, infraction, limiteRoute, vitesseMoyenne, cumulSimultane, amendesClasse } from './sanctions';

describe('marge technique (arrêté du 4 juin 2009, art. 6)', () => {
  it('radar fixe : 5 km/h sous 100, 5 % au-dessus', () => {
    expect(vitesseRetenue(86, 'fixe')).toBe(81);
    expect(vitesseRetenue(99, 'fixe')).toBe(94);
    expect(vitesseRetenue(100, 'fixe')).toBe(95);
    expect(vitesseRetenue(136, 'fixe')).toBe(129); // 129,2 arrondi à l'inférieur
  });
  it('radar embarqué : 10 km/h sous 100, 10 % au-dessus', () => {
    expect(vitesseRetenue(91, 'embarque')).toBe(81);
    expect(vitesseRetenue(100, 'embarque')).toBe(90);
    expect(vitesseRetenue(150, 'embarque')).toBe(135);
  });
  it('vitesse mesurée minimale pour une vitesse retenue', () => {
    expect(mesureePourRetenue(81, 'fixe')).toBe(86);
    expect(mesureePourRetenue(130, 'fixe')).toBe(137);
    expect(mesureePourRetenue(81, 'embarque')).toBe(91);
  });
});

describe('barème R413-14 et délit L413-1', () => {
  it('moins de 5 km/h : amende sans point', () => {
    const s = sanctionVitesse(86, 80);
    expect(s.exces).toBe(1); expect(s.points).toBe(0); expect(s.classe).toBe(3); expect(s.amendes?.forfaitaire).toBe(68);
  });
  it('de 5 à 19 km/h, limite au-dessus de 50 : 3e classe, 1 point', () => {
    const s = sanctionVitesse(90, 80);
    expect(s.exces).toBe(5); expect(s.points).toBe(1); expect(s.classe).toBe(3); expect(s.amendes).toEqual({ minoree: 45, forfaitaire: 68, majoree: 180 });
  });
  it('de 5 à 19 km/h, limite de 50 ou moins : 4e classe', () => {
    const s = sanctionVitesse(60, 50);
    expect(s.exces).toBe(5); expect(s.classe).toBe(4); expect(s.amendes?.forfaitaire).toBe(135); expect(s.amendes?.minoree).toBe(90); expect(s.amendes?.majoree).toBe(375);
  });
  it('tranches de points 2, 3, 4', () => {
    expect(sanctionVitesse(110, 90).points).toBe(1); // 110 → 104,5 → 104 retenu, 14 km/h : 1 point
    expect(sanctionVitesse(115, 90).exces).toBe(19);
    expect(sanctionVitesse(116, 90).exces).toBe(20);
    expect(sanctionVitesse(116, 90).points).toBe(2);
    expect(sanctionVitesse(85, 50).points).toBe(3);
    expect(sanctionVitesse(85, 50).suspensionAns).toBe(3);
    expect(sanctionVitesse(95, 50).points).toBe(4);
    expect(sanctionVitesse(95, 50).retention).toBe(true);
  });
  it('50 km/h et plus : délit', () => {
    const s = sanctionVitesse(137, 80);
    expect(s.retenue).toBe(130); expect(s.delit).toBe(true); expect(s.points).toBe(6);
    expect(s.amendeMax).toBe(3750); expect(s.afd).toEqual({ minoree: 250, forfaitaire: 300, majoree: 600 });
    expect(sanctionVitesse(136, 80).delit).toBe(false);
  });
  it('pas d’excès', () => {
    expect(sanctionVitesse(85, 80).infraction).toBe(false);
  });
});

describe('délais (CPP 529-8, fiche F18509)', () => {
  it('15 et 45 jours, 30 et 60 en télépaiement', () => {
    expect(echeances('2026-10-01', false)).toEqual({ minoree: '2026-10-16', forfaitaire: '2026-11-15', contestation: '2026-11-15' });
    expect(echeances('2026-10-01', true).minoree).toBe('2026-10-31');
    expect(echeances('2026-10-01', true).forfaitaire).toBe('2026-11-30');
  });
});

describe('points (L223-1, L223-6)', () => {
  it('un retrait de 4 points (4e classe) revient au bout de 3 ans', () => {
    const r = soldePoints([{ date: '2025-01-10', points: 4, gravite: 'lourde' }], '2026-10-22');
    expect(r.solde).toBe(8); expect(r.retourTotal).toBe('2028-01-10');
  });
  it('un seul point revient au bout de 6 mois', () => {
    const r = soldePoints([{ date: '2026-01-01', points: 1, gravite: 'legere' }], '2026-07-02');
    expect(r.solde).toBe(12);
    expect(soldePoints([{ date: '2026-01-01', points: 1, gravite: 'legere' }], '2026-06-30').solde).toBe(11);
  });
  it('une nouvelle infraction relance le délai', () => {
    const r = soldePoints([{ date: '2025-01-01', points: 3, gravite: 'lourde' }, { date: '2026-06-01', points: 2, gravite: 'lourde' }], '2026-10-22');
    expect(r.solde).toBe(7); expect(r.retourTotal).toBe('2029-06-01');
  });
  it('retour au maximum avant la seconde infraction', () => {
    const r = soldePoints([{ date: '2022-01-01', points: 3, gravite: 'lourde' }, { date: '2025-06-01', points: 2, gravite: 'lourde' }], '2026-10-22');
    expect(r.solde).toBe(10);
  });
  it('invalidation à zéro', () => {
    expect(soldePoints([{ date: '2026-01-01', points: 6, gravite: 'lourde' }, { date: '2026-02-01', points: 6, gravite: 'lourde' }], '2026-10-22').invalide).toBe(true);
  });
  it('permis probatoire : 6, 8, 10, 12 ou 6, 9, 12 avec conduite accompagnée', () => {
    expect(capitalProbatoire('2026-01-15', false).etapes.map((e) => e.points)).toEqual([6, 8, 10, 12]);
    expect(capitalProbatoire('2026-01-15', true).etapes.map((e) => e.points)).toEqual([6, 9, 12]);
    expect(capitalProbatoire('2026-01-15', true).fin).toBe('2028-01-15');
  });
  it('stage : 4 points, une fois par an, plafonné', () => {
    expect(apresStage(7, 12, null, '2026-10-22').apres).toBe(11);
    expect(apresStage(10, 12, null, '2026-10-22').apres).toBe(12);
    expect(apresStage(7, 12, '2026-03-01', '2026-10-22').possible).toBe(false);
  });
  it('plafond de 8 points pour des infractions simultanées', () => {
    expect(cumulSimultane([4, 3, 3])).toBe(8);
  });
});

describe('catalogue et limites', () => {
  it('feu rouge, téléphone, stationnement', () => {
    expect(infraction('feu_rouge').points).toBe(4);
    expect(infraction('telephone').amendes?.forfaitaire).toBe(135);
    expect(infraction('stat_genant').amendes).toEqual({ minoree: null, forfaitaire: 35, majoree: 75 });
    expect(infraction('alcool_delit').delit).toBe(true);
    expect(amendesClasse(2).minoree).toBe(22);
  });
  it('limites (F19460)', () => {
    expect(limiteRoute('autoroute', false, false)).toBe(130);
    expect(limiteRoute('autoroute', true, false)).toBe(110);
    expect(limiteRoute('voie_separee', false, true)).toBe(100);
    expect(limiteRoute('bidirectionnelle', false, false, true)).toBe(50);
  });
  it('vitesse moyenne', () => {
    expect(vitesseMoyenne(10, 300)).toBe(120);
  });
});

import { sanctionRetenue, seuilsLimite, probatoire, delaiRetour } from './sanctions';
describe('compléments', () => {
  it('vitesse retenue saisie directement', () => {
    expect(sanctionRetenue(101, 80).points).toBe(2);
    expect(sanctionRetenue(130, 80).delit).toBe(true);
  });
  it('seuils mesurés sur 80 km/h, radar fixe', () => {
    const s = seuilsLimite(80);
    expect(s.map((x) => x.mesuree)).toEqual([86, 90, 106, 116, 127, 137]);
  });
  it('probatoire : majorations perdues après une infraction', () => {
    expect(probatoire(30, false).capital).toBe(10);
    expect(probatoire(30, false, [{ mois: 18, points: 1 }]).capital).toBe(7);
    expect(probatoire(30, false, [{ mois: 18, points: 3 }]).stageObligatoire).toBe(true);
    expect(probatoire(25, true).capital).toBe(12);
  });
  it('délai de retour', () => {
    expect(delaiRetour({ points: 1, classe: 3, delit: false }).mois).toBe(6);
    expect(delaiRetour({ points: 2, classe: 4, delit: false }).mois).toBe(36);
  });
});
import { majoreeReduite } from './sanctions';
describe('majorée réduite', () => {
  it('375 € → 300 €, 180 € → 144 €', () => { expect(majoreeReduite(375)).toBe(300); expect(majoreeReduite(180)).toBe(144); });
});
import { apresFlash, etatAttente, reevaluation, fpsMajore } from './sanctions';
describe('après un flash (Service Public F364)', () => {
  it('avis attendu de J+10 à 1 mois, prescription à 1 an', () => {
    expect(apresFlash('2026-10-01')).toEqual({ avisDes: '2026-10-11', avisJusqua: '2026-11-01', prescription: '2027-10-01' });
    expect(etatAttente('2026-10-01', '2026-10-05')).toBe('tot');
    expect(etatAttente('2026-10-01', '2026-11-01')).toBe('normal');
    expect(etatAttente('2026-10-01', '2027-09-30')).toBe('retard');
    expect(etatAttente('2026-10-01', '2027-10-01')).toBe('prescrit');
  });
});
describe('amende majorée sans avis (Service Public F18510)', () => {
  it('3 mois pour justifier, 45 jours pour payer', () => {
    expect(reevaluation('2026-10-01', '2026-10-20')).toEqual({ justifierAvant: '2027-01-01', payerAvant: '2026-12-04' });
  });
});
describe('FPS impayé (Service Public F34440)', () => {
  it('majoration de 20 %, au moins 50 €, réduite de 20 % sous un mois', () => {
    expect(fpsMajore(35)).toEqual({ majoration: 50, total: 85, totalReduit: 75 });
    expect(fpsMajore(300)).toEqual({ majoration: 60, total: 360, totalReduit: 348 });
  });
});
