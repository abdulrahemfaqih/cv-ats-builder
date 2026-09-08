"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, AlertTriangle, Info } from "lucide-react";

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  variant?: "error" | "info";
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "Saya Mengerti",
  variant = "info",
}: AlertModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E2DC] shadow-xl p-6 sm:p-7 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8E8C85] hover:text-[#111111] p-1.5 rounded-lg hover:bg-[#F8F8F6] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
              variant === "error"
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-[#F4F4F0] text-[#111111] border border-[#E2E2DC]"
            }`}
          >
            {variant === "error" ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-base font-bold text-[#111111] tracking-tight">
              {title}
            </h3>
            <div className="text-xs text-[#666660] mt-1.5 leading-relaxed whitespace-pre-line">
              {message}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#F0EFEA] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="app-btn text-xs py-2 px-5"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
