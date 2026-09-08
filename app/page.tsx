import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col selection:bg-[#111111] selection:text-white">
      {/* Top Navigation */}
      <Navbar currentSection="landing" />

      <main className="flex-1 flex flex-col">
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="w-full border-b border-[#E2E2DC] pt-14 pb-16 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight leading-[1.15]">
                CV yang beneran lolos ATS.
              </h1>

              <p className="text-lg sm:text-xl text-[#666660] leading-relaxed max-w-2xl font-normal">
                Isi form di kiri, hasilnya langsung keliatan di kanan. Kalau udah
                pas, download PDF-nya dan kirim.
              </p>

              <div className="pt-2 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    href="/builder"
                    className="inline-flex items-center justify-center gap-2.5 bg-[#111111] text-white px-7 py-3.5 rounded-lg text-sm font-semibold hover:bg-[#2A2A2A] transition-colors shadow-sm"
                  >
                    <span>Buat CV Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#111111] border border-[#E2E2DC] px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-[#F2F2EE] transition-colors"
                  >
                    Buka Dashboard
                  </Link>
                </div>

                <p className="text-xs text-[#666660] flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#111111]" />
                  Coba dulu tanpa daftar. Login cuma kalau mau simpan draft-nya.
                </p>
              </div>
            </div>

            {/* Right Hero Visual: Authentic ATS Document Preview */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-[420px] bg-white border border-[#E2E2DC] rounded-xl p-6 shadow-sm relative">
                {/* Minimalist Document Preview */}
                <div className="font-[Calibri,Arial,sans-serif] text-black space-y-2.5 select-none pointer-events-none text-left">
                  <div className="text-center pb-1">
                    <div className="font-bold text-sm tracking-wide uppercase">
                      Alex Pratama
                    </div>
                    <div className="text-[7.5pt] text-neutral-600 mt-0.5">
                      Jakarta Selatan, DKI Jakarta |{" "}
                      <span className="text-[#0563C1] underline">
                        linkedin.com/in/alexpratama
                      </span>{" "}
                      |{" "}
                      <span className="text-[#0563C1] underline">
                        alex.pratama@email.com
                      </span>{" "}
                      | 081234567890
                    </div>
                    <div className="w-full border-t border-black mt-1.5" />
                  </div>

                  <div className="text-[7pt] text-neutral-700 leading-snug">
                    Lulusan S1 Ilmu Komputer yang berfokus pada pengembangan
                    web fullstack modern dan rekayasa perangkat lunak scalable.
                  </div>

                  <div>
                    <div className="font-bold text-[8pt] uppercase tracking-wide">
                      Pendidikan
                    </div>
                    <div className="w-full border-t border-black mt-0.5 mb-1" />
                    <div className="flex justify-between text-[7pt] font-bold">
                      <span>S1 - Universitas Indonesia</span>
                      <span>2020 - 2024</span>
                    </div>
                    <div className="italic text-[6.5pt] text-neutral-800">
                      Ilmu Komputer - IPK 3.75
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-[8pt] uppercase tracking-wide">
                      Pengalaman Kerja
                    </div>
                    <div className="w-full border-t border-black mt-0.5 mb-1" />
                    <div className="flex justify-between text-[7pt] font-bold">
                      <span>PT Teknologi Maju Nusantara - Jakarta</span>
                      <span>Agu 2024 - Sekarang</span>
                    </div>
                    <div className="italic text-[6.5pt] text-neutral-800">
                      Fullstack Web Developer
                    </div>
                    <div className="text-[6.5pt] pl-3 text-neutral-700 space-y-0.5 mt-0.5">
                      <div>• Mengembangkan microservice Next.js & Supabase.</div>
                      <div>• Integrasi CI/CD workflow GitHub Actions.</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-[8pt] uppercase tracking-wide">
                      Keterampilan
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
        <section className="w-full py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2E2DC] bg-[#F2F2EE]">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-[#E2E2DC] pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                  Didesain untuk Lolos Screening ATS
                </h2>
                <p className="text-sm text-[#666660] mt-1">
                  Format bersih, teks dapat diseleksi, dan tanpa layout yang membingungkan parser.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Card 1 */}
              <div className="bg-white border border-[#E2E2DC] rounded-xl p-6 space-y-2.5 shadow-sm">
                <span className="text-xs font-semibold text-[#666660]">01</span>
                <h3 className="text-lg font-bold text-[#111111]">
                  Live preview
                </h3>
                <p className="text-sm text-[#666660] leading-relaxed">
                  Ketik di form, hasilnya langsung berubah di panel sebelah.
                  Nggak perlu export bolak-balik cuma buat lihat hasilnya.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-[#E2E2DC] rounded-xl p-6 space-y-2.5 shadow-sm">
                <span className="text-xs font-semibold text-[#666660]">02</span>
                <h3 className="text-lg font-bold text-[#111111]">
                  Beberapa CV, satu akun
                </h3>
                <p className="text-sm text-[#666660] leading-relaxed">
                  Simpan versi berbeda untuk tiap posisi yang kamu lamar:
                  fullstack, frontend, mobile, tanpa bikin dari nol tiap kali
                  ganti tujuan.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-[#E2E2DC] rounded-xl p-6 space-y-2.5 shadow-sm">
                <span className="text-xs font-semibold text-[#666660]">03</span>
                <h3 className="text-lg font-bold text-[#111111]">
                  PDF-nya teks asli, bukan gambar
                </h3>
                <p className="text-sm text-[#666660] leading-relaxed">
                  Hasil download bisa di-select dan di-copy teksnya. Bukan
                  screenshot yang disamarkan jadi PDF, makanya ATS beneran bisa
                  baca isinya.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white border border-[#E2E2DC] rounded-xl p-6 space-y-2.5 shadow-sm">
                <span className="text-xs font-semibold text-[#666660]">04</span>
                <h3 className="text-lg font-bold text-[#111111]">
                  Susun section sesuka kamu
                </h3>
                <p className="text-sm text-[#666660] leading-relaxed">
                  Pendidikan duluan atau pengalaman kerja duluan, kamu yang atur
                  urutannya, tinggal drag.
                </p>
              </div>

              {/* Card 5 */}
              <div className="bg-white border border-[#E2E2DC] rounded-xl p-6 space-y-2.5 shadow-sm">
                <span className="text-xs font-semibold text-[#666660]">05</span>
                <h3 className="text-lg font-bold text-[#111111]">
                  Dua bahasa
                </h3>
                <p className="text-sm text-[#666660] leading-relaxed">
                  Bikin versi Bahasa Indonesia atau English, tinggal pilih
                  sesuai lowongan yang kamu apply.
                </p>
              </div>

              {/* Card 6 */}
              <div className="bg-[#111111] text-white rounded-xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Gratis Tanpa Registrasi Awal
                  </h3>
                  <p className="text-sm text-[#E2E2DC]/80 mt-1.5 leading-relaxed">
                    Langsung uji coba builder interaktif dan unduh PDF Anda sekarang.
                  </p>
                </div>
                <Link
                  href="/builder"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#111111] py-2.5 px-4 rounded-lg text-xs font-semibold hover:bg-[#F2F2EE] transition-colors"
                >
                  Buka Builder Sekarang →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FAQ SECTION (SEO & USER GUIDANCE) */}
        {/* ========================================================================= */}
        <section className="w-full py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2E2DC] bg-[#FFFFFF]">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-semibold text-[#666660] uppercase tracking-wider">
                Pertanyaan Umum
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
                FAQ Seputar CV ATS Friendly
              </h2>
              <p className="text-sm sm:text-base text-[#666660] max-w-xl mx-auto">
                Semua yang perlu kamu ketahui tentang standar lolos seleksi ATS dan fitur Cevio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="border border-[#E2E2DC] rounded-xl p-6 bg-[#F8F8F6]/60 space-y-2.5">
                <h3 className="text-base font-bold text-[#111111]">
                  Apa itu CV ATS Friendly?
                </h3>
                <p className="text-xs sm:text-sm text-[#666660] leading-relaxed">
                  CV ATS Friendly adalah format resume yang terstruktur khusus agar dapat diurai (parse) secara akurat oleh Applicant Tracking System perusahaan tanpa risiko data hilang atau tertukar.
                </p>
              </div>

              <div className="border border-[#E2E2DC] rounded-xl p-6 bg-[#F8F8F6]/60 space-y-2.5">
                <h3 className="text-base font-bold text-[#111111]">
                  Kenapa Cevio menggunakan format 1 kolom?
                </h3>
                <p className="text-xs sm:text-sm text-[#666660] leading-relaxed">
                  Format 1 kolom adalah standar baku internasional yang paling aman untuk algoritma ATS (seperti Taleo, Workday, dan Greenhouse) karena urutan pembacaan data selalu linier dan tidak terpotong.
                </p>
              </div>

              <div className="border border-[#E2E2DC] rounded-xl p-6 bg-[#F8F8F6]/60 space-y-2.5">
                <h3 className="text-base font-bold text-[#111111]">
                  Apakah ekspor PDF menghasilkan teks asli?
                </h3>
                <p className="text-xs sm:text-sm text-[#666660] leading-relaxed">
                  Ya, 100%. Cevio membuat dokumen PDF murni berbasis teks vektor, bukan hasil tangkapan layar gambar (rasterized). Teks dapat diseleksi, dicari, dan dibaca sempurna oleh scanner ATS.
                </p>
              </div>

              <div className="border border-[#E2E2DC] rounded-xl p-6 bg-[#F8F8F6]/60 space-y-2.5">
                <h3 className="text-base font-bold text-[#111111]">
                  Apakah harus mendaftar akun untuk membuat CV?
                </h3>
                <p className="text-xs sm:text-sm text-[#666660] leading-relaxed">
                  Tidak. Kamu bisa langsung mengisi dan mengunduh PDF secara gratis tanpa mendaftar. Pendaftaran akun hanya diperlukan bila kamu ingin menyimpan draft CV ke cloud dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Structured Data (JSON-LD) for Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebApplication",
                  "@id": "https://cevio.id/#app",
                  name: "Cevio",
                  url: "https://cevio.id",
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "All",
                  browserRequirements: "Requires JavaScript. Requires HTML5.",
                  description:
                    "Generator CV ATS-friendly interaktif dengan format 1 kolom standar korporat, live preview real-time, dan export PDF teks asli.",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "IDR",
                  },
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://cevio.id/#faq",
                  mainEntity: [
                    {
                      "@type": "Question",
                      name: "Apa itu CV ATS Friendly?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "CV ATS Friendly adalah format resume yang dirancang khusus agar mudah dibaca, diurai (parse), dan dinilai oleh Applicant Tracking System (ATS) perusahaan tanpa risiko teks hilang atau berantakan.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Kenapa CV Cevio menggunakan format 1 kolom?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Format 1 kolom adalah standar baku yang paling disukai oleh algoritma parsing sistem ATS dan recruiter internasional karena alur membaca data selalu linier dan tidak terpotong kolom ganda.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Apakah ekspor PDF menghasilkan teks asli yang bisa di-copy?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Ya. Cevio menghasilkan PDF berbasis teks asli yang dapat diseleksi dan diurai 100% oleh sistem ATS, bukan gambar rasterized.",
                      },
                    },
                    {
                      "@type": "Question",
                      name: "Apakah harus registrasi akun untuk membuat dan download CV?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Tidak. Anda dapat langsung menggunakan Cevio Builder secara gratis tanpa mendaftar akun. Pendaftaran akun hanya diperlukan jika Anda ingin menyimpan draft CV ke cloud dashboard.",
                      },
                    },
                  ],
                },
              ],
            }),
          }}
        />

        {/* ========================================================================= */}
        {/* SECOND CTA SECTION */}
        {/* ========================================================================= */}
        <section className="w-full py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2E2DC]">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
              Nggak perlu akun buat mulai.
            </h2>

            <p className="text-base sm:text-lg text-[#666660] max-w-xl mx-auto">
              Isi CV-nya sekarang. Baru daftar kalau udah mau simpan.
            </p>

            <div className="pt-2 flex justify-center">
              <Link
                href="/builder"
                className="inline-flex items-center justify-center gap-2.5 bg-[#111111] text-white px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-[#2A2A2A] transition-colors shadow-sm"
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
      <footer className="w-full bg-[#F2F2EE] border-t border-[#E2E2DC] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666660]">
          <div className="flex items-center gap-2.5">
            <div className="relative w-5 h-5">
              <Image
                src="/cevio-logo.png"
                alt="Cevio"
                fill
                sizes="20px"
                className="object-contain"
              />
            </div>
            <span className="font-bold text-[#111111] text-sm">
              Cevio
            </span>
            <span>ATS Resume Generator</span>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/builder" className="hover:text-[#111111] transition-colors">
              Builder
            </Link>
            <Link href="/dashboard" className="hover:text-[#111111] transition-colors">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-[#111111] transition-colors">
              Masuk
            </Link>
          </div>

          <div>© {new Date().getFullYear()} Cevio. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
