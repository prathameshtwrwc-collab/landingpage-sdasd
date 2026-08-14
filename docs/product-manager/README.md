# Product Manager Documentation — Sleep Chronotype & Wellness Platform

**SDASD Product Manager Documentation Package**
**Version:** 1.0  
**Date:** 2026-08-14  
**Status:** Draft — Based on current codebase inspection

---

## Document Index

| # | Document | Purpose |
|---|----------|---------|
| 1 | [README.md](./README.md) | This entry point — PM review, status, priorities |
| 2 | [SRS.md](./SRS.md) | Software Requirements Specification |
| 3 | [01-PRD.md](./01-PRD.md) | Product Requirements Document |
| 4 | [02-Feature-Requirements.md](./02-Feature-Requirements.md) | Feature-by-feature requirements |
| 5 | [03-User-Flows.md](./03-User-Flows.md) | Member, Admin, Super Admin flows |
| 6 | [04-User-Roles-Permissions.md](./04-User-Roles-Permissions.md) | Roles, permissions matrix |
| 7 | [05-UI-UX-Specification.md](./05-UI-UX-Specification.md) | Design system & UX spec |
| 8 | [06-Assessment-Result-Logic.md](./06-Assessment-Result-Logic.md) | Assessment & scoring logic |
| 9 | [07-Product-Roadmap.md](./07-Product-Roadmap.md) | Roadmap & priorities |
| 10 | [08-Analytics-Requirements.md](./08-Analytics-Requirements.md) | Analytics requirements |
| 11 | [09-Technical-Architecture-Overview.md](./09-Technical-Architecture-Overview.md) | PM-friendly architecture |
| 12 | [10-UAT-Testing.md](./10-UAT-Testing.md) | UAT test cases |

---

## Product Manager Review

### Completed (Current / In Production)

- Public landing page with 14 editorial sections (healthcare brochure style)
- Assessment modal with personal details form and 11 questions
- Member registration via assessment (no separate sign-up page)
- Clerk-based authentication (email + password)
- Three-role system: Member, Organization Admin, Super Admin
- Member dashboard with chronotype result, energy curve, recommendations, reports list
- PDF report generation (client-side, multi-page A4)
- Public result sharing page (`/r/[assessmentId]`)
- Referral link system with share/copy
- Consultation booking modal (pre-filled from member data)
- Donation modal
- Organization Admin dashboard with stats, participants, reports, analytics, settings, notifications, team, white-label, share-link
- Super Admin dashboard with platform stats, organizations CRUD, admins CRUD, members management, CSV export, audit log
- i18n support (English + 9 Indian languages: Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, Kannada, Punjabi, Oriya)
- TTS (text-to-speech) support via ElevenLabs
- Assessment resume/restart for in-progress assessments
- Responsive design (mobile, tablet, desktop)
- Skeleton loading states
- Error handling with user-friendly messages

### In Progress (Partially Implemented)

- Admin dashboard sub-pages (reports, analytics, notifications, team, white-label, share-link) — routes and basic UI exist; full functionality may be incomplete
- Super Admin sub-pages (reports, settings, audit, consultations, assessments, analytics) — routes exist; depth of implementation varies
- Organization link management (create, toggle active/paused) — UI exists, backend may need verification
- Member detail modal with last assessment answers — UI exists
- CSV export for organizations, admins, members — UI exists
- White-label settings for organizations — route exists
- Consultation leads API — route exists

### Pending (Not Yet Implemented)

- Separate registration/sign-up page independent of assessment
- Password reset/forgot password flow (UI hint exists but backend flow may be incomplete)
- Email verification flow
- Assessment history timeline on member dashboard
- Progress tracking over time (multiple assessments comparison)
- Weekly/monthly sleep insights
- Push notifications / email notifications
- Organization wellness analytics dashboard
- Advanced reporting (trends, benchmarks)
- Gamification features
- Sleep tracking integration (wearables)
- AI-assisted wellness recommendations
- Mobile native apps

### Product Decisions Required

1. **Scoring formula:** The exact algorithm that converts assessment answers into Lark/Eagle/Owl scores and confidence percentage is not visible in the frontend code. It is calculated server-side. **To Be Confirmed by Product/Business Team.**
2. **Recommendation engine:** How recommendations are generated and mapped to specific chronotypes and scores. **To Be Confirmed.**
3. **Consultation workflow:** Is consultation a paid service? How are leads routed? What is the SLA? **To Be Confirmed.**
4. **Organization onboarding:** Who creates organizations — Super Admin only, or self-service? Current UI suggests Super Admin creates orgs.
5. **Referral program rules:** Are there incentives? Limits? Reward tiers?
6. **Donation flow:** Is this integrated with a payment provider? Current implementation shows a modal but payment processing is not visible.
7. **Data retention:** How long is assessment data kept? Can members delete their data?
8. **White-label branding:** What brand assets can organizations customize? Current fields: logo, company name.

### Top 5 Recommended Priorities

1. **P0 — Verify & document the scoring algorithm**  
   The core product value depends on accurate, validated chronotype classification. Work with the data science/business team to document the exact formula, weights, and thresholds.

2. **P0 — Complete the Admin & Super Admin feature depth**  
   Several admin routes exist but may lack full backend support or data enrichment. Prioritize making the admin dashboards fully functional with real data and CRUD operations.

3. **P1 — Add assessment history & progress tracking**  
   Members currently see only their latest result. Adding historical trends (sleep patterns over time, score changes) would significantly increase engagement and retention.

4. **P1 — Implement notification system**  
   Add email or in-app notifications for assessment completion, report availability, and consultation follow-ups. This is critical for re-engagement.

5. **P2 — Mobile-responsive optimization for admin dashboards**  
   Admin and Super Admin dashboards are primarily desktop-focused. Ensure all tables, charts, and forms are usable on tablets and mobile devices for on-the-go management.

---

## How to Use This Documentation

- **Product Managers:** Start with [01-PRD.md](./01-PRD.md), then review [02-Feature-Requirements.md](./02-Feature-Requirements.md) and [07-Product-Roadmap.md](./07-Product-Roadmap.md).
- **Client Stakeholders:** Review [01-PRD.md](./01-PRD.md) for business context, [07-Product-Roadmap.md](./07-Product-Roadmap.md) for future plans, and [10-UAT-Testing.md](./10-UAT-Testing.md) for quality assurance.
- **Designers:** Review [05-UI-UX-Specification.md](./05-UI-UX-Specification.md) for the current design system and proposed improvements.
- **Developers:** Review [09-Technical-Architecture-Overview.md](./09-Technical-Architecture-Overview.md) for system context.
- **QA/Testers:** Use [10-UAT-Testing.md](./10-UAT-Testing.md) as the UAT checklist.

---

*All documentation is based solely on the current codebase. Features not found in the code are labeled "To Be Confirmed" or "Proposed/Future."*
