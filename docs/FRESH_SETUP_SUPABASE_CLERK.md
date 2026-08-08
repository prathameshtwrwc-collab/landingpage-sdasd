# Fresh Setup: Connect to a New Supabase Database + Clerk Account

Use this when the current (test/demo) Supabase + Clerk credentials must be replaced with the **client's own** project, e.g. a fresh `git pull` on a new machine or before handing the app to a client.

This doc is split into:
- **Part A — Manual developer tasks** (only a human can do these — console/account steps).
- **Part B — AI coder / engineer knowledge** (what to keep in mind while working on the code).
- **Verification checklist** + **Gotchas**.

---

## 0. What the app actually uses (integration map)

### Supabase (Postgres)
Used for **all** app data. There is **no Supabase Storage** usage — logos are URL strings only. No buckets need to be created.

| Table | Purpose |
|---|---|
| `organizations` | Organizations + branding columns |
| `organization_admins` | Org admins / superadmin (role column) |
| `members` | Member profiles (`location` holds the assessment "State" field; **no `state` column**) |
| `referrals` | Referral codes |
| `assessment_versions`, `questions`, `question_options`, `scoring_rules` | Assessment builder data |
| `assessments`, `assessment_answers`, `chronotype_results` | Assessment runs + results |
| `recommendations`, `member_recommendations` | Per-chronotype recommendations |
| `reports` | Generated report records |
| `organization_links` | Share links (`/[orgCode]`) + branding |
| `member_goals` | (table exists; feature currently unused) |
| `activity_logs`, `login_audit` | Audit/log tables (production column layout) |
| `consultation_leads` | Consult form submissions + `consulted_by` / `consult_notes` / `consulted_at` |
| `platform_settings` | Admin settings (from `migration_platform_settings.sql`) |

Required **enums** (from `supabase/schema.sql`): `member_source_type`, `assessment_status`, `chronotype_type`. Extension: `pgcrypto`.

### Supabase keys (how the app connects)
| Code path | Key used | Notes |
|---|---|---|
| `src/lib/supabase/server.ts` (server reads) | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | anon/publishable key; depends on permissive RLS today |
| `src/lib/supabase/client.ts` (browser) | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | |
| `src/lib/supabase/admin.ts` (`createAdminClient`) | `SUPABASE_SERVICE_ROLE_KEY` | admin routes, bypasses RLS |
| `src/lib/queries/public-result.ts`, `src/app/api/consultation-leads/route.ts` | publishable key | |

### Clerk (auth)
- `ClerkProvider` wraps the app (`src/app/ClientLayout.tsx`).
- Member / org-admin login: `LoginCard` → `POST /api/auth/check-user` (finds member/admin by email in Supabase) → Clerk sign-in.
- Superadmin login: `SuperAdminLoginCard` → direct Clerk `signIn.create` → redirects to `/superadmin/dashboard`.
- **Role resolution**: `AuthProvider` reads `clerkUser.publicMetadata.role` → falls back to the localStorage session role.
- **Webhook** (`/api/webhooks/clerk`): handles `user.created` → creates/links a `members` row and an `organization_admins` row **by email** in Supabase.

---

## PART A — Manual developer tasks (human only)

### A1. Create the Supabase project
1. Go to supabase.com → New project (pick region closest to the client).
2. Copy from **Project Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** (newer name for anon key) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **Service role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ secret — server-side only, never expose to the browser)
3. (Recommended) Enable **backups / Point-in-Time Recovery** in Project Settings → Database.

### A2. Run the SQL files in this exact order
In Supabase **SQL Editor**, run each file top-to-bottom in order:

