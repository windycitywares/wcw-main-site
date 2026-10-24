import Image from "next/image";
import Link from "next/link";
import { CollectionCard } from "@/components/CollectionCard/CollectionCard";
import { NewsletterForm } from "@/components/NewsletterForm/NewsletterForm";
import { ProductGrid } from "@/components/ProductCard/ProductCard";
import { getCategoryGroups, getProducts } from "@/lib/api";
import { site, shopCategoryUrl, shopLink } from "@/lib/site";
import styles from "./page.module.css";

export const revalidate = 300;

export default async function HomePage() {
  const [groups, featured] = await Promise.all([
    getCategoryGroups(),
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
              Handcrafted pieces, antiques, gifts, home décor and memorial urns, each one chosen with care and
              shipped to your door.
            </p>
            <div className={styles.ctas}>
              <a href="#categories" className="btn btn-gold">
                Shop by category
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

      {/* Shop by category — one group per top-level category; each tile opens on the shop */}
      {groups.length > 0 && (
        <section id="categories" className={`wrap ${styles.section}`} aria-labelledby="categories-title">
          <div className={styles.sectionHead}>
            <h2 id="categories-title" className="h2">
              Shop by category
            </h2>
            <p className={styles.sectionText}>
              Handcrafts, antiques, gifts, home décor and memorial urns, all in one place. Choose a category to see
              everything in it in our shop.
            </p>
          </div>
          {groups.map(({ parent, tiles }) => (
            <div key={parent.id} className={styles.group}>
              {/* A group heading only helps when there is more than one group or the tiles are sub-categories */}
              {(groups.length > 1 || tiles[0]?.collection.id !== parent.id) && (
                <h3 className={styles.groupTitle}>
                  <a href={shopCategoryUrl(parent.slug)}>{parent.name}</a>
                </h3>
              )}
              <ul className={styles.collections}>
                {tiles.map(({ collection, total, image }) => (
                  <li key={collection.id}>
                    <CollectionCard collection={collection} total={total} image={image} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Featured wares — newest items in the shop */}
      {featured.items.length > 0 && (
        <section className={`wrap ${styles.section}`} aria-labelledby="featured-title">
          <div className={styles.sectionHead}>
            <h2 id="featured-title" className="h2">
              Featured wares
            </h2>
            <p className={styles.sectionText}>The latest additions to the shop.</p>
            <Link href="/products" className={`link ${styles.headLink}`}>
              See all {featured.total} items
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
            WindyCityWares is based in {site.location}, in the Chicago suburbs. We hand-pick everything we sell:
            handcrafted pieces with the maker&rsquo;s touch, antiques and vintage finds with a history of their own,
            gifts and home décor, and memorial urns with artwork chosen to honor a loved one.
          </p>
          <p>
            Every order is packed carefully so it arrives in one piece, and real people are here to answer your
            questions.
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
              Hear about new arrivals
            </h2>
            <p className={styles.newsletterText}>Occasional emails about new arrivals and offers. Unsubscribe any time.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
