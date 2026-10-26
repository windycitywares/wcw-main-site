import Link from "next/link";
import { Logo } from "@/components/Logo/Logo";
import { SocialIcons } from "@/components/Social/Social";
import { getSocial } from "@/lib/api";
import { shopLink } from "@/lib/site";
import { NavLinks } from "./NavLinks";
import styles from "./Header.module.css";
import { ShopLink } from "@/components/ShopLink/ShopLink";
import { ThemeSwitcher } from "@/components/ThemeSwitcher/ThemeSwitcher";

export async function Header() {
  const social = await getSocial();
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label="WindyCityWares home">
          <Logo className={styles.logo} />
        </Link>

        <nav aria-label="Main" className={styles.desktopNav}>
          <NavLinks className={styles.links} />
          <ThemeSwitcher />
          <ShopLink href={shopLink("/shop")} className="btn">
            Shop
          </ShopLink>
        </nav>

        {/* Small screens: the theme switch beside a disclosure menu that works without JavaScript */}
        <div className={styles.mobileBar}>
        <ThemeSwitcher />
        <details className={styles.mobile}>
          <summary className={styles.menuButton}>
            <span className={styles.burger} aria-hidden="true" />
            Menu
          </summary>
          <nav aria-label="Main" className={styles.sheet}>
            <NavLinks className={styles.sheetLinks} />
            <SocialIcons accounts={social} className={styles.sheetSocial} />
            <ShopLink href={shopLink("/shop")} className="btn">
              Visit the shop
            </ShopLink>
          </nav>
        </details>
        </div>
      </div>
    </header>
  );
}
