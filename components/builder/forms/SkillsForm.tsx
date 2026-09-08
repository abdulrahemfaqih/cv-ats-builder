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
            title="Tahan & geser untuk mengubah urutan grup"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs font-bold text-[#0A0A0A]">
            [ GRUP #{index + 1} ] {entry.groupName || "Kategori Skill"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => removeEntry(sectionId, entry.id)}
          className="text-[#5C5A54] hover:text-[#E61919] p-1 transition-colors"
          title="Hapus grup skill ini"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Group Name */}
      <div>
        <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
          NAMA GRUP / KATEGORI *
        </label>
        <input
          type="text"
          value={entry.groupName}
          onChange={(e) => handleGroupNameChange(e.target.value)}
          placeholder="mis. Bahasa Pemrograman / Framework / Database"
          className="swiss-input text-xs"
        />
      </div>

      {/* Skills Tags */}
      <div>
        <label className="block font-mono text-[11px] uppercase font-bold text-[#0A0A0A] mb-1">
          DAFTAR KEAHLIAN (TEKAN ENTER ATAU KOMA SETELAH KETIK)
        </label>
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleAddSkill}
          placeholder="Ketik nama skill lalu tekan Enter (mis. TypeScript)..."
          className="swiss-input text-xs mb-2"
        />

        <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-[#F4F4F0] border border-[#0A0A0A]">
          {entry.skills && entry.skills.length > 0 ? (
            entry.skills.map((skill, sIdx) => (
              <span
                key={sIdx}
                className="inline-flex items-center gap-1.5 bg-[#0A0A0A] text-white px-2 py-1 font-mono text-[11px]"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkillTag(skill)}
                  className="hover:text-[#E61919] transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="font-mono text-[10px] text-[#5C5A54] italic">
              Belum ada item dalam grup ini. Ketik di atas lalu tekan Enter.
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
        className="w-full flex items-center justify-center gap-2 border border-dashed border-[#0A0A0A] p-2.5 bg-[#F4F4F0] font-mono text-xs font-bold text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        TAMBAH GRUP KEAHLIAN
      </button>
    </div>
  );
}
