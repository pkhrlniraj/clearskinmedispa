function absoluteUrl(siteUrl, path) {
  if (!path) {
    return siteUrl;
  }

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return new URL(path, siteUrl).toString();
}

function buildFaqSchema(faqs) {
  if (!Array.isArray(faqs) || !faqs.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(function (faq) {
      return {
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
      };
    })
  };
}

function buildBreadcrumbSchema(siteUrl, breadcrumbs) {
  if (!Array.isArray(breadcrumbs) || !breadcrumbs.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map(function (item, index) {
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: absoluteUrl(siteUrl, item.url)
      };
    })
  };
}

function buildServiceSchema(service, site) {
  const base = {
    "@context": "https://schema.org",
    "@type": service.schemaType || "MedicalProcedure",
    name: service.schemaName || service.name,
    description: service.schemaDescription || service.hero.summary,
    url: absoluteUrl(site.url, "/" + service.slug + "/"),
    provider: {
      "@type": "MedicalBusiness",
      name: site.name,
      url: site.url
    },
    image: service.image
  };

  if (service.schemaType !== "Service") {
    base.procedureType = service.procedureType || "NonInvasive";
  }

  if (service.bodyLocation) {
    base.bodyLocation = service.bodyLocation;
  }

  if (service.howPerformed) {
    base.howPerformed = service.howPerformed;
  }

  if (service.preparation) {
    base.preparation = service.preparation;
  }

  if (service.followup) {
    base.followup = service.followup;
  }

  base.offers = {
    "@type": "Offer",
    price: String(service.priceValue || ""),
    priceCurrency: "CAD",
    availability: "https://schema.org/InStock",
    url: site.bookingUrl
  };

  if (!base.offers.price) {
    delete base.offers.price;
  }

  return base;
}

function buildLocalPageSchema(page, site) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.metaTitle || page.title,
    description: page.metaDescription || page.hero.summary,
    url: absoluteUrl(site.url, "/" + page.slug + "/"),
    about: {
      "@type": "MedicalBusiness",
      name: site.name,
      url: site.url
    },
    areaServed: {
      "@type": "City",
      name: page.areaName
    }
  };
}

function buildBasicPageSchema(type, name, description, url) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: name,
    description: description,
    url: url
  };
}

module.exports = {
  absoluteUrl,
  buildBasicPageSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildLocalPageSchema,
  buildServiceSchema
};
