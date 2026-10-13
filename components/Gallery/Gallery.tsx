"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";
import styles from "./Gallery.module.css";

/** Product photo carousel: large photo with previous/next buttons, thumbnails, arrow keys. */
export function Gallery({ images, title }: { images: ProductImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  if (!count) return <div className={styles.stage} />;
  const go = (i: number) => setIndex((i + count) % count);
  const current = images[index];

  return (
    <section
      className={styles.gallery}
      aria-roledescription="carousel"
      aria-label={`Photos of ${title}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div className={styles.stage}>
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt || `${title}, photo ${index + 1}`}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={styles.photo}
        />
        {count > 1 && (
          <>
            <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => go(index - 1)} aria-label="Previous photo">
              <span aria-hidden="true">‹</span>
            </button>
            <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => go(index + 1)} aria-label="Next photo">
              <span aria-hidden="true">›</span>
            </button>
            <p className={styles.counter} aria-live="polite">
              Photo {index + 1} of {count}
            </p>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className={styles.thumbs}>
          {images.map((img, i) => (
            <li key={img.url + i}>
              <button
                type="button"
                onClick={() => go(i)}
                className={styles.thumb}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              >
                <Image src={img.url} alt="" fill sizes="80px" className={styles.thumbImg} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
