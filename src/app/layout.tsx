import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sleep Foundation – Sleep Chronotype Blueprint",
  description: "Sleep is the Foundation. Sleep Chronotype is the Blueprint. Better Sleep, Better Energy, Better Life.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%2335319B'/><text x='16' y='22' font-size='18' text-anchor='middle' fill='white'>S</text></svg>",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="preconnect" href="https://wqoplsaxjjazctvcccxn.supabase.co" />
        <link rel="dns-prefetch" href="https://wqoplsaxjjazctvcccxn.supabase.co" />
      </head>
      <body className="bg-white text-[#171717] antialiased font-[var(--font-poppins)]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
