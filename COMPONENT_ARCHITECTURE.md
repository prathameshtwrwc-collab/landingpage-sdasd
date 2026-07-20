# Component Architecture — Sleep Wellness Landing

Audited from live file system: src/app/page.tsx, src/components/_/_, src/app/layout.tsx, src/app/globals.css

## Page Entry Point

- **File:** `src/app/page.tsx`
- **Export:** `export default function HomePage()`
- **Dynamic:** `export const dynamic = "force-dynamic"` (forces server render, not static)
- **Root element:** `<main className="min-h-screen w-full bg-white">` contains 14 sibling sections in strict order
- **No wrapper providers, no navigation, no header/footer outside disclaimer.**

## Component Import Order (actual code) — Updated with Navbar

```tsx
import SiteNavbar from "@/components/navbar/SiteNavbar";
import HeroSection from "@/components/hero/HeroSection";
import HeroStatementStrip from "@/components/hero/HeroStatementStrip";
import ChronotypeIntroductionSection from "@/components/chronotype/ChronotypeIntroductionSection";
import ChronotypeOptimizationSection from "@/components/optimization/ChronotypeOptimizationSection";
import DailyEnergyPillarsSection from "@/components/pillars/DailyEnergyPillarsSection";
import BetterSleepBetterDaysSection from "@/components/better-sleep/BetterSleepBetterDaysSection";
import WhySleepMattersSection from "@/components/why-sleep/WhySleepMattersSection";
import UnderstandingSleepCyclesSection from "@/components/sleep-cycles/UnderstandingSleepCyclesSection";
import CommonSleepDisordersSection from "@/components/sleep-disorders/CommonSleepDisordersSection";
import WarningSignsSection from "@/components/warning-signs/WarningSignsSection";
import SleepFactsSharingSection from "@/components/sleep-facts/SleepFactsSharingSection";
import AdditionalGuidanceSection from "@/components/additional-guidance/AdditionalGuidanceSection";
import FaqSection from "@/components/faq/FaqSection";
import DisclaimerFooter from "@/components/footer/DisclaimerFooter";
```

## Component Render Order — Required Final Order — 15 Sections (Navbar First)

Must remain exactly:

```tsx
<main>
  <SiteNavbar />
  <HeroSection />
  <HeroStatementStrip />
  <ChronotypeIntroductionSection />
  <ChronotypeOptimizationSection />
  <DailyEnergyPillarsSection />
  <BetterSleepBetterDaysSection />
  <WhySleepMattersSection />
  <UnderstandingSleepCyclesSection />
  <CommonSleepDisordersSection />
  <WarningSignsSection />
  <SleepFactsSharingSection />
  <AdditionalGuidanceSection />
  <FaqSection />
  <DisclaimerFooter />
</main>
```

Verified: current page.tsx matches this order with Navbar first.

## New Component: SiteNavbar — Added

