# Chronotype Report Generation Guide

## Overview

This document explains how report generation (PDF) works in this project. The system produces a premium 2-page A4 report showing the user's chronotype classification, personalized recommendations, sleep/energy windows, and a wellness disclaimer.

The implementation has two layers:

1. **React-PDF Component** — A dedicated presentation layer under `src/components/pdf/` that renders the report using `@react-pdf/renderer` (Document/Page/View/Text/Svg)
2. **Client-side PDF Generator** — `src/lib/client-pdf.tsx` converts the component to a PDF Blob and triggers a browser download

No external database is used for report generation. All data is passed in-memory as a `ReportData` payload. The PDF is generated entirely client-side in the user's browser.

---

## Architecture

```
User clicks "Download Report"
  └─► src/lib/client-pdf.tsx::downloadPdf(data)
        └─► pdf(<ChronotypeReportPDF data={data} />).toBlob()
        └─► URL.createObjectURL(blob) + <a download> click
        └─► browser downloads .pdf file

User clicks "Print"
  └─► src/lib/client-pdf.tsx::openPdfForPrint(data)
        └─► same generation, opens blob URL in new tab for native print
```

**Key principle:** The PDF is generated entirely on the client side with `@react-pdf/renderer`. No html2canvas, no jsPDF, no server-side browser, no Puppeteer/Playwright — fully compatible with Vercel's serverless environment.

---

## Installation

```json
{
  "dependencies": {
    "@react-pdf/renderer": "^4.5.1"
  }
}
```

This is the only dependency needed for PDF generation. `html2canvas` and `jspdf` were removed.

---

## Data Structures

### `ReportData` (input payload)

Defined in `src/components/pdf/pdfReportData.ts`:

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
  orgName?: string;
};
```

### `PdfReportViewModel` (computed view model)

`buildPdfReportViewModel(data)` derives everything the PDF needs:

- participantName, participantEmail, orgName, reportId, assessmentDate
- chronotypeKey / chronotypeName / subtitle / description
- wakeTime, focusWindow, bedtime, peakFocus
- strengths[], watchOuts[], nextSteps[], timeline[], recommendations[]
- accent color

All chronotype-specific business data (descriptions, peak times, sleep windows, strengths, watch-outs, next steps, timelines, recommendations) is preserved from the existing assessment data.

---

## File-by-File Implementation

### 1. `src/components/pdf/pdfStyles.ts` — Design Tokens + Styles

- `COLORS` — restrained indigo palette: `#30268F` primary, `#20212D` ink, `#666775` muted, `#E3E3EA` border, `#F7F7FA` soft bg, `#F4F2FF` soft purple, `#ED8300` warm, `#FFF8EF` warm bg, `#2F7D5B` green
- `pdfStyles = StyleSheet.create()` — page padding (top 30 / right 40 / bottom 34 / left 40), header, metadata row, hero, schedule, panels, next steps, daily rhythm, footer, page-2 header, recommendations grid, important notice
- Uses a 4/8/12/16/20/24/32 spacing scale

### 2. `src/components/pdf/pdfIcons.tsx` — Illustrations + Brand Mark

- `ChronotypeIllustration({ type })` — renders Lark (sunrise), Owl (night bird), or Eagle (bird of prey) via React-PDF `Svg`/`Circle`/`Path`/`Line`
- `BrandMark()` — small indigo rounded logo for the header

### 3. `src/components/pdf/ChronotypeReportPDF.tsx` — The Report

Pure presentation layer. Receives `ReportData`, computes the view model, and renders:

- **Page 1:** header (brand + org name), metadata row (prepared for / assessment date / report ID), chronotype hero (eyebrow, name, subtitle pill, description, illustration + peak focus pill), schedule strip (wake time / focus window / bedtime), strengths + watch-outs panels, best next steps (3 numbered columns), daily rhythm timeline, footer
- **Page 2:** compact header (brand + name + chronotype pill + report ID), "Your personalised daily guidance" heading, 2-column editorial recommendation grid (numbers 1–6), important notice, footer

Centering (pills, number circles, badges) is handled by React-PDF's native layout (`alignItems: "center"`, `justifyContent: "center"`) — not by CSS hacks.

