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
  LanguageEntry,
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

// Import individual section form components
import { EducationForm } from "./EducationForm";
import { WorkExperienceForm } from "./WorkExperienceForm";
import { OrganizationForm } from "./OrganizationForm";
import { ProjectsForm } from "./ProjectsForm";
import { SkillsForm } from "./SkillsForm";
import { CertificationForm } from "./CertificationForm";
import { TrainingForm } from "./TrainingForm";
import { AchievementForm } from "./AchievementForm";
import { LanguagesForm } from "./LanguagesForm";

interface SortableSectionCardProps {
  section: CVSection;
  language: "id" | "en";
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function SortableSectionCard({
  section,
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
  const sectionTitle = titles[section.type] || section.type;

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
      case "languages":
        return (
          <LanguagesForm
            sectionId={section.id}
            entries={section.entries as LanguageEntry[]}
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
      className="border border-[#E2E2DC] rounded-xl bg-white shadow-sm overflow-hidden transition-shadow"
    >
      {/* Accordion Bar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-[#E2E2DC]/70 select-none">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-[#9E9E96] hover:text-[#111111] p-1 touch-none select-none"
            style={{ touchAction: "none" }}
            title="Tahan & geser untuk mengubah urutan"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleExpand}
            className="text-left font-bold text-sm text-[#111111] hover:text-[#666660] flex items-center gap-2"
          >
            <span>{sectionTitle}</span>
            <span className="text-xs text-[#9E9E96] font-normal">
              ({section.entries?.length || 0})
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => removeSection(section.id)}
            className="text-[#9E9E96] hover:text-[#E61919] p-1.5 rounded-md hover:bg-[#FDF2F2] transition-colors"
            title="Hapus section ini"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onToggleExpand}
            className="text-[#666660] p-1.5 rounded-md hover:bg-[#F4F4F0] transition-colors"
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
      {isExpanded && <div className="px-4 py-2 bg-white border-t border-[#E2E2DC]/40">{renderFormByType()}</div>}
    </div>
  );
}

export function SectionManager() {
  const { data, language, reorderSections, addSection } = useCVStore();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    [data.sections[0]?.id || ""]: true,
    [data.sections[1]?.id || ""]: true,
  });
  const [showAddMenu, setShowAddMenu] = useState(false);

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
      reorderSections(active.id as string, over.id as string);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const activeTypes = new Set(data.sections.map((s) => s.type));
  const availableToAdd = AVAILABLE_SECTIONS.filter(
    (sec) => !activeTypes.has(sec.type)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-sm font-bold text-[#111111]">
          Bagian Section CV
        </h3>
        <span className="text-xs text-[#666660]">
          {data.sections.length} Bagian
        </span>
      </div>

      {/* Draggable Sections List */}
      <DndContext
        id="dnd-section-manager"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3.5">
            {data.sections.map((section) => (
              <SortableSectionCard
                key={section.id}
                section={section}
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
                className="w-full flex items-center justify-center gap-2 bg-white border border-dashed border-[#D2D2CC] rounded-xl p-3 text-xs font-semibold text-[#111111] hover:bg-[#F5F5F3] hover:border-[#111111] transition-colors"
              >
                <Plus className="w-4 h-4 text-[#666660]" />
                Tambah Section Lain
              </button>
            ) : (
              <div className="border border-[#E2E2DC] rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#E2E2DC]">
                  <span className="text-xs font-bold text-[#111111]">
                    Pilih section yang ingin ditambahkan:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddMenu(false)}
                    className="text-xs text-[#666660] hover:text-[#111111]"
                  >
                    Batal
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
                      className="text-left p-2.5 bg-[#F8F8F6] border border-[#E2E2DC] rounded-lg text-xs font-medium text-[#111111] hover:bg-[#111111] hover:text-white transition-colors flex items-center justify-between"
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
          <p className="text-xs text-center text-[#666660]">
            Semua tipe section telah ditambahkan ke CV.
          </p>
        )}
      </div>
    </div>
  );
}
