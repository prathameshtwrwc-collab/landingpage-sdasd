# Organization Model

# Organization Model

## Purpose

The platform operates as a hierarchical white-label SaaS system.

The organization structure is the foundation of the entire application.

All users, assessments, analytics, reports, and permissions are ultimately connected to an organization or to the platform itself.

---

## Hierarchy

```text
Super Admin
    ↓
Organizations
    ↓
Admins
    ↓
Members
```

---

## Super Admin

The Super Admin belongs to WelcomeCure HealthTech.

The Super Admin has access to:

- All organizations
- All admins
- All members
- All assessments
- All reports
- All analytics
- Platform settings
- User management
- Organization management

The Super Admin can create, edit, activate, deactivate, and manage organizations.

---

## Organizations

Organizations are white-labelled clients of the platform.

Examples:

- Corporates
- MNCs
- NGOs
- Hospitals
- Clinics
- Doctors
- Educational Institutions
- Wellness Organizations
- Government Organizations

Each organization receives:

- Unique organization record
- Unique organization code
- Unique shareable assessment link
- Admin dashboard
- Member analytics

---

## Organization Codes

Every organization receives a unique alphanumeric code derived from its name.

The format is:

```
[INITIALS][SEQUENTIAL NUMBER padded to 4 digits]
```

Where `INITIALS` are the first letter of each word in the organization name (uppercase).

Examples:

```text
Aditya Birla        → AB0001
Asian Brown Brewerie → AAB001
Tata Consultancy    → TCS0001
Reliance Industries → RI0001
Life Hospital       → LH0001
```

The sequential number auto-increments per initial prefix (e.g., AB0001, AB0002, AB0003 for multiple orgs with same initials).

Organization codes are used to generate shareable assessment links.

Example:

```text
website.com/AB0001
```

---

## Organization Admins

Each organization can have one or more admins.

Examples:

- HR Admin
- Wellness Admin
- Doctor Admin
- Manager Admin

Current version may use a single admin.

System design must support multiple admins in the future.

Admins can only access:

- Their own organization
- Their own members
- Their own reports
- Their own analytics

Admins must never access data belonging to another organization.

---

## Members

Members are end users who complete assessments.

A member belongs to one of three acquisition sources:

### Organization Member

User joins through an organization link.

Example:

```text
website.com/ORG-7XQ2M8
```

The member is permanently linked to that organization.

---

### Direct Member

User arrives directly on the website.

Example:

```text
website.com
```

No organization relationship exists.

The member is managed directly by the Super Admin.

---

### Referral Member

A member refers another individual.

The referred individual is not automatically linked to the organization of the referring member.

Referral users are managed directly under the platform.

Organization assignment remains NULL unless explicitly assigned later.

---

## Organization Link Flow

Flow:

Organization
↓
Unique Code Generated
↓
Shareable Link Generated
↓
Member Opens Link
↓
Member Completes Assessment
↓
Member Automatically Mapped To Organization
↓
Admin Can View Member
↓
Super Admin Can View Everything

---

## Future Branch Support

The platform may support organization branches in future versions.

Example:

```text
Aditya Birla
    ├── Mumbai
    ├── Pune
    ├── Delhi
```

Current implementation does not require branch-level analytics.

Database design should remain compatible with future branch support.

---

## Ownership Rules

All organizations belong to WelcomeCure HealthTech.

Organizations receive access to their own data.

The platform retains overall ownership, administration, reporting, and system control.

All organization activity ultimately remains accessible to the Super Admin.
