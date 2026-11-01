import { FoodItem, HealthEvaluation, NutrientRating, TrafficColor } from '../types/nutrition';

// FSSAI standard daily adult maximum allowances
export const FSSAI_DAILY_ALLOWANCES = {
  freeSugarGrams: 50,
  totalFatGrams: 65,
  saltGrams: 5.0,
  caloriesKcal: 2000,
  proteinTargetGrams: 55,
  fiberTargetGrams: 30,
};

// Thresholds per 100g according to FSSAI traffic light guidelines
export const FSSAI_THRESHOLDS = {
  sugar: { greenMax: 5.0, redMin: 22.5 },
  fat: { greenMax: 3.0, redMin: 17.5 },
  salt: { greenMax: 0.3, redMin: 1.5 },
  calories: { greenMax: 200, redMin: 400 },
  protein: { highMin: 10.0, sourceMin: 5.0 },
  fiber: { highMin: 6.0, sourceMin: 3.0 },
};

export function evaluateNutrient(
  value: number,
  unit: string,
  thresholds: { greenMax: number; redMin: number },
  dailyLimit: number
): NutrientRating {
  let color: TrafficColor = 'yellow';
  let label: 'Healthy' | 'Moderate' | 'High / Limit' = 'Moderate';

  if (value < thresholds.greenMax) {
    color = 'green';
    label = 'Healthy';
  } else if (value > thresholds.redMin) {
    color = 'red';
    label = 'High / Limit';
  } else {
    color = 'yellow';
    label = 'Moderate';
  }

  const fssaiLimit = `< ${thresholds.greenMax}${unit} (Green) / > ${thresholds.redMin}${unit} (Red)`;

  return {
    value,
    unit,
    color,
    label,
    fssaiLimit,
    dailyAllowance: dailyLimit,
  };
}

