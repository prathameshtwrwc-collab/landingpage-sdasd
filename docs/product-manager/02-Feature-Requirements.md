# 02 — Feature Requirements

**SDASD Sleep Chronotype & Wellness Platform**  
**Version:** 1.0  
**Date:** 2026-08-14

---

## Feature Index

| # | Feature | Status |
|---|---------|--------|
| 1 | Public Landing Page | ✅ Current |
| 2 | Assessment Flow | ✅ Current |
| 3 | Member Registration | ✅ Current (via assessment) |
| 4 | Authentication (Clerk) | ✅ Current |
| 5 | Member Dashboard | ✅ Current |
| 6 | Chronotype Result Display | ✅ Current |
| 7 | Energy Curve Visualization | ✅ Current |
| 8 | Recommendations Engine | ✅ Current |
| 9 | PDF Report Generation | ✅ Current |
| 10 | Public Result Sharing | ✅ Current |
| 11 | Referral System | ✅ Current |
| 12 | Consultation Booking | ✅ Current |
| 13 | Donation Modal | ✅ Current |
| 14 | Organization Admin Dashboard | ✅ Current |
| 15 | Super Admin Dashboard | ✅ Current |
| 16 | Organization Management | ✅ Current |
| 17 | Admin User Management | ✅ Current |
| 18 | Member Management | ✅ Current |
| 19 | CSV Export | ✅ Current |
| 20 | i18n (Multi-language) | ✅ Current |
| 21 | TTS (Text-to-Speech) | ✅ Current |
| 22 | Assessment Resume/Restart | ✅ Current |
| 23 | Organization Link Sharing | ✅ Current |
| 24 | White-label Settings | ✅ Current (partial) |
| 25 | Audit Log | ✅ Current (partial) |
| 26 | Consultation Leads | ✅ Current (partial) |
| 27 | Notifications | ⏳ Future |
| 28 | Assessment History | ⏳ Future |
| 29 | Progress Tracking | ⏳ Future |
| 30 | Sleep Tracking Integration | ⏳ Future |

---

## Feature Details

### 1. Public Landing Page

**Purpose:** Educate visitors about sleep chronotypes, the assessment, and the platform's value proposition. Drive conversions to take the assessment.

**User:** Anonymous visitor (public)

**Flow:** Visitor lands on homepage → scrolls through 14 editorial sections → clicks "Take Test Now" CTA → assessment modal opens.

**System behavior:**
- Renders 14 sections in fixed order (Navbar, Hero, Statement Strip, Chronotype Intro, Optimization, Four Pillars, Better Sleep, Why Sleep Matters, Sleep Cycles, Common Sleep Disorders, Warning Signs, Sleep Facts, Additional Guidance, FAQ, Disclaimer Footer)
- Responsive layout adapts to mobile, tablet, desktop
- "Take Test Now" button opens assessment modal
- Smooth scroll navigation between sections
- Language switcher available

**Expected result:** Visitor understands the platform's purpose and is motivated to take the assessment.

**Status:** ✅ Complete — 14 sections implemented per DESIGN_SYSTEM.md specification.

---

### 2. Assessment Flow

**Purpose:** Collect user's personal details and sleep habits to determine their chronotype.

**User:** Anonymous visitor or logged-in member

**Flow:**
1. User clicks "Take Test Now" or "Take Assessment"
2. Modal opens → Step 0: Personal details form (name, age, gender, marital status, country, city, pincode, occupation, email, phone, org code, referral code)
3. User agrees to terms/privacy
4. Clicks "Start Assessment"
5. Step 1–11: Answer 11 multiple-choice questions
6. Progress bar and step dots show advancement
7. Submit answers → server calculates chronotype
8. Result view displays chronotype, scores, schedule, recommendations

