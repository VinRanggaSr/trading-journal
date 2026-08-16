# Step 4 — Fitur Journal

## Yang dibuat di step ini

**Halaman Journal (`/journal`)** sekarang fungsional penuh:

1. **Tombol "Trading Plan Baru"** → buka form: Ticker, Harga Sekarang, TP, CL, Risk:Reward, checklist Syarat Entry (diambil dari sheet `ChecklistConfig`) + catatan tambahan, dan Notes/alasan detail
2. **List journal** dalam bentuk card — ticker, badge status berwarna, Plan/TP/CL, R:R
3. **Klik card** → buka detail dialog, isinya:
   - Checklist syarat entry (centang/silang, dicoret kalau nggak dicentang)
   - Notes
   - Riwayat Entry (tabel tanggal/harga/nominal)
   - Riwayat Exit (tanggal/tipe/harga/persen kalau partial)
   - **Tombol aksi yang berubah sesuai status:**
     - `Pending` → "Tandai Tidak Entry" / "Catat Entry"
     - `Entry` / `TP Partial` (posisi masih terbuka) → "Tambah Posisi", "Take Profit Partial", "Take Profit", "Cut Loss"
     - `TP` / `CL` (posisi closed) → cuma info "Posisi sudah ditutup", nggak ada tombol lagi

**Badge warna status** (pakai aksen dari desain kita):
- Pending / No Entry → abu-abu
- Entry → ungu (`#5E32FB`)
- TP Partial → oranye (`#FC8529`)
- Take Profit → hijau
- Cut Loss → merah

---

## Cara Testing

1. Jalankan `netlify dev` (kalau belum jalan)
2. Buka `http://localhost:8888/journal`, login kalau diminta
3. Klik **"Trading Plan Baru"**, isi form:
   - Ticker: `BBCA`
   - Harga Sekarang: `9000`
   - Risk:Reward: `1:2`
   - Take Profit: `9500`
   - Cut Loss: `8800`
   - Centang 1-2 checklist, isi Notes bebas
   - Klik **Simpan Trading Plan**
4. Card baru harusnya muncul di list dengan badge **Pending**
5. Klik card itu → detail dialog kebuka
6. Klik **"Catat Entry"**, isi Harga Masuk `9010` dan Nominal `5000000`, Simpan
   - Status harusnya berubah jadi **Entry**, dan muncul di "Riwayat Entry"
7. Klik lagi card yang sama (atau masih di dialog yang sama), coba **"Tambah Posisi"** — isi harga & nominal baru, mastiin bisa nambah entry kedua (simulasi average)
8. Coba **"Take Profit Partial"** — isi harga jual & persen (misal 50%), Simpan
   - Status harusnya jadi **TP Partial**, badge oranye, entry-nya masuk ke "Riwayat Exit"
9. Coba **"Take Profit"** (full close) — isi harga jual, Simpan
   - Status jadi **Take Profit** (hijau), tombol aksi hilang, muncul "Posisi sudah ditutup"
10. Buat 1 journal baru lagi, coba jalur **"Tandai Tidak Entry"** dari status Pending — pastikan badge jadi abu-abu "No Entry"

Setelah semua alur di atas dicoba, cek juga di Google Sheets — pastikan baris-baris baru muncul di `TradingPlans`, `Entries`, dan `Exits` sesuai yang kamu input.

---

## Troubleshooting

- **Checklist kosong pas bikin plan baru** → cek sheet `ChecklistConfig` ada isinya dan kolom `Active` = `TRUE`
- **Error pas submit form** → biasanya muncul teks merah di bawah form, baca pesannya — kalau nggak jelas, screenshot & kirim ke saya
- **Detail dialog nggak update setelah aksi** → coba tutup-buka lagi dialognya; kalau masih stuck, cek console browser (F12) buat error

---

## Selanjutnya

Setelah dicoba dan alurnya sesuai ekspektasi kamu (terutama soal Entry/TP Partial/CL), kabari saya — lanjut ke **Step 5: Dashboard** (funnel stats sukses/gagal/tidak memenuhi syarat + performa portofolio dari yang udah entry).
