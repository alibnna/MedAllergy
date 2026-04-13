export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  chronicDiseases: string[];
  criticalWarning?: string;
}

export interface Allergy {
  substance: string;
  type: 'Drug' | 'Food' | 'Environmental';
  severity: 'Low' | 'Medium' | 'High';
  reaction: string;
  lastReactionDate: string;
  status: 'Confirmed' | 'Suspected';
}

export interface DrugRisk {
  group: string;
  riskLevel: 'High' | 'Caution' | 'Safe';
  reason: string;
  alternatives?: string[];
}

export interface EffectivenessScore {
  drugName: string;
  score: number; // 0-100
  previousResponse?: string;
}

export interface AIRecommendation {
  avoid: string[];
  consider: string[];
  tests: string[];
  summary: string;
}

export interface RiskScore {
  category: string;
  score: number; // 0-100
}

export interface HistoryItem {
  date: string;
  drug: string;
  reaction: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface DashboardData {
  patient: Patient;
  allergies: Allergy[];
  drugRisks: DrugRisk[];
  effectiveness: EffectivenessScore[];
  aiRecommendation: AIRecommendation;
  riskScores: RiskScore[];
  history: HistoryItem[];
  confidenceLevel: number; // 0-100
}
