"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useCVStore } from "@/lib/store/useCVStore";
import { Upload, X } from "lucide-react";

export function HeaderForm() {
  const { data, updateHeader } = useCVStore();
  const { header } = data;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateHeader({ photoUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold text-[#111111] mb-1.5">
          Nama Lengkap <span className="text-[#E61919]">*</span>
        </label>
        <input
          type="text"
          value={header.name}
          onChange={(e) => updateHeader({ name: e.target.value })}
          placeholder="mis. Alex Pratama"
          className="app-input"
        />
      </div>

      {/* Profile Photo Toggle & Upload */}
      <div className="border border-[#E2E2DC] rounded-xl p-3.5 bg-[#FAFAF8] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-semibold text-[#111111] block">
              Foto Profil (Opsional)
            </label>
            <span className="text-[11px] text-[#666660] block">
              Format persegi 1:1 (~2.5cm x 2.5cm di pojok kiri atas CV)
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              updateHeader({ useProfilePhoto: !header.useProfilePhoto })
            }
            className={`text-xs font-medium px-3 py-1 rounded-lg border transition-colors ${
              header.useProfilePhoto
                ? "bg-[#111111] text-white border-[#111111]"
                : "bg-white text-[#666660] border-[#E2E2DC]"
            }`}
          >
            {header.useProfilePhoto ? "Aktif" : "Nonaktif"}
          </button>
        </div>

        {header.useProfilePhoto && (
          <div className="pt-3 border-t border-[#E2E2DC] flex items-center gap-4">
            {header.photoUrl ? (
              <div className="relative w-16 h-16 rounded-lg border border-[#E2E2DC] flex-shrink-0 bg-white overflow-hidden shadow-sm">
                <Image
                  src={header.photoUrl}
                  alt="Avatar"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => updateHeader({ photoUrl: "" })}
                  className="absolute top-0 right-0 bg-[#111111] text-white p-1 rounded-bl-md hover:bg-[#E61919] transition-colors"
                  title="Hapus Foto"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg border border-dashed border-[#D2D2CC] flex items-center justify-center bg-white text-[#9E9E96] flex-shrink-0 text-[10px] text-center p-1">
                Foto 1:1
              </div>
            )}

            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="app-btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-[#666660]" />
                Pilih Foto
              </button>
              <p className="text-[11px] text-[#666660] mt-1">
                JPG atau PNG, rasio persegi disarankan.
              </p>
            </div>
          </div>
        )}
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
            placeholder="websiteanda.com"
            className="app-input text-xs"
          />
        </div>
      </div>
    </div>
  );
}
