"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="text-center px-[24px] max-w-[480px]">
        <h2 className="m-0 text-[20px] font-bold mb-[12px]" style={{ color: "#171717" }}>Something went wrong</h2>
        <p className="m-0 text-[14px] mb-[24px]" style={{ color: "#666" }}>
          We couldn&apos;t load this page. Please try refreshing.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="px-[24px] py-[12px] rounded-xl border-none cursor-pointer text-white text-[14px] font-semibold transition-all hover:brightness-95"
          style={{ background: "#35319B" }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