- **Path:** `src/components/navbar/SiteNavbar.tsx`
- **Client:** client (useState, useEffect, useRef for scroll, menu, active, focus)
- **Purpose:** Responsive transparent-to-white fixed navbar integrating with hero, healthcare-focused lightweight editorial
- **Semantic:** `<header id="site-navbar" fixed top0 left0 right0 z1000 w100% h64 mobile md68 lg72> <div max-w1380 px18 md32 lg48 mx-auto grid auto 1fr auto> Left brand a href # scrollTo top, Center nav aria-label Primary navigation hidden lg:flex gap30, Right CTA hidden lg:flex Take Test Now 150x40, Hamburger visible lg:hidden 44x44 aria-label Open/Close aria-expanded aria-controls mobile-navigation, Mobile panel fixed top64 left0 right0 z999 bg white border-top rgba(228,185,61,0.25) shadow 0 12px 28px rgba(35,31,90,0.12) padding18 20 24 opacity translateY -8→0 180ms>` + optional overlay rgba(31,27,83,0.12)
- **State:** isScrolled bool >50px scroll listener, isMenuOpen bool hamburger toggle, activeId string IntersectionObserver rootMargin -84px 0 -60% thresholds, wasMenuOpenRef for focus return, hamburgerRef panelRef headerRef
- **Data:** navItems array 5: Sleep Science #why-sleep-matters, Chronotypes #chronotypes, Sleep Benefits #better-sleep-better-days, Sleep Disorders #common-sleep-disorders, FAQ #faq-section, CTA Take Test Now scroll to #chronotypes
- **Assets:** Brand moon icon inline SVG 18/20 white on #35319B circle 36×36 desktop 32 mobile, hamburger 3 lines 24x2 gap5 #2F2A86, chevron not used but X animation via rotate 45deg translate5 5
- **Interactive:** Scroll listener passive, IntersectionObserver for activeId, Escape key close, outside click mousedown close, body overflow hidden lock while open, focus return to hamburger after close, nav link click close + scrollIntoView smooth block start with scroll-margin-top 84/76, CTA button scroll to #chronotypes, hover #332D92 translateY -1px, underline scaleX animation
- **Styles:** Initial transparent bg transparent border transparent shadow none text #2F2A86 brand, #2F2A86 links, #2F2A86 hamburger, Scrolled bg rgba(255,255,255,0.97) backdrop-filter blur10 border-bottom rgba(228,185,61,0.32) shadow 0 4px 18px rgba(35,31,90,0.08) brand #2F2A86 links #29275E active #F59A00 hover #F59A00, transition background-color 220ms ease, box-shadow 220ms, border-color 220ms, color 180ms, height unchanged
- **Responsive:** Desktop lg:flex nav+CTA visible, tablet md 68px hide center nav+CTA below 1024 show brand+hamburger, mobile 64px same transparent-to-white, brand icon 32 font16, panel top64 md68 lg hidden
- **Accessibility:** header nav aria-label, mobile nav aria-label Mobile primary navigation, button aria-label Open/Close, aria-expanded, aria-controls mobile-navigation, aria-current location for active, focus ring #3B35A3 offset, keyboard navigation, focus return, Escape close
- **Hero offset:** HeroSection outer section now pt-[64px] md:pt-[68px] lg:pt-[72px] to account for fixed navbar 64/68/72 heights per spec, prevent covering heading, no extra blank below navbar beyond required

## Each Component File Path & Purpose

### 1. HeroSection — Updated to Single Composite Background (2026-05-11)

- **Path:** `src/components/hero/HeroSection.tsx`
- **Client:** `"use client"` — uses useEffect for preload link
- **Purpose:** Campaign poster hero now using one composite background image, easier to maintain, no overlapping cutout layers, visually faithful to Photoshop
- **Semantic:** `<section aria-label="Sleep is the Foundation hero" className="relative w-full overflow-hidden bg-white pt-[64px] md:pt-[68px] lg:pt-[72px] min-h-0 md:min-h-[650px] lg:min-h-[650px] md:max-h-[720px]">` — outer pt accounts for fixed navbar 64/68/72, min-height 650 max 720 per spec
- **State:** None static except preload effect
- **Data arrays:** Benefit labels hard-coded Better Sleep / Better Energy / Better Life, CTA labels Take Test Now / Learn About Sleep / Consult a Sleep Specialist
- **Assets imported (NEW — old layered system RETIRED):**
  - **Primary composite:** `/public/assets/hero/hero-bg.png` (8.2MB PNG source composite generated via ImageMagick from previous layers) and `/public/assets/hero/hero-composite-background.webp` (79KB WebP production recommended) — critical above-the-fold, preload via `link rel=preload as=image href=/assets/hero/hero-bg.png fetchpriority=high`
  - **Benefit circles retained:** /images/hero/benefit-sleep.jpg 90KB, benefit-energy.jpg 152KB, benefit-life.jpg 202KB — circular crops rounded-full
  - **REMOVED from DOM and no longer loaded:** sleeping-woman.png 1.9MB, awake-woman.png 1.4MB, pillow-yellow.png 1.6MB, clouds-back.png 685KB, clouds-front.png 986KB, mask-image rules, z-index stacks, absolute image offsets, mobile artwork offsets — old layered cloud/cutout approach retired per spec, do not leave hidden duplicate images
