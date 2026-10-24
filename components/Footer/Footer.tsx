import Link from "next/link";
import { Logo } from "@/components/Logo/Logo";
import { site, shopLink } from "@/lib/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.brandCol}>
          <Logo tone="reverse" className={styles.logo} title="WindyCityWares" />
          <p className={styles.tagline}>
            {site.tagline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        <nav aria-label="Site" className={styles.col}>
          <h2 className={styles.heading}>Explore</h2>
          <ul>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/about">About us</Link></li>
            <li><Link href="/contact">Contact &amp; FAQ</Link></li>
          </ul>
        </nav>

        <nav aria-label="Shop" className={styles.col}>
          <h2 className={styles.heading}>Shop</h2>
          <ul>
            <li><a href={shopLink("/shop")}>All products</a></li>
            <li><a href={shopLink("/cart")}>Your cart</a></li>
            <li><a href={shopLink("/account")}>Your account</a></li>
          </ul>
        </nav>
      </div>
      <div className={`wrap ${styles.legal}`}>
        <p>
          © {new Date().getFullYear()} {site.legalName}, {site.location}
        </p>
      </div>
    </footer>
  );
}
