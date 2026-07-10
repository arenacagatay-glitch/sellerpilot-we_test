/* SellerPilot Panel — Trendyol ürün/varyasyon operasyonu */

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const state = {
  page: load('sp_prod_page', 0),
  totalPages: load('sp_prod_totalpages', 0),
  products: load('sp_products_cache', []),
  kombin: [], // seçilen barkodlar
  drafts: load('sp_drafts', []),
  gallery: load('sp_gallery', []),
  batches: load('sp_batches', []),
};

function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }
function save() {
  localStorage.setItem('sp_drafts', JSON.stringify(state.drafts));
  localStorage.setItem('sp_gallery', JSON.stringify(state.gallery));
  localStorage.setItem('sp_batches', JSON.stringify(state.batches));
  localStorage.setItem('sp_products_cache', JSON.stringify(state.products));
  localStorage.setItem('sp_prod_page', JSON.stringify(state.page));
  localStorage.setItem('sp_prod_totalpages', JSON.stringify(state.totalPages));
  $('#draftCount').textContent = state.drafts.length;
}

async function api(path, opts = {}) {
  const res = await fetch(path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.problems ? `${data.error}:\n${data.problems.join('\n')}` : (data.error || `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return data;
}

let toastTimer;
function toast(msg, ms = 4200) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), ms);
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Sunucu istek boyutu sinirini asmamak icin (ozellikle canli/Vercel dagitiminda) buyuk telefon
// fotograflarini yuklemeden once tarayicida kucultur.
async function resizeImageFile(file, maxDim = 1600, quality = 0.85) {
  if (!file.type?.startsWith('image/') || file.type === 'image/svg+xml') return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch { return file; }
}

/* ---------- Sekmeler ---------- */
$$('#tabs button').forEach((b) => b.addEventListener('click', () => {
  $$('#tabs button').forEach((x) => x.classList.remove('active'));
  $$('.tab').forEach((x) => x.classList.remove('active'));
  b.classList.add('active');
  $(`#tab-${b.dataset.tab}`).classList.add('active');
}));

/* ---------- Konfigürasyon rozetleri ---------- */
(async () => {
  try {
    const c = await api('/api/config');
    $('#configBadges').innerHTML = [
      `<span class="badge ${c.trendyol ? 'ok' : 'no'}">Trendyol ${c.trendyol ? '✓ ' + esc(c.sellerId) : '✗'}</span>`,
      `<span class="badge ${c.openai ? 'ok' : 'no'}">OpenAI ${c.openai ? '✓' : '✗ key gerekli'}</span>`,
      `<span class="badge ${c.storage ? 'ok' : 'no'}">Görsel Deposu ${c.storage ? '✓' : '✗'}</span>`,
    ].join('');
  } catch (e) { toast('Sunucu ayar bilgisi alınamadı: ' + e.message); }
  save();
})();

/* ---------- Ürünlerim ---------- */
async function loadProducts(page = 0) {
  const term = $('#prodSearch').value.trim();
  const approved = $('#prodApproved').value;
  $('#prodInfo').textContent = 'Yükleniyor...';
  try {
    // Arama terimi varsa: tüm sayfaları çekip barkod VEYA ürün adına göre süz (Trendyol sadece barkodla süzer).
    if (term) {
      const all = [];
      let p = 0, totalPages = 1;
      do {
        const qs = new URLSearchParams({ page: p, size: 100 });
        if (approved) qs.set('approved', approved);
        const data = await api('/api/products?' + qs);
        all.push(...data.content);
        totalPages = data.totalPages || 1;
        $('#prodInfo').textContent = `Aranıyor... (${all.length} ürün tarandı)`;
        p++;
      } while (p < totalPages && p < 30);
      const t = term.toLocaleLowerCase('tr');
      const found = all.filter((x) => (x.barcode || '').toLocaleLowerCase('tr').includes(t) || (x.title || '').toLocaleLowerCase('tr').includes(t));
      state.products = found; state.page = 0; state.totalPages = 1;
      save();
      $('#prodInfo').textContent = `${found.length} sonuç (“${term}”)`;
      $('#prodPage').textContent = '';
      renderProducts();
      return;
    }
    const q = new URLSearchParams({ page, size: 20 });
    if (approved) q.set('approved', approved);
    const data = await api('/api/products?' + q);
    state.page = data.page; state.totalPages = data.totalPages; state.products = data.content;
    save();
    $('#prodInfo').textContent = `${data.totalElements} ürün`;
    $('#prodPage').textContent = `Sayfa ${data.page + 1} / ${data.totalPages || 1}`;
    renderProducts();
  } catch (e) { $('#prodInfo').textContent = ''; toast('Ürünler alınamadı: ' + e.message); }
}

