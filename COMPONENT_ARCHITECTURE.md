# Project Architecture — Sleep Wellness Landing + Auth + Dashboards

Audited: 2026-07-21

## Project Tree

```
C:\Users\prath\OneDrive - MSFT\Desktop\sleepchrono-recreated2
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root HTML + font + metadata
│   │   ├── ClientLayout.tsx          # Client providers (Auth, Assessment, Consult, SmoothScroll)
│   │   ├── page.tsx                  # Landing page (16 sections)
│   │   ├── globals.css               # Tailwind v4 + base styles
│   │   ├── login/
│   │   │   └── page.tsx              # Public login (member + org admin)
│   │   ├── superadmin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Hidden superadmin login (manual URL only)
│   │   │   └── dashboard/
│   │   │       └── page.tsx          # Super admin dashboard
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Member dashboard
│   │   ├── admin/
│   │   │   └── dashboard/
│   │   │       └── page.tsx          # Organization admin dashboard
│   │   ├── unauthorized/
│   │   │   └── page.tsx              # Wrong-role access page
│   │   └── api/
│   │       └── health/route.ts       # Health check endpoint
│   │
│   ├── components/
│   │   ├── navbar/
│   │   │   └── SiteNavbar.tsx        # Responsive navbar + Login button
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx       # Main hero with slider, heading, benefits, CTAs
│   │   │   └── HeroStatementStrip.tsx# Dark indigo statement strip
│   │   ├── chronotype/
│   │   │   └── ChronotypeIntroductionSection.tsx
│   │   ├── optimization/
│   │   │   └── ChronotypeOptimizationSection.tsx
│   │   ├── pillars/
│   │   │   └── DailyEnergyPillarsSection.tsx
│   │   ├── better-sleep/
│   │   │   └── BetterSleepBetterDaysSection.tsx
│   │   ├── why-sleep/
│   │   │   └── WhySleepMattersSection.tsx
│   │   ├── sleep-cycles/
│   │   │   └── UnderstandingSleepCyclesSection.tsx
│   │   ├── sleep-disorders/
│   │   │   └── CommonSleepDisordersSection.tsx
│   │   ├── warning-signs/
│   │   │   └── WarningSignsSection.tsx
│   │   ├── sleep-facts/
│   │   │   └── SleepFactsSharingSection.tsx
│   │   ├── additional-guidance/
│   │   │   └── AdditionalGuidanceSection.tsx
│   │   ├── faq/
│   │   │   └── FaqSection.tsx
│   │   ├── footer/
│   │   │   └── DisclaimerFooter.tsx
│   │   ├── assessment/
│   │   │   ├── AssessmentContext.tsx  # Modal state context
│   │   │   └── AssessmentModal.tsx    # Sleep assessment wizard (registration + 11 questions)
│   │   ├── consult/
│   │   │   ├── ConsultContext.tsx     # Modal state context
│   │   │   └── ConsultModal.tsx       # Consultation scheduling form
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx       # Auth context (login/logout/session)
│   │   │   ├── AuthLayout.tsx         # Auth page shell (brand + card + variants)
│   │   │   └── LoginCard.tsx          # Reusable login form (role toggle, inputs, submit)
│   │   ├── dashboard/
│   │   │   ├── DashboardShell.tsx     # Layout with sidebar + bottom nav per role
│   │   │   ├── StatCard.tsx           # Premium metric card with icon/trend/gradient
│   │   │   └── RoleBadge.tsx          # Color-coded role label pill
│   │   ├── smooth-scroll/
│   │   │   └── SmoothScrollProvider.tsx # Lenis smooth scroll provider + context
│   │   └── FloatingTestButton.tsx     # Floating CTA for assessment
│   │
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── roles.ts              # Role types, constants, labels
│   │   │   ├── session.ts            # localStorage session get/set/clear
│   │   │   └── guards.ts             # requireAuth/requireRole/getAuthRedirect
│   │   └── animations.ts             # Framer motion shared variants
│   │
│   ├── db/
│   │   └── index.ts                  # Drizzle ORM setup (pg)
│   ├── types/
│   │   └── react-google-recaptcha.d.ts # Type declaration for reCAPTCHA
│   └── middleware.ts                 # (placeholder for future server-side guards)
│
├── public/
│   └── assets/
│       ├── hero/                     # Hero images + benefit icons
│       ├── section2/ to section13/   # Section-specific assets
│
├── CHANGELOG.md                      # Full change history
├── COMPONENT_ARCHITECTURE.md         # This file
├── ASSET_MANIFEST.md                 # Image asset inventory
├── DESIGN_SYSTEM.md                  # Design tokens and rules
├── RESPONSIVE_RULES.md               # Responsive breakpoints
├── CONTENT_COPY.md                   # Approved copy
├── AI_DEVELOPER_GUARDRAILS.md        # AI agent rules
├── IMPLEMENTATION_CHECKLIST.md       # Pre/post change checklist
├── FUTURE_PLANS.md                   # Planned features
├── README.md                         # Project overview
├── package.json                      # Dependencies
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind v4 config
├── tsconfig.json                     # TypeScript config
└── postcss.config.mjs                # PostCSS config
```

