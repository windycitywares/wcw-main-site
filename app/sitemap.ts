import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/api";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = ["", "/products", "/about", "/contact"].map((p) => ({ url: `${site.url}${p}` }));
  const products = [];
  for (let page = 1; page <= 50; page++) {
    const res = await getProducts({ page: String(page), page_size: "100", sort: "updated" });
    products.push(...res.items);
    if (res.items.length < 100) break;
  }
  return [...pages, ...products.map((p) => ({ url: `${site.url}/products/${p.slug}` }))];
}
