export const ROLES = {
  MEMBER: "member",
  ORG_ADMIN: "organization_admin",
  SUPER_ADMIN: "superadmin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.MEMBER]: "Member",
  [ROLES.ORG_ADMIN]: "Organization Admin",
  [ROLES.SUPER_ADMIN]: "Super Admin",
};

// Maps Clerk publicMetadata roles to internal app roles
export const CLERK_ROLE_MAP: Record<string, Role> = {
  member: "member",
  admin: "organization_admin",
  organization_admin: "organization_admin",
  superadmin: "superadmin",
  super_admin: "superadmin",
};

export function mapClerkRole(clerkRole: string | undefined | null): Role {
  if (clerkRole && clerkRole in CLERK_ROLE_MAP) {
    return CLERK_ROLE_MAP[clerkRole];
  }
  return "member";
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}
