/**
 * Chronotype media helpers.
 *
 * The carousel + result imagery lives in `public/chronotype_media/{lark|eagle|owl}/`.
 * These helpers resolve the folder + file list for a chronotype and (for the
 * PDF, which needs embedded images) load files into base64 data URIs at runtime.
 */

const EAGLE_FILES = [
  "1.jpg", "2.jpg", "3.jpg", "3a.jpg", "4.jpg", "5.jpg", "6.jpg",
  "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg",
];

const LARK_FILES = [
  "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg",
  "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg",
];

const OWL_FILES = LARK_FILES;

const VERTICAL_EAGLE_FILES = [
  "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg",
  "9.jpg", "10.jpg", "11.jpg",
];

const VERTICAL_LARK_FILES = [
  "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "5-cont.....jpg", "6.jpg", "7.jpg", "8.jpg",
  "9.jpg", "10.jpg", "11.jpg",
];

const VERTICAL_OWL_FILES = [
  "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "5 cont.....jpg", "6.jpg", "7.jpg", "8.jpg",
  "9.jpg", "10.jpg", "11.jpg",
];

function chronotypeFolder(chrono: string): "lark" | "eagle" | "owl" {
  const key = chrono.toUpperCase();
  if (key === "LARK") return "lark";
  if (key === "OWL") return "owl";
  return "eagle";
}

export function chronotypeImageFiles(chrono: string): string[] {
  const key = chrono.toUpperCase();
  if (key === "LARK") return LARK_FILES;
  if (key === "OWL") return OWL_FILES;
  return EAGLE_FILES;
}

export function chronotypeImageSrc(chrono: string, index = 1): string {
  const files = chronotypeImageFiles(chrono);
  return `/chronotype_media/${chronotypeFolder(chrono)}/${files[Math.max(0, index - 1)] ?? files[0]}`;
}

export function chronotypeImageSrcs(chrono: string): string[] {
  const folder = chronotypeFolder(chrono);
  const files = chronotypeImageFiles(chrono);
  const trimmed = chrono.toUpperCase() === "EAGLE" ? files.slice(0, -2) : files;
  return trimmed.map((f) => `/chronotype_media/${folder}/${f}`);
}

export function chronotypeImageSrcsMobile(chrono: string): string[] {
  const key = chrono.toUpperCase();
  if (key === "EAGLE") {
    return VERTICAL_EAGLE_FILES.map((f) => `/chronotype_media/vertical_images/eagle_vertical/${f}`);
  }
  if (key === "LARK") {
    return VERTICAL_LARK_FILES.map((f) => `/chronotype_media/vertical_images/larks_vertical/${f}`);
  }
  if (key === "OWL") {
    return VERTICAL_OWL_FILES.map((f) => `/chronotype_media/vertical_images/owl_vertical/${f}`);
  }
  return chronotypeImageSrcs(chrono);
}

function readAsDataURL(blob: Blob): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(blob);
  });
}

/**
 * Loads one image and returns a compressed JPEG data URI, downscaled to
 * `maxWidth` so embedded PDFs stay small. Returns `null` on failure.
 */
async function loadImageDataUri(src: string, maxWidth: number): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch(src, { cache: "force-cache" });
    if (!res.ok) return null;
    const blob = await res.blob();

    const bitmap = await createImageBitmap(blob).catch(() => null);
    if (!bitmap) return readAsDataURL(blob);

    const scale = Math.min(1, maxWidth / bitmap.width);
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return readAsDataURL(blob);
    ctx.drawImage(bitmap, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.85);
  } catch {
    return null;
  }
}

/** The hero photo (used on the report cover). */
export async function loadChronotypeImageDataUri(chrono: string, index = 1, maxWidth = 800): Promise<string | null> {
  return loadImageDataUri(chronotypeImageSrc(chrono, index), maxWidth);
}

/** All photos for a chronotype, as embedded data URIs (for the gallery pages). */
export async function loadChronotypeGallery(chrono: string, maxWidth = 640): Promise<string[]> {
  const srcs = chronotypeImageSrcs(chrono);
  const results = await Promise.all(srcs.map((src) => loadImageDataUri(src, maxWidth)));
  return results.filter((r): r is string => Boolean(r));
}
