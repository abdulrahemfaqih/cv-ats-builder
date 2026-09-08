"use client";

import React from "react";
import { useCVStore } from "@/lib/store/useCVStore";

export function OverviewForm() {
  const { data, updateOverview } = useCVStore();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#111111]">
          Ringkasan Profil / Overview
        </label>
        <span className="text-[11px] text-[#666660]">
          {data.overview.length} karakter
        </span>
      </div>
      <textarea
        rows={4}
        value={data.overview}
        onChange={(e) => updateOverview(e.target.value)}
        placeholder="Tuliskan 2-4 kalimat ringkasan profesional Anda, fokus ke keahlian utama, pengalaman, dan pencapaian..."
        className="app-input resize-y text-sm font-sans"
      />
      <p className="text-[11px] text-[#666660]">
        Overview akan tampil di bawah garis kontak tanpa judul section, sesuai standar format ATS.
      </p>
    </div>
  );
}
