"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import RoleBadge from "@/components/dashboard/RoleBadge";
import { User, Mail, Calendar, Moon, MapPin, Briefcase } from "lucide-react";
import { CHRONOTYPE_LABELS } from "@/lib/chronotype-utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<{ member: Record<string, unknown> | null; result: Record<string, unknown> | null } | null>(null);
// const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((r) => r.json())
        .then((d) => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  const member = data?.member as Record<string, unknown> | undefined;
  const result = data?.result as Record<string, unknown> | undefined;
  const chronotype = (result?.chronotype as string) ?? null;

  return (
    <DashboardShell>
      <button type="button" onClick={() => router.push("/dashboard")}
        className="inline-flex items-center gap-[5px] text-[13px] font-medium bg-transparent border-none cursor-pointer mb-[16px] transition-colors"
        style={{ color: "#98A2B3", fontFamily: "Poppins, sans-serif" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#35319B"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#98A2B3"}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        Back
      </button>
      {loading ? (
        <div className="flex items-center justify-center py-[60px]"><span className="text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Loading...</span></div>
      ) : member ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px]">
          <div className="flex flex-col items-center p-[24px] rounded-[16px] text-center" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-white text-[24px] font-bold mb-[12px]" style={{ background: "linear-gradient(135deg, #35319B, #7B76D4)", fontFamily: "Poppins, sans-serif" }}>
              {((member.first_name as string)?.[0] ?? "")}{((member.last_name as string)?.[0] ?? "")}
            </div>
            <h2 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{member.first_name as string} {member.last_name as string}</h2>
            <RoleBadge role={user?.role ?? "member"} />
            {chronotype && <p className="m-0 mt-[8px] text-[13px]" style={{ color: "#F59A00", fontFamily: "Poppins, sans-serif" }}>{CHRONOTYPE_LABELS[chronotype as keyof typeof CHRONOTYPE_LABELS] ?? chronotype}</p>}
          </div>

          <div className="lg:col-span-2 p-[24px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h3 className="m-0 text-[15px] font-bold mb-[16px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
              {[
                { icon: <User size={14} />, label: "Name", value: `${member.first_name as string ?? ""} ${member.last_name as string ?? ""}` },
                { icon: <Mail size={14} />, label: "Email", value: member.email as string },
                { icon: <Calendar size={14} />, label: "Age", value: member.age as string },
                { icon: <MapPin size={14} />, label: "Location", value: `${member.city as string ?? ""}, ${member.country as string ?? ""}` },
                { icon: <Briefcase size={14} />, label: "Occupation", value: member.occupation as string },
                { icon: <Calendar size={14} />, label: "Member Since", value: member.created_at ? new Date(member.created_at as string).toLocaleDateString() : "—" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-[10px] p-[10px] rounded-lg" style={{ background: "rgba(53,49,155,0.03)" }}>
                  <span style={{ color: "#35319B" }}>{f.icon}</span>
                  <div>
                    <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.05em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{f.label}</p>
                    <p className="m-0 text-[13px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{f.value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-[60px]">
          <User size={40} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Profile data not available.</p>
        </div>
      )}
    </DashboardShell>
  );
}
