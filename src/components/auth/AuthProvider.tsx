"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import type { AuthUser, Role } from "@/lib/auth/roles";
import { mapClerkRole } from "@/lib/auth/roles";
import { getSession, setSession, clearSession } from "@/lib/auth/session";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, name: string, role: Role) => string;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();
  const [sessionNonce, setSessionNonce] = useState(0);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setSessionNonce((n) => n + 1);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const derivedUser: AuthUser | null =
    isSignedIn && clerkUser
      ? {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
          name: clerkUser.fullName ?? clerkUser.firstName ?? clerkUser.id,
          role: clerkUser.publicMetadata?.role
            ? mapClerkRole(clerkUser.publicMetadata.role as string)
            : (getSession()?.role ?? "member"),
        }
      : getSession();

  void sessionNonce;

  const login = useCallback((email: string, name: string, role: Role): string => {
    const newUser: AuthUser = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      email,
      name,
      role,
    };
    setSession(newUser);
    setSessionNonce((n) => n + 1);
    return role === "member"
      ? "/dashboard"
      : role === "organization_admin"
        ? "/admin/dashboard"
        : "/superadmin/dashboard";
  }, []);

  const logout = useCallback(async () => {
    clearSession();
    if (isSignedIn) {
      await clerk.signOut();
    }
  }, [clerk, isSignedIn]);

  return (
    <AuthContext.Provider value={{ user: derivedUser, isLoading: !isLoaded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
