import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/Price/Price";
import { STOCK_LABEL } from "@/lib/format";
import type { Product } from "@/lib/types";
import styles from "./ProductCard.module.css";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = product.images[0];
  const hasOptions = Object.values(product.attributes).some(Array.isArray);
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || product.title}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
            className={styles.img}
            priority={priority}
          />
        ) : (
          <span className={styles.noImage}>Photo coming soon</span>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link href={`/products/${product.slug}`} className={styles.link}>
            {product.title}
          </Link>
        </h3>
        <Price
          amount={product.base_price}
          compareAt={product.compare_at_price}
          currency={product.currency}
          from={hasOptions}
          className={styles.price}
        />
        <p className={product.stock_status === "out_of_stock" ? styles.soldOut : styles.stock}>
          {STOCK_LABEL[product.stock_status]}
        </p>
      </div>
    </article>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <ul className={styles.grid}>
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
