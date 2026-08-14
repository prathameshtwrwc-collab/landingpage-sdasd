# 05 — UI/UX Specification

**SDASD Sleep Chronotype & Wellness Platform**  
**Version:** 1.0  
**Date:** 2026-08-14  
**Basis:** Live codebase + DESIGN_SYSTEM.md

---

## 1. Visual Style

### Design Philosophy
- **Healthcare awareness campaign** — NOT a SaaS dashboard
- Approachable, optimistic, reassuring, clinical but warm
- Brochure-inspired editorial layout: white page, thin warm-gold section separators, flat rectangular CTAs, square corners
- Image-led communication with strong visual hierarchy

### Typography
- **Font family:** Poppins only (`next/font/google`, weights 400, 500, 600, 700)
- **Weights:**
  - 400 — body text
  - 500 — medium (intro sentences, subtitle support)
  - 600 — semibold headings, CTAs, labels
  - 700 — bold hero orange, benefit labels

### Typography Scale (Landing Page)

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Hero orange heading | 58px, weight 700 | 56px | 38-50px |
| Hero indigo heading | 58px, weight 600 | 56px | 38-50px |
| Section heading (orange H2) | 30px, weight 600 | 27px | 24px |
| Section supporting heading | 18px, weight 500 | 17px | 16px |
| Body | 14-16px, weight 400 | 14-15px | 12-15px |
| CTA button | 13-15px, weight 600 | 14px | 13-14px |
| FAQ question | 17px, weight 600 | 16px | 14px |
| FAQ answer | 14px, weight 400 | 14px | 13px |

### Typography Scale (Dashboards)

| Element | Size | Weight |
|---------|------|--------|
| Dashboard hero title | 24-28px | 700 |
| Card title | 16px | 700 |
| Card body | 12-13px | 400 |
| Stat card value | 28px | 700 |
| Stat card label | 11-12px | 500-600 |
| Button | 12-15px | 600 |
| Table header | 10-11px | 600 |
| Table cell | 12-13px | 400-500 |

---

## 2. Color Palette

### Primary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Orange Primary | `#F59A00` | Section headings, highlights |
| Orange Bright | `#FF9700` | Benefit labels, hero CTAs |
| Orange Hero | `#FF6500` | Hero headline (line 1-2) |
| Indigo Primary | `#3B35A3` | Primary flat CTAs, disorder titles |
| Indigo Heading | `#35319B` | Hero indigo lines, dashboard accents |
| Indigo Dark | `#383477` | Conclusion strips, statement strip |
| Indigo Strip | `#353080` | HeroStatementStrip background |
| Yellow Highlight | `#F4C623` / `#FFD21A` | Highlights, NOW in CTAs |
| Gold Divider | `#E4B93D` | Section borders |
| Text Primary | `#171717` | Body text, headings on white |
| Text Secondary | `#444444` | FAQ answers |
| White | `#FFFFFF` | Main background |
| Black | `#000000` | Disclaimer footer |

### Dashboard Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Purple | `#35319B` | Dashboard accents, buttons, active states |
| Primary Gradient | `linear-gradient(135deg, #35319B, #5A55C0)` | Primary buttons |
| Success Green | `#2E7D32` | Active status, success messages |
| Error Red | `#D32F2F` | Error messages, destructive actions |
| Warning Orange | `#F59A00` | Warning states, trend indicators |
| Background Grey | `#F0F0F0` / `#F5F5F5` | Input backgrounds, placeholders |
| Border Grey | `#D5D5D5` / `#E8E8E8` | Input borders, card borders |
| Text Grey | `#888` / `#AAA` | Secondary text, placeholders |
| Card Shadow | `0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)` | Dashboard cards |

### Color Usage Rules
- Orange on white headings at 30px+ bold: passes for large text (requires 3:1)
- Indigo `#3B35A3` on white: 7.3:1 contrast (passes AA)
- White on black footer: 21:1 contrast (passes AAA)

---

## 3. Layout System

### Landing Page
- Full-width sections with `border-bottom: 1px solid rgba(228,185,61,0.72)`
- Inner containers: max-width 980px–1440px depending on section
- Desktop padding: `lg:px-[48px]`
- Tablet padding: `md:px-[32px]` to `md:px-[36px]`
- Mobile padding: `px-[18px]` to `px-[20px]`
- Section vertical spacing: desktop pt 42-48px, pb 40-52px; mobile pt 28-38px, pb 30-40px

### Dashboards
- Container: `max-w-[1440px]` with responsive padding
- Grid layouts: `grid-cols-1 lg:grid-cols-3` with `gap-[16px] md:gap-[20px]`
- Cards: `rounded-[16px]` with shadow
- Hero cards: `rounded-[20px]` with gradient backgrounds

---

