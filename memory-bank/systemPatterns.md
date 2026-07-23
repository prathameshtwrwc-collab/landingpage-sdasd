# System Patterns
# System Patterns

## Overview

The platform follows a multi-tenant white-label SaaS architecture.

The system is designed around organizations, assessments, chronotype calculations, reports, and analytics.

The architecture must support:

* Individuals
* Organizations
* Research
* Corporate Wellness
* White Label Deployments

without redesigning the core system.

---

# High Level Architecture

Super Admin
↓
Organizations
↓
Admins
↓
Members
↓
Assessments
↓
Chronotype Results
↓
Reports
↓
Analytics

---

# Multi Tenant Pattern

Organizations are isolated tenants.

Each organization can only access its own data.

Super Admin can access all tenants.

Organization data must always be filtered by:

organization_id

This rule applies to:

* Members
* Assessments
* Reports
* Analytics

---

# Authentication Pattern

Provider:

Clerk

Responsibilities:

* Login
* Signup
* Sessions
* Password Reset
* Email Verification
* Role Management

Roles:

superadmin

admin

member

---

# Database Pattern

Provider:

Supabase PostgreSQL

Responsibilities:

* Organizations
* Members
* Assessments
* Results
* Reports
* Analytics

Authentication should never be duplicated inside Supabase.

Clerk remains the source of truth for identity.

---

# User Identity Pattern

Clerk User
↓
clerk_user_id
↓
Application User Record

Every authenticated user should have:

clerk_user_id

stored in the database.

This links Clerk and Supabase.

---

# Organization Link Pattern

Organization
↓
Unique Code
↓
Shareable Link

Example:

website.com/ORG-7XQ2M8

---

# Member Acquisition Pattern

Organization Link
↓
Member
↓
Assessment
↓
Organization Mapping

Organization relationship is assigned automatically.

---

# Direct User Pattern

Website Visitor
↓
Assessment
↓
Member Creation

No organization assigned.

organization_id = NULL

source_type = DIRECT

---

# Referral Pattern

Member
↓
Referral Link
↓
Friend
↓
Assessment

Friend becomes:

source_type = REFERRAL

organization_id = NULL

Referral users never inherit organization membership.

---

# Assessment Pattern

Member
↓
Assessment
↓
Answers
↓
Scoring
↓
Chronotype
↓
Recommendations
↓
Report

---

# Assessment Version Pattern

Assessment Versions
↓
Questions
↓
Answers

Historical assessments remain linked to the version used.

Question changes must never invalidate historical data.

---

# Chronotype Pattern

Assessment Result
↓
Lark Score

Eagle Score

Owl Score
↓
Highest Score
↓
Chronotype

Supported Chronotypes:

Lark

Eagle

Owl

---

# Recommendation Pattern

Chronotype
↓
Recommendation Engine
↓
Personalized Recommendations

Examples:

Sleep Timing

Exercise Timing

Nutrition Timing

Energy Management

Work Timing

Recovery

---

# Report Pattern

Completed Assessment
↓
Chronotype Result
↓
PDF Generation
↓
Storage
↓
Member Access

Reports should remain permanently available.

---

# Analytics Pattern

Members
↓
Assessments
↓
Chronotypes
↓
Analytics Engine

Analytics generated from stored assessment data.

No manual calculations.

---

# Organization Analytics Pattern

Organization
↓
Members
↓
Assessments
↓
Analytics Dashboard

Visible only to organization admins.

---

# Platform Analytics Pattern

All Organizations
↓
All Members
↓
All Assessments
↓
Research Analytics

Visible only to Super Admin.

---

# Route Group Pattern

Next.js App Router

Route Groups:

(superadmin)

(admin)

(member)

---

# Super Admin Routes

/superadmin/*

---

# Admin Routes

/admin/*

---

# Member Routes

/member/*

---

# Dashboard Pattern

Each role receives:

Dedicated Dashboard

Dedicated Navigation

Dedicated Permissions

Dedicated Analytics

---

# Storage Pattern

Provider:

Supabase Storage

Used For:

Reports

PDFs

Future Assets

Generated Documents

---

# Logging Pattern

Important events should be logged.

Examples:

Assessment Completion

Report Generation

Organization Creation

Admin Creation

Member Registration

Login Events

Referral Events

---

# Security Pattern

Role Based Access Control

Clerk Authentication

Database Filtering

Row Level Security

Principle Of Least Privilege

Users only access data they own or are authorized to view.

---

# Scalability Pattern

The system must support future additions:

Branches

Multiple Assessment Types

Doctor Accounts

Counsellor Accounts

Research Modules

Corporate Wellness Modules

AI Recommendations

Mobile Applications

without requiring major architectural redesign.
