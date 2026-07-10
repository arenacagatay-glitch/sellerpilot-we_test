import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = 'https://apigw.trendyol.com/integration';
const CACHE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.cache');

function cfg() {
  const sellerId = process.env.TRENDYOL_SELLER_ID;
  const apiKey = process.env.TRENDYOL_API_KEY;
  const apiSecret = process.env.TRENDYOL_API_SECRET;
  if (!sellerId || !apiKey || !apiSecret) {
    throw new Error('Trendyol API bilgileri eksik (.env: TRENDYOL_SELLER_ID / TRENDYOL_API_KEY / TRENDYOL_API_SECRET)');
  }
  return { sellerId, apiKey, apiSecret };
}

function headers() {
  const { sellerId, apiKey, apiSecret } = cfg();
  const token = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  return {
    Authorization: `Basic ${token}`,
    'User-Agent': `${sellerId} - SelfIntegration`,
    'Content-Type': 'application/json',
  };
}

async function tyFetch(pathname, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}${pathname}`, {
    method,
    headers: headers(),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const detail = data && (data.errors || data.message) ? JSON.stringify(data.errors || data.message) : text.slice(0, 500);
    throw new Error(`Trendyol ${method} ${pathname} -> HTTP ${res.status}: ${detail}`);
  }
  return data;
}

export function sellerId() {
  return cfg().sellerId;
}

export async function getProducts({ page = 0, size = 50, approved, barcode } = {}) {
  const q = new URLSearchParams({ page: String(page), size: String(size) });
  if (approved !== undefined && approved !== '') q.set('approved', String(approved));
  if (barcode) q.set('barcode', barcode);
  return tyFetch(`/product/sellers/${cfg().sellerId}/products?${q}`);
}

export async function getBrandsByName(name) {
  return tyFetch(`/product/brands/by-name?name=${encodeURIComponent(name)}`);
}

// Kategori agaci buyuk oldugu icin diske cache'lenir (24 saat).
let categoryCache = null;
export async function getFlatCategories() {
  if (categoryCache) return categoryCache;
  const cacheFile = path.join(CACHE_DIR, 'categories.json');
  try {
    const st = fs.statSync(cacheFile);
    if (Date.now() - st.mtimeMs < 24 * 60 * 60 * 1000) {
      categoryCache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      return categoryCache;
    }
  } catch { /* cache yok, asagida cekilecek */ }

  const tree = await tyFetch('/product/product-categories');
  const flat = [];
  const walk = (nodes, trail) => {
    for (const n of nodes || []) {
      const pathNames = [...trail, n.name];
      const isLeaf = !n.subCategories || n.subCategories.length === 0;
      if (isLeaf) flat.push({ id: n.id, name: n.name, path: pathNames.join(' > ') });
      else walk(n.subCategories, pathNames);
    }
  };
  walk(tree.categories, []);
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cacheFile, JSON.stringify(flat));
  categoryCache = flat;
  return flat;
}

export async function searchCategories(query, limit = 50) {
  const flat = await getFlatCategories();
  const q = String(query || '').toLocaleLowerCase('tr');
  if (!q) return flat.slice(0, limit);
  const scored = [];
  for (const c of flat) {
    const hay = c.path.toLocaleLowerCase('tr');
    if (hay.includes(q)) scored.push({ c, exact: c.name.toLocaleLowerCase('tr') === q ? 0 : 1 });
  }
  scored.sort((a, b) => a.exact - b.exact || a.c.path.length - b.c.path.length);
  return scored.slice(0, limit).map((s) => s.c);
}

export async function getCategoryAttributes(categoryId) {
  return tyFetch(`/product/product-categories/${categoryId}/attributes`);
}

// Urun Yaratma V2. V1 servisleri 10 Agustos 2026'da kapaniyor.
export async function createProducts(items) {
  return tyFetch(`/product/sellers/${cfg().sellerId}/v2/products`, {
    method: 'POST',
    body: { items },
  });
}

export async function getBatchStatus(batchRequestId) {
  return tyFetch(`/product/sellers/${cfg().sellerId}/products/batch-requests/${encodeURIComponent(batchRequestId)}`);
}

export async function updatePriceStock(items) {
  return tyFetch(`/inventory/sellers/${cfg().sellerId}/products/price-and-inventory`, {
    method: 'POST',
    body: { items },
  });
}
