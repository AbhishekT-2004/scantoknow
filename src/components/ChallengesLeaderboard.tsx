import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Target, 
  Users, 
  ShieldCheck, 
  Medal,
  PartyPopper,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LeaderboardUser, NutritionChallenge, WeeklyMilestone } from '../types/nutrition';

interface ChallengesLeaderboardProps {
  challenges: NutritionChallenge[];
  milestones: WeeklyMilestone[];
  leaderboard: LeaderboardUser[];
  userXp: number;
  userStreak: number;
  onClaimMilestone: (id: string, xp: number) => void;
  onJoinChallenge: (id: string) => void;
  onOpenSocialShare: () => void;
}

export const ChallengesLeaderboard: React.FC<ChallengesLeaderboardProps> = ({
  challenges,
  milestones,
  leaderboard,
  userXp,
  userStreak,
  onClaimMilestone,
  onJoinChallenge,
  onOpenSocialShare,
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges'>('leaderboard');

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#6366f1', '#ec4899'],
    });
  };

  const handleClaim = (milestone: WeeklyMilestone) => {
    triggerCelebration();
    onClaimMilestone(milestone.id, milestone.xp);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 p-6 sm:p-7 rounded-2xl border border-amber-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Gamified Health & CBSE Competition
            </span>
            <span className="text-xs text-slate-400">Class & Peer Leaderboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Weekly Milestones & Leaderboard
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Hit weekly nutrition milestones, avoid Red labels, earn Health Scholar XP, and compare your score with classmates!
          </p>
        </div>

        {/* User Quick Trophy Stats */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 shrink-0">
          <div className="text-center px-2">
            <div className="flex items-center justify-center gap-1 text-orange-400 text-sm font-bold">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>{userStreak} Days</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Streak</span>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div className="text-center px-2">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{userXp} XP</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Points</span>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <button
            onClick={onOpenSocialShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            <span>Share Rank</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* WEEKLY MILESTONES SECTION (Direct user prompt request) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base text-white">This Week&apos;s Milestones</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Resets in 2 days</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m) => {
            const isReadyToClaim = m.progress >= m.goal && !m.completed;
            const pct = Math.min(100, Math.round((m.progress / m.goal) * 100));

            return (
              <div 
                key={m.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-amber-400">+{m.xp} XP</span>
                    <span className="text-slate-400 font-mono">{m.progress}/{m.goal}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 leading-tight">{m.title}</h3>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full transition-all duration-300 ${
                        m.completed || isReadyToClaim ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div>
                  {m.completed ? (
                    <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/40 rounded-lg border border-emerald-800/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed!</span>
                    </div>
                  ) : isReadyToClaim ? (
                    <button
                      onClick={() => handleClaim(m)}
                      className="w-full py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1 animate-pulse"
                    >
                      <PartyPopper className="w-3.5 h-3.5" />
                      <span>Claim +{m.xp} XP</span>
                    </button>
                  ) : (
                    <div className="text-center py-1.5 text-xs text-slate-500 font-medium">
                      In Progress ({pct}%)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs for Leaderboard vs Nutrition Challenges */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Peer Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'challenges'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Nutrition Challenges</span>
        </button>
      </div>

      {activeTab === 'leaderboard' ? (
        /* LEADERBOARD VIEW */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Class 10 Nutritional Health Ranking
            </h3>
            <span className="text-xs text-slate-400">Ranked by weekly FSSAI verified audits</span>
          </div>

          <div className="space-y-2">
            {leaderboard.map((user) => {
              const isFirst = user.rank === 1;
              const isSecond = user.rank === 2;
              const isThird = user.rank === 3;

              return (
                <div
                  key={user.id}
                  className={`p-3.5 sm:p-4 rounded-xl flex items-center justify-between gap-3 transition-all ${
                    user.isCurrentUser
                      ? 'bg-indigo-950/50 border-2 border-indigo-500/70 shadow-lg'
                      : 'bg-slate-950 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Rank Badge */}
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0">
                      {isFirst ? (
                        <Medal className="w-6 h-6 text-amber-400 fill-amber-400" />
                      ) : isSecond ? (
                        <Medal className="w-5 h-5 text-slate-300 fill-slate-300" />
                      ) : isThird ? (
                        <Medal className="w-5 h-5 text-amber-600 fill-amber-600" />
                      ) : (
                        <span className="text-slate-500 font-mono">#{user.rank}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <span className="text-2xl">{user.avatar}</span>

                    {/* Name & Badge */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          {user.name}
                        </span>
                        {user.isCurrentUser && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500 text-white">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="text-amber-300 font-semibold">{user.badge}</span>
                        <span>•</span>
                        <span className="text-emerald-400">{user.greenScansCount} Green Foods</span>
                      </div>
                    </div>
                  </div>

                  {/* XP & Streak */}
                  <div className="flex items-center gap-4 text-right">
                    <div className="hidden sm:block">
                      <div className="text-xs font-bold text-orange-400 flex items-center justify-end gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        <span>{user.streakDays}d streak</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-base font-black text-white">{user.xp}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Points</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* NUTRITION CHALLENGES VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((ch) => {
            const isComplete = ch.completed || ch.currentCount >= ch.targetCount;
            const pct = Math.min(100, Math.round((ch.currentCount / ch.targetCount) * 100));

            return (
              <div 
                key={ch.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      +{ch.rewardXp} XP Reward
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{ch.title}</h3>
                  <p className="text-xs text-slate-300 mb-4">{ch.description}</p>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Challenge Progress</span>
                      <span className="text-white font-mono font-bold">
                        {ch.currentCount} / {ch.targetCount}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  {isComplete ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Challenge Completed!</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onJoinChallenge(ch.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold transition-colors"
                    >
                      Active Challenge
                    </button>
                  )}
                  <span className="text-[11px] text-slate-500">Live Habit Builder</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
