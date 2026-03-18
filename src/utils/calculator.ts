import { SimulationInput, SimulationResult, StatutJuridique } from '../types';
import { statuts } from '../data/statuts';

// Barème IR 2024 (revenus 2023)
const TRANCHES_IR = [
  { min: 0, max: 11294, taux: 0 },
  { min: 11294, max: 28797, taux: 0.11 },
  { min: 28797, max: 82341, taux: 0.30 },
  { min: 82341, max: 177106, taux: 0.41 },
  { min: 177106, max: Infinity, taux: 0.45 },
];

// Taux IS 2024
const IS_TAUX_REDUIT = 0.15; // jusqu'à 42 500€
const IS_SEUIL_REDUIT = 42500;
const IS_TAUX_NORMAL = 0.25;

// Taux cotisations auto-entrepreneur
const TAUX_AE = {
  services: 0.218,
  commerciale: 0.128,
  liberale: 0.218,
};

// Taux cotisations TNS (EURL/SARL gérant majoritaire)
const TAUX_TNS = {
  maladie: 0.065,
  retraiteBase: 0.1775,
  retraiteComplementaire: 0.07,
  invaliditeDeces: 0.013,
  allocationsFamiliales: 0.031,
  csg: 0.097,
  crds: 0.005,
  formationPro: 0.0025,
};

// Taux cotisations assimilé salarié (SASU/SAS)
const TAUX_ASSIMILE = {
  maladie: 0.13,
  retraiteBase: 0.1715,
  retraiteComplementaire: 0.1293,
  invaliditeDeces: 0.022,
  allocationsFamiliales: 0.0525,
  csg: 0.097,
  crds: 0.005,
  formationPro: 0.0055,
  accidentTravail: 0.02,
  chomage: 0, // pas de chômage pour le dirigeant
};

function calcIR(revenuImposable: number, nbParts: number): number {
  const revenuParPart = revenuImposable / nbParts;
  let impot = 0;
  for (const tranche of TRANCHES_IR) {
    if (revenuParPart <= tranche.min) break;
    const base = Math.min(revenuParPart, tranche.max) - tranche.min;
    impot += base * tranche.taux;
  }
  return Math.round(impot * nbParts);
}

function calcIS(benefice: number): number {
  if (benefice <= 0) return 0;
  if (benefice <= IS_SEUIL_REDUIT) {
    return Math.round(benefice * IS_TAUX_REDUIT);
  }
  return Math.round(IS_SEUIL_REDUIT * IS_TAUX_REDUIT + (benefice - IS_SEUIL_REDUIT) * IS_TAUX_NORMAL);
}

function getNbParts(input: SimulationInput): number {
  if (input.nbParts > 0) return input.nbParts;
  return input.situationFamiliale === 'celibataire' ? 1 : 2;
}

function simulateAutoEntrepreneur(input: SimulationInput): SimulationResult {
  const ca = input.chiffreAffaires;
  const taux = TAUX_AE[input.activite];
  const cotisations = Math.round(ca * taux);
  const revenuApresCharges = ca - cotisations;

  // Abattement forfaitaire pour le calcul IR
  const abattement =
    input.activite === 'commerciale' ? 0.71 : input.activite === 'services' ? 0.5 : 0.34;
  const revenuImposable = Math.round(ca * (1 - abattement));
  const ir = calcIR(revenuImposable + input.autresRevenus, getNbParts(input));

  const revenuNet = revenuApresCharges - ir;

  return {
    statut: 'auto-entrepreneur',
    statutNom: 'Auto-entrepreneur',
    revenuBrut: ca,
    cotisationsSociales: cotisations,
    tauxCotisations: taux,
    revenuApresCharges,
    impotRevenu: ir,
    impotSociete: 0,
    revenuNet,
    revenuNetMensuel: Math.round(revenuNet / 12),
    coutTotal: cotisations + ir,
    protectionRetraite: 2,
    protectionMaladie: 2,
    score: 0,
    recommande: false,
    details: {
      csg: Math.round(ca * 0.097 * (1 - abattement)),
      crds: Math.round(ca * 0.005 * (1 - abattement)),
      formationPro: Math.round(ca * 0.001),
      allocationsFamiliales: 0,
      maladie: 0,
      retraiteBase: 0,
      retraiteComplementaire: 0,
      invaliditeDeces: 0,
    },
  };
}

