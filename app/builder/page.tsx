"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCVStore } from "@/lib/store/useCVStore";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { SaveDraftModal } from "@/components/builder/SaveDraftModal";
import { HeaderForm } from "@/components/builder/forms/HeaderForm";
import { OverviewForm } from "@/components/builder/forms/OverviewForm";
import { SectionManager } from "@/components/builder/forms/SectionManager";
import { CVPreview } from "@/components/builder/preview/CVPreview";
import { ResizablePanels } from "@/components/builder/ResizablePanels";
import { AlertModal } from "@/components/ui/AlertModal";
import type { User } from "@supabase/supabase-js";

function BuilderContent() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get("id");
  const isNew = searchParams.get("new");

  const {
    data,
    language,
    title,
    hydrateFromLocalStorage,
    loadDocument,
    resetToDefault,
  } = useCVStore();

  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Initialize auth user & load document or hydrate from local storage
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: authData }) => {
      setUser(authData.user ?? null);
    });

    const isConfigured = isSupabaseConfigured();

    if (documentId && isConfigured) {
      supabase
        .from("cv_documents")
        .select("*")
        .eq("id", documentId)
        .single()
        .then(({ data: doc, error }) => {
          if (!error && doc) {
            loadDocument(doc);
          }
        });
    } else if (isNew) {
      resetToDefault("id");
    } else {
      hydrateFromLocalStorage();
    }
  }, [documentId, isNew, hydrateFromLocalStorage, loadDocument, resetToDefault]);

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const { exportCVToPdf } = await import("@/lib/utils/downloadPdf");
      await exportCVToPdf(data, language, title);
    } catch (e) {
      console.error("Download PDF error:", e);
      setPdfError(
        "Terjadi kendala saat merender dokumen ke format PDF. Pastikan browser Anda tidak memblokir popup unduhan file, lalu coba kembali."
      );
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#F8F8F6] flex flex-col">
      {/* Builder Top Bar */}
      <BuilderHeader
        user={user}
        onOpenSaveModal={() => setIsSaveModalOpen(true)}
        onDownloadPdf={handleDownloadPdf}
        isDownloadingPdf={isDownloadingPdf}
      />

      {/* Tab Switcher — visible on mobile & tablet (<lg) */}
      <div className="lg:hidden flex border-b border-[#E2E2DC] bg-white sticky top-16 z-20">
        <button
          type="button"
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-3 text-xs font-semibold text-center transition-colors border-b-2 ${
            activeTab === "form"
              ? "border-[#111111] text-[#111111]"
              : "border-transparent text-[#666660]"
          }`}
        >
          Form Input
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-3 text-xs font-semibold text-center transition-colors border-b-2 ${
            activeTab === "preview"
              ? "border-[#111111] text-[#111111]"
              : "border-transparent text-[#666660]"
          }`}
        >
          Pratinjau CV
        </button>
      </div>

      {/* Mobile & Tablet: single-column with tab switcher */}
      <main className="lg:hidden flex-1 w-full px-4 sm:px-6 py-6 space-y-0">
        <section className={`space-y-6 pb-20 ${activeTab === "preview" ? "hidden" : "block"}`}>
          <HeaderForm />
          <OverviewForm />
          <SectionManager />
        </section>
        <section className={`pb-6 ${activeTab === "form" ? "hidden" : "flex flex-col h-[calc(100dvh-10.5rem)]"}`}>
          <div className="w-full mb-2 flex items-center justify-between text-[11px] text-[#666660] px-1 flex-shrink-0">
            <span className="font-medium flex items-center gap-1.5">
              <span>Format ATS-Friendly (Kertas A4 Asli)</span>
              <span className="text-[10px] bg-[#EAE8E3] text-[#555550] px-1.5 py-0.5 rounded">Pratinjau Real-Time</span>
            </span>
            <span className="text-[10px] text-[#777770]">Geser ↔ horizontal & ↕ vertikal</span>
          </div>
          <div className="w-full flex-1 min-h-0 border border-[#E2E2DC] rounded-xl overflow-hidden bg-[#F7F7F6] shadow-xs">
            <CVPreview data={data} language={language} />
          </div>
        </section>
      </main>

      {/* Desktop: resizable split panels */}
      <main className="hidden lg:flex flex-1 w-full h-[calc(100vh-4rem)] overflow-hidden px-4 xl:px-6 py-6">
        <ResizablePanels
          left={
            <div className="space-y-6 pb-20 pr-4">
              <HeaderForm />
              <OverviewForm />
              <SectionManager />
            </div>
          }
          right={
            <div className="flex flex-col h-full pl-2 overflow-hidden">
              <div className="w-full h-full border border-[#E2E2DC] rounded-xl overflow-hidden bg-[#F7F7F6] shadow-xs">
                <CVPreview data={data} language={language} />
              </div>
            </div>
          }
        />
      </main>

      {/* Save Draft Modal */}
      <SaveDraftModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        user={user}
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={!!pdfError}
        onClose={() => setPdfError(null)}
        title="Gagal Mengunduh PDF"
        message={pdfError || ""}
        variant="error"
        buttonText="Tutup"
      />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center text-xs text-[#666660]">
          Memuat CV Builder...
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}
