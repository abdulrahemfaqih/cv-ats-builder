"use client";

import React from "react";
import { useCVStore } from "@/lib/store/useCVStore";
import { ProjectEntry } from "@/types/cv";
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
            [ PROYEK #{index + 1} ] {entry.name || "Nama Proyek"}
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

      {/* Project Name & Year */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            NAMA PROYEK *
          </label>
          <input
            type="text"
            value={entry.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="mis. Cevio — ATS-Friendly CV Generator"
            className="swiss-input text-xs"
          />
        </div>
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            TAHUN *
          </label>
          <input
            type="text"
            value={entry.year}
            onChange={(e) => handleFieldChange("year", e.target.value)}
            placeholder="mis. 2025"
            className="swiss-input text-xs"
          />
        </div>
      </div>

      {/* Project Link */}
      <div>
        <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
          LINK PROYEK (OPSIONAL)
        </label>
        <input
          type="text"
          value={entry.link || ""}
          onChange={(e) => handleFieldChange("link", e.target.value)}
          placeholder="https://github.com/username/project atau link demo"
          className="swiss-input text-xs"
        />
      </div>

      {/* Bullet Points */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-mono text-[11px] uppercase font-bold text-[#0A0A0A]">
            DESKRIPSI PROYEK (BULLETS) *
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
                placeholder="Rincian fitur, arsitektur, atau dampak proyek..."
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

export function ProjectsForm({ sectionId, entries }: ProjectsFormProps) {
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
        className="w-full flex items-center justify-center gap-2 border border-dashed border-[#0A0A0A] p-2.5 bg-[#F4F4F0] font-mono text-xs font-bold text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        TAMBAH PROYEK
      </button>
    </div>
  );
}
