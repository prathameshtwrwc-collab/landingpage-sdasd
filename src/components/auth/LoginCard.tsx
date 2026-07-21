"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/auth/roles";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginCard({
  defaultRole = "member",
  showRoleToggle = true,
  roles = ["member", "organization_admin"] as Role[],
  headingMember = "Welcome to Chronotype",
  subtitleMember = "Sign in to view your sleep rhythm and wellness insights.",
  buttonMember = "Sign In",
  headingAdmin = "Organization Admin Login",
  subtitleAdmin = "Access participant results, reports, and organization insights.",
  buttonAdmin = "Sign In as Admin",
}: {
  defaultRole?: Role;
  showRoleToggle?: boolean;
  roles?: Role[];
  headingMember?: string;
  subtitleMember?: string;
  buttonMember?: string;
  headingAdmin?: string;
  subtitleAdmin?: string;
  buttonAdmin?: string;
}) {
  const { login } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<Role>(defaultRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMember = role === "member";
  const useMemberHeading = isMember || !showRoleToggle;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const name = email.split("@")[0];
    const redirectPath = login(email, name, role);
    setTimeout(() => {
      router.push(redirectPath);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Role Toggle */}
      {showRoleToggle && roles.length > 1 && (
        <div className="flex w-full mb-[24px] p-[4px] bg-gray-50" style={{ borderRadius: "12px" }}>
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className="flex-1 py-[10px] text-[13px] font-semibold cursor-pointer border-none transition-all duration-200"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                borderRadius: "10px",
                background: role === r
                  ? "linear-gradient(135deg, #35319B, #5A55C0)"
                  : "transparent",
                color: role === r ? "#FFFFFF" : "#999",
                boxShadow: role === r ? "0 2px 8px rgba(53, 49, 155, 0.2)" : "none",
              }}
            >
              <span className="flex items-center justify-center gap-[6px]">
                {r === "member" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={role === r ? "white" : "#999"} strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={role === r ? "white" : "#999"} strokeWidth="2" strokeLinecap="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                )}
                {r === "member" ? "Member" : "Organization Admin"}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Headings */}
      <h2
        className="m-0 text-[18px] font-semibold leading-[1.3]"
        style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#171717", marginBottom: "4px" }}
      >
        {useMemberHeading ? headingMember : headingAdmin}
      </h2>
      <p
        className="m-0 text-[13px] leading-[1.5] mb-[24px]"
        style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, color: "#999" }}
      >
        {useMemberHeading ? subtitleMember : subtitleAdmin}
      </p>

      {/* Email */}
      <div className="mb-[18px]">
        <label
          className="block text-[12px] font-semibold mb-[6px] uppercase tracking-[0.04em]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#555" }}
        >
          Email Address
        </label>
        <div
          className="flex items-center w-full bg-white transition-all duration-150"
          style={{
            borderRadius: "10px",
            border: "1.5px solid #D5D5D5",
          }}
          onFocusCapture={(e) => {
            const parent = e.currentTarget;
            parent.style.borderColor = "#35319B";
            parent.style.boxShadow = "0 0 0 3px rgba(53, 49, 155, 0.08)";
          }}
          onBlurCapture={(e) => {
            const parent = e.currentTarget;
            parent.style.borderColor = "#D5D5D5";
            parent.style.boxShadow = "none";
          }}
        >
          <span className="flex items-center justify-center pl-[14px] shrink-0">
            <Mail size={16} stroke="#AAA" />
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-transparent border-none px-[12px] py-[12px] text-[14px] outline-none"
            style={{ fontFamily: "Poppins, sans-serif", borderRadius: "10px" }}
          />
        </div>
      </div>

      {/* Password */}
      <div className="mb-[10px]">
        <label
          className="block text-[12px] font-semibold mb-[6px] uppercase tracking-[0.04em]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#555" }}
        >
          Password
        </label>
        <div
          className="flex items-center w-full bg-white transition-all duration-150"
          style={{
            borderRadius: "10px",
            border: "1.5px solid #D5D5D5",
          }}
          onFocusCapture={(e) => {
            const parent = e.currentTarget;
            parent.style.borderColor = "#35319B";
            parent.style.boxShadow = "0 0 0 3px rgba(53, 49, 155, 0.08)";
          }}
          onBlurCapture={(e) => {
            const parent = e.currentTarget;
            parent.style.borderColor = "#D5D5D5";
            parent.style.boxShadow = "none";
          }}
        >
          <span className="flex items-center justify-center pl-[14px] shrink-0">
            <Lock size={16} stroke="#AAA" />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-transparent border-none px-[12px] py-[12px] text-[14px] outline-none"
            style={{ fontFamily: "Poppins, sans-serif", borderRadius: "10px" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex items-center justify-center pr-[14px] bg-transparent border-none cursor-pointer shrink-0"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={16} stroke="#AAA" />
            ) : (
              <Eye size={16} stroke="#AAA" />
            )}
          </button>
        </div>
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between mb-[22px]">
        <label className="flex items-center gap-[8px] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-[16px] h-[16px] accent-[#35319B] cursor-pointer"
            style={{ borderRadius: "4px" }}
          />
          <span
            className="text-[12px] leading-[1]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, color: "#888" }}
          >
            Remember me
          </span>
        </label>
        <button
          type="button"
          className="text-[12px] font-medium bg-transparent border-none cursor-pointer transition-colors duration-150"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            color: "#888",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#35319B"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#888"; }}
        >
          Forgot password?
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full text-white text-[15px] font-semibold py-[14px] border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-[8px]"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          borderRadius: "10px",
          letterSpacing: "0.01em",
          background: "linear-gradient(135deg, #35319B, #5A55C0)",
          boxShadow: "0 4px 16px rgba(53, 49, 155, 0.25)",
          opacity: isSubmitting ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.background = "linear-gradient(135deg, #2D2890, #4A45B0)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(53, 49, 155, 0.35)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #35319B, #5A55C0)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(53, 49, 155, 0.25)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {isSubmitting ? "Signing in…" : useMemberHeading ? buttonMember : buttonAdmin}
        {!isSubmitting && <ArrowRight size={18} stroke="white" strokeWidth={2.5} />}
      </button>
    </form>
  );
}
