import { redirect } from "next/navigation";
import { getSession } from "./session";
import type { Role } from "./roles";

export function requireAuth(): void {
  const session = getSession();
  if (!session) {
    redirect("/login");
  }
}

export function requireRole(allowedRoles: Role[]): void {
  const session = getSession();
  if (!session) {
    redirect("/login");
  }
  if (!allowedRoles.includes(session.role)) {
    redirect("/unauthorized");
  }
}

export function getAuthRedirect(role: Role): string {
  switch (role) {
    case "member":
      return "/dashboard";
    case "organization_admin":
      return "/admin/dashboard";
    case "superadmin":
      return "/superadmin/dashboard";
    default:
      return "/login";
  }
}