1. `supabase/schema.sql` — enums + `pgcrypto`
2. `supabase/schema2.sql` — all tables, indexes, RLS, seed orgs
3. `supabase/schema3.sql` — seed data (11-question assessment, scoring rules, recommendations)
4. `supabase/migration_org_fields.sql` — org `department/branch/pincode/city/state` (idempotent)
5. `supabase/migration_branding.sql` — branding columns (idempotent)
6. `supabase/migration_consultation_leads.sql` — leads table + consult columns (idempotent)
7. `supabase/migration_consult_patient.sql` — `consulted_by / consult_notes / consulted_at` (idempotent; safe to skip if #6 already includes them)
8. `supabase/migration_platform_settings.sql` — `platform_settings` table + defaults

> All migrations use `IF NOT EXISTS` / `CREATE TABLE IF NOT EXISTS`, so re-running them is safe.
>
> ⚠️ **Important:** `schema2.sql` ships **permissive anon RLS policies** (they match the current code, which reads via the publishable key). This makes the app work immediately, but it is **not production-safe**. Before going live, apply the hardening steps in `docs/PRODUCTION_GO_LIVE.md` (switch server reads to the service-role client and revoke anon policies).

### A3. Verify the seed data
In SQL Editor, confirm:
- `SELECT COUNT(*) FROM assessment_versions;` → 1 (the seeded 11-question version, status ACTIVE).
- `SELECT COUNT(*) FROM questions;` → 11.
- `SELECT COUNT(*) FROM scoring_rules;` → 3.
- `SELECT COUNT(*) FROM recommendations;` → 12.

If any are 0, re-run `schema3.sql`.

### A4. Create the Clerk application
1. Go to dashboard.clerk.com → Add Application (name: e.g. "Chronotype"). Choose **Email + Password** provider.
2. From **API Keys**: copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
3. Note the **Frontend API / Authorized domain**: add the production domain and any staging domain to **Allowed origins / Authorized domains** (else Clerk blocks sign-in).

### A5. Configure Clerk sign-in / sign-up URLs (env vars)
The app reads these (used by Clerk components):
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/login`

(Set them in the hosting platform's env; values match the app's login route.)

### A6. Configure the Clerk webhook
1. In Clerk dashboard → **Webhooks** → Add Endpoint.
2. Endpoint URL: `https://<your-production-domain>/api/webhooks/clerk`
3. **Subscribe to the event `user.created`** (this is the only event the code handles — see `src/app/api/webhooks/clerk/route.ts`).
4. Copy the **Signing secret** → `CLERK_WEBHOOK_SECRET`.
5. Keep the signing secret out of client code.

### A7. Create the superadmin + set roles
1. In Clerk dashboard → Users → Add User (email + password) for the platform owner.
2. **Critical:** on that user, click **Edit → Public metadata** and set:
   ```json
   { "role": "superadmin" }
   ```
   The dashboards check `publicMetadata.role`; without it the user cannot access `/superadmin/dashboard`.
3. Org admins: either create them in the superadmin UI (Users page → add admin) **and** set their Clerk `publicMetadata.role` to `"organization_admin"`, or rely on the email-match flow in `check-user` (works only when the admin row already exists in `organization_admins`).
4. Members: the Clerk webhook (`user.created`) auto-creates/links the `members` row by email when a user signs up.

### A8. Set all environment variables
Create `.env.local` locally (and the same keys in the hosting platform) with **exactly** these names:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>          # anon key
SUPABASE_SERVICE_ROLE_KEY=<service role key>                    # SECRET — server only
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<pk_live_...>
CLERK_SECRET_KEY=<sk_live_...>                                  # SECRET
CLERK_WEBHOOK_SECRET=<svix signing secret from webhook>         # SECRET
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/login
NEXT_PUBLIC_APP_URL=https://<production-domain>                 # optional; used by /api/auth/redirect
```

Optional / legacy (safe to ignore unless used):
- `DATABASE_URL` — only referenced by the unused Drizzle setup (`src/db/index.ts`).

### A9. reCAPTCHA (consult form)
The consult form (`src/components/consult/ConsultModal.tsx`) embeds Google reCAPTCHA with a **hardcoded test site key**.
- For the client's production site, register a reCAPTCHA v2 site key at google.com/recaptcha and **replace the hardcoded `sitekey`** (ideally move it to `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and add server-side verification before going live).

### A10. Deploy & set envs
1. Push the repo; deploy on the hosting platform (Vercel recommended).
2. Set all the env vars above in the hosting platform (NOT in the repo).
3. Re-run the webhook endpoint + authorized domains with the final domain.

