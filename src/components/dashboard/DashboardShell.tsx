"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { ROLE_LABELS, type Role } from "@/lib/auth/roles";
import {
  Moon, LayoutDashboard, Users, Settings, Shield, Activity,
  BarChart3, LogOut, Menu, X, Home, User, TrendingUp, Calendar,
  Bell, FileText, Sparkles, Star, ChevronRight
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
    { label: "Insights", href: "/dashboard/insights", icon: <TrendingUp size={18} /> },
    { label: "Calendar", href: "/dashboard/calendar", icon: <Calendar size={18} /> },
    { label: "Profile", href: "/dashboard/profile", icon: <User size={18} /> },
    { label: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
  ],
  organization_admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Participants", href: "/admin/dashboard/participants", icon: <Users size={18} /> },
    { label: "Reports", href: "/admin/dashboard/reports", icon: <BarChart3 size={18} /> },
    { label: "Notifications", href: "/admin/dashboard/notifications", icon: <Bell size={18} />, badge: "3" },
    { label: "Team", href: "/admin/dashboard/team", icon: <Users size={18} /> },
    { label: "Settings", href: "/admin/dashboard/settings", icon: <Settings size={18} /> },
  ],
  superadmin: [
    { label: "Dashboard", href: "/superadmin/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Organizations", href: "/superadmin/dashboard/organizations", icon: <Users size={18} /> },
    { label: "Analytics", href: "/superadmin/dashboard/analytics", icon: <BarChart3 size={18} /> },
    { label: "Audit Log", href: "/superadmin/dashboard/audit", icon: <FileText size={18} /> },
    { label: "System", href: "/superadmin/dashboard/system", icon: <Shield size={18} /> },
    { label: "Settings", href: "/superadmin/dashboard/settings", icon: <Settings size={18} /> },
  ],
};