function renderProducts() {
  $('#prodList').innerHTML = state.products.map((p) => `
    <div class="card">
      <img src="${esc(p.images[0] || '')}" data-full="${esc(p.images[0] || '')}" loading="lazy" onerror="this.style.visibility='hidden'" />
      <div class="body">
        <h4>${p.productUrl ? `<a href="${esc(p.productUrl)}" target="_blank" rel="noopener" title="Trendyol'da aç">${esc(p.title)}</a>` : esc(p.title)}</h4>
        <div class="meta">
          <span class="tag ${p.approved ? 'ok' : 'no'}">${p.approved ? 'Onaylı' : 'Onaysız'}</span>
          ${p.onSale ? '<span class="tag ok">Satışta</span>' : ''}
          ${p.hasActiveCampaign ? '<span class="tag ok">Kampanyalı</span>' : ''}
          ${p.locked ? '<span class="tag no">Kilitli</span>' : ''}
          <br/>Barkod: <b>${esc(p.barcode)}</b> · Stok: <b>${p.quantity ?? '-'}</b> · Fiyat: <b>${p.salePrice ?? '-'} TL</b>
          <br/>${esc(p.categoryName || '')} · ${esc(p.brand || '')}
        </div>
        <div class="row">
          <button class="small primary" data-act="copy" data-bc="${esc(p.barcode)}">➕ Taslağa Kopyala</button>
          <button class="small" data-act="kombin" data-bc="${esc(p.barcode)}">🧩 Kombine Ekle</button>
          ${p.productUrl ? `<a class="small btnlink" href="${esc(p.productUrl)}" target="_blank" rel="noopener">🔗 Trendyol'da Aç</a>` : ''}
        </div>
      </div>
    </div>`).join('') || '<div class="hint">Ürün bulunamadı. “Yükle / Yenile”ye basın.</div>';

  $$('#prodList [data-act]').forEach((b) => b.addEventListener('click', () => {
    const p = state.products.find((x) => x.barcode === b.dataset.bc);
    if (!p) return;
    if (b.dataset.act === 'copy') { addDraftFromProduct(p); toast('Taslak oluşturuldu → “Varyasyon Kurgusu” sekmesi'); }
    else toggleKombin(p);
  }));
  $$('#prodList img[data-full]').forEach((img) => img.addEventListener('click', () => openLightbox(img.dataset.full)));
}

function openLightbox(url) {
  if (!url) return;
  $('#lightboxImg').src = url;
  $('#lightbox').classList.remove('hidden');
}
$('#lightbox').addEventListener('click', () => $('#lightbox').classList.add('hidden'));

$('#prodLoad').addEventListener('click', () => loadProducts(0));
$('#prodSearch').addEventListener('keydown', (e) => { if (e.key === 'Enter') loadProducts(0); });
$('#prodPrev').addEventListener('click', () => state.page > 0 && loadProducts(state.page - 1));
$('#prodNext').addEventListener('click', () => state.page < state.totalPages - 1 && loadProducts(state.page + 1));

/* ---------- Kombin ---------- */
function toggleKombin(p) {
  const i = state.kombin.findIndex((x) => x.barcode === p.barcode);
  if (i >= 0) state.kombin.splice(i, 1); else state.kombin.push(p);
  const bar = $('#kombinBar');
  bar.classList.toggle('hidden', state.kombin.length === 0);
  $('#kombinList').innerHTML = '🧩 <b>Kombin:</b> ' + state.kombin.map((x) => esc(x.title.slice(0, 30)) + '…').join(' + ');
}

$('#kombinTemizle').addEventListener('click', () => { state.kombin = []; $('#kombinBar').classList.add('hidden'); });

$('#kombinYap').addEventListener('click', () => {
  if (state.kombin.length < 2) return toast('Kombin için en az 2 ürün seçin');
  const parts = state.kombin;
  const indirim = Number($('#kombinIndirim').value || 0);
  const list = parts.reduce((t, p) => t + Number(p.listPrice || p.salePrice || 0), 0);
  const sale = Math.round(parts.reduce((t, p) => t + Number(p.salePrice || 0), 0) * (1 - indirim / 100) * 100) / 100;
  const stamp = Date.now().toString(36).slice(-5);
  const barcode = ('SET-' + parts.map((p) => p.barcode.slice(0, 10)).join('-')).slice(0, 34) + '-' + stamp;
  const images = [];
  for (let i = 0; i < 8; i++) { const p = parts[i % parts.length]; const u = p.images[Math.floor(i / parts.length)]; if (u) images.push(u); }
  const d = {
    id: crypto.randomUUID(),
    barcode,
    title: (parts.map((p) => p.title.split(' ').slice(0, 4).join(' ')).join(' + ') + ` ${parts.length}'li Set`).slice(0, 100),
    productMainId: barcode,
    brandId: parts[0].brandId, brandName: parts[0].brand,
    categoryId: parts[0].pimCategoryId || '', categoryName: parts[0].categoryName || '',
    quantity: Math.min(...parts.map((p) => Number(p.quantity || 0))),
    stockCode: barcode,
    dimensionalWeight: parts.reduce((t, p) => t + Number(p.dimensionalWeight || 1), 0),
    description: parts.map((p) => `<h3>${esc(p.title)}</h3>` + (p.description || '')).join('<hr/>').slice(0, 29000),
    currencyType: 'TRY',
    listPrice: Math.max(list, sale), salePrice: sale,
    vatRate: parts[0].vatRate ?? 20,
    images: images.filter(Boolean).slice(0, 8),
    attributes: (parts[0].attributes || []).map((a) => normAttr(a)),
  };
  state.drafts.push(d); save(); renderDrafts();
  state.kombin = []; $('#kombinBar').classList.add('hidden');
  toast(`Kombin taslağı oluşturuldu (${indirim}% set indirimiyle ${sale} TL) → “Varyasyon Kurgusu”`);
});

