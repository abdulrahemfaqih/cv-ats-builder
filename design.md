# Design.md — CV ATS Generator

Dokumen ini punya **dua sistem desain yang terpisah dan tidak boleh tercampur**:

1. **Desain Aplikasi** (landing page, dashboard, builder UI) — boleh punya karakter kuat, monokrom, anti-generic.
2. **Desain Output CV (template PDF)** — harus tetap steril dan ATS-safe, mengikuti struktur contoh CV yang sudah ada.

Jangan pernah menerapkan gaya section 2 (Swiss Industrial) ke dalam template CV. Template CV harus terlihat seperti CV korporat biasa, hanya rapi dan konsisten.

---

## 1. Desain Aplikasi (Web UI)

**Nama produk: Cevio.**

**Logo:** hexagon monokrom dengan sudut membulat, negative space membentuk huruf "C", berisi ikon dokumen (kertas + baris teks) di tengah. Logo ini **satu-satunya elemen bulat** di seluruh sistem — kontras yang disengaja: mark yang approachable duduk di atas sistem UI yang tegas/presisi. Aturan pakai:
- Selalu monokrom (hitam di atas terang, atau putih di atas gelap) — jangan diwarnai `--accent` atau diberi gradient.
- Clear space minimal setinggi sisi hexagon di semua arah.
- Ukuran minimum ~24px (favicon/navbar) — di bawah itu detail ikon dokumen di dalamnya hilang, pakai versi simplified (hexagon + "C" saja) untuk ukuran sangat kecil.
- Wordmark "Cevio" pakai **Plus Jakarta Sans**, weight 700–800, huruf kecil biasa (bukan dipaksa uppercase) — beda dari label struktural lain yang uppercase.

**Arah desain UI:** Swiss Industrial Print — monokrom, terang, grid tegas, tipografi besar-kontras, satu warna aksen. Tanpa gradient, tanpa shadow lembut/glassmorphism, tanpa ikon generik bulat-bulat ala SaaS pada umumnya. Sudut komponen (button, card, input) tetap tegas/90° kecuali logo — supaya kontras "mark bulat vs grid tegas" di atas tetap kerasa, bukan malah semuanya dibulatkan jadi generik.

### 1.1 Warna

```
--bg:         #F4F4F0   /* off-white, bukan putih murni */
--surface:    #EAE8E3   /* panel/card, sedikit lebih gelap dari bg */
--ink:        #0A0A0A   /* teks utama, hampir hitam */
--ink-muted:  #5C5A54   /* teks sekunder/metadata */
--border:     #0A0A0A   /* border solid 1-2px, bukan abu-abu tipis */
--accent:     #E61919   /* SATU-SATUNYA warna aksen — aviation red */
```

Aturan: `--accent` hanya untuk hal yang butuh perhatian (status "draft belum disimpan", tombol delete, error, garis pemisah section aktif). Jangan dipakai dekoratif/berulang.

### 1.2 Tipografi

- **Font utama: Plus Jakarta Sans** (dipakai untuk wordmark, heading, body, UI label) — geometris, modern, tetap terbaca ramah meski sistemnya tegas. Weight 700–800 untuk heading/display, 500–600 untuk label UI/tombol, 400 untuk body panjang.
- **Heading/Display** (judul halaman, angka besar, hero landing): Plus Jakarta Sans ExtraBold, tracking rapat (`-0.01em` s/d `-0.03em`), huruf besar (uppercase) khusus untuk label struktural (mis. "DASHBOARD", "[ 01 / PENDIDIKAN ]") — bukan untuk kalimat biasa.
- **Body/Form label/metadata**: monospace — `JetBrains Mono` atau `IBM Plex Mono`, ukuran kecil (12–14px), tracking sedikit lebar (`0.03–0.05em`), khusus untuk tanggal, status, nomor urut section. Dipakai sebagai aksen tekstur di antara Plus Jakarta Sans, bukan font utama — biar kesan presisi tetap dapat tanpa jadi ramai.
- **Body panjang** (deskripsi, textarea, paragraf landing page): Plus Jakarta Sans regular/medium, jangan monospace supaya tidak melelahkan mata saat mengetik/membaca paragraf.
- Gunakan `next/font/google` untuk self-host Plus Jakarta Sans (dan JetBrains Mono), jangan `<link>` Google Fonts langsung.

### 1.3 Layout & Komponen