---

## PART B — AI coder / engineer knowledge

### Env vars the code reads (exact names)
| Env var | Used in |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | all supabase clients |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | server.ts, client.ts, public-result.ts, consultation-leads |
| `SUPABASE_SERVICE_ROLE_KEY` | admin.ts (`createAdminClient`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ClerkProvider |
| `CLERK_SECRET_KEY` | Clerk server auth |
| `CLERK_WEBHOOK_SECRET` | `/api/webhooks/clerk` (svix verify) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Clerk components |
| `NEXT_PUBLIC_APP_URL` | `/api/auth/redirect` |

### Things to keep in mind while coding against a fresh DB
1. **`members` has no `state` column** — the assessment "State" field lives in `members.location`. Info panels read `location` first, `state` as fallback.
2. **`members.age INTEGER NOT NULL`, `phone TEXT NOT NULL`** in production schema. The Clerk webhook inserts `age: ""` — that **fails** against this schema. Fix the webhook (`src/app/api/webhooks/clerk/route.ts`) to omit `age`/`phone` (or make them nullable in the migration) before relying on webhook-driven member creation.
3. **Role model is two-source**: `clerkUser.publicMetadata.role` (set in Clerk dashboard) + `organization_admins.role` in Supabase (checked by `/api/auth/check-user`). Both must be consistent for admin/superadmin access.
4. **RLS posture**: current code reads via the publishable (anon) key in several server routes, which depends on the permissive policies in `schema2.sql`. If you tighten RLS, first switch those routes to `createAdminClient()` — otherwise they 500. See `PRODUCTION_GO_LIVE.md` GATE 1.
5. **ReCAPTCHA site key is hardcoded** in `ConsultModal.tsx` — replace with the client's key.
6. **Caching**: after any DB mutation, use `cachedFetch(url, undefined, { revalidate: true })` (or `clearCache()`) so the client cache doesn't serve stale rows. The assessment completion already calls `clearCache()`.
7. **Migration files are the schema source of truth** — when schema2.sql is updated, keep the migrations in sync (both are idempotent).

---

## Verification checklist (after fresh setup)

**Supabase**
- [ ] `npm run dev` starts without env errors.
- [ ] `/api/health` returns all key checks true (`hasSupabaseUrl`, `hasSupabaseKey`, `hasClerkKey`).
- [ ] Landing page loads; "Take Test Now" opens the assessment; submitting creates a member + assessment + result (verify in Supabase Table Editor).
- [ ] Member dashboard shows real data; chronotype/energy/progress pages work.
- [ ] Consult lead submission inserts a row; superadmin "Consult this patient" writes `consulted_by/consult_notes/consulted_at`.

**Clerk**
- [ ] Sign-up triggers the webhook (Clerk → Webhooks → Recent deliveries → 200) and the member row is created/linked.
- [ ] Member login routes to `/dashboard`; org-admin to `/admin/dashboard`; superadmin to `/superadmin/dashboard`.
- [ ] Superadmin can access all superadmin pages (requires `publicMetadata.role = "superadmin"`).

**Deploy**
- [ ] Production build passes: `npm run build`.
- [ ] Env vars set in hosting platform; webhook URL + authorized domains point at the final domain.
- [ ] Full click-through checklist from `docs/PRODUCTION_GO_LIVE.md` passes on staging before switching DNS.

---

## Known gotchas (summarized)
1. Clerk webhook inserts `age: ""` → fails on `age INTEGER NOT NULL`; fix before relying on it.
2. Superadmin access requires `publicMetadata.role = "superadmin"` in Clerk.
3. Anon RLS policies in schema files are dev-only; must be hardened for production (GATE 1 in the go-live doc).
4. reCAPTCHA key is hardcoded in `ConsultModal.tsx`.
5. `CLERK_WEBHOOK_SECRET` was missing from the old `.env.local` — ensure it is set or the webhook returns 500.
6. No Supabase Storage is used — do not spend time creating buckets.
