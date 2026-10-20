"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Check, Type, MoveVertical, Eye, Sparkles } from "lucide-react";
import { ATSFont, ATSSpacing } from "@/types/cv";
import { ATS_FONTS, ATS_SPACINGS } from "@/lib/constants/atsFormatting";
import { useCVStore } from "@/lib/store/useCVStore";

interface CVSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CVSettingsModal({ isOpen, onClose }: CVSettingsModalProps) {
  const [mounted, setMounted] = useState(false);
  const { data, updateSettings } = useCVStore();

  const currentFont: ATSFont = data.settings?.fontFamily || "arial";
  const currentSpacing: ATSSpacing = data.settings?.spacing || "normal";
  const showPageBreaks = data.settings?.showPageBreaks ?? true;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const fontKeys = Object.keys(ATS_FONTS) as ATSFont[];
  const spacingKeys = Object.keys(ATS_SPACINGS) as ATSSpacing[];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E2DC] shadow-2xl p-5 sm:p-7 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8E8C85] hover:text-[#111111] p-1.5 rounded-lg hover:bg-[#F8F8F6] transition-colors"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#F8F8F6] border border-[#E2E2DC] flex items-center justify-center">
            <Type className="w-4 h-4 text-[#111111]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#111111] tracking-tight">
              Format & Tipografi ATS
            </h3>
            <p className="text-[11px] text-[#666660]">
              Atur jenis huruf dan kerapatan teks agar tata letak CV presisi dan lolos sistem ATS.
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-[#EAE8E3]" />

        <div className="space-y-5">
          {/* Section 1: Font Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#666660]" />
                Pilihan Font ATS Standar
              </label>
              <span className="text-[10px] text-[#8E8C85]">
                100% Aman ATS
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {fontKeys.map((key) => {
                const font = ATS_FONTS[key];
                const isSelected = currentFont === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateSettings({ fontFamily: key })}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-[#111111] bg-[#F8F8F6] ring-1 ring-[#111111]"
                        : "border-[#E2E2DC] hover:border-[#CCCCCC] bg-white"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-semibold text-[#111111]"
                          style={{ fontFamily: font.fontFamily }}
                        >
                          {font.name}
                        </span>
                        <span className="text-[10px] text-[#777770] font-normal">
                          — {font.category}
                        </span>
                      </div>
                      <div
                        className="text-[11px] text-[#888880] mt-0.5 truncate"
                        style={{ fontFamily: font.fontFamily }}
                      >
                        Software Engineer & Project Management - UI/UX
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#111111] flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Spacing & Line Height */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                <MoveVertical className="w-3.5 h-3.5 text-[#666660]" />
                Kerapatan & Jarak Antar Paragraf
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {spacingKeys.map((key) => {
                const sp = ATS_SPACINGS[key];
                const isSelected = currentSpacing === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateSettings({ spacing: key })}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-[#111111] bg-[#F8F8F6] ring-1 ring-[#111111]"
                        : "border-[#E2E2DC] hover:border-[#CCCCCC] bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-[#111111]">
                        {sp.label}
                      </span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-[#111111] flex-shrink-0" />
                      ) : (
                        <span className="text-[9px] font-semibold bg-[#EAE8E3] text-[#555550] px-1.5 py-0.2 rounded">
                          {sp.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#666660] leading-snug">
                      {sp.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Page Break Guide Toggle */}
          <div className="pt-2 border-t border-[#EAE8E3]">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAFAFA] border border-[#EBEBE6]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#111111]">
                    Garis Batas Halaman (A4 Page Break)
                  </div>
                  <div className="text-[11px] text-[#777770]">
                    Tampilkan garis putus-putus batas kertas di pratinjau
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPageBreaks}
                  onChange={(e) =>
                    updateSettings({ showPageBreaks: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#111111]" />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="app-btn text-xs px-5 py-2"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
