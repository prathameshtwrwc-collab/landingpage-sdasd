"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface ConsultContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ConsultContext = createContext<ConsultContextValue | null>(null);

export function ConsultProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ConsultContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ConsultContext.Provider>
  );
}

export function useConsult() {
  const ctx = useContext(ConsultContext);
  if (!ctx) throw new Error("useConsult must be used within ConsultProvider");
  return ctx;
}