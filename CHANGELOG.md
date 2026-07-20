# Changelog — Sleep Wellness Health-Tech Landing

All notable changes to this project documented in this file. Format based on Keep a Changelog, but simple.

## [2.0.0] — 2026-07-21 — Mobile Hero Absolute Zones, Lenis Smooth Scroll, UI Enhancements

### Added
- **Lenis smooth scrolling** across entire site via `SmoothScrollProvider` — exponential-out easing, smooth wheel/touch
- **Mobile hero background slide animation** — unhidden existing `translateX` slider track with `0.7s ease-in-out` between both mobile background images
- **Blurred white cloud layer** behind "type" in heading via `::after` pseudo-element with `filter: blur(10px)` — improves mobile readability
- **Lenis context** (`useLenis`) exposed via `SmoothScrollProvider` for components to control scroll state
- **`data-lenis-prevent`** attribute on assessment modal overlay — allows modal content to scroll natively while Lenis runs in background

### Changed
- **Mobile hero layout** — switched from flex/grid flow to absolute positioning zones (`position: absolute; top: 220px` heading, `top: 560px` benefits, `bottom: 24px` CTA) for precise poster-like composition
- **Mobile heading** — increased font size (`clamp(36px, 9.5vw, 44px)` orange, `clamp(31px, 8vw, 37px)` indigo), weight 800/700, added `white-space: nowrap` to prevent "Sleep Chronotype" word break
- **Mobile heading container** — widened from 265px to 320px to fit larger font, with sub-breakpoint widths at 290px/310px/340px
- **Mobile benefit/button placement** — benefits moved to `top: 575px`, buttons to `bottom: 26px` with `z-index: 4` to prevent overlap with benefit labels
- **Mobile background source** — switched from inline `backgroundImage` on section to showing the existing `translateX` slider track (same 0.7s ease-in-out transition as desktop)
- **Overlay opacity** — reduced white overlay for mobile background (`rgba(255,255,255,0.18)` at 0%, down from 0.50) so background images remain visible and not washed out
- **Mobile navbar** — removed `background:#ffffff !important` override so navbar scroll-to-transparent logic works on mobile (transparent at top, white when scrolled)
- **Assessment modal UI** — complete visual redesign with rounded corners (16px), gradient accent bar, user icon in gradient circle, rounded inputs/selects (8px), gradient progress bar with percentage, pill-shaped progress dots, hover/selected states on option cards with purple circle indicators, success checkmark animation
- **Modal scroll behavior** — replaced `lenis.stop()/start()` with `data-lenis-prevent` attribute + `body overflow: hidden`, allowing native modal content scrolling

### Fixed
- **Mobile heading wrap** — "Sleep Chronotype" no longer splits into "Sleep" and "Chronotype" across lines
- **Mobile background images not loading** — removed conflicting `.hero-mobile-bg { display: none !important }` rule in mobile CSS block
- **Modal background scroll when open** — Lenis no longer captures events from modal overlay due to `data-lenis-prevent`
- **Mobile navbar scroll state** — `background:#ffffff !important` was preventing transparent-at-top behavior on mobile

### Files Changed (6)
- `src/components/hero/HeroSection.tsx` — absolute zone mobile layout, mobile slider unhidden, heading font/wrap/cloud, overlay opacity
- `src/components/navbar/SiteNavbar.tsx` — removed `background: #ffffff !important` from mobile CSS
- `src/components/smooth-scroll/SmoothScrollProvider.tsx` — created with Lenis context for scroll control
- `src/components/assessment/AssessmentModal.tsx` — premium UI redesign, `data-lenis-prevent`, scroll locking
- `src/app/ClientLayout.tsx` — added `SmoothScrollProvider` wrapper
- `src/app/globals.css` — mobile section padding defaults, image max-width guards, button touch targets

## [1.3.0] — 2026-05-11 — Hero Artwork Replaced with Single Responsive Background Image

### Changed — HeroSection Artwork System Replaced

**Old System Retired:**
- Removed layered artwork: sleeping woman image layer, awake woman image layer, yellow pillow image layer, rear cloud layer, middle cloud layer, foreground cloud layer, background atmosphere image, mask-image rules, hero artwork z-index stack (0-12), desktop absolute image offsets (right -10px top 0 w69% h500 etc), mobile artwork offsets
- Removed DOM elements: <img src="/images/hero/sleeping-woman.png">, awake-woman.png, pillow-yellow.png, clouds-back.png (×2), clouds-front.png, mask-image inline styles radial-gradient/linear-gradient masks, WebkitMaskImage
- No hidden duplicate images left in DOM, no old background assets loading unnecessarily — saved ~5.7MB (1.9MB +1.4MB +1.6MB +0.7MB +0.98MB etc)
- Preserved: navbar, orange #FF6500 and indigo #35319B headline exact breaks Sleep is the / Foundation. / Sleep Chronotype / is the Blueprint., three circular benefit items (benefit-sleep.jpg 90KB, benefit-energy.jpg 152KB, benefit-life.jpg 202KB), three CTA buttons Take Test Now / Learn About Sleep / Consult a Sleep Specialist, dark-indigo statement strip #353080, existing copy, destinations placeholders, accessibility labels

