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
      className="border border-[#0A0A0A] bg-white p-4 space-y-3"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#EAE8E3] pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-[#5C5A54] hover:text-[#0A0A0A] p-0.5"
            title="Tahan & geser untuk mengubah urutan"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs font-bold text-[#0A0A0A]">
            [ PRESTASI #{index + 1} ] {entry.name || "Nama Pencapaian"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => removeEntry(sectionId, entry.id)}
          className="text-[#5C5A54] hover:text-[#E61919] p-1 transition-colors"
          title="Hapus entri ini"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Name & Context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            NAMA PENCAPAIAN / PENGHARGAAN *
          </label>
          <input
            type="text"
            value={entry.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="mis. Juara 2 Hackathon Gemastik XVI"
            className="swiss-input text-xs"
          />
        </div>
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            PENYELENGGARA / KONTEKS
          </label>
          <input
            type="text"
            value={entry.context || ""}
            onChange={(e) => handleFieldChange("context", e.target.value)}
            placeholder="mis. Puspresnas Kemdikbudristek"
            className="swiss-input text-xs"
          />
        </div>
      </div>

      {/* Date & Description */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            BULAN/TAHUN *
          </label>
          <input
            type="text"
            value={entry.date}
            onChange={(e) => handleFieldChange("date", e.target.value)}
            placeholder="mis. Okt 2024"
            className="swiss-input text-xs"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            KETERANGAN / DESKRIPSI
          </label>
          <input
            type="text"
            value={entry.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            placeholder="mis. Mengembangkan solusi deteksi anomali real-time dari 300+ tim nasional"
            className="swiss-input text-xs"
          />
        </div>
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
        className="w-full flex items-center justify-center gap-2 border border-dashed border-[#0A0A0A] p-2.5 bg-[#F4F4F0] font-mono text-xs font-bold text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        TAMBAH PENCAPAIAN
      </button>
    </div>
  );
}
