"use client";

import React, { useState, useEffect } from "react";
import { useCVStore } from "@/lib/store/useCVStore";
import { EducationEntry } from "@/types/cv";
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

  const [coursesInput, setCoursesInput] = useState(() =>
    Array.isArray(entry.relevantCourses)
      ? entry.relevantCourses.join(", ")
      : entry.relevantCourses || ""
  );

  useEffect(() => {
    const formatted = Array.isArray(entry.relevantCourses)
      ? entry.relevantCourses.join(", ")
      : entry.relevantCourses || "";
    const currentList = coursesInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    const newList = Array.isArray(entry.relevantCourses)
      ? entry.relevantCourses
      : [];
    if (
      JSON.stringify(currentList) !== JSON.stringify(newList) &&
      !coursesInput.endsWith(",")
    ) {
      setCoursesInput(formatted);
    }
  }, [entry.relevantCourses]);

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
            className="cursor-grab active:cursor-grabbing text-[#9E9E96] hover:text-[#111111] p-0.5 touch-none select-none"
            style={{ touchAction: "none" }}
            title="Tahan & geser untuk mengubah urutan"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-[#111111]">
            Pendidikan #{index + 1}{entry.institution ? `: ${entry.institution}` : ""}
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

      {/* Degree & Institution */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-[#111111] mb-1">
            Jenjang *
          </label>
          <select
            value={entry.level}
            onChange={(e) => handleFieldChange("level", e.target.value)}
            className="app-input text-xs"
          >
            <option value="SMA/SMK">SMA/SMK</option>
            <option value="D3">D3</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-semibold text-[#111111] mb-1">
            Nama Universitas / Institusi *
          </label>
          <input
            type="text"
            value={entry.institution}
            onChange={(e) => handleFieldChange("institution", e.target.value)}
            placeholder="mis. Universitas Indonesia"
            className="app-input text-xs"
          />
        </div>
      </div>

      {/* Major & GPA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-semibold text-[#111111] mb-1">
            Program Studi / Jurusan *
          </label>
          <input
            type="text"
            value={entry.major}
            onChange={(e) => handleFieldChange("major", e.target.value)}
            placeholder="mis. Teknik Informatika"
            className="app-input text-xs"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#111111] mb-1">
            IPK / Nilai *
          </label>
          <input
            type="text"
            value={entry.gpa}
            onChange={(e) => handleFieldChange("gpa", e.target.value)}
            placeholder="mis. 3.75"
            className="app-input text-xs"
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
            placeholder="mis. Depok"
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
            placeholder="mis. Jawa Barat"
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

      {/* Years */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-[#111111] mb-1">
            Tahun Mulai *
          </label>
          <input
            type="text"
            value={entry.startYear}
            onChange={(e) => handleFieldChange("startYear", e.target.value)}
            placeholder="mis. 2020"
            className="app-input text-xs"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-[#111111] mb-1">
            Tahun Selesai *
          </label>
          <input
            type="text"
            value={entry.endYear}
            onChange={(e) => handleFieldChange("endYear", e.target.value)}
            placeholder="mis. 2024 atau Sekarang"
            className="app-input text-xs"
          />
        </div>
      </div>

      {/* Relevant Courses */}
      <div>
        <label className="block text-[11px] font-semibold text-[#111111] mb-1">
          Mata Kuliah Relevan (Dipisah koma)
        </label>
        <input
          type="text"
          value={coursesInput}
          onChange={(e) => {
            const val = e.target.value;
            setCoursesInput(val);
            const list = val
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean);
            handleFieldChange("relevantCourses", list);
          }}
          onBlur={() => {
            const list = coursesInput
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean);
            setCoursesInput(list.join(", "));
          }}
          placeholder="mis. Algoritma & Pemrograman, Struktur Data, Basis Data"
          className="app-input text-xs"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-[11px] font-semibold text-[#111111] mb-1">
          Deskripsi Tambahan (Opsional)
        </label>
        <input
          type="text"
          value={entry.description || ""}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          placeholder="mis. Fokus riset sistem perangkat lunak terdistribusi"
          className="app-input text-xs"
        />
      </div>
    </div>
  );
}

export function EducationForm({ sectionId, entries }: EducationFormProps) {
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
        id={`dnd-education-${sectionId}`}
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
        className="w-full flex items-center justify-center gap-1.5 border border-dashed border-[#D2D2CC] rounded-lg p-2.5 bg-[#F8F8F6] text-xs font-semibold text-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Tambah Pendidikan
      </button>
    </div>
  );
}



