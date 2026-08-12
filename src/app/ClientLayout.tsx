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
import { TTSProvider } from "@/components/tts/TTSProvider";
import type { LocaleCode } from "@/i18n/locales";
import type { ReactNode } from "react";

interface ClientLayoutProps {
  children: ReactNode;
  locale: LocaleCode;
}

export default function ClientLayout({ children, locale }: ClientLayoutProps) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <AssessmentProvider>
          <ConsultProvider>
            <I18nProvider initialLocale={locale}>
              <TTSProvider>
                <SmoothScrollProvider>
                  {children}
                  <LazyAssessmentModal />
                  <LazyConsultModal />
                  <FloatingTestButton />
                </SmoothScrollProvider>
              </TTSProvider>
            </I18nProvider>
          </ConsultProvider>
        </AssessmentProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