- Grid tegas: `display:grid` dengan garis pembatas solid 1px `--border` antar zona (mis. antar form dan preview, antar section di dashboard).
- Semua card/tombol/input **sudut 90° (tanpa border-radius)**, border solid, tanpa drop-shadow — kalau butuh depth, pakai warna/kontras, bukan bayangan.
- Framing ala label teknis untuk section header di builder, contoh: `[ 01 / PENDIDIKAN ]`, `[ 02 / PENGALAMAN KERJA ]` — nomor urut membantu user paham urutan section di CV mereka.
- Tombol primer: solid `--ink` dengan teks `--bg` (invert saat hover), tombol destructive (hapus) pakai `--accent`.

### 1.4 Layout Halaman Kunci

**Landing Page**
- Hero: wordmark **Cevio** + logo, tagline pendek, CTA "Buat CV Sekarang →" langsung ke builder.
- Tanpa hero image generik/ilustrasi 3D — kalau butuh visual, tampilkan **preview CV asli** (contoh hasil jadi) sebagai bukti produk, dibingkai dengan border tegas seolah dokumen fisik di atas meja kerja (bisa dirotasi sedikit / drop shadow keras, bukan blur lembut).

**Copy landing page (siap pakai, boleh disesuaikan agent tapi jangan diganti jadi bahasa marketing generik):**

```
[HERO]
H1: CV yang beneran lolos ATS.
Sub: Isi form di kiri, hasilnya langsung keliatan di kanan. Kalau udah pas, download PDF-nya dan kirim.
CTA: Buat CV Sekarang →
Micro-copy di bawah CTA: Coba dulu tanpa daftar. Login cuma kalau mau simpan draft-nya.

[FITUR]
1. Live preview
   Ketik di form, hasilnya langsung berubah di panel sebelah. Nggak perlu export bolak-balik cuma buat lihat hasilnya.

2. Beberapa CV, satu akun
   Simpan versi berbeda untuk tiap posisi yang kamu lamar — fullstack, frontend, mobile — tanpa bikin dari nol tiap kali ganti tujuan.

3. PDF-nya teks asli, bukan gambar
   Hasil download bisa di-select dan di-copy teksnya. Bukan screenshot yang disamarkan jadi PDF — makanya ATS beneran bisa baca isinya.

4. Susun section sesuka kamu
   Pendidikan duluan atau pengalaman kerja duluan, kamu yang atur urutannya, tinggal drag.

5. Dua bahasa
   Bikin versi Bahasa Indonesia atau English, tinggal pilih sesuai lowongan yang kamu apply.

[PENUTUP / SECOND CTA]
H2: Nggak perlu akun buat mulai.
Sub: Isi CV-nya sekarang. Baru daftar kalau udah mau simpan.
CTA: Mulai Sekarang
```

Prinsip copywriting: kalimat pendek, jelas manfaatnya, tanpa kata-kata generik ala AI ("revolusioner", "solusi terbaik", "berdayakan karier Anda", "di era kompetitif ini"). Bicara langsung ke masalah nyata pencari kerja (CV ditolak sebelum dibaca manusia).

**Dashboard**
- List/grid CV milik user, tiap item = 1 card dengan border solid, judul CV (mono, uppercase), tanggal update (mono, kecil), aksi (Edit/Duplicate/Rename/Delete) sebagai text-button bukan icon-only supaya jelas & anti-generic.
- Tombol "+ CV BARU" menonjol, posisi konsisten (mis. kanan atas).

**Builder** — split view:
- **Kiri (± 45%)**: form, scrollable, dibagi per section dengan collapsible panel bergaya `[ 0N / NAMA SECTION ]`. Drag handle (ikon garis 3, bukan ikon generik) di kiri tiap section/entry untuk reorder.
- **Kanan (± 55%)**: live preview, **sticky** (ikut scroll), dibingkai seperti kertas A4 di atas background `--surface` supaya kontras dan terlihat jelas batas halamannya. Preview ini **harus render style CV asli** (section 2 di bawah), bukan style brutalist.
- Mobile (`<768px`): stack vertikal dengan tab switcher "FORM / PREVIEW" (bukan accordion, supaya preview tetap full-width saat dilihat).
- Bar bawah/atas sticky berisi: pilihan bahasa (ID/EN), tombol "Simpan Draft", tombol "Download PDF" — selalu terlihat tanpa perlu scroll.

**Foto Profil**
- Toggle di header form. Jika aktif: uploader dengan crop **rasio 1:1 (persegi)**.
- Ukuran render di preview/PDF: **~2.5cm × 2.5cm** (≈ 95px × 95px pada 96 DPI), pojok kiri atas dokumen, sejajar dengan nama.
- Alasan pakai persegi kecil (bukan potret 3x4 besar): proporsional untuk CV modern, tidak mendominasi halaman, dan aman untuk ATS karena tetap berupa 1 elemen gambar inline, bukan text box/tabel yang bisa mengacaukan urutan parsing teks.

