/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ScanLine, 
  LineChart, 
  History, 
  Trophy, 
  QrCode, 
  Bell, 
  X, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { ActiveTab, Navbar } from './components/Navbar';
import { HealthScoreCard } from './components/HealthScoreCard';
import { MathModelView } from './components/MathModelView';
import { HistoryTrends } from './components/HistoryTrends';
import { ChallengesLeaderboard } from './components/ChallengesLeaderboard';
import { QrGenerator } from './components/QrGenerator';
import { ScannerModal } from './components/ScannerModal';
import { SocialShareModal } from './components/SocialShareModal';
import { NotificationSettings } from './components/NotificationSettings';
import { TeacherVivaModal } from './components/TeacherVivaModal';

import { FoodItem, HealthEvaluation, LeaderboardUser, NutritionChallenge, ReminderSetting, ScanRecord, WeeklyMilestone } from './types/nutrition';
import { SAMPLE_FOODS } from './data/sampleFoods';
import { evaluateFoodHealth } from './utils/fssaiEngine';
import { 
  addXp, 
  getStoredChallenges, 
  getStoredReminders, 
  getStoredScans, 
  getUserStreak, 
  getUserXp, 
  INITIAL_LEADERBOARD, 
  INITIAL_MILESTONES, 
  saveChallenges, 
  saveReminders, 
  saveScanRecord 
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scanner');
  
  // Scanned Food State - Default to Marie Biscuits from user prompt
  const [currentFood, setCurrentFood] = useState<FoodItem>(SAMPLE_FOODS[0]);
  const [evaluation, setEvaluation] = useState<HealthEvaluation>(evaluateFoodHealth(SAMPLE_FOODS[0]));

  // Stored state
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [xp, setXp] = useState<number>(980);
  const [streak, setStreak] = useState<number>(6);
  const [challenges, setChallenges] = useState<NutritionChallenge[]>([]);
  const [milestones, setMilestones] = useState<WeeklyMilestone[]>(INITIAL_MILESTONES);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);
  const [reminders, setReminders] = useState<ReminderSetting[]>([]);

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState<boolean>(false);
  const [isVivaOpen, setIsVivaOpen] = useState<boolean>(false);

  // In-app alert banner
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Initialize data from local storage
  useEffect(() => {
    const loadedScans = getStoredScans();
    setScans(loadedScans);
    setXp(getUserXp());
    setStreak(getUserStreak());
    setChallenges(getStoredChallenges());
    setReminders(getStoredReminders());

    // Update user rank in leaderboard based on current XP
    updateLeaderboardWithUser(getUserXp());
  }, []);

  const updateLeaderboardWithUser = (currentXp: number) => {
    setLeaderboard((prev) => {
      const updated = prev.map((u) => (u.isCurrentUser ? { ...u, xp: currentXp } : u));
      return updated.sort((a, b) => b.xp - a.xp).map((u, idx) => ({ ...u, rank: idx + 1 }));
    });
  };

  const handleFoodScanned = (food: FoodItem) => {
    setCurrentFood(food);
    const newEval = evaluateFoodHealth(food);
    setEvaluation(newEval);

    // Save automatically to history and award XP
    const record = saveScanRecord(food, food.servingSizeGrams || 50);
    setScans((prev) => [record, ...prev]);
    const updatedXp = getUserXp();
    setXp(updatedXp);
    updateLeaderboardWithUser(updatedXp);

    // Check milestones and challenges progress
    updateMilestoneProgress('m-1'); // log scans
    if (food.fiberPer100g && food.fiberPer100g >= 5) {
      updateMilestoneProgress('m-2');
    }

    // Trigger toast notification
    triggerAlert(`Scanned "${food.name}" • Health Score: ${newEval.score}/100 (${newEval.tag})`);
  };

  const updateMilestoneProgress = (milestoneId: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === milestoneId && m.progress < m.goal) {
          const newProg = m.progress + 1;
          return { ...m, progress: newProg };
        }
        return m;
      })
    );
  };

  const handleLogScan = (food: FoodItem, portionGrams: number) => {
    const record = saveScanRecord(food, portionGrams);
    setScans((prev) => [record, ...prev]);
    const updatedXp = getUserXp();
    setXp(updatedXp);
    updateLeaderboardWithUser(updatedXp);
    triggerAlert(`Logged ${portionGrams}g of ${food.name}! +50 XP added to your ranking.`);
  };

  const handleClaimMilestone = (id: string, milestoneXp: number) => {
    const updated = addXp(milestoneXp);
    setXp(updated);
    updateLeaderboardWithUser(updated);
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: true } : m))
    );
    triggerAlert(`Claimed +${milestoneXp} XP milestone reward!`);
  };

  const handleJoinChallenge = (id: string) => {
    setChallenges((prev) => {
      const updated = prev.map((ch) => {
        if (ch.id === id) {
          const nextCount = Math.min(ch.targetCount, ch.currentCount + 1);
          return {
            ...ch,
            currentCount: nextCount,
            completed: nextCount >= ch.targetCount,
          };
        }
        return ch;
      });
      saveChallenges(updated);
      return updated;
    });
    triggerAlert('Challenge progress updated! Keep auditing healthy foods.');
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
      saveReminders(updated);
      return updated;
    });
  };

  const triggerAlert = (message: string) => {
    setActiveAlert(message);
    setTimeout(() => {
      setActiveAlert(null);
    }, 4500);

    // Browser Notification if supported and granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Scan2Know Reminder', {
          body: message,
          icon: '/favicon.ico',
        });
      } catch {
        // ignore
      }
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your historical scan database?')) {
      localStorage.removeItem('scan2know_scans_v1');
      setScans([]);
    }
  };

  const handleDeleteScan = (id: string) => {
    const updated = scans.filter((s) => s.id !== id);
    setScans(updated);
    localStorage.setItem('scan2know_scans_v1', JSON.stringify(updated));
  };

  const handleOpenMathForFood = (food: FoodItem) => {
    setCurrentFood(food);
    setEvaluation(evaluateFoodHealth(food));
    setActiveTab('math');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streak={streak}
        xp={xp}
        onOpenReminders={() => setIsRemindersOpen(true)}
        onOpenVivaModal={() => setIsVivaOpen(true)}
      />

      {/* Floating In-App Reminder / Notification Toast */}
      {activeAlert && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 border border-emerald-500/50 p-4 rounded-2xl shadow-2xl shadow-emerald-500/10 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              Scan2Know Notification
            </span>
            <p className="text-xs text-slate-200 mt-0.5 leading-snug">{activeAlert}</p>
          </div>
          <button
            onClick={() => setActiveAlert(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* TAB 1: SCANNER & "IS THIS HEALTHY?" CARD */}
        {activeTab === 'scanner' && (
          <div className="space-y-8">
            
            {/* Quick Action Hero Banner */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40">
                    FSSAI Compliance Engine
                  </span>
                  <span className="text-xs text-slate-400">• CBSE Section 8 Real-Life Link</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Is This Healthy? Smart Nutrition Scanner
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Scan any packaged snack QR code or choose a reference packet below to analyze sugar, fat, salt, fiber, and protein.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold transition-all shadow-lg shadow-emerald-500/25"
                >
                  <ScanLine className="w-4 h-4" />
                  <span>Scan QR / Packet</span>
                </button>

                <button
                  onClick={() => setIsVivaOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                  <span>Teacher Script</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Health Score Card */}
            <HealthScoreCard
              food={currentFood}
              evaluation={evaluation}
              onOpenMathModel={handleOpenMathForFood}
              onOpenShareModal={(f, e) => {
                setCurrentFood(f);
                setEvaluation(e);
                setIsShareOpen(true);
              }}
              onLogScan={handleLogScan}
              onScanNew={() => setIsScannerOpen(true)}
            />

            {/* Quick-Switch Reference Packets Bar (Green, Yellow, Red comparison as requested) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Quick Comparative Packets (CBSE Viva Extra Marks)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Switch between Green, Yellow, and Red products to demonstrate contrast to your teacher.
                  </p>
                </div>
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="text-xs text-emerald-400 hover:underline font-bold"
                >
                  View All 6 &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Green Choice */}
                <div
                  onClick={() => handleFoodScanned(SAMPLE_FOODS[1])}
                  className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">{SAMPLE_FOODS[1].name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300">
                      Green (Healthy)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Sugar: <strong>{SAMPLE_FOODS[1].sugarPer100g}g</strong> • Fiber: <strong>{SAMPLE_FOODS[1].fiberPer100g}g</strong>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-2">
                    S(x) = 0.02x • Extremely Safe Limit
                  </div>
                </div>

                {/* 2. Yellow Choice (Marie Biscuits from prompt) */}
                <div
                  onClick={() => handleFoodScanned(SAMPLE_FOODS[0])}
                  className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">{SAMPLE_FOODS[0].name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300">
                      Yellow (Moderate)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Sugar: <strong>{SAMPLE_FOODS[0].sugarPer100g}g</strong> • MRP: <strong>₹{SAMPLE_FOODS[0].mrp}</strong>
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono mt-2">
                    S(x) = 0.20x • 250g = 50g Daily Limit
                  </div>
                </div>

                {/* 3. Red Choice */}
                <div
                  onClick={() => handleFoodScanned(SAMPLE_FOODS[2])}
                  className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">{SAMPLE_FOODS[2].name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-300">
                      Red (Limit)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Sugar: <strong>{SAMPLE_FOODS[2].sugarPer100g}g</strong> • Fat: <strong>{SAMPLE_FOODS[2].fatPer100g}g</strong>
                  </div>
                  <div className="text-[10px] text-rose-400 font-mono mt-2">
                    S(x) = 0.56x • Only 89g crosses full day!
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: CBSE LINEAR POLYNOMIAL SECTION 8 */}
        {activeTab === 'math' && (
          <MathModelView
            selectedFood={currentFood}
            onSelectFood={(f) => {
              setCurrentFood(f);
              setEvaluation(evaluateFoodHealth(f));
            }}
            availableFoods={SAMPLE_FOODS}
          />
        )}

        {/* TAB 3: HISTORICAL SCAN TRENDS & PDF EXPORT */}
        {activeTab === 'history' && (
          <HistoryTrends
            scans={scans}
            onSelectFood={(f) => {
              setCurrentFood(f);
              setEvaluation(evaluateFoodHealth(f));
              setActiveTab('scanner');
            }}
            onClearHistory={handleClearHistory}
            onDeleteScan={handleDeleteScan}
          />
        )}

        {/* TAB 4: CHALLENGES & LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <ChallengesLeaderboard
            challenges={challenges}
            milestones={milestones}
            leaderboard={leaderboard}
            userXp={xp}
            userStreak={streak}
            onClaimMilestone={handleClaimMilestone}
            onJoinChallenge={handleJoinChallenge}
            onOpenSocialShare={() => setIsShareOpen(true)}
          />
        )}

        {/* TAB 5: QR GENERATOR & PRINT MAKER */}
        {activeTab === 'generator' && (
          <QrGenerator
            onScanGeneratedFood={(food) => {
              handleFoodScanned(food);
              setActiveTab('scanner');
            }}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Scan2Know</span>
            <span>•</span>
            <span>FSSAI Nutrition Standards & CBSE Class 10/12 Linear Polynomial Project</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsVivaOpen(true)} className="hover:text-white underline">
              Teacher Script
            </button>
            <button onClick={() => setActiveTab('generator')} className="hover:text-white underline">
              Printable QR Codes
            </button>
            <button onClick={() => setIsRemindersOpen(true)} className="hover:text-white underline">
              Daily Reminders
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onFoodScanned={handleFoodScanned}
      />

      <SocialShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        food={currentFood}
        evaluation={evaluation}
      />

      <NotificationSettings
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
        reminders={reminders}
        onToggleReminder={handleToggleReminder}
        onTestNotification={triggerAlert}
      />

      <TeacherVivaModal
        isOpen={isVivaOpen}
        onClose={() => setIsVivaOpen(false)}
      />

    </div>
  );
}
