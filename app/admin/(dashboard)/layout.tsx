"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";

type AdminTheme = "light" | "dark";
const ADMIN_THEME_KEY = "admin-theme";
const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<AdminTheme>("dark");

  useEffect(() => {
    const resolveTheme = (): AdminTheme => {
      const savedTheme = localStorage.getItem(ADMIN_THEME_KEY);
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }

      return window.matchMedia(THEME_MEDIA_QUERY).matches ? "dark" : "light";
    };

    const syncTheme = () => {
      setTheme(resolveTheme());
    };

    const media = window.matchMedia(THEME_MEDIA_QUERY);
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === ADMIN_THEME_KEY) {
        syncTheme();
      }
    };
    const handleMediaChange = () => {
      if (!localStorage.getItem(ADMIN_THEME_KEY)) {
        syncTheme();
      }
    };

    syncTheme();

    window.addEventListener("storage", handleStorage);
    media.addEventListener("change", handleMediaChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      media.removeEventListener("change", handleMediaChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme: AdminTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem(ADMIN_THEME_KEY, nextTheme);
    setTheme(nextTheme);
    window.dispatchEvent(new StorageEvent("storage", { key: ADMIN_THEME_KEY }));
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
