import "./globals.css";
import ScrollReveal from "@/components/ScrollReveal";
import { Analytics } from "@vercel/analytics/next";


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
