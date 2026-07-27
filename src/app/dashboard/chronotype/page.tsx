"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import Ring from "@/components/charts/Ring";
import { Moon, Brain, Sparkles, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { CHRONOTYPE_LABELS, CHRONOTYPE_DESCRIPTIONS, CHRONOTYPE_PEAK_TIMES } from "@/lib/chronotype-utils";

const ALL_IMAGES = [
  "About-Us (002).jpg", "Clinic-detials.jpg",
  "Eagle-1.jpg", "Eagle-2.jpg", "Eagle-3.jpg", "Eagle-4.jpg", "Eagles Hompage.jpg",
  "Home page.jpg",
  "How to use your unique biorhythm to stay-1.jpg",
  "How to use your unique biorhythm to stay-2.jpg",
  "How to use your unique biorhythm to stay-3.jpg",
  "Lark-1.jpg", "Lark-2.jpg", "Lark-3.jpg", "Lark-5.jpg", "Larks Hompage.jpg",
  "Owl-1.jpg", "Owl-2.jpg", "Owl-3.jpg", "Owl-4.jpg", "Owls Hompage.jpg",
  "Question-1.jpg", "Question-2.jpg",
  "Sleep disorders a paractical holisti guide 1.jpg",
  "Sleep disorders a paractical holisti guide 2.jpg",
  "Sleep disorders a paractical holisti guide 3.jpg",
  "Sleep disorders a paractical holisti guide 4.jpg",
  "Sleep disorders a paractical holisti guide 5.jpg",
  "Sleep disorders a paractical holisti guide 6.jpg",
  "Sleep disorders a paractical holisti guide 7.jpg",
  "Sleep disorders a paractical holisti guide 8.jpg",
  "Sleep disorders a paractical holisti guide 9.jpg",
];

const EAGLE_IMAGES = [
  "1.jpg", "2.jpg", "3.jpg", "3a.jpg", "4.jpg", "5.jpg", "6.jpg",
  "7.jpg", "8.jpg", "9.jpg", "10.jpg", "hompage.jpg", "hompage-2.jpg",
];

export default function ChronotypePage() {
  const { user } = useAuth();
  const [data, setData] = useState<{ result: Record<string, unknown> | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [slideIdx, setSlideIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((r) => r.json())
        .then((d) => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  // Auto-slide carousel
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % chronoImages.length);
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const goTo = (idx: number) => {
    setSlideIdx(idx);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    intervalRef.current = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % chronoImages.length);
    }, 5000);
  };

  const result = data?.result as Record<string, unknown> | undefined;
  const chronotype = (result?.chronotype as "LARK" | "EAGLE" | "OWL") ?? null;
  const info = chronotype ? CHRONOTYPE_DESCRIPTIONS[chronotype] : null;
  const peaks = chronotype ? CHRONOTYPE_PEAK_TIMES[chronotype] : null;
  const confidence = (result?.confidence_score as number) ?? 0;

  // Choose images based on chronotype
  const isEagle = chronotype === "EAGLE";
  const chronoImages = isEagle ? EAGLE_IMAGES : ALL_IMAGES;
  const imageFolder = isEagle ? "chronotype_media/eagle" : "chronotype_media";

  return (
    <DashboardShell>
      <div className="mb-[24px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>Chronotype</span>
        <h1 className="m-0 text-[18px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
          {chronotype ? `You are an ${CHRONOTYPE_LABELS[chronotype]}` : "Your Chronotype"}
        </h1>
        {chronotype && <p className="m-0 text-[13px] mt-[4px]" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Confidence: {confidence}%</p>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-[60px]">Loading...</div>
      ) : !chronotype ? (
        <div className="flex flex-col items-center justify-center py-[40px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0" }}>
          <Moon size={40} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Take the assessment to discover your chronotype</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
          <div className="flex flex-col items-center p-[28px] rounded-[16px] text-center" style={{
            background: chronotype === "LARK"
              ? "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)"
              : chronotype === "EAGLE"
                ? "linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)"
                : "linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)",
          }}>
            <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-[16px]" style={{ background: "rgba(53,49,155,0.08)" }}>
              <Moon size={36} stroke="#35319B" strokeWidth={1.5} />
            </div>
            <h2 className="m-0 text-[24px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{CHRONOTYPE_LABELS[chronotype]}</h2>
            <p className="m-0 mt-[8px] text-[14px] leading-[1.6]" style={{ color: "rgba(23,23,23,0.65)", fontFamily: "Poppins, sans-serif" }}>{info?.tagline}</p>
            <div className="mt-[16px]"><Ring value={confidence} size={80} color="#35319B" label="Match" /></div>
          </div>

          <div className="relative rounded-[16px] overflow-hidden cursor-pointer" style={{ background: "#F0F0F0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            onClick={() => setLightboxOpen(true)}>
            <div className="relative w-full" style={{ height: "420px" }}>
              {chronoImages.map((src, i) => (
                <img key={src} src={`${imageFolder}/${src}`} alt={`Chronotype illustration ${i + 1}`}
                  className="absolute inset-0 w-full h-full transition-opacity duration-700"
                  style={{ opacity: i === slideIdx ? 1 : 0, objectFit: "contain", padding: "16px" }}
                  loading="lazy"
                />
              ))}
              {/* Prev / Next buttons */}
              <button type="button" onClick={(e) => { e.stopPropagation(); goTo((slideIdx - 1 + chronoImages.length) % chronoImages.length); }}
                className="absolute left-[8px] top-1/2 -translate-y-1/2 w-[32px] h-[32px] rounded-full border-none cursor-pointer flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.85)", color: "#555" }}>
                <ChevronLeft size={18} />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); goTo((slideIdx + 1) % chronoImages.length); }}
                className="absolute right-[8px] top-1/2 -translate-y-1/2 w-[32px] h-[32px] rounded-full border-none cursor-pointer flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.85)", color: "#555" }}>
                <ChevronRight size={18} />
              </button>
              {/* Dots */}
              <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 flex items-center gap-[5px]">
                {chronoImages.map((_, i) => (
                  <button key={i} type="button" onClick={(e) => { e.stopPropagation(); goTo(i); }}
                    className="w-[7px] h-[7px] rounded-full border-none cursor-pointer transition-all duration-300"
                    style={{ background: i === slideIdx ? "#35319B" : "rgba(255,255,255,0.6)", transform: i === slideIdx ? "scale(1.3)" : "scale(1)" }} />
                ))}
              </div>
            </div>
          </div>

          {peaks && (
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-[12px]">
              {[
                { icon: <Brain size={20} />, label: "Peak Focus", value: peaks.focus, color: "#35319B" },
                { icon: <Sparkles size={20} />, label: "Creative Window", value: peaks.creative, color: "#F59A00" },
                { icon: <Clock size={20} />, label: "Ideal Sleep", value: peaks.sleep, color: "#2E7D32" },
              ].map((p, i) => (
                <div key={i} className="flex flex-col items-center text-center p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div className="w-[44px] h-[44px] rounded-xl flex items-center justify-center mb-[10px]" style={{ background: `${p.color}10` }}>
                    <span style={{ color: p.color }}>{p.icon}</span>
                  </div>
                  <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: "#AAA", fontFamily: "Poppins, sans-serif" }}>{p.label}</p>
                  <p className="m-0 mt-[4px] text-[16px] font-bold" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>{p.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Lightbox Modal ── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.88)" }}
          onClick={() => setLightboxOpen(false)}>
          <div className="relative w-full h-full flex items-center justify-center p-[20px] md:p-[40px]" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setLightboxOpen(false)}
              className="absolute top-[16px] right-[16px] z-10 w-[36px] h-[36px] rounded-full border-none cursor-pointer flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", color: "#FFF" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <img src={`${imageFolder}/${chronoImages[slideIdx]}`} alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-[8px]"
              style={{ maxWidth: "95vw", maxHeight: "90vh" }}
            />
            <button type="button" onClick={(e) => { e.stopPropagation(); goTo((slideIdx - 1 + chronoImages.length) % chronoImages.length); }}
              className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full border-none cursor-pointer flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", color: "#FFF" }}>
              <ChevronLeft size={24} />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); goTo((slideIdx + 1) % chronoImages.length); }}
              className="absolute right-[12px] top-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full border-none cursor-pointer flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", color: "#FFF" }}>
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 flex items-center gap-[6px]">
              {chronoImages.map((_, i) => (
                <button key={i} type="button" onClick={(e) => { e.stopPropagation(); goTo(i); }}
                  className="w-[8px] h-[8px] rounded-full border-none cursor-pointer transition-all"
                  style={{ background: i === slideIdx ? "#FFF" : "rgba(255,255,255,0.4)", transform: i === slideIdx ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
