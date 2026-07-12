import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as ty from './lib/trendyol.js';
import { generateProductImages } from './lib/openaiImages.js';
import { uploadImage, isConfigured as storageConfigured } from './lib/storage.js';
import { slugify } from './lib/slug.js';
import { composeCopy } from './lib/copywriter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// PANEL_USER/PANEL_PASSWORD tanimliysa Basic Auth ile korur (ornegin canli/Vercel dagitiminda);
// yerel gelistirmede bu degiskenler bos oldugu icin acik kalir.
function timingSafeEq(a, b) {
  const bufA = Buffer.from(String(a)); const bufB = Buffer.from(String(b));
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}
app.use((req, res, next) => {
  const user = process.env.PANEL_USER;
  const pass = process.env.PANEL_PASSWORD;
  if (!user || !pass) return next();
  const header = req.headers.authorization || '';
  if (header.startsWith('Basic ')) {
    const [u, p] = Buffer.from(header.slice(6), 'base64').toString('utf8').split(':');
    if (timingSafeEq(u || '', user) && timingSafeEq(p || '', pass)) return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="SellerPilot Panel"');
  res.status(401).send('Yetkisiz erisim');
});

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

const asyncRoute = (fn) => (req, res) => {
  fn(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({ error: String(err.message || err) });
  });
};

app.get('/api/config', (req, res) => {
  res.json({
    trendyol: Boolean(process.env.TRENDYOL_SELLER_ID && process.env.TRENDYOL_API_KEY && process.env.TRENDYOL_API_SECRET),
    sellerId: process.env.TRENDYOL_SELLER_ID || null,
    openai: Boolean(process.env.OPENAI_API_KEY),
    storage: storageConfigured(),
    bucket: process.env.SUPABASE_BUCKET || 'urun-gorselleri',
  });
});

// ---- Trendyol: okuma ----
app.get('/api/products', asyncRoute(async (req, res) => {
  const { page, size, approved, barcode } = req.query;
  const data = await ty.getProducts({ page, size, approved, barcode });
  res.json({
    page: data.page,
    totalPages: data.totalPages,
    totalElements: data.totalElements,
    content: (data.content || []).map((p) => ({
      barcode: p.barcode,
      title: p.title,
      productUrl: p.productUrl,
      locked: p.locked,
      hasActiveCampaign: p.hasActiveCampaign,
      brand: p.brand,
      brandId: p.brandId,
      categoryName: p.categoryName,
      pimCategoryId: p.pimCategoryId,
      productMainId: p.productMainId,
      stockCode: p.stockCode,
      quantity: p.quantity,
      listPrice: p.listPrice,
      salePrice: p.salePrice,
      vatRate: p.vatRate,
      dimensionalWeight: p.dimensionalWeight,
      description: p.description,
      approved: p.approved,
      archived: p.archived,
      onSale: p.onSale ?? p.onsale,
      images: (p.images || []).map((i) => i.url),
      attributes: (p.attributes || []).map((a) => ({
        attributeId: a.attributeId,
        attributeName: a.attributeName,
        attributeValueId: a.attributeValueId,
        attributeValue: a.attributeValue,
      })),
    })),
  });
}));

app.get('/api/brands', asyncRoute(async (req, res) => {
  res.json(await ty.getBrandsByName(String(req.query.name || '')));
}));

app.get('/api/categories', asyncRoute(async (req, res) => {
  res.json(await ty.searchCategories(req.query.q, 50));
}));

app.get('/api/categories/:id/attributes', asyncRoute(async (req, res) => {
  const data = await ty.getCategoryAttributes(req.params.id);
  res.json({
    categoryId: data.id,
    categoryName: data.name,
    attributes: (data.categoryAttributes || []).map((a) => ({
      attributeId: a.attribute?.id,
      name: a.attribute?.name,
      required: a.required,
      varianter: a.varianter,
      allowCustom: a.allowCustom,
      slicer: a.slicer,
      values: (a.attributeValues || []).map((v) => ({ id: v.id, name: v.name })),
    })),
  });
}));

