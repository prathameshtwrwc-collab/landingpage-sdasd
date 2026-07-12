# Implementation Checklist — Sleep Wellness Landing

Use this checklist for every change to ensure design language preserved and responsive fidelity maintained.

## Before Changes

- [ ] Read DESIGN_SYSTEM.md — understand healthcare brochure identity, colours #F59A00 #3B35A3 #35319B #F4C623 #E4B93D, typography Poppins 400/500/600/700, shape square corners except facts 18px + pill, buttons flat, images realistic wellness
- [ ] Read RESPONSIVE_RULES.md — check breakpoints 320-389 small mobile, 390-479 standard, 480-767 large mobile, 768-1023 tablet, 1024-1439 desktop, 1440+ large desktop, per-section desktop grid, tablet grid, mobile stacking order, image aspect ratios
- [ ] Read COMPONENT_ARCHITECTURE.md — confirm required render order 14 sections: Hero, StatementStrip, ChronotypeIntro, Optimization, Pillars, Better Sleep, Why Matters, Sleep Cycles, Common Disorders, Warning Signs, Sleep Facts, Additional Guidance, FAQ, DisclaimerFooter — ensure no duplication, no nesting
- [ ] Read ASSET_MANIFEST.md — identify current file name, path, purpose, desktop/mobile dimensions, aspect ratio, object-fit/position, placeholder vs final, expected final replacement, transparency requirement, alt text, performance priority critical above-the-fold vs lazy-load
- [ ] Read CONTENT_COPY.md — verify exact headings, subheadings, paragraphs, bullet items, facts, CTA labels, FAQ Q&A, disclaimer not to be rewritten
- [ ] Read AI_DEVELOPER_GUARDRAILS.md — strict visual reproduction, modify only requested files, never redesign unrelated sections, never add generic AI styling, never invent content, maintain fidelity, test at widths, report format
- [ ] Make Git checkpoint or note current preview URL full-screen link to compare before/after
- [ ] Inspect target component file via read_file — understand current grid, colours, typography, image treatment, CTA style
- [ ] Confirm section order in src/app/page.tsx — count 14, correct order, no missing
- [ ] Identify assets needed — check if final designer asset exists in /public/assets/... or need placehold.co temporary with TODO comment
- [ ] Capture before screenshot at 1280 and 390 widths for visual comparison

## During Changes — Coding Rules

- [ ] Create separate reusable component `<NewSection />` per section, do not combine into hero or other component
- [ ] Use only Poppins `"Poppins", var(--font-poppins), sans-serif` — no other font
- [ ] Use exact colour tokens from DESIGN_SYSTEM — no teal, green, pink, pastel purple, navy-grey
- [ ] Use flat rectangular CTAs `rounded-none shadow-none` except Share Fact pill 9999px + Facts panel radius 18px allowed
- [ ] Use thin gold divider `border-bottom: 1px solid rgba(228,185,61,0.72)` only one between sections
- [ ] Use square image corners `borderRadius:0` except facts panel 18px, benefit circles rounded-full, warning icons unboxed
- [ ] Use `minmax(0,1fr)` for grid columns to prevent overflow, add `min-w-0` where needed
- [ ] Use `w-full max-w-full` not fixed desktop widths on mobile, use `md:w-[...]` for desktop-only fixed
- [ ] Use `object-fit: cover` and `object-position: center` (or right top for hero sleeping) for images, preserve focal points
- [ ] Add semantic HTML: `<section id="..." aria-label="...">`, `<h2>` for section heading, `<h3>` for pillar titles / disorder titles / Mind Body Life, `<footer>` for disclaimer, `<ul>` for lists where appropriate
- [ ] Add alt text for every meaningful image per ASSET_MANIFEST and CONTENT_COPY, empty alt `alt=""` aria-hidden for decorative clouds
- [ ] Add focus states for buttons: `outline: 3px solid rgba(59,53,163,0.28) outlineOffset 3px` onFocus/onBlur inline handlers as implemented
- [ ] For interactive accordion (FAQ): First open default `useState(0)`, only one open at time, aria-expanded/aria-controls, chevron rotate 90deg, transition 180ms ease, hidden attribute when closed, maxHeight 400/0
- [ ] For disorder arrows: aria-label Previous/Next, circular grey #6F6F6F 44×44, white chevron stroke 2.5, box-shadow 0 2px 6px rgba(0,0,0,0.12), placeholder no carousel logic yet unless spec says functional
- [ ] Never add cards, shadows (except allowed hero benefit circle shadow and disorder arrow shadow), rounded cards, gradients, glassmorphism, neon, blobs, stars, parallax, hover zoom
- [ ] Never embed text permanently into images for normal content
- [ ] Append new component as sibling in page.tsx, do not replace, do not nest, verify import order matches render order

