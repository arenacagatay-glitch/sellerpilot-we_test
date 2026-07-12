import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Trash2, X, ScanBarcode, Loader2 } from 'lucide-react';
import { useProfiles } from '../state/ProfileContext';
import { useDayLog } from '../state/useDayLog';
import { searchFoods } from '../data/foods';
import { searchOFF, lookupBarcode } from '../lib/openFoodFacts';
import { MEAL_LABELS } from '../lib/mealPlanner';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { Button, Card, MacroPills, PageTitle } from '../components/ui';
import type { Food, MealType } from '../types';

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

function FoodRow({ food, onPick }: { food: Food; onPick: (f: Food) => void }) {
  return (
    <button
      onClick={() => onPick(food)}
      className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-slate-50"
    >
      <span>
        <span className="block text-sm font-medium text-ink">{food.name}</span>
        <span className="block text-xs text-muted">
          {food.kcalPer100g} kcal/100g · {food.category}
        </span>
      </span>
      <Plus size={18} className="text-brand" />
    </button>
  );
}

export function Diary() {
  const { activeProfile } = useProfiles();
  const { logs, totals, addFood, removeLog } = useDayLog(activeProfile?.id);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');

  const [remote, setRemote] = useState<Food[]>([]);
  const [searching, setSearching] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const localResults = useMemo(() => searchFoods(query).slice(0, 12), [query]);

  // Open Food Facts araması (debounce + iptal edilebilir)
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setRemote([]);
      setSearching(false);
      return;
    }
    const controller = new AbortController();
    setSearching(true);
    const t = setTimeout(async () => {
      const results = await searchOFF(q, controller.signal);
      if (!controller.signal.aborted) {
        setRemote(results);
        setSearching(false);
      }
    }, 400);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [query]);

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
    setRemote([]);
  };

  const handleBarcode = async (code: string) => {
    setScannerOpen(false);
    setNotice('');
    const food = await lookupBarcode(code);
    if (food) openFood(food);
    else setNotice(`Barkod bulunamadı (${code}). Elle arayabilirsin.`);
  };

  const grouped = MEAL_ORDER.map((m) => ({ meal: m, items: logs.filter((l) => l.mealType === m) }));

  return (
    <div>
      <PageTitle title="Günlük" subtitle={`Bugün toplam ${Math.round(totals.kcal)} kcal`} />

      {/* Arama + barkod */}
      <div className="mb-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            placeholder="Besin ara (tavuk, yoğurt, çikolata...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => { setNotice(''); setScannerOpen(true); }}
          className="flex items-center justify-center rounded-xl bg-brand px-3.5 text-white"
          aria-label="Barkod okut"
        >
          <ScanBarcode size={20} />
        </button>
      </div>

      {notice && <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700">{notice}</p>}

      {query.trim().length >= 1 && (
        <Card className="mb-4 max-h-80 overflow-y-auto p-0">
          <ul className="divide-y divide-slate-100">
            {localResults.length > 0 && (
              <li className="bg-slate-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                Uygulama veritabanı
              </li>
            )}
            {localResults.map((f) => (
              <li key={f.id}>
                <FoodRow food={f} onPick={openFood} />
              </li>
            ))}

            <li className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              Open Food Facts {searching && <Loader2 size={13} className="animate-spin" />}
            </li>
            {remote.map((f) => (
              <li key={f.id}>
                <FoodRow food={f} onPick={openFood} />
              </li>
            ))}
            {!searching && remote.length === 0 && localResults.length === 0 && (
              <li className="px-4 py-3 text-sm text-muted">Sonuç yok. Barkodla deneyebilirsin.</li>
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
              <span className="text-xs text-muted">{items.reduce((s, i) => s + i.kcal, 0)} kcal</span>
            </div>
            {items.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-3 py-2.5 text-xs text-muted">Boş</p>
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

      {/* Barkod tarayıcı */}
      {scannerOpen && <BarcodeScanner onDetected={handleBarcode} onClose={() => setScannerOpen(false)} />}

      {/* Ekleme paneli */}
      {selected && (
        <div className="fixed inset-0 z-30 flex items-end bg-black/40" onClick={() => setSelected(null)}>
          <div className="w-full rounded-t-3xl bg-white p-5 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-ink">{selected.name}</h3>
                <p className="text-xs text-muted">
                  {selected.servingLabel ?? `${selected.defaultServingG}g porsiyon`} · {selected.category}
                </p>
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
                  <span className="text-sm font-semibold text-ink">{Math.round(selected.kcalPer100g * factor)} kcal</span>
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
