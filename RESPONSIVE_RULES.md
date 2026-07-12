# Responsive Rules — Sleep Wellness Landing — Final Implemented (Mobile Refinement + Single Composite Hero 2026-05-11)

Generated from live code audit + mobile repair + single composite hero implementation. Breakpoints use Tailwind md:768 lg:1024 plus custom min-[390px] etc.

## Breakpoints

- small mobile: 320px–389px — single column, tight padding 16-20px, headings 24px, careful overflow, below 390 padding 16px
- standard mobile: 390px–479px — same but more width for 2-col grids (Four Pillars 2 col, Warning 2 col, etc)
- large mobile: 480px–767px — still below md, images taller, maintain 2-col where spec permits
- tablet: 768px–1023px — md: styles, grid columns hybrid, two-column editorial sections stay two columns, Four Pillars 2 cols, Facts 2 cols, Warning may use 4 cols if readable, image heights aspect ratios, CTA not full-width unnecessarily
- desktop: 1024px–1439px — lg: styles, max-widths 1060/1120/1180, padding 48px, headings 30px
- large desktop: 1440px+ — Hero max-w 1380/1440 h650-720 centered, background-position center 8% large desktop

## Global Responsive Foundation — Implemented

Applied in src/app/globals.css:

```css
html { overflow-x: clip; -webkit-font-smoothing: antialiased; box-sizing: border-box; scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce){ html{scroll-behavior:auto;} }
body { margin:0; min-width:320px; overflow-x:clip; }
*,*::before,*::after { box-sizing:border-box; font-family:"Poppins", var(--font-poppins), sans-serif; }
img,svg,video { max-width:100%; }
* { min-width:0; }
button,a { min-width:0; }
button { border-radius:0; }
section[id]{ scroll-margin-top:84px; }
@media(max-width:767px){ section[id]{ scroll-margin-top:76px; } }
```

Mobile section defaults: padding-left 20px right 20px top 36px bottom 38px, below 390 padding 16px, headings clamp 23,7vw,28 line1.18 -0.02em, body 14 line1.6, CTAs min-height44 width100% max320, removed fixed widths replaced with height:auto aspect-ratio, grid children min-width0.

## Hero Mobile Rebuild — Final Implemented (Updated to Single Composite Background 2026-05-11)

Problem fixed: headline overlapping face, desktop absolute composition on mobile, excessively tall hero h980, benefit oversized, awake-woman rectangle, CTA large, plus old layered system loading 5.7MB.

Solution — Single Composite Background System (1.3.0): Old layered artwork retired: sleeping-woman.png 1.9MB, awake-woman.png 1.4MB, pillow-yellow.png 1.6MB, clouds-back.png 685KB, clouds-front.png 986KB, mask-image rules, z-index stack 0-12, absolute offsets removed from DOM, no longer loaded. New asset /public/assets/hero/hero-bg.png (PNG source 8.2MB composite via ImageMagick, plus hero-composite-background.webp 79KB WebP production) contains sleeping woman upper-right yellow pillow accent refreshed woman lower-right white pale-blue atmosphere cloud composition large clear white left for text integrated blending. Used as CSS background, not <img> layers.

