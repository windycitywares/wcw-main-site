/**
 * Server-side access to the shop's Python API (FastAPI at shop-api.windycitywares.com), which reads the
 * shop.windycitywares.com catalog database and returns only published products.
 * Only Server Components and route handlers call this — browsers never talk to the API directly.
 * Reads are cached and refreshed every few minutes; a failed request degrades to an empty result
 * so pages still render.
 */
import "server-only";
import type { CategoryNode, Facets, Page, Product, ProductDetail } from "./types";

export const API_URL = (process.env.API_URL || "https://shop-api.windycitywares.com/api/v1").replace(/\/$/, "");
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

/** Every leaf category (e.g. the themes under "Cremation Urns"): the filter list on /products. */
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

export type CategoryPreview = { collection: CategoryNode; total: number; image: string | null };

async function preview(collection: CategoryNode): Promise<CategoryPreview> {
  const res = await getProducts({ category: collection.slug, page_size: "1", sort: "newest" });
  return { collection, total: res.total, image: collection.image_url || res.items[0]?.images[0]?.url || null };
}

/**
 * Home page "Shop by category": one group per top-level category (Handcrafts, Antiques, Gifts,
 * Cremation Urns …) with a tile for each of its leaf categories — or one tile for the category itself
 * when it has no sub-categories. Empty categories are left out, so new ones appear once they have items.
 */
export async function getCategoryGroups(): Promise<{ parent: CategoryNode; tiles: CategoryPreview[] }[]> {
  const leavesOf = (n: CategoryNode): CategoryNode[] => (n.children.length ? n.children.flatMap(leavesOf) : [n]);
  const tree = await getCategoryTree();
  const groups = await Promise.all(
    tree.map(async (parent) => ({
      parent,
      tiles: (await Promise.all(leavesOf(parent).map(preview))).filter((t) => t.total > 0),
    })),
  );
  return groups.filter((g) => g.tiles.length > 0);
}

/** Forward a form to the API from the server (contact form, newsletter). */
export async function postToApi(path: string, body: unknown, visitorIp?: string | null) {
  const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
  if (visitorIp) headers["X-Forwarded-For"] = visitorIp; // the API rate-limits per visitor
  const res = await fetch(`${API_URL}${path}`, { method: "POST", headers, body: JSON.stringify(body), cache: "no-store" });
  const data = (await res.json().catch(() => ({}))) as { detail?: unknown };
  return { ok: res.ok, status: res.status, detail: data.detail };
}
