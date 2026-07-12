// Kombin (set) urunleri icin baslik + aciklama uretir.
// OPENAI_API_KEY tanimliysa gercek urun verisinden AI ile yazdirir (100 karakter siniri,
// uydurma iddia yasak); tanimli degilse dolgu kelimeleri temizleyip urunlerin gercek
// isimlerinden akilli bir baslik/aciklama kurar. Ikisi de gercek Trendyol verisinden calisir.

const STOPWORDS = new Set([
  'kadin', 'erkek', 'unisex', 'parfum', 'parfumu', 'kalici', 'kalicilik', 'yuksek', 'esans',
  'esansli', 'esanslar', 'yayilim', 'ozel', 'tasarim', 'edp', 'vucut', 'spreyi', 'vucudu',
  'gucunde', 'yeni', 'seri', 've', 'ile', 'icin', 'icinde', 'koku', 'etkili', 'kokusu',
  'ciceksi', 'tatli', 'krem', 'kremi', 'yuz', 'yag', 'yagi', 'temizleyici', 'seti', 'set',
  // Genel bakim/kozmetik dolgu kelimeleri (marka/karakter ismi DEGIL, tesaduf eslesmeye
  // yol acan cok yaygin sifat/madde adlari): akilli aile eslestirmede gurultu yaratiyorlar.
  'hyaluronik', 'hyalüronik', 'asit', 'aloe', 'vera', 'hassas', 'ciltler', 'cilt', 'bakim',
  'bakimi', 'losyonu', 'kokulu', 'nemlendirici', 'nemlendir', 'kolay', 'tarama', 'teli',
  'guclendirici', 'conditioner', 'hair', 'dogal', 'yagli', 'bazli', 'kuru', 'karma', 'gunes',
  'gozenek', 'sikilastirici', 'niasinamid', 'niasina', 'serisi', 'sutu', 'cevresi', 'genital',
  'bolge', 'yikama', 'jeli', 'giderici', 'organik', 'kokusuz', 'roll', 'koltuk', 'deodorant',
  'kabarma', 'belirginlestirici', 'bukle', 'profesyonel', 'yenileme', 'seffaf', 'seyahat',
  'cantasi', 'duzenleme', 'kozmetik', 'karsiti', 'yaslanma', 'kirisiklik', 'koyu', 'leke',
  'aydinlik', 'puruzsuz', 'alti', 'gece', 'gunduz', 'mineralli', 'gliserin', 'provitamin',
  'aktif', 'karbon', 'sabun', 'sabunu', 'zeytinyagi', 'argan', 'sut', 'hindistan', 'cevizi',
  'kutu', 'kraft', 'sise', 'spreyli', 'boy', 'isiltili', 'bloom', 'organik',
  // Baslik-genelinde tekrar eden urun-tipi kelimeleri (marka/koku ismi DEGIL):
  // filtrelenmezse "Body Mist & Body Mist & Body Mist" gibi anlamsiz tekrarli
  // basliklar uretiliyordu.
  'body', 'mist', 'seyahat', 'serum', 'serumu', 'vitamini', 'vitamin', 'losyon',
  'sprey', 'stick', 'roll-on', 'gucunde', 'pro',
]);

const UNIT_RE = /^(\d+([.,]\d+)?%?|ml|lt|l|gr|g|kg|cm|cc|adet|pcs|x)$/i;

function trFold(s) {
  return String(s || '')
    .replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g').replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o').replace(/[şŞ]/g, 's').replace(/[üÜ]/g, 'u')
    .toLowerCase();
}

function identityOf(title, maxWords, fallback) {
  const tokens = String(title || '').split(/[\s|/,-]+/).filter(Boolean);
  const notNoise = (t) => {
    const bare = trFold(t).replace(/[^a-z0-9%]/g, '');
    if (!bare) return false;
    if (UNIT_RE.test(bare)) return false;
    return !STOPWORDS.has(bare);
  };
  const kept = tokens.filter(notNoise);
  // Ozel isim/koku ismi gibi gorunen (buyuk harfle baslayan, >=4 karakter) kelimeleri
  // once tercih et - jenerik urun-tipi kelimelerinin (stopword listesine girmemis olsa
  // bile) basliga hakim olmasini engeller.
  const distinctive = kept.filter((t) => /^[A-ZÇĞİÖŞÜ]/.test(t) && t.replace(/[^\p{L}]/gu, '').length >= 4);
  // Basligin TAMAMI jenerik/dolgu kelimelerden olusuyorsa (ör. "Unisex Erkek Kadın Parfüm")
  // ham kelimelere donmek anlamsiz tekrar uretir - bu durumda marka/kategori kullan.
  const pool = distinctive.length ? distinctive : kept;
  if (!pool.length) return fallback || '';
  // Ayni kelimenin ayni kimlik icinde tekrarini onle (ör. "Bare Vanilla ... Vanilla Wood").
  const dedupPool = [];
  const seenWord = new Set();
  for (const t of pool) {
    const key = trFold(t);
    if (seenWord.has(key)) continue;
    seenWord.add(key);
    dedupPool.push(t);
  }
  const use = dedupPool.slice(0, maxWords);
  const result = use.join(' ').trim();
  return result || fallback || '';
}

