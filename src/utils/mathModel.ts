export interface MathModelPoint {
  x: number; // grams of food
  y: number; // grams of nutrient ingested
}

export interface CbseTableItem {
  name: string;
  sugarPer100g: number;
  fssaiLimit: string;
  healthTag: string;
  linearModel: string;
  maxSafeGrams: number;
  slope: number;
}

export const CBSE_TABLE_DATA: CbseTableItem[] = [
  {
    name: 'Marie Biscuits',
    sugarPer100g: 20,
    fssaiLimit: '5g (Green) / 22.5g (Red)',
    healthTag: 'Yellow – Eat in Limit',
    linearModel: 'S(x) = 0.20x',
    maxSafeGrams: 250,
    slope: 0.20,
  },
  {
    name: 'Potato Chips',
    sugarPer100g: 1.5,
    fssaiLimit: '5g (Green) / 22.5g (Red)',
    healthTag: 'Green for Sugar (Red for Fat/Salt)',
    linearModel: 'S(x) = 0.015x',
    maxSafeGrams: 3333,
    slope: 0.015,
  },
  {
    name: 'Packaged Juice',
    sugarPer100g: 14.5,
    fssaiLimit: '5g (Green) / 22.5g (Red)',
    healthTag: 'Yellow – Limit',
    linearModel: 'S(x) = 0.145x',
    maxSafeGrams: 345,
    slope: 0.145,
  },
  {
    name: 'Rolled Oats',
    sugarPer100g: 1.8,
    fssaiLimit: '5g (Green) / 22.5g (Red)',
    healthTag: 'Green – Healthy Choice',
    linearModel: 'S(x) = 0.018x',
    maxSafeGrams: 2777,
    slope: 0.018,
  },
  {
    name: 'Choco Spread',
    sugarPer100g: 56,
    fssaiLimit: '5g (Green) / 22.5g (Red)',
    healthTag: 'Red – Severe Limit',
    linearModel: 'S(x) = 0.56x',
    maxSafeGrams: 89,
    slope: 0.56,
  },
];

export function calculateLinearConsumption(
  nutrientPer100g: number,
  portionGrams: number
): { consumed: number; slope: number; formula: string; percentOfDailyLimit: number; dailyLimit: number } {
  const slope = nutrientPer100g / 100;
  const consumed = slope * portionGrams;
  const dailyLimit = 50; // free sugar daily limit grams
  const percentOfDailyLimit = Math.min(300, (consumed / dailyLimit) * 100);

  return {
    consumed: Math.round(consumed * 10) / 10,
    slope,
    formula: `S(x) = ${slope.toFixed(2)}x`,
    percentOfDailyLimit: Math.round(percentOfDailyLimit),
    dailyLimit,
  };
}

export function generateLinearPlotPoints(
  slope: number,
  maxPortion: number = 300,
  steps: number = 10
): MathModelPoint[] {
  const points: MathModelPoint[] = [];
  const stepSize = maxPortion / steps;
  for (let i = 0; i <= steps; i++) {
    const x = i * stepSize;
    points.push({
      x: Math.round(x),
      y: Math.round(slope * x * 10) / 10,
    });
  }
  return points;
}
