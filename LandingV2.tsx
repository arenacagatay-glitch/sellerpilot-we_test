// ═══════════════════════════════════════════════════════════════════
// SellerPilot Landing v2 — "Ink & Ember", Apple-grade revizyon
// ═══════════════════════════════════════════════════════════════════
// Kurallar:
//  1. ÖRNEK CEVAPLARDA KURGU YASAK — buradaki her müşteri sorusu ve her
//     sistem cevabı Supabase'ten (questions tablosu) birebir alınmıştır.
//     Tek düzenleme: mağaza adları ‹mağaza› olarak, sipariş numaraları
//     kısmen maskelendi. Yazım hataları müşterilere aittir, düzeltilmez.
//  2. Renk disiplini: turuncu yüzeyin ~%5'inde (CTA + tek vurgu + aktif durum).
//  3. Derinlik 1px çizgi + katmanla; gölge yok denecek kadar az.
//  4. Yeni JS bağımlılığı YOK; hareket CSS + IntersectionObserver,
//     prefers-reduced-motion tam destekli.
// ═══════════════════════════════════════════════════════════════════
import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, Check, Minus, Plane, Mail, Smartphone, ShieldCheck, Ruler,
  SlidersHorizontal, PackageCheck, MessageSquare, Clock, BadgeCheck, X,
  Sparkles, Camera, ChevronDown, Menu as MenuIcon, Search, PenLine, Send
} from 'lucide-react';
import { FAQ_ITEMS, WHATSAPP_URL, APP_URL } from './constants';

// ────────────────────────────────────────────────
// GERÇEK VERİ — Supabase `questions`, answer_source='ai', 20-25 Tem 2026.
// Birebir; sadece mağaza adı ‹mağaza›, sipariş no kısmen maskeli.
// ────────────────────────────────────────────────
const REAL_EXAMPLES = [
  {
    cat: 'SİPARİŞ TAKİBİ', date: '21 Temmuz 2026',
    q: '114•••0188 ben PTT demiştim ama ip ğ kolay gelsin kargoya vermişsiniz. ne zaman getirecekler,',
    a: 'Merhaba! 114•••0188 numaralı siparişinizi kontrol ettik: siparişiniz kargoya verildi, yolda (Kolay Gelsin Marketplace). Tahmini teslimat: 13 Temmuz - 16 Temmuz. Hesabım > Siparişlerim > "Kargom Nerede?" adımından da anlık takip edebilirsiniz. 📦',
    note: 'Numarayı görüp siparişi Trendyol\'dan gerçekten sorguladı — durum, kargo firması ve teslim tarihi gerçek.',
  },
  {
    cat: 'AYAKKABI', date: '25 Temmuz 2026',
    q: 'denizde giyinilrmi ıslak kumda',
    a: 'Merhaba efendim, bu terliğimiz her ne kadar plaj ve sahil kullanımına uygun olsa da ıslak kumda veya denizde hasır ve tekstil yapısı nedeniyle zorlanabilir 🌊 Deniz kenarında kullanım için tam koruma sağlayan «Kadın Erkek Şeffaf Kaymaz Taban Deniz Plaj Ayakkabısı» modelimizi de inceleyebilirsiniz. Mutlu ve sağlıklı günler dilerim :)',
    note: 'Ürünün sınırını dürüstçe söyledi, satışı kaybetmek yerine doğru ürüne yönlendirdi.',
  },
  {
    cat: 'TEKSTİL', date: '25 Temmuz 2026',
    q: '170 boy 107 kg kaç beden olur',
    a: 'Merhaba! Boy ve kilo ölçülerinize göre hazırladığımız beden tablomuza baktığımızda 60 beden tercih edebilirsiniz 😊',
    note: 'Mağazanın kendi beden tablosundan hesapladı — tahmin değil.',
  },
  {
    cat: 'BEBEK', date: '25 Temmuz 2026',
    q: 'Kapsamı nedir ben oyun parkı için istiyorum 120x120 uyumlumudur',
    a: 'Merhaba, evet bu sinekliğimiz tüm park yatak ve bebek yataklarıyla uyumlu olacak şekilde tasarlanmıştır, oyun parkınız için rahatlıkla kullanabilirsiniz 🍼✨',
    note: 'Ölçü uyumluluğunu ürün verisinden doğrulayıp net cevap verdi.',
  },
  {
    cat: 'YAPI MARKET', date: '22 Temmuz 2026',
    q: 'mutfak tezganihi boyamak istiyorum kac litre almam lazim',
    a: 'Merhaba! Mutfak tezgahınızın boyutu hakkında net bir şey söyleyebilmem için yaklaşık ölçülerini paylaşabilir misiniz? Genellikle mutfak tezgahı ve yoğun temas eden yüzeyler için koruyucu vernikle desteklenen setlerimiz çok daha uzun ömürlü bir kullanım sağlar 🍳✨',
    note: 'Litre uydurmak yerine ölçü istedi; doğru seti de önerdi.',
  },
  {
    cat: 'OTO KOKUSU', date: '20 Temmuz 2026',
    q: 'Bunu nasıl kullanıyoruz?',
    a: "Merhaba! Ürünümüzü 20-30 cm uzaklıktan uygulamanız, etkileyicilik ve kalıcılık açısından en iyi sonucu verecektir. Yoğun esanslı formülüyle aracınızda ferah bir ortam yaratabilirsiniz. Farklı bir koku denemek isterseniz, koleksiyonumuzdaki «'Elmalı Turta'» kokumuza da göz atabilirsiniz! 🚗✨",
    note: 'Kullanım tarifi verdi, üstüne katalogdan ikinci bir kokuyu doğal dille önerdi.',
  },
  {
    cat: 'AYAKKABI', date: '25 Temmuz 2026',
    q: '43 numara giyiyorum ürün rahat mı bir beden büyük mü almalıyım yoksa 43 numara uygun olur mu hangi kargo kolay gelsin',
    a: 'Merhaba efendim, ürünümüz tam kalıptır; ancak ayak yapınız buçuklu, taraklı veya etli/genişse rahat etmeniz için 1 numara büyük tercih edebilirsiniz. Siparişleriniz PTT Kargo ile gönderilmektedir 🌊 Mutlu ve sağlıklı günler dilerim :) ‹mağaza› Müşteri Memnuniyeti Ekibi',
    note: 'Tek mesajdaki iki ayrı soruyu tek cevapta topladı: kalıp + kargo firması.',
  },
];