## After Changes — Validation Checklist

- [ ] Desktop test at 1280px: Check inner max-w 1060/1120/1180, padding 48px, heading 30px orange centered, body 14-16px, images correct dimensions (e.g., Chronotype 410×345, Optimization 390×410, Pillars 245h, Better Sleep 470×420, Why Matters 190h, Sleep Cycles 170×390 strip + NREM/REM 17px headers yellow #F4C623, Disorders 280h side-by-side orange divider 2×320, Warning 4-col icons 68×68 gold panel border 1.5px #E4B93D, Facts 2×2 panels 290h radius18 icon circle86×86 share pill190×42 bottom CTA500×48, Guidance 470×390 image + 310×44 CTA, FAQ 30px heading rows border-bottom rgba(120,120,120,0.55) bullet 8px indigo dot question17 chevron22 answer14 first open, Disclaimer black #000000 white14 orange highlight (SDASD) #F59A00)
- [ ] Tablet test at 768px and 1024px: Verify grids change per RESPONSIVE_RULES — e.g., Chronotype 1.15fr 410 gap32 heading27, Optimization 1fr 390 gap40 heading27, Pillars repeat2 gap22 image290 heading27, Better Sleep 380+1fr gap32 heading27, Why Matters fact strip 2×2 dividers correct, Sleep Cycles 130/165/1fr/16/1fr heading27 supporting16, Disorders 1fr 1px 1fr gap20 image240, Warning 4×2 or 2-col gap28/14 icon58 label13, Facts 2-col gap24 panel275 icon78, Guidance 1fr 390 gap36 heading27, FAQ px32 container820 heading27 question16, Disclaimer px32
- [ ] Mobile test at 390px: Verify stacking orders per section docs: Hero headline first → sleeping visual second → benefits third → awake fourth → CTAs fifth stacked full width h48 → statement strip sixth; Chronotype heading→para→label→list→image h280→conclusion→CTA; Optimization heading→checklist→image h320→closing; Pillars 2-col standard mobile (1 col <360) gap14 image190 titles17 desc13 supporting14 CTA min100%/310×42; Better Sleep list first → image aspect4/3 mt24 heading24 subtitle15 label14; Why Matters fact strip stacked single column min-h110 border-bottom rgba(59,53,163,0.18) heading24 label16 orange15 black14 Mind/Body/Life stacked gap28 images 16/9; Sleep Cycles heading24 supporting15 intro14 image strip 3×120px NREM block + REM block grid130+1fr conclusion15 padding24/18; Disorders stack heading24 subtitle14 insomnia image aspect4/3 → title18 → desc14 → horiz orange divider 2×100% my24 → OSA same → arrows pair centered gap12 → statement bar width100% font14; Warning 2-col grid gap28/16 icons52 labels12.5 supporting14 CTA min100%/230×42; Facts 1-col gap18 panel min-h250 radius16 icon74×74 icon46 text14 button170×42 bottom CTA full width auto min48 font15; Guidance heading24 intro15 para14 image 4/3 mt24 CTA min100%/300×44 mt24 text left only CTA centered; FAQ px20 heading24 trigger grid 8px 1fr 22px gap12 padding14/0 min-h56 question14 answer13 line1.6 padding0 28 16 20; Footer px20 heading14 para12 line1.7 left
- [ ] No overflow at any width: Check body scrollWidth === clientWidth, no horizontal scroll bar, especially hero max-w1440 mx-auto overflow-hidden, fact strip 100% not fixed, warning grid minmax(0,1fr), all images w-full max-w-full
- [ ] No duplicate section: Count sections in DOM via DevTools querySelectorAll('section, footer') should be 14 (13 sections + 1 footer) or 14+ new if added, no duplicate IDs, no duplicate headings like two FAQ SECTION
- [ ] No text overlap: Ensure hero headline not over sleeping woman face, benefit labels readable not clipped, warning labels not overlapped by icons, FAQ question not overlapping chevron
- [ ] No broken image: All <img src> loads, no 404, placeholder.co labels visible? Should be flagged as temporary — if final production, must not have grey placeholder label visible — check each image network tab
- [ ] No placeholder label in production: If still using placehold.co grey with text like "Yoga - Woman balancing outdoors" visible label, must be noted as temporary and replaced before final client delivery — checklist must list remaining placeholders from ASSET_MANIFEST
- [ ] Buttons keyboard accessible: Tab through all CTAs, focus outline visible 3px rgba(59,53,163,0.28) offset 3px, enter key triggers button, no div with onClick without role button
- [ ] Accordion accessible: FAQ first open default, aria-expanded true for open, false for closed, aria-controls matches panel id, panel role region aria-labelledby trigger id, chevron rotates, only one open at a time, clicking open closes, focus visible
- [ ] CTA links correct: Currently buttons have no onClick — if wired to next navigation, verify href correct (e.g., /test, /sleep-specialist) — keep as button placeholder until final routing defined
- [ ] Image alt text correct: Verify per CONTENT_COPY alt texts exist and are appropriate, decorative images empty alt aria-hidden, warning icons aria-hidden true, facts icons aria-hidden true
- [ ] Lighthouse performance check: Run Lighthouse or at least check image sizes — hero sleeping 1.9MB too large must be optimized to <400KB WebP, awake 1.4MB to <300KB, pillow 1.6MB to <300KB, clouds 700KB/1MB to <200KB each, benefit jpgs ~90-200KB okay, chronotype 144KB okay, fact-strip 32KB okay, placehold.co external not optimized but temporary
- [ ] Screenshot comparison: Capture before/after at 1280 and 390, compare visual fidelity to Photoshop reference (exact line breaks, colours, spacing)
- [ ] Git commit with descriptive message: e.g., "Add Exact Warning Signs Section — 8 black line icons 68px gold panel 2x4 grid CTA 235x40"

## Viewport Checklist — Must Test Each

- [ ] 320px small mobile — tightest, check overflow, benefit labels 3 cols still readable? Four Pillars 2-col may need 1-col below 360 per spec allowance
- [ ] 360px — borderline where Four Pillars may switch to 1 col, Warning 2-col still okay, Facts 1-col
- [ ] 390px standard mobile — iPhone 12/13/14 width, main mobile target
- [ ] 430px large mobile — check spacing still not desktop, CTAs still stacked full width? Pillars 2-col gap14 okay
- [ ] 768px tablet start — md: styles activate, check grid changes, padding 32-36
- [ ] 1024px desktop start — lg: styles, padding 48, headings 30px
- [ ] 1280px desktop — main design target, max-w 1120/1180, gap 76/54 etc
- [ ] 1440px large desktop — hero max-w 1440 h680, should not exceed 720 before statement strip, content centered

After testing all viewports, run final validation:

- `npx next typegen`
- `npm exec tsc -- --noEmit --pretty false`
- `npm run build`
- `build_and_start` tool

All must pass before considering task complete.

---
END IMPLEMENTATION_CHECKLIST
