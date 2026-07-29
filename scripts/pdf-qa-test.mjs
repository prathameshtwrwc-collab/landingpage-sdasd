import puppeteer from "puppeteer-core";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "..", "pdf-qa-output");
fs.mkdirSync(outDir, { recursive: true });

// ── Use tsx to transpile the TS source ──
// We need to bundle the template. Since buildReportHtml is pure function,
// we can just generate the HTML by running the source through tsx.

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const testCases = [
  {
    label: "LARK",
    data: {
      firstName: "Kunal",
      lastName: "Mishra",
      email: "kunal@example.com",
      chronotype: "LARK",
      totalScore: 42,
      larkScore: 42,
      eagleScore: 28,
      owlScore: 18,
      summary: "Larks naturally wake early and peak in the morning.",
      orgName: "WelcomeCure HealthTech",
    },
  },
  {
    label: "EAGLE",
    data: {
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya@example.com",
      chronotype: "EAGLE",
      totalScore: 38,
      larkScore: 30,
      eagleScore: 38,
      owlScore: 25,
      summary: "Eagles have a flexible rhythm.",
      orgName: "Wellness Corp",
    },
  },
  {
    label: "OWL",
    data: {
      firstName: "Rahul",
      lastName: "Verma",
      email: "rahul@example.com",
      chronotype: "OWL",
      totalScore: 36,
      larkScore: 16,
      eagleScore: 24,
      owlScore: 36,
      summary: "Owls naturally peak in the evening.",
    },
  },
];

async function getHtml(data) {
  // Dynamically import the TS module via tsx
  const { buildReportHtml } = await import("../src/lib/report-template.ts");
  return buildReportHtml(data);
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  console.log("Browser launched");

  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

  const results = [];

  for (const tc of testCases) {
    console.log(`\n=== Generating ${tc.label} PDF ===`);

    const html = await getHtml(tc.data);
    const htmlPath = path.join(outDir, `${tc.label}.html`);
    const pdfPath = path.join(outDir, `${tc.label}-report.pdf`);
    const p1Path = path.join(outDir, `${tc.label}-page1.png`);
    const p2Path = path.join(outDir, `${tc.label}-page2.png`);

    fs.writeFileSync(htmlPath, html, "utf-8");

    // Load HTML into page
    await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0", timeout: 30000 });

    // Detect actual resolved font name and load it
    const loaded = await page.evaluate(async () => {
      const probe = document.createElement("div");
      probe.style.cssText = "position:absolute;visibility:hidden;font-family:var(--font-poppins, Poppins)";
      document.body.appendChild(probe);
      const resolved = getComputedStyle(probe).fontFamily.replace(/["']/g, "").split(",")[0].trim() || "Poppins";
      document.body.removeChild(probe);

      await document.fonts.ready;
      if (!document.fonts.check(`400 12px "${resolved}"`)) {
        await Promise.all([
          document.fonts.load(`400 12px "${resolved}"`),
          document.fonts.load(`500 12px "${resolved}"`),
          document.fonts.load(`600 12px "${resolved}"`),
          document.fonts.load(`700 12px "${resolved}"`),
        ]);
      }
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      return resolved;
    });

    console.log(`  Font resolved: ${loaded}`);

    // Get geometry information
    const geo = await page.evaluate(() => {
      const nameEl = document.querySelector(".pdf-chronotype-name");
      const subtitleEl = document.querySelector(".pdf-chronotype-subtitle");
      const result = { titleSubtitleGap: null };

      if (nameEl && subtitleEl) {
        const nr = nameEl.getBoundingClientRect();
        const sr = subtitleEl.getBoundingClientRect();
        result.titleSubtitleGap = sr.top - nr.bottom;
      }

      // Measure page utilisation
      const pages = document.querySelectorAll(".pdf-page");
      result.pageCount = pages.length;

      pages.forEach((p, i) => {
        const contentEls = p.querySelectorAll(
          "[class*='pdf-header'],[class*='pdf-hero'],[class*='pdf-metrics'],[class*='pdf-insights'],[class*='pdf-next-steps'],[class*='pdf-daily-rhythm'],[class*='pdf-page-two-header'],[class*='pdf-recommendations'],[class*='pdf-important-notice']",
        );
        let lowestBottom = 0;
        const footerEl = p.querySelector(".pdf-footer");
        const footerTop = footerEl ? footerEl.getBoundingClientRect().top : p.clientHeight;
        contentEls.forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.bottom > lowestBottom) lowestBottom = r.bottom;
        });
        const usableHeight = footerTop - 40; // 40px top padding
        const utilisation = Math.round((lowestBottom / usableHeight) * 100);
        result[`page${i + 1}Utilisation`] = `${utilisation}%`;
      });

      return result;
    });

    console.log(`  Title-to-subtitle gap: ${geo.titleSubtitleGap}px`);
    console.log(`  Page count: ${geo.pageCount}`);
    console.log(`  Page 1 utilisation: ${geo.page1Utilisation}`);
    console.log(`  Page 2 utilisation: ${geo.page2Utilisation}`);

    // Capture both pages as PNG
    const pdfPages = await page.$$(".pdf-page");

    for (let i = 0; i < pdfPages.length && i < 2; i++) {
      const el = pdfPages[i];
      const clip = await el.boundingBox();
      if (!clip) continue;

      const pngPath = i === 0 ? p1Path : p2Path;
      await page.screenshot({
        path: pngPath,
        clip: {
          x: clip.x,
          y: clip.y,
          width: Math.min(clip.width, 794),
          height: Math.min(clip.height, 1123),
        },
        type: "png",
      });
      console.log(`  Page ${i + 1} PNG saved: ${pngPath}`);
    }

    // Generate PDF via page.pdf() for comparison
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    });

    const pdfStat = fs.statSync(pdfPath);
    console.log(`  PDF size: ${(pdfStat.size / 1024).toFixed(0)} KB`);
    console.log(`  PDF saved: ${pdfPath}`);

    // Check page 2 has exactly 1 header row (no duplicate)
    const page2Html = await page.evaluate(() => {
      const pages = document.querySelectorAll(".pdf-page");
      if (pages.length < 2) return "NO_PAGE_2";
      const p2 = pages[1];
      const fullHeader = p2.querySelectorAll(".pdf-page-two-header");
      const fullHeaders = p2.querySelectorAll(".pdf-header");
      return { pageTwoHeaders: fullHeader.length, oldStyleHeaders: fullHeaders.length };
    });
    console.log(`  Page 2 structure:`, page2Html);

    results.push({ label: tc.label, geo, page2Html });
  }

  await browser.close();

  // Summary
  console.log("\n══════════════════════════════════════");
  console.log("  QA SUMMARY");
  console.log("══════════════════════════════════════");
  for (const r of results) {
    console.log(`\n${r.label}:`);
    console.log(`  Title-subtitle gap:  ${r.geo.titleSubtitleGap}px (min 12px)`);
    console.log(`  Page 1 utilisation:  ${r.geo.page1Utilisation}`);
    console.log(`  Page 2 utilisation:  ${r.geo.page2Utilisation}`);
    console.log(`  Page 2 headers:      ${JSON.stringify(r.page2Html)} (should be {pageTwoHeaders:1})`);
    console.log(`  Title/subtitle OK:   ${r.geo.titleSubtitleGap !== null && r.geo.titleSubtitleGap >= 12 ? "YES" : "NO"}`);
  }
}

main().catch(console.error);
