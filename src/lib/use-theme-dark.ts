"use client";

import { useEffect, useState } from "react";

export function useThemeDark(): boolean {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const check = () => setDark(document.documentElement.getAttribute("data-theme") === "dark");
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("storage", check);
    return () => {
      observer.disconnect();
      window.removeEventListener("storage", check);
    };
  }, []);

  return dark;
}
