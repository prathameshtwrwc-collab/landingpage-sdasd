# Project Identity & Design System — Sleep Wellness Health-Tech Landing Page

Document generated: 2026-05-11 from live implementation audit of `src/app/page.tsx` and all component files.

## Project Identity

**Visual Direction Statement:**
- **Healthcare awareness campaign and public health education, NOT SaaS dashboard.**
- Approachable, optimistic, reassuring, clinical but warm.
- **Brochure-inspired editorial layout:** white page, thin warm-gold section separators, flat rectangular CTAs, square corners, image-led communication.
- Strong orange (#F59A00 / #FF9700 / #FF6500) and indigo (#3B35A3 / #35319B / #383477 / #353080) brand identity.
- Mostly white backgrounds (`#FFFFFF`) with occasional dark-indigo emphasis strips (`#353080` / `#383477`).
- Deliberate use of thin warm-gold dividers `1px solid rgba(228,185,61,0.72)` between almost all sections except hero internal layers.
- Black footer disclaimer true black `#000000`.
- **NOT:** dark theme, futuristic tech, neon, glassmorphism, neumorphism, luxury blur, parallax, large shadows, abstract blobs, decorative stars, random gradients, floating cards.

## Design Keywords

- healthcare brochure
- public health campaign
- educational infographic
- sleep wellness, chronotype, recovery, energy
- editorial, high contrast, simple visual hierarchy
- image-led, clear CTA, flat UI
- square geometry, minimal decoration, intentional whitespace
- accessible, Poppins-only type

## Colour Tokens — Exact Implementation

### Primary Brand
- `--color-orange-primary: #F59A00` — Used: All section headings (Understanding Chronotypes, Optimization, Four Pillars, Better Sleep, Why Matters, Sleep Cycles, Disorders, Warning Signs, Facts, Guidance, FAQ). Must not: be used for body text or dark backgrounds.

- `--color-orange-bright: #FF9700` — Used: Benefit labels Better Sleep/Life, hero benefit circles, CTA orange buttons (#3A34A3 vs #FF9700 distinction). Must not: be used for heading orange where spec says #F59A00 exactly.

- `--color-orange-hero: #FF6500` — Used: Hero headline lines 1-2 “Sleep is the Foundation.” Weight 700. Must not: be used elsewhere. Foreground: white, background: pale blue/white — passes contrast but check 4.5:1 for small text.

- `--color-indigo-primary: #3B35A3` — Used: Primary flat CTAs (Take Test Now purple, Explore Sleep Cycles, Consult Specialist, Talk to Specialist), FACT STRIP label, disorder titles, FAQ bullet dot. Must not: be used for light backgrounds as main text (use #171717). Hover: #332D92 / #322e8e.

- `--color-indigo-heading: #35319B` — Used: Hero indigo lines “Sleep Chronotype is the Blueprint.” Weight 600. Must not: be used for orange areas.

- `--color-indigo-dark: #383477` — Used: Bottom conclusion strip in Understanding Sleep Cycles (145px min-height, white text + yellow highlight). Must not: be used as page background.

- `--color-indigo-strip: #353080` — Used: HeroStatementStrip background `#353080` with overlay `linear-gradient(rgba(53,48,128,0.96), rgba(42,37,112,0.98))` + image opacity 0.18 blur 0.5px. Must not: be used elsewhere except very close variants (e.g., pillared).

- `--color-yellow-highlight: #F4C623` / #FFD21A — Used: Yellow pillow accent, dividers between benefits (F5C400 / F4C623 / F3C416 family), NREM/REM header bars #F4C623, bottom CTA highlight "Now" #F4C623, statement strip highlights #FFD21A. Must not: be used for text on white at small sizes (contrast risk).

- `--color-gold-divider: #E4B93D` — Used: Section border-bottom `rgba(228,185,61,0.72)` (RGB 228,185,61). Also checklist bottom borders `rgba(215,178,69,0.8)` and outline panels border 1.5px #E4B93D. Must not: be thickened beyond 2px except hero benefit dividers 2px.

- `--color-text-primary: #171717` — Used: All body, checklist, benefit supporting copy, warning labels, fact text, CTA supporting. Must be on white `#FFFFFF` — passes 15.8:1 contrast.

- `--color-text-secondary: #444444` — Used: FAQ answers only. On white 9.7:1.

- `--color-white: #FFFFFF` — Main page background. Used for text on indigo/black strips.

- `--color-black: #000000` — DisclaimerFooter true black. White text #FFFFFF ensures 21:1.

- `--color-panel-lavender: #F0EFF9` — SleepFactsSharingSection fact panels background. Text #171717 inside passes. Must not: be used for CTAs.

- `--color-placeholder-grey: #F4F4F4` / #F5F5F5 — Disorder images background, placeholder.co backgrounds. Indicates temporary.

- `--color-border-grey-dark: #4C4C4C`, `--color-border-grey-light: #8A8A8A` — Better Sleep benefit rows: small square #8A8A8A 1.5px, label rectangle #4C4C4C 1.5px.

- `--color-chevron-grey: #C5C5C5` — FAQ chevron stroke.

Accessibility: All orange on white headings at 30px bold: #F59A00 on #FFFFFF contrast ~2.1:1 fails AA small text but allowed for large bold 30px (requires 3:1). Verified large text 27px+ bold. Indigo #3B35A3 on white 7.3:1 passes.

## Typography — Exact Hierarchy From Code

**Font Family:** Only `"Poppins", var(--font-poppins), sans-serif` — loaded via `next/font/google` Poppins weights 400,600,700 variable `--font-poppins` display swap. No other fonts. `* {font-family: "Poppins", var(--font-poppins), sans-serif; }` in globals.css.

**Weights:**
- 400 regular body
- 500 medium (intro sentences, subtitle support)
- 600 semibold headings, CTA, labels
- 700 bold hero orange, benefit labels

**Hierarchy:**

- Hero orange heading:
  - Desktop 58px (`md:text-[58px]`) class clamp `clamp(38px,10.5vw,48px)` mobile, 52px md, 56 lg, 58 xl
  - Weight 700 color #FF6500 line-height 1.08 letter-spacing -0.04em
  - Exact breaks: "Sleep is the" / "Foundation." / "Sleep Chronotype" / "is the Blueprint."

- Hero indigo heading:
  - Same size 58px weight 600 color #35319B line-height 1.08 tracking -0.04em

- Section heading (orange H2):
  - Desktop 30px (`lg:text-[30px]`) Tablet 27px (`md:text-[27px]`) Mobile 24px / 25px (`text-[24px]`)
  - Weight 600 line-height ~1.2 approx 1.2-1.22 letter-spacing -0.02em centered except left-aligned guidance (but still orange)
  - Exceptions: Hero uses 58px, statement strip uses 22px white, disclaimer 16px white
  - Examples: `Discover Your Natural Sleep Rhythm: / Understanding Chronotypes` forced 2 lines

- Section supporting heading:
  - 16-18px (e.g., Chronotype intro "Your chronotype..." 18px #29275E line-height 1.55)
  - Weight 400 or 500 depending
  - Colors: #29275E (intro paragraph), #171717 (checklist title adaptation), #3B35A3 indigo supporting

- Body:
  - Desktop 14-16px (FAQ answer 14px #444444 line 1.65, checklist 16px, warning 14px)
  - Tablet 14-15px
  - Mobile 12-15px line-height 1.5-1.65
  - Color #171717 except FAQ answers #444444

- CTA:
  - 13px-15px weight 600 line-height 1
  - Letter-spacing -0.01em sometimes
  - Tracking -0.015em hero statement

**Rules:**
- Never another font without approval.
- Never serif / decorative display.
- Avoid random all-caps except approved labels: FACT STRIP, FAQ SECTION, DISCLAIMER (uppercase).
- No gradient text.
- No excessive letter spacing beyond -0.04 to 0.02.

## Layout System — Actual Implementation

- Full-width sections: `relative w-full bg-white` with border-bottom `1px solid rgba(228,185,61,0.72)`
- Inner containers:
  - 980px: FaqSection, HeroStatementStrip (980)
  - 1060px: SleepFactsSharingSection (1060)
  - 1120px: Optimization (1120), Better Sleep (1120), Guidance (1120), Warning Signs (1120), DisclaimerFooter (1120)
  - 1180px: ChronotypeIntroduction (1180), Four Pillars (1180), Why Sleep Matters (1180), Sleep Cycles (1180), Common Disorders (1180)
  - 1440px: HeroSection max-w-[1440px] mx-auto h-[680px] desktop, h-[980px] mobile

- Desktop page padding:
  - lg:px-[48px] universally
  - Tablet md:px-[32px] or 36px depending section (Chronotype 36px, etc)
  - Mobile px-[18px] to px-[20px]

- Section vertical spacing:
  - Desktop pt ~42-48px (most have pt-[46px] /42px etc) pb 40-52px
  - Mobile pt 28-38px pb 30-40px
  - Specific maps documented per component (see component files)

- No random boxed page containers, no arbitrary max widths. No excessive empty vertical space.

## Shape Language

- Most image corners square: `borderRadius: 0` or `rounded-none`
- CTA buttons square or max 2px radius — `rounded-none` class everywhere except Share Fact
- Exceptions:
  - SleepFacts panels ~18px radius (`border-radius: 18px`) plus tablet 18px mobile 16px
  - Share Fact pill `9999px`
  - Benefit circles rounded-full 96px diameter (hero 82-96px, benefits 96px desktop 72px mobile) — circular crops `rounded-full overflow-hidden`
- Warning icons unboxed
- Cards generally prohibited — no `shadow-[0_...]` except hero benefit circles `shadow-[0_3px_8px_rgba(0,0,0,0.10)]`
- No glassmorphism, neumorphism, blurred translucent panels.
- No large shadows — at most `0 2px 6px rgba(0,0,0,0.12)` for disorder arrows

## Buttons — All Variants From Code

- Primary indigo:
  - bg #3B35A3 (hover #332D92 or #322e8e or #302B8F via hover class)
  - white text, square corners `rounded-none`, no shadow `shadow-none`, height 38-44px typical
  - variants: 205×38 FAQ CTA, 205×38 Why Sleep Matters CTA, 310×44 Guidance CTA, 235×40 Warning Signs CTA, 500×48 Sleep Facts bottom CTA (#3B35A3 bg), 310×44 Additional Guidance CTA, 205×36 Chronotype intro CTA, etc
  - hover `transform: translateY(-1px)` transition 160ms ease

- Primary orange:
  - bg #FF9700 / #FF9900, white text, square
  - hero CTAs 220px/220px/272px (desktop 730px row gap 8px bottom 18px) h 44px font 14px 600
  - hover #e68a00

- Outlined share button:
  - bg #FFFFFF border 1.5px #E7A62A text #171717 pill `9999px` 190×42 desktop 170×42 mobile font 14px 500 gap 8px with share icon 20px
  - hover #FFF9EB

- Small square/rectangle outline benefit rows (Better Sleep): small 46×42 border 1.5px #8A8A8A bg transparent, label rectangle h 42 border 1.5px #4C4C4C bg white px 16 font 16/14.

- Rules: no arrows unless approved (disorder arrows are circular grey nav, not part of CTA), no gradients, no glows, no oversized pills except Share Fact, min mobile height 42-44px, focus visible outline `3px solid rgba(59,53,163,0.28) offset 3px`

## Image Direction — Actual (Updated: Hero now uses one composite background)

- Hero: **Retired layered cutout system as of 2026-05-11**. Old assets sleeping-woman.png, awake-woman.png, pillow-yellow.png, clouds-back.png, clouds-front.png, mask-image rules, z-index stacks removed from DOM and no longer loaded.
- Hero now: **One responsive composite background image** `/public/assets/hero/hero-bg.png` (source PNG, production recommended `hero-composite-background.webp` WebP/AVIF). Contains sleeping woman upper-right yellow pillow accent refreshed woman lower-right white pale-blue atmosphere cloud composition large clear white left for text integrated blending. Used as CSS background, not <img> layers.
- Desktop: `background-image: url("/assets/hero/hero-bg.png")`, `background-repeat: no-repeat`, `background-size: cover`, `background-position: center top` (large desktop >1440 `center 8%`, fallback `52% top` if subject too far right), width 100% min-height 650px max practical 720px, left text-safe zone protected by subtle white overlay `linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.90) 26%, rgba(255,255,255,0.42) 46%, rgba(255,255,255,0) 67%), url(...)` only left, not covering right subject.
- Content positioning: normal document flow inside max-w 1380 margin 0 auto padding 64, headline max-w 560 top padding below navbar approx 94px (hero outer pt 64 mobile 68 tablet 72 desktop accounts for fixed navbar), benefits grid repeat3 max-w 660 gap0 mt42 normal flow, CTA grid 220 220 270 gap8 mt34 normal flow beneath benefits, not absolute, not detached white strip.
- Mobile: Dedicated visual block below headline same image as background, width 100% aspect-ratio 4/3 background-image same url, background-position 68% center (or 72% if awake woman cropped), preserve sleeping face yellow pillow awake woman, not `contain` with blank, not tiny strip. Order Navbar, Headline, Background visual area, Benefits, CTA stack, Statement strip.
- Tablet 768-1023: balanced composition background-size cover background-position 58% top, headline width 430-500, benefits one row, CTAs 2+1 only if necessary.
- Performance: Image converted to WebP `hero-composite-background.webp` 79KB (plus PNG source 8.2MB composite), preload via `<link rel="preload" as="image" href="/assets/hero/hero-bg.png" fetchpriority="high">`, avoid loading removed cloud/cutout assets, define intrinsic dimensions, do not lazy-load above-the-fold.
- Accessibility: Decorative composite artwork as CSS background no redundant alt, heading selectable text, buttons real buttons, background does not reduce contrast, reduced-motion unaffected.

- Normal rectangular section photography:
  - Chronotype meditation 410×345 cover center radius 0
  - Optimization yoga 390×410 (placeholder grey via placehold.co grey)
  - Pillars 245px height desktop (190 mobile, 290 tablet) 4 images placehold.co 400×490 grey
  - Better Sleep 470×420 (placehold)
  - Why Matters Mind/Body/Life 190px (170 tablet, 16/9 mobile)
  - Sleep Cycles strip images 3 × 170×130 grid 3 rows gap 4px h 390px
  - Disorders Insomnia/OSA 280px h (240 tablet) aspect 4/3 mobile
  - Warning Signs not photographic but icons
  - Sleep Facts uses illustration icons not photos
  - Guidance 470×390

- Circular benefit crops: hero benefit-sleep/energy/life jpg circular 96px desktop 72 mobile border 0 shadow 0 3px 8px rgba(0,0,0,0.10) object-cover

- Educational iconography:
  - Warning Signs: 8 custom inline SVGs 68×68 (52 mobile) stroke #171717 stroke-width 1.6 fill none — themes: snoring Zzz, breathing pause, gasping air, daytime sleepiness alarm clock, driving asleep steering wheel, persistent insomnia moon, unusual movements walking figure, impact work desk stress
  - Sleep Facts: 4 indigo line icons 56×56 stroke #3B35A3 stroke-width 1.7 fill none within white circle 86×86 — body clock, sleep cycles, brain health, improved habits sun/moon

- Infographic imagery: fact strip background /images/sleep/fact-strip-background.jpg (32KB reused for disorders-background.jpg) with white overlay 0.82 linear gradient, opacity 0.82 for facts, 0.84 for disorders

- Rules: realistic wellness healthcare photography bright natural light calm expressions sleep/energy/movement/nutrition recovery themes, no futuristic 3D, no cyberpunk, no dark dramatic unless insomnia required, no visible text inside final images, no placeholder labels in production (currently many placehold.co grey labels), no inconsistent corner radii, preserve focal points with object-position center (or right top hero)

## Iconography

- Simple outline icons stroke 1.6-1.8
- Black #171717 for warning signs, indigo #3B35A3 for shareable facts
- No filled emoji
- No colourful icon badges
- No icon backgrounds unless approved (facts white circle 86px bg #FFF)
- Use SVG inline or Lucide-style — current warning icons handcoded SVG paths, facts also handcoded
- Designer assets replace temporary later
- Share icon 20px three connected nodes stroke #171717 1.5 circle r2 lines
- Disorders arrows simple chevron polyline points 9 18 15 12 9 6 stroke 2.5 white on grey #6F6F6F circle

## Section Divider Rules

- `border-bottom: 1px solid rgba(228,185,61,0.72)` (applied via inline style borderBottom)
- Some sections also have top divider `borderTop: 1px solid rgba(228,185,61,0.72)` + absolute div h-[1px] bg rgba(228,185,61,0.72) e.g., ChronotypeIntroduction top absolute
- Rules: only one divider between neighbouring sections, avoid duplicate top+bottom causing 2px thick appearance, no thick gold lines >2px except hero benefit dividers 2px, no random grey separators (FAQ uses rgba(120,120,120,0.55) for row dividers interior, not section divider)

## Approved Section Catalogue — 15 Sections (14 + Navbar)

### 0. Site Navbar — SiteNavbar.tsx (Added Responsive Transparent-to-White)
- Purpose: Clean professional healthcare-focused lightweight editorial navbar integrating with hero, readable against pale hero, fixed top
- Layout: fixed top0 left0 right0 z1000 w100% height 72px desktop lg, 68px tablet md, 64px mobile, inner wrapper max-w1380 px48 lg / 32px md / 18px mobile mx-auto grid auto 1fr auto align center h100%
- Structure: Left Brand lockup circular moon/sleep icon 36×36 desktop 32 mobile bg #35319B fg white + text Chronotype Poppins 18px 600 line1 color #2F2A86, Center nav Sleep Science→#why-sleep-matters, Chronotypes→#chronotypes, Sleep Benefits→#better-sleep-better-days, Sleep Disorders→#common-sleep-disorders, FAQ→#faq-section gap30 centered flex, Right CTA Take Test Now 150×40 bg #3B35A3 white 13px 600 radius0 hover #332D92 translateY -1px
- Initial transparent state: background transparent no border no large shadow text #2F2A86 brand #2F2A86 links #2F2A86 CTA #3B35A3 white, not white over pale hero, not orange all links, orange only hover/active
- Scrolled state: scroll >40-60px transition to bg rgba(255,255,255,0.97) backdrop-filter blur10 border-bottom 1px rgba(228,185,61,0.32) shadow 0 4px 18px rgba(35,31,90,0.08) text brand #2F2A86 links #29275E active #F59A00 hover #F59A00 CTA #3B35A3 white
- Transition: background-color 220ms ease, box-shadow 220ms ease, border-color 220ms ease, color 180ms ease, no width/height anim, no bouncy, no hide while scrolling, height unchanged
- Nav links: Poppins 14px line1 weight500 no underline flex center gap30 hover #F59A00 optional underline h2 bg #F59A00 scaleX0→scaleX1 subtle, no pill bg
- Active: Intersection Observer highlight active #F59A00 no large fill, not multiple active
- Desktop CTA: Take Test Now 150×40 bg #3B35A3 white 13px 600 radius0 shadow none hover #332D92 translateY -1px no arrow gradient
- Hero offset protection: hero outer section pt 64 mobile md68 lg72 to account for fixed navbar height, prevent navbar covering heading, no extra blank below navbar
- Tablet <1024: hide desktop center nav and desktop CTA, show Brand + Hamburger 44×44, height68, same transparent-to-white behaviour
- Mobile <768: height64 brand icon32 font16 same transparent-to-white, background transparent at top brand #2F2A86 hamburger lines #2F2A86, scrolled bg rgba(255,255,255,0.98) brand #2F2A86 hamburger #2F2A86
- Hamburger: 44×44 accessible button aria-label Open navigation menu aria-expanded menuOpen aria-controls mobile-navigation, 3 indigo lines 24×2 gap5, when opened animate into X via rotate 45deg translate5 5 and -45 etc transition transform 180 opacity 180, background transparent border none focus outline
- Mobile menu panel: fixed top64 left0 right0 z999 bg #FFFFFF border-top 1px rgba(228,185,61,0.25) shadow 0 12px 28px rgba(35,31,90,0.12) padding18 20 24 open animation opacity0→1 translateY -8→0 180ms ease, not side drawer, no full-screen dark overlay optional subtle overlay rgba(31,27,83,0.12)
- Mobile menu links: flex column each min-height48 display flex align center 15px 500 color #29275E border-bottom 1px rgba(120,120,120,0.16) active color #F59A00 no rounded cards icons beside every link
- Mobile CTA: width100% height46 mt16 bg #3B35A3 white square no floating
- Menu behaviour: open/close smooth, close when link clicked, close Escape, close outside click, lock body scrolling while open, restore, update aria-expanded, keep focus accessible, return focus to hamburger after closing, no duplicate desktop+mobile menus visible simultaneously
- Smooth anchor scrolling: html scroll-behavior smooth, prefers-reduced-motion auto, section[id] scroll-margin-top 84px desktop mobile 76px, in globals.css
- Accessibility: header nav aria-label Primary navigation semantic header nav, keyboard navigation, focus visible, menu button labels, active link aria-current location
- Prohibited: glassmorphism-heavy, blurred dark bg, white text over pale hero, oversized logo, mega menu, dropdown, search, social, contact, multiple CTA, rounded pill nav links, floating card, disappearing, shrink-on-scroll, side drawer desktop
- Component: SiteNavbar src/components/navbar/SiteNavbar.tsx
- Order: 0 first, before Hero

### 1. Hero — HeroSection.tsx (Updated to Single Composite Background 2026-05-11)
- Purpose: Campaign poster hero, brand statement, benefits, primary CTAs — now using one composite background image for easier maintenance, no overlapping cutout layers, visually faithful to Photoshop
- Layout: relative w-full overflow-hidden bg white pt64 md68 lg72 min-h 0 md min-h 650 max-h 720, full-width background image /assets/hero/hero-bg.png cover center top (tablet 58% top, large desktop >1440 center 8% fallback 52% top), width 100% min-height 650 max practical 720 fill full width no blank strips, left text-safe zone clear, readability overlay left-to-right white gradient 90deg rgba(255,255,255,0.98) 0% rgba(255,255,255,0.90) 26% rgba(255,255,255,0.42) 46% transparent 67% only left not covering right subject
- Desktop: content max-w 1380 margin 0 auto padding 64 (px18 md32 lg64), headline area top padding below navbar approx 94px (outer pt72 + inner pt42), max-w 560, heading 58px desktop clamp 50-68 line1.07 tracking -0.04 orange #FF6500 700 / indigo #35319B 600 exact breaks Sleep is the / Foundation. / Sleep Chronotype / is the Blueprint., no absolute offsets, normal document flow, benefits grid repeat3 max-w660 gap0 mt42 desktop mt24 mobile circular images 96px desktop clamp64-82 mobile labels 23px desktop clamp13-16 mobile orange #FF9700 indigo #37329D dividers 2px h104 gold #F3C416, CTA row grid 220 220 270 gap8 mt34 desktop mt22 mobile grid1fr gap10 w100% h48 purple #3A34A3 orange #FF9700 white 14 600 radius0 flat editorial, not detached white strip, not overlapping background subject
- Mobile: intentional order Navbar, Headline, Background visual area, Benefits, CTA stack, Statement strip, normal flow headline not over face. Headline clamp 38 10.5vw 50 line1.04 mb18, background visual block below headline width100% aspect 4/3 background-image same url repeat no-repeat size cover position 68% center (72% if awake cropped) preserves sleeping face yellow pillow awake woman, not tiny strip, not contain blank. Benefits grid3 gap8 mt24 circles clamp64-82 labels clamp13-16, CTA grid1fr gap10 mt22 w100% h48 no overlap visual block
- Tablet 768-1023: balanced cover 58% top headline width 430-500 benefits one row CTAs 2+1 only if necessary, not mobile stacking too early
- Colors: composite background white pale-blue atmosphere clouds integrated, left clear white area, heading #FF6500 / #35319B, benefits orange/indigo, dividers yellow, CTA purple/orange, readability overlay white gradient left only
- Typography: Poppins 700/600 line1.07 tracking -0.04 hero 50-68 desktop 38-50 mobile, benefits 23px 700 desktop 13-16 mobile, CTA 14 600
- Image treatment: One composite background image /assets/hero/hero-bg.png (PNG source 8.2MB + WebP 79KB production) includes sleeping woman upper-right yellow pillow accent refreshed woman lower-right white pale-blue atmosphere cloud composition large clear white left integrated blending, used as CSS background cover center top / 68% center mobile, not <img> layers, no mask-image rules, no z-index stack, no separate cloud layers, no old placeholders, performance preload link rel preload as image href /assets/hero/hero-bg.png fetchpriority high, do not lazy-load above-the-fold
- CTA style: flat rectangular 0 radius hover translateY -1px brightness 0.96 180ms
- Prohibited: visible rectangle boundaries, checkerboard transparency, white spacer between hero and statement, 50/50 split, over-zoom crop hiding face/hands, faded awake woman, tiny benefit icons, multiple hero backgrounds, dark overlays, text over sleeping woman face, blurred heavily, cloud layers added, cutouts added
- Component name: HeroSection, path src/components/hero/HeroSection.tsx
- Order: 1 (after Navbar 0)

### 2. Indigo Statement Strip — HeroStatementStrip.tsx
- Purpose: Educational reinforcement "Sleep powers your Health..."
- Layout: full-width dark indigo min-h 230px (spec 230-235) flex center, bg #353080 (spec #353080) with low-contrast background image 0.18 opacity blur 0.5px overlay linear-gradient rgba(53,48,128,0.96) to rgba(42,37,112,0.98)
- Desktop: max-w 980 centered px 24 py 36-38 text center 3 lines, first paragraph 18px white 400 + yellow span #FFD21A 600 highlights Health/Mind/Performance/Recovery/Longevity, second paragraph similar Think/Feel/Learn/Work/Communicate yellow + "and perform throughout the day" white 600 bold, final line uppercase 22px 700 white "YOUR DAYS ARE ONLY AS POWERFUL AS YOUR NIGHTS."
- Mobile: padding 22px 36px, body 16px final 19px
- Colors: #353080 bg, white #FFF text, yellow highlight #FFD21A, image overlay dark indigo
- Typography: Poppins 400 body, 600 highlight, 700 final uppercase
- Image: statement-background.jpg cover center opacity 0.18
- CTA: none
- Prohibited: tall 300px+, visible high-contrast background image, second top divider duplication
- Component: HeroStatementStrip src/components/hero/HeroStatementStrip.tsx
- Order: 2

### 3. Understanding Chronotypes — ChronotypeIntroductionSection.tsx
- Purpose: Introduce chronotype meaning + influences list + meditation image
- Layout: white bg top divider gold 1px absolute + bottom divider 1px rgba(228,185,61,0.7), inner max-w 1180 px 48 pt 62 pb 42, grid desktop `minmax(0,1.15fr) 410px` gap 68, tablet 1.15fr/360 gap 32, mobile single column order heading→paragraph→"It influences:"→list→image→conclusion→CTA
- Content: heading 2 lines "Discover Your Natural Sleep Rhythm: / Understanding Chronotypes" 30px 600 #F59A00 max-w 620 mb14, intro para 18px #29275E #29275E max-w 570 mb24, label "It influences:" 19px 600 #171717 mb7, ul 5 items 16px #171717 weight 400 mb5 each left padding 0 list-disc list-outside, image 410×345 cover center margin-top12, conclusion centered mt20 "Understanding your rhythm helps you work..." 16px #171717, CTA 205×36 (desktop spec) bg #3B35A3 white 13px 600 bottom compact mt14
- Colors: heading #F59A00 paragraph #29275E list #171717 gold divider #E4B93D, image none border
- Typography: 30/27/24 heading, 18/16/15 para, 16 list
- Image: chronotype-meditation.jpg 144KB final-ish but still considered temporary? Aspect cover
- CTA: compact 205×36 desktop 210×42 mobile bg #3B35A3
- Prohibited: 3-4 line heading, too-wide left column >560, dense list <5px gap, oversized CTA, rounded image
- Component: ChronotypeIntroductionSection src/components/chronotype/...
- Order: 3

### 4. Chronotype Optimization — ChronotypeOptimizationSection.tsx
- Purpose: Checklist of 8 optimization areas + yoga image + centered closing 2 sentences
- Layout: white bg top+bottom divider rgba(228,185,61,0.72), inner max-w 1120 px 48 pt42 pb46, heading centered 30px orange #F59A00 max-w820 mb30 2 lines "Every chronotype has unique strengths... / and opportunities...", grid desktop `minmax(0,1fr) 390px` gap76, left max-w460, checklist title 21px 600 "Understanding your chronotype / can help optimize:" mb14, checklist 8 items each row flex gap10 min-h38/40 border-bottom 1px rgba(215,178,69,0.8) checkbox 22×22 border 1.5px #171717 radius0 bg transparent, text 16px 400, image right 390×410 cover center ml-auto, bottom copy centered max-w900 mt28 15-16px "Peak performance comes..." + "Take the test now..."
- Colors: heading #F59A00 checklist border #DDB642 approx #D7B245, checkbox border #171717
- Typography: heading 30, title 21, items 16, bottom 15-16 centered
- Image: placeholder 390×410 grey "Yoga - Woman balancing outdoors"
- CTA: none
- Prohibited: CTA button here, rounded checklist rows, icons, colored badges
- Component: ChronotypeOptimizationSection src/components/optimization/...
- Order: 4

### 5. Four Pillars of Daily Energy Management — DailyEnergyPillarsSection.tsx
- Purpose: 4 equal editorial columns Sleep/Movement/Nutrition/Light Exposure
- Layout: white bg bottom divider, inner max-w1180 px48 pt42 pb40 min-h530, heading centered orange 30px max-w820 mb28 "The Four Pillars...", grid desktop repeat4 gap16 col width ~260-275 equal width, order Sleep→Movement→Nutrition→Light Exposure left-right
- Per pillar: title h3 20px 600 #171717 centered mb10 (Sleep, Movement, Nutrition, Light Exposure), image 100% h245 (tablet290 mobile190 aspect 4/5) cover center radius0 no shadow display block, description 15px 400 #171717 centered max-w220 mt12 min-height64 to align, descriptions: "The foundation of recovery..." etc exact
- Bottom: supporting sentence centered mt22 16px "Small daily habits create lasting improvements...", CTA centered 320×40 mt14 bg #3B35A3 white 13px 600 "Explore Sleep Improvement Strategies" hover #332D92 translateY -1px
- Colors: heading orange #F59A00 titles black #171717 descriptions black, CTA indigo #3B35A3
- Images: currently placehold.co 400×490 grey temporary (needs final)
- Prohibited: card backgrounds, shadows, rounded wrappers, orange titles, hover zoom, masonry, slider, icons beside titles
- Component: DailyEnergyPillarsSection src/components/pillars/...
- Order: 5

### 6. Better Sleep Creates Better Days — BetterSleepBetterDaysSection.tsx
- Purpose: 7 outlined benefit rows + sleeping image
- Layout: white bg bottom divider, inner max-w1120 px48 pt44 pb52 min-h600, heading centered 30px #F59A00 "Better Sleep Creates Better Days" mb12, subtitle 17px 600 #171717 centered "Quality sleep influences every area..." mb30, grid desktop 430px + 1fr gap54 align center, tablet 380+1fr gap32, mobile block order heading→subtitle→list→image
- Benefit rows: 7 items exact: Better Physical Health, Better Mental Health, Better Emotional Stability, Better Relationships, Better Recovery, Better Productivity, Better Quality of Life, each row grid 46px + 1fr gap8 mb8, small square 46×42 border 1.5px #8A8A8A bg transparent, label rectangle h42 border1.5px #4C4C4C bg white px16 text 16px 400 #171717
- Right image: 470×420 desktop (370 tablet, 4/3 mobile) cover center, placeholder grey currently, alt "Woman sleeping peacefully..."
- No CTA
- Colors: heading #F59A00 subtitle #171717 small box border #8A8A8A label border #4C4C4C gold divider rgba(228,185,61,0.72)
- Prohibited: CTA, icons, checkmarks, coloured badges, rounded corners, shadows
- Component: BetterSleepBetterDaysSection src/components/better-sleep/...
- Order: 6

### 7. Why Sleep Matters — WhySleepMattersSection.tsx
- Purpose: Fact strip 4 stats + supporting sentences + Mind/Body/Life 3 columns
- Layout: white bg bottom divider, inner max-w1180 px48 pt44 pb48 min-h720, heading 30px orange "Why Sleep Matters" mb10 centered, label FACT STRIP 18px 600 #3B35A3 centered mb18, statistics strip full-width continuous rectangular band min-h150, background linear-gradient rgba(255,255,255,0.82) + url("/images/sleep/fact-strip-background.jpg") cover center, grid 4 cols desktop 150px min-h, facts values 24px 700 #171717 + descriptions 14px 400 max-w190 centered padding 20/22, vertical dividers 2px #3B35A3 between cols (responsive 2×2 tablet with vertical+horizontal, mobile stacked horizontal dividers)
- Facts exact: "7 to 9 Hours / Recommended..." etc 4 facts
- Supporting orange sentence 17px 600 #F59A00 mt24 "Good sleep changes your energy...", black sentence 16px 400 "Quality sleep powers..." mt6 mb24
- Mind/Body/Life grid 3 cols gap34 align start order Mind Body Life, titles 22px 600 #171717 centered mb10, images 190px h (170 tablet 16/9 mobile) cover center, descriptions 14px centered max-w260 mt10 "Learning, memory..." etc
- CTA 205×38 desktop (190×42 mobile) bg #3B35A3 white 13px 600 "Explore Sleep Cycles" centered mt24
- Colors: heading #F59A00 label #3B35A3 values #171717 dividers #3B35A3 supporting orange #F59A00 black #171717 CTA indigo
- Images: fact-strip-background.jpg 32KB reused, pillar images placehold 400×300 grey
- Prohibited: statistic cards, rounded corners, badges, icon circles, counters, extra CTA
- Component: WhySleepMattersSection src/components/why-sleep/...
- Order: 7

### 8. Understanding Sleep Cycles — UnderstandingSleepCyclesSection.tsx
- Purpose: Educational comparison NREM vs REM + image strip + conclusion strip
- Layout: white bg bottom divider, inner max-w1180 px48 pt44 pb46 min-h720, heading 30px orange "Understanding Sleep Cycles" mb8 centered, supporting indigo 17px 500 #3B35A3 "Your body heals..." mb10, intro paragraph 15px 400 #171717 max-w920 centered mb24 with bold "90 to 120 minutes" and "4 to 6 cycles", comparison grid desktop `170px 190px 1fr 16px 1fr` gap0 (tablet 130 165 1fr 16 1fr) mobile stacked order heading→supporting→intro→image strip→NREM→REM→conclusion
- Column order: 1 image strip 170×390 h 3 rows gap4 images 170×130 each cover, 2 category labels 4 rows: Primary Function, Approximate Duration, Key Activities, Primary Benefit 16px 600 #171717 padding14/18 border-bottom #DDB642 grid rows minmax 78 auto with 42px spacer aligning yellow headers, 3 NREM column yellow header h42 bg #F4C623 centered 17px 600 NREM Sleep, 4 rows content 15px 400: Rest Repair Recovery / 75-80% / Tissue repair... / Restores the body, 4 spacer 16px, 5 REM column similar Learning Memory... etc
- Bottom conclusion strip full-width dark-indigo #383477 mt28 min-h145 padding28/36 flex column center text center: line1 white 18px 600 "NREM Sleep supports...", line2 yellow #F4C623 18px 600 "REM Sleep supports mental...", line3 white 18px 600 "Both are essential..."
- Colors: heading #F59A00 supporting #3B35A3 body #171717 header yellow #F4C623 dividers #DDB642 conclusion #383477 white text yellow highlight
- Mobile: image strip 3 cols ×120px grid, NREM/REM blocks each grid 130px + 1fr rows border-bottom #DDB642 label 13px 600 / value 13px 400
- Prohibited: tabs accordion hover stats pie charts extra paragraphs CTA
- Component: UnderstandingSleepCyclesSection src/components/sleep-cycles/...
- Order: 8

### 9. Common Sleep Disorders — CommonSleepDisordersSection.tsx
- Purpose: Showcase Insomnia and OSA side-by-side with pale background + navigation arrows + outlined statement
- Layout: white bg bottom divider, inner max-w1180 px48 pt44 pb44 min-h650, heading 30px orange "Common Sleep Disorders" mb8 centered, subtitle 15px 500 #3B35A3 max-w900 centered mb24 "Sleep disorders can influence...", main visual area min-h430 relative overflow hidden background linear-gradient rgba(255,255,255,0.84)+url("/images/sleep/disorders-background.jpg") cover center (32KB same as fact strip), grid desktop 1fr 2px 1fr gap28 padding 48 70 32 align start, center divider 2px×320 bg #F59A00 self-center, left/right images 100% h280 (240 tablet) cover center alt insomnia tired woman / OSA CPAP mask, titles 20px 600 #3B35A3 left mt12 "Insomnia" / "Obstructive Sleep Apnea (OSA)", descriptions 15px 400 left max-w440 mt5 exact copy, arrows circular 44×44 desktop 40 tablet bg #6F6F6F white chevron stroke 2.5 box-shadow 0 2px 6px rgba(0,0,0,0.12) absolute left/right 14px vertically centered relative to images translate-y 140px (mobile centered pair gap12 below images), bottom outlined statement bar width calc(100%-120px) mobile 100% min-h48 mt18 mx-auto border1.5px #E4B93D bg rgba(255,255,255,0.92) padding10/24 text 15px 600 centered "Understanding the signs..."
- Colors: heading #F59A00 subtitle #3B35A3 titles #3B35A3 desc #171717 divider orange #F59A00 arrows #6F6F6F white icons border gold #E4B93D
- Mobile: stack disorders order heading→subtitle→insomnia image→title→desc→horizontal orange divider 2px h100% my24→OSA image→title→desc→arrows pair→statement bar 100% font14 padding12/14
- Prohibited: multiple cards tabs accordion dots autoplay rounded cards dark full background
- Component: CommonSleepDisordersSection src/components/sleep-disorders/...
- Order: 9

### 10. Warning Signs That Need Attention — WarningSignsSection.tsx
- Purpose: 8 warning items 2 rows 4 cols with line-icons inside gold outlined panel + CTA
- Layout: white bg bottom divider, inner max-w1120 px48 pt46 pb48 min-h610, heading 30px orange "Warning Signs That Need Attention" mb10 centered, subtitle 17px 400 #171717 "Seek professional evaluation..." mb24 centered, main outlined panel w100% min-h430 border1.5px #E4B93D bg white padding30/34/28 radius0 shadow none
- Grid desktop repeat4 gap30/22 align start order row1 Loud Habitual Snoring / Pauses in Breathing / Waking up Gasping / Excessive Daytime Sleepiness row2 Falling Asleep while Driving / Persistent Insomnia / Unusual Movements... / Significant impact... Exact labels preserved including line breaks
- Item: icon 68×68 desktop (58 tablet 52 mobile) black stroke 1.6 fill none inline SVG hand-coded 8 icons as earlier listed, label 14px 400 centered max-w190 mt10 line 1.4 #171717
- Supporting sentence below grid centered mt30 16px "Better awareness leads to earlier support and better outcomes."
- CTA centered mt16 235×40 (230×42 mobile) bg #3B35A3 white 13px 600 "Consult a Sleep Specialist" hover #332D92 translateY -1px focus outline rgba(59,53,163,0.28)
- Colors: heading #F59A00 subtitle #171717 panel border #E4B93D icons #171717 labels #171717 CTA indigo
- Mobile: grid 2 cols gap28/16 (1 col below 360px), section padding 36/18/38 panel padding24/16 heading24 subtitle14 icons52 labels12.5 supporting14 CTA min 100%/230×42
- Prohibited: red warnings alert triangles badges colored cards shadows gradients animation counters tooltips extra signs
- Component: WarningSignsSection src/components/warning-signs/...
- Order: 10

### 11. Sleep Facts Worth Sharing — SleepFactsSharingSection.tsx
- Purpose: 4 fact panels 2×2 grid social sharing
- Layout: white bg bottom divider, inner max-w1060 px48 pt46 pb48 min-h720, heading 30px orange "Sleep Facts Worth Sharing" mb28 centered
- Grid 2×2 gap28/36 desktop, order Fact1 body clock influence alert productive sleepy, Fact2 typical night 4-6 cycles 90-120min, Fact3 critical role memory learning emotional immunity, Fact4 small improvements create meaningful...
- Panel: min-h290 desktop (275 tablet 250 mobile) bg #F0EFF9 border none radius 18px shadow none padding24/30/22 flex column center text center, icon circle 86×86 white 9999px bg white mb18 centered, icon 56×56 indigo line stroke 1.7 fill none #3B35A3 themes body clock, sleep cycles, brain health, bed sun/moon
- Text: 16px 400 #171717 centered max-w390 flex-grow 1 flex center align, approx 3-5 lines
- Button: Share Fact 190×42 desktop 170×40/42 border pill 9999px white bg border1.5px #E7A62A text #171717 14px 500 gap8 share icon 20px 3 nodes black stroke 1.5, hover #FFF9EB
- Bottom CTA: centered mt32 500×48 desktop min-h48 padding12/16 mobile full width 100% auto min48, bg #3B35A3 white 17px 600 "Share These Facts with Your Loved Ones Now" with yellow Now #F4C623, hover translateY -1px
- Equal-height: .sleep-fact-panel height100% .sleep-fact-copy flex1 ensures buttons align
- Colors: section white heading #F59A00 panel #F0EFF9 icon-bg white icon stroke #3B35A3 fact text #171717 share border #E7A62A share text #171717 bottom CTA #3B35A3 white "Now" #F4C623
- Mobile: single column gap18, panel min-h250 padding22/20/20 radius16, icon circle74×74 icon46×46, text 14 line1.5, button170×42, bottom CTA wraps 15px line1.35
- Prohibited: stat numbers pagination carousel badges shadows dark bg floating icons social logos counters extra panels
- Component: SleepFactsSharingSection src/components/sleep-facts/...
- Order: 11

### 12. Need Additional Guidance? — AdditionalGuidanceSection.tsx
- Purpose: Simple supportive section left text right lifestyle image + CTA
- Layout: white bg bottom divider, inner max-w1120 px48 pt46 pb48 min-h500, grid desktop `minmax(0,1fr) 470px` gap58 align center tablet `1fr 390px` gap36, mobile block order heading→intro→paragraph→image→CTA
- Left max-w500 text-left: heading 30px 600 #F59A00 "Need Additional Guidance?" mb16, intro 18px 500 #171717 max-w470 mb20 "The right support at the right time can make all the difference", paragraph 16px 400 line1.65 max-w500 "Sleep concerns can influence health, performance, relationships..."
- Right image 470×390 desktop (390×340 tablet, 4/3 mobile mt24) cover center placeholder grey currently alt "Woman waking refreshed..."
- CTA centered below full 2-col block mt28 310×44 desktop 280×42 tablet min100%/300×44 mobile bg #3B35A3 white 15px 600 "Talk to a Sleep Specialist" hover #332D92 translateY -1px focus outline
- Colors: bg white heading #F59A00 text #171717 CTA indigo #3B35A3
- Prohibited: consultation form doctor profile booking calendar phone email contact card badges stats icons gradients shadows rounded image corners extra CTA testimonial
- Component: AdditionalGuidanceSection src/components/additional-guidance/...
- Order: 12

### 13. FAQ SECTION — FaqSection.tsx
- Purpose: Accordion 6 FAQs clean editorial
- Layout: white bg bottom divider, inner max-w980 px48 pt48 pb52 min-h540, container max-w900 mx-auto no outer card transparent, heading 30px 600 #F59A00 "FAQ SECTION" centered mb28
- Rows 6 exact: What is a chronotype? / What are the main chronotypes? / How many hours of sleep do adults need? / What is REM sleep? / What is the difference between REM and NREM sleep? / When should I seek help for a sleep problem?
- Row styling border-bottom 1px rgba(120,120,120,0.55), trigger grid 12px 1fr 28px gap16 min-h58 padding14/4 bg transparent border none text-left cursor pointer hover question color #3B35A3
- Bullet dot 8×8 (7 mobile) circle bg #3B35A3 9999px
- Question 17px 600 #171717 left (16 tablet 14 mobile line1.4-1.45)
- Chevron 22×22 (18 mobile) color #C5C5C5 stroke2.5 transition transform 180ms rotate90 when open
- Answer 14px 400 #444444 line1.65 padding 0 44 18 left 36 max-w820, first open default, only one open at time, click open toggles, height 180ms opacity transition, hidden when closed maxHeight 400/0
- Accessibility section aria-labelledby faq-heading h2 id faq-heading, button aria-expanded aria-controls id faq-trigger-idx / faq-panel-idx role region, focus outline 3px rgba(59,53,163,0.24) offset3px
- Mobile trigger grid 8px 1fr 22px gap12 padding14/0 min-h56 question14 answer13 line1.6 padding0/28/16/20
- Colors: heading #F59A00 question #171717 answer #444444 dot #3B35A3 chevron #C5C5C5 divider rgba(120,120,120,0.55) bottom section divider gold
- Prohibited: search field categories side nav cards rounded outer container shadows gradient plus/minus circles numbered icons extra FAQs CTA
- Component: FaqSection src/components/faq/...
- Order: 13

### 14. Disclaimer Footer — DisclaimerFooter.tsx
- Purpose: Compact medical-information disclaimer black footer
- Layout: full-width solid black bg #000000 min-h210, inner max-w1120 px48 pt34 pb38, left-aligned content
- Heading DISCLAIMER 16px 600 #FFFFFF left mb12, paragraph 14px 400 #FFFFFF left line1.65 max-w1080: "The information provided on this website is intended for educational and informational purposes only and should not be considered medical advice, diagnosis, or treatment. Individuals experiencing persistent sleep concerns or symptoms suggestive of a Sleep Disturbance & Sleep Disorder (SDASD) should seek appropriate professional evaluation." Highlight (SDASD) only orange #F59A00 600
- No nav, no logo, no social, no copyright, no gradients, no shadows, no decorative artwork
- Tablet px32 pt32 pb34 heading15 para13, mobile px20 pt28 pb30 heading14 para12 line1.7 left
- Accessibility footer aria-labelledby disclaimer-heading h2 id disclaimer-heading, real selectable text, contrast white/black 21:1
- Colors: footer black #000000 heading white #FFFFFF paragraph white highlight orange #F59A00
- Prohibited: logo nav sitemap social newsletter copyright address phone email badges CTA gradient image decorative line
- Component: DisclaimerFooter src/components/footer/...
- Order: 14 last

## Prohibited Design Patterns — Explicit

- generic AI visual style, random gradients, floating glass cards, large border-radius cards (>2px except facts 18px share pill)
- dark technology backgrounds, neon colours, teal wellness palette (# teal, green, navy-grey, pastel purple forbidden per specs), abstract blobs, stars, random illustrations, parallax, excessive motion
- hover zoom on editorial images, invented copy, unapproved cards, changing section order, modifying approved content, adding unsupported statistics, adding badges, counters, progress bars, autoplay, carousel arrows unless spec (disorders has grey arrows allowed), multiple CTA buttons outside spec, contact forms, doctor profiles
- using serif fonts, decorative display fonts, gradient text, excessive letter spacing
- embedding text permanently into images for normal content (FAQ etc)
- using rounded image corners for rectangular editorial images
- adding shadows stronger than 0 2px 6px rgba(0,0,0,0.12) or hero benefit circle shadow
- adding outer card around FAQ, warning panel inside disorders, etc

---
END DESIGN_SYSTEM
