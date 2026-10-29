# 🔐 SECRET MESSAGE — Web Companion Siswa (v1.0.0)

> **Aplikasi Web Pendamping Pembelajaran Game Kartu Kriptografi Matematika**  
> **SMK Telkom Purwokerto — Program Keahlian Pengembangan Perangkat Lunak & Gim (PPLG)**  
> **Materi:** Fungsi Komposisi $(g \circ f)(x)$ & Invers Fungsi $(g \circ f)^{-1}(y)$, Kuantifikasi Huruf, dan Kriptografi Aljabar.

---

## 📱 Fitur Utama Versi 1 (v1.0.0)

1. **Sinkronisasi Real-Time (Enkripsi &rarr; Dekripsi):**
   - Setiap kali siswa memilih kartu fungsi, mengubah operasi $(g \circ f)$ atau $(f \circ g)$, atau mengetik kalimat rahasia di tab **Enkripsi**, seluruh data langsung disinkronkan secara otomatis ke tab **Dekripsi**.
   - Tersedia tombol navigasi cepat `Uji di Dekripsi →` dan status indikator sinkronisasi aktif.

2. **6 Tahap Aljabar Formal & Runtut:**
   - **Enkripsi (Komposisi Fungsi):** 6 tahap pengerjaan lengkap (Definisi Komposisi &rarr; Substitusi Fungsi Dalam &rarr; Pemetaan ke Fungsi Luar &rarr; Penjabaran Sifat Distributif &rarr; Pengelompokan Konstanta Sejenis &rarr; Rumus Operasional Enkripsi Final).
   - **Dekripsi (Penurunan Invers):** 6 tahap isolasi variabel (Persamaan Sandi $y$ &rarr; Isolasi Suku $x$ dengan Prinsip Kesetaraan &rarr; Penyelarasan Sifat Simetris &rarr; Eliminasi Koefisien &rarr; Definisi Invers &rarr; Rumus Operasional Dekripsi Final).

3. **Bedah Kasus Nyata (Spotlight Calculation):**
   - Memberikan simulasi angka nyata per karakter pertama dan sandi pertama untuk memudahkan pemahaman konkret alur substitusi rumus aljabar.

4. **Web NFC Ambient Reader (Latar Belakang):**
   - Mendeteksi tap kartu fisik berstiker NFC langsung di perangkat smartphone Android Chrome tanpa perlu menekan tombol simulator manual.
   - Menampilkan pop-up informasi kartu dan tombol untuk langsung memasang kartu ke Enkripsi/Dekripsi.

5. **Responsif Penuh di HP (Mobile-First):**
   - Navigasi mobile sticky 4-kolom yang nyaman untuk jempol (*thumb-friendly*).
   - Tabel kuantifikasi dan dekripsi dilengkapi pelindung overflow dan indikator geser horizontal (*touch momentum scrolling*).

6. **Branding Resmi Telkom Schools:**
   - Terintegrasi logo resmi Telkom Schools pada favicon, header, dan footer halaman.

---

## 📂 Struktur File Project

```text
math-cryptography-psas/
├── index.html                      # Halaman Utama (SPA / Single Page App)
├── assets/
│   ├── css/
│   │   └── style.css               # Styling kustom (Clean editorial light & responsif mobile)
│   ├── js/
│   │   ├── card-data.js            # Data master kartu F-01..F-05, G-01..G-05, kata, kartu bantu
│   │   ├── cipher-engine.js        # Engine matematika (komposisi 6 tahap, invers 6 tahap, bedah kasus)
│   │   ├── nfc-reader.js           # Ambient Web NFC API handler & modal detail
│   │   └── app.js                  # Controller interaktivitas & sinkronisasi real-time
│   └── images/
│       ├── logo-telkom-schools.png # Logo resmi Telkom Schools
│       └── cards/                  # Master 45 thumbnail kartu fisik siap pakai
├── print/                          # Template cetak aset fisik
│   ├── cetak_kartu_kata_A4.html
│   ├── cetak_kartu_huruf_A4.html
│   └── cetak_lembar_kerja_A5.html
├── README.md                       # Dokumentasi project
└── .gitignore
```

---

## 🚀 Rencana Pengembangan Selanjutnya (Ide Kolaborasi Tim)

Repository ini dirancang modular dan siap untuk diekstensi:
- [ ] **Sistem Akun & Autentikasi Murid:** Login siswa dengan NIS/email Google SMK Telkom.
- [ ] **Database Skor & Leaderboard:** Integrasi Firebase / Supabase untuk menyimpan skor permainan fisik antar kelompok.
- [ ] **Multiplayer Room:** Pengiriman kode sandi secara daring antar perangkat siswa.
- [ ] **PWA (Progressive Web App):** Akses offline penuh saat tidak ada koneksi internet di kelas.

---

## 🌐 Menjalankan & Deploy ke GitHub Pages

1. **Jalankan Lokal:**
   Cukup buka file `index.html` langsung di browser Chrome, Edge, atau Firefox.
2. **Deploy ke GitHub Pages:**
   - Di GitHub repository: Buka tab **Settings** &rarr; **Pages**.
   - Pada bagian **Build and deployment** &rarr; **Branch**, pilih `main` dan folder `/(root)` &rarr; klik **Save**.
   - Website akan aktif di: `https://hanif-127.github.io/math-cryptography-psas/`.
