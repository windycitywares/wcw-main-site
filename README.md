# WindyCityWares main site — windycitywares.com

The brand's landing page and information hub. Product data comes live from the shop
(shop.windycitywares.com) through its Python API; carts and checkout stay on the shop.

| | |
|---|---|
| Framework | Next.js (App Router, server rendering), React 19, TypeScript |
| Styling | Tailwind CSS v4 (tokens, `app/globals.css`) + CSS Modules per component |
| Data | `lib/api.ts` → shop API (FastAPI, `api.windycitywares.com`, repo wcw-portal) |
| Hosting | HostItBro cPanel "Setup Node.js App" (Node 20) on windycitywares.com |

## Pages

| Path | What's on it |
|---|---|
| `/` | Tagline hero, collections (each opens on the shop), featured wares, about, newsletter |
| `/about` | Mission, story, materials |
| `/products` | Catalog with filters (collection, price, in stock) and sorting |
| `/products/[slug]` | Photo carousel, sizes and prices, description, specifications, reviews link, related designs; "Choose a size and buy" opens the design on the shop |
| `/contact` | Contact form (→ API → email), location, FAQ |

## How data flows

Browser → **Next.js server** (this app) → **Python API** (`api.windycitywares.com`, FastAPI) →
shop database. The API returns published products only; this app caches responses for a few minutes
(`revalidate`). Browsers never call the API directly: the contact form and newsletter post to this
app's `/api/contact` and `/api/newsletter`, which forward them to the API server-side.

## Develop

```bash
npm install
cp .env.example .env.local   # optional: defaults point at the live API
npm run dev                  # http://localhost:3000
npm run typecheck
```

## Publishing (automatic)

**Merge into `main` → live on windycitywares.com within ~10–15 minutes.**

1. GitHub Actions (`.github/workflows/site.yml`) builds the site, type-checks it, smoke-tests every
   page against the live API, and publishes the ready-to-run bundle to the `site-build` branch.
   Pull requests get the same checks plus screenshots on the `previews` branch.
2. On the server, the 10-minute deploy job (wcw-portal `deploy/auto-deploy.sh` →
   `deploy/update-main-site.sh`) installs a new `site-build` and restarts the Node.js app.

Server details, access setup (needed once this repo is private) and rollback: wcw-portal
`docs/DEPLOYMENT.md` → "Main site".
