# PRD — Cevio (CV ATS Generator)

## 1. Ringkasan

**Cevio** adalah web app untuk membuat CV berformat ATS-friendly secara interaktif (form di kiri, live preview di kanan), lalu diunduh sebagai PDF. User bisa membuat lebih dari satu CV untuk disesuaikan dengan posisi yang berbeda (mis. CV Fullstack, CV Frontend, CV Mobile Dev).

**Stack:** Next.js (App Router, project sudah ada — jangan install ulang) + Tailwind CSS + Supabase (Auth, Postgres, Storage).

**Prinsip penting yang membedakan produk ini dari template CV generator lain:**
- Tampilan **aplikasi** (landing page, dashboard, builder) boleh punya karakter visual yang kuat/menarik.
- Tampilan **CV yang dihasilkan (output PDF)** harus tetap murni ATS-safe: satu kolom, teks asli (bukan gambar/rasterized), font standar, tanpa tabel/grafik/ikon dekoratif. Dua hal ini didesain terpisah — lihat `design.md`.

---

## 2. User Roles

| Role | Kemampuan |
|---|---|
| **Guest** (belum login) | Buka landing page → langsung build CV di builder, isi semua field, lihat live preview, **download PDF**. Tidak bisa menyimpan sebagai draft ke akun. |
| **Registered User** | Semua kemampuan guest + simpan draft, punya banyak CV tersimpan di dashboard, edit/duplicate/hapus/rename CV kapan saja. |

Auth: Supabase Auth — Google OAuth **atau** Email/Password (dengan verifikasi email standar Supabase).

---

## 3. User Flows

### Flow A — Guest membuat CV langsung dari landing page
1. User buka landing page → ada CTA "Buat CV Sekarang" yang langsung membuka builder (bukan halaman terpisah, atau scroll ke section builder — bebas dipilih agent, tapi builder harus bisa diakses tanpa login).
2. User isi builder (lihat Flow C).
3. User bisa **download PDF kapan saja**, tanpa login.
4. Saat user klik **"Simpan Draft"**, tampilkan modal/redirect ke login/register. Setelah berhasil login, data yang sudah diisi di builder **tidak boleh hilang** — auto-restore dari local state (localStorage/sessionStorage) lalu otomatis tersimpan ke akun yang baru login.

### Flow B — Register / Login
- Opsi: Google OAuth, atau Email + Password.
- Setelah sukses, redirect ke Dashboard (atau kembali ke builder jika datang dari Flow A step 4).

### Flow C — Dashboard
- Menampilkan daftar CV milik user (card/list): judul CV (mis. "CV Fullstack Developer"), preview thumbnail kecil (opsional, boleh placeholder ikon dokumen), tanggal update terakhir.
- Aksi per item: Edit, Duplicate, Rename, Delete (dengan konfirmasi).
- Tombol "Buat CV Baru" → masuk ke builder kosong, minta user beri judul/label CV (untuk membedakan di dashboard, contoh: "Fullstack", "Frontend Developer", "Mobile Dev").

### Flow D — CV Builder (inti produk)
Urutan pengisian:
1. **Pilih bahasa CV: Indonesia / English.** Pilihan ini menentukan label section yang tersedia di langkah 4 (mis. "Pengalaman Kerja" vs "Work Experience"). Bahasa bisa diganti lagi belakangan tapi user diberi warning bahwa label section akan ikut berubah.
2. **Header**: Nama lengkap, toggle "gunakan foto profil" (jika ya → upload/crop foto, ditempatkan pojok kiri atas — lihat `design.md` untuk ukuran).
3. **Info kontak**: Alamat (Kecamatan, Kabupaten, Provinsi), Email, No. Telepon, LinkedIn (opsional), Portofolio/link (opsional). Ditampilkan sebagai satu baris dipisah `|`, urutan tetap mengikuti contoh CV asli:
   `Kec. X, Kab. Y, Prov. Z | Linkedin : {link} | {email} | {no. telp} | Portofolio : {link}`
   Field opsional yang kosong otomatis tidak ikut ditampilkan (tidak ada `|` ganda/nyangkut).
4. **Overview**: textarea paragraf ringkasan profil.
5. **Pilih & susun section**: user memilih section apa saja yang ingin dipakai dari daftar berikut (semua opsional, bisa pilih sebagian), lalu bisa **drag-and-drop mengurutkan** section sesuai keinginan:
   - Pendidikan / Education
   - Pengalaman Kerja / Work Experience
   - Pengalaman Organisasi / Organizational Experience
   - Proyek / Projects
   - Keterampilan / Skills
   - Sertifikasi / Certifications
   - Pelatihan / Training
   - Pencapaian / Achievements
   Setiap section yang dipilih bisa diisi **lebih dari satu entri** (mis. 3 pengalaman kerja), dan urutan entri di dalam satu section juga bisa di-drag.
6. Live preview di kanan update real-time (debounce ~300ms) mengikuti input form.
7. User bisa **Download PDF** kapan saja, dan (jika login) **Simpan Draft** / autosave berkala.

---

