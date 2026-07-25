# Chronotype Report Generation Guide

## Overview

This document explains how to implement **report generation** (HTML + PDF) for chronotype assessment results, exactly as done in this project. The system produces a premium 2-page A4 report showing the user's chronotype classification, score breakdown, personalized recommendations, sleep/energy windows, and medical disclaimer.

The implementation has three layers:
1. **HTML Template** — A self-contained inline-styled HTML document (2 A4 pages)
2. **Client-side PDF Generator** — Uses `html2canvas` + `jsPDF` in the browser to capture the HTML template as a downloadable PDF
3. **Server-side Preview API** — Returns the raw HTML for print preview

No external database is used for report generation. All data is passed in-memory as a `ReportData` payload. The report is generated on-demand from the browser (client side) or via API (server side, HTML only).

---

## Architecture

```
User clicks "Download PDF"
  └─► lib/client-pdf.ts::downloadPdf(data)
        └─► lib/report-template.ts::buildReportHtml(data)   → generates 2-page A4 HTML string
        └─► creates hidden offscreen <div> with the HTML
        └─► html2canvas captures each .page element as a canvas
        └─► jsPDF creates A4 PDF with JPEG images per page
        └─► triggers browser download (.pdf file)

User clicks "Print"
  └─► lib/client-pdf.ts::openPdfForPrint(data)
        └─► same flow, but opens PDF blob in new tab for native print

User clicks "Preview" (API route)
  └─► POST /api/reports/preview  { payload }
        └─► api/reports/preview/route.ts
              └─► lib/pdf-template.ts::htmlTemplate(data)   → returns raw HTML
              └─► Response with Content-Type: text/html
```

**Key principle:** The PDF is generated entirely on the client side. The server never generates PDF files. The `/api/reports/generate` route explicitly returns 501 (not implemented) — only the preview route works server-side.

---

## Installation

These packages are already in `package.json`:

```json
{
  "dependencies": {
    "html2canvas": "^1.4.1",
    "jspdf": "^4.2.1"
  }
}
```

Install them:

```bash
npm install html2canvas jspdf
```

No other dependencies needed for report generation.

---

## Data Structures

### `ReportData` (input payload)

Defined in `lib/report-template.ts:1-14`:

```typescript
export type ReportData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  chronotype: string;           // "LARK" | "EAGLE" | "OWL"
  totalScore: number;
  larkScore: number;
  eagleScore: number;
  owlScore: number;
  summary?: string;
  recommendations?: {
    category: string;
    title: string;
    description: string;
  }[];
  orgName?: string;
  logoUrl?: string | null;
};
```

### `ChronotypeResult` (from assessment engine)

Defined in `lib/assessment.ts:16-29`:

```typescript
type ChronotypeResult = {
  chronotype: Chronotype;       // "LARK" | "EAGLE" | "OWL"
  title: string;
  tagline: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  suggestions: string[];
  larkScore: number;
  eagleScore: number;
  owlScore: number;
  totalScore: number;
  confidenceScore: number;
};
```

### Database `report_snapshot` JSON

Stored in the `reports` table after assessment completion (see `app/actions/assessment.ts`). Structure:

```typescript
{
  result: ChronotypeResult,
  firstName: string,
  lastName: string,
  email: string,
  orgName: string,
  logoUrl: string | null,
  recommendations: Array<{ category: string; title: string; description: string }>
}
```

---

## File-by-File Implementation

### 1. `lib/report-template.ts` — HTML Template (Client-Side)

**Path:** `work/nextchrono2-source/lib/report-template.ts`
**Purpose:** Generate a complete 2-page A4 HTML document from `ReportData`.

Key sections:
- **Page 1:** Hero section with chronotype badge, participant name, 4 insight cards (strength, energy peak, sleep window, rhythm type), score breakdown bars, total score circle, "What This Means" card, sleep window + peak energy info cards, daily rhythm timeline, footer with page number
- **Page 2:** Header with meta info, "Personalized Guidance" title, up to 6 recommendation cards (category, title, description), risk & warning indicators list, medical disclaimer, footer with page number