function normAttr(a) {
  return a.attributeValueId
    ? { attributeId: a.attributeId, attributeValueId: a.attributeValueId, attributeName: a.attributeName, attributeValue: a.attributeValue }
    : { attributeId: a.attributeId, customAttributeValue: a.attributeValue, attributeName: a.attributeName, attributeValue: a.attributeValue };
}

/* ---------- Taslaklar ---------- */
function addDraftFromProduct(p, suffix) {
  const n = state.drafts.filter((d) => d.sourceBarcode === p.barcode).length + 1;
  const sfx = suffix || `K${n}`;
  const barcode = `${p.barcode}-${sfx}`.slice(0, 40);
  state.drafts.push({
    id: crypto.randomUUID(),
    sourceBarcode: p.barcode,
    barcode,
    title: p.title,
    productMainId: barcode, // ayrı ilan olarak listelensin diye ana kod da farklı tutulur
    brandId: p.brandId, brandName: p.brand,
    categoryId: p.pimCategoryId || '', categoryName: p.categoryName || '',
    quantity: p.quantity ?? 10,
    stockCode: barcode,
    dimensionalWeight: p.dimensionalWeight ?? 1,
    description: p.description || p.title,
    currencyType: 'TRY',
    listPrice: p.listPrice ?? p.salePrice, salePrice: p.salePrice,
    vatRate: p.vatRate ?? 20,
    images: [...(p.images || [])].slice(0, 8),
    attributes: (p.attributes || []).map(normAttr),
  });
  save(); renderDrafts();
}

const F = [
  ['barcode', 'Barkod'], ['title', 'Başlık'], ['productMainId', 'Model Kodu (productMainId)'],
  ['stockCode', 'Stok Kodu'], ['brandId', 'Marka ID'], ['categoryId', 'Kategori ID'],
  ['quantity', 'Stok Adedi'], ['listPrice', 'Liste Fiyatı'], ['salePrice', 'Satış Fiyatı'],
  ['vatRate', 'KDV (0/1/10/20)'], ['dimensionalWeight', 'Desi'],
];

