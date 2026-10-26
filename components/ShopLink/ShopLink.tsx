import type { AnchorHTMLAttributes } from "react";

/**
 * A link that leaves this site — to the shop (shop.windycitywares.com) or Etsy — and opens in a new tab,
 * so windycitywares.com stays open behind it. Screen readers hear "(opens in a new tab)".
 * Use it for every shop/Etsy link; internal pages use next/link.
 */
export function ShopLink({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
