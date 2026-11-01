import { FoodItem, HealthEvaluation, LeaderboardUser, NutritionChallenge, ReminderSetting, ScanRecord, WeeklyMilestone } from '../types/nutrition';
import { SAMPLE_FOODS } from '../data/sampleFoods';
import { evaluateFoodHealth } from './fssaiEngine';

const STORAGE_KEYS = {
  SCANS: 'scan2know_scans_v1',
  USER_XP: 'scan2know_xp_v1',
  STREAK: 'scan2know_streak_v1',
  CHALLENGES: 'scan2know_challenges_v1',
  REMINDERS: 'scan2know_reminders_v1',
  LAST_SCAN_DATE: 'scan2know_last_scan_date_v1',
};

// Initial default scan records to demonstrate historical trends right away
const INITIAL_DEMO_SCANS: ScanRecord[] = [
  {
    id: 'demo-1',
    timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
    food: SAMPLE_FOODS[1], // Oats (Green)
    portionGrams: 50,
    evaluation: evaluateFoodHealth(SAMPLE_FOODS[1]),
    notes: 'Healthy breakfast bowl with rolled oats & chia seeds',
  },
  {
    id: 'demo-2',
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    food: SAMPLE_FOODS[0], // Marie Biscuits (Yellow)
    portionGrams: 40,
    evaluation: evaluateFoodHealth(SAMPLE_FOODS[0]),
    notes: 'Afternoon tea snack - 4 biscuits',
  },
  {
    id: 'demo-3',
    timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
    food: SAMPLE_FOODS[5], // Greek Yogurt (Green)
    portionGrams: 100,
    evaluation: evaluateFoodHealth(SAMPLE_FOODS[5]),
    notes: 'High protein post-workout snack',
  },
  {
    id: 'demo-4',
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    food: SAMPLE_FOODS[3], // Chips (Red)
    portionGrams: 45,
    evaluation: evaluateFoodHealth(SAMPLE_FOODS[3]),
    notes: 'Weekend movie snack - salty potato chips',
  },
  {
    id: 'demo-5',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    food: SAMPLE_FOODS[4], // Juice (Yellow)
    portionGrams: 200,
    evaluation: evaluateFoodHealth(SAMPLE_FOODS[4]),
    notes: 'Packaged fruit juice at lunch',
  },
  {
    id: 'demo-6',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    food: SAMPLE_FOODS[1], // Oats (Green)
    portionGrams: 60,
    evaluation: evaluateFoodHealth(SAMPLE_FOODS[1]),
    notes: 'Morning warm oatmeal',
  },
  {
    id: 'demo-7',
    timestamp: new Date().toISOString(),
    food: SAMPLE_FOODS[0], // Marie Biscuits (Yellow)
    portionGrams: 30,
    evaluation: evaluateFoodHealth(SAMPLE_FOODS[0]),
    notes: 'Exam preparation snack',
  },
];

export const INITIAL_CHALLENGES: NutritionChallenge[] = [
  {
    id: 'ch-1',
    title: '7-Day Zero Red Challenge',
    description: 'Avoid packaged foods with FSSAI Red labels (high sugar/fat/salt) for 7 days.',
    targetCount: 7,
    currentCount: 5,
    rewardXp: 350,
    completed: false,
    icon: 'ShieldCheck',
    category: 'green',
  },
  {
    id: 'ch-2',
    title: 'Fiber Finder Champion',
    description: 'Scan 5 items with high dietary fiber (>6g per 100g) to improve gut health.',
    targetCount: 5,
    currentCount: 3,
    rewardXp: 200,
    completed: false,
    icon: 'Sparkles',
    category: 'fiber',
  },
  {
    id: 'ch-3',
    title: 'Under 25g Daily Sugar',
    description: 'Keep your daily packaged sugar intake under half of FSSAI maximum limit (25g).',
    targetCount: 4,
    currentCount: 4,
    rewardXp: 180,
    completed: true,
    icon: 'Flame',
    category: 'sugar',
  },
  {
    id: 'ch-4',
    title: 'FSSAI Food Detective',
    description: 'Scan & audit 10 different grocery snacks using the linear polynomial model.',
    targetCount: 10,
    currentCount: 7,
    rewardXp: 250,
    completed: false,
    icon: 'ScanLine',
    category: 'scans',
  },
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'u-1',
    name: 'Aarav Sharma (Class 10-A)',
    avatar: '👨‍🎓',
    xp: 1420,
    rank: 1,
    streakDays: 14,
    badge: 'FSSAI Gold Auditor',
    greenScansCount: 19,
  },
  {
    id: 'u-you',
    name: 'You (Pawan K.)',
    avatar: '🌟',
    xp: 980,
    rank: 2,
    streakDays: 6,
    badge: 'Nutrition Scholar',
    isCurrentUser: true,
    greenScansCount: 12,
  },
  {
    id: 'u-3',
    name: 'Diya Patel (Class 10-B)',
    avatar: '👩‍🔬',
    xp: 890,
    rank: 3,
    streakDays: 8,
    badge: 'Linear Math Pro',
    greenScansCount: 11,
  },
  {
    id: 'u-4',
    name: 'Rohan Verma',
    avatar: '🏃‍♂️',
    xp: 640,
    rank: 4,
    streakDays: 4,
    badge: 'Healthy Snacker',
    greenScansCount: 8,
  },
  {
    id: 'u-5',
    name: 'Sneha Rao',
    avatar: '🧘‍♀️',
    xp: 520,
    rank: 5,
    streakDays: 3,
    badge: 'Fiber Explorer',
    greenScansCount: 6,
  },
];

