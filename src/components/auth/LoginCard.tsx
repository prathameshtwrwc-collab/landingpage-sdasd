"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import type { Role } from "@/lib/auth/roles";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";

type CheckResult = {
  exists: boolean;
  role?: "member" | "admin" | "superadmin";
  member?: Record<string, unknown>;
  admin?: Record<string, unknown>;
};

export default function LoginCard() {
  const clerk = useClerk();
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Flow state
  const [step, setStep] = useState<"email" | "verify" | "password" | "not_found">("email");
  const [detectedRole, setDetectedRole] = useState<"member" | "admin" | "superadmin" | null>(null);
  const [detectedName, setDetectedName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const checkEmail = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.exists && data.role === "superadmin") {
        setDetectedRole("superadmin");
        const name = data.admin?.first_name as string || normalizedEmail.split("@")[0];
        setDetectedName(name);
        setStep("password");
      } else if (data.exists && data.role === "member") {
        setDetectedRole("member");
        const name = data.member?.first_name as string || normalizedEmail.split("@")[0];
        setDetectedName(name);
        setStep("verify");
      } else if (data.exists && data.role === "admin") {
        setDetectedRole("admin");
        const name = data.admin?.first_name as string || normalizedEmail.split("@")[0];
        setDetectedName(name);
        setStep("verify");
      } else {
        setStep("not_found");
      }
    } catch {
      setError("Unable to verify email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendLoginOtp = async () => {
    if (!email.trim()) return;
    setOtpError("");
    setOtpSubmitting(true);
    try {
      const res = await fetch("/api/verify-email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send verification code");
      setOtpSent(true);
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "Failed to send verification code");
    } finally {
      setOtpSubmitting(false);
    }
  };

  const confirmLoginOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || !email.trim()) return;
    setOtpError("");
    setOtpSubmitting(true);
    try {
      const res = await fetch("/api/verify-email/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid verification code");
      if (detectedRole === "member") {
        const normalizedEmail = email.toLowerCase().trim();
        const redirect = login(normalizedEmail, detectedName || normalizedEmail.split("@")[0], "member");
        router.push(redirect);
      } else {
        setStep("password");
      }
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "Invalid verification code");
    } finally {
      setOtpSubmitting(false);
    }
  };

  const handlePasswordSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!clerk.client) {
      setError("Authentication not initialized.");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const normalizedEmail = email.toLowerCase().trim();
      const result = await clerk.client.signIn.create({
        identifier: normalizedEmail,
        password,
      });

      if (result.status === "complete") {
        const appRole: Role = detectedRole === "superadmin" ? "superadmin" : detectedRole === "admin" ? "organization_admin" : "member";
        const dashboardPath = appRole === "superadmin"
          ? "/superadmin/dashboard"
          : appRole === "organization_admin"
            ? "/admin/dashboard"
            : "/dashboard";
        login(normalizedEmail, detectedName || normalizedEmail.split("@")[0], appRole);
        await clerk.setActive({ session: result.createdSessionId });
        setTimeout(() => { window.location.href = dashboardPath; }, 200);
        return;
      } else {
        setError("Additional verification required.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async () => {
    setIsSubmitting(true);
    const normalizedEmail = email.toLowerCase().trim();
    try {
      const result = await clerk.client.signUp.create({
        emailAddress: normalizedEmail,
      });
      if (result.status === "missing_requirements") {
        router.push(`/login?signup=true&email=${encodeURIComponent(normalizedEmail)}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Logo */}
      <div className="flex items-center gap-[12px] mb-[32px]">
        <img src="/assets/logos/logo3.png" alt="Chronotype" style={{ height: "52px", width: "auto", objectFit: "contain" }} />
        <span className="text-[20px] font-bold" style={{ color: "#1A1668" }}>Chronotype</span>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-[8px] p-[10px] mb-[16px] rounded-lg text-[13px]" style={{ background: "rgba(211,47,47,0.06)", color: "#D32F2F" }}>
          <AlertCircle size={16} stroke="#D32F2F" />
          {error}
        </div>
      )}

      {step === "email" && (
        <form onSubmit={checkEmail}>
          <h1 className="m-0 text-[26px] font-bold leading-[1.2] mb-[6px]" style={{ color: "#171717" }}>
            Welcome back
          </h1>
          <p className="m-0 text-[14px] leading-[1.5] mb-[28px]" style={{ color: "#888" }}>
            Enter your email to continue your sleep journey.
          </p>

          <div className="mb-[20px]">
            <div className="flex items-center gap-[8px] mb-[6px]">
              <label className="block text-[12px] font-semibold uppercase tracking-[0.04em]" style={{ color: "#555" }}>
                Email Address
              </label>
            </div>
            <div className="flex items-center w-full bg-white transition-all duration-150" style={{ borderRadius: "10px", border: "1.5px solid #D5D5D5" }}>
              <span className="flex items-center justify-center pl-[14px] shrink-0"><Mail size={16} stroke="#AAA" /></span>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="you@example.com" autoFocus
                className="w-full bg-transparent border-none px-[12px] py-[13px] text-[14px] outline-none"
                style={{ fontFamily: "Poppins, sans-serif", borderRadius: "10px" }}
                onFocus={(e) => { e.currentTarget.closest("div")!.style.borderColor = "#35319B"; e.currentTarget.closest("div")!.style.boxShadow = "0 0 0 3px rgba(53,49,155,0.08)"; }}
                onBlur={(e) => { e.currentTarget.closest("div")!.style.borderColor = "#D5D5D5"; e.currentTarget.closest("div")!.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full text-white text-[15px] font-semibold py-[13px] border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-[8px] disabled:opacity-70"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, borderRadius: "10px", background: "linear-gradient(135deg, #35319B, #5A55C0)", boxShadow: "0 4px 16px rgba(53,49,155,0.25)" }}
            onMouseEnter={(e) => { if (!isSubmitting) { e.currentTarget.style.background = "linear-gradient(135deg, #2D2890, #4A45B0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(53,49,155,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #35319B, #5A55C0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(53,49,155,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Checking…</> : <>Continue <ArrowRight size={18} stroke="white" strokeWidth={2.5} /></>}
          </button>

          <p className="m-0 mt-[20px] text-[12px] leading-[1.4] text-center" style={{ color: "#AAA" }}>
            Haven&apos;t taken the assessment yet?{" "}
            <a href="/" className="font-semibold no-underline" style={{ color: "#35319B" }}>Take the test</a>
          </p>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={confirmLoginOtp}>
          <div className="flex items-center gap-[6px] mb-[20px]">
            <button type="button" onClick={() => { setStep("email"); setOtp(""); setOtpError(""); setOtpSent(false); }}
              className="bg-transparent border-none cursor-pointer p-[4px] hover:opacity-70 transition-opacity" style={{ color: "#888" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="text-[12px]" style={{ color: "#999" }}>{email}</span>
          </div>

          <h1 className="m-0 text-[26px] font-bold leading-[1.2] mb-[6px]" style={{ color: "#171717" }}>
            Verify your email
          </h1>
          <p className="m-0 text-[14px] leading-[1.5] mb-[28px]" style={{ color: "#888" }}>
            Enter the 6-digit code sent to <strong style={{ color: "#35319B" }}>{email}</strong>.
          </p>

          <div className="mb-[20px]">
            <div className="flex items-center gap-[8px] mb-[6px]">
              <label className="block text-[12px] font-semibold uppercase tracking-[0.04em]" style={{ color: "#555" }}>
                Verification Code
              </label>
            </div>
            <div className="flex items-center gap-[8px]">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                autoFocus
                className="flex-1 bg-white transition-all duration-150"
                style={{ borderRadius: "10px", border: "1.5px solid #D5D5D5", fontFamily: "Poppins, sans-serif", padding: "13px 12px", fontSize: "14px" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#35319B"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(53,49,155,0.08)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#D5D5D5"; e.currentTarget.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={sendLoginOtp}
                disabled={otpSubmitting}
                className="px-[16px] py-[10px] text-[13px] font-semibold border-none cursor-pointer transition-colors disabled:opacity-60"
                style={{ borderRadius: "10px", background: "#35319B", color: "#FFF", fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap" }}
              >
                {otpSubmitting ? "Sending..." : otpSent ? "Resend" : "Send Code"}
              </button>
            </div>
            {otpError && (
              <p className="m-0 text-[12px] text-red-500 mt-[3px]" style={{ fontFamily: "Poppins, sans-serif" }}>{otpError}</p>
            )}
            {otpSent && (
              <p className="m-0 text-[12px] mt-[3px]" style={{ color: "#555", fontFamily: "Poppins, sans-serif" }}>
                Code sent to {email}
              </p>
            )}
          </div>

          <button type="submit" disabled={otpSubmitting || otp.length !== 6}
            className="w-full text-white text-[15px] font-semibold py-[13px] border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-[8px] disabled:opacity-70"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, borderRadius: "10px", background: "linear-gradient(135deg, #35319B, #5A55C0)", boxShadow: "0 4px 16px rgba(53,49,155,0.25)" }}
            onMouseEnter={(e) => { if (!otpSubmitting && otp.length === 6) { e.currentTarget.style.background = "linear-gradient(135deg, #2D2890, #4A45B0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(53,49,155,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #35319B, #5A55C0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(53,49,155,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {otpSubmitting ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : <>Verify Email <ArrowRight size={18} stroke="white" strokeWidth={2.5} /></>}
          </button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={handlePasswordSignIn}>
          <div className="flex items-center gap-[6px] mb-[20px]">
            <button type="button" onClick={() => { setStep("email"); setPassword(""); setError(""); }}
              className="bg-transparent border-none cursor-pointer p-[4px] hover:opacity-70 transition-opacity" style={{ color: "#888" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="text-[12px]" style={{ color: "#999" }}>{email}</span>
          </div>

          <h1 className="m-0 text-[26px] font-bold leading-[1.2] mb-[6px]" style={{ color: "#171717" }}>
            {detectedRole === "superadmin" ? "Admin Access" : "Welcome back"}
          </h1>
          <p className="m-0 text-[14px] leading-[1.5] mb-[28px]" style={{ color: "#888" }}>
            {detectedRole === "superadmin" ? "Enter your password to access the admin console." : `Enter your password to continue, ${detectedName}.`}
          </p>

          <div className="mb-[20px]">
            <div className="flex items-center gap-[8px] mb-[6px]">
              <label className="block text-[12px] font-semibold uppercase tracking-[0.04em]" style={{ color: "#555" }}>
                Password
              </label>
            </div>
            <div className="flex items-center w-full bg-white transition-all duration-150" style={{ borderRadius: "10px", border: "1.5px solid #D5D5D5" }}>
              <span className="flex items-center justify-center pl-[14px] shrink-0"><Lock size={16} stroke="#AAA" /></span>
              <input
                type={showPassword ? "text" : "password"} required value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoFocus
                className="w-full bg-transparent border-none px-[12px] py-[13px] text-[14px] outline-none"
                style={{ fontFamily: "Poppins, sans-serif", borderRadius: "10px" }}
                onFocus={(e) => { e.currentTarget.closest("div")!.style.borderColor = "#35319B"; e.currentTarget.closest("div")!.style.boxShadow = "0 0 0 3px rgba(53,49,155,0.08)"; }}
                onBlur={(e) => { e.currentTarget.closest("div")!.style.borderColor = "#D5D5D5"; e.currentTarget.closest("div")!.style.boxShadow = "none"; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="flex items-center justify-center pr-[14px] bg-transparent border-none cursor-pointer shrink-0" tabIndex={-1}>
                {showPassword ? <EyeOff size={16} stroke="#AAA" /> : <Eye size={16} stroke="#AAA" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full text-white text-[15px] font-semibold py-[13px] border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-[8px] disabled:opacity-70"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, borderRadius: "10px", background: "linear-gradient(135deg, #35319B, #5A55C0)", boxShadow: "0 4px 16px rgba(53,49,155,0.25)" }}
            onMouseEnter={(e) => { if (!isSubmitting) { e.currentTarget.style.background = "linear-gradient(135deg, #2D2890, #4A45B0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(53,49,155,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #35319B, #5A55C0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(53,49,155,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : <>Sign In <ArrowRight size={18} stroke="white" strokeWidth={2.5} /></>}
          </button>

          <button type="button" className="mt-[12px] w-full text-[13px] font-medium bg-transparent border-none cursor-pointer text-center transition-colors" style={{ color: "#888" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#35319B"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#888"; }}
          >Forgot password?</button>
        </form>
      )}

      {step === "not_found" && (
        <div>
          <h1 className="m-0 text-[26px] font-bold leading-[1.2] mb-[6px]" style={{ color: "#171717" }}>
            No account found
          </h1>
          <p className="m-0 text-[14px] leading-[1.5] mb-[8px]" style={{ color: "#888" }}>
            We couldn&apos;t find an account with <strong className="font-semibold" style={{ color: "#35319B" }}>{email}</strong>.
          </p>
          <p className="m-0 text-[14px] leading-[1.5] mb-[28px]" style={{ color: "#888" }}>
            Take the sleep chronotype assessment first to create your profile.
          </p>

          <a href="/"
            className="w-full text-white text-[15px] font-semibold py-[13px] no-underline flex items-center justify-center gap-[8px] transition-all duration-200"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, borderRadius: "10px", background: "linear-gradient(135deg, #35319B, #5A55C0)", boxShadow: "0 4px 16px rgba(53,49,155,0.25)" }}
          >
            Take the Assessment <ArrowRight size={18} stroke="white" strokeWidth={2.5} />
          </a>

          <button type="button" onClick={() => { setStep("email"); setEmail(""); setError(""); }}
            className="mt-[12px] w-full text-[13px] font-medium bg-transparent border-none cursor-pointer text-center transition-colors" style={{ color: "#888" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#35319B"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#888"; }}
          >Try a different email</button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
}
