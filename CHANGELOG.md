# Changelog — Sleep Wellness Health-Tech Landing

All notable changes to this project documented in this file. Format based on Keep a Changelog, but simple.

## [2.12.37] — 2026-09-09 — Add bulk user selection, bulk delete/move, date filters, and detailed CSV export

### Added — Bulk user selection and actions
- Superadmin Users page now supports checkbox selection for both admins and members.
- Selected users can be bulk deleted or bulk moved to another organization.
- Bulk actions are available in the toolbar when one or more rows are selected.

### Added — Date filters for members
- New date filter dropdown on the members table: This Month, Last Month, Last 90 Days, This Year, All Time.
- Filtering is applied client-side against member `created_at`.

### Added — Detailed member CSV export
- Download CSV now includes: First Name, Last Name, Chronotype, Email, Phone, Age, Gender, Marital Status, Department, Occupation, Country, State, City, Pincode, Source, Joining Date.
- Source column shows organization name for org-sourced members, referrer name for referral members, and “Direct” for self-registered.
- Exported file is UTF-8 with BOM for Excel compatibility.

### Changed — Backend support for bulk operations
- New server actions: `bulk_delete_members`, `bulk_delete_admins`, `bulk_move_members`, `bulk_move_admins`.
- `getAllMembers` query enriched with `organization_name` and `referrer_name` for CSV and display.

## [2.12.36] — 2026-09-06 — Fix assessment modal form ordering, manual type fields, and email verify placement

### Fixed — Assessment modal field ordering
- Country, State, and City fields are now consecutive and properly ordered in both desktop and mobile views.

### Added — Manual type option for location fields
- Country, State, and City dropdowns now include a "Type manually..." option.
- When selected, a text input appears below the dropdown so users can enter custom values.
- Manual values are persisted to the database through the normal form submission flow.

### Fixed — Verify email placement on mobile
- The verify email section now appears directly below the email field, instead of after the phone number field on mobile view.

### Fixed — Assessment modal close behavior
- Modal overlay no longer closes the form when clicked outside.
- Modal now only closes when the close icon button is clicked.

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
