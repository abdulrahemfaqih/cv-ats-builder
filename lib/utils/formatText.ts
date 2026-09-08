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
