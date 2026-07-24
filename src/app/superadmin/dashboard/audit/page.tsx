"use client";

import { useState } from "react";
import { cachedFetch } from "@/lib/client-cache";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { FileText, Search, Filter } from "lucide-react";

export default function AuditPage() {
  const [search, setSearch] = useState("");

  return (
    <DashboardShell title="Audit Log">
      <div className="flex items-center gap-[12px] mb-[20px]">
        <div className="flex-1 flex items-center px-[14px] py-[10px] rounded-xl" style={{ border: "1.5px solid #E0E0E0", background: "#FFFFFF" }}>
          <Search size={16} stroke="#AAA" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search audit log..."
            className="flex-1 bg-transparent border-none ml-[10px] text-[14px] outline-none" style={{ fontFamily: "Poppins, sans-serif" }} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-[60px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <FileText size={40} stroke="#CCC" strokeWidth={1.5} />
        <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Audit log coming soon</p>
        <p className="m-0 mt-[4px] text-[12px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Platform activity tracking will appear here.</p>
      </div>
    </DashboardShell>
  );
}
