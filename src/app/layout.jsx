import { Helmet } from "react-helmet-async";
import { defaultMetadata } from "./metadata";

export default function RootLayout({ children }) {
  const {
    title,
    description,
    keywords,
    openGraph,
    twitter,
    robots,
    verification,
  } = defaultMetadata;

  const ogImage = openGraph.images?.[0];
  const twitterImage = twitter.images?.[0];

  /* -------------------------------------------------------
    1. Transportation Service Schema
  ------------------------------------------------------- */
  const transportationSchema = {
    "@context": "https://schema.org",
    "@type": "TransportationService",
    name: "MafiaFerry",
    description,
    url: "https://www.mafiaferry.vercel.app",
    image: ogImage?.url, // From public folder
    areaServed: {
      "@type": "Place",
      name: "Mafia Island",
      address: { "@type": "PostalAddress", addressCountry: "Tanzania" }
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
            description: "Regular ferry service between Nyamisati & Mafia Island"
          }
        }
      ]
    }
  };

  /* -------------------------------------------------------
    2. Local Business Schema
    (Improves Google Maps + Local SEO)
  ------------------------------------------------------- */
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Mafia Ferry",
    description,
    url: "https://www.mafiaferry.vercel.app",
    logo: "/logo.png",    // from public folder
    image: "/mafiaFerry.png",
    telephone: "+255000000000", // <-- Replace with actual phone number
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nyamisati Ferry Terminal",
      addressLocality: "Nyamisati",
      addressRegion: "Pwani",
      postalCode: "00000",
      addressCountry: "TZ"
    },
    areaServed: "Mafia Island, Tanzania",
    openingHours: "Mo-Su 08:00-18:00",
    priceRange: "$$"
  };

  /* -------------------------------------------------------
    3. Breadcrumb Schema
  ------------------------------------------------------- */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.mafiaferry.vercel.app"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ferry Services",
        item: "https://www.mafiaferry.vercel.app/blog"
      }
    ]
  };

  /* -------------------------------------------------------
    4. FAQ Schema
  ------------------------------------------------------- */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I get to Mafia Island?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You can reach Mafia Island by taking the official ferry from Nyamisati to Kilindoni. The ferry operates daily and offers safe and reliable transport."
        }
      },
      {
        "@type": "Question",
        name: "Where does the Mafia Ferry depart from?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The ferry departs from Nyamisati, Tanzania, and arrives at Kilindoni on Mafia Island."
        }
      },
      {
        "@type": "Question",
        name: "How can I book the Mafia Ferry?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You can book your ferry tickets online through our official website using secure and verified payment options."
        }
      },
      {
        "@type": "Question",
        name: "How long is the ferry ride?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The ferry journey takes around 3–4 hours depending on weather conditions."
        }
      }
    ]
  };

  return (
    <html lang="en">
    <>
      <Helmet>
        {/* Primary Metadata */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />

        <link rel="canonical" href="https://www.mafiaferry.vercel.app" />
        <link rel="icon" href="/favicon.ico" />

        {/* Robots */}
        <meta
          name="robots"
          content={`${robots.index ? "index" : "noindex"}, ${robots.follow ? "follow" : "nofollow"}`}
        />

        {/* GoogleBot Rules */}
        <meta
          name="googlebot"
          content={`
            ${robots.googleBot.index ? "index" : "noindex"},
            ${robots.googleBot.follow ? "follow" : "nofollow"},
            max-image-preview:${robots.googleBot["max-image-preview"]},
            max-snippet:${robots.googleBot["max-snippet"]},
            max-video-preview:${robots.googleBot["max-video-preview"]}
          `}
        />

        {/* Verification */}
        <meta name="google-site-verification" content={verification.google} />

        {/* OG Tags */}
        <meta property="og:title" content={openGraph.title} />
        <meta property="og:description" content={openGraph.description} />
        <meta property="og:image" content="/mafiaFerry.png" />
        <meta property="og:type" content={openGraph.type} />
        <meta property="og:url" content="https://www.mafiaferry.vercel.app" />
        <meta property="og:locale" content={openGraph.locale} />

        {/* Twitter */}
        <meta name="twitter:card" content={twitter.card} />
        <meta name="twitter:title" content={twitter.title} />
        <meta name="twitter:description" content={twitter.description} />
        <meta name="twitter:image" content="/mafiaFerry.png" />

        {/* hreflang */}
        <link rel="alternate" href="https://www.mafiaferry.vercel.app" hrefLang="en" />
        <link rel="alternate" href="https://www.mafiaferry.vercel.app" hrefLang="x-default" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-TKFV5E8GLS"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TKFV5E8GLS', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `}
        </script>

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify(transportationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
    </>
    <body>{children}</body>
    </html>
  );
}