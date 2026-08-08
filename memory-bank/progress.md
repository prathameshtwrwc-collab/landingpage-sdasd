# Progress

## Project

Sleep Wellness & Chronotype Intelligence Platform

Owner: WelcomeCure HealthTech

---

# Project Status

Status: Active Development

Phase: Feature Completion & Stabilization — Superadmin Dashboard, RLS Fixes

Last Updated: 2026-07-24

---

# Completed Milestones

## Business Architecture

Completed

- Defined platform vision
- Defined business model
- Defined user hierarchy
- Defined organization structure
- Defined member acquisition model
- Defined referral model

---

## User Experience Architecture

Completed

- Defined member journey
- Defined organization journey
- Defined admin journey
- Defined super admin journey
- Defined assessment flow
- Defined report flow

---

## Platform Architecture

Completed

- Defined multi-tenant architecture
- Defined organization mapping strategy
- Defined permission strategy
- Defined reporting strategy
- Defined analytics strategy

---

## Technology Decisions

Completed

- Selected Next.js 16.2.6, TypeScript, Tailwind CSS v4
- Selected Clerk v7 Authentication
- Selected Supabase PostgreSQL
- Selected Vercel Deployment

---

## Memory Bank

Completed

- Created Memory Bank structure with 17 documentation files

---

## Backend Implementation

Completed

- Supabase schema (3 SQL files — enums, tables/indexes/RLS, seed data)
- Supabase server/client/query utilities
- Scoring engine (lark/eagle/owl with confidence calculation)
- Server actions (assessment submission, member creation)
- API routes (admin-portal, admin, member, auth, webhooks)
- 15 reusable Supabase query helpers

---

## Authentication & Login

Completed

- Clerk v7 integration with AuthProvider context
- Three-role system: member, organization_admin, superadmin
- Custom login pages with decorative UI
- localStorage session persistence for members
- Clerk sign-in for org-admins and superadmins
- Role mapping (clerk metadata "admin" → "organization_admin")
- Post-sign-in redirect (window.location.href with setTimeout fallback)
- login() force re-render via sessionNonce state
- bfcache back-button protection via pageshow listener

---

## Middleware & Route Protection

Completed

- Middleware moved from root to src/middleware.ts
- Public routes configured: /, /login(.*), /dashboard(.*), /api/member(.*), etc.
- signInUrl set to /login
- Role checks removed from middleware (delegated to page components)
- Protected routes: /admin(.*), /superadmin(.*)

---

## Org-Admin Dashboard

Completed

- Dashboard stat cards: Total Members, Assessments, Avg Confidence, Org Link Status
- Assessment Activity 7-day chart (MiniLine)
- Chronotype Distribution (3x Ring charts)
- Org Link detail card (status, unique code, share URL)
- Quick Overview (not started, in progress, completed)
- Participants list with Source column
- Team page scoped to org's own admins
- Share Link page with org's own unique code

---

## Superadmin Dashboard

Completed

- Platform overview stat cards + system overview panel
- Organizations table with clickable names → org detail page
- Create organization with alphanumeric code (AB0001 format)
- Org detail page: org info, admins list, members table with chronotype/age/gender
- Users page: admins list + all members section with search/filter
- Settings page: functional with localStorage persistence
- System page: service status + environment info
- Audit log placeholder with search
- Toggle org link active/paused (reads from organization_links table)
- Add admin with Clerk user creation (email + password via clerkClient())

---

## Bug Fixes Applied

Completed

- middleware.ts location wrong (root → src/)
- Login redirect loop (role checks removed from middleware)
- White screen flash (Clerk setActive redirect handled via login page auto-redirect)
- Org name always "Organization" (Supabase join single-object vs array fix)
- Team page showing all orgs (scoped to org_id)
- Share link showing wrong code (changed to /api/admin-portal)
- Member login 401 (added /api/member to public routes)
- AuthProvider stale context (sessionNonce force re-render)
- Back-button after logout (pageshow handler)
- "admin" role vs "organization_admin" internal role (login() maps correctly)
- Member dashboard "Please log in" after fresh login (sessionNonce)
- Superadmin API 500 — Replaced Clerk metadata role check with direct auth()
- Server Actions async constraint — Moved helpers out of "use server" file
- RLS violations — Disabled RLS on organizations, organization_admins, organization_links
- Org link toggle not reflecting — Query reads link_active from organization_links table

