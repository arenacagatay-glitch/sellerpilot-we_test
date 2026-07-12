import type { Food, MealType } from '../types';

// Open Food Facts — ücretsiz, açık besin/ürün veritabanı (barkodlu, milyonlarca ürün).
// CORS açıktır, tarayıcıdan doğrudan çağrılabilir. Anahtar gerekmez.
// Docs: https://openfoodfacts.github.io/openfoodfacts-server/api/

const FIELDS = 'code,product_name,product_name_tr,brands,nutriments,serving_quantity,categories';
const ALL_MEALS: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

interface OFFProduct {
  code?: string;
  product_name?: string;
  product_name_tr?: string;
  brands?: string;
  categories?: string;
  serving_quantity?: number | string;
  nutriments?: Record<string, number | string | undefined>;
}

function num(v: unknown): number {
  const n = typeof v === 'string' ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : 0;
}

// Bir OFF ürününü uygulamanın Food tipine çevirir. Kalori bilgisi yoksa null.
function mapProduct(p: OFFProduct): Food | null {
  const n = p.nutriments ?? {};
  const kcal = num(n['energy-kcal_100g']);
  if (!p.code || kcal <= 0) return null;

  const name = (p.product_name_tr || p.product_name || '').trim();
  if (!name) return null;

  const serving = num(p.serving_quantity);
  const brand = (p.brands || '').split(',')[0]?.trim();

  return {
    id: `off:${p.code}`,
    name: brand ? `${name} (${brand})` : name,
    category: 'Open Food Facts',
    kcalPer100g: Math.round(kcal),
    proteinPer100g: Math.round(num(n['proteins_100g']) * 10) / 10,
    carbsPer100g: Math.round(num(n['carbohydrates_100g']) * 10) / 10,
    fatPer100g: Math.round(num(n['fat_100g']) * 10) / 10,
    defaultServingG: serving > 0 && serving <= 1000 ? Math.round(serving) : 100,
    mealTypes: ALL_MEALS,
    regionTags: ['off'],
  };
}

/** Metinle Open Food Facts araması. Hata/ağ sorununda boş dizi döner. */
export async function searchOFF(query: string, signal?: AbortSignal): Promise<Food[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const url =
    `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(q)}` +
    `&fields=${FIELDS}&page_size=25&sort_by=popularity_key`;
  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
    if (!res.ok) return [];
    const data = (await res.json()) as { products?: OFFProduct[] };
    const foods = (data.products ?? []).map(mapProduct).filter((f): f is Food => f != null);
    // Aynı ürün adından tekilleştir
    const seen = new Set<string>();
    return foods.filter((f) => {
      const key = f.name.toLocaleLowerCase('tr');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return [];
  }
}

/** Barkod numarasıyla tek ürün araması. */
export async function lookupBarcode(code: string, signal?: AbortSignal): Promise<Food | null> {
  const c = code.trim().replace(/\D/g, '');
  if (c.length < 6) return null;
  const url = `https://world.openfoodfacts.org/api/v2/product/${c}?fields=${FIELDS}`;
  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = (await res.json()) as { status?: number; product?: OFFProduct };
    if (data.status !== 1 || !data.product) return null;
    return mapProduct(data.product);
  } catch {
    return null;
  }
}
