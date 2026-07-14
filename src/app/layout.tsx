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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-white text-[#171717] antialiased font-[var(--font-poppins)]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