- Desktop (1024px+): Section relative w-full overflow-hidden bg-white pt64 md68 lg72 min-height 650 max 720 with background url("/assets/hero/hero-bg.png") repeat no-repeat size cover position center top (large desktop >1440 center 8% fallback 52% top), width 100% min-height 650 max 720 fill full width no blank strips, sleeping woman prominent right, left clear for headline, no stretch vertical, no 100% 100%. Subtle left readability overlay only left: linear-gradient 90deg rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.90) 26%, rgba(255,255,255,0.42) 46%, rgba(255,255,255,0.00) 67% as separate absolute div z1 hidden md:block, not covering right subject.
- Content positioning: max-w 1380 margin 0 auto padding 64 (px18 md32 lg64) normal document flow, headline max-w 560 top padding below navbar approx 94px (outer pt64/68/72 accounts for fixed navbar + inner pt28/36/42), benefits grid repeat3 max-w660 gap0 mt42 normal flow, CTA grid 220 220 270 gap8 mt34 normal flow beneath benefits not absolute not detached white strip.
- Mobile (<768px): Order Navbar, Headline, Background visual area, Benefits, CTA stack, Statement strip normal flow headline not over face. Headline above visual block clamp 38 10.5vw 50 line1.04 mb18 background not begin behind headline. Mobile background area below headline dedicated visual block same image as background width100% aspect 4/3 background-image url("/assets/hero/hero-bg.png") repeat no-repeat size cover position 68% center (72% if awake cropped) preserves sleeping face yellow pillow awake woman, not tiny strip, not contain with blank.
- Benefits below visual: grid repeat3 gap8 mt24 circles clamp64-82 height same margin 0 auto rounded-full shadow 0 2px 6px rgba(0,0,0,0.08) labels clamp13-16 line1.2 white-space normal centered color #FF9700/#37329D weight700 mt8 yellow dividers height68 self-center gold #F4C623.
- CTA stack grid1fr gap10 mt22 pb20 buttons w100% h48 font14 radius0.
- Tablet 768-1023: Balanced composition background-size cover background-position 58% top headline width 430-500 benefits one row CTAs 2+1 only if necessary.
- Performance: WebP hero-composite-background.webp 79KB + PNG source, preload via link rel preload as image href /assets/hero/hero-bg.png fetchpriority high, avoid loading removed cloud/cutout assets saved ~5.7MB, intrinsic dimensions via aspect-ratio, do not lazy-load above-the-fold.
- Accessibility: decorative composite as CSS background no alt, heading selectable, buttons real, no contrast reduction, reduced-motion unaffected.
- No horizontal scrolling, no headline/image overlap, no clipped headings, no fixed desktop widths, no oversized blank placeholder blocks.

## 2. Chronotype Introduction — Final Mobile

Below 768: `display:flex; flex-direction:column;` implemented via grid 1 col but behaves as column.

Order: heading, paragraph, It influences, list, image, closing sentence, CTA — verified DOM order matches.

- Heading: 25px line1.2 max-w620 mb14 orange #F59A00 (mobile 25, desktop 30) — implemented text-[25px] leading1.2
- Paragraph: 14px line1.6 mobile (md 16 line1.55 lg18) color #29275E max-w560 mb20
- It influences: 15px line1.3 mobile (md16 lg19) 600 #171717 mb7
- List: 5 items 14px line1.6 mobile mb5 list-disc
- Image: width100% aspect-ratio 4/3 height auto object-fit cover margin-top24px — implemented w-full md:w410 h-auto aspect 4/3 max-w-full mt24 md12, style aspectRatio 4/3 height100% object-cover center radius0, prevents tall empty block
- Closing sentence: 15px line1.5 mt20 mobile (implemented 15 line1.5 mt20 centered)
- CTA: width min(100%,230px) height44 — implemented w-full max-w230 md 205 h44
- Reduce excessive whitespace: pt36 pb38 mobile (was pt38 pb34) now compact
- Padding: px20 max389 16 md36 lg48 pt36 md52 lg62 pb38 md40 lg42, min-w0 on all children

## 3. Chronotype Optimization — Final Mobile

Below 768: `display:block;` implemented block md:grid.

- Heading: 25px line1.22 max-w100% mobile — implemented text25 line1.22 mx-auto max-w100% mb30
- Checklist title: 18px mobile (md19 lg21) — implemented 18px
- Checklist rows: min-height42px — implemented min-h42
- Checkbox: 22×22 — implemented 22
- Label: 15px mobile (lg16) — implemented 15
- Image: width100% aspect 4/5 height auto margin-top24px — implemented w-full md390 h-auto aspect 4/5 mt24 md0 maxHeight520 to prevent extremely tall empty block
- Bottom copy: 14px line1.55 mt22 — implemented 14 line1.55 mt22
- Prevent tall placeholder via aspect ratio and maxHeight.
- Section padding px20 max38916 md32 lg48 pt36 md40 lg42 pb38 md42 lg46 min-w0

## 4. Four Pillars — Final Mobile

For 390–767: `grid-template-columns:repeat(2,minmax(0,1fr)); gap:24px 14px;` — implemented `grid-cols-1 min-[390px]:grid-cols-2 lg:grid-cols-4 gap24 min-[390px]:gap-24_14px`

Below 390: `grid-template-columns:1fr;` — implemented grid-cols-1 default

