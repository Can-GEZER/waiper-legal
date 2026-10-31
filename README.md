# waiper-legal

Static privacy policy and account/data deletion pages for the [Waiper](https://github.com/Can-GEZER/Waiper) Android app, published for Google Play Store requirements.

Plain HTML/CSS/JS, no build step. Deployed via Netlify directly from this repo.

- `index.html` + `home.css` - public landing page for waiper.app (hero, features, screenshots, privacy, Free vs Premium, FAQ; TR+EN). The store button says "coming soon" until the app is public on Google Play
- `assets/` - landing page images (screenshots from the Play listing as WebP, Open Graph image, icons) and the self-hosted Space Grotesk font (OFL, `assets/fonts/OFL.txt`); no third-party requests, no cookies
- `favicon.png` - site icon
- `privacy.html` - Privacy Policy (Turkish + English toggle)
- `account-deletion.html` - Account & Data Deletion instructions (Turkish + English toggle)
- `terms.html` - Terms of Service incl. Premium subscription terms (Turkish + English toggle)
- `about.html` - About the app, how it works and features (Turkish + English toggle), opened from the app's Profil > Hakkında
- `style.css`, `lang.js` - shared styling and the TR/EN language toggle
- `r.html` - referral invite page, served for `/r/{code}` via `_redirects`; opens the app if installed, otherwise Google Play with `&referrer=ref%3D{code}` (read by the app's Install Referrer)
- `.well-known/assetlinks.json` - Android App Links verification for `waiper.app` (Play App Signing + upload key SHA-256)
- `_redirects` / `_headers` - Netlify rewrites (`/r/*`, `/privacy`, `/terms`, `/about`) and the JSON content type for assetlinks

To update: edit the HTML, commit, push to `main` - Netlify redeploys automatically.
