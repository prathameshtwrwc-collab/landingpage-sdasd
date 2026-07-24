"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { ROLE_LABELS, type Role } from "@/lib/auth/roles";
import {
  Moon, LayoutDashboard, Users, Settings, Shield, Activity,
  BarChart3, LogOut, Home, User, TrendingUp, Calendar,
  Bell, FileText, Sparkles, Star, ChevronRight, ChevronUp,
  ChevronDown, Building2, ClipboardList, Link2, Search,
  X, Menu
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string;
}

const roleNavItems: Record<Role, NavItem[]> = {
  member: [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Sleep Assessment", href: "/dashboard/assessment", icon: <Activity size={18} /> },
    { label: "Sleep Score", href: "/dashboard/score", icon: <Activity size={18} /> },
    { label: "Chronotype", href: "/dashboard/chronotype", icon: <Sparkles size={18} /> },
    { label: "Energy Timeline", href: "/dashboard/energy", icon: <TrendingUp size={18} /> },
    { label: "Blueprint", href: "/dashboard/blueprint", icon: <FileText size={18} /> },
    { label: "Recommendations", href: "/dashboard/recommendations", icon: <Star size={18} /> },
    { label: "Progress", href: "/dashboard/progress", icon: <TrendingUp size={18} /> },
    { label: "Goals", href: "/dashboard/goals", icon: <Star size={18} /> },
    { label: "Insights", href: "/dashboard/insights", icon: <TrendingUp size={18} /> },
    { label: "Calendar", href: "/dashboard/calendar", icon: <Calendar size={18} /> },
    { label: "Profile", href: "/dashboard/profile", icon: <User size={18} /> },
    { label: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
  ],
  organization_admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Participants", href: "/admin/dashboard/participants", icon: <Users size={18} /> },
    { label: "Results", href: "/admin/dashboard/reports", icon: <ClipboardList size={18} /> },
    { label: "Analytics", href: "/admin/dashboard/analytics", icon: <TrendingUp size={18} /> },
    { label: "Share Link", href: "/admin/dashboard/share-link", icon: <Link2 size={18} /> },
    { label: "Notifications", href: "/admin/dashboard/notifications", icon: <Bell size={18} />, badge: "3" },
    { label: "Team", href: "/admin/dashboard/team", icon: <Users size={18} /> },
    { label: "Settings", href: "/admin/dashboard/settings", icon: <Settings size={18} /> },
  ],
  superadmin: [
    { label: "Dashboard", href: "/superadmin/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Organizations", href: "/superadmin/dashboard/organizations", icon: <Building2 size={18} /> },
    { label: "Users", href: "/superadmin/dashboard/users", icon: <Users size={18} /> },
    { label: "Reports", href: "/superadmin/dashboard/reports", icon: <BarChart3 size={18} /> },
    { label: "Analytics", href: "/superadmin/dashboard/analytics", icon: <Activity size={18} /> },
    { label: "Audit Log", href: "/superadmin/dashboard/audit", icon: <FileText size={18} /> },
    { label: "System", href: "/superadmin/dashboard/system", icon: <Shield size={18} /> },
    { label: "Settings", href: "/superadmin/dashboard/settings", icon: <Settings size={18} /> },
  ],
};

const MOBILE_MAIN_COUNT = 4;

