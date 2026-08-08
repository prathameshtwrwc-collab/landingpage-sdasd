"use client";

import dynamic from "next/dynamic";
import { useAssessment } from "./AssessmentContext";

const DynamicModal = dynamic(() => import("./AssessmentModal"), { ssr: false, loading: () => null });

export default function LazyAssessmentModal() {
  const { isOpen } = useAssessment();
  if (!isOpen) return null;
  return <DynamicModal />;
}