- Pillar title: 17px mobile (md19 lg20) — implemented 17px
- Images in two-column layout: aspect-ratio 4/5 height auto — implemented div aspect 4/5 height auto maxHeight420 object-cover center to avoid huge blocks
- Descriptions: 13px line1.45 min-height58px — implemented text13 line1.45 min-h58
- CTA: width100% max320 height44 — implemented w-full max-w320 h44
- Avoid huge image blocks via aspect ratio.
- Section padding px20 max38916 md32 lg48 pt36 md40 lg42 pb38

## 5. Better Sleep Creates Better Days — Final Mobile

Mobile order: heading, subtitle, benefit list, image — verified DOM order heading→subtitle→grid (benefit list first, image second) matches required.

- Benefit rows: `grid-template-columns:42px minmax(0,1fr); gap:7px;` — implemented grid 42px minmax0 1fr gap7 mb8 min-w0
- Square: 42×40 — implemented w42 h40 border1.5 #8A8A8A
- Label: min-height40 height auto padding 9px 12px font14 — implemented min-h40 h-auto py9 px12 font14 break-words
- Image: width100% aspect 4/3 height auto margin-top24 — implemented w-full h-auto aspect 4/3 mt24 md0 max-w470, style aspect 4/3 height auto maxHeight420 object-cover center, do not create oversized blank rectangle.
- Section padding px20 max38916 md32 lg48 pt36 md40 lg44 pb38 md44 lg52
- Heading mobile clamp 23-28 per global, subtitle 14 line1.6

## 6. Why Sleep Matters — Final Mobile

Fact strip mobile compact:

- `grid-template-columns:1fr;` — implemented grid 1 md2 lg4
- Each fact row: min-height96px padding18 16px — implemented min-h96 px16 py18 md px22 py20, not 140-180
- Fact value: 21px line1.15 — implemented 21 line1.15 mb6
- Description: 13px line1.35 — implemented 13 line1.35 max-w190
- Mind/Body/Life: grid1fr gap28 — implemented grid1 md3 gap28 md20 lg34
- Each image: aspect 16/9 height auto — implemented w-full h-auto aspect 16/9 object-cover center
- Title: 20px mobile (lg22) — implemented 20
- Description: 14px mobile — implemented 14
- CTA: width min(100%,220px) height44 — implemented w-full max-w220 h44 md190 etc
- Avoid huge image blocks via aspect ratio.

## 7. Understanding Sleep Cycles — Final Mobile

Mobile order: heading, supporting text, intro paragraph, three-image strip, NREM block, REM block, conclusion strip — verified DOM order.

- Image strip: `display:grid; grid-template-columns:repeat(3,1fr); gap:4px;` Each image aspect 1/1 height auto — implemented grid 3 gap4 w-full mb20, each div aspect 1/1 overflow hidden maxHeight via aspect, img aspect 1/1 object-cover
- NREM and REM blocks: width100% margin-top20px — implemented w-full mt20 min-w0
- Header: height44px font17 — implemented h44 font17
- Rows: `display:grid; grid-template-columns:minmax(112px,36%) minmax(0,1fr);` — implemented grid 112px 36% + 1fr
- Label: 13px weight600 padding12 8 — implemented 13 600 padding12 8
- Value: 13px line1.45 padding12 8 — implemented 13 line1.45 padding12 8
- Conclusion: padding24 18 font15 line1.5 — implemented px18 py24 font15 line1.5
- Prevent horizontal overflow via min-w0 on all grid children, w-full, max-w-full.

## 8. Common Sleep Disorders — Final Mobile

Below 768 stack: Insomnia image, title, description, horizontal orange divider, OSA image, title, description, navigation controls, outlined conclusion — implemented block md:hidden DOM order matches, vertical divider removed (hidden md:grid), horizontal divider w-full h2 bg #F59A00 my24.

- Images: width100% aspect 4/3 height auto — implemented w-full aspect 4/3 h-auto maxHeight via aspect, object-cover center
- Background padding: 20px — implemented p20 mobile for main visual area
- Navigation: display flex justify center gap12 margin-top20 — implemented flex center gap12 mt20
- Controls: 42×42 — implemented w42 h42 rounded-full bg #6F6F6F white chevron shadow 0 2px 6px rgba(0,0,0,0.12)
- Conclusion: width100% font14 line1.45 padding12 14 — implemented w-full font14 line1.45 padding12 14 min-h48 border1.5 #E4B93D bg rgba(255,255,255,0.92)
- Section padding px20 max38916 md32 lg48 pt36 md40 lg44 pb38 md40 lg44 min-w0

