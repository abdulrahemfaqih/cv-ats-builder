import { CVData, SectionType } from "@/types/cv";

export interface SectionMeta {
  type: SectionType;
  labelId: string;
  labelEn: string;
}

export const AVAILABLE_SECTIONS: SectionMeta[] = [
  { type: "education", labelId: "Pendidikan", labelEn: "Education" },
  { type: "work", labelId: "Pengalaman Kerja", labelEn: "Work Experience" },
  {
    type: "organization",
    labelId: "Pengalaman Organisasi",
    labelEn: "Organizational Experience",
  },
  { type: "project", labelId: "Proyek", labelEn: "Projects" },
  { type: "skills", labelId: "Keterampilan", labelEn: "Skills" },
  {
    type: "certification",
    labelId: "Sertifikasi",
    labelEn: "Certifications",
  },
  { type: "training", labelId: "Pelatihan", labelEn: "Training" },
  { type: "achievement", labelId: "Pencapaian", labelEn: "Achievements" },
];

export const SECTION_TITLES: Record<
  "id" | "en",
  Record<SectionType, string>
> = {
  id: {
    education: "PENDIDIKAN",
    work: "PENGALAMAN KERJA",
    organization: "PENGALAMAN ORGANISASI",
    project: "PROYEK",
    skills: "KETERAMPILAN",
    certification: "SERTIFIKASI",
    training: "PELATIHAN",
    achievement: "PENCAPAIAN",
  },
  en: {
    education: "EDUCATION",
    work: "WORK EXPERIENCE",
    organization: "ORGANIZATIONAL EXPERIENCE",
    project: "PROJECTS",
    skills: "SKILLS",
    certification: "CERTIFICATIONS",
    training: "TRAINING",
    achievement: "ACHIEVEMENTS",
  },
};

export const INITIAL_CV_DATA_ID: CVData = {
  header: {
    name: "Abdul Rahem Faqih",
    useProfilePhoto: false,
    address: {
      kecamatan: "Kamal",
      kabupaten: "Bangkalan",
      provinsi: "Jawa Timur",
    },
    email: "faqih3935@gmail.com",
    phone: "089531419612",
    linkedin: "https://linkedin.com/in/rhmfaqih",
    portfolio: "https://abdulrahemfaqih.vercel.app",
  },
  overview:
    "Lulusan S1 Teknik Informatika yang berfokus pada pengembangan web fullstack modern dan rekayasa perangkat lunak. Memiliki pengalaman dalam merancang arsitektur aplikasi berbasis TypeScript, Next.js, dan cloud backend yang scalable dengan performa optimal.",
  sections: [
    {
      id: "sec_edu",
      type: "education",
      order: 0,
      entries: [
        {
          id: "entry_edu_1",
          level: "S1",
          institution: "Universitas Trunojoyo Madura",
          location: {
            kabupaten: "Bangkalan",
            provinsi: "Jawa Timur",
            country: "",
          },
          major: "Teknik Informatika",
          gpa: "3.87",
          startYear: "2022",
          endYear: "2026",
          relevantCourses: [
            "Algoritma & Pemrograman",
            "Struktur Data",
            "Basis Data Terdistribusi",
            "Rekayasa Perangkat Lunak",
          ],
          description:
            "Aktif dalam laboratorium rekayasa perangkat lunak dan riset web modern.",
        },
      ],
    },
    {
      id: "sec_work",
      type: "work",
      order: 1,
      entries: [
        {
          id: "entry_work_1",
          company: "Tech Kreasi Nusantara",
          location: {
            kabupaten: "Surabaya",
            provinsi: "Jawa Timur",
            country: "",
          },
          position: "Fullstack Web Developer",
          employmentType: "Intern",
          startDate: "Agu 2024",
          endDate: "Jan 2025",
          isCurrent: false,
          bullets: [
            "Mengembangkan microservice manajemen inventori internal menggunakan Next.js dan Supabase dengan query latency di bawah 120ms.",
            "Mengintegrasikan automasi CI/CD workflow dengan GitHub Actions untuk deployment preview otomatis.",
            "Mengoptimalkan performa halaman dashboard dengan teknik server caching sehingga meningkatkan skor Lighthouse hingga 96%.",
          ],
        },
      ],
    },
    {
      id: "sec_project",
      type: "project",
      order: 2,
      entries: [
        {
          id: "entry_proj_1",
          name: "Cevio — ATS-Friendly CV Generator",
          link: "https://cevio.app",
          year: "2025",
          bullets: [
            "Membangun generator CV berbasis web interaktif dengan live preview real-time dan output PDF selectable teks murni ATS-safe.",
            "Menerapkan state management terisolasi dengan Zustand dan visual builder drag-and-drop menggunakan dnd-kit.",
          ],
        },
      ],
    },
    {
      id: "sec_skills",
      type: "skills",
      order: 3,
      entries: [
        {
          id: "entry_skill_1",
          groupName: "Bahasa Pemrograman",
          skills: ["TypeScript", "JavaScript", "SQL", "HTML5", "CSS3", "PHP"],
        },
        {
          id: "entry_skill_2",
          groupName: "Framework & Library",
          skills: [
            "Next.js",
            "React",
            "Tailwind CSS",
            "Node.js",
            "Express",
            "Zustand",
          ],
        },
        {
          id: "entry_skill_3",
          groupName: "Database & Tools",
          skills: ["PostgreSQL", "Supabase", "Git", "GitHub", "Docker", "Postman"],
        },
      ],
    },
  ],
};

