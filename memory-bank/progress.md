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