// ---- Trendyol: yazma ----
app.post('/api/products/create', asyncRoute(async (req, res) => {
  const items = req.body?.items;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items bos olamaz' });
  }
  const problems = [];
  items.forEach((it, i) => {
    const tag = it.barcode || `#${i + 1}`;
    for (const f of ['barcode', 'title', 'productMainId', 'brandId', 'categoryId', 'stockCode', 'description']) {
      if (it[f] === undefined || it[f] === null || it[f] === '') problems.push(`${tag}: '${f}' eksik`);
    }
    if (!Array.isArray(it.images) || it.images.length === 0) problems.push(`${tag}: en az 1 gorsel gerekli`);
    if ((it.images || []).length > 8) problems.push(`${tag}: en fazla 8 gorsel olabilir`);
    (it.images || []).forEach((im) => {
      if (!String(im.url || '').startsWith('https://')) problems.push(`${tag}: gorsel URL'leri https olmali`);
    });
    if (Number(it.salePrice) > Number(it.listPrice)) problems.push(`${tag}: satis fiyati liste fiyatindan buyuk olamaz`);
    if (String(it.title || '').length > 100) problems.push(`${tag}: baslik 100 karakteri asamaz`);
    if (String(it.barcode || '').length > 40) problems.push(`${tag}: barkod 40 karakteri asamaz`);
  });
  if (problems.length) return res.status(400).json({ error: 'Dogrulama hatalari', problems });

  const result = await ty.createProducts(items);
  res.json(result); // { batchRequestId }
}));

app.get('/api/batch/:id', asyncRoute(async (req, res) => {
  res.json(await ty.getBatchStatus(req.params.id));
}));

app.post('/api/price-stock', asyncRoute(async (req, res) => {
  const items = req.body?.items;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items bos olamaz' });
  }
  res.json(await ty.updatePriceStock(items));
}));

// ---- Otomatik kombin onerisi ----
// Bir arama kelimesine gore (ornegin "kadin parfum") stoklu/onayli urunleri 2'li/3'lu/4'lu
// gruplayip baslik+aciklama (AI varsa AI, yoksa akilli algoritma) ile GORSELSIZ taslak
// dondurur. Gorseller kullanici tarafindan sonradan eklenir; hicbir Trendyol yazma
// islemi yapilmaz (sadece okuma).
async function buildCombo(parts, discount) {
  const mothersDay = parts.length >= 3;
  const { title, description, source } = await composeCopy(parts, { mothersDay });

  // Barkod <=40 karakter olmali (Trendyol siniri): stamp (8 kar.) + tire icin pay birakip
  // urun sayisina gore her parcadan alinacak karakter sayisini kucult.
  const stamp = Date.now().toString(36).slice(-5) + Math.random().toString(36).slice(2, 5);
  const perLen = Math.max(3, Math.floor((31 - 4 - (parts.length - 1)) / parts.length));
  const base = ('SET-' + parts.map((p) => p.barcode.slice(0, perLen)).join('-')).slice(0, 31);
  const barcode = base + '-' + stamp;

  const list = parts.reduce((t, p) => t + Number(p.listPrice || p.salePrice || 0), 0);
  const sale = Math.round(parts.reduce((t, p) => t + Number(p.salePrice || 0), 0) * (1 - discount / 100) * 100) / 100;

  return {
    id: crypto.randomUUID(),
    barcode,
    title,
    productMainId: barcode,
    brandId: parts[0].brandId, brandName: parts[0].brand,
    categoryId: parts[0].pimCategoryId || '', categoryName: parts[0].categoryName || '',
    quantity: Math.min(...parts.map((p) => Number(p.quantity || 0))),
    stockCode: barcode,
    dimensionalWeight: parts.reduce((t, p) => t + Number(p.dimensionalWeight || 1), 0),
    description,
    currencyType: 'TRY',
    listPrice: Math.max(list, sale), salePrice: sale,
    vatRate: parts[0].vatRate ?? 20,
    images: [],
    attributes: (parts[0].attributes || []).map((a) => (a.attributeValueId
      ? { attributeId: a.attributeId, attributeValueId: a.attributeValueId, attributeName: a.attributeName, attributeValue: a.attributeValue }
      : { attributeId: a.attributeId, customAttributeValue: a.attributeValue, attributeName: a.attributeName, attributeValue: a.attributeValue })),
    sourceProducts: parts.map((p) => ({ barcode: p.barcode, title: p.title })),
    setSize: parts.length,
    copySource: source,
  };
}