export function evaluateFoodHealth(food: FoodItem): HealthEvaluation {
  const sugarRating = evaluateNutrient(
    food.sugarPer100g,
    'g',
    FSSAI_THRESHOLDS.sugar,
    FSSAI_DAILY_ALLOWANCES.freeSugarGrams
  );

  const fatRating = evaluateNutrient(
    food.fatPer100g,
    'g',
    FSSAI_THRESHOLDS.fat,
    FSSAI_DAILY_ALLOWANCES.totalFatGrams
  );

  const saltRating = evaluateNutrient(
    food.saltPer100g,
    'g',
    FSSAI_THRESHOLDS.salt,
    FSSAI_DAILY_ALLOWANCES.saltGrams
  );

  const caloriesRating = evaluateNutrient(
    food.caloriesPer100g,
    'kcal',
    FSSAI_THRESHOLDS.calories,
    FSSAI_DAILY_ALLOWANCES.caloriesKcal
  );

  // Flags based on user prompt logic
  const flags: string[] = [];
  if (food.sugarPer100g > FSSAI_THRESHOLDS.sugar.redMin) flags.push('High Sugar');
  else if (food.sugarPer100g >= FSSAI_THRESHOLDS.sugar.greenMax) flags.push('Moderate Sugar');

  if (food.fatPer100g > FSSAI_THRESHOLDS.fat.redMin) flags.push('High Fat');
  else if (food.fatPer100g >= FSSAI_THRESHOLDS.fat.greenMax) flags.push('Moderate Fat');

  if (food.saltPer100g > FSSAI_THRESHOLDS.salt.redMin) flags.push('High Salt');
  else if (food.saltPer100g >= FSSAI_THRESHOLDS.salt.greenMax) flags.push('Moderate Salt');

  if (food.caloriesPer100g > FSSAI_THRESHOLDS.calories.redMin) flags.push('High Calories');
  else if (food.caloriesPer100g >= FSSAI_THRESHOLDS.calories.greenMax) flags.push('Moderate Calories');

  // Protein & Fiber evaluation
  const hasHighProtein = (food.proteinPer100g || 0) >= FSSAI_THRESHOLDS.protein.highMin;
  const hasSourceProtein = (food.proteinPer100g || 0) >= FSSAI_THRESHOLDS.protein.sourceMin;
  const proteinLabel = hasHighProtein
    ? 'High Protein (Excellent)'
    : hasSourceProtein
    ? 'Source of Protein'
    : 'Low Protein';

  const hasHighFiber = (food.fiberPer100g || 0) >= FSSAI_THRESHOLDS.fiber.highMin;
  const hasSourceFiber = (food.fiberPer100g || 0) >= FSSAI_THRESHOLDS.fiber.sourceMin;
  const fiberLabel = hasHighFiber
    ? 'High Dietary Fiber'
    : hasSourceFiber
    ? 'Source of Fiber'
    : 'Low Fiber';

  // Determine overall color tag
  const hasRed = [sugarRating, fatRating, saltRating, caloriesRating].some((r) => r.color === 'red');
  const hasYellow = [sugarRating, fatRating, saltRating, caloriesRating].some((r) => r.color === 'yellow');

  let overallColor: TrafficColor = 'green';
  let tag = 'Green - Healthy Choice';
  let summary = 'Optimal nutrition profile adhering to FSSAI recommended low thresholds.';

  if (hasRed) {
    overallColor = 'red';
    const redReasons = flags.filter((f) => f.startsWith('High '));
    tag = `Red - Limit Intake: ${redReasons.join(', ') || 'Exceeds FSSAI red limits'}`;
    summary = `Contains nutrient levels exceeding FSSAI critical limits. Restrict consumption to occasional treats.`;
  } else if (hasYellow) {
    overallColor = 'yellow';
    const modReasons = flags.filter((f) => f.startsWith('Moderate ') || f.startsWith('High '));
    tag = `Yellow - Moderately Healthy: Eat in limit, not daily`;
    summary = `Nutrient values fall into the intermediate band. Suitable in controlled portions, avoid daily habitual consumption.`;
  }

  // Calculate composite Health Score (0 to 100)
  // Base 100 points, deductions for sugar, fat, salt, calories; bonuses for protein and fiber
  let score = 100;

  // Sugar penalty (0 to 30 pts)
  if (food.sugarPer100g > FSSAI_THRESHOLDS.sugar.greenMax) {
    const penalty = Math.min(32, ((food.sugarPer100g - 5) / (25)) * 30);
    score -= penalty;
  }

  // Fat penalty (0 to 25 pts)
  if (food.fatPer100g > FSSAI_THRESHOLDS.fat.greenMax) {
    const penalty = Math.min(25, ((food.fatPer100g - 3) / (20)) * 25);
    score -= penalty;
  }

  // Salt penalty (0 to 20 pts)
  if (food.saltPer100g > FSSAI_THRESHOLDS.salt.greenMax) {
    const penalty = Math.min(20, ((food.saltPer100g - 0.3) / (2.0)) * 20);
    score -= penalty;
  }

  // Calories penalty (0 to 15 pts)
  if (food.caloriesPer100g > FSSAI_THRESHOLDS.calories.greenMax) {
    const penalty = Math.min(18, ((food.caloriesPer100g - 200) / (300)) * 15);
    score -= penalty;
  }

  // Fiber bonus (+1 to +6 pts)
  if (food.fiberPer100g > 0) {
    const bonus = Math.min(6, (food.fiberPer100g / 6) * 6);
    score += bonus;
  }

  // Protein bonus (+1 to +6 pts)
  if (food.proteinPer100g > 0) {
    const bonus = Math.min(6, (food.proteinPer100g / 12) * 6);
    score += bonus;
  }

  score = Math.max(5, Math.min(99, Math.round(score)));

  let grade: 'A' | 'B' | 'C' | 'D' | 'E' = 'C';
  if (score >= 80) grade = 'A';
  else if (score >= 65) grade = 'B';
  else if (score >= 45) grade = 'C';
  else if (score >= 25) grade = 'D';
  else grade = 'E';

  // CBSE Linear Models S(x) = (sugar/100) * x
  const sugarSlope = food.sugarPer100g / 100;
  const fatSlope = food.fatPer100g / 100;
  const saltSlope = food.saltPer100g / 100;
  const calSlope = food.caloriesPer100g / 100;

  const maxSafeSugarPortion = sugarSlope > 0 ? Math.round(FSSAI_DAILY_ALLOWANCES.freeSugarGrams / sugarSlope) : 1000;
  const maxSafeFatPortion = fatSlope > 0 ? Math.round(FSSAI_DAILY_ALLOWANCES.totalFatGrams / fatSlope) : 1000;
  const maxSafeSaltPortion = saltSlope > 0 ? Math.round(FSSAI_DAILY_ALLOWANCES.saltGrams / saltSlope) : 1000;
  const maxSafeCalPortion = calSlope > 0 ? Math.round(FSSAI_DAILY_ALLOWANCES.caloriesKcal / calSlope) : 1000;

  return {
    overallColor,
    tag,
    summary,
    score,
    grade,
    flags,
    sugarRating,
    fatRating,
    saltRating,
    caloriesRating,
    proteinBonus: {
      hasHighProtein,
      label: proteinLabel,
    },
    fiberBonus: {
      hasHighFiber,
      label: fiberLabel,
    },
    linearModels: {
      sugar: {
        slope: sugarSlope,
        formula: `S(x) = ${sugarSlope.toFixed(2)}x`,
        maxSafePortionGrams: maxSafeSugarPortion,
      },
      fat: {
        slope: fatSlope,
        formula: `F(x) = ${fatSlope.toFixed(2)}x`,
        maxSafePortionGrams: maxSafeFatPortion,
      },
      salt: {
        slope: saltSlope,
        formula: `Na(x) = ${saltSlope.toFixed(3)}x`,
        maxSafePortionGrams: maxSafeSaltPortion,
      },
      calories: {
        slope: calSlope,
        formula: `C(x) = ${calSlope.toFixed(1)}x`,
        maxSafePortionGrams: maxSafeCalPortion,
      },
    },
  };
}

