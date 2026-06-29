import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, CheckCircle, Mail,
  Smartphone, Check, Plane, X, Menu as MenuIcon, ShieldCheck, Store, Clock,
  MessageSquare, Sparkles, ArrowRight, Star, TrendingUp, Zap as ZapIcon
} from 'lucide-react';
import { CHAT_EXAMPLES, FAQ_ITEMS, FEATURES, NAV_LINKS, STAT_CARDS, STEPS, WHATSAPP_URL, APP_URL } from './constants';

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

  return (
    <nav style={{ transition: 'all .3s' }} className={`fixed top-0 left-0 right-0 z-50 ${dark ? 'bg-transparent py-5' : 'bg-white/90 backdrop-blur-xl shadow-md py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2">
          <div className="p-2 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)', boxShadow: '0 4px 16px #FF6B3540' }}>
            <Plane className="w-5 h-5 text-white fill-white" />
          </div>
          <span className={`text-xl sm:text-2xl font-bold font-display ${dark ? 'text-white' : 'text-dark'}`}>SellerPilot</span>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className={`font-medium transition-colors ${dark ? 'text-gray-300 hover:text-white' : 'text-dark-gray hover:text-primary'}`}>
              {l.label}
            </a>
          ))}
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
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="py-3 text-dark font-medium border-b border-gray-50 last:border-0 hover:text-primary transition-colors">{l.label}</a>
            ))}
            <a href={APP_URL} className="mt-3 text-white text-center font-bold py-3.5 rounded-xl" style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}>7 Gün Ücretsiz Dene</a>
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
              7 Gün Ücretsiz Dene <ArrowRight size={20} />
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
// Pricing (#pricing)
// ────────────────────────────────────────────────
const PLANS = [
  { name: "Başlangıç Paketi", price: "499", features: ["100 Soru / Ay","15 Dakikada Cevap Garantisi","1 Mağaza Entegrasyonu","Temel Raporlama","Temel Marka Dili Ayarları","Mesaj Üzerinden Destek"], popular: false },
  { name: "Küçük Esnaf Paketi", price: "1.299", features: ["300 Soru / Ay","5 Dakikada Cevap Garantisi","1 Mağaza Entegrasyonu","Basit Raporlama","Temel Marka Dili Ayarları","Mesaj Üzerinden Destek"], popular: false },
  { name: "Büyüyen Marka Paketi", price: "6.999", features: ["3.000 Soru / Ay","5 Dakikada Cevap Garantisi","3 Mağaza Entegrasyonu","Detaylı Raporlama","Gelişmiş Marka Dili","Canlı Telefon Desteği"], popular: true },
  { name: "Kurumsal Şirket Paketi", price: "14.999", features: ["10.000 Soru / Ay","5 Dakikada Cevap Garantisi","Sınırsız Mağaza Entegrasyonu","Detaylı Raporlama","Gelişmiş Marka Dili","Canlı Telefon Desteği"], popular: false },
];

const Pricing = () => (
  <section id="pricing" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center mb-12">
        <span className="inline-block py-1 px-3 bg-orange-50 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-orange-100">Fiyatlandırma</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-3">Soru hacminize göre seçin</h2>
        <p className="text-dark-gray mb-1">Tüm planlar 7 günlük ücretsiz deneme ile başlar. Kredi kartı gerekmez.</p>
        <p className="text-sm text-gray-400">Uzmana yönlendirilen sorular ücretsizdir, mesaj hakkınızdan sayılmaz.</p>
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
                    <p className="text-xs text-gray-400 mt-1">KDV Dahil</p>
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
                  <p className="text-xs text-gray-400 mt-1">KDV Dahil</p>
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
          Aklınıza takılan ne varsa WhatsApp'tan sorun — bir satıcı olarak ben cevaplıyorum. Ya da hemen kayıt olun, 7 gün ücretsiz deneyin.
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
            <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors"><Smartphone size={18} className="text-primary" /><span>+90 (537) 837 41 02</span></a></li>
          </ul>
          <div className="mt-8 flex gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
            <span className="text-gray-700">|</span>
            <a href="#" className="hover:text-white transition-colors">Kullanım Koşulları</a>
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
const App = () => (
  <div className="min-h-screen bg-white font-sans text-dark antialiased">
    <GlobalStyles />
    <Header />
    <main>
      <Hero />
      <StatBar />
      <FounderStrip />
      <SocialProof />
      <LiveDemo />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </main>
    <Footer />
    <FloatingWhatsApp />
  </div>
);

export default App;
