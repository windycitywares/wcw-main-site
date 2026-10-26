"use client";

import { useEffect, useState } from "react";

/**
 * A round arrow that appears once you have scrolled a screen down and takes you back to the top.
 * Same behaviour as the shop's (wcw-shop-portal frontend/src/components/ui/BackToTop.tsx).
 */
export function BackToTop({ label = "Back to top" }: { label?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setShow(window.scrollY > window.innerHeight * 0.8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /** Scrolls up steadily (about 1500 px a second, 0.7–3.5 s) instead of jumping. Runs even with reduced motion on: the visitor pressed it. */
  function toTop() {
    const start = window.scrollY;
    const done = () => document.getElementById("main")?.focus({ preventScroll: true });
    if (start < 2) {
      window.scrollTo(0, 0);
      done();
      return;
    }
    const duration = Math.min(3500, Math.max(700, start / 1.5));
    const t0 = performance.now();
    const root = document.documentElement;
    const before = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto"; // a CSS smooth value would fight the frame-by-frame steps
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // gentle start and stop
      window.scrollTo(0, start * (1 - eased));
      if (p < 1) requestAnimationFrame(step);
      else {
        root.style.scrollBehavior = before;
        done();
      }
    };
    requestAnimationFrame(step);
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={label}
      title={label}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`fixed bottom-5 right-5 z-40 grid size-11 cursor-pointer place-items-center rounded-full bg-navy-deep text-white shadow-[0_0_0_2px_#fff,0_4px_12px_rgb(19_34_51/0.3)] transition-all duration-200 hover:bg-navy motion-reduce:transition-none sm:bottom-6 sm:right-6 ${
        show ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-3 opacity-0"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
