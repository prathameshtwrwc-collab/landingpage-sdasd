# CHRONOTYPE — Complete Backend Integration Guide

## ?? CRITICAL — READ BEFORE ANY CODE CHANGES

This document provides EVERYTHING the AI agent needs to connect the new chronotype website to the Supabase backend from the nextchrono2 project. Follow this guide step by step. Do NOT skip phases. Do NOT redesign the UI.

---

## PHASE 0: Understanding the Architecture

### Platform Overview
- **B2B2C Multi-tenant White-label SaaS**: Super Admin (WelcomeCure) ? Organizations ? Admins ? Members
- **Assessment-First Flow**: No login required to take assessment. Email = primary identity. Login optional (later via Clerk).
- **3 Roles**: superadmin (unrestricted), admin (own org only), member (own data only)
- **3 Chronotypes**: Lark (morning), Eagle (intermediate), Owl (evening)
- **3 Member Sources**: ORGANIZATION (via org link), DIRECT (website), REFERRAL (friend referral)

### Tech Stack (already set up in your project)
- Next.js 15 App Router + TypeScript
- TailwindCSS v4 + Framer Motion
- Clerk (for authentication)
- Supabase PostgreSQL (for data)

### Key Business Rules (NEVER VIOLATE)
1. **Assessment-first**: Assessment available WITHOUT login. User enters email ? takes assessment ? gets result ? optionally creates account.
2. **One email = one member**: Duplicate email returns existing member record.
3. **Org link mapping**: Users coming through website.com/ORG-XXXXXX get organization_id set automatically.
4. **Referral isolation**: Referral users do NOT inherit org membership. organization_id = NULL, source_type = REFERRAL.
5. **Direct users**: source_type = DIRECT, organization_id = NULL.
6. **Assessment history preserved**: NEVER delete assessment records.
---
## PHASE 1: Database Setup

### Step 1.1: Run the SQL Schema in Supabase

Go to your Supabase project SQL Editor and run these files IN ORDER:

1. **First**: Copy the contents of supabase/schema.sql — creates enums (member_source_type, assessment_status, chronotype_type) and pgcrypto extension
2. **Second**: Copy the contents of supabase/schema2.sql — creates all 16 tables + indexes + RLS policies + seeds
3. **Third**: Copy the contents of supabase/schema3.sql — seeds the 10-question assessment version (run AFTER schema2)

### Step 1.2: What Gets Created

16 tables: organizations, organization_admins, members, referrals, assessment_versions, questions, question_options, scoring_rules, assessments, assessment_answers, chronotype_results, recommendations, member_recommendations, reports, organization_links, member_goals, activity_logs, login_audit

### Step 1.3: RLS Policies

The schema includes permissive anonymous policies for development:
- Anonymous users can INSERT into members, assessments, assessment_answers, chronotype_results, member_recommendations, reports
- All users can SELECT from reference tables (questions, options, recommendations)
- RLS will be tightened when Clerk is fully integrated

---

## PHASE 2: Install Dependencies

Run: npm install @supabase/supabase-js @supabase/ssr @clerk/nextjs svix

---

## PHASE 3: Environment Variables

Create or update .env.local with these variables:
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  CLERK_SECRET_KEY
  CLERK_WEBHOOK_SECRET
---
## PHASE 4: Copy Core Backend Files

Copy the following files FROM nextchrono2 INTO your new project at EXACTLY the same paths:

lib/utils.ts — cn() utility function (depends on clsx + tailwind-merge)
lib/scoring.ts — Chronotype scoring engine (calculateChronotype function)
lib/supabase/client.ts — Browser-side Supabase client (uses createBrowserClient)
lib/supabase/server.ts — Server-side Supabase client (uses createServerClient with cookies)
lib/supabase/queries.ts — 15 reusable query functions for DB operations
lib/actions/assessment.ts — Assessment server actions (getAssessmentData, createMemberAndStartAssessment, submitAssessment, getMemberDashboard)
lib/actions/superadmin.ts — Superadmin server actions (createOrganization, createOrganizationAdmin, refreshOrgLink)
lib/queries/admin.ts — Superadmin dashboard queries (getPlatformStats, getOrganizations, getOrganizationAdmins)
lib/queries/admin-portal.ts — Admin dashboard queries (getAdminOrg, getAdminDashboardStats, getAdminMembers, getAdminAssessmentResults)

---
## PHASE 5: Copy API Routes & Middleware

Copy these files FROM nextchrono2 at the exact paths:

