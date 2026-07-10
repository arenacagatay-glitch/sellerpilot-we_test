# SellerPilot Panel — Trendyol Ürün Operasyonu

Mevcut ürünlerinizden varyasyon/kombin türetip **Trendyol'a API ile toplu ürün yükleyen**, ürün görsellerini **yapay zekâ ile üreten** operasyon paneli. Excel şablonlarına gerek kalmaz; ürün oluşturma, fiyat/stok güncelleme ve batch takibi tek ekrandan yapılır.

## Özellikler

- **Ürünlerim**: Trendyol'daki mevcut ürünleri listeler (onay durumu, stok, fiyat, görseller).
- **Varyasyon Kurgusu**: Bir ürünü tek tıkla taslağa kopyalayıp N kopya türetme; 2-3 ürünü **kombin/set** olarak birleştirme (set indirimi oranıyla otomatik fiyat). Kategori arama, kategori özelliklerini (attribute) çekip düzenleme.
- **Görsel Stüdyosu**: Referans ürün fotoğrafından `gpt-image-1` ile 4-8 farklı açıdan e-ticaret çekimi üretir (ön cephe, 45°, detay, yaşam alanı, flat-lay, elde, arka yüz, podyum). Dosya adları otomatik olarak boşluksuz/Türkçe karaktersiz üretilir, görseller Supabase public bucket'a yüklenir ve Trendyol'un çekebileceği HTTPS URL'leri alınır. Kendi görsellerinizi de yükleyebilirsiniz.
- **Trendyol'a Gönder**: Taslaklar doğrulanır ve **Ürün V2** servisiyle (`/v2/products`) gönderilir; dönen `batchRequestId` ile onay durumu ve hata sebepleri panelden takip edilir. (Trendyol V1 servisleri 10 Ağustos 2026'da kapanıyor; panel V2 kullanır.)
- **Fiyat & Stok**: Tablodan toplu fiyat/stok güncelleme.

## Kurulum

```bash
cd panel
npm install
cp .env.example .env   # değerleri doldurun
npm start              # http://localhost:5599
```

### .env değerleri

| Değişken | Nereden |
| --- | --- |
| `TRENDYOL_SELLER_ID` | Trendyol Satıcı Paneli → Hesap Bilgileri → Entegrasyon Bilgileri (Cari ID) |
| `TRENDYOL_API_KEY` / `TRENDYOL_API_SECRET` | Aynı sayfa |
| `OPENAI_API_KEY` | platform.openai.com → API Keys (görsel üretimi için) |
| `SUPABASE_URL` | Supabase projesi URL'i |
| `SUPABASE_KEY` | Supabase anon key (bucket'a upload policy tanımlı) |
| `SUPABASE_BUCKET` | `urun-gorselleri` (public bucket) |

> **Güvenlik**: `.env` dosyası `.gitignore`'dadır, asla commit etmeyin. API bilgileriniz bir yere sızarsa Trendyol panelinden **API Bilgilerini Güncelle** ile yenileyin.

## Notlar / Sınırlar

- Trendyol görsel kuralı: barkod başına en fazla 8 görsel, HTTPS zorunlu, önerilen 1200x1800. Üretilen görseller 1024x1536 (aynı en-boy oranı) çıkar.
- Görsel üretim maliyeti (OpenAI `gpt-image-1`): kalite "yüksek" ~0,25$/görsel, "orta" ~0,06$/görsel.
- Yeni ürünler Trendyol onay sürecinden geçer; sonuç **Gönderim Geçmişi**nden sorgulanır.
- Aynı üründen türetilen kopyaların ayrı ilan olarak listelenmesi için `productMainId` her kopyada farklı üretilir (aynı yapılırsa Trendyol bunları tek ürünün varyantları olarak gruplar).
- Kombin/set ürünlerde kategori ve zorunlu özellikleri göndermeden önce kontrol edin; set ürünler farklı kategoriye düşebilir.
