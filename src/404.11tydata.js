const helpers = require("./lib/helpers");

module.exports = {
  layout: "layouts/base.njk",
  permalink: "404.html",
  eleventyExcludeFromCollections: true,
  metaTitle: "Page Not Found | Clear Skin Medi Spa",
  metaDescription: "The page you requested could not be found. Explore Clear Skin Medi Spa services or return to the homepage.",
  canonicalPath: "/404.html",
  pageClass: "page-404",
  breadcrumbs: [
    { label: "Home", url: "/" },
    { label: "404", url: "/404.html" }
  ],
  eleventyComputed: {
    schemaBlocks: function (data) {
      return [
        helpers.buildBasicPageSchema(
          "WebPage",
          "Page Not Found",
          "404 page for Clear Skin Medi Spa.",
          data.site.url + "/404.html"
        )
      ];
    }
  }
};
