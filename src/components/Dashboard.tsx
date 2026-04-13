import React, { useState } from 'react';
import { 
  User, 
  AlertCircle, 
  ShieldAlert, 
  Activity, 
  Brain, 
  History, 
  Users, 
  CheckCircle2, 
  ChevronRight,
  Download,
  PlusCircle,
  AlertTriangle,
  Info,
  X,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { cn } from '../lib/utils';
import { DashboardData, Allergy, DrugRisk, EffectivenessScore, HistoryItem } from '../types';
import { getDrugAlternatives } from '../services/geminiService';

// --- Sub-components ---

const Card = ({ children, className, title, icon: Icon }: { children: React.ReactNode, className?: string, title?: string, icon?: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", className)}
  >
    {(title || Icon) && (
      <div className="px-6 py-4 border-bottom border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-slate-500" />}
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </motion.div>
);

const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'danger' | 'warning' | 'success' | 'info', className?: string, key?: any }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-amber-100 text-amber-700',
    success: 'bg-emerald-100 text-emerald-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
};

// --- Main Sections ---

export const PatientSnapshot = ({ patient }: { patient: DashboardData['patient'] }) => (
  <Card className="col-span-full lg:col-span-4" title="Hasta Özeti" icon={User}>
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
          <User size={32} />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 truncate">{patient.name}</h2>
          <p className="text-slate-500 text-sm">ID: {patient.id} • {patient.age} Yaş • {patient.gender === 'Male' ? 'Erkek' : 'Kadın'}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kronik Hastalıklar</p>
        <div className="flex flex-wrap gap-2">
          {patient.chronicDiseases.map(disease => (
            <Badge key={disease} variant="info">{disease}</Badge>
          ))}
        </div>
      </div>

      {patient.criticalWarning && (
        <div className="mt-2 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-red-800 font-semibold">{patient.criticalWarning}</p>
        </div>
      )}
    </div>
  </Card>
);

export const AllergyProfile = ({ allergies }: { allergies: Allergy[] }) => (
  <Card className="lg:col-span-4" title="Alerji Profili" icon={ShieldAlert}>
    <div className="space-y-3">
      {allergies.map((allergy, idx) => (
        <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-900 truncate">{allergy.substance}</span>
            <span className="text-xs text-slate-500 truncate">{allergy.reaction}</span>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
            <Badge variant={allergy.severity === 'High' ? 'danger' : allergy.severity === 'Medium' ? 'warning' : 'default'}>
              {allergy.severity === 'High' ? 'Ciddi' : allergy.severity === 'Medium' ? 'Orta' : 'Hafif'}
            </Badge>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Son: {allergy.lastReactionDate}</span>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export const DrugRiskPanel = ({ risks }: { risks: DrugRisk[] }) => (
  <Card className="lg:col-span-4" title="İlaç Risk Paneli" icon={AlertTriangle}>
    <div className="space-y-4">
      {risks.map((risk, idx) => (
        <div key={idx} className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-slate-900 text-sm md:text-base">{risk.group}</span>
            <Badge variant={risk.riskLevel === 'High' ? 'danger' : risk.riskLevel === 'Caution' ? 'warning' : 'success'}>
              {risk.riskLevel === 'High' ? 'Yüksek Risk' : risk.riskLevel === 'Caution' ? 'Dikkat' : 'Güvenli'}
            </Badge>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{risk.reason}</p>
          {risk.alternatives && risk.alternatives.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Alternatifler:</span>
              <div className="flex flex-wrap gap-1">
                {risk.alternatives.map(alt => (
                  <span key={alt} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">{alt}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </Card>
);

export const EffectivenessScorePanel = ({ scores }: { scores: EffectivenessScore[] }) => (
  <Card className="lg:col-span-4" title="Etkinlik Tahmini" icon={Activity}>
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={scores} layout="vertical" margin={{ left: 0, right: 20 }}>
          <XAxis type="number" hide domain={[0, 100]} />
          <YAxis dataKey="drugName" type="category" width={80} tick={{ fontSize: 10, fontWeight: 600 }} />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {scores.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#10b981' : entry.score > 50 ? '#f59e0b' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="mt-4 space-y-2">
      {scores.map(s => (
        <div key={s.drugName} className="flex items-center justify-between text-[10px] md:text-xs">
          <span className="text-slate-500">{s.drugName}</span>
          <span className="font-semibold text-slate-700">{s.previousResponse || 'Veri Yok'}</span>
        </div>
      ))}
    </div>
  </Card>
);

export const AIRecommendationPanel = ({ rec }: { rec: DashboardData['aiRecommendation'] }) => (
  <Card className="lg:col-span-8" title="AI Klinik Öneri" icon={Brain}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-sm text-slate-700 leading-relaxed italic">"{rec.summary}"</p>
        </div>
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Önerilen Testler</h4>
          <ul className="space-y-1">
            {rec.tests.map((test, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span className="truncate">{test}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Kaçınılmalı</h4>
          <div className="flex flex-wrap gap-2">
            {rec.avoid.map(item => (
              <Badge key={item} variant="danger">{item}</Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Düşünülebilir</h4>
          <div className="flex flex-wrap gap-2">
            {rec.consider.map(item => (
              <Badge key={item} variant="success">{item}</Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  </Card>
);

export const RiskScorePanel = ({ scores }: { scores: DashboardData['riskScores'] }) => (
  <Card className="lg:col-span-4" title="Klinik Risk Skorları" icon={Activity}>
    <div className="space-y-6">
      {scores.map(score => (
        <div key={score.category} className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-sm font-semibold text-slate-700">{score.category}</span>
            <span className={cn(
              "text-xl font-bold",
              score.score > 75 ? "text-red-600" : score.score > 40 ? "text-amber-600" : "text-emerald-600"
            )}>{score.score}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${score.score}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                score.score > 75 ? "bg-red-500" : score.score > 40 ? "bg-amber-500" : "bg-emerald-500"
              )}
            />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export const HistoryTimeline = ({ history }: { history: HistoryItem[] }) => (
  <Card className="lg:col-span-8" title="Geçmiş İlaç ve Reaksiyonlar" icon={History}>
    <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
      {history.map((item, idx) => (
        <div key={idx} className="relative pl-8">
          <div className={cn(
            "absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center",
            item.severity === 'High' ? "bg-red-500" : item.severity === 'Medium' ? "bg-amber-500" : "bg-blue-500"
          )} />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
              <h4 className="font-bold text-slate-900">{item.drug}</h4>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">{item.reaction}</span>
              <Badge variant={item.severity === 'High' ? 'danger' : item.severity === 'Medium' ? 'warning' : 'default'}>
                {item.severity === 'High' ? 'Ciddi' : item.severity === 'Medium' ? 'Orta' : 'Hafif'}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export const SimilarPatientsPanel = () => (
  <Card className="lg:col-span-4" title="Benzer Hasta Analizi" icon={Users}>
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
        <Users className="text-blue-600 shrink-0" size={20} />
        <p className="text-xs text-blue-800 font-medium">1.240+ benzer profil ile eşleşti</p>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Makrolid Başarısı</span>
          <span className="font-bold text-emerald-600">88%</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">NSAİİ Hassasiyeti</span>
          <span className="font-bold text-amber-600">12%</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Anafilaksi Riski</span>
          <span className="font-bold text-red-600">0.4%</span>
        </div>
      </div>
      <button className="w-full py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1">
        Kohort Verilerini Gör <ChevronRight size={14} />
      </button>
    </div>
  </Card>
);

export const ConfidenceLevelPanel = ({ level }: { level: number }) => (
  <Card className="lg:col-span-4" title="Veri Güven Skoru" icon={CheckCircle2}>
    <div className="flex flex-col items-center justify-center py-4 gap-4">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="58"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={364.4}
            initial={{ strokeDashoffset: 364.4 }}
            animate={{ strokeDashoffset: 364.4 - (364.4 * level) / 100 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="text-emerald-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-800">{level}%</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Güvenilir</span>
        </div>
      </div>
      <p className="text-[10px] text-center text-slate-500 px-4">
        Onaylanmış klinik kayıtlar, güncel laboratuvar sonuçları ve hasta öyküsüne dayanmaktadır.
      </p>
    </div>
  </Card>
);

export const QuickActionsPanel = ({ data }: { data: DashboardData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [targetDrug, setTargetDrug] = useState('Amoksisilin');

  const handleSuggest = async () => {
    setLoading(true);
    setIsModalOpen(true);
    try {
      const result = await getDrugAlternatives(data, targetDrug);
      setAiResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="lg:col-span-4" title="Hızlı Aksiyon Paneli" icon={PlusCircle}>
        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={handleSuggest}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-blue-300 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Brain size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-800">Alternatif Öner</p>
              <p className="text-[10px] text-slate-500">AI destekli ilaç eşleştirme</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-blue-300 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <Download size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-800">Risk Raporu İndir</p>
              <p className="text-[10px] text-slate-500">Klinik kayıt için PDF</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-blue-300 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
              <Activity size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-800">Test Önerisi Oluştur</p>
              <p className="text-[10px] text-slate-500">Lab istemi oluştur</p>
            </div>
          </button>
        </div>
      </Card>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg text-white">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">AI Alternatif Önerisi</h3>
                    <p className="text-xs text-slate-500">Klinik Karar Destek Sistemi</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hedef İlaç</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={targetDrug}
                      onChange={(e) => setTargetDrug(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button 
                      onClick={handleSuggest}
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : 'Analiz Et'}
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p className="text-slate-500 font-medium animate-pulse">Hasta profili ve çapraz reaksiyonlar analiz ediliyor...</p>
                  </div>
                ) : aiResult ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                      <h4 className="text-sm font-bold text-amber-800 mb-1">Risk Analizi</h4>
                      <p className="text-sm text-amber-700 leading-relaxed">{aiResult.riskAnalysis}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Önerilen Alternatifler</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {aiResult.alternatives.map((alt: any, i: number) => (
                          <div key={i} className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                            <p className="font-bold text-slate-900 mb-1">{alt.drug}</p>
                            <p className="text-sm text-slate-600 leading-relaxed">{alt.rationale}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Önerilen Testler</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiResult.recommendedTests.map((test: string, i: number) => (
                          <Badge key={i} variant="info">{test}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <Brain size={48} className="mx-auto mb-4 opacity-20" />
                    <p>AI destekli alternatifleri ve risk analizini görmek için bir ilaç adı girin.</p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