- **Structure New:**
  - Desktop background: hidden md:block absolute inset0 z0 pointer-events-none select-none `background-image: url("/assets/hero/hero-bg.png")`, `background-repeat: no-repeat`, `background-size: cover`, `background-position: center top` (tablet 58% top, large desktop >1440 center 8%, fallback 52% top)
  - Readability overlay: hidden md:block absolute inset0 z1 `background: linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.90) 26%, rgba(255,255,255,0.42) 46%, rgba(255,255,255,0.00) 67%)` only left, not covering right subject
  - Content container: relative z2 max-w1380 mx-auto px18 md32 lg64 pt28 md36 lg42 pb28 md40 lg44 normal document flow
  - Heading preserved exact copy breaks: Sleep is the / Foundation. / Sleep Chronotype / is the Blueprint., desktop clamp(50px,4.5vw,68px) line1.07 tracking -0.04 orange #FF6500 indigo #35319B, not centered, max-w 560, not over face
  - Mobile visual block: block md:hidden w100% mt18 mb8 aspect 4/3 background-image same url background-position 68% center (72% if awake cropped) cover, dedicated crop below headline order Navbar, Headline, Background visual area, Benefits, CTA stack, Statement strip
  - Benefit row: normal flow below headline grid repeat3 max-w660 gap0 mt42 desktop mt24 mobile, circular images 96px desktop clamp64-82 mobile, yellow vertical dividers gold #F3C416 h56 md86 lg104
  - CTA row: normal flow beneath benefits grid 220 220 270 gap8 mt34 desktop mt22 mobile grid1fr gap10 w100% h48, not detached white strip, not overlapping subject
- **Interactive:** CTA buttons hover -1px brightness0.96 focus ring, no onClick yet placeholders
- **Placeholder status:** Benefit circles temporary but finalish, hero composite PNG is composite from old AI assets converted to one image — should be replaced with final designer-provided `hero-bg.png` at same path, WebP/AVIF production recommended
- **Responsive:** Desktop min-h650 max720 cover center top, tablet cover position 58% top headline width 430-500 benefits one row CTAs 2+1 only if necessary, mobile dedicated visual block 4/3 aspect 68% center headline clamp 38 10.5vw 50 line1.04 mb18 benefits grid3 gap8 circles64-78 labels13-16 yellow dividers, CTAs grid1fr gap10 mt22 w100% h48 no overlap, no horizontal overflow min-w0, no duplicate image, no separate cloud layers
- **Performance:** Image converted to WebP hero-composite-background.webp 79KB, retain PNG source, preload hero image via useEffect link preload, avoid loading removed cloud/cutout assets (saved ~5MB), define intrinsic dimensions via aspect ratio, do not lazy-load above-the-fold
- **Accessibility:** Decorative composite artwork as CSS background no redundant alt, heading selectable text, buttons real buttons, background does not reduce contrast, reduced-motion unaffected

### 2. HeroStatementStrip

- **Path:** `src/components/hero/HeroStatementStrip.tsx`
- **Client:** client
- **Purpose:** Dark indigo statement below hero
- **Semantic:** `<section aria-label="Sleep education statement" relative w-full overflow-hidden flex items-center justify-center bg #353080 min-h 230>`
- **State:** None
- **Assets:** /images/hero/statement-background.jpg (32546 bytes) opacity 0.18 blur
- **Interactive:** None
- **Placeholder:** final-ish but low-contrast background

### 3. ChronotypeIntroductionSection

- **Path:** `src/components/chronotype/ChronotypeIntroductionSection.tsx`
- **Client:** client
- **Purpose:** Introduce chronotype + influences list
- **Semantic:** `<section id="chronotypes" aria-label="Discover Your Natural...">` — id chronotypes
- **State:** None
- **Data:** bullet list 5 items hard-coded `<li>When you feel most alert` etc
- **Assets:** /images/hero/chronotype-meditation.jpg (144600 bytes)
- **Interactive:** CTA button hover -1px focus outline rgba(59,53,163,0.28)
- **Placeholder:** meditation image considered final-ish but may need WebP

### 4. ChronotypeOptimizationSection

- **Path:** `src/components/optimization/ChronotypeOptimizationSection.tsx`
- **Client:** client
- **Purpose:** Checklist 8 items + yoga
- **Semantic:** `<section id="chronotype-optimization" aria-label="Every chronotype has unique strengths...">`
- **State:** None
- **Data array:** `checklistItems = ["Sleep quality", "Energy levels", "Productivity", "Focus", "Exercise performance", "Recovery", "Nutrition timing", "Work-life balance"]` mapped
- **Assets:** `https://placehold.co/390x410/f5f5f5/666?text=Yoga+-+Woman+balancing+outdoors` — TEMPORARY grey placeholder — must be replaced with `/public/assets/optimization/optimization-yoga.webp` final
- **Interactive:** None

### 5. DailyEnergyPillarsSection

