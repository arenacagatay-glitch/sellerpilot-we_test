import { Zap, ShoppingBag, MessageCircle, Box, Moon, Key, Settings, UserCheck, PackageCheck, ShieldCheck, Sparkles, Camera } from 'lucide-react';
import { ChatExample, FaqItem, Feature, StatCard, Step } from './types';

// ÖNEMLİ: Google Apps Script'ten aldığın Web App URL'ini buraya yapıştır.
// Dağıtım yaparken "Who has access" kısmının "Anyone" olduğundan emin ol.
export const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwtGXVec6cRsfgpJpb5GAODf8RDrkLoQvwMsu6E1OOBqxuummZdZs2BxUbRoYzSepc/exec"; 

export const WHATSAPP_URL = "https://wa.me/905306216139";
export const APP_URL = "https://app.sellerpilot.cloud";

export const NAV_LINKS = [
  { label: 'Özellikler', href: '#features' },
  { label: 'Farkımız', href: '#fark' },
  { label: 'Nasıl Çalışır?', href: '#how-it-works' },
  { label: 'Örnekler', href: '#examples' },
  { label: 'Görsel Stüdyo', href: '#ai-studyo' },
  { label: 'Danışmanlık', href: '/danismanlik' },
  { label: 'Fiyatlar', href: '#pricing' },
  { label: 'SSS', href: '#faq' },
];

export const STAT_CARDS: StatCard[] = [
  {
    id: 1,
    title: "Saniyeler İçinde Cevap",
    description: "Soru geldiği an cevaplanır. Müşteri beklemez, başka mağazaya kaçmaz, mağaza puanınız yükselir.",
    imageUrl: "",
    iconLabel: "⚡"
  },
  {
    id: 2,
    title: "Satış Yapan Cevaplar",
    description: "Sadece cevaplamaz; müşteri farklı bir ürün ararsa mağazanızdan alternatif önerir. Soruları satışa çevirir.",
    imageUrl: "",
    iconLabel: "🛍️"
  },
  {
    id: 3,
    title: "Emin Değilse Susar",
    description: "Bilmediği konuda tahmin yürütmez. Zor soruyu size e-posta ile iletir — yanlış cevap riski sıfır.",
    imageUrl: "",
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
    answer: "Merhabalar, [ÜRÜN ADI GİZLİ] parfümümüz şeftali, sedir, misk ve amber gibi sıcak ve zarif notalara sahip, ergen vanilya kokusu barındırmayan sofistike bir seçenek. Buğday teninize de çok güzel uyum sağlayacaktır. Eğer daha hafif ve ferah bir alternatif isterseniz, sedir ağacı ve yasemin kokusuyla vücut spreyimizi de inceleyebilirsiniz. Her ikisi de kalıcı ve kaliteli formüllere sahiptir."
  },
  {
    id: 2,
    category: "KOZMETİK - CİLT BAKIMI",
    customerName: "**** ****",
    date: "26 Kasım 2025 22:15",
    question: "ürünü sürmeden önce pirinç suyu kullanıyorum sızce kremin etkisini azaltır mı",
    answer: "Merhabalar, pirinç suyu kullanmanız kremimizin etkisini azaltmaz. Ürünümüz tüm cilt tiplerine uygun ve harici kullanım içindir, dolayısıyla cildinizde diğer bakım ürünleriyle birlikte kullanabilirsiniz. Ancak, kremden önce cildinizin tamamen temiz ve kuru olmasına özen göstermeniz etkisini artırabilir. Afiyetle kullanın!"
  },
  {
    id: 3,
    category: "TEKSTİL - BEDEN SORUNU",
    customerName: "**** ****",
    date: "27 Kasım 2025 14:32",
    question: "Bu pantolonun bedeni küçük mü kalıyor? 38 beden giyiyorum hangisini almalıyım?",
    answer: "Merhabalar, ürünümüz normal kalıp özelliğine sahiptir. 38 beden giyiyorsanız kendi bedeninizi tercih edebilirsiniz. Ancak bol kesim seviyorsanız bir beden büyük almanızı öneririz. Bel ve kalça ölçülerinizi ürün açıklamasındaki beden tablosuyla karşılaştırırsanız daha net karar verebilirsiniz."
  },
  {
    id: 4,
    category: "TEKSTİL - KUMAŞ ÖZELLİĞİ",
    customerName: "**** ****",
    date: "27 Kasım 2025 18:45",
    question: "Kumaş terletir mi? Yazlık mı kışlık mı?",
    answer: "Merhabalar, ürünümüz %100 pamuklu dokuma kumaştan üretilmiştir ve terletmez. Nefes alan yapısı sayesinde 4 mevsim rahatlıkla kullanabilirsiniz. Özellikle ilkbahar ve yaz aylarında tercih edilmektedir."
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
    answer: "Merhabalar, evet ürünümüz iPhone 13 ile tam uyumludur. Ayrıca iPhone 12, 13, 14 ve 15 serisi tüm modellerde sorunsuz çalışmaktadır. Plug and play özelliği sayesinde herhangi bir ayar gerektirmez."
  }
];