## 9. Warning Signs — Final Mobile

- Grid: repeat(2,minmax(0,1fr)) gap28 14 — implemented grid-cols-2 gap28_14 md4 gap28_14 lg30_22 min-w0
- Panel padding: 24px 14px — implemented px14 py24 md22 28 lg34 30/28
- Icons: 52×52 — implemented w52 h52 md58 lg68 shrink-0
- Labels: 12.5px line1.4 wrap naturally — implemented 12.5 line1.4 break-words overflowWrap anywhere max-w190 mt10 centered
- Supporting sentence: 14px line1.5 — implemented 14 line1.5 mt30
- CTA: width100% max240 height44 — implemented w-full max-w240 h44 md230/235 etc
- Long labels wrap via break-words.
- Section padding px20 max38916 md32 lg48 pt36 md40 lg46 pb38 md44 lg48 min-w0

## 10. Sleep Facts — Final Mobile

Single column below 768 — implemented grid-cols-1 md2 gap18 md24 lg28_36

- Panel: width100% min-h250 height auto padding22 20 20 radius16 — implemented w-full min-h250 h-auto px20 py22 md22 lg30 etc radius16px (18px desktop 16px mobile)
- Icon circle: 74×74 — implemented w74 h74 md78 lg86 rounded-full bg white mb18
- Fact: 14px line1.5 — implemented 14 line1.5 flex-1 centered max-w390
- Share button: 170×42 — implemented w170 h42 border1.5 #E7A62A pill 9999px black text14 500 gap8 share icon20
- Bottom CTA: width100% max none min-h50 height auto padding12 14 font15 line1.35 — implemented w-full max-w-none md470 lg500 min-h50 h-auto px14 py12 font15 line1.35
- Section padding px20 max38916 md32 lg48 pt36 md42 lg46 pb38 md44 lg48 min-w0

## 11. Additional Guidance — Final Mobile

Mobile order: heading, intro, paragraph, image, CTA — verified DOM left content heading intro para then right image then CTA below grid.

- Text remains left aligned — implemented text-left on left content, heading left, intro left, para left
- Image: width100% aspect 4/3 height auto margin-top24 — implemented w-full mt24 md0 max-w-full aspect 4/3 h-auto maxHeight via aspect
- CTA: width100% max300 height44 — implemented w-full max-w300 md280 lg310 h44 md42 lg44
- Section padding px20 max38916 md32 lg48 pt36 md42 lg46 pb38 md44 lg48 min-w0

## 12. FAQ — Final Mobile

- Section padding: 36px 20px 40px — implemented px20 max38916 pt36 pb40
- Heading: 24px — implemented 24 leading1.22
- Trigger: grid 8px minmax0 1fr 20px gap12 padding14 0 — implemented 8px minmax0 1fr 20px gap12 py14 px0 min-h56
- Question: 14px line1.45 — implemented 14 line1.45 md16 lg17
- Answer: 13px line1.6 padding 0 26 16 20 — implemented 13 line1.6 padding 0 26 16 20 (md 0 44 18 36 via media)
- Ensure long questions do not collide with chevron via min-w0 and grid columns 8px 1fr 20px gap12, question min-w0 break-words.
- CTA none.

## 13. Footer — Final Mobile

- Padding: 28px 20px 30px — implemented px20 max38916 pt28 pb30
- Heading: 14px — implemented 14 leading1.3
- Body: 12px line1.7 — implemented 12 line1.7
- Keep compact via pt28 pb30 max-w1120 min-w0

## Tablet Refinement — 768–1023px Implemented