## 4. Buttons

### Primary CTA (Landing Page)
- Background: `#3B35A3` (indigo)
- Text: white, 13-15px, weight 600
- Shape: square corners (`rounded-none`), no shadow
- Height: 38-48px depending on context
- Hover: background darkens, `translateY(-1px)`
- Focus: `3px solid rgba(59,53,163,0.28) offset 3px`

### Primary CTA (Dashboards)
- Background: `linear-gradient(135deg, #35319B, #5A55C0)`
- Text: white, 12-15px, weight 600
- Shape: `rounded-[10px]` to `rounded-[12px]`
- Shadow: `0 4px 16px rgba(53,49,155,0.25)`
- Hover: gradient darkens, `translateY(-1px)`

### Secondary/Outline Buttons (Dashboards)
- Background: `rgba(53,49,155,0.06)` or white
- Border: `1px solid rgba(25,22,79,0.12)`
- Text: `#35319B` or `#171717`
- Shape: `rounded-[8px]` to `rounded-[10px]`
- Hover: background darkens slightly

### Destructive Actions
- Red gradient: `linear-gradient(135deg, #D32F2F, #FF6B6B)`
- Text: white
- Shadow: `0 4px 12px rgba(211,47,47,0.25)`

---

## 5. Cards & Panels

### Landing Page
- No card backgrounds or shadows (per design system)
- Flat rectangular sections with gold dividers
- Exception: Sleep Facts panels use `background: #F0EFF9` with `border-radius: 18px`

### Dashboards
- Cards: white background, `rounded-[16px]`, shadow `0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)`
- Padding: `p-[22px] md:p-[28px]`
- Hero cards: gradient backgrounds with decorative icons

---

## 6. Forms

### Input Fields (Landing Page / Assessment)
- Border: `1.5px solid #D5D5D5`
- Background: white
- Border-radius: `8px` to `10px`
- Padding: `px-[13px] py-[10px]`
- Font: Poppins, 14px
- Focus: `outline: 2px solid #3B35A3`, `border-color: transparent`
- Error state: red border + error message below

### Input Fields (Dashboards)
- Similar styling with dashboard-specific colors
- Readonly fields: `background: #F8F8F8`, `color: #888`
- Select fields: same border styling with dropdown arrow

---

## 7. Navigation

### Landing Page Navbar (SiteNavbar)
- Fixed top, height 72px desktop / 68px tablet / 64px mobile
- Transparent at top → white with shadow on scroll
- Left: Brand icon + "Chronotype" text
- Center: Nav links (Sleep Science, Chronotypes, Sleep Benefits, Sleep Disorders, FAQ)
- Right: "Take Test Now" CTA button
- Mobile: Hamburger menu with slide-down panel

### Dashboard Navigation
- `DashboardShell` component wraps all dashboard pages
- Top bar with logo/brand, navigation links based on role
- Responsive: collapses to hamburger on mobile

---

## 8. Dashboard Layout

### Member Dashboard (`/dashboard`)
- Hero card with random gradient background, decorative Moon/Sparkles icons
- Chronotype display with score, confidence, assessment count
- Quick actions row: Referral, Download Report, Share Result, Consult, Donate
- Chronotype Gallery section (if result exists)
- Reports list with pagination
- Consult a Specialist card
- Donate card

### Admin Dashboard (`/admin/dashboard`)
- Hero with gradient background
- 4 stat cards: Total Members, Assessments, Avg Confidence, Org Link
- 2 charts: Assessment Activity (line), Chronotype Distribution (ring)
- Organization Link detail card
- Quick Overview card (Not Started, In Progress, Completed)

### Super Admin Dashboard (`/superadmin/dashboard`)
- Hero with gradient background
- 4 KPI cards: Organizations, Total Members, Assessments, Admins
- 4 Quick Link cards: Organizations, Users, Reports, Settings
- 2 charts: Chronotype Distribution (bar), Platform Health (ring)
- Member Source Distribution (horizontal bars)
- Latest Organizations list
- Admins sidebar
- Latest Members sidebar
- At a Glance metrics

---

## 9. Assessment UI

### Assessment Modal
- Full-screen overlay with centered modal
- Max-width: 600px (form/questions), 1480px (result view)
- Border-radius: 16px (form), 22px (result)
- Progress bar at top (gradient: `linear-gradient(90deg, #35319B, #7B76D4)`)
- Step dots showing answered/current/upcoming questions
- Category badge with color coding
- Question text: 18px, weight 600
- Options: rectangular cards with hover/selected states
- Selected option: purple border + light purple gradient background
- Terms modal: centered overlay with terms text

### Assessment Result View
- Full-width result display within modal
- Chronotype hero with illustration
- Schedule row (wake time, focus window, bedtime)
- Strengths and Watch-outs panels
- Next Steps section
- Action cards (Download PDF, Share, Consult, Retake)

