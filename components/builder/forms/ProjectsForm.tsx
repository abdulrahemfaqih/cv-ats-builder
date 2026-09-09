"use client";

import React from "react";
import { useCVStore } from "@/lib/store/useCVStore";
import { ProjectEntry } from "@/types/cv";
import { Plus, Trash2, GripVertical, PlusCircle } from "lucide-react";
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

interface ProjectsFormProps {
  sectionId: string;
  entries: ProjectEntry[];
}

function SortableProjectItem({
  entry,
  sectionId,
  index,
}: {
  entry: ProjectEntry;
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

  const handleFieldChange = (field: keyof ProjectEntry, val: unknown) => {
    updateEntry(sectionId, entry.id, { [field]: val } as Partial<ProjectEntry>);
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
            className="cursor-grab active:cursor-grabbing text-[#8E8C85] hover:text-[#111111] p-1 rounded transition-colors touch-none select-none"
            style={{ touchAction: "none" }}
            title="Tahan & geser untuk mengubah urutan"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-[#111111]">
            Proyek #{index + 1}: {entry.name || "Nama Proyek"}
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

      {/* Project Name & Year */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Nama Proyek *
          </label>
          <input
            type="text"
            value={entry.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="mis. Cevio — ATS-Friendly CV Generator"
            className="app-input text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Tahun *
          </label>
          <input
            type="text"
            value={entry.year}
            onChange={(e) => handleFieldChange("year", e.target.value)}
            placeholder="mis. 2025"
            className="app-input text-xs"
          />
        </div>
      </div>

      {/* Project Link */}
      <div>
        <label className="block text-xs font-medium text-[#111111] mb-1.5">
          Link Proyek (Opsional)
        </label>
        <input
          type="text"
          value={entry.link || ""}
          onChange={(e) => handleFieldChange("link", e.target.value)}
          placeholder="mis. bit.ly/nama-proyek"
          className="app-input text-xs"
        />
      </div>

      {/* Description Format & Inputs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-[#111111]">
            Deskripsi Proyek *
          </label>
          {/* Format Toggle */}
          <div className="inline-flex rounded-lg border border-[#E2E2DC] p-0.5 bg-[#F8F8F6] text-xs">
            <button
              type="button"
              onClick={() => handleFieldChange("descriptionType", "bullets")}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                (entry.descriptionType || "bullets") === "bullets"
                  ? "bg-white text-[#111111] shadow-2xs font-semibold"
                  : "text-[#666660] hover:text-[#111111] font-medium"
              }`}
            >
              Poin (Bullets)
            </button>
            <button
              type="button"
              onClick={() => handleFieldChange("descriptionType", "paragraph")}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                entry.descriptionType === "paragraph"
                  ? "bg-white text-[#111111] shadow-2xs font-semibold"
                  : "text-[#666660] hover:text-[#111111] font-medium"
              }`}
            >
              1 Paragraf
            </button>
          </div>
        </div>

        {entry.descriptionType === "paragraph" ? (
          <div>
            <textarea
              rows={3}
              value={entry.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Tuliskan ringkasan proyek, teknologi yang digunakan, serta dampak atau hasil akhir dalam satu paragraf..."
              className="app-input text-xs resize-y w-full"
            />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-[#666660]">
                Rincian fitur dan teknologi dalam bentuk poin
              </span>
              <button
                type="button"
                onClick={addBullet}
                className="text-xs font-medium text-[#111111] hover:underline flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Tambah Poin
              </button>
            </div>

            <div className="space-y-2">
              {(entry.bullets || []).map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-start gap-2">
                  <span className="text-xs text-[#8E8C85] pt-2.5">•</span>
                  <textarea
                    rows={2}
                    value={bullet}
                    onChange={(e) => handleBulletChange(bIdx, e.target.value)}
                    placeholder="Rincian fitur, arsitektur, teknologi, atau dampak proyek..."
                    className="app-input text-xs resize-y flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeBullet(bIdx)}
                    className="text-[#8E8C85] hover:text-red-600 p-1.5 pt-2.5 rounded hover:bg-red-50 transition-colors"
                    title="Hapus baris bullet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectsForm({ sectionId, entries }: ProjectsFormProps) {
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
        id={`dnd-projects-${sectionId}`}
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
              <SortableProjectItem
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
        Tambah Proyek
      </button>
    </div>
  );
}