**Design constants (chronotype-dependent):**

| Property | LARK | EAGLE | OWL |
|----------|------|-------|-----|
| Color | `#d88921` (amber) | `#2469d8` (blue) | `#7c3aed` (purple) |
| Sleep window | 9PM–5AM | 10:30PM–6:30AM | 12AM–8AM |
| Peak energy | 6AM–10AM | 10AM–2PM | 6PM–10PM |
| Strength | Morning Optimizer | Balanced Performer | Evening Innovator |
| Rhythm Type | Early Chronotype | Intermediate Chronotype | Late Chronotype |

**Layout grid:**
- Top: 4-column grid for insight cards
- Middle: 2-column split (score breakdown bars | total score)
- Below: "What This Means" full-width card
- Then: 2-column grid (sleep window | peak energy)
- Bottom: Daily rhythm timeline (4 nodes)
- Page 2: Full-width recommendations (stacked cards)
- Page 2 bottom: 2-column grid (risk indicators | disclaimer)

**Scoring bar percentages:**
```typescript
const pctLark = larkScore > 0 ? Math.round((larkScore / maxScore) * 100) : 0;
// same for Eagle, Owl
```

**Recommendation deduplication logic:**
1. Use user-specific recommendations first (up to 6)
2. Fill remaining slots with chronotype defaults (`defaultRecs`)
3. Fill any remaining with fallback "Protect Your Rhythm"
4. Deduplicate by normalized category name

**CSS notes:**
- `@page { margin: 0; size: A4; }` for print layout
- Each page: `width: 210mm; height: 297mm; padding: 32px;`
- `-webkit-print-color-adjust: exact;` preserves background colors in print
- Backgrounds use `radial-gradient` and `linear-gradient` for premium look
- Font stack: `'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif`

### 2. `lib/pdf-template.ts` — HTML Template (Server-Side)

**Path:** `work/nextchrono2-source/lib/pdf-template.ts`
**Purpose:** Identical HTML template but uses Node.js `crypto` module for stable ID generation. Used exclusively by the `/api/reports/preview` route.

**Key difference from client template:**
```typescript
import crypto from "crypto";

export function stableId(...parts: (string | number | null | undefined)[]): string {
  const hash = crypto.createHash("sha256")
    .update(parts.filter(Boolean).join("|"))
    .digest("hex");
  return "RPT-" + hash.slice(0, 8).toUpperCase();
}
```

The client-side version (`report-template.ts`) uses a simple JS hash instead (no `crypto` module available in browser).

### 3. `lib/client-pdf.ts` — Client-Side PDF Generation

**Path:** `work/nextchrono2-source/lib/client-pdf.ts`
**Purpose:** Convert the HTML template into a downloadable PDF using html2canvas + jsPDF.

**Flow:**

```typescript
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { buildReportHtml, type ReportData } from "./report-template";

export async function downloadPdf(data: ReportData, filename = "chronotype-report") {
  // 1. Generate HTML string
  const html = buildReportHtml(data);

  // 2. Create offscreen container (position: fixed; left: -9999px)
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px";   // ~210mm at ~96dpi
  container.style.zIndex = "-1";
  document.body.appendChild(container);

  // 3. Find all .page elements
  const pages = container.querySelectorAll(".page");

  // 4. Create A4 PDF
  const pdf = new jsPDF("p", "mm", "a4");
  const scale = 2;  // 2x rendering quality

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage();

    // 5. Capture each page as canvas
    const canvas = await html2canvas(pages[i], {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#fafaf7",
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // 6. Convert canvas to JPEG image
    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    // 7. Add to PDF (fit to A4 width)
    const pdfWidth = 210;
    const pdfHeight = (canvas.height / canvas.width) * pdfWidth;
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, Math.min(pdfHeight, 297), undefined, "FAST");
  }

  // 8. Clean up and download
  document.body.removeChild(container);
  pdf.save(`${filename}.pdf`);
}
```

