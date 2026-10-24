import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm/ContactForm";
import { Faq, type FaqItem } from "@/components/Faq/Faq";
import { API_URL } from "@/lib/api";
import { site, shopLink } from "@/lib/site";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Questions about an item, shipping or an order? Send WindyCityWares a message.",
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
    q: "What do you sell?",
    a: (
      <p>
        Handcrafted pieces, antiques and vintage finds, gifts, home décor and memorial urns with matching keepsakes.
        Everything is hand-picked by us. See{" "}
        <Link href="/products" className="link">
          all products
        </Link>
        .
      </p>
    ),
  },
  {
    q: "How do I place an order?",
    a: (
      <p>
        Open any item on this site and choose the button to buy it. You&rsquo;ll go to{" "}
        <a href={shopLink("/")} className="link">
          our shop
        </a>{" "}
        to choose any options, add it to your cart and check out. You can also find us on{" "}
        <a href={site.etsyUrl} className="link" rel="noopener">
          Etsy
        </a>
        .
      </p>
    ),
  },
  {
    q: "How are orders packed?",
    a: <p>Every order is wrapped and boxed to travel safely, whatever its size, so it arrives in one piece.</p>,
  },
  {
    q: "Can I ask about an item before I buy?",
    a: (
      <p>
        Yes. Use the form on this page, or <em>Ask us</em> on any product page, and tell us which item you mean.
        We&rsquo;ll reply by email.
      </p>
    ),
  },
  {
    q: "What sizes do the memorial urns come in?",
    a: (
      <>
        <p>
          The large urn measures 6 × 10 inches and holds a full adult&rsquo;s ashes. Keepsake urns measure 1.5 × 3 inches
          and hold a small portion, so a family can share them.
        </p>
        <p>
          Most urn designs come as a single keepsake, a set of 2 or 4 keepsakes, the large urn alone, or the large urn
          with 2 or 4 matching keepsakes. There is also a{" "}
          <a href={shopLink("/category/pet-urns")} className="link">
            Pet Urns
          </a>{" "}
          category.
        </p>
      </>
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
          Questions about an item, shipping or an order? Send us a message and we&rsquo;ll reply by email.
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
              See all products
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
