# AI Developer Guardrails — Strict Visual Reproduction Project

> **This is a strict visual reproduction project. Do not creatively reinterpret the design. Preserve every approved section, colour, typography, spacing, and content exactly unless explicitly instructed to change.**

This file is mandatory reading for any AI coding agent, developer, or designer before touching layout, styling, responsive behaviour, content, components, or assets.

## Mandatory Pre-Check — Read Before Any Code Change

1. **Read DESIGN_SYSTEM.md first** — Understand healthcare brochure visual identity, colour tokens #F59A00 #3B35A3 #35319B #F4C623 #E4B93D, typography Poppins only 400/500/600/700, shape language square corners except facts 18px + share pill, button variants indigo/orange/outlined, image direction (realistic wellness bright, transparent cutouts with mask), iconography stroke 1.6-1.7, divider rules border-bottom rgba(228,185,61,0.72).
2. **Read RESPONSIVE_RULES.md before any responsive change** — Breakpoints 320-389 small mobile, 390-479 standard, 480-767 large mobile, 768-1023 tablet, 1024-1439 desktop, 1440+ large desktop. Specific grids per section, mobile stacking orders, allowed column counts, anti-overflow rules minmax(0,1fr) min-w0, aspect-ratio usage, no fixed desktop widths on mobile.
3. **Read COMPONENT_ARCHITECTURE.md before adding a component** — Verify render order of 15 sections now (added SiteNavbar): SiteNavbar, Hero, StatementStrip, ChronotypeIntro, Optimization, Pillars, Better Sleep, Why Matters, Sleep Cycles, Common Disorders, Warning Signs, Sleep Facts, Additional Guidance, FAQ, DisclaimerFooter. No duplicate render, no nesting, no replacing sibling. Navbar must be first before Hero.
4. **Read ASSET_MANIFEST.md before changing images** — Check current file path, purpose, desktop/mobile dimensions, aspect ratio, object-fit/position, placeholder vs final status, expected final replacement path /public/assets/... naming conventions kebab-case, transparency requirement, alt text, performance priority critical above-the-fold (hero 1.9MB must optimize) vs lazy-load below-fold.
5. **Read CONTENT_COPY.md before changing content** — All headings, subheadings, paragraphs, bullet items, facts, CTA labels, FAQ Q&A, disclaimer must be extracted exactly, never rewritten/summarized/shortened/expanded/reordered without client approval.
6. **Read IMPLEMENTATION_CHECKLIST.md** — Before changes: read docs, git checkpoint, inspect target component, confirm section order, identify assets, before screenshot. After changes: desktop/tablet/mobile test at 320/360/390/430/768/1024/1280/1440, no overflow, no duplicate, no text overlap, no broken image, no placeholder label in production, keyboard accessible, accordion accessible, CTA links, alt text, Lighthouse check, screenshot comparison, commit.

## Absolute Rules — Never Violate

- **Modify only requested files:** If task says add one new section below Warning Signs, only create new component file and edit src/app/page.tsx to append import + JSX sibling. Do not touch HeroSection, globals.css, other components.
- **Never redesign unrelated sections:** Do not change hero height 680, heading 58px line breaks Sleep is the / Foundation. etc, benefit circles 96px, CTA widths 220/220/272, statement strip 230 #353080.
- **Never add generic AI styling:** Prohibited: random gradients, floating glass cards, large border-radius cards >2px except facts 18px + share pill 9999px, dark tech backgrounds, neon, teal wellness palette, abstract blobs, stars, parallax, excessive motion, hover zoom on editorial images, plus/minus circles, numbered badges.
- **Never invent new content:** Use exact copy from CONTENT_COPY.md. If new section needed, copy from provided Arena prompt exactly, no shortening.
- **Never change approved colours:** Keep #F59A00 orange heading, #FF6500 hero orange, #35319B hero indigo, #3B35A3 indigo CTAs and dots, #F4C623 yellow highlights and NREM/REM headers, #E4B93D gold divider. Do not substitute teal, green, pink, pastel purple.
- **Never change Poppins:** `font-family: "Poppins", var(--font-poppins), sans-serif` only. No serif, no decorative display, no gradient text. Weights 400/500/600/700 via next/font/google.
- **Never add cards unless design system explicitly permits them:** Only approved card-like is Sleep Facts panel bg #F0EFF9 radius 18px (allowed) + share pill. No other sections should get rounded cards, shadows, outer borders.
- **Never duplicate existing components:** Check import order, no duplicate JSX like two <FaqSection/>.
- **Never remove approved sections:** All 15 must stay in exact order now (14 + Navbar). Navbar must stay first. Disclaimer must stay last. If adding 16th, insert before footer but after FAQ, keeping Navbar first. Verify order after every change.
- **Never replace entire pages for a local change:** Edit only necessary files, keep build passing.
- **Maintain desktop and mobile fidelity:** Test at all viewports checklist. Hero mobile stacking order critical: headline first, sleeping visual second, benefit row third, awake woman fourth, CTAs fifth, statement sixth.
- **Test at specified widths:** Use browser DevTools responsive toggle or preview URL full-screen.
- **Report files changed, visual rules preserved, responsive widths tested, assumptions, missing assets, unresolved differences** in every response.