---

- End-to-end testing of all auth flows
- Member dashboard subpage data wiring
- Reports/analytics with real data

---

# Upcoming Milestones

## Infrastructure

- Supabase Project Creation (production)
- Database Schema Implementation (migrations)
- Storage Configuration
- Environment Configuration

## Assessment Module (further)

- Assessment Versioning
- Answer Storage (partial — server actions exist)
- Report Generation (PDF)

## Reporting Module

- PDF Generation
- Report Storage
- Report Download
- Historical Reports

## Referral Module

- Referral Analytics
- Referral Tracking Dashboard

## Analytics Module

- Member Analytics
- Organization Analytics
- Platform Analytics
- Research Analytics

## Future Roadmap

- Sleep Disorder Screening
- Doctor Portal
- Counsellor Portal
- Branch Support
- Multi-language Support
- Mobile Applications
- AI Recommendations
- Research Platform Expansion
- Corporate Wellness Expansion

---

# Known Constraints

- UI must remain unchanged (approved design preserved)
- Approved dashboard layouts must be preserved
- Assessment history must be retained
- Organization isolation must be enforced
- Role permissions must be enforced
- Referral users must not inherit organization membership
- Assessment should remain accessible before login
- Webhook (CLERK_WEBHOOK_SECRET) not configured — clerk_user_id linking via email fallback
- /api/member endpoint is email-based with no auth — potential data exposure risk

---

# Change Log

2026-08-08 — Chronotype Gallery Everywhere, PDF Report Polish, Phase-1 Performance

- Chronotype photos now appear as a one-by-one numbered gallery on: shared result page (`/r/[assessmentId]`), post-assessment result screen, and the member dashboard home — placed right after the wake/focus/bedtime strip, full-width images, lazy-loaded
- SVG chronotype illustrations (Lark/Eagle/Owl) restored in result heroes (were replaced by the first photo)
- PDF report embeds the chronotype hero photo + all photos on numbered gallery pages (3 per page); "Your personalised daily guidance" moved to the last page; premium redesign (accent bars, eyebrows, tinted panels, framed hero image, sign-off, dynamic footer page count)
- New `src/lib/chronotype-image.ts` helper (per-chronotype file list + base64 data-URI loader with canvas downscale for PDF embedding)
- Performance (Phase 1): `AssessmentModal`/`ConsultModal` lazy-loaded via `next/dynamic` (`LazyAssessmentModal`, `LazyConsultModal`); `@react-pdf/renderer` deferred to click-time; `client-cache` gained `revalidate`/`ttlMs` + `clearCache()` after assessment + revalidate on post-mutation reloads; Cache-Control on all GET API routes; ISR on shared result page (`revalidate=300`); module-scope `preload()` on superadmin pages
- Fixed `/api/admin-audit` + `/api/member-detail` to query real production `activity_logs`/`login_audit` columns and map to display shapes
- Docs added: `docs/PRODUCTION_GO_LIVE.md` (go-live gate) and `docs/FRESH_SETUP_SUPABASE_CLERK.md` (new Supabase + Clerk setup)

2026-08-07 — Retake Flow, Premium Loader, Auto-Login, Form Fields, View Result Icon

- Member retake flow: "Take Test Again" skips the details form (new `retestLoading` state); incomplete STARTED tests offer Resume / Start Over with saved answers, otherwise jumps straight into a fresh questionnaire
- Premium analyzing loader: circadian-orbit animation (framer-motion) with orbiting satellites, conic core, cycling status messages, shimmer progress bar
- Dashboard card order: Consult a Sleep Specialist now appears before the Donate card
- Assessment form: "Salaried" added to occupation dropdown; Pincode accepts alphabets (numeric-only validation removed)
- First-time auto-login: result screen "Go to my Dashboard" logs the member in and opens /dashboard directly; later access via login page
- View Result icon on member reports (dashboard + progress) linking to /r/[assessmentId]; /api/member enrichment reads assessment_id from reports table with fallbacks
- Floating Take Test button fixed on org-code (white-label) pages (hero mounts after loading state)
- GitHub pushes: 2.11.9 → 2.11.13

