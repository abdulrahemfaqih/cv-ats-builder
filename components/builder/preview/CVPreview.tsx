"use client";

import React from "react";
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
import { cleanCVText, cleanBullets } from "@/lib/utils/formatText";

interface CVPreviewProps {
  data: CVData;
  language: "id" | "en";
}

export function CVPreview({ data, language }: CVPreviewProps) {
  const { header, overview, sections } = data;
  const titles = SECTION_TITLES[language] || SECTION_TITLES.id;

  // Format single-line contact string parts
  const contactParts: React.ReactNode[] = [];

  // Address
  const addressParts = [
    header.address.kecamatan ? `Kec. ${header.address.kecamatan}` : "",
    header.address.kabupaten ? `Kab. ${header.address.kabupaten}` : "",
    header.address.provinsi ? `Prov. ${header.address.provinsi}` : "",
  ].filter(Boolean);

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

  // Helper to render section entries
  const renderSectionContent = (type: SectionType, entries: CVEntry[]) => {
    if (!entries || entries.length === 0) return null;

    switch (type) {
      case "education": {
        const eduEntries = entries as EducationEntry[];
        return (
          <div className="space-y-3">
            {eduEntries.map((edu, idx) => {
              if (!edu.institution && !edu.major) return null;
              const locStr = [
                edu.location?.kabupaten,
                edu.location?.provinsi,
                edu.location?.country,
              ]
                .filter(Boolean)
                .join(", ");

              const leftTitle = [
                edu.level,
                edu.institution,
                locStr,
              ]
                .filter(Boolean)
                .join(" - ");

              const dateStr = [edu.startYear, edu.endYear]
                .filter(Boolean)
                .join(" - ");

              return (
                <div key={edu.id || idx} className="text-[10pt] leading-[1.35] break-inside-avoid">
                  <div className="flex justify-between items-start font-bold text-black">
                    <span className="flex-1 pr-2">{leftTitle}</span>
                    {dateStr && <span className="text-right whitespace-nowrap shrink-0">{dateStr}</span>}
                  </div>

                  {(edu.major || edu.gpa) && (
                    <div className="italic text-black">
                      {edu.major}
                      {edu.major && edu.gpa && " - "}
                      {edu.gpa && `IPK ${edu.gpa}`}
                    </div>
                  )}

                  {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                    <div className="text-black text-justify">
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
                    <div className="text-black mt-0.5 text-justify break-words">
                      {cleanCVText(edu.description)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      case "work":
      case "organization": {
        const orgOrWorkEntries = entries as (WorkEntry | OrganizationEntry)[];
        return (
          <div className="space-y-3">
            {orgOrWorkEntries.map((item, idx) => {
              const name =
                "company" in item ? item.company : item.organization;
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
              const positionTitle = [
                item.position,
                typeSuffix,
              ]
                .filter(Boolean)
                .join(" - ");

              const cleanedBullets = cleanBullets(item.bullets);

              return (
                <div key={item.id || idx} className="text-[10pt] leading-[1.35] break-inside-avoid">
                  <div className="flex justify-between items-start font-bold text-black">
                    <span className="flex-1 pr-2">{leftTitle}</span>
                    {dateStr && <span className="text-right whitespace-nowrap shrink-0">{dateStr}</span>}
                  </div>

                  {positionTitle && (
                    <div className="italic text-black">{positionTitle}</div>
                  )}

                  {cleanedBullets.length > 0 && (
                    <ul className="mt-1 space-y-0.5 pl-5 list-disc text-black">
                      {cleanedBullets.map((bullet: string, bIdx: number) => (
                        <li key={bIdx} className="leading-snug text-justify break-words">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      case "project": {
        const projEntries = entries as ProjectEntry[];
        return (
          <div className="space-y-3">
            {projEntries.map((proj, idx) => {
              if (!proj.name) return null;
              const cleanedBullets = cleanBullets(proj.bullets);
              return (
                <div key={proj.id || idx} className="text-[10pt] leading-[1.35] break-inside-avoid">
                  <div className="flex justify-between items-start text-black">
                    <div className="font-bold flex-1 pr-2">
                      {proj.name}
                      {proj.link && (
                        <>
                          {" "}
                          (
                          <a
                            href={
                              proj.link.trim().startsWith("http")
                                ? proj.link.trim()
                                : `https://${proj.link.trim()}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0563C1] underline font-normal"
                          >
                            Link
                          </a>
                          )
                        </>
                      )}
                    </div>
                    {proj.year && (
                      <span className="font-bold text-right whitespace-nowrap shrink-0">
                        {proj.year}
                      </span>
                    )}
                  </div>

                  {proj.descriptionType === "paragraph" ? (
                    proj.description && (
                      <div className="mt-1 text-black text-justify break-words text-[10pt] leading-snug">
                        {cleanCVText(proj.description)}
                      </div>
                    )
                  ) : (
                    cleanedBullets.length > 0 && (
                      <ul className="mt-1 space-y-0.5 pl-5 list-disc text-black">
                        {cleanedBullets.map((bullet: string, bIdx: number) => (
                          <li
                            key={bIdx}
                            className="leading-snug text-justify break-words"
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      case "skills": {
        const skillEntries = entries as SkillGroupEntry[];
        return (
          <div className="space-y-1 text-[10pt] leading-[1.4]">
            {skillEntries.map((skillGroup, idx) => {
              if (!skillGroup.groupName) return null;
              const skillItems = cleanCVText(
                Array.isArray(skillGroup.skills)
                  ? skillGroup.skills.join(", ")
                  : skillGroup.skills
              );
              return (
                <div key={skillGroup.id || idx} className="text-black break-inside-avoid">
                  <span className="font-bold">{skillGroup.groupName} : </span>
                  <span>{skillItems}</span>
                </div>
              );
            })}
          </div>
        );
      }

      case "certification": {
        const certEntries = entries as CertificationEntry[];
        return (
          <div className="space-y-2">
            {certEntries.map((cert, idx) => {
              if (!cert.name) return null;
              const dateStr = cert.isLifetime
                ? `${cert.issueDate || ""} (${language === "en" ? "Lifetime" : "Seumur Hidup"})`
                : [cert.issueDate, cert.expiryDate].filter(Boolean).join(" - ");

              return (
                <div
                  key={cert.id || idx}
                  className="text-[10pt] leading-[1.35] flex justify-between items-start text-black break-inside-avoid"
                >
                  <div className="flex-1 pr-2">
                    <span className="font-bold">{cert.name}</span>
                    {cert.link && (
                      <>
                        {" "}
                        (
                        <a
                          href={
                            cert.link.trim().startsWith("http")
                              ? cert.link.trim()
                              : `https://${cert.link.trim()}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0563C1] underline font-normal"
                        >
                          Link
                        </a>
                        )
                      </>
                    )}
                    {cert.issuer && ` - ${cert.issuer}`}
                  </div>
                  {dateStr && <span className="text-right whitespace-nowrap shrink-0">{dateStr}</span>}
                </div>
              );
            })}
          </div>
        );
      }

      case "training": {
        const trainEntries = entries as TrainingEntry[];
        return (
          <div className="space-y-2">
            {trainEntries.map((trn, idx) => {
              if (!trn.name) return null;
              return (
                <div
                  key={trn.id || idx}
                  className="text-[10pt] leading-[1.35] flex justify-between items-start text-black break-inside-avoid"
                >
                  <div className="flex-1 pr-2">
                    <span className="font-normal">{trn.name}</span>
                    {trn.link && (
                      <>
                        {" "}
                        (
                        <a
                          href={
                            trn.link.trim().startsWith("http")
                              ? trn.link.trim()
                              : `https://${trn.link.trim()}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0563C1] underline font-normal"
                        >
                          Link
                        </a>
                        )
                      </>
                    )}
                    {trn.organizer && ` - ${trn.organizer}`}
                  </div>
                  {trn.date && (
                    <span className="text-right whitespace-nowrap shrink-0">{trn.date}</span>
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      case "achievement": {
        const achEntries = entries as AchievementEntry[];
        return (
          <div className="space-y-2">
            {achEntries.map((ach, idx) => {
              if (!ach.name) return null;
              return (
                <div key={ach.id || idx} className="text-[10pt] leading-[1.35] text-black break-inside-avoid">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <span className="font-bold">{ach.name}</span>
                      {ach.link && (
                        <>
                          {" "}
                          (
                          <a
                            href={
                              ach.link.trim().startsWith("http")
                                ? ach.link.trim()
                                : `https://${ach.link.trim()}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0563C1] underline font-normal"
                          >
                            Link
                          </a>
                          )
                        </>
                      )}
                      {ach.context && ` - ${ach.context}`}
                    </div>
                    {ach.date && (
                      <span className="text-right whitespace-nowrap shrink-0">{ach.date}</span>
                    )}
                  </div>
                  {ach.description && (
                    <div className="mt-0.5 text-black text-justify break-words text-[10pt] leading-snug">
                      {cleanCVText(ach.description)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      case "languages": {
        const langEntries = entries as LanguageEntry[];
        return (
          <div className="space-y-1 text-[10pt] leading-[1.4]">
            {langEntries.map((lang, idx) => {
              if (!lang.language) return null;
              const details = [
                lang.proficiency ? cleanCVText(lang.proficiency) : "",
                lang.info ? `(${cleanCVText(lang.info)})` : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={lang.id || idx}
                  className="text-black break-inside-avoid"
                >
                  <span className="font-bold">
                    {cleanCVText(lang.language)}
                  </span>
                  {details ? <span> : {details}</span> : null}
                </div>
              );
            })}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex justify-center bg-[#F7F7F6] p-4 sm:p-6 overflow-x-auto min-h-full">
      {/* 
        A4 Container standard ATS
        210mm x 297mm 
        Padding: Top/Bottom 36pt (12.7mm), Left/Right 40pt (14.1mm)
      */}
      <div
        id="cv-print-area"
        className="bg-white text-black w-[210mm] min-h-[297mm] shadow-md border border-[#E3E3DE] px-[14.1mm] py-[12.7mm] font-sans text-left transition-all box-border"
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        {/* HEADER */}
        <header className="mb-2 text-center">
          {/* Full Name */}
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-normal text-black m-0 p-0 leading-tight">
            {header.name || "NAMA LENGKAP"}
          </h1>

          {/* Single-line contact details */}
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

          {/* Full-width Divider under header */}
          <hr className="w-full border-t border-black mt-2 mb-2" />
        </header>

        {/* OVERVIEW (No header, justified) */}
        {overview && overview.trim() !== "" && (
          <section className="mb-4 text-[10pt] leading-[1.4] text-black text-justify break-words">
            <p className="text-justify break-words">{cleanCVText(overview)}</p>
          </section>
        )}

        {/* ORDERED SECTIONS */}
        {sections
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((section) => {
            // Check if section has entries
            if (!section.entries || section.entries.length === 0) return null;

            const title = titles[section.type] || section.type.toUpperCase();
            const content = renderSectionContent(section.type, section.entries);

            if (!content) return null;

            return (
              <section key={section.id} className="mb-4 text-left">
                {/* Section Header: Bold, uppercase, left-aligned */}
                <h2 className="text-[11pt] sm:text-[12pt] font-bold uppercase tracking-normal text-black m-0 p-0 leading-none">
                  {title}
                </h2>
                {/* Full-width Divider under section header */}
                <hr className="w-full border-t border-black mt-1 mb-2" />

                {/* Section Entries */}
                {content}
              </section>
            );
          })}
      </div>
    </div>
  );
}