function renderDrafts() {
  const wrap = $('#draftList');
  wrap.innerHTML = state.drafts.map((d, i) => `
    <div class="draft" data-id="${d.id}">
      <h4>#${i + 1} · ${esc(d.title)} <span class="muted">(${esc(d.barcode)})</span></h4>
      <div class="grid2">
        ${F.map(([k, label]) => `<label>${label}<input data-f="${k}" value="${esc(d[k])}" /></label>`).join('')}
        <label>Kategori Ara<input data-f="_catSearch" placeholder="${esc(d.categoryName || 'kategori adı yazın')}" list="catlist-${d.id}" /><datalist id="catlist-${d.id}"></datalist></label>
      </div>
      <label>Açıklama<textarea data-f="description">${esc(d.description)}</textarea></label>
      <div><b style="font-size:12px">Görseller (${d.images.length}/8)</b>
        <div class="imgs">${d.images.map((u, j) => `<span class="im"><img src="${esc(u)}" loading="lazy"/><button class="rm" data-rmimg="${j}">×</button></span>`).join('')}</div>
        <div class="row">
          <button class="small" data-act="imgurl">🔗 URL ekle</button>
          <button class="small" data-act="fromgallery">🖼 Galeriden ekle</button>
        </div>
      </div>
      <div style="margin-top:10px"><b style="font-size:12px">Özellikler (${(d.attributes || []).length})</b>
        <div class="attrs">${(d.attributes || []).map((a) => `<div class="attr-row"><span>${esc(a.attributeName || a.attributeId)}</span><span>${esc(a.attributeValue || a.customAttributeValue || a.attributeValueId)}</span></div>`).join('')}</div>
        <button class="small" data-act="attrs">⚙️ Kategori özelliklerini getir / düzenle</button>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="small" data-act="dup">📑 Bundan N kopya üret</button>
        <button class="small danger" data-act="del">🗑 Taslağı sil</button>
      </div>
      <div class="attr-editor" style="margin-top:8px"></div>
    </div>`).join('') || '<div class="hint">Henüz taslak yok. “Ürünlerim” sekmesinden ürün kopyalayın ya da kombin oluşturun.</div>';

  $$('.draft').forEach((el) => {
    const d = state.drafts.find((x) => x.id === el.dataset.id);
    el.querySelectorAll('input[data-f],textarea[data-f]').forEach((inp) => {
      if (inp.dataset.f === '_catSearch') {
        inp.addEventListener('input', debounce(async () => {
          if (inp.value.length < 2) return;
          try {
            const cats = await api('/api/categories?q=' + encodeURIComponent(inp.value));
            el.querySelector(`#catlist-${d.id}`).innerHTML = cats.map((c) => `<option value="${esc(c.path)}" data-id="${c.id}">`).join('');
            const hit = cats.find((c) => c.path === inp.value);
            if (hit) { d.categoryId = hit.id; d.categoryName = hit.name; el.querySelector('input[data-f="categoryId"]').value = hit.id; save(); toast(`Kategori seçildi: ${hit.path} (ID ${hit.id})`); }
          } catch (e) { /* yazarken sessiz geç */ }
        }, 350));
        return;
      }
      inp.addEventListener('change', () => {
        const num = ['brandId', 'categoryId', 'quantity', 'listPrice', 'salePrice', 'vatRate', 'dimensionalWeight'];
        d[inp.dataset.f] = num.includes(inp.dataset.f) ? Number(inp.value) : inp.value;
        save();
      });
    });
    el.querySelectorAll('[data-rmimg]').forEach((b) => b.addEventListener('click', () => { d.images.splice(Number(b.dataset.rmimg), 1); save(); renderDrafts(); }));
    el.querySelector('[data-act="imgurl"]').addEventListener('click', () => {
      const u = prompt('Görsel URL (https ile başlamalı):');
      if (u && u.startsWith('https://')) { d.images.push(u.trim()); save(); renderDrafts(); }
    });
    el.querySelector('[data-act="fromgallery"]').addEventListener('click', () => {
      if (!state.gallery.length) return toast('Galeri boş. Önce Görsel Stüdyosu\'nda görsel üretin/yükleyin.');
      const list = state.gallery.map((g, i) => `${i + 1}) ${g.url.split('/').pop()}`).join('\n');
      const pick = prompt('Eklenecek görsel numaraları (virgülle, ör: 1,3,5):\n' + list);
      if (!pick) return;
      pick.split(',').map((x) => Number(x.trim()) - 1).forEach((i) => { if (state.gallery[i] && d.images.length < 8) d.images.push(state.gallery[i].url); });
      save(); renderDrafts();
    });
    el.querySelector('[data-act="del"]').addEventListener('click', () => { state.drafts = state.drafts.filter((x) => x.id !== d.id); save(); renderDrafts(); });
    el.querySelector('[data-act="dup"]').addEventListener('click', () => {
      const n = Number(prompt('Kaç kopya üretilsin?', '3') || 0);
      for (let k = 1; k <= n; k++) {
        const c = structuredClone(d);
        c.id = crypto.randomUUID();
        c.barcode = `${d.barcode}-${k + 1}`.slice(0, 40);
        c.productMainId = c.barcode;
        c.stockCode = c.barcode;
        state.drafts.push(c);
      }
      save(); renderDrafts();
    });
    el.querySelector('[data-act="attrs"]').addEventListener('click', () => openAttrEditor(d, el.querySelector('.attr-editor')));
  });
  save();
}

