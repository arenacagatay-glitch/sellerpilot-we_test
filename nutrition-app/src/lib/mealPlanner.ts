import type { MealPlanSlot, MealSuggestion, MealType, Targets } from '../types';
import { FOODS_BY_ID } from '../data/foods';

// Öğün başına günlük kalori dağılımı
const MEAL_DISTRIBUTION: { mealType: MealType; ratio: number }[] = [
  { mealType: 'breakfast', ratio: 0.25 },
  { mealType: 'lunch', ratio: 0.35 },
  { mealType: 'dinner', ratio: 0.3 },
  { mealType: 'snack', ratio: 0.1 },
];

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Kahvaltı',
  lunch: 'Öğle',
  dinner: 'Akşam',
  snack: 'Ara öğün',
};

// Her öğün için besin kombinasyonu şablonları (foods.ts id'leri).
// Program bunları kalori hedefine göre ölçekler ve alternatif olarak sunar.
const TEMPLATES: Record<MealType, string[][]> = {
  breakfast: [
    ['oats', 'banana', 'whey'],
    ['egg', 'whole-bread', 'tomato', 'cucumber'],
    ['greek-yogurt', 'blueberry', 'walnuts'],
    ['egg-white', 'whole-bread', 'white-cheese', 'tomato'],
    ['oats', 'milk', 'peanut-butter'],
  ],
  lunch: [
    ['chicken-breast', 'rice-cooked', 'mixed-salad', 'olive-oil'],
    ['ground-beef-lean', 'bulgur-cooked', 'green-beans'],
    ['salmon', 'potato', 'broccoli'],
    ['turkey-breast', 'quinoa-cooked', 'spinach', 'olive-oil'],
    ['lentils-cooked', 'bulgur-cooked', 'mixed-salad'],
  ],
  dinner: [
    ['chicken-breast', 'sweet-potato', 'zucchini'],
    ['salmon', 'mixed-salad', 'olive-oil'],
    ['tuna-can', 'pasta-cooked', 'tomato'],
    ['tofu', 'rice-cooked', 'broccoli'],
    ['shrimp', 'quinoa-cooked', 'spinach'],
  ],
  snack: [
    ['greek-yogurt', 'almonds'],
    ['apple', 'peanut-butter'],
    ['whey', 'banana'],
    ['cottage-cheese', 'walnuts'],
    ['rice-cake', 'dark-chocolate'],
  ],
};

function round5(x: number): number {
  return Math.max(5, Math.round(x / 5) * 5);
}

function clamp(x: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, x));
}

// Bir şablonu hedef kaloriye göre ölçekleyerek öğün önerisi üretir.
function buildSuggestion(foodIds: string[], targetKcal: number): MealSuggestion | null {
  const foods = foodIds.map((id) => FOODS_BY_ID[id]).filter(Boolean);
  if (foods.length === 0) return null;

  const baseKcal = foods.reduce((s, f) => s + (f.kcalPer100g * f.defaultServingG) / 100, 0);
  if (baseKcal <= 0) return null;

  const factor = clamp(targetKcal / baseKcal, 0.5, 2);

  const items = foods.map((f) => ({ food: f, quantityG: round5(f.defaultServingG * factor) }));

  let kcal = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  for (const { food, quantityG } of items) {
    kcal += (food.kcalPer100g * quantityG) / 100;
    protein += (food.proteinPer100g * quantityG) / 100;
    carbs += (food.carbsPer100g * quantityG) / 100;
    fat += (food.fatPer100g * quantityG) / 100;
  }

  return {
    items,
    kcal: Math.round(kcal),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  };
}

/**
 * Günlük hedeflere göre öğün planı üretir.
 * Her öğün için birkaç alternatif sunar. `seed` (ör. gün sayısı) alternatiflerin
 * hangi şablonla başlayacağını belirler; böylece gün gün çeşitlilik olur ama
 * deterministiktir.
 */
export function generatePlan(targets: Targets, seed = 0, optionsPerMeal = 3): MealPlanSlot[] {
  return MEAL_DISTRIBUTION.map(({ mealType, ratio }) => {
    const targetKcal = Math.round(targets.calories * ratio);
    const templates = TEMPLATES[mealType];
    const options: MealSuggestion[] = [];

    for (let i = 0; i < Math.min(optionsPerMeal, templates.length); i++) {
      const tpl = templates[(seed + i) % templates.length];
      const suggestion = buildSuggestion(tpl, targetKcal);
      if (suggestion) options.push(suggestion);
    }

    return { mealType, targetKcal, options };
  });
}
