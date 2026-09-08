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
    name: "Alex Pratama",
    useProfilePhoto: false,
    address: {
      kecamatan: "Kebayoran Baru",
      kabupaten: "Jakarta Selatan",
      provinsi: "DKI Jakarta",
    },
    email: "alex.pratama@email.com",
    phone: "081234567890",
    linkedin: "https://linkedin.com/in/alexpratama",
    portfolio: "https://alexpratama.dev",
  },
  overview:
    "Software Engineer dengan pengalaman dalam membangun aplikasi web modern yang scalable, berkinerja tinggi, dan berorientasi pengguna. Memiliki keahlian mendalam pada ekosistem TypeScript, Next.js, Node.js, dan arsitektur cloud database.",
  sections: [
    {
      id: "sec_edu",
      type: "education",
      order: 0,
      entries: [
        {
          id: "entry_edu_1",
          level: "S1",
          institution: "Universitas Indonesia",
          location: {
            kabupaten: "Depok",
            provinsi: "Jawa Barat",
            country: "Indonesia",
          },
          major: "Ilmu Komputer",
          gpa: "3.75",
          startYear: "2020",
          endYear: "2024",
          relevantCourses: [
            "Algoritma & Struktur Data",
            "Sistem Basis Data",
            "Rekayasa Perangkat Lunak",
            "Jaringan Komputer",
          ],
          description:
            "Aktif dalam organisasi kemahasiswaan dan riset laboratorium rekayasa perangkat lunak.",
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
          company: "PT Teknologi Maju Nusantara",
          location: {
            kabupaten: "Jakarta Selatan",
            provinsi: "DKI Jakarta",
            country: "Indonesia",
          },
          position: "Fullstack Web Developer",
          employmentType: "Full-time",
          startDate: "Agu 2024",
          endDate: "Sekarang",
          isCurrent: true,
          bullets: [
            "Merancang dan mengembangkan fitur manajemen transaksi real-time menggunakan Next.js dan PostgreSQL dengan latensi di bawah 100ms.",
            "Membangun pipeline automasi CI/CD dengan GitHub Actions untuk pengujian otomatis dan zero-downtime deployment.",
            "Mengoptimalkan performa rendering halaman frontend sehingga meningkatkan skor Google PageSpeed dari 72 menjadi 95.",
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
          name: "E-Commerce Microservices Platform",
          link: "https://github.com/alexpratama/ecommerce-platform",
          year: "2024",
          bullets: [
            "Membangun sistem katalog produk dan pembayaran modular dengan integrasi payment gateway sandbox.",
            "Menerapkan arsitektur REST API yang aman dilengkapi autentikasi JWT dan rate-limiting.",
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
          skills: ["TypeScript", "JavaScript", "SQL", "HTML5", "CSS3", "Python"],
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
    name: "Alex Pratama",
    useProfilePhoto: false,
    address: {
      kecamatan: "Kebayoran Baru",
      kabupaten: "South Jakarta",
      provinsi: "DKI Jakarta",
    },
    email: "alex.pratama@email.com",
    phone: "+62 812 3456 7890",
    linkedin: "https://linkedin.com/in/alexpratama",
    portfolio: "https://alexpratama.dev",
  },
  overview:
    "Results-driven Software Engineer with extensive experience developing scalable, high-performance web applications. Proficient in TypeScript, Next.js, Node.js, and modern cloud databases with a strong focus on clean architecture.",
  sections: [
    {
      id: "sec_edu",
      type: "education",
      order: 0,
      entries: [
        {
          id: "entry_edu_1",
          level: "Bachelor's Degree",
          institution: "University of Indonesia",
          location: {
            kabupaten: "Depok",
            provinsi: "West Java",
            country: "Indonesia",
          },
          major: "Computer Science",
          gpa: "3.75 / 4.00",
          startYear: "2020",
          endYear: "2024",
          relevantCourses: [
            "Algorithms & Data Structures",
            "Database Systems",
            "Software Engineering",
            "Computer Networks",
          ],
          description:
            "Active contributor in student software development lab and campus tech initiatives.",
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
          company: "Nusantara Tech Solutions",
          location: {
            kabupaten: "South Jakarta",
            provinsi: "DKI Jakarta",
            country: "Indonesia",
          },
          position: "Fullstack Web Developer",
          employmentType: "Full-time",
          startDate: "Aug 2024",
          endDate: "Present",
          isCurrent: true,
          bullets: [
            "Architected and deployed scalable real-time transaction workflows with Next.js and PostgreSQL, sustaining sub-100ms query latency.",
            "Constructed automated CI/CD deployment pipelines using GitHub Actions for continuous testing and deployment.",
            "Optimized frontend bundle sizes and assets, raising overall Lighthouse audit scores from 72 to 95.",
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
          name: "E-Commerce Microservices Platform",
          link: "https://github.com/alexpratama/ecommerce-platform",
          year: "2024",
          bullets: [
            "Engineered modular product catalog and checkout system integrated with sandbox payment gateways.",
            "Designed secure RESTful API endpoints reinforced with JWT authentication and rate limiting.",
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
          skills: ["TypeScript", "JavaScript", "SQL", "HTML5", "CSS3", "Python"],
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

export const BLANK_CV_DATA_ID: CVData = {
  header: {
    name: "",
    useProfilePhoto: false,
    address: {
      kecamatan: "",
      kabupaten: "",
      provinsi: "",
    },
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
  },
  overview: "",
  sections: [
    {
      id: "sec_edu",
      type: "education",
      order: 0,
      entries: [],
    },
    {
      id: "sec_work",
      type: "work",
      order: 1,
      entries: [],
    },
    {
      id: "sec_project",
      type: "project",
      order: 2,
      entries: [],
    },
    {
      id: "sec_skills",
      type: "skills",
      order: 3,
      entries: [],
    },
  ],
};

export const BLANK_CV_DATA_EN: CVData = {
  header: {
    name: "",
    useProfilePhoto: false,
    address: {
      kecamatan: "",
      kabupaten: "",
      provinsi: "",
    },
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
  },
  overview: "",
  sections: [
    {
      id: "sec_edu",
      type: "education",
      order: 0,
      entries: [],
    },
    {
      id: "sec_work",
      type: "work",
      order: 1,
      entries: [],
    },
    {
      id: "sec_project",
      type: "project",
      order: 2,
      entries: [],
    },
    {
      id: "sec_skills",
      type: "skills",
      order: 3,
      entries: [],
    },
  ],
};