### 4. `src/lib/client-pdf.tsx` — Download / Print / Share

```typescript
"use client";
import { pdf } from "@react-pdf/renderer";
import ChronotypeReportPDF from "@/components/pdf/ChronotypeReportPDF";
import { buildReportFilename, type ReportData } from "@/components/pdf/pdfReportData";

export async function downloadPdf(data: ReportData, filename?: string): Promise<void> {
  if (isGenerating) return;          // duplicate-submission guard
  isGenerating = true;
  try {
    const blob = await pdf(<ChronotypeReportPDF data={data} />).toBlob();
    triggerDownload(blob, filename || buildReportFilename(data));
  } finally {
    isGenerating = false;
  }
}

export async function openPdfForPrint(data: ReportData): Promise<void> { /* blob URL in new tab */ }
export async function shareReport(data: ReportData): Promise<void> { /* navigator.share / clipboard */ }
```

Filename convention is preserved: `chronotype-report-[name]-[date].pdf`.

---

## How to Trigger Report Generation from a UI Component

```typescript
"use client";
import { downloadPdf, openPdfForPrint } from "@/lib/client-pdf";

<button onClick={() => downloadPdf({
  firstName, lastName, email,
  chronotype, totalScore, larkScore, eagleScore, owlScore,
  orgName,
})}>
  Download PDF
</button>
```

The three production entry points all call the same functions:

- `src/app/dashboard/page.tsx` — "PDF" button on report rows
- `src/app/dashboard/progress/page.tsx` — Download (`Download` icon) + Print (`Printer` icon) on report rows
- `src/components/assessment/AssessmentModal.tsx` — "Download full report" button on the result screen

Each button shows a loading label ("Generating…" / "Generating report…") and is disabled while generation is active.

---

## Font Handling

- Uses the **built-in Helvetica PDF font** registered by React-PDF — deterministic, no remote fetch, no runtime font probing.
- This avoids the previous dependency on `var(--font-poppins)` resolution and Google Fonts loading.

---

## Logos / Images

- Organization name (`orgName`) is displayed in the header when present.
- No remote image URLs are used. If an organization logo becomes available, it can be added via React-PDF `Image` with a local/static asset, preserving aspect ratio.

---

## Vercel Compatibility

- Generation happens entirely in the browser (`@react-pdf/renderer` `.toBlob()`).
- No Puppeteer, Playwright, Chromium, or server-side browser process is used.
- No server-side PDF libraries or screenshot pipelines.
- Works in Next.js App Router because browser-only code is isolated to `"use client"` modules (`client-pdf.tsx` and the `pdf/` components).

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| PDF has 3 pages | Section content too tall — reduce font/padding in `pdfStyles.ts`, verify via text-position extraction |
| Text not centered in pill/circle | Use `alignItems: "center"` + `justifyContent: "center"` on the container (never `line-height` hacks) |
| Wrong chronotype content | Verify `chronotype` field is `"LARK"` / `"EAGLE"` / `"OWL"`; view model falls back to EAGLE |
| Long name overflows header | Long names wrap naturally; metadata values use `flex: 1` columns |
| Build fails on SSR | Ensure `@react-pdf/renderer` is only imported from `"use client"` files |

---

## File Reference

| File | Purpose |
|------|---------|
| `src/components/pdf/ChronotypeReportPDF.tsx` | React-PDF report document (Page 1 + Page 2) |
| `src/components/pdf/pdfStyles.ts` | PDF design tokens + `StyleSheet.create()` |
| `src/components/pdf/pdfIcons.tsx` | Lark/Owl/Eagle illustrations + brand mark |
| `src/components/pdf/pdfReportData.ts` | `ReportData` type + `buildPdfReportViewModel()` + `buildReportFilename()` |
| `src/lib/client-pdf.tsx` | Client-side PDF download / print / share |
| `src/app/dashboard/page.tsx` | Dashboard download button |
| `src/app/dashboard/progress/page.tsx` | Progress page download + print buttons |
| `src/components/assessment/AssessmentModal.tsx` | Result screen "Download full report" button |
