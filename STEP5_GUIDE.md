# Update Besar — Hapus Journal, Dashboard, & Analisis Saham

Ini gabungan 3 update sekaligus sesuai request kamu. Ada **2 bagian** yang perlu di-update: backend (Apps Script) dan frontend (React). Backend duluan karena frontend butuh endpoint barunya.

---

## Bagian A — Update Backend (Apps Script)

**Yang berubah:** ada 2 action baru, `deleteJournal` dan `deleteStockAnalysis`, termasuk cascade delete (kalau journal dihapus, semua Entry & Exit yang terkait ikut kehapus otomatis).

**Langkah:**
1. Buka spreadsheet "Trading Journal DB" kamu → **Extensions > Apps Script**
2. **Select all** kode yang ada sekarang (Cmd+A), **hapus semua**
3. Paste seluruh isi `Code.gs` yang baru (file terlampir) — ini versi lengkap, sudah termasuk semua kode lama + fungsi baru
4. Save (Cmd+S)
5. **PENTING**: `SHARED_SECRET` di baris atas kemungkinan balik ke placeholder `'GANTI_DENGAN_SECRET_RANDOM_KAMU'` karena saya kirim versi bersih — ganti lagi ke punya kamu (`journaltradebagger100x`) sebelum lanjut
6. Klik **Terapkan (Deploy) > Kelola deployment (Manage deployments)**
7. Klik ikon pensil (Edit) di deployment yang aktif
8. Di dropdown **Versi**, pilih **Versi baru (New version)**
9. Klik **Deploy**

Web App URL-nya **tetap sama** (nggak berubah), jadi `.env` di frontend nggak perlu diubah.

**Test cepat** (opsional, dari terminal):
```bash
curl -i "PASTE_WEB_APP_URL_KAMU?action=ping&secret=journaltradebagger100x"
```
Kalau masih balas `{"status":"ok",...}`, deploy-nya berhasil.

---

## Bagian B — Update Frontend (React)

**Yang ditambahkan:**

1. **Hapus Journal** — icon tempat sampah di pojok kanan atas detail dialog Journal, klik → konfirmasi → hapus (termasuk semua entry/exit terkait)
2. **Dashboard** (`/dashboard`):
   - Ringkasan funnel: **Sukses** (TP), **Gagal** (CL), **Sedang Berjalan** (Entry/TP Partial), **Tidak Memenuhi Syarat** (Pending/No Entry) — masing-masing sebagai % dari total journal + progress bar bersegmen
   - Performa portofolio: Total Modal Masuk, Estimasi Nilai Sekarang (pakai harga live dari Yahoo Finance untuk posisi yang masih terbuka), Growth %, dan list tiap posisi
   - **Catatan jujur soal akurasi**: perhitungan nilai portofolio ini estimasi, bukan pembukuan akuntansi presisi — terutama untuk posisi yang kena partial sell berkali-kali, cost basis-nya disederhanakan (setiap % exit dihitung dari modal awal, bukan dari sisa modal setelah exit sebelumnya). Cukup akurat buat evaluasi personal, tapi kalau nanti kerasa kurang presisi, kasih tau aja, bisa saya perbaiki logic-nya
3. **Analisis Saham** (`/analysis`):
   - Tombol "Analisis Baru" → form: Ticker, Fundamental, Teknikal, Money Flow, Catatan Lain, Tags
   - Klik card → dialog yang sama jadi form edit, ada tombol Hapus juga
   - Satu ticker boleh punya banyak analisis (nggak digabung otomatis, sesuai desain awal)

**Langkah:**
1. Extract zip `tj-app`, **timpa folder lama kamu**
2. Pindahin lagi file `.env` kamu ke folder baru (kayak biasa)
3. **PENTING**: pastikan file `netlify/functions/package.json` (yang isinya `{"type": "commonjs"}`, yang sempat kelewat kemarin) ada di folder baru ini — kalau nggak ada, bikin lagi manual
4. Nggak ada dependency baru, jadi **nggak perlu `npm install` ulang**
5. Jalankan:
   ```bash
   netlify dev
   ```

---

## Testing

1. **Hapus Journal**: buka journal manapun → klik icon tempat sampah di kanan atas → konfirmasi → pastikan journal hilang dari list, dan cek di Google Sheets baris terkait di `TradingPlans`, `Entries`, `Exits` juga ikut hilang
2. **Dashboard**: buka `/dashboard` → pastikan angka funnel sesuai jumlah journal yang kamu punya per status, dan progress bar bersegmen muncul dengan warna yang sesuai
3. **Analisis Saham**: buka `/analysis` → klik "Analisis Baru" → isi Ticker + Fundamental + Tags → Simpan → card muncul di list → klik card itu lagi → coba edit sesuatu → Simpan lagi → coba juga tombol Hapus

Kalau semua lancar, berarti seluruh rencana awal (Step 1-6) udah selesai — tinggal deploy production kalau kamu mau live-kan.
