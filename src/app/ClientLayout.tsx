"use client";

import { AssessmentProvider } from "@/components/assessment/AssessmentContext";
import AssessmentModal from "@/components/assessment/AssessmentModal";
import { ConsultProvider } from "@/components/consult/ConsultContext";
import ConsultModal from "@/components/consult/ConsultModal";
import FloatingTestButton from "@/components/FloatingTestButton";
import SmoothScrollProvider from "@/components/smooth-scroll/SmoothScrollProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AssessmentProvider>
        <ConsultProvider>
          <SmoothScrollProvider>
            {children}
            <AssessmentModal />
            <ConsultModal />
            <FloatingTestButton />
          </SmoothScrollProvider>
        </ConsultProvider>
      </AssessmentProvider>
    </AuthProvider>
  );
}