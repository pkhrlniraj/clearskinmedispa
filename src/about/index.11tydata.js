const helpers = require("../lib/helpers");

module.exports = {
  layout: "layouts/base.njk",
  metaTitle: "About Clear Skin Medi Spa | Certified Aestheticians | Brampton",
  metaDescription:
    "Meet Archana and Bineeta at Clear Skin Medi Spa, a women-owned Brampton clinic focused on laser hair removal and advanced skin treatments.",
  canonicalPath: "/about/",
  pageClass: "page-about",
  breadcrumbs: [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about/" }
  ],
  eleventyComputed: {
    schemaBlocks: function (data) {
      return [
        helpers.buildBasicPageSchema(
          "AboutPage",
          "About Clear Skin Medi Spa",
          "Meet the team behind Clear Skin Medi Spa in Brampton.",
          data.site.url + "/about/"
        ),
        helpers.buildBreadcrumbSchema(data.site.url, data.breadcrumbs)
      ];
    }
  }
};
