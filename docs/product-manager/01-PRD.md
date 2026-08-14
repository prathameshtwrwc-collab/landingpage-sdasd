# 01 — Product Requirements Document (PRD)

**SDASD Sleep Chronotype & Sleep Wellness Platform**  
**Version:** 1.0  
**Date:** 2026-08-14  
**Status:** Current state based on codebase inspection

---

## 1. Product Overview

The **Sleep Chronotype & Sleep Wellness Platform** is a web-based health-tech platform that helps individuals discover their natural sleep chronotype — Lark (morning type), Eagle (intermediate), or Owl (evening type) — and provides personalized wellness guidance to improve sleep quality and daily energy.

The platform serves three audiences:
- **General public** (members) who take an assessment and receive a chronotype report
- **Organizations** (corporate, healthcare, education, NGO) that run sleep wellness programs for their members
- **Platform administrators** who manage organizations, users, and platform-wide settings

The product is positioned as an **educational wellness tool**, not a medical diagnostic instrument. All reports include a disclaimer stating that the assessment is for wellness guidance only and is not a medical diagnosis.

---

## 2. Problem Being Solved

Many people struggle with:
- Not understanding their natural sleep-wake rhythm
- Mismatched work/social schedules vs. biological peak times
- Low energy, poor sleep quality, and daytime fatigue
- Lack of personalized, actionable sleep guidance

Organizations (employers, healthcare providers, educational institutions) lack an easy-to-deploy, branded sleep wellness program that provides individual insights and aggregate analytics.

---

## 3. Business Objective

1. **Empower individuals** with personalized chronotype insights to improve sleep hygiene and daily performance.
2. **Enable organizations** to run structured sleep wellness programs with participant tracking and reporting.
3. **Build a scalable platform** for multi-tenant organization management with role-based access.
4. **Generate leads** for sleep specialist consultations and collect donations to support wellness programs.

---

## 4. Target Users

| User Type | Description |
|-----------|-------------|
| **General Member** | Individual who takes the assessment, views their chronotype result, downloads reports, and may book a consultation |
| **Organization Member** | Individual who joins via an organization link or referral code and takes the assessment |
| **Organization Admin** | Manages an organization's sleep wellness program, views participant data, analytics, and org settings |
| **Super Admin** | Platform-level administrator who manages all organizations, admins, members, and platform settings |
| **Sleep Specialist** | Receives consultation leads from members (via the consultation modal) |
| **Donor/Supporter** | User who makes a donation to support the platform's mission |

---

## 5. Product Value

### For Members
- **Self-awareness:** Discover their chronotype (Lark, Eagle, Owl) in ~2 minutes
- **Personalized guidance:** Receive tailored recommendations for sleep, focus, and energy
- **Actionable insights:** View ideal wake time, bedtime, and peak focus windows
- **Shareable results:** Share chronotype results with friends via link
- **Professional support:** Book a consultation with a sleep specialist
- **Visual report:** Download a beautifully designed PDF report

### For Organizations
- **Branded wellness program:** Deploy sleep wellness under their own brand
- **Participant tracking:** Monitor assessment completion rates and chronotype distribution
- **Analytics:** View engagement metrics, progress, and aggregate data
- **Link sharing:** Share a unique organization link for members to join
- **CSV export:** Export member and admin data for external analysis

### For Super Admins
- **Platform oversight:** View platform-wide stats (organizations, members, assessments)
- **Full CRUD:** Create, edit, delete organizations, admins, and members
- **System management:** Toggle organization link active/paused status
- **Audit trail:** Access audit logs and consultation leads
- **Platform settings:** Manage global configuration

---

## 6. Current Scope

### What Exists Today