export default function DashboardShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const navItems = roleNavItems[user.role] ?? roleNavItems.member;
  const isSuperAdmin = user.role === "superadmin";

  const isActive = (href: string) => pathname === href;

  const activeItem = navItems.find((i) => isActive(i.href));

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Poppins, sans-serif", background: "#F6F8FC" }}>
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside
        className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-[260px] md:z-40"
        style={{
          background: isSuperAdmin
            ? "linear-gradient(180deg, #0F0C29 0%, #1A1740 50%, #2B2660 100%)"
            : "linear-gradient(180deg, #F8F9FF 0%, #FFFFFF 100%)",
          borderRight: isSuperAdmin ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.04)",
        }}
      >
        {/* Logo section with glass effect */}
        <div
          className="relative mx-[16px] mt-[16px] mb-[8px] px-[16px] flex items-center gap-[12px]"
          style={{
            height: "60px",
            borderRadius: "14px",
            background: isSuperAdmin
              ? "rgba(255,255,255,0.06)"
              : "linear-gradient(135deg, rgba(53,49,155,0.04), rgba(90,85,192,0.08))",
          }}
        >
          <span
            className="flex items-center justify-center w-[36px] h-[36px] rounded-xl shrink-0 relative"
            style={{
              background: isSuperAdmin
                ? "linear-gradient(135deg, #FF6B6B, #D32F2F)"
                : "linear-gradient(135deg, #35319B, #7B76D4)",
              boxShadow: isSuperAdmin
                ? "0 4px 12px rgba(211,47,47,0.3)"
                : "0 4px 12px rgba(53,49,155,0.3)",
            }}
          >
            <Moon size={17} stroke="white" strokeWidth={2} />
          </span>
          <div className="flex flex-col">
            <span
              className="text-[15px] font-bold leading-[1.2] tracking-[-0.01em]"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                color: isSuperAdmin ? "#FFFFFF" : "#1A1668",
              }}
            >
              Chronotype
            </span>
            <span
              className="text-[10px] font-medium tracking-[0.03em]"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                color: isSuperAdmin ? "rgba(255,255,255,0.4)" : "#AAA",
              }}
            >
              {ROLE_LABELS[user.role]}
            </span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-[12px] py-[8px] space-y-[2px]">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-[14px] py-[11px] rounded-xl text-[13px] font-medium no-underline transition-all duration-200 relative group"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: active ? 600 : 500,
                  background: active
                    ? isSuperAdmin
                      ? "rgba(255,255,255,0.1)"
                      : "linear-gradient(135deg, rgba(53,49,155,0.08), rgba(90,85,192,0.04))"
                    : "transparent",
                  color: active
                    ? isSuperAdmin ? "#FFFFFF" : "#35319B"
                    : isSuperAdmin ? "rgba(255,255,255,0.5)" : "#777",
                }}
              >
                <span className="flex items-center gap-[12px]">
                  <span
                    className="flex items-center justify-center"
                    style={{
                      color: active
                        ? isSuperAdmin ? "#FFFFFF" : "#35319B"
                        : isSuperAdmin ? "rgba(255,255,255,0.35)" : "#AAA",
                      transition: "color 0.2s",
                    }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                <span className="flex items-center gap-[6px]">
                  {item.badge && (
                    <span
                      className="text-[10px] font-bold px-[6px] py-[2px] rounded-full"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 700,
                        background: isSuperAdmin
                          ? "rgba(255,255,255,0.15)"
                          : "linear-gradient(135deg, #35319B, #5A55C0)",
                        color: "#FFFFFF",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {active && !item.badge && (
                    <span
                      className="block"
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: isSuperAdmin ? "#FFFFFF" : "#35319B",
                      }}
                    />
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div
          className="mx-[12px] mb-[16px] px-[12px] py-[10px] rounded-xl flex items-center justify-between"
          style={{
            background: isSuperAdmin ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
          }}
        >
          <Link
            href="/"
            className="flex items-center gap-[8px] text-[12px] font-medium no-underline transition-colors duration-150"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              color: isSuperAdmin ? "rgba(255,255,255,0.4)" : "#AAA",
            }}
          >
            <Home size={14} />
            Home
          </Link>
          <button
            type="button"
            onClick={() => { logout(); window.location.href = "/login"; }}
            className="flex items-center gap-[6px] text-[12px] font-medium bg-none border-none cursor-pointer transition-colors duration-150"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              color: isSuperAdmin ? "rgba(255,255,255,0.4)" : "#AAA",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = isSuperAdmin ? "#FFFFFF" : "#35319B"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = isSuperAdmin ? "rgba(255,255,255,0.4)" : "#AAA"; }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="md:ml-[260px] flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-[20px] md:px-[32px] lg:px-[40px]"
          style={{
            height: "68px",
            background: "rgba(255,255,255,0.85)",
            borderBottom: "1px solid rgba(0,0,0,0.04)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center gap-[12px]">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden flex items-center justify-center w-[38px] h-[38px] bg-none border-none cursor-pointer rounded-xl hover:bg-gray-100 transition-colors"
              style={{ color: "#555" }}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div>
              <h1
                className="m-0 text-[20px] md:text-[22px] font-bold tracking-[-0.02em]"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #1A1668, #35319B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {title || (activeItem?.label ?? "Dashboard")}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-[14px]">
            {user && (
              <div className="flex items-center gap-[10px]">
                <div
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white text-[13px] font-bold"
                  style={{
                    background: isSuperAdmin
                      ? "linear-gradient(135deg, #FF6B6B, #D32F2F)"
                      : "linear-gradient(135deg, #35319B, #7B76D4)",
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span
                  className="text-[13px] font-medium hidden sm:block"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, color: "#555" }}
                >
                  {user.name}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-[20px] md:px-[32px] lg:px-[40px] py-[24px] md:py-[28px] pb-[88px] md:pb-[28px]">
          {children}
        </main>
      </div>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
        style={{
          height: "68px",
          background: "rgba(255,255,255,0.92)",
          borderTop: "1px solid rgba(0,0,0,0.04)",
          backdropFilter: "blur(16px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {navItems.slice(0, 5).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-[3px] no-underline min-w-0 flex-1 relative"
              style={{
                padding: "4px 2px",
              }}
            >
              {active && (
                <span
                  className="absolute top-0 left-[20%] right-[20%] h-[2.5px] rounded-full"
                  style={{
                    background: isSuperAdmin
                      ? "linear-gradient(90deg, #FF6B6B, #D32F2F)"
                      : "linear-gradient(90deg, #35319B, #7B76D4)",
                  }}
                />
              )}
              <span
                className="flex items-center justify-center"
                style={{
                  color: active ? (isSuperAdmin ? "#D32F2F" : "#35319B") : "#BBB",
                  transition: "color 0.2s",
                }}
              >
                {item.icon}
              </span>
              <span
                className="text-[9px] font-semibold leading-[1] text-center truncate w-full max-w-[60px]"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: active ? 600 : 500,
                  color: active ? (isSuperAdmin ? "#D32F2F" : "#35319B") : "#AAA",
                  transition: "color 0.2s",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile bottom nav spacer */}
      <div className="md:hidden h-[68px]" />
    </div>
  );
}