- **Path:** `src/components/pillars/DailyEnergyPillarsSection.tsx`
- **Client:** client
- **Purpose:** 4 pillars
- **Semantic:** `<section id="energy-pillars" aria-label="The Four Pillars...">`
- **State:** None
- **Data array:** `pillars = [{title:"Sleep", image:placehold 400x490, alt:"Woman sleeping...", description:"The foundation..."}, Movement, Nutrition, Light Exposure]`
- **Assets:** 4 × placehold.co 400x490 grey — TEMPORARY — need final `/public/assets/pillars/pillar-sleep.webp` etc
- **Interactive:** CTA button Explore Sleep Improvement Strategies hover -1px

### 6. BetterSleepBetterDaysSection

- **Path:** `src/components/better-sleep/BetterSleepBetterDaysSection.tsx`
- **Client:** client
- **Purpose:** 7 benefits outlined boxes + sleeping image
- **Semantic:** `<section id="better-sleep-better-days" aria-label="Better Sleep Creates Better Days">`
- **State:** None
- **Data array:** `benefitItems = ["Better Physical Health", "Better Mental Health", "Better Emotional Stability", "Better Relationships", "Better Recovery", "Better Productivity", "Better Quality of Life"]`
- **Assets:** `https://placehold.co/470x420/... Woman sleeping peacefully bright room` TEMPORARY
- **Interactive:** None

### 7. WhySleepMattersSection

- **Path:** `src/components/why-sleep/WhySleepMattersSection.tsx`
- **Client:** client
- **Purpose:** Fact strip + Mind/Body/Life
- **Semantic:** `<section id="why-sleep-matters" aria-label="Why Sleep Matters">`
- **State:** None
- **Data arrays:** `facts = [{value:"7 to 9 Hours", description:"Recommended..."}, 90-120 Minutes..., 4 to 6 Cycles..., 1 in 3 Adults...]` and `pillars = [{title:"Mind", image:placehold 400x300, alt:"Person representing...", description:"Learning, memory..."}, Body, Life]`
- **Assets:** `/images/sleep/fact-strip-background.jpg` (32KB) — final-ish reused for disorders background — plus 3 × placehold 400x300 grey for Mind/Body/Life TEMPORARY
- **Interactive:** CTA Explore Sleep Cycles

### 8. UnderstandingSleepCyclesSection

- **Path:** `src/components/sleep-cycles/UnderstandingSleepCyclesSection.tsx`
- **Client:** client
- **Purpose:** NREM vs REM comparison grid + conclusion strip
- **Semantic:** `<section id="understanding-sleep-cycles" aria-label="Understanding Sleep Cycles">`
- **State:** None
- **Data arrays:** `categoryLabels = ["Primary Function","Approximate Duration","Key Activities","Primary Benefit"]`, `nremRows = [...]`, `remRows = [...]`, `stripImages = [{src:placehold 170x130, alt: Sleep health illustration}, Person sleeping, Sleep tracker watch]`
- **Assets:** 3 × placehold 170x130 grey TEMPORARY — final should be `/public/assets/sleep-cycles/sleep-health-illustration.webp` etc
- **Interactive:** None
- **Mobile split:** Has hidden md:grid for desktop grid `170px 190px 1fr 16px 1fr` and block md:hidden for mobile stacked NREM/REM blocks — same data, not duplicate IDs? Uses same arrays but separate DOM, okay as long as IDs not duplicated (no IDs inside).

### 9. CommonSleepDisordersSection

- **Path:** `src/components/sleep-disorders/CommonSleepDisordersSection.tsx`
- **Client:** client
- **Purpose:** Side-by-side Insomnia and OSA with pale background and arrows
- **Semantic:** `<section id="common-sleep-disorders" aria-label="Common Sleep Disorders">`
- **State:** None (arrows are visual placeholders no carousel logic yet)
- **Data:** Hard-coded 2 disorders Insomnia + OSA descriptions
- **Assets:** `/images/sleep/disorders-background.jpg` (32KB copy of fact-strip-background) background with white overlay 0.84, plus 2 × placehold 500x280 grey TEMPORARY for insomnia tired woman / OSA CPAP mask — final need `/public/assets/disorders/insomnia.webp` and `osa-cpap.webp`
- **Interactive:** Previous/Next arrow buttons aria-label but no functional carousel — placeholder

### 10. WarningSignsSection

