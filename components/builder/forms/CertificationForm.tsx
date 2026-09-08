"use client";

import React from "react";
import { useCVStore } from "@/lib/store/useCVStore";
import { CertificationEntry } from "@/types/cv";
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

interface CertificationFormProps {
  sectionId: string;
  entries: CertificationEntry[];
}

function SortableCertItem({
  entry,
  sectionId,
  index,
}: {
  entry: CertificationEntry;
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

  const handleFieldChange = (field: keyof CertificationEntry, val: unknown) => {
    updateEntry(sectionId, entry.id, { [field]: val } as Partial<CertificationEntry>);
  };

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
            className="cursor-grab active:cursor-grabbing text-[#8E8C85] hover:text-[#111111] p-1 rounded transition-colors"
            title="Tahan & geser untuk mengubah urutan"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-[#111111]">
            Sertifikasi #{index + 1}: {entry.name || "Nama Sertifikasi"}
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

      {/* Name & Issuer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Nama Sertifikasi *
          </label>
          <input
            type="text"
            value={entry.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="mis. AWS Certified Solutions Architect"
            className="app-input text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Lembaga Penerbit *
          </label>
          <input
            type="text"
            value={entry.issuer}
            onChange={(e) => handleFieldChange("issuer", e.target.value)}
            placeholder="mis. Amazon Web Services"
            className="app-input text-xs"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Bulan/Tahun Terbit *
          </label>
          <input
            type="text"
            value={entry.issueDate}
            onChange={(e) => handleFieldChange("issueDate", e.target.value)}
            placeholder="mis. Nov 2024"
            className="app-input text-xs"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#111111]">
              Kedaluwarsa
            </label>
            <label className="text-xs text-[#666660] flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(entry.isLifetime)}
                onChange={(e) => handleFieldChange("isLifetime", e.target.checked)}
                className="w-3.5 h-3.5 accent-[#111111] rounded"
              />
              Seumur Hidup
            </label>
          </div>
          <input
            type="text"
            disabled={Boolean(entry.isLifetime)}
            value={entry.isLifetime ? "Seumur Hidup / Tidak Ada" : entry.expiryDate || ""}
            onChange={(e) => handleFieldChange("expiryDate", e.target.value)}
            placeholder="mis. Nov 2027"
            className="app-input text-xs disabled:bg-[#F0EFEA] disabled:text-[#8E8C85]"
          />
        </div>
      </div>

      {/* Link Kredensial / Sertifikat */}
      <div>
        <label className="block text-xs font-medium text-[#111111] mb-1.5">
          Link Kredensial / Sertifikat (Opsional)
        </label>
        <input
          type="text"
          value={entry.link || ""}
          onChange={(e) => handleFieldChange("link", e.target.value)}
          placeholder="mis. https://credential.net/... atau link verifikasi"
          className="app-input text-xs"
        />
      </div>
    </div>
  );
}

export function CertificationForm({
  sectionId,
  entries,
}: CertificationFormProps) {
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
        id={`dnd-certification-${sectionId}`}
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
              <SortableCertItem
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
        Tambah Sertifikasi
      </button>
    </div>
  );
}