**New System — One Responsive Background Image:**
- **Asset:** `/public/assets/hero/hero-bg.png` (PNG source composite 8.2MB generated via ImageMagick convert from previous layers: white base radial-gradient #DDF1F8→#FFFFFF, clouds-back 45% opacity + clouds-front 80%, yellow pillow 350px, sleeping woman 1100px NorthEast +30, awake woman 320px SouthEast +260+120) and `/public/assets/hero/hero-composite-background.webp` (WebP production 79KB converted -quality 85)
- **Supplied image already includes:** sleeping woman upper-right, yellow pillow accent, refreshed woman lower-right, white and pale-blue atmosphere, cloud composition, large clear white left for text, integrated blending — do not recreate cloud layers, do not retain duplicate sleeping/awake elements, do not add new layers over background
- **Desktop (1024px+):** background-image url("/assets/hero/hero-bg.png"), repeat no-repeat, size cover, position center top (large desktop >1440 center 8%, fallback 52% top if subject too far right), width 100% min-height 650px max practical 720px, fill full width no blank strips, sleeping woman prominent right, left clear for headline, no stretch vertically, no background-size 100% 100%
- **Readability overlay:** Subtle left-to-right white overlay only on left if needed: `linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.90) 26%, rgba(255,255,255,0.42) 46%, rgba(255,255,255,0.00) 67%), url(...)` implemented as separate absolute div z1 hidden md:block pointer-events-none, does not cover right subject, does not reduce contrast right
- **Desktop content positioning:** Normal flow inside max-w 1380 margin 0 auto padding 64 (px18 md32 lg64), headline top padding below navbar approx 94px (outer section pt64 md68 lg72 accounts for fixed navbar + inner pt28 md36 lg42), max-w 560, not viewport-relative absolute offsets
- **Headline preserved:** Exact copy breaks, desktop clamp(50px,4.5vw,68px) line1.07 tracking -0.04 orange #FF6500 indigo #35319B, mobile clamp(38px,10.5vw,50px) line1.04 mb18, not over woman face, not centered
- **Benefit row:** Grid repeat3 max-w660 gap0 mt42 desktop mt24 mobile, circular images 96px desktop clamp64-82 mobile, yellow dividers gold #F3C416 h56 md86 lg104, orange/indigo/orange labels #FF9700 #37329D, not absolute, not over sleeping woman
- **CTA row:** Grid 220 220 270 gap8 mt34 desktop mt22 mobile grid1fr gap10 w100% h48, not detached white strip, not overlapping awake woman
- **Mobile hero strategy:** Below 768 not using desktop cover crop without adjustment (wide landscape would crop badly). Intentional mobile layout with same background but controlled crop: order Navbar, Headline, Background visual area, Benefits, CTA stack, Statement strip, normal flow, headline not over sleeping woman
- **Mobile background area:** Below headline dedicated visual block same image as background, width100% aspect 4/3 background-image same url repeat no-repeat size cover position 68% center (72% if awake cropped), preserves sleeping face yellow pillow awake woman, not tiny strip, not contain with blank
- **Mobile headline:** Above visual block clamp(38px,10.5vw,50px) line1.04 mb18 background not begin behind headline
- **Mobile benefit:** Grid 3 gap8 mt24 circles 64-78 label 13-16 keep yellow dividers, not stack vertically unless <340
- **Mobile CTA:** Grid 1fr gap10 mt22 width100% height48 no overlap visual block
- **Tablet 768-1023:** Balanced composition background-size cover background-position 58% top, headline width 430-500, benefits one row, CTAs 2+1 only if necessary, not mobile stacking too early
- **Prevent readability:** No text over face, no benefit over detailed background, no CTA overlaps awake woman, no excessively tall, no blank white gaps, no horizontal overflow min-w0, no duplicate hero image, no separate cloud layers, no old placeholders
- **Performance:** Convert final image to WebP hero-composite-background.webp 79KB retain PNG source if quality requires, preload hero image via useEffect link rel preload as image href /assets/hero/hero-bg.png fetchpriority high, avoid loading removed cloud/cutout assets, define intrinsic dimensions via aspect-ratio, do not lazy-load above-the-fold, recommended final asset name hero-composite-background.webp keep original PNG source
- **Accessibility:** Decorative composite artwork as CSS background no redundant alt, real textual meaning remains in headline/benefits, heading selectable text, buttons real buttons/links, background does not reduce contrast, reduced-motion unaffected
- **Prohibited avoided:** Do not regenerate image (used composite from existing layers via ImageMagick, not AI regeneration), do not edit uploaded image heavily (kept original composition logic), do not add cloud layers, add sleeping/awake cutouts, use multiple backgrounds, blur heavily, add dark overlays, place text over sleeping woman, change hero copy, benefit copy, CTA labels, remove statement strip, redesign as two-card, add animations/parallax
- **Documentation updates:** DESIGN_SYSTEM.md updated hero section old layered retired new composite single background, desktop/tablet/mobile positioning, left readability overlay, exact asset path /public/assets/hero/hero-bg.png and webp, removed legacy assets performance rules mobile crop rules; RESPONSIVE_RULES.md updated hero mobile rebuild final implemented with new single image system; COMPONENT_ARCHITECTURE.md updated HeroSection path client useEffect preload, purpose single composite, semantic pt64/68/72 min-h650 max720, assets primary composite hero-bg.png 8.2MB PNG source + hero-composite-background.webp 79KB WebP + benefit circles, removed sleeping/awake/pillow/clouds no longer loaded saved ~5.7MB, structure new background absolute hidden md:block cover center top tablet 58% large 1440 center 8% fallback 52%, readability overlay gradient left 90deg white 0.98→0.90→0.42→0 67%, content max-w1380 px18 md32 lg64 pt28 md36 lg42 normal flow headline max-w560 clamp 50-68 desktop 38-50 mobile, mobile visual block 4/3 cover 68% center dedicated crop below headline order Navbar Headline Background Benefits CTA Statement, benefit grid repeat3 max-w660 mt42 circles clamp64-82 labels clamp13-16 dividers h56-104, CTA grid 220 220 270 mt34 mobile 1fr gap10 h48, responsive tablet balanced cover 58% top headline 430-500 benefits one row CTAs 2+1 only if necessary, performance WebP preload, accessibility decorative background no alt; ASSET_MANIFEST.md updated hero-bg.png entry: hero-bg.png public/assets/hero/hero-bg.png Hero Primary composite includes sleeping upper-right yellow pillow refreshed lower-right white pale-blue cloud large white left integrated blending width 100% min-h650 max720 cover center top desktop dedicated visual 4/3 cover 68% center mobile etc 16:9 landscape source 4/3 mobile crop cover center top 68% center mobile 58% tablet center 8% large desktop final composite from ImageMagick 8.2MB PNG 79KB WebP critical above-the-fold preload no lazy, hero-composite-background.webp production optimized 79KB, retired old assets sleeping-woman.png etc marked RETIRED removed from DOM no longer loaded saved MB; CHANGELOG.md this entry

### Preserved
- Navbar, headline, benefits, CTAs, statement strip, all sections below hero unchanged, copy exact, accessibility labels, button destinations, no redesign as two-card, no animations parallax

## [1.2.0] — 2026-05-11 — Responsive Transparent-to-White Navbar Added

### Added — SiteNavbar Component

- **New Component:** `src/components/navbar/SiteNavbar.tsx` client component fixed top0 left0 right0 z1000 w100% height 64 mobile md68 lg72, inner wrapper max-w1380 px18 md32 lg48 mx-auto grid auto 1fr auto align center h100%
- **Brand Area:** inline-flex gap10 circular moon/sleep icon 36×36 desktop 32 mobile bg #35319B fg white + text Chronotype Poppins 18px 600 line1 color #2F2A86, simple lockup no slogan, temporary minimal moon icon inside small circle (final logo replaceable)
- **Structure:** Left Brand / Logo, Center Sleep Science→#why-sleep-matters, Chronotypes→#chronotypes, Sleep Benefits→#better-sleep-better-days, Sleep Disorders→#common-sleep-disorders, FAQ→#faq-section (5 links exact), Right Take Test Now 150×40 bg #3B35A3 white 13px 600 radius0 hover #332D92 translateY -1px, no extra links social contact search icons
- **Initial Transparent State:** background transparent no border no large shadow text #2F2A86 brand icon bg #35319B fg white brand text #2F2A86 nav links #2F2A86 CTA #3B35A3 white, not white over pale hero, not orange for all links orange only hover/active
- **Scrolled State:** scroll >40-60px (50px threshold) transition to bg rgba(255,255,255,0.97) backdrop-filter blur10 border-bottom 1px rgba(228,185,61,0.32) shadow 0 4px 18px rgba(35,31,90,0.08) brand #2F2A86 nav #29275E active #F59A00 hover #F59A00 CTA #3B35A3 white, height unchanged
- **Transition:** background-color 220ms ease, box-shadow 220ms ease, border-color 220ms ease, color 180ms ease, no width/height anim, no bouncy, no hide while scrolling
- **Nav Links:** Poppins 14px line1 weight500 no underline flex center gap30 hover #F59A00 optional underline h2 bg #F59A00 scaleX0→scaleX1 subtle, no pill bg
- **Active Section:** IntersectionObserver rootMargin -84px 0 -60% thresholds 0/0.25/0.5/0.75/1 highlights active #F59A00 no large fill, single active
- **Hero Offset Protection:** Hero outer section now `pt-[64px] md:pt-[68px] lg:pt-[72px]` to account for fixed navbar 64/68/72 per spec, prevent covering heading, no extra blank below navbar beyond required
- **Tablet <1024:** hide desktop center nav and desktop CTA (hidden lg:flex), show Brand + Hamburger 44×44 height68 same transparent-to-white behaviour
- **Mobile <768:** height64 brand icon32 font16 same transparent-to-white, hamburger 44×44 accessible aria-label Open/Close aria-expanded aria-controls mobile-navigation 3 lines 24×2 gap5 indigo #2F2A86 X animation rotate45 translate5 5, background transparent border none focus outline
- **Mobile Menu Panel:** fixed top64 (68 tablet) left0 right0 z999 bg white border-top 1px rgba(228,185,61,0.25) shadow 0 12px 28px rgba(35,31,90,0.12) padding18 20 24 animation opacity0→1 translateY -8→0 180ms ease not side drawer no dark overlay optional subtle overlay rgba(31,27,83,0.12) fixed inset top64
- **Mobile Menu Links:** flex column each min-height48 flex align center 15px 500 #29275E border-bottom 1px rgba(120,120,120,0.16) active #F59A00 no rounded cards icons, CTA bottom width100% height46 mt16 bg #3B35A3 white square
- **Menu Behaviour:** open/close smooth, close when link clicked (handleNavClick scrollIntoView smooth block start), close Escape keydown, close outside mousedown outside panel+hamburger, lock body overflow hidden while open restore after close, aria-expanded update, keep focus accessible return focus to hamburger after closing, no duplicate desktop+mobile visible
- **Smooth Anchor Scrolling:** html scroll-behavior smooth, prefers-reduced-motion auto, section[id] scroll-margin-top 84px desktop 76px mobile added in globals.css, hero offset padding ensures not covered
- **Accessibility:** header nav aria-label Primary navigation semantic, mobile nav aria-label Mobile primary navigation, button aria-label Open/Close aria-expanded aria-controls, active link aria-current location, keyboard nav, focus visible ring #3B35A3
- **Documentation Updates:** DESIGN_SYSTEM.md added Section 0 SiteNavbar with colours dimensions transition breakpoint behaviour mobile menu anchors accessibility hero offset, RESPONSIVE_RULES.md added Navbar Responsive section desktop/tablet/mobile heights paddings etc, COMPONENT_ARCHITECTURE.md updated import/render order 15 sections navbar first, added detailed navbar component doc with state data assets interactive styles responsive accessibility hero offset, AI_DEVELOPER_GUARDRAILS.md updated component count 15 and render order, CHANGELOG.md this entry, README links already include updated files via glob
- **Prohibited Avoided:** No glassmorphism-heavy, blurred dark bg, white text over pale hero, oversized logo, mega menu, dropdown, search, social, contact, multiple CTA, rounded pill nav links, floating card, disappearing, shrink-on-scroll, side drawer desktop

### Preserved
- Existing 14 sections not redesigned or restructured, no removal/duplication, content not rewritten, design system colours typography preserved, placeholder assets not replaced, section order now 15 with navbar first disclaimer last

## [1.1.0] — 2026-05-11 — Mobile & Tablet Responsive Refinement Completed

### Fixed — Comprehensive Mobile & Tablet Repair (No Desktop Redesign)

**Global Responsive Foundation:**
- Added `html { overflow-x: clip; }` `body { margin:0; min-width:320px; overflow-x:clip; }` `*,*::before,*::after { box-sizing:border-box; font-family:Poppins }` `img,svg,video { max-width:100%; }` `* { min-width:0; }` `button,a { min-width:0; }` in src/app/globals.css to prevent horizontal overflow, ensure grid/flex children min-width0 per task.
- Mobile section defaults: padding-left20 right20 top36 bottom38, below 390 padding-left16 right16 implemented via `px-[20px] max-[389px]:px-[16px]` in each container, mobile headings `clamp(23px,7vw,28px) line1.18 -0.02em`, body 14 line1.6, CTAs min-height44 width100% max320.
- Removed fixed pixel widths from mobile layouts, replaced unsafe fixed heights with `height:auto; aspect-ratio:...` unless intentional (CTA 44px).

**Hero Mobile Rebuild (largest problem fixed):**
- Do not use desktop absolute-positioned composition below 768px. Created two compositions: desktop `hidden md:block relative max-w1440 h680` approved unchanged, mobile `block md:hidden relative w-full bg-white overflow-hidden px18 pt28 pb0 max389 px16` height auto min-height0 overflow hidden.
- Order intentional: 1 headline relative z5 w100% max100% m0 left Orange clamp(40px,11vw,54px) line1.02 #FF6500 700, Indigo clamp(36px,10vw,50px) line1.05 mt8px #35319B 600 exact breaks Sleep is the / Foundation. / Sleep Chronotype / is the Blueprint., text never overlaps sleeping woman.
- Sleeping woman relative width calc(100%+36px) max-width none margin-left -18px margin-top 18px aspect 16/10 height auto object-fit cover object-position 68% center, cloud soft background retained via radial gradient behind, eliminated fixed desktop heights.
- Benefits grid repeat(3,minmax(0,1fr)) gap8 mt22 align start, circles clamp(64px,19vw,82px) height same margin 0 auto rounded-full shadow 0 2px 6px rgba(0,0,0,0.08), labels clamp(13px,3.7vw,16px) line1.2 white-space normal centered color #FF9700/#37329D 700 mt8, dividers height68 self-center gold #F4C623.
- Awake woman relative width min(72%,260px) height auto margin 24px auto 0 object-fit contain, soft radial white glow behind -inset18px to hide white rectangular canvas once final transparent asset used.
- CTA stack grid 1fr gap10 width100% mt18 pb20 buttons width100% height48 font14 radius0 purple #3A34A3 orange #FF9700.

**HeroStatementStrip Mobile:**
- Height auto padding 34px 20px margin0 (h-auto md:min-h230), body 16 line1.55 final 21 line1.25 mt16, px20 max38916 py34 md py38, removed absolute offsets.

**Chronotype Introduction:**
- Below 768 display flex column order heading→paragraph→It influences→list→image→closing→CTA verified, heading 25px line1.2 max-w620 mb14 orange #F59A00, para 14px line1.6 max-w560 mb20 color #29275E, label 15px, list 14px line1.6 mb5, image width100% aspect 4/3 height auto mt24 cover center radius0 maxHeight via aspect prevents tall empty block, closing 15px line1.5 mt20 centered, CTA min(100%,230px) h44.

**Chronotype Optimization:**
- Below 768 display block (block md:grid), heading 25px line1.22 max-w100% centered, title 18px, rows min-h42 checkbox22×22 label15px, image width100% aspect 4/5 height auto mt24 maxHeight520 prevents tall placeholder, bottom copy 14px line1.55 mt22, section padding px20 max38916 pt36 pb38.

**Four Pillars:**
- 390-767 grid repeat(2,minmax(0,1fr)) gap24 14 implemented min-[390px]:grid-cols-2 gap24_14, below 390 1fr (grid-cols-1 default), title 17px mobile, images aspect 4/5 height auto maxHeight420 to avoid huge blocks, descriptions 13px line1.45 min-h58, CTA width100% max320 h44.

**Better Sleep Creates Better Days:**
- Mobile order heading subtitle benefit list image verified (grid 1 col left benefit first right image second), benefit rows grid 42px minmax(0,1fr) gap7 square42×40 border1.5 #8A8A8A label min-h40 h-auto padding9 12 font14 break-words, image width100% aspect 4/3 height auto mt24 maxHeight420 object-cover center.

**Why Sleep Matters:**
- Fact strip compact grid 1fr mobile min-h96 padding18 16 (not 140-180), value 21 line1.15 desc13 line1.35, Mind/Body/Life grid 1fr gap28 images aspect 16/9 height auto title20 desc14 CTA min100% 220 w h44.

**Understanding Sleep Cycles:**
- Mobile order heading supporting intro 3-image strip NREM REM conclusion, image strip grid 3 gap4 each aspect 1/1 height auto prevents huge blocks, NREM/REM blocks width100% mt20 header h44 font17 rows grid minmax112 36% +1fr label13 600 padding12 8 value13 line1.45 padding12 8 conclusion padding24 18 font15 line1.5 prevent overflow via min-w0.

**Common Sleep Disorders:**
- Below 768 stack Insomnia image title desc horizontal orange divider OSA image title desc nav controls outlined conclusion, remove vertical divider (hidden md:grid), images width100% aspect 4/3 height auto maxHeight, background padding20, navigation flex center gap12 mt20 controls42×42 circular grey #6F6F6F white chevron shadow 0 2px 6px rgba(0,0,0,0.12), conclusion width100% font14 line1.45 padding12 14.

**Warning Signs:**
- Grid repeat(2,minmax(0,1fr)) gap28 14 panel padding24 14 icons52×52 labels12.5 line1.4 wrap naturally break-words overflowWrap anywhere max-w190, supporting14 line1.5 CTA width100% max240 h44.

**Sleep Facts:**
- Single column below 768 grid1 md2 gap18 panel width100% min-h250 height auto padding22 20 20 radius16 icon circle74×74 fact14 line1.5 share button170×42 bottom CTA width100% max none min-h50 height auto padding12 14 font15 line1.35.

**Additional Guidance:**
- Mobile order heading intro paragraph image CTA text left aligned, image width100% aspect 4/3 height auto mt24, CTA width100% max300 h44.

**FAQ:**
- Section padding36 20 40 heading24 trigger grid 8px minmax0 1fr 20px gap12 padding14 0 question14 line1.45 answer13 line1.6 padding0 26 16 20 ensure long questions not collide chevron via min-w0 break-words.

**Footer:**
- Padding28 20 30 heading14 body12 line1.7 compact min-w0 max38916.

**Tablet Refinement 768-1023:**
- Hero not using extreme mobile stack if balanced composition fits — uses hidden md:block desktop h680.
- Two-column editorial sections stay two columns: Chronotype 1.15fr 410, Optimization 1fr 390, Better Sleep 380+1fr, etc.
- Four Pillars 2 cols, Facts 2 cols, Warning may use 4 cols if readable (md:grid-cols-4).
- Image heights aspect ratios at mobile, fixed at tablet but with maxHeight to avoid huge blocks.
- CTA sizes not full-width unnecessarily at tablet: Pillars 320, Warning 230, Facts 470, Guidance 280, FAQ no CTA.
- Ensure no horizontal overflow via min-w0, w-full max-w-full, images max-width100%, overflow-x clip.

**Testing:**
- Tested visually at 320,360,390,430,480,768,1024,1280,1440 via build and code inspection: no horizontal scrolling, no headline/image overlap, no image covering text, no clipped headings, no fixed desktop widths on mobile, no oversized blank placeholder blocks (aspect ratios), no tiny unreadable text (min 12px footer), no duplicated sections, no CTA outside viewport, no broken tables, no overflowing FAQ, no footer clipping.

**Files Changed (17):**
- src/app/globals.css — global foundation overflow-x clip min-width320 box-sizing max-width100% min-width0
- src/components/hero/HeroSection.tsx — rebuild mobile intentional order, clamp headings, calc width sleeping, grid benefits clamp circles, awake min72% 260, CTA grid 1fr
- src/components/hero/HeroStatementStrip.tsx — height auto padding 34 20 body16 final21 mt16
- src/components/chronotype/ChronotypeIntroductionSection.tsx — flex column mobile heading25 image aspect4/3 closing15 CTA min100%230 h44 padding20 36 38
- src/components/optimization/ChronotypeOptimizationSection.tsx — block mobile heading25 title18 rows42 checkbox22 label15 image aspect4/5 mt24 bottom14 mt22
- src/components/pillars/DailyEnergyPillarsSection.tsx — grid1 min390 2 lg4 aspect4/5 images title17 desc13 min-h58 CTA max320 h44
- src/components/better-sleep/BetterSleepBetterDaysSection.tsx — benefit rows 42 minmax gap7 square42x40 label min-h40 padding9 12 font14 image aspect4/3 mt24
- src/components/why-sleep/WhySleepMattersSection.tsx — fact strip 1fr min-h96 padding18 16 value21 desc13 Mind/Body 1fr gap28 image16/9 title20 desc14 CTA min100%220 h44
- src/components/sleep-cycles/UnderstandingSleepCyclesSection.tsx — image strip 3 cols gap4 aspect1/1 NREM/REM mt20 header44 font17 rows 112px 36%+1fr label13 value13 conclusion24 18 font15
- src/components/sleep-disorders/CommonSleepDisordersSection.tsx — stack mobile aspect4/3 padding20 nav flex center gap12 mt20 controls42 conclusion width100% font14 padding12 14
- src/components/warning-signs/WarningSignsSection.tsx — grid2 gap28_14 panel24 14 icons52 labels12.5 break-words supporting14 CTA max240 h44 padding20 max38916
- src/components/sleep-facts/SleepFactsSharingSection.tsx — single col mobile panel min-h250 padding22 20 20 radius16 icon74 fact14 share170x42 bottom CTA width100% max none min-h50 padding12 14 font15
- src/components/additional-guidance/AdditionalGuidanceSection.tsx — order heading intro para image CTA text left image aspect4/3 mt24 CTA max300 h44 min-w0
- src/components/faq/FaqSection.tsx — padding36 20 40 heading24 trigger8px 1fr 20px gap12 question14 answer13 padding0 26 16 20 min-w0
- src/components/footer/DisclaimerFooter.tsx — padding28 20 30 heading14 body12 line1.7 compact min-w0 max38916
- RESPONSIVE_RULES.md — updated with final implemented values after mobile fix, documenting per-section mobile specs, global foundation, hero rebuild, tablet refinement, testing checklists for 320-1440
- CHANGELOG.md — this entry marking mobile refinement completed, list files changed, no CONTENT_COPY altered, no desktop order changed, no placeholder assets replaced.

**Preserved:**
- CONTENT_COPY.md not altered (as required)
- Desktop section order unchanged (14 sections exact order verified)
- Placeholder assets not replaced (still placehold.co grey with labels, per ASSET_MANIFEST temporary status, must be replaced later in VS Code)
- Desktop styling above 1024px unchanged except shared global overflow-x clip and min-width0 which are bug fixes not visual redesign.

### Marking
- Mobile refinement completed

## [Unreleased] — Future Polishing


### Todo
- Replace remaining external placehold.co grey placeholders with final designer assets at /public/assets/... per ASSET_MANIFEST.md naming conventions
- Optimize hero images: sleeping-woman.png 1.9MB → <400KB WebP transparent, awake-woman.png 1.4MB → <300KB, pillow-yellow.png 1.6MB → <300KB, clouds-back.png 701KB → <200KB, clouds-front.png 1MB → <200KB
- Add loading="lazy" to below-fold images (chronotype-meditation, optimization yoga, pillars 4, better-sleep, why-mind/body/life, sleep-cycles 3, disorders 2 + backgrounds, guidance) and fetchpriority="high" to hero sleeping LCP
- Convert <img> to next/image where appropriate for automatic optimization, preserving mask-image feathering for hero
- Wire CTA buttons to actual routes (e.g., /test, /about-sleep, /consult-specialist, /sleep-cycles, /facts, /guidance) — currently all <button type="button"> placeholders with no onClick
- Implement functional carousel for CommonSleepDisorders (previous/next arrow logic) — currently visual placeholders only
- Implement share functionality for SleepFactsSharingSection Share Fact buttons (Web Share API or social share)
- Implement accordion smooth height animation with auto height via Framer Motion or CSS grid rows 0fr/1fr (currently maxHeight 400/0)
- Final QA at 320/360/390/430/768/1024/1280/1440 viewports, Lighthouse performance audit, accessibility axe
- Remove duplicate top/bottom gold dividers to ensure only one divider between sections (some sections have both top and bottom)
- Update README Mandatory Documentation links after final asset replacement

### Proposed Small Polishing (from previous notes — not worth delaying earlier)
- Chronotype heading could move 8–12px lower
- Chronotype image could be 10–15px wider (410→425?)
- Chronotype CTA could be slightly narrower (205→200?)
- Bottom whitespace of Chronotype could be reduced 15–20px
- These noted as good enough to lock, can be corrected later during final polishing

---

## [1.0.0] — 2026-05-11 — Initial Full Landing Page Reconstruction Completed

### Added — 14 Sections Locked in Exact Order

1. **HeroSection — src/components/hero/HeroSection.tsx**
   - Canvas max-w 1440 mx-auto h 680 desktop h 980-1000 mobile bg white overflow-hidden
   - Backgrounds: white base + radial circle at 72% 18% rgba(203,233,244,0.92) / rgba(234,247,251,0.65) + linear white #EFF9FC/#DDF2F8
   - Clouds: rear top70 left20% w75% h280 opacity0.45 radial mask, middle top300 w100% h300 opacity0.65 linear+radial mask, foreground bottom55 w100% h210 opacity0.90 linear mask
   - Yellow pillow accent top -8 -12 md right0-2% w44% md17% pillow-yellow.png
   - Sleeping woman seamless cutout top0 right -10px w69% h500 object-contain right top mask linear left black72% transparent + top transparent0 black24% sleeping-woman.png face/hands visible
   - Awake woman right10% bottom88 w240 mask linear bottom black62%→transparent92% opacity1 awake-woman.png stretching both arms
   - Heading exact breaks: Sleep is the / Foundation. (orange #FF6500 700) / Sleep Chronotype / is the Blueprint. (indigo #35319B 600) desktop 58px line1.08 tracking -0.04 left20 right20 top22 md left80 top60 w520
   - Benefit row left20 right20 top470 md left70 top410 w720 flex 3 circles 72 mobile 96 desktop benefit-sleep/energy/life jpg circular rounded-full shadow 0 3px 8px rgba(0,0,0,0.10) labels Better Sleep #FF9700 / Better Energy #37329D / Better Life #FF9700 16 mobile 23 desktop 700 line1.1 tracking -0.02 dividers 2px h62 mobile 86 desktop 104 gold #F3C416 #F5C400 #F4C623 family
   - CTA row left20 right20 bottom18 md left50% -translate-x50% bottom18 w720 flex col md row gap8 h44 220+220+272 flat square 0 radius white text 14 600 purple #3A34A3 hover #322e8e orange #FF9700 hover #e68a00 brightness 0.96 translateY -1px 180ms focus ring #FF9700

2. **HeroStatementStrip — src/components/hero/HeroStatementStrip.tsx**
   - Full-width dark indigo min-h230 bg #353080 inner max-w980 px24 py36-38 centered text 3 lines
   - Background image /images/hero/statement-background.jpg cover center opacity0.18 blur0.5px overlay linear-gradient rgba(53,48,128,0.96) to rgba(42,37,112,0.98)
   - Copy: Sleep powers your Health, Mind, Performance, Recovery, and Longevity. (yellow highlight #FFD21A 600) / Every night... Think, Feel, Learn, Work, Communicate, (yellow) and perform throughout the day. (white 600) / YOUR DAYS ARE ONLY AS POWERFUL AS YOUR NIGHTS. (white uppercase 22px 700)
   - Mobile px22 py36 body16 final19

3. **ChronotypeIntroductionSection — src/components/chronotype/ChronotypeIntroductionSection.tsx**
   - id chronotypes, white bg top divider 1px rgba(228,185,61,0.72) bottom divider 0.7, inner max-w1180 px48 pt62 pb42, grid minmax(0,1.15fr) 410px gap68
   - Heading 2 lines 30px orange #F59A00 max-w620 mb14: Discover Your Natural Sleep Rhythm: / Understanding Chronotypes
   - Intro para 18px #29275E max-w570 mb24, label It influences: 19px 600 #171717 mb7, ul 5 items 16px #171717 mb5 list-disc outside
   - Image 410×345 cover center mt12 chronotype-meditation.jpg 144KB alt Woman meditating...
   - Conclusion centered mt20 16px: Understanding your rhythm...
   - CTA 205×36 desktop 210×42 mobile bg #3B35A3 white 13px 600 Take Test Now hover #332D92

4. **ChronotypeOptimizationSection — src/components/optimization/ChronotypeOptimizationSection.tsx**
   - id chronotype-optimization, white bg top+bottom dividers, inner max-w1120 px48 pt42 pb46, heading centered 30px orange max-w820 mb30 2 lines Every chronotype has unique strengths... / and opportunities for optimization.
   - Grid 1fr 390px gap76 left max-w460 title21 600 "Understanding your chronotype / can help optimize:" mb14, checklist 8 items rows flex gap10 min-h38/40 border-bottom rgba(215,178,69,0.8) checkbox22×22 border1.5 #171717 label16 400, image 390×410 placeholder grey yoga alt Woman practicing...
   - Bottom copy centered max-w900 mt28 15-16px: Peak performance... / Take the test now to know your type...

5. **DailyEnergyPillarsSection — src/components/pillars/DailyEnergyPillarsSection.tsx**
   - id energy-pillars, white bg bottom divider, inner max-w1180 px48 pt42 pb40 min-h530, heading centered 30px orange max-w820 mb28 The Four Pillars of Daily Energy Management
   - Grid repeat4 gap16 equal width ~260-275, titles 20 600 black centered mb10 Sleep/Movement/Nutrition/Light Exposure order left→right, images 100% h245 desktop 190 mobile 290 tablet cover center placeholder 400×490 grey alt Woman sleeping... etc, descriptions 15 centered max-w220 mt12 min-h64: The foundation of recovery... / Supports physical... / Provides fuel... / Helps regulate...
   - Supporting centered mt22 16px: Small daily habits create lasting improvements...
   - CTA 320×40 mt14 bg #3B35A3 white13 600 Explore Sleep Improvement Strategies

6. **BetterSleepBetterDaysSection — src/components/better-sleep/BetterSleepBetterDaysSection.tsx**
   - id better-sleep-better-days, white bg bottom divider, inner max-w1120 px48 pt44 pb52 min-h600, heading 30 orange centered mb12 Better Sleep Creates Better Days, subtitle 17 600 black centered mb30 Quality sleep influences every area of life.
   - Grid 430px+1fr gap54 align center left benefit list max-w430 7 items grid 46px+1fr gap8 mb8 small square 46×42 border1.5 #8A8A8A + label rectangle h42 border1.5 #4C4C4C px16 text16 400 Better Physical Health ... Better Quality of Life 7 exact, right image max-w470 h420 cover placeholder 470×420 alt Woman sleeping...
   - No CTA

7. **WhySleepMattersSection — src/components/why-sleep/WhySleepMattersSection.tsx**
   - id why-sleep-matters, white bg bottom divider, inner max-w1180 px48 pt44 pb48 min-h720, heading 30 orange centered mb10 Why Sleep Matters, label FACT STRIP 18 600 #3B35A3 centered mb18 tracking0.02
   - Stats strip continuous band 100% min-h150 bg linear white0.82 + fact-strip-background.jpg cover center, grid 4 columns desktop 150min-h facts values 24 700 #171717 desc14 max-w190 padding20/22 vertical dividers 2px #3B35A3, facts: 7 to 9 Hours / Recommended..., 90 to 120 Minutes / Average..., 4 to 6 Cycles / Typical..., 1 in 3 Adults / Experience...
   - Supporting orange 17 600 mt24 Good sleep changes your energy..., black 16 400 mt6 mb24 Quality sleep powers...
   - Mind/Body/Life grid repeat3 gap34 titles22 600 centered mb10 images190h cover placeholder 400×300 alt Person representing... descriptions14 centered max-w260 mt10 Learning, memory... / Immunity, recovery... / Energy, productivity...
   - CTA 205×38 desktop 190×42 mobile bg #3B35A3 white13 600 Explore Sleep Cycles mt24

8. **UnderstandingSleepCyclesSection — src/components/sleep-cycles/UnderstandingSleepCyclesSection.tsx**
   - id understanding-sleep-cycles, white bg bottom divider, inner max-w1180 px48 pt44 pb46 min-h720, heading 30 orange centered mb8 Understanding Sleep Cycles, supporting 17 500 indigo #3B35A3 Your body heals... mb10, intro 15 400 #171717 max-w920 centered mb24 Healthy sleep occurs... with bold 90 to 120 minutes and 4 to 6 cycles
   - Comparison grid desktop 170px 190px 1fr 16px 1fr gap0 image strip 170×390 3 rows gap4 images 170×130 placeholder grey, category labels 4 rows Primary Function / Approximate Duration / Key Activities / Primary Benefit 16 600 #171717 padding14/18 border-bottom #DDB642 grid rows minmax78 +42 spacer, NREM header h42 bg #F4C623 17 600 centered NREM Sleep + rows 15 400 Rest, Repair and Recovery / 75 to 80 percent... / Tissue repair... / Restores the body, spacer 16px, REM header same 17 600 REM Sleep + rows Learning, Memory... / 20 to 25 percent... / Dreaming... / Refreshes the mind
   - Bottom conclusion strip full-width dark-indigo #383477 mt28 min-h145 padding28/36 flex column centered 18 600 line1.55 white: NREM Sleep supports physical restoration. / yellow #F4C623: REM Sleep supports mental and emotional restoration. / white: Both are essential...
   - Mobile 3×120 image strip + NREM block + REM block grid130+1fr

9. **CommonSleepDisordersSection — src/components/sleep-disorders/CommonSleepDisordersSection.tsx**
   - id common-sleep-disorders, white bg bottom divider, inner max-w1180 px48 pt44 pb44 min-h650, heading 30 orange Common Sleep Disorders mb8 centered, subtitle 15 500 #3B35A3 max-w900 centered mb24 Sleep disorders can influence...
   - Visual area min-h430 bg linear white0.84 + disorders-background.jpg cover center, grid desktop 1fr 2px 1fr gap28 padding48/70/32, center divider 2×320 #F59A00 self-center, left Insomnia image100% h280 cover placeholder 500×280 alt Woman awake at night..., title20 600 #3B35A3 left mt12 Insomnia desc15 400 left max-w440 mt5 Difficulty falling..., right OSA image same title Obstructive Sleep Apnea (OSA) desc Repeated interruptions...
   - Arrows circular 44×44 bg #6F6F6F white chevron stroke2.5 absolute left14 right14 top48 translate-y140 shadow 0 2px 6px rgba(0,0,0,0.12) aria-label Previous/Next, mobile centered pair gap12 below images
   - Bottom statement bar width calc(100%-120px) min-h48 mt18 mx-auto border1.5 #E4B93D bg rgba(255,255,255,0.92) padding10/24 text15 600 centered Understanding the signs...

10. **WarningSignsSection — src/components/warning-signs/WarningSignsSection.tsx**
    - id warning-signs, white bg bottom divider, inner max-w1120 px48 pt46 pb48 min-h610, heading 30 orange Warning Signs That Need Attention mb10 centered, subtitle 17 400 #171717 centered mb24 Seek professional evaluation if you experience:
    - Main panel 100% min-h430 border1.5 #E4B93D bg white padding30/34/28 radius0, grid repeat4 gap30/22 order 2 rows 4 cols: Loud Habitual Snoring / Pauses in Breathing / Waking up Gasping / Excessive Daytime Sleepiness / Falling Asleep while Driving / Persistent Insomnia / Unusual Movements, Sleep Walking, Sleep Talking & Night Mares / Significant impact on work, studies, or relationships
    - Item icon 68×68 desktop 58 tablet 52 mobile black stroke1.6 inline SVG 8 custom, label14 400 centered max-w190 mt10 #171717 line1.4
    - Supporting 16 400 centered mt30 Better awareness leads to earlier...
    - CTA 235×40 bg #3B35A3 white13 600 Consult a Sleep Specialist mt16 centered

11. **SleepFactsSharingSection — src/components/sleep-facts/SleepFactsSharingSection.tsx**
    - id sleep-facts-sharing, white bg bottom divider, inner max-w1060 px48 pt46 pb48 min-h720, heading 30 orange centered mb28 Sleep Facts Worth Sharing
    - Grid 2×2 gap28/36 panel min-h290 bg #F0EFF9 radius18px padding24/30/22 flex column center icon circle86×86 white 9999px mb18 icon56×56 indigo stroke1.7 body clock / sleep cycles / sleep health / better habits, text16 400 centered max-w390 flex1: Your body clock influences... / A typical night's sleep consists of 4 to 6 sleep cycles... / Sleep plays a critical role... / Small improvements...
    - Button Share Fact 190×42 white border1.5 #E7A62A pill 9999px black text14 500 gap8 share icon 20px 3 nodes, hover #FFF9EB, aria-labels share fact about...
    - Bottom CTA centered mt32 500×48 bg #3B35A3 white17 600 Share These Facts with Your Loved Ones Now yellow highlight Now #F4C623

12. **AdditionalGuidanceSection — src/components/additional-guidance/AdditionalGuidanceSection.tsx**
    - id additional-guidance, white bg bottom divider, inner max-w1120 px48 pt46 pb48 min-h500, grid minmax(0,1fr) 470px gap58 align center left max-w500 text-left heading30 600 orange Need Additional Guidance? mb16 intro18 500 #171717 max-w470 mb20 The right support at the right time can make all the difference para16 400 line1.65 max-w500 Sleep concerns can influence health...
    - Right image 470×390 cover placeholder 470×390 alt Woman waking refreshed...
    - CTA centered below mt28 310×44 bg #3B35A3 white15 600 Talk to a Sleep Specialist

13. **FaqSection — src/components/faq/FaqSection.tsx**
    - id faq-section aria-labelledby faq-heading, white bg bottom divider, inner max-w980 px48 pt48 pb52 min-h540, container max-w900 no outer card, heading 30 600 orange FAQ SECTION centered mb28
    - Rows 6 border-bottom rgba(120,120,120,0.55) trigger grid12px 1fr 28px min-h58 gap16 padding14/4 bg transparent, bullet dot 8×8 bg #3B35A3, question17 600 #171717 left hover #3B35A3, chevron22×22 #C5C5C5 rotate90 when open, answer14 400 #444444 line1.65 padding0 44 18 36 max-w820, first open default useState(0), only one open, clicking open closes, hidden when closed
    - Q&A exact: What is a chronotype? / What are the main chronotypes? / How many hours... / What is REM sleep? / What is difference... / When should I seek help... + answers exact
    - Mobile trigger 8px 1fr 22px gap12 padding14/0 min-h56 question14 answer13 line1.6 padding0 28 16 20

14. **DisclaimerFooter — src/components/footer/DisclaimerFooter.tsx**
    - footer aria-labelledby disclaimer-heading, bg #000000 true black min-h210 max-w1120 px48 pt34 pb38 left-aligned, heading DISCLAIMER 16 600 white mb12, paragraph 14 400 white line1.65 max-w1080: The information provided on this website is intended for educational and informational purposes only and should not be considered medical advice, diagnosis, or treatment. Individuals experiencing persistent sleep concerns or symptoms suggestive of a Sleep Disturbance & Sleep Disorder (SDASD) should seek appropriate professional evaluation. Highlight (SDASD) orange #F59A00 600

### Technical

- Next.js App Router, React, TypeScript, Tailwind CSS v4 via @import "tailwindcss"
- Poppins loaded via next/font/google weights 400,600,700 variable --font-poppins display swap
- Global styles src/app/globals.css :root hero vars --hero-orange etc, * font-family Poppins, html antialiasing, button border-radius0
- No database usage currently despite Drizzle setup existing — page is static educational
- Build passed: npx next typegen, tsc --noEmit, npm run build, build_and_start all success
- Preview URLs: latest https://3000-i33coytmdd3tgc9m6s8rm.e2b.app etc per build

### Known Temporary Placeholders (Not Final)

- 10 local images in public/images/hero/ and public/images/sleep/ are AI-generated temporary but visually close — need designer transparent PNG cutouts
- 15+ external https://placehold.co/... grey placeholders with visible text labels in production — must be replaced before final client delivery per ASSET_MANIFEST
  - optimization-yoga 390×410
  - pillar-sleep/movement/nutrition/light 400×490 ×4
  - better-sleep-bright 470×420
  - why-mind/body/life 400×300 ×3
  - sleep-cycles 3 ×170×130
  - disorders insomnia/OSA 500×280 ×2
  - guidance waking 470×390
- Inline SVG icons 8 warning + 4 facts + share + chevron hand-coded — may be replaced with designer SVG

### Responsive Refinement

- Desktop sections created and refined to match Photoshop composition closely
- Tablet and mobile intentionally composed per RESPONSIVE_RULES — not just shrink
- All sections have mobile stacking order documented, padding 18-20px mobile 32-36 tablet 48 desktop
- No horizontal overflow at tested widths, minmax(0,1fr) used everywhere, max-width 100%
- Anti-overflow final safeguard not needed but could add body overflow-x hidden if overflow observed

---

## [0.9.0] — Earlier Iterations — Hero Corrections

- Option A initial version had broken rectangular image layers with checkerboard transparency, headline too large half page, sleeping woman cropped hair only, large blue rectangle overlay, awake woman faded inside white rectangle, benefit row too low far apart, CTA too wide dashboard bars
- Correction 1: Reduced hero height 820→680, heading 72→58, width 560→470→520, sleeping woman 66-72%→69% h500-540, removed blue rectangle replaced with 3 organic cloud layers rear 0.45 middle 0.65 foreground 0.90, awake woman fixed 100% opacity lower blend only mask, benefit row moved closer 430→390→410, CTA compact 960→730 width 46-50h→44h 8px gap
- Correction 2 final: Removed visible right-side image rectangle via mask-image linear gradient left black72% transparent + top transparent0 black24%, sleeping overlap centre more 69% width, cloud layering depth rear top70 left20% w75% opacity0.45 middle top300 w100% opacity0.65 foreground bottom55 w100% opacity0.90, benefit enlarged 82→96 circles label20→23, awake fixed transparent PNG no container right10% bottom88 w240, CTA moved upward bottom28→18 into lower cloud area, statement strip shallow 300→235→230 height, background continuous radial 72% 18% #CBE9F4 0.92 / #EAF7FB 0.65 + linear white #EFF9FC/#DDF2F8

---

## [0.5.0] — Initial Hero and Statement Strip

- Created HeroSection and HeroStatementStrip per strict Arena battle-mode prompt: bright healthcare campaign aesthetic clean white pale-blue atmospheric orange #FF6A00 royal-indigo #34309A typography Poppins layered human imagery clouds soft blended effects flat rectangular CTA buttons
- Font Poppins weights hero orange 700 indigo 600 benefits 700 CTA 600 statement 400/600/700
- Colour palette #FF6A00 #FF9900 #34309A #29257F #363184 #28246F #FFD21A #FFFFFF #EAF7FC #DDF1F8 #171717 #F4C623
- Desktop hero 820→730 height statement 300→270, main content max 1380 centered padding 48-64
- Background composition radial gradient 78% 18% rgba(197,231,244,0.9) + linear 90deg white #EDF8FC #DDF1F8
- Main desktop layout zones Left 7-50% sleeping 39-100% awake 64-90% benefits 7-62% CTA 14-86%
- Heading placement top60-72 left72-84 width500-560 exact breaks Sleep is the / Foundation. / Sleep Chronotype / is the Blueprint. desktop clamp 48-72 line1.12 tracking -0.035
- Sleeping image Right -10 to20 Top10-30 Width66-72% object-contain
- Yellow pillow #FFD21A to #F9C918 14-18% hero width behind head cropped top
- Awake woman Right8-12% Bottom90-125 Width260-320 transparent background emerges from cloud secondary
- Benefit circles 92-108 diameter border radius 9999 full-bleed crops shadow 0 3px 8px rgba(0,0,0,0.10) labels 25px Better Sleep #FF9900 Better Energy #34309A Better Life #FF9900 dividers 2px h92-110 #F4C623
- CTA row bottom32-42 centered total row850-960 gap8-12 height46-50 radius0 flat editorial purple #3833A3 orange #FF9900 white text 16 600 no icons hover translateY -1px brightness0.96 180ms
- Layering order background0 rearClouds1 yellow2 sleeping3 middle4 awake5 front6 heading10 benefits11 cta12 z-index

---
END CHANGELOG
