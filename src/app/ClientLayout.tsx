"use client";

import { useEffect } from "react";
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
import SitePreloader from "@/components/preloader/SitePreloader";
import ClerkErrorGuard from "@/components/ClerkErrorGuard";
import type { LocaleCode } from "@/i18n/locales";
import type { ReactNode } from "react";

function CssFeatureDetector() {
  useEffect(() => {
    const d = document.documentElement;
    if (typeof CSS !== "undefined" && CSS.supports) {
      if (!CSS.supports("font-size", "clamp(1px,1px,1px)")) d.setAttribute("data-no-clamp", "");
      if (!CSS.supports("height", "100dvh")) d.setAttribute("data-no-dvh", "");
      if (!CSS.supports("width", "min(1px,1px)")) d.setAttribute("data-no-min", "");
      if (!CSS.supports("scroll-margin-top", "1px")) d.setAttribute("data-no-scroll-margin", "");
      try {
        const t = document.createElement("div");
        t.style.display = "-webkit-flex";
        t.style.display = "flex";
        t.style.gap = "1px";
        d.appendChild(t);
        const s = getComputedStyle(t).gap;
        d.removeChild(t);
        if (s !== "1px") d.setAttribute("data-no-flexgap", "");
      } catch {
        d.setAttribute("data-no-flexgap", "");
      }
    }
  }, []);
  return null;
}

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
                  <ClerkErrorGuard>
                    <CssFeatureDetector />
                    {children}
                    <SitePreloader />
                    <LazyAssessmentModal />
                    <LazyConsultModal />
                    <FloatingTestButton />
                  </ClerkErrorGuard>
                </SmoothScrollProvider>
              </TTSProvider>
            </I18nProvider>
          </ConsultProvider>
        </AssessmentProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
