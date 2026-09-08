"use client";

import React, { useState } from "react";
import { useCVStore } from "@/lib/store/useCVStore";
import {
  CVSection,
  EducationEntry,
  WorkEntry,
  OrganizationEntry,
  ProjectEntry,
  SkillGroupEntry,
  CertificationEntry,
  TrainingEntry,
  AchievementEntry,
} from "@/types/cv";
import { AVAILABLE_SECTIONS, SECTION_TITLES } from "@/lib/constants/defaultCV";
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
} from "lucide-react";
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

// Import individual section form components
import { EducationForm } from "./EducationForm";
import { WorkExperienceForm } from "./WorkExperienceForm";
import { OrganizationForm } from "./OrganizationForm";
import { ProjectsForm } from "./ProjectsForm";
import { SkillsForm } from "./SkillsForm";
import { CertificationForm } from "./CertificationForm";
import { TrainingForm } from "./TrainingForm";
import { AchievementForm } from "./AchievementForm";

interface SortableSectionCardProps {
  section: CVSection;
  index: number;
  language: "id" | "en";
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function SortableSectionCard({
  section,
  index,
  language,
  isExpanded,
  onToggleExpand,
}: SortableSectionCardProps) {
  const { removeSection } = useCVStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const titles = SECTION_TITLES[language] || SECTION_TITLES.id;
  const sectionTitle = titles[section.type] || section.type.toUpperCase();
  const formattedIndex = String(index + 1).padStart(2, "0");

  const renderFormByType = () => {
    switch (section.type) {
      case "education":
        return (
          <EducationForm
            sectionId={section.id}
            entries={section.entries as EducationEntry[]}
          />
        );
      case "work":
        return (
          <WorkExperienceForm
            sectionId={section.id}
            entries={section.entries as WorkEntry[]}
          />
        );
      case "organization":
        return (
          <OrganizationForm
            sectionId={section.id}
            entries={section.entries as OrganizationEntry[]}
          />
        );
      case "project":
        return (
          <ProjectsForm
            sectionId={section.id}
            entries={section.entries as ProjectEntry[]}
          />
        );
      case "skills":
        return (
          <SkillsForm
            sectionId={section.id}
            entries={section.entries as SkillGroupEntry[]}
          />
        );
      case "certification":
        return (
          <CertificationForm
            sectionId={section.id}
            entries={section.entries as CertificationEntry[]}
          />
        );
      case "training":
        return (
          <TrainingForm
            sectionId={section.id}
            entries={section.entries as TrainingEntry[]}
          />
        );
      case "achievement":
        return (
          <AchievementForm
            sectionId={section.id}
            entries={section.entries as AchievementEntry[]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-2 border-[#0A0A0A] bg-[#EAE8E3] overflow-hidden"
    >
      {/* Technical Accordion Bar */}
      <div className="flex items-center justify-between p-3 bg-[#EAE8E3] border-b border-[#0A0A0A] select-none">
        <div className="flex items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-[#5C5A54] hover:text-[#0A0A0A] p-1"
            title="Tahan & geser untuk mengubah urutan section ini"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleExpand}
            className="text-left font-mono text-xs font-bold tracking-wider text-[#0A0A0A] hover:text-[#5C5A54] flex items-center gap-2"
          >
            <span>{`[ ${formattedIndex} // ${sectionTitle} ]`}</span>
            <span className="text-[10px] text-[#5C5A54] font-normal">
              ({section.entries?.length || 0} entri)
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => removeSection(section.id)}
            className="text-[#5C5A54] hover:text-[#E61919] p-1.5 transition-colors"
            title="Hapus section ini dari CV"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onToggleExpand}
            className="text-[#0A0A0A] p-1.5 hover:bg-[#F4F4F0] transition-colors"
            title={isExpanded ? "Tutup panel" : "Buka panel"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Form Content */}
      {isExpanded && <div className="p-4 bg-[#F4F4F0]">{renderFormByType()}</div>}
    </div>
  );
}

export function SectionManager() {
  const { data, language, reorderSections, addSection } = useCVStore();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    // Keep first 2 sections open by default
    [data.sections[0]?.id || ""]: true,
    [data.sections[1]?.id || ""]: true,
  });
  const [showAddMenu, setShowAddMenu] = useState(false);

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
      reorderSections(active.id as string, over.id as string);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Find sections not yet in the CV
  const activeTypes = new Set(data.sections.map((s) => s.type));
  const availableToAdd = AVAILABLE_SECTIONS.filter(
    (sec) => !activeTypes.has(sec.type)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#0A0A0A] pb-2">
        <span className="font-mono text-xs uppercase font-bold text-[#0A0A0A]">
          STRUKTUR & URUTAN SECTION CV
        </span>
        <span className="font-mono text-[10px] text-[#5C5A54]">
          {data.sections.length} AKTIF
        </span>
      </div>

      {/* Draggable Sections List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {data.sections.map((section, index) => (
              <SortableSectionCard
                key={section.id}
                section={section}
                index={index}
                language={language}
                isExpanded={Boolean(expandedSections[section.id])}
                onToggleExpand={() => toggleExpand(section.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add New Section Button / Selector */}
      <div className="pt-2">
        {availableToAdd.length > 0 ? (
          <div>
            {!showAddMenu ? (
              <button
                type="button"
                onClick={() => setShowAddMenu(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#EAE8E3] border-2 border-dashed border-[#0A0A0A] p-3 font-mono text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                + TAMBAH SECTION LAIN
              </button>
            ) : (
              <div className="border-2 border-[#0A0A0A] bg-white p-4">
                <div className="flex items-center justify-between border-b border-[#0A0A0A] pb-2 mb-3">
                  <span className="font-mono text-xs font-bold uppercase text-[#0A0A0A]">
                    PILIH SECTION YANG INGIN DITAMBAHKAN:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddMenu(false)}
                    className="font-mono text-[11px] text-[#5C5A54] hover:text-[#0A0A0A] underline"
                  >
                    TUTUP
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableToAdd.map((sec) => (
                    <button
                      key={sec.type}
                      type="button"
                      onClick={() => {
                        addSection(sec.type);
                        setShowAddMenu(false);
                      }}
                      className="text-left p-2.5 bg-[#F4F4F0] border border-[#0A0A0A] font-mono text-xs font-semibold text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span>
                        + {language === "en" ? sec.labelEn : sec.labelId}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="font-mono text-[11px] text-center text-[#5C5A54]">
            Semua tipe section telah ditambahkan ke CV.
          </p>
        )}
      </div>
    </div>
  );
}
