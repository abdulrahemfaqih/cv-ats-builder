"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Share2, Copy, Check, Globe, Lock, ShieldCheck, Link2, Sparkles } from "lucide-react";
import { useCVStore } from "@/lib/store/useCVStore";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onOpenSaveModal: () => void;
}

export function ShareModal({
  isOpen,
  onClose,
  user,
  onOpenSaveModal,
}: ShareModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data, documentId, updateSettings } = useCVStore();
  const isPublic = data.settings?.isPublic ?? false;

  // Initialize slug from settings or candidate name
  const existingSlug = data.settings?.publicSlug || "";
  const [slug, setSlug] = useState(existingSlug);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugSaved, setSlugSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data.settings?.publicSlug) {
      setSlug(data.settings.publicSlug);
    } else if (data.header?.name) {
      const suggested = data.header.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(suggested);
    }
  }, [data.settings?.publicSlug, data.header?.name]);

  if (!isOpen || !mounted) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const displaySlug = (slug.trim() || data.settings?.publicSlug || documentId || "").replace(/^-|-$/g, "");
  const shareUrl = displaySlug ? `${origin}/cv/${displaySlug}` : "";

  const handleTogglePublic = async (checked: boolean) => {
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    updateSettings({ isPublic: checked, publicSlug: cleanSlug || undefined });

    if (documentId && user) {
      setIsUpdating(true);
      try {
        const supabase = createClient();
        await supabase
          .from("cv_documents")
          .update({
            data: {
              ...data,
              settings: {
                ...data.settings,
                isPublic: checked,
                publicSlug: cleanSlug || undefined,
              },
            },
            updated_at: new Date().toISOString(),
          })
          .eq("id", documentId)
          .eq("user_id", user.id);
      } catch (err) {
        console.error("Gagal memperbarui status publik:", err);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleSaveSlug = async () => {
    const clean = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!clean) {
      setSlugError("Nama tautan tidak boleh kosong.");
      return;
    }
    if (clean.length < 3) {
      setSlugError("Nama tautan minimal 3 karakter.");
      return;
    }

    setIsUpdating(true);
    setSlugError(null);
    try {
      const supabase = createClient();
      // Check if another CV already uses this slug
      const { data: existing } = await supabase
        .from("cv_documents")
        .select("id")
        .filter("data->settings->>publicSlug", "eq", clean)
        .neq("id", documentId || "")
        .maybeSingle();

      if (existing) {
        setSlugError("Nama tautan ini sudah dipakai. Silakan coba nama/variasi lain.");
        return;
      }

      updateSettings({ publicSlug: clean });

      if (documentId && user) {
        await supabase
          .from("cv_documents")
          .update({
            data: {
              ...data,
              settings: {
                ...data.settings,
                publicSlug: clean,
              },
            },
            updated_at: new Date().toISOString(),
          })
          .eq("id", documentId)
          .eq("user_id", user.id);
      }

      setSlug(clean);
      setSlugSaved(true);
      setTimeout(() => setSlugSaved(false), 2500);
    } catch (err) {
      console.error("Gagal menyimpan slug:", err);
      setSlugError("Terjadi kendala saat menyimpan tautan.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E2DC] shadow-2xl p-5 sm:p-7 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8E8C85] hover:text-[#111111] p-1.5 rounded-lg hover:bg-[#F8F8F6] transition-colors"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-lg bg-[#F8F8F6] border border-[#E2E2DC] flex items-center justify-center">
            <Share2 className="w-4 h-4 text-[#111111]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#111111] tracking-tight">
              Bagikan CV (Tautan Publik)
            </h3>
            <p className="text-[11px] text-[#666660]">
              Publikasikan resume web interaktif dengan nama tautan singkat dan profesional.
            </p>
          </div>
        </div>

        <hr className="my-4 border-[#EAE8E3]" />

        {/* Case 1: Guest (not logged in) */}
        {!user ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#F8F8F6] border border-[#E2E2DC] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5 text-[#888880]" />
            </div>
            <h4 className="text-sm font-bold text-[#111111] mb-1">
              Simpan CV ke Akun Terlebih Dahulu
            </h4>
            <p className="text-xs text-[#666660] mb-5 leading-relaxed max-w-xs mx-auto">
              Untuk mengaktifkan tautan publik yang dapat dibagikan kepada HRD, silakan simpan draft CV ini ke akun Cevio Anda.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSaveModal();
              }}
              className="app-btn text-xs px-5 py-2.5 w-full"
            >
              Simpan Draft Sekarang
            </button>
          </div>
        ) : !documentId ? (
          /* Case 2: Logged in but CV hasn't been saved yet */
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#F8F8F6] border border-[#E2E2DC] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-5 h-5 text-[#888880]" />
            </div>
            <h4 className="text-sm font-bold text-[#111111] mb-1">
              Simpan Perubahan Dokumen
            </h4>
            <p className="text-xs text-[#666660] mb-5 leading-relaxed max-w-xs mx-auto">
              Simpan dokumen ini sekali terlebih dahulu agar tautan unik CV dapat dibuat.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSaveModal();
              }}
              className="app-btn text-xs px-5 py-2.5 w-full"
            >
              Simpan CV Sekarang
            </button>
          </div>
        ) : (
          /* Case 3: Logged in and saved -> Can toggle, customize slug, and copy link */
          <div className="space-y-4">
            {/* Toggle Status */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAFAFA] border border-[#EBEBE6]">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isPublic
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111111]">
                    {isPublic ? "Tautan Publik Aktif" : "Tautan Publik Nonaktif"}
                  </div>
                  <div className="text-[11px] text-[#666660]">
                    {isPublic
                      ? "Siapa saja dengan link dapat melihat CV ini"
                      : "CV ini hanya dapat diakses oleh Anda"}
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  disabled={isUpdating}
                  onChange={(e) => handleTogglePublic(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600" />
              </label>
            </div>

            {/* Custom Slug Input */}
            {isPublic && (
              <div className="space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-[#666660]" />
                    Kustomisasi Nama Link (URL Singkat)
                  </label>
                  {slugSaved && (
                    <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Tersimpan
                    </span>
                  )}
                </div>

                <div className="flex items-center rounded-xl border border-[#E2E2DC] bg-[#F8F8F6] px-2.5 py-1.5 focus-within:border-[#111111] focus-within:bg-white transition-colors">
                  <span className="text-xs text-[#8E8C85] select-none font-mono">
                    /cv/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
                      setSlug(val);
                      setSlugError(null);
                      setSlugSaved(false);
                    }}
                    placeholder="nama-kamu"
                    className="bg-transparent text-xs font-semibold text-[#111111] focus:outline-none flex-1 font-mono px-1"
                  />
                  <button
                    type="button"
                    onClick={handleSaveSlug}
                    disabled={isUpdating}
                    className="text-[11px] font-bold text-[#111111] hover:bg-[#EAE8E3] px-2.5 py-1 rounded-md bg-white border border-[#D5D5CE] transition-colors"
                  >
                    Terapkan
                  </button>
                </div>

                {slugError && (
                  <p className="text-[11px] text-red-600 mt-1">{slugError}</p>
                )}
                <p className="text-[10px] text-[#777770]">
                  Gunakan nama Anda agar tautan lebih singkat dan rapi (mis. alex-pratama).
                </p>
              </div>
            )}

            {/* Link Box */}
            {isPublic ? (
              <div className="space-y-2 animate-in fade-in duration-150 pt-1">
                <label className="block text-xs font-semibold text-[#111111]">
                  Tautan yang Siap Dibagikan
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="app-input text-xs py-2 px-3 bg-[#F8F8F6] select-all flex-1 text-[#444440] font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="app-btn text-xs px-3.5 py-2 flex items-center gap-1.5 shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span>Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#888880]">
                    Rekruter dapat langsung mengunduh PDF resmi dari tautan ini.
                  </span>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    Buka Halaman ↗
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-[#F8F8F6] text-[11px] text-[#777770] leading-relaxed">
                Aktifkan toggle di atas untuk menghasilkan tautan web portofolio yang dapat Anda pasang di profil LinkedIn, email lamaran, atau pesan ke rekruter.
              </div>
            )}

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="app-btn-outline text-xs px-5 py-2"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
