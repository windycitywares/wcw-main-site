import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery/Gallery";
import { Price } from "@/components/Price/Price";
import { ProductGrid } from "@/components/ProductCard/ProductCard";
import { getProduct, getProducts } from "@/lib/api";
import { STOCK_LABEL, excerpt, money, options, paragraphs, specifications } from "@/lib/format";
import { site, shopCategoryUrl, shopProductUrl } from "@/lib/site";
import styles from "./product.module.css";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: "Design not found" };
  const description = product.seo_description || excerpt(product.description, 155);
  return {
    title: product.title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title: product.title, description, images: product.images.slice(0, 1).map((i) => ({ url: i.url })) },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const category = product.category;
  const related = category
    ? (await getProducts({ category: category.slug, sort: "newest", page_size: "5" })).items
        .filter((p) => p.id !== product.id)
        .slice(0, 4)
    : [];
  const variants = [...product.variants].sort((a, b) => a.base_price - b.base_price);
  const prices = variants.length ? variants.map((v) => v.base_price) : [product.base_price];
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const lowVariant = variants.find((v) => v.base_price === low);
  const specs = specifications(product);
  const choices = options(product);
  const buyUrl = shopProductUrl(product.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((i) => i.url),
    description: excerpt(product.description, 300),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.currency,
      lowPrice: low,
      highPrice: high,
      offerCount: Math.max(1, variants.length),
      availability:
        product.stock_status === "out_of_stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: buyUrl,
    },
  };

  return (
    <div className={`wrap ${styles.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Breadcrumb" className={styles.crumbs}>
        <ol>
          <li>
            <Link href="/products">Products</Link>
          </li>
          {category && (
            <li>
              <Link href={`/products?category=${category.slug}`}>{category.name}</Link>
            </li>
          )}
          <li aria-current="page">{product.title}</li>
        </ol>
      </nav>

      <div className={styles.top}>
        <Gallery images={product.images} title={product.title} />

        <div className={styles.panel}>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.price}>
            <Price
              amount={low}
              compareAt={lowVariant?.compare_at_price ?? product.compare_at_price}
              currency={product.currency}
              from={high > low}
            />
          </p>
          <p className={product.stock_status === "out_of_stock" ? styles.soldOut : styles.stock}>
            {STOCK_LABEL[product.stock_status]}
          </p>

          {variants.length > 0 ? (
            <div className={styles.sizes}>
              <h2 className={styles.panelHeading}>Sizes and prices</h2>
              <ul>
                {variants.map((v) => {
                  const label = Object.values(v.attributes).map(String).join(", ") || v.title;
                  return (
                    <li key={v.id}>
                      <span>{label}</span>
                      <span className={styles.sizePrice}>{money(v.base_price, v.currency)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            choices.map(([name, values]) => (
              <div key={name} className={styles.sizes}>
                <h2 className={styles.panelHeading}>{name}</h2>
                <ul>
                  {values.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </div>
            ))
          )}

          <div className={styles.buy}>
            <a href={buyUrl} className="btn btn-gold">
              Choose a size and buy
            </a>
          </div>
          <p className={styles.note}>
            Opens this design in our shop, where you pick a size, add it to your cart and check out.
          </p>
          <p className={styles.note}>
            Questions about this design?{" "}
            <Link href={`/contact?subject=${encodeURIComponent(product.title)}`} className="link">
              Ask us
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.details}>
        <section aria-labelledby="desc-title" className={styles.description}>
          <h2 id="desc-title" className="h2">
            About this design
          </h2>
          <div className={styles.descBody}>
            {paragraphs(product.description).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <div className={styles.side}>
          {specs.length > 0 && (
            <section aria-labelledby="specs-title">
              <h2 id="specs-title" className={styles.sideHeading}>
                Specifications
              </h2>
              <dl className={styles.specs}>
                {specs.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section aria-labelledby="reviews-title" className={styles.reviews}>
            <h2 id="reviews-title" className={styles.sideHeading}>
              Reviews
            </h2>
            <p>Our customer reviews are collected on Etsy, where we first opened our shop.</p>
            <a href={site.etsyReviewsUrl} rel="noopener" className="link">
              Read reviews on Etsy
            </a>
          </section>
        </div>
      </div>

      {related.length > 0 && category && (
        <section aria-labelledby="related-title" className={styles.related}>
          <div className={styles.relatedHead}>
            <h2 id="related-title" className="h2">
              More from {category.name}
            </h2>
            <a href={shopCategoryUrl(category.slug)} className="link">
              See the whole collection
            </a>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
