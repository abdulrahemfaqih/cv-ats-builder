"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  CVData,
  SectionType,
  CVEntry,
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
import { SECTION_TITLES } from "@/lib/constants/defaultCV";
import { cleanCVText, cleanBullets, formatGpa } from "@/lib/utils/formatText";
import { ATS_FONTS, ATS_SPACINGS } from "@/lib/constants/atsFormatting";

interface CVPreviewProps {
  data: CVData;
  language: "id" | "en";
  hidePageInfo?: boolean;
  className?: string;
}

interface CVBlock {
  id: string;
  element: React.ReactNode;
}

export function CVPreview({
  data,
  language,
  hidePageInfo = false,
  className = "",
}: CVPreviewProps) {
  const { header, overview, sections } = data;
  const titles = SECTION_TITLES[language] || SECTION_TITLES.id;

  const settings = data.settings || {
    fontFamily: "arial",
    spacing: "normal",
    showPageBreaks: true,
  };
  const font = ATS_FONTS[settings.fontFamily || "arial"] || ATS_FONTS.arial;
  const spacing = ATS_SPACINGS[settings.spacing || "normal"] || ATS_SPACINGS.normal;

  // Format single-line contact string parts
  const contactParts: React.ReactNode[] = [];

  // Address
  const formatKec = header.address?.kecamatan?.trim()
    ? (/^kec(\.|\b)/i.test(header.address.kecamatan.trim())
        ? header.address.kecamatan.trim()
        : `Kec. ${header.address.kecamatan.trim()}`)
    : "";
  const formatKab = header.address?.kabupaten?.trim()
    ? header.address.kabupaten.trim().replace(/^(kab\.|kabupaten)\s+/i, "")
    : "";
  const formatProv = header.address?.provinsi?.trim()
    ? header.address.provinsi.trim().replace(/^(prov\.|provinsi)\s+/i, "")
    : "";

  const addressParts = [formatKec, formatKab, formatProv].filter(Boolean);

  if (addressParts.length > 0) {
    contactParts.push(
      <span key="addr" className="text-black">
        {addressParts.join(", ")}
      </span>
    );
  }

  // LinkedIn
  if (header.linkedin) {
    const cleanUrl = header.linkedin.replace(/^https?:\/\//i, "");
    contactParts.push(
      <span key="linkedin" className="text-black">
        Linkedin:{" "}
        <a
          href={header.linkedin.startsWith("http") ? header.linkedin : `https://${header.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0563C1] underline"
        >
          {cleanUrl}
        </a>
      </span>
    );
  }

  // GitHub
  if (header.github) {
    const cleanUrl = header.github.replace(/^https?:\/\//i, "");
    contactParts.push(
      <span key="github" className="text-black">
        GitHub:{" "}
        <a
          href={header.github.startsWith("http") ? header.github : `https://${header.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0563C1] underline"
        >
          {cleanUrl}
        </a>
      </span>
    );
  }

  // Email
  if (header.email) {
    contactParts.push(
      <a
        key="email"
        href={`mailto:${header.email}`}
        className="text-[#0563C1] underline"
      >
        {header.email}
      </a>
    );
  }

  // Phone
  if (header.phone) {
    contactParts.push(
      <span key="phone" className="text-black">
        {header.phone}
      </span>
    );
  }

  // Portfolio
  if (header.portfolio) {
    const cleanPorto = header.portfolio.replace(/^https?:\/\//i, "");
    contactParts.push(
      <span key="porto" className="text-black">
        Portofolio:{" "}
        <a
          href={
            header.portfolio.startsWith("http")
              ? header.portfolio
              : `https://${header.portfolio}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0563C1] underline"
        >
          {cleanPorto}
        </a>
      </span>
    );
  }

  // Helper to render a single entry
  const renderSingleEntry = (type: SectionType, entry: CVEntry, idx: number) => {
    switch (type) {
      case "education": {
        const edu = entry as EducationEntry;
        if (!edu.institution && !edu.major) return null;
        const locStr = [
          edu.location?.kabupaten,
          edu.location?.provinsi,
          edu.location?.country,
        ]
          .filter(Boolean)
          .join(", ");

        const leftTitle = [edu.level, edu.institution, locStr]
          .filter(Boolean)
          .join(" - ");

        const dateStr = [edu.startYear, edu.endYear].filter(Boolean).join(" - ");

        return (
          <div key={edu.id || idx} className="text-[10pt] leading-[1.35] break-inside-avoid">
            <div className="flex justify-between items-start font-bold text-black gap-x-4">
              <span className="flex-1 min-w-0 pr-3">{leftTitle}</span>
              {dateStr && (
                <span className="font-bold text-right whitespace-nowrap shrink-0 ml-3">
                  {dateStr}
                </span>
              )}
            </div>

            {(edu.major || edu.gpa) && (
              <div className="italic text-black mt-0.5">
                {edu.major}
                {edu.major && edu.gpa && " - "}
                {edu.gpa && formatGpa(edu.gpa, language)}
              </div>
            )}

            {edu.relevantCourses && edu.relevantCourses.length > 0 && (
              <div className="text-black text-justify mt-0.5">
                <span className="font-bold">
                  {language === "en" ? "Relevant Courses : " : "Mata Kuliah Relevan : "}
                </span>
                <span>
                  {cleanCVText(
                    Array.isArray(edu.relevantCourses)
                      ? edu.relevantCourses.join(", ")
                      : edu.relevantCourses
                  )}
                </span>
              </div>
            )}

            {edu.description && (
              <div className="text-black mt-1 text-justify break-words">
                {cleanCVText(edu.description)}
              </div>
            )}
          </div>
        );
      }

      case "work":
      case "organization": {
        const item = entry as WorkEntry | OrganizationEntry;
        const name = "company" in item ? item.company : item.organization;
        if (!name && !item.position) return null;

        const locStr = [
          item.location?.kabupaten,
          item.location?.provinsi,
          item.location?.country,
        ]
          .filter(Boolean)
          .join(", ");

        const leftTitle = [name, locStr].filter(Boolean).join(" - ");

        const dateStr = [
          item.startDate,
          item.isCurrent ? (language === "en" ? "Present" : "Sekarang") : item.endDate,
        ]
          .filter(Boolean)
          .join(" - ");

        const typeSuffix =
          "employmentType" in item
            ? item.employmentType
            : "roleType" in item
            ? item.roleType
            : undefined;
        const positionTitle = [item.position, typeSuffix].filter(Boolean).join(" - ");

        const cleanedBullets = cleanBullets(item.bullets);

        return (
          <div key={item.id || idx} className="text-[10pt] leading-[1.35] break-inside-avoid">
            <div className="flex justify-between items-start font-bold text-black gap-x-4">
              <span className="flex-1 min-w-0 pr-3">{leftTitle}</span>
              {dateStr && (
                <span className="font-bold text-right whitespace-nowrap shrink-0 ml-3">
                  {dateStr}
                </span>
              )}
            </div>

            {positionTitle && (
              <div className="italic text-black mt-0.5">{positionTitle}</div>
            )}

            {cleanedBullets.length > 0 && (
              <ul className="mt-1.5 space-y-0.5 pl-5 list-disc text-black">
                {cleanedBullets.map((bullet: string, bIdx: number) => (
                  <li key={bIdx} className="leading-snug text-justify break-words">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      }

      case "project": {
        const proj = entry as ProjectEntry;
        if (!proj.name) return null;
        const cleanedBullets = cleanBullets(proj.bullets);
        return (
          <div key={proj.id || idx} className="text-[10pt] leading-[1.35] break-inside-avoid">
            <div className="flex justify-between items-start text-black gap-x-4">
              <div className="font-bold flex-1 min-w-0 pr-3">
                {proj.name}
                {proj.link && proj.linkPosition === "beside" && (
                  <>
                    <span className="font-normal text-[#555555]"> | </span>
                    <a
                      href={
                        proj.link.trim().startsWith("http")
                          ? proj.link.trim()
                          : `https://${proj.link.trim()}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0563C1] underline font-normal text-[9.5pt]"
                    >
                      {proj.link.trim().replace(/^https?:\/\//i, "")}
                    </a>
                  </>
                )}
              </div>
              {proj.year && (
                <span className="font-bold text-right whitespace-nowrap shrink-0 ml-3">
                  {proj.year}
                </span>
              )}
            </div>

            {proj.link && proj.linkPosition !== "beside" && (
              <div className="text-[9.5pt] text-black mt-0.5">
                <span>Link : </span>
                <a
                  href={
                    proj.link.trim().startsWith("http")
                      ? proj.link.trim()
                      : `https://${proj.link.trim()}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0563C1] underline"
                >
                  {proj.link.trim().replace(/^https?:\/\//i, "")}
                </a>
              </div>
            )}

            {proj.descriptionType === "paragraph" ? (
              proj.description ? (
                <div className="mt-1 text-black text-justify break-words text-[10pt] leading-snug">
                  {cleanCVText(proj.description)}
                </div>
              ) : null
            ) : cleanedBullets.length > 0 ? (
              <ul className="mt-1.5 space-y-0.5 pl-5 list-disc text-black">
                {cleanedBullets.map((bullet: string, bIdx: number) => (
                  <li key={bIdx} className="leading-snug text-justify break-words">
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      }

      case "skills": {
        const skill = entry as SkillGroupEntry;
        if (!skill.groupName && (!skill.skills || skill.skills.length === 0))
          return null;
        const skillItems = cleanCVText(
          Array.isArray(skill.skills) ? skill.skills.join(", ") : skill.skills
        );
        return (
          <div key={skill.id || idx} className="text-[10pt] leading-[1.35] text-black break-inside-avoid">
            <span className="font-bold">{skill.groupName || "Keahlian"} : </span>
            <span>{skillItems}</span>
          </div>
        );
      }

      case "certification": {
        const cert = entry as CertificationEntry;
        if (!cert.name && !cert.issuer) return null;
        const dateStr = [
          cert.issueDate,
          cert.isLifetime
            ? language === "en"
              ? "Lifetime"
              : "Seumur Hidup"
            : cert.expiryDate,
        ]
          .filter(Boolean)
          .join(" - ");

        return (
          <div key={cert.id || idx} className="text-[10pt] leading-[1.35] break-inside-avoid">
            <div className="flex justify-between items-start text-black gap-x-4">
              <div className="flex-1 min-w-0 pr-3">
                <span className="font-bold">{cert.name}</span>
                {cert.issuer && <span> - {cert.issuer}</span>}
                {cert.link && cert.linkPosition === "beside" && (
                  <>
                    <span className="text-[#555555]"> | </span>
                    <a
                      href={
                        cert.link.trim().startsWith("http")
                          ? cert.link.trim()
                          : `https://${cert.link.trim()}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0563C1] underline font-normal text-[9.5pt]"
                    >
                      {cert.link.trim().replace(/^https?:\/\//i, "")}
                    </a>
                  </>
                )}
              </div>
              {dateStr && (
                <span className="font-bold text-right whitespace-nowrap shrink-0 ml-3">
                  {dateStr}
                </span>
              )}
            </div>

            {cert.link && cert.linkPosition !== "beside" && (
              <div className="text-[9.5pt] text-black mt-0.5">
                <span>Link : </span>
                <a
                  href={
                    cert.link.trim().startsWith("http")
                      ? cert.link.trim()
                      : `https://${cert.link.trim()}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0563C1] underline"
                >
                  {cert.link.trim().replace(/^https?:\/\//i, "")}
                </a>
              </div>
            )}
          </div>
        );
      }

      case "training": {
        const train = entry as TrainingEntry;
        if (!train.name && !train.organizer) return null;
        return (
          <div key={train.id || idx} className="text-[10pt] leading-[1.35] break-inside-avoid">
            <div className="flex justify-between items-start text-black gap-x-4">
              <div className="flex-1 min-w-0 pr-3">
                <span className="font-bold">{train.name}</span>
                {train.organizer && <span> - {train.organizer}</span>}
                {train.link && train.linkPosition === "beside" && (
                  <>
                    <span className="text-[#555555]"> | </span>
                    <a
                      href={
                        train.link.trim().startsWith("http")
                          ? train.link.trim()
                          : `https://${train.link.trim()}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0563C1] underline font-normal text-[9.5pt]"
                    >
                      {train.link.trim().replace(/^https?:\/\//i, "")}
                    </a>
                  </>
                )}
              </div>
              {train.date && (
                <span className="font-bold text-right whitespace-nowrap shrink-0 ml-3">
                  {train.date}
                </span>
              )}
            </div>

            {train.link && train.linkPosition !== "beside" && (
              <div className="text-[9.5pt] text-black mt-0.5">
                <span>Link : </span>
                <a
                  href={
                    train.link.trim().startsWith("http")
                      ? train.link.trim()
                      : `https://${train.link.trim()}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0563C1] underline"
                >
                  {train.link.trim().replace(/^https?:\/\//i, "")}
                </a>
              </div>
            )}
          </div>
        );
      }

      case "achievement": {
        const ach = entry as AchievementEntry;
        if (!ach.name) return null;
        return (
          <div key={ach.id || idx} className="text-[10pt] leading-[1.35] break-inside-avoid">
            <div className="flex justify-between items-start text-black gap-x-4">
              <div className="font-bold flex-1 min-w-0 pr-3">
                {ach.name}
                {ach.context && <span> - {ach.context}</span>}
                {ach.link && ach.linkPosition === "beside" && (
                  <>
                    <span className="font-normal text-[#555555]"> | </span>
                    <a
                      href={
                        ach.link.trim().startsWith("http")
                          ? ach.link.trim()
                          : `https://${ach.link.trim()}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0563C1] underline font-normal text-[9.5pt]"
                    >
                      {ach.link.trim().replace(/^https?:\/\//i, "")}
                    </a>
                  </>
                )}
              </div>
              {ach.date && (
                <span className="font-bold text-right whitespace-nowrap shrink-0 ml-3">
                  {ach.date}
                </span>
              )}
            </div>

            {ach.link && ach.linkPosition !== "beside" && (
              <div className="text-[9.5pt] text-black mt-0.5">
                <span>Link : </span>
                <a
                  href={
                    ach.link.trim().startsWith("http")
                      ? ach.link.trim()
                      : `https://${ach.link.trim()}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0563C1] underline"
                >
                  {ach.link.trim().replace(/^https?:\/\//i, "")}
                </a>
              </div>
            )}

            {ach.description && (
              <div className="mt-1 text-black text-justify break-words text-[10pt] leading-snug">
                {cleanCVText(ach.description)}
              </div>
            )}
          </div>
        );
      }

      case "languages": {
        const lang = entry as LanguageEntry;
        if (!lang.language) return null;
        const details = [
          lang.proficiency ? cleanCVText(lang.proficiency) : "",
          lang.info ? `(${cleanCVText(lang.info)})` : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={lang.id || idx} className="text-black break-inside-avoid text-[10pt] leading-[1.35]">
            <span className="font-bold">{cleanCVText(lang.language)}</span>
            {details ? <span> : {details}</span> : null}
          </div>
        );
      }

      default:
        return null;
    }
  };

  // Build sequential list of blocks
  const allBlocks: CVBlock[] = [];

  // 1. Header Block
  allBlocks.push({
    id: "header_main",
    element: (
      <header key="header_main" className="mb-2">
        {header.useProfilePhoto && header.photoUrl?.trim() ? (
          <div className="flex flex-row items-center gap-4 sm:gap-5">
            <div className="w-[66px] h-[88px] shrink-0 rounded-xs overflow-hidden border border-neutral-300 bg-neutral-100 shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={header.photoUrl}
                alt={header.name || "Foto Profil"}
                className="w-full h-full object-cover block"
              />
            </div>

            <div className="flex-1 min-w-0 text-left">
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-normal text-black m-0 p-0 leading-tight">
                {header.name || "NAMA LENGKAP"}
              </h1>

              {contactParts.length > 0 && (
                <div className="mt-2 text-[9.5pt] leading-tight flex flex-wrap justify-start items-center gap-x-2 gap-y-1">
                  {contactParts.map((part, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <span className="text-black select-none">|</span>}
                      {part}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-normal text-black m-0 p-0 leading-tight">
              {header.name || "NAMA LENGKAP"}
            </h1>

            {contactParts.length > 0 && (
              <div className="mt-2 text-[9.5pt] leading-tight flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
                {contactParts.map((part, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <span className="text-black select-none">|</span>}
                    {part}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}

        <hr className="w-full border-t border-black mt-2.5 mb-2" />
      </header>
    ),
  });

  // 2. Overview Block
  if (overview && overview.trim() !== "") {
    allBlocks.push({
      id: "overview_main",
      element: (
        <section
          key="overview_main"
          className={`${spacing.previewSectionMargin} text-[10pt] leading-[1.4] text-black text-justify break-words`}
        >
          <p className="text-justify break-words">{cleanCVText(overview)}</p>
        </section>
      ),
    });
  }

  // 3. Section Blocks
  const sortedSections = sections.slice().sort((a, b) => a.order - b.order);

  sortedSections.forEach((section) => {
    if (!section.entries || section.entries.length === 0) return;
    const title = titles[section.type] || section.type.toUpperCase();

    // Block: Section Title + Entry 0 (bind together to avoid orphan titles)
    allBlocks.push({
      id: `${section.id}_start`,
      element: (
        <section key={`${section.id}_start`} className={`${spacing.previewSectionMargin} text-left`}>
          <div className="break-inside-avoid break-after-avoid">
            <h2 className="text-[11pt] sm:text-[12pt] font-bold uppercase tracking-normal text-black m-0 p-0 leading-none">
              {title}
            </h2>
            <hr className="w-full border-t border-black mt-1 mb-2" />
          </div>
          <div className={spacing.previewEntrySpacing}>
            {renderSingleEntry(section.type, section.entries[0], 0)}
          </div>
        </section>
      ),
    });

    // Subsequent entries
    for (let i = 1; i < section.entries.length; i++) {
      allBlocks.push({
        id: `${section.id}_entry_${i}`,
        element: (
          <div key={`${section.id}_entry_${i}`} className={`${spacing.previewEntrySpacing} mb-2.5`}>
            {renderSingleEntry(section.type, section.entries[i], i)}
          </div>
        ),
      });
    }
  });

  // Pagination state: array of pages, each containing CVBlocks
  const [pages, setPages] = useState<CVBlock[][]>([allBlocks]);
  const measuringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!measuringRef.current) return;

    const measureAndPaginate = () => {
      const container = measuringRef.current;
      if (!container) return;

      const elements = container.querySelectorAll<HTMLElement>("[data-block-id]");
      if (elements.length === 0) return;

      // A4 printable height in pixels (96 DPI: 271.6mm printable = ~1026px)
      // We use 1010px as a clean ceiling to ensure no item overflows the bottom margin
      const A4_USABLE_HEIGHT_PX = 1010;

      const paginatedPages: CVBlock[][] = [[]];
      let currentHeight = 0;
      let currentPage = 0;

      allBlocks.forEach((block, index) => {
        const el = elements[index];
        const h = el ? el.offsetHeight + 10 : 70; // 10px safe margin gap

        if (currentHeight + h > A4_USABLE_HEIGHT_PX && currentHeight > 0) {
          currentPage++;
          paginatedPages[currentPage] = [];
          currentHeight = 0;
        }

        paginatedPages[currentPage].push(block);
        currentHeight += h;
      });

      setPages(paginatedPages);
    };

    // Calculate once DOM elements render
    measureAndPaginate();

    const ro = new ResizeObserver(measureAndPaginate);
    ro.observe(measuringRef.current);
    return () => ro.disconnect();
  }, [data, settings.fontFamily, settings.spacing]);

  return (
    <div className={`w-full h-full overflow-auto ${className || "bg-[#F7F7F6]"} relative`}>
      {/* Floating minimalist page count badge */}
      {!hidePageInfo && (
        <div className="sticky top-2 z-30 flex justify-center pointer-events-none mb-[-2rem]">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#E2E2DC] shadow-xs rounded-full px-3.5 py-1 text-[11px] font-semibold flex items-center gap-2 text-[#444440] select-none">
            <span
              className={`w-2 h-2 rounded-full ${
                pages.length === 1 ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            <span>
              {pages.length === 1
                ? "Pas 1 Halaman A4"
                : `${pages.length} Halaman (Kertas Terpisah)`}
            </span>
            <span className="text-[#D0D0C8]">•</span>
            <span className="text-[10px] text-[#777770]">
              {font.name} ({spacing.label.split(" ")[0]})
            </span>
          </div>
        </div>
      )}

      {/* Canvas displaying genuine separate A4 paper sheets */}
      <div className="w-fit min-w-full min-h-full p-4 sm:p-8 flex flex-col items-center gap-8">
        {pages.map((pageBlocks, pageIndex) => (
          <div
            key={pageIndex}
            id={pageIndex === 0 ? "cv-print-area" : undefined}
            className={`a4-page relative bg-white text-black w-[210mm] min-w-[210mm] min-h-[297mm] h-[297mm] shadow-xl px-[14.1mm] py-[12.7mm] text-left transition-all box-border shrink-0 overflow-hidden ${spacing.previewLineHeight}`}
            style={{
              fontFamily: font.fontFamily,
            }}
          >
            {/* Render blocks inside this page */}
            {pageBlocks.map((b) => (
              <React.Fragment key={b.id}>{b.element}</React.Fragment>
            ))}

            {/* Page number watermark / label at bottom right */}
            {!hidePageInfo && (
              <div className="absolute bottom-2.5 right-4 text-[9px] text-[#A0A09A] select-none print:hidden font-mono">
                Halaman {pageIndex + 1} dari {pages.length}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hidden off-screen container for exact pixel measuring */}
      <div
        ref={measuringRef}
        aria-hidden="true"
        className="absolute pointer-events-none opacity-0 select-none -z-50"
        style={{
          top: -99999,
          left: -99999,
          width: "210mm",
          padding: "12.7mm 14.1mm",
          fontFamily: font.fontFamily,
          visibility: "hidden",
        }}
      >
        {allBlocks.map((b) => (
          <div key={b.id} data-block-id={b.id}>
            {b.element}
          </div>
        ))}
      </div>
    </div>
  );
}