export const INITIAL_MILESTONES: WeeklyMilestone[] = [
  {
    id: 'm-1',
    title: 'Log 5 nutritional scans this week',
    goal: 5,
    progress: 4,
    xp: 120,
    completed: false,
  },
  {
    id: 'm-2',
    title: 'Scan 2 Green Superfoods (Fiber > 5g)',
    goal: 2,
    progress: 2,
    xp: 150,
    completed: true,
  },
  {
    id: 'm-3',
    title: 'Calculate 1 portion limit with Linear Math',
    goal: 1,
    progress: 1,
    xp: 80,
    completed: true,
  },
  {
    id: 'm-4',
    title: 'Maintain a 5-day scan streak',
    goal: 5,
    progress: 5,
    xp: 200,
    completed: true,
  },
];

export const INITIAL_REMINDERS: ReminderSetting[] = [
  {
    id: 'rem-1',
    label: 'Morning Breakfast Scan',
    time: '08:30',
    enabled: true,
    message: 'Check your cereal/bread nutrition label before starting the day!',
  },
  {
    id: 'rem-2',
    label: 'Tea-time Biscuit & Snack Alert',
    time: '16:30',
    enabled: true,
    message: 'Check the sugar per 100g on your tea biscuits before eating!',
  },
  {
    id: 'rem-3',
    label: 'Evening Dinner Portion Review',
    time: '20:00',
    enabled: false,
    message: 'Did you hit your daily salt & sugar limit today? Review your score.',
  },
];

export function getStoredScans(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCANS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(INITIAL_DEMO_SCANS));
      return INITIAL_DEMO_SCANS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_SCANS;
  }
}

export function saveScanRecord(food: FoodItem, portionGrams: number = 100, notes?: string): ScanRecord {
  const evaluation = evaluateFoodHealth(food);
  const record: ScanRecord = {
    id: 'scan_' + Date.now(),
    timestamp: new Date().toISOString(),
    food,
    portionGrams,
    evaluation,
    notes,
  };

  const existing = getStoredScans();
  const updated = [record, ...existing];
  try {
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(updated));
    // Reward XP (+50 XP per scan, +30 bonus if Green)
    const bonus = evaluation.overallColor === 'green' ? 80 : 50;
    addXp(bonus);
  } catch (err) {
    console.error('Failed to save scan record', err);
  }
  return record;
}

export function getUserXp(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_XP);
    return raw ? parseInt(raw, 10) : 980;
  } catch {
    return 980;
  }
}

export function addXp(amount: number): number {
  const current = getUserXp();
  const updated = current + amount;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_XP, updated.toString());
  } catch {
    // ignore
  }
  return updated;
}

export function getUserStreak(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
    return raw ? parseInt(raw, 10) : 6;
  } catch {
    return 6;
  }
}

export function getStoredChallenges(): NutritionChallenge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    return raw ? JSON.parse(raw) : INITIAL_CHALLENGES;
  } catch {
    return INITIAL_CHALLENGES;
  }
}

export function saveChallenges(challenges: NutritionChallenge[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
  } catch {
    // ignore
  }
}

export function getStoredReminders(): ReminderSetting[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return raw ? JSON.parse(raw) : INITIAL_REMINDERS;
  } catch {
    return INITIAL_REMINDERS;
  }
}

export function saveReminders(reminders: ReminderSetting[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  } catch {
    // ignore
  }
}
