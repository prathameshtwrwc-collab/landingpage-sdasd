# Database Review

## Overview

This document contains a comprehensive review of the database schema defined in `databaseSchema.md`, validated against all other Memory Bank documents including `organizationModel.md`, `userFlows.md`, `rolesAndPermissions.md`, `businessRules.md`, `assessmentLogic.md`, `reportingAndAnalytics.md`, `systemPatterns.md`, and `techContext.md`.

---

# 1. Database Entity Review

## 1.1 Entities Present (16 tables + 1 future table)

| # | Table | Purpose | Status |
|---|-------|---------|--------|
| 1 | organizations | Stores all platform organizations | ✅ Defined |
| 2 | organization_admins | Stores organization administrators | ✅ Defined |
| 3 | members | Stores all end users (org, direct, referral) | ✅ Defined |
| 4 | referrals | Tracks referral relationships | ✅ Defined |
| 5 | assessment_versions | Enables questionnaire versioning | ✅ Defined |
| 6 | questions | Stores assessment questions | ✅ Defined |
| 7 | question_options | Stores answer options per question | ✅ Defined |
| 8 | assessments | Stores assessment attempts | ✅ Defined |
| 9 | assessment_answers | Stores individual answer selections | ✅ Defined |
| 10 | chronotype_results | Stores final chronotype outcomes | ✅ Defined |
| 11 | recommendations | Stores recommendation library | ✅ Defined |
| 12 | member_recommendations | Maps recommendations to members | ✅ Defined |
| 13 | reports | Stores generated PDF reports | ✅ Defined |
| 14 | organization_links | Stores shareable organization links | ✅ Defined |
| 15 | login_audit | Tracks platform login events | ✅ Defined |
| 16 | activity_logs | Tracks important actions | ✅ Defined |
| 17 | branches | Future enterprise branch support | 🔜 Reserved |

## 1.2 Entity Coverage Assessment

### Fully Covered
- Organization records and admin assignment
- Member records with acquisition source tracking
- Assessment lifecycle (version, questions, attempts, answers)
- Chronotype result storage
- Recommendation library and member assignment
- Report metadata storage
- Referral relationship tracking
- Organization link generation
- Audit logging (login + activity)

### Partially Covered
- **White-label branding**: No table for organization-level customization (logo, colors, custom domain, theme)
- **Content management**: Super Admin "Content Governance" requires a content repository table
- **Sleep facts & chronotype insights**: Admin area references these but no dedicated table exists
- **Member goals**: Member area includes Goals but no goals table
- **Sleep blueprint / energy timeline**: Member area references these as derived data but no storage defined

---

# 2. Relationship Review

## 2.1 Defined Relationships

```
organizations ──1:N──→ organization_admins
organizations ──1:N──→ members
organizations ──1:N──→ assessments (via organization_id)
organizations ──1:N──→ chronotype_results (via organization_id)
organizations ──1:N──→ organization_links
members ──────1:N──→ assessments
members ──────1:N──→ chronotype_results
members ──────1:N──→ member_recommendations
members ──────1:N──→ reports
members ──────1:N──→ referrals (as referrer)
assessment_versions ──1:N──→ questions
questions ──────────1:N──→ question_options
assessments ────────1:N──→ assessment_answers
assessments ────────1:1──→ chronotype_results
assessments ────────1:1──→ reports
referrals ──────────1:1──→ members (as referred, nullable)
```

## 2.2 Missing or Ambiguous Relationships