// Baslikta gecen "ozel isim gibi" kelimeleri (buyuk harfle baslayan, dolgu olmayan, >=4
// karakter) cikarir. Ayni kelime farkli kategorilerdeki urunlerde geciyorsa (or. "Hurrem"
// hem Parfum hem Vucut Spreyi kategorisinde varsa) bu, ayni "aile"den urunler oldugunun
// isaretidir; kategoriler-arasi akilli eslesme icin kullanilir.
export function distinctiveTokens(title) {
  const tokens = String(title || '').split(/[\s|]+/).filter(Boolean);
  return tokens
    .filter((t) => /^[A-ZÇĞİÖŞÜ]/.test(t))
    .map((t) => t.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter((t) => t.length >= 4)
    .map((t) => trFold(t))
    .filter((t) => !STOPWORDS.has(t));
}

// Ardisik 2 ayirt edici kelimeyi birlikte alir ("cotton island" gibi) - tekli kelimeye gore
// cok daha spesifik, tesaduf eslesme riski dusuk (marka/koku ailesi tespiti icin kullanilir).
export function distinctiveBigrams(title) {
  const toks = distinctiveTokens(title);
  const out = [];
  for (let i = 0; i < toks.length - 1; i++) out.push(toks[i] + ' ' + toks[i + 1]);
  return out;
}

export function algorithmicCopy(parts, { mothersDay = false } = {}) {
  let title = '';
  for (let n = 3; n >= 1; n--) {
    const maxWords = parts.length >= 4 ? Math.min(n, 2) : n;
    const rawIdents = parts.map((p) => identityOf(p.title, maxWords, p.brand || p.categoryName || 'Ürün'));
    // Ayni koku/urun ailesinden birden fazla parca (or. ayni parfumun farkli boyu) ayni
    // ayirt edici ismi uretebilir - tekrar yerine kategoriyle ayristir, yine de ayniysa
    // tek seferde goster (yoksa "X & X & X" gibi anlamsiz tekrar olusuyor).
    const seenCount = new Map();
    const idents = rawIdents.map((ident, i) => {
      const key = ident.toLowerCase();
      const n2 = (seenCount.get(key) || 0) + 1;
      seenCount.set(key, n2);
      if (n2 === 1) return ident;
      const catWord = distinctiveTokens(parts[i].categoryName || '')[0];
      return catWord ? `${ident} ${catWord.charAt(0).toUpperCase()}${catWord.slice(1)}` : ident;
    });
    const uniqueIdents = [...new Set(idents)];
    title = mothersDay
      ? `${uniqueIdents.join(' & ')} Anneler Günü Hediye Seti`
      : `${uniqueIdents.join(' & ')} ${parts.length}'li Set`;
    if (title.length <= 100) break;
  }
  if (title.length > 100) title = title.slice(0, 100);

  const intro = mothersDay
    ? `<p><b>Anneler Günü'ne özel hazırlanan bu ${parts.length}'li hediye seti</b>, sevdiklerinize özel, güzel bir sürpriz sunmak için bir araya getirildi.</p>`
    : '';
  const description = (intro + parts.map((p) => `<h3>${p.title}</h3>` + (p.description || '')).join('<hr/>')).slice(0, 29000);
  return { title, description };
}

function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function sanitizeHtml(s) {
  return String(s || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '');
}

async function aiCopy(parts, { mothersDay = false } = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const model = process.env.OPENAI_TEXT_MODEL || 'gpt-4o-mini';

  const src = parts.map((p, i) => `Ürün ${i + 1} başlık: ${p.title}\nÜrün ${i + 1} açıklama: ${stripHtml(p.description).slice(0, 600)}`).join('\n\n');
  const rules = [
    'Başlık KESİNLİKLE 100 karakteri geçmemeli.',
    'Başlık Türkçe, satış odaklı, abartısız olmalı.',
    mothersDay
      ? 'Başlıkta Anneler Günü temasına uygun kelimeler MUTLAKA geçmeli (ör. "Anneler Günü Hediyesi", "Anneler Gününe Özel").'
      : 'Başlıkta ürünlerin gerçek isimlerini/ayırt edici kelimelerini kullan.',
    'Açıklama basit HTML olmalı (h3, p, hr), 2-3 kısa paragraf, ürünlerin GERÇEK özelliklerinden bahsetmeli, uydurma iddia (sahte sertifika, yanlış içerik vb.) içermemeli.',
  ].join(' ');
  const user = `Aşağıdaki ${parts.length} ürünü tek bir SET olarak satacağım.\n\n${src}\n\nKurallar: ${rules}\n\nSadece şu JSON formatında cevap ver, başka hiçbir şey yazma:\n{"title": "...", "description": "..."}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'Sen bir Türkçe e-ticaret metin yazarısın. Trendyol için ürün seti başlığı ve HTML açıklaması yazacaksın.' },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const title = String(parsed.title || '').trim().slice(0, 100);
    const description = sanitizeHtml(String(parsed.description || '').trim()).slice(0, 29000);
    if (!title || !description) return null;
    return { title, description };
  } catch {
    return null;
  }
}

export async function composeCopy(parts, opts = {}) {
  const ai = await aiCopy(parts, opts);
  if (ai) return { ...ai, source: 'openai' };
  return { ...algorithmicCopy(parts, opts), source: 'algorithmic' };
}
