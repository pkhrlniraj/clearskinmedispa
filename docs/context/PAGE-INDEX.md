# Clear Skin Medi Spa - Page Context Index
*Read this after `docs/context/PRIMARY-CONTEXT.md`.*

## Core Pages
- Home: `docs/context/pages/home.md`
- About: `docs/context/pages/about.md`
- Contact: `docs/context/pages/contact.md`
- Privacy Policy: `docs/context/pages/privacy-policy.md`
- Blog Index: `docs/context/pages/blog.md`
- 404: `docs/context/pages/not-found.md`

## Service Pages
- Laser Hair Removal: `docs/context/pages/services/laser-hair-removal.md`
- OxyGeneo: `docs/context/pages/services/oxygeneo.md`
- Chemical Peel: `docs/context/pages/services/chemical-peel.md`
- Microneedling: `docs/context/pages/services/microneedling.md`
- Dermaplaning: `docs/context/pages/services/dermaplaning.md`
- Microblading: `docs/context/pages/services/microblading.md`
- HydraFacial: `docs/context/pages/services/hydrafacial.md`
- Microdermabrasion: `docs/context/pages/services/microdermabrasion.md`
- LED Light Therapy: `docs/context/pages/services/led-light-therapy.md`
- Facials: `docs/context/pages/services/facials.md`
- Waxing: `docs/context/pages/services/waxing.md`
- RF Skin Tightening: `docs/context/pages/services/rf-skin-tightening.md`
- Other Services: `docs/context/pages/services/other-services.md`

## Neighbourhood Pages
- Brampton: `docs/context/pages/neighbourhoods/medi-spa-brampton.md`
- Mississauga: `docs/context/pages/neighbourhoods/medi-spa-mississauga.md`
- Bramalea: `docs/context/pages/neighbourhoods/medi-spa-bramalea.md`
- Heart Lake: `docs/context/pages/neighbourhoods/medi-spa-heart-lake.md`
- Caledon: `docs/context/pages/neighbourhoods/medi-spa-caledon.md`
- Georgetown: `docs/context/pages/neighbourhoods/medi-spa-georgetown.md`
- Bram West: `docs/context/pages/neighbourhoods/medi-spa-bram-west.md`

## Shared Editing Rules
- Homepage changes usually start in `homepage.html`
- Internal page visual changes usually start in `src/assets/css/site.css`
- Service page content changes usually touch:
  - `src/_data/services.js`
  - `src/_data/serviceContent.js`
  - optionally `src/_data/serviceContentOverrides.js`
- Neighbourhood page content changes usually touch:
  - `src/_data/neighbourhoods.js`
- Shared layout changes usually touch:
  - `src/_includes/layouts/base.njk`
  - `src/_includes/components/*.njk`

## Current Warning
- The newest responsive/mobile fixes are local-only right now
- Before future edits, check whether `homepage.html` and `src/assets/css/site.css` have already been pushed