| Area | Status |
|------|--------|
| Public landing page (14 sections) | ✅ Complete |
| Assessment (personal details + 11 questions) | ✅ Complete |
| Chronotype classification (Lark / Eagle / Owl) | ✅ Complete |
| Member dashboard with result + energy curve | ✅ Complete |
| PDF report generation (client-side, A4, multi-page) | ✅ Complete |
| Public result sharing page | ✅ Complete |
| Referral link system | ✅ Complete |
| Consultation booking modal | ✅ Complete |
| Donation modal | ✅ Complete |
| Organization Admin dashboard | ✅ Complete |
| Super Admin dashboard | ✅ Complete |
| Clerk authentication (email + password) | ✅ Complete |
| Role-based access (Member, Org Admin, Super Admin) | ✅ Complete |
| i18n (English + 9 Indian languages) | ✅ Complete |
| TTS (text-to-speech) support | ✅ Complete |
| Responsive design (mobile, tablet, desktop) | ✅ Complete |
| CSV export (organizations, admins, members) | ✅ Complete |
| Organization link management | ✅ Complete |
| Member search & filtering | ✅ Complete |
| Admin user management (CRUD) | ✅ Complete |
| Organization CRUD | ✅ Complete |

---

## 7. Main Features

### Landing Page
A healthcare-editorial style public page with 14 sections covering sleep science, chronotype introduction, optimization tips, pillars of daily energy, better sleep benefits, why sleep matters, sleep cycles, common sleep disorders, warning signs, sleep facts, additional guidance, FAQ, and disclaimer.

### Assessment
A modal-based assessment flow:
1. Personal details form (name, age, gender, marital status, location, occupation, contact info)
2. 11 multiple-choice questions covering sleep habits, energy patterns, and lifestyle
3. Terms and privacy agreement
4. Submit → instant result with chronotype classification

### Member Dashboard
- Chronotype result display with confidence score
- Energy curve visualization (24-hour personalized chart)
- Recommendations panel
- Reports list with PDF download
- Referral link with share/copy
- Result sharing
- Consultation booking
- Donation support
- Retest option

### Admin Dashboard
- Organization stats (total members, completed/in-progress/not-started assessments)
- Assessment activity chart
- Chronotype distribution
- Organization link management
- Participant list with search
- Reports and analytics
- Settings management
- Notifications
- Team management
- White-label branding

### Super Admin Dashboard
- Platform overview (organizations, members, assessments, admins)
- Chronotype distribution platform-wide
- Member source distribution
- Organization management (CRUD, CSV export, link toggle)
- Admin management (CRUD, CSV export)
- Member management (view, edit, delete, search, filter)
- Audit logs
- Consultation leads
- Reports and analytics
- Platform settings

### PDF Report
Multi-page A4 PDF generated client-side using `@react-pdf/renderer`:
- Page 1: Header, participant info, chronotype hero, schedule, strengths/watch-outs, next steps
- Gallery pages: Visual journey through chronotype imagery
- Recommendations page: Personalized daily guidance
- Disclaimer on every page

---

## 8. Current Status

| Component | Status |
|-----------|--------|
| Frontend (Next.js 16) | ✅ Production-ready |
| Authentication (Clerk) | ✅ Integrated |
| Database (Supabase + Drizzle ORM) | ✅ Schema deployed |
| Assessment engine | ✅ Functional |
| PDF generation | ✅ Client-side working |
| i18n | ✅ 10 languages |
| TTS | ✅ ElevenLabs integrated |
| Admin dashboards | ✅ Functional |
| Super Admin dashboards | ✅ Functional |
| CSV export | ✅ Functional |
| Organization management | ✅ Functional |
| Consultation leads API | ✅ Exists |
| Donation modal | ✅ UI present |
| Server-side PDF API | ❌ Returns 501 (client-side only) |

---

## 9. Known Limitations

1. **Scoring algorithm is server-side:** The exact formula for chronotype classification is not visible in the frontend code. It is calculated by the backend. The formula, weights, and thresholds are **To Be Confirmed** and should be documented by the business/data science team.

