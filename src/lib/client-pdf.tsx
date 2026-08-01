"use client";

import { pdf } from "@react-pdf/renderer";
import ChronotypeReportPDF from "@/components/pdf/ChronotypeReportPDF";
import { buildReportFilename, type ReportData } from "@/components/pdf/pdfReportData";

let isGenerating = false;

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
    const blob = await pdf(<ChronotypeReportPDF data={data} />).toBlob();
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
    const blob = await pdf(<ChronotypeReportPDF data={data} />).toBlob();
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
