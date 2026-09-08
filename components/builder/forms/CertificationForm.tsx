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
            [ SERTIFIKAT #{index + 1} ] {entry.name || "Nama Sertifikasi"}
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

      {/* Name & Issuer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            NAMA SERTIFIKASI *
          </label>
          <input
            type="text"
            value={entry.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="mis. AWS Certified Solutions Architect"
            className="swiss-input text-xs"
          />
        </div>
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            LEMBAGA PENERBIT *
          </label>
          <input
            type="text"
            value={entry.issuer}
            onChange={(e) => handleFieldChange("issuer", e.target.value)}
            placeholder="mis. Amazon Web Services"
            className="swiss-input text-xs"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            BULAN/TAHUN TERBIT *
          </label>
          <input
            type="text"
            value={entry.issueDate}
            onChange={(e) => handleFieldChange("issueDate", e.target.value)}
            placeholder="mis. Nov 2024"
            className="swiss-input text-xs"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-mono text-[11px] uppercase font-bold text-[#0A0A0A]">
              KEDALUWARSA
            </label>
            <label className="font-mono text-[10px] text-[#5C5A54] flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(entry.isLifetime)}
                onChange={(e) => handleFieldChange("isLifetime", e.target.checked)}
                className="w-3 h-3 accent-[#0A0A0A]"
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
            className="swiss-input text-xs disabled:bg-[#EAE8E3] disabled:text-[#5C5A54]"
          />
        </div>
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
        className="w-full flex items-center justify-center gap-2 border border-dashed border-[#0A0A0A] p-2.5 bg-[#F4F4F0] font-mono text-xs font-bold text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        TAMBAH SERTIFIKASI
      </button>
    </div>
  );
}
