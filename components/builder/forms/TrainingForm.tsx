"use client";

import React from "react";
import { useCVStore } from "@/lib/store/useCVStore";
import { TrainingEntry } from "@/types/cv";
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

interface TrainingFormProps {
  sectionId: string;
  entries: TrainingEntry[];
}

function SortableTrainingItem({
  entry,
  sectionId,
  index,
}: {
  entry: TrainingEntry;
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

  const handleFieldChange = (field: keyof TrainingEntry, val: unknown) => {
    updateEntry(sectionId, entry.id, { [field]: val } as Partial<TrainingEntry>);
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
            Pelatihan #{index + 1}: {entry.name || "Nama Pelatihan"}
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

      {/* Name & Organizer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Nama Pelatihan / Bootcamp *
          </label>
          <input
            type="text"
            value={entry.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="mis. Fullstack React & Node.js Intensive"
            className="app-input text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Lembaga Penyelenggara *
          </label>
          <input
            type="text"
            value={entry.organizer}
            onChange={(e) => handleFieldChange("organizer", e.target.value)}
            placeholder="mis. Binar Academy"
            className="app-input text-xs"
          />
        </div>
      </div>

      {/* Date & Link */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Bulan/Tahun Pelaksanaan *
          </label>
          <input
            type="text"
            value={entry.date}
            onChange={(e) => handleFieldChange("date", e.target.value)}
            placeholder="mis. Mar 2024 - Jun 2024"
            className="app-input text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#111111] mb-1.5">
            Link Sertifikat / Silabus (Opsional)
          </label>
          <input
            type="text"
            value={entry.link || ""}
            onChange={(e) => handleFieldChange("link", e.target.value)}
            placeholder="mis. https://binaracademy.com/... atau link sertifikat"
            className="app-input text-xs"
          />
        </div>
      </div>
    </div>
  );
}

export function TrainingForm({ sectionId, entries }: TrainingFormProps) {
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
        id={`dnd-training-${sectionId}`}
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
              <SortableTrainingItem
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
        Tambah Pelatihan
      </button>
    </div>
  );
}



