"use client";

import type { Role } from "@/lib/auth/roles";
import { ROLE_LABELS } from "@/lib/auth/roles";

const BADGE_STYLES: Record<Role, { bg: string; color: string }> = {
  member: { bg: "#F0FFF4", color: "#2E7D32" },
  organization_admin: { bg: "#F0F4FF", color: "#3B35A3" },
  superadmin: { bg: "#FFF0F0", color: "#D32F2F" },
};

export default function RoleBadge({ role }: { role: Role }) {
  const style = BADGE_STYLES[role];
  return (
    <span
      className="inline-block text-[11px] font-semibold px-[8px] py-[3px] rounded-full"
      style={{
        fontFamily: "Poppins, sans-serif",
        fontWeight: 600,
        background: style.bg,
        color: style.color,
      }}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
