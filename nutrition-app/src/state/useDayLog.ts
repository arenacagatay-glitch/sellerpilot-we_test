import { useCallback, useEffect, useState } from 'react';
import type { Food, FoodLogEntry, MealType } from '../types';
import { newId, store } from '../lib/storage';
import { todayISO } from '../lib/date';

export interface DayTotals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

function sumLogs(logs: FoodLogEntry[]): DayTotals {
  return logs.reduce(
    (t, l) => ({
      kcal: t.kcal + l.kcal,
      protein: t.protein + l.protein,
      carbs: t.carbs + l.carbs,
      fat: t.fat + l.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

// Belirli bir profil + gün için günlük kayıtları yönetir.
export function useDayLog(profileId: string | undefined, date: string = todayISO()) {
  const [logs, setLogs] = useState<FoodLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!profileId) {
      setLogs([]);
      setLoading(false);
      return;
    }
    const list = await store.listLogs(profileId, date);
    setLogs(list);
    setLoading(false);
  }, [profileId, date]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const addFood = useCallback(
    async (food: Food, quantityG: number, mealType: MealType) => {
      if (!profileId) return;
      const factor = quantityG / 100;
      const entry: FoodLogEntry = {
        id: newId(),
        profileId,
        date,
        mealType,
        foodId: food.id,
        name: food.name,
        quantityG,
        kcal: Math.round(food.kcalPer100g * factor),
        protein: Math.round(food.proteinPer100g * factor),
        carbs: Math.round(food.carbsPer100g * factor),
        fat: Math.round(food.fatPer100g * factor),
        createdAt: new Date().toISOString(),
      };
      await store.addLog(entry);
      await reload();
    },
    [profileId, date, reload],
  );

  const removeLog = useCallback(
    async (id: string) => {
      await store.deleteLog(id);
      await reload();
    },
    [reload],
  );

  return { logs, totals: sumLogs(logs), loading, addFood, removeLog, reload };
}
