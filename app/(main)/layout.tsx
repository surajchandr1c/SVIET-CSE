import "../globals.css";
import type { ReactNode } from "react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BackToTop from "@/components/BackToTop";
import CollegePreviewLink from "@/components/CollegePreviewLink";

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
    <div className="frontend-shell theme-main min-h-screen bg-white text-[#111827]">
      <Navbar />

      <main className="min-h-screen">{children}</main>

      <CollegePreviewLink />
      <BackToTop />
      <Footer />
    </div>
  );
}