function MobileBottomSheet({
  items,
  onClose,
  onLogout,
  onHome,
}: {
  items: NavItem[];
  onClose: () => void;
  onLogout: () => void;
  onHome: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60]" style={{ background: "rgba(15,23,42,0.35)" }} onClick={onClose}>
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-[20px] overflow-hidden"
        style={{ background: "#FFFFFF", maxHeight: "70vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center pt-[12px] pb-[6px]">
          <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "#D5D5D5" }} />
        </div>
        <div className="px-[16px] pb-[24px] overflow-y-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.05em] mb-[8px] px-[8px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>More</p>
          <div className="flex flex-col gap-[2px]">
            {items.map((item) => (
              <Link key={item.href} href={item.href} onClick={onClose}
                className="flex items-center gap-[12px] px-[12px] py-[12px] no-underline rounded-xl transition-colors"
                style={{ color: "#555", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
                <span style={{ color: "#888" }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div style={{ borderTop: "1px solid #F0F0F0", margin: "8px 0", paddingTop: "4px" }}>
              <button onClick={() => { onHome(); onClose(); }}
                className="flex items-center gap-[12px] w-full px-[12px] py-[12px] rounded-xl border-none bg-transparent cursor-pointer text-left transition-colors"
                style={{ color: "#555", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
                <Home size={18} style={{ color: "#888" }} /> Home
              </button>
              <button onClick={() => { onLogout(); onClose(); }}
                className="flex items-center gap-[12px] w-full px-[12px] py-[12px] rounded-xl border-none bg-transparent cursor-pointer text-left transition-colors"
                style={{ color: "#D92D20", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const navItems = user ? (roleNavItems[user.role] ?? roleNavItems.member) : roleNavItems.member;

  const isActive = (href: string) => pathname === href;
  const activeItem = navItems.find((i) => isActive(i.href));
  const mobileMainItems = navItems.slice(0, MOBILE_MAIN_COUNT);
  const mobileMoreItems = navItems.slice(MOBILE_MAIN_COUNT);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "Poppins, sans-serif", background: "#F8FAFC" }}>
        <div className="text-center">
          <div className="w-[28px] h-[28px] mx-auto mb-[10px] rounded-full border-2 border-[#35319B] border-t-transparent animate-spin" />
          <p className="text-[13px]" style={{ color: "#667085" }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Poppins, sans-serif", background: "#F8FAFC" }}>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-[260px] md:z-40"
        style={{ background: "#FFFFFF", borderRight: "1px solid #E6E8F0" }}>
        {/* Brand */}
        <div className="flex items-center gap-[10px] px-[20px] h-[68px] shrink-0" style={{ borderBottom: "1px solid #F1F4FA" }}>
          <span className="flex items-center justify-center w-[34px] h-[34px] rounded-xl shrink-0"
            style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)" }}>
            <Moon size={16} stroke="white" strokeWidth={2} />
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold leading-[1.2]" style={{ color: "#19164F", fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>Chronotype</span>
            <span className="text-[10px] font-medium" style={{ color: "#667085", fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
              {ROLE_LABELS[user?.role ?? "member"]}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-[12px] py-[16px] space-y-[2px]">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center justify-between px-[12px] py-[10px] rounded-xl text-[13px] font-medium no-underline transition-all duration-150"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: active ? 600 : 500,
                  background: active ? "rgba(59,53,163,0.08)" : "transparent",
                  color: active ? "#35319B" : "#667085",
                  position: "relative",
                }}>
                <span className="flex items-center gap-[10px]">
                  <span style={{ color: active ? "#35319B" : "#98A2B3" }}>{item.icon}</span>
                  {item.label}
                </span>
                <span className="flex items-center gap-[4px]">
                  {item.badge && (
                    <span className="text-[10px] font-bold px-[5px] py-[1px] rounded-full"
                      style={{ background: "rgba(59,53,163,0.1)", color: "#35319B", fontFamily: "Poppins, sans-serif" }}>
                      {item.badge}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-[12px] pb-[16px] flex items-center justify-between"
          style={{ borderTop: "1px solid #F1F4FA", paddingTop: "12px" }}>
          <Link href="/" className="flex items-center gap-[8px] text-[12px] font-medium no-underline"
            style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}>
            <Home size={14} /> Home
          </Link>
          <button onClick={async () => { await logout(); window.location.href = "/login"; }}
            className="flex items-center gap-[6px] text-[12px] font-medium bg-none border-none cursor-pointer"
            style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="md:ml-[260px] flex-1 flex flex-col min-h-screen">

        {/* Top header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-[20px] md:px-[32px]"
          style={{ height: "68px", background: "#FFFFFF", borderBottom: "1px solid #F1F4FA" }}>
          <div>
            <h1 className="m-0 text-[20px] md:text-[22px] font-bold tracking-[-0.02em]"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#19164F" }}>
              {title || (activeItem?.label ?? "Dashboard")}
            </h1>
          </div>
          {user && (
            <div className="flex items-center gap-[10px]">
              <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white text-[13px] font-bold"
                style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)" }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-[13px] font-medium hidden sm:block" style={{ color: "#667085", fontFamily: "Poppins, sans-serif" }}>
                {user.name}
              </span>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 px-[16px] md:px-[32px] py-[20px] md:py-[28px] pb-[110px] md:pb-[28px]">
          {children}
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
        style={{ height: "68px", background: "#FFFFFF", borderTop: "1px solid #E6E8F0", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {mobileMainItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center justify-center gap-[2px] no-underline min-w-0 flex-1 relative"
              style={{ padding: "4px 2px", height: "100%" }}>
              <span className="flex items-center justify-center" style={{ color: active ? "#35319B" : "#98A2B3" }}>
                {item.icon}
              </span>
              <span className="text-[10px] font-semibold leading-[1] text-center truncate w-full max-w-[60px]"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: active ? 600 : 500, color: active ? "#35319B" : "#98A2B3" }}>
                {item.label}
              </span>
              {active && <span className="absolute top-0 left-[25%] right-[25%] h-[2px] rounded-full" style={{ background: "#35319B" }} />}
            </Link>
          );
        })}
        <button onClick={() => setMoreOpen(true)}
          className="flex flex-col items-center justify-center gap-[2px] no-underline min-w-0 flex-1 bg-transparent border-none cursor-pointer"
          style={{ padding: "4px 2px", height: "100%" }}>
          <span style={{ color: "#98A2B3" }}>
            <Menu size={18} />
          </span>
          <span className="text-[10px] font-semibold leading-[1] text-center truncate w-full max-w-[60px]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, color: "#98A2B3" }}>
            More
          </span>
        </button>
      </nav>

      {moreOpen && (
        <MobileBottomSheet
          items={mobileMoreItems}
          onClose={() => setMoreOpen(false)}
          onLogout={async () => { await logout(); window.location.href = "/login"; }}
          onHome={() => { window.location.href = "/"; }}
        />
      )}

      <div className="md:hidden h-[68px]" />
    </div>
  );
}
