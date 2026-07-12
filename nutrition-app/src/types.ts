// Ortak tip tanımları

export type Gender = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary' // hareketsiz / masa başı
  | 'light' // hafif (haftada 1-2 antrenman)
  | 'moderate' // orta (haftada 3-4 antrenman)
  | 'active' // aktif (haftada 5-6 antrenman)
  | 'very_active'; // çok aktif (günde 2 antrenman / fiziksel iş)

export type Goal = 'fat_loss' | 'maintain' | 'muscle_gain';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// Hesaplanmış günlük hedefler
export interface Targets {
  calories: number;
  protein: number; // gram
  carbs: number; // gram
  fat: number; // gram
  bmr: number;
  tdee: number;
}

// Kullanıcı profili (cihazda birden fazla olabilir: sen + kız arkadaşın)
export interface Profile {
  id: string;
  name: string;
  gender: Gender;
  birthYear: number;
  heightCm: number;
  weightKg: number;
  bodyFatPct?: number; // opsiyonel
  activityLevel: ActivityLevel;
  goal: Goal;
  targets: Targets;
  createdAt: string;
  updatedAt: string;
}

// Besin veritabanı kaydı (100 gram başına değerler)
export interface Food {
  id: string;
  name: string;
  category: string;
  kcalPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  defaultServingG: number; // tipik bir porsiyon (gram)
  servingLabel?: string; // ör. "1 orta yumurta (50g)"
  mealTypes: MealType[]; // hangi öğünlere uygun
  regionTags: string[]; // ör. ["international", "mediterranean"]
}

// Günlük kayıt (yenen bir besin)
export interface FoodLogEntry {
  id: string;
  profileId: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  foodId?: string; // besin veritabanından ise
  name: string;
  quantityG: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
}

// Program üretiminde bir öğün için önerilen seçenek
export interface MealSuggestion {
  items: { food: Food; quantityG: number }[];
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealPlanSlot {
  mealType: MealType;
  targetKcal: number;
  options: MealSuggestion[]; // alternatifler
}
