// ═══════════════════════════════════════════════════════════════════
// Build sonrası SEO ön-render'ı.
//
// Site bir SPA: Googlebot ham HTML'de sadece boş bir #root görüyordu ve
// başlık/açıklama JS ile sonradan yazıldığı için 35 blog yazısının hepsi
// aynı <title> ile taranıyordu. Bu script her yazı için dist/ altına
// gerçek bir HTML dosyası yazar — kendi başlığı, açıklaması, canonical'ı,
// OG etiketleri, Article şeması ve tam metniyle.
//
// Statik dosya vercel.json'daki SPA rewrite'ından ÖNCE servis edilir,
// dolayısıyla /blog/<slug> bu dosyaya düşer. React yüklenince #root'un
// içeriğini kendi sürümüyle değiştirir; ön-render'lanan metin ile React'in
// bastığı metin aynı olduğu için kullanıcı tarafında kopukluk olmaz.
// ═══════════════════════════════════════════════════════════════════
import { build } from 'esbuild';
import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://sellerpilot.cloud';

// Yazılar .ts dosyalarında; node doğrudan okuyamaz, önce tek bir .mjs'e derliyoruz.
// blogContent*.ts dosyaları DİSKTEN BULUNUR — yeni bir içerik dosyası eklendiğinde
// burayı güncellemek gerekmesin diye. (Sabit liste tutulsaydı, unutulan dosyanın
// yazıları sessizce ön-render'sız ve sitemap'siz kalırdı.)
async function loadPosts() {
  const files = (await readdir(ROOT))
    .filter((f) => /^blogContent\d+\.ts$/.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10));
  if (!files.length) throw new Error('blogContent*.ts bulunamadı');

  const names = files.map((f, i) => ({ mod: './' + f.replace(/\.ts$/, ''), as: `P${i}` }));
  const tmp = path.join(ROOT, '.prerender-posts.mjs');
  await build({
    stdin: {
      contents: `
        ${names.map((n) => `import * as ${n.as} from '${n.mod}';`).join('\n')}
        const pick = (m) => Object.values(m).find(Array.isArray) ?? [];
        export const ALL = [${names.map((n) => `...pick(${n.as})`).join(', ')}]
          .sort((a, b) => (a.date < b.date ? 1 : -1));
      `,
      resolveDir: ROOT,
      loader: 'ts',
    },
    bundle: true, format: 'esm', outfile: tmp, logLevel: 'silent',
  });
  const { ALL } = await import(pathToFileURL(tmp).href + `?t=${Date.now()}`);
  await rm(tmp, { force: true });

  // Aynı slug iki dosyada varsa sessizce üzerine yazılır — build'i kırıp haber ver.
  const dup = ALL.map((p) => p.slug).filter((s, i, a) => a.indexOf(s) !== i);
  if (dup.length) throw new Error(`Aynı slug birden fazla kez tanımlı: ${[...new Set(dup)].join(', ')}`);
  console.log(`  ${files.length} içerik dosyası okundu: ${files.join(', ')}`);
  return ALL;
}

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// blogContent'teki markdown-lite (##, ###, - liste, **kalın**) → statik HTML.
// BlogPages.tsx'teki renderer ile aynı kuralları uygular.
function mdToHtml(content) {
  const inline = (t) => esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return content.split(/\n\n+/).map((block) => {
    const t = block.trim();
    if (!t) return '';
    if (t.startsWith('### ')) return `<h3>${inline(t.slice(4))}</h3>`;
    if (t.startsWith('## ')) return `<h2>${inline(t.slice(3))}</h2>`;
    if (t.split('\n').every((l) => l.trim().startsWith('- ')))
      return `<ul>${t.split('\n').map((l) => `<li>${inline(l.trim().slice(2))}</li>`).join('')}</ul>`;
    return `<p>${inline(t.replace(/\n/g, ' '))}</p>`;
  }).join('\n');
}

// İlk paragrafı düz metne indirger (Article şemasındaki articleBody başlangıcı için).
const plain = (content) => content
  .replace(/^#{2,3} .*$/gm, '').replace(/\*\*/g, '').replace(/^- /gm, '')
  .replace(/\s+/g, ' ').trim();

function page({ title, description, canonical, bodyHtml, jsonLd, headExtra = '' }, shell) {
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="SellerPilot" />`,
    `<meta property="og:locale" content="tr_TR" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    headExtra,
    jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : '',
  ].filter(Boolean).join('\n    ');

  return shell
    // index.html'deki sabit başlığı bu sayfaya özel head ile değiştir
    .replace(/<title>[^<]*<\/title>/, head)
    // ön-render'lanan içerik #root içine girer; React yüklenince onu değiştirir
    .replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
}

