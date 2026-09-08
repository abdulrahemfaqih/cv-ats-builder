export type SectionType =
  | "education"
  | "work"
  | "organization"
  | "project"
  | "skills"
  | "certification"
  | "training"
  | "achievement";

export interface AddressInfo {
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
}

export interface CVHeader {
  name: string;
  useProfilePhoto: boolean;
  photoUrl?: string;
  address: AddressInfo;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
}

export interface EducationEntry {
  id: string;
  level: string; // SMA/SMK, D3, S1, S2, S3
  institution: string;
  location: {
    kabupaten: string;
    provinsi: string;
    country?: string;
  };
  major: string;
  gpa: string;
  startYear: string;
  endYear: string;
  relevantCourses?: string[];
  description?: string;
}

export interface WorkEntry {
  id: string;
  company: string;
  location: {
    kabupaten: string;
    provinsi: string;
    country?: string;
  };
  position: string;
  employmentType?: string; // e.g. "Intern", "Full-time", "Paruh Waktu"
  startDate: string; // e.g. "Agu 2022" or "08/2022"
  endDate: string; // e.g. "Des 2024" or "Sekarang"
  isCurrent?: boolean;
  bullets: string[];
}

export interface OrganizationEntry {
  id: string;
  organization: string;
  location: {
    kabupaten: string;
    provinsi: string;
    country?: string;
  };
  position: string;
  roleType?: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  bullets: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  link?: string;
  year: string;
  bullets: string[];
}

export interface SkillGroupEntry {
  id: string;
  groupName: string; // e.g. "Bahasa Pemrograman", "Framework & Library"
  skills: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  isLifetime?: boolean;
}

export interface TrainingEntry {
  id: string;
  name: string;
  organizer: string;
  date: string;
}

export interface AchievementEntry {
  id: string;
  name: string;
  context?: string;
  date: string;
  description?: string;
}

export type CVEntry =
  | EducationEntry
  | WorkEntry
  | OrganizationEntry
  | ProjectEntry
  | SkillGroupEntry
  | CertificationEntry
  | TrainingEntry
  | AchievementEntry;

export interface CVSection {
  id: string;
  type: SectionType;
  order: number;
  entries: CVEntry[];
}

export interface CVData {
  header: CVHeader;
  overview: string;
  sections: CVSection[];
}

export interface CVDocument {
  id: string;
  user_id: string;
  title: string;
  language: "id" | "en";
  data: CVData;
  created_at: string;
  updated_at: string;
}
