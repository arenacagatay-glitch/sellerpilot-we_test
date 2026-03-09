import { Zap, ShoppingBag, Shield, MessageCircle, Box, Moon, Key, Settings, UserCheck } from 'lucide-react';
import { ChatExample, FaqItem, Feature, StatCard, Step } from './types';

// ÖNEMLİ: Google Apps Script'ten aldığın Web App URL'ini buraya yapıştır.
// Dağıtım yaparken "Who has access" kısmının "Anyone" olduğundan emin ol.
export const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwtGXVec6cRsfgpJpb5GAODf8RDrkLoQvwMsu6E1OOBqxuummZdZs2BxUbRoYzSepc/exec"; 

export const NAV_LINKS = [
  { label: 'Özellikler', href: '#features' },
  { label: 'Nasıl Çalışır?', href: '#how-it-works' },
  { label: 'Örnekler', href: '#examples' },
  { label: 'Fiyatlar', href: '#pricing' },
  { label: 'SSS', href: '#faq' },
];

export const STAT_CARDS: StatCard[] = [
  {
    id: 1,
    title: "15 Saniyede Cevap",
    description: "Müşteriler beklemez, mağaza puanınız yükselir",
    imageUrl: "", // Handled by custom component now
    iconLabel: "⚡"
  },
  {
    id: 2,
    title: "Satış Asistanı",
    description: "Ürün önerir, cross-sell yapar, sizin yerinize satar",
    imageUrl: "", // Handled by custom component now
    iconLabel: "🛍️"
  },
  {
    id: 3,
    title: "Güvenli & Akıllı",
    description: "Yanlış bilgi vermez, bilgi yoksa size mail atar",
    imageUrl: "", // Handled by custom component now
    iconLabel: "🔐"
  }
];

export const CHAT_EXAMPLES: ChatExample[] = [
  {
    id: 1,
    category: "KOZMETİK - PARFÜM",
    customerName: "**** ****",
    date: "26 Kasım 2025 22:18",
    question: "Merhaba içinde şeftali sedir misk amberli ama böyle ergen vanilya kokan olmasın istiyorum buğday teniliyim hangisi olmalı",
    answer: "Merhabalar, [ÜRÜN ADI GİZLİ] parfümümüz şeftali, sedir, misk ve amber gibi sıcak ve zarif notalara sahip, ergen vanilya kokusu barındırmayan sofistike bir seçenek. Buğday teninize de çok güzel uyum sağlayacaktır. Eğer daha hafif ve ferah bir alternatif isterseniz, sedir ağacı ve yasemin kokusuyla vücut spreyimizi de inceleyebilirsiniz. Her ikisi de kalıcı ve kaliteli formüllere sahiptir. Yardımcı olabileceğimiz başka bir şey olursa lütfen çekinmeden sorun."
  },
  {
    id: 2,
    category: "KOZMETİK - CİLT BAKIMI",
    customerName: "**** ****",
    date: "26 Kasım 2025 22:15",
    question: "ürünü sürmeden önce pirinç suyu kullanıyorum sızce kremin etkisini azaltır mı",
    answer: "Merhabalar, pirinç suyu kullanmanız kremimizin etkisini azaltmaz. Ürünümüz tüm cilt tiplerine uygun ve harici kullanım içindir, dolayısıyla cildinizde diğer bakım ürünleriyle birlikte kullanabilirsiniz. Ancak, kremden önce cildinizin tamamen temiz ve kuru olmasına özen göstermeniz etkisini artırabilir. Sorularınız olursa her zaman yardımcı oluruz. Afiyetle kullanın!"
  },
  {
    id: 3,
    category: "TEKSTİL - BEDEN SORUNU",
    customerName: "**** ****",
    date: "27 Kasım 2025 14:32",
    question: "Bu pantolonun bedeni küçük mü kalıyor? 38 beden giyiyorum hangisini almalıyım?",
    answer: "Merhabalar, ürünümüz normal kalıp özelliğine sahiptir. 38 beden giyiyorsanız kendi bedeninizi tercih edebilirsiniz. Ancak bol kesim seviyorsanız bir beden büyük almanızı öneririz. Bel ve kalça ölçülerinizi ürün açıklamasındaki beden tablosuyla karşılaştırırsanız daha net karar verebilirsiniz. Yardımcı olabileceğimiz başka bir şey varsa lütfen sorun!"
  },
  {
    id: 4,
    category: "TEKSTİL - KUMAŞ ÖZELLİĞİ",
    customerName: "**** ****",
    date: "27 Kasım 2025 18:45",
    question: "Kumaş terletir mi? Yazlık mı kışlık mı?",
    answer: "Merhabalar, ürünümüz %100 pamuklu dokuma kumaştan üretilmiştir ve terletmez. Nefes alan yapısı sayesinde 4 mevsim rahatlıkla kullanabilirsiniz. Özellikle ilkbahar ve yaz aylarında tercih edilmektedir. Herhangi bir sorunuz olursa her zaman yardımcı olmaktan memnuniyet duyarız!"
  },
  {
    id: 5,
    category: "ELEKTRONİK - GARANTİ",
    customerName: "**** ****",
    date: "28 Kasım 2025 09:12",
    question: "Garantisi Türkiye garantisi mi? Servisi var mı?",
    answer: "Merhabalar, ürünümüz 2 yıl resmi distribütör garantisi ile gönderilmektedir. Türkiye genelinde yetkili servislerde geçerlidir. Garanti belgesi ürünle birlikte kutuda yer almaktadır. Herhangi bir sorun yaşamanız durumunda bize ulaşabilir veya en yakın yetkili servise başvurabilirsiniz. Keyifli alışverişler dileriz!"
  },
  {
    id: 6,
    category: "ELEKTRONİK - UYUMLULUK",
    customerName: "**** ****",
    date: "28 Kasım 2025 16:27",
    question: "iPhone 13 ile uyumlu mu?",
    answer: "Merhabalar, evet ürünümüz iPhone 13 ile tam uyumludur. Ayrıca iPhone 12, 13, 14 ve 15 serisi tüm modellerde sorunsuz çalışmaktadır. Plug and play özelliği sayesinde herhangi bir ayar gerektirmez. Başka sorularınız varsa her zaman yardımcı olmaktan mutluluk duyarız!"
  }
];

