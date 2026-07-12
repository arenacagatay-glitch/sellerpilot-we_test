import type { Food } from '../types';

// Uluslararası temel besin veritabanı. Değerler 100 gram başınadır.
// Rule-based program üretimi ve günlük takip bu listeyi kullanır.
// İleride Supabase 'foods' tablosuna aynı şemayla taşınabilir.

export const FOODS: Food[] = [
  // ---- Protein kaynakları ----
  { id: 'chicken-breast', name: 'Tavuk göğsü (haşlanmış)', category: 'Protein', kcalPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, defaultServingG: 150, servingLabel: '1 porsiyon (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international'] },
  { id: 'ground-beef-lean', name: 'Yağsız kıyma (dana)', category: 'Protein', kcalPer100g: 187, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 9, defaultServingG: 120, servingLabel: '1 köfte porsiyonu (120g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international'] },
  { id: 'salmon', name: 'Somon (fırın)', category: 'Protein', kcalPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13, defaultServingG: 130, servingLabel: '1 fileto (130g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international', 'mediterranean'] },
  { id: 'tuna-can', name: 'Ton balığı (suda, konserve)', category: 'Protein', kcalPer100g: 116, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 1, defaultServingG: 80, servingLabel: '1/2 konserve (80g)', mealTypes: ['lunch', 'dinner', 'snack'], regionTags: ['international'] },
  { id: 'egg', name: 'Yumurta (tam, haşlanmış)', category: 'Protein', kcalPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11, defaultServingG: 100, servingLabel: '2 orta yumurta (100g)', mealTypes: ['breakfast', 'snack'], regionTags: ['international'] },
  { id: 'egg-white', name: 'Yumurta beyazı', category: 'Protein', kcalPer100g: 52, proteinPer100g: 11, carbsPer100g: 0.7, fatPer100g: 0.2, defaultServingG: 100, servingLabel: '3 beyaz (100g)', mealTypes: ['breakfast', 'snack'], regionTags: ['international'] },
  { id: 'turkey-breast', name: 'Hindi göğsü', category: 'Protein', kcalPer100g: 135, proteinPer100g: 30, carbsPer100g: 0, fatPer100g: 1, defaultServingG: 150, servingLabel: '1 porsiyon (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international'] },
  { id: 'shrimp', name: 'Karides', category: 'Protein', kcalPer100g: 99, proteinPer100g: 24, carbsPer100g: 0.2, fatPer100g: 0.3, defaultServingG: 120, servingLabel: '1 porsiyon (120g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international', 'mediterranean'] },
  { id: 'tofu', name: 'Tofu', category: 'Protein', kcalPer100g: 76, proteinPer100g: 8, carbsPer100g: 1.9, fatPer100g: 4.8, defaultServingG: 150, servingLabel: '1 porsiyon (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international', 'vegetarian'] },
  { id: 'whey', name: 'Whey protein tozu', category: 'Protein', kcalPer100g: 400, proteinPer100g: 80, carbsPer100g: 8, fatPer100g: 6, defaultServingG: 30, servingLabel: '1 ölçek (30g)', mealTypes: ['breakfast', 'snack'], regionTags: ['international'] },

  // ---- Karbonhidrat kaynakları ----
  { id: 'rice-cooked', name: 'Pirinç (pişmiş)', category: 'Karbonhidrat', kcalPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3, defaultServingG: 150, servingLabel: '1 porsiyon (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international'] },
  { id: 'bulgur-cooked', name: 'Bulgur (pişmiş)', category: 'Karbonhidrat', kcalPer100g: 83, proteinPer100g: 3, carbsPer100g: 18, fatPer100g: 0.2, defaultServingG: 150, servingLabel: '1 porsiyon (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international', 'mediterranean'] },
  { id: 'pasta-cooked', name: 'Makarna (pişmiş)', category: 'Karbonhidrat', kcalPer100g: 158, proteinPer100g: 5.8, carbsPer100g: 31, fatPer100g: 0.9, defaultServingG: 150, servingLabel: '1 porsiyon (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international'] },
  { id: 'potato', name: 'Patates (haşlanmış)', category: 'Karbonhidrat', kcalPer100g: 87, proteinPer100g: 1.9, carbsPer100g: 20, fatPer100g: 0.1, defaultServingG: 200, servingLabel: '1 orta patates (200g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international'] },
  { id: 'sweet-potato', name: 'Tatlı patates (fırın)', category: 'Karbonhidrat', kcalPer100g: 90, proteinPer100g: 2, carbsPer100g: 21, fatPer100g: 0.1, defaultServingG: 200, servingLabel: '1 orta (200g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international'] },
  { id: 'oats', name: 'Yulaf ezmesi (kuru)', category: 'Karbonhidrat', kcalPer100g: 389, proteinPer100g: 17, carbsPer100g: 66, fatPer100g: 7, defaultServingG: 50, servingLabel: '1 kase (50g kuru)', mealTypes: ['breakfast'], regionTags: ['international'] },
  { id: 'whole-bread', name: 'Tam buğday ekmeği', category: 'Karbonhidrat', kcalPer100g: 247, proteinPer100g: 13, carbsPer100g: 41, fatPer100g: 3.4, defaultServingG: 50, servingLabel: '2 dilim (50g)', mealTypes: ['breakfast', 'snack'], regionTags: ['international'] },
  { id: 'quinoa-cooked', name: 'Kinoa (pişmiş)', category: 'Karbonhidrat', kcalPer100g: 120, proteinPer100g: 4.4, carbsPer100g: 21, fatPer100g: 1.9, defaultServingG: 150, servingLabel: '1 porsiyon (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international'] },
  { id: 'lentils-cooked', name: 'Mercimek (pişmiş)', category: 'Karbonhidrat', kcalPer100g: 116, proteinPer100g: 9, carbsPer100g: 20, fatPer100g: 0.4, defaultServingG: 150, servingLabel: '1 kase (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international', 'mediterranean'] },
  { id: 'chickpeas-cooked', name: 'Nohut (pişmiş)', category: 'Karbonhidrat', kcalPer100g: 164, proteinPer100g: 9, carbsPer100g: 27, fatPer100g: 2.6, defaultServingG: 150, servingLabel: '1 kase (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international', 'mediterranean'] },
  { id: 'kidney-beans', name: 'Barbunya (pişmiş)', category: 'Karbonhidrat', kcalPer100g: 127, proteinPer100g: 8.7, carbsPer100g: 23, fatPer100g: 0.5, defaultServingG: 150, servingLabel: '1 kase (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international'] },

  // ---- Süt ürünleri ----
  { id: 'greek-yogurt', name: 'Yoğurt (light/süzme)', category: 'Süt ürünü', kcalPer100g: 59, proteinPer100g: 10, carbsPer100g: 3.6, fatPer100g: 0.4, defaultServingG: 200, servingLabel: '1 kase (200g)', mealTypes: ['breakfast', 'snack'], regionTags: ['international', 'mediterranean'] },
  { id: 'milk', name: 'Süt (yarım yağlı)', category: 'Süt ürünü', kcalPer100g: 50, proteinPer100g: 3.4, carbsPer100g: 5, fatPer100g: 1.8, defaultServingG: 250, servingLabel: '1 bardak (250ml)', mealTypes: ['breakfast', 'snack'], regionTags: ['international'] },
  { id: 'cottage-cheese', name: 'Lor peyniri', category: 'Süt ürünü', kcalPer100g: 98, proteinPer100g: 11, carbsPer100g: 3.4, fatPer100g: 4.3, defaultServingG: 100, servingLabel: '1 porsiyon (100g)', mealTypes: ['breakfast', 'snack'], regionTags: ['international'] },
  { id: 'white-cheese', name: 'Beyaz peynir (light)', category: 'Süt ürünü', kcalPer100g: 180, proteinPer100g: 17, carbsPer100g: 2, fatPer100g: 12, defaultServingG: 40, servingLabel: '2 dilim (40g)', mealTypes: ['breakfast', 'snack'], regionTags: ['international', 'mediterranean'] },

  // ---- Sebzeler ----
  { id: 'broccoli', name: 'Brokoli (buhar)', category: 'Sebze', kcalPer100g: 35, proteinPer100g: 2.4, carbsPer100g: 7, fatPer100g: 0.4, defaultServingG: 150, servingLabel: '1 porsiyon (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international'] },
  { id: 'spinach', name: 'Ispanak (sote)', category: 'Sebze', kcalPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4, defaultServingG: 150, servingLabel: '1 porsiyon (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international', 'mediterranean'] },
  { id: 'mixed-salad', name: 'Yeşil salata (yağsız)', category: 'Sebze', kcalPer100g: 20, proteinPer100g: 1.3, carbsPer100g: 3.6, fatPer100g: 0.2, defaultServingG: 150, servingLabel: '1 kase (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international', 'mediterranean'] },
  { id: 'tomato', name: 'Domates', category: 'Sebze', kcalPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatPer100g: 0.2, defaultServingG: 100, servingLabel: '1 orta domates (100g)', mealTypes: ['breakfast', 'lunch', 'dinner'], regionTags: ['international', 'mediterranean'] },
  { id: 'cucumber', name: 'Salatalık', category: 'Sebze', kcalPer100g: 15, proteinPer100g: 0.7, carbsPer100g: 3.6, fatPer100g: 0.1, defaultServingG: 100, servingLabel: '1 orta (100g)', mealTypes: ['breakfast', 'lunch', 'dinner', 'snack'], regionTags: ['international', 'mediterranean'] },
  { id: 'zucchini', name: 'Kabak (sote)', category: 'Sebze', kcalPer100g: 17, proteinPer100g: 1.2, carbsPer100g: 3.1, fatPer100g: 0.3, defaultServingG: 150, servingLabel: '1 porsiyon (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international', 'mediterranean'] },
  { id: 'green-beans', name: 'Taze fasulye', category: 'Sebze', kcalPer100g: 31, proteinPer100g: 1.8, carbsPer100g: 7, fatPer100g: 0.2, defaultServingG: 150, servingLabel: '1 porsiyon (150g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international', 'mediterranean'] },

  // ---- Meyveler ----
  { id: 'banana', name: 'Muz', category: 'Meyve', kcalPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3, defaultServingG: 120, servingLabel: '1 orta muz (120g)', mealTypes: ['breakfast', 'snack'], regionTags: ['international'] },
  { id: 'apple', name: 'Elma', category: 'Meyve', kcalPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatPer100g: 0.2, defaultServingG: 150, servingLabel: '1 orta elma (150g)', mealTypes: ['breakfast', 'snack'], regionTags: ['international'] },
  { id: 'strawberry', name: 'Çilek', category: 'Meyve', kcalPer100g: 32, proteinPer100g: 0.7, carbsPer100g: 7.7, fatPer100g: 0.3, defaultServingG: 150, servingLabel: '1 kase (150g)', mealTypes: ['breakfast', 'snack'], regionTags: ['international'] },
  { id: 'blueberry', name: 'Yaban mersini', category: 'Meyve', kcalPer100g: 57, proteinPer100g: 0.7, carbsPer100g: 14, fatPer100g: 0.3, defaultServingG: 100, servingLabel: '1 avuç (100g)', mealTypes: ['breakfast', 'snack'], regionTags: ['international'] },
  { id: 'orange', name: 'Portakal', category: 'Meyve', kcalPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 12, fatPer100g: 0.1, defaultServingG: 150, servingLabel: '1 orta (150g)', mealTypes: ['breakfast', 'snack'], regionTags: ['international', 'mediterranean'] },

  // ---- Yağlar & kuruyemişler ----
  { id: 'olive-oil', name: 'Zeytinyağı', category: 'Yağ', kcalPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100, defaultServingG: 10, servingLabel: '1 yemek kaşığı (10g)', mealTypes: ['lunch', 'dinner'], regionTags: ['international', 'mediterranean'] },
  { id: 'almonds', name: 'Badem', category: 'Yağ', kcalPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50, defaultServingG: 25, servingLabel: '1 avuç (25g)', mealTypes: ['snack'], regionTags: ['international', 'mediterranean'] },
  { id: 'walnuts', name: 'Ceviz', category: 'Yağ', kcalPer100g: 654, proteinPer100g: 15, carbsPer100g: 14, fatPer100g: 65, defaultServingG: 25, servingLabel: '1 avuç (25g)', mealTypes: ['snack', 'breakfast'], regionTags: ['international', 'mediterranean'] },
  { id: 'peanut-butter', name: 'Fıstık ezmesi', category: 'Yağ', kcalPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatPer100g: 50, defaultServingG: 20, servingLabel: '1 yemek kaşığı (20g)', mealTypes: ['breakfast', 'snack'], regionTags: ['international'] },
  { id: 'avocado', name: 'Avokado', category: 'Yağ', kcalPer100g: 160, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 15, defaultServingG: 100, servingLabel: '1/2 avokado (100g)', mealTypes: ['breakfast', 'lunch'], regionTags: ['international'] },

  // ---- Atıştırmalık / diğer ----
  { id: 'rice-cake', name: 'Pirinç patlağı', category: 'Atıştırmalık', kcalPer100g: 387, proteinPer100g: 8, carbsPer100g: 82, fatPer100g: 3, defaultServingG: 20, servingLabel: '2-3 adet (20g)', mealTypes: ['snack'], regionTags: ['international'] },
  { id: 'dark-chocolate', name: 'Bitter çikolata (%70)', category: 'Atıştırmalık', kcalPer100g: 546, proteinPer100g: 4.9, carbsPer100g: 46, fatPer100g: 31, defaultServingG: 20, servingLabel: '2 kare (20g)', mealTypes: ['snack'], regionTags: ['international'] },
  { id: 'honey', name: 'Bal', category: 'Atıştırmalık', kcalPer100g: 304, proteinPer100g: 0.3, carbsPer100g: 82, fatPer100g: 0, defaultServingG: 15, servingLabel: '1 tatlı kaşığı (15g)', mealTypes: ['breakfast', 'snack'], regionTags: ['international'] },
];

// Hızlı erişim için id -> Food haritası
export const FOODS_BY_ID: Record<string, Food> = FOODS.reduce(
  (acc, f) => {
    acc[f.id] = f;
    return acc;
  },
  {} as Record<string, Food>,
);

export function searchFoods(query: string): Food[] {
  const q = query.trim().toLocaleLowerCase('tr');
  if (!q) return FOODS;
  return FOODS.filter(
    (f) =>
      f.name.toLocaleLowerCase('tr').includes(q) ||
      f.category.toLocaleLowerCase('tr').includes(q),
  );
}
