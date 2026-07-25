// ═══════════════════════════════════════════════════════════════════
// SellerPilot Landing v2 — "Ink & Ember"
// ═══════════════════════════════════════════════════════════════════
// Tasarım ilkeleri (App.tsx'teki v1'den farkı):
//  1. Renk disiplini — turuncu yüzeyin ~%5'inde: sadece CTA, tek vurgu
//     kelimesi ve aktif durum. v1'de başlık/rozet/çip/çerçeve hepsi turuncuydu,
//     bu yüzden vurgu vurgu olmaktan çıkmıştı.
//  2. Derinlik kalın gölgeyle değil 1px saç-teli çizgi + katmanla kurulur.
//  3. Ürün kanıtı CSS ile çizilir (görsel dosyası YOK) — her ekranda net,
//     sıfır ağırlık, müşteri verisi sızma riski yok.
//  4. Yeni JS bağımlılığı YOK. Hareket = CSS + IntersectionObserver.
//     prefers-reduced-motion tam desteklenir.
// ═══════════════════════════════════════════════════════════════════
import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, Check, Minus, Plane, Mail, Smartphone, ShieldCheck, Ruler,
  SlidersHorizontal, PackageCheck, MessageSquare, Clock, BadgeCheck, X,
  Sparkles, Camera, ChevronDown, Menu as MenuIcon
} from 'lucide-react';
import { FAQ_ITEMS, WHATSAPP_URL, APP_URL } from './constants';

// ────────────────────────────────────────────────
// Tasarım tokenları + hareket
// ────────────────────────────────────────────────
const V2Styles = () => (
  <style>{`
  .v2 {
    /* Kağıt katmanı */
    --paper:      #FAFAF9;
    --paper-2:    #F5F5F4;
    --line:       #E7E5E4;
    --line-2:     #D6D3D1;
    --text:       #0C0A09;
    --text-mid:   #57534E;
    --text-low:   #78716C;
    /* Mürekkep katmanı (koyu bantlar) */
    --ink:        #0A0C11;
    --ink-2:      #12151D;
    --ink-line:   rgba(255,255,255,.09);
    --ink-text:   #F5F5F4;
    --ink-mid:    #A8A29E;
    /* Kor (marka aksanı — az kullanılır) */
    --ember:      #FF6B35;
    --ember-2:    #FFBE5C;
    --ember-deep: #C2410C;

    --r-sm: 10px; --r: 14px; --r-lg: 20px;
    background: var(--paper);
    color: var(--text);
    font-family: Inter, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .v2 ::selection { background: var(--ember); color: #fff; }

  /* ── Tipografi: akışkan ölçek, sıkı harf aralığı ── */
  .v2 .display {
    font-family: 'Inter Tight', Inter, system-ui, sans-serif;
    font-weight: 600;
    letter-spacing: -0.035em;
    line-height: 1.03;
  }
  .v2 .h1 { font-size: clamp(2.5rem, 1.4rem + 4.4vw, 4.5rem); }
  .v2 .h2 { font-size: clamp(2rem, 1.3rem + 2.6vw, 3.25rem); }
  .v2 .h3 { font-size: clamp(1.25rem, 1.05rem + 0.8vw, 1.6rem); letter-spacing: -0.025em; line-height: 1.15; }
  .v2 .lede { font-size: clamp(1.02rem, 0.97rem + 0.28vw, 1.2rem); line-height: 1.65; color: var(--text-mid); max-width: 62ch; }
  .v2 .eyebrow {
    font-size: .6875rem; font-weight: 700; letter-spacing: .14em;
    text-transform: uppercase; color: var(--text-low);
    display: inline-flex; align-items: center; gap: .5rem;
  }
  .v2 .eyebrow .num { color: var(--ember-deep); font-variant-numeric: tabular-nums; }
  .v2 .ember { color: var(--ember-deep); }

  /* ── Koyu bant ── */
  .v2 .band-ink { background: var(--ink); color: var(--ink-text); position: relative; isolation: isolate; }
  .v2 .band-ink .lede { color: var(--ink-mid); }
  .v2 .band-ink .eyebrow { color: var(--ink-mid); }
  .v2 .band-ink .eyebrow .num { color: var(--ember-2); }
  /* Grain: düz koyu zemini kırar, "ekran" hissi verir. %2.5 opaklık. */
  .v2 .band-ink::before {
    content:''; position:absolute; inset:0; z-index:-1; pointer-events:none; opacity:.025;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  .v2 .glow {
    position:absolute; border-radius:50%; pointer-events:none; z-index:-1;
    background: radial-gradient(circle, rgba(255,107,53,.20) 0%, rgba(255,107,53,0) 68%);
    filter: blur(20px);
  }

  /* ── Yüzeyler: gölge değil çizgi ── */
  .v2 .card {
    background:#fff; border:1px solid var(--line); border-radius: var(--r-lg);
    transition: border-color .25s ease, transform .25s ease;
  }
  .v2 .card:hover { border-color: var(--line-2); }
  .v2 .card-ink {
    background: var(--ink-2); border:1px solid var(--ink-line); border-radius: var(--r-lg);
  }
  .v2 .hair { border-top:1px solid var(--line); }

  /* ── Butonlar ── */
  .v2 .btn {
    display:inline-flex; align-items:center; justify-content:center; gap:.5rem;
    font-weight:600; font-size:.95rem; border-radius:12px; padding:.85rem 1.4rem;
    cursor:pointer; transition: all .2s ease; white-space:nowrap;
  }
  .v2 .btn-ember { background: var(--ember); color:#fff; border:1px solid var(--ember); }
  .v2 .btn-ember:hover { background:#EA5A26; border-color:#EA5A26; transform: translateY(-1px); }
  .v2 .btn-line { background:transparent; color: var(--text); border:1px solid var(--line-2); }
  .v2 .btn-line:hover { border-color: var(--text); }
  .v2 .band-ink .btn-line { color: var(--ink-text); border-color: rgba(255,255,255,.22); }
  .v2 .band-ink .btn-line:hover { border-color: rgba(255,255,255,.55); background: rgba(255,255,255,.05); }
  .v2 a:focus-visible, .v2 button:focus-visible {
    outline: 2px solid var(--ember); outline-offset: 3px; border-radius: 8px;
  }

  /* ── Beliriş ── */
  .v2 .rv { opacity:0; transform: translateY(14px); transition: opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1); }
  .v2 .rv.in { opacity:1; transform:none; }

  /* ── Panel mockup ── */
  .v2 .chrome { background:#fff; border:1px solid var(--line); border-radius:14px; overflow:hidden; }
  .v2 .band-ink .chrome { background: var(--ink-2); border-color: var(--ink-line); }
  .v2 .chrome-bar {
    display:flex; align-items:center; gap:.5rem; padding:.6rem .85rem;
    border-bottom:1px solid var(--line); background: var(--paper-2);
  }
  .v2 .band-ink .chrome-bar { border-color: var(--ink-line); background: rgba(255,255,255,.03); }
  .v2 .dot { width:9px; height:9px; border-radius:50%; background: var(--line-2); }
  .v2 .band-ink .dot { background: rgba(255,255,255,.18); }
  .v2 .urlpill {
    flex:1; text-align:center; font-size:.68rem; color: var(--text-low);
    background:#fff; border:1px solid var(--line); border-radius:99px; padding:.2rem .6rem;
  }
  .v2 .band-ink .urlpill { background: rgba(255,255,255,.04); border-color: var(--ink-line); color: var(--ink-mid); }

  .v2 .bar { background: linear-gradient(180deg, var(--ember-2), var(--ember)); border-radius:3px 3px 1px 1px; }
  .v2 .chip {
    display:inline-flex; align-items:center; gap:.35rem; font-size:.68rem; font-weight:600;
    padding:.22rem .55rem; border-radius:99px; border:1px solid var(--line); color: var(--text-mid);
  }
  .v2 .chip-ok { color:#15803D; border-color:#BBF7D0; background:#F0FDF4; }
  .v2 .chip-wait { color: var(--ember-deep); border-color:#FED7AA; background:#FFF7ED; }

  @media (prefers-reduced-motion: reduce) {
    .v2 .rv { opacity:1 !important; transform:none !important; transition:none !important; }
    .v2 * { animation: none !important; }
  }
  `}</style>
);

