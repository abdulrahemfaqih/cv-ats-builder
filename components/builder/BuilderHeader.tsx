"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCVStore } from "@/lib/store/useCVStore";
import { Save, Download, ArrowLeft } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface BuilderHeaderProps {
  user: User | null;
  onOpenSaveModal: () => void;
  onDownloadPdf: () => void;
  isDownloadingPdf?: boolean;
}

export function BuilderHeader({
  user,
  onOpenSaveModal,
  onDownloadPdf,
  isDownloadingPdf,
}: BuilderHeaderProps) {
  const { title, setTitle, language, setLanguage, isDirty } = useCVStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleLanguageToggle = () => {
    const nextLang = language === "id" ? "en" : "id";
    if (
      window.confirm(
        `Ganti bahasa ke ${nextLang === "en" ? "English" : "Bahasa Indonesia"}? Label section di CV akan disesuaikan dengan bahasa yang dipilih.`
      )
    ) {
      setLanguage(nextLang);
    }
  };

  return (
    <header className="w-full bg-[#F4F4F0] border-b-2 border-[#0A0A0A] sticky top-0 z-30">
      <div className="max-w-[1700px] mx-auto px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Document Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 group flex-shrink-0 text-[#0A0A0A] hover:opacity-80"
            title="Kembali ke Beranda"
          >
            <div className="relative w-7 h-7 flex-shrink-0">
              <Image
                src="/cevio-logo.png"
                alt="Cevio Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-sans text-xl font-bold tracking-tight lowercase first-letter:uppercase hidden sm:inline-block">
              Cevio
            </span>
          </Link>

          <span className="font-mono text-[#5C5A54] hidden md:inline-block">
            /
          </span>

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
                className="swiss-input font-mono text-xs uppercase font-bold py-1 px-2 w-48 sm:w-64"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingTitle(true)}
                className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#EAE8E3] px-2 py-1 border border-transparent hover:border-[#0A0A0A] truncate max-w-[180px] sm:max-w-[280px]"
                title="Klik untuk mengubah judul dokumen"
              >
                {title || "UNTITLED CV"} ✎
              </button>
            )}

            {/* Status indicator */}
            <span
              className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.5 border hidden lg:inline-block ${
                isDirty
                  ? "border-[#E61919] text-[#E61919] bg-white"
                  : "border-[#0A0A0A] text-[#5C5A54] bg-[#EAE8E3]"
              }`}
            >
              {isDirty ? "BELUM DISIMPAN" : "TERSIMPAN"}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="font-mono text-xs font-bold px-2.5 py-2 border border-[#0A0A0A] bg-[#EAE8E3] hover:bg-[#0A0A0A] hover:text-white transition-colors"
            title="Ganti Bahasa CV"
          >
            [ {language.toUpperCase()} ]
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={onOpenSaveModal}
            className="swiss-btn-outline text-xs px-3 py-2 flex items-center gap-1.5"
            title="Simpan CV ke akun"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SIMPAN DRAFT</span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isDownloadingPdf}
            className="swiss-btn text-xs px-3.5 py-2 flex items-center gap-1.5 disabled:opacity-50"
            title="Unduh CV sebagai PDF ATS-Safe"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {isDownloadingPdf ? "MEMBUAT PDF..." : "UNDUH PDF"}
            </span>
          </button>

          {user && (
            <Link
              href="/dashboard"
              className="swiss-btn-outline text-xs px-2.5 py-2 hidden md:inline-flex"
              title="Ke Dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
