const fs = require("node:fs");
const path = require("node:path");
const helpers = require("../lib/helpers");
const services = require("./services");
const neighbourhoods = require("./neighbourhoods");

const homepagePath = path.join(process.cwd(), "homepage.html");
const homepageSource = fs.readFileSync(homepagePath, "utf8");
const assetVersionSources = [
  homepagePath,
  path.join(process.cwd(), "src", "_includes", "layouts", "base.njk"),
  path.join(process.cwd(), "src", "assets", "css", "site.css")
];

const assetVersion = String(
  Math.max.apply(
    null,
    assetVersionSources.map(function (filePath) {
      return Math.floor(fs.statSync(filePath).mtimeMs);
    })
  )
);

function extract(pattern, fallback) {
  const match = homepageSource.match(pattern);
  return match ? match[1].trim() : fallback;
}

function rewriteHomepageLinks(html) {
  return html
    .replace(/href="https:\/\/clearskinmedispa\.com\/New\/"/g, 'href="/"')
    .replace(/href="https:\/\/clearskinmedispa\.com\/New\/#([^"]*)"/g, 'href="/#$1"')
    .replace(/href="https:\/\/clearskinmedispa\.com\/New\/([^"#][^"]*)"/g, 'href="/$1"');
}

const homepageMain = extract(/<main>([\s\S]*?)<\/main>/, "");
const homepageCss = extract(/<style>([\s\S]*?)<\/style>/, "");
const homepageScript = extract(/<script>\s*\(function \(\) \{([\s\S]*?)<\/script>/, "");

const homeFaqs = [
  {
    question: "How many laser hair removal sessions are needed?",
    answer:
      "Most clients need 6-8 sessions spaced 4-6 weeks apart for optimal, long-lasting results. Your aesthetician will recommend a personalized plan during your consultation."
  },
  {
    question: "Is laser hair removal safe for dark skin tones?",
    answer:
      "Yes. Soprano ICE Platinum is designed to safely and effectively treat all skin tones, including darker complexions."
  },
  {
    question: "Where is Clear Skin Medi Spa located?",
    answer:
      "Clear Skin Medi Spa is located at 4 - 8325 Financial Drive, Brampton, ON L6Y 1M1, with easy on-site parking for clients across Brampton, Mississauga, and the GTA."
  },
  {
    question: "What skin treatments does Clear Skin Medi Spa offer?",
    answer:
      "We offer laser hair removal, OxyGeneo facials, microneedling, advanced facial peels, dermaplaning, microblading, HydraFacial, microdermabrasion, LED light therapy, facials, waxing, and RF skin tightening."
  },
  {
    question: "How much does laser hair removal cost in Brampton?",
    answer:
      "Laser hair removal starts from $25 per session, with pricing varying by treatment area and package size."
  },
  {
    question: "Is there any downtime after treatments?",
    answer:
      "Most treatments have little to no downtime. Some treatments such as microneedling and advanced peels may involve mild redness or sensitivity for 24-48 hours."
  }
];

const site = {
  name: "Clear Skin Medi Spa",
  url: "https://clearskinmedispa.com",
  phoneDisplay: "+1 905 451 0222",
  phoneHref: "tel:+19054510222",
  phoneRaw: "+19054510222",
  email: "info@clearskinmedispa.com",
  bookingUrl:
    "https://www.fresha.com/book-now/clear-skin-medi-spa-limited-z7hvfgwe/services?lid=1132408&pId=1073884",
  bookingUrlShort:
    "https://www.fresha.com/book-now/clear-skin-medi-spa-limited-z7hvfgwe/services",
  mapUrl:
    "https://www.google.com/maps/place/Clear+Skin+Medi+Spa/@43.6356887,-79.7918879,17z",
  address: {
    line1: "4 - 8325 Financial Drive",
    city: "Brampton",
    region: "ON",
    postalCode: "L6Y 1M1",
    country: "CA",
    formatted: "4 - 8325 Financial Drive, Brampton, ON L6Y 1M1"
  },
  hours: [
    { label: "Monday - Friday", value: "10:00am - 7:00pm" },
    { label: "Saturday", value: "10:00am - 5:00pm" },
    { label: "Sunday", value: "10:00am - 5:00pm" }
  ],
  socials: [
    {
      label: "Instagram",
      icon: "fa-brands fa-instagram",
      url: "https://www.instagram.com/clearskinmedispa/"
    },
    {
      label: "Facebook",
      icon: "fa-brands fa-facebook-f",
      url: "https://www.facebook.com/clearskinmedispa/"
    },
    {
      label: "TikTok",
      icon: "fa-brands fa-tiktok",
      url: "https://www.tiktok.com/@clearskinmedispa"
    }
  ],
  logo: {
    light: "/assets/media/clear-skin-logo.png",
    dark: "/assets/media/clear-skin-logo.png",
    absolute: "https://clearskinmedispa.com/assets/media/clear-skin-logo.png"
  },
  assetVersion,
  images: {
    aboutHero:
      "https://clearskinmedispa.com/New/wp-content/uploads/2024/02/7G0A5211-scaled.jpg",
    aboutAccent:
      "https://clearskinmedispa.com/New/wp-content/uploads/2024/02/EG-2.png",
    clinicTeam:
      "https://clearskinmedispa.com/New/wp-content/uploads/2024/02/7G0A5611-scaled.jpg",
    foundersAward:
      "https://clearskinmedispa.com/New/wp-content/uploads/2024/02/Patrick-Brown-with-Ama-Soprano-Ice-Lase-Treatment-Machine-scaled.jpg"
  },
  ogImage:
    "https://clearskinmedispa.com/assets/media/soprano-ice-cover-hero.png",
  homepage: {
    css: homepageCss,
    script: "(function () {" + homepageScript,
    main: rewriteHomepageLinks(homepageMain),
    faqs: homeFaqs
  },
  trustItems: [
    {
      icon: "fa-solid fa-star",
      value: "4.9 / 5.0",
      label: "Google Reviews"
    },
    {
      icon: "fa-solid fa-award",
      value: "Soprano ICE Platinum",
      label: "Gold Standard Laser"
    },
    {
      icon: "fa-solid fa-users",
      value: "All Skin Tones",
      label: "Safe & Inclusive"
    },
    {
      icon: "fa-solid fa-shield-halved",
      value: "Certified",
      label: "Medical Aestheticians"
    }
  ],
  reviews: [
    {
      name: "Shannon S",
      badge: "Local Guide - 22 reviews",
      avatar: "S",
      quote:
        "I had a bad experience with laser in the past, so I was very nervous going in, but Bineeta and the team completely changed that for me. I finally feel comfortable and confident with my treatments."
    },
    {
      name: "Vibha Khatri",
      badge: "Local Guide - 27 reviews",
      avatar: "V",
      quote:
        "I really appreciate their sincerity, honesty, and concern for my health. I would absolutely vouch for them for their integrity and professionalism."
    },
    {
      name: "Shreeya Panthee",
      badge: "5 months ago",
      avatar: "S",
      quote:
        "Both Archana and Bineeta are incredible medical estheticians who truly go above and beyond. They explain everything clearly and make you feel at ease."
    }
  ],
  featuredServiceSlugs: [
    "laser-hair-removal",
    "hydrafacial",
    "microneedling",
    "oxygeneo",
    "chemical-peel",
    "rf-skin-tightening"
  ],
  services,
  neighbourhoods
};

site.navigation = {
  main: [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about/" },
    { label: "Blog", url: "/blog/" },
    { label: "Contact", url: "/contact/" }
  ],
  services: services.map(function (service) {
    return {
      label: service.navLabel || service.name,
      url: "/" + service.slug + "/"
    };
  }),
  quickLinks: [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about/" },
    { label: "Services", url: "/#services" },
    { label: "Blog", url: "/blog/" },
    { label: "Contact", url: "/contact/" },
    { label: "Privacy Policy", url: "/privacy-policy/" }
  ]
};

site.sitewideSchemaBlocks = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: site.logo.absolute,
    image: site.ogImage,
    description:
      "Clear Skin Medi Spa is a premier medical aesthetics clinic in Brampton specializing in pain-free laser hair removal, HydraFacial, microneedling, OxyGeneo, and advanced skincare treatments.",
    telephone: site.phoneRaw,
    email: site.email,
    foundingDate: "2021",
    founders: [
      {
        "@type": "Person",
        name: "Archana Shrestha",
        jobTitle: "Co-Founder & Certified Medical Aesthetician"
      },
      {
        "@type": "Person",
        name: "Bineeta Shrestha",
        jobTitle: "Co-Founder & Certified Medical Aesthetician"
      }
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country
    },
    sameAs: site.socials.map(function (social) {
      return social.url;
    })
  },
  {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: site.name,
    url: site.url,
    image: site.ogImage,
    telephone: site.phoneRaw,
    email: site.email,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "43.6629",
      longitude: "-79.7648"
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "10:00",
        closes: "17:00"
      }
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "113",
      bestRating: "5",
      worstRating: "1"
    },
    areaServed: [
      { "@type": "City", name: "Brampton" },
      { "@type": "City", name: "Mississauga" },
      { "@type": "City", name: "Bramalea" },
      { "@type": "City", name: "Caledon" },
      { "@type": "City", name: "Georgetown" },
      { "@type": "AdministrativeArea", name: "Greater Toronto Area" }
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Clear Skin Medi Spa Services",
      itemListElement: services.map(function (service) {
        return {
          "@type": "OfferCatalog",
          name: service.name,
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": service.schemaType || "Service",
                name: service.name
              }
            }
          ]
        };
      })
    }
  }
];

site.homepageSchemaBlocks = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: site.url + "/?s={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  },
  helpers.buildFaqSchema(site.homepage.faqs)
].filter(Boolean);

site.absoluteUrl = function (value) {
  return helpers.absoluteUrl(site.url, value);
};

module.exports = site;
