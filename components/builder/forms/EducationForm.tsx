"use client";

import React from "react";
import { useCVStore } from "@/lib/store/useCVStore";
import { EducationEntry } from "@/types/cv";
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

interface EducationFormProps {
  sectionId: string;
  entries: EducationEntry[];
}

function SortableEducationItem({
  entry,
  sectionId,
  index,
}: {
  entry: EducationEntry;
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

  const handleFieldChange = (field: keyof EducationEntry, val: unknown) => {
    updateEntry(sectionId, entry.id, { [field]: val } as Partial<EducationEntry>);
  };

  const handleLocationChange = (field: string, val: string) => {
    updateEntry(sectionId, entry.id, {
      location: {
        ...entry.location,
        [field]: val,
      },
    });
  };

  const coursesString = Array.isArray(entry.relevantCourses)
    ? entry.relevantCourses.join(", ")
    : entry.relevantCourses || "";

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
            [ ENTRI #{index + 1} ] {entry.institution || "Nama Institusi"}
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

      {/* Degree & Institution */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            JENJANG *
          </label>
          <select
            value={entry.level}
            onChange={(e) => handleFieldChange("level", e.target.value)}
            className="swiss-input text-xs"
          >
            <option value="SMA/SMK">SMA/SMK</option>
            <option value="D3">D3</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            NAMA UNIVERSITAS / INSTITUSI *
          </label>
          <input
            type="text"
            value={entry.institution}
            onChange={(e) => handleFieldChange("institution", e.target.value)}
            placeholder="mis. Universitas Trunojoyo Madura"
            className="swiss-input text-xs"
          />
        </div>
      </div>

      {/* Major & GPA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            PROGRAM STUDI / JURUSAN *
          </label>
          <input
            type="text"
            value={entry.major}
            onChange={(e) => handleFieldChange("major", e.target.value)}
            placeholder="mis. Teknik Informatika"
            className="swiss-input text-xs"
          />
        </div>
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            IPK / NILAI *
          </label>
          <input
            type="text"
            value={entry.gpa}
            onChange={(e) => handleFieldChange("gpa", e.target.value)}
            placeholder="mis. 3.87"
            className="swiss-input text-xs"
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
            placeholder="mis. Bangkalan"
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

      {/* Years */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            TAHUN MULAI *
          </label>
          <input
            type="text"
            value={entry.startYear}
            onChange={(e) => handleFieldChange("startYear", e.target.value)}
            placeholder="mis. 2022"
            className="swiss-input text-xs"
          />
        </div>
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
            TAHUN SELESAI *
          </label>
          <input
            type="text"
            value={entry.endYear}
            onChange={(e) => handleFieldChange("endYear", e.target.value)}
            placeholder="mis. 2026 atau Sekarang"
            className="swiss-input text-xs"
          />
        </div>
      </div>

      {/* Relevant Courses */}
      <div>
        <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
          MATA KULIAH RELEVAN (DIPISAH KOMA)
        </label>
        <input
          type="text"
          value={coursesString}
          onChange={(e) => {
            const list = e.target.value
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean);
            handleFieldChange("relevantCourses", list);
          }}
          placeholder="mis. Algoritma & Pemrograman, Struktur Data, Basis Data"
          className="swiss-input text-xs"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
          DESKRIPSI SINGKAT (OPSIONAL)
        </label>
        <input
          type="text"
          value={entry.description || ""}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          placeholder="mis. Lulus dengan predikat Cumlaude, fokus riset sistem terdistribusi"
          className="swiss-input text-xs"
        />
      </div>
    </div>
  );
}

export function EducationForm({ sectionId, entries }: EducationFormProps) {
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
              <SortableEducationItem
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
        TAMBAH PENDIDIKAN
      </button>
    </div>
  );
}
