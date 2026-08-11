import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
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
        <Script
          id="css-feature-detection"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;if(typeof CSS!==typeof(void 0)&&CSS.supports){if(!CSS.supports("font-size","clamp(1px,1px,1px)"))d.setAttribute("data-no-clamp","");if(!CSS.supports("height","100dvh"))d.setAttribute("data-no-dvh","");if(!CSS.supports("width","min(1px,1px)"))d.setAttribute("data-no-min","");if(!CSS.supports("scroll-margin-top","1px"))d.setAttribute("data-no-scroll-margin","");try{var t=document.createElement("div");t.style.display="-webkit-flex";t.style.display="flex";t.style.gap="1px";d.appendChild(t);var s=getComputedStyle(t).gap;d.removeChild(t);if(s!=="1px")d.setAttribute("data-no-flexgap","")}catch(e){d.setAttribute("data-no-flexgap","")}}})();`
          }}
        />
        <link rel="preconnect" href="https://wqoplsaxjjazctvcccxn.supabase.co" />
        <link rel="dns-prefetch" href="https://wqoplsaxjjazctvcccxn.supabase.co" />
      </head>
      <body className="bg-white text-[#171717] antialiased font-[var(--font-poppins)]">
        <ClientLayout locale={locale}>{children}</ClientLayout>
      </body>
    </html>
  );
}
