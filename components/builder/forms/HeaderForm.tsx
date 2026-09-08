"use client";

import React from "react";
import { useCVStore } from "@/lib/store/useCVStore";

export function HeaderForm() {
  const { data, updateHeader } = useCVStore();
  const { header } = data;

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
