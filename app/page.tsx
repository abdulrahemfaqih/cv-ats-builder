import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col selection:bg-[#0A0A0A] selection:text-[#F4F4F0]">
      {/* Top Navigation */}
      <Navbar currentSection="landing" />

      <main className="flex-1 flex flex-col">
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="w-full border-b-2 border-[#0A0A0A] pt-12 pb-16 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#EAE8E3] border border-[#0A0A0A] font-mono text-[11px] font-bold uppercase tracking-wider text-[#0A0A0A]">
                <span className="w-2 h-2 bg-[#E61919] inline-block"></span>
                [ CEVIO // ATS RESUME ARCHITECTURE ]
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold uppercase tracking-tight text-[#0A0A0A] leading-[1.05]">
                CV yang beneran lolos ATS.
              </h1>

              <p className="text-lg sm:text-xl text-[#5C5A54] leading-relaxed max-w-2xl font-normal">
                Isi form di kiri, hasilnya langsung keliatan di kanan. Kalau udah
                pas, download PDF-nya dan kirim.
              </p>

              <div className="pt-2 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link
                    href="/builder"
                    className="inline-flex items-center justify-center gap-3 bg-[#0A0A0A] text-[#F4F4F0] border-2 border-[#0A0A0A] px-8 py-4 font-mono text-sm font-bold uppercase tracking-wider hover:bg-[#F4F4F0] hover:text-[#0A0A0A] transition-colors"
                  >
                    <span>Buat CV Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 bg-transparent text-[#0A0A0A] border-2 border-[#0A0A0A] px-6 py-4 font-mono text-sm font-bold uppercase tracking-wider hover:bg-[#EAE8E3] transition-colors"
                  >
                    Buka Dashboard
                  </Link>
                </div>

                <p className="font-mono text-xs text-[#5C5A54] flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0A0A0A]" />
                  Coba dulu tanpa daftar. Login cuma kalau mau simpan draft-nya.
                </p>
              </div>
            </div>

            {/* Right Hero Visual (5 cols): Authentic ATS Document Mockup */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-[420px] bg-white border-2 border-[#0A0A0A] p-6 shadow-[10px_10px_0px_#0A0A0A] relative rotate-1 hover:rotate-0 transition-transform duration-300">
                {/* Physical Document Tag */}
                <div className="absolute -top-3.5 right-4 bg-[#0A0A0A] text-[#F4F4F0] font-mono text-[9px] uppercase px-2 py-0.5 tracking-widest font-bold">
                  CONTOH OUTPUT PDF ATS
                </div>

                {/* Simulated Real ATS Content */}
                <div className="font-[Calibri,Arial,sans-serif] text-black space-y-2.5 select-none pointer-events-none text-left">
                  <div className="text-center pb-1">
                    <div className="font-bold text-sm tracking-wide uppercase">
                      ABDUL RAHEM FAQIH
                    </div>
                    <div className="text-[7.5pt] text-neutral-800 mt-0.5">
                      Kec. Kamal, Kab. Bangkalan |{" "}
                      <span className="text-[#0563C1] underline">
                        linkedin.com/in/rhmfaqih
                      </span>{" "}
                      |{" "}
                      <span className="text-[#0563C1] underline">
                        faqih3935@gmail.com
                      </span>{" "}
                      | 089531419612
                    </div>
                    <div className="w-full border-t border-black mt-1.5" />
                  </div>

                  <div className="text-[7pt] text-neutral-700 leading-snug">
                    Lulusan S1 Teknik Informatika yang berfokus pada pengembangan
                    web fullstack modern dan rekayasa perangkat lunak scalable.
                  </div>

                  <div>
                    <div className="font-bold text-[8pt] uppercase tracking-wide">
                      PENDIDIKAN
                    </div>
                    <div className="w-full border-t border-black mt-0.5 mb-1" />
                    <div className="flex justify-between text-[7pt] font-bold">
                      <span>S1 - Universitas Trunojoyo Madura</span>
                      <span>2022 - 2026</span>
                    </div>
                    <div className="italic text-[6.5pt]">
                      Teknik Informatika - IPK 3.87
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-[8pt] uppercase tracking-wide">
                      PENGALAMAN KERJA
                    </div>
                    <div className="w-full border-t border-black mt-0.5 mb-1" />
                    <div className="flex justify-between text-[7pt] font-bold">
                      <span>Tech Kreasi Nusantara - Surabaya</span>
                      <span>Agu 2024 - Jan 2025</span>
                    </div>
                    <div className="italic text-[6.5pt]">
                      Fullstack Web Developer - Intern
                    </div>
                    <div className="text-[6.5pt] pl-3 text-neutral-800 space-y-0.5 mt-0.5">
                      <div>• Mengembangkan microservice Next.js & Supabase.</div>
                      <div>• Integrasi CI/CD workflow GitHub Actions.</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-[8pt] uppercase tracking-wide">
                      KETERAMPILAN
                    </div>
                    <div className="w-full border-t border-black mt-0.5 mb-1" />
                    <div className="text-[6.5pt]">
                      <span className="font-bold">Languages : </span>
                      <span>TypeScript, JavaScript, SQL, HTML, CSS</span>
                    </div>
                    <div className="text-[6.5pt]">
                      <span className="font-bold">Frameworks : </span>
                      <span>Next.js, React, Tailwind CSS, Node.js</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FITUR SECTION */}
        {/* ========================================================================= */}
        <section className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-[#0A0A0A] bg-[#EAE8E3]">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="border-b-2 border-[#0A0A0A] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-2">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#5C5A54] block mb-1">
                  [ FITUR // FITUR UTAMA ]
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
                  Didesain untuk Lolos Screening ATS
                </h2>
              </div>
              <span className="font-mono text-xs text-[#5C5A54]">
                5 PRINSIP INTI CEVIO
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-[#F4F4F0] border-2 border-[#0A0A0A] p-6 sm:p-8 space-y-3">
                <span className="font-mono text-xs font-bold text-[#E61919]">
                  {"// 01"}
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A]">
                  Live preview
                </h3>
                <p className="text-sm text-[#5C5A54] leading-relaxed">
                  Ketik di form, hasilnya langsung berubah di panel sebelah.
                  Nggak perlu export bolak-balik cuma buat lihat hasilnya.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#F4F4F0] border-2 border-[#0A0A0A] p-6 sm:p-8 space-y-3">
                <span className="font-mono text-xs font-bold text-[#E61919]">
                  {"// 02"}
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A]">
                  Beberapa CV, satu akun
                </h3>
                <p className="text-sm text-[#5C5A54] leading-relaxed">
                  Simpan versi berbeda untuk tiap posisi yang kamu lamar —
                  fullstack, frontend, mobile — tanpa bikin dari nol tiap kali
                  ganti tujuan.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#F4F4F0] border-2 border-[#0A0A0A] p-6 sm:p-8 space-y-3">
                <span className="font-mono text-xs font-bold text-[#E61919]">
                  {"// 03"}
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A]">
                  PDF-nya teks asli, bukan gambar
                </h3>
                <p className="text-sm text-[#5C5A54] leading-relaxed">
                  Hasil download bisa di-select dan di-copy teksnya. Bukan
                  screenshot yang disamarkan jadi PDF — makanya ATS beneran bisa
                  baca isinya.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-[#F4F4F0] border-2 border-[#0A0A0A] p-6 sm:p-8 space-y-3">
                <span className="font-mono text-xs font-bold text-[#E61919]">
                  {"// 04"}
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A]">
                  Susun section sesuka kamu
                </h3>
                <p className="text-sm text-[#5C5A54] leading-relaxed">
                  Pendidikan duluan atau pengalaman kerja duluan, kamu yang atur
                  urutannya, tinggal drag.
                </p>
              </div>

              {/* Card 5 */}
              <div className="bg-[#F4F4F0] border-2 border-[#0A0A0A] p-6 sm:p-8 space-y-3">
                <span className="font-mono text-xs font-bold text-[#E61919]">
                  {"// 05"}
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A]">
                  Dua bahasa
                </h3>
                <p className="text-sm text-[#5C5A54] leading-relaxed">
                  Bikin versi Bahasa Indonesia atau English, tinggal pilih
                  sesuai lowongan yang kamu apply.
                </p>
              </div>

              {/* Card 6 (Action) */}
              <div className="bg-[#0A0A0A] text-[#F4F4F0] border-2 border-[#0A0A0A] p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div>
                  <span className="font-mono text-xs font-bold text-[#E61919]">
                    {"// SIAP MULAI?"}
                  </span>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white mt-2">
                    Gratis Tanpa Registrasi Awal
                  </h3>
                  <p className="text-sm text-[#EAE8E3]/80 mt-2">
                    Langsung uji coba builder interaktif sekarang.
                  </p>
                </div>
                <Link
                  href="/builder"
                  className="inline-flex items-center justify-center gap-2 bg-[#F4F4F0] text-[#0A0A0A] py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#EAE8E3] transition-colors"
                >
                  Buka Builder Sekarang →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECOND CTA SECTION */}
        {/* ========================================================================= */}
        <section className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-[#0A0A0A]">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="font-mono text-xs uppercase tracking-wider text-[#5C5A54] block">
              [ MULAI CEPAT // TANPA HAMBATAN ]
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
              Nggak perlu akun buat mulai.
            </h2>

            <p className="text-base sm:text-lg text-[#5C5A54] max-w-xl mx-auto">
              Isi CV-nya sekarang. Baru daftar kalau udah mau simpan.
            </p>

            <div className="pt-4 flex justify-center">
              <Link
                href="/builder"
                className="inline-flex items-center justify-center gap-3 bg-[#0A0A0A] text-[#F4F4F0] border-2 border-[#0A0A0A] px-10 py-4 font-mono text-sm font-bold uppercase tracking-wider hover:bg-[#F4F4F0] hover:text-[#0A0A0A] transition-colors"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="w-full bg-[#EAE8E3] border-t-2 border-[#0A0A0A] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#5C5A54]">
          <div className="flex items-center gap-3">
            <div className="relative w-6 h-6">
              <Image
                src="/cevio-logo.png"
                alt="Cevio"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-[#0A0A0A] text-sm lowercase first-letter:uppercase">
              Cevio
            </span>
            <span>— ATS Resume Generator</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/builder" className="hover:text-[#0A0A0A]">
              Builder
            </Link>
            <Link href="/dashboard" className="hover:text-[#0A0A0A]">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-[#0A0A0A]">
              Login
            </Link>
          </div>

          <div>© {new Date().getFullYear()} CEVIO. SWISS INDUSTRIAL PRINT SYSTEM.</div>
        </div>
      </footer>
    </div>
  );
}
