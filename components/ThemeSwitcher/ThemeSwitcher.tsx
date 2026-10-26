"use client";

import { useEffect, useState } from "react";
import { applyTheme, readTheme, saveTheme } from "@/lib/theme";
import styles from "./ThemeSwitcher.module.css";

/**
 * Dark mode on/off, like the shop's switcher: a moon while the page is light, a sun while it is dark.
 * The choice is shared with the shop and the CRM (lib/theme.ts).
 */
export function ThemeSwitcher() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const sync = () => setDark(document.documentElement.dataset.theme === "midnight");
    sync();
    window.addEventListener("wcw-theme", sync);
    // Switched in another tab (or on the shop / CRM in another tab): follow it when this tab is shown again.
    const onShow = () => {
      if (document.visibilityState !== "visible") return;
      const saved = readTheme();
      if (saved !== document.documentElement.dataset.theme) applyTheme(saved);
    };
    document.addEventListener("visibilitychange", onShow);
    return () => {
      window.removeEventListener("wcw-theme", sync);
      document.removeEventListener("visibilitychange", onShow);
    };
  }, []);

  const toggle = () => {
    const next = dark ? "classic" : "midnight";
    saveTheme(next);
    applyTheme(next, true);
  };

  const tip = dark ? "Switch to light mode" : "Switch to dark mode";
  const icon = dark ? <Sun /> : <Moon />;

  return (
    <button type="button" aria-label="Dark mode" aria-pressed={dark} onClick={toggle} title={tip} className={styles.icon}>
      {icon}
    </button>
  );
}

function Moon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function Sun() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
