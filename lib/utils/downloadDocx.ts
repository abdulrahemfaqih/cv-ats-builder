import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ExternalHyperlink,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  TabStopType,
  Tab,
  ImageRun,
  UnderlineType,
} from "docx";
import {
  CVData,
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

// Fallback: convert raw image URL or Base64 string to Uint8Array
async function getImageBytes(url: string): Promise<Uint8Array | null> {
  try {
    if (url.startsWith("data:")) {
      const commaIdx = url.indexOf(",");
      if (commaIdx !== -1) {
        const base64 = url.substring(commaIdx + 1);
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      }
    }
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (e) {
    console.warn("Gagal memuat gambar untuk ekspor Word:", e);
    return null;
  }
}

// Crop image with object-fit: cover into 3:4 aspect ratio (180x240px) to prevent distortion
async function getCoverCroppedImageBytes(
  url: string,
  targetWidth = 180,
  targetHeight = 240
): Promise<Uint8Array | null> {
  if (typeof window === "undefined") return null;

  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          getImageBytes(url).then(resolve);
          return;
        }

        const srcAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let sx = 0,
          sy = 0,
          sWidth = img.width,
          sHeight = img.height;

        if (srcAspect > targetAspect) {
          // Source is wider -> crop horizontally from center
          sWidth = img.height * targetAspect;
          sx = (img.width - sWidth) / 2;
        } else {
          // Source is taller -> crop vertically from center
          sHeight = img.width / targetAspect;
          sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(
          img,
          sx,
          sy,
          sWidth,
          sHeight,
          0,
          0,
          targetWidth,
          targetHeight
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              getImageBytes(url).then(resolve);
              return;
            }
            blob.arrayBuffer().then((buf) => {
              resolve(new Uint8Array(buf));
            });
          },
          "image/jpeg",
          0.92
        );
      } catch (e) {
        console.warn("Canvas crop error, fallback to raw image:", e);
        getImageBytes(url).then(resolve);
      }
    };
    img.onerror = () => {
      getImageBytes(url).then(resolve);
    };
    img.src = url;
  });
}