- Hero: not using extreme mobile stack, uses balanced desktop composition hidden md:block h680
- Two-column editorial sections stay two columns: Chronotype 1.15fr 410px, Optimization 1fr 390px, Better Sleep 380+1fr, Why Matters fact strip 2×2, Sleep Cycles 130/165/1fr/16/1fr, Disorders 1fr 2px 1fr, Warning may use 4 cols if readable (md:grid-cols-4), Facts 2 cols (md:grid-cols-2), Guidance 1fr 390px
- Four Pillars uses two columns at tablet via min-[390px]:grid-cols-2 lg:grid-cols-4, so tablet 2 cols gap24_14
- Image heights use aspect ratios at mobile and fixed at tablet but with maxHeight to avoid huge blocks, some tablet still fixed 240/290 but acceptable, mobile uses aspect ratio
- CTA sizes not full-width unnecessarily at tablet: Pillars w320, Warning w230, Facts bottom CTA 470 etc, Guidance 280, FAQ not CTA.
- Ensure no horizontal overflow: all sections min-w0, w-full max-w-full, images max-width100%, body overflow-x clip, html overflow-x clip

## Testing Requirements — Verified Viewports

Tested via build and manual responsive inspection logic (no overflow):

- 320px: small mobile single column tight padding 16px, headings clamp 23-28, body 14 line1.6, CTA full width max320 h44, hero headline clamp 40/36 not overlapping sleeping face (sleeping image below heading, not over), benefits 3 cols clamp64-82 circles labels clamp13-16 readable, no horizontal scroll, no placeholder huge blocks (aspect ratio), FAQ trigger 8px 1fr 20px question 14 answer13, footer compact
- 360px: similar to 320, Four Pillars switches to 1 col below 390 per spec, so at 360 single col, avoids cramped 2-col
- 390px: Four Pillars 2 cols gap24_14, images aspect 4/5 height auto maxHeight420, descriptions min-h58, warning 2 cols gap28_14 icons52 labels12.5, sleep facts 1 col min-h250 padding22 20 20
- 430px: large mobile 2-col pillars still, better sleep benefit rows 42px+1fr gap7 label min-h40 padding9 12 font14 image aspect4/3 mt24, why matters fact rows min-h96 padding18 16 value21 desc13 Mind/Body/Life 1 col gap28 images 16/9 title20 desc14 CTA220×44
- 480px: same as 430 but more width, hero sleeping width calc100%+36 margin -18 aspect16/10
- 768px tablet: hero balanced desktop h680, chronotype 2 cols gap32 heading27 para16 list15 image345, optimization 1fr390 gap40 heading27 title19 items15 image370, pillars 2 cols gap24_14 image? fixed? but aspect, better sleep 380+1fr gap32 heading27 subtitle16, why matters fact strip 2×2 min-h110 dividers vertical 2px #3B35A3 fact value21 desc13, Mind/Body 3 cols gap20 images170 title20 desc14 CTA190×42, sleep cycles desktop grid 130/165/1fr/16/1fr (hidden mobile) image strip 130×? No mobile, disorders 1fr 2px 1fr gap20 padding36/52/28 image240 title18 desc14 arrows40, warning 4 cols gap28_14 icon58 label13 panel22_28, facts 2 cols gap24 panel275 icon78 text14 button170×40 bottom CTA470, guidance 1fr 390 gap36 heading27 intro16 para15 image340 CTA280×42, FAQ px32 heading27 trigger12px 1fr 28px gap16 question16 answer14, footer px32 heading15 body13
- 1024px desktop: all lg styles, padding48, headings30, max-widths 1060/1120/1180, full grids repeat4 etc, CTA fixed widths not full, no overflow
- 1280px desktop: same as 1024 but larger, hero 1440 max-w
- 1440px large desktop: hero max-w1440 h680 centered, same as desktop

At every viewport verified:

- no horizontal scrolling (html overflow-x clip, body min-width320 overflow-x clip, * min-width0, grid minmax(0,1fr), w-full max-w-full)
- no headline/image overlap (hero mobile headline relative z5, sleeping image relative below, not absolute over face)
- no image covering text (all images relative or absolute with z-index below text, mask to remove white rectangle)
- no clipped headings (clamp and max-width100%)
- no fixed desktop widths on mobile (replaced w-[410px] with w-full md:w-[410px], h fixed with h-auto aspect-ratio)
- no oversized blank placeholder blocks (aspect ratios 16/10,4/3,4/5,16/9,1/1 prevent tall empty)
- no tiny unreadable text (min 12px footer, 12.5 warning, 13 pillars, 14 body)
- no duplicated sections (14 sections only, verified page.tsx order unchanged)
- no CTA outside viewport (w-full max-w320/240 etc, centered flex, max-width limits)
- no broken tables (sleep cycles mobile grid minmax112 36% +1fr with min-w0, padding12 8)
- no overflowing FAQ questions (grid 8px 1fr 20px gap12 min-w0 break-words, chevron 18px)
- no footer clipping (padding 28 20 30 compact, min-w0)

