# CHRONOTYPE - Dashboard Pages Complete Guide

This document describes EVERY dashboard page across all three roles (Member, Admin/Org Admin, Super Admin).
For each page, it details: what it displays, what components it uses, what data it needs,
how to make it functional with real database queries, and what buttons/modals exist with their submit behavior.

---

## SHARED COMPONENTS REFERENCE

All dashboards use these shared components from @/components/PortalLayout:
- PageHeader({ eyebrow, title, sub, action }) - the page title section
- Card({ children, className }) - rounded-2xl card container with fade-up animation
- Stat({ label, value, delta, color }) - stat card with label, large value, optional delta text

From @/components/charts:
- MiniLine({ data, color, h }) - SVG line chart with gradient fill
- Bars({ data, color, h }) - vertical bar chart
- Ring({ value, size, color, label }) - donut progress ring chart

From @/components/ui:
- GoldButton({ children, to, onClick }) - primary CTA button (gold gradient, rounded-full)
- GhostButton({ children, to, dark }) - secondary outline button
- Wordmark({ dark }) - CHRONOTYPE logo
- CircadianOrbit({ className }) - orbital brand motif

Layout: PortalLayout({ nav, badge, badgeColor, children }) - renders sidebar + header + main area

Navigation items: { label, href, icon }[]
  memberNavItems - 9 items (Dashboard, Sleep Score, Chronotype, Energy, Blueprint, Recommendations, Progress, Goals, Profile)
  adminNavItems - 6 items (Dashboard, Participants, Results, Analytics, Share Link, Settings)
  superadminNavItems - 5 items (Command Center, Organizations, Users, Reports, Settings)

---

## SECTION 1: MEMBER DASHBOARD (9 pages)

All member pages use:
- Layout: MemberLayout wrapping PortalLayout with memberNavItems
- Badge: Member with bg-gold/20 text-gold
- Auth: Email-based (no Clerk required). Email in sessionStorage.getItem("memberEmail")

---

### 1.1 Member - Dashboard (app/member/page.tsx) [ALREADY CONNECTED]

Connected via GET /api/member?email=X.

What it displays:
- EmailLogin component (when no email) - centered card with email input
- Loading spinner while fetching
- Error card with retry button
- Main dashboard: PageHeader with welcome + chronotype badge
- Left card: member since date, MiniLine trend chart
- Right card: Ring chart with confidence_score
- 4 Stat cards: Assessments, Chronotype, Recommendations, Email
- Two cards: Recommendations list + Assessment history table
- "+ Take New Assessment" button

Data source: GET /api/member?email=X returns getMemberDashboard(memberId)

Buttons & behavior:
- "View My Dashboard" - fetches dashboard by email, stores email in sessionStorage
- "Switch Account" - clears sessionStorage, shows EmailLogin again
- "Take Assessment" / "+ Take New Assessment" - import and toggle AssessmentModal component
- Assessment history: COMPLETED=green badge, STARTED=amber badge

---

### 1.2 Member - Sleep Score (app/member/score/page.tsx) [NEEDS REAL DATA]

Currently uses MOCK data from memberScoreBreakdown and memberTrendData.

What it displays:
- PageHeader: "Sleep Score - 86 - Excellent"
- Overall Ring chart centered in first card
- Score breakdown: 4 labeled bars (Duration, Depth, Timing, Recovery) with percentages
- 30-day trend MiniLine chart at bottom

Components used: PageHeader, Card, Ring, MiniLine

Data needed:
- Overall sleep score (calculated from chronotype_results or separate scoring)
- Score breakdown: 4 categories with percentages
- Trend array: 16+ values for MiniLine

How to make functional (replace mock imports):
1. Get memberId from sessionStorage.getItem("memberEmail") and fetch via API
2. Create a server action getMemberScoreData(memberId) that:
   - Fetches latest chronotype_result for confidence_score as "overall"
   - Returns breakdown percentages (can be computed or stored)
   - Returns trend data from historical results
3. Suggested data shape: { overall: number, breakdown: [{label, value, color}], trend: number[] }
4. If no data exists, show empty state with "Take Assessment" button

