import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { site, shopLink } from "@/lib/site";
import styles from "./about.module.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About us",
  description: "WindyCityWares makes cremation urns and keepsakes with personal artwork, from Schaumburg, Illinois.",
  alternates: { canonical: "/about" },
};

const MATERIALS = [
  { term: "Aluminum body", text: "Light to hold and strong enough to keep for generations." },
  { term: "High-gloss enamel", text: "The artwork is sealed under a smooth, glossy enamel finish." },
  { term: "Threaded screw-top lid", text: "The lid screws closed, so the ashes stay sealed and safe." },
  { term: "Two sizes", text: "A 6 × 10 inch urn for adult ashes, and 1.5 × 3 inch keepsakes for sharing." },
];

export default async function AboutPage() {
  const photos = (await getProducts({ sort: "newest", page_size: "2" })).items.filter((p) => p.images[1]);

  return (
    <>
      <section className={styles.intro}>
        <div className="wrap">
          <h1 className={styles.title}>About WindyCityWares</h1>
          <p className={styles.lead}>
            We make cremation urns and keepsakes that look like the life they hold, so the place where you keep a
            loved one feels like them.
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
              Choosing an urn usually happens in the hardest week of a family&rsquo;s life. We want that choice to be
              simple and the result to be something you are glad to see every day: a lighthouse for someone who loved
              the coast, a ball field for a lifelong fan, a sky full of stars for someone who looked up.
            </p>
            <p>
              Each design is printed on the urn itself and paired with matching keepsakes, so brothers, sisters and
              children can each keep a part of the person they miss.
            </p>
          </div>
        </section>

        <section className={styles.split} aria-labelledby="story-title">
          <h2 id="story-title" className="h2">
            Our story
          </h2>
          <div className="prose-wcw">
            <p>
              WindyCityWares began as a shop on Etsy, WindyCityWaresUS. As the number of designs grew past a
              hundred, we opened our own store at shop.windycitywares.com, where every design is organized into
              collections and easier to compare.
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

        <section className={styles.split} aria-labelledby="materials-title">
          <h2 id="materials-title" className="h2">
            Materials
          </h2>
          <dl className={styles.materials}>
            {MATERIALS.map((m) => (
              <div key={m.term}>
                <dt>{m.term}</dt>
                <dd>{m.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.split} aria-labelledby="team-title">
          <h2 id="team-title" className="h2">
            Who we are
          </h2>
          <ul className={styles.team}>
            <li className={styles.person}>
              <span className={styles.initials} aria-hidden="true">
                QS
              </span>
              <div>
                <p className={styles.name}>Qalid Saifullah</p>
                <p className={styles.role}>Owner</p>
              </div>
            </li>
          </ul>
        </section>

        <section className={styles.cta} aria-label="Next steps">
          <p className={styles.ctaText}>Find a design that tells their story.</p>
          <div className={styles.ctaButtons}>
            <Link href="/products" className="btn btn-gold">
              Browse products
            </Link>
            <a href={shopLink("/shop")} className="btn btn-on-navy">
              Visit the shop
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
