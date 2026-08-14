# 04 — User Roles & Permissions

**SDASD Sleep Chronotype & Wellness Platform**  
**Version:** 1.0  
**Date:** 2026-08-14

---

## 1. Role Definitions

The platform has three roles defined in `src/lib/auth/roles.ts`:

| Role | Internal ID | Clerk Metadata | Description |
|------|-------------|----------------|-------------|
| **Member** | `member` | `member` | Individual who takes the assessment and views personal results |
| **Organization Admin** | `organization_admin` | `admin`, `organization_admin` | Manages an organization's sleep wellness program |
| **Super Admin** | `superadmin` | `superadmin`, `super_admin` | Platform-level administrator with full access |

### Role Hierarchy

```
Super Admin (highest privilege)
  └── Organization Admin (org-scoped)
        └── Member (individual)
```

---

## 2. Permission Matrix

### 2.1 Member Permissions

| Feature | View | Create | Update | Delete | Manage |
|---------|------|--------|--------|--------|--------|
| Landing Page | ✅ | — | — | — | — |
| Take Assessment | ✅ | ✅ | — | — | — |
| View Own Result | ✅ | — | — | — | — |
| Download Own PDF Report | ✅ | — | — | — | — |
| Share Own Result | ✅ | — | — | — | — |
| Share Referral Link | ✅ | — | — | — | — |
| Book Consultation | ✅ | ✅ | — | — | — |
| Make Donation | ✅ | — | — | — | — |
| Retake Assessment | ✅ | ✅ | — | — | — |
| View Energy Curve | ✅ | — | — | — | — |
| View Recommendations | ✅ | — | — | — | — |
| Update Own Profile | — | — | ✅ (limited) | — | — |
| Delete Own Account | — | — | — | ✅ | — |

**Notes:**
- Members can only access their own data
- Profile update is limited to fields available in the assessment form
- No admin panel access
- No access to other members' data

---

### 2.2 Organization Admin Permissions

| Feature | View | Create | Update | Delete | Manage |
|---------|------|--------|--------|--------|--------|
| Admin Dashboard | ✅ | — | — | — | — |
| View Org Stats | ✅ | — | — | — | — |
| View Assessment Activity | ✅ | — | — | — | — |
| View Chronotype Distribution | ✅ | — | — | — | — |
| Manage Org Link | ✅ | — | ✅ (toggle active/paused) | — | ✅ |
| View Participants | ✅ | — | — | — | — |
| Search Participants | ✅ | — | — | — | — |
| Export Participants CSV | ✅ | — | — | — | — |
| View Reports | ✅ | — | — | — | — |
| View Analytics | ✅ | — | — | — | — |
| Update Org Settings | — | — | ✅ | — | — |
| Manage White-label | — | — | ✅ | — | — |
| Manage Notifications | — | — | — | — | ⚠️ Partial |
| Manage Team | — | — | — | — | ⚠️ Partial |
| Manage Share-link | — | — | ✅ | — | ✅ |
| Create Admins | — | ✅ | — | — | — |
| View Members | ✅ | — | — | — | — |
| Edit Members | — | — | ✅ | — | — |
| Delete Members | — | — | — | ✅ | — |

**Notes:**
- Organization Admin can only manage their own organization
- Cannot create or manage other organizations
- Cannot access Super Admin features
- Role check enforced client-side (`user.role !== "organization_admin"`) and server-side (Clerk auth)

---

### 2.3 Super Admin Permissions

| Feature | View | Create | Update | Delete | Manage |
|---------|------|--------|--------|--------|--------|
| Super Admin Dashboard | ✅ | — | — | — | — |
| View Platform Stats | ✅ | — | — | — | — |
| View All Orgs | ✅ | — | — | — | — |
| Create Organization | — | ✅ | — | — | — |
| Edit Organization | — | — | ✅ | — | — |
| Delete Organization | — | — | — | ✅ | — |
| Toggle Org Link | ✅ | — | ✅ | — | — |
| View All Admins | ✅ | — | — | — | — |
| Create Admin | — | ✅ | — | — | — |
| Edit Admin | — | — | ✅ | — | — |
| Delete Admin | — | — | — | ✅ | — |
| View All Members | ✅ | — | — | — | — |
| Edit Member | — | — | ✅ | — | — |
| Delete Member | — | — | — | ✅ | — |
| View Member Info | ✅ | — | — | — | — |
| View Last Assessment Answers | ✅ | — | — | — | — |
| CSV Export (Orgs) | ✅ | — | — | — | — |
| CSV Export (Admins) | ✅ | — | — | — | — |
| CSV Export (Members) | ✅ | — | — | — | — |
| View Audit Log | ✅ | — | — | — | — |
| View Consultation Leads | ✅ | — | — | — | — |
| View Reports & Analytics | ✅ | — | — | — | — |
| Platform Settings | — | — | ✅ | — | ✅ |
| Create Organization Admin | — | ✅ | — | — | — |

**Notes:**
- Super Admin has full CRUD on all organizations, admins, and members
- Cannot delete themselves (implicit — no self-delete UI)
- Cannot modify Clerk user passwords directly (password set during admin creation)

---

## 3. Access Control Implementation

### 3.1 Authentication Flow

```
User enters email
    ↓
/api/auth/check-user checks email
    ↓
Email found?
    ├── No → "No account found" → prompt to take assessment
    └── Yes → Check role
              ├── member → Direct login (session-based)
              └── admin / superadmin → Prompt for password → Clerk signIn
```

### 3.2 Role-Based Redirect

| Role | Redirect Target |
|------|-----------------|
| `member` | `/dashboard` |
| `organization_admin` | `/admin/dashboard` |
| `superadmin` | `/superadmin/dashboard` |

### 3.3 Route Protection

| Route | Protection |
|-------|------------|
| `/dashboard` | Requires `member` role (implicit — accessible if logged in) |
| `/admin/dashboard` | Requires `organization_admin` role (client-side check) |
| `/superadmin/dashboard` | Requires `superadmin` role (client-side check) |
| `/superadmin/login` | Separate login page; restricted access UI |

### 3.4 Server-Side Auth

- Clerk `auth()` used for server components and API routes
- API routes check `session?.userId` before returning data
- Super Admin API (`/api/admin`) checks `session.userId` and queries `organization_admins` table for org-scoped actions

---

## 4. Data Scoping

| Role | Data Scope |
|------|------------|
| **Member** | Own member record, own results, own recommendations, own reports |
| **Organization Admin** | Own organization's members, assessments, reports, settings |
| **Super Admin** | All organizations, all admins, all members, platform settings |

---

## 5. Current Gaps & To Be Confirmed

1. **Role assignment:** Who assigns the `organization_admin` role? Currently, it appears to be set during admin creation via Clerk. **To Be Confirmed.**

2. **Super Admin creation:** How is the first Super Admin created? The role must be set in Clerk metadata. **To Be Confirmed.**

3. **Permission enforcement on server:** Some admin routes rely on client-side role checks. Server-side enforcement should be verified for all sensitive operations.

4. **Member self-deletion:** Can members delete their own accounts? Not visible in current UI.

5. **Admin impersonation:** Can Super Admins view data as an Organization Admin? Not implemented.

6. **Audit trail details:** What actions are logged? Retention period? Not fully documented.

---

*This matrix reflects the current codebase implementation. For security-critical applications, server-side permission enforcement should be audited independently.*
