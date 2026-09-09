import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Link,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
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
import { cleanCVText, cleanBullets } from "@/lib/utils/formatText";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#000000",
    backgroundColor: "#FFFFFF",
    lineHeight: 1.3,
  },
  headerContainer: {
    marginBottom: 8,
    position: "relative",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerRowWithPhoto: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  photoContainer: {
    width: 60,
    height: 80,
    marginRight: 14,
    borderRadius: 1,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#CCCCCC",
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  titleWrapper: {
    width: "100%",
    textAlign: "center",
  },
  titleWrapperWithPhoto: {
    flex: 1,
    textAlign: "left",
    justifyContent: "center",
  },
  fullName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 1.15,
  },
  fullNameWithPhoto: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    textAlign: "left",
    marginBottom: 6,
    lineHeight: 1.15,
  },
  contactLine: {
    fontSize: 9.5,
    textAlign: "center",
    color: "#000000",
    lineHeight: 1.35,
  },
  contactLineWithPhoto: {
    fontSize: 9.5,
    textAlign: "left",
    color: "#000000",
    lineHeight: 1.35,
  },
  link: {
    color: "#0563C1",
    textDecoration: "underline",
    fontFamily: "Helvetica",
  },
  headerDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginTop: 8,
    marginBottom: 8,
  },
  overviewParagraph: {
    fontSize: 10,
    textAlign: "justify",
    marginBottom: 10,
    lineHeight: 1.35,
  },
  sectionContainer: {
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    textAlign: "left",
  },
  sectionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginTop: 2,
    marginBottom: 6,
  },
  entryRow: {
    marginBottom: 6,
  },
  firstLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  firstLineTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    flex: 1,
    paddingRight: 8,
  },
  trainingLineTitle: {
    fontFamily: "Helvetica",
    fontSize: 10,
    flex: 1,
    paddingRight: 8,
  },
  firstLineDate: {
    fontSize: 9.5,
    textAlign: "right",
    flexShrink: 0,
    marginTop: 0.5,
  },
  secondLineItalic: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 9.5,
    marginTop: 1,
  },
  coursesLine: {
    fontSize: 9.5,
    marginTop: 1.5,
    textAlign: "justify",
  },
  coursesLabelBold: {
    fontFamily: "Helvetica-Bold",
  },
  entryDescription: {
    fontSize: 9.5,
    marginTop: 1,
    textAlign: "justify",
    lineHeight: 1.3,
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 2,
    paddingLeft: 10,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.3,
    textAlign: "justify",
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 2.5,
  },
  skillGroupName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
  },
  skillItems: {
    fontSize: 9.5,
    flex: 1,
  },
});

interface CVPdfDocumentProps {
  data: CVData;
  language: "id" | "en";
}