app.get('/api/combo-suggestions', asyncRoute(async (req, res) => {
  const keyword = String(req.query.q || '').trim().toLocaleLowerCase('tr');
  if (!keyword) return res.status(400).json({ error: 'q (arama kelimesi) gerekli' });
  const exclude = String(req.query.exclude || '').toLocaleLowerCase('tr').split(',').map((s) => s.trim()).filter(Boolean);
  const discount = Math.min(Math.max(Number(req.query.discount) || 12, 0), 50);
  const count2 = Math.min(Math.max(Number(req.query.count2) || 0, 0), 20);
  const count3 = Math.min(Math.max(Number(req.query.count3) || 0, 0), 20);
  const count4 = Math.min(Math.max(Number(req.query.count4) || 0, 0), 20);

  const all = [];
  let page = 0, totalPages = 1;
  do {
    const data = await ty.getProducts({ page, size: 100 });
    all.push(...(data.content || []));
    totalPages = data.totalPages || 1;
    page++;
  } while (page < totalPages && page < 30);

  const candidates = all.filter((p) => {
    const hay = `${p.title || ''} ${p.categoryName || ''}`.toLocaleLowerCase('tr');
    if (!hay.includes(keyword)) return false;
    if (exclude.some((x) => hay.includes(x))) return false;
    if (!p.approved) return false;
    if (!Number(p.quantity)) return false;
    if (!Number(p.salePrice)) return false;
    // Zaten hazir bir "set/kombin" urununu tekrar sete sokma (ör. "Yilbasi Seti", "Parfum Seti").
    const catL = (p.categoryName || '').toLocaleLowerCase('tr');
    if (!keyword.includes('set') && (catL.includes('set') || p.barcode.startsWith('SET-'))) return false;
    return true;
  });

  if (candidates.length < 2) return res.json({ candidates: candidates.length, combos: [] });

  // Ayni urun farkli kombinlerde tekrar kullanilabilir (ör. Hurrem hem bir 2'li hem bir 3'lu
  // sette olabilir); sadece TAMAMEN AYNI urun grubunun iki kez cikmasini engelliyoruz.
  const seen = new Set();
  function pickGroup(size) {
    if (candidates.length < size) return null;
    for (let attempt = 0; attempt < 20; attempt++) {
      const shuffled = [...candidates].sort(() => Math.random() - 0.5).slice(0, size);
      const sig = shuffled.map((p) => p.barcode).sort().join('|');
      if (!seen.has(sig)) { seen.add(sig); return shuffled; }
    }
    return null;
  }

  const plan = [...Array(count2).fill(2), ...Array(count3).fill(3), ...Array(count4).fill(4)];
  const groups = plan.map((size) => pickGroup(size)).filter(Boolean);

  // Baslik/aciklama yazimi (AI kullanilirsa istekler) paralel calisir, boylece toplam sure uzamaz.
  const combos = await Promise.all(groups.map((g) => buildCombo(g, discount)));

  res.json({ candidates: candidates.length, combos });
}));

// ---- Gorsel studyosu ----
app.post('/api/images/generate', upload.single('reference'), asyncRoute(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Referans gorsel yukleyin (reference alani)' });
  const productName = req.body.productName || 'urun';
  const slug = slugify(productName);
  const { images, errors } = await generateProductImages({
    referenceBuffer: req.file.buffer,
    referenceMime: req.file.mimetype,
    extraPrompt: req.body.prompt || '',
    count: req.body.count,
    size: req.body.size || '1024x1536',
    quality: req.body.quality || 'high',
    angleIndex: req.body.angleIndex,
  });

  const stamp = Date.now().toString(36);
  const uploaded = [];
  for (let i = 0; i < images.length; i++) {
    const objectPath = `${slug}/${slug}-${images[i].angle}-${stamp}.png`;
    const url = await uploadImage(images[i].buffer, objectPath, 'image/png');
    uploaded.push({ url, angle: images[i].angle });
  }
  res.json({ images: uploaded, warnings: errors });
}));

app.post('/api/images/upload', upload.array('files', 10), asyncRoute(async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: 'Dosya secilmedi' });
  const slug = slugify(req.body.productName || 'urun');
  const stamp = Date.now().toString(36);
  const uploaded = [];
  for (let i = 0; i < req.files.length; i++) {
    const f = req.files[i];
    const ext = (path.extname(f.originalname) || '.png').toLowerCase();
    const objectPath = `${slug}/${slug}-${stamp}-${i + 1}${ext}`;
    const url = await uploadImage(f.buffer, objectPath, f.mimetype || 'image/png');
    uploaded.push({ url, name: f.originalname });
  }
  res.json({ images: uploaded });
}));

export default app;

// Vercel'de app.listen cagirilmaz; fonksiyon istekleri dogrudan app'e yonlendirir.
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT || 5599);
  app.listen(port, () => {
    console.log(`SellerPilot Panel calisiyor: http://localhost:${port}`);
  });
}
