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
      className="space-y-3 py-4 border-b border-[#E2E2DC]/60 last:border-b-0"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-[#9E9E96] hover:text-[#111111] p-0.5"
            title="Tahan & geser untuk mengubah urutan"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-[#111111]">
            Pekerjaan #{index + 1}{entry.company ? `: ${entry.company}` : ""}
          </span>
        </div>
        <button
          type="button"
          onClick={() => removeEntry(sectionId, entry.id)}
          className="text-[#9E9E96] hover:text-[#E61919] p-1 rounded-md transition-colors"
          title="Hapus entri ini"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Company & Position */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-[#111111] mb-1">
            Nama Perusahaan *
          </label>
          <input
            type="text"
            value={entry.company}
            onChange={(e) => handleFieldChange("company", e.target.value)}
            placeholder="mis. PT Solusi Digital"
            className="app-input text-xs"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#111111] mb-1">
            Posisi / Jabatan *
          </label>
          <input
            type="text"
            value={entry.position}
            onChange={(e) => handleFieldChange("position", e.target.value)}
            placeholder="mis. Fullstack Web Developer"
            className="app-input text-xs"
          />
        </div>
      </div>

      {/* Employment Type & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-[#111111] mb-1">
            Tipe Kerja (Opsional)
          </label>
          <input
            type="text"
            value={entry.employmentType || ""}
            onChange={(e) => handleFieldChange("employmentType", e.target.value)}
            placeholder="mis. Intern / Full-time"
            className="app-input text-xs"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#111111] mb-1">
            Bulan/Tahun Mulai *
          </label>
          <input
            type="text"
            value={entry.startDate}
            onChange={(e) => handleFieldChange("startDate", e.target.value)}
            placeholder="mis. Agu 2024"
            className="app-input text-xs"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-[#111111]">
              Selesai *
            </label>
            <label className="text-[10px] text-[#666660] flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(entry.isCurrent)}
                onChange={(e) => handleFieldChange("isCurrent", e.target.checked)}
                className="w-3 h-3 accent-[#111111] rounded"
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
            className="app-input text-xs disabled:bg-[#F2F2EE] disabled:text-[#666660]"
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label className="block text-[11px] font-semibold text-[#111111] mb-1">
            Kabupaten / Kota *
          </label>
          <input
            type="text"
            value={entry.location?.kabupaten || ""}
            onChange={(e) => handleLocationChange("kabupaten", e.target.value)}
            placeholder="mis. Surabaya"
            className="app-input text-xs"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#111111] mb-1">
            Provinsi *
          </label>
          <input
            type="text"
            value={entry.location?.provinsi || ""}
            onChange={(e) => handleLocationChange("provinsi", e.target.value)}
            placeholder="mis. Jawa Timur"
            className="app-input text-xs"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#111111] mb-1">
            Negara (Opsional)
          </label>
          <input
            type="text"
            value={entry.location?.country || ""}
            onChange={(e) => handleLocationChange("country", e.target.value)}
            placeholder="mis. Indonesia"
            className="app-input text-xs"
          />
        </div>
      </div>

      {/* Bullet Points */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-semibold text-[#111111]">
            Poin Pencapaian & Tanggung Jawab (Bullet Points) *
          </label>
          <button
            type="button"
            onClick={addBullet}
            className="text-[11px] font-semibold text-[#111111] hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-3 h-3 text-[#666660]" />
            Tambah Bullet
          </button>
        </div>

        <div className="space-y-2">
          {(entry.bullets || []).map((bullet, bIdx) => (
            <div key={bIdx} className="flex items-start gap-2">
              <span className="text-xs text-[#9E9E96] pt-2">•</span>
              <textarea
                rows={2}
                value={bullet}
                onChange={(e) => handleBulletChange(bIdx, e.target.value)}
                placeholder="Tuliskan tindakan nyata, teknologi yang digunakan, serta dampak terukur..."
                className="app-input text-xs resize-y flex-1"
              />
              <button
                type="button"
                onClick={() => removeBullet(bIdx)}
                className="text-[#9E9E96] hover:text-[#E61919] p-1.5 pt-2 transition-colors"
                title="Hapus bullet ini"
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
        id={`dnd-work-${sectionId}`}
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
        className="w-full flex items-center justify-center gap-1.5 border border-dashed border-[#D2D2CC] rounded-lg p-2.5 bg-[#F8F8F6] text-xs font-semibold text-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Tambah Pengalaman Kerja
      </button>
    </div>
  );
}