export const STEPS: Step[] = [
  {
    id: 1,
    icon: Key,
    title: "API Bilgilerinizi Girin",
    description: "Hesabınızı oluşturun, Trendyol API bilgilerinizi sisteme girin — kurulum başlar."
  },
  {
    id: 2,
    icon: Settings,
    title: "Sistem Anında Aktif Olur",
    description: "API bilgilerinizi girdiğiniz anda SellerPilot mağazanıza bağlanır. Beklemenize gerek yok."
  },
  {
    id: 3,
    icon: Moon,
    title: "Rahat Uyuyun",
    description: "AI asistanınız 7/24 soruları cevaplar, ürün önerir, satış yapar. Siz sadece büyüyün."
  }
];

export const FEATURES: Feature[] = [
  {
    id: 1,
    icon: Zap,
    title: "15 Saniyede Otomatik Cevap",
    description: "Müşteri sorusu geldiği anda cevaplanır. Bekleme yok, mağaza puanınız yükselir."
  },
  {
    id: 2,
    icon: UserCheck,
    title: "Ürünlerinizi Öğrenir",
    description: "Yapay zekâ ürün bilgilerinizi ve güncel içerikleri tarar. Eğer bilgi yoksa, soruyu uzmana yönlendirir — yanlış cevap vermez."
  },
  {
    id: 3,
    icon: ShoppingBag,
    title: "Cross-Sell & Upsell Yapar",
    description: "Müşteri farklı bir ürün sorarsa mağazanızdan alternatif önerir. Sizin yerinize satış yapar."
  },
  {
    id: 4,
    icon: MessageCircle,
    title: "İnsan Gibi Cevaplar",
    description: "Merhabalar ile başlar, kısa ve samimi konuşur. Müşteriler AI olduğunu fark etmez."
  },
  {
    id: 5,
    icon: Box,
    title: "Stok Durumunu Bildirir",
    description: "Stokta var mı? sorusuna doğru cevap verir. Müşteri deneyimi bozulmaz."
  },
  {
    id: 6,
    icon: Moon,
    title: "Uyku Yok, Tatil Yok",
    description: "Gece yarısı, hafta sonu, bayram — fark etmez. Her an aktif, her zaman hazır."
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    question: "Kurulum ne kadar sürer?",
    answer: "Hesabınızı oluşturup API bilgilerinizi girdiğiniz anda sistem aktif olur. Herhangi bir bekleme süresi yoktur."
  },
  {
    id: 2,
    question: "Yanlış cevap verirse ne olur?",
    answer: "Sistem bilgi yoksa cevap vermez. Soru otomatik olarak size e-posta ile iletilir ve uzmana yönlendirilir."
  },
  {
    id: 3,
    question: "Tüm ürünlerime uygulanır mı?",
    answer: "Evet, mağazanızdaki tüm ürünler için çalışır. Ürün bilgilerinizi otomatik olarak tarar ve her ürüne özel cevaplar verir."
  },
  {
    id: 4,
    question: "Fiyatlandırma nasıl?",
    answer: "Aylık soru hacminize göre 4 farklı plan sunuyoruz: Başlangıç (100 soru/ay, 499₺), Küçük Esnaf (300 soru/ay, 1.299₺), Büyüyen Marka (3.000 soru/ay, 6.999₺), Kurumsal (10.000 soru/ay, 14.999₺). Tüm planlar KDV dahil olup 7 günlük ücretsiz deneme ile başlar. Soru limitinizi aşarsanız sistem sizi bilgilendirir."
  },
  {
    id: 5,
    question: "Trendyol onaylı mı?",
    answer: "Evet. Trendyol'un resmi API'sini kullanıyoruz ve Trendyol'un belirlediği kurallara tam uyumlu çalışıyoruz. Hesabınızda herhangi bir risk veya kısıtlama oluşturmaz."
  },
  {
    id: 6,
    question: "Müşterilerim AI olduğunu anlar mı?",
    answer: "Hayır. Cevaplar doğal Türkçe ve insan tonunda oluşturulur. Marka dilinizi siz belirlersiniz — kurumsal da olabilir, samimi de."
  },
  {
    id: 7,
    question: "İstediğim zaman iptal edebilir miyim?",
    answer: "Evet, aylık sözleşme ile çalışıyoruz. Herhangi bir taahhüt veya ceza olmadan dilediğiniz zaman iptal edebilirsiniz."
  }
];
