"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAssessment } from "@/components/assessment/AssessmentContext";

type NavItem = {
  label: string;
  href: string;
  id: string;
};

const navItems: NavItem[] = [
  { label: "Sleep Science", href: "#why-sleep-matters", id: "why-sleep-matters" },
  { label: "Chronotypes", href: "#chronotypes", id: "chronotypes" },
  { label: "Sleep Benefits", href: "#better-sleep-better-days", id: "better-sleep-better-days" },
  { label: "Sleep Disorders", href: "#common-sleep-disorders", id: "common-sleep-disorders" },
  { label: "FAQ", href: "#faq-section", id: "faq-section" },
];

export default function SiteNavbar() {
  const { open: openAssessment } = useAssessment();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const wasMenuOpenRef = useRef(false);

  // Scroll state: > 50px => scrolled
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find most visible intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActiveId(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-84px 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [isMenuOpen]);

  // Body scroll lock + focus return
  useEffect(() => {
    if (isMenuOpen) {
      wasMenuOpenRef.current = true;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (wasMenuOpenRef.current) {
        wasMenuOpenRef.current = false;
        // Return focus to hamburger after closing
        setTimeout(() => hamburgerRef.current?.focus(), 0);
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    // Smooth scroll handled by CSS scroll-behavior + scroll-margin-top
    // For extra safety, close menu then scroll
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      // small delay to allow menu close animation? Immediate scroll okay
      // Using native scroll with block start, margin accounted via CSS
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[1000] w-full"
        style={{
          height: "64px",
          background: isScrolled ? "rgba(255, 255, 255, 0.97)" : "transparent",
          borderBottom: isScrolled ? "1px solid rgba(228, 185, 61, 0.32)" : "1px solid transparent",
          boxShadow: isScrolled ? "0 4px 18px rgba(35, 31, 90, 0.08)" : "none",
          backdropFilter: isScrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(10px)" : "none",
          transition:
            "background-color 220ms ease, box-shadow 220ms ease, border-color 220ms ease, color 180ms ease",
        }}
      >
        {/* Apply responsive heights via CSS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @media(min-width:768px){
                header#site-navbar{ height:68px !important; }
              }
              @media(min-width:1024px){
                header#site-navbar{ height:72px !important; }
              }
            `,
          }}
        />
        <div
          id="site-navbar"
          className="relative w-full h-full"
          style={{ height: "100%" }}
        >
          {/* Inner wrapper: max-w 1380 padding 48/32/18 grid auto 1fr auto */}
          <div
            className="mx-auto w-full h-full grid items-center px-[18px] md:px-[32px] lg:px-[48px] max-w-[1380px]"
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              alignItems: "center",
              height: "100%",
            }}
          >
            {/* Left: Brand */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-[10px] no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B35A3] focus-visible:ring-offset-2 rounded-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
              aria-label="Chronotype - Home"
            >
              {/* Icon circle 36x36 desktop 32 mobile */}
              <span
                className="inline-flex items-center justify-center rounded-full shrink-0"
                style={{
                  width: "36px",
                  height: "36px",
                  background: "#35319B",
                  color: "#FFFFFF",
                }}
              >
                <span className="md:hidden" style={{ width: "32px", height: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M16.5 20.5A7.5 7.5 0 0 1 8 12 7.5 7.5 0 0 1 16.5 3.5 5.5 5.5 0 0 0 16.5 20.5Z"
                      fill="white"
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="hidden md:inline-flex" style={{ width: "36px", height: "36px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M16.5 20.5A7.5 7.5 0 0 1 8 12 7.5 7.5 0 0 1 16.5 3.5 5.5 5.5 0 0 0 16.5 20.5Z"
                      fill="white"
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
              <span
                className="font-semibold leading-[1] tracking-[-0.01em]"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "18px",
                  lineHeight: "1",
                  fontWeight: 600,
                  color: "#2F2A86",
                }}
              >
                <span className="text-[16px] md:text-[18px]">Chronotype</span>
              </span>
            </a>

            {/* Center: Navigation — hidden below 1024 */}
            <nav aria-label="Primary navigation" className="hidden lg:flex items-center justify-center gap-[30px] h-full">
              {navItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    aria-current={isActive ? "location" : undefined}
                    className="relative inline-flex items-center justify-center no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B35A3] focus-visible:ring-offset-2 rounded-sm group"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      lineHeight: "1",
                      fontWeight: 500,
                      color: isActive ? "#F59A00" : isScrolled ? "#29275E" : "#2F2A86",
                      transition: "color 180ms ease",
                      textDecoration: "none",
                    }}
                  >
                    <span className="relative z-10 py-[4px]">{item.label}</span>
                    {/* Underline */}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 right-0 -bottom-[3px] h-[2px] origin-center"
                      style={{
                        background: "#F59A00",
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                        transition: "transform 180ms ease",
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute left-0 right-0 -bottom-[3px] h-[2px] origin-center pointer-events-none group-hover:scale-x-100 scale-x-0"
                      style={{
                        background: "#F59A00",
                        transformOrigin: "center",
                        transition: "transform 180ms ease",
                      }}
                    />
                  </a>
                );
              })}
            </nav>

            {/* Right: CTA desktop — hidden below 1024 */}
            <div className="hidden lg:flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("chronotypes");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  openAssessment();
                }}
                className="inline-flex items-center justify-center bg-[#3B35A3] text-white border-none rounded-none shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59A00] focus-visible:ring-offset-2 transition-all duration-[220ms] ease-[ease] hover:-translate-y-[1px] cursor-pointer"
                style={{
                  width: "150px",
                  height: "40px",
                  background: "#3B35A3",
                  color: "#FFFFFF",
                  borderRadius: 0,
                  boxShadow: "none",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#332D92";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#3B35A3";
                }}
              >
                Take Test Now
              </button>
            </div>

            {/* Hamburger — visible below 1024 */}
            <div className="flex lg:hidden items-center justify-end">
              <button
                ref={hamburgerRef}
                type="button"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setIsMenuOpen((v) => !v)}
                className="inline-flex items-center justify-center w-[44px] h-[44px] bg-transparent border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B35A3] focus-visible:ring-offset-2 rounded-sm cursor-pointer"
                style={{
                  width: "44px",
                  height: "44px",
                  background: "transparent",
                  border: "none",
                }}
              >
                <span className="relative flex flex-col items-center justify-center gap-[5px] w-[24px] h-[20px]">
                  <span
                    aria-hidden="true"
                    className="block h-[2px] w-[24px] origin-center"
                    style={{
                      width: "24px",
                      height: "2px",
                      background: "#2F2A86",
                      transition: "transform 180ms ease, opacity 180ms ease",
                      transform: isMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "rotate(0deg)",
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="block h-[2px] w-[24px]"
                    style={{
                      width: "24px",
                      height: "2px",
                      background: "#2F2A86",
                      transition: "opacity 180ms ease",
                      opacity: isMenuOpen ? 0 : 1,
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="block h-[2px] w-[24px] origin-center"
                    style={{
                      width: "24px",
                      height: "2px",
                      background: "#2F2A86",
                      transition: "transform 180ms ease, opacity 180ms ease",
                      transform: isMenuOpen ? "rotate(-45deg) translate(5px, -5px)" : "rotate(0deg)",
                    }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu panel — fixed top64 left0 right0 z999 bg white border-top shadow */}
      <div
        id="mobile-navigation"
        ref={panelRef}
        className={`lg:hidden fixed left-0 right-0 z-[999] bg-white ${isMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{
          top: "64px",
          background: "#FFFFFF",
          borderTop: "1px solid rgba(228, 185, 61, 0.25)",
          boxShadow: isMenuOpen ? "0 12px 28px rgba(35, 31, 90, 0.12)" : "none",
          opacity: isMenuOpen ? 1 : 0,
          transform: isMenuOpen ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 180ms ease, transform 180ms ease, box-shadow 180ms ease",
          padding: "18px 20px 24px",
        }}
        aria-hidden={!isMenuOpen}
      >
        {/* Responsive top offset via style */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @media(min-width:768px){
                #mobile-navigation{ top:68px !important; }
              }
              @media(min-width:1024px){
                #mobile-navigation{ display:none !important; }
              }
            `,
          }}
        />
        <nav aria-label="Mobile primary navigation" className="flex flex-col w-full">
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id + "-mobile"}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="flex items-center text-left no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B35A3] focus-visible:ring-offset-2 rounded-sm"
                style={{
                  minHeight: "48px",
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: isActive ? "#F59A00" : "#29275E",
                  borderBottom: "1px solid rgba(120,120,120,0.16)",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        {/* Mobile CTA bottom width100% height46 mt16 bg #3B35A3 white square */}
        <button
          type="button"
          onClick={() => {
            setIsMenuOpen(false);
            const el = document.getElementById("chronotypes");
            if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
            openAssessment();
          }}
          className="flex items-center justify-center w-full max-w-[260px] bg-[#3B35A3] text-white border-none rounded-none shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59A00] focus-visible:ring-offset-2 transition-all duration-[160ms] ease-[ease] hover:-translate-y-[1px] cursor-pointer mt-[16px]"
          style={{
            width: "100%",
            maxWidth: "260px",
            height: "46px",
            marginTop: "16px",
            background: "#3B35A3",
            color: "#FFFFFF",
            borderRadius: 0,
            boxShadow: "none",
            fontFamily: "Poppins, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#332D92")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#3B35A3")}
        >
          Take Test Now
        </button>
      </div>

      {/* Optional subtle page overlay when menu open — rgba(31,27,83,0.12) */}
      {isMenuOpen && (
        <div
          aria-hidden="true"
          className="lg:hidden fixed inset-0 z-[998]"
          style={{
            top: "64px",
            background: "rgba(31, 27, 83, 0.12)",
          }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
