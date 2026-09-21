import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { isValidLocale, dirForLocale, type LocaleCode } from "@/i18n/locales";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

function getLocaleFromCookie(cookieStore: { get: (name: string) => { value?: string } | undefined }): LocaleCode {
  const locale = cookieStore.get("app_locale")?.value;
  if (typeof locale === "string" && isValidLocale(locale)) {
    return locale as LocaleCode;
  }
  return "en";
}

export const metadata: Metadata = {
  title: "Sleep Foundation – Sleep Chronotype Blueprint",
  description: "Sleep is the Foundation. Sleep Chronotype is the Blueprint. Better Sleep, Better Energy, Better Life.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%2335319B'/><text x='16' y='22' font-size='18' text-anchor='middle' fill='white'>S</text></svg>",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookie(cookieStore);
  const dir = dirForLocale(locale);

  return (
    <html lang={locale} dir={dir} data-locale={locale} className={poppins.variable}>
      <head>
        <link rel="preconnect" href="https://wqoplsaxjjazctvcccxn.supabase.co" />
        <link rel="dns-prefetch" href="https://wqoplsaxjjazctvcccxn.supabase.co" />
        <style
          id="site-preloader-styles"
          dangerouslySetInnerHTML={{
            __html: `
              html.preloader-active, html.preloader-active body { overflow: hidden; height: 100%; }
              @keyframes preloaderFade { 0%,100% { opacity: 0.35; } 50% { opacity: 1; } }
              @keyframes preloaderZoom { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
            `,
          }}
        />
      </head>
      <body className="bg-white text-[#171717] antialiased font-[var(--font-poppins)]" style={{ overflow: "hidden", height: "100%" }}>
        <div
          id="site-preloader"
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FFFFFF",
          }}
        >
          <div
            style={{
              width: "clamp(120px, 28vw, 200px)",
              aspectRatio: "1 / 1",
              backgroundImage: "url(/assets/logos/logo3.png)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
              animation: "preloaderFade 1.8s ease-in-out infinite, preloaderZoom 3s ease-in-out infinite",
            }}
          />
        </div>
        <ClientLayout locale={locale}>{children}</ClientLayout>
      </body>
    </html>
  );
}
