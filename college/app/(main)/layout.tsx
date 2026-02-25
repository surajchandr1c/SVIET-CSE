import "../globals.css";
import type { ReactNode } from "react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata = {
  title: "CSE Department",
  description: "Computer Science Department",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="frontend-shell theme-main min-h-screen bg-gradient-to-b from-[#071A2E] to-[#0B1F3A] text-slate-100">
      <Navbar />

      <main className="min-h-screen">{children}</main>

      <BackToTop />
      <Footer />
    </div>
  );
}
