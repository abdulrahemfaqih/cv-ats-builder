"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CVDocument } from "@/types/cv";
import { Plus, Copy, Edit3, Trash2, Tag, X, FileText, AlertTriangle } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { INITIAL_CV_DATA_ID } from "@/lib/constants/defaultCV";

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

  const [renameDoc, setRenameDoc] = useState<CVDocument | null>(null);
  const [renameTitle, setRenameTitle] = useState("");

  const [deleteDoc, setDeleteDoc] = useState<CVDocument | null>(null);

  // CREATE NEW CV
  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const initialData = {
        ...INITIAL_CV_DATA_ID,
        header: {
          ...INITIAL_CV_DATA_ID.header,
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
          email: user.email || "",
        },
      };

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

      if (error) throw error;
      if (data) {
        setIsCreateModalOpen(false);
        setNewTitle("");
        router.push(`/builder?id=${data.id}`);
      }
    } catch (err) {
      console.error("Gagal membuat CV baru:", err);
      alert("Terjadi kesalahan saat membuat CV.");
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

      if (error) throw error;
      if (data) {
        setDocuments([data, ...documents]);
      }
    } catch (err) {
      console.error("Gagal menduplikasi CV:", err);
      alert("Terjadi kesalahan saat menduplikasi CV.");
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

      if (error) throw error;

      setDocuments(
        documents.map((d) =>
          d.id === renameDoc.id ? { ...d, title: renameTitle.trim() } : d
        )
      );
      setRenameDoc(null);
    } catch (err) {
      console.error("Gagal mengubah nama CV:", err);
      alert("Terjadi kesalahan saat mengubah nama.");
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

      if (error) throw error;

      setDocuments(documents.filter((d) => d.id !== deleteDoc.id));
      setDeleteDoc(null);
    } catch (err) {
      console.error("Gagal menghapus CV:", err);
      alert("Terjadi kesalahan saat menghapus CV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="border-b-2 border-[#0A0A0A] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#5C5A54] block mb-1">
            [ WORKSPACE // DASHBOARD ]
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
            DAFTAR DOKUMEN CV
          </h1>
          <p className="font-mono text-xs text-[#5C5A54] mt-1.5 flex items-center gap-2">
            <span>AKUN: {user.email}</span>
            <span>•</span>
            <span>{documents.length} DOKUMEN TERSIMPAN</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewTitle("");
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-[#0A0A0A] text-[#F4F4F0] border border-[#0A0A0A] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#F4F4F0] hover:text-[#0A0A0A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          + BUAT CV BARU
        </button>
      </div>

      {!isConfigured && (
        <div className="p-6 bg-[#EAE8E3] border-2 border-[#0A0A0A]">
          <p className="font-mono text-xs font-bold uppercase text-[#E61919] mb-2">
            [ SUPABASE DEV MODE ]
          </p>
          <p className="text-sm text-[#0A0A0A] mb-3">
            Koneksi Supabase belum disetel di .env.local. Anda tetap dapat menggunakan builder secara penuh via penyimpanan browser (localStorage).
          </p>
          <Link
            href="/builder"
            className="swiss-btn text-xs"
          >
            Buka Builder Standar →
          </Link>
        </div>
      )}

      {/* CV Grid */}
      {documents.length === 0 ? (
        <div className="border-2 border-dashed border-[#0A0A0A] p-12 sm:p-16 text-center bg-[#EAE8E3]">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white border-2 border-[#0A0A0A] mb-4">
            <FileText className="w-6 h-6 text-[#0A0A0A]" />
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#5C5A54] block mb-2">
            [ KOSONG // 0 DOKUMEN ]
          </span>
          <h3 className="text-xl font-bold uppercase text-[#0A0A0A] mb-2">
            Belum Ada Dokumen CV yang Dibuat
          </h3>
          <p className="text-sm text-[#5C5A54] max-w-md mx-auto mb-6">
            Buat beberapa variasi CV untuk menyesuaikan dengan berbagai lowongan (mis. CV Fullstack, CV Frontend, CV Mobile Dev).
          </p>
          <button
            type="button"
            onClick={() => {
              setNewTitle("");
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center justify-center bg-[#0A0A0A] text-[#F4F4F0] border border-[#0A0A0A] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-transparent hover:text-[#0A0A0A] transition-colors"
          >
            + BUAT CV BARU SEKARANG
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#EAE8E3] border-2 border-[#0A0A0A] p-6 flex flex-col justify-between hover:bg-white transition-colors group"
            >
              <div>
                {/* Meta Top */}
                <div className="flex items-center justify-between border-b border-[#0A0A0A] pb-3 mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 border border-[#0A0A0A] bg-[#F4F4F0]">
                    BAHASA: {doc.language.toUpperCase()}
                  </span>
                  <span className="font-mono text-[10px] text-[#5C5A54]">
                    {new Date(doc.updated_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-mono text-lg font-bold uppercase text-[#0A0A0A] tracking-tight mb-2 truncate">
                  {doc.title}
                </h3>

                {/* Snippet */}
                <p className="text-xs text-[#5C5A54] line-clamp-3 leading-relaxed mb-4">
                  {doc.data?.overview ||
                    "CV format ATS-Safe. Berisi riwayat pendidikan, pengalaman kerja, proyek, dan keahlian teknis."}
                </p>
              </div>

              {/* Action Buttons (Text-button Swiss Industrial style) */}
              <div className="pt-4 border-t border-[#0A0A0A] flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <Link
                  href={`/builder?id=${doc.id}`}
                  className="font-bold text-[#0A0A0A] hover:underline flex items-center gap-1"
                  title="Buka dan edit di CV Builder"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  [ EDIT ]
                </Link>

                <button
                  type="button"
                  onClick={() => handleDuplicate(doc)}
                  disabled={loading}
                  className="text-[#5C5A54] hover:text-[#0A0A0A] flex items-center gap-1"
                  title="Duplikat CV untuk posisi lain"
                >
                  <Copy className="w-3.5 h-3.5" />
                  [ DUPLIKAT ]
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRenameDoc(doc);
                    setRenameTitle(doc.title);
                  }}
                  className="text-[#5C5A54] hover:text-[#0A0A0A] flex items-center gap-1"
                  title="Ubah judul CV"
                >
                  <Tag className="w-3.5 h-3.5" />
                  [ RENAME ]
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteDoc(doc)}
                  className="text-[#E61919] hover:underline flex items-center gap-1"
                  title="Hapus CV ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  [ HAPUS ]
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: CREATE NEW CV */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-md bg-[#EAE8E3] border-2 border-[#0A0A0A] p-6 relative">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-[#5C5A54] hover:text-[#0A0A0A]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#0A0A0A] pb-3 mb-5">
              <span className="font-mono text-xs uppercase text-[#5C5A54] block">
                [ DOKUMEN // BARU ]
              </span>
              <h3 className="text-xl font-extrabold uppercase text-[#0A0A0A]">
                BUAT CV BARU
              </h3>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase font-bold text-[#0A0A0A] mb-1.5">
                  JUDUL / LABEL CV *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="mis. CV Fullstack Developer"
                  className="swiss-input"
                />
                <span className="font-mono text-[10px] text-[#5C5A54] block mt-1">
                  Beri label sesuai posisi kerja target Anda.
                </span>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase font-bold text-[#0A0A0A] mb-1.5">
                  BAHASA CV
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewLanguage("id")}
                    className={`py-2 px-3 font-mono text-xs font-bold border border-[#0A0A0A] text-center transition-colors ${
                      newLanguage === "id"
                        ? "bg-[#0A0A0A] text-white"
                        : "bg-white text-[#0A0A0A]"
                    }`}
                  >
                    INDONESIA
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewLanguage("en")}
                    className={`py-2 px-3 font-mono text-xs font-bold border border-[#0A0A0A] text-center transition-colors ${
                      newLanguage === "en"
                        ? "bg-[#0A0A0A] text-white"
                        : "bg-white text-[#0A0A0A]"
                    }`}
                  >
                    ENGLISH
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#0A0A0A] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="swiss-btn-outline text-xs"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  disabled={loading || !newTitle.trim()}
                  className="swiss-btn text-xs disabled:opacity-50"
                >
                  {loading ? "MEMBUAT..." : "BUKA BUILDER →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RENAME CV */}
      {renameDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-md bg-[#EAE8E3] border-2 border-[#0A0A0A] p-6 relative">
            <button
              type="button"
              onClick={() => setRenameDoc(null)}
              className="absolute top-4 right-4 text-[#5C5A54] hover:text-[#0A0A0A]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#0A0A0A] pb-3 mb-5">
              <span className="font-mono text-xs uppercase text-[#5C5A54] block">
                [ DOKUMEN // GANTI NAMA ]
              </span>
              <h3 className="text-xl font-extrabold uppercase text-[#0A0A0A]">
                UBAH JUDUL CV
              </h3>
            </div>

            <form onSubmit={handleRename} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase font-bold text-[#0A0A0A] mb-1.5">
                  JUDUL BARU *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={renameTitle}
                  onChange={(e) => setRenameTitle(e.target.value)}
                  className="swiss-input"
                />
              </div>

              <div className="pt-4 border-t border-[#0A0A0A] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRenameDoc(null)}
                  className="swiss-btn-outline text-xs"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  disabled={loading || !renameTitle.trim()}
                  className="swiss-btn text-xs disabled:opacity-50"
                >
                  {loading ? "MENYIMPAN..." : "SIMPAN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM DELETE */}
      {deleteDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-md bg-[#EAE8E3] border-2 border-[#E61919] p-6 relative">
            <div className="flex items-center gap-3 border-b border-[#0A0A0A] pb-3 mb-4">
              <div className="p-2 bg-[#E61919] text-white">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-xs uppercase text-[#E61919] font-bold block">
                  [ KONFIRMASI HAPUS ]
                </span>
                <h3 className="text-lg font-bold uppercase text-[#0A0A0A]">
                  HAPUS DOKUMEN CV?
                </h3>
              </div>
            </div>

            <p className="text-sm text-[#0A0A0A] mb-4">
              Apakah Anda yakin ingin menghapus CV <strong>&quot;{deleteDoc.title}&quot;</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="pt-4 border-t border-[#0A0A0A] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteDoc(null)}
                className="swiss-btn-outline text-xs"
              >
                BATAL
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="swiss-btn-destructive text-xs disabled:opacity-50"
              >
                {loading ? "MENGHAPUS..." : "YA, HAPUS PERMANEN"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
