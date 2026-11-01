# 360 AIX hardware request

A simple, responsive hardware purchasing request for Shawnigan. Plain static HTML and CSS, with no runtime dependencies, analytics, or sign-in.

## Content

Based on `360-AIX-hardware-purchasing-plan.xlsx`, revised 25 September 2026. Hardware only. The source workbook stays outside this repository.

- Four computers, four new Dell S2725QC monitors, and four keyboard and mouse combos.
- Separate Creative Pebble speakers removed because the Dell monitors include speakers.
- DGX Spark replaced on 1 November 2026 with a Microsoft Surface Laptop Ultra: NVIDIA RTX Spark N1X, 20-core CPU, 6,144-core GPU, 128GB unified memory, 1TB SSD, Nightfall, English keyboard, Windows 11 Pro. The Microsoft Canada configurator lists this configuration at $8,549.99 before tax, without trade-in credit or optional protection.
- All other workbook configurations, planning prices, supplier links, and purchasing notes retained.
- Totals recalculated from line items, with 5% GST and 7% PST. The $600 shipping and incidental reserve was removed as requested.
- The hardware budget is $30,000. With the Surface Laptop Ultra, four keyboard and mouse combos, and no shipping reserve, the request is $27,716.47, leaving $2,283.53 in the budget.
- The obsolete used-DGX alternative is removed. The optional additional Mac mini desk remains excluded.

The Surface Laptop Ultra price was checked in the [Microsoft Canada configurator](https://www.microsoft.com/en-ca/store/configure/surface-laptop-ultra/8wg5vqp0x4b8) on 1 November 2026. Other prices remain dated workbook estimates, not refreshed quotations. Dell's built-in speakers were verified against its product page on 27 September 2026. Apple configurations and public education prices need an institutional quote.

## Editing

Edit `budget.json` for prices and quantities. Edit `build.mjs` for copy and page structure, and `styles.css` for presentation.

```sh
npm run build
python3 -m http.server 4173
```

The build uses integer cents and rounds GST and PST separately. Commit the generated `index.html` alongside source changes. The entire request works without JavaScript, including navigation and supplier links.

## Hosting

Published at https://doctorillumination.github.io/case-request/ using GitHub Pages from `main` at `/`. The `.nojekyll` file prevents Jekyll processing.

### Cloudflare Workers

The build also creates `dist/` containing only `index.html`, `styles.css`, and `favicon.svg`. `wrangler.jsonc` points Cloudflare at this directory and automatically runs the build before deployment.

Use these Workers Builds settings:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: repository root

Remove any `--assets .` override from the deploy command. A root `.assetsignore` also protects existing dashboard commands that still use that override by allowing only the three website files. Dependencies, build scripts, and repository metadata are never website assets.

For Cloudflare Pages instead of Workers, use `npm run build` with `dist` as the build output directory.
