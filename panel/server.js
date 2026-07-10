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
