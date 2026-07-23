"use client";

import { useState, type FormEvent } from "react";
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
  const [step, setStep] = useState<"email" | "password" | "not_found">("email");
  const [detectedRole, setDetectedRole] = useState<"member" | "admin" | "superadmin" | null>(null);
  const [detectedName, setDetectedName] = useState("");

  const checkEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.exists && data.role === "member") {
        setDetectedRole("member");
        const name = data.member?.first_name as string || email.split("@")[0];
        setDetectedName(name);
        const redirect = login(email, name, "member");
        router.push(redirect);
      } else if (data.exists && (data.role === "admin" || data.role === "superadmin")) {
        setDetectedRole(data.role);
        const name = data.admin?.first_name as string || data.member?.first_name as string || email.split("@")[0];
        setDetectedName(name);
        setStep("password");
      } else {
        setStep("not_found");
      }
    } catch {
      setError("Unable to verify email. Please try again.");
    } finally {
      setIsSubmitting(false);
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
      const result = await clerk.client.signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        const appRole: Role = detectedRole === "superadmin" ? "superadmin" : detectedRole === "admin" ? "organization_admin" : "member";
        const dashboardPath = appRole === "superadmin"
          ? "/superadmin/dashboard"
          : appRole === "organization_admin"
            ? "/admin/dashboard"
            : "/dashboard";
        login(email, detectedName || email.split("@")[0], appRole);
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
    try {
      const result = await clerk.client.signUp.create({
        emailAddress: email,
      });
      if (result.status === "missing_requirements") {
        router.push(`/login?signup=true&email=${encodeURIComponent(email)}`);
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
      <div className="flex items-center gap-[10px] mb-[32px]">
        <span className="flex items-center justify-center w-[38px] h-[38px] rounded-xl" style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)", boxShadow: "0 4px 12px rgba(53,49,155,0.25)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
        <span className="text-[18px] font-bold" style={{ color: "#1A1668" }}>Chronotype</span>
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
            <label className="block text-[12px] font-semibold mb-[6px] uppercase tracking-[0.04em]" style={{ color: "#555" }}>
              Email Address
            </label>
            <div className="flex items-center w-full bg-white transition-all duration-150" style={{ borderRadius: "10px", border: "1.5px solid #D5D5D5" }}>
              <span className="flex items-center justify-center pl-[14px] shrink-0"><Mail size={16} stroke="#AAA" /></span>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
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
            <label className="block text-[12px] font-semibold mb-[6px] uppercase tracking-[0.04em]" style={{ color: "#555" }}>
              Password
            </label>
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
