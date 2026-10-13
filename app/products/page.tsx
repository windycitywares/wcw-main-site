import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/ProductCard/ProductCard";
import { getCollections, getFacets, getProducts, type ProductQuery } from "@/lib/api";
import { shopLink } from "@/lib/site";
import { FiltersDisclosure } from "./FiltersDisclosure";
import styles from "./products.module.css";

export const metadata: Metadata = {
  title: "Products",
  description: "Every WindyCityWares cremation urn and keepsake, with filters by collection and price.",
  alternates: { canonical: "/products" },
};

const PAGE_SIZE = 24;
const SORTS = [
  { value: "newest", label: "New arrivals" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "title", label: "Name: A to Z" },
];

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const filters = {
    category: one(sp.category),
    min_price: one(sp.min_price).replace(/[^\d.]/g, ""),
    max_price: one(sp.max_price).replace(/[^\d.]/g, ""),
    in_stock: one(sp.in_stock) === "true" ? "true" : "",
    sort: SORTS.some((s) => s.value === one(sp.sort)) ? one(sp.sort) : "newest",
  };
  const page = Math.max(1, Number.parseInt(one(sp.page), 10) || 1);

  const query: ProductQuery = { ...filters, page: String(page), page_size: String(PAGE_SIZE) };
  const [collections, facets, result] = await Promise.all([getCollections(), getFacets(), getProducts(query)]);
  const pages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
  const active = collections.find((c) => c.slug === filters.category);
  const filtered = Boolean(filters.category || filters.min_price || filters.max_price || filters.in_stock);

  const pageHref = (n: number) => {
    const qs = new URLSearchParams(Object.entries({ ...filters, page: n > 1 ? String(n) : "" }).filter(([, v]) => v && v !== "newest"));
    const s = qs.toString();
    return `/products${s ? `?${s}` : ""}`;
  };

  return (
    <div className={`wrap ${styles.page}`}>
      <header className={styles.head}>
        <h1 className="display" style={{ fontSize: "clamp(2.6rem, 6vw, 4rem)" }}>
          {active ? active.name : "All products"}
        </h1>
        <p className="lead">
          {active?.description ||
            "Cremation urns and keepsakes in every design we make. Choose a design to see its photos, sizes and prices."}
        </p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Filters">
          <FiltersDisclosure
            summary={filtered ? "Filters (on)" : "Filter and sort"}
            className={styles.disclosure}
            summaryClassName={styles.summary}
          >
          <form method="get" action="/products" className={styles.filters}>
            <fieldset className={styles.group}>
              <legend className={styles.legend}>Collection</legend>
              <label className={styles.choice}>
                <input type="radio" name="category" value="" defaultChecked={!filters.category} />
                All collections
              </label>
              {collections.map((c) => (
                <label key={c.id} className={styles.choice}>
                  <input type="radio" name="category" value={c.slug} defaultChecked={filters.category === c.slug} />
                  {c.name}
                </label>
              ))}
            </fieldset>

            <fieldset className={styles.group}>
              <legend className={styles.legend}>Price (USD)</legend>
              <div className={styles.priceRow}>
                <label>
                  <span className={styles.small}>Minimum</span>
                  <input
                    name="min_price"
                    inputMode="decimal"
                    placeholder={facets.price_min != null ? String(Math.floor(facets.price_min)) : "0"}
                    defaultValue={filters.min_price}
                    className="field"
                  />
                </label>
                <label>
                  <span className={styles.small}>Maximum</span>
                  <input
                    name="max_price"
                    inputMode="decimal"
                    placeholder={facets.price_max != null ? String(Math.ceil(facets.price_max)) : ""}
                    defaultValue={filters.max_price}
                    className="field"
                  />
                </label>
              </div>
              <label className={styles.choice}>
                <input type="checkbox" name="in_stock" value="true" defaultChecked={filters.in_stock === "true"} />
                In stock only
              </label>
            </fieldset>

            <div className={styles.group}>
              <label htmlFor="sort" className={styles.legend}>
                Sort by
              </label>
              <select id="sort" name="sort" defaultValue={filters.sort} className="field">
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.actions}>
              <button type="submit" className="btn">
                Show results
              </button>
              {(filtered || filters.sort !== "newest") && (
                <Link href="/products" className="link">
                  Clear filters
                </Link>
              )}
            </div>
          </form>
          </FiltersDisclosure>
        </aside>

        <section aria-labelledby="results-title">
          <h2 id="results-title" className={styles.count} aria-live="polite">
            {result.total} {result.total === 1 ? "design" : "designs"}
            {pages > 1 && ` · page ${page} of ${pages}`}
          </h2>

          {result.items.length ? (
            <ProductGrid products={result.items} priorityCount={4} />
          ) : (
            <div className={styles.empty}>
              <p>No designs match these filters.</p>
              <p>
                <Link href="/products" className="link">
                  Clear the filters
                </Link>{" "}
                or browse <a href={shopLink("/shop")} className="link">the whole shop</a>.
              </p>
            </div>
          )}

          {pages > 1 && (
            <nav aria-label="Pages" className={styles.pager}>
              {page > 1 ? (
                <Link href={pageHref(page - 1)} className="btn btn-ghost" rel="prev">
                  Previous page
                </Link>
              ) : (
                <span />
              )}
              {page < pages && (
                <Link href={pageHref(page + 1)} className="btn btn-ghost" rel="next">
                  Next page
                </Link>
              )}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
