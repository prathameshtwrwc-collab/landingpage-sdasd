# Business Rules

# Business Rules

## Overview

This document defines the core business rules of the Sleep Wellness & Chronotype Intelligence Platform.

These rules take precedence over implementation decisions.

If implementation conflicts with business rules, business rules must win.

---

# Platform Ownership

The platform is owned and operated by:

WelcomeCure HealthTech

All organizations, assessments, reports, analytics, and user activity ultimately belong to the platform ecosystem.

Organizations receive access to their own data only.

Super Admin retains complete platform visibility.

---

# White Label Model

Organizations are white-label clients.

Examples:

- Corporates
- MNCs
- NGOs
- Hospitals
- Clinics
- Doctors
- Educational Institutions
- Wellness Organizations

Organizations receive:

- Unique organization account
- Unique assessment link
- Admin dashboard
- Member management
- Analytics

Organizations do not receive ownership of the platform.

---

# Organization Link Rule

Every organization receives a unique code.

Example:

website.com/ORG-7XQ2M8

This code is used to identify the organization.

Members joining through the link must automatically be associated with that organization.

---

# Member Mapping Rule

If a user enters through an organization link:

website.com/ORG-XXXXXX

Then:

organization_id must be assigned automatically.

The relationship must remain permanent.

---

# Direct User Rule

If a user enters through:

website.com

without an organization code:

organization_id = NULL

source_type = DIRECT

The member is managed directly by the platform.

---

# Referral Rule

Members may refer other users.

Referred users do not inherit organization membership.

Example:

Organization Member
↓
Refers Friend
↓
Friend Completes Assessment

Result:

organization_id = NULL

source_type = REFERRAL

Friend becomes a platform-level member.

---

# Assessment First Rule

Assessment should be available without login.

Users should not be forced to create an account before taking the assessment.

The preferred flow:

User Details
↓
Assessment
↓
Result
↓
Report
↓
Optional Login

This minimizes friction and improves completion rates.

---

# Email Capture Rule

Email is mandatory.

Email becomes the primary future login identity.

The system must capture:

- Email
- Name
- Contact Information

before assessment completion.

---

# One Member Rule

A single email address should correspond to a single member profile.

Duplicate member creation should be avoided.

Existing members should be linked to their historical records.

---

# Assessment History Rule

Assessment history must never be deleted.

Historical assessment records are required for:

- Research
- Analytics
- Trend tracking
- Future comparisons

Soft delete only if necessary.

---

# Questionnaire Versioning Rule

Questionnaires must support versioning.

Question changes must not invalidate historical assessments.

Historical assessments must remain linked to the questionnaire version used at the time.

---

# Chronotype Rule

Supported chronotypes:

- Lark
- Eagle
- Owl

Only approved scoring logic may generate chronotype outcomes.

Chronotype determination must be consistent and reproducible.

---

# Report Rule

Every completed assessment should generate a report.

Reports should be:

- Downloadable
- Shareable
- Printable

Reports remain permanently accessible to the member.

---

# Admin Visibility Rule

Admins may only access data belonging to their organization.

Admins must never:

- View other organizations
- View global analytics
- View platform-wide reports

---

# Super Admin Visibility Rule

Super Admin can access:

- All organizations
- All members
- All assessments
- All reports
- All analytics

No restrictions apply.

---

# Member Visibility Rule

Members may only access:

- Their own profile
- Their own assessments
- Their own reports
- Their own recommendations

Members must never access another member's data.

---

# Analytics Rule

Organization Analytics:

Only organization data.

Examples:

- Member count
- Assessment count
- Chronotype distribution
- Completion rates

---

Platform Analytics:

Available only to Super Admin.

Includes:

- All organizations
- Global trends
- Research data
- Growth metrics

---

# Data Retention Rule

Assessment data is valuable research data.

Data should be preserved.

Historical records should not be removed unless required by law or policy.

---

# Future Expansion Rule

The system should support future additions without major redesign.

Examples:

- Branches
- Multiple Admin Types
- Additional Assessments
- Additional Chronotypes
- Research Modules
- Wellness Programs
- Mobile Applications

Implementation should remain extensible.

---

# Core Principle

The platform is not merely an assessment tool.

It is a:

Sleep Wellness Platform

- Chronotype Intelligence Platform
- Research Platform
- Corporate Wellness Platform
- White Label SaaS Platform

All future decisions should align with this vision.