---

## 10. Result UI

### Member Dashboard Result
- Chronotype label with color coding
- Sleep Score: large number
- Confidence: percentage
- Assessments: count
- Chronotype Gallery: visual journey with numbered images

### Public Result Page (`/r/[assessmentId]`)
- Standalone page with light background (`#F4F5FB`)
- SharedResultCard component
- SEO metadata with Open Graph tags

---

## 11. PDF/Report UI

### PDF Report Structure
- A4 pages, multi-page document
- Header: Brand mark + organization name (if applicable)
- Metadata: Prepared for, Assessment date, Report ID
- Hero: Chronotype name, subtitle, description, peak focus
- Schedule: Ideal wake time, best focus window, ideal bedtime
- Strengths/Watch-outs: Two-column layout
- Next Steps: 3-step numbered cards
- Gallery pages: One image per page
- Recommendations: 2-column grid, up to 6 items
- Footer: Disclaimer + report ID + page number

### PDF Styling
- Colors match web palette
- Typography: Poppins (embedded in PDF)
- Accent colors per chronotype: Lark = warm orange, Eagle = indigo, Owl = purple

---

## 12. Animations & Motion

### Landing Page
- Smooth scroll: `html { scroll-behavior: smooth }`
- Section scroll-margin-top: 84px desktop, 76px mobile
- Intersection Observer for active nav link highlighting
- No parallax, no floating cards, no glassmorphism

### Dashboards
- Card hover: `translateY(-1px)` to `translateY(-2px)`
- Button hover: gradient darkens + slight lift
- Loading states: skeleton screens with pulse animation
- Framer Motion used for assessment modal transitions

### Assessment Modal
- Question transitions: fade + slide (180ms)
- Step dots: elastic scale animation
- Option hover: border color change + subtle lift
- Reduced motion: `prefers-reduced-motion` disables transitions

---

## 13. Responsive Behavior

### Breakpoints
- Mobile: < 768px
- Tablet: 768px – 1023px
- Desktop: ≥ 1024px

### Landing Page
- Mobile: Single column, stacked CTAs, smaller images
- Tablet: 2-column grids where applicable
- Desktop: Full multi-column layouts, larger typography

### Dashboards
- Mobile: Single column cards, stacked layouts
- Tablet: 2-column grids
- Desktop: 3-column grids, side-by-side charts

### Assessment Modal
- Mobile: Full-width, full-height modal (`min-height: 100dvh`)
- Desktop: Centered modal with max-width

---

## 14. Loading, Error, and Empty States

### Loading States
- Skeleton screens for dashboard cards and tables
- Spinner for submission states
- "Loading..." text for initial data fetch
- SkeletonHero, SkeletonStatCard, SkeletonChart, SkeletonTable components

### Error States
- Inline error messages below form fields (red text)
- Error banner at top of dashboard (red background)
- Network error: "Network error: [message]"
- Database error: "Database setup required" with SQL instructions

### Empty States
- Dashed border container with icon
- Centered message: "No data available yet", "No members yet", "Complete your assessment to see your reports here"
- Icon: large, light grey (`stroke="#CCC"`)

---

## 15. Accessibility

### Current Implementation
- Semantic HTML: `nav`, `main`, `header`, `footer`, `section`
- ARIA labels on interactive elements
- `aria-modal`, `aria-labelledby` on modals
- Focus visible outlines
- Keyboard navigation support
- `prefers-reduced-motion` media query respected
- `lang` and `dir` attributes set on HTML element
- Alt text on images (where applicable)

### Known Gaps
- No skip-to-content link
- Modal focus trap not fully verified
- Color contrast for orange headings on white: ~2.1:1 (passes for large bold text ≥ 27px, but fails for smaller text)

---

## 16. UX Improvements (Proposed)

| Priority | Improvement | Rationale |
|----------|-------------|-----------|
| P1 | Skip-to-content link | Improves keyboard navigation |
| P1 | Modal focus trap | Prevents focus escape during assessment |
| P1 | Improved color contrast for orange headings | Current ~2.1:1 fails AA for small text |
| P2 | Loading skeletons for all data states | Some pages show spinner instead of skeleton |
| P2 | Error boundary for client-side errors | Prevents white screen on unexpected errors |
| P2 | Success toasts for actions (copy, share, download) | Currently relies on button text changes |
| P3 | Onboarding tour for first-time users | Helps users discover dashboard features |
| P3 | Keyboard shortcuts for power users | Improves efficiency for frequent users |
| P3 | Dark mode support | Not in current design system |

---

*This specification is based on the current codebase and DESIGN_SYSTEM.md. It reflects the implemented design system only.*
