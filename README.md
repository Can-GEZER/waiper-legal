# waiper-legal

Static privacy policy and account/data deletion pages for the [Waiper](https://github.com/Can-GEZER/Waiper) Android app, published for Google Play Store requirements.

Plain HTML/CSS/JS, no build step. Deployed via Netlify directly from this repo.

- `index.html` - landing page, links to the two documents below
- `privacy.html` - Privacy Policy (Turkish + English toggle)
- `account-deletion.html` - Account & Data Deletion instructions (Turkish + English toggle)
- `style.css`, `lang.js` - shared styling and the TR/EN language toggle
- `r.html` - referral invite page, served for `/r/{code}` via `_redirects`; opens the app if installed, otherwise Google Play with `&referrer=ref%3D{code}` (read by the app's Install Referrer)
- `.well-known/assetlinks.json` - Android App Links verification for `waiper.com.tr`; the `sha256_cert_fingerprints` placeholder must be replaced with the Play App Signing SHA-256 (Play Console > Setup > App signing)
- `_redirects` / `_headers` - Netlify rewrites (`/r/*`, `/privacy`, `/terms`) and the JSON content type for assetlinks

To update: edit the HTML, commit, push to `main` - Netlify redeploys automatically.
