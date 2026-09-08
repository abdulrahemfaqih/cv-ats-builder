"use client";

import React from "react";
import { useCVStore } from "@/lib/store/useCVStore";

export function OverviewForm() {
  const { data, updateOverview } = useCVStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="font-mono text-xs uppercase text-[#0A0A0A] font-bold">
          RINGKASAN PROFIL / OVERVIEW
        </label>
        <span className="font-mono text-[10px] text-[#5C5A54]">
          {data.overview.length} KARAKTER
        </span>
      </div>
      <textarea
        rows={4}
        value={data.overview}
        onChange={(e) => updateOverview(e.target.value)}
        placeholder="Tuliskan 2-4 kalimat ringkasan profesional Anda, fokus ke keahlian utama, pengalaman, dan pencapaian..."
        className="swiss-input resize-y text-sm font-sans"
      />
      <p className="font-mono text-[10px] text-[#5C5A54] mt-1">
        Overview akan tampil di bawah garis pemisah kontak tanpa judul section, sesuai format ATS korporat.
      </p>
    </div>
  );
}
