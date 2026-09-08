import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Akun Baru",
  description:
    "Daftar akun gratis di Cevio untuk menyimpan dan mengelola dokumen CV ATS Anda di cloud.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
