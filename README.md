# Sleep Wellness Health-Tech Landing — Arena

Full-stack Next.js (App Router) + PostgreSQL via Drizzle ORM + Tailwind CSS v4.

## Mandatory Documentation — Must Read Before Any Change

> **Any developer or AI agent must read these files before changing layout, styling, responsive behaviour, content, components, or assets.**

1. [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — Complete visual identity, colour tokens #F59A00 #3B35A3 etc, typography Poppins 400/500/600/700, layout max-widths, shape language, button variants, image direction, iconography, divider rules, approved section catalogue 14 sections, prohibited patterns
2. [RESPONSIVE_RULES.md](./RESPONSIVE_RULES.md) — Exact breakpoints 320-1440, philosophy mobile intentionally composed, per-section desktop/tablet/mobile grids, stacking orders, image aspects, heading/body/CTA sizes, allowed column counts, anti-overflow rules
3. [COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md) — Page entry point src/app/page.tsx, import/render order 14 sections, each component file path purpose semantic state data arrays assets interactive placeholder status, global styles src/app/globals.css & layout.tsx, warnings never duplicate/replace/nest
4. [ASSET_MANIFEST.md](./ASSET_MANIFEST.md) — Table file name, path, section, purpose, desktop/mobile dimensions, aspect, object-fit/position, status final/temporary/missing/needs transparent PNG/SVG/WebP, expected final replacement /public/assets/... naming kebab-case, alt text, performance critical vs lazy-load
5. [CONTENT_COPY.md](./CONTENT_COPY.md) — Extracted all approved copy exactly: hero exact line breaks Sleep is the / Foundation. / Sleep Chronotype / is the Blueprint., benefits, CTAs, statement strip 3 lines, chronotype intro 5 bullets, optimization 8 checklist + 2-line closing, pillars 4 titles+descriptions, better sleep 7 benefits, why matters 4 facts + Mind/Body/Life, sleep cycles NREM/REM categories + conclusion indigo strip, disorders Insomnia/OSA + bottom statement, warning signs 8 exact order + supporting + CTA, facts 4 + Share Fact + bottom CTA yellow Now, guidance heading/intro/para + CTA, FAQ 6 Q&A first open, disclaimer with (SDASD) orange highlight — WARNING do not rewrite without approval
6. [AI_DEVELOPER_GUARDRAILS.md](./AI_DEVELOPER_GUARDRAILS.md) — Strict visual reproduction rules, mandatory pre-check read order, never redesign unrelated sections, never add generic AI styling, never invent content, never change approved colours/Poppins/cards, never duplicate/remove sections, maintain fidelity, test viewports 320-1440, response format 7 items
7. [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) — Before changes checklist read docs, git checkpoint, inspect target component, confirm section order 14, identify assets, before screenshot; During coding rules flat rectangular buttons radius0 except facts 18px pill 9999px, minmax(0,1fr), w-full max-w-full, object-fit cover, semantic HTML, alt, focus states, accordion functional, never add cards shadows gradients; After changes desktop/tablet/mobile tests at 320/360/390/430/768/1024/1280/1440, no overflow, no duplicate, no text overlap, no broken image, no placeholder label in production, keyboard accessible, alt, Lighthouse, screenshot compare, commit; Viewport checklist
8. [CHANGELOG.md](./CHANGELOG.md) — Standard changelog, initial full reconstruction completed with 14 sections locked, desktop sections created responsive refinement pending, placeholder assets still present final designer replacement pending, hero corrections history, etc.

## Current Page Order — 14 Sections Locked

```tsx
<HeroSection /> // 680px seamless poster max-w 1440 heading 58px exact breaks 69% sleeping woman 96px benefits CTA 220/220/272
<HeroStatementStrip /> // 230px #353080 white/yellow
<ChronotypeIntroductionSection /> // 30px orange 410x345
<ChronotypeOptimizationSection /> // checklist 8 items 390x410 yoga
<DailyEnergyPillarsSection /> // Sleep/Movement/Nutrition/Light 245h
<BetterSleepBetterDaysSection /> // 7 benefits outlined boxes 470x420
<WhySleepMattersSection /> // FACT STRIP 4-col band + Mind/Body/Life 190h
<UnderstandingSleepCyclesSection /> // NREM vs REM comparison + #383477 conclusion
<CommonSleepDisordersSection /> // pale bg side-by-side Insomnia/OSA orange divider arrows
<WarningSignsSection /> // 8 line icons 68px gold panel 2x4 grid
<SleepFactsSharingSection /> // 2x2 lavender #F0EFF9 panels radius18 share pill
<AdditionalGuidanceSection /> // left text right 470x390 image CTA 310x44
<FaqSection /> // 6 FAQs accordion first open bullet dot 8px indigo chevron22
<DisclaimerFooter /> // black #000000 white14 orange (SDASD)
```

## Tech Stack

- Next.js 16.2.6 (Turbopack)
- React, TypeScript
- Tailwind CSS v4 via `@import "tailwindcss"`
- Poppins via `next/font/google` weights 400,600,700 variable --font-poppins
- Drizzle ORM + PostgreSQL (existing but not used for static landing)
- Globals: src/app/globals.css hero vars, * Poppins, button radius0

## Development

```bash
npx next typegen
npm exec tsc -- --noEmit --pretty false
npm run build
```

Preview URL generated via `build_and_start` tool, full-window preview link in build output.

## Assets

- Local: public/images/hero/ (10 files, temporary AI-generated), public/images/sleep/ (2 files 32KB)
- External placeholders: 15+ placehold.co grey with labels — must replace before production per ASSET_MANIFEST
- Inline SVGs: 8 warning black line stroke1.6 68px, 4 facts indigo stroke1.7 56px inside white circle 86px, share icon 20px, chevron 22px

## Placeholder Replacement Path

Final expected structure /public/assets/hero/, /public/assets/chronotype/, /public/assets/optimization/, /public/assets/pillars/, /public/assets/benefits/, /public/assets/sleep/, /public/assets/sleep-cycles/, /public/assets/disorders/, /public/assets/warnings/, /public/assets/facts/, /public/assets/guidance/, /public/assets/icons/ with naming conventions hero-sleeping-woman.webp, hero-awake-woman.png transparent, etc per ASSET_MANIFEST.

## Prohibited

- No generic AI visual style, random gradients, floating glass cards, large radius cards, dark tech backgrounds, neon, teal wellness palette, abstract blobs, stars, parallax, excessive motion, hover zoom editorial images, invented copy, unapproved cards, changing section order, modifying approved content, unsupported statistics.

## Validation

All docs exist, no file empty, exact colours included, responsive rules per section, component order documented, all text captured. No rendered page/CSS/components changed except README links added.