// React devralana kadar görünen ~yarım saniyelik ilk boyama.
// Marka renkleri brand ile aynı; gizli metin YOK (cloaking değil, aynı içerik).
const FALLBACK_CSS = `<style id="pr-css">
#root .pr{max-width:46rem;margin:0 auto;padding:6rem 1.25rem 4rem;font-family:Inter,system-ui,sans-serif;color:#2a2724;line-height:1.8}
#root .pr h1{font-family:'Inter Tight',Inter,sans-serif;font-size:clamp(1.9rem,1.4rem+2vw,2.8rem);line-height:1.15;letter-spacing:-.03em;margin:0 0 1rem;color:#14110f}
#root .pr h2{font-family:'Inter Tight',Inter,sans-serif;font-size:1.5rem;letter-spacing:-.025em;margin:2.5rem 0 .75rem;color:#14110f}
#root .pr h3{font-size:1.15rem;margin:1.75rem 0 .5rem;color:#14110f}
#root .pr p,#root .pr li{color:#55504a}
#root .pr .meta{font-size:.8rem;color:#8a827a;margin-bottom:2rem}
#root .pr ul{padding-left:1.1rem}#root .pr li{margin:.4rem 0}
#root .pr a{color:#FF6B35}
</style>`;

async function main() {
  if (!existsSync(DIST)) throw new Error('dist/ yok — önce `vite build` çalıştırın.');
  const shellRaw = await readFile(path.join(DIST, 'index.html'), 'utf8');
  const shell = shellRaw.replace('</head>', `${FALLBACK_CSS}\n  </head>`);
  const posts = await loadPosts();

  const fmt = (iso) => new Date(iso + 'T12:00:00')
    .toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  // ── Tekil yazılar ──
  for (const p of posts) {
    const canonical = `${SITE}/blog/${p.slug}`;
    const body = `<div class="pr"><article>
<p class="meta">${esc(p.category)} · ${esc(fmt(p.date))} · ${p.minutes} dk okuma</p>
<h1>${esc(p.title)}</h1>
${mdToHtml(p.content)}
<p><a href="/blog">Tüm yazılar</a></p>
</article></div>`;
    const html = page({
      title: `${p.title} | SellerPilot Blog`,
      description: p.description,
      canonical,
      bodyHtml: body,
      headExtra: `<meta property="article:published_time" content="${p.date}" />`,
      jsonLd: {
        '@context': 'https://schema.org', '@type': 'BlogPosting',
        headline: p.title, description: p.description,
        datePublished: p.date, dateModified: p.date,
        inLanguage: 'tr-TR', articleSection: p.category,
        author: { '@type': 'Organization', name: 'SellerPilot', url: SITE },
        publisher: { '@type': 'Organization', name: 'SellerPilot', url: SITE },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
        articleBody: plain(p.content).slice(0, 5000),
      },
    }, shell);
    const dir = path.join(DIST, 'blog', p.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), html);
  }

  // ── Blog liste sayfası ──
  const listBody = `<div class="pr">
<h1>Trendyol rehberleri</h1>
<p>Soru-cevap, mağaza puanı, iade ve satış üzerine — kendi mağazalarımızda yaşayarak öğrendiklerimiz.</p>
<ul>${posts.map((p) => `<li><a href="/blog/${p.slug}">${esc(p.title)}</a> — ${esc(p.description)}</li>`).join('')}</ul>
</div>`;
  const listHtml = page({
    title: 'Blog — Trendyol Satıcıları İçin Rehberler | SellerPilot',
    description: 'Trendyol satıcıları için soru-cevap, mağaza puanı, iade, stok ve yapay zekâ rehberleri. Kendi mağazalarımızda yaşayarak öğrendiklerimiz.',
    canonical: `${SITE}/blog`,
    bodyHtml: listBody,
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'Blog',
      name: 'SellerPilot Blog', url: `${SITE}/blog`, inLanguage: 'tr-TR',
      blogPost: posts.map((p) => ({
        '@type': 'BlogPosting', headline: p.title,
        url: `${SITE}/blog/${p.slug}`, datePublished: p.date,
      })),
    },
  }, shell).replace('<meta property="og:type" content="article" />', '<meta property="og:type" content="website" />');
  await mkdir(path.join(DIST, 'blog'), { recursive: true });
  await writeFile(path.join(DIST, 'blog', 'index.html'), listHtml);

  // ── sitemap.xml ──
  const statics = [
    { loc: `${SITE}/`, pri: '1.0', freq: 'weekly' },
    { loc: `${SITE}/blog`, pri: '0.9', freq: 'weekly' },
    { loc: `${SITE}/gorsel-studyo`, pri: '0.8', freq: 'monthly' },
    { loc: `${SITE}/danismanlik`, pri: '0.8', freq: 'monthly' },
  ];
  const today = posts[0]?.date ?? '2026-07-30';
  const urls = [
    ...statics.map((s) => `  <url><loc>${s.loc}</loc><lastmod>${today}</lastmod><changefreq>${s.freq}</changefreq><priority>${s.pri}</priority></url>`),
    ...posts.map((p) => `  <url><loc>${SITE}/blog/${p.slug}</loc><lastmod>${p.date}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`),
  ].join('\n');
  await writeFile(path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.w3.org/1999/sitemaps/schema/0.9">\n${urls}\n</urlset>\n`
      .replace('www.w3.org/1999/sitemaps/schema/0.9', 'www.sitemaps.org/schemas/sitemap/0.9'));

  console.log(`✓ ön-render: ${posts.length} yazı + liste + sitemap (${posts.length + statics.length} URL)`);
}

main().catch((e) => { console.error('✗ ön-render başarısız:', e); process.exit(1); });