export function CVPdfDocument({ data, language }: CVPdfDocumentProps) {
  const { header, overview, sections } = data;
  const titles = SECTION_TITLES[language] || SECTION_TITLES.id;

  // Address parts
  const addressParts = [
    header.address.kecamatan ? `Kec. ${header.address.kecamatan}` : "",
    header.address.kabupaten ? `Kab. ${header.address.kabupaten}` : "",
    header.address.provinsi ? `Prov. ${header.address.provinsi}` : "",
  ].filter(Boolean);

  const addressString = addressParts.join(", ");

  // Build contact nodes
  const contactElements: Array<{
    type: "text" | "link";
    text: string;
    url?: string;
  }> = [];

  if (addressString) {
    contactElements.push({ type: "text", text: addressString });
  }

  if (header.linkedin) {
    const clean = header.linkedin.replace(/^https?:\/\//i, "");
    contactElements.push({
      type: "link",
      text: `Linkedin: ${clean}`,
      url: header.linkedin.startsWith("http")
        ? header.linkedin
        : `https://${header.linkedin}`,
    });
  }

  if (header.email) {
    contactElements.push({
      type: "link",
      text: header.email,
      url: `mailto:${header.email}`,
    });
  }

  if (header.phone) {
    contactElements.push({ type: "text", text: header.phone });
  }

  if (header.portfolio) {
    const clean = header.portfolio.replace(/^https?:\/\//i, "");
    contactElements.push({
      type: "link",
      text: `Portofolio: ${clean}`,
      url: header.portfolio.startsWith("http")
        ? header.portfolio
        : `https://${header.portfolio}`,
    });
  }

  const renderSectionPdf = (sectionType: string, entries: CVEntry[]) => {
    if (!entries || entries.length === 0) return null;

    switch (sectionType) {
      case "education": {
        const eduEntries = entries as EducationEntry[];
        return (
          <View>
            {eduEntries.map((edu, idx) => {
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

              const dateStr = [edu.startYear, edu.endYear]
                .filter(Boolean)
                .join(" - ");

              const coursesStr = cleanCVText(
                Array.isArray(edu.relevantCourses)
                  ? edu.relevantCourses.join(", ")
                  : edu.relevantCourses
              );

              return (
                <View key={edu.id || idx} style={styles.entryRow} wrap={false}>
                  <View style={styles.firstLine}>
                    <Text style={styles.firstLineTitle}>{leftTitle}</Text>
                    {dateStr ? (
                      <Text style={styles.firstLineDate}>{dateStr}</Text>
                    ) : null}
                  </View>

                  {(edu.major || edu.gpa) && (
                    <Text style={styles.secondLineItalic}>
                      {edu.major}
                      {edu.major && edu.gpa ? " - " : ""}
                      {edu.gpa ? `IPK ${edu.gpa}` : ""}
                    </Text>
                  )}

                  {coursesStr ? (
                    <Text style={styles.coursesLine}>
                      <Text style={styles.coursesLabelBold}>
                        {language === "en"
                          ? "Relevant Courses : "
                          : "Mata Kuliah Relevan : "}
                      </Text>
                      <Text>{coursesStr}</Text>
                    </Text>
                  ) : null}

                  {edu.description ? (
                    <Text style={styles.entryDescription}>
                      {cleanCVText(edu.description)}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        );
      }

      case "work":
      case "organization": {
        const orgOrWorkEntries = entries as (WorkEntry | OrganizationEntry)[];
        return (
          <View>
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

              return (
                <View key={item.id || idx} style={styles.entryRow} wrap={false}>
                  <View style={styles.firstLine}>
                    <Text style={styles.firstLineTitle}>{leftTitle}</Text>
                    {dateStr ? (
                      <Text style={styles.firstLineDate}>{dateStr}</Text>
                    ) : null}
                  </View>

                  {positionTitle ? (
                    <Text style={styles.secondLineItalic}>
                      {positionTitle}
                    </Text>
                  ) : null}

                  {cleanedBullets.map((bullet, bIdx) => (
                    <View key={bIdx} style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        );
      }

      case "project": {
        const projEntries = entries as ProjectEntry[];
        return (
          <View>
            {projEntries.map((proj, idx) => {
              if (!proj.name) return null;
              const cleanedBullets = cleanBullets(proj.bullets);
              return (
                <View key={proj.id || idx} style={styles.entryRow} wrap={false}>
                  <View style={styles.firstLine}>
                    <Text style={styles.firstLineTitle}>
                      {proj.name}
                      {proj.link ? " (" : ""}
                      {proj.link ? (
                        <Link
                          src={
                            proj.link.trim().startsWith("http")
                              ? proj.link.trim()
                              : `https://${proj.link.trim()}`
                          }
                          style={styles.link}
                        >
                          Link
                        </Link>
                      ) : null}
                      {proj.link ? ")" : ""}
                    </Text>
                    {proj.year ? (
                      <Text style={styles.firstLineDate}>{proj.year}</Text>
                    ) : null}
                  </View>

                  {proj.descriptionType === "paragraph" ? (
                    proj.description ? (
                      <Text style={styles.entryDescription}>
                        {cleanCVText(proj.description)}
                      </Text>
                    ) : null
                  ) : (
                    cleanedBullets.map((bullet, bIdx) => (
                      <View key={bIdx} style={styles.bulletRow}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))
                  )}
                </View>
              );
            })}
          </View>
        );
      }

      case "skills": {
        const skillEntries = entries as SkillGroupEntry[];
        return (
          <View>
            {skillEntries.map((skillGroup, idx) => {
              if (!skillGroup.groupName) return null;
              const skillItems = cleanCVText(
                Array.isArray(skillGroup.skills)
                  ? skillGroup.skills.join(", ")
                  : skillGroup.skills
              );
              return (
                <View key={skillGroup.id || idx} style={styles.skillRow} wrap={false}>
                  <Text style={styles.skillGroupName}>
                    {skillGroup.groupName} :{" "}
                  </Text>
                  <Text style={styles.skillItems}>{skillItems}</Text>
                </View>
              );
            })}
          </View>
        );
      }

      case "certification": {
        const certEntries = entries as CertificationEntry[];
        return (
          <View>
            {certEntries.map((cert, idx) => {
              if (!cert.name) return null;
              const dateStr = cert.isLifetime
                ? `${cert.issueDate || ""} (${
                    language === "en" ? "Lifetime" : "Seumur Hidup"
                  })`
                : [cert.issueDate, cert.expiryDate].filter(Boolean).join(" - ");

              return (
                <View key={cert.id || idx} style={styles.entryRow} wrap={false}>
                  <View style={styles.firstLine}>
                    <Text style={styles.firstLineTitle}>
                      {cert.name}
                      {cert.link ? " (" : ""}
                      {cert.link ? (
                        <Link
                          src={
                            cert.link.trim().startsWith("http")
                              ? cert.link.trim()
                              : `https://${cert.link.trim()}`
                          }
                          style={styles.link}
                        >
                          Link
                        </Link>
                      ) : null}
                      {cert.link ? ")" : ""}
                      {cert.issuer ? ` - ${cert.issuer}` : ""}
                    </Text>
                    {dateStr ? (
                      <Text style={styles.firstLineDate}>{dateStr}</Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        );
      }

      case "training": {
        const trainEntries = entries as TrainingEntry[];
        return (
          <View>
            {trainEntries.map((trn, idx) => {
              if (!trn.name) return null;
              return (
                <View key={trn.id || idx} style={styles.entryRow} wrap={false}>
                  <View style={styles.firstLine}>
                    <Text style={styles.trainingLineTitle}>
                      {trn.name}
                      {trn.link ? " (" : ""}
                      {trn.link ? (
                        <Link
                          src={
                            trn.link.trim().startsWith("http")
                              ? trn.link.trim()
                              : `https://${trn.link.trim()}`
                          }
                          style={styles.link}
                        >
                          Link
                        </Link>
                      ) : null}
                      {trn.link ? ")" : ""}
                      {trn.organizer ? ` - ${trn.organizer}` : ""}
                    </Text>
                    {trn.date ? (
                      <Text style={styles.firstLineDate}>{trn.date}</Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        );
      }

      case "achievement": {
        const achEntries = entries as AchievementEntry[];
        return (
          <View>
            {achEntries.map((ach, idx) => {
              if (!ach.name) return null;
              return (
                <View key={ach.id || idx} style={styles.entryRow} wrap={false}>
                  <View style={styles.firstLine}>
                    <Text style={styles.firstLineTitle}>
                      {ach.name}
                      {ach.link ? " (" : ""}
                      {ach.link ? (
                        <Link
                          src={
                            ach.link.trim().startsWith("http")
                              ? ach.link.trim()
                              : `https://${ach.link.trim()}`
                          }
                          style={styles.link}
                        >
                          Link
                        </Link>
                      ) : null}
                      {ach.link ? ")" : ""}
                      {ach.context ? ` - ${ach.context}` : ""}
                    </Text>
                    {ach.date ? (
                      <Text style={styles.firstLineDate}>{ach.date}</Text>
                    ) : null}
                  </View>
                  {ach.description ? (
                    <Text style={styles.entryDescription}>
                      {cleanCVText(ach.description)}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        );
      }

      case "languages": {
        const langEntries = entries as LanguageEntry[];
        return (
          <View>
            {langEntries.map((lang, idx) => {
              if (!lang.language) return null;
              const details = [
                lang.proficiency ? cleanCVText(lang.proficiency) : "",
                lang.info ? `(${cleanCVText(lang.info)})` : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <View key={lang.id || idx} style={styles.skillRow} wrap={false}>
                  <Text style={styles.skillGroupName}>
                    {cleanCVText(lang.language)}
                    {details ? " : " : ""}
                  </Text>
                  {details ? (
                    <Text style={styles.skillItems}>{details}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        );
      }

      default:
        return null;
    }
  };

  const hasPhoto = Boolean(header.useProfilePhoto && header.photoUrl?.trim());

  return (
    <Document title={`${header.name || "CV"} - Cevio ATS Resume`}>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={hasPhoto ? styles.headerRowWithPhoto : styles.headerRow}>
            {hasPhoto && (
              <View style={styles.photoContainer}>
                <Image src={header.photoUrl!} style={styles.photo} />
              </View>
            )}

            {/* Name and Contact */}
            <View style={hasPhoto ? styles.titleWrapperWithPhoto : styles.titleWrapper}>
              <Text style={hasPhoto ? styles.fullNameWithPhoto : styles.fullName}>
                {header.name || "NAMA LENGKAP"}
              </Text>

              {/* Contact line */}
              {contactElements.length > 0 && (
                <Text style={hasPhoto ? styles.contactLineWithPhoto : styles.contactLine}>
                  {contactElements.map((el, i) => (
                    <React.Fragment key={i}>{i > 0 && " | "}{el.type === "link" && el.url ? (
                      <Link src={el.url} style={styles.link}>{el.text}</Link>
                    ) : (
                      el.text
                    )}</React.Fragment>
                  ))}
                </Text>
              )}
            </View>
          </View>

          {/* Full-width header divider */}
          <View style={styles.headerDivider} />
        </View>

        {/* OVERVIEW */}
        {overview && overview.trim() !== "" ? (
          <Text style={styles.overviewParagraph}>{cleanCVText(overview)}</Text>
        ) : null}

        {/* SECTIONS */}
        {sections
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((sec) => {
            if (!sec.entries || sec.entries.length === 0) return null;
            const title = titles[sec.type] || sec.type.toUpperCase();
            const content = renderSectionPdf(sec.type, sec.entries);
            if (!content) return null;

            return (
              <View key={sec.id} style={styles.sectionContainer}>
                <View minPresenceAhead={35}>
                  <Text style={styles.sectionHeader}>{title}</Text>
                  <View style={styles.sectionDivider} />
                </View>
                {content}
              </View>
            );
          })}
      </Page>
    </Document>
  );
}
