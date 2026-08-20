import "./globals.css";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Analytics } from "@vercel/analytics/react";


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
