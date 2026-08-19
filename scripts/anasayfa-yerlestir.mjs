// ═══════════════════════════════════════════════════════════════════
// Ana sayfayı yerine koyar — build'in EN SON adımı.
//
// NEDEN GEREKLİ:
// Vercel'de `rewrites` dosya sistemi kontrolünden SONRA çalışır. `/` istendiğinde
// dist/index.html fiziksel olarak var olduğu için doğrudan o servis edilir ve
// vercel.json'daki `"/" → "/anasayfa.html"` kuralı HİÇ devreye girmez.
// (4 Ağu 2026'da tam olarak bu yaşandı: deploy READY'ydi, site değişmemişti.)
//
// ÇÖZÜM: dosyaları takas et.
//   dist/index.html  (SPA kabuğu) → dist/app.html   ← diğer rotalar buraya rewrite edilir
//   dist/anasayfa.html            → dist/index.html ← "/" artık yeni ana sayfa
//
// ⚠️ prerender.mjs dist/index.html'i blog sayfaları için KABUK olarak okuyor,
// bu yüzden bu adım ondan SONRA çalışmak zorunda (buildCommand sırası).
// ═══════════════════════════════════════════════════════════════════
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const spa      = path.join(DIST, 'index.html');
const spaHedef = path.join(DIST, 'app.html');
const yeni     = path.join(DIST, 'anasayfa.html');

if (!existsSync(DIST))  throw new Error('dist/ yok — önce `vite build` çalıştırın.');
if (!existsSync(spa))   throw new Error('dist/index.html yok — vite build başarısız mı?');
if (!existsSync(yeni))  throw new Error('dist/anasayfa.html yok — public/anasayfa.html eksik.');

// 1) SPA kabuğunu app.html olarak sakla
await copyFile(spa, spaHedef);

// Yorum ve iç not temizleme fonksiyonu (HTML / JS / CSS)
function minifiEt(html) {
  // HTML yorumlarını temizle
  let temiz = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
  // script içindeki satır içi ve blok yorumları temizle (URL'leri bozmadan)
  temiz = temiz.replace(/<script([^>]*)>([\s\S]*?)<\/script>/g, (_, attrs, code) => {
    const lines = code.split('\n');
    const cleanedLines = lines.filter(l => !l.trim().startsWith('//'));
    const noBlockComments = cleanedLines.join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
    return `<script${attrs}>${noBlockComments}</script>`;
  });
  // style içindeki CSS yorumlarını temizle
  temiz = temiz.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (_, attrs, css) => {
    return `<style${attrs}>${css.replace(/\/\*[\s\S]*?\*\//g, '')}</style>`;
  });
  return temiz;
}

// 2) Yeni ana sayfayı oku, temizle ve index.html'in yerine koy
const hamYeni = await readFile(yeni, 'utf8');
const temizYeni = minifiEt(hamYeni);
await writeFile(spa, temizYeni, 'utf8');

// 3) Geri oku ve doğrula — sessiz başarısızlık olmasın
const sonuc = await readFile(spa, 'utf8');
const kabuk = await readFile(spaHedef, 'utf8');

if (!sonuc.includes('Artık müşteri hizmetleri')) {
  throw new Error('dist/index.html yeni ana sayfa DEĞİL — takas başarısız.');
}

// ⛔ İÇERİDEKİ NOTLAR CANLIYA ÇIKAMAZ.
// 4 Ağu 2026: anasayfa.html kaynaktan yeniden üretilirken temizlik adımı
// atlandı ve "🔍 ÖNİZLEME — yayında değil" çubuğu CANLI ana sayfaya geri
// geldi. Kullanıcı gördü. Elle temizliğe güvenmek yerine build'i kırıyoruz.
const yasak = [
  ['ÖNİZLEME',      'önizleme çubuğu'],
  ['class="note"',  'iç yapı notu'],
  ['noteBtn',       'yapı notu düğmesi'],
  ['yayında değil', '"yayında değil" ibaresi'],
  ['helium10.com',  'rakip adı'],
  ['LandingV2',     'iç dosya adı'],
];
const bulunan = yasak.filter(([k]) => sonuc.includes(k));
if (bulunan.length) {
  throw new Error(
    'CANLI SAYFADA OLMAMASI GEREKEN İÇERİK VAR → ' +
    bulunan.map(([k, ad]) => `${ad} ("${k}")`).join(', ') +
    '\npublic/anasayfa.html temizlenmeden yayına çıkamaz.'
  );
}
if (!kabuk.includes('<div id="root">') && !kabuk.includes('id="root"')) {
  throw new Error('dist/app.html SPA kabuğu değil — diğer rotalar kırılırdı.');
}

console.log('✓ Ana sayfa yerleştirildi:');
console.log('  dist/index.html → yeni ana sayfa (' + sonuc.length + ' bayt)');
console.log('  dist/app.html   → SPA kabuğu   (' + kabuk.length + ' bayt)');
