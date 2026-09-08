# Cevio — ATS-Friendly CV Generator

Cevio adalah aplikasi pembuat Curriculum Vitae (CV) modern berbasis web yang dirancang khusus agar lolos pemindaian Applicant Tracking System (ATS) perusahaan nasional maupun multinasional. Aplikasi ini memadukan kemudahan pengisian data formulir interaktif dengan pratinjau langsung (real-time live preview) satu kolom dan ekspor dokumen PDF berbasis teks asli (bukan rasterized/gambar).

---

## Fitur Utama

- Format Standar ATS Internasional: Tata letak satu kolom vertikal tanpa elemen visual dekoratif yang berpotensi membingungkan mesin parsing ATS.
- Live Preview Real-Time: Pratinjau langsung berdampingan (split-screen) di sisi kanan yang otomatis memperbarui tampilan saat formulir diubah.
- Ekspor PDF Teks Asli: Menggunakan @react-pdf/renderer untuk menghasilkan file PDF berbasis teks vektor murni yang dapat diseleksi, dicari, dan diurai sempurna oleh algoritma ATS.
- Drag-and-Drop Reordering: Urutan section dan entri riwayat dapat diatur secara fleksibel menggunakan @dnd-kit tanpa merusak struktur dokumen.
- Format Deskripsi Fleksibel: Pilihan format deskripsi proyek dalam bentuk poin-poin (bullet list) atau satu paragraf naratif.
- Pilihan Bahasa Dokumen: Dukungan template bahasa Indonesia dan bahasa Inggris dengan judul section baku industri.
- Guest Mode & Cloud Sync: Pengguna dapat langsung menyusun dan mengunduh CV tanpa registrasi akun (tersimpan di localStorage), atau masuk dengan akun Supabase untuk menyimpan draft permanen di cloud.
- Dukungan Autentikasi: Login dan registrasi menggunakan Email/Password serta Google OAuth.
- Supabase Keep-Alive Otomatis: Endpoint terjadwal dan konfigurasi cron untuk mencegah auto-pause pada database Supabase Free Plan setelah 7 hari tidak aktif.
- Optimasi SEO & PWA: Dilengkapi metadata komprehensif, OpenGraph, dynamic sitemap.xml, robots.txt, PWA Web App Manifest, dan JSON-LD Structured Data.

---

## Teknologi yang Digunakan

- Framework: Next.js (App Router, Turbopack)
- Bahasa: TypeScript
- State Management: Zustand (dengan persistensi localStorage untuk tamu)
- PDF Engine: @react-pdf/renderer
- Drag-and-Drop: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- Styling: Tailwind CSS & Vanilla CSS
- Database & Auth: Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- Ikon: Lucide React

---

## Struktur Proyek

```
cv-ats-builder/
├── .github/
│   └── workflows/
│       └── supabase-keepalive.yml    # Workflow cron keep-alive Supabase
├── app/
│   ├── api/
│   │   └── cron/
│   │       └── keep-alive/          # Endpoint HTTP ping keep-alive
│   ├── auth/callback/               # PKCE OAuth callback handler
│   ├── builder/                     # Halaman editor CV split-view
│   ├── dashboard/                   # Halaman manajemen dokumen tersimpan
│   ├── login/                       # Halaman masuk akun
│   ├── register/                    # Halaman pendaftaran akun
│   ├── layout.tsx                   # Root layout dengan konfigurasi metadata & SEO
│   ├── manifest.ts                  # PWA Web App Manifest
│   ├── page.tsx                     # Landing page utama
│   ├── robots.ts                    # Dynamic robots.txt generator
│   └── sitemap.ts                   # Dynamic sitemap.xml generator
├── components/
│   ├── builder/
│   │   ├── forms/                   # Komponen form per section (Pendidikan, Pengalaman, dll.)
│   │   ├── preview/                 # Komponen pratinjau live HTML
│   │   └── BuilderHeader.tsx        # Navigasi header editor dan aksi unduh
│   ├── dashboard/                   # Komponen dashboard pengguna
│   ├── pdf/
│   │   └── CVPdfDocument.tsx        # Renderer dokumen PDF (@react-pdf/renderer)
│   └── ui/                          # Komponen UI modal, konfirmasi, dan navbar
├── lib/
│   ├── constants/                   # Data default CV (ID/EN) dan judul baku ATS
│   ├── store/                       # Zustand store (useCVStore)
│   ├── supabase/                    # Client, server, dan middleware Supabase
│   └── utils/                       # Utilitas ekspor PDF dan pembersihan data
├── public/                          # Aset statis, logo Cevio, dan icon multi-resolusi
├── supabase/
│   └── schema.sql                   # Skema database SQL dan aturan RLS
├── next.config.ts                   # Konfigurasi Next.js
├── vercel.json                      # Konfigurasi Vercel Cron
└── package.json
```

---

## Prasyarat

- Node.js versi 18.17 atau yang lebih baru
- npm, pnpm, atau yarn
- Akun Supabase (opsional jika hanya menggunakan mode tamu)

---

## Instalasi dan Menjalankan Proyek

1. Clone repositori ini:
   ```bash
   git clone https://github.com/username/cv-ats-builder.git
   cd cv-ats-builder
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Konfigurasi Environment Variables:
   Salin file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Isi konfigurasi Supabase Anda pada file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://proyek-anda.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-key-anda
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Konfigurasi Database Supabase:
   Buka SQL Editor di Dashboard Supabase Anda, lalu jalankan query yang ada pada file `supabase/schema.sql` untuk membuat tabel `profiles`, `cv_documents`, trigger otomatis, dan aturan Row Level Security (RLS).

5. Jalankan development server:
   ```bash
   npm run dev
   ```
   Buka peramban di `http://localhost:3000`.

---

## Script yang Tersedia

- `npm run dev`: Menjalankan server pengembangan dengan Turbopack.
- `npm run build`: Mengompilasi aplikasi untuk lingkungan produksi.
- `npm run start`: Menjalankan build produksi secara lokal.
- `npm run lint`: Memeriksa format kode dan potensi kesalahan ESLint.

---

## Pengaturan Google OAuth di Supabase

Jika ingin mengaktifkan tombol login Google:

1. Buka Supabase Dashboard > Authentication > Providers > Google.
2. Aktifkan toggle Enable Google provider.
3. Masukkan Client ID dan Client Secret dari Google Cloud Console.
4. Di Google Cloud Console (Credentials), tambahkan Authorized redirect URI:
   `https://<proyek-anda>.supabase.co/auth/v1/callback`
5. Simpan pengaturan di Supabase Dashboard.

---

## Mekanisme Anti-Pause Supabase

Proyek Supabase dengan tier gratis akan otomatis di-pause jika tidak aktif selama 7 hari. Proyek ini menyertakan dua opsi penjadwalan otomatis untuk mencegah hal tersebut:

1. Vercel Cron: Otomatis aktif jika dideploy ke Vercel melalui `vercel.json` (mengeksekusi `/api/cron/keep-alive` setiap 3 hari).
2. GitHub Actions: File `.github/workflows/supabase-keepalive.yml` akan berjalan otomatis setiap 3 hari di server GitHub untuk mengirimkan ping ke REST API database.

---

## Lisensi

Proyek ini dirilis di bawah lisensi MIT. Silakan gunakan, pelajari, dan kembangkan sesuai kebutuhan Anda.
