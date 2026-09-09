# WhenWillIDie — Life expectancy calculator for entertainment

Explore a playful calendar date from adult age and a published population life table. WhenWillIDie is entertainment, never a prediction of your actual death.

**Site:** https://whenwillidieclub.com/
**Repository:** https://github.com/whenwillidie-club/app

## Production integration

This client is built to request real patient-authorized demographics using [FinchNode production](https://finchnode.com/openapi.yaml) through the [shared connection service](https://github.com/visitquill/finchapps-connect). It never calls the public demo API or falls back to fixture data.

Production activation is pending operator legal/privacy details and a server-side live key plus webhook signing secret. Until that is complete, connecting fails closed with an explicit setup message. Deployment of this code alone is not evidence of a completed real EHR connection.


## Website and import flow

The public home route presents a complete, individually designed website with navigation, a product explanation, and a primary import button. Import and private records live at `/#/import`; opening the homepage never starts a record request. The import button opens category selection before any external connection. Back to home clears records from the rendered page. Returning from Hosted Connect opens the import route. Existing sessions can be resumed via the homepage button.

## Use

Choose record categories, click **Connect my EHR**, and complete FinchNode Hosted Connect and your own provider sign-in. Consent identifies **FinchApps Personal Health Tools**, the shared application behind these eleven sites. Return here to view the authorized record. Each visitor session is isolated to this site's origin and expires after 30 minutes; free service restarts can end it earlier. Reconnect if necessary.

After importing demographics, acknowledge the entertainment limitations and choose Reveal to see a population-based date estimate. Only a valid adult birth date enters the calculation. Missing data and partial sync warnings come from the production response; no patient identity, provider or connection is invented.

End this session removes local access. Revoke sharing or request deletion through [FinchNode data controls](https://finchnode.com/me). Sharing consent is for the common application, so revocation can affect all eleven tools. Exported or printed copies remain on the user's device.

## Local development

Node 22.13+:

```sh
npm ci
npm run dev
npm test
npm run build
```

The build outputs `dist/`. This is a React/Vite static frontend with responsive layouts, keyboard controls, visible focus styles and reduced-motion support. Development runs do not bypass production origin restrictions. To exercise authentication locally, run the backend's injected mock tests; do not relax its production allowlist or embed keys in the client.

## Render

Create a free Static Site from this repository, build with `npm ci && npm run build`, and publish `dist`. The supplied `render.yaml` documents the service and security headers. Public-repository deployments require a manual deploy after pushing a commit. The separate Node connection service runs on Render's free plan and may sleep.

CSP `connect-src` must allow only `https://finchapps-connect.onrender.com`. Deploy the backend and configure its secret environment before enabling live connections. **Never add API keys to Vite variables, source, browser storage, logs, README examples or Git.** No frontend environment secret is required.

## Privacy and verification

Read [the data-handling notice](https://whenwillidieclub.com/privacy.html). No clinical record is saved in browser storage; visible data is held in memory, cleared on hiding the page, and periodically revalidated. No browser agent tools expose medical data. Unit tests validate production envelopes and preserve source values. Backend tests cover origin/session isolation, scope checks, invalid environments, expiration and signed revocation without using real medical data.

A real patient must perform their own EHR authentication and consent; these tests do not claim successful patient connectivity. Availability varies by healthcare organization.

## Custom domain

`whenwillidieclub.com` is registered through Squarespace and assigned to this Render site. DNS uses an apex A record pointing to `216.24.57.1` and a `www` CNAME pointing to `whenwillidie.onrender.com`. Render redirects `www` to the apex domain and manages HTTPS certificates.

## Calculation and evidence boundary

Only demographic records are requested. The source birth date supplies completed age in UTC (adults 18–100). The table in `app/life-table.mjs` contains SSA 2023 period remaining life expectancy, from the 2026 Trustees Report. The default equally averages male/female columns; this is not an official combined-population table and does not infer gender. Remaining years × 365.2425 is rounded to days and added to the current UTC date. The result is shown only after explicit acknowledgment and reveal. It is an entertainment arithmetic result, not a personal mortality forecast. No diagnoses, laboratory results, or clinical-risk adjustments enter the calculation.

Source: https://www.ssa.gov/OACT/STATS/table4c6.html (accessed September 8, 2026). Tests cover age boundaries, invalid/missing/future dates, supported ages, table completeness, and arithmetic. No actual death-prediction accuracy is claimed.

## Artwork

The homepage illustration/photo was generated for this site. It is decorative editorial imagery, not a real patient, clinician endorsement, or clinical-data example.

## Agent navigation

The optional `start_health_import` WebMCP tool only opens import setup; it cannot connect an EHR, grant consent, read medical data, or reveal a date. The tool feature-detects browser support.

The navigation tool was verified in a supported browser WebMCP context: invalid arguments were rejected, and the valid action opened category selection without starting a connection.

<!-- public-discovery -->
## Public guide and project context

[How the playful date is calculated](https://whenwillidieclub.com/guides/how-the-playful-date-is-calculated.html) — The inputs, arithmetic and deliberate limitations behind an entertainment-only population life expectancy date.

[Search WhenWillIDie guides](https://whenwillidieclub.com/guides/) · [About the site](https://whenwillidieclub.com/about.html) · [Sitemap](https://whenwillidieclub.com/sitemap.xml)

WhenWillIDie is a standalone product with its own interface, documentation and repository, prepared for independent business operation and continued development. Its FinchNode integration is documented in the code. Live production activation remains pending.

## Public-page build and discoverability

Edit `content/seo.json` for reviewed article text and site metadata. `npm run build` generates public HTML pages, a sitemap, social metadata and structured data, then prerenders the actual React homepage. `npm run test:seo` checks the built crawl surface after a build. Public guide search filters only public text in the browser; no patient data or search analytics enter the index.

Keep canonical URLs on the custom domain configured in `content/seo.json`. Add only public, canonical pages to the sitemap. Validate links, mobile layout and the built HTML after editorial changes. Search engine indexing and rich results are not guaranteed.

## Independent business handoff

[Business handoff](HANDOFF.md) covers product identity, the receiving business’s production setup, domain migration, search verification and ongoing editorial maintenance.

## More product guides

Understand the playful date, compare the available population references, and see why the app requests demographics rather than a medical history.

- [Why your playful life-expectancy date can change](https://whenwillidieclub.com/guides/why-the-playful-date-changes.html) — See how completed age, the calculation day and the selected population reference affect WhenWillIDie’s entertainment-only date.
- [Why WhenWillIDie only requests demographics](https://whenwillidieclub.com/guides/why-the-app-only-requests-demographics.html) — Understand the narrow record scope behind WhenWillIDie’s age-based entertainment calculation and what it deliberately does not analyze.

- [Start a health product with one input you can explain](https://whenwillidieclub.com/guides/start-a-health-product-with-one-needed-input.html) — WhenWillIDie uses its age-based entertainment calculation to examine narrow data scope, explicit product boundaries and the role of a focused connection.
