import React from "react";
import { CVData } from "@/types/cv";

export async function exportCVToPdf(
  data: CVData,
  language: "id" | "en",
  title?: string
) {
  if (typeof window === "undefined") return;

  try {
    // Dynamic import to avoid SSR errors with @react-pdf/renderer
    const { pdf } = await import("@react-pdf/renderer");
    const { CVPdfDocument } = await import(
      "@/components/pdf/CVPdfDocument"
    );

    const docElement = React.createElement(CVPdfDocument, {
      data,
      language,
    });

    const blob = await pdf(docElement).toBlob();
    const url = URL.createObjectURL(blob);

    // Sanitize file name
    const rawName = data.header.name || title || "CV";
    const sanitized = rawName
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_+/g, "_");
    const filename = `${sanitized}_ATS.pdf`;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  } catch (error) {
    console.error("Gagal membuat file PDF:", error);
    throw error;
  }
}
