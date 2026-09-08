import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard CV Saya",
  description: "Kelola, buat salinan, dan edit draft CV Anda di Cevio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