**Key parameters:**
- `scale: 2` — Higher quality but larger file size
- `useCORS: true` — Required if report includes external images (logo)
- `backgroundColor: "#fafaf7"` — Matches template background
- `"image/jpeg", 0.95` — High quality JPEG compression
- Container width: `794px` — Corresponds to A4 width at ~96 DPI

**Print function (`openPdfForPrint`):**
Identical flow but instead of `pdf.save()`, opens in new tab:
```typescript
window.open(pdf.output("bloburl"), "_blank");
```

### 4. `lib/pdf-utils.ts` — API Utility Functions

**Path:** `work/nextchrono2-source/lib/pdf-utils.ts`
**Purpose:** Helper functions for calling the server-side report APIs.

```typescript
// Try server-side PDF download (returns 501 currently)
export async function downloadPdf(payload: any, filename = "chronotype-report.pdf")

// Open HTML preview in new tab
export async function previewPdf(payload: any)

// Try download first, fall back to preview
export async function downloadOrPreview(payload: any)
```

### 5. API Routes

#### Preview Route — `app/api/reports/preview/route.ts`

Returns the report HTML for viewing/printing:

```typescript
import { htmlTemplate } from '@/lib/pdf-template';

export async function POST(request: Request) {
  const data = await request.json();
  const html = htmlTemplate(data);
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
```

#### Generate Route — `app/api/reports/generate/route.ts`

Explicitly **not implemented** (returns 501):

```typescript
export async function POST() {
  return NextResponse.json(
    { error: "Server-side PDF generation is not available. Use client-side download." },
    { status: 501 }
  );
}
```

---

## How to Trigger Report Generation from a UI Component

### Client-Side PDF Download

```typescript
"use client";
import { downloadPdf, openPdfForPrint } from "@/lib/client-pdf";

function ReportActions({ report }: { report: any }) {
  const snap = report.report_snapshot || {};
  const payload = {
    firstName: snap.firstName || "",
    lastName: snap.lastName || "",
    chronotype: snap.result?.chronotype || "EAGLE",
    totalScore: snap.result?.totalScore ?? 0,
    larkScore: snap.result?.larkScore ?? 0,
    eagleScore: snap.result?.eagleScore ?? 0,
    owlScore: snap.result?.owlScore ?? 0,
    summary: snap.result?.summary || "",
    recommendations: snap.recommendations || [],
    orgName: snap.orgName || "MyOrg",
    logoUrl: snap.logoUrl || null,
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => downloadPdf(payload)}>
        Download PDF
      </button>
      <button onClick={() => openPdfForPrint(payload)}>
        Print
      </button>
    </div>
  );
}
```

### Server-Side Preview (API)

```typescript
async function previewReport(payload: ReportData) {
  const resp = await fetch("/api/reports/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const html = await resp.text();
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
}
```

---

## Adding Report Generation to a New Feature

Follow these steps to add report generation:

### Step 1: Define the data payload

Create or use existing types for the report input. At minimum you need:
- `firstName`, `lastName` — participant name
- `chronotype` — the result string
- `totalScore`, `larkScore`, `eagleScore`, `owlScore` — scores
- `recommendations` — array of `{ category, title, description }`
- `orgName` — organization name

### Step 2: Build the HTML template

Create a function that returns an HTML string. Use inline styles (no external CSS). Structure:
1. `<!DOCTYPE html>` + `<html><head><style>` for all CSS
2. Each A4 page is a `<div class="page">` (210mm × 297mm)
3. Position important content within the 297mm height
4. Add `<div class="footer">` at the bottom for page info

### Step 3: Add PDF generation

Use the pattern from `lib/client-pdf.ts`:
1. Generate HTML string
2. Create offscreen container
3. Use `html2canvas` to capture each `.page`
4. Use `jsPDF` to assemble A4 PDF
5. Trigger download or open for print

### Step 4: Add a UI trigger

Add a "Download PDF" button in your React component that calls `downloadPdf(payload)`.

### Step 5: (Optional) Add server-side preview

Create an API route that calls your HTML template function and returns `Content-Type: text/html`.

---

## Default Recommendations by Chronotype

