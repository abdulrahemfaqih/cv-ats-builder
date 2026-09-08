"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CVDocument } from "@/types/cv";
import { Plus, Copy, Edit3, Trash2, Tag, X, FileText, AlertTriangle } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import {
  INITIAL_CV_DATA_ID,
  INITIAL_CV_DATA_EN,
  BLANK_CV_DATA_ID,
  BLANK_CV_DATA_EN,
} from "@/lib/constants/defaultCV";
import { AlertModal } from "@/components/ui/AlertModal";

interface DashboardClientProps {
  initialDocuments: CVDocument[];
  user: User;
  isConfigured: boolean;
}

export function DashboardClient({
  initialDocuments,
  user,
  isConfigured,
}: DashboardClientProps) {
  const router = useRouter();
  const [documents, setDocuments] = useState<CVDocument[]>(initialDocuments);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLanguage, setNewLanguage] = useState<"id" | "en">("id");
  const [templateType, setTemplateType] = useState<"blank" | "sample">("blank");

  const [renameDoc, setRenameDoc] = useState<CVDocument | null>(null);
  const [renameTitle, setRenameTitle] = useState("");

  const [deleteDoc, setDeleteDoc] = useState<CVDocument | null>(null);
  const [alertModal, setAlertModal] = useState<{
    title: string;
    message: string;
    variant?: "error" | "info";
  } | null>(null);

  // CREATE NEW CV
  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setLoading(true);
    try {
      const supabase = createClient();
      let initialData;
      if (templateType === "blank") {
        initialData = newLanguage === "en" ? BLANK_CV_DATA_EN : BLANK_CV_DATA_ID;
      } else {
        initialData = newLanguage === "en" ? INITIAL_CV_DATA_EN : INITIAL_CV_DATA_ID;
      }

      const { data, error } = await supabase
        .from("cv_documents")
        .insert({
          user_id: user.id,
          title: newTitle.trim(),
          language: newLanguage,
          data: initialData,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase Error:", error);
        throw new Error(error.message);
      }
      if (data) {
        setIsCreateModalOpen(false);
        setNewTitle("");
        router.push(`/builder?id=${data.id}`);
      }
    } catch (err: unknown) {
      console.error("Gagal membuat CV baru:", err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Could not find the table") || msg.includes("cv_documents")) {
        setAlertModal({
          title: "Tabel Database Diperlukan",
          message:
            "Tabel database 'cv_documents' belum dibuat di Supabase Anda.\n\nSilakan buka SQL Editor di Supabase Dashboard, lalu jalankan script dari file 'supabase/schema.sql'.",
          variant: "error",
        });
      } else {
        setAlertModal({
          title: "Gagal Membuat CV",
          message: `Terjadi kendala saat membuat CV baru: ${msg}`,
          variant: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // DUPLICATE CV
  const handleDuplicate = async (doc: CVDocument) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const duplicatedTitle = `${doc.title} (Salinan)`;

      const { data, error } = await supabase
        .from("cv_documents")
        .insert({
          user_id: user.id,
          title: duplicatedTitle,
          language: doc.language,
          data: doc.data,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase Error:", error);
        throw new Error(error.message);
      }
      if (data) {
        setDocuments([data, ...documents]);
      }
    } catch (err: unknown) {
      console.error("Gagal menduplikasi CV:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setAlertModal({
        title: "Gagal Menduplikasi CV",
        message: `Terjadi kendala saat menyalin CV: ${msg}`,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // RENAME CV
  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameDoc || !renameTitle.trim()) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("cv_documents")
        .update({
          title: renameTitle.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", renameDoc.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Supabase Error:", error);
        throw new Error(error.message);
      }

      setDocuments(
        documents.map((d) =>
          d.id === renameDoc.id ? { ...d, title: renameTitle.trim() } : d
        )
      );
      setRenameDoc(null);
    } catch (err: unknown) {
      console.error("Gagal mengubah nama CV:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setAlertModal({
        title: "Gagal Mengubah Nama",
        message: `Terjadi kendala saat mengubah nama CV: ${msg}`,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // DELETE CV
  const handleDelete = async () => {
    if (!deleteDoc) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("cv_documents")
        .delete()
        .eq("id", deleteDoc.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Supabase Error:", error);
        throw new Error(error.message);
      }

      setDocuments(documents.filter((d) => d.id !== deleteDoc.id));
      setDeleteDoc(null);
    } catch (err: unknown) {
      console.error("Gagal menghapus CV:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setAlertModal({
        title: "Gagal Menghapus CV",
        message: `Terjadi kendala saat menghapus CV: ${msg}`,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="border-b border-[#E2E2DC] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#8E8C85] uppercase tracking-wider block mb-1">
            Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Daftar Dokumen CV
          </h1>
          <p className="text-xs text-[#666660] mt-1.5 flex items-center gap-2">
            <span>Akun: {user.email}</span>
            <span>•</span>
            <span>{documents.length} dokumen tersimpan</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewTitle("");
            setIsCreateModalOpen(true);
          }}
          className="app-btn text-xs inline-flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Buat CV Baru
        </button>
      </div>

      {!isConfigured && (
        <div className="p-5 bg-amber-50/70 border border-amber-200/80 rounded-xl">
          <p className="text-xs font-semibold text-amber-800 mb-1">
            Mode Pratinjau Lokal
          </p>
          <p className="text-xs text-amber-700 mb-3">
            Koneksi Supabase belum disetel di .env.local. Anda tetap dapat menggunakan builder secara penuh via penyimpanan browser (localStorage).
          </p>
          <Link
            href="/builder"
            className="app-btn-secondary text-xs inline-block"
          >
            Buka Builder CV →
          </Link>
        </div>
      )}

      {/* CV Grid */}
      {documents.length === 0 ? (
        <div className="border border-dashed border-[#D2D2CC] rounded-2xl p-12 sm:p-16 text-center bg-white shadow-xs">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#F8F8F6] rounded-full mb-4 text-[#111111]">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#111111] mb-2">
            Belum Ada Dokumen CV
          </h3>
          <p className="text-xs text-[#666660] max-w-md mx-auto mb-6">
            Mulai buat CV profesional pertama Anda. Anda dapat membuat beberapa variasi CV untuk menyesuaikan dengan berbagai lowongan pekerjaan.
          </p>
          <button
            type="button"
            onClick={() => {
              setNewTitle("");
              setIsCreateModalOpen(true);
            }}
            className="app-btn text-xs inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Buat CV Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-[#E2E2DC] rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                {/* Meta Top */}
                <div className="flex items-center justify-between border-b border-[#F0EFEA] pb-3 mb-3.5">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md border border-[#E2E2DC] bg-[#F8F8F6] text-[#555550]">
                    Bahasa: {doc.language.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-[#8E8C85]">
                    {new Date(doc.updated_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#111111] tracking-tight mb-2 truncate">
                  {doc.title}
                </h3>

                {/* Snippet */}
                <p className="text-xs text-[#666660] line-clamp-3 leading-relaxed mb-4">
                  {doc.data?.overview ||
                    "CV format ATS-Safe. Berisi riwayat pendidikan, pengalaman kerja, proyek, dan keahlian teknis."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3.5 border-t border-[#F0EFEA] flex flex-wrap items-center justify-between gap-2 text-xs">
                <Link
                  href={`/builder?id=${doc.id}`}
                  className="font-semibold text-[#111111] hover:underline flex items-center gap-1.5"
                  title="Buka dan edit di CV Builder"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => handleDuplicate(doc)}
                  disabled={loading}
                  className="text-[#666660] hover:text-[#111111] flex items-center gap-1.5 transition-colors"
                  title="Duplikat CV untuk posisi lain"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplikat
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRenameDoc(doc);
                    setRenameTitle(doc.title);
                  }}
                  className="text-[#666660] hover:text-[#111111] flex items-center gap-1.5 transition-colors"
                  title="Ubah judul CV"
                >
                  <Tag className="w-3.5 h-3.5" />
                  Ganti Nama
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteDoc(doc)}
                  className="text-red-600 hover:text-red-700 flex items-center gap-1.5 transition-colors"
                  title="Hapus CV ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: CREATE NEW CV */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E2DC] shadow-xl p-6 relative">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-[#8E8C85] hover:text-[#111111] p-1.5 rounded-lg hover:bg-[#F8F8F6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#F0EFEA] pb-3.5 mb-5">
              <h3 className="text-xl font-bold text-[#111111]">
                Buat CV Baru
              </h3>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1.5">
                  Judul / Label CV *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="mis. CV Fullstack Developer"
                  className="app-input text-xs"
                />
                <span className="text-[11px] text-[#8E8C85] block mt-1.5">
                  Beri label sesuai target posisi pekerjaan Anda.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1.5">
                  Bahasa CV
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewLanguage("id")}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                      newLanguage === "id"
                        ? "bg-[#111111] border-[#111111] text-white"
                        : "bg-white border-[#E2E2DC] text-[#666660] hover:border-[#111111]"
                    }`}
                  >
                    Bahasa Indonesia
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewLanguage("en")}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                      newLanguage === "en"
                        ? "bg-[#111111] border-[#111111] text-white"
                        : "bg-white border-[#E2E2DC] text-[#666660] hover:border-[#111111]"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1.5">
                  Isi Awal Dokumen
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTemplateType("blank")}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                      templateType === "blank"
                        ? "bg-[#111111] border-[#111111] text-white"
                        : "bg-white border-[#E2E2DC] text-[#666660] hover:border-[#111111]"
                    }`}
                  >
                    Format Kosong
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemplateType("sample")}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                      templateType === "sample"
                        ? "bg-[#111111] border-[#111111] text-white"
                        : "bg-white border-[#E2E2DC] text-[#666660] hover:border-[#111111]"
                    }`}
                  >
                    Contoh Panduan
                  </button>
                </div>
                <span className="text-[11px] text-[#8E8C85] block mt-1.5">
                  {templateType === "blank"
                    ? "Mulai dengan CV baru yang bersih tanpa data bawaan."
                    : "Mulai dengan panduan contoh netral (Alex Pratama)."}
                </span>
              </div>

              <div className="pt-4 border-t border-[#F0EFEA] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="app-btn-secondary text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || !newTitle.trim()}
                  className="app-btn text-xs disabled:opacity-50"
                >
                  {loading ? "Membuat..." : "Buka Builder →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RENAME CV */}
      {renameDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E2DC] shadow-xl p-6 relative">
            <button
              type="button"
              onClick={() => setRenameDoc(null)}
              className="absolute top-4 right-4 text-[#8E8C85] hover:text-[#111111] p-1.5 rounded-lg hover:bg-[#F8F8F6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#F0EFEA] pb-3.5 mb-5">
              <h3 className="text-xl font-bold text-[#111111]">
                Ubah Judul CV
              </h3>
            </div>

            <form onSubmit={handleRename} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1.5">
                  Judul Baru *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={renameTitle}
                  onChange={(e) => setRenameTitle(e.target.value)}
                  className="app-input text-xs"
                />
              </div>

              <div className="pt-4 border-t border-[#F0EFEA] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRenameDoc(null)}
                  className="app-btn-secondary text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || !renameTitle.trim()}
                  className="app-btn text-xs disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM DELETE */}
      {deleteDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-red-200 shadow-xl p-6 relative">
            <div className="flex items-center gap-3 border-b border-[#F0EFEA] pb-3.5 mb-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111111]">
                  Hapus Dokumen CV?
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#666660] mb-5 leading-relaxed">
              Apakah Anda yakin ingin menghapus CV <strong className="text-[#111111]">&quot;{deleteDoc.title}&quot;</strong>? Dokumen ini akan dihapus permanen dari akun Anda.
            </p>

            <div className="pt-4 border-t border-[#F0EFEA] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteDoc(null)}
                className="app-btn-secondary text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50 shadow-xs"
              >
                {loading ? "Menghapus..." : "Ya, Hapus CV"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Custom Alert Modal */}
      <AlertModal
        isOpen={!!alertModal}
        onClose={() => setAlertModal(null)}
        title={alertModal?.title || ""}
        message={alertModal?.message || ""}
        variant={alertModal?.variant || "error"}
      />
    </div>
  );
}
