# Main site — windycitywares.com

A single static landing page for `public_html` on the main domain. It shows every collection and links
each card to its page on the shop (`https://shop.windycitywares.com/category/<slug>`, or `/es/…` and
`/nl/…` for Spanish and Dutch visitors). Language follows the browser like the shop does, with an
EN / ES / NL switch.

Files: `index.html` (self-contained: styles, logo SVGs, script) and `brand/` (favicon).

## Publish

**Simplest:** cPanel → File Manager → `public_html`: rename the current `index.html` to `index.old.html`,
then upload `index.html` and the `brand/` folder from this repository.

**From the server (cPanel → Terminal).** GitHub deploy keys work for one repository only, so this repo
needs its own key, set up once:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/wcw_main_deploy -N "" && cat ~/.ssh/wcw_main_deploy.pub
# GitHub → wcw-main-site → Settings → Deploy keys → Add deploy key: paste it (read-only)
cat >> ~/.ssh/config <<'CFG'
Host github-wcw-main
  HostName github.com
  User git
  IdentityFile ~/.ssh/wcw_main_deploy
CFG
git clone git@github-wcw-main:windycitywares/wcw-main-site.git ~/repos/wcw-main-site
cp ~/public_html/index.html ~/public_html/index.old.html   # back up the old page, first time only
```

Then, each time you want to publish the latest version:

```bash
cd ~/repos/wcw-main-site && git pull
cp index.html ~/public_html/ && mkdir -p ~/public_html/brand && cp brand/* ~/public_html/brand/
```

## Updating collections

The collection list is the `COLLECTIONS` array near the bottom of `index.html` (slug, cover photo folder
on media.windycitywares.com, design count, and the name and description in English, Spanish and Dutch).
Add, remove or edit an entry there when the shop's categories change. The slug must match the category
slug in the shop admin.

When the store moves to the main domain (wcw-portal: docs/DEPLOYMENT.md → "Go live"), this page is replaced by the
store's own home page.
