/**
 * Membersihkan teks input (deskripsi, overview, bullet, dll):
 * - Menghilangkan newline (\r, \n, \t) dan menggantinya dengan satu spasi
 * - Menghapus spasi ganda / berlebih
 * - Memotong spasi di awal dan akhir string
 */
export function cleanCVText(text?: string | null): string {
  if (!text) return "";
  return text
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Membersihkan daftar bullet points:
 * - Menghilangkan enter dan spasi berlebih pada setiap bullet
 * - Menyaring bullet yang kosong
 */
export function cleanBullets(bullets?: string[] | null): string[] {
  if (!bullets || !Array.isArray(bullets)) return [];
  return bullets
    .map((b) => cleanCVText(b))
    .filter((b) => b.length > 0);
}

/**
 * Memformat teks IPK / GPA berdasarkan pilihan bahasa:
 * - Jika bahasa "en", label adalah "GPA"
 * - Jika bahasa "id", label adalah "IPK"
 * - Menghapus prefix "IPK" atau "GPA" yang mungkin sudah diketikkan oleh user agar tidak duplikat
 */
export function formatGpa(
  gpa?: string | null,
  language: "id" | "en" = "id"
): string {
  if (!gpa) return "";
  const cleaned = cleanCVText(gpa);
  if (!cleaned) return "";

  // Hapus prefix seperti "IPK", "GPA", "IPK:", "GPA :", dsb jika ada di teks input
  const stripped = cleaned.replace(/^(ipk|gpa)\s*[:.-]?\s*/i, "").trim();
  const label = language === "en" ? "GPA" : "IPK";

  return stripped ? `${label} ${stripped}` : `${label} ${cleaned}`;
}