---

### 1.3 Member - Chronotype (app/member/chronotype/page.tsx) [NEEDS REAL DATA]

Currently uses hardcoded Eagle data.

What it displays:
- PageHeader: "You are an {chronotype}" with confidence subtitle
- Card 1: CircadianOrbit animation + chronotype name + tagline
- Card 2: "What this means for you" description
- 3 info cards: Peak Focus, Creative Window, Ideal Sleep times

Components used: PageHeader, Card, CircadianOrbit

Data needed:
- Latest chronotype_result: chronotype, confidence_score, lark_score, eagle_score, owl_score
- Hardcoded descriptions per chronotype (LARK/EAGLE/OWL)
- Hardcoded peak times per chronotype

How to make functional:
1. Fetch getMemberDashboard(memberId).result
2. Create a constant CHRONOTYPE_PEAK_TIMES map:
   - LARK: Focus "6-9 AM", Creative "4-6 PM", Sleep "9:30 PM"
   - EAGLE: Focus "9-11 AM", Creative "5-7 PM", Sleep "10:45 PM"
   - OWL: Focus "2-5 PM", Creative "10 PM-1 AM", Sleep "12:30 AM"
3. Create CHRONOTYPE_DESCRIPTIONS per type (already exists in AssessmentModal.tsx)
4. Pass result.chronotype, result.confidence_score to template
5. Show empty state with "Take Assessment" if no result exists

---

### 1.4 Member - Energy Timeline (app/member/energy/page.tsx) [NEEDS REAL DATA]

Currently uses MOCK data from memberEnergyCurve, memberEnergyLabels, memberEnergyCards.

What it displays:
- PageHeader: "Your 24-hour rhythm"
- Large MiniLine chart across 24 hours with time labels
- 4 cards: Focus Peak, Afternoon Dip, Creative Surge, Sleep Prep with times

Components used: PageHeader, Card, MiniLine

Data needed:
- Energy curve: 12 values (every 2 hours from 6 AM to 4 AM next day)
- This is DERIVED data based on chronotype - NOT stored in DB
- Peak times are also derived from chronotype

How to make functional:
1. Create utility function generateEnergyCurve(chronotype) returning 12 values:
   - LARK: peaks early [25,45,65,85,90,80,70,60,50,35,20,15]
   - EAGLE: balanced [30,45,65,80,88,85,78,70,72,60,42,28]
   - OWL: peaks late [15,20,25,35,50,65,75,85,88,80,60,40]
2. Create utility function generateEnergyCards(chronotype) returning 4 cards
3. Import and call these functions with the member's chronotype
4. If no chronotype result, show empty state with "Take Assessment" button

---

### 1.5 Member - Sleep Blueprint (app/member/blueprint/page.tsx) [NEEDS REAL DATA]

Currently uses MOCK data from memberBlueprintCards.

What it displays:
- PageHeader: "Your personal blueprint"
- 4 cards: Chronotype, Optimal Sleep Window, Sleep Need, Cycle Length
- Bottom card: CircadianOrbit + "Blueprint completeness" progress + "View Recommendations" button

Components used: PageHeader, Card, CircadianOrbit, GoldButton

Data needed:
- Chronotype from latest result
- Computed values per chronotype (hardcoded defaults):
  - LARK: window "9:30 PM - 5:30 AM", need 7h30m, cycle ~90min
  - EAGLE: window "10:45 PM - 6:30 AM", need 7h45m, cycle ~96min
  - OWL: window "12:30 AM - 8:30 AM", need 8h00m, cycle ~100min
- Blueprint completeness = min(100, assessments.length * 25)
- Assessment count from getMemberDashboard(memberId).assessments.length

How to make functional:
1. Create computeBlueprint(chronotype, assessmentsCount) returning 5 values
2. Fetch member data, compute blueprint
3. Replace mock imports
4. "View Recommendations" button routes to /member/recommendations
5. If no assessments, show empty state

---

### 1.6 Member - Recommendations (app/member/recommendations/page.tsx) [NEEDS REAL DATA]

