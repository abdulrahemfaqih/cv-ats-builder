Kamu akan membangun **Cevio**, web app CV ATS generator, di dalam project Next.js yang sudah ada (jangan jalankan `create-next-app` lagi, project sudah di-scaffold). Sebelum menulis kode apa pun, baca dulu file berikut sampai selesai — semuanya spesifikasi resmi, bukan opsional:

1. `PRD.md` — requirement fungsional, user flow, field per section CV.
2. `design.md` — sistem desain UI aplikasi (Swiss Industrial monokrom + Plus Jakarta Sans), identitas brand & aturan pakai logo, copy landing page siap pakai, spesifikasi template CV yang ATS-safe, skema database Supabase, dan keputusan teknis (state management, drag-drop, export PDF).
3. `cevio-logo.png` — file logo resmi. Taruh di `/public` project, pakai untuk favicon, navbar, dan hero landing page sesuai aturan di `design.md` bagian 1 (Brand/Logo). Jangan gambar ulang/interpretasi ulang logonya — pakai file ini apa adanya.

Stack: Next.js (App Router), Tailwind CSS, Supabase (Auth + Postgres + Storage).

Ikuti persis keputusan teknis di `design.md` bagian 4 (Zustand, react-hook-form + zod, dnd-kit, @react-pdf/renderer) kecuali ada alasan kuat untuk beda — kalau beda, jelaskan alasannya sebelum lanjut.

Kerjakan bertahap, dan **berhenti untuk konfirmasi di akhir setiap tahap** sebelum lanjut ke tahap berikutnya:

**Tahap 1 — Fondasi & Data**
- Setup Supabase client (server + client component helper sesuai Next.js App Router).
- Buat schema SQL sesuai `design.md` bagian 3 (tabel `profiles`, `cv_documents`, RLS policy, storage bucket `avatars`).
- Setup Auth (Google OAuth + Email/Password) lengkap dengan halaman login/register dan proteksi route dashboard.

**Tahap 2 — CV Builder (inti produk)**
- Bangun state model builder (Zustand) sesuai struktur JSONB `data` di `design.md`.
- Bangun form kiri (per section, collapsible, drag-to-reorder pakai dnd-kit) dan live preview kanan, sesuai layout builder di `design.md` bagian 1.4.
- Live preview HARUS mengikuti struktur template ATS di `design.md` bagian 2, bukan gaya brutalist aplikasi.
- Guest bisa pakai builder penuh tanpa login; hanya aksi "Simpan Draft" yang trigger login wall, dengan data tetap tersimpan (localStorage) dan otomatis ter-restore setelah login sesuai `PRD.md` Flow A.

**Tahap 3 — Export PDF**
- Implement renderer `@react-pdf/renderer` terpisah dari komponen preview HTML, tapi membaca data model yang sama.
- Pastikan output PDF text-selectable, satu kolom, sesuai spesifikasi ATS di `design.md` bagian 2.

**Tahap 4 — Dashboard & Landing Page**
- Dashboard: list CV milik user, create/duplicate/rename/delete, sesuai `PRD.md` Flow C.
- Landing page sesuai `design.md` bagian 1.4 (Landing Page) dengan CTA langsung ke builder.

Setelah tiap tahap, ringkas apa yang sudah dibuat, file apa saja yang berubah, dan tunggu konfirmasi saya sebelum lanjut.