2. **PDF generation is client-side only:** Server-side PDF generation API (`/api/reports/generate`) returns 501 Not Implemented. PDFs are generated in the browser using `@react-pdf/renderer`.

3. **Placeholder assets:** Many images in the landing page use `placehold.co` placeholders. Final branded assets need to be replaced.

4. **Password reset:** The login UI shows a "Forgot password?" button, but the actual reset flow depends on Clerk and may not be fully customized.

5. **No email notifications:** The platform does not appear to have automated email notifications for assessment completion, report availability, or consultation follow-ups.

6. **Assessment history:** Members can see a list of reports but not a detailed timeline of past assessment attempts with score comparisons.

7. **No sleep tracking integration:** The platform does not integrate with wearable devices or sleep tracking apps.

8. **Donation flow:** The donation modal UI exists, but payment processing integration is not visible in the codebase.

---

## 10. Future Opportunities

| Opportunity | Description | Priority |
|-------------|-------------|----------|
| Assessment history & trends | Show members how their sleep patterns change over time with multiple assessments | P1 |
| Progress tracking dashboard | Track improvements in sleep quality, energy levels, and adherence to recommendations | P1 |
| Notifications | Email/in-app notifications for assessment results, consultation updates, weekly tips | P1 |
| Organization wellness analytics | Advanced org-level insights: engagement trends, anonymized benchmarks, department comparisons | P2 |
| Advanced reports | Custom date ranges, comparative reports, team summaries, PDF batch export | P2 |
| Sleep tracking integration | Connect with wearables (Fitbit, Apple Watch, Oura) for real sleep data import | P2 |
| AI-assisted recommendations | Machine-learning-based personalized tips based on assessment history and user feedback | P2 |
| Gamification | Badges, streaks, challenges to improve engagement and retention | P3 |
| White-label enhancements | Custom domains, advanced branding, co-branded reports | P3 |
| Mobile apps | Native iOS/Android apps for better engagement and push notifications | P3 |
| Sleep diary | Daily logging of sleep duration, quality, and factors | P2 |
| Community features | Member forums, sleep tips sharing, peer support | P3 |
| Coach/employer dashboards | Dedicated views for coaches, HR teams, or healthcare providers | P2 |

---

## 11. Brand Positioning

**Tagline:** *"Sleep is the Foundation. Sleep Chronotype is the Blueprint. Better Sleep, Better Energy, Better Life."*

**Brand identity:**
- Healthcare awareness campaign, NOT a SaaS dashboard
- Approachable, optimistic, reassuring, clinical but warm
- Brochure-inspired editorial layout with white backgrounds and gold dividers
- Primary colors: Orange (#F59A00) and Indigo (#35319B / #3B35A3)
- Typography: Poppins (400, 500, 600, 700)
- Flat rectangular CTAs, square corners, minimal decoration
- Not a medical tool — educational wellness guidance only

---

## 12. Glossary

| Term | Definition |
|------|------------|
| **Chronotype** | A person's natural tendency to sleep at a particular time during a 24-hour period |
| **Lark** | Morning-type chronotype — peaks early, winds down early |
| **Eagle** | Intermediate chronotype — adaptable, peaks midday |
| **Owl** | Evening-type chronotype — peaks late, prefers later schedules |
| **Assessment** | The questionnaire that determines a user's chronotype |
| **Report** | A PDF document summarizing the user's chronotype result and recommendations |
| **Organization** | A company, institution, or group that uses the platform for sleep wellness programs |
| **Organization Link** | A shareable URL (e.g., `/[uniqueCode]`) that pre-fills the organization code for new members |
| **Referral Code** | A unique code assigned to members for sharing the platform |
| **Consultation** | A booking request to speak with a sleep specialist |
| **White-label** | Custom branding options for organizations (logo, company name) |

---

*This PRD is based on the current codebase as of 2026-08-14. It reflects actual implemented features only. Business rules, scoring logic, and roadmap items marked "To Be Confirmed" require stakeholder validation.*