- **Path:** `src/components/warning-signs/WarningSignsSection.tsx`
- **Client:** client
- **Purpose:** 8 warning signs with line icons inside gold panel
- **Semantic:** `<section id="warning-signs" aria-label="Warning Signs...">`
- **State:** None
- **Data array:** `warningSigns = [{label:"Loud Habitual Snoring", Icon:IconLoudSnoring}, Pauses..., Waking up Gasping..., Excessive Daytime Sleepiness..., Falling Asleep while Driving..., Persistent Insomnia..., Unusual Movements..., Significant impact...}]` — 8 items order exact
- **Assets:** 8 inline SVG icons hand-coded no external files — final may be replaced with SVG components from designer
- **Interactive:** CTA Consult a Sleep Specialist hover -1px

### 11. SleepFactsSharingSection

- **Path:** `src/components/sleep-facts/SleepFactsSharingSection.tsx`
- **Client:** client
- **Purpose:** 4 fact panels 2×2 with share buttons
- **Semantic:** `<section id="sleep-facts-sharing" aria-label="Sleep Facts Worth Sharing">`
- **State:** None (share buttons placeholder no share logic)
- **Data array:** `facts = [{icon:IconBodyClock, text:"Your body clock influences...", shareLabel:"Share fact about the body clock"}, {icon:IconSleepCycles, text:"A typical night's sleep..."}, {icon:IconSleepHealth, text:"Sleep plays a critical role..."}, {icon:IconBetterHabits, text:"Small improvements..."}]`
- **Assets:** 4 inline SVG icons Indigo stroke 1.7 (body clock, sleep cycles, sleep health, better habits) + ShareIcon 20px 3 nodes — no external image files, final may keep SVG or replace
- **Interactive:** Share Fact buttons aria-label per fact, hover bg #FFF9EB, bottom CTA Share These Facts... with yellow Now

### 12. AdditionalGuidanceSection

- **Path:** `src/components/additional-guidance/AdditionalGuidanceSection.tsx`
- **Client:** client
- **Purpose:** Left text right image + centered CTA
- **Semantic:** `<section id="additional-guidance" aria-label="Need Additional Guidance">`
- **State:** None
- **Data:** Hard-coded heading Need Additional Guidance?, intro The right support..., paragraph Sleep concerns...
- **Assets:** `https://placehold.co/470x390/... Woman waking refreshed...` TEMPORARY — final `/public/assets/guidance/guidance-waking.webp`
- **Interactive:** CTA Talk to a Sleep Specialist

### 13. FaqSection

- **Path:** `src/components/faq/FaqSection.tsx`
- **Client:** client (must be client because useState)
- **Purpose:** Accordion FAQ 6 Q&A first open default
- **Semantic:** `<section id="faq-section" aria-labelledby="faq-heading">` + `<h2 id="faq-heading">FAQ SECTION</h2>`
- **State:** `const [openIndex, setOpenIndex] = useState<number | null>(0)` — first open default. Toggle: prev === idx ? null : idx — only one open at a time, clicking open closes it. Chevron rotation style transform rotate90 when isOpen.
- **Data array:** `faqs = [{q:"What is a chronotype?", a:"A chronotype is your natural biological preference..."}, What are the main chronotypes?, How many hours..., What is REM sleep?, What is difference..., When should I seek help...]` with answers exact
- **Assets:** No images, Chevron SVG polyline points 9 18 15 12 9 6 stroke #C5C5C5 strokeWidth 2.5 transition-transform 180ms
- **Interactive:** Trigger button with aria-expanded aria-controls id faq-trigger-{idx} / faq-panel-{idx} role region, focus outline rgba(59,53,163,0.24)
- **Behavior:** Height transition via maxHeight 400/0 opacity, hidden attribute when not open

### 14. DisclaimerFooter

- **Path:** `src/components/footer/DisclaimerFooter.tsx`
- **Client:** client (no state but marked)
- **Purpose:** Black disclaimer footer
- **Semantic:** `<footer aria-labelledby="disclaimer-heading">` + `<h2 id="disclaimer-heading">DISCLAIMER</h2>`
- **State:** None
- **Data:** Hard-coded paragraph exact copy with highlight (SDASD) orange #F59A00 600
- **Assets:** None

## Which Sections Have Interactive State

- **FaqSection:** useState openIndex number|null, first open default, toggle logic
- **Potentially share buttons, disorder arrows:** Have button elements but no state yet — placeholders
- All other sections static — no useState, no useEffect

## CTA Destinations (Current Implementation)

