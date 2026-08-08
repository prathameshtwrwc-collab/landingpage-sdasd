# Production Go-Live Requirements

This document captures everything required to take this website from "works in dev / on a test DB" to a **production-grade, publicly-live** deployment. It is the source of truth for the go-live gate.

> Status (honest): Performance groundwork (Phase 1) is done — API caching, code-splitting, ISR. But the app is **not yet safe to launch**. The items in the **Critical** section below are hard blockers.

---

## 1. Current state

### Already done (Phase 1 performance)
- All GET API routes return `Cache-Control` headers (public result, org link status, admin endpoints, member endpoints).
- Client-side fetch layer (`src/lib/client-cache.ts`) upgraded: TTL + dedup + `revalidate` bypass + `preload`.
- Heavy modals (`AssessmentModal`, `ConsultModal`) lazy-loaded via `next/dynamic`; `@react-pdf/renderer` deferred to click-time.
- Shared result page (`/r/[assessmentId]`) ISR-cached (`revalidate = 300`).
- Preconnect to Supabase in root layout; `preload()` on heavy superadmin pages.
- `clearCache()` invoked after assessment completion; post-mutation reloads bypass cache.

### Not done (must happen before live)
Everything in section 2.

---

## 2. Go-Live Gate (do in this order)

### GATE 1 — Security hardening of the database  ⛔ BLOCKER
The repo schema files ship **permissive RLS policies** so the current code works against a test DB. Those policies are **not acceptable for production** — the public publishable (anon) key could read/write member PII directly if Supabase exposes it.

