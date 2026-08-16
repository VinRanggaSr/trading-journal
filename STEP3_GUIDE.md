# Step 3 — React App (Routing, Login, Layout)

## Yang dibuat di step ini

Project React (Vite) yang jadi satu kesatuan sama Netlify Functions dari Step 2 - jadi folder ini **menggantikan** folder `tj-netlify` sebelumnya (sudah termasuk `netlify/functions` di dalamnya, nggak perlu pakai folder lama lagi).

**Routing:**
- `/login` — halaman login (password dari `.env`)
- `/journal` — placeholder (isi fiturnya di Step 4)
- `/dashboard` — placeholder (isi fiturnya di Step 5)
- `/analysis` — placeholder (isi fiturnya di Step 6)
- Semua route selain `/login` otomatis redirect ke `/login` kalau belum login

**Design tokens** (dari referensi UI kamu) sudah masuk ke `tailwind.config.js`:
- `bg-ink` → hitam, dipakai untuk primary button & sidebar aktif
- `bg-accent-orange` (#FC8529) & `bg-accent-purple` (#5E32FB) → siap dipakai untuk chart/progress di step selanjutnya
- Card component (`rounded-2xl`, shadow halus) & label caps (`label-caps` - huruf kapital kecil abu-abu) sudah dibikin, mengikuti pola di screenshot referensi kamu

---

## 1. Setup

1. Extract folder `tj-app` ini, taruh di lokasi project kamu (**gantikan** folder `tj-netlify` yang lama - atau taruh di lokasi baru, terserah, yang penting mulai pakai folder ini)
2. `cd` ke folder itu:
   ```bash
   cd ~/Documents/Build-Website/trading-journal
   ```
3. Copy env file:
   ```bash
   cp .env.example .env
   ```
4. Isi `.env` dengan **value yang sama persis** kayak yang kamu isi di Step 2 (`APP_PASSWORD`, `SESSION_SECRET`, `APPS_SCRIPT_URL`, `APPS_SCRIPT_SECRET`)
5. Install semua dependency (React, Tailwind, router, dll):
   ```bash
   npm install
   ```
   Ini bakal makan waktu 1-2 menit, install lumayan banyak package.

---

## 2. Jalankan Lokal

```bash
netlify dev
```

Bedanya dari Step 2: sekarang `netlify dev` otomatis jalanin Vite juga di background (lihat `[dev]` di `netlify.toml`), jadi satu command ini udah cukup buat jalanin frontend + functions barengan.

Tunggu sampai muncul:
```
◈ Server now ready on http://localhost:8888
```

Buka **http://localhost:8888** di browser. Harusnya muncul halaman login "Trading Journal".

**Testing manual:**
1. Masukin password sesuai `APP_PASSWORD` di `.env` kamu → klik Masuk
2. Harusnya langsung masuk ke halaman `/journal` dengan sidebar di kiri (Journal, Dashboard, Analisis Saham, Keluar)
3. Coba klik-klik antar menu — pastikan pindah halaman tanpa reload
4. Coba refresh browser di tengah salah satu halaman (misal `/dashboard`) — harusnya tetap di halaman itu, bukan balik ke login (bukti session cookie kebaca dengan benar)
5. Klik "Keluar" — harusnya balik ke halaman login
6. Coba akses langsung `http://localhost:8888/dashboard` tanpa login — harusnya otomatis dilempar ke `/login`

---

## 3. Deploy ke Netlify

Kalau kamu udah pernah connect site di Netlify dari Step 2, tinggal update:

1. Push semua perubahan (termasuk folder `src/`, `index.html`, dll) ke GitHub repo yang sama
2. Buka site kamu di [app.netlify.com](https://app.netlify.com) → **Site settings > Build & deploy**
3. Pastikan **Build command** = `npm run build` dan **Publish directory** = `dist` (biasanya udah otomatis kebaca dari `netlify.toml`, tapi cek aja)
4. Environment variables (`APP_PASSWORD`, dll) harusnya udah ada dari Step 2 - kalau belum, tambahin di **Site settings > Environment variables**
5. Trigger deploy baru (biasanya otomatis begitu kamu push ke GitHub, atau klik **Trigger deploy** manual)

Setelah deploy selesai, buka URL production-nya (`https://nama-site.netlify.app`) — ini yang jadi tujuan awal kamu: **buka aja kayak website biasa, nggak perlu running apapun** lagi di sisi kamu setelah ini live.

---

## Troubleshooting

- **Halaman putih kosong / error di console browser** → buka Developer Console (F12), lihat error message-nya, kirim ke saya
- **Login gagal terus padahal password bener** → cek `.env` isinya sama persis kayak Step 2, terutama `SESSION_SECRET`
- **`npm install` error** → pastikan Node.js versi 18 ke atas (`node -v`)
- **CSS/styling nggak muncul (halaman polos tanpa styling)** → pastikan `npm install` selesai tanpa error, restart `netlify dev`

---

## Selanjutnya

Setelah login, routing, dan layout semua kekonfirmasi jalan, kabari saya — lanjut ke **Step 4: fitur Journal** (form bikin trading plan dengan checklist, list journal, dan flow ubah status entry/TP/TP Partial/CL).