Currently uses MOCK data from memberRecommendations.

What it displays:
- PageHeader: "Recommendations - Tuned to your biology"
- Grid of recommendation cards: icon, category (gold uppercase), title (serif), description
- Cards have hover effect (bg-ivory/[0.07])

Components used: PageHeader, Card

Data needed:
- recommendations from member_recommendations JOIN recommendations table
- Fields: chronotype, title, description, category, icon, priority_order

How to make functional:
1. Replace mock import with:
   const { data } = await getMemberDashboard(memberId);
   const recommendations = data?.recommendations ?? [];
2. The shape already matches: { id, title, description, category, icon }
3. Map icon field as emoji or SVG icon
4. If no recommendations, show "Complete an assessment to get personalized recommendations."

---

### 1.7 Member - Progress (app/member/progress/page.tsx) [NEEDS REAL DATA]

Currently uses MOCK data from memberMilestones.

What it displays:
- PageHeader: "Your journey so far"
- 3 Stat cards: Score growth (+18), Streak (24 nights), Best week (91 avg)
- MiniLine chart: "Sleep score - 90 days" with trend
- Two cards: Milestones with checkmarks + Deep sleep trend Bars chart

Components used: PageHeader, Card, Stat, MiniLine, Bars

Data needed (all DERIVED from chronotype_results):
- Score growth = latest.confidence_score - first.confidence_score
- Streak = count of consecutive days with completed assessments
- Best week = max average in any 7-day window
- Trend = results sorted by generated_at mapped to confidence_score
- Milestones = hardcoded, checked against data conditions:
  - "First full blueprint" = has at least 1 result
  - "7-day consistency" = streak >= 7
  - "Excellent tier" = any confidence_score >= 80
  - "30 nights" = total assessments >= 30

How to make functional:
1. Fetch all chronotype_results for member ordered by generated_at
2. Create a calculateProgress(results) utility function
3. Replace mock imports
4. If no results, show empty state with "Take Assessment" button

---

### 1.8 Member - Goals (app/member/goals/page.tsx) [NEEDS REAL DATA]

Currently uses MOCK data from memberGoals.

What it displays:
- PageHeader: "Goals" with "Add Goal" button
- Grid of goal cards: title, progress %, progress bar (gold gradient), detail text

Components used: PageHeader, Card, GoldButton

Data needed:
- Goals from member_goals table (already exists in schema):
  { id, member_id, title, description, category, target_date, status, created_at, updated_at }
- progress can be stored as a field or calculated

How to make functional:
1. Create server action getMemberGoals(memberId):
   await supabase.from("member_goals").select("*").eq("member_id", memberId).eq("status", "ACTIVE")
2. Replace mock data
3. If no goals, show "Set your first sleep goal" with "Add Goal" button

Add Goal modal/form behavior:
- Opens a modal with fields: title (required), description, category (dropdown: sleep/energy/nutrition/movement/recovery), target_date
- On submit, calls createGoal(memberId, formData):
  await supabase.from("member_goals").insert({ member_id, title, description, category, target_date })
- After success: refresh goals list
- Delete/complete: calls supabase.from("member_goals").update({ status: "COMPLETED" }).eq("id", goalId)

---

### 1.9 Member - Profile (app/member/profile/page.tsx) [NEEDS REAL DATA]

Currently uses MOCK data from memberProfileDetails.

What it displays:
- PageHeader: "Account & preferences"
- Left card: Avatar circle with gradient initials, name, chronotype, member since date
- Right card: Grid of detail fields (Email, Timezone, Wake target, Sleep target, Notifications, Data sharing)

Components used: PageHeader, Card

Data needed:
- member record: first_name, last_name, email, created_at
- Latest chronotype result for display
- Preferences from member.preferences_json (JSONB field):
  { timezone, wake_target, sleep_target, notifications_enabled, data_sharing }

How to make functional:
1. Use getMemberDashboard(memberId).member for base info
2. Parse member.preferences_json for additional fields
3. If preferences_json is null/empty, show "Not set" for preference fields
4. Avatar = first_name[0] + last_name[0] (uppercase) in gradient circle
5. V1: read-only display. No edit functionality needed
6. If no member data, show error state

