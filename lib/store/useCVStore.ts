import { create } from "zustand";
import {
  CVData,
  CVDocument,
  CVEntry,
  CVHeader,
  CVSection,
  SectionType,
  EducationEntry,
  WorkEntry,
  OrganizationEntry,
  ProjectEntry,
  SkillGroupEntry,
  CertificationEntry,
  TrainingEntry,
  AchievementEntry,
} from "@/types/cv";
import {
  INITIAL_CV_DATA_ID,
  INITIAL_CV_DATA_EN,
  BLANK_CV_DATA_ID,
  BLANK_CV_DATA_EN,
} from "@/lib/constants/defaultCV";

const LOCAL_STORAGE_KEY = "cevio_guest_cv_draft";

interface CVStoreState {
  documentId: string | null;
  title: string;
  language: "id" | "en";
  data: CVData;
  isDirty: boolean;
  lastSavedAt: string | null;
  isSaving: boolean;

  // Actions
  setTitle: (title: string) => void;
  setLanguage: (lang: "id" | "en") => void;
  updateHeader: (fields: Partial<CVHeader>) => void;
  updateOverview: (overview: string) => void;
  addSection: (type: SectionType) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  addEntry: (sectionId: string, defaultEntry?: Partial<CVEntry>) => void;
  updateEntry: (
    sectionId: string,
    entryId: string,
    entryData: Partial<CVEntry>
  ) => void;
  removeEntry: (sectionId: string, entryId: string) => void;
  reorderEntries: (sectionId: string, activeId: string, overId: string) => void;
  resetToDefault: (lang?: "id" | "en") => void;
  resetToBlank: (lang?: "id" | "en") => void;
  loadDocument: (doc: CVDocument) => void;
  markSaved: (id?: string) => void;
  setSaving: (saving: boolean) => void;
  hydrateFromLocalStorage: () => boolean;
  clearLocalStorage: () => void;
}

const saveDraftToStorage = (state: {
  title: string;
  language: "id" | "en";
  data: CVData;
}) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save draft to localStorage:", e);
  }
};

