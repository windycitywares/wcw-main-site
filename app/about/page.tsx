import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { site, shopLink } from "@/lib/site";
import styles from "./about.module.css";
import { ShopLink } from "@/components/ShopLink/ShopLink";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About us",
  description: "WindyCityWares hand-picks handcrafts, antiques, gifts, home décor and memorial urns, from Schaumburg, Illinois.",
  alternates: { canonical: "/about" },
};

const WHAT_WE_SELL = [
  { term: "Handcrafted", text: "Made by hand, with the maker\u2019s touch in every piece." },
  { term: "Antiques and vintage", text: "One-of-a-kind finds with a history of their own." },
  { term: "Gifts", text: "Thoughtful presents for birthdays, weddings and housewarmings." },
  { term: "Home décor", text: "Pieces that make a room feel finished." },
  {
    term: "Memorial urns",
    text: "Aluminum urns with artwork chosen to honor a loved one, with matching keepsakes so a family can share.",
  },
];

export default async function AboutPage() {
  const photos = (await getProducts({ sort: "newest", page_size: "2" })).items.filter((p) => p.images[1]);

  return (
    <>
      <section className={styles.intro}>
        <div className="wrap">
          <h1 className={styles.title}>About WindyCityWares</h1>
          <p className={styles.lead}>
            A small shop outside Chicago for handcrafts, antiques, gifts, home décor and memorial urns, every piece
            chosen with care.
          </p>
        </div>
      </section>

      <div className={`wrap ${styles.body}`}>
        <section className={styles.split} aria-labelledby="mission-title">
          <h2 id="mission-title" className="h2">
            Our mission
          </h2>
          <div className="prose-wcw">
            <p>
              We look for things worth bringing home: pieces made by hand, finds with a story, and gifts that feel
              chosen rather than bought in a hurry. Every item is selected by us, so the shop stays small and good.
            </p>
            <p>
              Some moments call for something especially personal. Our memorial urns carry artwork chosen to honor a
              loved one, with matching keepsakes so a family can each keep a part of the person they miss.
            </p>
          </div>
        </section>

        <section className={styles.split} aria-labelledby="story-title">
          <h2 id="story-title" className="h2">
            Our story
          </h2>
          <div className="prose-wcw">
            <p>
              WindyCityWares began as a shop on Etsy, WindyCityWaresUS. As the range grew, we opened our own store at
              shop.windycitywares.com, where everything is organized by category and easy to compare. You can still
              find us on Etsy too.
            </p>
            <p>
              The name comes from home. We work from {site.location}, a short drive from downtown Chicago, the Windy
              City.
            </p>
          </div>
        </section>

        {photos.length > 0 && (
          <div className={styles.photos} aria-hidden="true">
            {photos.map((p) => (
              <div key={p.id} className={styles.photo}>
                <Image src={p.images[1].url} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className={styles.photoImg} />
              </div>
            ))}
          </div>
        )}

        <section className={styles.split} aria-labelledby="sell-title">
          <h2 id="sell-title" className="h2">
            What we sell
          </h2>
          <dl className={styles.materials}>
            {WHAT_WE_SELL.map((m) => (
              <div key={m.term}>
                <dt>{m.term}</dt>
                <dd>{m.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.cta} aria-label="Next steps">
          <p className={styles.ctaText}>Find something worth bringing home.</p>
          <div className={styles.ctaButtons}>
            <Link href="/products" className="btn btn-gold">
              Browse products
            </Link>
            <ShopLink href={shopLink("/shop")} className="btn btn-on-navy">
              Visit the shop
            </ShopLink>
          </div>
        </section>
      </div>
    </>
  );
}
