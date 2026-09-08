import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor CV ATS — Buat & Download PDF Gratis",
  description:
    "Editor CV ATS-friendly interaktif. Isi formulir dengan panduan standar industri, pantau pratinjau real-time, dan unduh dokumen PDF siap kirim.",
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