export const useCVStore = create<CVStoreState>((set, get) => ({
  documentId: null,
  title: "Untitled CV",
  language: "id",
  data: INITIAL_CV_DATA_ID,
  isDirty: false,
  lastSavedAt: null,
  isSaving: false,

  setTitle: (title) => {
    set({ title, isDirty: true });
    saveDraftToStorage({
      title,
      language: get().language,
      data: get().data,
    });
  },

  setLanguage: (language) => {
    set({ language, isDirty: true });
    saveDraftToStorage({
      title: get().title,
      language,
      data: get().data,
    });
  },

  updateHeader: (fields) => {
    set((state) => {
      const updatedData: CVData = {
        ...state.data,
        header: {
          ...state.data.header,
          ...fields,
        },
      };
      saveDraftToStorage({
        title: state.title,
        language: state.language,
        data: updatedData,
      });
      return { data: updatedData, isDirty: true };
    });
  },

  updateOverview: (overview) => {
    set((state) => {
      const updatedData: CVData = {
        ...state.data,
        overview,
      };
      saveDraftToStorage({
        title: state.title,
        language: state.language,
        data: updatedData,
      });
      return { data: updatedData, isDirty: true };
    });
  },

  addSection: (type) => {
    set((state) => {
      // Check if section with same type already exists
      const existing = state.data.sections.find((s) => s.type === type);
      if (existing) return state;

      const newSectionId = `sec_${Date.now()}`;
      const newSection: CVSection = {
        id: newSectionId,
        type,
        order: state.data.sections.length,
        entries: [],
      };

      const updatedSections = [...state.data.sections, newSection];
      const updatedData: CVData = {
        ...state.data,
        sections: updatedSections,
      };

      saveDraftToStorage({
        title: state.title,
        language: state.language,
        data: updatedData,
      });
      return { data: updatedData, isDirty: true };
    });
  },

  removeSection: (sectionId) => {
    set((state) => {
      const updatedSections = state.data.sections
        .filter((s) => s.id !== sectionId)
        .map((s, idx) => ({ ...s, order: idx }));

      const updatedData: CVData = {
        ...state.data,
        sections: updatedSections,
      };

      saveDraftToStorage({
        title: state.title,
        language: state.language,
        data: updatedData,
      });
      return { data: updatedData, isDirty: true };
    });
  },

  reorderSections: (activeId, overId) => {
    set((state) => {
      const sections = [...state.data.sections];
      const oldIndex = sections.findIndex((s) => s.id === activeId);
      const newIndex = sections.findIndex((s) => s.id === overId);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return state;
      }

      const [moved] = sections.splice(oldIndex, 1);
      sections.splice(newIndex, 0, moved);

      const reordered = sections.map((s, idx) => ({ ...s, order: idx }));
      const updatedData: CVData = {
        ...state.data,
        sections: reordered,
      };

      saveDraftToStorage({
        title: state.title,
        language: state.language,
        data: updatedData,
      });
      return { data: updatedData, isDirty: true };
    });
  },

  addEntry: (sectionId, defaultEntry) => {
    set((state) => {
      const section = state.data.sections.find((s) => s.id === sectionId);
      if (!section) return state;

      const newEntryId = `entry_${Date.now()}`;
      let createdEntry: CVEntry;

      switch (section.type) {
        case "education":
          createdEntry = {
            id: newEntryId,
            level: "S1",
            institution: "",
            location: { kabupaten: "", provinsi: "", country: "" },
            major: "",
            gpa: "",
            startYear: "",
            endYear: "",
            relevantCourses: [],
            description: "",
            ...(defaultEntry as Partial<EducationEntry>),
          };
          break;
        case "work":
          createdEntry = {
            id: newEntryId,
            company: "",
            location: { kabupaten: "", provinsi: "", country: "" },
            position: "",
            employmentType: "",
            startDate: "",
            endDate: "",
            isCurrent: false,
            bullets: [""],
            ...(defaultEntry as Partial<WorkEntry>),
          };
          break;
        case "organization":
          createdEntry = {
            id: newEntryId,
            organization: "",
            location: { kabupaten: "", provinsi: "", country: "" },
            position: "",
            roleType: "",
            startDate: "",
            endDate: "",
            isCurrent: false,
            bullets: [""],
            ...(defaultEntry as Partial<OrganizationEntry>),
          };
          break;
        case "project":
          createdEntry = {
            id: newEntryId,
            name: "",
            link: "",
            year: "",
            bullets: [""],
            ...(defaultEntry as Partial<ProjectEntry>),
          };
          break;
        case "skills":
          createdEntry = {
            id: newEntryId,
            groupName: "Keahlian Baru",
            skills: [],
            ...(defaultEntry as Partial<SkillGroupEntry>),
          };
          break;
        case "certification":
          createdEntry = {
            id: newEntryId,
            name: "",
            issuer: "",
            issueDate: "",
            expiryDate: "",
            isLifetime: false,
            ...(defaultEntry as Partial<CertificationEntry>),
          };
          break;
        case "training":
          createdEntry = {
            id: newEntryId,
            name: "",
            organizer: "",
            date: "",
            ...(defaultEntry as Partial<TrainingEntry>),
          };
          break;
        case "achievement":
          createdEntry = {
            id: newEntryId,
            name: "",
            context: "",
            date: "",
            description: "",
            ...(defaultEntry as Partial<AchievementEntry>),
          };
          break;
      }

      const updatedSections = state.data.sections.map((s) => {
        if (s.id === sectionId) {
          return {
            ...s,
            entries: [...s.entries, createdEntry],
          };
        }
        return s;
      });

      const updatedData: CVData = {
        ...state.data,
        sections: updatedSections,
      };

      saveDraftToStorage({
        title: state.title,
        language: state.language,
        data: updatedData,
      });
      return { data: updatedData, isDirty: true };
    });
  },

  updateEntry: (sectionId, entryId, entryData) => {
    set((state) => {
      const updatedSections = state.data.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const updatedEntries = sec.entries.map((entry) => {
          if (entry.id !== entryId) return entry;
          return {
            ...entry,
            ...entryData,
          } as CVEntry;
        });
        return {
          ...sec,
          entries: updatedEntries,
        };
      });

      const updatedData: CVData = {
        ...state.data,
        sections: updatedSections,
      };

      saveDraftToStorage({
        title: state.title,
        language: state.language,
        data: updatedData,
      });
      return { data: updatedData, isDirty: true };
    });
  },

  removeEntry: (sectionId, entryId) => {
    set((state) => {
      const updatedSections = state.data.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          entries: sec.entries.filter((entry) => entry.id !== entryId),
        };
      });

      const updatedData: CVData = {
        ...state.data,
        sections: updatedSections,
      };

      saveDraftToStorage({
        title: state.title,
        language: state.language,
        data: updatedData,
      });
      return { data: updatedData, isDirty: true };
    });
  },

  reorderEntries: (sectionId, activeId, overId) => {
    set((state) => {
      const updatedSections = state.data.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const entries = [...sec.entries];
        const oldIndex = entries.findIndex((e) => e.id === activeId);
        const newIndex = entries.findIndex((e) => e.id === overId);
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
          return sec;
        }
        const [moved] = entries.splice(oldIndex, 1);
        entries.splice(newIndex, 0, moved);
        return {
          ...sec,
          entries,
        };
      });

      const updatedData: CVData = {
        ...state.data,
        sections: updatedSections,
      };

      saveDraftToStorage({
        title: state.title,
        language: state.language,
        data: updatedData,
      });
      return { data: updatedData, isDirty: true };
    });
  },

  resetToDefault: (lang = "id") => {
    const data = lang === "id" ? INITIAL_CV_DATA_ID : INITIAL_CV_DATA_EN;
    set({
      language: lang,
      data,
      isDirty: false,
    });
    saveDraftToStorage({
      title: get().title,
      language: lang,
      data,
    });
  },

  resetToBlank: (lang = "id") => {
    const data = lang === "id" ? BLANK_CV_DATA_ID : BLANK_CV_DATA_EN;
    set({
      language: lang,
      data,
      isDirty: false,
    });
    saveDraftToStorage({
      title: get().title,
      language: lang,
      data,
    });
  },

  loadDocument: (doc) => {
    set({
      documentId: doc.id,
      title: doc.title,
      language: doc.language,
      data: doc.data,
      isDirty: false,
      lastSavedAt: doc.updated_at,
    });
    saveDraftToStorage({
      title: doc.title,
      language: doc.language,
      data: doc.data,
    });
  },

  markSaved: (id) => {
    set((state) => ({
      documentId: id || state.documentId,
      isDirty: false,
      lastSavedAt: new Date().toISOString(),
      isSaving: false,
    }));
  },

  setSaving: (isSaving) => {
    set({ isSaving });
  },

  hydrateFromLocalStorage: () => {
    if (typeof window === "undefined") return false;
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.data) {
        set({
          title: parsed.title || "Untitled CV",
          language: parsed.language || "id",
          data: parsed.data,
          isDirty: false,
        });
        return true;
      }
    } catch (e) {
      console.error("Failed to hydrate draft from localStorage:", e);
    }
    return false;
  },

  clearLocalStorage: () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear draft from localStorage:", e);
    }
  },
}));