// ────────────────────────────────────────────────
// Beliriş yardımcıları
// ────────────────────────────────────────────────
const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.unobserve(el); } },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};

const Rv = ({ children, delay = 0, className = '' }: any) => {
  const ref = useReveal();
  return <div ref={ref} className={`rv ${className}`} style={{ transitionDelay: `${delay}s` }}>{children}</div>;
};

const Eyebrow = ({ num, children }: any) => (
  <p className="eyebrow mb-5"><span className="num">{num}</span><span className="w-6 h-px bg-current opacity-30" />{children}</p>
);

// ────────────────────────────────────────────────
// CSS ile çizilmiş panel — ürün kanıtı (görsel dosyası yok)
// ────────────────────────────────────────────────
const HOURS = [8, 14, 22, 31, 45, 62, 78, 96, 88, 71, 54, 38];

const PanelMock = () => (
  <div className="chrome">
    <div className="chrome-bar">
      <span className="dot" /><span className="dot" /><span className="dot" />
      <span className="urlpill">app.sellerpilot.cloud</span>
    </div>
    <div className="p-4 sm:p-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        {[['Gelen soru', '47'], ['Otomatik cevap', '43'], ['Size düşen', '4'], ['Kazanılan', '2s 9dk']].map(([l, v]) => (
          <div key={l} className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid var(--ink-line)' }}>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--ink-mid)' }}>{l}</p>
            <p className="text-lg font-semibold mt-0.5" style={{ color: 'var(--ink-text)' }}>{v}</p>
          </div>
        ))}
      </div>
      <div className="flex items-end justify-between gap-1 h-20 mb-2">
        {HOURS.map((h, i) => (
          <div key={i} className="bar flex-1" style={{ height: `${h}%`, opacity: 0.35 + (h / 96) * 0.65 }} />
        ))}
      </div>
      <p className="text-[10px] mb-5" style={{ color: 'var(--ink-mid)' }}>Saatlik soru yoğunluğu — son 24 saat</p>
      <div className="space-y-1.5">
        {[
          ['Bu ürün hassas ciltte kullanılır mı?', 'Otomatik cevaplandı', true],
          ['1.70 boyunda 65 kiloyum, hangi beden?', 'Otomatik cevaplandı', true],
          ['Hamileyken kullanabilir miyim?', 'Size iletildi', false],
        ].map(([q, s, ok]: any) => (
          <div key={q} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,.03)' }}>
            <span className="text-[11px] sm:text-xs truncate" style={{ color: 'var(--ink-text)' }}>{q}</span>
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={ok
                ? { color: '#4ADE80', background: 'rgba(74,222,128,.10)', border: '1px solid rgba(74,222,128,.25)' }
                : { color: 'var(--ember-2)', background: 'rgba(255,190,92,.10)', border: '1px solid rgba(255,190,92,.28)' }}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────────
// Nav
// ────────────────────────────────────────────────
const LINKS = [
  { l: 'Farkımız', h: '#v2-fark' },
  { l: 'Ürün', h: '#v2-urun' },
  { l: 'Nasıl çalışır', h: '#v2-nasil' },
  { l: 'Fiyatlar', h: '#v2-fiyat' },
  { l: 'SSS', h: '#v2-sss' },
];

const V2Nav = () => {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 24);
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={solid
        ? { background: 'rgba(10,12,17,.82)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--ink-line)' }
        : { background: 'transparent', borderBottom: '1px solid transparent' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,var(--ember),var(--ember-2))' }}>
            <Plane size={15} className="text-white fill-white" />
          </span>
          <span className="font-semibold tracking-tight" style={{ color: 'var(--ink-text)' }}>SellerPilot</span>
        </a>
        <nav className="hidden lg:flex items-center gap-7">
          {LINKS.map(x => (
            <a key={x.l} href={x.h} className="text-sm transition-colors" style={{ color: 'var(--ink-mid)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink-text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-mid)')}>{x.l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2.5">
          <a href={APP_URL} className="btn btn-ember hidden sm:inline-flex" style={{ padding: '.6rem 1.05rem', fontSize: '.875rem' }}>Ücretsiz dene</a>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2" aria-label="Menü" style={{ color: 'var(--ink-text)' }}>
            {open ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden px-5 pb-5 flex flex-col gap-1" style={{ background: 'rgba(10,12,17,.97)' }}>
          {LINKS.map(x => (
            <a key={x.l} href={x.h} onClick={() => setOpen(false)} className="py-2.5 text-sm" style={{ color: 'var(--ink-mid)' }}>{x.l}</a>
          ))}
          <a href={APP_URL} className="btn btn-ember mt-2">Ücretsiz dene</a>
        </div>
      )}
    </header>
  );
};

// ────────────────────────────────────────────────
// Hero — koyu sinematik bant
// ────────────────────────────────────────────────
const V2Hero = () => (
  <section id="top" className="band-ink pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
    <span className="glow" style={{ width: 760, height: 760, top: -260, left: '50%', transform: 'translateX(-50%)' }} />
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Rv className="text-center">
        <span className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3.5 py-1.5 mb-8"
          style={{ border: '1px solid var(--ink-line)', color: 'var(--ink-mid)', background: 'rgba(255,255,255,.03)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--ember)' }} />
          Bir Trendyol satıcısı tarafından geliştirildi
        </span>
        <h1 className="display h1 mb-6" style={{ color: 'var(--ink-text)' }}>
          Müşteri sorularını siz değil,<br className="hidden sm:block" /> <span style={{ color: 'var(--ember-2)' }}>yapay zekânız</span> cevaplasın.
        </h1>
        <p className="lede mx-auto mb-9">
          SellerPilot mağazanıza bağlanır, gelen her soruyu ürün bilgilerinize göre saniyeler içinde yanıtlar.
          Emin olamadığı soruyu cevaplamaz — size iletir.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <a href={APP_URL} className="btn btn-ember w-full sm:w-auto">30 gün ücretsiz dene <ArrowRight size={17} /></a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line w-full sm:w-auto">
            <Smartphone size={17} /> WhatsApp'tan yazın
          </a>
        </div>
        <p className="text-xs" style={{ color: 'var(--ink-mid)' }}>Kredi kartı gerekmez · Kurulum birkaç dakika</p>
      </Rv>

      <Rv delay={0.12} className="mt-14 sm:mt-20 max-w-3xl mx-auto">
        <PanelMock />
      </Rv>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Metrik şeridi
// ────────────────────────────────────────────────
const V2Metrics = () => (
  <section className="band-ink pb-20 sm:pb-24">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ background: 'var(--ink-line)' }}>
        {[
          ['Saniyeler', 'içinde otomatik cevap'],
          ['7/24', 'gece, hafta sonu, bayram'],
          ['Sıfır', 'tahmine dayalı cevap'],
          ['Tek panel', 'tüm mağazalarınız'],
        ].map(([big, small], i) => (
          <Rv key={big} delay={i * 0.06}>
            <div className="h-full px-5 py-7 text-center" style={{ background: 'var(--ink)' }}>
              <p className="display text-2xl sm:text-[1.75rem] mb-1.5" style={{ color: 'var(--ink-text)' }}>{big}</p>
              <p className="text-xs" style={{ color: 'var(--ink-mid)' }}>{small}</p>
            </div>
          </Rv>
        ))}
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Farkımız — bento
// ────────────────────────────────────────────────
const Diff = ({ icon: Icon, title, body, mock, span = 'lg:col-span-3', delay = 0 }: any) => (
  <Rv delay={delay} className={span}>
    <div className="card h-full p-6 sm:p-8 flex flex-col">
      <span className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
        style={{ background: 'var(--paper-2)', border: '1px solid var(--line)' }}>
        <Icon size={17} style={{ color: 'var(--ember-deep)' }} />
      </span>
      <h3 className="display h3 mb-3">{title}</h3>
      <p className="text-[.925rem] leading-relaxed mb-7" style={{ color: 'var(--text-mid)' }}>{body}</p>
      <div className="mt-auto rounded-xl p-4" style={{ background: 'var(--paper-2)', border: '1px solid var(--line)' }}>{mock}</div>
    </div>
  </Rv>
);

const Bubble = ({ children, me = false }: any) => (
  <div className="rounded-xl px-3.5 py-2.5 text-[.8rem] leading-relaxed"
    style={me
      ? { background: 'linear-gradient(135deg,var(--ember),var(--ember-2))', color: '#fff' }
      : { background: '#fff', border: '1px solid var(--line)', color: 'var(--text-mid)' }}>
    {children}
  </div>
);

const Note = ({ children }: any) => (
  <div className="flex items-center gap-1.5 text-[.68rem]" style={{ color: 'var(--text-low)' }}>
    <BadgeCheck size={12} className="text-green-600 shrink-0" />{children}
  </div>
);

const V2Diff = () => (
  <section id="v2-fark" className="py-24 sm:py-32">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Rv className="max-w-2xl mb-14">
        <Eyebrow num="01">Farkımız</Eyebrow>
        <h2 className="display h2 mb-5">Otomatik cevap kolay.<br /><span className="ember">Doğru cevap zor.</span></h2>
        <p className="lede">Bir mağazayı yakan şey cevapsız soru değil, yanlış cevaptır. SellerPilot'ı satıcı olarak biz kurduk — bu yüzden neyi söylemeyeceğini de biliyor.</p>
      </Rv>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-5">
        <Diff
          icon={SlidersHorizontal}
          title="Kontrol tamamen sizde"
          body="İster tamamen size bıraksın, ister her cevabı hazırlayıp onayınıza sunsun, ister hiç karışmasın. Bir konuşmayı devraldığınızda sistem araya girmez."
          mock={
            <div className="space-y-2">
              {[['Otomatik', 'Sistem kendi cevaplar', false], ['Onaylı', 'Cevabı hazırlar, siz onaylarsınız', true], ['Kapalı', 'Sadece siz cevaplarsınız', false]].map(([t, d, on]: any) => (
                <div key={t} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 bg-white"
                  style={{ border: on ? '1px solid var(--ember)' : '1px solid var(--line)' }}>
                  <span className="w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center"
                    style={{ borderColor: on ? 'var(--ember)' : 'var(--line-2)' }}>
                    {on && <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--ember)' }} />}
                  </span>
                  <span className="text-[.8rem] font-semibold">{t}</span>
                  <span className="text-[.68rem]" style={{ color: 'var(--text-low)' }}>{d}</span>
                </div>
              ))}
            </div>
          }
        />
        <Diff
          icon={MessageSquare}
          delay={0.06}
          title="Sizin ağzınızdan konuşur"
          body="Daha önce müşterilerinize yazdığınız cevapları okur; selamlamanızı, cümle uzunluğunuzu, kapanış alışkanlığınızı öğrenir. Müşteriniz farkı anlamaz."
          mock={
            <div className="space-y-2.5">
              <p className="text-[.62rem] font-bold uppercase tracking-wider" style={{ color: 'var(--text-low)' }}>Sizin yazdığınız</p>
              <Bubble>Merhabalar, ürünümüz tamamen pamuklu ve terletmez. Afiyetle kullanın!</Bubble>
              <p className="text-[.62rem] font-bold uppercase tracking-wider ember">Sistemin yeni cevabı</p>
              <Bubble>Merhabalar, ürünümüz %100 pamuklu dokumadır, cildinizi rahatsız etmez. Afiyetle kullanın!</Bubble>
            </div>
          }
        />
        <Diff
          icon={PackageCheck}
          title="Kargonun yerini gidip bakar"
          span="lg:col-span-2"
          mock={
            <div className="space-y-2.5">
              <Bubble>Kargom nerede? 3 gün oldu.</Bubble>
              <Bubble me>Siparişiniz kargoya verildi, yolda. Tahmini teslimat 13–16 Temmuz.</Bubble>
              <Note>Gerçek durum — tahmin değil</Note>
            </div>
          }
          body="Müşteri sipariş numarasını yazdığında sistem siparişi anında kontrol eder, gerçek durumunu söyler."
        />
        <Diff
          icon={Clock}
          delay={0.06}
          title="Aynı müşteriyi hatırlar"
          span="lg:col-span-2"
          mock={
            <div className="space-y-2.5">
              <p className="text-[.62rem] font-bold uppercase tracking-wider" style={{ color: 'var(--text-low)' }}>Dün</p>
              <Bubble>Sipariş numaram 11405740188, ne zaman gelir?</Bubble>
              <p className="text-[.62rem] font-bold uppercase tracking-wider ember">Bugün</p>
              <Bubble>Hâlâ gelmedi, ne olacak?</Bubble>
              <Note>Numarası tekrar sorulmadı, konu size iletildi</Note>
            </div>
          }
          body="İkinci kez yazan müşteri sıfırdan başlamaz. Sipariş numarasını tekrar sormaz; konu çözülmediyse sizi devreye sokar."
        />
        <Diff
          icon={Ruler}
          delay={0.12}
          title="Yanlış bedeni söylemez"
          span="lg:col-span-2"
          mock={
            <div className="space-y-2.5">
              <Bubble>1.70 boyunda 65 kiloyum, hangi beden olur?</Bubble>
              <Bubble me>Beden tablomuza göre M beden tam olacaktır.</Bubble>
              <Note>Tablo yoksa tahmin etmez, size sorar</Note>
            </div>
          }
          body="Ayakkabıda numara, giyimde beden — her ürün kendi tablosuyla cevaplanır. Tablo yoksa kesin beden söylemez."
        />
        <Diff
          icon={ShieldCheck}
          title="Mağaza puanınızı korur"
          body="Trendyol; cevaplarda link, telefon ve e-posta paylaşılmasını onaylamıyor. Sistem her cevabı gönderilmeden önce denetler, riskli olanı temizler."
          mock={
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {['Link', 'Telefon', 'E-posta', 'Dış kanal'].map(t => (
                  <span key={t} className="chip bg-white"><X size={11} className="text-red-500" />{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 bg-white" style={{ border: '1px solid #BBF7D0' }}>
                <BadgeCheck size={15} className="text-green-600 shrink-0" />
                <span className="text-[.8rem]">Cevap gönderilmeden önce kontrol edilir</span>
              </div>
            </div>
          }
        />
        <Diff
          icon={Mail}
          delay={0.06}
          title="Emin değilse size sorar"
          body="Bilmediği konuda tahmin yürütmez, müşteriye “bilgim yok” da demez. Soru sessizce size düşer — müşteri yanlış bilgiyle karşılaşmaz."
          mock={
            <div className="space-y-2.5">
              <Bubble>Bu ürünü hamileyken kullanabilir miyim?</Bubble>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 bg-white" style={{ border: '1px solid var(--line)' }}>
                <Mail size={14} style={{ color: 'var(--ember-deep)' }} className="shrink-0" />
                <span className="text-[.8rem]">Soru size e-posta ile iletildi</span>
              </div>
              <Note>Sağlık ve ilaç soruları her zaman size gelir</Note>
            </div>
          }
        />
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Ürün — sekmeli panel kanıtı
// ────────────────────────────────────────────────
const TABS = [
  {
    k: 'Sorular',
    d: 'Gelen her soru, cevabı ve kimin cevapladığı tek ekranda. Onay bekleyenleri düzenleyip gönderirsiniz.',
    render: () => (
      <div className="p-4 sm:p-5 space-y-2">
        {[
          ['Bu serum hassas ciltte kullanılır mı?', 'Otomatik', 'ok'],
          ['Kumaş terletir mi? Yazlık mı?', 'Otomatik', 'ok'],
          ['Bu cüzdanla uyumlu kemer var mı?', 'Ürün önerildi', 'ok'],
          ['1.70 boyunda 65 kiloyum, hangi beden?', 'Onayınızda', 'wait'],
          ['Hamileyken kullanılır mı?', 'Size iletildi', 'wait'],
        ].map(([q, s, t]: any) => (
          <div key={q} className="flex items-center justify-between gap-3 rounded-lg px-3.5 py-3 bg-white" style={{ border: '1px solid var(--line)' }}>
            <span className="text-xs sm:text-[.82rem] truncate">{q}</span>
            <span className={`chip shrink-0 ${t === 'ok' ? 'chip-ok' : 'chip-wait'}`}>{s}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    k: 'Raporlar',
    d: 'Kaç soru geldi, kaçı otomatik cevaplandı, ne kadar zaman kazandınız, hangi ürün en çok soru alıyor.',
    render: () => (
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          {[['Toplam soru', '1.284'], ['Otomatik', '%91'], ['Ürün önerisi', '212'], ['Kazanılan', '64 saat']].map(([l, v]) => (
            <div key={l} className="rounded-xl px-3 py-2.5 bg-white" style={{ border: '1px solid var(--line)' }}>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-low)' }}>{l}</p>
              <p className="text-lg font-semibold mt-0.5">{v}</p>
            </div>
          ))}
        </div>
        <div className="flex items-end justify-between gap-1 h-24 rounded-xl p-3 bg-white" style={{ border: '1px solid var(--line)' }}>
          {[34, 48, 41, 66, 59, 78, 92, 71, 84, 63, 55, 74, 88, 96].map((h, i) => (
            <div key={i} className="bar flex-1" style={{ height: `${h}%` }} />
          ))}
        </div>
        <p className="text-[10px] mt-2" style={{ color: 'var(--text-low)' }}>Günlük soru hacmi — son 14 gün</p>
      </div>
    ),
  },
  {
    k: 'Ayarlar',
    d: 'Tonunuzu, ne kadar inisiyatif alacağını, satış önerisi yapıp yapmayacağını siz belirlersiniz.',
    render: () => (
      <div className="p-4 sm:p-5 space-y-2.5">
        {[
          ['Cevaplama tonu', 'Samimi'],
          ['Ne kadar inisiyatif alsın', 'Dengeli'],
          ['Satış önerisi yapsın mı', 'Açık'],
          ['Cevapları önce siz onaylayın', 'Açık'],
          ['Beden / ölçü rehberi', 'Tanımlı'],
        ].map(([l, v]) => (
          <div key={l} className="flex items-center justify-between gap-3 rounded-lg px-3.5 py-3 bg-white" style={{ border: '1px solid var(--line)' }}>
            <span className="text-[.82rem]" style={{ color: 'var(--text-mid)' }}>{l}</span>
            <span className="text-[.78rem] font-semibold ember">{v}</span>
          </div>
        ))}
      </div>
    ),
  },
];

const V2Product = () => {
  const [t, setT] = useState(0);
  return (
    <section id="v2-urun" className="py-24 sm:py-32" style={{ background: 'var(--paper-2)' }}>
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <Rv className="max-w-2xl mb-12">
          <Eyebrow num="02">Panel</Eyebrow>
          <h2 className="display h2 mb-5">Her şey <span className="ember">tek ekranda</span></h2>
          <p className="lede">Mağazanıza ne olduğunu görmek için Trendyol paneline girmenize gerek yok.</p>
        </Rv>
        <Rv delay={0.08}>
          <div className="flex flex-wrap gap-2 mb-5">
            {TABS.map((x, i) => (
              <button key={x.k} onClick={() => setT(i)} className="btn"
                style={i === t
                  ? { background: 'var(--text)', color: '#fff', border: '1px solid var(--text)', padding: '.55rem 1.1rem', fontSize: '.85rem' }
                  : { background: '#fff', color: 'var(--text-mid)', border: '1px solid var(--line)', padding: '.55rem 1.1rem', fontSize: '.85rem' }}>
                {x.k}
              </button>
            ))}
          </div>
          <p className="text-[.9rem] mb-5" style={{ color: 'var(--text-mid)' }}>{TABS[t].d}</p>
          <div className="chrome">
            <div className="chrome-bar">
              <span className="dot" /><span className="dot" /><span className="dot" />
              <span className="urlpill">app.sellerpilot.cloud</span>
            </div>
            {TABS[t].render()}
          </div>
        </Rv>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Nasıl çalışır
// ────────────────────────────────────────────────
const V2Steps = () => (
  <section id="v2-nasil" className="py-24 sm:py-32">
    <div className="max-w-5xl mx-auto px-5 sm:px-8">
      <Rv className="max-w-2xl mb-14">
        <Eyebrow num="03">Kurulum</Eyebrow>
        <h2 className="display h2 mb-5">Üç adım, birkaç dakika</h2>
      </Rv>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'var(--line)' }}>
        {[
          ['Hesabınızı açın', 'Trendyol satıcı panelinizden API bilgilerinizi kopyalayıp yapıştırın. Teknik bilgi gerekmez.'],
          ['Ürünleriniz yüklensin', 'Sistem mağazanıza bağlanır, tüm ürünlerinizi ve açıklamalarınızı kendisi öğrenir.'],
          ['İşinize dönün', 'Gelen sorular cevaplanmaya başlar. Zor sorular e-posta ile size düşer.'],
        ].map(([t, d], i) => (
          <Rv key={t} delay={i * 0.08}>
            <div className="h-full px-6 sm:px-8 py-10" style={{ background: 'var(--paper)' }}>
              <p className="display text-4xl mb-5" style={{ color: 'var(--line-2)' }}>0{i + 1}</p>
              <h3 className="display h3 mb-3">{t}</h3>
              <p className="text-[.9rem] leading-relaxed" style={{ color: 'var(--text-mid)' }}>{d}</p>
            </div>
          </Rv>
        ))}
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Karşılaştırma
// ────────────────────────────────────────────────
const ROWS: [string, boolean, boolean][] = [
  ['Gelen soruyu otomatik cevaplar', true, true],
  ['Ürün bilgilerinizi tanır', true, true],
  ['Emin olmadığı soruyu size iletir', true, true],
  ['Cevabı siz onaylayabilirsiniz', true, false],
  ['Sipariş durumunu anlık kontrol eder', true, false],
  ['Aynı müşteriyi ve geçmişini hatırlar', true, false],
  ['Uygun olduğunda satış önerisi yapar', true, false],
  ['Sizin yazım tarzınızı öğrenir', true, false],
  ['Beden ve numarada tahmin yürütmez', true, false],
  ['Geciken siparişe söz vermez', true, false],
  ['Link ve telefonu cevaptan temizler', true, false],
  ['Ürün açıklamalarınızı iyileştirir', true, false],
  ['Ürün fotoğrafı da üretir', true, false],
];

const V2Compare = () => (
  <section className="py-24 sm:py-32" style={{ background: 'var(--paper-2)' }}>
    <div className="max-w-3xl mx-auto px-5 sm:px-8">
      <Rv className="mb-12">
        <Eyebrow num="04">Karşılaştırma</Eyebrow>
        <h2 className="display h2 mb-5">Aradaki fark nerede?</h2>
        <p className="lede">Piyasadaki çoğu araç soruyu kapatır. Biz soruyu satışa çevirip mağazanızı korumaya çalışıyoruz.</p>
      </Rv>
      <Rv delay={0.08}>
        <div className="card overflow-hidden">
          <div className="grid grid-cols-[1fr_5rem_5rem] sm:grid-cols-[1fr_7rem_7rem] px-5 sm:px-7 py-3.5"
            style={{ borderBottom: '1px solid var(--line)', background: 'var(--paper-2)' }}>
            <span className="eyebrow" style={{ marginBottom: 0 }}>Özellik</span>
            <span className="eyebrow text-center justify-center ember" style={{ marginBottom: 0 }}>SellerPilot</span>
            <span className="eyebrow text-center justify-center" style={{ marginBottom: 0 }}>Sıradan bot</span>
          </div>
          {ROWS.map(([l, us, them], i) => (
            <div key={l} className="grid grid-cols-[1fr_5rem_5rem] sm:grid-cols-[1fr_7rem_7rem] items-center px-5 sm:px-7 py-3"
              style={i ? { borderTop: '1px solid var(--line)' } : undefined}>
              <span className="text-[.85rem]">{l}</span>
              <span className="flex justify-center">{us ? <Check size={17} className="text-green-600" /> : <Minus size={15} style={{ color: 'var(--line-2)' }} />}</span>
              <span className="flex justify-center">{them ? <Check size={17} style={{ color: 'var(--line-2)' }} /> : <Minus size={15} style={{ color: 'var(--line-2)' }} />}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-[.7rem] mt-4" style={{ color: 'var(--text-low)' }}>
          Karşılaştırma, ürünümüzde bugün canlı olarak çalışan özellikler üzerinden hazırlanmıştır.
        </p>
      </Rv>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Fiyatlandırma
// ────────────────────────────────────────────────
const V2_PLANS = [
  { name: 'Başlangıç', price: '1.299', per: 'soru başı 12,99₺', q: '100 soru / ay', f: ['1 mağaza', 'Tüm özellikler dahil', 'Onay modu', 'E-posta desteği'], pop: false },
  { name: 'Küçük Esnaf', price: '2.999', per: 'soru başı 10₺', q: '300 soru / ay', f: ['1 mağaza', 'Tüm özellikler dahil', 'Detaylı raporlar', 'Öncelikli e-posta desteği'], pop: false },
  { name: 'Büyüyen Marka', price: '8.999', per: 'soru başı 9₺', q: '1.000 soru / ay', f: ['3 mağaza', 'Tüm özellikler dahil', 'Detaylı raporlar', "WhatsApp'tan öncelikli destek"], pop: true },
  { name: 'Kurumsal', price: '19.999', per: 'soru başı 6,67₺', q: '3.000 soru / ay', f: ['Sınırsız mağaza', 'Tüm özellikler dahil', 'Birebir kurulum desteği', 'Telefonla öncelikli destek'], pop: false },
];

const V2Pricing = () => (
  <section id="v2-fiyat" className="py-24 sm:py-32">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Rv className="max-w-2xl mb-14">
        <Eyebrow num="05">Fiyatlandırma</Eyebrow>
        <h2 className="display h2 mb-5">Soru hacminize göre seçin</h2>
        <p className="lede">Tüm planlar 30 gün ücretsiz deneme ile başlar. Kredi kartı gerekmez.</p>
      </Rv>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {V2_PLANS.map((p, i) => (
          <Rv key={p.name} delay={i * 0.06} className="h-full">
            <div className="card h-full p-6 flex flex-col relative"
              style={p.pop ? { borderColor: 'var(--ember)', borderWidth: 1.5 } : undefined}>
              {p.pop && (
                <span className="absolute -top-2.5 left-6 text-[.62rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
                  style={{ background: 'var(--ember)' }}>En çok tercih edilen</span>
              )}
              <p className="text-[.8rem] font-semibold mb-4" style={{ color: 'var(--text-mid)' }}>{p.name}</p>
              <p className="display text-3xl mb-1">{p.price}₺</p>
              <p className="text-[.7rem] mb-1" style={{ color: 'var(--text-low)' }}>+ KDV · aylık</p>
              <p className="text-[.7rem] mb-5 ember">{p.per}</p>
              <p className="text-[.85rem] font-semibold mb-4 pb-4" style={{ borderBottom: '1px solid var(--line)' }}>{p.q}</p>
              <ul className="space-y-2.5 mb-7">
                {p.f.map(x => (
                  <li key={x} className="flex items-start gap-2 text-[.82rem]" style={{ color: 'var(--text-mid)' }}>
                    <Check size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--ember-deep)' }} />{x}
                  </li>
                ))}
              </ul>
              <a href={APP_URL} className={`btn mt-auto w-full ${p.pop ? 'btn-ember' : 'btn-line'}`}>Ücretsiz deneyin</a>
            </div>
          </Rv>
        ))}
      </div>
      <Rv delay={0.2}>
        <p className="text-center text-[.78rem] mt-8" style={{ color: 'var(--text-low)' }}>
          Kotanızdan sadece yapay zekânın cevapladığı sorular düşer — size iletilen ve sizin yazdığınız cevaplar ücretsizdir.
        </p>
      </Rv>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// SSS
// ────────────────────────────────────────────────
const V2Faq = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="v2-sss" className="py-24 sm:py-32" style={{ background: 'var(--paper-2)' }}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <Rv className="mb-12">
          <Eyebrow num="06">Sıkça sorulanlar</Eyebrow>
          <h2 className="display h2">Merak edilenler</h2>
        </Rv>
        <Rv delay={0.08}>
          <div className="card overflow-hidden">
            {FAQ_ITEMS.map((f, i) => (
              <div key={f.id} style={i ? { borderTop: '1px solid var(--line)' } : undefined}>
                <button onClick={() => setOpen(open === f.id ? null : f.id)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-7 py-5">
                  <span className="font-medium text-[.92rem]">{f.question}</span>
                  <ChevronDown size={17} className="shrink-0 transition-transform duration-300"
                    style={{ color: 'var(--text-low)', transform: open === f.id ? 'rotate(180deg)' : 'none' }} />
                </button>
                <div className="grid transition-all duration-300"
                  style={{ gridTemplateRows: open === f.id ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden">
                    <p className="px-5 sm:px-7 pb-5 text-[.875rem] leading-relaxed" style={{ color: 'var(--text-mid)' }}>{f.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Rv>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Kapanış + footer
// ────────────────────────────────────────────────
const V2Cta = () => (
  <section className="band-ink py-24 sm:py-32 overflow-hidden">
    <span className="glow" style={{ width: 620, height: 620, bottom: -320, left: '50%', transform: 'translateX(-50%)' }} />
    <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
      <Rv>
        <h2 className="display h2 mb-6" style={{ color: 'var(--ink-text)' }}>
          Bu gece son kez<br />sorulara <span style={{ color: 'var(--ember-2)' }}>siz bakın.</span>
        </h2>
        <p className="lede mx-auto mb-9">Yarın sabah soru-cevap ekranınız temiz olsun. 30 gün ücretsiz, kredi kartı gerekmez.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={APP_URL} className="btn btn-ember w-full sm:w-auto">Hemen başlayın <ArrowRight size={17} /></a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line w-full sm:w-auto">
            <Smartphone size={17} /> Önce konuşalım
          </a>
        </div>
      </Rv>
    </div>
  </section>
);

const V2Footer = () => (
  <footer className="band-ink pb-12 pt-2">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-5" style={{ borderTop: '1px solid var(--ink-line)' }}>
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,var(--ember),var(--ember-2))' }}>
            <Plane size={13} className="text-white fill-white" />
          </span>
          <span className="text-sm" style={{ color: 'var(--ink-mid)' }}>
            © {new Date().getFullYear()} SellerPilot · PurelyPro Badger Kozmetik Ltd. Şti.
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[.78rem]" style={{ color: 'var(--ink-mid)' }}>
          <a href="/mesafeli-satis-sozlesmesi.html">Mesafeli Satış</a>
          <a href="/gizlilik-guvenlik.html">Gizlilik</a>
          <a href="/iptal-iade.html">İptal & İade</a>
          <a href="/on-bilgilendirme-formu.html">Ön Bilgilendirme</a>
        </div>
      </div>
    </div>
  </footer>
);

// ────────────────────────────────────────────────
const V2Page = () => {
  useEffect(() => {
    document.title = 'SellerPilot — Trendyol satıcıları için yapay zekâ asistanı';
    // Önizleme rotası: ana sayfayla aynı içeriği taşıdığı için arama motorlarına
    // kopya içerik olarak görünmesin. v2 "/" ile yer değiştirdiğinde bu blok silinir.
    const m = document.createElement('meta');
    m.name = 'robots';
    m.content = 'noindex, nofollow';
    document.head.appendChild(m);
    return () => { m.remove(); };
  }, []);
  return (
    <div className="v2">
      <V2Styles />
      <V2Nav />
      <main>
        <V2Hero />
        <V2Metrics />
        <V2Diff />
        <V2Product />
        <V2Steps />
        <V2Compare />
        <V2Pricing />
        <V2Faq />
        <V2Cta />
      </main>
      <V2Footer />
    </div>
  );
};

export default V2Page;
