"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Lanjutkan",
  cancelText = "Batal",
  variant = "default",
  loading = false,
}: ConfirmModalProps) {
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

        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#111111] tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-[#666660] mt-1.5 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="pt-4 border-t border-[#F0EFEA] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="app-btn-secondary text-xs py-2 px-4"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={loading}
            className={`text-xs py-2 px-4 rounded-lg font-semibold transition-colors ${
              variant === "danger"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-[#111111] text-white hover:bg-[#222222]"
            }`}
          >
            {loading ? "Memproses..." : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
