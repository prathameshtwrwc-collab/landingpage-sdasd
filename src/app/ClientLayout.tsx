"use client";

import { AssessmentProvider } from "@/components/assessment/AssessmentContext";
import AssessmentModal from "@/components/assessment/AssessmentModal";
import { ConsultProvider } from "@/components/consult/ConsultContext";
import ConsultModal from "@/components/consult/ConsultModal";
import FloatingTestButton from "@/components/FloatingTestButton";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AssessmentProvider>
      <ConsultProvider>
        {children}
        <AssessmentModal />
        <ConsultModal />
        <FloatingTestButton />
      </ConsultProvider>
    </AssessmentProvider>
  );
}