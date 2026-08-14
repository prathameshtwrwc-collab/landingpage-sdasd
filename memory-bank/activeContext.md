# Active Context

## Project Status

Current Project: Sleep Wellness & Chronotype Intelligence Platform

Owner: WelcomeCure HealthTech

Development Status: Active Development — Full Dashboard Integration Complete

---

# Current Objective

Primary Goal: All core auth flows, dashboards, assessments, and admin operations are functional. Proceeding with feature completion and stabilization.

---

# Current Phase

Phase: Feature Completion & Stabilization — Superadmin Dashboard, RLS Fixes, Deployment

---

# Completed

- Supabase schema designed (3 SQL files: enums, tables + indexes + RLS, seed data)
- Supabase server/client/query modules established (+ admin client with service role key fallback)
- Clerk authentication integrated (ClientLayout + AuthProvider + middleware)
- Three-role auth system: member, organization_admin, superadmin
- Custom login pages: /login (member + org admin), /superadmin/login
- Role-based DashboardShell with sidebar nav (desktop) + bottom nav (mobile)
- Org-admin dashboard: stat cards, activity chart, chronotype distribution, org link, quick overview
- Org-admin participants list with Source column
- Org-admin team page scoped to org's own admins
- Org-admin share-link page shows org's own unique code
- Assessment modal (11-question chronotype assessment, no login required)
- Scoring engine (lark/eagle/owl, confidence calculation)
- Server actions: createMemberAndStartAssessment, submitAssessment, getMemberDashboard
- API routes: /api/admin-portal, /api/admin, /api/admin-org, /api/member, /api/auth/*, /api/org-link-status
- Webhook handler for Clerk user.created events
- Middleware relocated from root to src/middleware.ts (Clerk v7 requirement)
- AuthProvider sessionNonce force-re-render on login
- pageshow event handler for bfcache back-button protection
- Public route patterns include /dashboard(.*), /api/member(.*), org code paths
- Role checks removed from middleware (delegated to page components)
- Org name correctly read from Supabase join
- Assessment org code / referral code auto-detection from URL
- Assessment age field: manual input (1-100), no spinners, parsed to int
- Assessment state → location field mapping
- Reports table result_id column added, matching actual DB schema
- Superadmin organizations page: clickable names → detail page, create org, toggle link
- Superadmin org detail page: org info, admins list, members table
- Superadmin users page: admins list + all members table with search
- Superadmin settings page: functional with localStorage persistence
- Org code URL routing: landing page renders, deactivated link error page
- getInitials/generateOrgCode moved to separate utility file (Turbopack async constraint)
- API route auth: uses auth() directly instead of Clerk metadata checks
- RLS disabled on organizations, organization_admins, organization_links tables
- org_admin creation now creates Clerk user with password via clerkClient()
- Add admin form includes Set Password field
- **Branding Display** — Organization logo and company name displayed on user-facing pages
- **Branding API fields** — public-result API returns brandingCompany and brandingLogo
- **SiteNavbar branding props** — Accepts optional brandingLogo and brandingCompany props
- **Admin settings API** — GET/POST endpoints for fetching and updating org settings with branding fields
- **Admin settings page** — Fully functional with branding fields (logo URL, company name)
- **Consultation leads** — SQL migration, API (POST/GET/PATCH/DELETE), superadmin page with search/filter/pagination/detail modal/status management
- **Consult modal persistence** — Form data now persists to consultation_leads table via API
- **Reports & Analytics data** — Fully functional data loading with batch queries, in-memory joining, all demographic breakdowns
- **Reports & Analytics filters** — Case-insensitive, deduplicated dropdowns, state from location column, Apply + Clear buttons
- **CSV exports** — Consult leads, reports, and analytics pages with raw data export respecting active filters
- **"Lion" → "Lark" chronotype fix** — All display labels corrected to Lark/Eagle/Owl only
- **Duplicate email reassignment** — Member details update on reassessment with same email
- **Terms & Conditions modal** — Clickable links in assessment checkbox open styled T&C modal
- **Retest support** — Logged-in members can retake assessment without re-entering details; multiple results stored
- **Consult modal prefill** — Logged-in member data auto-filled in consult form
- **Home button org redirect** — Sidebar Home links redirect to org's unique code when member belongs to an organization
- **Donate modal** — Premium donate modal with impact list, amount selector; buttons in SiteNavbar and DashboardShell
- **Chronotype gallery everywhere** — The member's chronotype photos now appear as a one-by-one numbered gallery ("Visual journey ? Your {Chronotype} gallery") on the shared result page `/r/[assessmentId]`, the post-assessment result screen (assessment modal), and the member dashboard home � placed right after the wake/focus/bedtime strip, full-width images at natural ratio, lazy-loaded, clickable to open full-size. SVG chronotype illustrations (Lark/Eagle/Owl) restored in the result heroes.
- **PDF report: photos + gallery pages** — The PDF now embeds the chronotype hero photo on the cover and all chronotype photos on numbered gallery pages (3 per page) after page 1; "Your personalised daily guidance" is the last page; premium redesign (per-chronotype accent bars, section eyebrows, tinted panels, framed hero image, dynamic footer page count). Images downscaled via canvas to base64 data URIs (`src/lib/chronotype-image.ts`).
- **Phase-1 performance** — `AssessmentModal`/`ConsultModal` lazy-loaded via `next/dynamic` (only when opened); `@react-pdf/renderer` deferred to click-time; `client-cache` gained `revalidate`/`ttlMs` + `clearCache()` after assessment + revalidate on post-mutation reloads; Cache-Control headers on all GET API routes; ISR on the shared result page (`revalidate = 300`); module-scope `preload()` on superadmin pages. `admin-audit`/`member-detail` query the real production `activity_logs`/`login_audit` columns.
- **Chronotype image gallery** — Auto-sliding carousel of 32 images on /dashboard/chronotype with lightbox
- **Orange login/donate buttons** — Solid orange styling for all login and donate CTAs
- **Mobile carousel indicators removed** — Dot/pill progress indicators hidden on mobile viewports for the chronotype visual illustration carousel
- **Lark chronotype images** — 11 lark-specific images added to `public/chronotype_media/lark/`
- **PDF report redesigned** — New minimal healthcare A4 template with recognisable Lark/Eagle/Owl illustrations, Poppins font detection via `getPoppinsFontName()`, geometry validation, score sections removed
- **Donate modal image** — Visual panel updated to use `/assets/donate modal/donatepic.png`
- **PDF engine replaced** — html2canvas + jsPDF removed; `@react-pdf/renderer@4.5.1` now generates the report (new `src/components/pdf/` system), fixing the html2canvas alignment divergence. All 3 download entry points (dashboard, progress, assessment modal) wired with loading states + duplicate guards. Old `report-template.ts` and `/api/reports/preview` removed.
- **Owl chronotype images** — 11 owl-specific images added to `public/chronotype_media/owl/`; dashboard chronotype page now uses per-type folders.
- **Dashboard performance** — Replaced 1s dark-mode polling with storage event; lazy-loaded PDF libs; `cachedFetch` (45s TTL) across all dashboard pages; Cache-Control on /api/member; React.memo on chart components.
- **Sidebar collapse persisted** — `sidebarCollapsed` stored in localStorage (`chronotype_sidebar_collapsed`); no longer resets when switching subpages.
- **Energy page** — Personalized 24h energy curve (`generatePersonalizedEnergyCurve`) blending Lark/Eagle/Owl templates weighted by the member's real scores + confidence; new pixel-accurate `EnergyChart` (no SVG text distortion); extra cards removed.
- **Energy page real-data bar graph** — Replaced the synthetic energy curve with a bar graph (`src/components/charts/ScoreBars.tsx`) of the member's real `lark_score`/`eagle_score`/`owl_score` from the latest assessment; all card wrappers removed, only the visualization remains.
- **Chronotype carousel controls** — Auto-slide now 7 seconds; functional pause/play button added to the fullscreen lightbox carousel on desktop.
- **Member info panel data** — Phone number now shown; State reads `location` column first (assessment form "State *" stores to `location`) with `state` fallback; `/api/member-detail` answer queries batched + all independent queries parallelized for faster loading.
- **Member info panel scroll lock (fixed)** — Root cause was Lenis smooth-scroll hijacking global wheel events. Fix: stop Lenis while open, `data-lenis-prevent` on the panel, `overscrollBehavior: contain`, `minHeight: 0` (flex scroll-child), capture-phase wheel/touch guard that blocks everything outside the panel, plus body lock (`position: fixed` + `overflow: hidden` on html AND body). Full pattern documented in `systemPatterns.md` ? "Modal & Scroll-Lock Pattern (Lenis)". Applies to `InfoModal` (full), `ConfirmDialog`/`BusyOverlay` (lock only).
- **Superadmin dashboards polish** — Reusable `ConfirmDialog`, `InfoModal`, `BusyOverlay` components (`src/components/dialogs/`); all superadmin delete/remove actions use confirm popups; users page rows have view-info (`Eye`) modal showing full member/admin data (members.State reads `location` column); assessment builder shows a busy overlay for publish/save/edit; admin/superadmin sidebar icons replaced with distinctive lucide icons.
- **API performance** — `/api/admin-assessments` GET batched (was N+1), `getPlatformStats` uses count queries instead of loading all `chronotype_results`, Cache-Control added to `/api/admin`, `/api/admin-portal`, `/api/admin-assessments`; users/admin pages use `cachedFetch`.
- **Schema synced to production** — `supabase/schema2.sql` rewritten to match the live production schema (members uses `location` not `state`, age integer NOT NULL, phone NOT NULL, preferences_json; activity_logs uses `action`/`user_id`/`details_json`; login_audit uses `login_at`/`user_type`; consultation_leads includes `consulted_by`/`consult_notes`/`consulted_at`). `/api/admin-audit` and `/api/member-detail` updated to query the real columns and map to display shapes.
- **Consult this patient** — Consult leads page Location column replaced with a Consult button; `ConsultPatientModal` (`src/components/consult/`) records Consulted by (prefilled with logged-in admin) + Consult Notes via PATCH (saves `consulted_by`/`consult_notes`/`consulted_at`, marks lead CONTACTED). Consulted leads show a view-consultation-info Eye icon (InfoModal) + Update button. Lead-detail modal redesigned.
- **Dialog z-index** — `ConfirmDialog`/`InfoModal`/`BusyOverlay`/`ConsultPatientModal` raised to `z-10000` so they render above page-level modals (`z-9999`); consult modal previously appeared behind the lead-detail modal.
- **Recommendations CTA** — Member recommendations page removed dummy cards; now shows the specialist-consult message with a Schedule Consultation button that opens the ConsultModal prefilled with member data.
- **Chronotype carousel redesign** — visible prev/next on all screens, bottom control pill (dots + play/pause), PAUSED badge; peak-time cards removed; lightbox pause button on-screen. Global mobile `button { min-height: 48px }` scoped to `section` (fixed 48px-stretched carousel dots).
- **Docs** — `docs/PRODUCTION_GO_LIVE.md` (go-live gate: RLS hardening, staging deploy, observability, Core Web Vitals, SEO, tests) and `docs/FRESH_SETUP_SUPABASE_CLERK.md` (how to connect a new Supabase DB + Clerk account; manual dev steps + AI-coder notes + gotchas). Read these before any production/launch or fresh-environment work.
- **Result screen routing** — "Go to my Dashboard" on the assessment result screen now redirects to `/login` instead of `/dashboard`.
- **Login logo enlarged + responsive** — Logo enlarged across navbar and all login pages with viewport-based `clamp()` sizing (SiteNavbar, login panels, LoginCard, AuthLayout, DashboardShell sidebar).
- **Back-to-Home on login pages** — Functional home icon button with "Back to Home" label added to the right (form) panel of `/login` and `/superadmin/login`.
- **Mobile brand duplication fixed** — Removed page-level mobile brand blocks on `/login` and `/superadmin/login` so the brand shows only once (from the login card component).
- **Superadmin assessments persistence fix** — `create_draft`/`update_draft` now persist scoring rules; publishing auto-saves draft first; old versions get rules seeded via SQL.
- **scoring_rules schema aligned** — Production table has legacy `rule_logic jsonb` + `is_active` columns plus newly added `label VARCHAR(100)` + `description TEXT`. Health check now verifies `scoring_rules` exists.
- **Real assessment schedule everywhere** — Wake time / bedtime / peak focus now come from the member's actual stored `assessment_answers` (Q1 wake, Q2 bed, Q3 peak productivity, Q10 natural sleepiness fallback) instead of static chronotype templates. Threaded through `submitAssessment` (returns `schedule`), `/api/member` (returns `schedule`), `/api/member-detail` (`lastAssessmentAnswers`), shared `/r/[assessmentId]` page (`fetchPublicResult`), and the PDF (`ReportData.wakeTime/bedtime/peakFocus/assessmentDate`).
- **Supabase embed shape bug fixed** — PostgREST returns to-one joins (`questions`, `question_options`) as objects, not arrays; all schedule/answer readers now access shape-safely (object or array). Without this the schedule silently fell back to dummy data.
- **Energy timeline peak energy** — `/dashboard/energy` "Peak energy" now shows the member's real Q3 range (e.g. "10:00 AM � 5:00 PM") instead of a single hour from the synthetic curve.
- **PDF fixes** — daily-rhythm timeline section removed; schedule cards use cleaned real ranges; assessment date uses the real `generated_at` instead of download date.
- **Result screen card sizing** — Ideal wake / Best focus / Ideal bedtime values cleaned to concise ranges and font reduced (was truncating to "10AM.....").
- **Superadmin member info panel** — Users ? All Members ? View Info now shows the member's latest assessment summary (chronotype, total/confidence, L/E/O, date) and the full last-assessment Q&A (question + selected option + per-answer scores) via `/api/member-detail`; `InfoModal` gained an `answers` section.
- **Floating Take Test button fixed (org-code pages)** — The button was invisible on the white-labeled `/[orgCode]` landing because its effect bailed out when `#hero-section` didn't exist at mount (the org page renders a loading state first). Now it retries via interval + MutationObserver until the hero mounts.
- **Premium analyzing loader** — Assessment submit replaced the generic spinner with a circadian-orbit loader (framer-motion): rotating dashed/solid orbit rings with glowing satellites, pulsing conic-gradient core, cycling status messages ("Scoring your answers" / "Mapping your chronotype" / "Refining your sleep blueprint"), shimmer progress bar.
- **Member retake flow fixed** — "Take Test Again" no longer flashes the details form. New `retestLoading` state shows "Preparing your assessment…" while checking the previous attempt: incomplete (STARTED) tests offer Resume / Start Over with saved answers restored; otherwise it jumps straight into a fresh questionnaire. Completed retests create a new `chronotype_results` row.
- **Dashboard card order** — Member dashboard shows "Consult a Sleep Specialist" before "Support Better Sleep for All (Donate)".
- **Assessment form fields** — Occupation dropdown now includes "Salaried"; Pincode accepts alphabets (numeric-only validation/sanitize removed, maxLength 12).
- **First-time auto-login** — After a fresh first-time assessment, "Go to my Dashboard" logs the member in (localStorage session via `AuthProvider.login`) and opens `/dashboard` directly; later access uses the login page as usual.
- **View Result icon on reports** — Member dashboard "My Reports" and progress page each report row gained a View Result (eye) icon linking to `/r/[assessmentId]`; `/api/member` report enrichment now reads `assessment_id` directly from the reports table (fallback via `result_id` ? latest result) so older reports get a working link.
- **TTS section buttons** — SectionTTSButton added to all 13 landing-page sections; reads full section text via DOM TreeWalker with content-only filter; hero + footer use white-on-dark scheme.
- **TTS browser fallback** — TTSProvider falls back to window.speechSynthesis when /api/tts returns 502/unavailable.
- **Navbar voice toggle controls all TTS** — VoiceAssistanceToggle now gates manual section TTS buttons; clicking a section speaker when OFF enables the toggle and speaks.
- **TTS provider: ElevenLabs** — Replaced FreeTTS with ElevenLabs (`@elevenlabs/elevenlabs-js`). Server route `/api/tts` now synthesizes via ElevenLabs with caching + rate limiting. English voice: `XrExE9yKIg1WjnnlVkGX`. Indian languages (`hi`, `bn`, `ta`, `te`, `kn`, `ml`, `mr`, `gu`, `pa`, `or`, `as`, `ur`) mapped to `10O5QNlxfEBcKAbSUH4D`.
- **TTS loading spinner** — Spinner now stays visible until audio actually starts playing; removed fixed 1200ms timeout in `SectionTTSButton` and `TTSButton`.
- **TTS hydration fix** — Removed `typeof window !== "undefined" && window.innerWidth < 640` inline checks from `SectionTTSButton`, `TTSButton`, and `VoiceAssistanceToggle`; replaced with `useState(false)` + `useEffect` + `matchMedia` so SSR and initial client render stay in sync.
- **Mobile language dropdown** — Fixed dropdown going off-screen on mobile by switching dropdown alignment from `right-0` to `left-0` on `≤640px` in `LanguageSwitcher.tsx`.
- **Vercel env vars required for TTS** — `ELEVENLABS_API_KEY`, `TTS_PROVIDER=elevenlabs`, `TTS_ACTIVE_LOCALES=en,hi,bn,ta,te,kn,ml,mr,gu,pa,or,as,ur` must be set in Vercel project settings.

- **Product Manager documentation package** — Created `docs/product-manager/` with 12 documents covering SRS, PRD, feature requirements, user flows, roles/permissions, UI/UX spec, assessment logic, roadmap, analytics, architecture overview, and UAT testing.

- **Mobile vertical-eagle gallery** — Eagle chronotype members on mobile (`≤767px`) now see the dedicated vertical-optimized image set (`public/chronotype_media/vertical-eagles/`, 8 images). `src/lib/chronotype-image.ts` gained `VERTICAL_EAGLE_FILES` and `chronotypeImageSrcsMobile()`; dashboard page detects mobile via `matchMedia("(max-width: 767px)")` and switches gallery source for `EAGLE` only. Desktop gallery behavior unchanged.


---

# In Progress

- End-to-end testing of all role flows
- Supabase Project Setup (production) � database migrations pending

---

# Pending

- Referral Analytics
- Advanced Analytics Engine
- Doctor/Counsellor Portal
- Multi-language Support
- Mobile Applications

---

# Current Authentication Strategy

Provider: Clerk v7

Three roles: superadmin, organization_admin, member

Auth methods:
- **Members**: localStorage-based (login via email lookup, no Clerk sign-in required)
- **Org Admins**: Clerk sign-in (email + password), with localStorage fallback via login()
- **Superadmins**: Clerk sign-in (email + password)

Middleware: Only checks auth.protect() on known protected prefixes (/admin, /superadmin, /api/admin). Everything else passes through. Role enforcement in page components via useAuth().

---

# Current Database Strategy

Provider: Supabase PostgreSQL

Schema implemented via 3 SQL files (supabase/schema.sql, schema2.sql, schema3.sql):
- 18 tables: organizations, organization_admins, members, referrals, assessment_versions, questions, question_options, scoring_rules, assessments, assessment_answers, chronotype_results, recommendations, member_recommendations, reports, organization_links, member_goals, activity_logs, login_audit
- RLS disabled on all tables (server-side operations use admin client)
- Indexes and foreign key constraints

Server actions and API routes use createAdminClient() (service role key fallback → anon key) to bypass RLS for write operations.

---

# Current Technical Stack

Frontend: Next.js 16.2.6, TypeScript, Tailwind CSS v4, Framer Motion, React 19

Authentication: Clerk v7 (@clerk/nextjs ^7.5.21)

Database: Supabase PostgreSQL (@supabase/ssr 0.12.3, @supabase/supabase-js 2.110.8)

ORM: Drizzle (configured but not actively used — direct Supabase queries preferred)

Charts: Custom components (MiniLine, Bars, Ring)

Deployment: Vercel

---

# Key Fixes Applied This Session

1. **middleware.ts location** — Moved from root to src/ (Clerk v7 requirement)
2. **Public route patterns** — Added /login(.*), /dashboard(.*), /api/member(.*) to isPublicRoute
3. **Redirect loop** — Removed role-based checks from middleware (delegated to page components); set signInUrl: "/login"
4. **Post-sign-in redirect** — Changed from router.push to setTimeout + window.location.href; login page auto-redirects on isSignedIn
5. **AuthProvider stale context** — Added sessionNonce state to force re-render on login()
6. **bfcache back-button** — Added pageshow event listener to force auth re-check on page restore
7. **Org name not displaying** — Fixed Supabase join type assumption (single object vs array)
8. **Org-admin team scoping** — Added getOrgTeamAdmins() filtered by organization_id
9. **Org-admin share-link** — Changed from /api/admin to /api/admin-portal (scoped)
10. **Member login 401** — Added /api/member to public routes
11. **Superadmin 500 errors** — Replaced Clerk metadata role check with direct auth() + email fallback
12. **Server Actions async constraint** — Moved getInitials/generateOrgCode out of "use server" file into src/lib/utils/org-code.ts
13. **RLS violations** — Disabled RLS on organizations, organization_admins, organization_links tables
14. **Org link toggle not reflecting** — Fixed query to read link_active from organization_links table
15. **Add admin password** — Added Set Password field, creates Clerk user via clerkClient().users.createUser()
16. **Org code URL routing** — Created app/[orgCode]/page.tsx, middleware pass-through for public paths
17. **Org detail page** — Created /superadmin/dashboard/organizations/[id] with members + admins tables
18. **Members table in users page** — Added all members section with search, source badges, org column

19. **Section TTS buttons** — Added `SectionTTSButton` to all 13 landing-page sections; reads full section text via DOM TreeWalker with content-only filter; hero + footer use white-on-dark scheme for visibility on indigo/black backgrounds.

20. **TTS browser fallback** — `TTSProvider` falls back to `window.speechSynthesis` (`SpeechSynthesisUtterance`) when `/api/tts` returns non-ok, with proper state cleanup in `onend`/`onerror`.

21. **Navbar voice toggle gates manual TTS** — `VoiceAssistanceToggle` `enabled` state now controls `SectionTTSButton`; clicking a section speaker when toggle is OFF enables it and speaks automatically.

---

# Current Risks

- Webhook not configured (CLERK_WEBHOOK_SECRET commented out) — clerk_user_id linking works via email fallback
- /api/member endpoint is email-based with no auth — potential data exposure risk
- Drizzle ORM unused — direct Supabase queries bypass typed schema
- Some dashboard subpages still use mock data
- No production database created yet
- SUPABASE_SERVICE_ROLE_KEY not set in .env.local — falls back to anon key (RLS was disabled as workaround)
- .env.local contains test Clerk keys (pk_test_/sk_test_) — production keys needed before deployment

---

# Key Design Decision: Organization Codes

Format: `[INITIALS][4-digit sequential number]`
Examples: `AB0001` (Aditya Birla), `AAB001` (Asian Brown Brewerie)

Generated via `generateOrgCode(name)` in `src/lib/utils/org-code.ts`:
1. Extract first letter of each word from org name → prefix (e.g., "AB")
2. Query DB for existing codes starting with that prefix
3. Find max sequential number
4. Return `${prefix}${max + 1}` zero-padded to 4 digits

Both `createOrganizationInternal` and `toggleOrgActiveLinkInternal` use this function.


19. **Section TTS buttons** - Added SectionTTSButton to all 13 landing-page sections; reads full section text via DOM TreeWalker with content-only filter; hero/footer use white-on-dark scheme for visibility on indigo/black backgrounds.
20. **TTS browser fallback** - TTSProvider falls back to window.speechSynthesis (SpeechSynthesisUtterance) when /api/tts returns non-ok, with proper state cleanup.
21. **Navbar voice toggle gates manual TTS** - VoiceAssistanceToggle enabled state now controls SectionTTSButton; clicking a section speaker when toggle is OFF enables it and speaks.

