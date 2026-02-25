"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";

type AdminTheme = "light" | "dark";
const ADMIN_THEME_KEY = "admin-theme";

const getInitialTheme = (): AdminTheme => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = localStorage.getItem(ADMIN_THEME_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<AdminTheme>(getInitialTheme);

  useEffect(() => {
    localStorage.setItem(ADMIN_THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className={`admin-shell admin-${theme} min-h-screen`}>
      <div className="relative flex min-h-screen">
        <AdminSidebar theme={theme} onToggleTheme={toggleTheme} />

        <main className="admin-content flex-1 p-4 pt-20 md:p-8 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
