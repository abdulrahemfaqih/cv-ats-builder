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

    // Convert to base64 data URL for instant live preview and local storage
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
        <label className="block font-mono text-xs uppercase text-[#0A0A0A] font-bold mb-1">
          NAMA LENGKAP <span className="text-[#E61919]">*</span>
        </label>
        <input
          type="text"
          value={header.name}
          onChange={(e) => updateHeader({ name: e.target.value })}
          placeholder="mis. Abdul Rahem Faqih"
          className="swiss-input"
        />
      </div>

      {/* Profile Photo Toggle & Upload */}
      <div className="border border-[#0A0A0A] p-3 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="font-mono text-xs uppercase text-[#0A0A0A] font-bold block">
              FOTO PROFIL (OPSIONAL)
            </label>
            <span className="font-mono text-[10px] text-[#5C5A54] block">
              Rasio 1:1 (~2.5cm x 2.5cm di pojok kiri atas CV)
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              updateHeader({ useProfilePhoto: !header.useProfilePhoto })
            }
            className={`font-mono text-xs font-bold px-3 py-1 border border-[#0A0A0A] transition-colors ${
              header.useProfilePhoto
                ? "bg-[#0A0A0A] text-white"
                : "bg-[#EAE8E3] text-[#5C5A54]"
            }`}
          >
            {header.useProfilePhoto ? "[ AKTIF ]" : "[ NONAKTIF ]"}
          </button>
        </div>

        {header.useProfilePhoto && (
          <div className="pt-3 border-t border-[#0A0A0A] flex items-center gap-4">
            {header.photoUrl ? (
              <div className="relative w-20 h-20 border-2 border-[#0A0A0A] flex-shrink-0 bg-[#EAE8E3] overflow-hidden">
                <Image
                  src={header.photoUrl}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => updateHeader({ photoUrl: "" })}
                  className="absolute top-0 right-0 bg-[#E61919] text-white p-1 hover:opacity-90"
                  title="Hapus Foto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 border-2 border-dashed border-[#0A0A0A] flex items-center justify-center bg-[#F4F4F0] text-[#5C5A54] flex-shrink-0 font-mono text-[10px] text-center p-1">
                1:1 Foto
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
                className="swiss-btn-outline text-xs w-full sm:w-auto flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                PILIH FOTO
              </button>
              <p className="font-mono text-[10px] text-[#5C5A54] mt-1.5">
                Format JPG/PNG, ukuran persegi direkomendasikan.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block font-mono text-xs uppercase text-[#0A0A0A] font-bold mb-1">
          ALAMAT DOMISILI <span className="text-[#E61919]">*</span>
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
            placeholder="Kecamatan (mis. Kamal)"
            className="swiss-input text-xs"
          />
          <input
            type="text"
            value={header.address.kabupaten}
            onChange={(e) =>
              updateHeader({
                address: { ...header.address, kabupaten: e.target.value },
              })
            }
            placeholder="Kabupaten/Kota (mis. Bangkalan)"
            className="swiss-input text-xs"
          />
          <input
            type="text"
            value={header.address.provinsi}
            onChange={(e) =>
              updateHeader({
                address: { ...header.address, provinsi: e.target.value },
              })
            }
            placeholder="Provinsi (mis. Jawa Timur)"
            className="swiss-input text-xs"
          />
        </div>
      </div>

      {/* Contact: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-mono text-xs uppercase text-[#0A0A0A] font-bold mb-1">
            EMAIL <span className="text-[#E61919]">*</span>
          </label>
          <input
            type="email"
            value={header.email}
            onChange={(e) => updateHeader({ email: e.target.value })}
            placeholder="nama@email.com"
            className="swiss-input text-xs"
          />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase text-[#0A0A0A] font-bold mb-1">
            NOMOR TELEPON / WA <span className="text-[#E61919]">*</span>
          </label>
          <input
            type="text"
            value={header.phone}
            onChange={(e) => updateHeader({ phone: e.target.value })}
            placeholder="mis. 089531419612"
            className="swiss-input text-xs"
          />
        </div>
      </div>

      {/* Contact: LinkedIn & Portfolio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-mono text-xs uppercase text-[#0A0A0A] font-bold mb-1">
            LINKEDIN (OPSIONAL)
          </label>
          <input
            type="text"
            value={header.linkedin || ""}
            onChange={(e) => updateHeader({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/username"
            className="swiss-input text-xs"
          />
        </div>
        <div>
          <label className="block font-mono text-xs uppercase text-[#0A0A0A] font-bold mb-1">
            PORTOFOLIO / WEBSITE (OPSIONAL)
          </label>
          <input
            type="text"
            value={header.portfolio || ""}
            onChange={(e) => updateHeader({ portfolio: e.target.value })}
            placeholder="websiteanda.com"
            className="swiss-input text-xs"
          />
        </div>
      </div>
    </div>
  );
}
