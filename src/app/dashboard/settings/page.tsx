"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Settings, Bell, Shield, Moon } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <DashboardShell>
      <div className="flex items-center gap-[10px] mb-[20px]">
        <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
          <Settings size={18} stroke="#35319B" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Settings</span>
          <h1 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Account Settings</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
        <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h3 className="m-0 text-[15px] font-bold mb-[16px] flex items-center gap-[8px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
            <Bell size={16} stroke="#35319B" /> Preferences
          </h3>
          <div className="flex flex-col gap-[12px]">
            <ToggleRow label="Email Notifications" description="Receive assessment reminders and tips" checked={notifications} onChange={setNotifications} />
            <ToggleRow label="Dark Mode" description="Use dark theme in the dashboard" checked={darkMode} onChange={setDarkMode} />
          </div>
        </div>

        <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h3 className="m-0 text-[15px] font-bold mb-[16px] flex items-center gap-[8px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
            <Shield size={16} stroke="#35319B" /> Account
          </h3>
          <div className="flex flex-col gap-[10px]">
            <div className="p-[10px] rounded-lg" style={{ background: "rgba(53,49,155,0.03)" }}>
              <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Email</p>
              <p className="m-0 text-[13px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{user?.email ?? "—"}</p>
            </div>
            <div className="p-[10px] rounded-lg" style={{ background: "rgba(53,49,155,0.03)" }}>
              <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Role</p>
              <p className="m-0 text-[13px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{user?.role ?? "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-[8px]">
      <div>
        <p className="m-0 text-[13px] font-medium" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{label}</p>
        <p className="m-0 text-[11px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{description}</p>
      </div>
      <button type="button" onClick={() => onChange(!checked)}
        className="relative w-[44px] h-[24px] rounded-full border-none cursor-pointer transition-colors duration-200 shrink-0"
        style={{ background: checked ? "#35319B" : "#D5D5D5" }}
      >
        <span className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all duration-200"
          style={{ left: checked ? "23px" : "3px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
        />
      </button>
    </div>
  );
}
