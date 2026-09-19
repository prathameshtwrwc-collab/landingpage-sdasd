"use client";

import { useEffect, useRef } from "react";

const MIN_VISIBLE_MS = 600;
const FALLBACK_REMOVE_MS = 2200;

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

    const fallback = window.setTimeout(() => {
      removePreloader();
    }, FALLBACK_REMOVE_MS);

    return () => {
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
