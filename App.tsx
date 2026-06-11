import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, CheckCircle, Mail, Bot,
  Smartphone, Check, Plane, X, Menu as MenuIcon, ShieldCheck, Store, Clock,
  MessageSquare, Sparkles, ArrowRight
} from 'lucide-react';
import { CHAT_EXAMPLES, FAQ_ITEMS, FEATURES, NAV_LINKS, STAT_CARDS, STEPS, WHATSAPP_URL, APP_URL } from './constants';

// ────────────────────────────────────────────────
// Header — sticky, with mobile menu
// ────────────────────────────────────────────────
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || menuOpen ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Plane className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl sm:text-2xl font-bold font-display text-dark">SellerPilot</span>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-dark-gray hover:text-primary font-medium transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={APP_URL}
            className="hidden sm:inline-block bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-lg shadow-orange-500/20"
          >
            Ücretsiz Dene
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-dark rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menü"
          >
            {menuOpen ? <X size={26} /> : <MenuIcon size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-dark font-medium border-b border-gray-50 last:border-0 hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={APP_URL}
                className="mt-3 bg-primary text-white text-center font-bold py-3.5 rounded-xl"
              >
                7 Gün Ücretsiz Dene
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 bg-[#25D366] text-white text-center font-bold py-3.5 rounded-xl flex items-center justify-center gap-2"
              >
                <Smartphone size={18} /> WhatsApp'tan Yazın
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ────────────────────────────────────────────────
// Hero phone mock — the signature: a question
// arriving at 02:47 and getting answered while
// the seller sleeps.
// ────────────────────────────────────────────────
const HeroPhone = () => (
  <div className="bg-[#101019] rounded-[2.5rem] border-[8px] border-gray-900 overflow-hidden shadow-2xl relative h-[560px] sm:h-[620px] flex flex-col">
    {/* Notch */}
    <div className="bg-gray-900 h-6 w-full absolute top-0 left-0 z-20 flex justify-center">
      <div className="w-24 h-4 bg-black rounded-b-xl"></div>
    </div>

    {/* Night status bar */}
    <div className="pt-8 px-5 flex justify-between items-center text-gray-500 text-[11px] font-medium">
      <span className="text-gray-300 font-bold">02:47</span>
      <span className="flex items-center gap-1"><Moon4 /> Sessiz mod</span>
    </div>

    {/* Sleeping seller line */}
    <div className="px-5 mt-3">
      <p className="text-gray-500 text-[11px]">Siz şu an uyuyorsunuz 😴</p>
    </div>

    {/* Chat area */}
    <div className="flex-1 px-4 pt-4 flex flex-col gap-3 overflow-hidden">
      {/* Incoming question */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-[#1d1d2b] text-gray-100 p-3.5 rounded-2xl rounded-tl-sm max-w-[88%] self-start border border-white/5"
      >
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold text-orange-300">Yeni müşteri sorusu</span>
          <span className="text-[9px] text-gray-500">02:47</span>
        </div>
        <p className="text-[13px] leading-snug">Merhaba, bu serum hassas ciltte kullanılır mı? İçeriğinde parfüm var mı acaba?</p>
      </motion.div>

      {/* Thinking indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ delay: 1.4, duration: 1.2, times: [0, 0.2, 0.8, 1] }}
        className="self-end flex items-center gap-2 text-[10px] text-gray-400 pr-1"
      >
        <Sparkles size={12} className="text-primary" /> SellerPilot ürün bilgilerinizi tarıyor…
      </motion.div>

      {/* AI answer */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.7, duration: 0.5 }}
        className="bg-gradient-to-br from-primary to-[#FF8F6B] text-white p-3.5 rounded-2xl rounded-br-sm max-w-[88%] self-end shadow-lg shadow-orange-900/30"
      >
        <div className="flex items-center gap-1.5 mb-1.5 border-b border-white/20 pb-1.5">
          <div className="bg-white p-0.5 rounded-full">
            <Plane size={10} className="text-primary fill-primary" />
          </div>
          <span className="text-[10px] font-bold text-white/90">Mağazanız adına cevaplandı</span>
          <span className="text-[9px] text-white/70 ml-auto">02:47</span>
        </div>
        <p className="text-[13px] leading-snug text-white/95">Merhabalar, serumumuz parfüm içermez ve hassas ciltler için uygundur. Dermatolojik olarak test edilmiştir. Keyifli alışverişler dileriz 😊</p>
      </motion.div>

      {/* Result chip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3.4, duration: 0.4 }}
        className="self-center mt-2 bg-success/15 border border-success/30 text-green-400 text-[11px] font-bold px-4 py-2 rounded-full flex items-center gap-2"
      >
        <CheckCircle size={14} /> Cevaplama süresi: saniyeler
      </motion.div>
    </div>

    {/* Bottom note */}
    <div className="px-5 pb-6 pt-3">
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-2.5">
        <Mail size={15} className="text-primary mt-0.5 shrink-0" />
        <p className="text-[11px] text-gray-400 leading-snug">Sistem emin olamadığı soruyu cevaplamaz — sabah e-postanızda hazır bekler.</p>
      </div>
    </div>
  </div>
);

// Tiny moon icon used in the status bar
const Moon4 = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
);

// ────────────────────────────────────────────────
// Hero
// ────────────────────────────────────────────────
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden bg-gradient-to-br from-orange-50/60 via-white to-white">
      {/* Soft background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 py-1.5 px-4 bg-white border border-orange-200 text-primary text-sm font-bold rounded-full mb-6 shadow-sm">
              <Store size={15} />
              Bir Trendyol satıcısı tarafından geliştirildi
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-display font-bold leading-[1.15] text-dark mb-6">
              Trendyol'da müşteri sorularını{' '}
              <span className="text-primary">siz değil, yapay zekânız</span>{' '}
              cevaplasın.
            </h1>

            <p className="text-lg sm:text-xl text-dark-gray leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              SellerPilot mağazanıza bağlanır, gelen her soruyu ürün bilgilerinize göre saniyeler içinde yanıtlar.
              Emin olamadığı soruyu cevaplamaz — e-posta ile size bildirir. Gece, hafta sonu, bayram fark etmez.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1fb355] text-white text-lg font-bold py-4 px-8 rounded-xl shadow-xl shadow-green-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <Smartphone size={22} />
                WhatsApp'tan Yazın
              </a>
              <a
                href={APP_URL}
                className="w-full sm:w-auto bg-white border-2 border-primary text-primary hover:bg-orange-50 text-lg font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                7 Gün Ücretsiz Dene
                <ArrowRight size={20} />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-dark-gray text-sm font-medium">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> Kredi kartı gerekmez</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> API bilgilerinizi girin, anında aktif</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex-1 relative w-full max-w-[340px] sm:max-w-[380px]"
          >
            <HeroPhone />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] bg-orange-200/30 blur-[100px] -z-10 rounded-full"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Founder strip — peer trust ("Ben de satıcıyım")
// ────────────────────────────────────────────────
const FounderStrip = () => {
  return (
    <section className="py-16 bg-dark relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]"></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="shrink-0 w-20 h-20 bg-gradient-to-br from-primary to-orange-400 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-900/40">
            <Store className="w-10 h-10 text-white" />
          </div>
          <div className="text-center md:text-left">
            <p className="text-xl sm:text-2xl font-display font-bold text-white leading-snug mb-3">
              "Ben de Trendyol satıcısıyım. Gece yarısı gelen sorulara yetişmenin nasıl bir şey olduğunu bilirim."
            </p>
            <p className="text-gray-400 leading-relaxed">
              SellerPilot'u önce kendi mağazalarım için yaptım — bugün kendi mağazalarımda her gün canlı çalışıyor.
              Bu site üzerindeki örnekler kurgu değil, sistemin gerçekten verdiği cevaplardır.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Why SellerPilot — 3 cards
// ────────────────────────────────────────────────
const SocialProof = () => {
  const icons = [Clock, MessageSquare, ShieldCheck];
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 bg-gray-100 text-dark-gray text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Neden SellerPilot?
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark max-w-3xl mx-auto leading-tight">
            Soru-cevap ekranına bakmak zorunda olmadığınız bir mağaza düşünün
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STAT_CARDS.map((card, i) => {
            const Icon = icons[i] || Clock;
            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 border border-orange-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm border border-orange-100">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-3xl">{card.iconLabel}</span>
                </div>
                <h3 className="text-2xl font-bold font-display text-dark mb-3">
                  {card.title}
                </h3>
                <p className="text-dark-gray leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Live examples carousel (#examples)
// ────────────────────────────────────────────────
const LiveDemo = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % CHAT_EXAMPLES.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + CHAT_EXAMPLES.length) % CHAT_EXAMPLES.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

  const currentExample = CHAT_EXAMPLES[currentIndex];

  return (
    <section id="examples" className="py-24 bg-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 bg-white text-dark-gray text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-gray-200">
            Gerçek Örnekler
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-3">
            Kurgu değil — sistemin verdiği gerçek cevaplar
          </h2>
          <p className="text-dark-gray max-w-2xl mx-auto">
            Aşağıdaki sorular Trendyol'da müşteriler tarafından gerçekten soruldu ve SellerPilot tarafından otomatik cevaplandı.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <button onClick={prevSlide} aria-label="Önceki örnek" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-16 bg-white p-3 rounded-full shadow-lg text-primary hover:bg-orange-50 z-20 transition-all">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} aria-label="Sonraki örnek" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-16 bg-white p-3 rounded-full shadow-lg text-primary hover:bg-orange-50 z-20 transition-all">
            <ChevronRight size={24} />
          </button>

          <div className="overflow-hidden px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100"
              >
                <div className="mb-4 text-center">
                  <span className="text-xs font-bold text-primary bg-orange-50 px-2 py-1 rounded tracking-widest uppercase">{currentExample.category}</span>
                </div>

                <div className="flex justify-end mb-6">
                  <div className="max-w-[85%] sm:max-w-[70%]">
                    <div className="bg-[#F5F5F5] rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-2xl p-5 text-dark relative">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-[10px] text-gray-600 font-bold">U</div>
                        <span className="text-xs font-bold text-gray-500">{currentExample.customerName}</span>
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed">{currentExample.question}</p>
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-[10px] text-gray-400 font-medium block">
                        {currentExample.customerName} tarafından {currentExample.date} tarihinde soruldu.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-start mb-8">
                  <div className="max-w-[90%] sm:max-w-[80%]">
                    <div className="bg-gradient-to-br from-primary to-[#FF8F6B] text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm p-5 shadow-lg relative">
                      <div className="flex items-center gap-2 mb-3 border-b border-white/20 pb-2">
                        <div className="bg-white p-1 rounded-full">
                          <Plane size={14} className="text-primary fill-primary" />
                        </div>
                        <span className="text-xs font-bold text-white/90">SellerPilot</span>
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed text-white/95">{currentExample.answer}</p>
                    </div>
                    <div className="text-left mt-1">
                      <span className="text-[10px] text-gray-400 font-medium block">
                        Değerli İş Ortağımız, aşağıdaki {currentExample.date} tarihli cevabınız müşteriye iletilmiştir.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 bg-success text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-green-500/20">
                    <CheckCircle size={18} />
                    <span>Cevaplama Süresi: Aynı Dakika</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {CHAT_EXAMPLES.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Örnek ${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-primary w-8' : 'bg-gray-300 hover:bg-primary/50'
                }`}
              />
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
const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="inline-block py-1 px-3 bg-gray-100 text-dark-gray text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Nasıl Çalışır?
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-3">
            Kurulum 5 dakika, gerisi otomatik
          </h2>
          <p className="text-dark-gray max-w-xl mx-auto">Teknik bilgi gerekmez. Trendyol satıcı panelinizden API bilgilerinizi alıp girmeniz yeterli.</p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-gray-200 -z-10"></div>

          <div className="grid lg:grid-cols-3 gap-12">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center text-center bg-white p-6 rounded-2xl">
                  <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-lg relative z-10">
                    <Icon className="w-10 h-10 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-dark text-white rounded-full flex items-center justify-center font-bold font-display shadow-md">
                      {step.id}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-display text-dark mb-4">{step.title}</h3>
                  <p className="text-dark-gray">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Features (#features)
// ────────────────────────────────────────────────
const Features = () => {
  return (
    <section id="features" className="py-24 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 bg-white text-dark-gray text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-gray-200">
            Özellikler
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark">
            Sıradan bir otomatik cevaplayıcı değil
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-white p-8 rounded-2xl border border-gray-200 transition-all cursor-default"
              >
                <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-display text-dark mb-4">
                  {feature.title}
                </h3>
                <p className="text-dark-gray leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Pricing (#pricing)
// ────────────────────────────────────────────────
const PLANS = [
  {
    name: "Başlangıç Paketi",
    price: "499",
    questions: "100",
    features: [
      "100 Soru / Ay",
      "15 Dakikada Cevap Garantisi",
      "1 Mağaza Entegrasyonu",
      "Temel Raporlama",
      "Temel Marka Dili Ayarları",
      "Mesaj Üzerinden Destek",
    ],
    popular: false,
    cta: "Ücretsiz Deneyin",
  },
  {
    name: "Küçük Esnaf Paketi",
    price: "1.299",
    questions: "300",
    features: [
      "300 Soru / Ay",
      "5 Dakikada Cevap Garantisi",
      "1 Mağaza Entegrasyonu",
      "Basit Raporlama",
      "Temel Marka Dili Ayarları",
      "Mesaj Üzerinden Destek",
    ],
    popular: false,
    cta: "Ücretsiz Deneyin",
  },
  {
    name: "Büyüyen Marka Paketi",
    price: "6.999",
    questions: "3.000",
    features: [
      "3.000 Soru / Ay",
      "5 Dakikada Cevap Garantisi",
      "3 Mağaza Entegrasyonu",
      "Detaylı Raporlama",
      "Gelişmiş Marka Dili",
      "Canlı Telefon Desteği",
    ],
    popular: true,
    cta: "Ücretsiz Deneyin",
  },
  {
    name: "Kurumsal Şirket Paketi",
    price: "14.999",
    questions: "10.000",
    features: [
      "10.000 Soru / Ay",
      "5 Dakikada Cevap Garantisi",
      "Sınırsız Mağaza Entegrasyonu",
      "Detaylı Raporlama",
      "Gelişmiş Marka Dili",
      "Canlı Telefon Desteği",
    ],
    popular: false,
    cta: "Ücretsiz Deneyin",
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <span className="inline-block py-1 px-3 bg-gray-100 text-dark-gray text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Fiyatlandırma
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark mb-3">
            Soru hacminize göre seçin
          </h2>
          <p className="text-dark-gray mb-1">Tüm planlar 7 günlük ücretsiz deneme ile başlar. Kredi kartı gerekmez.</p>
          <p className="text-sm text-gray-400 mb-12">
            Uzmana yönlendirilen sorular ücretsizdir, mesaj hakkınızdan sayılmaz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -6 }}
              className={`relative rounded-2xl p-6 flex flex-col gap-5 transition-all ${
                plan.popular
                  ? "border-2 border-primary bg-white shadow-2xl shadow-orange-500/10"
                  : "border border-gray-200 bg-white shadow-sm hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  ★ En Çok Tercih Edilen
                </span>
              )}

              <p className="text-center text-gray-500 text-sm font-semibold">{plan.name}</p>

              <div className="text-center">
                <span className="text-4xl font-black text-dark">{plan.price}₺</span>
                <span className="text-gray-400 text-sm"> / aylık</span>
                <p className="text-xs text-gray-400 mt-1">KDV Dahil</p>
              </div>

              <ul className="flex flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={APP_URL}
                className={`mt-auto py-3 rounded-xl text-center text-sm font-bold transition-all ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "border border-gray-300 text-dark hover:bg-gray-50"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// FAQ (#faq)
// ────────────────────────────────────────────────
const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 bg-white text-dark-gray text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-gray-200">
            Sıkça Sorulan Sorular
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark">
            Merak Edilenler
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 sm:px-10">
          {FAQ_ITEMS.map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-100 last:border-0"
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group gap-4"
              >
                <span className={`text-base sm:text-lg font-bold font-display transition-colors ${openId === item.id ? 'text-primary' : 'text-dark group-hover:text-primary'}`}>
                  {item.question}
                </span>
                <span className={`p-2 rounded-full shrink-0 transition-colors ${openId === item.id ? 'bg-orange-50 text-primary' : 'bg-gray-50 text-dark-gray'}`}>
                  {openId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>
              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 text-dark-gray leading-relaxed pl-4 border-l-2 border-primary/20">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Final CTA
// ────────────────────────────────────────────────
const FinalCTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="inline-block py-1 px-3 bg-white text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-6 border border-primary/20">
          Hemen Başlayın
        </span>
        <h2 className="text-4xl sm:text-5xl font-display font-bold text-dark mb-6">
          Bu gece son kez sorulara siz bakın
        </h2>
        <p className="text-lg sm:text-xl text-dark-gray mb-12 max-w-2xl mx-auto">
          Aklınıza takılan ne varsa WhatsApp'tan sorun — bir satıcı olarak ben cevaplıyorum.
          Ya da hemen kayıt olun, 7 gün ücretsiz deneyin. Kredi kartı gerekmez.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1fb355] text-white text-lg font-bold py-4 px-8 rounded-xl shadow-xl shadow-green-500/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Smartphone size={24} />
            WhatsApp ile Soru Sor →
          </a>
          <a
            href={APP_URL}
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white text-lg font-bold py-4 px-8 rounded-xl shadow-xl shadow-orange-500/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Mail size={24} />
            Hemen Ücretsiz Dene →
          </a>
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Footer
// ────────────────────────────────────────────────
const Footer = () => {
  return (
    <footer className="bg-dark text-white py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">

          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1.5 rounded-lg">
                <Plane className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold font-display">SellerPilot</span>
            </div>
            <p className="text-gray-400 mb-6">Trendyol satıcıları için yapay zekâ destekli soru-cevap asistanı. Bir satıcı tarafından, satıcılar için geliştirildi.</p>
            <div className="text-sm text-gray-500">
              © 2026 SellerPilot. Tüm hakları saklıdır.
            </div>
          </div>

          <div className="md:pl-12">
            <h4 className="text-lg font-bold font-display mb-6 text-white">Bağlantılar</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
              <li><a href={APP_URL} className="text-gray-400 hover:text-primary transition-colors">Ücretsiz Dene</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold font-display mb-6 text-white">İletişim</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <span>info@sellerpilot.cloud</span>
              </li>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                  <Smartphone size={18} className="text-primary" />
                  <span>+90 (537) 837 41 02</span>
                </a>
              </li>
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
};

// ────────────────────────────────────────────────
// Floating WhatsApp button (mobile-first conversion)
// ────────────────────────────────────────────────
const FloatingWhatsApp = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp'tan yazın"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1fb355] text-white p-4 rounded-full shadow-2xl shadow-green-500/40 transition-colors flex items-center gap-2"
        >
          <Smartphone size={26} />
          <span className="hidden sm:inline font-bold pr-1">WhatsApp</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
};

// ────────────────────────────────────────────────
// Main App
// ────────────────────────────────────────────────
const App = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-dark antialiased">
      <Header />
      <main>
        <Hero />
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
};

export default App;
