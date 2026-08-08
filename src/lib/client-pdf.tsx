"use client";

import { pdf } from "@react-pdf/renderer";
import ChronotypeReportPDF from "@/components/pdf/ChronotypeReportPDF";
import { buildReportFilename, type ReportData } from "@/components/pdf/pdfReportData";
import { loadChronotypeImageDataUri, loadChronotypeGallery } from "@/lib/chronotype-image";

let isGenerating = false;

/** Embed the chronotype hero photo + full gallery into the report data (falls back gracefully). */
async function withMedia(data: ReportData): Promise<ReportData> {
  const heroImage = data.heroImage ?? (await loadChronotypeImageDataUri(data.chronotype)) ?? undefined;
  const galleryImages =
    data.galleryImages && data.galleryImages.length > 0
      ? data.galleryImages
      : await loadChronotypeGallery(data.chronotype);
  return { ...data, heroImage, galleryImages };
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function downloadPdf(data: ReportData, filename?: string): Promise<void> {
  if (isGenerating) return;
  isGenerating = true;

  try {
    const enriched = await withMedia(data);
    const blob = await pdf(<ChronotypeReportPDF data={enriched} />).toBlob();
    const pdfFilename = filename || buildReportFilename(data);
    triggerDownload(blob, pdfFilename);
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  } finally {
    isGenerating = false;
  }
}

export async function openPdfForPrint(data: ReportData): Promise<void> {
  if (isGenerating) return;
  isGenerating = true;

  try {
    const enriched = await withMedia(data);
    const blob = await pdf(<ChronotypeReportPDF data={enriched} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  } finally {
    isGenerating = false;
  }
}

export async function shareReport(data: ReportData): Promise<void> {
  const text = `I'm a ${data.chronotype} chronotype! Take the assessment: ${window.location.origin}`;
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title: "My Chronotype Report", text });
    } catch {
      await navigator.clipboard.writeText(text);
    }
  } else if (typeof navigator !== "undefined") {
    await navigator.clipboard.writeText(text);
  }
}