## Page Load Order (Landing)

```tsx
<main className="min-h-screen w-full bg-white">
  <SiteNavbar />                              // Fixed transparent-to-white navbar
  <HeroSection />                             // Full viewport hero with slider + CTA
  <HeroStatementStrip />                      // Dark indigo statement (#353080)
  <ChronotypeIntroductionSection />           // Discover Your Natural Sleep Rhythm
  <ChronotypeOptimizationSection />           // Every chronotype has unique strengths
  <DailyEnergyPillarsSection />               // Four Pillars of Daily Energy
  <BetterSleepBetterDaysSection />            // Better Sleep Creates Better Days
  <WhySleepMattersSection />                  // Why Sleep Matters + FACT STRIP
  <UnderstandingSleepCyclesSection />         // NREM vs REM comparison
  <CommonSleepDisordersSection />             // 8 Types slider
  <WarningSignsSection />                     // Warning Signs That Need Attention
  <SleepFactsSharingSection />                // Sleep Facts Worth Sharing
  <AdditionalGuidanceSection />               // Need Additional Guidance?
  <FaqSection />                              // FAQ accordion
  <DisclaimerFooter />                        // Black footer with disclaimer
</main>
```

## Route Structure

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page (16 sections) |
| `/login` | Public | Login for member + org admin |
| `/superadmin/login` | Manual URL only | Superadmin login (not linked anywhere) |
| `/dashboard` | Protected (member) | Member sleep dashboard |
| `/admin/dashboard` | Protected (org_admin) | Organization admin dashboard |
| `/superadmin/dashboard` | Protected (superadmin) | Super admin platform overview |
| `/unauthorized` | Public | Wrong-role access denied page |
| `/api/health` | Public | Health check endpoint |

## Provider Stack (ClientLayout)

```
AuthProvider          → useAuth() hook for login/logout/session
  AssessmentProvider  → useAssessment() hook for assessment modal state
    ConsultProvider   → useConsult() hook for consult modal state
      SmoothScrollProvider → Lenis smooth scrolling + useLenis() hook
```

## Role System

| Role | Dashboard Route | Color |
|------|----------------|-------|
| `member` | `/dashboard` | Purple/Orange |
| `organization_admin` | `/admin/dashboard` | Indigo |
| `superadmin` | `/superadmin/dashboard` | Dark Indigo/Red |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 (Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Animations | Framer Motion |
| Smooth Scroll | Lenis v1 |
| Icons | Lucide React |
| Database ORM | Drizzle ORM (PostgreSQL) |
| Forms | Google reCAPTCHA v2 |

## Key Architecture Decisions

1. **Auth**: Context-based mock with `localStorage` — replace with JWT/HttpOnly cookies for production
2. **Client Providers**: All providers in `ClientLayout` — ensures hydration compatibility
3. **Mobile Navigation**: Bottom tab bar (68px) with frosted glass blur, active indicator pill, safe-area padding — native app feel
4. **Desktop Sidebar**: 260px fixed sidebar with role-specific nav, glassmorphism logo section
5. **Landing Sections**: 16 siblings in `<main>`, no nesting — ensures border dividers work correctly
6. **CTA Buttons**: All `<button>` elements with `onClick` handlers — replace with `router.push` or Link for page routes
7. **Images**: Raw `<img>` tags (not Next/Image) to preserve aspect/crop — consider migrating below-fold to `next/image`
