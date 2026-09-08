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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
      <div className="w-full max-w-lg bg-[#EAE8E3] border-2 border-[#0A0A0A] p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5C5A54] hover:text-[#0A0A0A] p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User is logged in */}
        {user ? (
          <div>
            <div className="border-b border-[#0A0A0A] pb-3 mb-6">
              <span className="font-mono text-xs uppercase text-[#5C5A54] block">
                [ SIMPAN DRAFT // CLOUD ]
              </span>
              <h3 className="text-xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
                SIMPAN CV KE DASHBOARD
              </h3>
            </div>

            {success ? (
              <div className="p-6 bg-[#F4F4F0] border border-[#0A0A0A] text-center space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-[#0A0A0A] text-white">
                  <Check className="w-5 h-5" />
                </div>
                <p className="font-mono text-xs font-bold uppercase text-[#0A0A0A]">
                  CV BERHASIL DISIMPAN KE AKUN ANDA
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveToCloud} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-[#F4F4F0] border border-[#E61919] font-mono text-xs text-[#E61919]">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block font-mono text-xs uppercase font-bold text-[#0A0A0A] mb-1.5">
                    JUDUL / LABEL CV (UNTUK DI DASHBOARD) *
                  </label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="mis. CV Fullstack Developer"
                    className="swiss-input"
                  />
                  <span className="font-mono text-[10px] text-[#5C5A54] block mt-1">
                    Label ini berguna untuk membedakan target posisi CV di dashboard Anda.
                  </span>
                </div>

                <div className="pt-4 border-t border-[#0A0A0A] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="swiss-btn-outline"
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="swiss-btn disabled:opacity-50"
                  >
                    {loading ? "MENYIMPAN..." : "SIMPAN SEKARANG"}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* User is NOT logged in (Guest Flow A Step 4) */
          <div>
            <div className="border-b border-[#0A0A0A] pb-3 mb-6">
              <span className="font-mono text-xs uppercase text-[#E61919] font-bold flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-4 h-4" />
                [ SIMPAN DRAFT // LOGIN DIPERLUKAN ]
              </span>
              <h3 className="text-xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
                SIMPAN DRAFT KE AKUN ANDA
              </h3>
            </div>

            <div className="space-y-4 text-sm text-[#0A0A0A]">
              <p>
                Anda sedang membuat CV sebagai <strong>Guest</strong>. Semua data yang baru saja Anda isi telah aman tersimpan di peramban (localStorage) Anda.
              </p>
              <p className="p-4 bg-[#F4F4F0] border border-[#0A0A0A] font-mono text-xs text-[#5C5A54]">
                Untuk menyimpan draft secara permanen ke dashboard dan mengelolanya dari perangkat lain, silakan masuk atau daftar akun terlebih dahulu. Data form Anda tidak akan hilang setelah login.
              </p>

              {!isConfigured && (
                <p className="font-mono text-[11px] text-[#E61919]">
                  (Catatan pengembang: Supabase belum dikonfigurasi di .env.local, sehingga penyimpanan cloud saat ini menggunakan mode local preview).
                </p>
              )}

              <div className="pt-4 border-t border-[#0A0A0A] flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login?returnUrl=/builder"
                  className="swiss-btn flex-1 text-center"
                >
                  MASUK KE AKUN
                </Link>
                <Link
                  href="/register?returnUrl=/builder"
                  className="swiss-btn-outline flex-1 text-center"
                >
                  DAFTAR AKUN BARU
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
