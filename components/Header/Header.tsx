import Link from "next/link";
import { Logo } from "@/components/Logo/Logo";
import { shopLink } from "@/lib/site";
import { NavLinks } from "./NavLinks";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label="WindyCityWares home">
          <Logo className={styles.logo} />
        </Link>

        <nav aria-label="Main" className={styles.desktopNav}>
          <NavLinks className={styles.links} />
          <a href={shopLink("/shop")} className="btn">
            Shop
          </a>
        </nav>

        {/* Small screens: a disclosure menu that works without JavaScript */}
        <details className={styles.mobile}>
          <summary className={styles.menuButton}>
            <span className={styles.burger} aria-hidden="true" />
            Menu
          </summary>
          <nav aria-label="Main" className={styles.sheet}>
            <NavLinks className={styles.sheetLinks} />
            <a href={shopLink("/shop")} className="btn">
              Visit the shop
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
