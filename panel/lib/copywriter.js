// Kombin (set) urunleri icin baslik + aciklama uretir.
// OPENAI_API_KEY tanimliysa gercek urun verisinden AI ile yazdirir (100 karakter siniri,
// uydurma iddia yasak); tanimli degilse dolgu kelimeleri temizleyip urunlerin gercek
// isimlerinden akilli bir baslik/aciklama kurar. Ikisi de gercek Trendyol verisinden calisir.

const STOPWORDS = new Set([
  'kadin', 'erkek', 'unisex', 'parfum', 'parfumu', 'kalici', 'kalicilik', 'yuksek', 'esans',
  'esansli', 'esanslar', 'yayilim', 'ozel', 'tasarim', 'edp', 'vucut', 'spreyi', 'vucudu',
  'gucunde', 'yeni', 'seri', 've', 'ile', 'icin', 'icinde',
]);

function trFold(s) {
  return String(s || '')
    .replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g').replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o').replace(/[şŞ]/g, 's').replace(/[üÜ]/g, 'u')
    .toLowerCase();
}

function identityOf(title, maxWords) {
  const tokens = String(title || '').split(/[\s|]+/).filter(Boolean);
  const kept = tokens.filter((t) => !STOPWORDS.has(trFold(t).replace(/[^a-z0-9]/g, '')));
  const use = (kept.length ? kept : tokens).slice(0, maxWords);
  return use.join(' ').trim();
}

export function algorithmicCopy(parts, { mothersDay = false } = {}) {
  let title = '';
  for (let n = 3; n >= 1; n--) {
    const idents = parts.map((p) => identityOf(p.title, parts.length >= 4 ? Math.min(n, 2) : n));
    title = mothersDay
      ? `${idents.join(' & ')} Anneler Günü Hediye Seti`
      : `${idents.join(' & ')} ${parts.length}'li Set`;
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
