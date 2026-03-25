const helpers = require("../lib/helpers");

module.exports = {
  layout: "layouts/base.njk",
  metaTitle: "Privacy Policy | Clear Skin Medi Spa",
  metaDescription:
    "Read the privacy policy for Clear Skin Medi Spa, including how appointment, analytics, and contact information are handled.",
  canonicalPath: "/privacy-policy/",
  pageClass: "page-privacy",
  breadcrumbs: [
    { label: "Home", url: "/" },
    { label: "Privacy Policy", url: "/privacy-policy/" }
  ],
  eleventyComputed: {
    schemaBlocks: function (data) {
      return [
        helpers.buildBasicPageSchema(
          "WebPage",
          "Privacy Policy",
          "Privacy policy for Clear Skin Medi Spa.",
          data.site.url + "/privacy-policy/"
        ),
        helpers.buildBreadcrumbSchema(data.site.url, data.breadcrumbs)
      ];
    }
  }
};
