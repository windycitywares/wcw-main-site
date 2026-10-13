# Main site — windycitywares.com

A single static landing page for `public_html` on the main domain. It shows every collection and links
each card to its page on the shop (`https://shop.windycitywares.com/category/<slug>`, or `/es/…` and
`/nl/…` for Spanish and Dutch visitors). Language follows the browser like the shop does, with an
EN / ES / NL switch.

Files: `index.html` (self-contained: styles, logo SVGs, script) and `brand/` (favicon).

## Publishing (automatic)

**Merge into `main` → live on windycitywares.com within ~10 minutes.** The server's deploy job (the same
one that publishes the shop, `wcw-portal/deploy/auto-deploy.sh`) checks this repo every 10 minutes and
copies every file except this README and dot-files into `public_html`. It never deletes anything there,
and the homepage from before the first publish is kept as `index.old.html`.

One-time setup: the server needs read access to this repo — make it public, or give it its own deploy
key. Steps in wcw-portal `docs/DEPLOYMENT.md` → "Main site". Log: `~/logs/wcw-deploy.log`.

## Updating collections

The collection list is the `COLLECTIONS` array near the bottom of `index.html` (slug, cover photo folder
on media.windycitywares.com, design count, and the name and description in English, Spanish and Dutch).
Add, remove or edit an entry there when the shop's categories change. The slug must match the category
slug in the shop admin.

When the store moves to the main domain (wcw-portal: docs/DEPLOYMENT.md → "Go live"), this page is replaced by the
store's own home page.
