"use client";

import { Moon } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginCard from "@/components/auth/LoginCard";

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue to your dashboard.">
      {/* Decorative illustration */}
      <div className="flex justify-center mb-[24px] -mt-[4px]">
        <div
          className="flex items-center justify-center w-[80px] h-[80px] rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(53, 49, 155, 0.06), rgba(90, 85, 192, 0.12))",
          }}
        >
          <Moon size={36} stroke="#35319B" strokeWidth={1.5} />
        </div>
      </div>
      <LoginCard />
    </AuthLayout>
  );
}