---

## 2. Desain Output CV (Template PDF) — ATS-Safe

**Wajib dipatuhi ketat**, karena ini yang menentukan CV lolos parsing ATS atau tidak:

- **Satu kolom**, top-to-bottom. Tidak ada multi-kolom, tidak ada tabel untuk layout, tidak ada text box mengambang.
- **Font**: pilih satu, standar & aman — `Calibri`, `Arial`, atau `Times New Roman`. Ukuran: nama 18–20pt bold, section header 11–12pt bold uppercase, body 10–10.5pt.
- **Warna**: hitam (`#000000`/`#111111`) di atas putih untuk seluruh teks. **Kecuali** link kontak (LinkedIn, Email, Portofolio) yang boleh pakai warna biru standar hyperlink (`#0563C1` mendekati default Word) + underline — dikonfirmasi dari screenshot asli user, dan warna ini tidak berpengaruh ke parsing ATS karena parser cuma baca teks, bukan warna. Tidak ada warna lain di luar dua ini.
- **Tanpa ikon** (tanpa icon telepon/email/dsb), tanpa garis dekoratif berlebihan — **kecuali** hr tipis full-width di bawah tiap section header (ini WAJIB dan konsisten di semua section, bukan opsional) dan hr penutup blok header (nama+kontak) sebelum overview.
**Detail berikut dikonfirmasi langsung dari raster/visual PDF asli (bukan cuma dari teks yang di-extract), jadi wajib diikuti persis:**

```
                              NAMA LENGKAP                       <- BOLD, besar, CENTER-ALIGNED
  Kec. X, Kab. Y, Prov. Z | Linkedin : {url} | {email} | {no. hp} | Portofolio : {url}
                                                    <- CENTER-ALIGNED, wrap otomatis kalau kepanjangan
                                                    <- Linkedin/email/Portofolio: warna biru (#0563C1) + underline, gaya hyperlink Word
──────────────────────────────────────────────────  <- hr full-width, PENUTUP blok header (sebelum overview)

{Paragraf overview/ringkasan profil}                <- rata kiri, tanpa label/header

PENDIDIKAN                                           <- bold, uppercase, rata kiri
──────────────────────────────────────────────────  <- hr full-width, SELALU ada di bawah tiap section header (bukan opsional)
{Jenjang} - {Universitas}, {Kab, Prov}{, Negara}                    {Tahun Mulai - Tahun Selesai}
   ↑ BOLD, tanggal rata kanan di baris pertama (kalau baris ini wrap ke baris 2, tanggal tidak diulang)
{Program Studi} - IPK {x.xx}                         <- ITALIC
Mata Kuliah Relevan : {daftar dipisah koma}          <- "Mata Kuliah Relevan :" BOLD inline, isinya teks biasa — BUKAN bullet
{deskripsi jika diisi}                                <- teks biasa

PENGALAMAN KERJA
──────────────────────────────────────────────────
{Nama Perusahaan} - {Kab, Prov}{, Negara}                           {Bulan Tahun - Bulan Tahun}
   ↑ BOLD, tanggal rata kanan di baris pertama saja (sama seperti pendidikan)
{Posisi}{ - Tipe, jika diisi}                         <- ITALIC
   • bullet 1                                         <- indented dari margin kiri
   • bullet 2

PROJECTS / PROYEK
──────────────────────────────────────────────────
{Nama Proyek}                                                        {Tahun}
   ↑ BOLD, tahun rata kanan baris pertama
   {deskripsi/bullet}                                 <- indented, menjorok dari judul project

...section lain (Sertifikasi, Pelatihan, Pencapaian) mengikuti pola bold-judul + hr + isi yang sama...
```


- Foto profil (jika dipakai): persegi kecil pojok kiri atas, **sejajar/berdampingan dengan nama** (bukan di atasnya) supaya tidak mengubah urutan baca top-to-bottom yang dipakai parser ATS.
- Section kosong (tidak diisi user) **tidak dirender sama sekali** — tidak ada header section tanpa isi.
- Bullet point pakai karakter `•` polos, bukan custom icon/emoji.

### 2.1 Implementasi PDF (rekomendasi teknis)

Supaya PDF benar-benar text-selectable (bukan hasil screenshot HTML yang di-rasterize jadi gambar — ini sering jadi penyebab CV gagal ATS):

