# User Flows

# User Flows

## Overview

The platform supports three primary user roles:

- Super Admin
- Admin
- Member

Members can enter the system through multiple acquisition paths.

---

# Flow 1: Organization Member Assessment

## Step 1

Organization Admin receives a unique organization link.

Example:

```text
website.com/ORG-7XQ2M8
```

---

## Step 2

Admin shares link through:

- WhatsApp
- Email
- QR Code
- Internal company communication
- Social media

---

## Step 3

Member opens organization link.

System identifies:

- Organization
- Organization Code

Organization context is stored temporarily.

---

## Step 4

Member enters details:

- First Name
- Last Name
- Age
- Country
- City
- Pincode
- Occupation
- Email
- Phone
- Gender

No login required.

---

## Step 5

Member completes Sleep Chronotype Assessment.

---

## Step 6

Assessment is scored.

System determines:

- Lark
- Eagle
- Owl

---

## Step 7

Chronotype result is displayed.

User can:

- View Result
- Download Report
- Share Report
- Refer Friends

---

## Step 8

Member is automatically mapped to:

Organization
↓
Admin
↓
Super Admin

---

## Step 9

Member may create/login to account later.

Email captured during assessment becomes primary identity.

---

# Flow 2: Direct Public User

## Step 1

User visits:

```text
website.com
```

without organization code.

---

## Step 2

User enters details.

---

## Step 3

User completes assessment.

---

## Step 4

Chronotype result generated.

---

## Step 5

Member stored as:

```text
source_type = DIRECT
organization_id = NULL
```

---

## Step 6

User is managed directly under Super Admin.

---

# Flow 3: Referral User

## Step 1

Existing member shares referral link.

---

## Step 2

Friend opens referral link.

---

## Step 3

Friend enters details.

---

## Step 4

Friend completes assessment.

---

## Step 5

Friend receives result.

---

## Step 6

Friend stored as:

```text
source_type = REFERRAL
organization_id = NULL
```

---

## Important Rule

Referral users do NOT inherit organization membership.

Even if the referring user belongs to an organization.

---

# Flow 4: Member Login

## First Assessment

No login required.

---

## Later Access

Member logs in using:

- Email
- Clerk Authentication

---

## Member Dashboard Access

After login member can access:

- Dashboard
- Sleep Score
- Chronotype Result
- Sleep Blueprint
- Recommendations
- Progress
- Goals
- Reports
- Profile

---

# Flow 5: Organization Admin

## Step 1

Admin receives account from Super Admin.

---

## Step 2

Admin logs in.

---

## Step 3

Admin accesses dashboard.

Admin can:

- View Members
- View Assessments
- View Reports
- View Analytics
- Share Organization Link

---

## Restrictions

Admin cannot:

- Access other organizations
- Access global analytics
- Access Super Admin tools

---

# Flow 6: Super Admin

## Step 1

Super Admin logs in.

---

## Step 2

Accesses Command Center.

---

## Step 3

Can manage:

- Organizations
- Admins
- Members
- Assessments
- Reports
- Analytics
- Content
- Settings

---

## Permissions

Super Admin has unrestricted access across the platform.

---

# Flow 7: Report Generation

Assessment Completed
↓
Chronotype Calculated
↓
Report Generated
↓
PDF Created
↓
Stored In Database
↓
Available For Download
↓
Available For Sharing

---

# Flow 8: Organization Analytics

Members Complete Assessments
↓
Data Aggregated
↓
Organization Dashboard Updated
↓
Admin Views Analytics

Examples:

- Total Participants
- Lark Distribution
- Eagle Distribution
- Owl Distribution
- Age Analysis
- Gender Analysis
- Completion Rates

---

# Flow 9: Super Admin Analytics

All Organizations
↓
All Members
↓
All Assessments
↓
Global Analytics

Examples:

- Total Organizations
- Total Members
- Chronotype Trends
- Assessment Volume
- Research Data
- Platform Growth Metrics