2026-08-04 — Real Assessment Data End-to-End, PDF & Result Screen Fixes, Member Info Panel

- Result screens (assessment modal, shared /r page, energy timeline) now use the member's **real** assessment answers for wake/bedtime/peak focus instead of static chronotype templates; `submitAssessment`, `/api/member`, and `fetchPublicResult` all return a `schedule`
- Fixed Supabase embed shape bug — to-one joins (`questions`/`question_options`) come back as objects, not arrays; schedule readers now handle both (was silently falling back to dummy data)
- Energy timeline "Peak energy" shows the member's real Q3 range (e.g. "10:00 AM – 5:00 PM")
- PDF report: removed daily-rhythm timeline; schedule values cleaned into concise ranges; assessment date now the real `generated_at` (was always the download date); dashboard/progress PDF buttons pass the schedule
- Result screen schedule cards: cleaned values + smaller wrapping font (was truncating to "10AM.....")
- Superadmin Users → All Members → View Info: added latest-assessment summary (chronotype, total/confidence, L/E/O, date) via batched `getAllMembers` query, plus the full last-assessment Q&A (question + selected option + scores) via `/api/member-detail`; `InfoModal` gained an `answers` section
- GitHub pushes: 2.11.1 → 2.11.8 (real schedule, embed-shape fix, peak energy range, PDF schedule/date/daily-rhythm, card sizing, member info panel summary + Q&A)

2026-08-04 — Consult-Patient Feature, Schema Sync, Recommendations CTA & Z-Index Fix

- Consult leads page: Location column replaced with a **Consult this patient** button → `ConsultPatientModal` (Consulted by prefilled with logged-in admin + Consult Notes); saves `consulted_by`/`consult_notes`/`consulted_at`, marks lead CONTACTED
- Consulted leads show a green badge + **view-consultation-info** Eye icon (InfoModal: consulted by/at/notes) + Update button; lead-detail modal redesigned (avatar, status/consulted badges, two-column grid, consultation-info panel, View/Update buttons)
- **z-index fix**: `ConfirmDialog`/`InfoModal`/`BusyOverlay`/`ConsultPatientModal` raised to `z-10000` so they appear above page-level modals (`z-9999`) — consult modal was rendering behind the lead-detail modal
- Member recommendations page: removed dummy cards; "The specialists will consult you shortly" + **Schedule Consultation** button opens the ConsultModal prefilled with the member's data (`toPrefill` maps `location`→state, age→range, etc.)
- `supabase/schema2.sql` synced to the live production schema (members `location`/age int/phone NOT NULL/preferences_json; activity_logs `action`/`user_id`/`details_json`; login_audit `login_at`/`user_type`; consultation_leads consult columns; all tables corrected)
- `/api/admin-audit` + `/api/member-detail` fixed to query real production `activity_logs`/`login_audit` columns and map to display shapes (were querying non-existent columns → 500)
- `supabase/migration_consultation_leads.sql` now includes the consult columns (idempotent ALTER); `migration_consult_patient.sql` for existing DBs
- Chronotype carousel redesigned (visible prev/next on all screens, bottom control pill with dots + play/pause, PAUSED badge); peak-time cards removed; lightbox pause button repositioned on-screen
- Global mobile `button { min-height: 48px }` scoped to `section` (was stretching carousel dots into vertical bars)

2026-08-04 — Superadmin UX, InfoModal Scroll Fix & API Performance

