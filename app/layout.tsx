import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cevio.id"),
  title: {
    default: "Cevio — CV ATS-Friendly Generator Gratis & Teruji Lolos",
    template: "%s | Cevio",
  },
  description:
    "Buat CV ATS-friendly standar internasional gratis tanpa ribet. Format 1 kolom teruji lolos sistem ATS perusahaan, live preview real-time, dan unduh PDF berbasis teks asli.",
  keywords: [
    "CV ATS",
    "CV ATS friendly",
    "template CV ATS",
    "generator CV gratis",
    "buat CV online",
    "resume builder Indonesia",
    "format CV lolos ATS",
    "CV 1 kolom",
    "download CV PDF",
    "ATS resume maker",
  ],
  authors: [{ name: "Cevio" }],
  creator: "Cevio",
  publisher: "Cevio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Cevio — CV yang Beneran Lolos ATS",
    description:
      "CV generator ATS-friendly interaktif dengan format 1 kolom standar korporat, live preview real-time, dan export PDF teks asli.",
    url: "https://cevio.id",
    siteName: "Cevio",
    images: [
      {
        url: "/cevio-logo.png",
        width: 1200,
        height: 1200,
        alt: "Cevio ATS CV Generator",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cevio — CV yang Beneran Lolos ATS",
    description:
      "CV generator ATS-friendly interaktif dengan format 1 kolom standar korporat, live preview real-time, dan export PDF teks asli.",
    images: ["/cevio-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F8F8F6] text-[#111111] antialiased">
        {children}
      </body>
    </html>
  );
}
