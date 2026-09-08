"use client";

import React, { useState } from "react";
import { useCVStore } from "@/lib/store/useCVStore";
import { SkillGroupEntry } from "@/types/cv";
import { Plus, Trash2, GripVertical, X } from "lucide-react";
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

interface SkillsFormProps {
  sectionId: string;
  entries: SkillGroupEntry[];
}

function SortableSkillGroupItem({
  entry,
  sectionId,
  index,
}: {
  entry: SkillGroupEntry;
  sectionId: string;
  index: number;
}) {
  const { updateEntry, removeEntry } = useCVStore();
  const [skillInput, setSkillInput] = useState("");
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

  const handleGroupNameChange = (name: string) => {
    updateEntry(sectionId, entry.id, { groupName: name });
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = skillInput.trim().replace(/,$/, "");
      if (val && !entry.skills.includes(val)) {
        updateEntry(sectionId, entry.id, {
          skills: [...(entry.skills || []), val],
        });
        setSkillInput("");
      }
    }
  };

  const removeSkillTag = (tagToRemove: string) => {
    updateEntry(sectionId, entry.id, {
      skills: entry.skills.filter((s) => s !== tagToRemove),
    });
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
            title="Tahan & geser untuk mengubah urutan grup"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-[#111111]">
            Kategori #{index + 1}: {entry.groupName || "Kategori Keahlian"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => removeEntry(sectionId, entry.id)}
          className="text-[#8E8C85] hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          title="Hapus grup skill ini"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Group Name */}
      <div>
        <label className="block text-xs font-medium text-[#111111] mb-1.5">
          Nama Kategori / Bidang Keahlian *
        </label>
        <input
          type="text"
          value={entry.groupName}
          onChange={(e) => handleGroupNameChange(e.target.value)}
          placeholder="mis. Bahasa Pemrograman / Framework / Database"
          className="app-input text-xs"
        />
      </div>

      {/* Skills Tags */}
      <div>
        <label className="block text-xs font-medium text-[#111111] mb-1.5">
          Daftar Keahlian (Tekan Enter atau koma setelah mengetik)
        </label>
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleAddSkill}
          placeholder="Ketik keahlian lalu tekan Enter (mis. TypeScript, Node.js)..."
          className="app-input text-xs mb-2.5"
        />

        <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2.5 bg-[#F8F8F6] border border-[#E2E2DC] rounded-lg">
          {entry.skills && entry.skills.length > 0 ? (
            entry.skills.map((skill, sIdx) => (
              <span
                key={sIdx}
                className="inline-flex items-center gap-1.5 bg-[#111111] text-white px-2.5 py-1 rounded-md text-xs font-medium"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkillTag(skill)}
                  className="hover:text-red-300 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-[#8E8C85] italic py-1">
              Belum ada keahlian di kategori ini. Ketik di atas lalu tekan Enter.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function SkillsForm({ sectionId, entries }: SkillsFormProps) {
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
        id={`dnd-skills-${sectionId}`}
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
              <SortableSkillGroupItem
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
        Tambah Kategori Keahlian
      </button>
    </div>
  );
}