// ────────────────────────────────────────────────
// Tasarım tokenları + hareket
// ────────────────────────────────────────────────
const V2Styles = () => (
  <style>{`
  .v2 {
    --paper:      #FAFAF9;
    --paper-2:    #F4F4F3;
    --line:       #E7E5E4;
    --line-2:     #D6D3D1;
    --text:       #0C0A09;
    --text-mid:   #57534E;
    --text-low:   #79716B;
    --ink:        #0A0C11;
    --ink-2:      #12151D;
    --ink-line:   rgba(255,255,255,.09);
    --ink-text:   #F5F5F4;
    --ink-mid:    #A6A09B;
    --ember:      #FF6B35;
    --ember-2:    #FFBE5C;
    --ember-deep: #C2410C;
    background: var(--paper);
    color: var(--text);
    font-family: Inter, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .v2 ::selection { background: var(--ember); color: #fff; }
  .v2 .font-display { font-family: 'Inter Tight', Inter, system-ui, sans-serif !important; letter-spacing: -0.03em; }

  .v2 .display {
    font-family: 'Inter Tight', Inter, system-ui, sans-serif;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1.02;
  }
  .v2 .h1 { font-size: clamp(2.75rem, 1.5rem + 5.2vw, 5.6rem); }
  .v2 .h2 { font-size: clamp(2.1rem, 1.35rem + 3vw, 3.6rem); }
  .v2 .h3 { font-size: clamp(1.25rem, 1.05rem + .8vw, 1.6rem); font-weight: 600; letter-spacing: -0.025em; line-height: 1.15; }
  .v2 .lede { font-size: clamp(1.05rem, .98rem + .3vw, 1.25rem); line-height: 1.65; color: var(--text-mid); max-width: 60ch; }
  .v2 .eyebrow {
    font-size: .6875rem; font-weight: 700; letter-spacing: .16em;
    text-transform: uppercase; color: var(--text-low);
    display: inline-flex; align-items: center; gap: .55rem;
  }
  .v2 .eyebrow .num { color: var(--ember-deep); font-variant-numeric: tabular-nums; }
  .v2 .ember { color: var(--ember-deep); }

  .v2 .band-ink { background: var(--ink); color: var(--ink-text); position: relative; isolation: isolate; }
  .v2 .band-ink .lede { color: var(--ink-mid); }
  .v2 .band-ink .eyebrow { color: var(--ink-mid); }
  .v2 .band-ink .eyebrow .num { color: var(--ember-2); }
  .v2 .band-ink::before {
    content:''; position:absolute; inset:0; z-index:-1; pointer-events:none; opacity:.025;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  .v2 .glow {
    position:absolute; border-radius:50%; pointer-events:none; z-index:-1;
    background: radial-gradient(circle, rgba(255,107,53,.18) 0%, rgba(255,107,53,0) 68%);
    filter: blur(22px);
  }

  .v2 .card {
    background:#fff; border:1px solid var(--line); border-radius: 20px;
    transition: border-color .25s ease, transform .25s ease;
  }
  .v2 .card:hover { border-color: var(--line-2); }

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

  .v2 .rv { opacity:0; transform: translateY(16px); transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1); }
  .v2 .rv.in { opacity:1; transform:none; }

  .v2 .chrome { background:#fff; border:1px solid var(--line); border-radius:16px; overflow:hidden; }
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

  /* Gerçek cevap vitrini — yatay kaydırma, snap */
  .v2 .rail {
    display:flex; gap:1.1rem; overflow-x:auto; padding: .25rem .25rem 1.25rem;
    scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .v2 .rail::-webkit-scrollbar { display:none; }
  .v2 .rail > * { scroll-snap-align: center; flex: 0 0 min(88vw, 30rem); }
  .v2 .masked { font-style: italic; color: var(--text-low); }
  .v2 .redact {
    filter: blur(4.5px);
    user-select: none; -webkit-user-select: none;
    pointer-events: none;
    opacity: .85;
  }

  /* ── Telefon vitrini (hero) ── */
  .v2 .phone-stage {
    position: relative;
    background-image:
      radial-gradient(circle at 50% 42%, rgba(255,107,53,.16) 0%, rgba(255,107,53,0) 62%),
      linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
    background-size: 100% 100%, 44px 44px, 44px 44px;
  }
  .v2 .phone {
    background: #0D0F16; border: 1px solid rgba(255,255,255,.12);
    border-radius: 2.6rem; box-shadow: 0 0 0 6px rgba(255,255,255,.03), 0 40px 80px -30px rgba(0,0,0,.8);
  }
  .v2 .float-chip {
    position: absolute; display: flex; align-items: center; gap: .6rem;
    background: rgba(18,21,29,.72); border: 1px solid rgba(255,255,255,.12);
    backdrop-filter: blur(10px); border-radius: 1rem; padding: .6rem .9rem;
    box-shadow: 0 18px 40px -18px rgba(0,0,0,.7);
  }
  .v2 .bob1 { animation: v2bob 6s ease-in-out infinite; }
  .v2 .bob2 { animation: v2bob 7.5s ease-in-out 1.2s infinite; }
  .v2 .bob3 { animation: v2bob 8.5s ease-in-out 2.1s infinite; }
  @keyframes v2bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }

  .v2 .msg-in { animation: v2msg .55s cubic-bezier(.22,1,.36,1) both; }
  @keyframes v2msg { from { opacity: 0; transform: translateY(12px) scale(.98); } to { opacity: 1; transform: none; } }
  .v2 .typing span {
    width: 5px; height: 5px; border-radius: 50%; background: var(--ink-mid);
    display: inline-block; animation: v2typ 1.1s ease-in-out infinite;
  }
  .v2 .typing span:nth-child(2) { animation-delay: .18s; }
  .v2 .typing span:nth-child(3) { animation-delay: .36s; }
  @keyframes v2typ { 0%,60%,100% { opacity: .25; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }

  @media (prefers-reduced-motion: reduce) {
    .v2 .rv { opacity:1 !important; transform:none !important; transition:none !important; }
    .v2 * { animation: none !important; scroll-behavior: auto !important; }
  }
  `}</style>
);

