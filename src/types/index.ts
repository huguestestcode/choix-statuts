export type StatutJuridique =
  | 'auto-entrepreneur'
  | 'ei'
  | 'eurl-ir'
  | 'eurl-is'
  | 'sarl'
  | 'sasu'
  | 'sas';

export interface StatutInfo {
  id: StatutJuridique;
  nom: string;
  nomComplet: string;
  description: string;
  avantages: string[];
  inconvenients: string[];
  regimeSocial: 'TNS' | 'Assimilé salarié';
  regimeFiscal: string;
  responsabilite: string;
  capitalMinimum: string;
  nbAssocies: string;
  formalites: 'Simples' | 'Moyennes' | 'Complexes';
  coutCreation: string;
  idealPour: string[];
  color: string;
}

export interface SimulationInput {
  chiffreAffaires: number;
  charges: number;
  remuneration: number;
  activite: 'services' | 'commerciale' | 'liberale';
  situationFamiliale: 'celibataire' | 'marie' | 'pacse';
  nbParts: number;
  autresRevenus: number;
  seul: boolean;
  protectionSociale: 'minimum' | 'standard' | 'maximum';
  investisseurs: boolean;
  chiffreAffairesCible: 'faible' | 'moyen' | 'eleve' | 'tres_eleve';
}

export interface SimulationResult {
  statut: StatutJuridique;
  statutNom: string;
  revenuBrut: number;
  cotisationsSociales: number;
  tauxCotisations: number;
  revenuApresCharges: number;
  impotRevenu: number;
  impotSociete: number;
  revenuNet: number;
  revenuNetMensuel: number;
  coutTotal: number;
  protectionRetraite: number; // 1-5
  protectionMaladie: number; // 1-5
  score: number;
  recommande: boolean;
  details: {
    csg: number;
    crds: number;
    formationPro: number;
    allocationsFamiliales: number;
    maladie: number;
    retraiteBase: number;
    retraiteComplementaire: number;
    invaliditeDeces: number;
  };
}

export interface QuestionnaireStep {
  id: string;
  question: string;
  description: string;
  type: 'choice' | 'number' | 'slider';
  options?: { value: string; label: string; icon: string; description: string }[];
  field: keyof SimulationInput;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export type Theme = 'light' | 'dark';