- All CTA buttons are `<button type="button">` with no onClick navigation — placeholders
- Labels: Take Test Now (hero benefits + chronotype intro + guidance? actually hero CTA Take Test Now purple, Learn About Sleep orange, Consult a Sleep Specialist orange; chronotype intro Take Test Now 205×36; optimization none; pillars Explore Sleep Improvement Strategies 320×40; Better Sleep none; Why Matters Explore Sleep Cycles 205×38; Sleep Cycles none; Disorders none arrows; Warning Consult a Sleep Specialist 235×40; Facts Share Fact ×4 + Share These Facts with Your Loved Ones Now 500×48; Guidance Talk to a Sleep Specialist 310×44; FAQ none; Disclaimer none)
- Final destinations should be defined later — keep button elements, replace with Next Link or onClick router.push

## Global Styles & Responsive Utilities

- **Global CSS:** `src/app/globals.css` — `@import "tailwindcss";` + `:root` hero color vars (--hero-orange #FF6A00 etc) + `* {font-family:"Poppins", var(--font-poppins), sans-serif;}` + html -webkit-font-smoothing + `button {border-radius:0;}` to enforce flat rectangular default
- **Layout:** `src/app/layout.tsx` — imports `Poppins` from `next/font/google` weights 400,600,700 variable --font-poppins display swap, metadata title/description, html lang en className poppins.variable, body bg-white text-[#171717] antialiased font--[var(--font-poppins)]
- **Tailwind:** Using Tailwind v4 via `@import "tailwindcss"` (postcss.config.mjs exists), responsive prefixes `md:` 768px `lg:` 1024px, arbitrary values `w-[410px]` etc, arbitrary `min-[400px]` for hero
- **No custom responsive utility file** — all responsive handled inline Tailwind classes + occasional `<style dangerouslySetInnerHTML>` for fact-cell border-right logic per breakpoint (Why Sleep) and pillar-img-height etc — acceptable but should be moved to CSS modules later
- **Mask images:** Used for hero clouds feathering: `WebkitMaskImage: radial-gradient(...)` + `maskImage` — critical for seamless poster look, must be preserved

## Asset Import Patterns

- Images imported via `<img src="/images/hero/...">` not Next Image component — intentional to preserve exact sizing and avoid Next optimization interfering with mask? Should stay `<img>` for hero transparent cutouts. For below-fold sections, could migrate to `next/image` later but currently `<img>` or placehold.co external URLs.
- External placeholders `https://placehold.co/...` — 8+ occurrences — temporary grey labels — must be replaced before production
- Background images via inline style `backgroundImage: url("/images/...")` with linear gradient overlay white 0.82/0.84 etc
- Inline SVGs for icons — no external svg files currently

## Warnings — Critical Implementation Rules

- **Never render a component twice:** Verify page.tsx has 14 unique imports, no duplicates. Check for copy-paste errors where same component imported twice alias.
- **Never place one section inside another:** All sections are siblings inside `<main>`. Never nest `<ChronotypeOptimizationSection>` inside `<ChronotypeIntroductionSection>` etc — would break border dividers and semantics.
- **Never replace a sibling when inserting new component:** When adding new section, append after last, do not overwrite previous JSX — bug previously happened: Four Pillars replaced Optimization because inserted by index replacement — must check file diff.
- **Never maintain visible duplicate mobile/desktop markup that both render simultaneously:** UnderstandingSleepCycles has `hidden md:grid` desktop and `block md:hidden` mobile — okay because one hidden via CSS display none at any breakpoint, not both visible. But avoid creating two separate components that both render visible at same time.
- **Never reuse IDs:** Each section id must be unique: chronotypes, chronotype-optimization, energy-pillars, better-sleep-better-days, why-sleep-matters, understanding-sleep-cycles, common-sleep-disorders, warning-signs, sleep-facts-sharing, additional-guidance, faq-section, disclaimer-heading etc. FAQ uses trigger ids `faq-trigger-${idx}` and `faq-panel-${idx}` must remain unique.
- **Preserve semantic heading order:** h1 only in hero (Sleep is the Foundation). All other sections h2 (FAQ SECTION, DISCLAIMER, etc) and h3 for pillars Mind/Body/Life, disorders, etc. Do not add second h1.
- **Inspect the DOM after adding a section:** Use browser DevTools or build preview URL, confirm 14 sections counted, no duplicate, no missing, no overflow-x.

---

END COMPONENT_ARCHITECTURE
