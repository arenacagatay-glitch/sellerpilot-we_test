import type { ActivityLevel, Gender, Goal, Profile, Targets } from '../types';

// Aktivite çarpanları (TDEE için)
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Hedefe göre kalori ayarı (TDEE üzerine çarpan)
export const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  fat_loss: 0.82, // -%18 (yağ yakma)
  maintain: 1.0,
  muscle_gain: 1.1, // +%10 (kas yapma / temiz bulk)
};

export interface ProfileInput {
  gender: Gender;
  birthYear: number;
  heightCm: number;
  weightKg: number;
  bodyFatPct?: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

// Referans yıl — new Date() kullanmadan yaş için (deterministik/test edilebilir).
// UI, güncel yılı ileterek çağırır.
export function calcAge(birthYear: number, currentYear: number): number {
  return Math.max(14, currentYear - birthYear);
}

/**
 * Bazal Metabolizma Hızı (BMR).
 * Yağ oranı verilmişse Katch-McArdle (yağsız kütleye dayalı, daha doğru).
 * Verilmemişse Mifflin-St Jeor formülü.
 */
export function calcBMR(input: ProfileInput, currentYear: number): number {
  const { weightKg, heightCm, gender, bodyFatPct } = input;

  if (bodyFatPct != null && bodyFatPct > 0 && bodyFatPct < 60) {
    const leanMass = weightKg * (1 - bodyFatPct / 100);
    return 370 + 21.6 * leanMass; // Katch-McArdle
  }

  const age = calcAge(input.birthYear, currentYear);
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? base + 5 : base - 161; // Mifflin-St Jeor
}

export function calcTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel];
}

/**
 * Günlük kalori + makro hedeflerini hesaplar.
 * Protein: hedefe göre 1.8–2.2 g/kg (yağ yakmada yüksek — kas koruma).
 * Yağ: ~0.8 g/kg. Kalan kaloriler karbonhidrata gider.
 */
export function calcTargets(input: ProfileInput, currentYear: number): Targets {
  const bmr = calcBMR(input, currentYear);
  const tdee = calcTDEE(bmr, input.activityLevel);
  const calories = Math.round(tdee * GOAL_ADJUSTMENTS[input.goal]);

  const proteinPerKg = input.goal === 'fat_loss' ? 2.2 : input.goal === 'muscle_gain' ? 2.0 : 1.8;
  const protein = Math.round(input.weightKg * proteinPerKg);
  const fat = Math.round(input.weightKg * 0.8);

  const kcalFromProtein = protein * 4;
  const kcalFromFat = fat * 9;
  const kcalRemaining = Math.max(0, calories - kcalFromProtein - kcalFromFat);
  const carbs = Math.round(kcalRemaining / 4);

  return {
    calories,
    protein,
    carbs,
    fat,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
  };
}

// Bir profil kaydından hedefleri yeniden hesaplar (düzenleme sonrası).
export function targetsFromProfile(
  profile: Pick<
    Profile,
    'gender' | 'birthYear' | 'heightCm' | 'weightKg' | 'bodyFatPct' | 'activityLevel' | 'goal'
  >,
  currentYear: number,
): Targets {
  return calcTargets(profile, currentYear);
}

// Etiketler (UI'da göstermek için)
export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Hareketsiz (masa başı)',
  light: 'Hafif (haftada 1-2 antrenman)',
  moderate: 'Orta (haftada 3-4 antrenman)',
  active: 'Aktif (haftada 5-6 antrenman)',
  very_active: 'Çok aktif (günde 2 antrenman / fiziksel iş)',
};

export const GOAL_LABELS: Record<Goal, string> = {
  fat_loss: 'Yağ yakma',
  maintain: 'Kilo koruma',
  muscle_gain: 'Kas yapma',
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: 'Erkek',
  female: 'Kadın',
};
