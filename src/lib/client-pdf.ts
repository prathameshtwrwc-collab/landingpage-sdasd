"use client";

import { buildReportHtml, buildReportFilename, type ReportData } from "./report-template";

async function loadPdfDeps() {
  const [html2canvasModule, jsPDFModule] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);
  return {
    html2canvas: html2canvasModule.default,
    jsPDF: jsPDFModule.default,
  };
}

function renderReportToDom(html: string): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = html;
  container.className = "pdf-render-root";
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.width = "794px";
  container.style.opacity = "1";
  container.style.pointerEvents = "none";
  container.style.zIndex = "-1";
  document.body.appendChild(container);
  return container;
}

async function getPoppinsFontName(): Promise<string> {
  if (typeof getComputedStyle === "undefined") return "Poppins";
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;visibility:hidden;font-family:var(--font-poppins, Poppins)";
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).fontFamily.replace(/["']/g, "").split(",")[0].trim();
  document.body.removeChild(probe);
  return resolved || "Poppins";
}

async function waitForFonts(): Promise<void> {
  const fontName = await getPoppinsFontName();

  await document.fonts.ready;

  if (!document.fonts.check(`400 12px "${fontName}"`)) {
    await Promise.all([
      document.fonts.load(`400 12px "${fontName}"`),
      document.fonts.load(`500 12px "${fontName}"`),
      document.fonts.load(`600 12px "${fontName}"`),
      document.fonts.load(`700 12px "${fontName}"`),
    ]);
  }

  await new Promise(requestAnimationFrame);
  await new Promise(requestAnimationFrame);
}

async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map(async (img) => {
      if (!img.complete) {
        await new Promise<void>((resolve, reject) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => reject(), { once: true });
        });
      }
      if (typeof img.decode === "function") {
        await img.decode().catch(() => undefined);
      }
    }),
  );
}

function assertGap(
  first: HTMLElement,
  second: HTMLElement,
  minimum: number,
  label: string,
): void {
  const firstRect = first.getBoundingClientRect();
  const secondRect = second.getBoundingClientRect();
  const gap = secondRect.top - firstRect.bottom;
  if (gap < minimum) {
    throw new Error(`${label}: only ${gap}px (minimum ${minimum}px)`);
  }
}

