"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCVStore } from "@/lib/store/useCVStore";
import {
  Save,
  Download,
  ArrowLeft,
  Globe,
  RotateCcw,
  ChevronDown,
  FileText,
  FileType,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LanguageModal } from "@/components/builder/LanguageModal";

interface BuilderHeaderProps {
  user: User | null;
  onOpenSaveModal: () => void;
  onDownloadPdf: () => void;
  isDownloadingPdf?: boolean;
  onDownloadDocx: () => void;
  isDownloadingDocx?: boolean;
}

export function BuilderHeader({
  user,
  onOpenSaveModal,
  onDownloadPdf,
  isDownloadingPdf,
  onDownloadDocx,
  isDownloadingDocx,
}: BuilderHeaderProps) {
  const { title, setTitle, language, setLanguage, isDirty, isSaving, resetToBlank } = useCVStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDownloadOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) {
        setIsDownloadOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDownloadOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDownloadOpen]);

  return (
    <header className="w-full bg-[#F8F8F6]/95 backdrop-blur-md border-b border-[#E2E2DC] sticky top-0 z-30">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand & Document Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 group flex-shrink-0 text-[#111111] hover:opacity-80 transition-opacity"
            title="Kembali ke Beranda"
          >
            <span className="text-xl font-bold tracking-tight text-[#111111] hidden sm:inline-block">
              Cevio
            </span>
          </Link>

          <span className="text-[#D0D0C8] hidden sm:inline-block">/</span>

          {/* Editable Title */}
          <div className="flex items-center gap-2 min-w-0">
            {isEditingTitle ? (
              <input
                type="text"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                className="app-input text-xs font-semibold py-1 px-2.5 w-48 sm:w-64"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingTitle(true)}
                className="text-xs sm:text-sm font-semibold text-[#111111] hover:bg-[#EAE8E3]/60 rounded-md px-2 py-1 transition-colors truncate max-w-[180px] sm:max-w-[280px]"
                title="Klik untuk mengubah judul dokumen"
              >
                {title || "Untitled CV"}
              </button>
            )}

            {/* Status indicator: Clean understated typography, no bullet dot or pill badge */}
            <span className="text-xs text-[#8E8C85] select-none hidden md:inline ml-1 font-normal">
              {isSaving ? "Menyimpan..." : isDirty ? "Belum disimpan" : "Tersimpan"}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setIsLanguageModalOpen(true)}
            className="text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg border border-[#E2E2DC] bg-white hover:bg-[#F2F2EE] text-[#111111] flex items-center gap-1.5 transition-colors"
            title="Ganti Bahasa CV"
          >
            <Globe className="w-3.5 h-3.5 text-[#666660]" />
            <span className="hidden sm:inline">{language.toUpperCase()}</span>
          </button>

          {/* Reset / Blank CV Button */}
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-lg border border-[#E2E2DC] bg-white hover:bg-[#F2F2EE] text-[#666660] hover:text-[#111111] flex items-center gap-1.5 transition-colors"
            title="Kosongkan seluruh isian CV untuk mulai dari awal"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#666660]" />
            <span className="hidden md:inline">Kosongkan</span>
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={onOpenSaveModal}
            className="app-btn-outline text-xs px-2 sm:px-3.5 py-1.5 flex items-center gap-1.5"
            title="Simpan CV ke akun"
          >
            <Save className="w-3.5 h-3.5 text-[#666660]" />
            <span className="hidden sm:inline">Simpan Draft</span>
          </button>

          {/* Download Dropdown (PDF & Word) */}
          <div className="relative" ref={downloadRef}>
            <button
              type="button"
              onClick={() => setIsDownloadOpen((prev) => !prev)}
              disabled={isDownloadingPdf || isDownloadingDocx}
              className="app-btn text-xs px-2.5 sm:px-3.5 py-1.5 flex items-center gap-1.5 disabled:opacity-50"
              title="Pilih format unduhan CV (PDF atau Word)"
              aria-expanded={isDownloadOpen}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isDownloadingPdf
                  ? "Membuat PDF..."
                  : isDownloadingDocx
                  ? "Membuat Word..."
                  : "Unduh CV"}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-[#CCCCCC] transition-transform duration-200 ${
                  isDownloadOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Popover */}
            {isDownloadOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-[#E2E2DC] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-[#F0EFEB] mb-1">
                  <p className="text-[10px] font-bold text-[#8E8C85] uppercase tracking-wider">
                    Format Dokumen ATS
                  </p>
                </div>

                {/* Option 1: PDF */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDownloadOpen(false);
                    onDownloadPdf();
                  }}
                  disabled={isDownloadingPdf || isDownloadingDocx}
                  className="w-full text-left px-3 py-2.5 hover:bg-[#F8F8F6] transition-colors flex items-start gap-3 group disabled:opacity-50"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#111111] group-hover:text-black">
                        Dokumen PDF (.pdf)
                      </span>
                      <span className="text-[9px] font-semibold bg-[#EAE8E3] text-[#555550] px-1.5 py-0.5 rounded">
                        Direkomendasikan
                      </span>
                    </div>
                    <p className="text-[11px] text-[#666660] mt-0.5 leading-snug">
                      Format standar ATS siap kirim ke portal HRD, tata letak teks rapi dan terkunci.
                    </p>
                  </div>
                </button>

                {/* Option 2: Word (DOCX) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDownloadOpen(false);
                    onDownloadDocx();
                  }}
                  disabled={isDownloadingPdf || isDownloadingDocx}
                  className="w-full text-left px-3 py-2.5 hover:bg-[#F8F8F6] transition-colors flex items-start gap-3 group disabled:opacity-50"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors mt-0.5">
                    <FileType className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#111111] group-hover:text-black">
                        Microsoft Word (.docx)
                      </span>
                      <span className="text-[9px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                        Bisa Diedit
                      </span>
                    </div>
                    <p className="text-[11px] text-[#666660] mt-0.5 leading-snug">
                      Format ATS yang dapat diedit langsung di Microsoft Word atau Google Docs.
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {user && (
            <Link
              href="/dashboard"
              className="app-btn-outline text-xs p-1.5 hidden md:inline-flex"
              title="Ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Modal: Ganti Bahasa (Rendered via createPortal to document.body) */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={language}
        onSelectLanguage={(lang) => setLanguage(lang)}
      />

      {/* Modal: Konfirmasi Kosongkan CV */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={() => resetToBlank(language)}
        title="Kosongkan Seluruh Isian CV?"
        description="Tindakan ini akan mengosongkan teks formulir dan daftar riwayat agar Anda dapat mengisi CV dari awal tanpa data bawaan. Pastikan Anda sudah menyimpan draft jika masih membutuhkan data ini."
        confirmText="Ya, Kosongkan"
        cancelText="Batal"
        variant="danger"
      />
    </header>
  );
}
