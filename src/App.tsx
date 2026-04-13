import { useState } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  Menu, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar,
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PatientSnapshot, 
  AllergyProfile, 
  DrugRiskPanel, 
  EffectivenessScorePanel, 
  AIRecommendationPanel, 
  RiskScorePanel, 
  HistoryTimeline, 
  SimilarPatientsPanel, 
  ConfidenceLevelPanel, 
  QuickActionsPanel 
} from './components/Dashboard';
import { mockDashboardData } from './mockData';
import { cn } from './lib/utils';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
  const data = mockDashboardData;

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 lg:relative",
        isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:translate-x-0 lg:w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
            <LayoutDashboard size={20} />
          </div>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <h1 className={cn("font-bold text-xl tracking-tight", !isSidebarOpen && "lg:hidden")}>
              MedAllergy<span className="text-blue-600">AI</span>
            </h1>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={LayoutDashboard} label="Panel" active isSidebarOpen={isSidebarOpen} />
          <NavItem icon={Users} label="Hastalar" isSidebarOpen={isSidebarOpen} />
          <NavItem icon={FileText} label="Raporlar" isSidebarOpen={isSidebarOpen} />
          <NavItem icon={Calendar} label="Randevular" isSidebarOpen={isSidebarOpen} />
          <div className="pt-4 pb-2">
            <div className="h-px bg-slate-100 mx-2" />
          </div>
          <NavItem icon={Settings} label="Ayarlar" isSidebarOpen={isSidebarOpen} />
          <NavItem icon={HelpCircle} label="Yardım" isSidebarOpen={isSidebarOpen} />
        </nav>

        <div className="p-4">
          <button className="w-full flex items-center gap-3 p-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-semibold">Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="max-w-md w-full relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Hasta, ilaç veya kayıt ara..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1 md:mx-2" />
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-900">Dr. Sarah Smith</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">İmmünolog</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden shrink-0">
                <img src="https://picsum.photos/seed/doctor/100/100" alt="Avatar" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-8">
            {/* Top Row: Patient Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
              <PatientSnapshot patient={data.patient} />
              <RiskScorePanel scores={data.riskScores} />
              <QuickActionsPanel data={data} />
            </div>

            {/* Middle Row: Core Allergy & Risk */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
              <AllergyProfile allergies={data.allergies} />
              <DrugRiskPanel risks={data.drugRisks} />
              <EffectivenessScorePanel scores={data.effectiveness} />
            </div>

            {/* Bottom Row: AI & History */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
              <AIRecommendationPanel rec={data.aiRecommendation} />
              <ConfidenceLevelPanel level={data.confidenceLevel} />
            </div>

            {/* Final Row: Timeline & Similar Patients */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
              <HistoryTimeline history={data.history} />
              <SimilarPatientsPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, isSidebarOpen }: { icon: any, label: string, active?: boolean, isSidebarOpen: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
      active 
        ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    )}>
      <Icon size={20} className={cn(active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
      {(isSidebarOpen || window.innerWidth >= 1024) && (
        <span className={cn("font-semibold", !isSidebarOpen && "lg:hidden")}>{label}</span>
      )}
    </button>
  );
}