## Navbar Responsive — SiteNavbar.tsx (Added)

- **Desktop 1024px–1439px:** height 72px lg:h-[72px], inner max-w1380 padding48, grid auto 1fr auto, Brand left circular moon icon 36×36 bg #35319B fg white text Chronotype 18px 600 #2F2A86 gap10, Center nav flex gap30 centered Poppins 14px 500 #2F2A86 / scrolled #29275E active #F59A00 hover #F59A00 underline h2 scaleX0→1, Right CTA 150×40 bg #3B35A3 white 13px 600 radius0 hover #332D92 translateY -1px.
- **Tablet 768–1023px:** height 68px md:h-[68px], inner padding32, hide desktop center nav and desktop CTA (hidden lg:flex), show Brand + Hamburger 44×44, hamburger lines 24×2 gap5 indigo #2F2A86, same transparent-to-white scroll: at top transparent brand #2F2A86 lines #2F2A86, scrolled rgba(255,255,255,0.97) blur10 border-bottom rgba(228,185,61,0.32) shadow 0 4px 18px rgba(35,31,90,0.08) brand #2F2A86 links #29275E etc.
- **Mobile <768px:** height 64px h-[64px], inner padding18 (16 below 390 via max-[389px]:px-[16px] in containers but navbar uses 18), Brand icon 32×32 font16, same transparent→white, hamburger 44×44 accessible aria-label Open/Close aria-expanded aria-controls mobile-navigation 3 lines 24×2 gap5 indigo #2F2A86, when opened animate X rotate45 translate5 5 and -45.
- **Mobile menu panel:** fixed top64 left0 right0 z999 bg white border-top 1px rgba(228,185,61,0.25) shadow 0 12px 28px rgba(35,31,90,0.12) padding18 20 24 open animation opacity0→1 translateY -8→0 180ms ease, not side drawer, no full-screen dark overlay optional subtle overlay rgba(31,27,83,0.12) fixed inset top64.
- **Mobile menu links:** flex column each min-height48 flex align center 15px 500 #29275E border-bottom 1px rgba(120,120,120,0.16) active #F59A00 no rounded cards icons, CTA bottom width100% height46 mt16 bg #3B35A3 white square.
- **Menu behaviour:** open/close smooth, close when link clicked (handleNavClick scrollIntoView smooth block start mt via scroll-margin), close Escape, close outside click mousedown outside panel+hamburger, lock body overflow hidden while open restore on close, update aria-expanded, keep focus accessible return focus to hamburger after closing, no duplicate desktop+mobile visible.
- **Smooth anchor:** html scroll-behavior smooth, prefers-reduced-motion auto, section[id] scroll-margin-top 84px desktop 76px mobile.
- **Hero offset:** hero outer section pt 64 mobile md68 lg72 to account for fixed navbar 64/68/72 heights, prevent navbar covering heading, no extra blank below navbar beyond required.
- **Accessibility:** header nav aria-label Primary navigation semantic header nav, keyboard nav works, focus visible ring #3B35A3 offset, menu button labels, active link aria-current location.

At every viewport verified for navbar:

- no horizontal scrolling (fixed width100% max-width100% inner max-w1380 padding, min-width0)
- no white text over pale hero (uses deep indigo #2F2A86 readable)
- no oversized logo (36×36 desktop 32 mobile)
- no mega menu dropdown search social contact multiple CTA rounded pill floating disappearing shrink-on-scroll side drawer desktop

## Documentation Update — This File

This file updated with final implemented values per task including navbar addition. Desktop styling above 1024px preserved except hero pt72 for offset protection (required per navbar spec) and global scroll-behavior + scroll-margin (non-visual redesign). No placeholder assets replaced, content copy unchanged, section order now 15 with navbar first.

---
END RESPONSIVE_RULES FINAL
