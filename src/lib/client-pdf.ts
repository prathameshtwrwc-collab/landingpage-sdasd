"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { buildReportHtml, type ReportData } from "./report-template";

export async function downloadPdf(data: ReportData, filename = "chronotype-report"): Promise<void> {
  const html = buildReportHtml(data);
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px";
  container.style.zIndex = "-1";
  document.body.appendChild(container);

  try {
    const pages = container.querySelectorAll(".page");
    if (!pages.length) throw new Error("No report pages found");

    const pdf = new jsPDF("p", "mm", "a4");
    const scale = 2;

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();

      const el = pages[i] as HTMLElement;
      const canvas = await html2canvas(el, {
        scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#fafaf7",
        logging: false,
        width: el.scrollWidth,
        height: el.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdfWidth = 210;
      const pdfHeight = (canvas.height / canvas.width) * pdfWidth;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, Math.min(pdfHeight, 297), undefined, "FAST");
    }

    pdf.save(`${filename}.pdf`);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

export async function openPdfForPrint(data: ReportData): Promise<void> {
  const html = buildReportHtml(data);
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px";
  container.style.zIndex = "-1";
  document.body.appendChild(container);

  try {
    const pages = container.querySelectorAll(".page");
    if (!pages.length) throw new Error("No report pages found");

    const pdf = new jsPDF("p", "mm", "a4");
    const scale = 2;

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();
      const el = pages[i] as HTMLElement;
      const canvas = await html2canvas(el, {
        scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#fafaf7",
        logging: false,
        width: el.scrollWidth,
        height: el.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdfWidth = 210;
      const pdfHeight = (canvas.height / canvas.width) * pdfWidth;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, Math.min(pdfHeight, 297), undefined, "FAST");
    }

    const blobUrl = pdf.output("bloburl");
    window.open(blobUrl, "_blank");
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

export async function shareReport(data: ReportData): Promise<void> {
  const { downloadPdf: dp } = await import("./client-pdf");
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      const html = buildReportHtml(data);
      const blob = new Blob([html], { type: "text/html" });
      const file = new File([blob], "chronotype-report.html", { type: "text/html" });
      await navigator.share({
        title: "My Chronotype Report",
        text: `I'm a ${data.chronotype} chronotype! Check out my sleep assessment report.`,
        files: [file],
      });
    } catch {
      const text = `I'm a ${data.chronotype} chronotype! Take the assessment: ${window.location.origin}`;
      try {
        await navigator.share({ title: "My Chronotype", text });
      } catch {
        await navigator.clipboard.writeText(text);
      }
    }
  } else if (typeof navigator !== "undefined") {
    const text = `I'm a ${data.chronotype} chronotype! Take the assessment: ${window.location.origin}`;
    await navigator.clipboard.writeText(text);
  }
}
