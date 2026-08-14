# 07 — Product Roadmap

**SDASD Sleep Chronotype & Wellness Platform**  
**Version:** 1.0  
**Date:** 2026-08-14

---

## Current Status Summary

| Status | Items |
|--------|-------|
| **Completed** | Landing page, assessment, member dashboard, PDF reports, admin dashboards, Super Admin, i18n, TTS, CSV export, organization management, referrals, consultations, donations |
| **In Progress** | Admin sub-pages (notifications, team, white-label, share-link), audit log, consultation leads management |
| **Pending** | Assessment history, progress tracking, notifications, sleep tracking, AI recommendations |
| **Future** | Gamification, mobile apps, community features, coach dashboards |

---

## Roadmap by Priority

### P0 — Critical (Blocking / Must Have)

| # | Item | Description | Status |
|---|------|-------------|--------|
| 1 | **Document scoring algorithm** | Work with data science team to document the exact chronotype scoring formula, weights, and thresholds | To Be Confirmed |
| 2 | **Verify admin backend completeness** | Ensure all admin/Super Admin CRUD operations have full backend support and data validation | In Progress |
| 3 | **Fix placeholder assets** | Replace all `placehold.co` images with final branded assets per ASSET_MANIFEST.md | In Progress |
| 4 | **Security audit** | Verify server-side permission enforcement on all API routes; ensure role checks are not client-side only | To Be Confirmed |

---

### P1 — High (Next Sprint / Quarter)

| # | Item | Description | Status | Business Value |
|---|------|-------------|--------|----------------|
| 1 | **Assessment history & trends** | Show members past assessments with score comparisons over time | Future | Increases engagement and retention; helps users track progress |
| 2 | **Notification system** | Email/in-app notifications for assessment completion, report availability, consultation updates | Future | Re-engages users; improves consultation conversion |
| 3 | **Progress tracking dashboard** | Track sleep quality improvements, adherence to recommendations, and energy trends | Future | Provides long-term value; differentiates from one-shot assessments |
| 4 | **Complete admin sub-pages** | Finish notifications, team management, white-label, share-link, and audit log functionality | In Progress | Makes admin tool production-ready for organizations |
| 5 | **Email automation** | Assessment completion emails, report delivery, consultation confirmations | Future | Reduces support burden; improves user experience |

---

### P2 — Medium (Next Quarter)

| # | Item | Description | Status | Business Value |
|---|------|-------------|--------|----------------|
| 1 | **Organization wellness analytics** | Advanced org-level insights: engagement trends, anonymized benchmarks, department comparisons | Future | Provides organizational value; supports HR/wellness programs |
| 2 | **Advanced reports** | Custom date ranges, comparative reports, team summaries, PDF batch export | Future | Increases platform stickiness for organizations |
| 3 | **Sleep tracking integration** | Connect with wearables (Fitbit, Apple Watch, Oura) for real sleep data import | Future | Enhances assessment accuracy; provides ongoing value |
| 4 | **AI-assisted recommendations** | Machine-learning-based personalized tips based on assessment history and user feedback | Future | Differentiates product; improves recommendation relevance |
| 5 | **Sleep diary** | Daily logging of sleep duration, quality, and influencing factors | Future | Provides richer data for insights; increases engagement |
| 6 | **Mobile-responsive admin dashboards** | Ensure all admin tables, charts, and forms are usable on tablets and mobile | Partial | Enables on-the-go management |

---

### P3 — Future (Vision / Exploration)

| # | Item | Description | Status | Business Value |
|---|------|-------------|--------|----------------|
| 1 | **Gamification** | Badges, streaks, challenges to improve engagement and retention | Future | Increases daily active usage; builds habit formation |
| 2 | **Mobile apps** | Native iOS/Android apps for better engagement and push notifications | Future | Reaches wider audience; improves accessibility |
| 3 | **Community features** | Member forums, sleep tips sharing, peer support groups | Future | Builds community; increases platform stickiness |
| 4 | **Coach/employer dashboards** | Dedicated views for coaches, HR teams, or healthcare providers | Future | Expands B2B use cases; supports enterprise clients |
| 5 | **White-label enhancements** | Custom domains, advanced branding, co-branded reports | Partial | Increases organizational value; supports agency/consultant use |
| 6 | **Consultation marketplace** | Browse and book sleep specialists, rating system, session tracking | Future | Creates revenue stream; improves consultation experience |
| 7 | **API for partners** | Public API for third-party integrations (wearables, EHR, wellness platforms) | Future | Enables ecosystem growth; B2B expansion |
| 8 | **Advanced i18n** | Add more languages (Spanish, French, Arabic, Chinese, etc.) | Future | Global market expansion |

---

## Release Themes

### Theme 1: Foundation & Validation (Current)
- Complete core assessment flow
- Deploy member and admin dashboards
- Launch multi-language support
- Validate scoring algorithm

### Theme 2: Engagement & Retention (Q1)
- Assessment history and trends
- Notification system
- Progress tracking
- Email automation

### Theme 3: Organizational Value (Q2)
- Advanced org analytics
- Sleep tracking integration
- Sleep diary
- Enhanced white-label

### Theme 4: Scale & Expansion (Q3+)
- AI recommendations
- Mobile apps
- Gamification
- Community features
- API ecosystem

---

## Dependency Map

```
P0: Document Scoring Algorithm
  └── Required for: All personalized features, recommendations, energy curve accuracy

P0: Verify Admin Backend
  └── Required for: P1 notifications, P2 advanced analytics

P1: Assessment History
  └── Requires: P0 scoring documentation
  └── Enables: P1 progress tracking, P2 AI recommendations

P1: Notifications
  └── Requires: P0 admin backend verification
  └── Enables: P1 email automation, P2 consultation marketplace

P2: Sleep Tracking
  └── Requires: P1 assessment history for baseline comparison
  └── Enables: P2 AI recommendations, P3 gamification

P2: AI Recommendations
  └── Requires: P1 assessment history, P2 sleep tracking data

P3: Mobile Apps
  └── Requires: P1 notifications (push), P2 sleep tracking
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Scoring algorithm not validated | Medium | High | Collaborate with sleep science experts; A/B test results |
| Admin backend incomplete | Medium | High | Audit all API routes; add integration tests |
| Placeholder assets in production | High | Medium | Create asset replacement sprint; prioritize critical images |
| Low engagement (one-shot assessment) | High | High | Add history, progress tracking, notifications |
| Scalability with org growth | Low | High | Load test Supabase queries; add caching layer |
| i18n coverage gaps | Medium | Medium | Add translation management workflow; community translations |

---

*This roadmap is based on the current codebase and known gaps. Priorities should be validated with stakeholders and adjusted based on business goals.*