export const STEPS: Step[] = [
  {
    id: 1,
    icon: Key,
    title: "API Bilgilerinizi Girin",
    description: "Hesabınızı oluşturun, Trendyol satıcı panelinizden API bilgilerinizi kopyalayıp girin. Hepsi bu — teknik bilgi gerekmez."
  },
  {
    id: 2,
    icon: Settings,
    title: "Ürünleriniz Otomatik Yüklenir",
    description: "SellerPilot mağazanıza bağlanır, tüm ürünlerinizi ve açıklamalarınızı kendisi öğrenir. Beklemenize gerek yok, sistem anında aktif."
  },
  {
    id: 3,
    icon: Moon,
    title: "Siz Hayatınıza Dönün",
    description: "Gelen her soru saniyeler içinde cevaplanır. Cevaplanamayan zor sorular e-posta ile size düşer — gerisini düşünmeyin."
  }
];

export const FEATURES: Feature[] = [
  {
    id: 1,
    icon: Zap,
    title: "Saniyeler İçinde Otomatik Cevap",
    description: "Müşteri sorusu geldiği an cevaplanır. Soruda bekleyen müşteri başka mağazadan almaz, mağaza puanınız yükselir."
  },
  {
    id: 2,
    icon: PackageCheck,
    title: "\"Kargom Nerede?\" Sorusunu Bilerek Cevaplar",
    description: "Sipariş numarasını veren müşteriye siparişin o anki gerçek durumunu söyler. Tahmin yok, boş oyalama yok."
  },
  {
    id: 3,
    icon: ShoppingBag,
    title: "Cevap Verirken Satış da Yapar",
    description: "Müşteri aradığı şeyi bulamadığında mağazanızdaki doğru ürünü önerir, kampanyanızı hatırlatır. İade ve şikâyet konuşmalarında satış yapmaya kalkmaz."
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: "Tutamayacağı Sözü Vermez",
    description: "Geciken siparişe \"yarın gelir\", \"2 güne ulaşır\" gibi sözler vermez. Müşteriyi daha çok kızdıracak cümleleri kurmaz."
  },
  {
    id: 5,
    icon: Sparkles,
    title: "İlanlarınızı da Güçlendirir",
    description: "Müşterilerin en çok sorduğu şeylere bakıp ürün başlığınız ve açıklamanız için hazır metin önerir. Beğenirseniz tek tuşla Trendyol'a gönderir."
  },
  {
    id: 6,
    icon: Camera,
    title: "Ürün Fotoğrafınızı Bile Üretir",
    description: "Tek bir fotoğraftan satışa hazır ürün görselleri hazırlar. Stüdyo, model, çekim derdi olmadan ilanınız profesyonel görünür."
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    question: "Kurulum ne kadar sürer?",
    answer: "Hesabınızı oluşturup Trendyol API bilgilerinizi girdiğiniz anda sistem aktif olur. Ürünleriniz otomatik yüklenir, herhangi bir bekleme süresi yoktur."
  },
  {
    id: 2,
    question: "Yanlış cevap verirse ne olur?",
    answer: "Sistemin en önemli kuralı bu: emin olmadığı soruya cevap vermez. Bilgi yoksa soru otomatik olarak size e-posta ile iletilir, siz cevaplarsınız. Tahmine dayalı cevap riski yoktur."
  },
  {
    id: 3,
    question: "Tüm ürünlerime uygulanır mı?",
    answer: "Evet, mağazanızdaki tüm onaylı ürünler için çalışır. Ürün açıklamalarınızı ve özelliklerinizi otomatik tarar, her ürüne özel cevap üretir."
  },
  {
    id: 4,
    question: "Fiyatlandırma nasıl?",
    answer: "Aylık soru hacminize göre 4 farklı plan sunuyoruz: Başlangıç (100 soru/ay, 1.299₺), Küçük Esnaf (300 soru/ay, 2.999₺), Büyüyen Marka (1.000 soru/ay, 8.999₺), Kurumsal (3.000 soru/ay, 19.999₺). Fiyatlara KDV dahil değildir. Tüm planlar 30 günlük ücretsiz deneme ile başlar. Önemli detay: kotanızdan sadece yapay zekânın cevapladığı sorular düşer — size yönlendirilen ve sizin yazdığınız cevaplar ücretsizdir. Soru limitinizi aşarsanız sistem sizi bilgilendirir."
  },
  {
    id: 5,
    question: "Trendyol onaylı mı? Mağazama risk oluşturur mu?",
    answer: "Trendyol'un resmi satıcı API'sini kullanıyoruz ve Trendyol'un belirlediği kurallara tam uyumlu çalışıyoruz. Cevaplar sizin satıcı hesabınız üzerinden, sizin adınıza gönderilir."
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
  },
  {
    id: 8,
    question: "Ürün önerisi ve kampanya özelliği nasıl çalışır? Olmayan bir indirim söyler mi?",
    answer: "Hayır, asla. Sistem yalnızca kataloğunuzda gerçekten var olan ve stokta bulunan ürünleri önerebilir; önerdiği her ürün gerçek katalog verisiyle doğrulanır. Kampanyaları panelden siz tanımlarsınız — tanımlı kampanya yoksa sistem indirim, fiyat veya avantaj uydurmaz. İade, şikâyet, kargo sorunu ve sağlıkla ilgili sorularda öneri hiç devreye girmez: önce müşterinin konusu çözülür. Bu özellik isteğe bağlıdır, panelden tek tuşla açıp kapatabilirsiniz."
  },
  {
    id: 9,
    question: "Her cevabı otomatik göndermek zorunda mıyım?",
    answer: "Hayır. Üç şekilde çalışabilirsiniz: sistem kendi cevaplasın, cevabı hazırlayıp onayınıza sunsun ya da hiç karışmasın. Onay modunda hazırlanan cevabı panelde görür, dilerseniz düzenler, sonra gönderirsiniz. Bir konuşmayı siz devraldığınızda sistem araya girmez."
  },
  {
    id: 10,
    question: "Cevaplarda link veya telefon paylaşılır mı? Mağazam risk altına girer mi?",
    answer: "Hayır. Trendyol; soru-cevap alanında link, telefon numarası, e-posta ve dış kanal yönlendirmesi paylaşılmasını onaylamıyor. Sistem her cevabı gönderilmeden önce denetler; böyle bir içerik varsa temizler, cevap anlamını yitiriyorsa göndermeyip size iletir."
  },
  {
    id: 11,
    question: "Beden ve numara sorularında yanlış yönlendirme yapar mı?",
    answer: "Beden ve numara konusunda tahmin yürütmemesi için özel olarak kısıtlandı. Panele beden tablonuzu girdiyseniz sadece ona dayanarak cevap verir; ayakkabıda numara, giyimde beden gibi her kategoriyi kendi tablosuyla değerlendirir. Tablo yoksa ve müşteri boy/kilo bilgisi vermişse kesin bir beden söylemez, soruyu size iletir."
  },
  {
    id: 12,
    question: "Hangi pazaryerlerinde çalışıyor?",
    answer: "Şu anda Trendyol ile çalışıyoruz ve entegrasyonumuz Trendyol'un resmi satıcı API'si üzerinden yürüyor. Birden fazla Trendyol mağazanız varsa hepsini tek panelden yönetebilir, ayarlarınızı mağazalar arasında kopyalayabilirsiniz. Diğer pazaryerleri yol haritamızda yer alıyor."
  }
];
