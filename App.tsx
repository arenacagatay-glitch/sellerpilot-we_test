
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, CheckCircle, Mail, Bot, Smartphone, ExternalLink, Search, Filter, Check, Home, Package, MessageSquare, Menu, ShoppingBag, Plane, X, Send, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { CHAT_EXAMPLES, FAQ_ITEMS, FEATURES, NAV_LINKS, STAT_CARDS, STEPS, GOOGLE_SHEETS_WEB_APP_URL } from './constants';
import { Feature, ChatExample } from './types';

// --- Shared Components ---

const MiniSitePreview = () => (
  <div className="w-full h-full bg-white flex flex-col overflow-hidden relative font-sans select-none">
    {/* Mini Header */}
    <div className="flex items-center justify-between px-2 py-1.5 bg-white border-b border-gray-100">
      <div className="flex items-center gap-0.5">
        <div className="bg-primary p-0.5 rounded-[2px]">
          <Plane className="w-2 h-2 text-white fill-white" />
        </div>
        <span className="text-[6px] font-bold text-dark">SellerPilot</span>
      </div>
      <div className="flex gap-1">
         <div className="w-4 h-1 bg-gray-200 rounded-full"></div>
         <div className="w-4 h-1 bg-gray-200 rounded-full"></div>
      </div>
    </div>
    
    {/* Mini Hero */}
    <div className="flex-1 bg-gradient-to-br from-orange-50/50 to-white p-3 flex flex-col items-center justify-center text-center">
       <span className="px-1.5 py-0.5 bg-orange-100 text-[5px] text-primary font-bold rounded-full mb-1">ANA SAYFA</span>
       <h1 className="text-[8px] font-bold text-dark leading-tight mb-1">
         SellerPilot ile Hızlı Yanıtlar.
       </h1>
       <div className="w-3/4 h-0.5 bg-gray-200 rounded-full mb-2"></div>
       <div className="flex gap-1">
         <div className="w-8 h-2.5 bg-primary rounded-[2px]"></div>
         <div className="w-8 h-2.5 border border-primary rounded-[2px]"></div>
       </div>
       
       {/* Abstract Floating Element */}
       <div className="absolute bottom-[-10px] right-[-10px] w-12 h-12 bg-orange-200/30 rounded-full blur-lg"></div>
    </div>
  </div>
);

const DemoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setStatus('idle');
      setFormData({ name: '', email: '', phone: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // FormData nesnesi oluşturuyoruz (En güvenilir yöntem)
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);

    try {
      await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Scripts için zorunlu
        body: data // JSON yerine FormData gönderiyoruz
      });

      // no-cors modunda hata yakalanamaz, başarılı varsayıyoruz
      setStatus('success');
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-dark hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-dark mb-2">Talebiniz Alındı!</h3>
            <p className="text-gray-500">
              Bilgilerinizi başarıyla kaydettik. En kısa sürede size geri dönüş yapacağız.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Plane className="text-primary fill-primary w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-display text-dark">Ücretsiz Demo Talep Edin</h3>
              <p className="text-sm text-gray-500 mt-2">
                Mağazanıza özel analiz ve demo için bilgilerinizi bırakın, 24 saat içinde size ulaşalım.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İsim Soyisim</label>
                <input 
                  type="text" 
                  placeholder="Adınız ve Soyadınız"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
                  required 
                  disabled={status === 'submitting'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
                <input 
                  type="email" 
                  placeholder="ornek@sirket.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
                  required 
                  disabled={status === 'submitting'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon Numarası</label>
                <input 
                  type="tel" 
                  placeholder="05XX XXX XX XX"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
                  required 
                  disabled={status === 'submitting'}
                />
              </div>
              
              {status === 'error' && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                  Bir hata oluştu. Lütfen tekrar deneyin veya WhatsApp'tan ulaşın.
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/70 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="animate-spin" /> Gönderiliyor...
                  </>
                ) : (
                  'Demo İsteği Gönder'
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

// --- Main Sections ---

const Header = ({ onOpenDemo }: { onOpenDemo: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-primary p-2 rounded-lg relative overflow-hidden group">
            <Plane className="w-6 h-6 text-white fill-white relative z-10" />
          </div>
          <span className="text-2xl font-bold font-display text-dark">SellerPilot</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
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

        <button 
          onClick={onOpenDemo}
          className="bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-lg hover:shadow-orange-500/30"
        >
          Ücretsiz Demo İsteyin
        </button>
      </div>
    </nav>
  );
};

const Hero = ({ onOpenDemo }: { onOpenDemo: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-gradient-to-br from-orange-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="inline-block py-1 px-3 bg-orange-100 text-primary text-sm font-bold rounded-full mb-6">
              Ana Sayfa
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-display font-bold leading-[1.2] text-dark mb-6">
              Trendyol'da 15 Saniyede Doğru, Hızlı ve İnsandan Farksız Yanıtlar. <br/>
              <span className="text-primary">Satışlarınızı Artıran Yapay Zekâ Asistanı.</span>
            </h1>
            <p className="text-lg sm:text-xl text-dark-gray leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              Ürün önerileriyle upsell yapar, dönüşüm oranınızı yükseltir, mağaza puanınızı güçlendirir.
              İster kurumsal, ister samimi… Cevaplar tam size göre şekillenir. Siz uyurken bile çalışır.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
              <button 
                onClick={onOpenDemo}
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white text-lg font-bold py-4 px-8 rounded-lg shadow-xl shadow-orange-500/20 transition-all transform hover:-translate-y-1"
              >
                Ücretsiz Demo İsteyin
              </button>
              <a href="#examples" className="w-full sm:w-auto bg-white border-2 border-primary text-primary hover:bg-orange-50 text-lg font-bold py-4 px-8 rounded-lg transition-all flex items-center justify-center gap-2">
                <ExternalLink size={20} />
                Canlı Örnekleri İzle
              </a>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-2 text-dark-gray font-medium">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Anında Kurulum</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative"
          >
            <motion.div
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="relative z-10 mx-auto max-w-[320px] sm:max-w-[360px]"
            >
              <div className="bg-white rounded-[2.5rem] border-[8px] border-gray-900 overflow-hidden shadow-2xl relative h-[700px] flex flex-col">
                <div className="bg-gray-900 h-6 w-full absolute top-0 left-0 z-20 flex justify-center">
                    <div className="w-24 h-4 bg-black rounded-b-xl"></div>
                </div>
                
                {/* Simulated App Interface */}
                <div className="flex-1 flex flex-col font-sans bg-gray-50 pt-6">
                  {/* App Header */}
                  <div className="bg-[#2d2d3a] text-white p-4 pt-4 text-center font-bold text-sm shadow-sm">
                    Soru & Cevap
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex bg-white border-b border-gray-200 text-[11px] font-semibold text-gray-500">
                    <div className="flex-1 py-3 text-center border-b-2 border-primary text-primary cursor-pointer hover:bg-gray-50">
                      Ürün Soruları<br/><span className="font-normal">0 Soru</span>
                    </div>
                    <div className="flex-1 py-3 text-center border-b-2 border-transparent cursor-pointer hover:bg-gray-50">
                      Sipariş Soruları<br/><span className="font-normal">0 Soru</span>
                    </div>
                    <div className="flex-1 py-3 text-center border-b-2 border-transparent cursor-pointer hover:bg-gray-50 text-gray-400">
                      Hazır Cevaplar<br/><span className="font-normal">6 Cevap</span>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="p-3 bg-white flex gap-2 border-b border-gray-100 items-center">
                    <div className="flex-1 relative">
                       <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                       <input 
                          type="text" 
                          placeholder="Anahtar Kelime ile Ara" 
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder-gray-400" 
                          readOnly
                       />
                    </div>
                    <button className="bg-[#2d2d3a] text-white p-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Empty State Content */}
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
                    <div className="w-20 h-20 bg-[#00C853] rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/20 animate-pulse-slow">
                      <Check className="w-10 h-10 text-white stroke-[3]" />
                    </div>
                    <h3 className="text-gray-800 font-bold text-base mb-2">Tüm Ürün Sorularını Cevapladınız!</h3>
                    <p className="text-xs text-gray-400 max-w-[200px]">Bekleyen sorunuz bulunmamaktadır. Harika gidiyorsunuz!</p>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-end text-[9px] text-gray-400 font-medium pb-5">
                     <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:text-primary transition-colors">
                       <Home size={20} className="stroke-[1.5]" />
                       <span>ANASAYFA</span>
                     </div>
                     <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:text-primary transition-colors">
                       <Package size={20} className="stroke-[1.5]" />
                       <span>ÜRÜN</span>
                     </div>
                     <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:text-primary transition-colors">
                       <ShoppingBag size={20} className="stroke-[1.5]" />
                       <span>SİPARİŞ</span>
                     </div>
                     <div className="flex flex-col items-center gap-1.5 text-primary cursor-pointer relative">
                       <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping"></div>
                       <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                       <MessageSquare size={20} className="stroke-[1.5] fill-orange-50" />
                       <span className="font-bold">SORU & CEVAP</span>
                     </div>
                     <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:text-primary transition-colors relative">
                       <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0.5 border border-white"></div>
                       <Menu size={20} className="stroke-[1.5]" />
                       <span>MENÜ</span>
                     </div>
                  </div>
                </div>

                {/* Floating Notification */}
                <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[90%] bg-dark/90 backdrop-blur-md text-white p-3 rounded-xl shadow-xl flex items-center gap-3 animate-[slideDown_1s_ease-out_2s_forwards] opacity-0">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Plane size={16} className="fill-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-300">Az önce</p>
                    <p className="text-xs font-medium">Yeni soru 15sn içinde yanıtlandı ✅</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Decorative blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-200/30 blur-[100px] -z-10 rounded-full"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const SocialProof = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 bg-gray-100 text-dark-gray text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Neden SellerPilot?
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark max-w-3xl mx-auto">
            SellerPilot ile daha fazla satış, daha yüksek mağaza puanı, ve daha fazla tekrar eden müşteri kazanın
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STAT_CARDS.map((card) => {
            return (
              <motion.div 
                key={card.id}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 border border-orange-100 shadow-sm hover:shadow-xl transition-all"
              >
                {/* Visual Container - Aspect Ratio 9/16 for phone size feeling */}
                <div className="aspect-[9/16] w-full rounded-xl overflow-hidden mb-6 relative group bg-gray-50 border border-gray-200 shadow-inner">
                   
                   {/* CARD 1: Specific Chat UI with Blur */}
                   {card.id === 1 && (
                     <div className="w-full h-full flex flex-col font-sans text-xs relative bg-white">
                       {/* Header Part */}
                       <div className="p-3 bg-white border-b border-gray-200 flex gap-3 items-center">
                         <div className="w-10 h-10 bg-orange-400 rounded blur-[2px]"></div> {/* Blurred Product Image */}
                         <div className="flex-1">
                           <div className="text-[10px] text-red-500 font-bold mb-0.5 bg-red-50 inline-block px-1 rounded">Müşterinin Favorilerinde</div>
                           <div className="font-bold text-dark blur-[3px] select-none">Profesyonel C Vitamini Yüz</div>
                           <div className="text-[10px] text-gray-400 blur-[2px]">Marka: Cosmolive</div>
                         </div>
                         <div className="text-orange-500 font-bold text-[10px]">Ürüne Git</div>
                       </div>
                       
                       {/* Chat Body */}
                       <div className="flex-1 p-3 bg-gray-50 flex flex-col gap-4 overflow-hidden relative">
                         {/* User Msg */}
                         <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 self-start max-w-[90%]">
                           <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                             <span>**** ****</span>
                             <span>09/12/2025 01:01</span>
                           </div>
                           <p className="text-gray-700 leading-snug">c vitamini olarak askorbik asit mi kullanıldı yoksa türevi mi?</p>
                           <div className="text-[9px] text-gray-400 font-bold mt-2">Sorun Bildir</div>
                         </div>

                         {/* Seller Answer */}
                         <div className="bg-white p-3 rounded-2xl rounded-tl-2xl rounded-bl-sm shadow-sm border border-green-100 self-start max-w-[90%] relative">
                           <div className="absolute -left-1 top-4 w-1 h-8 bg-green-500 rounded-r"></div>
                           <div className="flex justify-between text-[9px] mb-1">
                             <span className="text-green-600 font-bold">Onaylanan Cevap</span>
                             <span className="text-gray-400">09/12/2025 10:13</span>
                           </div>
                           <p className="text-gray-700 leading-snug">Merhaba, ürünümüzde saf askorbik asit yerine stabilize edilmiş 3 O Ethyl Ascorbic Acid türevi kullanılmıştır. Keyifli alışverişler dileriz.</p>
                         </div>
                       </div>

                       {/* Bottom Button */}
                       <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-white to-transparent pt-6">
                         <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold shadow-lg shadow-orange-500/20">
                           Sıradaki Soruya Geç
                         </button>
                       </div>
                     </div>
                   )}

                   {/* CARD 2: DARK LUXURY OFFICE - CLEAN & PROFESSIONAL */}
                   {card.id === 2 && (
                     <div className="w-full h-full relative overflow-hidden bg-gray-900 group-hover:scale-[1.02] transition-transform duration-500">
                        {/* Background: Dark Luxury Office / Man in Suit */}
                        <img 
                          src="https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?auto=format&fit=crop&q=80&w=800" 
                          alt="Executive Office" 
                          className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                        {/* Content: Clean Floating Browser Window (No more fake 3D Laptop) */}
                        <div className="absolute inset-0 flex items-end justify-center pb-8 px-8">
                           {/* Browser Window Style Frame */}
                           <div className="w-full aspect-[16/10] bg-white rounded-t-xl overflow-hidden shadow-2xl border border-gray-700 relative top-2">
                              {/* Top Bar */}
                              <div className="bg-gray-800 h-4 flex items-center px-2 gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              </div>
                              {/* Preview Content */}
                              <div className="w-full h-full">
                                <MiniSitePreview />
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   {/* CARD 3: SECURE & SMART */}
                   {card.id === 3 && (
                     <div className="w-full h-full relative overflow-hidden bg-white">
                        {/* Background Image: Abstract Tech */}
                        <img 
                          src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600" 
                          alt="Abstract Data" 
                          className="absolute inset-0 w-full h-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-orange-50"></div>

                        {/* Abstract Centerpiece: A Glowing Shield/Lock */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                {/* Pulse Rings */}
                                <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-75"></div>
                                <div className="absolute inset-2 bg-orange-200 rounded-full animate-pulse opacity-50"></div>
                                
                                {/* Shield Icon */}
                                <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-primary to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 transform group-hover:scale-110 transition-transform duration-500">
                                    <ShieldCheck className="text-white w-8 h-8" />
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 bg-white p-1.5 rounded-lg shadow-md border border-gray-100 animate-bounce delay-100">
                                    <Lock className="w-4 h-4 text-green-500" />
                                </div>
                                <div className="absolute -bottom-2 -left-4 bg-white p-1.5 rounded-lg shadow-md border border-gray-100 animate-bounce delay-700">
                                    <Bot className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                            
                            {/* Text Badge */}
                            <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-orange-100 shadow-sm">
                                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">7/24 Aktif Koruma</span>
                            </div>
                        </div>
                     </div>
                   )}

                   {/* Floating Icon */}
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-md z-10 border border-gray-100">
                     {card.iconLabel}
                   </div>
                </div>
                <h3 className="text-2xl font-bold font-display text-dark mb-3 flex items-center gap-2">
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

const LiveDemo = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % CHAT_EXAMPLES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + CHAT_EXAMPLES.length) % CHAT_EXAMPLES.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000); // Auto play
    return () => clearInterval(timer);
  }, []);

  const currentExample = CHAT_EXAMPLES[currentIndex];

  return (
    <section id="examples" className="py-24 bg-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 bg-white text-dark-gray text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-gray-200">
            Canlı Örnekler
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark">
            Gerçekten Çalışıyor mu? İşte Gerçek Örnekler:
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 bg-white p-3 rounded-full shadow-lg text-primary hover:bg-orange-50 z-20 transition-all">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 bg-white p-3 rounded-full shadow-lg text-primary hover:bg-orange-50 z-20 transition-all">
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

                {/* Customer Message */}
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

                {/* AI Message */}
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

                {/* Badge */}
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

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="inline-block py-1 px-3 bg-gray-100 text-dark-gray text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Nasıl Çalışır?
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark">
            3 Adımda Kurulum, Sonsuza Kadar Hizmet
          </h2>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
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

const Features = () => {
  return (
    <section id="features" className="py-24 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 bg-white text-dark-gray text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-gray-200">
            Özellikler
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark">
            SellerPilot'un Gücü
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

const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 bg-gray-100 text-dark-gray text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Sıkça Sorulan Sorular
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark">
            Merak Edilenler
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <div 
              key={item.id} 
              className="border-b border-gray-100 last:border-0"
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
              >
                <span className={`text-lg font-bold font-display transition-colors ${openId === item.id ? 'text-primary' : 'text-dark group-hover:text-primary'}`}>
                  {item.question}
                </span>
                <span className={`p-2 rounded-full transition-colors ${openId === item.id ? 'bg-orange-50 text-primary' : 'bg-gray-50 text-dark-gray'}`}>
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
                    <div className="pb-8 text-dark-gray leading-relaxed text-lg pl-4 border-l-2 border-primary/20">
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

const FinalCTA = ({ onOpenDemo }: { onOpenDemo: () => void }) => {
  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="inline-block py-1 px-3 bg-white text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-6 border border-primary/20">
          İletişim
        </span>
        <h2 className="text-4xl sm:text-5xl font-display font-bold text-dark mb-6">
          Mağazanız İçin Ücretsiz Analiz İsteyin
        </h2>
        <p className="text-lg sm:text-xl text-dark-gray mb-12 max-w-2xl mx-auto">
          Demo görüşmesinde mağazanıza özel cevaplama hızınızı ve kazanacağınız zamanı gösteriyoruz.
          WhatsApp'tan yazın veya formu doldurun, 24 saat içinde dönelim.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href="https://wa.me/905378374102"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1fb355] text-white text-lg font-bold py-4 px-8 rounded-lg shadow-xl shadow-green-500/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Smartphone size={24} />
            WhatsApp ile İletişime Geç →
          </a>
          
          <button 
            onClick={onOpenDemo}
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white text-lg font-bold py-4 px-8 rounded-lg shadow-xl shadow-orange-500/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Mail size={24} />
            Form ile Demo Talep Et →
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          
          {/* Column 1 */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1.5 rounded-lg">
                <Plane className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold font-display">SellerPilot</span>
            </div>
            <p className="text-gray-400 mb-6">Trendyol Satıcıları için AI Asistanı. Satışlarınızı artırın, mağaza puanınızı koruyun.</p>
            <div className="text-sm text-gray-500">
              © 2025 SellerPilot. Tüm hakları saklıdır.
            </div>
          </div>

          {/* Column 2 */}
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
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Fiyatlandırma</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-lg font-bold font-display mb-6 text-white">İletişim</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <span>info@sellerpilot.cloud</span>
              </li>
              <li className="flex items-center gap-3">
                <Smartphone size={18} className="text-primary" />
                <span>+90 (537) 837 41 02</span>
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

// --- Main App ---

const App = () => {
  const [showDemoForm, setShowDemoForm] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-dark antialiased">
      <Header onOpenDemo={() => setShowDemoForm(true)} />
      <main>
        <Hero onOpenDemo={() => setShowDemoForm(true)} />
        <SocialProof />
        <LiveDemo />
        <HowItWorks />
        <Features />
        <FAQ />
        <FinalCTA onOpenDemo={() => setShowDemoForm(true)} />
      </main>
      <Footer />

      <AnimatePresence>
        {showDemoForm && (
          <DemoModal isOpen={showDemoForm} onClose={() => setShowDemoForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
