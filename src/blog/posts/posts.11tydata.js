const helpers = require("../../lib/helpers");

module.exports = {
  layout: "layouts/post.njk",
  tags: ["posts"],
  eleventyComputed: {
    canonicalPath: function (data) {
      return data.page.url;
    },
    pageClass: function () {
      return "page-post";
    },
    breadcrumbs: function (data) {
      return [
        { label: "Home", url: "/" },
        { label: "Blog", url: "/blog/" },
        { label: data.title || "Post", url: data.page.url }
      ];
    },
    schemaBlocks: function (data) {
      return [
        helpers.buildBasicPageSchema(
          "Article",
          data.title || "Blog Post",
          data.excerpt || data.description || "",
          data.site.url + data.page.url
        ),
        helpers.buildBreadcrumbSchema(data.site.url, data.breadcrumbs)
      ];
    }
  }
};
