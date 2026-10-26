import Image from "next/image";
import type { CategoryNode } from "@/lib/types";
import { shopCategoryUrl } from "@/lib/site";
import styles from "./CollectionCard.module.css";
import { ShopLink } from "@/components/ShopLink/ShopLink";

/** A category tile. Opens that category on the shop (shop.windycitywares.com/category/<slug>). */
export function CollectionCard({
  collection,
  total,
  image,
}: {
  collection: CategoryNode;
  total: number;
  image: string | null;
}) {
  return (
    <ShopLink href={shopCategoryUrl(collection.slug)} className={styles.card}>
      <span className={styles.media}>
        {image && (
          <Image src={image} alt="" fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" className={styles.img} />
        )}
      </span>
      <span className={styles.name}>{collection.name}</span>
      <span className={styles.meta}>
        {total} {total === 1 ? "item" : "items"}
      </span>
    </ShopLink>
  );
}
