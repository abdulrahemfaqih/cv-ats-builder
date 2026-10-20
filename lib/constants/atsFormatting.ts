import { ATSFont, ATSSpacing } from "@/types/cv";

export interface FontOption {
  id: ATSFont;
  name: string;
  fontFamily: string;
  pdfFont: string;
  docxFont: string;
  category: string;
}

export const ATS_FONTS: Record<ATSFont, FontOption> = {
  arial: {
    id: "arial",
    name: "Arial",
    fontFamily: "Arial, Helvetica, sans-serif",
    pdfFont: "Helvetica",
    docxFont: "Arial",
    category: "Sans-Serif (Standar ATS Paling Populer)",
  },
  times: {
    id: "times",
    name: "Times New Roman",
    fontFamily: "'Times New Roman', Times, serif",
    pdfFont: "Times-Roman",
    docxFont: "Times New Roman",
    category: "Serif (Klasik, Formal, & Akademik)",
  },
  calibri: {
    id: "calibri",
    name: "Calibri",
    fontFamily: "Calibri, Candara, 'Segoe UI', Arial, sans-serif",
    pdfFont: "Helvetica",
    docxFont: "Calibri",
    category: "Sans-Serif (Modern & Bersih)",
  },
  garamond: {
    id: "garamond",
    name: "Garamond",
    fontFamily: "Garamond, 'EB Garamond', Georgia, serif",
    pdfFont: "Times-Roman",
    docxFont: "Garamond",
    category: "Serif (Elegan & Sangat Hemat Ruang)",
  },
  roboto: {
    id: "roboto",
    name: "Roboto",
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, sans-serif",
    pdfFont: "Helvetica",
    docxFont: "Roboto",
    category: "Sans-Serif (Teknologi & Digital)",
  },
};

export interface SpacingOption {
  id: ATSSpacing;
  label: string;
  badge: string;
  description: string;
  previewLineHeight: string;
  previewSectionMargin: string;
  previewEntrySpacing: string;
  pdfPaddingY: number;
  pdfPaddingX: number;
  pdfLineHeight: number;
  pdfSectionMargin: number;
  pdfEntryMargin: number;
  docxBefore: number;
  docxAfter: number;
  docxLine: number;
}

export const ATS_SPACINGS: Record<ATSSpacing, SpacingOption> = {
  compact: {
    id: "compact",
    label: "Padat (Compact)",
    badge: "Pas 1 Halaman",
    description: "Sangat efektif untuk memadatkan CV agar tidak bocor 1-2 baris ke halaman kedua.",
    previewLineHeight: "leading-[1.25]",
    previewSectionMargin: "mb-2.5",
    previewEntrySpacing: "space-y-1.5",
    pdfPaddingY: 28,
    pdfPaddingX: 36,
    pdfLineHeight: 1.2,
    pdfSectionMargin: 9,
    pdfEntryMargin: 5,
    docxBefore: 110,
    docxAfter: 15,
    docxLine: 230,
  },
  normal: {
    id: "normal",
    label: "Standar (Normal)",
    badge: "Rekomendasi",
    description: "Proporsi seimbang antara kerapatan dokumen dan kenyamanan membaca.",
    previewLineHeight: "leading-[1.38]",
    previewSectionMargin: "mb-4",
    previewEntrySpacing: "space-y-2.5",
    pdfPaddingY: 36,
    pdfPaddingX: 40,
    pdfLineHeight: 1.35,
    pdfSectionMargin: 13,
    pdfEntryMargin: 7,
    docxBefore: 160,
    docxAfter: 25,
    docxLine: 260,
  },
  relaxed: {
    id: "relaxed",
    label: "Renggang (Relaxed)",
    badge: "Lebih Lapang",
    description: "Cocok untuk CV dengan konten ringkas agar kertas terlihat penuh dan proporsional.",
    previewLineHeight: "leading-[1.52]",
    previewSectionMargin: "mb-5",
    previewEntrySpacing: "space-y-3.5",
    pdfPaddingY: 42,
    pdfPaddingX: 44,
    pdfLineHeight: 1.5,
    pdfSectionMargin: 17,
    pdfEntryMargin: 10,
    docxBefore: 220,
    docxAfter: 35,
    docxLine: 300,
  },
};
