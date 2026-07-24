"use client";

import { useState } from "react";
import { cachedFetch } from "@/lib/client-cache";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Shield, Server, Activity, Database, Wifi } from "lucide-react";

export default function SystemPage() {
  const [services] = useState([
    { name: "Database", status: "Healthy", icon: <Database size={16} />, color: "#2E7D32" },
    { name: "Authentication", status: "Operational", icon: <Shield size={16} />, color: "#2E7D32" },
    { name: "API Server", status: "Healthy", icon: <Server size={16} />, color: "#2E7D32" },
    { name: "Webhooks", status: "Active", icon: <Wifi size={16} />, color: "#2E7D32" },
  ]);

  return (
    <DashboardShell title="System">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
        <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h3 className="m-0 text-[15px] font-bold mb-[16px] flex items-center gap-[8px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
            <Server size={16} stroke="#35319B" /> Service Status
          </h3>
          <div className="flex flex-col gap-[10px]">
            {services.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-[12px] rounded-lg" style={{ background: "rgba(53,49,155,0.03)" }}>
                <div className="flex items-center gap-[10px]">
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span className="text-[13px] font-medium" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{s.name}</span>
                </div>
                <span className="text-[11px] font-semibold px-[8px] py-[3px] rounded-full" style={{ background: "rgba(46,125,50,0.1)", color: "#2E7D32", fontFamily: "Poppins, sans-serif" }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h3 className="m-0 text-[15px] font-bold mb-[16px] flex items-center gap-[8px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
            <Activity size={16} stroke="#35319B" /> Environment
          </h3>
          <div className="flex flex-col gap-[10px]">
            {[
              { label: "Node Version", value: "20.x" },
              { label: "Next.js", value: "16.2.6" },
              { label: "Database", value: "PostgreSQL (Supabase)" },
              { label: "Auth", value: "Clerk" },
              { label: "Hosting", value: "Vercel (development)" },
            ].map((e, i) => (
              <div key={i} className="flex justify-between p-[10px] rounded-lg" style={{ background: "rgba(53,49,155,0.03)" }}>
                <span className="text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{e.label}</span>
                <span className="text-[12px] font-medium" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