## Specific Guardrails From Past Bug History

- **Bug: Four Pillars replaced Optimization:** Happened because array item replaced by index. Fix: Use independent component file per section, append only, never overwrite JSX array by index. Verify page.tsx after edit has all previous imports + new import.

- **Bug: Hero rectangular visible boundaries:** Sleeping woman and awake woman showed white rectangle checkerboard. Fix: Use mask-image feathered radial-gradient / linear-gradient as implemented: `WebkitMaskImage: linear-gradient(to left, black 72%, transparent 100%), linear-gradient(to top, transparent 0%, black 24%)` for sleeping, `linear-gradient(to bottom, black 0%, black 62%, rgba(0,0,0,0.78) 76%, transparent 92%)` for awake. Preserve masking.

- **Bug: Fact strip borders incorrect at breakpoints:** Original used conditional Tailwind border classes that conflicted. Fix: Use `<style dangerouslySetInnerHTML>` with media queries for .fact-cell border-right 2px #3B35A3 and border-bottom logic per breakpoint as now implemented — preserve logic.

- **Bug: Circular benefit images with visible square:** Ensure parent div `rounded-full overflow-hidden` and image `w-full h-full object-cover` not contain, plus shadow `0 3px 8px rgba(0,0,0,0.10)`.

- **Bug: Mobile horizontal overflow due to fixed widths:** Always use `w-[410px]` only with md: prefix or max-w-full, and use `minmax(0,1fr)` for grid columns to allow shrink. Never use `w-[1440px]` fixed without max-w.

- **Bug: FAQ accordion both desktop and mobile markup visible simultaneously:** Avoid rendering two separate desktop-mobile components both visible. Use one responsive component with Tailwind `hidden md:grid` + `block md:hidden` only when one hidden at any breakpoint (display none). Not two independent components mounted.

## AI Agent Response Format — Required After Every Coding Task

Every AI coding agent must state:

1. **Files inspected:** List files read via read_file tool before change (e.g., src/app/page.tsx, src/components/hero/HeroSection.tsx, DESIGN_SYSTEM.md etc)
2. **Files changed:** List files created/edited/deleted with brief purpose
3. **Visual rules preserved:** Cite which DESIGN_SYSTEM rules kept (e.g., kept hero 680px height, heading 58px #FF6500/#35319B exact breaks, benefit 96px circles, CTA 220/220/272 flat square, gold divider rgba(228,185,61,0.72), Poppins only)
4. **Responsive widths tested:** List viewports checked 320,360,390,430,768,1024,1280,1440 and observations (e.g., no overflow at 320, benefit labels readable, fact strip 1-col mobile correct)
5. **Any assumptions:** E.g., assumed new section should append after Disclaimer? Or used placeholder image because generation limit reached
6. **Any missing assets:** List temporary placehold.co URLs still present, or missing transparent PNG needed, or SVG icons hand-coded needing designer replacement
7. **Any unresolved differences:** Note any small deviations not worth delaying (e.g., heading could move 8-12px lower per previous notes but locked as good enough)

## Example Good Response

> Files inspected: src/app/page.tsx, src/components/hero/HeroSection.tsx, DESIGN_SYSTEM.md, RESPONSIVE_RULES.md, ASSET_MANIFEST.md, CONTENT_COPY.md
> Files changed: Created src/components/sleep-facts/SleepFactsSharingSection.tsx, edited src/app/page.tsx to append import and JSX sibling after WarningSignsSection
> Visual rules preserved: Kept section background white #FFFFFF, heading 30px 600 #F59A00 centered mb28, panel bg #F0EFF9 radius 18px, icon circle 86×86 white, indigo stroke 1.7, Share Fact pill 190×42 border #E7A62A, bottom CTA 500×48 #3B35A3 yellow Now #F4C623, gold divider bottom border rgba(228,185,61,0.72), Poppins only
> Responsive widths tested: 320 single column gap18 panel min-h250, 390 2-col? Actually Facts 1-col mobile correct, 768 2-col gap24 image 190? Actually facts grid 2-col gap24 panel 275, 1024 2-col gap28/36 panel 290, 1280 heading 30 text 16 button 190×42 CTA 500×48. No overflow at any width.
> Assumptions: Used placehold.co grey for images due to generation limit reached, final designer asset will replace at /public/assets/... path
> Missing assets: 4 × placehold.co 400×490 for pillars still temporary, needs final WebP, no transparent PNG needed here
> Unresolved differences: None, matches Photoshop 2×2 grid reference closely.

## Prohibited Shortcuts

- Do not run `next dev` long-lived process — use build_and_start for final validation
- Do not edit package.json directly — use install_npm_packages tool if needed
- Do not hardcode API keys — use process.env
- Do not output code text in response summary — only brief summary via tool, code via create_file/edit_file

## Final Validation Reminder

After any change, must run:
- `npx next typegen`
- `npm exec tsc -- --noEmit --pretty false`
- `npm run build`
- `build_and_start` tool

All must pass before finishing. Do not rely on platform post-turn preview build.

---
END AI_DEVELOPER_GUARDRAILS