**System behavior:**
- Creates a member record and assessment record in Supabase
- Saves answers incrementally (auto-save on each answer)
- Supports resume if user closes modal mid-assessment
- Validates personal details form (required fields, email format, phone length by country)
- Supports URL parameters: `?ref=[referralCode]` and `/[orgCode]` path
- If user is logged in, "Take Test Again" on dashboard restarts assessment

**Expected result:** User completes assessment and receives their chronotype result.

**Status:** ✅ Complete — 11 questions, personal details form, validation, auto-save, resume support.

---

### 3. Member Registration

**Purpose:** Create a member profile when a user takes the assessment.

**User:** Anonymous visitor

**Flow:** User completes assessment personal details form → member record created → assessment linked to member.

**System behavior:**
- Member created with email, name, demographic data
- Optional: org code links member to organization
- Optional: referral code tracks referral source
- No separate registration page — registration happens as part of assessment
- Login page checks if email exists in database

**Expected result:** Member profile exists in database with contact details and demographics.

**Status:** ✅ Complete — inline registration via assessment form.

**To Be Confirmed:** Is there a standalone sign-up page for users who don't want to take the assessment immediately? Currently, no account found → "Take the test" CTA.

---

### 4. Authentication (Clerk)

**Purpose:** Secure login for Members, Organization Admins, and Super Admins.

**User:** All authenticated users

**Flow:**
1. User navigates to `/login`
2. Enters email → system checks if email exists and determines role
3. If Member: direct login (no password required — currently uses session-based)
4. If Admin/Super Admin: password prompt
5. Redirect to appropriate dashboard based on role

**System behavior:**
- Uses Clerk for authentication
- Role stored in Clerk public metadata
- Session stored in client-side context (AuthProvider)
- Logout clears session and signs out from Clerk
- Super Admin has separate login page (`/superadmin/login`)

**Expected result:** Authenticated user lands on correct dashboard.

**Status:** ✅ Complete — Clerk integration with role-based redirect.

---

### 5. Member Dashboard

**Purpose:** Central hub for members to view their chronotype result, reports, and quick actions.

**User:** Logged-in member

**Flow:**
1. User logs in → redirected to `/dashboard`
2. Dashboard loads member data via `/api/member?email=...`
3. Displays: chronotype result, sleep score, assessment count, confidence
4. Quick actions: Download Report, Share Result, Referral Link, Consult, Donate
5. Secondary sections: Chronotype Gallery, My Reports list, Consult a Specialist card, Donate card

**System behavior:**
- Fetches member data, latest chronotype result, recommendations, assessments, reports, schedule (wake time, bedtime, peak focus)
- Random gradient background for hero card
- Referral link auto-generated from member's referral code
- Share uses Web Share API or clipboard fallback
- Download Report imports client-side PDF generator
- "Take Test Again" opens assessment modal for retest

**Expected result:** Member sees their complete chronotype profile and can take actions.

**Status:** ✅ Complete — all sections functional.

---

### 6. Chronotype Result Display

**Purpose:** Show the user's classified chronotype with scores and confidence.

**User:** Member (on dashboard and in assessment modal)

**Flow:** Assessment submitted → server returns `{ chronotype, total_score, confidence_score, lark_score, eagle_score, owl_score }` → result view rendered.

