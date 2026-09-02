# Changelog — Sleep Wellness Health-Tech Landing

All notable changes to this project documented in this file. Format based on Keep a Changelog, but simple.

## [2.12.35] — 2026-09-02 — Fix admin creation error handling, add share message template, and improve settings page

### Fixed — Admin creation 500/Unprocessable Entity error
- `createOrganizationAdminInternal` in `src/lib/actions/superadmin.ts` now returns `{ error }` objects instead of throwing unhandled exceptions.
- Added `clerk.users.getUserList({ emailAddress: [...] })` pre-check so duplicate emails in Clerk are caught with a clear message before creation.
- `POST /api/admin?action=create_admin` now returns HTTP 400 on validation/business-logic failures instead of 500.
- Frontend `createAdmin` handler in `src/app/superadmin/dashboard/users/page.tsx` now safely handles non-JSON and non-2xx responses.

### Added — Share link message template
- New `share_message_template` column on `organizations` table.
- Admin Share Link page (`/admin/dashboard/share-link`) now lets admins customize the message template used when sharing their unique organization link.
- Admins can preview the combined message + link, save the template, and share via system share or copy.
- Dashboard Org Link card share button now includes the custom/default message with the link.

### Fixed — Verification email delivery
- Added missing `email_verifications` table to `supabase/schema2.sql`.
- `POST /api/verify-email/send` now fails fast with a clear 500 if `RESEND_FROM_EMAIL` is missing, instead of silently not sending.
- Resend API failures are now returned as 502 with the actual error message so the frontend can surface them.

### Updated — Admin settings page
- `/admin/dashboard/settings` now loads existing data automatically on mount, including branding fields.
- Added Edit mode: all fields are disabled by default. Admins click Edit to enable editing, then Save or Cancel.
- Branding section now correctly displays saved values and supports live editing.

### Added — Resend setup documentation
- New `resendsteps.md` with steps to verify `sdasdhealth.com` in Resend and configure production environment variables.

## [2.12.34] — 2026-08-28 — Fix TTS listen button replay and inflight leak

### Fixed — TTS listen button replay after stop
- `TTSProvider` now correctly restarts speech synthesis when the listen icon is clicked again after stopping.
- Removed priority guard that prevented low-priority requests from retriggering `speechSynthesis.cancel()` after a stop.

### Fixed — TTS inflight leak on server failure
- `inflightRef` now always removes the request key in `finally`, preventing duplicate requests from being silently dropped after a failed `/api/tts` call.

### Changed — Repository sync
- Pulled latest upstream changes and resolved merge conflict in `tsconfig.tsbuildinfo`.

## [2.12.33] — 2026-08-21 — Fix support ticket callback visibility and sender details

### Fixed — Org-admin callback requests visibility
- Org-admin `/admin/dashboard/notifications` now correctly shows only Member Callback Requests from members mapped under their organization.
- Added server-side org auto-detection in `GET /api/support-tickets` from `organization_admins.clerk_user_id` so results are scoped even if the frontend omits the org filter.

### Fixed — Support ticket sender details persistence
- `POST /api/support-tickets` now resolves and persists sender details directly on the ticket at creation time.
- Member lookup is now multi-layered: `clerk_user_id` → case-insensitive email lookup → `body.member_id`, with `organization_id` backfill from the resolved member.
- `sender_name`, `sender_email`, `sender_phone`, and `sender_org` are now saved on the ticket row so dashboards can display them without re-joining member data.

### Fixed — Member help page callback submission
- Added the missing callback checkbox control to `/dashboard/help` so members can actually submit `request_callback: true`.
- The member help form now sends `email: user?.email` to the API, giving the server a reliable fallback identifier for custom-auth members.