### Referrals → organization linkage
The `referrals` table does not have an `organization_id` FK. This is correct per business rules (referral users must not inherit organization), but the Super Admin likely needs to know which organization a referral originated from for analytics. Consider adding `referrer_organization_id` (derived from referrer's members.organization_id at time of referral) as a non-enforced informational field.

### organization_links → organizations relationship
`organization_links.unique_code` appears to duplicate `organizations.unique_code`. Clarify whether each organization has exactly one link (making `organization_links` redundant with `organizations.unique_code`) or multiple links per organization (in which case the relationship is correct but the field naming is ambiguous).

### Login audit → user identity
`login_audit` references generic `user_type` and `user_id` but does not enforce a foreign key. This means referential integrity cannot be enforced. Same issue applies to `activity_logs`.

### Assessment version → content isolation
`assessment_versions` has no relationship to organizations. All assessment versions are global. If different organizations need different assessment versions, a junction table `organization_assessment_versions` would be needed. Current design assumes all organizations share the same active assessment version.

---

# 3. Missing Tables

## 3.1 Required for Current Phase

### Table: organization_branding
Stores white-label configuration per organization.

Suggested fields:
- id UUID PK
- organization_id FK → organizations (required, unique)
- logo_url TEXT (nullable)
- primary_color TEXT (nullable)
- custom_domain TEXT (nullable, unique)
- favicon_url TEXT (nullable)
- email_from_name TEXT (nullable)
- settings_json JSONB (nullable)

Justification: The platform is explicitly a white-label SaaS. Organizations need visual branding customization. Super Admin must manage this per organization.

### Table: member_goals
Stores member-defined wellness goals.

Suggested fields:
- id UUID PK
- member_id FK → members (required)
- title TEXT (required)
- description TEXT (nullable)
- category TEXT (required)
- target_date DATE (nullable)
- status TEXT (default: ACTIVE)
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

Justification: Member area includes "Goals" as a first-class section in userFlows.md.

### Table: content_pages
Stores platform content for Super Admin content governance.

Suggested fields:
- id UUID PK
- title TEXT (required)
- slug TEXT (required, unique)
- content TEXT (required)
- content_type TEXT (required)
- status TEXT (default: DRAFT)
- created_by UUID (nullable)
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

Justification: "Content Governance" and "Content Management" are referenced in super admin and admin area requirements.

### Table: sleep_facts
Stores sleep education content.

Suggested fields:
- id UUID PK
- title TEXT (required)
- content TEXT (required)
- category TEXT (nullable)
- is_active BOOLEAN (default: true)
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ

Justification: Admin area explicitly lists "Sleep Facts" as a section.

### Table: chronotype_insights
Stores chronotype-specific educational content.

Suggested fields:
- id UUID PK
- chronotype TEXT (required)
- title TEXT (required)
- content TEXT (required)
- category TEXT (nullable)
- is_active BOOLEAN (default: true)
- created_at TIMESTAMPTZ

Justification: Admin area explicitly lists "Chronotype Insights" as a section.

## 3.2 Required for Scoring Engine

### Table: scoring_rules
Stores configurable scoring logic.

Suggested fields:
- id UUID PK
- assessment_version_id FK → assessment_versions (required)
- chronotype TEXT (LARK / EAGLE / OWL)
- min_score INTEGER (nullable)
- max_score INTEGER (nullable)
- rule_logic JSONB (nullable)
- is_active BOOLEAN (default: true)
- created_at TIMESTAMPTZ

Justification: assessmentLogic.md states "Scoring logic must be configurable" and "Scores should not be hardcoded". Currently there is no table to store scoring rules or chronotype determination thresholds.

## 3.3 Optional / Future

### Table: referral_codes
Members need unique referral codes to share. Currently referral codes are generated at referral time (stored in `referrals.referral_code`). Consider whether each member has a persistent referral code or a new code is generated per share action. Current design implies per-action code generation.

---

# 4. Missing Fields

## 4.1 organizations
| Missing Field | Type | Reason |
|--------------|------|--------|
| logo_url | TEXT / nullable | White-label org needs logo |
| settings_json | JSONB / nullable | Flexible org configuration |
| is_active | BOOLEAN / required | Status field exists but `is_active` used elsewhere; ensure consistency |
| parent_organization_id | UUID / FK → organizations / nullable | Future branch/hierarchy support |
| country | TEXT / nullable | Organizational analytics by geography |

## 4.2 members
| Missing Field | Type | Reason |
|--------------|------|--------|
| avatar_url | TEXT / nullable | Profile avatar |
| last_login_at | TIMESTAMPTZ / nullable | Track member activity |
| is_active | BOOLEAN / default true | Member disable support |
| preferences_json | JSONB / nullable | Member UI/content preferences |
| referral_code | TEXT / nullable, unique | Persistent member referral code |

## 4.3 assessments
| Missing Field | Type | Reason |
|--------------|------|--------|
| ip_address | TEXT / nullable | Fraud/abuse detection |
| user_agent | TEXT / nullable | Device analytics |
| time_taken_seconds | INTEGER / nullable | Completion analytics |

## 4.4 reports
| Missing Field | Type | Reason |
|--------------|------|--------|
| title | TEXT / nullable | Human-readable report name |
| file_size | BIGINT / nullable | Storage management |
| is_shared | BOOLEAN / default false | Sharing status tracking |
| shared_at | TIMESTAMPTZ / nullable | Sharing timestamp |

## 4.5 recommendations
| Missing Field | Type | Reason |
|--------------|------|--------|
| priority_order | INTEGER / default 0 | Recommendation display ordering |
| icon | TEXT / nullable | Visual identification |
| action_items | JSONB / nullable | Specific actionable steps |

## 4.6 activity_logs
| Missing Field | Type | Reason |
|--------------|------|--------|
| ip_address | TEXT / nullable | Audit trail completeness |
| details_json | JSONB / nullable | Flexible metadata |

## 4.7 login_audit
| Missing Field | Type | Reason |
|--------------|------|--------|
| clerk_session_id | TEXT / nullable | Clerk session correlation |
| organization_id | UUID / FK → organizations / nullable | Org-level login analytics |

---

# 5. Nullable Field Review

## 5.1 Correctly Nullable
| Table | Field | Rationale |
|-------|-------|-----------|
| members | organization_id | DIRECT and REFERRAL members have no organization |
| members | clerk_user_id | Assessment-first flow: member record created before Clerk account |
| assessments | organization_id | DIRECT and REFERRAL members have no organization |
| assessments | completed_at | Assessment may be STARTED or ABANDONED without completion |
| chronotype_results | organization_id | Same as assessments |
| referrals | referred_member_id | Referral link created before referred user completes assessment |
| reports | assessment_id | Future: reports may be generated outside an assessment context |

## 5.2 Should Be Nullable (Currently Undefined)
| Table | Field | Reason |
|-------|-------|--------|
| assessment_answers | selected_option_id | NULL for descriptive/open-ended question types (no option selected) |
| assessment_answers | answer_value | Required when selected_option_id IS NULL (descriptive answers); nullable when selected_option_id is set |

## 5.3 Should NOT Be Nullable (Risk Assessment)
| Table | Field | Status |
|-------|-------|--------|
| organization_admins | organization_id | Already required per schema. Verify FK is NOT NULL. |
| assessments | member_id | Already required per schema. Verify FK is NOT NULL. |
| assessments | assessment_version_id | Already required per schema. Verify FK is NOT NULL. |

## 5.4 Ambiguous Nullability
| Table | Field | Concern |
|-------|-------|---------|
| reports | assessment_id | If NULL, how is the report linked to source data? Define behavior. |
| members | organization_id + source_type = ORGANIZATION | Business rule violation risk. Must validate: if source_type = ORGANIZATION, organization_id must NOT be NULL. |
| members | organization_id + source_type = DIRECT/REFERRAL | Must validate: organization_id must be NULL. |

---

# 6. Foreign Key Review

## 6.1 Required Foreign Keys (NOT NULL)
| Source | Target | Purpose |
|--------|--------|---------|
| organization_admins.organization_id | organizations.id | Admin-org membership |
| members.organization_id | organizations.id | Only when source_type = ORGANIZATION |
| assessments.member_id | members.id | Assessment ownership |
| assessments.assessment_version_id | assessment_versions.id | Version tracking |
| assessment_answers.assessment_id | assessments.id | Answer parent |
| assessment_answers.question_id | questions.id | Question reference |
| chronotype_results.assessment_id | assessments.id | Result parent |
| chronotype_results.member_id | members.id | Member ownership |
| member_recommendations.member_id | members.id | Recommendation target |
| member_recommendations.recommendation_id | recommendations.id | Recommendation source |
| reports.member_id | members.id | Report ownership |
| reports.assessment_id | assessments.id | Report source | 
| referrals.referrer_member_id | members.id | Referrer identity |
| questions.assessment_version_id | assessment_versions.id | Version membership |
| question_options.question_id | questions.id | Option parent |
| organization_links.organization_id | organizations.id | Link ownership |

## 6.2 Optional Foreign Keys (Nullable)
| Source | Target | Condition |
|--------|--------|-----------|
| referrals.referred_member_id | members.id | NULL until referred user completes assessment |
| members.organization_id | organizations.id | NULL for DIRECT and REFERRAL |
| assessments.organization_id | organizations.id | Derived from member |
| chronotype_results.organization_id | organizations.id | Derived from member |
| assessment_answers.selected_option_id | question_options.id | NULL for descriptive answer types |

## 6.3 Missing Foreign Keys
| Source | Target | Risk |
|--------|--------|------|
| login_audit.user_id | No FK target | No referential integrity; user_id could reference any table |
| activity_logs.entity_id | No FK target | Same issue; generic reference without integrity |
| activity_logs.user_id | No FK target | Same issue |

Mitigation: These tables use polymorphic references (user_type + user_id). Use Supabase NOT VALID constraints or application-level enforcement. Alternatively, use separate tables per entity type.

---

# 7. Index Recommendations

## 7.1 Performance-Critical Indexes

| Table | Columns | Justification |
|-------|---------|---------------|
| organizations | unique_code | Organization lookup by code on every assessment link visit |
| organizations | status | Filtering active/inactive organizations |
| organization_admins | clerk_user_id | Admin lookup on every authenticated request |
| organization_admins | organization_id | All admin queries filtered by org |
| members | email | Email deduplication, login lookup |
| members | organization_id | All organization-scoped member queries |
| members | source_type | Analytics filtering by member type |
| members | clerk_user_id | Member lookup from Clerk session |
| members | created_at | Time-based analytics queries |
| assessments | member_id | All assessment history queries |
| assessments | organization_id | Organization analytics queries |
| assessments | status | Completion rate analytics |
| assessments | completed_at | Trend analysis queries |
| assessment_answers | assessment_id | Answer retrieval for scoring |
| chronotype_results | member_id | Result lookup |
| chronotype_results | organization_id | Organization analytics |
| chronotype_results | chronotype | Chronotype distribution queries |
| referrals | referrer_member_id | Referrer tracking |
| referrals | referral_code | Referral link resolution |
| reports | member_id | Report access |
| organization_links | unique_code | Link resolution |
| organization_links | organization_id | Organization link management |
| login_audit | login_at | Time-based audit queries |
| activity_logs | created_at | Activity timeline queries |
| activity_logs | user_type, user_id | User activity lookup |

## 7.2 Composite Indexes

| Index | Columns | Justification |
|-------|---------|---------------|
| idx_members_org_source | (organization_id, source_type) | Org-scoped member filtering by source |
| idx_assessments_member_status | (member_id, status) | Member assessment history with status filter |
| idx_assessments_org_status | (organization_id, status) | Org completion analytics |
| idx_results_org_chronotype | (organization_id, chronotype) | Org chronotype distribution |
| idx_activity_logs_user_time | (user_type, user_id, created_at) | User activity timeline |

## 7.3 Unique Indexes

| Table | Columns | Purpose |
|-------|---------|---------|
| organizations | unique_code | Enforce unique org codes |
| organization_links | unique_code | Enforce unique link codes |
| members | email | Enforce single member per email |
| referrals | referral_code | Enforce unique referral codes |

---

# 8. Row Level Security Recommendations

## 8.1 RLS Strategy Per Table

| Table | Super Admin | Admin | Member | Unauthenticated |
|-------|-------------|-------|--------|-----------------|
| organizations | ALL | SELECT (own only) | NONE | NONE |
| organization_admins | ALL | NONE (cannot see other admins) | NONE | NONE |
| members | ALL | SELECT (own org only) | SELECT (own only) | INSERT (assessment flow) |
| referrals | ALL | SELECT (own org referrers only) | SELECT (own referrals only) | NONE |
| assessment_versions | ALL | SELECT | SELECT | SELECT (active) |
| questions | ALL | SELECT | SELECT | SELECT (active) |
| question_options | ALL | SELECT | SELECT | SELECT (active) |
| assessments | ALL | SELECT (own org only) | SELECT (own only) | INSERT (create) |
| assessment_answers | ALL | SELECT (own org only) | SELECT (own only) | INSERT (create) |
| chronotype_results | ALL | SELECT (own org only) | SELECT (own only) | NONE |
| recommendations | ALL | SELECT | SELECT | SELECT |
| member_recommendations | ALL | SELECT (own org only) | SELECT (own only) | NONE |
| reports | ALL | SELECT (own org only) | SELECT (own only) | NONE |
| organization_links | ALL | SELECT (own only) | NONE | SELECT (via code) |
| login_audit | ALL | NONE | NONE | NONE |
| activity_logs | ALL | NONE | NONE | NONE |
| scoring_rules | ALL | NONE | NONE | NONE |
| content_pages | ALL | SELECT | SELECT | SELECT (published) |
| organization_branding | ALL | SELECT (own only) | NONE | NONE |

## 8.2 Critical RLS Rules

### Member Insert for Assessment Flow
Unauthenticated users must be able to INSERT into `members`, `assessments`, and `assessment_answers` tables. This directly contradicts standard RLS that blocks anonymous inserts. Solution:

```sql
-- Allow unauthenticated INSERT but restrict SELECT to own records
CREATE POLICY members_assessment_insert ON members
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY members_assessment_select ON members
  FOR SELECT USING (
    auth.uid() = clerk_user_id  -- authenticated user sees own record
    OR clerk_user_id IS NULL     -- unauthenticated sees temp record
  );
```

### Clerk User ID Integration
Supabase RLS uses `auth.uid()`, but the platform uses Clerk. A `clerk_user_id` mapping column must be present on `members` and `organization_admins`. RLS policies must join or match on `clerk_user_id` rather than Supabase `auth.uid()`.

### Anonymous Access Risk
Tables that allow anonymous INSERT are vulnerable to abuse. Mitigations:
- Rate limiting on INSERT operations
- CAPTCHA on assessment start
- IP-based monitoring on `assessments` table

---

# 9. Multi-Tenant Recommendations

## 9.1 Tenant Isolation Model

The platform uses **shared table / organization_id filtering** for multi-tenancy. This is appropriate for the current scale but requires strict enforcement.

### Isolation Rules
1. Every row that belongs to an organization MUST have `organization_id` set correctly
2. Every query on tenant-scoped data MUST filter by `organization_id`
3. RLS policies MUST enforce organization_id = current_admin.organization_id for admins
4. Super Admin bypasses all organization_id filters

### Reference Data
Tables like `recommendations`, `questions`, `assessment_versions`, and `question_options` are global reference data shared across all tenants. They do not have `organization_id`. This is correct.

### Tenant-Crossing Data
- `login_audit` and `activity_logs` are platform-wide and accessible only to Super Admin
- Referral tracking crosses tenant boundaries but is gated by role permissions

## 9.2 Future Branch Support

To support future organization branches without schema redesign:
- Add `parent_organization_id` to `organizations` (self-referencing FK, nullable)
- Add `organization_branch_id` to `members` and `assessments` (nullable)
- Create `branches` table as already designed

This keeps the schema forward-compatible with the Multi-Tenant Pattern defined in systemPatterns.md.

---

# 10. Scalability Recommendations

## 10.1 Assessment Volume

The `assessment_answers` table is the fastest-growing table. Each assessment creates N answers. At scale:

**Estimates:**
- 10 questions × 1M assessments = 10M rows in `assessment_answers`
- 10 questions × 10M assessments = 100M rows

**Recommendations:**
- Partition `assessment_answers` by `created_at` (monthly or quarterly)
- Partition `assessments` by `completed_at`
- Archive completed assessments older than 2 years to a cold storage schema
- Consider JSONB storage for answers instead of normalized rows if question count is stable

## 10.2 Audit Table Growth

`login_audit` and `activity_logs` grow indefinitely without purging.

**Recommendations:**
- Implement TTL (time-to-live) partitioning: drop partitions older than 12 months
- Aggregate old audit data into summary tables
- Move historical audit data to cheaper storage

## 10.3 Query Patterns

**High-frequency queries:**
- Organization lookup by code (on every assessment link visit)
- Member lookup by email or clerk_user_id
- Assessment submission (write-heavy during assessment completion)
- Dashboard analytics queries (read-heavy, periodic)

**Recommendations:**
- Implement Redis/materialized view caching for dashboard analytics
- Use Supabase Realtime for live dashboard updates (optional)
- Create materialized views for common analytics queries:
  - `mv_org_chronotype_distribution`
  - `mv_org_daily_assessments`
  - `mv_platform_growth_metrics`

## 10.4 Connection Pooling

Supabase PostgreSQL has connection limits. Server Actions open per-request connections.

**Recommendations:**
- Use Supabase pooler (Supavisor) for production
- Implement connection reuse in API routes
- Avoid per-component database queries

---

# 11. Final Schema Risk Assessment

## 11.1 High Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Anonymous INSERT on members/assessments | Abuse, spam, data pollution | Rate limiting, CAPTCHA, IP tracking, email verification |
| Clerk/Supabase identity mismatch | Broken RLS, user cannot access own data | Sync webhook from Clerk to Supabase; enforce clerk_user_id link |
| Missing scoring_rules table | Scoring logic hardcoded in application code | Create scoring_rules table before assessment engine implementation |
| No organization_id on assessment_answers | Cannot enforce org-level access on answers | Add organization_id or derive through JOIN chain (assessment → member → org) |
| organization_links duplicates organizations.unique_code | Data inconsistency, confusion | Clarify relationship: either remove unique_code from organizations or make organization_links an audit table |

## 11.2 Medium Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| No indexes on foreign keys | Performance degradation at 10K+ rows | Add indexes as recommended in Section 7 |
| Activity logs without FK constraints | Orphaned records, data integrity issues | Application-level enforcement or soft FK with Supabase NOT VALID |
| No member goals table | Cannot implement Goals feature | Add member_goals table before Phase 5 |
| No content management tables | Cannot implement Content Governance | Add content_pages, sleep_facts, chronotype_insights tables |
| No organization branding table | Cannot implement white-label customization | Add organization_branding table |
| Gender field in members but not in userFlows assessment fields | Data inconsistency | Align: add Gender to assessmentLogic.md required fields or remove from schema |

## 11.3 Low Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| No full-text search indexes | Slow member/org search | Add GIN indexes when search is required |
| No soft delete columns | Data recovery limited | Add deleted_at to organizations, members, assessments tables |
| No composite indexes for analytics queries | Slow dashboard loading | Add indexes tuned to actual query patterns after analytics implementation |
| assessment_answers.selected_option_id nullable | Not defined in schema | Add nullable specification for descriptive/open-ended question types |

## 11.4 Schema Readiness Score

| Category | Score | Notes |
|----------|-------|-------|
| Core entities | 9/10 | organizations, members, assessments well-defined |
| Relationships | 7/10 | Missing FK on audit tables, ambiguous org_links |
| Permissions model | 6/10 | RLS defined conceptually but Clerk/Supabase gap not resolved |
| Scalability | 5/10 | No indexes, no partitioning, no caching strategy |
| Completeness | 6/10 | 5 missing tables, 15+ missing fields |
| Forward compatibility | 7/10 | Branch support reserved, future roles considered |

**Overall: 6.7/10 — Schema is structurally sound but has significant gaps that must be addressed before implementation.**

---

# Summary of Required Actions

### Before Schema Implementation
1. Add 5 missing tables: organization_branding, member_goals, content_pages, sleep_facts, chronotype_insights
2. Add 15+ missing fields across existing tables (see Section 4)
3. Define nullable constraints for assessment_answers.selected_option_id and assessment_answers.answer_value
4. Create scoring_rules table for configurable chronotype logic
5. Add all foreign key indexes (see Section 7)

### During Schema Implementation
1. Implement RLS with Clerk user_id mapping
2. Add INSERT policies for anonymous assessment flow
3. Add validation CHECK constraints for source_type + organization_id consistency
4. Implement soft delete columns for data recovery
5. Set up audit table TTL strategy

### Before Production Launch
1. Implement rate limiting on anonymous INSERT endpoints
2. Create materialized views for dashboard analytics
3. Add full-text search indexes
4. Implement connection pooling via Supavisor
5. Test RLS policies with all three roles + anonymous
