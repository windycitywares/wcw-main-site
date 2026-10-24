// Mirrors the shop API (shop-api.windycitywares.com) — only the fields this site uses.

export type StockStatus = "in_stock" | "out_of_stock" | "backorder" | "preorder";
export type AttributeValue = string | number | boolean | Array<string | number>;

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  depth: number;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}

export interface ProductImage {
  url: string;
  alt: string | null;
}

export interface Product {
  id: number;
  category_id: number | null;
  slug: string;
  title: string;
  description: string | null;
  base_price: number;
  compare_at_price: number | null;
  currency: string;
  stock_status: StockStatus;
  attributes: Record<string, AttributeValue>;
  images: ProductImage[];
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
}

export interface ProductDetail extends Product {
  variants: Product[];
  category: Category | null;
  breadcrumb: Category[];
}

export interface Facets {
  price_min: number | null;
  price_max: number | null;
}
