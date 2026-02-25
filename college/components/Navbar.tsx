"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Faculty", href: "/faculty" },
    { name: "Notice Board", href: "/notice" },
    { name: "Semesters", href: "/semester" },
    { name: "TechXplore", href: "/techxplore" },
    { name: "Achivement", href: "/Achivement" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <nav className="sticky top-2 z-50 px-2 sm:px-3 md:px-4 lg:top-3">
      <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between rounded-2xl border border-cyan-300/45 bg-gradient-to-r from-[#124a6d] to-[#175f84] px-3.5 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3 lg:rounded-3xl lg:px-5 lg:py-3 text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
        <Link href="/" onClick={handleClose} className="shrink-0">
          <img
            src="/Logo.webp"
            alt="logo"
            className="h-9 w-auto object-contain sm:h-10 md:h-11 lg:h-10"
          />
        </Link>

        <button
          type="button"
          className="rounded-md p-1 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative px-1 py-0.5 text-[17px] font-semibold transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:rounded-full after:bg-cyan-300 after:transition-transform after:duration-300 after:ease-out md:text-[18px] lg:text-[15px] ${
                  pathname === item.href
                    ? "text-white after:scale-x-100"
                    : "text-slate-100 after:scale-x-0 hover:text-white hover:after:scale-x-100"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto h-0 w-full max-w-[1380px] md:hidden">
        <ul
          className={`absolute left-0 right-0 mt-2 flex origin-top flex-col gap-1.5 rounded-2xl border border-cyan-300/40 bg-gradient-to-r from-[#0f3f5f] to-[#124a6f] p-3.5 text-white shadow-[0_16px_36px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out ${
            open
              ? "pointer-events-auto translate-y-0 scale-y-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-y-95 opacity-0"
          }`}
          aria-hidden={!open}
        >
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={handleClose}
                className={`block rounded-md px-3 py-2.5 text-[17px] transition ${
                  pathname === item.href
                    ? "bg-cyan-400/15 text-cyan-200"
                    : "hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
