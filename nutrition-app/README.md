# KaloriKoç — Beslenme & Kalori Takip Uygulaması

Kişisel kullanım için basit ama işlevsel bir beslenme/kalori takip uygulaması.
Boy, kilo, yaş, yağ oranı ve hedefine göre **günlük kalori + makro hedefi**
hesaplar; kural tabanlı bir besin veritabanından **alternatifli günlük program**
üretir ve yediklerini takip eder.

> ⚠️ Bu klasör, kök dizindeki **SellerPilot** projesinden tamamen bağımsızdır.
> Kendi `package.json`, Vite ve Tailwind ayarı vardır; farklı bir dev portunda
> (5174) çalışır ve SellerPilot'un hiçbir dosyasına dokunmaz.

## Teknoloji
- React 18 + Vite 5 + TypeScript
- Tailwind CSS 3
- React Router 6
- Veri: şimdilik `localStorage` (soyut `DataStore` katmanı — ileride Supabase'e
  kolayca geçilebilir)

## Çalıştırma
```bash
cd nutrition-app
npm install
npm run dev      # http://localhost:5174
```

Build:
```bash
npm run build    # dist/ üretir
npm run preview
```

## Yapı
- `src/lib/nutrition.ts` — BMR (Katch-McArdle / Mifflin-St Jeor), TDEE, makro hesabı
- `src/lib/mealPlanner.ts` — kural tabanlı öğün programı üretimi (alternatifli)
- `src/data/foods.ts` — uluslararası besin veritabanı (100g başına değerler)
- `src/lib/storage.ts` — veri katmanı (localStorage; Supabase'e hazır arayüz)
- `src/pages/*` — Profil kurulumu, Bugün, Program, Günlük, Profil ekranları

## Yol haritası
- [x] Profil + kalori/makro hesabı
- [x] Kural tabanlı program üretimi + alternatifler
- [x] Günlük takip (kalan kalori / makro halkaları)
- [ ] Bulut senkron + giriş (Supabase)
- [ ] PWA (ana ekrana ekle) ve canlıya alma
- [ ] Videolu eğitimler