function rectanglesOverlap(a: DOMRect, b: DOMRect): boolean {
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

function validatePdfGeometry(page: HTMLElement, pageNum: number): void {
  const overflow = page.scrollHeight - page.clientHeight;
  if (overflow > 1) {
    throw new Error(
      `Page ${pageNum} overflows by ${overflow}px. Adjust pagination before capture.`,
    );
  }

  /* Select only sibling section elements that are direct children of the page
     or its content wrapper. This avoids matching child elements like
     .pdf-header-left inside .pdf-header. */
  const contentWrapper = page.querySelector(".pdf-content-width");
  const root = contentWrapper || page;
  const children = root.children;

  const rects: { el: HTMLElement; label: string; rect: DOMRect }[] = [];

  for (let j = 0; j < children.length; j++) {
    const el = children[j] as HTMLElement;
    const cn = el.className || "";
    if (
      cn.includes("pdf-header") ||
      cn.includes("pdf-hero") ||
      cn.includes("pdf-metrics") ||
      cn.includes("pdf-insights") ||
      cn.includes("pdf-next-steps") ||
      cn.includes("pdf-daily-rhythm") ||
      cn.includes("pdf-page-two") ||
      cn.includes("pdf-recommendations") ||
      cn.includes("pdf-important-notice")
    ) {
      rects.push({ el, label: cn.replace(/\s+/g, "."), rect: el.getBoundingClientRect() });
    }
  }

  for (let i = 1; i < rects.length; i++) {
    const prev = rects[i - 1];
    const curr = rects[i];

    if (prev.rect.bottom > curr.rect.top + 1) {
      throw new Error(
        `Page ${pageNum}: "${prev.label}" bottom (${prev.rect.bottom}) overlaps "${curr.label}" top (${curr.rect.top})`,
      );
    }

    const leftDiff = Math.abs(prev.rect.left - curr.rect.left);
    const rightDiff = Math.abs(prev.rect.right - curr.rect.right);
    if (leftDiff > 3 && !curr.label.includes("footer") && !prev.label.includes("footer")) {
      console.warn(
        `Page ${pageNum}: "${prev.label}" left ${prev.rect.left} vs "${curr.label}" left ${curr.rect.left} (diff ${leftDiff}px)`,
      );
    }
    if (rightDiff > 3 && !curr.label.includes("footer") && !prev.label.includes("footer")) {
      console.warn(
        `Page ${pageNum}: "${prev.label}" right ${prev.rect.right} vs "${curr.label}" right ${curr.rect.right} (diff ${rightDiff}px)`,
      );
    }
  }
}

let isGenerating = false;

export async function downloadPdf(data: ReportData, filename?: string): Promise<void> {
  if (isGenerating) return;
  isGenerating = true;

  const { html2canvas, jsPDF } = await loadPdfDeps();
  const html = buildReportHtml(data);
  const container = renderReportToDom(html);
  const pdfFilename = filename || buildReportFilename(data);

  try {
    await waitForFonts();
    await waitForImages(container);

    // Verify fonts loaded
    const fontName = await getPoppinsFontName();
    const fontCheck = document.fonts.check(`400 12px "${fontName}"`);
    if (!fontCheck) {
      console.warn(`Font "${fontName}" not fully loaded, proceeding anyway`);
    }

    const pages = container.querySelectorAll<HTMLElement>(".pdf-page");
    if (!pages.length) throw new Error("No report pages found");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const scale = 2;

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();

      const el = pages[i];
      validatePdfGeometry(el, i + 1);

      /* ─── Geometry: title-to-subtitle gap (only on page 1) ─── */
      if (i === 0) {
        const nameEl = el.querySelector<HTMLElement>(".pdf-chronotype-name");
        const subtitleEl = el.querySelector<HTMLElement>(".pdf-chronotype-subtitle");
        if (nameEl && subtitleEl) {
          assertGap(nameEl, subtitleEl, 12, "Page 1 title-to-subtitle gap");
        }
      }

      const canvas = await html2canvas(el, {
        scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        scrollX: 0,
        scrollY: 0,
        removeContainer: true,
        imageTimeout: 15000,
      });

      const pageImage = canvas.toDataURL("image/jpeg", 0.95);
      pdf.addImage(pageImage, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    }

    pdf.setProperties({
      title: `${data.firstName || data.lastName || "Participant"} — Chronotype Report`,
      subject: "Personalised Chronotype Assessment Report",
      author: data.orgName || "Chronotype",
      creator: "Chronotype Assessment Platform",
    });

    pdf.save(pdfFilename);
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    isGenerating = false;
  }
}

export async function openPdfForPrint(data: ReportData): Promise<void> {
  const { html2canvas, jsPDF } = await loadPdfDeps();
  const html = buildReportHtml(data);
  const container = renderReportToDom(html);

  try {
    await waitForFonts();
    await waitForImages(container);

    const pages = container.querySelectorAll<HTMLElement>(".pdf-page");
    if (!pages.length) throw new Error("No report pages found");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const scale = 2;

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();

      const el = pages[i];
      validatePdfGeometry(el, i + 1);

      /* ─── Geometry: title-to-subtitle gap (only on page 1) ─── */
      if (i === 0) {
        const nameEl = el.querySelector<HTMLElement>(".pdf-chronotype-name");
        const subtitleEl = el.querySelector<HTMLElement>(".pdf-chronotype-subtitle");
        if (nameEl && subtitleEl) {
          assertGap(nameEl, subtitleEl, 12, "Page 1 title-to-subtitle gap");
        }
      }

      const canvas = await html2canvas(el, {
        scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        scrollX: 0,
        scrollY: 0,
        imageTimeout: 15000,
      });

      const pageImage = canvas.toDataURL("image/jpeg", 0.95);
      pdf.addImage(pageImage, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    }

    const blobUrl = pdf.output("bloburl");
    window.open(blobUrl, "_blank");
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

export async function shareReport(data: ReportData): Promise<void> {
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