// ────────────────────────────────────────────────
// Yardımcılar
// ────────────────────────────────────────────────
const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.unobserve(el); } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
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

const Eyebrow = ({ num, children, center = false }: any) => (
  <p className={`eyebrow mb-5 ${center ? 'justify-center' : ''}`}><span className="num">{num}</span><span className="w-6 h-px bg-current opacity-30" />{children}</p>
);

// Gizlilik maskeleri: ‹mağaza› → bulanık "Mağaza Adı", «ürün adı» → bulanık ürün adı.
// Cevap metni birebir kalır; sadece kimlik bilgisi görsel olarak bulanıklaştırılır.
const Masked = ({ text }: { text: string }) => {
  const tokens = text.split(/(‹mağaza›|«[^»]+»)/g);
  return (
    <>
      {tokens.map((tk, i) => {
        if (tk === '‹mağaza›') return <span key={i} className="redact">Mağaza Adı</span>;
        if (tk.startsWith('«') && tk.endsWith('»')) return <span key={i} className="redact">{tk.slice(1, -1)}</span>;
        return <React.Fragment key={i}>{tk}</React.Fragment>;
      })}
    </>
  );
};

// ────────────────────────────────────────────────
// Canlı telefon vitrini — hero kanıtı (görsel dosyası yok, CSS + küçük döngü)
// Konuşmaların ÜÇÜ DE GERÇEK (Supabase, Tem 2026); sırayla oynar.
// ────────────────────────────────────────────────
const PHONE_CONVOS = [
  {
    tag: 'Beden tablosundan hesaplandı',
    q: '170 boy 107 kg kaç beden olur',
    a: 'Merhaba! Boy ve kilo ölçülerinize göre hazırladığımız beden tablomuza baktığımızda 60 beden tercih edebilirsiniz 😊',
  },
  {
    tag: "Sipariş Trendyol'dan canlı sorgulandı",
    q: '114•••0188 ben PTT demiştim ama ip ğ kolay gelsin kargoya vermişsiniz. ne zaman getirecekler,',
    a: 'Merhaba! 114•••0188 numaralı siparişinizi kontrol ettik: siparişiniz kargoya verildi, yolda (Kolay Gelsin Marketplace). Tahmini teslimat: 13 Temmuz - 16 Temmuz. 📦',
  },
  {
    tag: 'Ürün verisinden doğrulandı',
    q: 'Kapsamı nedir ben oyun parkı için istiyorum 120x120 uyumlumudur',
    a: 'Merhaba, evet bu sinekliğimiz tüm park yatak ve bebek yataklarıyla uyumlu olacak şekilde tasarlanmıştır, oyun parkınız için rahatlıkla kullanabilirsiniz 🍼✨',
  },
];

const PhoneMock = () => {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'q' | 'typing' | 'a'>('a');
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let alive = true;
    const timers: number[] = [];
    const cycle = (i: number) => {
      if (!alive) return;
      setIdx(i); setPhase('q');
      timers.push(window.setTimeout(() => alive && setPhase('typing'), 700));
      timers.push(window.setTimeout(() => alive && setPhase('a'), 2000));
      timers.push(window.setTimeout(() => cycle((i + 1) % PHONE_CONVOS.length), 9000));
    };
    cycle(0);
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, []);
  const c = PHONE_CONVOS[idx];
  return (
    <div className="phone-stage px-6 py-10 sm:px-10 sm:py-12 rounded-[2rem]">
      {/* Yüzen rozetler */}
      <div className="float-chip bob1 hidden sm:flex" style={{ top: '14%', left: '-1.5rem', zIndex: 2 }}>
        <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(74,222,128,.12)', border: '1px solid rgba(74,222,128,.3)' }}>
          <BadgeCheck size={15} className="text-green-400" />
        </span>
        <span>
          <span className="block text-[.62rem]" style={{ color: 'var(--ink-mid)' }}>Soru cevaplandı</span>
          <span className="block text-[.78rem] font-bold" style={{ color: 'var(--ink-text)' }}>dakikalar içinde ⚡</span>
        </span>
      </div>
      <div className="float-chip bob2 hidden sm:flex" style={{ top: '38%', right: '-1.75rem', zIndex: 2 }}>
        <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,190,92,.12)', border: '1px solid rgba(255,190,92,.3)' }}>
          <Sparkles size={14} style={{ color: 'var(--ember-2)' }} />
        </span>
        <span>
          <span className="block text-[.62rem]" style={{ color: 'var(--ink-mid)' }}>Mağaza puanı</span>
          <span className="block text-[.78rem] font-bold" style={{ color: 'var(--ink-text)' }}>9.4 ↗</span>
        </span>
      </div>
      <div className="float-chip bob3 hidden sm:flex" style={{ bottom: '12%', left: '-1rem', zIndex: 2 }}>
        <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,107,53,.14)', border: '1px solid rgba(255,107,53,.32)' }}>
          <PackageCheck size={14} style={{ color: 'var(--ember)' }} />
        </span>
        <span>
          <span className="block text-[.62rem]" style={{ color: 'var(--ink-mid)' }}>Soru → satışa döndü</span>
          <span className="block text-[.78rem] font-bold" style={{ color: 'var(--ink-text)' }}>+1 öneri 🛍️</span>
        </span>
      </div>

      {/* Telefon */}
      <div className="phone relative mx-auto max-w-[22rem] px-4 pt-4 pb-6 sm:px-5">
        <div className="flex items-center justify-between px-2 py-2 mb-2">
          <span className="text-[.75rem] font-semibold" style={{ color: 'var(--ink-text)' }}>02:47</span>
          <span className="mx-auto w-20 h-5 rounded-full" style={{ background: '#000' }} />
          <span className="text-[.68rem]" style={{ color: 'var(--ink-mid)' }}>☾ Sessiz mod</span>
        </div>
        <p className="text-center text-[.68rem] mb-4" style={{ color: 'var(--ink-mid)' }}>Siz şu an uyuyorsunuz 😴</p>

        <div className="min-h-[19rem] flex flex-col justify-start gap-2.5" key={idx}>
          <div className="msg-in self-start max-w-[88%] rounded-2xl rounded-bl-md px-3.5 py-2.5"
            style={{ background: 'rgba(255,255,255,.06)', border: '1px solid var(--ink-line)' }}>
            <p className="text-[.62rem] font-bold mb-1" style={{ color: 'var(--ember-2)' }}>Yeni müşteri sorusu · 02:47</p>
            <p className="text-[.8rem] leading-relaxed" style={{ color: 'var(--ink-text)' }}>{c.q}</p>
          </div>

          {phase === 'typing' && (
            <div className="msg-in self-end rounded-2xl rounded-br-md px-4 py-3" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid var(--ink-line)' }}>
              <span className="typing flex gap-1"><span /><span /><span /></span>
            </div>
          )}

          {phase === 'a' && (
            <>
              <div className="msg-in self-end max-w-[92%] rounded-2xl rounded-br-md px-3.5 py-3 text-white"
                style={{ background: 'linear-gradient(135deg,var(--ember),var(--ember-2))' }}>
                <p className="text-[.62rem] font-bold mb-1 flex items-center gap-1.5 text-white/85">
                  <Plane size={11} className="fill-white" /> Mağazanız adına cevaplandı
                </p>
                <p className="text-[.8rem] leading-relaxed">{c.a}</p>
              </div>
              <div className="msg-in self-center mt-1 inline-flex items-center gap-1.5 text-[.65rem] font-semibold px-3 py-1.5 rounded-full"
                style={{ color: '#4ADE80', background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.25)', animationDelay: '.25s' }}>
                <BadgeCheck size={12} /> {c.tag}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center gap-1.5 mt-4">
          {PHONE_CONVOS.map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
              style={{ background: i === idx ? 'var(--ember)' : 'rgba(255,255,255,.15)' }} />
          ))}
        </div>
      </div>
      <p className="text-center text-[.65rem] mt-5" style={{ color: 'var(--ink-mid)' }}>
        Üç konuşma da gerçek — Temmuz 2026'da Trendyol'da yayınlandı.
      </p>
    </div>
  );
};

