"use client";

import { useEffect, useRef } from "react";

const MIN_VISIBLE_MS = 1200;

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
          el.style.transition = "opacity 0.25s ease-out";
          el.style.opacity = "0";
          setTimeout(() => {
            el.remove();
          }, 260);
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

    if (document.readyState === "complete") {
      removePreloader();
      return;
    }

    const onLoaded = () => {
      window.removeEventListener("load", onLoaded);
      removePreloader();
    };

    window.addEventListener("load", onLoaded);

    // Fallback in case load event already fired or is unreliable
    const fallback = window.setTimeout(() => {
      window.removeEventListener("load", onLoaded);
      removePreloader();
    }, 6000);

    return () => {
      window.removeEventListener("load", onLoaded);
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
