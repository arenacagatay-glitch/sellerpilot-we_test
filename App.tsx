import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, CheckCircle, Mail,
  Smartphone, Check, Plane, X, Menu as MenuIcon, ShieldCheck, Store, Clock,
  MessageSquare, Sparkles, ArrowRight, Star, TrendingUp, Zap as ZapIcon,
  Camera, Image as ImageIcon, Wand2, Gauge,
  SlidersHorizontal, Ruler, BadgeCheck, HeartPulse, Minus, PackageCheck
} from 'lucide-react';
import { CHAT_EXAMPLES, FAQ_ITEMS, FEATURES, NAV_LINKS, STAT_CARDS, STEPS, WHATSAPP_URL, APP_URL } from './constants';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import V2Page from './LandingV2';

// ────────────────────────────────────────────────
// CSS animations injected once
// ────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @keyframes floatPhone   { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-18px)} }
    @keyframes floatA       { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-10px)} }
    @keyframes floatB       { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-13px)} }
    @keyframes floatC       { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-8px)}  }
    @keyframes fadeUp       { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn       { from{opacity:0} to{opacity:1} }
    @keyframes chatIn       { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes thinking     { 0%,100%{opacity:0} 20%,80%{opacity:1} }
    @keyframes chipIn       { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
    @keyframes scaleIn      { from{opacity:0;transform:scale(.9)} to{opacity:1;transform:scale(1)} }
    @keyframes slideIn      { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
    @keyframes slideOut     { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(-40px)} }
    @keyframes menuDown     { from{height:0;opacity:0} to{opacity:1} }
    @keyframes whatsappBounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
    @keyframes setSlideIn   { from{opacity:0;transform:translateX(56px) scale(.94)} to{opacity:1;transform:translateX(0) scale(1)} }

    .float-phone  { animation: floatPhone 5s ease-in-out infinite; }
    .float-a      { animation: floatA 4.5s ease-in-out infinite; }
    .float-b      { animation: floatB 5.5s ease-in-out infinite .6s; }
    .float-c      { animation: floatC 5s ease-in-out infinite 1.1s; }

    .hero-text    { animation: fadeUp .7s ease-out both; }
    .hero-phone   { animation: fadeUp .7s ease-out .15s both; }

    .chat-q       { animation: chatIn .5s ease-out .6s both; }
    .chat-think   { animation: thinking 1.2s ease-in-out 1.4s both; }
    .chat-a       { animation: chatIn .5s ease-out 2.7s both; }
    .chat-ok      { animation: scaleIn .4s ease-out 3.4s both; }

    .chip-a       { animation: chipIn .5s ease-out 3.8s both; }
    .chip-b       { animation: chipIn .5s ease-out 4.3s both; }
    .chip-c       { animation: chipIn .5s ease-out 4.8s both; }

    .reveal       { opacity:0; transform:translateY(28px); transition: opacity .6s ease-out, transform .6s ease-out; }
    .reveal.visible { opacity:1; transform:translateY(0); }

    .card-hover   { transition: transform .25s ease, box-shadow .25s ease; }
    .card-hover:hover { transform:translateY(-7px); }

    .wa-float     { animation: whatsappBounce 2s ease-in-out infinite; }
    .slide-enter  { animation: slideIn .4s ease-out both; }
    .slide-exit   { animation: slideOut .4s ease-out both; }

    .grad-text    { background: linear-gradient(90deg,#FF6B35,#FF9A3C,#FFBE5C); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

    @keyframes showcaseScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    .showcase-track { display:flex; gap:1.25rem; width:max-content; animation: showcaseScroll 45s linear infinite; }
    .showcase-track:hover { animation-play-state: paused; }
    .showcase-stage { perspective: 1200px; }
    .showcase-card { transform: rotateY(-8deg) rotateX(2deg); transition: transform .35s ease, box-shadow .35s ease; }
    .showcase-card:hover { transform: rotateY(0deg) rotateX(0deg) scale(1.05); box-shadow: 0 20px 50px rgba(255,107,53,.25); }
    .glow-blob    { pointer-events:none; position:absolute; border-radius:9999px; filter:blur(130px); }
  `}</style>
);

// ────────────────────────────────────────────────
// Hook: scroll reveal
// ────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
};

// ────────────────────────────────────────────────
// Header
// ────────────────────────────────────────────────
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const dark = !isScrolled && !menuOpen;

  const { pathname } = useLocation();
  const onHome = pathname === '/';
  // Sayfa-farkında nav: Görsel Stüdyo ayrı sayfa (route); diğer çapa linkleri ana
  // sayfadaysak #anchor, değilsek /#anchor (ana sayfaya gidip kaydır).
  const navLinks = NAV_LINKS.map(l => {
    if (l.href === '#ai-studyo') return { ...l, href: '/gorsel-studyo', route: true };
    if (l.href.startsWith('/')) return { ...l, route: true };
    return { ...l, href: onHome ? l.href : `/${l.href}`, route: false };
  });

  return (
    <nav style={{ transition: 'all .3s' }} className={`fixed top-0 left-0 right-0 z-50 ${dark ? 'bg-transparent py-5' : 'bg-white/90 backdrop-blur-xl shadow-md py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)', boxShadow: '0 4px 16px #FF6B3540' }}>
            <Plane className="w-5 h-5 text-white fill-white" />
          </div>
          <span className={`text-xl sm:text-2xl font-bold font-display ${dark ? 'text-white' : 'text-dark'}`}>SellerPilot</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map(l => {
            const cls = `font-medium transition-colors ${dark ? 'text-gray-300 hover:text-white' : 'text-dark-gray hover:text-primary'}`;
            return l.route
              ? <Link key={l.label} to={l.href} className={cls}>{l.label}</Link>
              : <a key={l.label} href={l.href} className={cls}>{l.label}</a>;
          })}
        </div>

        <div className="flex items-center gap-3">
          <a href={APP_URL} className="hidden sm:inline-block text-white font-semibold py-2.5 px-5 rounded-xl transition-all" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)', boxShadow: '0 4px 14px #FF6B3540' }}>
            Ücretsiz Dene
          </a>
          <button onClick={() => setMenuOpen(!menuOpen)} className={`lg:hidden p-2 rounded-lg ${dark ? 'text-white' : 'text-dark'}`} aria-label="Menü">
            {menuOpen ? <X size={26} /> : <MenuIcon size={26} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 overflow-hidden" style={{ animation: 'menuDown .25s ease-out' }}>
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map(l => (
              l.route
                ? <Link key={l.label} to={l.href} onClick={() => setMenuOpen(false)} className="py-3 text-dark font-medium border-b border-gray-50 last:border-0 hover:text-primary transition-colors">{l.label}</Link>
                : <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="py-3 text-dark font-medium border-b border-gray-50 last:border-0 hover:text-primary transition-colors">{l.label}</a>
            ))}
            <a href={APP_URL} className="mt-3 text-white text-center font-bold py-3.5 rounded-xl" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>30 Gün Ücretsiz Dene</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-2 bg-[#25D366] text-white text-center font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
              <Smartphone size={18} /> WhatsApp'tan Yazın
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

// ────────────────────────────────────────────────
// Hero phone mock
// ────────────────────────────────────────────────
const Moon4 = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

const HeroPhone = () => (
  <div className="bg-[#0d0d17] rounded-[2.5rem] border-[8px] border-[#1c1c28] overflow-hidden shadow-2xl relative flex flex-col ring-1 ring-white/10" style={{ height: 560, boxShadow: '0 40px 80px #FF6B3525' }}>
    <div className="bg-[#1c1c28] h-6 w-full absolute top-0 left-0 z-20 flex justify-center">
      <div className="w-24 h-4 bg-black rounded-b-xl"></div>
    </div>
    <div className="pt-8 px-5 flex justify-between items-center text-gray-500 text-[11px] font-medium">
      <span className="text-gray-300 font-bold">02:47</span>
      <span className="flex items-center gap-1"><Moon4 /> Sessiz mod</span>
    </div>
    <div className="px-5 mt-2"><p className="text-gray-500 text-[11px]">Siz şu an uyuyorsunuz 😴</p></div>

    <div className="flex-1 px-4 pt-4 flex flex-col gap-3 overflow-hidden">
      {/* Gelen soru */}
      <div className="chat-q bg-[#1d1d2e] text-gray-100 p-3.5 rounded-2xl rounded-tl-sm max-w-[88%] self-start border border-white/5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold text-orange-300">Yeni müşteri sorusu</span>
          <span className="text-[9px] text-gray-500">02:47</span>
        </div>
        <p className="text-[13px] leading-snug">Merhaba, bu serum hassas ciltte kullanılır mı? İçeriğinde parfüm var mı acaba?</p>
      </div>

      {/* Thinking */}
      <div className="chat-think self-end flex items-center gap-2 text-[10px] text-gray-400 pr-1">
        <Sparkles size={12} className="text-amber-400" /> SellerPilot ürün bilgilerinizi tarıyor…
      </div>

      {/* AI cevap */}
      <div className="chat-a self-end max-w-[88%] text-white p-3.5 rounded-2xl rounded-br-sm shadow-lg" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)', boxShadow: '0 8px 24px #FF6B3530' }}>
        <div className="flex items-center gap-1.5 mb-1.5 border-b border-white/20 pb-1.5">
          <div className="bg-white p-0.5 rounded-full"><Plane size={10} className="text-primary fill-primary" /></div>
          <span className="text-[10px] font-bold text-white/90">Mağazanız adına cevaplandı</span>
          <span className="text-[9px] text-white/70 ml-auto">02:47</span>
        </div>
        <p className="text-[13px] leading-snug text-white/95">Merhabalar, serumumuz parfüm içermez ve hassas ciltler için uygundur. Dermatolojik olarak test edilmiştir. Keyifli alışverişler dileriz 😊</p>
      </div>

      {/* OK chip */}
      <div className="chat-ok self-center mt-1 bg-green-500/15 border border-green-400/30 text-green-400 text-[11px] font-bold px-4 py-2 rounded-full flex items-center gap-2">
        <CheckCircle size={14} /> Cevaplama süresi: saniyeler
      </div>
    </div>

    <div className="px-5 pb-6 pt-3">
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-2.5">
        <Mail size={15} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-[11px] text-gray-400 leading-snug">Emin olamadığı soruyu cevaplamaz — sabah e-postanızda hazır bekler.</p>
      </div>
    </div>
  </div>
);

// Floating glass chip
const Chip = ({ children, className = '', floatClass = 'float-a', chipClass = 'chip-a' }: { children: React.ReactNode; className?: string; floatClass?: string; chipClass?: string }) => (
  <div className={`absolute z-20 ${className} ${chipClass}`}>
    <div className={`${floatClass} bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-2.5`}>
      {children}
    </div>
  </div>
);

// ────────────────────────────────────────────────
// Hero
// ────────────────────────────────────────────────
const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden" style={{ background: '#0a0a13' }}>
    {/* Glows */}
    <div className="glow-blob w-[600px] h-[600px] top-[-20%] left-[5%] opacity-20" style={{ background: '#FF6B35' }}></div>
    <div className="glow-blob w-[500px] h-[500px] bottom-[-30%] right-[0%] opacity-15" style={{ background: '#FFBE5C' }}></div>
    {/* Grid */}
    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)', backgroundSize: '56px 56px' }}></div>
    <div className="absolute bottom-0 left-0 right-0 h-40" style={{ background: 'linear-gradient(to top,#0a0a13,transparent)' }}></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-10">

        {/* Left text */}
        <div className="hero-text flex-1 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 bg-white/5 border border-white/15 text-amber-300 text-sm font-semibold rounded-full mb-7">
            <Store size={15} /> Bir Trendyol satıcısı tarafından geliştirildi
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-display font-bold leading-[1.12] text-white mb-6">
            Trendyol'da müşteri sorularını{' '}
            <span className="grad-text">siz değil, yapay zekânız</span>{' '}
            cevaplasın.
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-9 max-w-2xl mx-auto lg:mx-0">
            SellerPilot mağazanıza bağlanır, gelen her soruyu ürün bilgilerinize göre saniyeler içinde yanıtlar.
            Müşteri başka bir ürün ararsa kataloğunuzdan önerir, kampanyanızı hatırlatır.
            Emin olamadığı soruyu cevaplamaz — e-posta ile size bildirir.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1fb355] text-white text-lg font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-colors"
              style={{ boxShadow: '0 8px 24px #25D36640' }}>
              <Smartphone size={22} /> WhatsApp'tan Yazın
            </a>
            <a href={APP_URL}
              className="w-full sm:w-auto border border-white/20 hover:border-amber-300/60 bg-white/5 hover:bg-white/10 text-white text-lg font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all">
              30 Gün Ücretsiz Dene <ArrowRight size={20} />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-gray-400 text-sm">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Kredi kartı gerekmez</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> API bilgilerinizi girin, anında aktif</span>
          </div>
        </div>

        {/* Right phone */}
        <div className="hero-phone flex-1 relative w-full max-w-[320px] sm:max-w-[360px]">
          <div className="float-phone relative z-10">
            <HeroPhone />
          </div>

          {/* Floating chips */}
          <Chip className="-left-6 sm:-left-20 top-16" floatClass="float-a" chipClass="chip-a">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center"><CheckCircle size={16} className="text-green-400" /></div>
            <div><p className="text-[10px] text-gray-300">Soru cevaplandı</p><p className="text-xs font-bold text-white">15 saniyede ⚡</p></div>
          </Chip>

          <Chip className="-right-4 sm:-right-16 top-1/3" floatClass="float-b" chipClass="chip-b">
            <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center"><Star size={15} className="text-amber-400 fill-amber-400" /></div>
            <div><p className="text-[10px] text-gray-300">Mağaza puanı</p><p className="text-xs font-bold text-white">9.4 ↗</p></div>
          </Chip>

          <Chip className="-left-2 sm:-left-14 bottom-20" floatClass="float-c" chipClass="chip-c">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"><TrendingUp size={15} className="text-orange-400" /></div>
            <div><p className="text-[10px] text-gray-300">Soru → satışa döndü</p><p className="text-xs font-bold text-white">+1 sipariş 🛍️</p></div>
          </Chip>

          {/* Glow behind phone */}
          <div className="glow-blob w-[130%] h-[110%] top-1/2 left-1/2 -z-10 opacity-30" style={{ transform: 'translate(-50%,-50%)', background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}></div>
        </div>
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Stat bar
// ────────────────────────────────────────────────
const StatBar = () => {
  const stats = [
    { value: 'Saniyeler', label: 'içinde otomatik cevap', icon: ZapIcon },
    { value: '7/24', label: 'gece, hafta sonu, bayram', icon: Clock },
    { value: '%0', label: 'tahmine dayalı cevap riski', icon: ShieldCheck },
    { value: 'E-posta', label: 'ile zor sorular size düşer', icon: Mail },
  ];
  return (
    <section className="relative z-20 pb-4" style={{ background: '#0a0a13' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 rounded-3xl p-6 sm:p-8 border border-white/10" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <Icon className="w-5 h-5 text-amber-400" />
                  <p className="text-2xl sm:text-3xl font-display font-bold text-white">{s.value}</p>
                  <p className="text-xs sm:text-sm text-gray-400">{s.label}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
      <div className="h-16" style={{ background: 'linear-gradient(to bottom,#0a0a13,#fff)' }}></div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Founder strip
// ────────────────────────────────────────────────
const FounderStrip = () => (
  <section className="py-20 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal>
        <div className="rounded-3xl p-[2px]" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C,#FFE0C2)' }}>
          <div className="bg-white rounded-3xl px-8 py-10 sm:px-12 flex flex-col md:flex-row items-center gap-8">
            <div className="shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl rotate-3" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)', boxShadow: '0 8px 24px #FF6B3530' }}>
              <Store className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xl sm:text-2xl font-display font-bold text-dark leading-snug mb-3">
                "Ben de Trendyol satıcısıyım. Gece yarısı gelen sorulara yetişmenin nasıl bir şey olduğunu bilirim."
              </p>
              <p className="text-dark-gray leading-relaxed">
                SellerPilot'u önce kendi mağazalarım için yaptım — bugün kendi mağazalarımda her gün canlı çalışıyor. Bu site üzerindeki örnekler kurgu değil, sistemin gerçekten verdiği cevaplardır.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Why cards
// ────────────────────────────────────────────────
const SocialProof = () => {
  const icons = [Clock, MessageSquare, ShieldCheck];
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <span className="inline-block py-1 px-3 bg-orange-50 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-orange-100">Neden SellerPilot?</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark max-w-3xl mx-auto leading-tight">
            Soru-cevap ekranına bakmak zorunda olmadığınız bir mağaza düşünün
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8">
          {STAT_CARDS.map((card, i) => {
            const Icon = icons[i] || Clock;
            return (
              <Reveal key={card.id} delay={i * 0.1}>
                <div className="card-hover h-full bg-gradient-to-b from-orange-50/80 to-white rounded-3xl p-8 border border-orange-100 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md border border-orange-100">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <span className="text-3xl">{card.iconLabel}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-display text-dark mb-3">{card.title}</h3>
                  <p className="text-dark-gray leading-relaxed">{card.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Live examples (#examples)
// ────────────────────────────────────────────────
const LiveDemo = () => {
  const [idx, setIdx] = useState(0);
  const [anim, setAnim] = useState<'enter' | 'exit' | ''>('enter');

  const go = (next: number) => {
    setAnim('exit');
    setTimeout(() => { setIdx(next); setAnim('enter'); }, 380);
  };

  useEffect(() => {
    const t = setInterval(() => go((idx + 1) % CHAT_EXAMPLES.length), 8000);
    return () => clearInterval(t);
  }, [idx]);

  const ex = CHAT_EXAMPLES[idx];

  return (
    <section id="examples" className="py-24 overflow-hidden relative" style={{ background: '#0a0a13' }}>
      <div className="glow-blob w-[500px] h-[400px] top-0 left-1/3 opacity-10" style={{ background: '#FF6B35' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal className="text-center mb-12">
          <span className="inline-block py-1 px-3 bg-white/5 text-amber-300 text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-white/15">Gerçek Örnekler</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">Kurgu değil — sistemin verdiği gerçek cevaplar</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Aşağıdaki sorular Trendyol'da müşteriler tarafından gerçekten soruldu ve SellerPilot tarafından otomatik cevaplandı.</p>
        </Reveal>

        <div className="relative max-w-4xl mx-auto">
          <button onClick={() => go((idx - 1 + CHAT_EXAMPLES.length) % CHAT_EXAMPLES.length)} aria-label="Önceki" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-16 bg-white/10 border border-white/15 p-3 rounded-full text-white hover:bg-white/20 z-20 transition-colors"><ChevronLeft size={24} /></button>
          <button onClick={() => go((idx + 1) % CHAT_EXAMPLES.length)} aria-label="Sonraki" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-16 bg-white/10 border border-white/15 p-3 rounded-full text-white hover:bg-white/20 z-20 transition-colors"><ChevronRight size={24} /></button>

          <div className="overflow-hidden px-4">
            <div key={idx} className={anim === 'enter' ? 'slide-enter' : 'slide-exit'}>
              <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/10">
                <div className="mb-4 text-center">
                  <span className="text-xs font-bold text-primary bg-orange-50 px-2 py-1 rounded tracking-widest uppercase">{ex.category}</span>
                </div>
                <div className="flex justify-end mb-6">
                  <div className="max-w-[85%] sm:max-w-[70%]">
                    <div className="bg-[#F5F5F5] rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-2xl p-5 text-dark">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-[10px] text-gray-600 font-bold">U</div>
                        <span className="text-xs font-bold text-gray-500">{ex.customerName}</span>
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed">{ex.question}</p>
                    </div>
                    <p className="text-right text-[10px] text-gray-400 mt-1">{ex.customerName} tarafından {ex.date} tarihinde soruldu.</p>
                  </div>
                </div>
                <div className="flex justify-start mb-8">
                  <div className="max-w-[90%] sm:max-w-[80%]">
                    <div className="text-white p-5 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm shadow-lg" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>
                      <div className="flex items-center gap-2 mb-3 border-b border-white/20 pb-2">
                        <div className="bg-white p-1 rounded-full"><Plane size={14} className="text-primary fill-primary" /></div>
                        <span className="text-xs font-bold text-white/90">SellerPilot</span>
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed text-white/95">{ex.answer}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Değerli İş Ortağımız, {ex.date} tarihli cevabınız müşteriye iletilmiştir.</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-500/20">
                    <CheckCircle size={18} /> Cevaplama Süresi: Aynı Dakika
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {CHAT_EXAMPLES.map((_, i) => (
              <button key={i} aria-label={`Örnek ${i+1}`} onClick={() => go(i)}
                className="h-2.5 rounded-full transition-all"
                style={{ width: i === idx ? 32 : 10, background: i === idx ? '#FF6B35' : 'rgba(255,255,255,0.25)' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// AI Görsel Stüdyo (#ai-studyo)
// ────────────────────────────────────────────────
const STUDYO_SHOTS = [
  { src: '/studyo/sets/vucutsprey/1.jpg', tag: 'Vitrin' },
  { src: '/studyo/sets/vucutsprey/5.jpg', tag: 'Yaşam Alanı' },
  { src: '/studyo/sets/vucutsprey/4.jpg', tag: 'Koku Notları' },
  { src: '/studyo/sets/vucutsprey/6.jpg', tag: 'Yakın Detay' },
  { src: '/studyo/sets/vucutsprey/2.jpg', tag: 'Kullanıcı Karesi' },
  { src: '/studyo/sets/vucutsprey/3.jpg', tag: 'Kullanım Şekli' },
];

// Her kategori: 1 gerçek referans fotoğrafı + tıklayınca açılan 6 üretilmiş görsel
// (worker doğrulamasından tüm slotları geçen setler; dosyalar public/studyo/sets/<dir>/)
const STUDYO_SETS = [
  { label: 'Vücut Spreyi', dir: '/studyo/sets/vucutsprey' },
  { label: 'Giyim', dir: '/studyo/sets/takim' },
  { label: 'Züccaciye', dir: '/studyo/sets/bardak' },
  { label: 'Gıda', dir: '/studyo/sets/recel' },
];

const CategoryShowcase = () => {
  const [openSet, setOpenSet] = useState<(typeof STUDYO_SETS)[number] | null>(null);

  useEffect(() => {
    if (!openSet) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenSet(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [openSet]);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {STUDYO_SETS.map((g) => (
          <button
            key={g.label}
            onClick={() => setOpenSet(g)}
            className="card-hover group text-left bg-white rounded-3xl border border-gray-200 overflow-hidden hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-500/10"
          >
            <div className="relative">
              <img src={`${g.dir}/1.jpg`} alt={`${g.label} — SellerPilot ile üretilen görsel`} loading="lazy" className="w-full object-cover aspect-[3/4] transition-transform duration-300 group-hover:scale-[1.03]" />
              <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-white px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>
                <Sparkles size={11} /> SellerPilot üretti
              </span>
              <div className="absolute inset-x-0 bottom-0 p-3 pt-10 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between">
                <span className="text-white text-sm font-bold font-display drop-shadow">{g.label}</span>
                <span className="text-[11px] font-bold text-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>
                  <Sparkles size={11} /> 6 fotoğrafı gör
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Portal şart: Reveal'ın transform'u fixed konumlandırmayı kırıyor (transformed ancestor) */}
      {/* Premium koyu vitrin: referans solda sabit, üretilen 6 görsel yana doğru akan film şeridi */}
      {openSet && createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={() => setOpenSet(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div
            className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl border border-white/10"
            style={{ background: 'radial-gradient(1200px 500px at 85% -10%, rgba(255,107,53,0.16), transparent 60%), #0A0C11' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 px-5 sm:px-8 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur rounded-t-3xl" style={{ background: 'rgba(10,12,17,0.85)' }}>
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold font-display text-white">{openSet.label}</p>
                  <p className="text-xs text-gray-400">1 referans fotoğraftan, e-ticarete hazır 6 görsel</p>
                </div>
              </div>
              <button onClick={() => setOpenSet(null)} className="p-2 rounded-xl text-gray-300 hover:bg-white/10 transition-colors" aria-label="Kapat">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 sm:p-8">
              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                {/* Referans — satıcının yüklediği tek kare */}
                <div className="lg:w-[220px] shrink-0 flex lg:flex-col gap-3 items-start">
                  <div className="relative w-36 lg:w-full rounded-2xl overflow-hidden border-2 border-dashed border-white/25">
                    <img src={`${openSet.dir}/ref.jpg`} alt={`${openSet.label} — referans`} className="w-full aspect-[3/4] object-cover" />
                    <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-black/55 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Camera size={11} /> Referans görsel
                    </span>
                  </div>
                  <div className="text-sm text-gray-300 leading-relaxed lg:mt-1">
                    <p className="font-bold text-white mb-1">Sizin yüklediğiniz</p>
                    <p className="text-xs text-gray-400">Tek kare yetti. Sağdaki 6 görselin tamamı bu fotoğraftan üretildi.</p>
                    <span className="hidden lg:inline-flex items-center gap-1.5 mt-3 text-[11px] font-bold text-primary"><ArrowRight size={13} /> Kaydırarak inceleyin</span>
                  </div>
                </div>

                {/* Üretilen 6 görsel — yana doğru akan şerit */}
                <div className="flex-1 min-w-0">
                  <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]" style={{ scrollbarWidth: 'thin' }}>
                    {[1, 2, 3, 4, 5, 6].map((n, i) => (
                      <div key={n} className="relative shrink-0 w-56 sm:w-64 snap-start rounded-2xl overflow-hidden border border-white/10 shadow-xl group"
                        style={{ animation: `setSlideIn 0.5s ${0.06 * i}s cubic-bezier(0.22,1,0.36,1) both` }}>
                        <img src={`${openSet.dir}/${n}.jpg`} alt={`${openSet.label} — üretilen görsel ${n}`} loading="lazy" className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105" />
                        <span className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>
                          <Sparkles size={10} /> AI üretimi
                        </span>
                        <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">{n}/6</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

const STUDYO_PACKAGES = [
  {
    name: 'Vitrin', price: '249', img: '/studyo/paket-vitrin.jpg', popular: true,
    tagline: 'Dengeli, hızlı, en popüler. Günlük kullanım için ideal.',
    speed: 'Hızlı', quality: 'Yüksek kalite',
    features: ['1 vitrin + 5 varyant (6 görsel)', 'Yaşam alanı & kullanıcı kareleri', 'Öne çıkan fayda görselleri', 'Günlük listeleme için ideal'],
  },
  {
    name: 'Stüdyo', price: '349', img: '/studyo/paket-studyo.jpg', popular: false,
    tagline: 'Premium kalite. Etiket ve yazı sadakati en üst düzey.',
    speed: 'Standart', quality: 'Premium',
    features: ['1 vitrin + 5 varyant (6 görsel)', 'Etiket & yazı sadakati en üst düzey', 'En yüksek çözünürlük', 'Marka görseli hassasiyeti'],
  },
];

// En iyi gerçek üretim çıktıları (worker doğrulamasından tüm slotları geçen setlerin hero kareleri)
// Her üründen TEK kaliteli hero — ham/amatör kareler (boya, rulon, etiketli
// ayakkabı, ayran) marquee'den çıkarıldı (kullanıcı talebi 2026-07-23).
const SHOWCASE_IMAGES = [
  '/studyo/sets/vucutsprey/1.jpg', // vücut spreyi — mor premium hero
  '/showcase/showcase-11.jpg',     // parfüm Warrior
  '/studyo/sets/takim/1.jpg',      // giyim
  '/showcase/showcase-2.jpg',      // nevresim
  '/showcase/showcase-6.jpg',      // çanta
  '/showcase/showcase-8.jpg',      // yastık
  '/showcase/showcase-10.jpg',     // kulaklık
  '/showcase/showcase-9.jpg',      // lamba
  '/showcase/showcase-3.jpg',      // saat
  '/showcase/showcase-7.jpg',      // hoparlör
  '/studyo/sets/bardak/1.jpg',     // züccaciye
  '/studyo/sets/oyuncak/1.jpg',    // oyuncak
];

const ShowcaseMarquee = () => (
  <div className="showcase-stage relative mt-2 mb-14 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
    <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-white to-transparent" />
    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-white to-transparent" />
    <div className="showcase-track py-4">
      {[...SHOWCASE_IMAGES, ...SHOWCASE_IMAGES].map((src, i) => (
        <div key={i} className="showcase-card relative shrink-0 w-44 sm:w-56 rounded-2xl overflow-hidden border border-orange-100 shadow-lg bg-white">
          <img src={src} alt="SellerPilot AI Görsel Stüdyo üretimi" loading="lazy" className="w-full aspect-[3/4] object-cover" />
          <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/45 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles size={10} /> AI üretimi
          </span>
        </div>
      ))}
    </div>
  </div>
);

// Kurulum videosu — sayfa hızını etkilememesi için video DOM'a ancak play'e
// basılınca eklenir (o ana kadar sadece ~58KB poster yüklenir).
const TUTORIAL_VIDEO_URL = 'https://xomqtedspgqnnavdssgl.supabase.co/storage/v1/object/public/ad-creatives/kurulum/kurulum-web-720p.mp4';
const TUTORIAL_POSTER_URL = 'https://xomqtedspgqnnavdssgl.supabase.co/storage/v1/object/public/ad-creatives/kurulum/kurulum-poster.jpg';

const TutorialVideo = () => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl" style={{ background: '#0A0C11', boxShadow: '0 30px 80px rgba(255,107,53,0.12), 0 20px 60px rgba(0,0,0,0.35)' }}>
      {playing ? (
        <video src={TUTORIAL_VIDEO_URL} poster={TUTORIAL_POSTER_URL} controls autoPlay playsInline className="w-full aspect-video" />
      ) : (
        <button onClick={() => setPlaying(true)} className="relative w-full aspect-video group text-left" aria-label="Kurulum videosunu oynat">
          <img src={TUTORIAL_POSTER_URL} alt="SellerPilot Görsel Stüdyo kurulum videosu" loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)', boxShadow: '0 12px 40px rgba(255,107,53,0.5)' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white" aria-hidden><path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.54-6.86a1.04 1.04 0 0 0 0-1.76L9.56 4.26A1.04 1.04 0 0 0 8 5.14Z"/></svg>
            </div>
          </div>
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
            <span className="text-white text-sm font-bold drop-shadow flex items-center gap-2"><Wand2 size={15} /> Kurulumdan ilk görsele — adım adım</span>
            <span className="text-[11px] font-bold text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">90 saniye</span>
          </div>
        </button>
      )}
    </div>
  );
};

// Kurucu mesajı — birebir, satıcıdan satıcıya
const FounderNote = () => (
  <div className="relative max-w-3xl mx-auto rounded-3xl px-6 sm:px-10 py-8 sm:py-10 text-center overflow-hidden" style={{ background: 'radial-gradient(900px 400px at 80% -20%, rgba(255,107,53,0.18), transparent 60%), #0A0C11' }}>
    <div className="inline-flex items-center gap-2 mb-4">
      <div className="p-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>
        <Plane className="w-4 h-4 text-white fill-white" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-primary">Neden yaptık?</span>
    </div>
    <p className="text-white text-lg sm:text-xl leading-relaxed font-medium">
      "6 yıllık Trendyol satıcısı olarak fotoğrafların ve verdiği mesajın satışları ne derece arttırdığını kendi
      mağazamdan gördüm. Artık fotoğraf ve video ajanslarının kaprisini çekme derdi yok.{' '}
      <span className="grad-text font-bold">En iyi kaliteyi, en hızlı şekilde alıp en hızlı şekilde satışa başlamak var.</span>"
    </p>
    <p className="text-gray-400 text-sm mt-4">— SellerPilot kurucusu · 6 yıldır aktif Trendyol satıcısı</p>
  </div>
);

// Görsel Stüdyo sayfası hero'su (koyu, reklam mesaj-eşleşmeli)
const GorselStudyoHero = () => (
  <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: 'radial-gradient(1200px 500px at 80% -10%, rgba(255,107,53,0.18), transparent 60%), #0A0C11' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-white/5 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-5 border border-white/10">
        <Sparkles size={13} /> AI Görsel Stüdyo
      </span>
      <h1 className="text-4xl sm:text-6xl font-display font-black text-white mb-5 leading-tight max-w-4xl mx-auto">
        Tek fotoğraf. <span className="grad-text">6 profesyonel görsel.</span>
      </h1>
      <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-lg mb-8">
        Telefonla çektiğiniz sıradan bir ürün karesini, saniyeler içinde Trendyol'a hazır 6 profesyonel görsele dönüştürün. Fotoğraf stüdyosu, model, dekor derdi yok.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href={APP_URL} className="w-full sm:w-auto text-white text-base font-bold py-3.5 px-7 rounded-2xl flex items-center justify-center gap-2.5 transition-all" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)', boxShadow: '0 8px 24px #FF6B3540' }}>
          <Camera size={20} /> Hemen Dene — Fotoğrafını Yükle
        </a>
        <a href="#studyo-fiyat" className="w-full sm:w-auto text-white text-base font-bold py-3.5 px-7 rounded-2xl flex items-center justify-center gap-2.5 border border-white/15 hover:bg-white/5 transition-colors">
          Fiyatları Gör <ArrowRight size={18} />
        </a>
      </div>
      <p className="text-gray-500 text-xs mt-4">API bağlamak zorunda değilsiniz — hesap açın, fotoğrafınızı yükleyin, deneyin.</p>
    </div>
  </section>
);

// İki kullanım yolu: API'siz hızlı deneme vs Trendyol'u bağla (toplu)
const GorselStudyoIkiYol = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center mb-12">
        <span className="inline-block py-1 px-3 bg-orange-50 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-orange-100">İki Kullanım Yolu</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-3">Denemek mi istiyorsunuz, mağazayı bağlamak mı?</h2>
        <p className="text-dark-gray max-w-2xl mx-auto">İkisi de var. API bağlamadan tek fotoğrafla deneyin; beğenirseniz Trendyol'u bağlayıp tüm mağazanızda kullanın.</p>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-6 items-stretch max-w-5xl mx-auto">
        <Reveal className="h-full">
          <div className="h-full rounded-3xl p-7 flex flex-col gap-4 border border-gray-200 bg-white shadow-sm card-hover hover:shadow-xl hover:border-orange-200">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">API bağlamadan · hemen</span>
              <p className="text-lg font-bold font-display text-dark mt-1">Fotoğraf Yükle — Hızlı Deneme</p>
            </div>
            <p className="text-sm text-dark-gray leading-relaxed">"Önce bir göreyim" diyenler için. Trendyol API'sine, entegrasyona, hiçbir kuruluma gerek yok:</p>
            <ul className="flex flex-col gap-2.5">
              {['Ücretsiz SellerPilot hesabı oluşturun', 'Görsel Oluşturucu\'ya gelin, referans fotoğrafınızı yükleyin', '6 e-ticarete hazır görselinizi indirin'].map((s, i) => (
                <li key={s} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
            <a href={APP_URL} className="mt-auto py-3 rounded-xl text-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>Hesap Aç, Hemen Dene</a>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="h-full">
          <div className="h-full rounded-3xl p-7 flex flex-col gap-4 border border-gray-200 bg-white shadow-sm card-hover hover:shadow-xl hover:border-orange-200">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Mağazanız için · toplu</span>
              <p className="text-lg font-bold font-display text-dark mt-1">Trendyol'u Bağla — Tam Güç</p>
            </div>
            <p className="text-sm text-dark-gray leading-relaxed">Mağazasını büyütenler için. API'nizi bir kez bağlayın (5 dakika, videoda adım adım):</p>
            <ul className="flex flex-col gap-2.5">
              {['Tüm ürünleriniz otomatik listelenir', 'Ürünün kendi fotoğraflarından referans seçin, 6 görsel üretin', 'Beğendiklerinizi sıralayıp TEK TIKLA Trendyol\'a gönderin'].map((s, i) => (
                <li key={s} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
            <a href="#studyo-video" className="mt-auto py-3 rounded-xl text-center text-sm font-bold border border-gray-300 text-dark hover:bg-orange-50 hover:border-orange-200 transition-colors">Kurulum Videosunu İzle</a>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

// Ana sayfada Görsel Stüdyo teaser'ı (dev bölüm yerine ince kart → dedicated sayfa)
const GorselStudyoTeaser = () => (
  <section className="py-20 bg-gradient-to-b from-white to-light overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative rounded-3xl overflow-hidden border border-white/10 p-8 sm:p-12" style={{ background: 'radial-gradient(900px 400px at 85% -20%, rgba(255,107,53,0.18), transparent 60%), #0A0C11' }}>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:flex-1 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-white/5 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-white/10">
                <Sparkles size={13} /> Yeni · AI Görsel Stüdyo
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3 leading-tight">
                Tek fotoğraf → <span className="grad-text">6 profesyonel görsel</span>
              </h2>
              <p className="text-gray-300 mb-6 max-w-xl leading-relaxed">
                Ürün fotoğraflarınızı da SellerPilot üretsin. Telefonla çektiğiniz sıradan bir kareden, Trendyol'a hazır 6 profesyonel görsel — stüdyo, model, dekor derdi olmadan.
              </p>
              <Link to="/gorsel-studyo" className="inline-flex items-center gap-2 text-white font-bold py-3 px-6 rounded-2xl transition-all" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)', boxShadow: '0 8px 24px #FF6B3540' }}>
                Görsel Stüdyo'yu İncele <ArrowRight size={18} />
              </Link>
            </div>
            <div className="lg:w-[42%] grid grid-cols-3 gap-2">
              {['/studyo/sets/vucutsprey/1.jpg', '/studyo/sets/takim/1.jpg', '/showcase/showcase-11.jpg', '/studyo/sets/vucutsprey/5.jpg', '/studyo/sets/bardak/1.jpg', '/studyo/sets/vucutsprey/4.jpg'].map((s, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-white/10">
                  <img src={s} alt="AI üretimi örnek görsel" loading="lazy" className="w-full aspect-[3/4] object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

const AIGorselStudyo = () => (
  <section id="ai-studyo" className="py-24 bg-gradient-to-b from-light to-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center mb-14">
        <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-orange-50 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-orange-100">
          <Sparkles size={13} /> Yeni · AI Görsel Stüdyo
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-4 max-w-3xl mx-auto leading-tight">
          Telefonla çektiğiniz fotoğraf, saniyeler içinde{' '}
          <span className="grad-text">satış getiren Trendyol görsellerine</span> dönüşsün
        </h2>
        <p className="text-dark-gray max-w-2xl mx-auto leading-relaxed">
          Tek bir ürün fotoğrafı yükleyin; yapay zekâ sizin için 1 vitrin görseli ve 5 profesyonel varyant üretsin.
          Fotoğraf stüdyosu, ışık, dekor derdi yok — sıradan bir kareden e-ticarete hazır 6 görsel.
        </p>
      </Reveal>

      {/* Kurulum videosu — tıkla-oynat (sayfa hızını etkilemez) */}
      <div id="studyo-video" className="scroll-mt-24" />
      <Reveal className="mb-14">
        <TutorialVideo />
      </Reveal>

      {/* Gerçek üretim vitrini — kayan 3D şerit */}
      <Reveal>
        <ShowcaseMarquee />
      </Reveal>

      {/* Before → After kanıt showcase */}
      <Reveal>
        <div className="bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-500/5 p-5 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
            {/* Referans */}
            <div className="lg:w-[30%] flex flex-col">
              <span className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-3">
                <Camera size={13} /> Sizin fotoğrafınız
              </span>
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex-1">
                <img src="/studyo/sets/vucutsprey/ref.jpg" alt="Referans ürün fotoğrafı" loading="lazy" className="w-full h-full object-cover aspect-[3/4]" />
              </div>
              <p className="text-xs text-gray-400 mt-3 leading-snug">Ürününüzün sade tek karesi — model, ışık, dekor derdi olmadan.</p>
            </div>

            {/* Ok / dönüşüm */}
            <div className="flex lg:flex-col items-center justify-center gap-3 shrink-0">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shrink-0" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)', boxShadow: '0 8px 24px #FF6B3540' }}>
                <Wand2 size={24} />
              </div>
              <ArrowRight className="text-primary rotate-90 lg:rotate-0" size={26} />
            </div>

            {/* Üretilen 6 görsel */}
            <div className="flex-1 flex flex-col">
              <span className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-primary bg-orange-50 px-3 py-1 rounded-full mb-3 border border-orange-100">
                <ImageIcon size={13} /> SellerPilot üretti — 6 profesyonel görsel
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
                {STUDYO_SHOTS.map((s, i) => (
                  <div key={i} className="relative rounded-2xl overflow-hidden border border-gray-200 group">
                    <img src={s.src} alt={`Üretilen görsel — ${s.tag}`} loading="lazy" className="w-full h-full object-cover aspect-[3/4] transition-transform duration-300 group-hover:scale-105" />
                    <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-black/45 backdrop-blur-sm px-2 py-0.5 rounded-full">{s.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Çeşitlilik galerisi */}
      <Reveal className="mt-16">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold font-display text-dark mb-2">Her kategoride çalışır</h3>
          <p className="text-dark-gray max-w-xl mx-auto">Tek referans fotoğrafa tıklayın — o kareden üretilen, e-ticarete hazır 6 görseli görün.</p>
        </div>
        <CategoryShowcase />
      </Reveal>

      {/* Kurucu mesajı */}
      <Reveal className="mt-16">
        <FounderNote />
      </Reveal>

      {/* Paketler / Fiyatlandırma */}
      <div id="studyo-fiyat" className="scroll-mt-24" />
      <Reveal className="mt-20">
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 bg-orange-50 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-orange-100">Fiyatlandırma</span>
          <h3 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-3">İhtiyacınıza göre seçin</h3>
          <p className="text-dark-gray max-w-xl mx-auto">Her pakette 1 vitrin + 5 varyant, toplam 6 profesyonel görsel. Fiyatlar sipariş başınadır.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-3xl mx-auto">
          {STUDYO_PACKAGES.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08} className="h-full">
              {p.popular ? (
                <div className="relative h-full rounded-3xl p-[2px]" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap z-10" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>★ En Popüler</span>
                  <div className="bg-white h-full rounded-3xl p-6 flex flex-col gap-4">
                    <div className="rounded-2xl overflow-hidden border border-orange-100">
                      <img src={p.img} alt={`${p.name} paketi örnek görsel`} loading="lazy" className="w-full object-cover aspect-[4/3]" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold font-display text-dark">{p.name}</p>
                      <div className="mt-1"><span className="text-4xl font-black grad-text">{p.price}₺</span><span className="text-gray-400 text-sm"> / sipariş</span></div>
                    </div>
                    <p className="text-sm text-center text-dark-gray leading-snug">{p.tagline}</p>
                    <div className="flex justify-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-orange-50 px-2.5 py-1 rounded-full"><Gauge size={12} /> {p.speed}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-orange-50 px-2.5 py-1 rounded-full"><Sparkles size={12} /> {p.quality}</span>
                    </div>
                    <ul className="flex flex-col gap-2 mt-1">
                      {p.features.map(f => <li key={f} className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />{f}</li>)}
                    </ul>
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-auto py-3 rounded-xl text-center text-sm font-bold text-white flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>
                      Hemen Dene <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="card-hover h-full rounded-3xl p-6 flex flex-col gap-4 border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-orange-200">
                  <div className="rounded-2xl overflow-hidden border border-gray-100">
                    <img src={p.img} alt={`${p.name} paketi örnek görsel`} loading="lazy" className="w-full object-cover aspect-[4/3]" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold font-display text-dark">{p.name}</p>
                    <div className="mt-1"><span className="text-4xl font-black text-dark">{p.price}₺</span><span className="text-gray-400 text-sm"> / sipariş</span></div>
                  </div>
                  <p className="text-sm text-center text-dark-gray leading-snug">{p.tagline}</p>
                  <div className="flex justify-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full"><Gauge size={12} /> {p.speed}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full"><Sparkles size={12} /> {p.quality}</span>
                  </div>
                  <ul className="flex flex-col gap-2 mt-1">
                    {p.features.map(f => <li key={f} className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />{f}</li>)}
                  </ul>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-auto py-3 rounded-xl text-center text-sm font-bold border border-gray-300 text-dark hover:bg-orange-50 hover:border-orange-200 transition-colors flex items-center justify-center gap-2">
                    Hemen Dene <ArrowRight size={16} />
                  </a>
                </div>
              )}
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1fb355] text-white text-base font-bold py-3.5 px-7 rounded-2xl flex items-center justify-center gap-2.5 transition-colors"
              style={{ boxShadow: '0 8px 24px #25D36640' }}>
              <Smartphone size={20} /> Hemen Dene
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto text-white text-base font-bold py-3.5 px-7 rounded-2xl flex items-center justify-center gap-2.5 transition-all"
              style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)', boxShadow: '0 8px 24px #FF6B3540' }}>
              <Camera size={20} /> Sipariş Ver <ArrowRight size={18} />
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4">Fotoğrafınızı WhatsApp'tan gönderin, görselleriniz hazırlanıp size iletilsin.</p>
        </div>
      </Reveal>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Upsell / Satış fırsatları (#upsell)
// ────────────────────────────────────────────────
const UpsellSection = () => (
  <section id="upsell" className="py-24 bg-gradient-to-b from-white to-light">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center gap-14">

        {/* Left: text */}
        <Reveal className="flex-1">
          <span className="inline-block py-1 px-3 bg-orange-50 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-orange-100">Satış Fırsatları</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-5 leading-tight">
            Cevaplamakla kalmaz, <span className="grad-text">kaçacak satışı yakalar</span>
          </h2>
          <p className="text-dark-gray leading-relaxed mb-8">
            Müşteri baktığı üründe olmayan bir şeyi sorduğunda çoğu mağaza o satışı kaybeder.
            SellerPilot kataloğunuzu tanır: sorulan ürünü gerçek bilgileriyle cevaplar,
            uygunsa stokta olan doğru ürünü önerir ve tanımladığınız kampanyayı doğal bir dille hatırlatır.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <p className="text-dark-gray"><span className="font-semibold text-dark">Sadece gerçek ürünler.</span> Önerdiği her ürün kataloğunuzla doğrulanır — listede olmayan ürünü, stokta olmayanı öneremez.</p>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <p className="text-dark-gray"><span className="font-semibold text-dark">Kampanyayı siz tanımlarsınız.</span> Tanımlı kampanya yoksa indirim ya da avantaj uydurmaz.</p>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <p className="text-dark-gray"><span className="font-semibold text-dark">Yeri geldiğinde susar.</span> İade, şikâyet, kargo sorunu gibi konularda satış önerisi hiç devreye girmez — önce müşterinin konusu çözülür.</p>
            </li>
          </ul>
        </Reveal>

        {/* Right: chat mock */}
        <Reveal delay={0.15} className="flex-1 w-full max-w-xl">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-orange-100">
            <div className="mb-4 text-center">
              <span className="text-xs font-bold text-primary bg-orange-50 px-2 py-1 rounded tracking-widest uppercase">Aksesuar — Çapraz Satış</span>
            </div>
            <div className="flex justify-end mb-5">
              <div className="bg-[#F5F5F5] rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-2xl p-4 text-dark max-w-[85%]">
                <p className="text-sm leading-relaxed">Merhaba, bu cüzdanla uyumlu bir kemeriniz var mı? Takım yapmak istiyorum.</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="text-white p-4 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm shadow-lg max-w-[92%]" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>
                <div className="flex items-center gap-2 mb-2 border-b border-white/20 pb-2">
                  <div className="bg-white p-1 rounded-full"><Plane size={12} className="text-primary fill-primary" /></div>
                  <span className="text-[11px] font-bold text-white/90">Mağazanız adına cevaplandı</span>
                </div>
                <p className="text-sm leading-relaxed text-white/95">
                  Merhaba! Cüzdanınızla çok şık bir takım olacak Erkek Takım Elbise Deri İnce Kemer'imiz stokta mevcut.
                  Bu ay cüzdan + kemer birlikte alımlarda ikinci üründe %20 indirimimiz de geçerli.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-center">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-4 py-2 rounded-full">
                <TrendingUp size={14} /> Kaybolacak soru → yeni satış fırsatı
              </div>
            </div>
            <p className="mt-4 text-center text-[11px] text-gray-400">Önerilen ürün ve kampanya, mağazanın kendi kataloğundan ve tanımladığı kampanyadan geliyor.</p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Why different (#fark) — premium bento kartlar
// ────────────────────────────────────────────────
const DiffCard = ({ icon: Icon, title, children, mock, wide = false, full = false }: any) => (
  <Reveal className={full ? 'lg:col-span-6' : wide ? 'lg:col-span-3' : 'lg:col-span-2'}>
    <div className="card-hover h-full bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-orange-200 p-7 sm:p-9 flex flex-col">
      <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-6">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-xl sm:text-2xl font-display font-bold text-dark mb-3 leading-snug">{title}</h3>
      <p className="text-dark-gray leading-relaxed mb-7">{children}</p>
      <div className="mt-auto bg-light rounded-2xl p-5">{mock}</div>
    </div>
  </Reveal>
);

const WhyDifferent = () => (
  <section id="fark" className="py-24 bg-gradient-to-b from-light to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center mb-14">
        <span className="inline-block py-1 px-3 bg-white text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-orange-100 shadow-sm">Farkımız</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-3">Otomatik cevap kolay. <span className="grad-text">Doğru cevap zor.</span></h2>
        <p className="text-dark-gray max-w-2xl mx-auto">Bir mağazayı yakan şey cevapsız soru değil, yanlış cevaptır. SellerPilot'ı satıcı olarak biz kurduk — bu yüzden neyi söylemeyeceğini de biliyor.</p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">

        <DiffCard
          icon={SlidersHorizontal}
          wide
          title="Kontrol tamamen sizde"
          mock={
            <div className="space-y-2.5">
              {[
                ['Otomatik', 'Sistem kendi cevaplar', false],
                ['Onaylı', 'Cevabı hazırlar, siz onaylarsınız', true],
                ['Kapalı', 'Sadece siz cevaplarsınız', false],
              ].map(([t, d, on]: any) => (
                <div key={t} className={`flex items-center gap-3 rounded-xl px-4 py-3 bg-white border ${on ? 'border-primary shadow-sm' : 'border-gray-200'}`}>
                  <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${on ? 'border-primary' : 'border-gray-300'}`}>
                    {on && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </span>
                  <span className="text-sm font-semibold text-dark">{t}</span>
                  <span className="text-xs text-gray-400">{d}</span>
                </div>
              ))}
            </div>
          }
        >
          İster tamamen size bıraksın, ister her cevabı hazırlayıp onayınıza sunsun, ister hiç karışmasın. Bir konuşmayı devraldığınızda sistem araya girmez.
        </DiffCard>

        <DiffCard
          icon={MessageSquare}
          wide
          title="Sizin ağzınızdan konuşur"
          mock={
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mağaza A — resmi ve imzalı (gerçek cevap)</p>
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-dark-gray">Merhaba efendim, ürünümüz tam kalıptır ancak ayağınız buçuklu veya taraklı ise 1 numara büyük sipariş oluşturmanızı tavsiye ederiz. Mutlu ve sağlıklı günler dilerim :) <span className="italic text-gray-400">mağaza adı</span> Müşteri Memnuniyeti Ekibi</div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-wider">Mağaza B — samimi ve kısa (gerçek cevap)</p>
              <div className="bg-white rounded-xl border border-orange-200 px-4 py-3 text-sm text-dark">Merhaba! Boy ve kilo ölçülerinize göre hazırladığımız beden tablomuza baktığımızda 60 beden tercih edebilirsiniz 😊</div>
            </div>
          }
        >
          Kendi yazdığınız cevapları okur; selamlamanızı, imzanızı, resmiyet düzeyinizi öğrenir. Yukarıdaki iki cevap aynı sistemden, iki gerçek mağazadan — her biri kendi sesiyle.
        </DiffCard>

        <DiffCard
          icon={PackageCheck}
          wide
          title="Kargonun yerini gidip bakar, söyler"
          mock={
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-dark-gray">Kargom nerede? 3 gün oldu.</div>
              <div className="rounded-xl px-4 py-3 text-sm text-white" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>
                Merhaba! 114•••0188 numaralı siparişinizi kontrol ettik: siparişiniz kargoya verildi, yolda (Kolay Gelsin Marketplace). Tahmini teslimat: 13 Temmuz - 16 Temmuz. 📦
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-400"><BadgeCheck size={13} className="text-green-500" /> Gerçek sorgu — durum, kargo firması ve tarih Trendyol'dan geldi</div>
            </div>
          }
        >
          Müşteri sipariş numarasını yazdığında sistem siparişi anında kontrol eder ve gerçek durumunu söyler. Numarayı vermediyse nazikçe ister.
        </DiffCard>

        <DiffCard
          icon={MessageSquare}
          wide
          title="Aynı müşteriyi hatırlar"
          mock={
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider"><Clock size={12} /> Dün</div>
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-dark-gray">Sipariş numaram 11405740188, ne zaman gelir?</div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-wider"><Clock size={12} /> Bugün</div>
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-dark-gray">Hâlâ gelmedi, ne olacak?</div>
              <div className="flex items-center gap-2 bg-white rounded-xl border border-orange-200 px-4 py-3">
                <Mail size={15} className="text-primary shrink-0" />
                <span className="text-sm text-dark">Numarası tekrar sorulmadı — konu size iletildi</span>
              </div>
            </div>
          }
        >
          Aynı müşteri ikinci kez yazdığında sıfırdan başlamaz. Önceki mesajlarını hatırlar, sipariş numarasını tekrar sormaz; konu çözülmediyse sizi devreye sokar.
        </DiffCard>

        <DiffCard
          icon={Ruler}
          wide
          title="Yanlış bedeni asla söylemez"
          mock={
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-dark-gray">170 boy 107 kg kaç beden olur</div>
              <div className="rounded-xl px-4 py-3 text-sm text-white" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>
                Merhaba! Boy ve kilo ölçülerinize göre hazırladığımız beden tablomuza baktığımızda 60 beden tercih edebilirsiniz 😊
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-400"><BadgeCheck size={13} className="text-green-500" /> Gerçek cevap · Tablo yoksa tahmin etmez, soruyu size iletir</div>
            </div>
          }
        >
          Ayakkabıda numara, pantolonda beden, çocuk giyimde yaş — her ürün kendi tablosuyla cevaplanır. Tablo yoksa kesin beden söylemez.
        </DiffCard>

        <DiffCard
          icon={ShieldCheck}
          wide
          title="Mağaza puanınızı korur"
          mock={
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {['Link', 'Telefon', 'E-posta', 'Dış kanal'].map(t => (
                  <span key={t} className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-500">
                    <X size={12} className="text-red-400" /> {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl border border-green-200 px-4 py-3">
                <BadgeCheck size={16} className="text-green-500 shrink-0" />
                <span className="text-sm text-dark">Cevap gönderilmeden önce kontrol edilir</span>
              </div>
            </div>
          }
        >
          Trendyol; cevaplarda link, telefon ve e-posta paylaşılmasını onaylamıyor. Sistem her cevabı gönderilmeden önce denetler, riskli olanı temizler.
        </DiffCard>

        <DiffCard
          icon={Mail}
          full
          title="Emin değilse size sorar"
          mock={
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm text-dark-gray">Cırt cırt pant geri söküldüğü zaman pencerenin beyaz bölümünde leke yapışkanlık iz bırakır mı</div>
              <div className="flex items-center gap-2 bg-white rounded-xl border border-orange-200 px-4 py-3">
                <Mail size={15} className="text-primary shrink-0" />
                <span className="text-sm text-dark">Soru size e-posta ile iletildi</span>
              </div>
              <p className="text-[11px] text-gray-400">Gerçek vaka: kalıntı riski yüzeye göre değiştiği için tahmin edilmedi. Sağlık ve ilaç soruları da her zaman size gelir.</p>
            </div>
          }
        >
          Bilmediği konuda tahmin yürütmez, "bilgim yok" da demez. Soru sessizce size düşer — müşteri yanlış bilgiyle karşılaşmaz.
        </DiffCard>

      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// How it works (#how-it-works)
// ────────────────────────────────────────────────
const HowItWorks = () => (
  <section id="how-it-works" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center mb-20">
        <span className="inline-block py-1 px-3 bg-orange-50 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-orange-100">Nasıl Çalışır?</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-3">Kurulum 5 dakika, gerisi otomatik</h2>
        <p className="text-dark-gray max-w-xl mx-auto">Teknik bilgi gerekmez. Trendyol satıcı panelinizden API bilgilerinizi alıp girmeniz yeterli.</p>
      </Reveal>
      <div className="relative">
        <div className="hidden lg:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-orange-200 -z-10"></div>
        <div className="grid lg:grid-cols-3 gap-12">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.id} delay={i * 0.15}>
                <div className="flex flex-col items-center text-center p-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8 border-4 border-white relative z-10" style={{ background: 'linear-gradient(135deg,#FFF4EE,#FFF9F0)', boxShadow: '0 8px 24px #FF6B3515' }}>
                    <Icon className="w-10 h-10 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 text-white rounded-full flex items-center justify-center font-bold font-display shadow-md" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>{step.id}</div>
                  </div>
                  <h3 className="text-xl font-bold font-display text-dark mb-4">{step.title}</h3>
                  <p className="text-dark-gray">{step.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Features (#features)
// ────────────────────────────────────────────────
const Features = () => (
  <section id="features" className="py-24 bg-gradient-to-b from-light to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center mb-16">
        <span className="inline-block py-1 px-3 bg-white text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-orange-100 shadow-sm">Özellikler</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark">Sıradan bir otomatik cevaplayıcı değil</h2>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <Reveal key={f.id} delay={(i % 3) * 0.1}>
              <div className="card-hover h-full bg-white p-8 rounded-3xl border border-gray-200 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-500/10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg,#FFF4EE,#FFF9F0)' }}>
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-display text-dark mb-4">{f.title}</h3>
                <p className="text-dark-gray leading-relaxed">{f.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Comparison (#karsilastirma)
// ────────────────────────────────────────────────
const COMPARE_ROWS: [string, boolean, boolean][] = [
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

const Comparison = () => (
  <section id="karsilastirma" className="py-24 bg-light">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center mb-12">
        <span className="inline-block py-1 px-3 bg-white text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-orange-100 shadow-sm">Karşılaştırma</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-3">Aradaki fark nerede?</h2>
        <p className="text-dark-gray">Piyasadaki çoğu araç soruyu kapatır. Biz soruyu satışa çevirip mağazanızı korumaya çalışıyoruz.</p>
      </Reveal>
      <Reveal>
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 sm:gap-x-8 px-5 sm:px-8 py-4 border-b border-gray-100 bg-gray-50/70">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Özellik</span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary text-center w-20 sm:w-28">SellerPilot</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 text-center w-20 sm:w-28">Sıradan bot</span>
          </div>
          {COMPARE_ROWS.map(([label, us, them], i) => (
            <div key={label} className={`grid grid-cols-[1fr_auto_auto] gap-x-4 sm:gap-x-8 items-center px-5 sm:px-8 py-3.5 ${i % 2 ? 'bg-gray-50/40' : ''}`}>
              <span className="text-sm text-dark">{label}</span>
              <span className="w-20 sm:w-28 flex justify-center">
                {us ? <Check className="w-5 h-5 text-green-500" /> : <Minus className="w-4 h-4 text-gray-300" />}
              </span>
              <span className="w-20 sm:w-28 flex justify-center">
                {them ? <Check className="w-5 h-5 text-gray-400" /> : <Minus className="w-4 h-4 text-gray-300" />}
              </span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">Karşılaştırma, ürünümüzde bugün canlı olarak çalışan özellikler üzerinden hazırlanmıştır.</p>
      </Reveal>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Pricing (#pricing)
// ────────────────────────────────────────────────
const PLANS = [
  { name: "Başlangıç Paketi", price: "1.299", perQ: "soru başı 12,99₺", features: ["100 Soru / Ay","1 Mağaza","Tüm özellikler dahil","Satış önerisi ve kampanya","Onay modu (cevabı siz onaylayın)","E-posta desteği"], popular: false },
  { name: "Küçük Esnaf Paketi", price: "2.999", perQ: "soru başı 10₺", features: ["300 Soru / Ay","1 Mağaza","Tüm özellikler dahil","Satış önerisi ve kampanya","Detaylı satış ve performans raporu","Öncelikli e-posta desteği"], popular: false },
  { name: "Büyüyen Marka Paketi", price: "8.999", perQ: "soru başı 9₺", features: ["1.000 Soru / Ay","3 Mağaza","Tüm özellikler dahil","Satış önerisi ve kampanya","Detaylı satış ve performans raporu","WhatsApp'tan öncelikli destek"], popular: true },
  { name: "Kurumsal Şirket Paketi", price: "19.999", perQ: "soru başı 6,67₺", features: ["3.000 Soru / Ay","Sınırsız Mağaza","Tüm özellikler dahil","Satış önerisi ve kampanya","Birebir kurulum ve ayar desteği","Telefonla öncelikli destek"], popular: false },
];

const Pricing = () => (
  <section id="pricing" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center mb-12">
        <span className="inline-block py-1 px-3 bg-orange-50 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-orange-100">Fiyatlandırma</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-3">Soru hacminize göre seçin</h2>
        <p className="text-dark-gray mb-1">Tüm planlar <strong className="text-dark">30 gün ücretsiz deneme</strong> ile başlar. Kredi kartı gerekmez.</p>
        <p className="text-sm text-gray-400">Sadece yapay zekânın cevapladığı sorular sayılır — size düşen ve sizin yazdığınız cevaplar kotanızdan düşmez.</p>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {PLANS.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.08} className="h-full">
            {plan.popular ? (
              <div className="relative h-full rounded-3xl p-[2px]" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap z-10" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>★ En Çok Tercih Edilen</span>
                <div className="bg-white h-full rounded-3xl p-6 flex flex-col gap-5">
                  <p className="text-center text-gray-500 text-sm font-semibold pt-2">{plan.name}</p>
                  <div className="text-center">
                    <span className="text-4xl font-black grad-text">{plan.price}₺</span>
                    <span className="text-gray-400 text-sm"> / aylık</span>
                    <p className="text-xs text-gray-400 mt-1">+ KDV · {plan.perQ}</p>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {plan.features.map(f => <li key={f} className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />{f}</li>)}
                  </ul>
                  <a href={APP_URL} className="mt-auto py-3 rounded-xl text-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>Ücretsiz Deneyin</a>
                </div>
              </div>
            ) : (
              <div className="card-hover relative h-full rounded-3xl p-6 flex flex-col gap-5 border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:border-orange-200">
                <p className="text-center text-gray-500 text-sm font-semibold pt-2">{plan.name}</p>
                <div className="text-center">
                  <span className="text-4xl font-black text-dark">{plan.price}₺</span>
                  <span className="text-gray-400 text-sm"> / aylık</span>
                  <p className="text-xs text-gray-400 mt-1">+ KDV · {plan.perQ}</p>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {plan.features.map(f => <li key={f} className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />{f}</li>)}
                </ul>
                <a href={APP_URL} className="mt-auto py-3 rounded-xl text-center text-sm font-bold border border-gray-300 text-dark hover:bg-orange-50 hover:border-orange-200 transition-colors">Ücretsiz Deneyin</a>
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// FAQ (#faq)
// ────────────────────────────────────────────────
const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  return (
    <section id="faq" className="py-24 bg-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <span className="inline-block py-1 px-3 bg-white text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-orange-100 shadow-sm">Sıkça Sorulan Sorular</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark">Merak Edilenler</h2>
        </Reveal>
        <Reveal>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl px-6 sm:px-10">
            {FAQ_ITEMS.map(item => (
              <div key={item.id} className="border-b border-gray-100 last:border-0">
                <button onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="w-full py-6 flex items-center justify-between text-left focus:outline-none gap-4 group">
                  <span className={`text-base sm:text-lg font-bold font-display transition-colors ${openId === item.id ? 'text-primary' : 'text-dark group-hover:text-primary'}`}>{item.question}</span>
                  <span className={`p-2 rounded-full shrink-0 transition-colors ${openId === item.id ? 'bg-orange-50 text-primary' : 'bg-gray-50 text-dark-gray'}`}>
                    {openId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                {openId === item.id && (
                  <div className="pb-8 text-dark-gray leading-relaxed pl-4 border-l-2 border-primary/30" style={{ animation: 'fadeUp .3s ease-out' }}>
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Final CTA
// ────────────────────────────────────────────────
const FinalCTA = () => (
  <section className="py-28 relative overflow-hidden" style={{ background: '#0a0a13' }}>
    <div className="glow-blob w-[700px] h-[500px] top-[-30%] left-1/2 opacity-20" style={{ transform: 'translateX(-50%)', background: '#FF6B35' }}></div>
    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)', backgroundSize: '56px 56px' }}></div>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <Reveal>
        <span className="inline-block py-1 px-3 bg-white/5 text-amber-300 text-xs font-bold uppercase tracking-wider rounded-full mb-6 border border-white/15">Hemen Başlayın</span>
        <h2 className="text-4xl sm:text-5xl font-display font-bold text-white mb-6 leading-tight">
          Bu gece son kez <span className="grad-text">sorulara siz bakın</span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Aklınıza takılan ne varsa WhatsApp'tan sorun — bir satıcı olarak ben cevaplıyorum. Ya da hemen kayıt olun, 30 gün ücretsiz deneyin.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1fb355] text-white text-lg font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-colors"
            style={{ boxShadow: '0 8px 24px #25D36640' }}>
            <Smartphone size={24} /> WhatsApp ile Soru Sor →
          </a>
          <a href={APP_URL}
            className="w-full sm:w-auto text-white text-lg font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all"
            style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)', boxShadow: '0 8px 24px #FF6B3540' }}>
            <Mail size={24} /> Hemen Ücretsiz Dene →
          </a>
        </div>
      </Reveal>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Footer
// ────────────────────────────────────────────────
const Footer = () => (
  <footer className="text-white py-16 border-t border-white/5" style={{ background: '#06060d' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>
              <Plane className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold font-display">SellerPilot</span>
          </div>
          <p className="text-gray-400 mb-6">Trendyol satıcıları için yapay zekâ destekli soru-cevap asistanı. Bir satıcı tarafından, satıcılar için geliştirildi.</p>
          <p className="text-sm text-gray-500">© 2026 SellerPilot. Tüm hakları saklıdır.</p>
          <p className="text-xs text-gray-600 mt-4 leading-relaxed">PURELYPRO BADGER KOZMETİK VE DANIŞMANLIK HİZMETLERİ TİCARET LİMİTED ŞİRKETİ<br/>Bahçelievler Mah. Talatpaşa Cad. Saray Apt. No: 43 İç Kapı No: 34, Bahçelievler / İstanbul<br/>Vergi Kimlik No: 7331258700 · MERSİS: 0733125870000001</p>
        </div>
        <div className="md:pl-12">
          <h4 className="text-lg font-bold font-display mb-6">Bağlantılar</h4>
          <ul className="space-y-4">
            {NAV_LINKS.map(l => <li key={l.label}><a href={l.href} className="text-gray-400 hover:text-amber-300 transition-colors">{l.label}</a></li>)}
            <li><a href={APP_URL} className="text-gray-400 hover:text-amber-300 transition-colors">Ücretsiz Dene</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold font-display mb-6">İletişim</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center gap-3"><Mail size={18} className="text-primary" /><span>info@sellerpilot.cloud</span></li>
            <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors"><Smartphone size={18} className="text-primary" /><span>+90 530 621 61 39</span></a></li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
            <a href="/mesafeli-satis-sozlesmesi.html" className="hover:text-white transition-colors">Mesafeli Satış Sözleşmesi</a>
            <a href="/on-bilgilendirme-formu.html" className="hover:text-white transition-colors">Ön Bilgilendirme Formu</a>
            <a href="/gizlilik-politikasi.html" className="hover:text-white transition-colors">Gizlilik ve Güvenlik</a>
            <a href="/iptal-iade-kosullari.html" className="hover:text-white transition-colors">İptal ve İade</a>
            <a href="/teslimat-ve-ifa.html" className="hover:text-white transition-colors">Teslimat ve İfa</a>
            <a href="/cerez-politikasi.html" className="hover:text-white transition-colors">Çerez Politikası</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// ────────────────────────────────────────────────
// Floating WhatsApp
// ────────────────────────────────────────────────
const FloatingWhatsApp = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  if (!visible) return null;
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
      className="wa-float fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1fb355] text-white p-4 rounded-full flex items-center gap-2 transition-colors"
      style={{ boxShadow: '0 8px 32px #25D36650' }}>
      <Smartphone size={26} />
      <span className="hidden sm:inline font-bold pr-1">WhatsApp</span>
    </a>
  );
};

// ────────────────────────────────────────────────
// App
// ────────────────────────────────────────────────
// Rota değişiminde en üste kaydır
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Ana sayfa — SORU-CEVAP odaklı (Görsel Stüdyo yerine teaser)
const HomePage = () => (
  <>
    <Header />
    <main>
      <Hero />
      <StatBar />
      <FounderStrip />
      <SocialProof />
      <LiveDemo />
      <GorselStudyoTeaser />
      <UpsellSection />
      <WhyDifferent />
      <HowItWorks />
      <Features />
      <Comparison />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </main>
    <Footer />
    <FloatingWhatsApp />
  </>
);

// ────────────────────────────────────────────────
// Danışmanlık & Hesap Yönetimi (/danismanlik)
// ────────────────────────────────────────────────
const DANISMANLIK_YONETIM = [
  {
    icon: ImageIcon,
    title: 'Ürün Listesi Optimizasyonu',
    desc: "Fotoğraf, başlık ve açıklamalarınız Trendyol arama motoruna göre yeniden kurgulanır. Müşteri aradığında sizin ürününüz çıkar — tıklanır, satar.",
  },
  {
    icon: TrendingUp,
    title: 'Reklam Yönetimi — İçeride ve Dışarıda',
    desc: 'Trendyol içi reklamlar ve Meta CPAS (Trendyol dışı) uçtan uca kurgulanır: kreatifler bizden, hedefleme bizden, düzenli takip ve optimizasyon bizden. Bütçeniz boşa yanmaz.',
  },
  {
    icon: Store,
    title: 'Ürün Analizi ve Doğru Ürün Seçimi',
    desc: 'Yeni ürün girişlerinde pazar ve rekabet analiziyle yönlendiriyoruz. Ölecek ürüne stok bağlamazsınız; potansiyeli olana odaklanırsınız.',
  },
  {
    icon: Gauge,
    title: 'Kampanya Kurguları ve Fiyat Stratejisi',
    desc: 'Flash indirimler (3 saatlik / 24 saatlik) kârlılık hesabı yapılarak kurgulanır. Komisyon tarifeleri ürün ürün incelenir; stratejinize göre korumacı ya da büyüme odaklı fiyat belirlenir, kârlı olan her kampanyaya girilir — kârsız olandan uzak durulur.',
  },
];

const DanismanlikPage = () => {
  useEffect(() => {
    document.title = 'Trendyol Danışmanlık & Hesap Yönetimi — Satış Artmazsa Para İade | SellerPilot';
    return () => { document.title = 'SellerPilot - Trendyol Satıcıları İçin Yapay Zeka Asistanı'; };
  }, []);
  return (
    <>
      <Header />
      <main>
        {/* Hero — iddia net */}
        <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: 'radial-gradient(1200px 500px at 80% -10%, rgba(255,107,53,0.18), transparent 60%), #0A0C11' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-white/5 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-5 border border-white/10">
              <ShieldCheck size={13} /> Trendyol Danışmanlık & Hesap Yönetimi
            </span>
            <h1 className="text-4xl sm:text-6xl font-display font-black text-white mb-5 leading-tight max-w-4xl mx-auto">
              Satışlarınızı artıramazsak <span className="grad-text">paranızı iade ediyoruz.</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-lg mb-4">
              Kimsenin yapmadığını yapıyoruz, çünkü kendimize güveniyoruz. 6 yıldır Trendyol'da aktif satan bir ekip + SellerPilot yapay zekâ araçları — mağazanızı biz yönetiyoruz, riski biz alıyoruz.
            </p>
            <p className="text-gray-400 text-sm mb-8">Herkesi kabul etmiyoruz: en az 1 yıldır Trendyol'da satıcı olmalısınız. Önce mağazanızı inceliyoruz.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1fb355] text-white text-base font-bold py-3.5 px-7 rounded-2xl flex items-center justify-center gap-2.5 transition-colors" style={{ boxShadow: '0 8px 24px #25D36640' }}>
                <Smartphone size={20} /> Mağaza Uygunluğunu Sorgula
              </a>
              <a href="#danismanlik-hizmetler" className="w-full sm:w-auto text-white text-base font-bold py-3.5 px-7 rounded-2xl flex items-center justify-center gap-2.5 border border-white/15 hover:bg-white/5 transition-colors">
                Neler Yapıyoruz? <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* Süreç — 3 adım */}
        <section className="py-20 bg-gradient-to-b from-light to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-3">Nasıl başlıyoruz?</h2>
              <p className="text-dark-gray max-w-xl mx-auto">Para almadan önce mağazanıza katkı sağlayabileceğimizden emin oluyoruz.</p>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { n: '1', t: 'WhatsApp\'tan başvurun', d: 'Mağaza linkinizi gönderin. Ön şart: en az 1 yıldır Trendyol\'da aktif satıcı olmak.' },
                { n: '2', t: 'Ücretsiz uygunluk kontrolü', d: 'Mağazanızı, kategorinizi ve rekabeti inceliyoruz. Katkı sağlayamayacağımızı görürsek zaten kabul etmiyoruz — boşa para ödemezsiniz.' },
                { n: '3', t: 'Yol haritası + başlangıç', d: 'Uygunsanız net bir aksiyon planı sunuyoruz; onayınızla mağazanızın yönetimine başlıyoruz.' },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 0.08}>
                  <div className="bg-white rounded-3xl border border-gray-200 p-7 h-full card-hover hover:border-orange-200 hover:shadow-xl">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-4" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>{s.n}</div>
                    <p className="font-bold font-display text-dark text-lg mb-2">{s.t}</p>
                    <p className="text-dark-gray text-sm leading-relaxed">{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Hizmetler + fiyat */}
        <section id="danismanlik-hizmetler" className="py-20 bg-white scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-12">
              <span className="inline-block py-1 px-3 bg-orange-50 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-orange-100">Hizmetler</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-3">İki yol var — ikisinde de risk bizde</h2>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto">
              <Reveal className="h-full">
                <div className="h-full rounded-3xl p-7 flex flex-col gap-4 border border-gray-200 bg-white shadow-sm card-hover hover:shadow-xl hover:border-orange-200">
                  <p className="text-lg font-bold font-display text-dark">Aylık Danışmanlık</p>
                  <div><span className="text-4xl font-black text-dark">15.000₺</span><span className="text-gray-400 text-sm"> / ay · KDV dahil</span></div>
                  <p className="text-sm text-dark-gray leading-relaxed">Mağazanız sizde kalır, yol haritası bizden: haftalık analiz, fiyat/kampanya/reklam kararlarında birebir yönlendirme.</p>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5 text-sm text-dark flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span><b>Garanti:</b> Katkısı olmadığını düşünürseniz ücretiniz iade edilir.</span>
                  </div>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-auto py-3 rounded-xl text-center text-sm font-bold border border-gray-300 text-dark hover:bg-orange-50 hover:border-orange-200 transition-colors">WhatsApp'tan Başvur</a>
                </div>
              </Reveal>
              <Reveal delay={0.08} className="h-full">
                <div className="relative h-full rounded-3xl p-[2px]" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap z-10" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>★ Tam Teslim</span>
                  <div className="bg-white h-full rounded-3xl p-7 flex flex-col gap-4">
                    <p className="text-lg font-bold font-display text-dark">Hesap Yönetimi — A'dan Z'ye</p>
                    <div><span className="text-3xl font-black grad-text">SKU bazlı fiyat</span></div>
                    <p className="text-sm text-dark-gray leading-relaxed">Mağazanızı komple biz yönetiyoruz: listeleme, reklam, kampanya, fiyat — hepsi bizde. Fiyat, ürün (SKU) sayınıza göre belirlenir.</p>
                    <p className="text-xs text-gray-400">WhatsApp'tan iletişime geçip mağaza uygunluğunuzu sorgulayın.</p>
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-auto py-3 rounded-xl text-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>Uygunluğunu Sorgula</a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Hesap yönetiminde neler var */}
            <Reveal className="text-center mt-20 mb-10">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-dark">Hesap yönetiminde neler yapıyoruz?</h3>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {DANISMANLIK_YONETIM.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.06}>
                  <div className="bg-white rounded-3xl border border-gray-200 p-7 h-full card-hover hover:border-orange-200 hover:shadow-xl">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
                      <f.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-bold font-display text-dark text-lg mb-2">{f.title}</p>
                    <p className="text-dark-gray text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Bonuslar */}
            <Reveal className="mt-16">
              <div className="relative max-w-4xl mx-auto rounded-3xl px-6 sm:px-10 py-8 overflow-hidden" style={{ background: 'radial-gradient(900px 400px at 80% -20%, rgba(255,107,53,0.18), transparent 60%), #0A0C11' }}>
                <p className="text-center text-xs font-bold uppercase tracking-widest text-primary mb-5">Hesap yönetimi müşterilerine özel bonuslar</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-3">
                    <MessageSquare className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-bold mb-1">SellerPilot Soru-Cevap — Sınırsız & Ücretsiz</p>
                      <p className="text-gray-400 text-sm leading-relaxed">Trendyol soru-cevap entegrasyonu: müşteri sorularınızı yapay zekâ 7/24 cevaplar, limitsiz.</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-3">
                    <Camera className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-bold mb-1">10 Adet Stüdyo Kalite Görsel — Ücretsiz</p>
                      <p className="text-gray-400 text-sm leading-relaxed">AI Görsel Stüdyo'nun en üst paketinden 10 kullanım hakkı (3.500₺ değerinde) hediye.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Kapanış CTA */}
            <Reveal className="mt-16 text-center">
              <h3 className="text-3xl sm:text-4xl font-display font-black text-dark mb-3">
                Satışlarınızı artıramazsak <span className="grad-text">paranızı iade ediyoruz.</span>
              </h3>
              <p className="text-dark-gray max-w-xl mx-auto mb-7">Bu cümleyi kurabilen başka bir ekip bulursanız, onlarla çalışın.</p>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1fb355] text-white text-base font-bold py-3.5 px-8 rounded-2xl transition-colors" style={{ boxShadow: '0 8px 24px #25D36640' }}>
                <Smartphone size={20} /> Mağaza Uygunluğunu Sorgula
              </a>
              <p className="text-xs text-gray-400 mt-4">Ön şart: en az 1 yıldır Trendyol'da aktif satıcı olmak.</p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
};

// Görsel Stüdyo — kendi dedicated sayfası (reklam trafiği buraya)
const GorselStudyoPage = () => {
  useEffect(() => {
    document.title = 'AI Görsel Stüdyo — Tek Fotoğraf, 6 Profesyonel Görsel | SellerPilot';
    return () => { document.title = 'SellerPilot - Trendyol Satıcıları İçin Yapay Zeka Asistanı'; };
  }, []);
  return (
    <>
      <Header />
      <main>
        <GorselStudyoHero />
        <GorselStudyoIkiYol />
        <AIGorselStudyo />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <div className="min-h-screen bg-white font-sans text-dark antialiased">
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gorsel-studyo" element={<GorselStudyoPage />} />
        <Route path="/danismanlik" element={<DanismanlikPage />} />
        {/* v2 tasarım önizlemesi — onaylanınca "/" ile yer değiştirecek */}
        <Route path="/v2" element={<V2Page />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
