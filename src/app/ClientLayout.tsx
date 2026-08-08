"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { AssessmentProvider } from "@/components/assessment/AssessmentContext";
import LazyAssessmentModal from "@/components/assessment/LazyAssessmentModal";
import { ConsultProvider } from "@/components/consult/ConsultContext";
import LazyConsultModal from "@/components/consult/LazyConsultModal";
import FloatingTestButton from "@/components/FloatingTestButton";
import SmoothScrollProvider from "@/components/smooth-scroll/SmoothScrollProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <AssessmentProvider>
          <ConsultProvider>
            <SmoothScrollProvider>
              {children}
              <LazyAssessmentModal />
              <LazyConsultModal />
              <FloatingTestButton />
            </SmoothScrollProvider>
          </ConsultProvider>
        </AssessmentProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
