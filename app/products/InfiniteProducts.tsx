"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProductGrid } from "@/components/ProductCard/ProductCard";
import type { Page, Product } from "@/lib/types";
import styles from "./InfiniteProducts.module.css";

/** Card-shaped placeholders (photo, title and price lines) with a light sweep, while more products load. */
function SkeletonCards({ count }: { count: number }) {
  return (
    <ul aria-hidden="true" className={styles.skeletons}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <div className={`${styles.shimmer} ${styles.photo}`} />
          <div className={`${styles.shimmer} ${styles.line}`} />
          <div className={`${styles.shimmer} ${styles.lineShort}`} />
        </li>
      ))}
    </ul>
  );
}

/**
 * The product grid that keeps filling as the visitor scrolls, like the shop's. The first page is rendered by
 * the server (instant, and what search engines see); further pages come from /api/products just before the
 * end is reached. A "Load more" button is always there too, for keyboards and slow connections.
 */
export function InfiniteProducts({
  initial,
  total,
  startPage,
  pageSize,
  query,
  priorityCount = 0,
}: {
  initial: Product[];
  total: number;
  startPage: number;
  pageSize: number;
  /** The listing query without `page` (filters, sort, page_size). */
  query: string;
  priorityCount?: number;
}) {
  const [items, setItems] = useState<Product[]>(initial);
  const [page, setPage] = useState(startPage);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const busy = useRef(false);
  const sentinel = useRef<HTMLDivElement | null>(null);
  const done = page * pageSize >= total;

  const more = useCallback(async () => {
    if (busy.current || done) return;
    busy.current = true;
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch(`/api/products?${query}${query ? "&" : ""}page=${page + 1}`);
      if (!res.ok) throw new Error(String(res.status));
      const body = (await res.json()) as Page<Product>;
      setItems((old) => {
        const seen = new Set(old.map((p) => p.id));
        return [...old, ...body.items.filter((p) => !seen.has(p.id))];
      });
      setPage((p) => (body.items.length === 0 ? Math.ceil(total / pageSize) : p + 1)); // nothing came back: stop asking
    } catch {
      setFailed(true);
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }, [done, page, pageSize, query, total]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || done || failed || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && void more(), {
      rootMargin: "700px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [more, done, failed]);

  return (
    <>
      <div aria-busy={loading}>
        <ProductGrid products={items} priorityCount={priorityCount} />
      </div>
      {loading && <SkeletonCards count={Math.min(6, Math.max(3, Math.min(pageSize, total - items.length)))} />}
      <div ref={sentinel} className={styles.status} aria-live="polite">
        <p>{done ? `All ${total} items shown` : `Showing ${items.length} of ${total} items`}</p>
        {!done && (
          <>
            <div className={styles.bar} aria-hidden="true">
              <div className={styles.barFill} style={{ width: `${Math.min(100, (items.length / total) * 100)}%` }} />
            </div>
            {failed && <p role="alert">More items couldn&rsquo;t be loaded. Check your connection and try again.</p>}
            <button type="button" onClick={() => void more()} disabled={loading} className="btn btn-ghost">
              {loading ? (
                <>
                  <span aria-hidden="true" className={styles.spinner} />
                  Loading more…
                </>
              ) : (
                "Load more"
              )}
            </button>
          </>
        )}
      </div>
    </>
  );
}
