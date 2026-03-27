# Home Page Context

## Route
- `/`

## Main Source Files
- `homepage.html`
- `src/index.njk`
- `src/_data/site.js`
- `src/assets/css/site.css`

## Notes
- `homepage.html` is the homepage source of truth
- `src/_data/site.js` extracts the homepage main markup, CSS, and JS from `homepage.html`
- The accepted hero direction is a full-width image with the subject pushed right and the text sitting in the left negative space
- The reassurance chip below the hero buttons currently says `11+ Treatments Offered`
- The homepage trust strip remains below the hero

## Major Changes Already Made
- Hero redesigned multiple times until the current composition was approved
- Duplicate homepage trust messaging was removed and simplified
- Logo and favicon were updated
- Homepage remains the visual baseline for the rest of the site

## Current Open Note
- A major later learning was added after repeated hero debugging:
  - the homepage can look correct locally while still failing at the user's actual viewport
  - use `npm run qa:homepage` before future pushes
  - Cloudflare production/build settings were later verified and were correct:
    - branch `main`
    - build command `npm run build`
    - output directory `_site`
    - deploy command `npx wrangler deploy`
  - the root cause was the desktop-short hero fallback switching too late and using a split layout without a stable fixed hero height
  - the fix was to move short desktop screens to a deliberate left-panel/right-image composition with an explicit hero height and full-height image fill
  - this prevents the top badge and bottom reassurance chip from clipping on shorter desktop and laptop viewports
