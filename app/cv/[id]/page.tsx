"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CVDocument } from "@/types/cv";
import { CVPreview } from "@/components/builder/preview/CVPreview";
import { Download, FileText, ArrowRight, Lock, AlertCircle, Share2, Check } from "lucide-react";

export default function PublicCVPage() {
  const params = useParams();
  const id = params?.id as string;

  const [document, setDocument] = useState<CVDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCV = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        let docData: CVDocument | null = null;

        if (isUuid) {
          const { data: byId } = await supabase
            .from("cv_documents")
            .select("*")
            .eq("id", id)
            .maybeSingle();
          if (byId) docData = byId as CVDocument;
        }

        if (!docData) {
          const { data: bySlug } = await supabase
            .from("cv_documents")
            .select("*")
            .filter("data->settings->>publicSlug", "eq", id)
            .maybeSingle();
          if (bySlug) docData = bySlug as CVDocument;
        }

        if (!docData) {
          setError("Resume ini tidak ditemukan atau tautan belum dipublikasikan.");
          return;
        }

        const isPublic = docData.data?.settings?.isPublic;
        if (!isPublic) {
          setError("Resume ini bersifat privat dan hanya dapat dilihat oleh pemiliknya.");
          return;
        }

        setDocument(docData);
      } catch (e) {
        console.error("Error fetching public CV:", e);
        setError("Terjadi kendala saat memuat resume.");
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [id]);

  const handleDownloadPdf = async () => {
    if (!document) return;
    setIsDownloading(true);
    try {
      const { exportCVToPdf } = await import("@/lib/utils/downloadPdf");
      await exportCVToPdf(
        document.data,
        document.language || "id",
        document.title || document.data.header.name
      );
    } catch (err) {
      console.error("Download PDF error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-[#666660]">Memuat resume web...</p>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E2DC] shadow-sm p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#F8F8F6] border border-[#E2E2DC] flex items-center justify-center mx-auto mb-4 text-[#888880]">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-[#111111] mb-2">
            Resume Privat atau Tidak Ditemukan
          </h2>
          <p className="text-xs text-[#666660] mb-6 leading-relaxed">
            {error || "Tautan yang Anda tuju belum diaktifkan untuk publik."}
          </p>
          <div className="space-y-2">
            <Link
              href="/"
              className="app-btn text-xs px-4 py-2.5 w-full flex items-center justify-center gap-2"
            >
              <span>Buat CV ATS Gratis di Cevio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const candidateName = document.data.header?.name || "Kandidat";

  return (
    <div className="min-h-screen bg-[#ECECE8] flex flex-col">
      {/* Sticky Top Navigation Bar */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-[#E2E2DC] sticky top-0 z-30 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & Candidate info */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="text-lg font-bold text-[#111111] hover:opacity-80 transition-opacity flex-shrink-0"
              title="Cevio CV Builder"
            >
              Cevio
            </Link>
            <span className="text-[#D0D0C8] hidden sm:inline">|</span>
            <div className="truncate">
              <span className="text-xs sm:text-sm font-semibold text-[#111111] truncate block">
                {candidateName}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="app-btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5"
              title="Salin tautan resume"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="hidden sm:inline">Disalin</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#666660]" />
                  <span className="hidden sm:inline">Bagikan</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="app-btn text-xs px-3.5 py-1.5 flex items-center gap-1.5 disabled:opacity-50"
              title="Unduh CV Resmi format PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? "Membuat PDF..." : "Unduh PDF"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Resume Canvas */}
      <main className="flex-1 w-full flex justify-center items-start overflow-x-auto">
        <CVPreview
          data={document.data}
          language={document.language || "id"}
          hidePageInfo={true}
          className="bg-transparent"
        />
      </main>

      {/* Footer Branding */}
      <footer className="w-full py-4 text-center border-t border-[#E2E2DC] bg-white text-xs text-[#8E8C85]">
        <p>
          Resume dibuat menggunakan{" "}
          <Link
            href="/"
            className="font-bold text-[#111111] hover:underline"
          >
            Cevio
          </Link>{" "}
          — Generator CV ATS-Friendly Gratis & Profesional
        </p>
      </footer>
    </div>
  );
}