async function openAttrEditor(d, mount) {
  if (!d.categoryId) return toast('Önce kategori seçin (Kategori Ara alanı)');
  mount.innerHTML = '<span class="muted">Özellikler yükleniyor...</span>';
  try {
    const data = await api(`/api/categories/${d.categoryId}/attributes`);
    mount.innerHTML = data.attributes.map((a) => {
      const cur = (d.attributes || []).find((x) => x.attributeId === a.attributeId);
      const opts = ['<option value="">— seç —</option>', ...a.values.map((v) => `<option value="${v.id}" ${cur?.attributeValueId === v.id ? 'selected' : ''}>${esc(v.name)}</option>`)].join('');
      const sel = a.values.length
        ? `<select data-attr="${a.attributeId}">${opts}</select>`
        : `<input data-attr="${a.attributeId}" data-custom="1" value="${esc(cur?.customAttributeValue || '')}" placeholder="serbest metin" />`;
      return `<div class="attr-row"><span>${esc(a.name)}${a.required ? ' <b class="req">*</b>' : ''}${a.allowCustom && a.values.length ? ' <span class="muted">(özel değer girilebilir)</span>' : ''}</span>${sel}</div>`;
    }).join('') + '<button class="small primary" id="attrSave">Özellikleri Kaydet</button>';

    mount.querySelector('#attrSave').addEventListener('click', () => {
      const attrs = [];
      mount.querySelectorAll('[data-attr]').forEach((inp) => {
        const id = Number(inp.dataset.attr);
        const meta = data.attributes.find((x) => x.attributeId === id);
        if (inp.dataset.custom) {
          if (inp.value.trim()) attrs.push({ attributeId: id, customAttributeValue: inp.value.trim(), attributeName: meta?.name, attributeValue: inp.value.trim() });
        } else if (inp.value) {
          const v = meta.values.find((x) => x.id === Number(inp.value));
          attrs.push({ attributeId: id, attributeValueId: Number(inp.value), attributeName: meta?.name, attributeValue: v?.name });
        }
      });
      d.attributes = attrs;
      save(); renderDrafts();
      toast('Özellikler kaydedildi');
    });
  } catch (e) { mount.innerHTML = ''; toast('Özellikler alınamadı: ' + e.message); }
}

$('#draftClear').addEventListener('click', () => { if (confirm('Tüm taslaklar silinsin mi?')) { state.drafts = []; save(); renderDrafts(); } });

function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

/* ---------- Görsel Stüdyosu ---------- */
$('#genRun').addEventListener('click', async () => {
  const rawFile = $('#genFile').files[0];
  if (!rawFile) return toast('Referans fotoğraf seçin');
  const file = await resizeImageFile(rawFile);
  const count = Number($('#genCount').value) || 6;
  const productName = $('#genName').value || file.name;
  const prompt = $('#genPrompt').value;
  const quality = $('#genQuality').value;
  const size = $('#genSize').value;

  $('#genRun').disabled = true;
  let ok = 0;
  const fails = [];
  // Her açı AYRI istek: serverless 60sn limitine takılmamak için (tek istekte 6 görsel = 504 timeout).
  for (let i = 0; i < count; i++) {
    $('#genStatus').textContent = `⏳ Görsel üretiliyor... (${i + 1}/${count}) — üretilenler aşağıda birikir`;
    const fd = new FormData();
    fd.append('reference', file);
    fd.append('productName', productName);
    fd.append('prompt', prompt);
    fd.append('quality', quality);
    fd.append('size', size);
    fd.append('angleIndex', String(i));
    try {
      const data = await api('/api/images/generate', { method: 'POST', body: fd });
      (data.images || []).forEach((im) => state.gallery.unshift({ url: im.url, angle: im.angle, at: Date.now() }));
      if (data.images && data.images.length) { ok++; save(); renderGallery(); }
      else fails.push(`#${i + 1}`);
    } catch (e) {
      fails.push(`#${i + 1}: ${e.message}`);
      $('#genStatus').textContent = `⚠️ ${ok} üretildi, ${i + 1}. görselde hata: ${e.message} — devam ediliyor...`;
    }
  }
  $('#genStatus').textContent = fails.length
    ? `⚠️ ${ok}/${count} görsel üretildi. Başarısız: ${fails.length}. (Tekrar basınca eksikler tamamlanmaya çalışılır.)`
    : `✅ ${ok} görsel üretildi ve yayınlandı.`;
  $('#genRun').disabled = false;
});

$('#upRun').addEventListener('click', async () => {
  const files = $('#upFiles').files;
  if (!files.length) return toast('Dosya seçin');
  const resized = await Promise.all([...files].map((f) => resizeImageFile(f)));
  const fd = new FormData();
  resized.forEach((f) => fd.append('files', f));
  fd.append('productName', $('#upName').value || files[0].name);
  $('#upStatus').textContent = '⏳ Yükleniyor...';
  try {
    const data = await api('/api/images/upload', { method: 'POST', body: fd });
    data.images.forEach((im) => state.gallery.unshift({ url: im.url, at: Date.now() }));
    save(); renderGallery();
    $('#upStatus').textContent = `✅ ${data.images.length} dosya yayınlandı.`;
  } catch (e) { $('#upStatus').textContent = '❌ ' + e.message; }
});