export async function exportCVToDocx(
  data: CVData,
  language: "id" | "en",
  title?: string
) {
  if (typeof window === "undefined") return;

  const { header, overview, sections } = data;
  const titles = SECTION_TITLES[language] || SECTION_TITLES.id;

  const settings = data.settings || { fontFamily: "arial", spacing: "normal" };
  const font = ATS_FONTS[settings.fontFamily || "arial"] || ATS_FONTS.arial;
  const spacing = ATS_SPACINGS[settings.spacing || "normal"] || ATS_SPACINGS.normal;

  // Address parts (Kecamatan opsional dengan prefix Kec., Kabupaten & Provinsi tanpa prefix Kab./Prov.)
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
  const addressString = addressParts.join(", ");

  // Build contact nodes
  const contactItems: Array<{
    type: "text" | "link";
    prefix?: string;
    text: string;
    url?: string;
  }> = [];

  if (addressString) {
    contactItems.push({ type: "text", text: addressString });
  }

  if (header.linkedin) {
    const clean = header.linkedin.replace(/^https?:\/\//i, "");
    contactItems.push({
      type: "link",
      prefix: "Linkedin: ",
      text: clean,
      url: header.linkedin.startsWith("http")
        ? header.linkedin
        : `https://${header.linkedin}`,
    });
  }

  if (header.github) {
    const clean = header.github.replace(/^https?:\/\//i, "");
    contactItems.push({
      type: "link",
      prefix: "GitHub: ",
      text: clean,
      url: header.github.startsWith("http")
        ? header.github
        : `https://${header.github}`,
    });
  }

  if (header.email) {
    contactItems.push({
      type: "link",
      text: header.email,
      url: `mailto:${header.email}`,
    });
  }

  if (header.phone) {
    contactItems.push({ type: "text", text: header.phone });
  }

  if (header.portfolio) {
    const clean = header.portfolio.replace(/^https?:\/\//i, "");
    contactItems.push({
      type: "link",
      prefix: "Portofolio: ",
      text: clean,
      url: header.portfolio.startsWith("http")
        ? header.portfolio
        : `https://${header.portfolio}`,
    });
  }

  // Helper to build contact runs (with " | " separator)
  const buildContactRuns = (): Array<TextRun | ExternalHyperlink> => {
    const runs: Array<TextRun | ExternalHyperlink> = [];
    contactItems.forEach((item, idx) => {
      if (idx > 0) {
        runs.push(new TextRun({ text: " | ", size: 19, color: "555555" }));
      }
      if (item.prefix) {
        runs.push(
          new TextRun({ text: item.prefix, size: 19, color: "000000" })
        );
      }
      if (item.type === "link" && item.url) {
        runs.push(
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: item.text,
                size: 19,
                color: "0563C1",
                underline: { type: UnderlineType.SINGLE },
              }),
            ],
            link: item.url,
          })
        );
      } else {
        runs.push(new TextRun({ text: item.text, size: 19, color: "000000" }));
      }
    });
    return runs;
  };

  const docChildren: (Paragraph | Table)[] = [];

  // Check photo
  const hasPhoto = Boolean(header.useProfilePhoto && header.photoUrl?.trim());
  let photoBytes: Uint8Array | null = null;
  if (hasPhoto) {
    photoBytes = await getCoverCroppedImageBytes(header.photoUrl!);
  }

  if (hasPhoto && photoBytes) {
    // 2-column borderless table: Photo on left, Name & Contact on right
    const noBorder = {
      style: BorderStyle.NONE,
      size: 0,
      color: "auto",
    };

    const headerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: noBorder,
        bottom: noBorder,
        left: noBorder,
        right: noBorder,
        insideHorizontal: noBorder,
        insideVertical: noBorder,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 1400, type: WidthType.DXA },
              children: [
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: photoBytes,
                      transformation: { width: 60, height: 80 },
                      type: "jpg",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 8900, type: WidthType.DXA },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: (header.name || "NAMA LENGKAP").toUpperCase(),
                      bold: true,
                      size: 36, // 18pt
                      color: "000000",
                    }),
                  ],
                  spacing: { before: 0, after: 40 },
                }),
                new Paragraph({
                  children: buildContactRuns(),
                  spacing: { before: 0, after: 20 },
                }),
              ],
            }),
          ],
        }),
      ],
    });

    docChildren.push(headerTable);

    // Slim divider line right beneath photo header
    docChildren.push(
      new Paragraph({
        border: {
          bottom: {
            color: "000000",
            space: 2,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        children: [new TextRun({ text: "", size: 2 })],
        spacing: { before: 20, after: 60 },
      })
    );
  } else {
    // Standard Centered Header (ATS Recommended)
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: (header.name || "NAMA LENGKAP").toUpperCase(),
            bold: true,
            size: 36, // 18pt
            color: "000000",
          }),
        ],
        spacing: { before: 0, after: 30 },
      })
    );

    if (contactItems.length > 0) {
      // Put the divider line directly under the contact paragraph to eliminate extra vertical gap
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: {
            bottom: {
              color: "000000",
              space: 4,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
          children: buildContactRuns(),
          spacing: { before: 0, after: 60 },
        })
      );
    } else {
      // If no contact info, add divider below name
      docChildren.push(
        new Paragraph({
          border: {
            bottom: {
              color: "000000",
              space: 4,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
          children: [new TextRun({ text: "", size: 2 })],
          spacing: { before: 0, after: 60 },
        })
      );
    }
  }

  // Overview / Ringkasan Profil
  if (overview && overview.trim()) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.BOTH,
        children: [
          new TextRun({
            text: cleanCVText(overview),
            size: 20, // 10pt
            color: "000000",
          }),
        ],
        spacing: { before: 20, after: 60, line: 240 },
      })
    );
  }

  // Render Section Entries
  const renderSection = (
    secType: string,
    entries: CVEntry[]
  ): Paragraph[] => {
    if (!entries || entries.length === 0) return [];
    const paragraphs: Paragraph[] = [];

    switch (secType) {
      case "education": {
        const eduEntries = entries as EducationEntry[];
        eduEntries.forEach((edu) => {
          if (!edu.institution && !edu.major) return;

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

          const dateStr = [edu.startYear, edu.endYear]
            .filter(Boolean)
            .join(" - ");

          const coursesStr = cleanCVText(
            Array.isArray(edu.relevantCourses)
              ? edu.relevantCourses.join(", ")
              : edu.relevantCourses
          );

          // Line 1: Left Title & Right Date
          paragraphs.push(
            new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: 10300 }],
              children: [
                new TextRun({ text: leftTitle, bold: true, size: 20 }),
                ...(dateStr
                  ? [
                      new TextRun({ children: [new Tab()] }),
                      new TextRun({ text: dateStr, bold: true, size: 19 }),
                    ]
                  : []),
              ],
              spacing: { before: 60, after: 15 },
              keepNext: true,
            })
          );

          // Line 2: Major & GPA (Italic)
          if (edu.major || edu.gpa) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${edu.major || ""}${
                      edu.major && edu.gpa ? " - " : ""
                    }${edu.gpa ? formatGpa(edu.gpa, language) : ""}`,
                    italics: true,
                    size: 19,
                  }),
                ],
                spacing: { before: 0, after: 15 },
              })
            );
          }

          // Relevant Courses
          if (coursesStr) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text:
                      language === "en"
                        ? "Relevant Courses : "
                        : "Mata Kuliah Relevan : ",
                    bold: true,
                    size: 19,
                  }),
                  new TextRun({ text: coursesStr, size: 19 }),
                ],
                spacing: { before: 0, after: 15 },
              })
            );
          }

          // Description
          if (edu.description) {
            paragraphs.push(
              new Paragraph({
                alignment: AlignmentType.BOTH,
                children: [
                  new TextRun({
                    text: cleanCVText(edu.description),
                    size: 19,
                  }),
                ],
                spacing: { before: 0, after: 40, line: 240 },
              })
            );
          }
        });
        break;
      }

      case "work":
      case "organization": {
        const orgOrWorkEntries = entries as (WorkEntry | OrganizationEntry)[];
        orgOrWorkEntries.forEach((item) => {
          const name = "company" in item ? item.company : item.organization;
          if (!name && !item.position) return;

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
            item.isCurrent
              ? language === "en"
                ? "Present"
                : "Sekarang"
              : item.endDate,
          ]
            .filter(Boolean)
            .join(" - ");

          const typeSuffix =
            "employmentType" in item
              ? item.employmentType
              : "roleType" in item
              ? item.roleType
              : undefined;

          const positionTitle = [item.position, typeSuffix]
            .filter(Boolean)
            .join(" - ");

          const cleanedBullets = cleanBullets(item.bullets);

          // Line 1: Left Title & Right Date
          paragraphs.push(
            new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: 10300 }],
              children: [
                new TextRun({ text: leftTitle, bold: true, size: 20 }),
                ...(dateStr
                  ? [
                      new TextRun({ children: [new Tab()] }),
                      new TextRun({ text: dateStr, bold: true, size: 19 }),
                    ]
                  : []),
              ],
              spacing: { before: 60, after: 15 },
              keepNext: true,
            })
          );

          // Line 2: Position (Italic)
          if (positionTitle) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: positionTitle,
                    italics: true,
                    size: 19,
                  }),
                ],
                spacing: { before: 0, after: 15 },
              })
            );
          }

          // Bullets: Compact ATS hanging indent (prevents large Word list indent)
          cleanedBullets.forEach((bullet) => {
            paragraphs.push(
              new Paragraph({
                indent: { left: 240, hanging: 140 },
                alignment: AlignmentType.BOTH,
                children: [
                  new TextRun({ text: "•  ", size: 19 }),
                  new TextRun({ text: bullet, size: 19 }),
                ],
                spacing: { before: 10, after: 10, line: 240 },
              })
            );
          });
        });
        break;
      }

      case "project": {
        const projEntries = entries as ProjectEntry[];
        projEntries.forEach((proj) => {
          if (!proj.name) return;
          const cleanedBullets = cleanBullets(proj.bullets);

          const hasLink = Boolean(proj.link && proj.link.trim());
          const isBeside = Boolean(hasLink && proj.linkPosition === "beside");
          const rawLink = proj.link?.trim() || "";
          const href = rawLink.startsWith("http")
            ? rawLink
            : `https://${rawLink}`;
          const clean = rawLink.replace(/^https?:\/\//i, "");

          const line1Children: Array<TextRun | ExternalHyperlink> = [
            new TextRun({ text: proj.name, bold: true, size: 20 }),
          ];

          if (isBeside) {
            line1Children.push(
              new TextRun({ text: " | ", color: "555555", size: 19 }),
              new ExternalHyperlink({
                children: [
                  new TextRun({
                    text: clean,
                    size: 19,
                    color: "0563C1",
                    underline: { type: UnderlineType.SINGLE },
                  }),
                ],
                link: href,
              })
            );
          }

          if (proj.year) {
            line1Children.push(
              new TextRun({ children: [new Tab()] }),
              new TextRun({ text: proj.year, bold: true, size: 19 })
            );
          }

          // Line 1: Project Name & Year
          paragraphs.push(
            new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: 10300 }],
              children: line1Children,
              spacing: { before: 60, after: 15 },
              keepNext: true,
            })
          );

          // Line 2: Link
          if (hasLink && !isBeside) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "Link : ", size: 19 }),
                  new ExternalHyperlink({
                    children: [
                      new TextRun({
                        text: clean,
                        size: 19,
                        color: "0563C1",
                        underline: { type: UnderlineType.SINGLE },
                      }),
                    ],
                    link: href,
                  }),
                ],
                spacing: { before: 0, after: 15 },
              })
            );
          }

          // Description or Bullets
          if (proj.descriptionType === "paragraph" && proj.description) {
            paragraphs.push(
              new Paragraph({
                alignment: AlignmentType.BOTH,
                children: [
                  new TextRun({
                    text: cleanCVText(proj.description),
                    size: 19,
                  }),
                ],
                spacing: { before: 0, after: 30, line: 240 },
              })
            );
          } else {
            cleanedBullets.forEach((bullet) => {
              paragraphs.push(
                new Paragraph({
                  indent: { left: 240, hanging: 140 },
                  alignment: AlignmentType.BOTH,
                  children: [
                    new TextRun({ text: "•  ", size: 19 }),
                    new TextRun({ text: bullet, size: 19 }),
                  ],
                  spacing: { before: 10, after: 10, line: 240 },
                })
              );
            });
          }
        });
        break;
      }

      case "skills": {
        const skillEntries = entries as SkillGroupEntry[];
        skillEntries.forEach((skillGroup) => {
          if (!skillGroup.groupName) return;
          const skillItems = cleanCVText(
            Array.isArray(skillGroup.skills)
              ? skillGroup.skills.join(", ")
              : skillGroup.skills
          );

          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${skillGroup.groupName} : `,
                  bold: true,
                  size: 19,
                }),
                new TextRun({ text: skillItems, size: 19 }),
              ],
              spacing: { before: 15, after: 20 },
            })
          );
        });
        break;
      }

      case "certification": {
        const certEntries = entries as CertificationEntry[];
        certEntries.forEach((cert) => {
          if (!cert.name) return;
          const dateStr = cert.isLifetime
            ? `${cert.issueDate || ""} (${
                language === "en" ? "Lifetime" : "Seumur Hidup"
              })`
            : [cert.issueDate, cert.expiryDate].filter(Boolean).join(" - ");

          const leftTitle = [cert.name, cert.issuer].filter(Boolean).join(" - ");

          const hasLink = Boolean(cert.link && cert.link.trim());
          const isBeside = Boolean(hasLink && cert.linkPosition === "beside");
          const rawLink = cert.link?.trim() || "";
          const href = rawLink.startsWith("http")
            ? rawLink
            : `https://${rawLink}`;
          const clean = rawLink.replace(/^https?:\/\//i, "");

          const line1Children: Array<TextRun | ExternalHyperlink> = [
            new TextRun({ text: leftTitle, bold: true, size: 20 }),
          ];

          if (isBeside) {
            line1Children.push(
              new TextRun({ text: " | ", color: "555555", size: 19 }),
              new ExternalHyperlink({
                children: [
                  new TextRun({
                    text: clean,
                    size: 19,
                    color: "0563C1",
                    underline: { type: UnderlineType.SINGLE },
                  }),
                ],
                link: href,
              })
            );
          }

          if (dateStr) {
            line1Children.push(
              new TextRun({ children: [new Tab()] }),
              new TextRun({ text: dateStr, bold: true, size: 19 })
            );
          }

          paragraphs.push(
            new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: 10300 }],
              children: line1Children,
              spacing: { before: 50, after: 15 },
              keepNext: true,
            })
          );

          if (hasLink && !isBeside) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "Link : ", size: 19 }),
                  new ExternalHyperlink({
                    children: [
                      new TextRun({
                        text: clean,
                        size: 19,
                        color: "0563C1",
                        underline: { type: UnderlineType.SINGLE },
                      }),
                    ],
                    link: href,
                  }),
                ],
                spacing: { before: 0, after: 20 },
              })
            );
          }
        });
        break;
      }

      case "training": {
        const trainEntries = entries as TrainingEntry[];
        trainEntries.forEach((trn) => {
          if (!trn.name) return;
          const leftTitle = [trn.name, trn.organizer]
            .filter(Boolean)
            .join(" - ");

          const hasLink = Boolean(trn.link && trn.link.trim());
          const isBeside = Boolean(hasLink && trn.linkPosition === "beside");
          const rawLink = trn.link?.trim() || "";
          const href = rawLink.startsWith("http")
            ? rawLink
            : `https://${rawLink}`;
          const clean = rawLink.replace(/^https?:\/\//i, "");

          const line1Children: Array<TextRun | ExternalHyperlink> = [
            new TextRun({ text: leftTitle, bold: true, size: 20 }),
          ];

          if (isBeside) {
            line1Children.push(
              new TextRun({ text: " | ", color: "555555", size: 19 }),
              new ExternalHyperlink({
                children: [
                  new TextRun({
                    text: clean,
                    size: 19,
                    color: "0563C1",
                    underline: { type: UnderlineType.SINGLE },
                  }),
                ],
                link: href,
              })
            );
          }

          if (trn.date) {
            line1Children.push(
              new TextRun({ children: [new Tab()] }),
              new TextRun({ text: trn.date, bold: true, size: 19 })
            );
          }

          paragraphs.push(
            new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: 10300 }],
              children: line1Children,
              spacing: { before: 50, after: 15 },
              keepNext: true,
            })
          );

          if (hasLink && !isBeside) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "Link : ", size: 19 }),
                  new ExternalHyperlink({
                    children: [
                      new TextRun({
                        text: clean,
                        size: 19,
                        color: "0563C1",
                        underline: { type: UnderlineType.SINGLE },
                      }),
                    ],
                    link: href,
                  }),
                ],
                spacing: { before: 0, after: 20 },
              })
            );
          }
        });
        break;
      }

      case "achievement": {
        const achEntries = entries as AchievementEntry[];
        achEntries.forEach((ach) => {
          if (!ach.name) return;
          const leftTitle = [ach.name, ach.context].filter(Boolean).join(" - ");

          const hasLink = Boolean(ach.link && ach.link.trim());
          const isBeside = Boolean(hasLink && ach.linkPosition === "beside");
          const rawLink = ach.link?.trim() || "";
          const href = rawLink.startsWith("http")
            ? rawLink
            : `https://${rawLink}`;
          const clean = rawLink.replace(/^https?:\/\//i, "");

          const line1Children: Array<TextRun | ExternalHyperlink> = [
            new TextRun({ text: leftTitle, bold: true, size: 20 }),
          ];

          if (isBeside) {
            line1Children.push(
              new TextRun({ text: " | ", color: "555555", size: 19 }),
              new ExternalHyperlink({
                children: [
                  new TextRun({
                    text: clean,
                    size: 19,
                    color: "0563C1",
                    underline: { type: UnderlineType.SINGLE },
                  }),
                ],
                link: href,
              })
            );
          }

          if (ach.date) {
            line1Children.push(
              new TextRun({ children: [new Tab()] }),
              new TextRun({ text: ach.date, bold: true, size: 19 })
            );
          }

          paragraphs.push(
            new Paragraph({
              tabStops: [{ type: TabStopType.RIGHT, position: 10300 }],
              children: line1Children,
              spacing: { before: 50, after: 15 },
              keepNext: true,
            })
          );

          if (hasLink && !isBeside) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "Link : ", size: 19 }),
                  new ExternalHyperlink({
                    children: [
                      new TextRun({
                        text: clean,
                        size: 19,
                        color: "0563C1",
                        underline: { type: UnderlineType.SINGLE },
                      }),
                    ],
                    link: href,
                  }),
                ],
                spacing: { before: 0, after: 15 },
              })
            );
          }

          if (ach.description) {
            paragraphs.push(
              new Paragraph({
                alignment: AlignmentType.BOTH,
                children: [
                  new TextRun({
                    text: cleanCVText(ach.description),
                    size: 19,
                  }),
                ],
                spacing: { before: 0, after: 30, line: 240 },
              })
            );
          }
        });
        break;
      }

      case "languages": {
        const langEntries = entries as LanguageEntry[];
        langEntries.forEach((lang) => {
          if (!lang.language) return;
          const details = [
            lang.proficiency ? cleanCVText(lang.proficiency) : "",
            lang.info ? `(${cleanCVText(lang.info)})` : "",
          ]
            .filter(Boolean)
            .join(" ");

          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${cleanCVText(lang.language)}${
                    details ? " : " : ""
                  }`,
                  bold: true,
                  size: 19,
                }),
                ...(details
                  ? [new TextRun({ text: details, size: 19 })]
                  : []),
              ],
              spacing: { before: 15, after: 20 },
            })
          );
        });
        break;
      }

      default:
        break;
    }

    return paragraphs;
  };

  // Process all sections sorted by order
  const validSections = sections
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((sec) => sec.entries && sec.entries.length > 0);

  validSections.forEach((sec, secIdx) => {
    const sectionHeading = titles[sec.type] || sec.type.toUpperCase();
    const entryParagraphs = renderSection(sec.type, sec.entries);
    if (entryParagraphs.length === 0) return;

    // First section has tighter top spacing if preceded by header/overview
    const topSpacing = secIdx === 0 && !overview ? 40 : spacing.docxBefore;

    // Section Header with border bottom divider
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: sectionHeading,
            bold: true,
            size: 22, // 11pt
            color: "000000",
          }),
        ],
        border: {
          bottom: {
            color: "000000",
            space: 2,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        spacing: { before: topSpacing, after: 40 },
        keepNext: true,
      })
    );

    docChildren.push(...entryParagraphs);
  });

  // Create Word Document with A4 page and standard ATS margins
  const doc = new Document({
    title: `${header.name || "CV"} - Cevio ATS Resume`,
    description: "Generated by Cevio ATS Resume Builder",
    styles: {
      default: {
        document: {
          run: {
            font: font.docxFont,
            size: 19, // 9.5pt default
            color: "000000",
          },
          paragraph: {
            spacing: {
              line: spacing.docxLine,
              before: 0,
              after: spacing.docxAfter,
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 width in twips (210mm)
              height: 16838, // A4 height in twips (297mm)
            },
            margin: {
              top: 720, // 0.5 inch / 36pt
              bottom: 720,
              left: 800, // ~40pt
              right: 800,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  // Export to Blob and trigger browser download
  try {
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);

    // Sanitize file name
    const rawName = data.header.name || title || "CV";
    const sanitized = rawName
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_+/g, "_");
    const filename = `${sanitized}_ATS.docx`;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  } catch (error) {
    console.error("Gagal membuat file DOCX Word:", error);
    throw error;
  }
}
