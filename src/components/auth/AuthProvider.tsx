"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { AuthUser, Role } from "@/lib/auth/roles";
import { getSession, setSession, clearSession } from "@/lib/auth/session";
import { getAuthRedirect } from "@/lib/auth/guards";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, name: string, role: Role) => string;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, name: string, role: Role): string => {
    const newUser: AuthUser = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      email,
      name,
      role,
    };
    setSession(newUser);
    setUser(newUser);
    return getAuthRedirect(role);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