## 4. Field per Section

### Pendidikan
| Field | Wajib | Catatan |
|---|---|---|
| Jenjang | Ya | Dropdown: SMA/SMK, D3, S1, S2, S3 |
| Nama Universitas/Institusi | Ya | |
| Alamat (Kabupaten, Provinsi) | Ya | |
| Negara | Tidak | default kosong/disembunyikan; isi manual kalau mau ditampilkan (mengikuti contoh PDF yang kadang mencantumkan ", Indonesia") |
| Program Studi | Ya | |
| IPK | Ya | |
| Tahun Mulai — Tahun Selesai | Ya | |
| Mata Kuliah Relevan | Tidak | comma-separated |
| Deskripsi | Tidak | free text |

### Pengalaman Kerja & Pengalaman Organisasi (struktur field sama, section terpisah)
| Field | Wajib | Catatan |
|---|---|---|
| Nama Perusahaan/Organisasi | Ya | |
| Alamat (Kabupaten, Provinsi) | Ya | |
| Negara | Tidak | sama seperti di Pendidikan |
| Posisi/Jabatan | Ya | |
| Tipe/Status | Tidak | mis. "Intern", "Full-time", "Paruh Waktu" — kalau diisi, dirender nempel di belakang posisi dipisah " - " (contoh: "Fullstack Developer - Intern"), sesuai contoh PDF |
| Bulan/Tahun Mulai — Bulan/Tahun Selesai | Ya | opsi "Sekarang" untuk yang masih berjalan |
| Deskripsi | Ya | list bullet point, user bisa tambah/hapus baris bullet |

### Proyek
| Field | Wajib | Catatan |
|---|---|---|
| Nama Proyek | Ya | |
| Link Proyek | Tidak | ditampilkan sebagai teks link biasa (bukan card/gambar) |
| Tahun Pengerjaan | Ya | |
| Deskripsi | Ya | list bullet point |

### Keterampilan / Skills
- User membuat **grup** bebas (contoh: "Bahasa Pemrograman", "Framework & Library", "Database", "Tools") — nama grup diketik manual, lalu isi list item per grup (comma/tag input).
- Bisa tambah/hapus grup dan item secara bebas, urutan grup bisa di-drag.

### Sertifikasi
| Field | Wajib | Catatan |
|---|---|---|
| Nama Sertifikasi | Ya | |
| Lembaga Penerbit | Ya | |
| Bulan/Tahun Terbit | Ya | |
| Bulan/Tahun Kedaluwarsa | Tidak | toggle "Tidak ada masa berlaku / seumur hidup" |

### Pelatihan
| Field | Wajib | Catatan |
|---|---|---|
| Nama Pelatihan | Ya | |
| Lembaga Penyelenggara | Ya | |
| Bulan/Tahun | Ya | |

### Pencapaian / Achievements
*(tidak dirinci user, asumsi berikut dipakai — silakan sesuaikan jika perlu)*
| Field | Wajib | Catatan |
|---|---|---|
| Nama Pencapaian | Ya | mis. "Juara 2 Gemastik 2025" |
| Penyelenggara/Konteks | Tidak | mis. nama event/institusi |
| Bulan/Tahun | Ya | |
| Deskripsi | Tidak | free text singkat |

---

## 5. Fitur Non-Builder

- **Landing Page**: hero + CTA langsung ke builder, showcase singkat kelebihan produk (gratis, ATS-safe, multi-CV per posisi), tidak perlu banyak section — fokus ke "coba langsung". Copy siap pakai ada di `design.md` bagian 1.4.
- **Export PDF**: harus text-selectable (bukan screenshot/rasterized image) supaya benar-benar lolos parsing ATS. Lihat keputusan teknis di `design.md`.
- **Autosave** (khusus user login): simpan otomatis ke Supabase setiap beberapa detik setelah user berhenti mengetik (debounce), plus tombol simpan manual.
- **Multi-CV per user**: tidak ada batas jumlah CV per akun (kecuali agent ingin menambahkan limit wajar, opsional).

## 6. Non-Functional Requirements

- Live preview tidak boleh lag — gunakan debounce, hindari re-render seluruh form saat mengetik.
- Builder harus tetap dapat dipakai dengan baik di mobile (form dan preview di-stack, bukan side-by-side, dengan tab switch "Form / Preview").
- Data guest (sebelum login) disimpan sementara di client (localStorage), bukan di server, sampai user memutuskan simpan draft (baru butuh akun).
- RLS (Row Level Security) di Supabase: user hanya bisa baca/tulis CV miliknya sendiri.

## 7. Out of Scope (v1)

Tidak perlu dikerjakan dulu kecuali diminta lanjut secara eksplisit:
- Multiple template/tema desain CV (v1 cukup satu template ATS default sesuai `design.md`).
- AI-assisted content suggestion/rewriting.
- Cover letter generator.
- Sharing CV via public link.

---

Referensi struktur/format asli yang jadi acuan: contoh CV yang sudah dilampirkan user (nama besar di atas, baris kontak dipisah `|`, overview paragraf, section header, dst).