function renderGallery() {
  $('#gallery').innerHTML = state.gallery.map((g, i) => `
    <div class="g">
      <img src="${esc(g.url)}" data-full="${esc(g.url)}" loading="lazy" />
      <div class="row">
        <button class="small" data-copy="${i}">Kopyala</button>
        <button class="small" data-todraft="${i}">Taslağa</button>
      </div>
    </div>`).join('') || '<div class="hint">Henüz görsel yok.</div>';
  $$('#gallery img[data-full]').forEach((img) => img.addEventListener('click', () => openLightbox(img.dataset.full)));
  $$('#gallery [data-copy]').forEach((b) => b.addEventListener('click', () => { navigator.clipboard.writeText(state.gallery[b.dataset.copy].url); toast('URL kopyalandı'); }));
  $$('#gallery [data-todraft]').forEach((b) => b.addEventListener('click', () => {
    if (!state.drafts.length) return toast('Önce taslak oluşturun');
    const list = state.drafts.map((d, i) => `${i + 1}) ${d.title.slice(0, 40)} (${d.barcode})`).join('\n');
    const pick = Number(prompt('Hangi taslağa eklensin?\n' + list, '1'));
    const d = state.drafts[pick - 1];
    if (!d) return;
    if (d.images.length >= 8) return toast('Bu taslakta zaten 8 görsel var');
    d.images.push(state.gallery[b.dataset.todraft].url);
    save(); renderDrafts(); toast('Görsel taslağa eklendi');
  }));
}

$('#galleryClear').addEventListener('click', () => { state.gallery = []; save(); renderGallery(); });

/* ---------- Gönderim ---------- */
function draftToItem(d) {
  const item = {
    barcode: String(d.barcode).trim(),
    title: String(d.title).trim(),
    productMainId: String(d.productMainId).trim(),
    brandId: Number(d.brandId),
    categoryId: Number(d.categoryId),
    quantity: Number(d.quantity),
    stockCode: String(d.stockCode).trim(),
    dimensionalWeight: Number(d.dimensionalWeight || 1),
    description: d.description,
    currencyType: 'TRY',
    listPrice: Number(d.listPrice),
    salePrice: Number(d.salePrice),
    vatRate: Number(d.vatRate),
    images: d.images.map((u) => ({ url: u })),
    attributes: (d.attributes || []).map((a) => a.attributeValueId
      ? { attributeId: a.attributeId, attributeValueId: a.attributeValueId }
      : { attributeId: a.attributeId, customAttributeValue: a.customAttributeValue }),
  };
  return item;
}

function validateDraft(d) {
  const errs = [];
  if (!d.barcode) errs.push('barkod eksik');
  if (!d.title) errs.push('başlık eksik');
  if (!d.brandId) errs.push('marka ID eksik');
  if (!d.categoryId) errs.push('kategori ID eksik (Kategori Ara ile seçin)');
  if (!d.images?.length) errs.push('en az 1 görsel gerekli');
  if (Number(d.salePrice) > Number(d.listPrice)) errs.push('satış fiyatı > liste fiyatı olamaz');
  if (![0, 1, 10, 20].includes(Number(d.vatRate))) errs.push('KDV 0/1/10/20 olmalı');
  return errs;
}

