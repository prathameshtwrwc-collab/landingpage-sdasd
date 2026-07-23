"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { Bell, Users, ClipboardCheck, Star } from "lucide-react";

const mockNotifications = [
  { icon: <Users size={14} />, title: "New member joined", desc: "A new participant completed the assessment", time: "2 hours ago", color: "#35319B" },
  { icon: <ClipboardCheck size={14} />, title: "Assessment completed", desc: "5 new assessments were completed today", time: "5 hours ago", color: "#2E7D32" },
  { icon: <Star size={14} />, title: "Milestone reached", desc: "Your organization reached 50 completed assessments", time: "1 day ago", color: "#F59A00" },
];

export default function NotificationsPage() {
  return (
    <DashboardShell title="Notifications">
      <div className="rounded-[16px] p-[20px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        {mockNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[40px]">
            <Bell size={40} stroke="#CCC" strokeWidth={1.5} />
            <p className="m-0 mt-[12px] text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>No notifications yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-[8px]">
            {mockNotifications.map((n, i) => (
              <div key={i} className="flex items-center gap-[12px] p-[14px] rounded-xl" style={{ background: "rgba(53,49,155,0.03)" }}>
                <div className="w-[36px] h-[36px] rounded-lg flex items-center justify-center shrink-0" style={{ background: `${n.color}12` }}>
                  <span style={{ color: n.color }}>{n.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="m-0 text-[13px] font-medium" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{n.title}</p>
                  <p className="m-0 text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{n.desc}</p>
                </div>
                <span className="text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{n.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
