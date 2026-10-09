"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = "main > section";

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }
    let cancelled = false;
    let revealObserver: IntersectionObserver | null = null;
    let rafOne = 0;
    let rafTwo = 0;
    let timeoutId: number | null = null;

    const init = () => {
      if (cancelled) return;

      const root = document.querySelector("main") ?? document.body;
      const revealTargets = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
      const belowTheFoldTargets: HTMLElement[] = [];
      const windowHeight = window.innerHeight;

      for (const el of revealTargets) {
        if (el.closest("nav") || el.dataset.noReveal === "true") continue;
        if (el.classList.contains("reveal") || el.classList.contains("reveal-visible")) continue;

        const rect = el.getBoundingClientRect();
        // Skip elements that are already within the viewport above the fold
        if (rect.top < windowHeight && rect.bottom > 0) {
          continue;
        }

        el.classList.add("reveal");
        belowTheFoldTargets.push(el);
      }

      if (belowTheFoldTargets.length === 0) return;

      revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            el.classList.add("reveal-visible");
            revealObserver?.unobserve(el);
          }
        },
        { root: null, threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );

      for (const el of belowTheFoldTargets) {
        revealObserver.observe(el);
      }
    };

    // Defer DOM mutations until hydration and the first paint fully settle.
    timeoutId = window.setTimeout(() => {
      rafOne = window.requestAnimationFrame(() => {
        rafTwo = window.requestAnimationFrame(init);
      });
    }, 450);

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(rafOne);
      window.cancelAnimationFrame(rafTwo);
      revealObserver?.disconnect();
    };
  }, [pathname]);

  return null;
}