// ────────────────────────────────────────────────
// Nav
// ────────────────────────────────────────────────
const LINKS = [
  { l: 'Satış', h: '/#v2-satis' },
  { l: 'Farkımız', h: '/#v2-fark' },
  { l: 'Görsel Stüdyo', h: '/gorsel-studyo' },
  { l: 'Blog', h: '/blog' },
  { l: 'Fiyatlar', h: '/#v2-fiyat' },
  { l: 'SSS', h: '/#v2-sss' },
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
// Hero
// ────────────────────────────────────────────────
const V2Hero = () => (
  <section id="top" className="band-ink pt-28 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
    <span className="glow" style={{ width: 820, height: 820, top: -300, left: '50%', transform: 'translateX(-50%)' }} />
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <Rv className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3.5 py-1.5 mb-9"
            style={{ border: '1px solid var(--ink-line)', color: 'var(--ink-mid)', background: 'rgba(255,255,255,.03)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--ember)' }} />
            Bir Trendyol satıcısı tarafından geliştirildi
          </span>
          <h1 className="display h1 mb-7" style={{ color: 'var(--ink-text)' }}>
            Sorulara siz değil,<br /><span style={{ color: 'var(--ember-2)' }}>mağazanız</span> cevap versin.
          </h1>
          <p className="lede mx-auto lg:mx-0 mb-10">
            SellerPilot ürünlerinizi tanır, gelen soruyu sizin sesinizle dakikalar içinde yanıtlar.
            Emin olamadığını asla uydurmaz — size iletir.
          </p>
          <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-3 mb-4">
            <a href={APP_URL} className="btn btn-ember w-full sm:w-auto">15 gün ücretsiz dene <ArrowRight size={17} /></a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line w-full sm:w-auto">
              <Smartphone size={17} /> WhatsApp'tan yazın
            </a>
          </div>
          <p className="text-xs" style={{ color: 'var(--ink-mid)' }}>Kredi kartı gerekmez · Kurulum birkaç dakika</p>
        </Rv>

        <Rv delay={0.12}>
          <PhoneMock />
        </Rv>
      </div>

      <Rv delay={0.18} className="mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ background: 'var(--ink-line)' }}>
          {/* ⚠️ RAKAMLAR ÖLÇÜMDÜR, SLOGAN DEĞİL. Kaynak: `questions` tablosu,
              son 90 gün, 13 mağaza, satıcının kendi yazdığı cevaplar hariç
              (answer_source <> 'trendyol_sync'): 1.582 soru bota ulaştı,
              950'sini AI cevapladı (%60,1); medyan cevap süresi 114 sn.
              Değiştirmeden ÖNCE yeniden ölç — eski rakamla güncel iddia kurma. */}
          {[
            ['%60', 'soruyu siz görmeden cevaplar'],
            ['2 dakika', 'medyan cevap süresi'],
            ['7/24', 'gece, hafta sonu, bayram'],
            ['Sıfır', 'tahmine dayalı cevap'],
          ].map(([big, small]) => (
            <div key={big} className="px-5 py-7 text-center" style={{ background: 'var(--ink)' }}>
              <p className="display text-2xl sm:text-[1.75rem] mb-1.5" style={{ color: 'var(--ink-text)', fontWeight: 600 }}>{big}</p>
              <p className="text-xs" style={{ color: 'var(--ink-mid)' }}>{small}</p>
            </div>
          ))}
        </div>
      </Rv>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Gerçek cevaplar — yıldız bölüm
// ────────────────────────────────────────────────
const V2RealAnswers = () => (
  <section id="v2-cevaplar" className="py-24 sm:py-36 overflow-hidden">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Rv className="text-center max-w-3xl mx-auto mb-14">
        <Eyebrow num="01" center>Gerçek cevaplar</Eyebrow>
        <h2 className="display h2 mb-6">Kurgu değil.<br /><span className="ember">Bu hafta verilmiş cevaplar.</span></h2>
        <p className="lede mx-auto">
          Aşağıdaki her cevap sistem tarafından yazıldı ve Trendyol'da gerçekten yayınlandı.
          Yazım hataları müşterilere ait — gerçek hayat böyle.
        </p>
      </Rv>
    </div>
    <Rv delay={0.08}>
      <div className="rail px-5 sm:px-[max(1.25rem,calc((100vw-72rem)/2+2rem))]">
        {REAL_EXAMPLES.map(ex => (
          <article key={ex.q} className="card p-6 sm:p-7 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <span className="eyebrow" style={{ marginBottom: 0 }}>{ex.cat}</span>
              <span className="text-[.68rem]" style={{ color: 'var(--text-low)' }}>{ex.date}</span>
            </div>
            <div className="rounded-2xl rounded-bl-md px-4 py-3 mb-3 self-start max-w-[92%]"
              style={{ background: 'var(--paper-2)', border: '1px solid var(--line)' }}>
              <p className="text-[.85rem] leading-relaxed" style={{ color: 'var(--text-mid)' }}>{ex.q}</p>
            </div>
            <div className="rounded-2xl rounded-br-md px-4 py-3.5 mb-5 self-end max-w-[95%] text-white"
              style={{ background: 'linear-gradient(135deg,var(--ember),var(--ember-2))' }}>
              <p className="text-[.85rem] leading-relaxed"><Masked text={ex.a} /></p>
            </div>
            <div className="mt-auto flex items-start gap-2 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
              <BadgeCheck size={15} className="text-green-600 shrink-0 mt-0.5" />
              <p className="text-[.78rem] leading-relaxed" style={{ color: 'var(--text-mid)' }}>{ex.note}</p>
            </div>
          </article>
        ))}
      </div>
    </Rv>
    <p className="text-center text-[.72rem] mt-4 px-5" style={{ color: 'var(--text-low)' }}>
      Kaydırarak devamını görün · Mağaza ve ürün adları gizlilik için bulanıklaştırıldı — cevapların geri kalanı birebir.
    </p>
  </section>
);

// ────────────────────────────────────────────────
// Satışçınız — EN ÖNEMLİ ÖZELLİK (upsell + kampanya), koyu bant
// Üç cevap da GERÇEK (Supabase, 24-25 Tem 2026); işaretlemeler metni
// DEĞİŞTİRMEZ, sadece ilgili kısmı renklendirir.
// ────────────────────────────────────────────────
const SALES_EXAMPLES = [
  {
    store: 'Ayakkabı mağazası', q: 'Merhaba önündeki süslü taşı var değil mi',
    parts: [
      { t: 'Merhaba efendim, bu modelimizde tokalı detay bulunmaktadır ancak süslü taş arıyorsanız ' },
      { t: '«"Beyaz Tüylü Taşlı Kadın Terlik"» modelimizi inceleyebilirsiniz', hl: 'product' },
      { t: ' ✨ ' },
      { t: 'Tüm ürünlerde geçerli 5 al 4 öde kampanyamız da devam ediyor.', hl: 'campaign' },
      { t: ' Mutlu ve sağlıklı günler dilerim :) ‹mağaza› Müşteri Memnuniyeti Ekibi' },
    ],
    note: 'Aranan özellik bu üründe yoktu — satışı kaybetmek yerine doğru ürüne taşıdı, kampanyayı da hatırlattı.',
  },
  {
    store: 'Ev & yaşam mağazası', q: 'Daha büyük boyu var mı',
    parts: [
      { t: 'Merhaba! Bu modelimiz 80x100 cm ebatındadır ancak daha geniş bir kullanım için ' },
      { t: '«100x150 cm Kurutma Örtüsü» seçeneğimizi de inceleyebilirsiniz', hl: 'product' },
      { t: ' 😊' },
    ],
    note: 'Küçük gelen ürünü satmaya çalışmadı — kataloğundaki büyük boyu bulup satışı ona taşıdı.',
  },
  {
    store: 'Parfüm mağazası', q: 'La Vie Est Belle Vanille Nude Lancôme muadili var mı aynı kokunun esans oranı nedir ?',
    parts: [
      { t: 'Merhaba! İncelediğiniz ürün Good Girl esintilidir, ancak aradığınız La Vie Est Belle tarzı için ' },
      { t: '«La Vi Belle Esintili Kadın Parfüm» modelimizi önerebilirim', hl: 'product' },
      { t: '. Ürünlerimiz %35-40 esans oranına sahip olup şık hediyelik kutusunda gönderilmektedir ✨' },
    ],
    note: 'Müşterinin yanlış üründe olduğunu anladı, aradığı kokuyu katalogdan buldu, teknik soruyu da cevapladı.',
  },
];

const HL_STYLE: any = {
  product: { background: 'rgba(255,107,53,.14)', borderBottom: '2px solid var(--ember)', borderRadius: '3px', padding: '0 2px' },
  campaign: { background: 'rgba(74,222,128,.16)', borderBottom: '2px solid #4ADE80', borderRadius: '3px', padding: '0 2px' },
};

const V2Sales = () => (
  <section id="v2-satis" className="band-ink py-24 sm:py-36 overflow-hidden">
    <span className="glow" style={{ width: 700, height: 700, top: '-10%', right: '-15%' }} />
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Rv className="text-center max-w-3xl mx-auto mb-6">
        <Eyebrow num="02" center>Sizin yerinize satış yapar</Eyebrow>
        <h2 className="display h2 mb-6" style={{ color: 'var(--ink-text)' }}>
          Artık 7/24 çalışan bir<br /><span style={{ color: 'var(--ember-2)' }}>satışçınız var.</span>
        </h2>
        <p className="lede mx-auto">
          Çoğu araç soruyu kapatır ve susar. SellerPilot sorunun içindeki satışı görür:
          müşteri aradığını bulamadığında kataloğunuzdan doğru ürünü önerir,
          tanımladığınız kampanyayı tam yerinde söyler. Sorular gider, siparişler gelir.
        </p>
      </Rv>

      <Rv delay={0.06} className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-14">
        <span className="inline-flex items-center gap-1.5 text-[.72rem]" style={{ color: 'var(--ink-mid)' }}>
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--ember)' }} /> Kataloğunuzdan önerilen gerçek ürün
        </span>
        <span className="inline-flex items-center gap-1.5 text-[.72rem]" style={{ color: 'var(--ink-mid)' }}>
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#4ADE80' }} /> Sizin tanımladığınız kampanya
        </span>
      </Rv>

      <div className="rail">
        {SALES_EXAMPLES.map((ex, i) => (
          <Rv key={ex.q} delay={i * 0.08}>
            <div className="h-full rounded-[20px] p-6 flex flex-col" style={{ background: 'var(--ink-2)', border: '1px solid var(--ink-line)' }}>
              <p className="eyebrow mb-4" style={{ marginBottom: '1rem' }}>{ex.store}</p>
              <div className="rounded-2xl rounded-bl-md px-4 py-3 mb-3 self-start max-w-[92%]"
                style={{ background: 'rgba(255,255,255,.06)', border: '1px solid var(--ink-line)' }}>
                <p className="text-[.85rem] leading-relaxed" style={{ color: 'var(--ink-text)' }}>{ex.q}</p>
              </div>
              <div className="rounded-2xl rounded-br-md px-4 py-3.5 mb-5 self-end bg-white">
                <p className="text-[.85rem] leading-[1.75]" style={{ color: 'var(--text)' }}>
                  {ex.parts.map((p, j) => p.hl
                    ? <span key={j} style={HL_STYLE[p.hl]}><Masked text={p.t} /></span>
                    : <Masked key={j} text={p.t} />)}
                </p>
              </div>
              <div className="mt-auto flex items-start gap-2 pt-4" style={{ borderTop: '1px solid var(--ink-line)' }}>
                <BadgeCheck size={15} className="text-green-400 shrink-0 mt-0.5" />
                <p className="text-[.78rem] leading-relaxed" style={{ color: 'var(--ink-mid)' }}>{ex.note}</p>
              </div>
            </div>
          </Rv>
        ))}
      </div>
      <p className="text-center text-[.72rem] mt-2" style={{ color: 'var(--ink-mid)' }}>Kaydırarak üç mağazayı da görün →</p>

      <Rv delay={0.2} className="mt-10">
        <div className="max-w-3xl mx-auto rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center"
          style={{ background: 'rgba(255,255,255,.03)', border: '1px solid var(--ink-line)' }}>
          <p className="display text-3xl" style={{ color: 'var(--ember-2)', fontWeight: 600 }}>62 / 467</p>
          <p className="text-[.85rem] leading-relaxed sm:text-left" style={{ color: 'var(--ink-mid)' }}>
            Gerçek veri: sistemin verdiği son 467 otomatik cevabın 62'sinde müşteriye
            katalogdan ürün önerildi. Her öneri, kaybolacak bir sorunun satış fırsatına dönmesi.
          </p>
        </div>
        <p className="text-center text-[.72rem] mt-6" style={{ color: 'var(--ink-mid)' }}>
          Üç cevap üç farklı mağazadan · Mağaza ve ürün adları gizlilik için bulanıklaştırıldı · Yalnızca stoktaki ürünler önerilir, kampanya tanımlı değilse indirim uydurulmaz, iade ve şikâyette satış kapalıdır.
        </p>
      </Rv>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Farkımız — bento (gerçek kanıtlarla)
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
  <section id="v2-fark" className="py-24 sm:py-36" style={{ background: 'var(--paper-2)' }}>
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Rv className="max-w-2xl mb-14">
        <Eyebrow num="03">Farkımız</Eyebrow>
        <h2 className="display h2 mb-6">Otomatik cevap kolay.<br /><span className="ember">Doğru cevap zor.</span></h2>
        <p className="lede">Bir mağazayı yakan şey cevapsız soru değil, yanlış cevaptır. SellerPilot neyi söyleyeceği kadar, neyi söylemeyeceğini de bilir.</p>
      </Rv>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-5">
        <Diff
          icon={MessageSquare}
          title="Sizin ağzınızdan konuşur"
          body="Kendi yazdığınız cevapları okur; selamlamanızı, imzanızı, resmiyet düzeyinizi öğrenir. Aşağıdaki iki cevap aynı sistemden, iki gerçek mağazadan — biri 'efendim'li ve imzalı, öteki samimi ve kısa."
          mock={
            <div className="space-y-2.5">
              <p className="text-[.62rem] font-bold uppercase tracking-wider" style={{ color: 'var(--text-low)' }}>Mağaza A — resmi ve imzalı</p>
              <Bubble me><Masked text="Merhaba efendim, ürünümüz tam kalıptır ancak ayağınız buçuklu veya taraklı ise 1 numara büyük sipariş oluşturmanızı tavsiye ederiz. Mutlu ve sağlıklı günler dilerim :) ‹mağaza› Müşteri Memnuniyeti Ekibi" /></Bubble>
              <p className="text-[.62rem] font-bold uppercase tracking-wider" style={{ color: 'var(--text-low)' }}>Mağaza B — samimi ve kısa</p>
              <Bubble me>Merhaba! Boy ve kilo ölçülerinize göre hazırladığımız beden tablomuza baktığımızda 60 beden tercih edebilirsiniz 😊</Bubble>
              <Note>İki cevap da gerçek — 25 Temmuz 2026</Note>
            </div>
          }
        />
        <Diff
          icon={SlidersHorizontal}
          delay={0.06}
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
          icon={PackageCheck}
          title="Kargonun yerini gidip bakar"
          span="lg:col-span-2"
          body="Müşteri sipariş numarasını yazdığında sistem siparişi anında kontrol eder, gerçek durumunu söyler."
          mock={
            <div className="space-y-2.5">
              <Bubble>Kargom nerede? 3 gün oldu.</Bubble>
              <Bubble me>Merhaba! 114•••0188 numaralı siparişinizi kontrol ettik: siparişiniz kargoya verildi, yolda (Kolay Gelsin Marketplace). Tahmini teslimat: 13 Temmuz - 16 Temmuz. 📦</Bubble>
              <Note>Gerçek sipariş sorgusu — durum, kargo firması ve tarih Trendyol'dan geldi</Note>
            </div>
          }
        />
        <Diff
          icon={Clock}
          delay={0.06}
          title="Aynı müşteriyi hatırlar"
          span="lg:col-span-2"
          body="İkinci kez yazan müşteri sıfırdan başlamaz. Sipariş numarasını tekrar sormaz; konu çözülmediyse konuşma geçmişiyle birlikte size devredilir."
          mock={
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 bg-white" style={{ border: '1px solid var(--line)' }}>
                <Clock size={13} style={{ color: 'var(--text-low)' }} className="shrink-0" />
                <span className="text-[.78rem]" style={{ color: 'var(--text-mid)' }}>Dün — müşteri sipariş numarasını yazdı</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 bg-white" style={{ border: '1px solid var(--line)' }}>
                <Clock size={13} style={{ color: 'var(--ember-deep)' }} className="shrink-0" />
                <span className="text-[.78rem]" style={{ color: 'var(--text-mid)' }}>Bugün — aynı müşteri tekrar yazdı</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 bg-white" style={{ border: '1px solid #BBF7D0' }}>
                <BadgeCheck size={14} className="text-green-600 shrink-0" />
                <span className="text-[.78rem]">Numara tekrar sorulmadı — geçmişiyle birlikte değerlendirildi</span>
              </div>
            </div>
          }
        />
        <Diff
          icon={Ruler}
          delay={0.12}
          title="Yanlış bedeni söylemez"
          span="lg:col-span-2"
          body="Ayakkabıda numara, giyimde beden — her ürün kendi tablosuyla cevaplanır. Tablo yoksa kesin beden söylemez, size sorar."
          mock={
            <div className="space-y-2.5">
              <Bubble>Bir beden büyük alırsam genişler mi acaba uzunlaması iyi ama toka kısmından dar geliyor</Bubble>
              <Bubble me><Masked text="Merhaba efendim, ürünümüz tam kalıptır ancak ayak yapınız taraklı veya buçuklu ise konforunuz için 1 numara büyük tercih etmenizi öneririm; bu sayede enlemesine ve toka kısmından da rahat edersiniz 🌸" /></Bubble>
              <Note>Gerçek cevap — 24 Temmuz 2026</Note>
            </div>
          }
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
              <Bubble>Cırt cırt pant geri söküldüğü zaman pencerenin beyaz bölümünde leke yapışkanlık iz bırakır mı</Bubble>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 bg-white" style={{ border: '1px solid var(--line)' }}>
                <Mail size={14} style={{ color: 'var(--ember-deep)' }} className="shrink-0" />
                <span className="text-[.8rem]">Soru size e-posta ile iletildi</span>
              </div>
              <Note>Gerçek vaka: kalıntı riski yüzeye göre değiştiği için tahmin edilmedi</Note>
            </div>
          }
        />
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// İlanlarınız kendini yazar (P6/P7)
// ────────────────────────────────────────────────
const V2Listings = () => (
  <section id="v2-ilan" className="py-24 sm:py-36">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Rv className="text-center max-w-3xl mx-auto mb-16">
        <Eyebrow num="04" center>İlan iyileştirme</Eyebrow>
        <h2 className="display h2 mb-6">İlanlarınız <span className="ember">kendini yazar</span></h2>
        <p className="lede mx-auto">
          Müşteriler aynı şeyi tekrar tekrar soruyorsa, o bilgi açıklamanızda eksik demektir.
          SellerPilot bunu sizin yerinize fark eder — ve düzeltir.
        </p>
      </Rv>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {[
          {
            icon: Search, t: 'Tespit eder',
            d: 'Çok soru alan ürünleriniz otomatik işaretlenir: müşteriler soruyor ama açıklamada cevabı yok.',
            mock: (
              <div className="space-y-2">
                <div className="rounded-lg px-3 py-2.5 bg-white" style={{ border: '1px solid var(--line)' }}>
                  <p className="text-[.8rem] font-semibold mb-1"><span className="redact">Kadın Günlük Terlik</span></p>
                  <span className="chip chip-wait">Sık soru alıyor — açıklamanız eksik olabilir</span>
                </div>
                <div className="rounded-lg px-3 py-2.5 bg-white flex items-center justify-between" style={{ border: '1px solid var(--line)' }}>
                  <p className="text-[.8rem]" style={{ color: 'var(--text-mid)' }}>Bu ay gelen soru</p>
                  <p className="text-[.85rem] font-semibold">27</p>
                </div>
              </div>
            ),
          },
          {
            icon: PenLine, t: 'Sizin yerinize yazar',
            d: 'Gelen soruları ve ürün fotoğrafını inceler; başlık ve açıklama için hazır metin önerir. Neyin eksik olduğunu da söyler.',
            mock: (
              <div className="space-y-2">
                <p className="text-[.62rem] font-bold uppercase tracking-wider" style={{ color: 'var(--text-low)' }}>Müşteriler soruyor, açıklamada yok:</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Kalıp bilgisi', 'Numara tablosu', 'Taban özelliği'].map(x => (
                    <span key={x} className="chip bg-white">{x}</span>
                  ))}
                </div>
                <div className="rounded-lg px-3 py-2.5 bg-white" style={{ border: '1px solid var(--ember)' }}>
                  <p className="text-[.72rem]" style={{ color: 'var(--text-mid)' }}>✎ Yeni açıklama taslağı hazır — dilerseniz düzenleyin</p>
                </div>
              </div>
            ),
          },
          {
            icon: Send, t: 'Tek tuşla Trendyol\'a',
            d: 'Beğendiyseniz tek tuşla gönderirsiniz. Sadece başlık ve açıklama güncellenir — fiyata, stoğa ve kategoriye asla dokunulmaz.',
            mock: (
              <div className="space-y-2">
                <button className="btn btn-ember w-full" style={{ padding: '.65rem 1rem', fontSize: '.82rem', pointerEvents: 'none' }}>
                  Trendyol'a Gönder <ArrowRight size={14} />
                </button>
                <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 bg-white" style={{ border: '1px solid #BBF7D0' }}>
                  <BadgeCheck size={14} className="text-green-600 shrink-0" />
                  <span className="text-[.72rem]">Fiyat, stok ve kategori korunur</span>
                </div>
              </div>
            ),
          },
        ].map((s, i) => (
          <Rv key={s.t} delay={i * 0.08}>
            <div className="card h-full p-6 sm:p-8 flex flex-col">
              <p className="display text-4xl mb-6" style={{ color: 'var(--line-2)', fontWeight: 600 }}>0{i + 1}</p>
              <h3 className="display h3 mb-3">{s.t}</h3>
              <p className="text-[.9rem] leading-relaxed mb-7" style={{ color: 'var(--text-mid)' }}>{s.d}</p>
              <div className="mt-auto rounded-xl p-4" style={{ background: 'var(--paper-2)', border: '1px solid var(--line)' }}>{s.mock}</div>
            </div>
          </Rv>
        ))}
      </div>

      <Rv delay={0.2}>
        <a href="/gorsel-studyo" className="mt-6 card flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-7 group">
          <div className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--paper-2)', border: '1px solid var(--line)' }}>
              <Camera size={17} style={{ color: 'var(--ember-deep)' }} />
            </span>
            <div>
              <p className="font-semibold text-[.95rem]">Ürün fotoğraflarınızı da üretir</p>
              <p className="text-[.85rem]" style={{ color: 'var(--text-mid)' }}>Tek fotoğraftan Trendyol'a hazır 6 profesyonel görsel — Görsel Stüdyo</p>
            </div>
          </div>
          <span className="btn btn-line" style={{ padding: '.6rem 1.1rem', fontSize: '.85rem' }}>İncele <ArrowRight size={15} /></span>
        </a>
      </Rv>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Panel — sekmeli ürün kanıtı
