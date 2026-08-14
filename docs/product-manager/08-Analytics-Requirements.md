# 08 — Analytics Requirements

**SDASD Sleep Chronotype & Wellness Platform**  
**Version:** 1.0  
**Date:** 2026-08-14

---

## 1. Current Analytics

The platform currently collects and displays the following analytics:

### Member-Level Analytics

| Metric | Source | Display Location |
|--------|--------|------------------|
| Chronotype (Lark/Eagle/Owl) | `chronotype_results` table | Dashboard, PDF report, public result page |
| Sleep Score (total_score) | `chronotype_results` table | Dashboard hero |
| Confidence Score | `chronotype_results` table | Dashboard hero |
| Individual Archetype Scores (lark/eagle/owl) | `chronotype_results` table | Dashboard, PDF report |
| Assessment Count | `assessments` table | Dashboard hero |
| Schedule (wake time, bedtime, peak focus) | `assessment_answers` table | Dashboard, PDF report |
| Recommendations | `member_recommendations` table | Dashboard, PDF report |

### Organization-Level Analytics (Admin Dashboard)

| Metric | Source | Display Location |
|--------|--------|------------------|
| Total Members | `members` table (filtered by org) | Admin dashboard stat card |
| Completed Assessments | `assessments` table (status = COMPLETED) | Admin dashboard stat card |
| In-Progress Assessments | `assessments` table (status = STARTED) | Admin dashboard stat card |
| Not-Started Assessments | Calculated (total - completed - in-progress) | Admin dashboard stat card |
| Average Confidence | `chronotype_results` table | Admin dashboard stat card |
| Assessment Activity | `assessments` table (grouped by date) | Admin dashboard chart |
| Chronotype Distribution | `chronotype_results` table | Admin dashboard chart |
| Organization Link Status | `organization_links` table | Admin dashboard |
| Member Source Type | `members` table (source_type) | Admin participants table |

### Platform-Level Analytics (Super Admin Dashboard)

| Metric | Source | Display Location |
|--------|--------|------------------|
| Total Organizations | `organizations` table | Super Admin dashboard KPI |
| Total Members | `members` table | Super Admin dashboard KPI |
| Total Assessments | `assessments` table | Super Admin dashboard KPI |
| Total Admins | `organization_admins` table | Super Admin dashboard KPI |
| Platform Completion Rate | Calculated (assessments / members) | Super Admin dashboard ring chart |
| Admin-to-Org Ratio | Calculated | Super Admin dashboard |
| Members per Org (avg) | Calculated | Super Admin dashboard |
| Chronotype Distribution | `chronotype_results` table | Super Admin dashboard bar chart |
| Member Source Distribution | `members` table (source_type) | Super Admin dashboard |
| Org Types Count | `organizations` table (organization_type) | Super Admin dashboard |
| Latest Organizations | `organizations` table | Super Admin dashboard list |
| Latest Members | `members` table | Super Admin dashboard list |
| Admins Overview | `organization_admins` table | Super Admin dashboard sidebar |

---

## 2. Proposed Analytics

### Member-Level Proposals

| Metric | Description | Business Value | Priority |
|--------|-------------|----------------|----------|
| **Assessment History Timeline** | Chart showing chronotype scores and confidence over multiple assessments | Helps users track progress; increases engagement | P1 |
| **Score Trend Analysis** | Line chart showing lark/eagle/owl score changes over time | Shows whether user is shifting chronotype or becoming more confident | P1 |
| **Adherence Tracking** | Track how well user follows recommended schedule (wake time, bedtime) | Measures real-world impact of recommendations | P2 |
| **Sleep Quality Self-Report** | Optional daily/weekly logging of sleep quality (1–5 scale) | Correlates self-reported quality with chronotype | P2 |
| **Recommendation Completion** | Track which recommendations user has tried and their perceived effectiveness | Improves recommendation engine; increases perceived value | P2 |
| **Engagement Score** | Composite metric based on logins, report views, shares, consultation bookings | Identifies highly engaged users for retention campaigns | P2 |

### Organization-Level Proposals