- **Gunakan `@react-pdf/renderer`** untuk generate PDF dari data CV (bukan `html2canvas + jsPDF`, karena itu menghasilkan gambar, bukan teks asli).
- Live preview di browser tetap pakai komponen HTML/Tailwind biasa (untuk kecepatan & kemudahan styling real-time). Komponen `@react-pdf/renderer` dibuat terpisah tapi **membaca struktur data yang sama** (satu source of truth data model, dua renderer berbeda: satu untuk preview HTML, satu untuk PDF).
- Pastikan hasil akhir: bisa di-select & copy teksnya dari PDF viewer (Preview/Adobe/Chrome), dan bisa dibuka dengan parser sederhana tanpa OCR.

---

## 3. Data Model (Supabase)

Pendekatan: simpan konten CV sebagai **JSONB** di satu kolom (fleksibel untuk section yang bisa dipilih bebas & diurutkan bebas), bukan dinormalisasi ke banyak tabel terpisah — lebih sederhana untuk agent implement dan cocok untuk struktur yang heterogen per section.

```sql
-- profiles: extend auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- cv_documents: satu row = satu CV milik user
create table public.cv_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled CV',       -- label di dashboard, mis. "CV Fullstack"
  language text not null default 'id' check (language in ('id','en')),
  data jsonb not null default '{}'::jsonb,          -- lihat struktur di bawah
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.cv_documents enable row level security;

create policy "Users manage their own CVs"
  on public.cv_documents
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

**Struktur kolom `data` (JSONB):**

```jsonc
{
  "header": {
    "name": "Abdul Rahem Faqih",
    "useProfilePhoto": true,
    "photoUrl": "https://.../storage/....jpg",
    "address": { "kecamatan": "Kamal", "kabupaten": "Bangkalan", "provinsi": "Jawa Timur" },
    "email": "faqih3935@gmail.com",
    "phone": "089531419612",
    "linkedin": "https://linkedin.com/in/rhmfaqih",   // optional
    "portfolio": "https://abdulrahemfaqih.vercel.app"  // optional
  },
  "overview": "Lulusan S1 Teknik Informatika ...",
  "sections": [
    {
      "id": "sec_1",
      "type": "education",          // education | work | organization | project | skills | certification | training | achievement
      "order": 0,
      "entries": [
        {
          "id": "entry_1",
          "level": "S1",
          "institution": "Universitas Trunojoyo Madura",
          "location": { "kabupaten": "Bangkalan", "provinsi": "Jawa Timur", "country": "" },
          "major": "Teknik Informatika",
          "gpa": "3.87",
          "startYear": "2022",
          "endYear": "2026",
          "relevantCourses": ["Algoritma & Pemrograman", "Struktur Data"],
          "description": ""
        }
      ]
    }
    // section type lain punya shape entries yang berbeda sesuai field di PRD.md bagian 4
    // (mis. work/organization entries punya "employmentType" opsional untuk suffix "- Intern" dsb.)
  ]
}
```

Storage foto profil: pakai **Supabase Storage** bucket `avatars` (public read, write hanya oleh owner).

---

## 4. Keputusan Teknis Ringkas

| Aspek | Pilihan | Alasan |
|---|---|---|
| Form state (builder) | Zustand | Ringan, cocok untuk state form kompleks + reorder, tidak perlu Redux |
| Validasi form | react-hook-form + zod | Standar, type-safe |
| Drag & drop reorder | `dnd-kit` | Accessible, modern, cocok untuk reorder section & entries |
| PDF export | `@react-pdf/renderer` | Text asli, bukan rasterized image → aman untuk ATS |
| Auth | Supabase Auth (Google OAuth + Email/Password) | Sesuai requirement |
| Guest state sebelum login | localStorage | Tidak perlu server sampai user putuskan simpan |
| Ikon | Pilih satu library saja (mis. `@radix-ui/react-icons` atau `lucide-react` sesuai preferensi project), pakai minimal & konsisten stroke-width | Anti-slop: jangan campur beberapa family icon |

---

## 5. Checklist Anti-Slop (khusus UI aplikasi, bukan template CV)

- [ ] Tidak ada gradient AI-purple/biru generik.
- [ ] Tidak ada hero dengan mesh gradient blur di background.
- [ ] Tidak ada card dengan shadow lembut mengambang (`shadow-lg` generik Tailwind default).
- [ ] Tidak ada border-radius besar di semua elemen (harus 0/tegas).
- [ ] Warna dibatasi: bg, ink, satu aksen merah — tidak nambah warna lain "biar cantik".
- [ ] Font monospace dipakai konsisten untuk metadata/label, bukan asal ditaruh.