---

## SECTION 2: ADMIN / ORG ADMIN DASHBOARD (6 pages)

All admin pages use:
- Layout: AdminLayout wrapping PortalLayout with adminNavItems
- Badge: Admin with bg-elegant/40 text-champagne
- Auth: Requires Clerk session with admin or superadmin role
- Data: Scoped to admin's organization (auto-detected from Clerk clerk_user_id)

---

### 2.1 Admin - Dashboard (app/admin/page.tsx) [ALREADY CONNECTED]

Connected via GET /api/admin-portal?resource=dashboard.

What it displays:
- PageHeader: "Organization - {orgName}" with "Share Link" button
- 4 Stat cards: Members, Completed, In Progress, Not Started
- MiniLine chart: chronotype distribution
- Chronotype mix bars (Larks/Eagles/Owls)

Data source: getAdminDashboardStats() returns:
{ orgName, totalMembers, completedAssessments, inProgress, notStarted, chronotypeMix: [{ label, value, color }] }

How it works:
- /api/admin-portal/route.ts calls ensureAdminLinked() finding admin by clerk_user_id or email
- Then calls getAdminDashboardStats() querying by organization_id
- Chronotype mix from chronotype_results for the org
- Error state: shows PageHeader with error text
- Loading state: shows "Your organization dashboard" title

Share Link button: navigates to /admin/share-link to show org unique code

---

### 2.2 Admin - Participants (app/admin/participants/page.tsx) [ALREADY CONNECTED]

Connected via GET /api/admin-portal?resource=members.

What it displays:
- PageHeader: "Members - Organization members" with count
- Table: Member (avatar initials + name), Email, Joined (date), "..." menu

Data source: getAdminMembers() returns [{ id, first_name, last_name, email, created_at }]

How it works:
- Queries members table filtered by admin's organization_id
- Avatar = first_name[0] + last_name[0] in gradient circle
- Empty state: "No members yet"
- V2 enhancements: search, filter, export, "..." menu with options

---

### 2.3 Admin - Results (app/admin/results/page.tsx) [ALREADY CONNECTED]

Connected via GET /api/admin-portal?resource=results.

What it displays:
- PageHeader: "Assessment pipeline" with total/completed counts
- 3 Stat cards: Completed, In Progress, Total
- Bars chart: completion rate (3 bars)
- Table: Recent submissions (name, chronotype, confidence or "In progress")

Data source: getAdminAssessmentResults() returns array of:
{ id, status, started_at, completed_at, members: {first_name, last_name}, chronotype_results: {chronotype, confidence_score} }

How it works:
- Joins assessments + members + chronotype_results filtered by org
- Limited to 50 most recent
- Empty state: "No assessments yet"
- In-progress: no chronotype data, shows "In progress" label

---

### 2.4 Admin - Analytics (app/admin/analytics/page.tsx) [NEEDS REAL DATA]

Currently uses MOCK data from adminAnalyticsData.

What it displays:
- PageHeader: "Deep analytics"
- Grid of analytics cards: title + MiniLine or Bars chart
- Mock: Avg sleep duration, Engagement rate, Score by team, Burnout risk

Components used: PageHeader, Card, MiniLine, Bars

Data needed:
- Computed from assessments + chronotype_results for the org
- Examples: avg scores by week, completion trends, chronotype distribution

How to make functional:
1. Create getAdminAnalytics(organizationId) returning card data
2. Extend /api/admin-portal?resource=analytics endpoint
3. Data computation:
   - Group chronotype_results by week/month for trend
   - Count assessments by status for completion rate
   - Group by department/team for score by team
4. Card data shape: { title: string, data: number[], color: string }
5. Gold/amber colors = MiniLine, blue/other = Bars

---

### 2.5 Admin - Share Link & Reports (app/admin/share-link/page.tsx) [NEEDS REAL DATA]

Currently uses MOCK data from adminReports.

What it displays:
- PageHeader: "Generated reports" with "New Report" button
- Grid of report cards: title, description, date, download arrow

