"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { AssessmentProvider } from "@/components/assessment/AssessmentContext";
import LazyAssessmentModal from "@/components/assessment/LazyAssessmentModal";
import { ConsultProvider } from "@/components/consult/ConsultContext";
import LazyConsultModal from "@/components/consult/LazyConsultModal";
import FloatingTestButton from "@/components/FloatingTestButton";
import SmoothScrollProvider from "@/components/smooth-scroll/SmoothScrollProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <AssessmentProvider>
          <ConsultProvider>
            <I18nProvider>
              <SmoothScrollProvider>
                {children}
                <LazyAssessmentModal />
                <LazyConsultModal />
                <FloatingTestButton />
              </SmoothScrollProvider>
            </I18nProvider>
          </ConsultProvider>
        </AssessmentProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
