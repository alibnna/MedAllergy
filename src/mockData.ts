import { DashboardData } from './types';

export const mockDashboardData: DashboardData = {
  patient: {
    id: "P-88219",
    name: "Ahmet Yılmaz",
    age: 42,
    gender: "Male", // Keep as enum value if needed, but display as Turkish
    chronicDiseases: ["Hipertansiyon", "Tip 2 Diyabet"],
    criticalWarning: "Beta-Laktamlara karşı yüksek anafilaksi riski"
  },
  allergies: [
    {
      substance: "Penisilin",
      type: "Drug",
      severity: "High",
      reaction: "Anafilaksi",
      lastReactionDate: "12.11.2023",
      status: "Confirmed"
    },
    {
      substance: "Aspirin",
      type: "Drug",
      severity: "Medium",
      reaction: "Ürtiker",
      lastReactionDate: "05.01.2024",
      status: "Confirmed"
    },
    {
      substance: "Yer Fıstığı",
      type: "Food",
      severity: "High",
      reaction: "Anjiyoödem",
      lastReactionDate: "20.05.2022",
      status: "Confirmed"
    }
  ],
  drugRisks: [
    {
      group: "Beta-Laktam Antibiyotikler",
      riskLevel: "High",
      reason: "Onaylanmış Penisilin alerjisi ve anafilaksi öyküsü.",
      alternatives: ["Makrolidler", "Florokinolonlar"]
    },
    {
      group: "NSAİİ (Non-steroid Anti-inflamatuar)",
      riskLevel: "Caution",
      reason: "Aspirin hassasiyeti nedeniyle çapraz reaksiyon riski.",
      alternatives: ["Asetaminofen"]
    },
    {
      group: "Statinler",
      riskLevel: "Safe",
      reason: "Bilinen bir kontrendikasyon yok.",
      alternatives: []
    }
  ],
  effectiveness: [
    {
      drugName: "Klaritromisin",
      score: 92,
      previousResponse: "Mükemmel"
    },
    {
      drugName: "Metformin",
      score: 85,
      previousResponse: "Stabil"
    },
    {
      drugName: "Lisinopril",
      score: 45,
      previousResponse: "Kuru öksürük bildirildi"
    }
  ],
  aiRecommendation: {
    avoid: ["Amoksisilin", "Seftriakson", "İbuprofen"],
    consider: ["Azitromisin", "Parasetamol", "Amlodipin"],
    tests: ["Sefalosporinler için spesifik IgE", "Gözetim altında NSAİİ oral yükleme testi"],
    summary: "Hastanın şiddetli Beta-Laktam alerjisi öyküsü bulunmaktadır. Tüm penisilinlerden kaçınılmalı ve sefalosporinler aşırı dikkatle kullanılmalı veya tamamen kaçınılmalıdır. Enfeksiyonlar için Makrolidler değerlendirilebilir."
  },
  riskScores: [
    { category: "Anafilaksi", score: 88 },
    { category: "Yan Etki", score: 42 },
    { category: "Acil Durum Riski", score: 65 }
  ],
  history: [
    { date: "05.01.2024", drug: "Aspirin", reaction: "Ürtiker", severity: "Medium" },
    { date: "12.11.2023", drug: "Penisilin G", reaction: "Anafilaksi", severity: "High" },
    { date: "15.08.2022", drug: "Lisinopril", reaction: "Kuru Öksürük", severity: "Low" }
  ],
  confidenceLevel: 94
};
