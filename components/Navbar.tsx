"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Faculty", href: "/faculty" },
    { name: "Notice Board", href: "/notice" },
    { name: "Semesters", href: "/semester" },
    { name: "TechXplore", href: "/techxplore" },
    { name: "Achivement", href: "/Achivement" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <nav className="sticky top-2 z-50 px-2 sm:px-3 md:px-4 lg:top-3">
      <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between rounded-2xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-black shadow-[0_14px_32px_rgba(17,24,39,0.10)] sm:px-5 sm:py-3 md:px-6 md:py-3 lg:rounded-3xl lg:px-5 lg:py-3">
        <Link href="/" onClick={handleClose} className="shrink-0">
          <div className="flex items-center rounded-2xl ">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl ">
                <img
                  src="/logo.jpeg"
                  alt="SVIET logo"
                  className="h-15 w-15 object-contain"
                />
              </div>
            </div>

            <div className="mx-3 h-10 w-px bg-[#F59E0B]" />

            <span className="select-none font-bold tracking-[0.14em] text-black text-[22px] leading-none sm:text-[26px] md:text-[28px]">
              SVIET
            </span>
          </div>
        </Link>

        <button
          type="button"
          className="rounded-md p-2 text-black transition hover:bg-[#F3F4F6] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative px-1 py-0.5 text-[17px] font-semibold transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-full after:origin-left after:rounded-full after:bg-[#2563EB] after:transition-transform after:duration-300 after:ease-out md:text-[18px] lg:text-[15px] ${
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
      </div>

      <div className="relative mx-auto h-0 w-full max-w-[1380px] lg:hidden">
        <ul
          className={`absolute left-0 right-0 mt-2 flex origin-top flex-col gap-1.5 rounded-2xl border border-[#E5E7EB] bg-white p-3.5 text-black shadow-[0_14px_32px_rgba(17,24,39,0.10)] transition-all duration-300 ease-out ${
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
                  mounted && pathname === item.href
                    ? "bg-[#EFF6FF] text-[#2563EB]"
                    : "text-black hover:bg-[#F3F4F6]"
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