- Reusable dialogs added: `ConfirmDialog`, `InfoModal`, `BusyOverlay` (`src/components/dialogs/`)
- All superadmin delete/remove actions (users, organizations, org detail, consultations, assessments) now use a functional confirm popup instead of native `confirm()`
- Users page rows gained a view-info (`Eye`) button opening an InfoModal with full member/admin data; State reads `members.location` (production has no `state` column), fallback `state`
- Assessment builder shows a busy overlay + button spinners for publish / save-draft / edit; delete uses confirm dialog
- Admin & superadmin sidebar icons replaced with distinctive lucide icons
- `/api/admin-assessments` GET batched (was N+1 per version/question); `getPlatformStats` uses exact-count queries; Cache-Control on `/api/admin`, `/api/admin-portal`, `/api/admin-assessments`; users/analytics pages use `cachedFetch`
- InfoModal scroll lock fixed: root cause was Lenis smooth-scroll hijacking wheel events — stop Lenis while open, `data-lenis-prevent` + `overscrollBehavior: contain` + `minHeight: 0` on panel, capture-phase wheel/touch guard. Pattern documented in `systemPatterns.md`
- `useLockBodyScroll` locks `<html>` AND `<body>` (body-only was ineffective because `html { overflow-x: hidden }` makes `<html>` the scroll container)

2026-08-04 — Login Logo Size, Back-to-Home, Mobile Duplication Fix

- Logo enlarged + responsive across navbar and login pages (clamp-based sizing)
- Back-to-Home icon button with label added to right panel of /login and /superadmin/login
- Removed duplicate mobile brand blocks (logo shown once, from the login card)

2026-08-03 — Energy Bar Graph, Carousel Controls, Member Panel & Result Routing

- Energy page: replaced synthetic energy curve with bar graph of real lark/eagle/owl scores from latest assessment; all card wrappers removed, only visualization remains
- New ScoreBars chart component (value labels, gridlines, winner highlight)
- Chronotype carousel: auto-slide now 7 seconds; functional pause/play button in desktop fullscreen lightbox
- Member info panel: phone number shown; State reads `location` column (with `state` fallback)
- /api/member-detail: batched answer queries + parallelized independent table queries (faster load)
- Member info panel scroll lock: pauses Lenis, robust body lock, native wheel/touch guard
- Result screen "Go to my Dashboard" now redirects to /login

2026-07-29 — PDF Report Redesign & Donate Modal Image

- PDF report completely redesigned: 2-page minimal healthcare A4 template
- Page 1: header, metadata, chronotype hero, schedule metrics, strengths/watch-outs, next steps, daily rhythm panel
- Page 2: compact header, 3×2 recommendation grid, important notice
- All score sections removed (bars, circles, profile, radar)
- Recognisable Lark/Eagle/Owl SVG illustrations without frames
- Poppins font detection via `getPoppinsFontName()` — resolves next/font hashed name
- Geometry validation with overlap detection and alignment checks
- QA test suite (scripts/pdf-qa-test.mjs) generates PDFs + PNGs via Puppeteer
- Donate modal visual panel updated with `/assets/donate modal/donatepic.png`

2026-07-24 — Superadmin Dashboard, RLS Fixes, Admin Creation

- Superadmin dashboard fully functional (orgs, users, settings, system pages)
- Org detail page with members table, chronotype, age, gender
- Users page with all members section + search
- Organization codes now alphanumeric (AB0001 format)
- RLS disabled on organizations, organization_admins, organization_links
- createAdminClient() with service role key fallback for server-side writes
- Add Admin form includes Set Password → creates Clerk user via API
- Org link toggle reads from organization_links table (link_active field)
- Org code URL routing (app/[orgCode]/page.tsx) with deactivated link error page
- Assessment age input: manual 1-100, no spinners, parsed to int
- Assessment org code auto-detection from URL path + referral from query
- API route auth: direct auth() check instead of Clerk metadata role check
- Server Actions async constraint: moved sync helpers to separate util file
- Middleware: protected prefix whitelist instead of org code regex

2026-07-23 — Auth & Dashboard Bug Fixing

- Middleware relocated to src/middleware.ts
- All public route patterns configured
- Login redirect loop eliminated
- Org name correctly displays from database
- Org-admin team scoped to own organization
- Org-admin share-link shows own unique code
- Member login flow fixed (401 → /api/member public)
- AuthProvider re-render on login (sessionNonce)
- bfcache back-button protection (pageshow listener)
