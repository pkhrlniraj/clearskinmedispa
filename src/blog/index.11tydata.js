const helpers = require("../lib/helpers");

module.exports = {
  layout: "layouts/base.njk",
  metaTitle: "Skin Care Blog | Clear Skin Medi Spa",
  metaDescription:
    "Explore upcoming skincare education, treatment guides, and local beauty insights from Clear Skin Medi Spa in Brampton.",
  canonicalPath: "/blog/",
  pageClass: "page-blog",
  breadcrumbs: [
    { label: "Home", url: "/" },
    { label: "Blog", url: "/blog/" }
  ],
  eleventyComputed: {
    schemaBlocks: function (data) {
      return [
        helpers.buildBasicPageSchema(
          "CollectionPage",
          "Clear Skin Medi Spa Blog",
          "The blog index for Clear Skin Medi Spa.",
          data.site.url + "/blog/"
        ),
        helpers.buildBreadcrumbSchema(data.site.url, data.breadcrumbs)
      ];
    }
  }
};
