"use client";

import { AssessmentProvider } from "@/components/assessment/AssessmentContext";
import AssessmentModal from "@/components/assessment/AssessmentModal";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AssessmentProvider>
      {children}
      <AssessmentModal />
    </AssessmentProvider>
  );
}