function simulateTNS(
  input: SimulationInput,
  statutId: StatutJuridique,
  isIS: boolean
): SimulationResult {
  const ca = input.chiffreAffaires;
  const charges = input.charges;
  const remAnnuelle = input.remuneration * 12;
  const benefice = ca - charges;

  let baseRemuneration: number;
  let cotisations: number;
  let ir: number;
  let is = 0;

  if (isIS) {
    baseRemuneration = Math.min(remAnnuelle, benefice * 0.8);
    const detailCotisations = {
      maladie: Math.round(baseRemuneration * TAUX_TNS.maladie),
      retraiteBase: Math.round(baseRemuneration * TAUX_TNS.retraiteBase),
      retraiteComplementaire: Math.round(baseRemuneration * TAUX_TNS.retraiteComplementaire),
      invaliditeDeces: Math.round(baseRemuneration * TAUX_TNS.invaliditeDeces),
      allocationsFamiliales: Math.round(baseRemuneration * TAUX_TNS.allocationsFamiliales),
      csg: Math.round(baseRemuneration * TAUX_TNS.csg),
      crds: Math.round(baseRemuneration * TAUX_TNS.crds),
      formationPro: Math.round(baseRemuneration * TAUX_TNS.formationPro),
    };
    cotisations = Object.values(detailCotisations).reduce((a, b) => a + b, 0);

    const beneficeIS = benefice - baseRemuneration - cotisations;
    is = calcIS(Math.max(0, beneficeIS));

    ir = calcIR(baseRemuneration + input.autresRevenus, getNbParts(input));
    const revenuNet = baseRemuneration - ir;

    return {
      statut: statutId,
      statutNom: statuts.find((s) => s.id === statutId)!.nom,
      revenuBrut: ca,
      cotisationsSociales: cotisations,
      tauxCotisations: baseRemuneration > 0 ? cotisations / baseRemuneration : 0,
      revenuApresCharges: benefice,
      impotRevenu: ir,
      impotSociete: is,
      revenuNet,
      revenuNetMensuel: Math.round(revenuNet / 12),
      coutTotal: cotisations + ir + is + charges,
      protectionRetraite: 3,
      protectionMaladie: 3,
      score: 0,
      recommande: false,
      details: detailCotisations,
    };
  } else {
    // IR : bénéfice imposé au nom de l'exploitant
    baseRemuneration = benefice; // en IR, la rémunération = bénéfice
    const detailCotisations = {
      maladie: Math.round(baseRemuneration * TAUX_TNS.maladie),
      retraiteBase: Math.round(baseRemuneration * TAUX_TNS.retraiteBase),
      retraiteComplementaire: Math.round(baseRemuneration * TAUX_TNS.retraiteComplementaire),
      invaliditeDeces: Math.round(baseRemuneration * TAUX_TNS.invaliditeDeces),
      allocationsFamiliales: Math.round(baseRemuneration * TAUX_TNS.allocationsFamiliales),
      csg: Math.round(baseRemuneration * TAUX_TNS.csg),
      crds: Math.round(baseRemuneration * TAUX_TNS.crds),
      formationPro: Math.round(baseRemuneration * TAUX_TNS.formationPro),
    };
    cotisations = Object.values(detailCotisations).reduce((a, b) => a + b, 0);

    const revenuApresChargesSociales = benefice - cotisations;
    ir = calcIR(revenuApresChargesSociales + input.autresRevenus, getNbParts(input));
    const revenuNet = revenuApresChargesSociales - ir;

    return {
      statut: statutId,
      statutNom: statuts.find((s) => s.id === statutId)!.nom,
      revenuBrut: ca,
      cotisationsSociales: cotisations,
      tauxCotisations: benefice > 0 ? cotisations / benefice : 0,
      revenuApresCharges: benefice,
      impotRevenu: ir,
      impotSociete: 0,
      revenuNet,
      revenuNetMensuel: Math.round(revenuNet / 12),
      coutTotal: cotisations + ir + charges,
      protectionRetraite: 3,
      protectionMaladie: 3,
      score: 0,
      recommande: false,
      details: detailCotisations,
    };
  }
}

