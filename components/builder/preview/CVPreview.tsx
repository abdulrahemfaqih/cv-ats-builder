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
} from "@/types/cv";
import { SECTION_TITLES } from "@/lib/constants/defaultCV";

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
        Linkedin :{" "}
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
        Portofolio :{" "}
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
                <div key={edu.id || idx} className="text-[10pt] leading-[1.35]">
                  <div className="flex justify-between items-baseline font-bold text-black">
                    <span className="flex-1 pr-2">{leftTitle}</span>
                    {dateStr && <span className="text-right whitespace-nowrap">{dateStr}</span>}
                  </div>

                  {(edu.major || edu.gpa) && (
                    <div className="italic text-black">
                      {edu.major}
                      {edu.major && edu.gpa && " - "}
                      {edu.gpa && `IPK ${edu.gpa}`}
                    </div>
                  )}

                  {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                    <div className="text-black">
                      <span className="font-bold">
                        {language === "en" ? "Relevant Courses : " : "Mata Kuliah Relevan : "}
                      </span>
                      <span>
                        {Array.isArray(edu.relevantCourses)
                          ? edu.relevantCourses.join(", ")
                          : edu.relevantCourses}
                      </span>
                    </div>
                  )}

                  {edu.description && (
                    <div className="text-black mt-0.5 whitespace-pre-line break-words">
                      {edu.description}
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

              return (
                <div key={item.id || idx} className="text-[10pt] leading-[1.35]">
                  <div className="flex justify-between items-baseline font-bold text-black">
                    <span className="flex-1 pr-2">{leftTitle}</span>
                    {dateStr && <span className="text-right whitespace-nowrap">{dateStr}</span>}
                  </div>

                  {positionTitle && (
                    <div className="italic text-black">{positionTitle}</div>
                  )}

                  {item.bullets && item.bullets.length > 0 && (
                    <ul className="mt-1 space-y-0.5 pl-5 list-disc text-black">
                      {item.bullets
                        .filter((b: string) => b && b.trim() !== "")
                        .map((bullet: string, bIdx: number) => (
                          <li key={bIdx} className="leading-snug whitespace-pre-line break-words">
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
              return (
                <div key={proj.id || idx} className="text-[10pt] leading-[1.35]">
                  <div className="flex justify-between items-baseline text-black">
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
                      <span className="font-bold text-right whitespace-nowrap">
                        {proj.year}
                      </span>
                    )}
                  </div>

                  {proj.descriptionType === "paragraph" ? (
                    proj.description && (
                      <div className="mt-1 text-black whitespace-pre-line break-words text-[10pt] leading-snug">
                        {proj.description}
                      </div>
                    )
                  ) : (
                    proj.bullets &&
                    proj.bullets.length > 0 && (
                      <ul className="mt-1 space-y-0.5 pl-5 list-disc text-black">
                        {proj.bullets
                          .filter((b: string) => b && b.trim() !== "")
                          .map((bullet: string, bIdx: number) => (
                            <li
                              key={bIdx}
                              className="leading-snug whitespace-pre-line break-words"
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
              const skillItems = Array.isArray(skillGroup.skills)
                ? skillGroup.skills.join(", ")
                : skillGroup.skills;
              return (
                <div key={skillGroup.id || idx} className="text-black">
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
                  className="text-[10pt] leading-[1.35] flex justify-between items-baseline text-black"
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
                  {dateStr && <span className="text-right whitespace-nowrap">{dateStr}</span>}
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
                  className="text-[10pt] leading-[1.35] flex justify-between items-baseline text-black"
                >
                  <div className="flex-1 pr-2">
                    <span className="font-bold">{trn.name}</span>
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
                    <span className="text-right whitespace-nowrap">{trn.date}</span>
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
                <div key={ach.id || idx} className="text-[10pt] leading-[1.35] text-black">
                  <div className="flex justify-between items-baseline">
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
                      <span className="text-right whitespace-nowrap">{ach.date}</span>
                    )}
                  </div>
                  {ach.description && (
                    <div className="mt-0.5 text-black whitespace-pre-line break-words">
                      {ach.description}
                    </div>
                  )}
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
    <div className="w-full flex justify-center py-4 px-1">
      {/* A4 Document Container: 210mm x 297mm ratio */}
      <div
        id="cv-ats-document-preview"
        className="w-full max-w-[800px] min-h-[1130px] bg-white text-black shadow-[0_2px_18px_rgba(0,0,0,0.08)] border border-[#D2D2CC] p-8 sm:p-12 font-[Calibri,Arial,Helvetica,sans-serif] box-border break-words"
        style={{ color: "#000000" }}
      >
        {/* HEADER BLOCK */}
        <header className="mb-4">
          <div className="flex items-center justify-center relative">
            {/* Centered Name */}
            <div className="text-center w-full">
              <h1 className="text-[18pt] sm:text-[20pt] font-bold tracking-normal uppercase text-black leading-tight">
                {header.name || "NAMA LENGKAP"}
              </h1>

              {/* Centered Contact Line */}
              {contactParts.length > 0 && (
                <div className="text-[10pt] leading-snug mt-2.5 text-black text-center flex flex-wrap items-center justify-center gap-x-2">
                  {contactParts.map((part, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <span className="text-black">|</span>}
                      {part}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Full-width Divider closing header block */}
          <hr className="w-full border-t border-black mt-3 mb-4" />
        </header>

        {/* OVERVIEW (No header, left-aligned) */}
        {overview && overview.trim() !== "" && (
          <section className="mb-4 text-[10pt] leading-[1.4] text-black text-left break-words">
            <p className="whitespace-pre-line break-words">{overview}</p>
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
