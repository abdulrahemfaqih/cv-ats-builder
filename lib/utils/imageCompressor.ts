/**
 * Mengompresi dan mengubah ukuran file gambar di browser menggunakan HTML Canvas.
 * Menggunakan stepped downsampling (halving) dan anti-aliasing berkualitas tinggi
 * untuk menjaga ketajaman foto profil (rasio 3:4, resolusi hingga 900x1200px)
 * agar foto di dokumen PDF ATS terlihat sangat tajam (1000+ DPI equivalent)
 * tanpa membuat ukuran Base64 terlalu besar untuk localStorage (~90KB-130KB).
 */
export async function compressImageFile(
  file: File,
  maxWidth = 900,
  maxHeight = 1200,
  quality = 0.92
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File yang dipilih bukan berkas gambar"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca berkas gambar"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Gagal memuat gambar"));
      img.onload = () => {
        let targetWidth = img.width;
        let targetHeight = img.height;

        // Hitung skala rasio agar tidak melebihi maxWidth & maxHeight
        if (targetWidth > maxWidth || targetHeight > maxHeight) {
          const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
          targetWidth = Math.round(targetWidth * ratio);
          targetHeight = Math.round(targetHeight * ratio);
        }

        // Jika ukuran asli jauh lebih besar dari target (misal foto kamera HP 12MP/48MP),
        // gunakan stepped downsampling (halving bertahap) agar tidak kehilangan detail tajam
        // akibat interpolasi bilinear satu langkah bawaan browser.
        let currentCanvas = document.createElement("canvas");
        currentCanvas.width = img.width;
        currentCanvas.height = img.height;

        const currentCtx = currentCanvas.getContext("2d");
        if (!currentCtx) {
          reject(new Error("Tidak dapat menginisialisasi canvas context"));
          return;
        }

        currentCtx.drawImage(img, 0, 0);

        let curW = img.width;
        let curH = img.height;

        // Turunkan dimensi bertahap (setengah per iterasi) selama masih 2x lebih besar dari target
        while (curW * 0.5 > targetWidth && curH * 0.5 > targetHeight) {
          const stepCanvas = document.createElement("canvas");
          curW = Math.round(curW * 0.5);
          curH = Math.round(curH * 0.5);
          stepCanvas.width = curW;
          stepCanvas.height = curH;

          const stepCtx = stepCanvas.getContext("2d");
          if (!stepCtx) break;

          stepCtx.imageSmoothingEnabled = true;
          stepCtx.imageSmoothingQuality = "high";
          stepCtx.drawImage(currentCanvas, 0, 0, curW, curH);

          currentCanvas = stepCanvas;
        }

        // Render akhir ke ukuran target dengan latar belakang putih
        // (menghindari background hitam jika user upload PNG transparan)
        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = targetWidth;
        finalCanvas.height = targetHeight;

        const finalCtx = finalCanvas.getContext("2d");
        if (!finalCtx) {
          reject(new Error("Tidak dapat menginisialisasi canvas context"));
          return;
        }

        finalCtx.fillStyle = "#FFFFFF";
        finalCtx.fillRect(0, 0, targetWidth, targetHeight);

        finalCtx.imageSmoothingEnabled = true;
        finalCtx.imageSmoothingQuality = "high";
        finalCtx.drawImage(currentCanvas, 0, 0, targetWidth, targetHeight);

        // Ekspor sebagai JPEG berkualitas tinggi (0.92)
        const dataUrl = finalCanvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
