"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function CSEIntroOverlay() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const leaveTimer = window.setTimeout(() => {
      setIsLeaving(true);
    }, 650);

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = originalOverflow;
    }, 1000);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`cse-intro-overlay ${isLeaving ? "cse-intro-overlay-leave" : ""}`}
      aria-hidden="true"
    >
      <div className="cse-intro-mark">
        <Image
          src="/logo.jpeg"
          alt="College logo"
          width={160}
          height={160}
          className="cse-intro-logo"
          draggable="false"
        />
        <h1 className="cse-intro-title">DEPARTMENT OF CSE</h1>
      </div>
    </div>
  );
}