$('#sendAll').addEventListener('click', async () => {
  if (!state.drafts.length) return toast('Gönderilecek taslak yok');
  const problems = state.drafts.flatMap((d, i) => validateDraft(d).map((e) => `#${i + 1} ${d.barcode}: ${e}`));
  const vbox = $('#sendValidation');
  if (problems.length) {
    vbox.className = 'valbox';
    vbox.textContent = '⚠️ Önce şunları düzeltin:\n' + problems.join('\n');
    return;
  }
  vbox.className = 'valbox ok';
  vbox.textContent = `✓ ${state.drafts.length} taslak doğrulandı, gönderiliyor...`;
  if (!confirm(`${state.drafts.length} ürün Trendyol'a gönderilecek. Onaylıyor musunuz?`)) return;
  try {
    const items = state.drafts.map(draftToItem);
    const r = await api('/api/products/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) });
    state.batches.unshift({ id: r.batchRequestId, at: Date.now(), count: items.length, barcodes: items.map((i) => i.barcode) });
    vbox.textContent = `✅ Gönderildi! Batch ID: ${r.batchRequestId} — aşağıdan durumu takip edin. Taslaklar temizlendi.`;
    state.drafts = [];
    save(); renderDrafts(); renderBatches();
  } catch (e) {
    vbox.className = 'valbox';
    vbox.textContent = '❌ ' + e.message;
  }
});

function renderBatches() {
  $('#batchList').innerHTML = state.batches.map((b) => `
    <div class="batch" data-bid="${esc(b.id)}">
      <b>${new Date(b.at).toLocaleString('tr-TR')}</b> · ${b.count} ürün · Batch: <code>${esc(b.id)}</code>
      <button class="small" data-check="${esc(b.id)}">Durumu Sorgula</button>
      <div class="result muted"></div>
    </div>`).join('') || '<div class="hint">Henüz gönderim yapılmadı.</div>';
  $$('#batchList [data-check]').forEach((btn) => btn.addEventListener('click', async () => {
    const box = btn.closest('.batch').querySelector('.result');
    box.textContent = 'Sorgulanıyor...';
    try {
      const s = await api('/api/batch/' + encodeURIComponent(btn.dataset.check));
      const items = s.items || [];
      const ok = items.filter((i) => i.status === 'SUCCESS').length;
      const fail = items.filter((i) => i.status === 'FAILED');
      box.innerHTML = `<span class="succ">Durum: ${esc(s.status || '-')} · Başarılı: ${ok}/${items.length || s.itemCount || '?'}</span>` +
        fail.map((f) => `<div class="fail">✗ ${esc(f.requestItem?.product?.barcode || f.requestItem?.barcode || '?')}: ${esc((f.failureReasons || []).join(', '))}</div>`).join('');
    } catch (e) { box.textContent = '❌ ' + e.message; }
  }));
}

/* ---------- Fiyat & Stok ---------- */
let psRows = load('sp_psrows_cache', []);
function savePsRows() { localStorage.setItem('sp_psrows_cache', JSON.stringify(psRows)); }
$('#psLoad').addEventListener('click', async () => {
  $('#psStatus').textContent = 'Yükleniyor...';
  try {
    const all = [];
    let page = 0;
    let totalPages = 1;
    do {
      const data = await api(`/api/products?page=${page}&size=100`);
      all.push(...data.content);
      totalPages = data.totalPages || 1;
      $('#psStatus').textContent = `Yükleniyor... (${page + 1}/${totalPages} sayfa, ${all.length} ürün)`;
      page++;
    } while (page < totalPages);
    psRows = all.map((p) => ({ barcode: p.barcode, title: p.title, quantity: p.quantity, salePrice: p.salePrice, listPrice: p.listPrice, productUrl: p.productUrl, locked: p.locked, hasActiveCampaign: p.hasActiveCampaign, changed: false }));
    savePsRows();
    $('#psStatus').textContent = `${psRows.length} ürün yüklendi (tümü)`;
    renderPs();
  } catch (e) { $('#psStatus').textContent = '❌ ' + e.message; }
});

function psFiltered() {
  const q = $('#psSearch').value.trim().toLocaleLowerCase('tr');
  const stockFilter = $('#psStockFilter').value;
  let rows = psRows;
  if (q) rows = rows.filter((r) => (r.barcode || '').toLocaleLowerCase('tr').includes(q) || (r.title || '').toLocaleLowerCase('tr').includes(q));
  if (stockFilter === 'in') rows = rows.filter((r) => Number(r.quantity) > 0);
  else if (stockFilter === 'out') rows = rows.filter((r) => !Number(r.quantity));
  return rows;
}

function renderPs() {
  const rows = psFiltered();
  $('#psTable').innerHTML = `<table><thead><tr><th>Barkod</th><th>Ürün</th><th>Stok</th><th>Satış ₺</th><th>Liste ₺</th><th>Durum</th></tr></thead><tbody>` +
    rows.map((r) => `<tr class="${r.changed ? 'changed' : ''}">
      <td>${esc(r.barcode)}</td>
      <td>${r.productUrl ? `<a href="${esc(r.productUrl)}" target="_blank" rel="noopener">${esc((r.title || '').slice(0, 55))}</a>` : esc((r.title || '').slice(0, 55))}${r.locked ? ' <span class="tag no">Kilitli</span>' : ''}${r.hasActiveCampaign ? ' <span class="tag ok">Kampanyalı</span>' : ''}</td>
      <td><input type="number" data-bc="${esc(r.barcode)}" data-k="quantity" value="${r.quantity ?? ''}" /></td>
      <td><input type="number" step="0.01" data-bc="${esc(r.barcode)}" data-k="salePrice" value="${r.salePrice ?? ''}" /></td>
      <td><input type="number" step="0.01" data-bc="${esc(r.barcode)}" data-k="listPrice" value="${r.listPrice ?? ''}" /></td>
      <td class="ps-result" data-bc="${esc(r.barcode)}">${r.result ? (r.result.ok ? '<span class="succ">✓</span>' : `<span class="fail" title="${esc(r.result.msg || '')}">✗ ${esc((r.result.msg || 'hata').slice(0, 40))}</span>`) : ''}</td>
    </tr>`).join('') + '</tbody></table>' + (rows.length === 0 ? '<div class="hint">Aramanızla eşleşen ürün yok.</div>' : '');
  $$('#psTable input').forEach((inp) => inp.addEventListener('change', () => {
    const r = psRows.find((x) => x.barcode === inp.dataset.bc);
    if (!r) return;
    r[inp.dataset.k] = Number(inp.value);
    r.changed = true;
    savePsRows();
    inp.closest('tr').classList.add('changed');
  }));
}

$('#psSearch').addEventListener('input', debounce(() => renderPs(), 150));
$('#psStockFilter').addEventListener('change', () => renderPs());

function psBulkApply(dir) {
  const pct = Number($('#psBulkPct').value || 0);
  if (!pct) return toast('Yüzde girin');
  const rows = psFiltered();
  if (!rows.length) return toast('Uygulanacak ürün yok');
  const factor = 1 + (dir * pct) / 100;
  const round2 = (n) => Math.round(Number(n) * factor * 100) / 100;
  rows.forEach((r) => {
    if (r.salePrice != null) r.salePrice = round2(r.salePrice);
    if (r.listPrice != null) r.listPrice = round2(r.listPrice);
    r.changed = true;
    r.result = null;
  });
  savePsRows();
  renderPs();
  toast(`${rows.length} ürüne %${pct} ${dir > 0 ? 'zam' : 'indirim'} uygulandı — göndermeden kontrol edin.`);
}
$('#psBulkUp').addEventListener('click', () => psBulkApply(1));
$('#psBulkDown').addEventListener('click', () => psBulkApply(-1));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

$('#psSend').addEventListener('click', async () => {
  const changed = psRows.filter((r) => r.changed);
  if (!changed.length) return toast('Değişiklik yok');
  if (!confirm(`${changed.length} ürünün fiyat/stok bilgisi güncellenecek. Onaylıyor musunuz?`)) return;
  $('#psStatus').textContent = 'Gönderiliyor...';
  try {
    const items = changed.map((r) => ({ barcode: r.barcode, quantity: Number(r.quantity), salePrice: Number(r.salePrice), listPrice: Number(r.listPrice) }));
    const res = await api('/api/price-stock', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) });
    const batchId = res.batchRequestId;
    if (!batchId) { $('#psStatus').textContent = '⚠️ Trendyol batch numarası dönmedi: ' + JSON.stringify(res); return; }

    // Trendyol guncellemeyi kuyruga alir; sonucu birkac kez sorgulayip gercekten islenip islenmedigini gosteririz.
    $('#psStatus').textContent = `⏳ Gönderildi (${batchId}). Trendyol işliyor, sonuç bekleniyor...`;
    let statusData = null;
    for (let attempt = 0; attempt < 8; attempt++) {
      await sleep(attempt === 0 ? 3000 : 4000);
      try {
        statusData = await api('/api/batch/' + encodeURIComponent(batchId));
        if (statusData && (statusData.status === 'COMPLETED' || (statusData.items && statusData.items.length))) break;
      } catch { /* tekrar dene */ }
    }

    const bItems = (statusData && statusData.items) || [];
    const byBarcode = {};
    bItems.forEach((it) => {
      const bc = it.requestItem?.barcode || it.requestItem?.product?.barcode;
      if (bc) byBarcode[bc] = it;
    });
    let ok = 0, fail = 0;
    changed.forEach((r) => {
      const it = byBarcode[r.barcode];
      if (it && it.status === 'SUCCESS') { r.result = { ok: true }; r.changed = false; ok++; }
      else if (it && it.status === 'FAILED') { r.result = { ok: false, msg: (it.failureReasons || []).join(', ') || 'Trendyol reddetti' }; fail++; }
      else { r.result = { ok: false, msg: 'sonuç alınamadı (Trendyol hâlâ işliyor olabilir)' }; }
    });
    savePsRows();
    renderPs();
    if (fail === 0 && ok === changed.length) $('#psStatus').textContent = `✅ ${ok} ürün gerçekten güncellendi.`;
    else $('#psStatus').textContent = `⚠️ ${ok} başarılı, ${fail} başarısız. "Durum" sütununa bakın (kırmızı ✗ üstüne gelince sebep görünür).`;
  } catch (e) { $('#psStatus').textContent = '❌ ' + e.message; }
});

/* ---------- başlangıç ---------- */
if (state.products.length) {
  renderProducts();
  $('#prodInfo').textContent = `${state.products.length} ürün (önbellek — "Yükle / Yenile" ile tazele)`;
  $('#prodPage').textContent = `Sayfa ${state.page + 1} / ${state.totalPages || 1}`;
}
if (psRows.length) {
  renderPs();
  $('#psStatus').textContent = `${psRows.length} ürün (önbellek — "Ürünleri Getir" ile tazele)`;
}
renderDrafts();
renderGallery();
renderBatches();
