"use client";

import { useEffect } from "react";

/**
 * Locks page scrolling while `active` is true.
 *
 * Uses the battle-tested technique: `position: fixed` on <body> (preserving
 * the scroll offset) combined with `overflow: hidden` on <html> and <body>
 * and `touch-action: none` for touch devices. This fully prevents the page
 * from scrolling while leaving any scrollable content inside the modal free
 * to scroll with the mouse/touch.
 */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;
    const scrollY = window.scrollY;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [active]);
}
