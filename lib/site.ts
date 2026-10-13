/** Brand + site settings. Change here, not in components. */
const trim = (u: string) => u.replace(/\/$/, "");

export const site = {
  name: "WindyCityWares",
  legalName: "WindyCityWares LLC",
  tagline: ["Crafted with care.", "Designed with purpose.", "Treasured for a lifetime."],
  description:
    "Cremation urns and matching keepsakes with artwork chosen to honor a loved one. Crafted with care. Designed with purpose. Treasured for a lifetime.",
  location: "Schaumburg, Illinois",
  url: trim(process.env.SITE_URL || "https://windycitywares.com"),
  shopUrl: trim(process.env.SHOP_URL || "https://shop.windycitywares.com"),
  etsyUrl: "https://www.etsy.com/shop/WindyCityWaresUS",
  etsyReviewsUrl: "https://www.etsy.com/shop/WindyCityWaresUS#reviews",
} as const;

/** Link into the shop subdomain (cart, checkout and accounts live there). */
export function shopLink(path = "/"): string {
  return `${site.shopUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const shopProductUrl = (slug: string) => shopLink(`/product/${encodeURIComponent(slug)}`);
export const shopCategoryUrl = (slug: string) => shopLink(`/category/${encodeURIComponent(slug)}`);