Components used: PageHeader, Card, GoldButton

Two sections needed:

Section 1 - Shareable Link (top priority):
- Fetch: supabase.from("organization_links").select("unique_code").eq("organization_id", orgId).eq("active", true)
- Display: Copyable link text: "{domain}/{unique_code}" with copy button and "Refresh Link" button
- Copy: navigator.clipboard.writeText(fullUrl), shows "Copied!" for 2s
- Refresh: calls refreshOrgLink(orgId) server action, generates new code

Section 2 - Reports (below):
- Fetch: supabase.from("reports").select("*") for org members
- Display as current report cards
- "New Report" button: V2 feature to generate aggregated reports

---

### 2.6 Admin - Settings (app/admin/settings/page.tsx) [NEEDS REAL DATA]

Currently uses MOCK data from adminContentItems.

What it displays:
- PageHeader: "Content Management - Editorial library"
- Table: Title, Type, Status, Updated
- Status badges: Published=green, Draft=gray, Review=amber

How to make functional for V1:
- Show organization profile settings instead (name, type, email, phone, address, country)
- Create server action updateOrgProfile(orgId, formData):
  await supabase.from("organizations").update(data).eq("id", orgId)
- Display pre-filled form fields
- "Save Changes" button calls updateOrgProfile on submit

---

## SECTION 3: SUPER ADMIN DASHBOARD (5 pages)

All superadmin pages use:
- Layout: SuperadminLayout with superadminNavItems
- Badge: Super with gradient gold bg
- Auth: Requires Clerk superadmin role
- Data: Unrestricted - all organizations and members

---

### 3.1 Super Admin - Command Center (app/superadmin/page.tsx) [ALREADY CONNECTED]

Connected via getPlatformStats() server action (Server Component).

What it displays:
- PageHeader with org/member counts
- 4 Stat cards: Organizations, Members, Assessments, Admins
- Chronotype distribution bars (Larks/Eagles/Owls)
- Quick actions: "+ New Organization" and "+ Add Admin" links

Data source: getPlatformStats() returns:
{ organizations, members, assessments, admins, chronotypeDistribution: { lark, eagle, owl } }

Quick action links route to /superadmin/organizations and /superadmin/users.

---

### 3.2 Super Admin - Organizations (app/superadmin/organizations/page.tsx) [ALREADY CONNECTED]

Connected with Create Org form.

What it displays:
- PageHeader with count + "Onboard Org" toggle button
- When toggled: inline form with Name, Type (select), Country, Email + "Create Organization" button
- Table: Organization, Type badge, Code (monospace gold), Status, Country, "..." menu

Data source: GET /api/admin?resource=organizations returns getOrganizations()

Create Organization form behavior:
- Submit: calls createOrganization(formData) server action
- Generates human-readable code using org name initials + sequential number.
  Example: "Aditya Birla" extracts initials "AB", finds last existing code starting with "AB",
  and appends next number padded to 4 digits: AB0001, AB0002, etc.
  "Asia Brown Breweries" becomes ABB0001, "Helios Group" becomes HG0001.
  If the name has only one word, uses first 2 letters: "Cipla" becomes CI0001.
- Inserts into organizations + organization_links tables
- On success: shows "Created! Code: AB0001", closes form, refreshes table
- On error: shows error message, keeps form open

---

### 3.3 Super Admin - Users (app/superadmin/users/page.tsx) [ALREADY CONNECTED]

Connected with Add Admin form.

What it displays:
- PageHeader with count + "Add Admin" toggle button
- When toggled: inline form with First Name, Last Name, Email, Organization (select) + "Add Administrator" button
- Table: Admin (initial avatar + name), Organization, Role, Status, "..." menu

Data sources: GET /api/admin?resource=admins + GET /api/admin?resource=organizations

Add Admin form behavior:
- Submit: calls createOrganizationAdmin(formData) server action
- Validates org exists, inserts into organization_admins
- On success: shows "Admin added successfully", closes form, refreshes table
- On error: shows error message
- Note: Admin still needs Clerk signup - webhook links accounts by email

---

