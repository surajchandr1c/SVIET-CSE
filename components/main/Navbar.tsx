"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bell,
  Home,
  Image as ImageIcon,
  LogIn,
  Menu,
  School,
  Users,
  User,
  UserRound,
  X,
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [studentSignedIn, setStudentSignedIn] = useState(false);
  const [adminSignedIn, setAdminSignedIn] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/session", {
      method: "GET",
      credentials: "include",
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Session request failed");
        return (await res.json()) as {
          signedIn?: boolean;
          adminSignedIn?: boolean;
          studentSignedIn?: boolean;
        };
      })
      .then((data) => {
        setStudentSignedIn(Boolean(data.studentSignedIn));
        setAdminSignedIn(Boolean(data.adminSignedIn));
        setSignedIn(Boolean(data.signedIn));
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setSignedIn(false);
        setStudentSignedIn(false);
        setAdminSignedIn(false);
      })
      .finally(() => {
        if (!controller.signal.aborted) setAuthResolved(true);
      });

    return () => controller.abort();
  }, []);

  const logout = async () => {
    try {
      if (adminSignedIn) {
        await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
      }
      if (studentSignedIn) {
        await fetch("/api/student/logout", { method: "POST", credentials: "include" });
      }
    } finally {
      setSignedIn(false);
      setStudentSignedIn(false);
      setAdminSignedIn(false);
      setAuthResolved(true);
      handleCloseAll();
      window.location.href = "/login";
    }
  };

  const topNavItems = [
    { name: "About", href: "/about" },
    { name: "Batches", href: "/batches" },
    { name: "Contact", href: "/contact" },
  ];

  const profileNavItem = authResolved && signedIn && studentSignedIn ? { name: "Profile", href: "/student/dashboard", icon: User } : null;

  const publicMenuNavItems = [{ name: "Notice Board", href: "/notice", icon: Bell }];
  const gatedNavItems = authResolved && signedIn
    ? [{ name: "TechXplore", href: "/techxplore", icon: Users }]
    : [];
  const studentOnlyNavItems = authResolved && studentSignedIn
    ? [{ name: "Student List", href: "/student-list", icon: Users }]
    : [];

  const semesterNavItem = { name: "Semesters", href: "/semester", icon: School };

  const sidebarNavItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Faculty", href: "/faculty", icon: UserRound },
    semesterNavItem,
    ...publicMenuNavItems,
    ...(profileNavItem ? [profileNavItem] : []),
    ...gatedNavItems,
    ...studentOnlyNavItems,
    { name: "Batches", href: "/batches", icon: Users },
    { name: "Gallery", href: "/gallery", icon: ImageIcon },
  ];

  const mobileNavItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about" },
    { name: "Faculty", href: "/faculty", icon: UserRound },
    semesterNavItem,
    ...publicMenuNavItems,
    ...(profileNavItem ? [profileNavItem] : []),
    ...gatedNavItems,
    ...studentOnlyNavItems,
    { name: "Batches", href: "/batches", icon: Users },
    { name: "Gallery", href: "/gallery", icon: ImageIcon },
    { name: "Contact", href: "/contact" },
  ];

  const handleCloseAll = () => {
    setMobileOpen(false);
    setSidebarOpen(false);
  };

  return (
    <nav className="sticky top-0 z-99 border rounded-full border-[black] bg-white px-2 py-2 sm:px-2 mt-5 mx-10">
      <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between bg-white px-3.5 py-2.5 text-black sm:px-5 sm:py-3 md:px-6 md:py-3 lg:px-5 lg:py-3">
        <Link href="/" onClick={handleCloseAll} className="shrink-0">
          <div className="flex items-center rounded-2xl ">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl ">
                <Image
                  src="/logo.jpeg"
                  alt="SVIET logo"
                  width={60}
                  height={60}
                  priority
                  className="h-[3.75rem] w-[3.75rem] object-contain"
                />
              </div>
            </div>

            <div className="mx-3 h-10 w-px bg-[#F59E0B]" />

            <span className="select-none font-bold tracking-[0.14em] text-black text-[22px] leading-none sm:text-[26px] md:text-[28px]">
              SVIET
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/student/dashboard"
            onClick={handleCloseAll}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-black transition hover:bg-[#F3F4F6]"
            aria-label="Open profile"
            title="Profile"
          >
            <User size={18} />
          </Link>

          <button
            type="button"
            className="rounded-md p-2 text-black transition hover:bg-[#F3F4F6]"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <ul className="flex items-center gap-5">
            {topNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative px-1 py-0.5 text-[15px] font-semibold transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:rounded-full after:bg-[#2563EB] after:transition-transform after:duration-300 after:ease-out ${
                    mounted && pathname === item.href
                      ? "text-[#2563EB] after:scale-x-100"
                      : "text-black after:scale-x-0 hover:text-[#2563EB] hover:after:scale-x-100"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/student/dashboard"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-black transition hover:bg-[#F3F4F6]"
            aria-label="Open profile"
            title="Profile"
          >
            <User size={18} />
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#F3F4F6]"
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
          >
            <Menu size={18} />
            Menu
          </button>
        </div>
      </div>

      <div className="relative mx-auto h-0 w-full max-w-[1380px] md:hidden">
        <ul
          className={`absolute left-0 right-0 mt-2 flex origin-top flex-col gap-1.5 rounded-2xl border border-[#E5E7EB] bg-white p-3.5 text-black shadow-[0_14px_32px_rgba(17,24,39,0.10)] transition-all duration-300 ease-out ${
            mobileOpen
              ? "pointer-events-auto translate-y-0 scale-y-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-y-95 opacity-0"
          }`}
          aria-hidden={!mobileOpen}
        >
          {mobileNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={handleCloseAll}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[17px] transition ${
                  mounted && pathname === item.href
                    ? "bg-[#EFF6FF] text-[#2563EB]"
                    : "text-black hover:bg-[#F3F4F6]"
                }`}
              >
                {"icon" in item && item.icon ? <item.icon size={18} /> : null}
                {item.name}
              </Link>
            </li>
          ))}

          <li className="pt-2">
            {authResolved && signedIn ? (
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1f56e4] to-[#08b8a8] px-4 py-3 text-center text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(16,74,198,0.22)]"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={handleCloseAll}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1f56e4] to-[#08b8a8] px-4 py-3 text-center text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(16,74,198,0.22)]"
              >
                <LogIn size={18} color="#fff" />
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>

      <div
        className={`fixed inset-0 z-40 hidden bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 md:block ${
          sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={handleCloseAll}
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={`fixed right-0 top-0 z-50 hidden h-screen w-[340px] max-w-[92vw] flex-col border-l border-[#E5E7EB] bg-white p-6 shadow-2xl transition-transform duration-300 ease-out md:flex ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-[0.22em] text-[#2563EB]">MENU</p>
          <button
            type="button"
            onClick={handleCloseAll}
            className="rounded-md p-2 text-black transition hover:bg-[#F3F4F6]"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="mt-6 space-y-1.5">
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleCloseAll}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[16px] font-semibold transition ${
                mounted && pathname === item.href
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "text-black hover:bg-[#F3F4F6]"
              }`}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-6">
          {authResolved && signedIn ? (
            <button
              type="button"
              onClick={logout}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1f56e4] to-[#08b8a8] px-5 py-3 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(16,74,198,0.22)]"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={handleCloseAll}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1f56e4] to-[#08b8a8] px-5 py-3 text-[16px] font-semibold text-white shadow-[0_10px_24px_rgba(16,74,198,0.22)]"
            >
              <LogIn size={18} color="#fff" />
              Login
            </Link>
          )}
        </div>
      </aside>
    </nav>
  );
}
