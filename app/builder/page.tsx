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

  // Initialize auth user & load document or hydrate from local storage
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: authData }) => {
      setUser(authData.user ?? null);
    });

    const isConfigured = isSupabaseConfigured();

    if (documentId && isConfigured) {
      // Load specific document from Supabase
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
      // Explicit new CV
      resetToDefault("id");
    } else {
      // Guest or returning user: hydrate from localStorage
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
      alert("Gagal membuat PDF. Silakan coba kembali.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      {/* Builder Top Bar */}
      <BuilderHeader
        user={user}
        onOpenSaveModal={() => setIsSaveModalOpen(true)}
        onDownloadPdf={handleDownloadPdf}
        isDownloadingPdf={isDownloadingPdf}
      />

      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex border-b-2 border-[#0A0A0A] bg-[#EAE8E3] sticky top-16 z-20">
        <button
          type="button"
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-center transition-colors ${
            activeTab === "form"
              ? "bg-[#0A0A0A] text-white"
              : "bg-transparent text-[#0A0A0A]"
          }`}
        >
          [ FORM INPUT ]
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-center transition-colors ${
            activeTab === "preview"
              ? "bg-[#0A0A0A] text-white"
              : "bg-transparent text-[#0A0A0A]"
          }`}
        >
          [ LIVE PREVIEW ]
        </button>
      </div>

      {/* Main Split Layout */}
      <main className="flex-1 flex flex-col md:flex-row max-w-[1700px] w-full mx-auto">
        {/* Left Column: Form Editor (~45%) */}
        <section
          className={`w-full md:w-[46%] lg:w-[44%] p-4 sm:p-6 lg:p-8 space-y-8 md:border-r-2 md:border-[#0A0A0A] overflow-y-auto ${
            activeTab === "form" ? "block" : "hidden md:block"
          }`}
        >
          {/* Header Card */}
          <div className="swiss-card p-5 space-y-4">
            <div className="border-b border-[#0A0A0A] pb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase text-[#0A0A0A]">
                [ 00 // INFORMASI KONTAK & IDENTITAS ]
              </span>
            </div>
            <HeaderForm />
          </div>

          {/* Overview Card */}
          <div className="swiss-card p-5">
            <OverviewForm />
          </div>

          {/* Dynamic Sortable Sections */}
          <div className="pt-2">
            <SectionManager />
          </div>
        </section>

        {/* Right Column: Live ATS Preview (~55%) */}
        <section
          className={`w-full md:w-[54%] lg:w-[56%] bg-[#EAE8E3] p-4 sm:p-6 lg:p-8 overflow-y-auto md:sticky md:top-16 md:h-[calc(100vh-4rem)] flex justify-center ${
            activeTab === "preview" ? "block" : "hidden md:flex"
          }`}
        >
          <div className="w-full max-w-[850px]">
            <div className="mb-3 hidden sm:flex items-center justify-between font-mono text-[11px] text-[#5C5A54] border-b border-[#0A0A0A]/20 pb-1.5">
              <span>FORMAT CV ATS STANDARD // KERTAS A4</span>
              <span>1 KOLOM • TEKS ASLI • TANPA TABEL</span>
            </div>
            <CVPreview data={data} language={language} />
          </div>
        </section>
      </main>

      {/* Save Draft Modal */}
      <SaveDraftModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        user={user}
      />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F4F0] flex items-center justify-center font-mono text-xs uppercase text-[#5C5A54]">
          MEMUAT CV BUILDER...
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}
