module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addWatchTarget("homepage.html");

  eleventyConfig.addFilter("json", function (value) {
    return JSON.stringify(value, null, 2);
  });

  eleventyConfig.addFilter("take", function (items, count) {
    return Array.isArray(items) ? items.slice(0, count) : [];
  });

  eleventyConfig.addFilter("bySlugs", function (items, slugs) {
    if (!Array.isArray(items) || !Array.isArray(slugs)) {
      return [];
    }

    return slugs
      .map(function (slug) {
        return items.find(function (item) {
          return item.slug === slug;
        });
      })
      .filter(Boolean);
  });

  eleventyConfig.addFilter("excludeSlugs", function (items, excludedSlugs) {
    if (!Array.isArray(items)) {
      return [];
    }

    const blocked = new Set(excludedSlugs || []);
    return items.filter(function (item) {
      return !blocked.has(item.slug);
    });
  });

  eleventyConfig.addShortcode("year", function () {
    return new Date().getFullYear();
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"]
  };
};
