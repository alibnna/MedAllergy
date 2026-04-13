import { DashboardData } from "../types";

export async function getDrugAlternatives(patientData: DashboardData, targetDrug: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return mock data based on target drug
  const isBetaLactam = targetDrug.toLowerCase().includes('amoksisilin') || 
                       targetDrug.toLowerCase().includes('penisilin') || 
                       targetDrug.toLowerCase().includes('sefalosporin');

  if (isBetaLactam) {
    return {
      "riskAnalysis": `${targetDrug} bir Beta-Laktam türevidir. Hastanın geçmişindeki şiddetli Penisilin alerjisi ve anafilaksi öyküsü nedeniyle bu ilacın kullanımı hayati risk taşır.`,
      "alternatives": [
        { 
          "drug": "Azitromisin (Makrolid)", 
          "rationale": "Beta-Laktam halkası içermez, çapraz reaksiyon riski yoktur. Üst solunum yolu enfeksiyonlarında etkili bir alternatiftir." 
        },
        { 
          "drug": "Klaritromisin", 
          "rationale": "Hastanın geçmişinde iyi tolere edildiği (Etkinlik Skoru: %92) görülmektedir." 
        },
        { 
          "drug": "Siprofloksasin (Florokinolon)", 
          "rationale": "Ciddi enfeksiyonlarda Penisilin alerjisi olan hastalar için güvenli bir seçenektir." 
        }
      ],
      "recommendedTests": [
        "Sefalosporin spesifik IgE testi",
        "Bazofil Aktivasyon Testi (BAT)",
        "Gerekirse uzman gözetiminde kademeli ilaç yükleme testi"
      ]
    };
  }

  return {
    "riskAnalysis": `${targetDrug} için hastanın mevcut profilinde doğrudan bir kontrendikasyon saptanmadı, ancak dikkatli izlem önerilir.`,
    "alternatives": [
      { 
        "drug": "Parasetamol", 
        "rationale": "Ağrı yönetimi için NSAİİ hassasiyeti olan bu hastada en güvenli seçenektir." 
      }
    ],
    "recommendedTests": [
      "Karaciğer fonksiyon testleri (uzun süreli kullanımda)",
      "Rutin hemogram takibi"
    ]
  };
}