export const INITIAL_CV_DATA_EN: CVData = {
  header: {
    name: "Abdul Rahem Faqih",
    useProfilePhoto: false,
    address: {
      kecamatan: "Kamal District",
      kabupaten: "Bangkalan Regency",
      provinsi: "East Java",
    },
    email: "faqih3935@gmail.com",
    phone: "+62 895 3141 9612",
    linkedin: "https://linkedin.com/in/rhmfaqih",
    portfolio: "https://abdulrahemfaqih.vercel.app",
  },
  overview:
    "Bachelor of Informatics graduate specializing in modern fullstack web engineering and scalable cloud software systems. Experienced in architecting production web apps using TypeScript, Next.js, and cloud backends with optimal performance.",
  sections: [
    {
      id: "sec_edu",
      type: "education",
      order: 0,
      entries: [
        {
          id: "entry_edu_1",
          level: "Bachelor's Degree",
          institution: "University of Trunojoyo Madura",
          location: {
            kabupaten: "Bangkalan",
            provinsi: "East Java",
            country: "Indonesia",
          },
          major: "Informatics Engineering",
          gpa: "3.87 / 4.00",
          startYear: "2022",
          endYear: "2026",
          relevantCourses: [
            "Algorithms & Programming",
            "Data Structures",
            "Distributed Databases",
            "Software Engineering",
          ],
          description:
            "Active researcher in software engineering laboratory and modern web architectures.",
        },
      ],
    },
    {
      id: "sec_work",
      type: "work",
      order: 1,
      entries: [
        {
          id: "entry_work_1",
          company: "Tech Kreasi Nusantara",
          location: {
            kabupaten: "Surabaya",
            provinsi: "East Java",
            country: "Indonesia",
          },
          position: "Fullstack Web Developer",
          employmentType: "Intern",
          startDate: "Aug 2024",
          endDate: "Jan 2025",
          isCurrent: false,
          bullets: [
            "Engineered internal inventory management services with Next.js and Supabase, achieving under 120ms database response times.",
            "Configured CI/CD deployment automation pipelines with GitHub Actions for immediate preview environments.",
            "Optimized client dashboard render performance, lifting overall Google Lighthouse audit score to 96%.",
          ],
        },
      ],
    },
    {
      id: "sec_project",
      type: "project",
      order: 2,
      entries: [
        {
          id: "entry_proj_1",
          name: "Cevio — ATS-Friendly CV Generator",
          link: "https://cevio.app",
          year: "2025",
          bullets: [
            "Engineered interactive browser-based CV builder with real-time preview and ATS-compliant selectable PDF output.",
            "Implemented decoupled form state using Zustand and responsive drag-and-drop reorganization via dnd-kit.",
          ],
        },
      ],
    },
    {
      id: "sec_skills",
      type: "skills",
      order: 3,
      entries: [
        {
          id: "entry_skill_1",
          groupName: "Programming Languages",
          skills: ["TypeScript", "JavaScript", "SQL", "HTML5", "CSS3", "PHP"],
        },
        {
          id: "entry_skill_2",
          groupName: "Frameworks & Libraries",
          skills: [
            "Next.js",
            "React",
            "Tailwind CSS",
            "Node.js",
            "Express",
            "Zustand",
          ],
        },
        {
          id: "entry_skill_3",
          groupName: "Databases & Tools",
          skills: ["PostgreSQL", "Supabase", "Git", "GitHub", "Docker", "Postman"],
        },
      ],
    },
  ],
};