| Category | LARK | EAGLE | OWL |
|----------|------|-------|-----|
| morning_routine | Protect Your Morning Advantage | — | — |
| deep_work | Schedule Deep Work Early | Split Your Deep Work | Plan Evening Focus Blocks |
| wind_down | Slow Down Earlier | — | Reduce Late Stimulation |
| sleep_consistency | Keep a Stable Bedtime | Anchor Your Sleep Window | Protect a Stable Schedule |
| movement | Use Early Activity | Use Afternoon Movement | — |
| recovery | Avoid Late Overload | — | — |
| energy | — | Use Your Midday Performance Zone | — |
| nutrition | — | Balance Your Energy Intake | — |
| light | — | Strengthen Your Circadian Anchor | Use Morning Light Deliberately |
| work_timing | — | — | Avoid Forcing Early Peak Work |
| energy_management | — | — | Use Evenings Strategically |

---

## Design System for Reports

The report uses a **light/neutral palette** (not the dark portal theme) since reports are typically printed on paper:

| Element | Style |
|---------|-------|
| Background | `#fafaf7` |
| Text primary | `#202638` |
| Text secondary | `#667085` |
| Text accent | `#355c7d` |
| Gold accent | `#d6a84f` / `#b8872e` |
| Card bg | `#ffffff` with subtle border + shadow |
| Hero gradient | `linear-gradient(135deg, #fff4d8, #eaf4ff, #eee8ff)` |
| Font | `'Segoe UI', -apple-system, sans-serif` |
| Serif accent | `Georgia, 'Times New Roman', serif` (headings) |

---

## Important Notes

1. **No external saving to DB** — The report PDF is generated in-memory on the client side. It is never stored on the server. The `report_snapshot` JSON is stored in the DB for future reference, but the actual PDF is generated fresh each time from this JSON.

2. **Client-side only** — PDF generation happens in the browser using `html2canvas` + `jsPDF`. The server only serves the HTML preview. This avoids server-side PDF libraries (Puppeteer, wkhtmltopdf, etc.) and their associated memory/cost overhead.

3. **html2canvas limitations** — It captures DOM elements by rendering them to canvas. Complex CSS (CSS Grid, certain transforms) may not render perfectly. Test on real data. The container width of 794px ensures CSS renders consistently across browsers.

4. **Image CORS** — If using external logo images (`logoUrl`), set `useCORS: true` in html2canvas and ensure the server returns proper CORS headers.

5. **Report ID** — Generated using a hash of participant details + chronotype + score. Re-running with same data produces the same ID. Format: `RPT-XXXXXXXX`.

6. **Error handling** — The `downloadPdf` function catches errors silently. Add error handling as needed for your use case.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| PDF blank pages | Check container width (794px), ensure `.page` elements exist |
| Images not rendering | Set `useCORS: true`, check CORS headers on image server |
| Layout broken in PDF | Reduce CSS complexity, use `useCORS: true`, check `allowTaint: false` |
| "No report pages found" | Verify `buildReportHtml` returns valid HTML with `.page` class divs |
| Slow generation | Reduce `scale` (try 1.5 or 1), lower JPEG quality (0.85) |
| Print preview shows wrong colors | Add `-webkit-print-color-adjust: exact; print-color-adjust: exact;` |

---

## File Reference

| File | Purpose |
|------|---------|
| `lib/report-template.ts` | Client-side HTML template + `buildReportHtml()` |
| `lib/pdf-template.ts` | Server-side HTML template + `htmlTemplate()` |
| `lib/client-pdf.ts` | Client-side PDF download + print via html2canvas + jsPDF |
| `lib/pdf-utils.ts` | API utility helpers for preview/download |
| `lib/assessment.ts` | Core types + scoring algorithm |
| `app/api/reports/preview/route.ts` | Server-side HTML preview API |
| `app/api/reports/generate/route.ts` | PDF generation API (returns 501) |
| `app/member/progress/page.tsx` | Example UI with Download PDF / Print / Share buttons |
| `app/actions/assessment.ts` | Server action that creates report_snapshot in DB |
