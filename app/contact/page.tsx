import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm/ContactForm";
import { Faq, type FaqItem } from "@/components/Faq/Faq";
import { API_URL } from "@/lib/api";
import { site, shopLink } from "@/lib/site";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Questions about an urn, a size or an order? Send WindyCityWares a message.",
  alternates: { canonical: "/contact" },
};

async function turnstileSiteKey(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/site-config`, { next: { revalidate: 300 } });
    return res.ok ? ((await res.json()) as { turnstile_site_key: string | null }).turnstile_site_key : null;
  } catch {
    return null;
  }
}

const FAQ: FaqItem[] = [
  {
    q: "What sizes do the urns come in?",
    a: (
      <>
        <p>
          The large urn measures 6 × 10 inches and is made for a full adult&rsquo;s ashes. Keepsake urns measure 1.5 × 3
          inches and hold a small portion.
        </p>
        <p>
          Most designs are sold as a single keepsake, a set of 2 or 4 keepsakes, the large urn alone, or the large urn
          with 2 or 4 matching keepsakes.
        </p>
      </>
    ),
  },
  {
    q: "What are the urns made of?",
    a: <p>Our urns are aluminum with a high-gloss enamel finish and a threaded screw-top lid that seals securely.</p>,
  },
  {
    q: "Can our family share the ashes?",
    a: (
      <p>
        Yes. That is what the keepsakes are for. Choose one of the sets with 2 or 4 keepsakes in the same design as the
        large urn, so each person keeps a matching piece.
      </p>
    ),
  },
  {
    q: "Do you make urns for pets?",
    a: (
      <p>
        Yes. See the{" "}
        <a href={shopLink("/category/pet-urns")} className="link">
          Pet Urns collection
        </a>
        .
      </p>
    ),
  },
  {
    q: "How do I place an order?",
    a: (
      <p>
        Open any design on this site and choose <em>Choose a size and buy</em>. You&rsquo;ll go to{" "}
        <a href={shopLink("/")} className="link">
          our shop
        </a>{" "}
        to pick a size and check out. Our designs are also on{" "}
        <a href={site.etsyUrl} className="link" rel="noopener">
          Etsy
        </a>
        .
      </p>
    ),
  },
  {
    q: "I have a question about an order",
    a: <p>Send us a message with the form on this page and include your order number, and we&rsquo;ll reply by email.</p>,
  },
];

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ContactPage({ searchParams }: Props) {
  const sp = await searchParams;
  const subject = typeof sp.subject === "string" ? sp.subject.slice(0, 200) : "";
  const siteKey = await turnstileSiteKey();

  return (
    <div className={`wrap ${styles.page}`}>
      <header className={styles.head}>
        <h1 className="display" style={{ fontSize: "clamp(2.8rem, 7vw, 4.5rem)" }}>
          Contact us
        </h1>
        <p className="lead">
          Questions about a design, a size or an order? Send us a message and we&rsquo;ll reply by email.
        </p>
      </header>

      <div className={styles.layout}>
        <section aria-label="Send a message" className={styles.formBox}>
          <ContactForm siteKey={siteKey} defaultSubject={subject} />
        </section>

        <aside className={styles.info} aria-label="Other ways to reach us">
          <div>
            <h2 className={styles.infoHeading}>Where we are</h2>
            <p>{site.location}</p>
            <p className={styles.muted}>In the Chicago suburbs.</p>
          </div>
          <div>
            <h2 className={styles.infoHeading}>Bought on Etsy?</h2>
            <p className={styles.muted}>You can also message us through your Etsy order.</p>
            <a href={site.etsyUrl} rel="noopener" className="link">
              Our Etsy shop
            </a>
          </div>
          <div>
            <h2 className={styles.infoHeading}>Browse first</h2>
            <Link href="/products" className="link">
              See every design
            </Link>
          </div>
        </aside>
      </div>

      <section aria-labelledby="faq-title" className={styles.faq}>
        <h2 id="faq-title" className="h2">
          Frequently asked questions
        </h2>
        <Faq items={FAQ} />
      </section>
    </div>
  );
}
