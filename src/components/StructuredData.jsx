import Script from "next/script"

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "TransportationService",
    name: "MafiaFerry",
    description:
      "Book the official ferry to Mafia Island from Nyamisati, Tanzania. Safe, reliable daily trips with modern vessels, verified crew, and secure online booking.",
    url: "https://mafiaferry.vercel.app",
    image: "https://mafiaferry.vercel.app/mafia_ferry.png",
    areaServed: {
      "@type": "Place",
      name: "Mafia Island",
      address: { "@type": "PostalAddress", addressCountry: "Tanzania" },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Ferry Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Daily Ferry Service",
            description: "Daily ferry service between Nyamisati on the mainland and Kilindoni, Mafia Island",
          },
        },
      ],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Mafia Ferry",
    description:
      "Official ferry service and travel platform for Mafia Island, Tanzania. Ferry tickets, whale shark tours, accommodation booking, and travel guides.",
    url: "https://mafiaferry.vercel.app",
    logo: "/icon-192.png",
    image: "https://mafiaferry.vercel.app/mafia_ferry.png",
    telephone: "+255776986840",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nyamisati Ferry Terminal",
      addressLocality: "Nyamisati",
      addressRegion: "Pwani",
      postalCode: "00000",
      addressCountry: "TZ",
    },
    areaServed: "Mafia Island, Tanzania",
    openingHours: "Mo-Su 08:00-18:00",
    priceRange: "$$",
    sameAs: [
      "https://mafiaferry.vercel.app",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://mafiaferry.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ferry to Mafia Island",
        item: "https://mafiaferry.vercel.app/nyamisati-ferry",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Blog",
        item: "https://mafiaferry.vercel.app/blog",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MafiaFerry",
    url: "https://mafiaferry.vercel.app",
    description: "Official ferry booking and travel guide for Mafia Island, Tanzania. Daily ferries from Nyamisati to Kilindoni, whale shark tours, accommodation, and travel information.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://mafiaferry.vercel.app/blog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I get to Mafia Island?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can reach Mafia Island by taking the official ferry from Nyamisati to Kilindoni. The ferry departs daily at 9:00 AM and the journey takes 4-5 hours. You can also fly from Dar es Salaam in 30 minutes with Coastal Aviation or Auric Air.",
        },
      },
      {
        "@type": "Question",
        name: "Where does the Mafia Ferry depart from?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The ferry departs from Nyamisati, approximately 160 km south of Dar es Salaam, and arrives at Kilindoni on Mafia Island.",
        },
      },
      {
        "@type": "Question",
        name: "How can I book the Mafia Ferry?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can book your ferry tickets online through MafiaFerry.com using secure payment. We recommend booking at least 24 hours ahead in peak season (October-March).",
        },
      },
      {
        "@type": "Question",
        name: "How long is the ferry ride to Mafia Island?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The ferry journey from Nyamisati to Kilindoni takes approximately 4-5 hours depending on tide and weather conditions.",
        },
      },
      {
        "@type": "Question",
        name: "When is whale shark season on Mafia Island?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Whale shark season on Mafia Island runs from October to March each year, with peak sightings in November, December, and January.",
        },
      },
      {
        "@type": "Question",
        name: "How much does it cost to visit Mafia Island?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Budget travellers can visit Mafia Island for approximately USD 30-50 per day including accommodation, food, and basic activities. The ferry from Dar es Salaam costs TZS 30,000-50,000 per person one way.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Trip",
    name: "Mafia Island Ferry - Nyamisati to Kilindoni",
    description: "Daily ferry service from Nyamisati mainland to Kilindoni, Mafia Island, Tanzania. Online booking available.",
    provider: {
      "@type": "Organization",
      name: "MafiaFerry",
      url: "https://mafiaferry.vercel.app",
    },
    itinerary: [
      {
        "@type": "Place",
        name: "Nyamisati Ferry Port",
        geo: { "@type": "GeoCoordinates", latitude: -7.8937, longitude: 39.1453 },
      },
      {
        "@type": "Place",
        name: "Kilindoni, Mafia Island",
        geo: { "@type": "GeoCoordinates", latitude: -7.9167, longitude: 39.6667 },
      },
    ],
  },
]

export function StructuredData() {
  return schemas.map((schema, index) => (
    <Script
      key={index}
      id={`structured-data-${index}`}
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  ))
}
