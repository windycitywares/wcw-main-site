import { getProducts, type ProductQuery } from "@/lib/api";

/**
 * Next page of products for the scrolling grid on /products. The browser asks this site, and this site asks
 * the shop API server-side (browsers never call the API directly). Only the listing filters are passed on.
 */
const ALLOWED = ["category", "min_price", "max_price", "in_stock", "sort", "page", "page_size"] as const;

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const query: ProductQuery = {};
  for (const key of ALLOWED) {
    const value = params.get(key);
    if (value) query[key] = value.slice(0, 100);
  }
  const size = Math.min(48, Math.max(1, Number.parseInt(query.page_size ?? "24", 10) || 24));
  query.page_size = String(size);
  const page = await getProducts(query);
  return Response.json(page, { headers: { "Cache-Control": "public, max-age=60" } });
}
