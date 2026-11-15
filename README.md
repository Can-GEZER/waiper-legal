# waiper-legal

Static privacy policy and account/data deletion pages for the [Waiper](https://github.com/Can-GEZER/Waiper) Android app, published for Google Play Store requirements.

Plain HTML/CSS/JS, no build step. Deployed via Netlify directly from this repo.

- `index.html` + `home.css` - public landing page for waiper.app (hero, features, screenshots, privacy, Free vs Premium, FAQ; TR+EN). The store buttons link to the Google Play listing with `referrer=utm_source=waiper.app&utm_medium=website` (the app records it as a campaign install)
- `assets/` - landing page images (screenshots from the Play listing as WebP, Open Graph image, icons) and the self-hosted Space Grotesk font (OFL, `assets/fonts/OFL.txt`); no third-party requests, no cookies
- `favicon.png` - site icon
- `privacy.html` - Privacy Policy (Turkish + English toggle)
- `account-deletion.html` - Account & Data Deletion instructions (Turkish + English toggle)
- `terms.html` - Terms of Service incl. Premium subscription terms (Turkish + English toggle)
- `about.html` - About the app, how it works and features (Turkish + English toggle), opened from the app's Profil > Hakkında
- `blog/` + `blog.css` - blog, Turkish only (no language toggle): `blog/index.html` is the list, each post is `blog/{slug}/index.html` (URL `/blog/{slug}/`). Pages use `body class="home blog"` and load `style.css`, `home.css`, `blog.css`. New post checklist: copy an existing post folder, change title/description/canonical/Open Graph/JSON-LD (`BlogPosting` + `BreadcrumbList`), run `scripts/og.py` for its share image, then add it to `blog/index.html` (card + `blogPost` in JSON-LD), the other posts' "Diğer yazılar" list, `sitemap.xml` and `llms.txt`; the homepage "Blogdan" section shows three posts. Play links in posts use `utm_medium=blog`
- `araclar/` + `tools.css` + `tools.js` - calculators, Turkish only: `/araclar/harcanabilir-tutar-hesaplama/` and `/araclar/taksit-yuku-hesaplama/`. Everything runs in the browser, nothing is sent or stored. Play links use `utm_medium=tool&utm_campaign={slug}`
- Blog post Play links carry `utm_campaign={slug}`; the admin panel's acquisition card lists installs as `waiper.app / {slug}`
- `assets/img/og/{slug}.jpg` - one share image per post and tool. For a new post: `python -m http.server 8765` in the repo root, then `python scripts/og.py` (needs Edge and Pillow; renders `scripts/og-template.html`, writes the image and points the page's `og:image` and JSON-LD at it; pages that already have one are skipped)
- `style.css`, `lang.js` - shared styling and the TR/EN language toggle
- `r.html` - referral invite page, served for `/r/{code}` via `_redirects`; opens the app if installed, otherwise Google Play with `&referrer=ref%3D{code}` (read by the app's Install Referrer)
- `.well-known/assetlinks.json` - Android App Links verification for `waiper.app` (Play App Signing + upload key SHA-256)
- `robots.txt`, `sitemap.xml`, `llms.txt` - crawler rules (invite links `/r/` excluded), sitemap of the public pages, and a plain-text summary for AI search engines; update `sitemap.xml` `lastmod` and `llms.txt` when a page or feature changes
- `404.html` - not-found page (Netlify serves it automatically)
- `_redirects` / `_headers` - Netlify rewrites (`/r/*`, `/privacy`, `/terms`, `/about`) and the JSON content type for assetlinks

To update: edit the HTML, commit, push to `main` - Netlify redeploys automatically.
