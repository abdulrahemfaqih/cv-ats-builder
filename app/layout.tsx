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
  title: "Cevio — CV yang beneran lolos ATS",
  description:
    "CV generator ATS-friendly interaktif dengan format murni ATS, live preview real-time, dan export PDF teks asli.",
  icons: {
    icon: "/cevio-logo.png",
    shortcut: "/cevio-logo.png",
    apple: "/cevio-logo.png",
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
      <body className="min-h-full flex flex-col font-sans bg-[#F4F4F0] text-[#0A0A0A] antialiased">
        {children}
      </body>
    </html>
  );
}
