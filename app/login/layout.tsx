import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk ke Akun",
  description: "Masuk ke akun Cevio untuk mengakses dan mengelola CV Anda.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
