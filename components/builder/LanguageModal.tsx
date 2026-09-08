"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Check, Globe } from "lucide-react";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: "id" | "en";
  onSelectLanguage: (lang: "id" | "en") => void;
}

export function LanguageModal({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}: LanguageModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E2DC] shadow-xl p-6 sm:p-7 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8E8C85] hover:text-[#111111] p-1.5 rounded-lg hover:bg-[#F8F8F6] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-lg bg-[#F8F8F6] border border-[#E2E2DC] flex items-center justify-center">
            <Globe className="w-4 h-4 text-[#111111]" />
          </div>
          <h3 className="text-lg font-bold text-[#111111] tracking-tight">
            Pilih Bahasa CV
          </h3>
        </div>
        <p className="text-xs text-[#666660] mb-5 leading-relaxed">
          Pilih standar bahasa yang digunakan pada CV ini. Format judul section (seperti Pendidikan → Education) akan otomatis disesuaikan.
        </p>

        <div className="space-y-2.5 mb-6">
          <button
            type="button"
            onClick={() => {
              onSelectLanguage("id");
              onClose();
            }}
            className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
              currentLanguage === "id"
                ? "border-[#111111] bg-[#F8F8F6]"
                : "border-[#E2E2DC] hover:border-[#111111] bg-white"
            }`}
          >
            <div>
              <div className="text-xs font-bold text-[#111111]">
                Bahasa Indonesia (ID)
              </div>
              <div className="text-[11px] text-[#666660] mt-0.5">
                Format standar nasional (Pendidikan, Pengalaman Kerja, Keterampilan)
              </div>
            </div>
            {currentLanguage === "id" && (
              <Check className="w-4 h-4 text-[#111111] flex-shrink-0 ml-2" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectLanguage("en");
              onClose();
            }}
            className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
              currentLanguage === "en"
                ? "border-[#111111] bg-[#F8F8F6]"
                : "border-[#E2E2DC] hover:border-[#111111] bg-white"
            }`}
          >
            <div>
              <div className="text-xs font-bold text-[#111111]">
                English (EN)
              </div>
              <div className="text-[11px] text-[#666660] mt-0.5">
                International standard (Education, Work Experience, Skills)
              </div>
            </div>
            {currentLanguage === "en" && (
              <Check className="w-4 h-4 text-[#111111] flex-shrink-0 ml-2" />
            )}
          </button>
        </div>

        <div className="flex justify-end pt-3.5 border-t border-[#F0EFEA]">
          <button
            type="button"
            onClick={onClose}
            className="app-btn-secondary text-xs py-2 px-4"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
