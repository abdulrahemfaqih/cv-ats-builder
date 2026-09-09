"use client";

import React, { useRef, useState } from "react";
import { useCVStore } from "@/lib/store/useCVStore";
import { compressImageFile } from "@/lib/utils/imageCompressor";
import { Upload, Trash2, Camera, RefreshCw, Link as LinkIcon, AlertCircle } from "lucide-react";

export function HeaderForm() {
  const { data, updateHeader, title, setTitle } = useCVStore();
  const { header } = data;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Berkas harus berupa gambar (JPG, PNG, atau WEBP).");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const compressedDataUrl = await compressImageFile(file, 400, 500, 0.85);
      updateHeader({
        useProfilePhoto: true,
        photoUrl: compressedDataUrl,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memproses gambar";
      setUploadError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemovePhoto = () => {
    updateHeader({
      photoUrl: "",
    });
    setUploadError(null);
  };

  const handleApplyUrl = () => {
    if (!tempUrl.trim()) return;
    updateHeader({
      useProfilePhoto: true,
      photoUrl: tempUrl.trim(),
    });
    setTempUrl("");
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-4">
      {/* SECTION: Foto Profil Opsional */}
      <div className="bg-[#FFFFFF] border border-[#E2E2DC] rounded-xl p-4 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#111111]" />
            <div>
              <span className="text-xs font-semibold text-[#111111]">
                Foto Profil (Opsional)
              </span>
              <span className="ml-2 text-[10px] bg-[#F2F2EE] text-[#666660] px-1.5 py-0.5 rounded font-medium">
                Pojok Kiri Atas
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="useProfilePhotoToggle"
              checked={Boolean(header.useProfilePhoto)}
              onChange={(e) => updateHeader({ useProfilePhoto: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-[#E2E2DC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#111111]"></div>
          </label>
        </div>

        {header.useProfilePhoto && (
          <div className="mt-3 pt-3 border-t border-[#F0F0EC] space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {header.photoUrl ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative w-[60px] h-[80px] shrink-0 rounded-md overflow-hidden border border-[#E2E2DC] bg-[#F8F8F6] shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={header.photoUrl}
                    alt="Foto Profil CV"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="text-xs font-medium text-[#111111]">
                    Foto profil aktif ditampilkan di CV
                  </div>
                  <div className="text-[11px] text-[#666660]">
                    Posisi: pojok kiri atas, sejajar dengan nama dan informasi kontak.
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-white border border-[#E2E2DC] hover:border-[#111111] text-[#111111] rounded-md transition-colors font-medium shadow-2xs"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Ganti Foto
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-white border border-[#F8D7DA] hover:bg-[#FDF2F2] text-[#E61919] rounded-md transition-colors font-medium"
                    >
                      <Trash2 className="w-3 h-3" />
                      Hapus Foto
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-[#111111] bg-[#F8F8F6]"
                    : "border-[#D0D0C8] hover:border-[#111111] bg-[#FAFAF8]"
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1.5 text-center">
                  <div className="w-8 h-8 rounded-full bg-[#EEEEEC] flex items-center justify-center text-[#111111]">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold text-[#111111]">
                    {isUploading ? "Memproses gambar..." : "Klik atau seret foto ke sini"}
                  </div>
                  <div className="text-[11px] text-[#666660]">
                    Format JPG, PNG, atau WEBP (rasio pas foto 3:4 disarankan)
                  </div>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="flex items-center gap-1.5 text-xs text-[#E61919] bg-[#FDF2F2] p-2 rounded-md">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Alternatif memasukkan tautan gambar */}
            {!header.photoUrl && (
              <div className="pt-1">
                {!showUrlInput ? (
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    className="text-[11px] text-[#666660] hover:text-[#111111] underline inline-flex items-center gap-1"
                  >
                    <LinkIcon className="w-3 h-3" />
                    Atau gunakan tautan URL gambar
                  </button>
                ) : (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="url"
                      value={tempUrl}
                      onChange={(e) => setTempUrl(e.target.value)}
                      placeholder="https://domain.com/foto.jpg"
                      className="app-input text-xs py-1.5"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="text-xs px-3 py-1.5 bg-[#111111] text-white rounded-md font-medium shrink-0"
                    >
                      Terapkan
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(false)}
                      className="text-xs px-2 py-1.5 text-[#666660] hover:text-[#111111]"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold text-[#111111] mb-1.5">
          Nama Lengkap <span className="text-[#E61919]">*</span>
        </label>
        <input
          type="text"
          value={header.name}
          onChange={(e) => {
            const newName = e.target.value;
            updateHeader({ name: newName });
            if (!title || title === "Untitled CV" || title === "CV Alex Pratama") {
              if (newName.trim()) {
                setTitle(`CV ${newName.trim()}`);
              }
            }
          }}
          placeholder="mis. Alex Pratama"
          className="app-input"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-xs font-semibold text-[#111111] mb-1.5">
          Alamat Domisili <span className="text-[#E61919]">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={header.address.kecamatan}
            onChange={(e) =>
              updateHeader({
                address: { ...header.address, kecamatan: e.target.value },
              })
            }
            placeholder="Kecamatan (mis. Kebayoran Baru)"
            className="app-input text-xs"
          />
          <input
            type="text"
            value={header.address.kabupaten}
            onChange={(e) =>
              updateHeader({
                address: { ...header.address, kabupaten: e.target.value },
              })
            }
            placeholder="Kabupaten/Kota (mis. Jakarta Selatan)"
            className="app-input text-xs"
          />
          <input
            type="text"
            value={header.address.provinsi}
            onChange={(e) =>
              updateHeader({
                address: { ...header.address, provinsi: e.target.value },
              })
            }
            placeholder="Provinsi (mis. DKI Jakarta)"
            className="app-input text-xs"
          />
        </div>
      </div>

      {/* Contact: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1.5">
            Email <span className="text-[#E61919]">*</span>
          </label>
          <input
            type="email"
            value={header.email}
            onChange={(e) => updateHeader({ email: e.target.value })}
            placeholder="nama@email.com"
            className="app-input text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1.5">
            Nomor Telepon / WhatsApp <span className="text-[#E61919]">*</span>
          </label>
          <input
            type="text"
            value={header.phone}
            onChange={(e) => updateHeader({ phone: e.target.value })}
            placeholder="mis. 081234567890"
            className="app-input text-xs"
          />
        </div>
      </div>

      {/* Contact: LinkedIn & Portfolio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1.5">
            LinkedIn (Opsional)
          </label>
          <input
            type="text"
            value={header.linkedin || ""}
            onChange={(e) => updateHeader({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/username"
            className="app-input text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#111111] mb-1.5">
            Portofolio / Website (Opsional)
          </label>
          <input
            type="text"
            value={header.portfolio || ""}
            onChange={(e) => updateHeader({ portfolio: e.target.value })}
            placeholder="mis. bit.ly/portofolio-anda"
            className="app-input text-xs"
          />
        </div>
      </div>
    </div>
  );
}
