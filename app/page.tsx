import Image from "next/image";
import Link from "next/link";
import { CollectionCard } from "@/components/CollectionCard/CollectionCard";
import { NewsletterForm } from "@/components/NewsletterForm/NewsletterForm";
import { ProductGrid } from "@/components/ProductCard/ProductCard";
import { getCollectionPreviews, getProducts } from "@/lib/api";
import { site, shopLink } from "@/lib/site";
import styles from "./page.module.css";

export const revalidate = 300;

export default async function HomePage() {
  const [collections, featured] = await Promise.all([
    getCollectionPreviews(),
    getProducts({ sort: "newest", page_size: "8" }),
  ]);
  const band = featured.items.slice(0, 5).filter((p) => p.images[0]);

  return (
    <>
      {/* Hero: the tagline is the headline */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={`wrap ${styles.heroInner}`}>
          <h1 id="hero-title" className={styles.tagline}>
            {site.tagline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <div className={styles.heroText}>
            <p>
              Cremation urns and matching keepsakes, each with artwork chosen to honor the person you love: a
              favorite place, a passion, a faith, a friend.
            </p>
            <div className={styles.ctas}>
              <a href="#collections" className="btn btn-gold">
                Browse the collections
              </a>
              <a href={shopLink("/shop")} className="btn btn-on-navy">
                Visit the shop
              </a>
            </div>
          </div>
        </div>
        {band.length > 0 && (
          <div className={`wrap ${styles.band}`} aria-hidden="true">
            {band.map((p, i) => (
              <div key={p.id} className={styles.bandItem}>
                <Image src={p.images[0].url} alt="" fill priority={i < 3} sizes="(min-width: 1024px) 18vw, 40vw" className={styles.bandImg} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Collections — each opens on the shop */}
      {collections.length > 0 && (
        <section id="collections" className={`wrap ${styles.section}`} aria-labelledby="collections-title">
          <div className={styles.sectionHead}>
            <h2 id="collections-title" className="h2">
              Collections
            </h2>
            <p className={styles.sectionText}>
              Every design belongs to a theme. Choose one to see all of its urns and keepsakes in our shop.
            </p>
          </div>
          <ul className={styles.collections}>
            {collections.map(({ collection, total, image }) => (
              <li key={collection.id}>
                <CollectionCard collection={collection} total={total} image={image} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Featured wares — newest designs from the shop */}
      {featured.items.length > 0 && (
        <section className={`wrap ${styles.section}`} aria-labelledby="featured-title">
          <div className={styles.sectionHead}>
            <h2 id="featured-title" className="h2">
              Featured wares
            </h2>
            <p className={styles.sectionText}>The latest designs added to the shop.</p>
            <Link href="/products" className={`link ${styles.headLink}`}>
              See all {featured.total} designs
            </Link>
          </div>
          <ProductGrid products={featured.items} />
        </section>
      )}

      {/* About, briefly */}
      <section className={`wrap ${styles.section} ${styles.about}`} aria-labelledby="about-title">
        <h2 id="about-title" className="h2">
          A small shop outside Chicago
        </h2>
        <div className={styles.aboutText}>
          <p>
            WindyCityWares is based in {site.location}, in the Chicago suburbs. We make memorial urns that feel personal
            rather than clinical: aluminum urns finished in high-gloss enamel and printed with a scene that says
            something about the life they hold.
          </p>
          <p>
            Most designs come as a full-size urn, as small keepsakes, or as a set of both, so a family can share a
            loved one&rsquo;s ashes and keep them close.
          </p>
          <Link href="/about" className="link">
            Read our story
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletter} aria-labelledby="newsletter-title">
        <div className={`wrap ${styles.newsletterInner}`}>
          <div>
            <h2 id="newsletter-title" className={styles.newsletterTitle}>
              Hear about new designs
            </h2>
            <p className={styles.newsletterText}>An occasional email when new collections arrive. No spam.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
