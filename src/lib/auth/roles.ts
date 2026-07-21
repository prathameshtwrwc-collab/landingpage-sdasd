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

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}
