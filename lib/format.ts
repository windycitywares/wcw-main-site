import type { AttributeValue, Product, StockStatus } from "./types";

export function money(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export const STOCK_LABEL: Record<StockStatus, string> = {
  in_stock: "In stock",
  out_of_stock: "Sold out",
  backorder: "Made to order",
  preorder: "Pre-order",
};

/** "Size" etc. are option lists (a choice at checkout); single values are specifications. */
export function specifications(p: Pick<Product, "attributes">): [string, string][] {
  return Object.entries(p.attributes)
    .filter((e): e is [string, Exclude<AttributeValue, unknown[]>] => !Array.isArray(e[1]))
    .map(([k, v]) => [k, typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)]);
}

export function options(p: Pick<Product, "attributes">): [string, string[]][] {
  return Object.entries(p.attributes)
    .filter((e): e is [string, Array<string | number>] => Array.isArray(e[1]))
    .map(([k, v]) => [k, v.map(String)]);
}

/** Etsy descriptions are plain text: blank lines separate paragraphs. */
export function paragraphs(text: string | null | undefined): string[] {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function excerpt(text: string | null | undefined, max = 160): string {
  const flat = (text ?? "").replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, flat.lastIndexOf(" ", max)).replace(/[,.;:–—-]$/, "")}…`;
}