### 3.4 Super Admin - Reports (app/superadmin/reports/page.tsx) [ALREADY CONNECTED]

Connected via GET /api/admin?resource=stats.

What it displays:
- PageHeader: "Worldwide intelligence"
- Platform overview: Organizations, Members, Assessments, Admins with counts
- Chronotype distribution bars

Data source: getPlatformStats() via API

V2 enhancements:
- Date range filter
- Growth trend charts
- Export to CSV/PDF
- Org comparison

---

### 3.5 Super Admin - Settings (app/superadmin/settings/page.tsx) [NEEDS REAL DATA]

Currently uses MOCK data from superadminSettings.

What it displays:
- PageHeader: "Platform settings"
- Grid of settings: Platform name, Primary region, Default plan, Support email, Brand accent, Time format
- "Save Changes" button

How to make functional for V1:
- Create platform_settings table: id, key, value, updated_at
- Create server actions: getPlatformSettings() / updatePlatformSetting(key, value)
- Fetch settings on page load
- "Save Changes": upsert all settings
- Show success/error toast

---

## SECTION 4: SHARED FEATURES

### Assessment Modal
- Trigger: "Take Assessment" / "+ Take New Assessment" buttons on member pages
- Component: AssessmentModal from @/components/AssessmentModal.tsx
- Must be rendered conditionally in member layout or page
- Uses lib/actions/assessment.ts server actions:
  - getAssessmentData() - fetches active version, questions, options from DB
  - createMemberAndStartAssessment(data) - creates/finds member, creates STARTED assessment
  - submitAssessment(assessmentId, answers) - saves answers, calculates chronotype, saves result
- Wiring: import + state toggle + conditional render

### Common UI Patterns
- Loading: Centered spinner (border-2 border-gold border-t-transparent animate-spin)
- Error: Red text in Card with retry button
- Empty: "No {items} yet." text with optional CTA button
- Tables: overflow-x-auto, header uppercase tracking-widest text-ivory/40
- Status badges: rounded-full px-2.5 py-1 text-xs, color-coded

---

## SECTION 5: CONNECTION STATUS SUMMARY

ALREADY CONNECTED TO REAL DATA:
- /member - Dashboard (via /api/member)
- /admin - Dashboard (via /api/admin-portal)
- /admin/participants (via /api/admin-portal)
- /admin/results (via /api/admin-portal)
- /superadmin - Command Center (getPlatformStats server component)
- /superadmin/organizations (via /api/admin + createOrganization)
- /superadmin/users (via /api/admin + createOrganizationAdmin)
- /superadmin/reports (via /api/admin)

STILL NEEDING REAL DATA CONNECTION:
- /member/score - Sleep Score
- /member/chronotype - Chronotype
- /member/energy - Energy Timeline
- /member/blueprint - Sleep Blueprint
- /member/recommendations - Recommendations
- /member/progress - Progress
- /member/goals - Goals
- /member/profile - Profile
- /admin/analytics - Deep Analytics
- /admin/share-link - Share Link & Reports
- /admin/settings - Content Management
- /superadmin/settings - Platform Settings

---

## APPENDIX: Data Shapes

getMemberDashboard(memberId) returns:
{ member: {...}, result: {chronotype, confidence_score, ...} | null, recommendations: [...], assessments: [...] }

getAdminDashboardStats() returns:
{ orgName, totalMembers, completedAssessments, inProgress, notStarted, chronotypeMix: [{label, value, color}] }

getPlatformStats() returns:
{ organizations, members, assessments, admins, chronotypeDistribution: {lark, eagle, owl} }

getOrganizations() returns:
[{ id, name, organization_type, unique_code, status, country, created_at }]

getOrganizationAdmins() returns:
[{ id, first_name, last_name, email, role, status, organization_id, organizations: {name} }]

getAdminMembers() returns:
[{ id, first_name, last_name, email, created_at }]

getAdminAssessmentResults() returns:
[{ id, status, started_at, completed_at, members: {first_name, last_name}, chronotype_results: {chronotype, confidence_score} }]

---

End of DASHBOARD PAGES Complete Guide