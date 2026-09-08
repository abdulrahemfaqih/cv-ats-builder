"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCVStore } from "@/lib/store/useCVStore";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { X, Check, AlertCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface SaveDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function SaveDraftModal({ isOpen, onClose, user }: SaveDraftModalProps) {
  const { title, language, data, documentId, markSaved, setTitle } = useCVStore();
  const [docTitle, setDocTitle] = useState(title);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();

  const handleSaveToCloud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      setTitle(docTitle);

      if (documentId) {
        // Update existing document
        const { error } = await supabase
          .from("cv_documents")
          .update({
            title: docTitle,
            language,
            data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", documentId)
          .eq("user_id", user.id);

        if (error) throw error;
        markSaved(documentId);
      } else {
        // Insert new document
        const { data: inserted, error } = await supabase
          .from("cv_documents")
          .insert({
            user_id: user.id,
            title: docTitle,
            language,
            data,
          })
          .select("id")
          .single();

        if (error) throw error;
        if (inserted) {
          markSaved(inserted.id);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Gagal menyimpan CV ke cloud."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E2DC] shadow-xl p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8E8C85] hover:text-[#111111] p-1.5 rounded-lg hover:bg-[#F8F8F6] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User is logged in */}
        {user ? (
          <div>
            <div className="border-b border-[#F0EFEA] pb-3.5 mb-6">
              <h3 className="text-xl font-bold text-[#111111]">
                Simpan CV ke Dashboard
              </h3>
              <p className="text-xs text-[#666660] mt-1">
                Tersimpan aman di akun cloud Anda ({user.email})
              </p>
            </div>

            {success ? (
              <div className="p-6 bg-[#F8F8F6] border border-[#E2E2DC] rounded-xl text-center space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-[#111111] text-white rounded-full">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-[#111111]">
                  CV berhasil disimpan ke akun Anda
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveToCloud} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1.5">
                    Judul / Label CV di Dashboard *
                  </label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="mis. CV Fullstack Developer"
                    className="app-input text-xs"
                  />
                  <span className="text-[11px] text-[#8E8C85] block mt-1.5">
                    Beri label spesifik agar mudah dibedakan sesuai target posisi pekerjaan.
                  </span>
                </div>

                <div className="pt-4 border-t border-[#F0EFEA] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="app-btn-secondary text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="app-btn text-xs disabled:opacity-50"
                  >
                    {loading ? "Menyimpan..." : "Simpan CV"}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* User is NOT logged in (Guest Flow) */
          <div>
            <div className="border-b border-[#F0EFEA] pb-3.5 mb-5">
              <div className="flex items-center gap-2 mb-1 text-[#111111]">
                <AlertCircle className="w-4 h-4 text-[#8E8C85]" />
                <span className="text-xs font-medium text-[#8E8C85]">
                  Penyimpanan Cloud
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#111111]">
                Simpan Draft ke Akun Anda
              </h3>
            </div>

            <div className="space-y-4 text-xs text-[#666660]">
              <p>
                Anda sedang membuat CV sebagai <strong className="text-[#111111]">Tamu</strong>. Data CV Anda telah tersimpan aman di browser lokal ini.
              </p>
              <div className="p-3.5 bg-[#F8F8F6] border border-[#E2E2DC] rounded-xl text-xs text-[#555550] leading-relaxed">
                Untuk menyimpan draft secara permanen ke dashboard cloud dan membukanya dari perangkat lain, silakan masuk atau daftar akun. Data form yang sudah diisi akan tetap utuh.
              </div>

              {!isConfigured && (
                <p className="text-[11px] text-amber-600">
                  Catatan: Supabase belum aktif sepenuhnya di .env.local, penyimpanan saat ini berjalan di browser lokal.
                </p>
              )}

              <div className="pt-4 border-t border-[#F0EFEA] flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login?returnUrl=/builder"
                  className="app-btn flex-1 text-center text-xs"
                >
                  Masuk ke Akun
                </Link>
                <Link
                  href="/register?returnUrl=/builder"
                  className="app-btn-secondary flex-1 text-center text-xs"
                >
                  Daftar Akun Baru
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