function simulateAssimileSalarie(
  input: SimulationInput,
  statutId: StatutJuridique
): SimulationResult {
  const ca = input.chiffreAffaires;
  const charges = input.charges;
  const benefice = ca - charges;
  const remAnnuelle = Math.min(input.remuneration * 12, benefice * 0.7);

  const detailCotisations = {
    maladie: Math.round(remAnnuelle * TAUX_ASSIMILE.maladie),
    retraiteBase: Math.round(remAnnuelle * TAUX_ASSIMILE.retraiteBase),
    retraiteComplementaire: Math.round(remAnnuelle * TAUX_ASSIMILE.retraiteComplementaire),
    invaliditeDeces: Math.round(remAnnuelle * TAUX_ASSIMILE.invaliditeDeces),
    allocationsFamiliales: Math.round(remAnnuelle * TAUX_ASSIMILE.allocationsFamiliales),
    csg: Math.round(remAnnuelle * TAUX_ASSIMILE.csg),
    crds: Math.round(remAnnuelle * TAUX_ASSIMILE.crds),
    formationPro: Math.round(remAnnuelle * TAUX_ASSIMILE.formationPro),
  };
  const cotisations = Object.values(detailCotisations).reduce((a, b) => a + b, 0);

  const beneficeIS = benefice - remAnnuelle - cotisations;
  const is = calcIS(Math.max(0, beneficeIS));

  const ir = calcIR(remAnnuelle + input.autresRevenus, getNbParts(input));
  const revenuNet = remAnnuelle - ir;

  return {
    statut: statutId,
    statutNom: statuts.find((s) => s.id === statutId)!.nom,
    revenuBrut: ca,
    cotisationsSociales: cotisations,
    tauxCotisations: remAnnuelle > 0 ? cotisations / remAnnuelle : 0,
    revenuApresCharges: benefice,
    impotRevenu: ir,
    impotSociete: is,
    revenuNet,
    revenuNetMensuel: Math.round(revenuNet / 12),
    coutTotal: cotisations + ir + is + charges,
    protectionRetraite: 4,
    protectionMaladie: 5,
    score: 0,
    recommande: false,
    details: detailCotisations,
  };
}

function scoreResult(result: SimulationResult, input: SimulationInput): number {
  let score = 0;

  // Revenu net : plus c'est élevé mieux c'est (pondération forte)
  score += result.revenuNet / 1000;

  // Protection sociale
  if (input.protectionSociale === 'maximum') {
    score += result.protectionMaladie * 5;
    score += result.protectionRetraite * 5;
  } else if (input.protectionSociale === 'standard') {
    score += result.protectionMaladie * 2;
    score += result.protectionRetraite * 2;
  }

  // Investisseurs : bonus SAS/SASU
  if (input.investisseurs) {
    if (result.statut === 'sas' || result.statut === 'sasu') {
      score += 20;
    }
  }

  // Pénalité si CA dépasse plafonds auto-entrepreneur
  if (result.statut === 'auto-entrepreneur') {
    const plafond = input.activite === 'commerciale' ? 188700 : 77700;
    if (input.chiffreAffaires > plafond) {
      score -= 100;
    }
  }

  // Bonus simplicité pour faible CA
  if (input.chiffreAffaires < 30000) {
    if (result.statut === 'auto-entrepreneur') score += 15;
    if (result.statut === 'ei') score += 10;
  }

  return Math.round(score * 10) / 10;
}

export function simulateAll(input: SimulationInput): SimulationResult[] {
  const results: SimulationResult[] = [];

  if (input.seul) {
    // Statuts pour entrepreneur seul
    results.push(simulateAutoEntrepreneur(input));
    results.push(simulateTNS(input, 'ei', false));
    results.push(simulateTNS(input, 'eurl-ir', false));
    results.push(simulateTNS(input, 'eurl-is', true));
    results.push(simulateAssimileSalarie(input, 'sasu'));
  } else {
    // Statuts pour plusieurs associés
    results.push(simulateTNS(input, 'sarl', true));
    results.push(simulateAssimileSalarie(input, 'sas'));
  }

  // Calcul des scores
  for (const result of results) {
    result.score = scoreResult(result, input);
  }

  // Tri par score décroissant
  results.sort((a, b) => b.score - a.score);

  // Marquer le meilleur
  if (results.length > 0) {
    results[0].recommande = true;
  }

  return results;
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value);
}