**System behavior:**
- Three chronotypes: LARK, EAGLE, OWL
- Each has label, tagline, description, peak times, blueprint (sleep window, need, cycle)
- Result shown in dashboard hero and assessment modal result view
- Color-coded: Lark = orange (#EE8300), Eagle = indigo (#30268F), Owl = purple (#7B68AE)

**Expected result:** User clearly understands their chronotype and what it means.

**Status:** ✅ Complete.

---

### 7. Energy Curve Visualization

**Purpose:** Visualize the member's 24-hour energy pattern based on their chronotype and scores.

**User:** Member

**Flow:** Dashboard loads → energy curve data fetched → chart rendered on `/dashboard/chronotype` page.

**System behavior:**
- Base energy templates for each chronotype (12 data points: 6a, 8a, 10a, 12p, 2p, 4p, 6p, 8p, 10p, 12a, 2a, 4a)
- Personalized curve = weighted blend of all three archetype templates + confidence-based shaping toward winner
- Rendered as chart (EnergyChart component)

**Expected result:** Member sees a 24-hour energy curve showing their peak and low periods.

**Status:** ✅ Complete — available on `/dashboard/chronotype` page.

---

### 8. Recommendations Engine

**Purpose:** Provide personalized daily guidance based on chronotype.

**User:** Member

**Flow:** Assessment submitted → server returns recommendations → displayed on dashboard and in PDF report.

**System behavior:**
- Recommendations stored in `member_recommendations` table
- Each recommendation has title and description
- Displayed on dashboard (loaded via `/api/member`)
- Included in PDF report (up to 6 recommendations, split into 2 columns)

**Expected result:** Member receives actionable, chronotype-specific tips.

**Status:** ✅ Complete — recommendations rendered on dashboard and in PDF.

**To Be Confirmed:** How are recommendations generated and mapped to specific chronotypes/scores? The mapping logic is server-side and not visible in the frontend code.

---

### 9. PDF Report Generation

**Purpose:** Allow members to download a detailed, branded PDF of their chronotype report.

**User:** Member

**Flow:** User clicks "Download Report" → client generates PDF using `@react-pdf/renderer` → file downloads.

**System behavior:**
- Client-side generation using `@react-pdf/renderer` and `ChronotypeReportPDF` component
- Multi-page A4 document:
  - Page 1: Header, metadata (name, date, report ID), chronotype hero, schedule row, strengths/watch-outs, next steps
  - Gallery pages: Chronotype imagery (one image per page)
  - Recommendations page: Up to 6 recommendations in 2 columns
- Disclaimer on every page: "Wellness guidance only — not a medical diagnosis."
- Org branding included if member belongs to an organization
- Server-side API (`/api/reports/generate`) returns 501 — client-side only

**Expected result:** Member downloads a professional PDF report.

**Status:** ✅ Complete — client-side PDF working.

---

### 10. Public Result Sharing

**Purpose:** Allow members to share their chronotype result publicly via a unique link.

**User:** Member (sharer), any visitor (viewer)

**Flow:**
1. Member clicks "Share Result" on dashboard
2. Generates link: `/[origin]/r/[assessmentId]`
3. Shares via Web Share API or clipboard
4. Recipient opens link → public result page renders
5. Page ISR-cached for 5 minutes

**System behavior:**
- Public result page at `/r/[assessmentId]` fetches data via `/api/public-result/[assessmentId]`
- Uses React cache and ISR (`revalidate = 300`)
- Shows result card with chronotype, scores, recommendations, gallery
- No login required to view

**Expected result:** Anyone with the link can view the member's chronotype result.

**Status:** ✅ Complete — public sharing page functional.

---

### 11. Referral System

**Purpose:** Enable members to share the platform with friends via a unique referral link.

**User:** Member

**Flow:**
1. Member receives referral code upon completing assessment
2. Dashboard shows referral link and code
3. Member shares via Web Share API or clipboard
4. New visitor arrives via `?ref=[code]` → code locked in assessment form
5. New member's assessment links to referrer

**System behavior:**
- Referral code auto-generated for each member
- URL parameter `?ref=[code]` pre-fills and locks referral code field
- If organization code is also in URL, both are locked
- Member can copy link or use native share

**Expected result:** Members can invite others, and referrals are tracked.

**Status:** ✅ Complete — referral codes, sharing, URL parameter support.

---

### 12. Consultation Booking

**Purpose:** Allow members to book a consultation with a sleep specialist.

**User:** Member

**Flow:**
1. Member clicks "Consult" or "Book Consultation" on dashboard
2. Modal opens with pre-filled personal details (name, age, gender, contact, location)
3. User reviews/edits details and submits
4. Lead created via `/api/consultation-leads`

**System behavior:**
- Consultation modal (`ConsultModal`) with form fields
- `ConsultContext` manages modal state
- Pre-fills from member data if logged in
- Submits to `/api/consultation-leads`
- Super Admin can view consultation leads

**Expected result:** Member can request a consultation; lead is captured for follow-up.

**Status:** ✅ Complete — modal, form, API route exist.

**To Be Confirmed:** How are leads routed to specialists? Is there a notification system? What is the consultation delivery method (phone, video, in-person)?

---

### 13. Donation Modal

**Purpose:** Allow users to make donations to support the platform's mission.

**User:** Any visitor/member

**Flow:**
1. User clicks "Donate" button on dashboard or landing page
2. Modal opens with donation message and options
3. User completes donation flow

**System behavior:**
- Donate modal component exists
- Integrated into member dashboard
- Message: "Support Better Sleep for All" — provides free consultations and wellness programs to underserved communities

**Expected result:** User can make a donation.

**Status:** ⚠️ UI Complete — Payment processing integration not visible in codebase. May be placeholder or future integration.

---

### 14. Organization Admin Dashboard

**Purpose:** Provide organization administrators with insights into their members' sleep wellness data.

**User:** Organization Admin

**Flow:**
1. Admin logs in → redirected to `/admin/dashboard`
2. Dashboard loads stats via `/api/admin-portal`
3. Views: total members, assessments completed/in-progress/not-started, avg confidence, org link status
4. Charts: assessment activity, chronotype distribution
5. Sub-pages: Participants, Reports, Analytics, Settings, Notifications, Team, White-label, Share-link

**System behavior:**
- Role check: `user.role === "organization_admin"`
- Stats fetched from admin-portal API
- Organization link displayed with copy/share functionality
- Participants page with search and pagination
- Reports, analytics, settings pages exist

**Expected result:** Admin can monitor their organization's sleep wellness program.

**Status:** ✅ Complete — main dashboard functional; sub-pages exist but may need backend verification.

---

### 15. Super Admin Dashboard

**Purpose:** Platform-wide oversight and management for Super Admins.

**User:** Super Admin

**Flow:**
1. Super Admin logs in via `/superadmin/login`
2. Redirected to `/superadmin/dashboard`
3. Views: platform stats (orgs, members, assessments, admins), quick links
4. Charts: chronotype distribution, completion rate, member source distribution
5. Sidebar: latest organizations, admins, members
6. Sub-pages: Organizations, Users, Reports, Settings, Audit, Consultations, Assessments, Analytics

**System behavior:**
- Role check: `user.role === "superadmin"`
- Separate login page with restricted access styling
- Fetches data from `/api/admin` with pagination and search
- At-a-glance metrics: members per org, admin ratio, org types, completion rate

**Expected result:** Super Admin has full visibility and control over the platform.

**Status:** ✅ Complete — main dashboard functional; sub-pages exist.

---

### 16. Organization Management

**Purpose:** Allow Super Admins to create, edit, delete, and manage organizations.

**User:** Super Admin

**Flow:**
1. Navigate to `/superadmin/dashboard/organizations`
2. View list of organizations with search and pagination
3. Create new organization with form (name, type, country, email, department, branch, city, state, pincode)
4. Edit organization inline
5. Toggle organization link active/paused
6. Delete organization with confirmation dialog
7. Export to CSV (full details, contacts only, emails only)

**System behavior:**
- CRUD operations via `/api/admin?action=create_org|edit_org|delete_org|toggle_link`
- Unique code auto-generated on creation
- Organization types: Corporate, Healthcare, Education, NGO, Other
- Pagination: 10 per page
- Search by name

**Expected result:** Super Admin can fully manage organizations.

**Status:** ✅ Complete — full CRUD with CSV export.

---

### 17. Admin User Management

**Purpose:** Allow Super Admins to create, edit, and delete organization administrators.

**User:** Super Admin

**Flow:**
1. Navigate to `/superadmin/dashboard/users`
2. View admins and members in separate sections
3. Create admin with form (first name, last name, email, password, organization)
4. Edit admin inline
5. Delete admin with confirmation
6. Search and filter admins by name, email, role, organization
7. View admin info modal
8. Export to CSV

**System behavior:**
- Admin creation sends password to Clerk
- Role filter: admin, superadmin
- Organization filter
- Pagination: 10 per page

**Expected result:** Super Admin can manage all admin users.

**Status:** ✅ Complete — full CRUD with search, filter, CSV export.

---

### 18. Member Management

**Purpose:** Allow Super Admins to view, edit, and delete platform members.

**User:** Super Admin

**Flow:**
1. Navigate to `/superadmin/dashboard/users` (Members section)
2. View members with search and filters (organization, source type)
3. Edit member inline (name, email, age, gender)
4. Delete member with confirmation
5. View member info modal with last assessment answers
6. Export to CSV

**System behavior:**
- Source types: DIRECT, ORGANIZATION, REFERRAL, SELF_REGISTERED
- Member info modal shows demographics + latest assessment details
- Pagination: 10 per page

**Expected result:** Super Admin can manage all platform members.

**Status:** ✅ Complete — view, edit, delete, search, filter, CSV export, info modal.

---

### 19. CSV Export

**Purpose:** Allow admins to export data for offline analysis.

**User:** Organization Admin, Super Admin

**Flow:** User clicks "CSV" button → data exported as CSV file.

**System behavior:**
- Organizations: full details, contacts only, emails only
- Admins: full details, contacts only, emails only
- Members: full details, contacts only, emails only
- Client-side generation via `CsvExport` component

**Expected result:** User downloads a CSV file with selected data.

**Status:** ✅ Complete — multi-mode export available.

---

### 20. i18n (Multi-language Support)

**Purpose:** Make the platform accessible to users in multiple languages.

**User:** All users

**Flow:** User selects language via language switcher → UI updates to selected language.

**System behavior:**
- Supported languages: English (en), Hindi (hi), Marathi (mr), Bengali (bn), Tamil (ta), Telugu (te), Gujarati (gu), Kannada (kn), Punjabi (pa), Oriya (or)
- Locale stored in cookie (`app_locale`)
- Next-intl used for translations
- Assessment questions translated client-side via `translateAssessment`
- RTL support infrastructure exists (`dirForLocale`)

**Expected result:** UI and assessment are available in 10 languages.

**Status:** ✅ Complete — 10 languages supported.

---

### 21. TTS (Text-to-Speech)

**Purpose:** Provide audio assistance for accessibility.

**User:** All users (especially those with visual impairments)

**Flow:** User clicks TTS button → text is spoken aloud.

**System behavior:**
- ElevenLabs provider used (replaces FreeTTS)
- TTS buttons on assessment questions and form labels
- Automatic error speech
- Manual-only on assessment questionnaire (no auto-read)

**Expected result:** Users can hear assessment questions and labels spoken.

**Status:** ✅ Complete — ElevenLabs integration.

---

### 22. Assessment Resume/Restart

**Purpose:** Allow users to resume an in-progress assessment or start over.

**User:** Member

**Flow:**
1. User starts assessment but closes modal
2. User reopens assessment → system detects in-progress assessment
3. Options: "Resume" (continue from last question) or "Start Over" (abandon previous, start fresh)
4. If all questions already answered, auto-submit on resume

**System behavior:**
- `createMemberAndStartAssessment` returns `hasExistingAssessment` flag
- `resumeIndex` indicates where to resume
- `existingAnswers` restores previous selections
- `abandonAndRestartAssessment` creates new assessment and clears old one

**Expected result:** User never loses progress on an assessment.

**Status:** ✅ Complete — resume/restart with answer restoration.

---

### 23. Organization Link Sharing

**Purpose:** Allow organizations to share a unique link for members to join.

**User:** Organization Admin

**Flow:**
1. Admin views organization link on admin dashboard
2. Copies link (e.g., `/[uniqueCode]`)
3. Shares with members
4. Member opens link → org code auto-detected and locked in assessment form

**System behavior:**
- Unique code generated per organization link
- Path-based detection: `/AB0001` format
- Org code locked in assessment form when detected from URL
- Toggle active/paused from admin dashboard

**Expected result:** Members can join an organization via a shared link.

**Status:** ✅ Complete — link generation, sharing, auto-detection, toggle.

---

### 24. White-label Settings

**Purpose:** Allow organizations to customize branding.

**User:** Organization Admin

**Flow:** Admin navigates to white-label settings → uploads logo, enters company name → branding applied to reports and dashboard.

**System behavior:**
- Fields: branding_logo, branding_company
- Stored in organizations table
- Used in PDF report header

**Expected result:** Organization's brand appears on reports and dashboard.

**Status:** ⚠️ Partial — settings page and API exist; full integration across all org-facing pages may be incomplete.

---

### 25. Audit Log

**Purpose:** Track platform actions for compliance and security.

**User:** Super Admin

**Flow:** Super Admin navigates to audit page → views log of platform actions.

**System behavior:**
- Route exists: `/superadmin/dashboard/audit`
- API route exists: `/api/admin-audit`
- Specific log entries and retention policy not visible in frontend code

**Expected result:** Super Admin can review platform activity.

**Status:** ⚠️ Partial — route and API exist; content and depth not verified.

---

### 26. Consultation Leads

**Purpose:** Capture and manage consultation requests from members.

**User:** Super Admin

**Flow:**
1. Member submits consultation request
2. Lead stored via `/api/consultation-leads`
3. Super Admin views leads on `/superadmin/dashboard/consultations`

**System behavior:**
- API route exists
- Super Admin page exists
- Lead details and routing not fully verified

**Expected result:** Consultation requests are captured and viewable.

**Status:** ⚠️ Partial — API and route exist; full management UI not verified.

---

### 27. Notifications

**Purpose:** Send email or in-app notifications to users.

**User:** All users

**System behavior:** Not implemented in current codebase.

**Expected result:** Users receive notifications for key events.

**Status:** ⏳ Future — no implementation found.

---

### 28. Assessment History

**Purpose:** Show members their past assessments with trends and comparisons.

**User:** Member

**System behavior:** Members can see a list of reports but not a detailed history view with score trends over time.

**Expected result:** Member can view and compare past assessments.

**Status:** ⏳ Future — basic report list exists; detailed history not implemented.

---

### 29. Progress Tracking

**Purpose:** Help members track improvements in sleep quality and energy over time.

**User:** Member

**System behavior:** Not implemented.

**Expected result:** Member sees progress charts and trend analysis.

**Status:** ⏳ Future.

---

### 30. Sleep Tracking Integration

**Purpose:** Import real sleep data from wearables and sleep trackers.

**User:** Member

**System behavior:** Not implemented.

**Expected result:** Member can connect wearable devices for enhanced insights.

**Status:** ⏳ Future.

---

## Feature Dependency Map

```
Landing Page
  └── Assessment Flow
        └── Member Registration
              └── Authentication
                    └── Member Dashboard
                          ├── Chronotype Result
                          ├── Energy Curve
                          ├── Recommendations
                          ├── PDF Report
                          ├── Public Sharing
                          ├── Referrals
                          ├── Consultation
                          └── Donation

Authentication
  ├── Organization Admin Dashboard
  │     ├── Organization Link Sharing
  │     ├── Participant Management
  │     ├── Reports & Analytics
  │     └── White-label Settings
  └── Super Admin Dashboard
        ├── Organization Management
        ├── Admin Management
        ├── Member Management
        ├── CSV Export
        ├── Audit Log
        └── Consultation Leads
```

---

*This document reflects the current state of the codebase. Features marked "To Be Confirmed" require additional information from the business or technical team.*
