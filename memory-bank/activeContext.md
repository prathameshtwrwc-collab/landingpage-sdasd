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

---

# In Progress

- End-to-end testing of all role flows
- Member dashboard subpage data wiring from real API
- Reports/analytics subpages with real data

---

# Pending

- Supabase Project Setup (production)
- Database Migrations
- PDF Report Generation
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
