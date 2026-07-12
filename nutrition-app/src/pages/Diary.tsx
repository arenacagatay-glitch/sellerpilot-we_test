import { useMemo, useState } from 'react';
import { Search, Plus, Trash2, X } from 'lucide-react';
import { useProfiles } from '../state/ProfileContext';
import { useDayLog } from '../state/useDayLog';
import { searchFoods } from '../data/foods';
import { MEAL_LABELS } from '../lib/mealPlanner';
import { Button, Card, MacroPills, PageTitle } from '../components/ui';
import type { Food, MealType } from '../types';

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export function Diary() {
  const { activeProfile } = useProfiles();
  const { logs, totals, addFood, removeLog } = useDayLog(activeProfile?.id);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');

  const results = useMemo(() => searchFoods(query).slice(0, 30), [query]);

  if (!activeProfile) return null;

  const openFood = (food: Food) => {
    setSelected(food);
    setQuantity(String(food.defaultServingG));
    setMealType(food.mealTypes[0] ?? 'lunch');
  };

  const confirmAdd = async () => {
    if (!selected) return;
    const q = Number(quantity);
    if (!(q > 0)) return;
    await addFood(selected, q, mealType);
    setSelected(null);
    setQuery('');
  };

  const grouped = MEAL_ORDER.map((m) => ({ meal: m, items: logs.filter((l) => l.mealType === m) }));

  return (
    <div>
      <PageTitle title="Günlük" subtitle={`Bugün toplam ${Math.round(totals.kcal)} kcal`} />

      {/* Arama */}
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          placeholder="Besin ara (tavuk, yulaf, muz...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query && (
        <Card className="mb-4 max-h-72 overflow-y-auto p-0">
          <ul className="divide-y divide-slate-100">
            {results.map((f) => (
              <li key={f.id}>
                <button
                  onClick={() => openFood(f)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-slate-50"
                >
                  <span>
                    <span className="block text-sm font-medium text-ink">{f.name}</span>
                    <span className="block text-xs text-muted">
                      {f.kcalPer100g} kcal/100g · {f.category}
                    </span>
                  </span>
                  <Plus size={18} className="text-brand" />
                </button>
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-4 py-3 text-sm text-muted">Sonuç yok.</li>
            )}
          </ul>
        </Card>
      )}

      {/* Günün kayıtları */}
      <div className="space-y-4">
        {grouped.map(({ meal, items }) => (
          <div key={meal}>
            <div className="mb-1.5 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-ink">{MEAL_LABELS[meal]}</h2>
              <span className="text-xs text-muted">
                {items.reduce((s, i) => s + i.kcal, 0)} kcal
              </span>
            </div>
            {items.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-3 py-2.5 text-xs text-muted">
                Boş
              </p>
            ) : (
              <Card className="p-0">
                <ul className="divide-y divide-slate-100">
                  {items.map((l) => (
                    <li key={l.id} className="flex items-center justify-between px-4 py-2.5">
                      <span>
                        <span className="block text-sm font-medium text-ink">{l.name}</span>
                        <span className="block text-xs text-muted">
                          {l.quantityG}g · P{l.protein} K{l.carbs} Y{l.fat}
                        </span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-ink">{l.kcal}</span>
                        <button onClick={() => removeLog(l.id)} className="text-muted hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        ))}
      </div>

      {/* Ekleme paneli */}
      {selected && (
        <div className="fixed inset-0 z-30 flex items-end bg-black/40" onClick={() => setSelected(null)}>
          <div
            className="w-full rounded-t-3xl bg-white p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-ink">{selected.name}</h3>
                <p className="text-xs text-muted">{selected.servingLabel ?? `${selected.defaultServingG}g porsiyon`}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted">
                <X size={22} />
              </button>
            </div>

            <label className="mb-3 block">
              <span className="mb-1 block text-sm font-medium text-ink">Miktar (gram)</span>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                inputMode="numeric"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </label>

            <div className="mb-4">
              <span className="mb-1 block text-sm font-medium text-ink">Öğün</span>
              <div className="grid grid-cols-4 gap-2">
                {MEAL_ORDER.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMealType(m)}
                    className={`rounded-lg border px-1 py-2 text-xs font-semibold ${
                      mealType === m ? 'border-brand bg-brand-soft text-brand-dark' : 'border-slate-200 text-muted'
                    }`}
                  >
                    {MEAL_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const q = Number(quantity) || 0;
              const factor = q / 100;
              return (
                <div className="mb-4 flex items-center justify-between rounded-xl bg-canvas px-3 py-2.5">
                  <span className="text-sm font-semibold text-ink">
                    {Math.round(selected.kcalPer100g * factor)} kcal
                  </span>
                  <MacroPills
                    protein={selected.proteinPer100g * factor}
                    carbs={selected.carbsPer100g * factor}
                    fat={selected.fatPer100g * factor}
                  />
                </div>
              );
            })()}

            <Button className="w-full py-3" onClick={confirmAdd}>
              <Plus size={18} /> Günlüğe ekle
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
