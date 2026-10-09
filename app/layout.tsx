import type { Metadata } from "next";
import "./globals.css";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Department of Computer Science & Engineering | SVIET",
  description: "Official portal of Department of CSE, SVIET",
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className="theme-main min-h-screen bg-white text-[#111827]"
      >
        <ScrollReveal />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
