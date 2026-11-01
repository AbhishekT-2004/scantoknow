export type TrafficColor = 'green' | 'yellow' | 'red';

export interface NutrientRating {
  value: number;
  unit: string;
  color: TrafficColor;
  label: 'Healthy' | 'Moderate' | 'High / Limit';
  fssaiLimit: string;
  dailyAllowance: number; // e.g. 50g for sugar, 65g for fat, 5g for salt, 2000 for cal
}

export interface FoodItem {
  id: string;
  name: string;
  mrp: number;
  expiry: string;
  servingSizeGrams: number;
  sugarPer100g: number;
  fatPer100g: number;
  saltPer100g: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  fiberPer100g: number;
  carbsPer100g?: number;
  category?: string;
  notes?: string;
}

export interface HealthEvaluation {
  overallColor: TrafficColor;
  tag: string;
  summary: string;
  score: number; // 0 to 100
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  flags: string[];
  sugarRating: NutrientRating;
  fatRating: NutrientRating;
  saltRating: NutrientRating;
  caloriesRating: NutrientRating;
  proteinBonus: {
    hasHighProtein: boolean;
    label: string;
  };
  fiberBonus: {
    hasHighFiber: boolean;
    label: string;
  };
  linearModels: {
    sugar: { slope: number; formula: string; maxSafePortionGrams: number };
    fat: { slope: number; formula: string; maxSafePortionGrams: number };
    salt: { slope: number; formula: string; maxSafePortionGrams: number };
    calories: { slope: number; formula: string; maxSafePortionGrams: number };
  };
}

export interface ScanRecord {
  id: string;
  timestamp: string;
  food: FoodItem;
  portionGrams: number;
  evaluation: HealthEvaluation;
  notes?: string;
}

export interface NutritionChallenge {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardXp: number;
  completed: boolean;
  icon: string;
  category: 'green' | 'fiber' | 'sugar' | 'scans';
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  rank: number;
  streakDays: number;
  badge: string;
  isCurrentUser?: boolean;
  greenScansCount: number;
}

export interface WeeklyMilestone {
  id: string;
  title: string;
  goal: number;
  progress: number;
  xp: number;
  completed: boolean;
}

export interface ReminderSetting {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
  message: string;
}
