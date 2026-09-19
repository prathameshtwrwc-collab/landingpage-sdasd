"use client";

import { useEffect } from "react";

export default function ClerkErrorGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      const msg = String(event?.message ?? "");
      if (
        msg.includes("insertBefore") ||
        msg.includes("removeChild") ||
        msg.includes("NotFoundError")
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = String(event?.reason ?? "");
      if (
        reason.includes("insertBefore") ||
        reason.includes("removeChild") ||
        reason.includes("NotFoundError")
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onUnhandledRejection, true);

    return () => {
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onUnhandledRejection, true);
    };
  }, []);

  return <>{children}</>;
}
