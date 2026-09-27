# 360 AIX hardware request

A simple, responsive hardware purchasing request for Shawnigan. Plain static HTML and CSS, with no runtime dependencies, analytics, or sign-in.

## Content

Based on `360-AIX-hardware-purchasing-plan.xlsx`, revised 25 September 2026. Hardware only. The source workbook stays outside this repository.

- Four computers, four new Dell S2725QC monitors, and four keyboard and mouse combos.
- Separate Creative Pebble speakers removed because the Dell monitors include speakers.
- Exact workbook configurations, planning prices, supplier links, and purchasing notes retained.
- Totals recalculated from line items, with 5% GST, 7% PST, and the $600 reserve.
- The hardware budget is $30,000, as requested on 27 September 2026, replacing the workbook's $29,000 figure. With the requested fourth keyboard and mouse combo, the request is $30,499.36, leaving a $499.36 shortfall.
- Used-Spark and additional-desk alternatives are separate from the main request. Reusing displays is not applied to the four required monitors.

Prices are dated workbook estimates, not refreshed quotations. Dell's built-in speakers were verified against its product page on 27 September 2026. Apple configurations and public education prices need an institutional quote.

## Editing

Edit `budget.json` for prices and quantities. Edit `build.mjs` for copy and page structure, and `styles.css` for presentation.

```sh
npm run build
python3 -m http.server 4173
```

The build uses integer cents and rounds GST and PST separately. Commit the generated `index.html` alongside source changes. The entire request works without JavaScript, including navigation and supplier links.

## Hosting

Published at https://doctorillumination.github.io/case-request/ using GitHub Pages from `main` at `/`. The `.nojekyll` file prevents Jekyll processing.
