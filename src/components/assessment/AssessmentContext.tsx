"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface AssessmentContextValue {
  isOpen: boolean;
  open: () => void;
  openForRetest: (memberId: string) => void;
  close: () => void;
  retestMemberId: string | null;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [retestMemberId, setRetestMemberId] = useState<string | null>(null);
  const open = useCallback(() => {
    setRetestMemberId(null);
    setIsOpen(true);
  }, []);
  const openForRetest = useCallback((memberId: string) => {
    setRetestMemberId(memberId);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
    setRetestMemberId(null);
  }, []);

  return (
    <AssessmentContext.Provider value={{ isOpen, open, openForRetest, close, retestMemberId }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used within AssessmentProvider");
  return ctx;
}