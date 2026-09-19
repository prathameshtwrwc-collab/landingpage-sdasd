"use client";

import { useEffect, useRef } from "react";

const MIN_VISIBLE_MS = 500;

export default function SitePreloader() {
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();

    const removePreloader = () => {
      const elapsed = Date.now() - (startedAt.current ?? Date.now());
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

      setTimeout(() => {
        const el = document.getElementById("site-preloader");
        if (el) {
          el.style.transition = "opacity 0.2s ease-out";
          el.style.opacity = "0";
          setTimeout(() => {
            el.remove();
          }, 220);
        }
        document.documentElement.classList.remove("preloader-active");
        document.body.style.overflow = "";
        document.body.style.height = "";
      }, remaining);
    };

    if (typeof window === "undefined") {
      removePreloader();
      return;
    }

    if (document.readyState === "interactive" || document.readyState === "complete") {
      removePreloader();
      return;
    }

    const onReady = () => {
      window.removeEventListener("DOMContentLoaded", onReady);
      removePreloader();
    };

    window.addEventListener("DOMContentLoaded", onReady);

    const fallback = window.setTimeout(() => {
      window.removeEventListener("DOMContentLoaded", onReady);
      removePreloader();
    }, 4000);

    return () => {
      window.removeEventListener("DOMContentLoaded", onReady);
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
