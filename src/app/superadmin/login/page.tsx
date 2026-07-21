"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginCard from "@/components/auth/LoginCard";

export default function SuperAdminLoginPage() {
  return (
    <AuthLayout
      title="Super Admin Access"
      subtitle="Restricted access for platform administration."
      variant="superadmin"
    >
      <LoginCard
        defaultRole="superadmin"
        showRoleToggle={false}
        roles={["superadmin"]}
        headingMember="Super Admin Access"
        subtitleMember="Restricted access for platform administration."
        buttonMember="Sign In as Super Admin"
      />

      <div
        className="mt-[20px] flex items-center justify-center gap-[8px]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <p
          className="m-0 text-[12px] leading-[1.4] text-center"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            color: "rgba(0,0,0,0.45)",
          }}
        >
          Authorized personnel only. This route is not publicly linked.
        </p>
      </div>
    </AuthLayout>
  );
}