// ────────────────────────────────────────────────
const TABS = [
  {
    k: 'Sorular',
    d: 'Gelen her soru, cevabı ve kimin cevapladığı tek ekranda. Onay bekleyenleri düzenleyip gönderirsiniz.',
    render: () => (
      <div className="p-4 sm:p-5 space-y-2">
        {[
          ['114•••0188 ... ne zaman getirecekler', 'Sipariş sorgulandı', 'ok'],
          ['denizde giyinilrmi ıslak kumda', 'Ürün önerildi', 'ok'],
          ['170 boy 107 kg kaç beden olur', 'Otomatik', 'ok'],
          ['La Vie Est Belle muadili var mı', 'Otomatik', 'ok'],
          ['mutfak tezganihi boyamak istiyorum kac litre', 'Ölçü istendi', 'ok'],
          ['Cırt cırt bant pencerede iz bırakır mı', 'Size iletildi', 'wait'],
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
    <section id="v2-urun" className="py-24 sm:py-36" style={{ background: 'var(--paper-2)' }}>
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <Rv className="max-w-2xl mb-12">
          <Eyebrow num="05">Panel</Eyebrow>
          <h2 className="display h2 mb-6">Her şey <span className="ember">tek ekranda</span></h2>
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
// Kurulum
// ────────────────────────────────────────────────
const V2Steps = () => (
  <section id="v2-nasil" className="py-24 sm:py-36">
    <div className="max-w-5xl mx-auto px-5 sm:px-8">
      <Rv className="max-w-2xl mb-14">
        <Eyebrow num="06">Kurulum</Eyebrow>
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
              <p className="display text-4xl mb-5" style={{ color: 'var(--line-2)', fontWeight: 600 }}>0{i + 1}</p>
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
  <section className="py-24 sm:py-36" style={{ background: 'var(--paper-2)' }}>
    <div className="max-w-3xl mx-auto px-5 sm:px-8">
      <Rv className="mb-12">
        <Eyebrow num="07">Karşılaştırma</Eyebrow>
        <h2 className="display h2 mb-6">Aradaki fark nerede?</h2>
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
  <section id="v2-fiyat" className="py-24 sm:py-36">
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      <Rv className="max-w-2xl mb-14">
        <Eyebrow num="08">Fiyatlandırma</Eyebrow>
        <h2 className="display h2 mb-6">Soru hacminize göre seçin</h2>
        <p className="lede">Tüm planlar 15 gün ücretsiz deneme ile başlar. Kredi kartı gerekmez.</p>
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
              <p className="display text-3xl mb-1" style={{ fontWeight: 600 }}>{p.price}₺</p>
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
    <section id="v2-sss" className="py-24 sm:py-36" style={{ background: 'var(--paper-2)' }}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <Rv className="mb-12">
          <Eyebrow num="09">Sıkça sorulanlar</Eyebrow>
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
  <section className="band-ink py-24 sm:py-36 overflow-hidden">
    <span className="glow" style={{ width: 620, height: 620, bottom: -320, left: '50%', transform: 'translateX(-50%)' }} />
    <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
      <Rv>
        <h2 className="display h2 mb-7" style={{ color: 'var(--ink-text)' }}>
          Bu gece son kez<br />sorulara <span style={{ color: 'var(--ember-2)' }}>siz bakın.</span>
        </h2>
        <p className="lede mx-auto mb-10">Yarın sabah soru-cevap ekranınız temiz olsun. 15 gün ücretsiz, kredi kartı gerekmez.</p>
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
          <a href="/blog">Blog</a>
          <a href="/mesafeli-satis-sozlesmesi.html">Mesafeli Satış</a>
          <a href="/gizlilik-politikasi.html">Gizlilik</a>
          <a href="/iptal-iade-kosullari.html">İptal & İade</a>
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
  }, []);
  return (
    <div className="v2">
      <V2Styles />
      <V2Nav />
      <main>
        <V2Hero />
        <V2RealAnswers />
        <V2Sales />
        <V2Diff />
        <V2Listings />
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

export { V2Styles, V2Nav, V2Footer };
export default V2Page;