app/api/auth/check-user/route.ts — POST, checks email role in DB + Clerk
app/api/auth/redirect/route.ts — GET, redirects to correct portal by role
app/api/webhooks/clerk/route.ts — POST, handles Clerk user.created webhook
app/api/member/route.ts — GET, returns member dashboard by email or member_id
app/api/admin/route.ts — GET, superadmin-only platform stats/orgs/admins
app/api/admin-portal/route.ts — GET, admin-only org dashboard/members/results
middleware.ts — Clerk middleware protecting /admin/* and /superadmin/*

---
## PHASE 6: Connect the Assessment Modal

Your new website already has a Take Test button that opens an assessment modal. The AssessmentModal component from nextchrono2 is already set up to call the server actions.

Assessment Flow (End-to-End):
1. User clicks "Take Test" ? IntroScreen
2. User clicks "Begin Assessment" ? FormScreen collects personal details
3. handleBeginAssessment() calls createMemberAndStartAssessment(formData)
   - Creates member in DB (or finds existing by email)
   - Creates assessment record with status STARTED
   - Returns { memberId, assessmentId }
4. QuestionScreen displays questions fetched from DB via getAssessmentData()
5. User answers all questions ? clicks "See My Result"
6. handleSubmit() calls submitAssessment(assessmentId, answers)
   - Inserts answers into assessment_answers
   - Loads score values from question_options
   - Calls calculateChronotype() from lib/scoring.ts
   - Inserts result into chronotype_results
   - Assigns recommendations via member_recommendations
   - Updates assessment status to COMPLETED
   - Returns { result, memberId }
7. ResultScreen displays chronotype with scores, download/share/refer options
8. User can "View My Dashboard" ? navigates to /member

---
## PHASE 7: Connect Dashboards to Real Data

The dashboards currently use mock data. Replace mock imports with real DB calls:

Member Dashboard:
- Get memberId from sessionStorage.getItem("memberEmail") set by AssessmentModal
- Call getMemberDashboard(memberId) which returns { member, result, recommendations, assessments }
- Map member ? user profile, result ? chronotype + scores, recommendations ? cards, assessments ? history

Admin Dashboard:
- Call getAdminDashboardStats() for stat cards + chronotype distribution chart
- Call getAdminMembers() for members table
- Call getAdminAssessmentResults() for assessment results table
- All auto-scoped to the admin organization via Clerk session

Superadmin Dashboard:
- Call getPlatformStats() for global stat cards + chronotype distribution
- Call getOrganizations() for organizations table
- Call getOrganizationAdmins() for admins table
- All protected by Clerk superadmin role check

When connecting dashboards, keep the mock data structure but replace data source.
The mock files show exactly what shape of data each page expects.

---
## PHASE 8: Memory Bank Setup

Copy ALL 17 files from nextchrono2/.kilo/memory-bank/ into your project/.kilo/memory-bank/:

projectbrief.md — Project overview, tech stack, key rules
productContext.md — Product vision, pillars, user groups
systemPatterns.md — Architecture patterns (multi-tenant, auth, DB)
techContext.md — Technology decisions, folder structure
activeContext.md — Current state, immediate next steps
businessRules.md — ALL 20+ business rules
organizationModel.md — Organization hierarchy and member types
userFlows.md — 9 complete user flows
rolesAndPermissions.md — 3 roles with full permissions matrix
assessmentLogic.md — Assessment structure, scoring, flow
reportingAndAnalytics.md — 3-tier analytics system
databaseSchema.md — All 16 tables with fields and relationships
databaseReview.md — Comprehensive schema review (588 lines)
designsystem.md — Design philosophy, preservation rules
implementationRoadmap.md — 11-phase implementation plan
progress.md — Current completion status
nextjsMigration.md — Migration notes

---
## PHASE 9: Database SQL Schema Files

Create supabase/ directory and copy these 3 files:

supabase/schema.sql — Creates enums safely (IF NOT EXISTS)
supabase/schema2.sql — Full schema: all tables, indexes, RLS, seeds
supabase/schema3.sql — 10-question seed data

Schema execution order is STRICT: schema.sql ? schema2.sql ? schema3.sql

---
## PHASE 10: Scoring Engine Details

File: lib/scoring.ts

The calculateChronotype function:
1. Receives array of ScoredOption { option_id, lark_score, eagle_score, owl_score }
2. Sums all lark_score values ? lark total
3. Sums all eagle_score values ? eagle total
4. Sums all owl_score values ? owl total
5. Finds max among the three ? determines chronotype (LARK, EAGLE, OWL)
6. Confidence = ((max - second_highest) / total) * 100 + 50, capped at 99
7. Returns { chronotype, total_score, confidence_score, lark_score, eagle_score, owl_score }

This function is ONLY called server-side in submitAssessment().
NEVER move scoring to the client.

---
## PHASE 11: Clerk Auth Integration

Clerk handles authentication. The setup involves:

1. Clerk Middleware (middleware.ts) protects /admin/* and /superadmin/* routes
2. Role is stored in Clerk publicMetadata as role field (superadmin, admin, member)
3. When a user signs up via Clerk, the webhook (app/api/webhooks/clerk/route.ts) fires:
   - Finds existing member by email in Supabase
   - Updates member with clerk_user_id
   - Sets Clerk publicMetadata role to member
4. The check-user API route determines role by checking:
   - First: members table for email
   - Then: organization_admins table for email
   - Then: Clerk for role metadata
5. The redirect API route reads Clerk session claims and redirects to correct portal

---
## CRITICAL RULES

1. DO NOT redesign the UI — dashboards are approved. Only replace mock data with real DB calls.
2. DO NOT change the AssessmentModal UI — it wires to server actions via imports.
3. Schema execution order: schema.sql FIRST, then schema2.sql, then schema3.sql.
4. Scoring engine MUST stay server-side in submitAssessment().
5. Assessment flow is ANONYMOUS — no login required. RLS allows anonymous INSERT.
6. One email = one member — createMemberAndStartAssessment checks for existing members.
7. Use correct createClient(): lib/supabase/server for Server Actions/API, lib/supabase/client for browser.
8. When connecting dashboards, keep mock data shape but swap data source.
