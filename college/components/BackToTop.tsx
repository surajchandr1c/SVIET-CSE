"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollTop}
      className="fixed bottom-30 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#2c3e50] text-xl text-white shadow-lg transition hover:bg-[#1e6fb9]"
      title="Go to top"
    >
      {"\u2191"}
    </button>
  );
}
