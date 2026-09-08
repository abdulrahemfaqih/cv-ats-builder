"use client";

import React from "react";
import { useCVStore } from "@/lib/store/useCVStore";
import { AchievementEntry } from "@/types/cv";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface AchievementFormProps {
  sectionId: string;
  entries: AchievementEntry[];
}

function SortableAchItem({
  entry,
  sectionId,
  index,
}: {
  entry: AchievementEntry;
  sectionId: string;
  index: number;
}) {
  const { updateEntry, removeEntry } = useCVStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleFieldChange = (field: keyof AchievementEntry, val: unknown) => {
    updateEntry(sectionId, entry.id, { [field]: val } as Partial<AchievementEntry>);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-[#E2E2DC] bg-white rounded-xl p-4.5 space-y-3.5 shadow-xs transition-shadow hover:shadow-sm"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#F0EFEA] pb-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-[#8E8C85] hover:text-[#111111] p-1 rounded transition-colors"
            title="Tahan & geser untuk mengubah urutan"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-[#111111]">
            Prestasi #{index + 1}: {entry.name || "Nama Pencapaian"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => removeEntry(sectionId, entry.id)}
          className="text-[#8E8C85] hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          title="Hapus entri ini"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Name & Context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Nama Pencapaian / Penghargaan *
          </label>
          <input
            type="text"
            value={entry.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="mis. Juara 2 Hackathon Gemastik XVI"
            className="app-input text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Penyelenggara / Konteks
          </label>
          <input
            type="text"
            value={entry.context || ""}
            onChange={(e) => handleFieldChange("context", e.target.value)}
            placeholder="mis. Puspresnas Kemdikbudristek"
            className="app-input text-xs"
          />
        </div>
      </div>

      {/* Date & Description */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Bulan/Tahun *
          </label>
          <input
            type="text"
            value={entry.date}
            onChange={(e) => handleFieldChange("date", e.target.value)}
            placeholder="mis. Okt 2024"
            className="app-input text-xs"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Keterangan / Deskripsi Singkat
          </label>
          <input
            type="text"
            value={entry.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            placeholder="mis. Mengembangkan solusi deteksi anomali real-time dari 300+ tim nasional"
            className="app-input text-xs"
          />
        </div>
      </div>

      {/* Link Bukti / Sertifikat Penghargaan */}
      <div>
        <label className="block text-xs font-medium text-[#111111] mb-1.5">
          Link Bukti / Berita / Sertifikat Penghargaan (Opsional)
        </label>
        <input
          type="text"
          value={entry.link || ""}
          onChange={(e) => handleFieldChange("link", e.target.value)}
          placeholder="mis. https://news.example.com/... atau link sertifikat"
          className="app-input text-xs"
        />
      </div>
    </div>
  );
}

export function AchievementForm({
  sectionId,
  entries,
}: AchievementFormProps) {
  const { addEntry, reorderEntries } = useCVStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderEntries(sectionId, active.id as string, over.id as string);
    }
  };

  return (
    <div className="space-y-4">
      <DndContext
        id={`dnd-achievement-${sectionId}`}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={entries.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <SortableAchItem
                key={entry.id}
                entry={entry}
                sectionId={sectionId}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={() => addEntry(sectionId)}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-[#D2D2CC] p-3 rounded-xl bg-white/60 text-xs font-semibold text-[#111111] hover:bg-white hover:border-[#111111] transition-all"
      >
        <Plus className="w-4 h-4" />
        Tambah Pencapaian
      </button>
    </div>
  );
}
