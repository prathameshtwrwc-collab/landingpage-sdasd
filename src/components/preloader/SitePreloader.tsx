"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SitePreloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onReady = () => {
      setVisible(false);
    };

    if (typeof window !== "undefined") {
      if (document.readyState === "complete") {
        onReady();
      } else {
        window.addEventListener("load", onReady, { once: true });
      }
    }

    return () => {
      window.removeEventListener("load", onReady);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-white"
      aria-hidden="true"
    >
      <div className="preloader-logo" />
      <style jsx>{`
        .preloader-logo {
          width: clamp(120px, 28vw, 200px);
          height: auto;
          background-image: url("/assets/logos/logo3.png");
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          animation: preloaderFade 1.8s ease-in-out infinite, preloaderZoom 3s ease-in-out infinite;
        }

        @keyframes preloaderFade {
          0%,
          100% {
            opacity: 0.35;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes preloaderZoom {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }
      `}</style>
    </div>
  );
}
