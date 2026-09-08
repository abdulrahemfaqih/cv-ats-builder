import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cevio — CV ATS Friendly Generator",
    short_name: "Cevio",
    description:
      "CV generator ATS-friendly interaktif dengan format 1 kolom standar korporat, live preview real-time, dan export PDF teks asli.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F8F6",
    theme_color: "#111111",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
