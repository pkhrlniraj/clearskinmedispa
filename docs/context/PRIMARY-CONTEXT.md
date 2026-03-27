# Clear Skin Medi Spa - Primary Project Context
*Last updated: 2026-03-25*

This is the main handoff file to read first after context compaction.

## Project Snapshot
- Project type: Eleventy-generated static site for Clear Skin Medi Spa
- Goal: replace WordPress/Elementor with a maintainable static site that keeps the homepage design language and improves conversion flow
- Primary deployment direction now: Cloudflare
- Active Cloudflare URL: `https://clearskinmedispa.pkhrlniraj.workers.dev/`
- GitHub repo: `https://github.com/pkhrlniraj/clearskinmedispa.git`
- Build output: `_site`

## Current State
- GitHub `main` was later pushed beyond the commits originally summarized in this file
- Responsive and hero-fix commits after the first context draft include:
  - `761d8ae` Improve responsiveness and add project context docs
  - `e088c40` Tighten homepage hero for shorter desktop viewports
  - `adabae1` Adapt homepage hero for short desktop screens
- A key later finding: the homepage hero was validated locally after these changes, but Cloudflare production initially appeared stale
- On 2026-03-26, Cloudflare build logs/settings confirmed production was in fact deploying commit `adabae1` from `main` with:
  - Build command: `npm run build`
  - Deploy command: `npx wrangler deploy`
  - Output directory: `_site`
- That means the remaining homepage issue is a real unresolved responsive bug at the user's actual desktop viewport, not just stale deployment state
- Netlify-specific config has been removed from the repo
- Playwright-based local QA is now installed but still local-only in the working tree
- There are currently no tracked Cloudflare-specific config files in the repo, so production behavior must be verified against the Cloudflare dashboard/build settings directly

## Source Of Truth
- Homepage source of truth: `homepage.html`
- Eleventy config: `.eleventy.js`
- Shared site data: `src/_data/site.js`
- Service base data: `src/_data/services.js`
- Local service content merge layer: `src/_data/serviceContent.js`
- Curated service overrides: `src/_data/serviceContentOverrides.js`
- Imported service content/images map: `src/_data/serviceContentImports.js`
- Neighbourhood page data: `src/_data/neighbourhoods.js`
- Shared site styling: `src/assets/css/site.css`
- Service page template: `src/services/page.njk`
- Neighbourhood page template: `src/neighbourhoods/page.njk`
- Base layout: `src/_includes/layouts/base.njk`

## Historical Context
- The old WordPress/Elementor homepage context is preserved in `clear-skin-homepage-context.md`
- That file is legacy reference only
- It documents the pre-static-site phase when the homepage lived in one Elementor HTML widget

## Conversation Summary

### 1. Legacy WordPress Context Was Read And Understood
- The original work started from a WordPress/Elementor homepage project
- The homepage lived in a single Elementor HTML widget
- Existing fixes there included image crops, Fresha links, and logo handling

### 2. Static Site Migration Was Planned And Implemented
- The site was rebuilt as an Eleventy static site
- The homepage design was used as the visual baseline
- Shared templates, data files, SEO metadata, schema, CTA patterns, and reusable sections were introduced
- The scope included homepage, about, contact, privacy policy, blog index, 404, 13 service pages, and 7 neighbourhood pages

### 3. GitHub And Netlify Setup Happened First
- The project was pushed to GitHub
- Netlify deployment initially failed because Netlify expected `_site` while the project was building to `dist`
- Eleventy output was aligned to `_site`
- `netlify.toml` was added at that time to match the build output

### 4. Internal Pages Were Reworked For Better UX
- Service pages were cleaned up to remove obvious repetition from the homepage
- FAQ sections on internal pages were made always-expanded instead of collapsible
- Empty-space issues in grids were reduced
- Duplicate process/review sections were trimmed
- About page was rebuilt to feel less like a homepage clone
- About page imagery was aligned more closely with the original live site

### 5. Visual Polish Passes Were Added
- Footer mobile alignment was improved
- Header/footer logo sizing was adjusted multiple times
- The logo was eventually switched to a local asset
- The favicon was generated from the logo mark and wired into the base layout

### 6. Homepage Hero Was Iterated Several Times
- A first redesign was done but did not match the user's intent
- The homepage hero was then reworked into a full-width image composition
- The final accepted direction:
  - the image stays wide across the screen
  - the subject is pushed to the right
  - the text sits in the empty space on the left
  - the H1 is slightly reduced so it stays off the subject
- The reassurance chip below the hero buttons was iterated and ended as:
  - `11+ Treatments Offered`
  - `Laser, facials, peels & more`

