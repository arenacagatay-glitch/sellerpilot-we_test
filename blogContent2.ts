export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  minutes: number;
  content: string;
};

export const POSTS_2: BlogPost[] = [
  {
    slug: 'musteri-sorusunu-satisa-cevirmek',
    title: 'Her Müşteri Sorusu Bir Satış Fırsatıdır',
    description:
      'Trendyol’da soru soran müşteri en sıcak müşteridir. Soruyu satışa çevirmenin, alternatif önermenin ve kampanyayı doğru anda hatırlatmanın yolları.',
    date: '2026-07-10',
    category: 'Satış',
    minutes: 5,
    content:
      '## Soru soran müşteri, en sıcak müşteridir\n\n' +
      'Trendyol’da bir müşteri sorusu geldiğinde çoğu satıcı bunu bir angarya gibi görür: cevapla, kapat, sıradakine geç. Oysa müşteri sorusu, mağazanıza gelen en net satın alma sinyalidir. Düşünün: bu kişi ürünü bulmuş, fotoğraflara bakmış, fiyatı görmüş ve hâlâ sayfada. Üstelik klavyeye uzanıp size bir şey yazacak kadar ilgili. Reklamla bu sıcaklıkta bir müşteriye ulaşmak için para ödüyorsunuz; soru soran müşteri ise ayağınıza kadar gelmiş durumda.\n\n' +
      'Sorunun kendisi de niyeti ele verir. Kimse almayı düşünmediği bir ürünün kumaşını, bedenini, kargo süresini sormaz. Soru geldiyse, karar aşamasındaki bir müşteri son bir engel ile karşı karşıyadır. O engeli kaldırdığınız anda satış sizindir; kaldıramazsanız müşteri bir sonraki mağazanın sayfasına geçer.\n\n' +
      '## Hız neden bu kadar önemli\n\n' +
      'Trendyol’da müşteri tek bir mağazaya bağlı değildir. Aynı ürünün onlarca benzeri, bir arama sonucu uzaklıktadır. Sorusuna saatlerce cevap gelmeyen müşteri sizi beklemez; benzer ürünü satan ve sorusuna daha önce cevap verilmiş bir mağazadan alışverişini tamamlar. Bu yüzden cevabın kalitesi kadar zamanlaması da satışın parçasıdır. Akşam gelen soruya ertesi öğlen dönen satıcı, aslında cevabı değil taziyeyi yazıyordur; müşteri çoktan gitmiştir.\n\n' +
      '## Yok demek sohbeti bitirir, alternatif önermek satışı başlatır\n\n' +
      'En sık kaçırılan fırsat şudur: müşteri belirli bir beden, renk ya da model sorar, o varyant stokta yoktur ve satıcı tek kelimeyle kapatır: maalesef. Bu cevap doğrudur ama eksiktir. Müşterinin ihtiyacı ortadan kalkmadı; sadece sizin o üründeki stoğunuz bitti. Mağazanızda büyük ihtimalle aynı ihtiyacı karşılayan başka bir ürün var.\n\n' +
      'Yok cevabının yanına stokta olan yakın bir alternatifi eklemek, sohbeti bitirmek yerine yeni bir satış görüşmesi açar. Aradığınız model kalmadı ama benzer kesimde şu ürünümüz mevcut demek, müşteriye hem ilgilenildiğini hissettirir hem de mağazanızda kalması için somut bir sebep verir. Alternatif önerirken iki kurala dikkat edin: önerdiğiniz ürün gerçekten stokta olsun ve gerçekten benzer olsun. Alakasız ürün önermek, hiç önermemekten daha kötü bir izlenim bırakır.\n\n' +
      '## Kampanyayı doğru anda hatırlatmak\n\n' +
      'Mağazanızda geçerli bir kampanya varsa, bunu duyurmanın en etkili anı ürün sayfası değil, müşterinin soru sorduğu andır. Çünkü o anda müşteri zaten sizinle konuşuyor ve karar eşiğinde duruyor. Kargo süresini soran bir müşteriye cevabın sonunda yürüyen kampanyayı bir cümleyle hatırlatmak, kararı sizin lehinize çevirebilir.\n\n' +
      'Burada ölçü önemli: kampanya hatırlatması cevabın eki olmalı, kendisi olmamalı. Müşteri sorusuna önce net cevap almalı; kampanya cümlesi en sonda, kısa ve doğal durmalı. Sorusu geçiştirilip önüne kampanya konulan müşteri, kendini bir satış hunisine düşmüş gibi hisseder ve güven kaybolur.\n\n' +
      '## Her soru satış fırsatı değildir: iade ve şikâyet\n\n' +
      'Bu yazının en önemli uyarısı belki de şu: iade talebine ya da şikâyete satış cümlesiyle dönmek, yapabileceğiniz en pahalı hatadır. Ürünü beğenmeyip iade etmek isteyen ya da kargosu geciktiği için sinirli olan bir müşteriye kampanya hatırlatmak, yangına körükle gitmektir. O anda müşterinin tek beklentisi sorununun ciddiye alınmasıdır.\n\n' +
      'Şikâyet anında satış refleksi göstermek genellikle kötü yorumla, düşük puanla ve bazen ürün sayfanızın altında herkesin okuyacağı sert bir değerlendirmeyle sonuçlanır. Kural basit: müşteri alım modundayken sat, sorun modundayken çöz. Sorunu düzgün çözülen müşteri zaten mağazanıza bir daha gelir; asıl uzun vadeli satış budur.\n\n' +
      '## Sık sorulan sorular\n\n' +
      '### Her soruya alternatif ürün önermeli miyim?\n\n' +
      'Hayır. Alternatif önerisi, müşterinin aradığı ürün ya da varyant stokta yoksa ve mağazanızda gerçekten benzer bir seçenek varsa anlamlıdır. Ürünü stokta olan, sadece bilgi isteyen müşteriye net cevap yeterlidir; her cevaba ürün sıkıştırmak samimiyeti bozar.\n\n' +
      '### Kampanya hatırlatmak müşteriyi rahatsız etmez mi?\n\n' +
      'Doğru anda ve doğru dozda yapılırsa etmez. Satın alma niyetiyle soru soran müşteriye, sorusu tam cevaplandıktan sonra tek cümleyle kampanyadan bahsetmek bilgilendirmedir. Rahatsız eden şey, sorunun geçiştirilip cevabın reklama dönüşmesidir.\n\n' +
      '### Soruya ne kadar sürede cevap vermeliyim?\n\n' +
      'Ne kadar erken, o kadar iyi. Müşteri soru sorduğu anda karar aşamasındadır ve rakip mağazalar bir tık uzağındadır. Saatler içinde değil dakikalar içinde dönen cevap, satışın hâlâ sizde kalma ihtimalini ciddi şekilde artırır.\n\n' +
      '## SellerPilot bunu sizin yerinize yapar\n\n' +
      'SellerPilot, Trendyol mağazanıza gelen soruları saniyeler içinde cevaplar; aranan ürün stokta yoksa katalogdan stoktaki uygun alternatifi önerir ve tanımladığınız kampanyayı cevaba doğal biçimde ekler. İade ve şikâyet içeren mesajlarda ise satış tamamen kapalıdır; bu sorular satış cümlesi olmadan ele alınır. sellerpilot.cloud üzerinden 30 gün ücretsiz deneyebilirsiniz.\n',
  },
  {
    slug: 'trendyol-magaza-puani-nasil-korunur',
    title: 'Trendyol Mağaza Puanını Korumanın Az Konuşulan Yolları',
    description:
      'Trendyol mağaza puanı sadece kargo ve iadeyle ilgili değil. Soru-cevap kalitesi, yanlış bilgi ve cevap dili puanınızı sessizce nasıl etkiliyor?',
    date: '2026-07-14',
    category: 'Trendyol Rehberi',
    minutes: 6,
    content:
      '## Mağaza puanı sadece kargoyla ilgili değil\n\n' +
      'Trendyol mağaza puanı denince akla hep aynı şeyler gelir: kargoyu zamanında ver, iadeyi hızlı onayla, ürünü doğru gönder. Bunlar elbette temel. Ama mağaza puanını ve daha da önemlisi mağaza algısını sessizce aşındıran bir alan var ki çok az konuşulur: soru-cevap kaliteniz. Müşterilerin ürün sayfasında gördüğü her cevap, mağazanızın herkese açık vitrinidir ve bu vitrin, satın alma kararlarını sandığınızdan çok etkiler.\n\n' +
      '## Cevaplarınız herkese açık bir vitrindir\n\n' +
      'Bir müşteri soru sorduğunda, verdiğiniz cevabı sadece o müşteri okumaz. Ürün sayfasını ziyaret eden herkes o soru-cevap geçmişini görür. Yarım yamalak, alakasız ya da baştan savma cevaplar; ürüne bakan yüzlerce potansiyel müşteriye bu mağaza müşterisiyle ilgilenmiyor mesajı verir. Tersine, net ve özenli cevaplar daha soru sorulmadan güven inşa eder. Yani her cevabı tek bir müşteriye değil, o sayfaya gelecek herkese yazıyorsunuz.\n\n' +
      '## Yanlış bilgi, iade ve kötü yorum olarak geri döner\n\n' +
      'Soru-cevaptaki en pahalı hata cevapsız bırakmak değil, yanlış cevap vermektir. Müşteriye kalıbı dar olan bir ürün için rahat kesim derseniz, o ürün satılır ama hikâye orada bitmez: ürün gelir, olmaz, iade süreci başlar. İade maliyetine ek olarak, kendini yanıltılmış hisseden müşteri bunu genellikle yorumda dile getirir. Beden tablosuna güvenmeyin, cevapta söylenene de denk gelmiyor tarzı bir yorum, o ürünün sayfasında aylarca kalır ve sonraki satışları baltalar.\n\n' +
      'Bu yüzden emin olmadığınız bilgiyi tahminle doldurmak, kısa vadede satış kazandırsa bile orta vadede iade oranı, olumsuz yorum ve düşen mağaza algısı olarak faturasını keser. Bilmiyorsanız, doğrusunu öğrenip öyle cevap vermek her zaman daha kârlıdır. Özellikle beden ve ölçü sorularında tahmin, en riskli kumardır; kategoriden kategoriye kalıplar değişir ve tek bir yanlış yönlendirme iade zinciri başlatır.\n\n' +
      '## Cevap içinde kural ihlali: sessiz risk\n\n' +
      'Az bilinen ama önemli bir konu: Trendyol, soru cevaplarında link paylaşımına izin vermez; bu tür cevaplar onaylanmaz. Telefon numarası, e-posta adresi gibi platform dışına yönlendiren bilgiler de aynı şekilde risklidir. İyi niyetle detaylı bilgi için bize ulaşın deyip iletişim bilgisi bırakan satıcı, cevabının yayınlanmamasıyla uğraşır; üstelik bu alışkanlık mağaza nezdinde gereksiz bir kural ihlali sicili oluşturur.\n\n' +
      'Çözüm basit ama disiplin ister: müşterinin ihtiyacı neyse cevabın içinde, platformun içinde karşılanmalı. Cevaba sığmayacak kadar detaylı bir konu varsa bile müşteriyi dışarı yönlendirmek yerine, ürün açıklamasını o detayı içerecek şekilde güncellemek doğru yoldur.\n\n' +
      '## Tutarlı cevap dili, görünmez profesyonelliktir\n\n' +
      'Mağazanızın cevaplarını alt alta koyduğunuzda nasıl görünüyor? Bir cevap resmî, diğeri argoya yakın, üçüncüsü iki kelimelik ise; müşteri karşısında kurumsal bir mağaza değil, o gün kimin müsait olduğuna göre değişen bir tezgâh görür. Tutarlı dil; aynı hitap şekli, aynı özen seviyesi ve aynı kapanış üslubu demektir. Bu tutarlılık tek tek fark edilmez ama toplamda mağazanın güvenilir ve oturmuş algılanmasını sağlar.\n\n' +
      'Cevap dilini tutarlı tutmanın pratik yolu, mağazanız için birkaç temel prensip belirlemektir: müşteriye nasıl hitap edilecek, olumsuz durum nasıl ifade edilecek, cevap nasıl kapanacak. Cevabı kim yazarsa yazsın bu prensipler değişmemeli. Mağaza büyüyüp soru hacmi artınca bu disiplin elle sürdürülmesi en zor şeylerden biri hâline gelir; ama vazgeçildiği anda vitrin dağınık görünmeye başlar.\n\n' +
      '## Sık sorulan sorular\n\n' +
      '### Soru-cevap doğrudan mağaza puanını etkiler mi?\n\n' +
      'Cevap kalitesinin etkisi çoğunlukla dolaylı ama güçlüdür: yanlış bilgi iadeye, iade ve hayal kırıklığı düşük puanlı yoruma dönüşür. Ayrıca cevapsız ya da özensiz soru-cevap geçmişi, sayfayı ziyaret eden müşterilerin satın alma kararını olumsuz etkiler.\n\n' +
      '### Cevapta mağaza telefonumu paylaşabilir miyim?\n\n' +
      'Paylaşmamalısınız. Link paylaşımı cevabın onaylanmamasına yol açar; telefon ve e-posta gibi platform dışına yönlendiren bilgiler de risklidir. Müşterinin sorusunu platform içinde, cevabın kendisiyle çözmek hem kurallara uygun hem de daha profesyoneldir.\n\n' +
      '### Emin olmadığım bir soruya ne yapmalıyım?\n\n' +
      'Tahmin etmeyin. Yanlış bilginin bedeli, geç cevabın bedelinden çok daha ağırdır. Doğru bilgiyi ürün detaylarından ya da tedarikçinizden teyit edip öyle dönün; beden ve ölçü gibi konularda bu kural iki kat geçerlidir.\n\n' +
      '## SellerPilot bunu sizin yerinize yapar\n\n' +
      'SellerPilot cevaplarınızı mağazanızın kendi geçmiş cevaplarından öğrendiği üslupla yazar, link, telefon ve e-posta gibi kural ihlali yaratacak ifadeleri cevaplardan otomatik temizler. Beden sorularında kategoriye uygun beden tablosunu kullanır; tablo yoksa tahmin etmek yerine soruyu e-postayla size iletir. sellerpilot.cloud üzerinden 30 gün ücretsiz deneyebilirsiniz.\n',
  },
  {
    slug: 'trendyol-urun-aciklamasi-soru-azaltma',
    title: 'Aynı Soru Tekrar Tekrar Geliyorsa Suç Açıklamanızda',
    description:
      'Trendyol’da aynı sorunun tekrar gelmesi eksik ürün açıklaması sinyalidir. Açıklamaya hangi bilgiler girmeli, sorular nasıl azalır?',
    date: '2026-07-18',
    category: 'Trendyol Rehberi',
    minutes: 5,
    content:
      '## Tekrarlayan soru, eksik açıklamanın faturasıdır\n\n' +
      'Trendyol’da bir ürününüze üst üste aynı soru geliyorsa; kumaşı nedir, ölçüsü kaç, bedeni normal mi; bunun tek bir anlamı vardır: ürün açıklamanız o soruyu cevaplamıyor. Müşteri soru sormayı sevmez. Soru sormak beklemek demektir ve beklemek, çoğu zaman başka mağazadan almak demektir. Yani gelen her tekrar soru, aslında iki haberi birden verir: açıklamanız eksik ve muhtemelen bu yüzden sessizce satış kaybediyorsunuz.\n\n' +
      'Şöyle düşünün: soru soran her müşteriye karşılık, aynı bilgiyi merak edip sormaya üşenen ve sayfayı terk eden çok daha kalabalık bir grup vardır. Sorular buzdağının görünen kısmıdır. Bu yüzden çok soru alan ürün listesi, aslında açıklaması acilen elden geçmesi gereken ürün listesidir.\n\n' +
      '## Sorular size ne anlatıyor: bir teşhis aracı olarak soru-cevap\n\n' +
      'Soru geçmişi, mağazanızın en dürüst geri bildirim kanalıdır. Müşteri anketi doldurmaz ama merak ettiğini sorar. Ürün bazında son sorulara bakıp basit bir tasnif yapın: hangi soru kaç kez gelmiş? Bir bilgi iki-üç kez sorulduysa tesadüf olabilir; sürekli soruluyorsa açıklamanızda o bilginin ya hiç olmadığı ya da bulunamayacak kadar gömülü olduğu kesindir. Bilginin açıklamada var olması yetmez; müşterinin telefon ekranında iki saniyede görebileceği yerde olması gerekir.\n\n' +
      '## Açıklamaya mutlaka girmesi gereken bilgiler\n\n' +
      'Kategoriye göre detaylar değişir ama tekrar sorulan soruların büyük kısmı şu başlıklarda toplanır:\n\n' +
      '- **Beden ve kalıp:** Ürün normal kalıp mı, dar mı, geniş mi? Müşteri kendi bedenini mi almalı, bir beden büyük mü tercih etmeli? Mankenin giydiği beden ve boyu gibi somut referanslar, beden sorularını ciddi oranda azaltır.\n' +
      '- **Ölçüler:** Giyimde göğüs, bel, boy ölçüleri; çanta, mobilya, ev tekstili gibi ürünlerde en-boy-derinlik. Ölçü kaç cm sorusu, cevabı açıklamada olmayan mağazaların klasiğidir.\n' +
      '- **Kullanım ve bakım:** Yıkama talimatı, kurulum gerekip gerekmediği, pil ya da aksesuarın kutuya dahil olup olmadığı.\n' +
      '- **İçerik ve materyal:** Kumaş bileşimi, kozmetikte içerik listesi, gıda temaslı ürünlerde malzeme bilgisi. Müşteri alerjisi ya da hassasiyeti için soruyorsa, bu bilginin yokluğu doğrudan satış kaybıdır.\n\n' +
      'Bir de başlık tarafı var: müşterinin en çok merak ettiği ayırt edici özellik başlıkta yer alırsa, müşteri açıklamaya inmeden cevabını görür. Başlık sadece arama için değil, ilk saniyedeki soruları eritmek için de çalışır.\n\n' +
      '## Açıklama iyileşince ne değişir\n\n' +
      'Açıklamasını bu gözle elden geçiren satıcıların gördüğü fark nettir: aynı sorunun tekrarı azalır, gelen sorular daha nitelikli hâle gelir ve cevap yükü hafifler. Daha önemlisi, sormadan vazgeçip giden o sessiz kalabalığın bir kısmı artık cevabını sayfada bulup satın alır. Ayrıca doğru bilgiyle alan müşterinin beklentisi gerçekle örtüştüğü için iade ve olumsuz yorum riski de düşer. Yani tek bir açıklama düzenlemesi; soru yükü, dönüşüm ve iade oranı olmak üzere üç kaleme birden dokunur.\n\n' +
      'Nereden başlamalı? En çok soru alan ürünlerinizden. Tüm kataloğu bir günde düzeltmeye çalışmak yerine, soru yoğunluğuna göre sıralayıp en gürültülü beş-on üründen başlamak, en kısa sürede en çok etkiyi verir. Her düzenlemeden sonra o ürüne gelen soruları izleyin; aynı soru hâlâ geliyorsa bilgi ya eksiktir ya da yanlış yerdedir.\n\n' +
      '## Sık sorulan sorular\n\n' +
      '### Açıklamam zaten uzun, neden hâlâ soru geliyor?\n\n' +
      'Uzunluk ile cevaplayıcılık aynı şey değildir. Müşteri telefonda hızlıca göz gezdirir; aradığı bilgi paragraf arasına gömülüyse yok sayar. Kritik bilgileri madde madde, başa yakın ve taranabilir şekilde vermek, uzun düz metinden çok daha etkilidir.\n\n' +
      '### Hangi ürünlerin açıklamasını önce düzeltmeliyim?\n\n' +
      'En çok soru alan ürünlerden başlayın. Soru yoğunluğu, açıklama eksiğinin en güvenilir sinyalidir. Ardından çok görüntülenip az satan ürünlere bakın; orada da müşterinin karar vermesine yetecek bilgi eksik olabilir.\n\n' +
      '### Soruları azaltmak soru-cevabı gereksiz mi yapar?\n\n' +
      'Hayır. Amaç soruyu sıfırlamak değil, cevabı açıklamada olan tekrar soruları eritmektir. Ürüne özgü, kişisel duruma bağlı sorular her zaman gelecektir ve bunlar satışa en yakın sorulardır; asıl mesai onlara kalmalıdır.\n\n' +
      '## SellerPilot bunu sizin yerinize yapar\n\n' +
      'SellerPilot çok soru alan ürünlerinizi tespit eder ve gelen sorulardan yola çıkarak o ürün için başlık ve açıklama önerisi hazırlar; beğendiğiniz öneriyi tek tuşla Trendyol’a gönderirsiniz. Açıklama iyileşene kadar gelen sorular da saniyeler içinde otomatik cevaplanmaya devam eder. sellerpilot.cloud üzerinden 30 gün ücretsiz deneyebilirsiniz.\n',
  },
  {
    slug: 'eticarette-yapay-zeka-musteri-sorulari',
    title: 'E-ticarette Yapay Zekâ ile Müşteri Sorularını Cevaplamak: Neye Dikkat Etmeli?',
    description:
      'Yapay zekâ ile müşteri sorularını cevaplarken uydurma riski, insana devir prensibi, marka sesi ve onay modu: satıcı için dikkat listesi.',
    date: '2026-07-22',
    category: 'Yapay Zekâ',
    minutes: 6,
    content:
      '## Yapay zekâ cevap yazabilir, peki güvenilir mi?\n\n' +
      'E-ticarette yapay zekâ ile müşteri sorularını cevaplamak artık bir hayal değil; asıl soru, bunun mağazanız için güvenli olup olmadığı. Çünkü müşteri sorusu cevaplamak, blog yazısı yazdırmaya benzemez: verilen her cevap mağazanız adına verilmiş bir sözdür. Yanlış söz iade, kötü yorum ve puan kaybı olarak geri döner. Bu yazıda, soru-cevap işini yapay zekâya devretmeden önce sormanız gereken soruları satıcı gözüyle ele alıyoruz.\n\n' +
      '## En büyük risk: kendinden emin uydurma\n\n' +
      'Yapay zekâ modellerinin bilinen zaafı, bilmediği şeyi bilmiyorum demek yerine kendinden emin bir dille uydurabilmesidir. Sohbet uygulamasında bu bir kusurdur; e-ticarette ise doğrudan paraya dokunan bir sorundur. Stokta olmayan bir ürün için var diyen, kalıbı hakkında fikri olmadığı ürüne rahat kesim yazan, kargo süresini kafasından atan bir sistem size satış değil, iade ve şikâyet üretir.\n\n' +
      'Bu yüzden bir yapay zekâ çözümünü değerlendirirken sorulacak ilk soru şudur: cevaplarını neye dayandırıyor? Doğru kurulmuş bir sistem, mağazanın gerçek verisiyle konuşur: ürün bilgisi katalogdan, stok durumu gerçek stoktan, sipariş durumu sipariş numarası üzerinden gerçek sipariş kaydından gelmelidir. Genel bilgisine dayanarak boşluk dolduran sistem, ne kadar akıcı yazarsa yazsın mağazanız için risktir.\n\n' +
      '## Altın prensip: emin değilse insana devretsin\n\n' +
      'İyi bir yapay zekâ asistanının değeri, her soruyu cevaplamasında değil, hangi soruyu cevaplamaması gerektiğini bilmesindedir. Elindeki veriyle net cevap veremeyeceği bir soru geldiğinde sistemin yapması gereken şey tahmin yürütmek değil, soruyu satıcıya devretmektir. Bu devir mekanizmasının varlığı, otomasyonun güvenlik sigortasıdır.\n\n' +
      'Somut bir örnek beden konusudur: kategorisine uygun beden bilgisi tanımlıysa sistem cevaplayabilir; ama elinde tablo yoksa yaklaşık bir tahmin yazmak yerine soruyu size iletmesi gerekir. Yanlış beden tavsiyesinin bedeli iade olduğu için, bu tek kural bile otomasyonun kârlılığını belirler.\n\n' +
      '## Cevaplar sizin sesinizle mi çıkıyor?\n\n' +
      'Mağazanızın yıllar içinde oturmuş bir konuşma tarzı vardır: hitap şekliniz, samimiyet dozunuz, kapanış cümleniz. Jenerik bir robot dili, müşteriye başka biriyle konuştuğunu hemen hissettirir ve cevaplar arasında üslup kopukluğu yaratır. İyi bir sistem, mağazanın kendi geçmiş cevaplarından üslubu öğrenmeli ve yeni cevapları o sesle yazmalıdır. Böylece otomasyon devreye girdiğinde müşteri açısından değişen tek şey cevap hızı olur; ses aynı kalır.\n\n' +
      '## Kontrol satıcıda kalmalı: onay modu\n\n' +
      'Otomasyona geçiş bir güven ilişkisidir ve güven test edilerek kurulur. Bu yüzden iyi bir sistemde onay modu bulunmalıdır: yapay zekâ cevabı hazırlar, siz görüp onayladıktan sonra yayınlanır. Başlangıçta her cevabı onaydan geçirir, sistemin kalitesini kendi gözünüzle görürsünüz; güven oturdukça otomatik yayına geçersiniz. Baştan itibaren her şeyi kör biçimde otomatiğe bağlamak zorunda bırakan bir araç, kontrolü sizden alıyor demektir.\n\n' +
      '## Hangi sorular asla tam otomatiğe bırakılmamalı?\n\n' +
      'Teknoloji ne kadar iyi olursa olsun, bazı soru tipleri insan yargısı ister:\n\n' +
      '- **Sağlıkla ilgili sorular:** Alerji, hassasiyet, çocukta ya da hamilelikte kullanım gibi konular tıbbi sınıra girer; burada otomatik kesin hüküm verilmemelidir.\n' +
      '- **Şikâyet ve iade:** Sinirli bir müşteriye yaklaşım, özür dozu ve çözüm inisiyatifi satıcının kararı olmalıdır. Üstelik bu anlarda satış cümlesi kurmak kesinlikle yasak olmalıdır; şikâyet eden müşteriye kampanya hatırlatan sistem, yangını büyütür.\n' +
      '- **Sonucu ağır özel durumlar:** Yüksek tutarlı sipariş sorunları ya da hukuki ima içeren mesajlar gibi istisnai durumlar da insana gitmelidir.\n\n' +
      'İyi kurgulanmış bir sistemde otomasyon rutin yükü alır; kritik azınlık ise size düşer. Bu arada yapay zekânın e-ticaretteki rolü soru-cevapla da sınırlı değil; örneğin tek ürün fotoğrafından profesyonel görsel üreten araçlar da aynı temkinli değerlendirmeyi hak ediyor, ama o ayrı bir yazının konusu.\n\n' +
      '## Sık sorulan sorular\n\n' +
      '### Yapay zekâ cevapları müşteriyi rahatsız eder mi?\n\n' +
      'Cevap doğru, hızlı ve mağazanın kendi üslubuyla yazılmışsa müşteri farkı hissetmez; hissettiği şey hızla ve netlikle ilgilenilmiş olmaktır. Rahatsız eden şey yapay zekânın kendisi değil, jenerik dil ve yanlış bilgidir.\n\n' +
      '### Otomasyona geçince kontrolü kaybeder miyim?\n\n' +
      'Doğru araçla hayır. Onay modu sayesinde başlangıçta her cevap sizden geçer; sistemin emin olamadığı sorular zaten size devredilir. Kontrol kademeli olarak, sizin kararınızla devredilir; asla tamamen elden çıkmaz.\n\n' +
      '### Her soruyu yapay zekâ mı cevaplamalı?\n\n' +
      'Hayır ve bu bir eksik değil, tasarım ilkesidir. Sağlık, şikâyet ve iade gibi konular insan yargısı ister. Sağlıklı kurulum, rutin soruların otomatik cevaplanması ve hassas soruların satıcıya iletilmesidir.\n\n' +
      '## SellerPilot bunu sizin yerinize yapar\n\n' +
      'SellerPilot cevaplarını mağazanızın gerçek verisine dayandırır: sipariş numarasıyla gerçek sipariş durumunu kontrol eder, beden sorularında kategoriye uygun tabloyu kullanır, tablo yoksa tahmin etmez ve soruyu e-postayla size iletir; iade ve şikâyette satış tamamen kapalıdır. Üslubu kendi cevaplarınızdan öğrenir, dilerseniz onay modunda her cevap yayınlanmadan önce sizden geçer. sellerpilot.cloud üzerinden 30 gün ücretsiz deneyebilirsiniz.\n',
  },
];
