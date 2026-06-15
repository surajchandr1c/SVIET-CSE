"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = "main > *, section";
const IMG_SELECTOR = "img";

export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }
    let cancelled = false;
    let revealObserver: IntersectionObserver | null = null;
    let imgObserver: IntersectionObserver | null = null;
    let rafOne = 0;
    let rafTwo = 0;
    let timeoutId: ReturnType<typeof window.setTimeout> | null = null;

    const init = () => {
      if (cancelled) return;

      const root = document.querySelector("main") ?? document.body;

      const revealTargets = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
      for (const el of revealTargets) {
        if (el.closest("nav")) continue;
        if (el.classList.contains("reveal")) continue;
        el.classList.add("reveal");
      }

      const imgTargets = Array.from(root.querySelectorAll<HTMLImageElement>(IMG_SELECTOR));
      for (const img of imgTargets) {
        if (img.closest("nav")) continue;
        if (img.classList.contains("img-reveal")) continue;
        img.classList.add("img-reveal");
      }

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

      for (const el of revealTargets) {
        revealObserver.observe(el);
      }

      imgObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const img = entry.target as HTMLImageElement;
            img.classList.add("img-reveal-visible");
            imgObserver?.unobserve(img);
          }
        },
        { root: null, threshold: 0.12 }
      );

      for (const img of imgTargets) {
        if (img.complete) {
          img.classList.add("img-reveal-visible");
          continue;
        }
        imgObserver.observe(img);
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
      imgObserver?.disconnect();
    };
  }, []);

  return null;
}
