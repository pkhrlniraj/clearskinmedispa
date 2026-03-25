const helpers = require("../lib/helpers");

module.exports = {
  layout: "layouts/base.njk",
  pagination: {
    data: "services",
    size: 1,
    alias: "service"
  },
  permalink: function (data) {
    return data.service.slug + "/index.html";
  },
  eleventyComputed: {
    title: function (data) {
      return data.service.name;
    },
    metaTitle: function (data) {
      return data.service.metaTitle;
    },
    metaDescription: function (data) {
      return data.service.metaDescription;
    },
    canonicalPath: function (data) {
      return "/" + data.service.slug + "/";
    },
    ogImage: function (data) {
      if (!data.service) {
        return data.site.ogImage;
      }
      const imported = data.serviceContent[data.service.slug];
      return imported && imported.primaryImage
        ? data.site.url + imported.primaryImage
        : data.service.image;
    },
    pageClass: function (data) {
      return "page-service page-" + data.service.slug;
    },
    breadcrumbs: function (data) {
      return [
        { label: "Home", url: "/" },
        { label: "Services", url: "/#services" },
        { label: data.service.name, url: "/" + data.service.slug + "/" }
      ];
    },
    schemaBlocks: function (data) {
      if (!data.service || !data.service.hero) {
        return [];
      }
      const imported = data.serviceContent[data.service.slug];
      const breadcrumbs = [
        { label: "Home", url: "/" },
        { label: "Services", url: "/#services" },
        { label: data.service.name, url: "/" + data.service.slug + "/" }
      ];
      const serviceSchema = helpers.buildServiceSchema(data.service, data.site);

      if (imported && imported.primaryImage) {
        serviceSchema.image = data.site.url + imported.primaryImage;
      }

      return [
        serviceSchema,
        helpers.buildFaqSchema(data.service.faq),
        helpers.buildBreadcrumbSchema(data.site.url, breadcrumbs)
      ].filter(Boolean);
    }
  }
};