export function formatQrPayload(food: FoodItem, tag?: string): string {
  const healthTag = tag || (evaluateFoodHealth(food).tag);
  return `${food.name}
MRP: Rs.${food.mrp}
Expiry: ${food.expiry || '01/11/2026'}
Sugar/100g: ${food.sugarPer100g}g
Fat/100g: ${food.fatPer100g}g
Salt/100g: ${food.saltPer100g}g
Calories/100g: ${food.caloriesPer100g}
Protein/100g: ${food.proteinPer100g || 0}g
Fiber/100g: ${food.fiberPer100g || 0}g
Health Tag: ${healthTag}`;
}

export function parseQrText(raw: string): Partial<FoodItem> | null {
  if (!raw || typeof raw !== 'string') return null;

  // Check if JSON first
  try {
    const json = JSON.parse(raw.trim());
    if (json && (json.name || json.sugarPer100g !== undefined)) {
      return {
        id: json.id || 'scan_' + Date.now(),
        name: json.name || 'Scanned Food Item',
        mrp: Number(json.mrp) || 30,
        expiry: json.expiry || '01/11/2026',
        servingSizeGrams: Number(json.servingSizeGrams) || 100,
        sugarPer100g: Number(json.sugarPer100g ?? json.sugar) || 0,
        fatPer100g: Number(json.fatPer100g ?? json.fat) || 0,
        saltPer100g: Number(json.saltPer100g ?? json.salt) || 0,
        caloriesPer100g: Number(json.caloriesPer100g ?? json.cal) || 0,
        proteinPer100g: Number(json.proteinPer100g ?? json.protein) || 0,
        fiberPer100g: Number(json.fiberPer100g ?? json.fiber) || 0,
      };
    }
  } catch {
    // continue to line-by-line parsing
  }

  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  const result: Partial<FoodItem> = {
    id: 'scan_' + Date.now(),
    servingSizeGrams: 100,
    mrp: 30,
    expiry: '01/11/2026',
    sugarPer100g: 0,
    fatPer100g: 0,
    saltPer100g: 0,
    caloriesPer100g: 0,
    proteinPer100g: 0,
    fiberPer100g: 0,
  };

  // If first line doesn't contain a colon, treat as food name
  if (!lines[0].includes(':')) {
    result.name = lines[0];
  }

  for (const line of lines) {
    const lower = line.toLowerCase();
    
    // Extract Name
    if (lower.startsWith('name:')) {
      result.name = line.substring(line.indexOf(':') + 1).trim();
    }
    // Extract MRP
    if (lower.includes('mrp:')) {
      const match = line.match(/(?:rs\.?|inr)?\s*([0-9]+(?:\.[0-9]+)?)/i);
      if (match) result.mrp = parseFloat(match[1]);
    }
    // Extract Expiry
    if (lower.includes('expiry:')) {
      result.expiry = line.substring(line.indexOf(':') + 1).trim();
    }
    // Extract Sugar
    if (lower.includes('sugar')) {
      const match = line.match(/([0-9]+(?:\.[0-9]+)?)\s*g?/i);
      if (match) result.sugarPer100g = parseFloat(match[1]);
    }
    // Extract Fat
    if (lower.includes('fat')) {
      const match = line.match(/([0-9]+(?:\.[0-9]+)?)\s*g?/i);
      if (match) result.fatPer100g = parseFloat(match[1]);
    }
    // Extract Salt or Sodium
    if (lower.includes('salt') || lower.includes('sodium')) {
      const match = line.match(/([0-9]+(?:\.[0-9]+)?)\s*g?/i);
      if (match) result.saltPer100g = parseFloat(match[1]);
    }
    // Extract Calories / Cal
    if (lower.includes('cal') || lower.includes('energy')) {
      const match = line.match(/([0-9]+(?:\.[0-9]+)?)/i);
      if (match) result.caloriesPer100g = parseFloat(match[1]);
    }
    // Extract Protein
    if (lower.includes('protein')) {
      const match = line.match(/([0-9]+(?:\.[0-9]+)?)\s*g?/i);
      if (match) result.proteinPer100g = parseFloat(match[1]);
    }
    // Extract Fiber
    if (lower.includes('fiber') || lower.includes('fibre')) {
      const match = line.match(/([0-9]+(?:\.[0-9]+)?)\s*g?/i);
      if (match) result.fiberPer100g = parseFloat(match[1]);
    }
  }

  if (!result.name) {
    result.name = 'Scanned Product';
  }

  return result;
}
