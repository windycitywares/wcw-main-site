/**
 * Server-side access to the shop's Python API (FastAPI at api.windycitywares.com), which reads the
 * shop.windycitywares.com catalog database and returns only published products.
 * Only Server Components and route handlers call this — browsers never talk to the API directly.
 * Reads are cached and refreshed every few minutes; a failed request degrades to an empty result
 * so pages still render.
 */
import "server-only";
import type { CategoryNode, Facets, Page, Product, ProductDetail } from "./types";

export const API_URL = (process.env.API_URL || "https://api.windycitywares.com/api/v1").replace(/\/$/, "");
const REVALIDATE_SECONDS = 300;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function get<T>(path: string, revalidate = REVALIDATE_SECONDS): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new ApiError(res.status, `GET ${path} failed with ${res.status}`);
  return (await res.json()) as T;
}

const emptyPage = (page_size = 24): Page<Product> => ({ items: [], total: 0, page: 1, page_size });

export async function getCategoryTree(): Promise<CategoryNode[]> {
  try {
    return await get<CategoryNode[]>("/categories/tree");
  } catch {
    return [];
  }
}

/** The collections customers browse: the leaf categories (e.g. the themes under "Cremation Urns"). */
export async function getCollections(): Promise<CategoryNode[]> {
  const out: CategoryNode[] = [];
  const walk = (nodes: CategoryNode[]) =>
    nodes.forEach((n) => (n.children.length ? walk(n.children) : out.push(n)));
  walk(await getCategoryTree());
  return out;
}

export type ProductQuery = {
  category?: string;
  min_price?: string;
  max_price?: string;
  in_stock?: string;
  sort?: string;
  page?: string;
  page_size?: string;
};

export async function getProducts(params: ProductQuery = {}): Promise<Page<Product>> {
  const qs = new URLSearchParams(
    Object.entries(params).filter((e): e is [string, string] => typeof e[1] === "string" && e[1] !== ""),
  ).toString();
  try {
    return await get<Page<Product>>(`/products${qs ? `?${qs}` : ""}`, 120);
  } catch {
    return emptyPage(Number(params.page_size) || 24);
  }
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    return await get<ProductDetail>(`/products/${encodeURIComponent(slug)}`, 120);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function getFacets(): Promise<Facets> {
  try {
    return await get<Facets>("/products/facets");
  } catch {
    return { price_min: null, price_max: null };
  }
}

/** Cover photo and design count for each collection (home page). */
export async function getCollectionPreviews(): Promise<
  { collection: CategoryNode; total: number; image: string | null; alt: string }[]
> {
  const collections = await getCollections();
  return Promise.all(
    collections.map(async (collection) => {
      const res = await getProducts({ category: collection.slug, page_size: "1", sort: "newest" });
      const img = res.items[0]?.images[0];
      return { collection, total: res.total, image: collection.image_url || img?.url || null, alt: img?.alt ?? "" };
    }),
  );
}

/** Forward a form to the API from the server (contact form, newsletter). */
export async function postToApi(path: string, body: unknown, visitorIp?: string | null) {
  const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
  if (visitorIp) headers["X-Forwarded-For"] = visitorIp; // the API rate-limits per visitor
  const res = await fetch(`${API_URL}${path}`, { method: "POST", headers, body: JSON.stringify(body), cache: "no-store" });
  const data = (await res.json().catch(() => ({}))) as { detail?: unknown };
  return { ok: res.ok, status: res.status, detail: data.detail };
}
