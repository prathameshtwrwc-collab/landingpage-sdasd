# Roles and Permissions

# Roles And Permissions

## Overview

The platform supports three primary system roles:

1. Super Admin
2. Admin
3. Member

All permissions must be enforced at:

- UI Level
- API Level
- Database Level

Users must never access data outside their authorization scope.

---

# Super Admin

## Description

Platform owner.

Represents WelcomeCure HealthTech.

Has complete access across the platform.

---

## Can Access

Organizations

Admins

Members

Assessments

Reports

Analytics

Research Data

Content Management

System Settings

Platform Metrics

Referral Data

Organization Links

Questionnaires

Assessment Versions

Chronotype Configuration

---

## Can Perform

Create Organization

Update Organization

Deactivate Organization

Delete Organization

Create Admin

Deactivate Admin

View All Members

Export Data

Generate Reports

Manage Platform Content

Manage Questionnaires

Manage Chronotype Logic

View Global Analytics

Manage Referral System

Manage Future Integrations

---

## Restrictions

None

Super Admin has unrestricted access.

---

# Admin

## Description

Organization-level administrator.

Represents a specific organization.

Examples:

- Corporate HR Manager
- Wellness Manager
- Doctor
- NGO Coordinator
- Hospital Administrator

---

## Can Access

Own Organization

Own Members

Own Assessments

Own Reports

Own Analytics

Own Organization Link

Own Dashboard

---

## Can Perform

View Members

View Member Results

View Reports

Export Organization Data

Share Assessment Links

Monitor Assessment Completion

View Chronotype Distribution

View Demographic Analytics

Manage Organization Profile

---

## Cannot Access

Other Organizations

Other Admins

Global Analytics

Platform Settings

Research Data Across Organizations

System Configuration

Questionnaire Configuration

Chronotype Scoring Logic

Super Admin Functions

---

## Data Visibility

Admin may only view records where:

organization_id = current_admin.organization_id

No exceptions.

---

# Member

## Description

End user of the platform.

Completes assessments and receives results.

May belong to:

Organization

Direct Public

Referral

---

## Can Access

Own Dashboard

Own Assessment History

Own Reports

Own Recommendations

Own Progress

Own Goals

Own Profile

Own Sleep Insights

---

## Can Perform

Take Assessment

View Result

Download Report

Share Report

Refer Friends

Update Profile

Track Progress

View Recommendations

---

## Cannot Access

Other Members

Organization Analytics

Admin Functions

System Data

Questionnaires

Platform Configuration

Other Member Reports

---

## Data Visibility

Member may only access records where:

member_id = current_user.id

No exceptions.

---

# Future Roles

System should support future role expansion.

Possible future roles:

Organization Owner

Branch Admin

Research Analyst

Support Staff

Doctor

Counsellor

Corporate Manager

Regional Admin

Implementation should remain extensible.

---

# Authentication

Authentication Provider:

Clerk

---

# Clerk Roles

superadmin

admin

member

---

# Route Protection

Super Admin Routes

/superadmin/\*

Only accessible by:

superadmin

---

Admin Routes

/admin/\*

Only accessible by:

admin

---

Member Routes

/member/\*

Only accessible by:

member

---

# Unauthorized Access

Unauthorized users must be:

Redirected

or

Shown Access Denied

Never expose protected data.

---

# Security Principle

Users should always receive the minimum access required to perform their role.

No role should receive unnecessary permissions.

Principle of Least Privilege must be followed throughout the system.
