/**
 * Light/dark theme, shared by windycitywares.com, shop.windycitywares.com and the CRM.
 *
 * The visitor's choice is kept in one cookie, `wcw-theme` ("classic" | "midnight"), set for the whole
 * windycitywares.com domain, so switching on any of the three sites applies to the others too.
 * Each site also keeps its own older localStorage value as a fallback (the shop's key is also `wcw-theme`).
 * Same names and values as the shop's lib/themes.ts and the CRM's AppShell.
 */
export const THEME_COOKIE = "wcw-theme";
export const THEMES = ["classic", "midnight"] as const;
export type ThemeId = (typeof THEMES)[number];
export const THEME_COLOR: Record<ThemeId, string> = { classic: "#f2f3ef", midnight: "#0f151c" }; // the shop's values

/** `; domain=.windycitywares.com` on our own sites, nothing elsewhere (localhost, CI). */
function cookieDomain(): string {
  const h = location.hostname;
  return h === "windycitywares.com" || h.endsWith(".windycitywares.com") ? "; domain=.windycitywares.com" : "";
}

export function readTheme(): ThemeId {
  try {
    const m = document.cookie.match(/(?:^|;\s*)wcw-theme=([^;]*)/);
    const v = m ? decodeURIComponent(m[1]) : localStorage.getItem(THEME_COOKIE);
    return v === "midnight" || v === "classic" ? v : "classic";
  } catch {
    return "classic";
  }
}

export function saveTheme(id: ThemeId) {
  const secure = location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${THEME_COOKIE}=${id}; path=/; max-age=31536000; samesite=lax${cookieDomain()}${secure}`;
  try {
    localStorage.setItem(THEME_COOKIE, id);
  } catch {
    /* storage blocked: the cookie still carries it */
  }
}

export function applyTheme(id: ThemeId, animate = false) {
  const root = document.documentElement;
  if (animate) {
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 300);
  }
  root.dataset.theme = id;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[id]);
  window.dispatchEvent(new CustomEvent("wcw-theme", { detail: id }));
}

/**
 * Inline <head> script: applies the saved theme before first paint, so the page never flashes light.
 * Order: `?theme=` (preview, not saved) → shared cookie → this site's localStorage → light.
 */
export const themeBootScript = `(function(){try{var q=new URLSearchParams(location.search).get("theme");var m=document.cookie.match(/(?:^|;\\s*)wcw-theme=([^;]*)/);var v=q||(m&&decodeURIComponent(m[1]))||localStorage.getItem("wcw-theme");document.documentElement.setAttribute("data-theme",v==="midnight"?"midnight":"classic");}catch(e){document.documentElement.setAttribute("data-theme","classic");}})();`;
