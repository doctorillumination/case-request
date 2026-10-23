# Website security maintenance

Builds use the patched Node.js 24.22.1 LTS release selected by `.nvmrc`. Keep the Node pin current when security releases arrive.

Dependabot vulnerability alerts and security update pull requests are enabled. Dependency updates require review and the website checks before publication.

Run `npm ci` and `npm run build`. Validate the static deployment with `wrangler deploy --dry-run`. Only the generated `dist` pages are published.
