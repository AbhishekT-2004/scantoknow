import React from 'react';
import { 
  ScanLine, 
  LineChart, 
  History, 
  Trophy, 
  QrCode, 
  Flame, 
  Sparkles,
  Bell,
  GraduationCap
} from 'lucide-react';

export type ActiveTab = 'scanner' | 'math' | 'history' | 'leaderboard' | 'generator';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  streak: number;
  xp: number;
  onOpenReminders: () => void;
  onOpenVivaModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  streak,
  xp,
  onOpenReminders,
  onOpenVivaModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('scanner')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ScanLine className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Scan<span className="text-emerald-400">2</span>Know</span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-full">
                  FSSAI Ready
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 rounded-full">
                  CBSE Maths
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Is This Healthy? Smart Nutrition & Linear Polynomials
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'scanner'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ScanLine className="w-4 h-4" />
              Is This Healthy?
            </button>

            <button
              onClick={() => setActiveTab('math')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'math'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <LineChart className="w-4 h-4" />
              CBSE Linear Math
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <History className="w-4 h-4" />
              Trends & PDF
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Challenges & Rank
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'generator'
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <QrCode className="w-4 h-4" />
              QR Maker
            </button>
          </nav>

          {/* Gamification / Reminders / Viva action buttons */}
          <div className="flex items-center gap-2">
            {/* CBSE Viva Quick Button */}
            <button
              onClick={onOpenVivaModal}
              title="Open Teacher Viva Script & Flashcards"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-900/40 text-indigo-300 border border-indigo-700/50 hover:bg-indigo-900/70 transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden lg:inline">Viva Prep</span>
            </button>

            {/* Daily Reminders Toggle */}
            <button
              onClick={onOpenReminders}
              title="Daily Habit Reminders"
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900"></span>
            </button>

            {/* Streak Badge */}
            <div 
              title={`${streak} Days Health Tracking Streak!`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-950/60 border border-orange-800/50 text-orange-400 text-xs font-bold"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
              <span>{streak}d</span>
            </div>

            {/* XP Badge */}
            <div 
              title={`${xp} Total Health Scholar XP`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/50 text-amber-400 text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{xp} XP</span>
            </div>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-800/60 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'scanner' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Health Check
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'math' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400'
            }`}
          >
            CBSE Math
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'history' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            History & PDF
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'leaderboard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Rank & Challenges
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'generator' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400'
            }`}
          >
            QR Maker
          </button>
        </div>

      </div>
    </header>
  );
};
