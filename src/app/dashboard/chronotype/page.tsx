"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { cachedFetch } from "@/lib/client-cache";
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

const LARK_IMAGES = [
  "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg",
  "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg",
];

const OWL_IMAGES = [
  "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg",
  "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg",
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
      cachedFetch<Record<string, unknown>>(`/api/member?email=${encodeURIComponent(user.email)}`)
        .then((d) => { setData(d as { result: Record<string, unknown> | null } | null); setLoading(false); })
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

  const result = data?.result as Record<string, unknown> | undefined;
  const chronotype = (result?.chronotype as "LARK" | "EAGLE" | "OWL") ?? null;
  const info = chronotype ? CHRONOTYPE_DESCRIPTIONS[chronotype] : null;
  const peaks = chronotype ? CHRONOTYPE_PEAK_TIMES[chronotype] : null;
  const confidence = (result?.confidence_score as number) ?? 0;

  // Choose images based on chronotype
  const chronoImages = chronotype === "EAGLE" ? EAGLE_IMAGES : chronotype === "LARK" ? LARK_IMAGES : OWL_IMAGES;
  const imageFolder = chronotype === "EAGLE" ? "/chronotype_media/eagle" : chronotype === "LARK" ? "/chronotype_media/lark" : "/chronotype_media/owl";

  const goTo = useCallback((idx: number) => {
    setSlideIdx(idx);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    intervalRef.current = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % chronoImages.length);
    }, 5000);
  }, [chronoImages.length]);

  return (
    <DashboardShell>
      {loading ? (
        <div className="flex items-center justify-center py-[60px]">Loading...</div>
      ) : !chronotype ? (
        <div className="flex flex-col items-center justify-center py-[40px] rounded-[16px]" style={{ border: "1.5px dashed #E0E0E0" }}>
          <Moon size={40} stroke="#CCC" strokeWidth={1.5} />
          <p className="m-0 mt-[12px] text-[14px] font-medium" style={{ color: "#888", fontFamily: "Poppins, sans-serif" }}>Take the assessment to discover your chronotype</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[16px]">

          {/* ─── Beautiful Chronotype Header Card ─── */}
          <div className="relative overflow-hidden rounded-[16px] md:rounded-[20px] p-[18px] md:p-[32px]" style={{
            background: chronotype === "LARK"
              ? "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FFEAA7 100%)"
              : chronotype === "EAGLE"
                ? "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #C7D2FE 100%)"
                : "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)",
          }}>
            <div className="absolute top-[-30px] right-[-10px] opacity-[0.08]">
              <Moon size={180} stroke="#35319B" strokeWidth={1} />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[12px] md:gap-[16px]">
              <div className="flex items-center gap-[12px] md:gap-[16px]">
                <div className="w-[48px] h-[48px] md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center shrink-0" style={{
                  background: chronotype === "LARK"
                    ? "linear-gradient(135deg, #F59A00, #F97316)"
                    : chronotype === "EAGLE"
                      ? "linear-gradient(135deg, #35319B, #6366F1)"
                      : "linear-gradient(135deg, #2C2255, #7B68AE)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                }}>
                  <Moon size={32} stroke="white" strokeWidth={1.8} />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "rgba(23,23,23,0.5)", fontFamily: "Poppins, sans-serif" }}>Chronotype</span>
                  <h1 className="m-0 text-[20px] md:text-[26px] font-bold leading-[1.2] mt-[2px]" style={{ color: "#171717", fontFamily: "Poppins, sans-serif" }}>
                    You are an {CHRONOTYPE_LABELS[chronotype]}
                  </h1>
                  <p className="m-0 mt-[4px] text-[14px] leading-[1.5]" style={{ color: "rgba(23,23,23,0.6)", fontFamily: "Poppins, sans-serif" }}>
                    {info?.tagline}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-[16px] shrink-0">
                <Ring value={confidence} size={64} color="#35319B" label="" />
              </div>
            </div>
          </div>

          {/* ─── Full-width Visual Illustration ─── */}
          <div className="relative rounded-[12px] md:rounded-[20px] overflow-hidden cursor-pointer w-full" style={{ background: "#1A1A2E", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
            onClick={() => setLightboxOpen(true)}>
            <div className="relative w-full" style={{ height: "clamp(260px, 55vw, 480px)" }}>
              {chronoImages.map((src, i) => (
                <img key={src} src={`${imageFolder}/${src}`} alt={`Chronotype illustration ${i + 1}`}
                  className="absolute inset-0 w-full h-full transition-opacity duration-700 p-2 md:p-3"
                  style={{ opacity: i === slideIdx ? 1 : 0, objectFit: "contain" }}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : undefined}
                />
              ))}
              <button type="button" onClick={(e) => { e.stopPropagation(); goTo((slideIdx - 1 + chronoImages.length) % chronoImages.length); }}
                className="absolute left-[8px] md:left-[12px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full border-none cursor-pointer flex items-center justify-center z-10"
                style={{ background: "rgba(255,255,255,0.9)", color: "#333", boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
                <ChevronLeft size={20} />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); goTo((slideIdx + 1) % chronoImages.length); }}
                className="absolute right-[8px] md:right-[12px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full border-none cursor-pointer flex items-center justify-center z-10"
                style={{ background: "rgba(255,255,255,0.9)", color: "#333", boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
                <ChevronRight size={20} />
              </button>
              {/* Desktop: pill/bar style indicators */}
              <div className="absolute bottom-[14px] left-0 right-0 justify-center hidden md:flex">
                <div className="flex items-center gap-[6px] overflow-x-auto px-[8px] py-[4px] rounded-full" style={{ background: "rgba(0,0,0,0.35)" }}>
                  {chronoImages.map((_, i) => (
                    <button key={i} type="button" onClick={(e) => { e.stopPropagation(); goTo(i); }}
                      className="rounded-full border-none cursor-pointer shrink-0 transition-all duration-300"
                      style={{
                        width: i === slideIdx ? "14px" : "4px",
                        height: "4px",
                        background: i === slideIdx ? "#FFF" : "rgba(255,255,255,0.45)",
                      }} />
                  ))}
                </div>
              </div>
              <div className="absolute top-[8px] right-[8px] md:top-[12px] md:right-[12px] px-[8px] py-[3px] md:px-[10px] md:py-[4px] rounded-full text-[10px] md:text-[11px] font-medium" style={{ background: "rgba(0,0,0,0.45)", color: "#FFF", fontFamily: "Poppins, sans-serif", backdropFilter: "blur(4px)" }}>
                {slideIdx + 1} / {chronoImages.length}
              </div>
            </div>
          </div>

          {/* ─── Peak Times Cards ─── */}
          {peaks && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
              {[
                { icon: <Brain size={20} />, label: "Peak Focus", value: peaks.focus, color: "#35319B" },
                { icon: <Sparkles size={20} />, label: "Creative Window", value: peaks.creative, color: "#F59A00" },
                { icon: <Clock size={20} />, label: "Ideal Sleep", value: peaks.sleep, color: "#2E7D32" },
              ].map((p, i) => (
                <div key={i} className="flex flex-col items-center text-center p-[14px] md:p-[20px] rounded-[16px]" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div className="w-[36px] h-[36px] md:w-[44px] md:h-[44px] rounded-xl flex items-center justify-center mb-[8px] md:mb-[10px]" style={{ background: `${p.color}10` }}>
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
