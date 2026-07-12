import { useMemo, useState } from 'react';
import { Check, Plus, RefreshCw } from 'lucide-react';
import { useProfiles } from '../state/ProfileContext';
import { useDayLog } from '../state/useDayLog';
import { generatePlan, MEAL_LABELS } from '../lib/mealPlanner';
import { dayOfYear } from '../lib/date';
import { Card, MacroPills, PageTitle } from '../components/ui';
import type { MealSuggestion, MealType } from '../types';

export function Plan() {
  const { activeProfile } = useProfiles();
  const { addFood } = useDayLog(activeProfile?.id);
  const [seedOffset, setSeedOffset] = useState(0);
  const [added, setAdded] = useState<string | null>(null);

  const plan = useMemo(() => {
    if (!activeProfile) return [];
    return generatePlan(activeProfile.targets, dayOfYear() + seedOffset);
  }, [activeProfile, seedOffset]);

  if (!activeProfile) return null;

  const addMeal = async (mealType: MealType, option: MealSuggestion, key: string) => {
    for (const item of option.items) {
      await addFood(item.food, item.quantityG, mealType);
    }
    setAdded(key);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <PageTitle title="Günün programı" subtitle={`${activeProfile.targets.calories} kcal hedefine göre`} />
        <button
          onClick={() => setSeedOffset((s) => s + 1)}
          className="mt-1 inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-ink"
        >
          <RefreshCw size={14} /> Değiştir
        </button>
      </div>

      <div className="space-y-5">
        {plan.map((slot) => (
          <div key={slot.mealType}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">{MEAL_LABELS[slot.mealType]}</h2>
              <span className="text-xs text-muted">~{slot.targetKcal} kcal</span>
            </div>

            <div className="space-y-3">
              {slot.options.map((option, idx) => {
                const key = `${slot.mealType}-${idx}`;
                const isAdded = added === key;
                return (
                  <Card key={key}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                        {idx === 0 ? 'Önerilen' : `Alternatif ${idx}`}
                      </span>
                      <span className="text-sm font-bold text-ink">{option.kcal} kcal</span>
                    </div>

                    <ul className="mb-3 space-y-1">
                      {option.items.map((it) => (
                        <li key={it.food.id} className="flex items-center justify-between text-sm">
                          <span className="text-ink">{it.food.name}</span>
                          <span className="text-muted">{it.quantityG}g</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between">
                      <MacroPills protein={option.protein} carbs={option.carbs} fat={option.fat} />
                      <button
                        onClick={() => addMeal(slot.mealType, option, key)}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                          isAdded ? 'bg-brand text-white' : 'bg-brand-soft text-brand-dark hover:bg-brand/20'
                        }`}
                      >
                        {isAdded ? <><Check size={14} /> Eklendi</> : <><Plus size={14} /> Günlüğe ekle</>}
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
