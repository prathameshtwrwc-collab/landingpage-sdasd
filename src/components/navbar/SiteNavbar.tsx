"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAssessment } from "@/components/assessment/AssessmentContext";
import DonateModal from "@/components/DonateModal";

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

interface SiteNavbarProps {
  brandingLogo?: string;
  brandingCompany?: string;
}

export default function SiteNavbar({ brandingLogo, brandingCompany }: SiteNavbarProps) {
  const { open: openAssessment } = useAssessment();
  const [donateOpen, setDonateOpen] = useState(false);
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
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const navbarHeight = 84;
      const y = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="site-header fixed top-0 left-0 right-0 z-[1000] w-full"
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
              @media(max-width:767px){
                .site-header{ height:92px !important; }
                #mobile-navigation{ top:92px !important; }
                .site-navbar-overlay{ top:92px !important; }
              }
              @media(min-width:768px){
                header#site-navbar{ height:68px !important; }
              }
              @media(min-width:1024px){
                header#site-navbar{ height:72px !important; }
              }
              @media(min-width:1024px) and (max-width:1199px){
                #site-navbar .nav-links{ gap:8px !important; }
                #site-navbar .nav-link{ font-size:11px !important; }
                #site-navbar .cta-login{ width:64px !important; font-size:11px !important; }
                #site-navbar .cta-donate{ width:80px !important; font-size:11px !important; }
                #site-navbar .cta-test{ width:100px !important; font-size:11px !important; }
                #site-navbar .nav-scroll{ overflow:hidden !important; }
              }
              .site-brand-text { font-size: clamp(14px, 2.2vw, 18px); }
              #site-navbar .nav-link { font-size: clamp(12px, 1.3vw, 14px); }
              /* Fallbacks for old browsers lacking clamp() */
              @supports not (font-size: clamp(1px, 1px, 1px)) {
                .site-brand-text{ font-size:15px !important; }
                #site-navbar .nav-link{ font-size:12px !important; }
              }
              html[data-no-flexgap] #site-navbar .nav-links{ gap:0 !important; }
              html[data-no-flexgap] #site-navbar .nav-links > a{ margin:0 14px 0 0 !important; }
              html[data-no-flexgap] #site-navbar .nav-links > a:last-child{ margin-right:0 !important; }
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
              gridTemplateColumns: "max-content minmax(0,1fr) auto",
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
              className="inline-flex items-center gap-[8px] md:gap-[10px] no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B35A3] focus-visible:ring-offset-2 rounded-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", minWidth: 0 }}
              aria-label={brandingCompany ? `${brandingCompany} - Home` : "Chronotype - Home"}
            >
              {brandingLogo ? (
                <img src={brandingLogo} alt={brandingCompany ?? "Brand"} className="shrink-0" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
              ) : (
                <span className="inline-flex items-center justify-center shrink-0" style={{ width: "32px", height: "32px" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#35319B" aria-hidden="true">
                    <path
                      d="M16.5 20.5A7.5 7.5 0 0 1 8 12 7.5 7.5 0 0 1 16.5 3.5 5.5 5.5 0 0 0 16.5 20.5Z"
                      stroke="#35319B"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
              <span
                className="font-semibold leading-[1] tracking-[-0.01em] site-brand-text"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  lineHeight: "1",
                  fontWeight: 600,
                  color: "#2F2A86",
                  whiteSpace: "nowrap",
                }}
              >
                {brandingCompany ?? "Chronotype"}
              </span>
            </a>

            {/* Center: Navigation — hidden below 1024 */}
            <nav aria-label="Primary navigation" className="hidden lg:flex items-center justify-center h-full min-w-0 nav-scroll nav-links"
              style={{ gap: "clamp(8px, 1.8vw, 28px)", overflow: "hidden" }}>
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
                    className="relative inline-flex items-center justify-center no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B35A3] focus-visible:ring-offset-2 rounded-sm group nav-link"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      lineHeight: "1",
                      fontWeight: 500,
                      color: isActive ? "#F59A00" : isScrolled ? "#29275E" : "#2F2A86",
                      transition: "color 180ms ease",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
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
            <div className="hidden lg:flex items-center justify-end gap-[8px]">
              <a
                href="/login"
                className="cta-login inline-flex items-center justify-center border-none transition-all duration-[220ms] ease-[ease] hover:-translate-y-[1px] cursor-pointer no-underline"
                style={{
                  width: "86px",
                  height: "36px",
                  background: "#F59A00",
                  color: "#FFFFFF",
                  borderRadius: 0,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#E08A00"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#F59A00"; }}
              >
                Login
              </a>
              <button type="button" onClick={() => setDonateOpen(true)}
                className="cta-donate inline-flex items-center justify-center border cursor-pointer transition-all duration-[220ms] ease-[ease] hover:-translate-y-[1px]"
                style={{
                  width: "110px", height: "36px",
                  borderColor: "#F59A00", color: "#F59A00",
                  background: "rgba(245,154,0,0.08)",
                  borderRadius: 0, fontFamily: "Poppins, sans-serif",
                  fontSize: "12px", fontWeight: 600,
                }}>
                ❤ Donate
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("chronotypes");
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 84;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                  openAssessment();
                }}
                className="cta-test inline-flex items-center justify-center bg-[#3B35A3] text-white border-none rounded-none shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59A00] focus-visible:ring-offset-2 transition-all duration-[220ms] ease-[ease] hover:-translate-y-[1px] cursor-pointer"
                style={{
                  width: "130px",
                  height: "36px",
                  background: "#3B35A3",
                  color: "#FFFFFF",
                  borderRadius: 0,
                  boxShadow: "none",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "12px",
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
            if (el) {
              const y = el.getBoundingClientRect().top + window.scrollY - 84;
              window.scrollTo({ top: y, behavior: "smooth" });
            }
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

        {/* Mobile login link */}
        <a
          href="/login"
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center justify-center w-full max-w-[260px] text-[#29275E] no-underline cursor-pointer mt-[10px] transition-all duration-150"
          style={{
            width: "100%",
            maxWidth: "260px",
            height: "46px",
            fontFamily: "Poppins, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            border: "1.5px solid #F59A00",
            background: "#F59A00",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#E08A00";
            e.currentTarget.style.borderColor = "#E08A00";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#F59A00";
            e.currentTarget.style.borderColor = "#F59A00";
          }}
        >
          Login
        </a>

        {/* Mobile donate button */}
        <button
          type="button"
          onClick={() => { setIsMenuOpen(false); setDonateOpen(true); }}
          className="flex items-center justify-center w-full max-w-[260px] cursor-pointer mt-[10px] transition-all duration-150"
          style={{
            width: "100%",
            maxWidth: "260px",
            height: "46px",
            fontFamily: "Poppins, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            border: "1.5px solid #FF6B6B",
            background: "#FFF0F0",
            color: "#FF6B6B",
            borderRadius: 0,
          }}
        >
          ❤ Donate
        </button>
      </div>

      {/* Optional subtle page overlay when menu open — rgba(31,27,83,0.12) */}
      {isMenuOpen && (
        <div
          aria-hidden="true"
          className="site-navbar-overlay lg:hidden fixed inset-0 z-[998]"
          style={{
            top: "64px",
            background: "rgba(31, 27, 83, 0.12)",
          }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      <DonateModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  );
}
