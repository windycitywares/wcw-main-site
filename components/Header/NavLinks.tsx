"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function NavLinks({ className }: { className?: string }) {
  const path = usePathname();
  return (
    <ul className={className}>
      {LINKS.map((l) => {
        const current = path === l.href || path.startsWith(`${l.href}/`);
        return (
          <li key={l.href}>
            <Link href={l.href} aria-current={current ? "page" : undefined}>
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
