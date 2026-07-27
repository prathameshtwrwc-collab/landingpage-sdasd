"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface ConsultPrefill {
  fname?: string;
  lname?: string;
  age?: string;
  gender?: string;
  maritalStatus?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  email?: string;
  phone?: string;
}

interface ConsultContextValue {
  isOpen: boolean;
  open: () => void;
  openPrefilled: (data: ConsultPrefill) => void;
  close: () => void;
  prefill: ConsultPrefill | null;
}

const ConsultContext = createContext<ConsultContextValue | null>(null);

export function ConsultProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<ConsultPrefill | null>(null);
  const open = useCallback(() => { setPrefill(null); setIsOpen(true); }, []);
  const openPrefilled = useCallback((data: ConsultPrefill) => { setPrefill(data); setIsOpen(true); }, []);
  const close = useCallback(() => { setIsOpen(false); setPrefill(null); }, []);

  return (
    <ConsultContext.Provider value={{ isOpen, open, openPrefilled, close, prefill }}>
      {children}
    </ConsultContext.Provider>
  );
}

export function useConsult() {
  const ctx = useContext(ConsultContext);
  if (!ctx) throw new Error("useConsult must be used within ConsultProvider");
  return ctx;
}