### 7. OxyGeneo And Service Parity Work Started
- The user asked for a fuller parity pass against 13 live service pages
- Public images from live service pages were downloaded locally into `src/assets/media/live-services/`
- Crawling/import scripts were added:
  - `scripts/fetch_live_services.py`
  - `scripts/generate_service_content_imports.py`
- A merged service content system was created so imported live content can be combined with curated overrides

### 8. OxyGeneo Required Special Handling
- The live OxyGeneo page was determined to be an iframe shell
- Real source content came from `https://partners.dermaspark.com/oxygeneo/`
- OxyGeneo content and images were curated from that partner source
- Local assets for OxyGeneo were downloaded and the page was rebuilt around them

### 9. Cloudflare Replaced Netlify
- The site was moved away from Netlify because of repo update limits
- Netlify access was removed on the user's side
- The repo was cleaned of Netlify-specific config
- `netlify.toml` was deleted
- A repo sync was pushed to GitHub with Netlify legacy removed

### 10. Responsive Pass And Hero Debugging
- After Cloudflare deployment, the user reported that the site was not fully responsive and content was being cut off
- A full responsive pass was implemented and pushed
- The homepage hero still appeared broken in production at a specific desktop viewport, so several hero-specific fixes were attempted
- The critical later learning:
  - local browser QA at the failing viewport showed the latest hero code rendering correctly
  - production screenshots still showed the older broken behavior
  - therefore the issue became a Cloudflare deployment/activation mismatch, not just a still-broken local frontend

### 11. Local QA Workflow Was Added After This Failure
- Playwright was installed as a dev dependency for repeatable local visual QA
- A reusable homepage QA script was added:
  - `npm run qa:homepage`
- That script serves the built `_site` output locally, captures screenshots at multiple breakpoints, and writes them to `work/qa/`
- Important process learning:
  - do not push additional responsive or hero tweaks without first running the local QA script and checking the screenshots
  - if local screenshots pass but production still shows the broken hero, first verify Cloudflare build settings and active commit before assuming cache
  - in this case, Cloudflare was verified and the real gap was that local QA did not yet match the user's exact failing viewport closely enough
  - do not ask the user to keep rechecking the same hero fix without a verified local screenshot pass

## Actual Recent Git History
- `8945ded` Ignore generated Python cache files
- `231593a` Sync local service updates and remove Netlify config
- `a9dff20` Add logo mark favicon assets
- `9d09f36` Polish homepage hero reassurance chip
- `4164d57` Streamline homepage trust messaging
- `132ecce` Fine-tune homepage hero spacing
- `f2d22ee` Refine homepage hero composition
- `20ea5ba` Redesign homepage hero composition
- `cca90cc` Restore logo color and enlarge placement
- `93778ef` Increase logo presence across site
- `298187d` Replace site logo with local asset
- `d5e7ade` Refine mobile footer alignment
- `132b2d3` Fix internal page hero stacking on mobile
- `0386db7` Polish internal pages and publish robots
- `fbeeb9a` Refine internal page UX and reduce repetition
- `0dae541` Create robots.txt
- `12f52ff` Align Eleventy output with Netlify
- `b52a9c8` Initial static site build

## Important Architecture Notes
- The site is static HTML/CSS/JS at deploy time, even though source files are authored in Eleventy
- `src/_data/site.js` reads `homepage.html` and extracts:
  - homepage CSS
  - homepage JS
  - homepage main markup
- That means homepage structural and visual changes still often start in `homepage.html`
- Internal pages mostly use shared Eleventy templates plus data files

## Open Items
- Re-run local screenshot QA after any future homepage hero changes
- Commit the local QA tooling and context updates once ready so the workflow is preserved in Git history
- Keep using local screenshot QA before future pushes
- Continue full service-page parity review against all 13 live service URLs if desired
- Consider moving remaining remote non-service media in `src/_data/site.js` to local assets if complete WordPress independence is required
- Do a manual breakpoint QA pass after the responsive changes are deployed

## Resume Checklist
1. Read this file
2. Read `docs/context/PAGE-INDEX.md`
3. Read the page-specific context file for the route being edited
4. Check `git status` to see whether the responsive pass is still local-only
5. If working on the homepage, always inspect `homepage.html` first
6. If working on a service page, check both:
   - `src/_data/services.js`
   - `src/_data/serviceContent.js`
7. Before pushing homepage responsive changes, run:
   - `npm run build`
   - `npm run qa:homepage`
8. If local screenshots look correct but production does not, treat it as a Cloudflare deployment problem first

## Page Contexts
- See `docs/context/PAGE-INDEX.md`
