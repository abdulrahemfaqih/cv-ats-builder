"use client";

import React from "react";
import { useCVStore } from "@/lib/store/useCVStore";
import { WorkEntry } from "@/types/cv";
import { Plus, Trash2, GripVertical, PlusCircle } from "lucide-react";
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

interface WorkExperienceFormProps {
  sectionId: string;
  entries: WorkEntry[];
}

function SortableWorkItem({
  entry,
  sectionId,
  index,
}: {
  entry: WorkEntry;
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

  const handleFieldChange = (field: keyof WorkEntry, val: unknown) => {
    updateEntry(sectionId, entry.id, { [field]: val } as Partial<WorkEntry>);
  };

  const handleLocationChange = (field: string, val: string) => {
    updateEntry(sectionId, entry.id, {
      location: {
        ...entry.location,
        [field]: val,
      },
    });
  };

  const handleBulletChange = (bIdx: number, val: string) => {
    const updated = [...(entry.bullets || [])];
    updated[bIdx] = val;
    handleFieldChange("bullets", updated);
  };

  const addBullet = () => {
    const updated = [...(entry.bullets || []), ""];
    handleFieldChange("bullets", updated);
  };

  const removeBullet = (bIdx: number) => {
    const updated = (entry.bullets || []).filter((_, i) => i !== bIdx);
    handleFieldChange("bullets", updated);
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
            [ PEKERJAAN #{index + 1} ] {entry.company || "Nama Perusahaan"}
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

      {/* Company & Position */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            NAMA PERUSAHAAN *
          </label>
          <input
            type="text"
            value={entry.company}
            onChange={(e) => handleFieldChange("company", e.target.value)}
            placeholder="mis. PT Solusi Digital"
            className="swiss-input text-xs"
          />
        </div>
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            POSISI / JABATAN *
          </label>
          <input
            type="text"
            value={entry.position}
            onChange={(e) => handleFieldChange("position", e.target.value)}
            placeholder="mis. Fullstack Web Developer"
            className="swiss-input text-xs"
          />
        </div>
      </div>

      {/* Employment Type & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            TIPE KERJA (OPSIONAL)
          </label>
          <input
            type="text"
            value={entry.employmentType || ""}
            onChange={(e) => handleFieldChange("employmentType", e.target.value)}
            placeholder="mis. Intern / Full-time / Paruh Waktu"
            className="swiss-input text-xs"
          />
        </div>
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            BULAN/TAHUN MULAI *
          </label>
          <input
            type="text"
            value={entry.startDate}
            onChange={(e) => handleFieldChange("startDate", e.target.value)}
            placeholder="mis. Agu 2024"
            className="swiss-input text-xs"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-mono text-[11px] uppercase font-bold text-[#0A0A0A]">
              SELESAI *
            </label>
            <label className="font-mono text-[10px] text-[#5C5A54] flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(entry.isCurrent)}
                onChange={(e) => handleFieldChange("isCurrent", e.target.checked)}
                className="w-3 h-3 accent-[#0A0A0A]"
              />
              Sekarang
            </label>
          </div>
          <input
            type="text"
            disabled={Boolean(entry.isCurrent)}
            value={entry.isCurrent ? "Sekarang" : entry.endDate}
            onChange={(e) => handleFieldChange("endDate", e.target.value)}
            placeholder="mis. Jan 2025"
            className="swiss-input text-xs disabled:bg-[#EAE8E3] disabled:text-[#5C5A54]"
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            KABUPATEN / KOTA *
          </label>
          <input
            type="text"
            value={entry.location?.kabupaten || ""}
            onChange={(e) => handleLocationChange("kabupaten", e.target.value)}
            placeholder="mis. Surabaya"
            className="swiss-input text-xs"
          />
        </div>
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            PROVINSI *
          </label>
          <input
            type="text"
            value={entry.location?.provinsi || ""}
            onChange={(e) => handleLocationChange("provinsi", e.target.value)}
            placeholder="mis. Jawa Timur"
            className="swiss-input text-xs"
          />
        </div>
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            NEGARA (OPSIONAL)
          </label>
          <input
            type="text"
            value={entry.location?.country || ""}
            onChange={(e) => handleLocationChange("country", e.target.value)}
            placeholder="mis. Indonesia"
            className="swiss-input text-xs"
          />
        </div>
      </div>

      {/* Bullet Points */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-mono text-[11px] uppercase font-bold text-[#0A0A0A]">
            POIN PENCAPAIAN & TANGGUNG JAWAB (BULLETS) *
          </label>
          <button
            type="button"
            onClick={addBullet}
            className="font-mono text-[10px] font-bold text-[#0A0A0A] hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-3 h-3" />
            TAMBAH BULLET
          </button>
        </div>

        <div className="space-y-2">
          {(entry.bullets || []).map((bullet, bIdx) => (
            <div key={bIdx} className="flex items-start gap-2">
              <span className="font-mono text-xs text-[#5C5A54] pt-2">•</span>
              <textarea
                rows={2}
                value={bullet}
                onChange={(e) => handleBulletChange(bIdx, e.target.value)}
                placeholder="Tuliskan tindakan konkret, teknologi yang digunakan, serta hasil yang terukur..."
                className="swiss-input text-xs resize-y flex-1"
              />
              <button
                type="button"
                onClick={() => removeBullet(bIdx)}
                className="text-[#5C5A54] hover:text-[#E61919] p-1 pt-2 transition-colors"
                title="Hapus baris bullet"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorkExperienceForm({
  sectionId,
  entries,
}: WorkExperienceFormProps) {
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
              <SortableWorkItem
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
        TAMBAH PENGALAMAN KERJA
      </button>
    </div>
  );
}
