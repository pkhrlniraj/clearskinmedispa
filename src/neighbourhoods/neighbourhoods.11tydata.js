const helpers = require("../lib/helpers");

module.exports = {
  layout: "layouts/base.njk",
  pagination: {
    data: "neighbourhoods",
    size: 1,
    alias: "localPage"
  },
  permalink: function (data) {
    return data.localPage.slug + "/index.html";
  },
  eleventyComputed: {
    title: function (data) {
      return data.localPage.title;
    },
    metaTitle: function (data) {
      return data.localPage.metaTitle;
    },
    metaDescription: function (data) {
      return data.localPage.metaDescription;
    },
    canonicalPath: function (data) {
      return "/" + data.localPage.slug + "/";
    },
    ogImage: function (data) {
      return data.site.ogImage;
    },
    pageClass: function (data) {
      return "page-neighbourhood page-" + data.localPage.slug;
    },
    breadcrumbs: function (data) {
      return [
        { label: "Home", url: "/" },
        { label: "Areas We Serve", url: "/contact/" },
        { label: data.localPage.areaName, url: "/" + data.localPage.slug + "/" }
      ];
    },
    schemaBlocks: function (data) {
      const breadcrumbs = [
        { label: "Home", url: "/" },
        { label: "Areas We Serve", url: "/contact/" },
        { label: data.localPage.areaName, url: "/" + data.localPage.slug + "/" }
      ];

      return [
        helpers.buildLocalPageSchema(data.localPage, data.site),
        helpers.buildFaqSchema(data.localPage.faq),
        helpers.buildBreadcrumbSchema(data.site.url, breadcrumbs)
      ].filter(Boolean);
    }
  }
};