How to fix (detailed):
1. **Audit every table** in Supabase → Authentication → Policies. Identify which role each policy grants.
2. **Create a staging copy of the DB**, apply the hardening, and test every route (don't touch live until verified).
3. **Switch server-side reads to the service-role client** where feasible:
   - Server client (`src/lib/supabase/server.ts`) currently uses the publishable (anon) key — routes like `/api/member`, `/api/org-link-status`, `/api/member-detail`, the Clerk webhook, and `/api/health` depend on anon-role RLS.
   - Preferred posture: use `createAdminClient()` (service role) for all server-side queries, then **remove/revoke the anon policies** (or keep only strictly-needed read policies).
   - This is a code change (a few files) + a DB change. Verify each affected route after switching.
4. **Remove these dangerous policies** (present in `supabase/schema2.sql` / migrations for dev):
   - `anon_insert_members`, `anon_select_members`, `anon_update_members`
   - `anon_insert_assessments`, `anon_select_assessments`, `anon_update_assessments`
   - `anon_insert_answers`, `anon_select_answers`
   - `anon_insert_results`, `anon_select_results`
   - `anon_insert_recommendations`, `anon_select_recommendations`
   - `anon_insert_reports`
   - `anon_all_consultation_leads` (currently `FOR ALL TO anon` — extremely dangerous)
   - `anon_read_settings`
   - `anon_select_questions`, `anon_select_options`, `anon_select_recommendations_ref`, `anon_select_versions` (public read-only data — decide if truly public)
5. **Reject requests without auth** — confirm every dashboard API route guards with Clerk `auth()`, and add guards where missing.
6. **Secrets hygiene**:
   - Never commit `.env.local`; keep `SUPABASE_SERVICE_ROLE_KEY` and `CLERK_SECRET_KEY` server-side only (Vercel env, not client-accessible).
   - Rotate keys if any may have leaked.

### GATE 2 — Production build + staging deploy + click-through  ⛔ BLOCKER
1. Run a clean production build: `npm run build` (fix any errors/warnings).
2. Deploy to a staging URL (Vercel preview or separate project) with the **new** (client) Supabase + Clerk credentials.
3. Execute the full click-through checklist in section 3 on staging.
4. Only promote to production after the checklist passes end-to-end.

### GATE 3 — Observability & error handling
1. Add an error-tracking SDK (e.g., Sentry for Next.js) — server + client.
2. Add a top-level `ErrorBoundary` component around the dashboard content (or use `app/error.tsx`).
3. Add structured logging to server routes (warn on auth failures, DB errors, webhook failures).
4. Set up uptime/health monitoring against `/api/health`.
5. Add **rate limiting** on public endpoints: `POST /api/consultation-leads`, `/api/auth/redirect`, `/api/auth/check-user`, and the Clerk webhook (verify svix signature — already implemented — plus IP throttling).

### GATE 4 — Core Web Vitals measurement
1. Measure on staging with Lighthouse (mobile) and a real-device tool (PageSpeed Insights).
2. Targets: LCP < 2.5s, CLS < 0.1, INP < 200ms.
3. Known hotspots to fix if Vitals fail:
   - The public landing (`/[orgCode]`) is client-rendered and shows "Loading..." → convert critical marketing content to server rendering or add static/ISR shell.
   - Images still use plain `<img>` → migrate carousel + logos to `next/image` (webp/srcset, explicit dimensions for CLS).
4. Re-measure after each change.

### GATE 5 — SEO & sharing infrastructure
1. Add `public/robots.txt` and a sitemap (`app/sitemap.ts`).
2. Add default Open Graph image + per-page OG tags (shared result page already has metadata).
3. If the landing page must rank: server-render or statically generate the marketing sections.
4. Verify `/r/[assessmentId]` social share previews render correctly.

### GATE 6 — Automated tests
1. At minimum: an end-to-end smoke test of the critical flows (landing → assessment → result → dashboard; superadmin login → users → consultations).
2. Recommend Playwright for e2e + a small Vitest suite for the scoring/PDF data functions.
3. Wire tests into CI (GitHub Actions) so pushes don't break production flows.

### GATE 7 — Reliability & operations
1. Confirm Supabase **backups / Point-in-Time Recovery** are enabled on the production project.
2. Keep a documented migration workflow (the `supabase/*.sql` files are the source of truth; run them in the documented order — see `FRESH_SETUP_SUPABASE_CLERK.md`).
3. Configure production environment variables in the hosting platform (not in the repo).
4. Decide and document the webhook + reCAPTCHA production keys (see fresh-setup doc).

---

## 3. Full click-through checklist (run on staging before live)

**Public / marketing**
- [ ] Landing page loads fast (no "Loading..." flash where avoidable), no console errors.
- [ ] Navbar Login / Donate / Take Test Now work.
- [ ] Organization link page (`/[orgCode]`) shows active/deactivated/not-found states with correct branding.

**Auth**
- [ ] Member signup (Clerk) → user.created webhook fires → member row created (or linked) in Supabase.
- [ ] Member login via LoginCard routes to `/dashboard`.
- [ ] Org admin login routes to `/admin/dashboard`.
- [ ] Superadmin login routes to `/superadmin/dashboard` (requires `publicMetadata.role = "superadmin"`).
- [ ] Logout clears session everywhere.

**Member flows**
- [ ] Assessment: start → answer 11 questions → submit → result screen → PDF download.
- [ ] Dashboard loads with real member data (no stale cache after a retest).
- [ ] Chronotype / Energy / Progress / Profile / Settings / Recommendations pages render with real data.
- [ ] Consult modal opens prefilled; submitting creates a lead.
- [ ] PDF download + print work (deferred `@react-pdf` chunk loads).

**Admin flows**
- [ ] All admin dashboards load with real org data.
- [ ] Participants / results / analytics / team / white-label / share-link / notifications work.

**Superadmin flows**
- [ ] All dashboards load (users, organizations, assessments, reports, consultations, analytics, audit, system).
- [ ] Delete actions show confirm popup and delete correctly (no stale cache re-showing deleted rows).
- [ ] Consult-patient: record a consultation, verify the lead shows consulted info, update + view info.
- [ ] Assessment builder: create draft → save → publish → verify new version is ACTIVE and old is ARCHIVED.
- [ ] CSV exports work.

**Shared/public result**
- [ ] `/r/[assessmentId]` renders, metadata correct, social preview OK, fast repeat load (ISR).

**Security spot-checks**
- [ ] Unauthenticated requests to `/api/admin*` return 401.
- [ ] No sensitive data reachable with the public publishable key directly against Supabase (RLS audit done).

---

## 4. After launch
- Monitor error tracking + uptime for the first 2 weeks.
- Measure Core Web Vitals weekly.
- Keep the two docs (this file + `FRESH_SETUP_SUPABASE_CLERK.md`) updated as the app evolves.
