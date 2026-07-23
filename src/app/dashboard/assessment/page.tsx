"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Ring from "@/components/charts/Ring";
import { Activity, ClipboardList, ChevronRight } from "lucide-react";

export default function AssessmentPage() {
  const { user } = useAuth();
  const [data, setData] = useState<{ assessments: Record<string, unknown>[]; result: Record<string, unknown> | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((r) => r.json())
        .then((d) => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  const assessments = (data?.assessments ?? []) as Array<Record<string, unknown>>;
  const result = data?.result as Record<string, unknown> | undefined;
  const completedCount = assessments.filter((a) => a.status === "COMPLETED").length;
  const confidence = (result?.confidence_score as number) ?? 0;

  return (
    <DashboardShell>
      <div className="flex items-center gap-[10px] mb-[20px]">
        <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
          <ClipboardList size={18} stroke="#35319B" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Assessment</span>
          <h1 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Assessment History</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-[60px]"><span className="text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Loading...</span></div>
      ) : assessments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[40px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0", background: "#FAFAFA" }}>
          <Activity size={40} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>No assessments yet</p>
          <p className="m-0 mt-[4px] text-[12px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Take the sleep chronotype assessment to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px]">
          <div className="lg:col-span-2 flex flex-col gap-[12px]">
            {assessments.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-[16px] rounded-xl" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-[12px]">
                  <div className="w-[36px] h-[36px] rounded-lg flex items-center justify-center" style={{ background: a.status === "COMPLETED" ? "rgba(46,125,50,0.1)" : "rgba(245,154,0,0.1)" }}>
                    <ClipboardList size={16} stroke={a.status === "COMPLETED" ? "#2E7D32" : "#F59A00"} />
                  </div>
                  <div>
                    <p className="m-0 text-[13px] font-medium" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Assessment #{i + 1}</p>
                    <p className="m-0 text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{a.started_at ? new Date(a.started_at as string).toLocaleDateString() : "—"}</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-[8px] py-[3px] rounded-full" style={{ background: a.status === "COMPLETED" ? "rgba(46,125,50,0.1)" : "rgba(245,154,0,0.1)", color: a.status === "COMPLETED" ? "#2E7D32" : "#F59A00", fontFamily: "Poppins, sans-serif" }}>
                  {a.status === "COMPLETED" ? "Completed" : "In Progress"}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center p-[24px] rounded-xl text-center" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <Ring value={confidence || completedCount * 25} size={80} color="#35319B" label="Latest Score" />
            <p className="m-0 mt-[8px] text-[12px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>{completedCount} of {assessments.length} completed</p>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
