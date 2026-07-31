"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { ROLE_LABELS, type Role } from "@/lib/auth/roles";
import {
  LayoutDashboard, Users, Settings, Shield, Activity,
  BarChart3, LogOut, Home, User, TrendingUp, Calendar,
  Bell, FileText, Sparkles, Star, ChevronRight, ChevronUp,
  ChevronDown, Building2, ClipboardList, Link2, Search,
  X, Menu, Palette, Phone, Heart, ChevronLeft
} from "lucide-react";
import DonateModal from "@/components/DonateModal";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string;
}

const roleNavItems: Record<Role, NavItem[]> = {
  member: [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={22} /> },
    { label: "Chronotype", href: "/dashboard/chronotype", icon: <Sparkles size={22} /> },
    { label: "Energy Timeline", href: "/dashboard/energy", icon: <TrendingUp size={22} /> },
    { label: "Recommendations", href: "/dashboard/recommendations", icon: <Star size={22} /> },
    { label: "Progress", href: "/dashboard/progress", icon: <Activity size={22} /> },
    { label: "Goals", href: "/dashboard/goals", icon: <Calendar size={22} /> },
    { label: "Profile", href: "/dashboard/profile", icon: <User size={22} /> },
    { label: "Settings", href: "/dashboard/settings", icon: <Settings size={22} /> },
  ],
  organization_admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={22} /> },
    { label: "Participants", href: "/admin/dashboard/participants", icon: <Users size={22} /> },
    { label: "Results", href: "/admin/dashboard/reports", icon: <ClipboardList size={22} /> },
    { label: "Analytics", href: "/admin/dashboard/analytics", icon: <TrendingUp size={22} /> },
    { label: "White Label", href: "/admin/dashboard/white-label", icon: <Palette size={22} /> },
    { label: "Share Link", href: "/admin/dashboard/share-link", icon: <Link2 size={22} /> },
    { label: "Notifications", href: "/admin/dashboard/notifications", icon: <Bell size={22} />, badge: "3" },
    { label: "Team", href: "/admin/dashboard/team", icon: <Users size={22} /> },
    { label: "Settings", href: "/admin/dashboard/settings", icon: <Settings size={22} /> },
  ],
  superadmin: [
    { label: "Dashboard", href: "/superadmin/dashboard", icon: <LayoutDashboard size={22} /> },
    { label: "Assessments", href: "/superadmin/dashboard/assessments", icon: <ClipboardList size={22} /> },
    { label: "Organizations", href: "/superadmin/dashboard/organizations", icon: <Building2 size={22} /> },
    { label: "Users", href: "/superadmin/dashboard/users", icon: <Users size={22} /> },
    { label: "Reports", href: "/superadmin/dashboard/reports", icon: <BarChart3 size={22} /> },
    { label: "Consult Leads", href: "/superadmin/dashboard/consultations", icon: <Phone size={22} /> },
    { label: "Analytics", href: "/superadmin/dashboard/analytics", icon: <TrendingUp size={22} /> },
    { label: "Audit Log", href: "/superadmin/dashboard/audit", icon: <FileText size={22} /> },
    { label: "System", href: "/superadmin/dashboard/system", icon: <Shield size={22} /> },
    { label: "Settings", href: "/superadmin/dashboard/settings", icon: <Settings size={22} /> },
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
                <Home size={22} style={{ color: "#888" }} /> Home
              </button>
              <button onClick={() => { onLogout(); onClose(); }}
                className="flex items-center gap-[12px] w-full px-[12px] py-[12px] rounded-xl border-none bg-transparent cursor-pointer text-left transition-colors"
                style={{ color: "#D92D20", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
                <LogOut size={22} /> Logout
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
  orgCode,
}: {
  children: ReactNode;
  title?: string;
  orgCode?: string;
}) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useEffect(() => { setIsMounted(true); }, []);

  // Apply dark mode on all dashboard pages
  const applyDark = useCallback(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("chronotype_preferences") : null;
    if (stored) {
      try {
        const prefs = JSON.parse(stored);
        setDarkMode(!!prefs.darkMode);
        if (prefs.darkMode) {
          document.documentElement.setAttribute("data-theme", "dark");
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
      } catch {}
    }
  }, []);

  useEffect(() => { applyDark(); }, [applyDark]);

  // Listen for dark mode changes from settings (same tab via storage event)
  useEffect(() => {
    const handler = () => applyDark();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [applyDark]);

  const navItems = user ? (roleNavItems[user.role] ?? roleNavItems.member) : roleNavItems.member;
  const resolvedNavItems = orgCode ? navItems.map((item) => item.label === "Dashboard" ? { ...item, href: `/${orgCode}` } : item) : navItems;

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
    <div className={`min-h-screen flex ${darkMode ? "dark" : ""}`} style={{ fontFamily: "Poppins, sans-serif", background: darkMode ? "#0F0F23" : "#F8FAFC" }}>
      {/* Dark mode CSS overrides */}
      <style>{`
        .dark .dm-bg-card { background: #1A1A2E !important; }
        .dark .dm-bg-sidebar { background: #16162A !important; }
        .dark .dm-border { border-color: #2A2A4A !important; }
        .dark .dm-text { color: #E0E0E0 !important; }
        .dark .dm-text-secondary { color: #999 !important; }
        .dark .dm-text-muted { color: #666 !important; }
        .dark .dm-bg-hover:hover { background: rgba(255,255,255,0.05) !important; }
        .dark .dm-nav-active { background: rgba(89,83,203,0.2) !important; }
        .dark .dm-nav-inactive { color: #888 !important; }
        .dark .dm-nav-active-text { color: #818CF8 !important; }
      `}</style>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:z-40 transition-all duration-200`}
        style={{
          width: sidebarCollapsed ? "72px" : "260px",
          background: darkMode ? "#16162A" : "#FFFFFF",
          borderRight: darkMode ? "1px solid #2A2A4A" : "1px solid #E6E8F0",
        }}>
        {/* Brand + Toggle */}
        <div className="flex items-center justify-between px-[16px] h-[68px] shrink-0" style={{ borderBottom: darkMode ? "1px solid #2A2A4A" : "1px solid #F1F4FA" }}>
          <div className="flex items-center gap-[10px]">
            <img
              src="/assets/logos/logo2.png"
              alt="Chronotype"
              className="shrink-0"
              style={{ height: "34px", width: "auto", maxWidth: "110px", objectFit: "contain", borderRadius: "8px" }}
            />
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-[15px] font-bold leading-[1.2]" style={{ color: darkMode ? "#E0E0E0" : "#19164F", fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>Chronotype</span>
                <span className="text-[10px] font-medium" style={{ color: darkMode ? "#888" : "#667085", fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
                  {ROLE_LABELS[user?.role ?? "member"]}
                </span>
              </div>
            )}
          </div>
          <button type="button" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center justify-center w-[24px] h-[24px] rounded-lg border-none cursor-pointer bg-transparent shrink-0"
            style={{ color: darkMode ? "#666" : "#98A2B3" }}>
            <ChevronLeft size={14} style={{ transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-[8px] py-[16px] space-y-[2px]">
          {resolvedNavItems.map((item) => {
            const active = isActive(item.href);
            return sidebarCollapsed ? (
              <Link key={item.href} href={item.href} title={item.label}
                className="flex items-center justify-center px-[0] py-[10px] rounded-xl no-underline transition-all duration-150"
                style={{
                  background: active ? (darkMode ? "rgba(89,83,203,0.2)" : "rgba(59,53,163,0.08)") : "transparent",
                  color: active ? (darkMode ? "#818CF8" : "#35319B") : (darkMode ? "#666" : "#98A2B3"),
                }}>
                {item.icon}
              </Link>
            ) : (
              <Link key={item.href} href={item.href}
                className="flex items-center justify-between px-[12px] py-[12px] rounded-xl text-[15px] font-medium no-underline transition-all duration-150"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: active ? 600 : 500,
                  background: active ? (darkMode ? "rgba(89,83,203,0.2)" : "rgba(59,53,163,0.08)") : "transparent",
                  color: active ? (darkMode ? "#818CF8" : "#35319B") : (darkMode ? "#888" : "#667085"),
                }}>
                <span className="flex items-center gap-[10px]">
                  <span style={{ color: active ? (darkMode ? "#818CF8" : "#35319B") : (darkMode ? "#666" : "#98A2B3") }}>{item.icon}</span>
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
        <div className="px-[8px] pb-[16px] flex items-center justify-center gap-[10px] flex-wrap"
          style={{ borderTop: darkMode ? "1px solid #2A2A4A" : "1px solid #F1F4FA", paddingTop: "12px" }}>
          <Link href={orgCode ? `/${orgCode}` : "/"} className="flex items-center gap-[8px] text-[15px] font-medium no-underline"
            style={{ color: darkMode ? "#666" : "#98A2B3", fontFamily: "Poppins, sans-serif", padding: sidebarCollapsed ? "8px" : "0" }}>
            <Home size={22} /> {!sidebarCollapsed && "Home"}
          </Link>
          <button onClick={() => setDonateOpen(true)}
            className="flex items-center gap-[8px] text-[15px] font-medium bg-none border-none cursor-pointer"
            style={{ color: "#FF6B6B", fontFamily: "Poppins, sans-serif", padding: sidebarCollapsed ? "8px" : "0" }}>
            <Heart size={22} /> {!sidebarCollapsed && "Donate"}
          </button>
          <button onClick={async () => { await logout(); window.location.href = "/login"; }}
            className="flex items-center gap-[8px] text-[15px] font-medium bg-none border-none cursor-pointer"
            style={{ color: darkMode ? "#666" : "#98A2B3", fontFamily: "Poppins, sans-serif", padding: sidebarCollapsed ? "8px" : "0" }}>
            <LogOut size={22} /> {!sidebarCollapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-200`}
        style={{ marginLeft: isMounted && window.innerWidth >= 768 ? (sidebarCollapsed ? "72px" : "260px") : "0px" }}>

        {/* Top header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-[14px] md:px-[32px] h-[56px] md:h-[68px]"
          style={{ background: darkMode ? "#16162A" : "#FFFFFF", borderBottom: darkMode ? "1px solid #2A2A4A" : "1px solid #F1F4FA" }}>
          <div>
            <h1 className="m-0 text-[16px] md:text-[22px] font-bold tracking-[-0.02em]"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: darkMode ? "#E0E0E0" : "#19164F" }}>
              {title || (activeItem?.label ?? "Dashboard")}
            </h1>
          </div>
          {user && (
            <div className="flex items-center gap-[6px] md:gap-[10px]">
              <div className="w-[28px] h-[28px] md:w-[34px] md:h-[34px] rounded-full flex items-center justify-center text-white text-[11px] md:text-[13px] font-bold"
                style={{ background: "linear-gradient(135deg, #35319B, #5A55C0)" }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-[12px] md:text-[13px] font-medium hidden sm:block" style={{ color: darkMode ? "#999" : "#667085", fontFamily: "Poppins, sans-serif" }}>
                {user.name}
              </span>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 px-[12px] md:px-[32px] py-[16px] md:py-[28px] pb-[80px] md:pb-[28px]" style={{ background: darkMode ? "#0F0F23" : "transparent" }}>
          {children}
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
        style={{ height: "68px", background: darkMode ? "#16162A" : "#FFFFFF", borderTop: darkMode ? "1px solid #2A2A4A" : "1px solid #E6E8F0", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {mobileMainItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center justify-center gap-[2px] no-underline min-w-0 flex-1 relative"
              style={{ padding: "4px 2px", height: "100%" }}>
              <span className="flex items-center justify-center" style={{ color: active ? (darkMode ? "#818CF8" : "#35319B") : (darkMode ? "#666" : "#98A2B3") }}>
                {item.icon}
              </span>
              <span className="text-[10px] font-semibold leading-[1] text-center truncate w-full max-w-[60px]"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: active ? 600 : 500, color: active ? (darkMode ? "#818CF8" : "#35319B") : (darkMode ? "#666" : "#98A2B3") }}>
                {item.label}
              </span>
              {active && <span className="absolute top-0 left-[25%] right-[25%] h-[2px] rounded-full" style={{ background: darkMode ? "#818CF8" : "#35319B" }} />}
            </Link>
          );
        })}
        <button onClick={() => setMoreOpen(true)}
          className="flex flex-col items-center justify-center gap-[2px] no-underline min-w-0 flex-1 bg-transparent border-none cursor-pointer"
          style={{ padding: "4px 2px", height: "100%" }}>
          <span style={{ color: darkMode ? "#666" : "#98A2B3" }}>
            <Menu size={22} />
          </span>
          <span className="text-[10px] font-semibold leading-[1] text-center truncate w-full max-w-[60px]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, color: darkMode ? "#666" : "#98A2B3" }}>
            More
          </span>
        </button>
      </nav>

      {moreOpen && (
        <MobileBottomSheet
          items={mobileMoreItems}
          onClose={() => setMoreOpen(false)}
          onLogout={async () => { await logout(); window.location.href = "/login"; }}
          onHome={() => { window.location.href = orgCode ? `/${orgCode}` : "/"; }}
        />
      )}

      <div className="md:hidden h-[68px]" />
      <DonateModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
    </div>
  );
}
