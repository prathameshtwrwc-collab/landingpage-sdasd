"use client";

import dynamic from "next/dynamic";
import { useConsult } from "./ConsultContext";

const DynamicModal = dynamic(() => import("./ConsultModal"), { ssr: false, loading: () => null });

export default function LazyConsultModal() {
  const { isOpen } = useConsult();
  if (!isOpen) return null;
  return <DynamicModal />;
}
