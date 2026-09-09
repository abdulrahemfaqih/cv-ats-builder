"use client";

import React from "react";
import { useCVStore } from "@/lib/store/useCVStore";
import { LanguageEntry } from "@/types/cv";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
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

interface LanguagesFormProps {
  sectionId: string;
  entries: LanguageEntry[];
}

const LEVEL_PRESETS_ID = [
  "Penutur Asli (Native)",
  "Tingkat Kerja Profesional",
  "Tingkat Menengah (Intermediate)",
  "Tingkat Dasar (Basic)",
];

const LEVEL_PRESETS_EN = [
  "Native / Bilingual",
  "Professional Working Proficiency",
  "Limited Working Proficiency",
  "Elementary Proficiency",
];

function SortableLanguageItem({
  entry,
  sectionId,
  index,
}: {
  entry: LanguageEntry;
  sectionId: string;
  index: number;
}) {
  const { updateEntry, removeEntry, language: cvLang } = useCVStore();
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

  const handleFieldChange = (field: keyof LanguageEntry, val: string) => {
    updateEntry(sectionId, entry.id, { [field]: val } as Partial<LanguageEntry>);
  };

  const presets = cvLang === "en" ? LEVEL_PRESETS_EN : LEVEL_PRESETS_ID;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="space-y-3 py-4 border-b border-[#E2E2DC]/60 last:border-b-0"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-[#8E8C85] hover:text-[#111111] p-1 rounded transition-colors touch-none select-none"
            style={{ touchAction: "none" }}
            title="Tahan & geser untuk mengubah urutan"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-[#111111]">
            Bahasa #{index + 1}: {entry.language || "Nama Bahasa"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => removeEntry(sectionId, entry.id)}
          className="text-[#8E8C85] hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          title="Hapus bahasa ini"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: Nama Bahasa & Tingkat Kemahiran */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Nama Bahasa *
          </label>
          <input
            type="text"
            value={entry.language}
            onChange={(e) => handleFieldChange("language", e.target.value)}
            placeholder="mis. Bahasa Indonesia, English, Mandarin"
            className="app-input text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Tingkat Kemahiran / Level *
          </label>
          <input
            type="text"
            list={`proficiency-suggestions-${entry.id}`}
            value={entry.proficiency}
            onChange={(e) => handleFieldChange("proficiency", e.target.value)}
            placeholder="mis. Penutur Asli, Tingkat Kerja Profesional"
            className="app-input text-xs"
          />
          <datalist id={`proficiency-suggestions-${entry.id}`}>
            {presets.map((preset) => (
              <option key={preset} value={preset} />
            ))}
          </datalist>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleFieldChange("proficiency", preset)}
                className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                  entry.proficiency === preset
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-[#F8F8F6] text-[#666660] border-[#E2E2DC] hover:bg-[#EAEAE6] hover:text-[#111111]"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skor Tes / Sertifikasi Opsional */}
      <div>
        <label className="block text-xs font-medium text-[#111111] mb-1.5">
          Skor Tes / Sertifikasi Bahasa (Opsional)
        </label>
        <input
          type="text"
          value={entry.info || ""}
          onChange={(e) => handleFieldChange("info", e.target.value)}
          placeholder="mis. IELTS 7.5, TOEFL ITP 600, JLPT N2, CEFR C1"
          className="app-input text-xs"
        />
      </div>
    </div>
  );
}

export function LanguagesForm({ sectionId, entries }: LanguagesFormProps) {
  const { addEntry, reorderEntries } = useCVStore();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
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
        id={`dnd-languages-${sectionId}`}
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
              <SortableLanguageItem
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
        Tambah Bahasa
      </button>
    </div>
  );
}
