import { defaultMetadata } from './metadata'

export const metadata = defaultMetadata

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://mafiaferry.com" />
        
        {/* Structured Data for Rich Results */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "TransportationService",
              "name": "MafiaFerry",
              "description": "Official ferry service to Mafia Island, Tanzania",
              "url": "https://mafiaferry.com",
              "areaServed": {
                "@type": "Place",
                "name": "Mafia Island",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "Tanzania"
                }
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Ferry Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Daily Ferry Service",
                      "description": "Regular ferry service to and from Mafia Island"
                    }
                  }
                ]
              }
            }
          `}
        </script>
      </head>
      <body>{children}</body>
    </html>
  )
} 