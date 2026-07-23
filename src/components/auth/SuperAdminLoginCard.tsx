"use client";

import { useState, type FormEvent } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, Shield } from "lucide-react";

export default function SuperAdminLoginCard() {
  const clerk = useClerk();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: FormEvent) => {
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
        await clerk.setActive({ session: result.createdSessionId });
        window.location.href = "/superadmin/dashboard";
      } else if (result.status === "needs_identifier" || result.status === "needs_first_factor") {
        setError("Additional verification required.");
      } else {
        setError("Sign in requires additional steps.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid email or password";
      if (message.toLowerCase().includes("not found") || message.toLowerCase().includes("does not exist")) {
        setError("No super admin account found with this email.");
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="flex items-center gap-[10px] mb-[28px]">
        <span className="flex items-center justify-center w-[38px] h-[38px] rounded-xl" style={{ background: "linear-gradient(135deg, #D32F2F, #FF6B6B)", boxShadow: "0 4px 12px rgba(211,47,47,0.25)" }}>
          <Shield size={18} stroke="white" strokeWidth={1.8} />
        </span>
        <span className="text-[18px] font-bold" style={{ color: "#D32F2F" }}>Chronotype Admin</span>
      </div>

      {error && (
        <div className="flex items-center gap-[8px] p-[10px] mb-[16px] rounded-lg text-[13px]" style={{ background: "rgba(211,47,47,0.06)", color: "#D32F2F" }}>
          <AlertCircle size={16} stroke="#D32F2F" />
          {error}
        </div>
      )}

      <form onSubmit={handleSignIn}>
        <h1 className="m-0 text-[24px] font-bold leading-[1.2] mb-[6px]" style={{ color: "#171717" }}>
          Admin Console
        </h1>
        <p className="m-0 text-[14px] leading-[1.5] mb-[28px]" style={{ color: "#888" }}>
          Restricted access for platform administration.
        </p>

        <div className="mb-[18px]">
          <label className="block text-[12px] font-semibold mb-[6px] uppercase tracking-[0.04em]" style={{ color: "#555" }}>
            Email Address
          </label>
          <div className="flex items-center w-full bg-white transition-all duration-150" style={{ borderRadius: "10px", border: "1.5px solid #D5D5D5" }}
            onFocusCapture={(e) => { e.currentTarget.style.borderColor = "#D32F2F"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(211,47,47,0.08)"; }}
            onBlurCapture={(e) => { e.currentTarget.style.borderColor = "#D5D5D5"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <span className="flex items-center justify-center pl-[14px] shrink-0"><Mail size={16} stroke="#AAA" /></span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" autoFocus
              className="w-full bg-transparent border-none px-[12px] py-[13px] text-[14px] outline-none" style={{ fontFamily: "Poppins, sans-serif", borderRadius: "10px" }} />
          </div>
        </div>

        <div className="mb-[22px]">
          <label className="block text-[12px] font-semibold mb-[6px] uppercase tracking-[0.04em]" style={{ color: "#555" }}>
            Password
          </label>
          <div className="flex items-center w-full bg-white transition-all duration-150" style={{ borderRadius: "10px", border: "1.5px solid #D5D5D5" }}
            onFocusCapture={(e) => { e.currentTarget.style.borderColor = "#D32F2F"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(211,47,47,0.08)"; }}
            onBlurCapture={(e) => { e.currentTarget.style.borderColor = "#D5D5D5"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <span className="flex items-center justify-center pl-[14px] shrink-0"><Lock size={16} stroke="#AAA" /></span>
            <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full bg-transparent border-none px-[12px] py-[13px] text-[14px] outline-none" style={{ fontFamily: "Poppins, sans-serif", borderRadius: "10px" }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="flex items-center justify-center pr-[14px] bg-transparent border-none cursor-pointer shrink-0" tabIndex={-1}>
              {showPassword ? <EyeOff size={16} stroke="#AAA" /> : <Eye size={16} stroke="#AAA" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}
          className="w-full text-white text-[15px] font-semibold py-[13px] border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-[8px] disabled:opacity-70"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, borderRadius: "10px", letterSpacing: "0.01em", background: "linear-gradient(135deg, #D32F2F, #FF6B6B)", boxShadow: "0 4px 16px rgba(211,47,47,0.25)" }}
          onMouseEnter={(e) => { if (!isSubmitting) { e.currentTarget.style.background = "linear-gradient(135deg, #B71C1C, #D32F2F)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(211,47,47,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #D32F2F, #FF6B6B)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(211,47,47,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : <>Sign In <ArrowRight size={18} stroke="white" strokeWidth={2.5} /></>}
        </button>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
}
