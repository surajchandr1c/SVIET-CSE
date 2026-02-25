"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  Trophy,
  UserRound,
  X,
} from "lucide-react";

type AdminTheme = "light" | "dark";

type AdminSidebarProps = {
  theme: AdminTheme;
  onToggleTheme: () => void;
};

export default function AdminSidebar({ theme, onToggleTheme }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Home", href: "/admin/dashboard", exact: true, icon: LayoutDashboard },
    { name: "Faculty", href: "/admin/faculty/add", icon: UserRound },
    { name: "TechXplore", href: "/admin/techxplore", exact: true, icon: UserRound },
    { name: "Achivement", href: "/admin/achivement", exact: true, icon: Trophy },
    { name: "Gallery", href: "/admin/gallery", exact: true, icon: Image },
    { name: "Notice Board", href: "/admin/notice", exact: true, icon: Bell },
    { name: "4th Sem", href: "/admin/4th", exact: true, icon: LayoutDashboard },
    { name: "6th Sem", href: "/admin/6th", exact: true, icon: LayoutDashboard },
  ];

  const isActivePath = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <div className="admin-mobile-bar fixed left-0 top-0 z-40 flex w-full items-center justify-between px-4 py-3 md:hidden">
        <h2 className="text-lg font-semibold text-[var(--admin-text)]">Admin Panel</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="admin-icon-button"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="admin-icon-button"
            title="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar fixed left-0 top-0 z-50 h-screen w-72 p-5 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:sticky md:top-4 md:m-4 md:h-[calc(100vh-2rem)] md:translate-x-0`}
      >
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-[var(--admin-text-muted)]">
              Control Room
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[var(--admin-text)]">Admin Panel</h2>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="admin-icon-button md:hidden"
            title="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = isActivePath(item.href, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`admin-nav-item ${active ? "active" : ""}`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 pt-8">
          <button
            type="button"
            onClick={onToggleTheme}
            className="admin-theme-toggle hidden md:flex"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <button type="button" onClick={handleLogout} className="admin-logout-button">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