| Metric | Description | Business Value | Priority |
|--------|-------------|----------------|----------|
| **Engagement Trend** | Assessment completion rate over time (weekly/monthly) | Shows program effectiveness; identifies drop-off points | P1 |
| **Department Comparison** | Chronotype distribution and scores by department | Helps HR tailor wellness programs | P2 |
| **Benchmarking** | Compare org's metrics against anonymized platform averages | Provides context for org performance | P2 |
| **Participation Rate** | % of org members who have completed assessment | Measures program adoption | P1 |
| **Retention Rate** | % of members who retake assessment after 30/60/90 days | Measures long-term engagement | P2 |
| **Consultation Conversion** | % of members who book consultations | Measures consultation funnel effectiveness | P2 |
| **Referral Performance** | Number of referrals per member, conversion rate | Measures viral growth within org | P2 |
| **Report Download Rate** | % of members who download PDF reports | Measures content value perception | P2 |

### Platform-Level Proposals

| Metric | Description | Business Value | Priority |
|--------|-------------|----------------|----------|
| **Daily/Monthly Active Users** | DAU/MAU trends | Measures platform growth and engagement | P1 |
| **New User Acquisition** | New members per day/week/month, by source (direct, org, referral) | Tracks growth channels | P1 |
| **Churn Rate** | % of users who don't return after 30/60/90 days | Identifies retention issues | P1 |
| **Assessment Abandonment Rate** | % of users who start but don't complete assessment | Identifies friction points in assessment flow | P1 |
| **Assessment Completion Time** | Average time to complete assessment | Optimizes assessment length | P2 |
| **Conversion Funnel** | Landing → Assessment → Result → Login → Dashboard → Consultation/Donation | Identifies drop-off points | P1 |
| **Geographic Distribution** | Members by country, state, city | Supports localization and marketing | P2 |
| **Language Preference** | % of users per language | Guides i18n investment | P2 |
| **Revenue Metrics** (if applicable) | Donation amounts, consultation bookings, org subscriptions | Business performance tracking | P2 |
| **System Performance** | API response times, error rates, PDF generation times | Technical health monitoring | P2 |

---

## 3. Analytics Data Model

### Current Tables Used for Analytics

| Table | Fields Used | Purpose |
|-------|-------------|---------|
| `members` | id, email, name, organization_id, source_type, created_at | Member demographics and sourcing |
| `assessments` | id, member_id, status, started_at, completed_at | Assessment tracking |
| `chronotype_results` | id, assessment_id, member_id, chronotype, lark_score, eagle_score, owl_score, total_score, confidence_score, generated_at | Result analytics |
| `assessment_answers` | assessment_id, question_id, selected_option_id | Schedule derivation |
| `member_recommendations` | member_id, recommendations | Recommendation tracking |
| `organizations` | id, name, organization_type, country, status, created_at | Org analytics |
| `organization_links` | organization_id, unique_code, active, created_at | Link management |
| `organization_admins` | id, organization_id, clerk_user_id, role, status | Admin tracking |
| `reports` | id, member_id, result_id, assessment_id, generated_at | Report tracking |

### Proposed Additional Tables

| Table | Fields | Purpose |
|-------|--------|---------|
| `analytics_events` | id, user_id, event_type, event_data, timestamp | Event tracking for funnels |
| `member_engagement` | member_id, login_count, last_login, report_views, shares | Engagement scoring |
| `sleep_logs` | id, member_id, log_date, sleep_duration, quality_score, factors | Sleep diary data |
| `consultation_leads` | id, member_id, status, created_at, notes | Consultation funnel |

---

## 4. Analytics Implementation Notes

### Current Implementation
- Analytics are computed client-side in dashboard components
- Data fetched via API routes with pagination and search
- Charts rendered using custom chart components (Bars, Ring, MiniLine, EnergyChart)
- No event tracking or funnel analysis
- No real-time analytics

### Proposed Implementation
- Add event tracking layer (e.g., PostHog, Mixpanel, or custom)
- Server-side aggregation for platform-wide metrics
- Scheduled reports (email digests for admins)
- Export to BI tools (CSV, API)
- Cohort analysis for retention

---

## 5. Privacy & Compliance Considerations

| Consideration | Current Status | Recommendation |
|---------------|---------------|----------------|
| **PII in analytics** | Member names, emails used in admin dashboards | Anonymize platform-level analytics; restrict PII to authorized roles |
| **Data retention** | Not specified | Define retention policy for assessment data, logs, and analytics |
| **GDPR/Privacy compliance** | Terms modal exists | Add data export and deletion endpoints for member GDPR rights |
| **Aggregation thresholds** | Org stats show raw counts | Add minimum group size (e.g., ≥5) for org-level metrics to prevent identification |
| **Consent for tracking** | Not implemented | Add cookie consent banner if adding third-party analytics |

---

*This document reflects current analytics capabilities and proposed enhancements. Proposed items require business validation and technical planning.*
