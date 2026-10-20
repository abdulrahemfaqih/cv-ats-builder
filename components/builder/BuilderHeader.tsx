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
  Type,
  Share2,
  MoreVertical,
  SlidersHorizontal,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LanguageModal } from "@/components/builder/LanguageModal";
import { CVSettingsModal } from "@/components/builder/CVSettingsModal";
import { ShareModal } from "@/components/builder/ShareModal";

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
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Dropdown states
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const downloadRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (downloadRef.current && !downloadRef.current.contains(target)) {
        setIsDownloadOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDownloadOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="w-full bg-[#F8F8F6]/95 backdrop-blur-md border-b border-[#E2E2DC] sticky top-0 z-30">
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand & Document Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 group flex-shrink-0 text-[#111111] hover:opacity-80 transition-opacity"
            title="Kembali ke Beranda"
          >
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#111111]">
              Cevio
            </span>
          </Link>

          <span className="text-[#D0D0C8]">/</span>

          {/* Editable Title */}
          <div className="flex items-center gap-1.5 min-w-0">
            {isEditingTitle ? (
              <input
                type="text"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                className="app-input text-xs font-semibold py-1 px-2 w-32 sm:w-64"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingTitle(true)}
                className="text-xs sm:text-sm font-semibold text-[#111111] hover:bg-[#EAE8E3]/60 rounded-md px-1.5 sm:px-2 py-1 transition-colors truncate max-w-[120px] sm:max-w-[280px]"
                title="Klik untuk mengubah judul dokumen"
              >
                {title || "Untitled CV"}
              </button>
            )}

            {/* Status indicator */}
            <span className="text-xs text-[#8E8C85] select-none hidden lg:inline ml-1 font-normal">
              {isSaving ? "Menyimpan..." : isDirty ? "Belum disimpan" : "Tersimpan"}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* DESKTOP-ONLY BUTTONS (>= md) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {/* Format ATS (Font & Spacing) */}
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#E2E2DC] bg-white hover:bg-[#F2F2EE] text-[#111111] flex items-center gap-1.5 transition-colors"
              title="Atur font dan kerapatan spacing ATS"
            >
              <Type className="w-3.5 h-3.5 text-[#666660]" />
              <span>Format ATS</span>
            </button>

            {/* Share Public Link */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#E2E2DC] bg-white hover:bg-[#F2F2EE] text-[#111111] flex items-center gap-1.5 transition-colors"
              title="Bagikan tautan publik CV"
            >
              <Share2 className="w-3.5 h-3.5 text-[#666660]" />
              <span>Bagikan</span>
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#E2E2DC] bg-white hover:bg-[#F2F2EE] text-[#111111] flex items-center gap-1.5 transition-colors"
              title="Ganti Bahasa CV"
            >
              <Globe className="w-3.5 h-3.5 text-[#666660]" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Reset / Blank CV Button */}
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="text-xs font-semibold p-1.5 rounded-lg border border-[#E2E2DC] bg-white hover:bg-[#F2F2EE] text-[#666660] hover:text-[#111111] transition-colors"
              title="Kosongkan seluruh isian CV untuk mulai dari awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Dashboard Link */}
            {user && (
              <Link
                href="/dashboard"
                className="app-btn-outline text-xs p-1.5"
                title="Ke Dashboard"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* SHARED BUTTONS (Mobile & Desktop) */}

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={onOpenSaveModal}
            className="app-btn-outline text-xs px-2 sm:px-3 py-1.5 flex items-center gap-1.5"
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

          {/* MOBILE-ONLY MENU DROPDOWN (< md) */}
          <div className="relative md:hidden" ref={mobileMenuRef}>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-1.5 rounded-lg border border-[#E2E2DC] bg-white hover:bg-[#F2F2EE] text-[#111111] transition-colors flex items-center justify-center"
              title="Menu Lainnya"
              aria-label="Menu Lainnya"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#444440]" />
            </button>

            {isMobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E2E2DC] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSettingsModalOpen(true);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-[#F8F8F6] flex items-center gap-2.5 text-xs font-semibold text-[#111111]"
                >
                  <Type className="w-4 h-4 text-[#666660]" />
                  <span>Format & Tipografi ATS</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsShareModalOpen(true);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-[#F8F8F6] flex items-center gap-2.5 text-xs font-semibold text-[#111111]"
                >
                  <Share2 className="w-4 h-4 text-[#666660]" />
                  <span>Bagikan Tautan Publik</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLanguageModalOpen(true);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-[#F8F8F6] flex items-center gap-2.5 text-xs font-semibold text-[#111111]"
                >
                  <Globe className="w-4 h-4 text-[#666660]" />
                  <span>Bahasa CV ({language.toUpperCase()})</span>
                </button>

                <div className="border-t border-[#F0EFEB] my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsResetModalOpen(true);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-[#F8F8F6] flex items-center gap-2.5 text-xs font-medium text-red-600"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-red-500" />
                  <span>Kosongkan Isian CV</span>
                </button>

                {user && (
                  <>
                    <div className="border-t border-[#F0EFEB] my-1" />
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#F8F8F6] flex items-center gap-2.5 text-xs font-medium text-[#444440]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Kembali ke Dashboard</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Format & Tipografi ATS */}
      <CVSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Modal: Bagikan CV (Tautan Publik) */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        user={user}
        onOpenSaveModal={onOpenSaveModal}
      />

      {/* Modal: Ganti Bahasa */}
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
