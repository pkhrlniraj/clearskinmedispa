const helpers = require("../lib/helpers");

module.exports = {
  layout: "layouts/base.njk",
  metaTitle: "Contact Clear Skin Medi Spa | Book Appointment | Brampton",
  metaDescription:
    "Visit Clear Skin Medi Spa at 4 - 8325 Financial Drive, Brampton. Call 905-451-0222, email info@clearskinmedispa.com, or book online.",
  canonicalPath: "/contact/",
  pageClass: "page-contact",
  breadcrumbs: [
    { label: "Home", url: "/" },
    { label: "Contact", url: "/contact/" }
  ],
  contactFaqs: [
    {
      question: "Where are you located?",
      answer:
        "Clear Skin Medi Spa is located at 4 - 8325 Financial Drive, Brampton, ON L6Y 1M1, with convenient plaza parking for clients."
    },
    {
      question: "How do I book an appointment?",
      answer:
        "The fastest option is booking through Fresha. You can also call the clinic directly if you would like help choosing a service."
    },
    {
      question: "Do you offer consultations?",
      answer:
        "Yes. Consultations are a great fit if you are deciding between services or want a treatment plan tailored to your goals."
    }
  ],
  eleventyComputed: {
    schemaBlocks: function (data) {
      return [
        helpers.buildBasicPageSchema(
          "ContactPage",
          "Contact Clear Skin Medi Spa",
          "Contact details and clinic information for Clear Skin Medi Spa in Brampton.",
          data.site.url + "/contact/"
        ),
        helpers.buildBreadcrumbSchema(data.site.url, data.breadcrumbs)
      ];
    }
  }
};
