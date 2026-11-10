# Duruş Programı (PWA)

Haftada 3 gün (A / B / C), duruş odaklı gym programı. Tek dosya (`index.html`), vanilla JS, çevrimdışı çalışır.

## Dosyalar

| Dosya | Görevi |
|---|---|
| `index.html` | Uygulama. Veri: `W` (ısınma), `DAYS` (A/B/C), `END` (soğuma). Durum `localStorage` → `durus-programi-v1` |
| `manifest.webmanifest` | Ad, renk, ikonlar, `display: standalone` |
| `sw.js` | Cache-first service worker (index, manifest, ikonlar, tüm görseller) |
| `icons/` | 180 (iOS), 192, 512 px ikonlar |
| `images/<id>.jpg` + `<id>-2.jpg` | Başlangıç / bitiş fotoğrafları (free-exercise-db, public domain) |
| `images/<id>.svg` + `<id>-2.svg` | Repoda karşılığı olmayan hareketler için çizimler |
| `.nojekyll` | GitHub Pages'in dosyaları Jekyll ile işlememesi için |

Kod her hareket için önce `images/<id>.jpg`, yoksa `images/<id>.svg` dener. Bitiş karesi için aynı sırayla `-2` dosyalarını dener.

## Görsel eşleştirmesi

`?` olanlar birebir aynı hareket değil, kontrol et.

| ID | free-exercise-db kaynağı | Not |
|---|---|---|
| treadmill-warmup | Walking_Treadmill | |
| chin-tuck | — (SVG) | Repoda yok |
| wall-angel | — (SVG) | Repoda yok |
| leg-press | Leg_Press | |
| chest-press | Leverage_Chest_Press | ? Kollu (leverage) makine; alternatif: Machine_Bench_Press |
| seated-cable-row | Seated_Cable_Rows | |
| lat-pulldown | Wide-Grip_Lat_Pulldown | |
| face-pull | Face_Pull | |
| plank | Plank | ? İlk kare dizler yerdeyken hazırlık pozisyonu |
| goblet-squat | Goblet_Squat | ? Görselde dumbbell değil kettlebell var |
| incline-db-press | Incline_Dumbbell_Press | |
| one-arm-db-row | One-Arm_Dumbbell_Row | |
| reverse-fly | Reverse_Flyes | ? Eğimli sehpada yüzüstü yapılıyor; ayakta eğilerek yapılan versiyon değil |
| leg-curl | Lying_Leg_Curls | ? Yüzüstü makine; salonda oturmalı varsa: Seated_Leg_Curl |
| dead-bug | Dead_Bug | |
| db-rdl | Stiff-Legged_Dumbbell_Deadlift | ? Bacaklar düz deadlift; RDL'de dizler hafif bükük |
| close-grip-pulldown | V-Bar_Pulldown | ? Alternatif: Close-Grip_Front_Lat_Pulldown (düz bar) |
| shoulder-press | Dumbbell_Shoulder_Press | ? Makine kullanıyorsan: Leverage_Shoulder_Press |
| leg-extension | Leg_Extensions | |
| curl-pushdown | Triceps_Pushdown | ? Süperset; görsel yalnızca pushdown kısmını gösteriyor |
| side-plank | Side_Bridge | |
| incline-walk | — (SVG) | Repoda Walking_Treadmill var ama ısınmayla aynı görsel olurdu; eğim görünsün diye çizim |
| doorway-stretch | — (SVG) | Repoda yok |

Bir görseli değiştirmek için `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/<Kaynak>/0.jpg` (ve `1.jpg`) dosyasını indir. 400 px genişliğe küçültüp `images/<id>.jpg` / `images/<id>-2.jpg` olarak kaydet, sonra `sw.js` içindeki `VERSION`'ı artır.

## GitHub Pages'te yayınlama

1. GitHub'da yeni, **public** bir repo aç (örn. `durus-programi`).
2. Bu klasördeki her şeyi reponun köküne yükle: web'de "Add file → Upload files" ile sürükle-bırak yapabilir ya da şu komutları çalıştırabilirsin:
   ```bash
   git init && git add . && git commit -m "Duruş Programı PWA"
   git branch -M main
   git remote add origin https://github.com/<kullanıcı>/durus-programi.git
   git push -u origin main
   ```
3. Repo → **Settings → Pages** → Source: *Deploy from a branch*, Branch: `main`, klasör: `/ (root)` → Save.
4. 1–2 dakika sonra adres hazır olur: `https://<kullanıcı>.github.io/durus-programi/`

Tüm yollar göreli (`./`), bu yüzden alt klasör adresinde de çalışır. Pages HTTPS verdiği için service worker da çalışır.

## Telefona kurma

- **Android / Chrome:** adresi aç → ⋮ menü → **Ana ekrana ekle** (ya da "Uygulamayı yükle"). Uygulama adres çubuğu olmadan, tam ekran açılır.
- **iPhone / Safari:** Paylaş → **Ana Ekrana Ekle**.

Uygulamayı bir kez internetteyken aç; bundan sonra salonda çekim olmasa da çalışır.

## Güncelleme yaparken

Service worker cache-first çalışır, yani telefon eski dosyaları göstermeye devam eder. Her değişiklikten sonra `sw.js` içindeki `VERSION` değerini artır (`durus-v1` → `durus-v2`). Yeni sürüm uygulama bir kez açılıp kapatıldıktan sonra görünür.
