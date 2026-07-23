"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((r) => r.json())
        .then((d) => { setAssessments(d.assessments ?? []); setLoading(false); })
        .catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = new Date(year, month).toLocaleString("default", { month: "long" });

  const completedDates = (assessments as Array<Record<string, unknown>>)
    .filter((a) => a.status === "COMPLETED" && a.completed_at)
    .map((a) => {
      const d = new Date(a.completed_at as string);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    });

  const isCompleted = (day: number) => completedDates.includes(`${year}-${month}-${day}`);

  return (
    <DashboardShell>
      <div className="flex items-center gap-[10px] mb-[20px]">
        <div className="w-[36px] h-[36px] rounded-xl flex items-center justify-center" style={{ background: "rgba(53,49,155,0.06)" }}>
          <Calendar size={18} stroke="#35319B" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Calendar</span>
          <h1 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Sleep Calendar</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-[60px]">Loading...</div>
      ) : (
        <div className="rounded-[16px] p-[20px] md:p-[28px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center justify-between mb-[20px]">
            <button type="button" onClick={() => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); }}
              className="flex items-center justify-center w-[32px] h-[32px] bg-transparent border-none cursor-pointer rounded-lg hover:bg-gray-100" style={{ color: "#888" }}>
              <ChevronLeft size={16} />
            </button>
            <span className="text-[15px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{monthName} {year}</span>
            <button type="button" onClick={() => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); }}
              className="flex items-center justify-center w-[32px] h-[32px] bg-transparent border-none cursor-pointer rounded-lg hover:bg-gray-100" style={{ color: "#888" }}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-[4px] mb-[8px]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-[11px] font-semibold py-[6px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-[4px]">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const completed = isCompleted(day);
              return (
                <div key={day} className="flex items-center justify-center p-[6px]">
                  <div className="flex items-center justify-center w-[34px] h-[34px] text-[13px] font-medium rounded-full transition-colors" style={{ background: completed ? "#35319B" : "transparent", color: completed ? "#FFFFFF" : "#555", fontFamily: "Poppins, sans-serif" }}>
                    {day}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-[16px] pt-[16px] flex items-center gap-[16px]" style={{ borderTop: "1px solid #F0F0F0" }}>
            <div className="flex items-center gap-[6px]">
              <div className="w-[10px] h-[10px] rounded-full" style={{ background: "#35319B" }} />
              <span className="text-[11px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Assessment completed</span>
            </div>
            <span className="text-[11px]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{completedDates.length} day{completedDates.length !== 1 ? "s" : ""} with data</span>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
