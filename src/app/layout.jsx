import "../index.css"
import { Providers } from "./providers"
import { StructuredData } from "../components/StructuredData"
import { GoogleAnalyticsScript } from "../components/GoogleAnalyticsScript"

export const metadata = {
  title: {
    default: "MafiaFerry – Official Ferry to Mafia Island, Tanzania | Kivuko Rasmi cha Kisiwa cha Mafia",
    template: "%s | MafiaFerry",
  },
  description:
    "Book the official ferry to Mafia Island from Nyamisati, Tanzania. Safe, reliable daily trips with modern vessels. | Kivuko rasmi cha Kisiwa cha Mafia kutoka Nyamisati. Safari salama na za uhakika.",
  keywords:
    "mafia ferry, mafia island ferry, ferry to mafia island, nyamisati ferry, kilindoni ferry, mafia island transport, boat to mafia island, mafia ferry booking, tanzania ferry, mafia island travel, how to get to mafia island, kivuko mafia, feri ya mafia, usafiri mafia, safari mafia",
  metadataBase: new URL("https://mafiaferry.vercel.app"),
  openGraph: {
    title: "MafiaFerry – Safe & Reliable Ferry to Mafia Island",
    description:
      "Travel safely to Mafia Island with the official ferry service. Daily departures, modern vessels, professional crew, and trusted booking. | Safari salama kwa Kisiwa cha Mafia.",
    url: "https://mafiaferry.vercel.app",
    siteName: "MafiaFerry",
    type: "website",
    locale: "en_US",
    alternateLocale: "sw_TZ",
    images: [
      {
        url: "/mafia_ferry.png",
        width: 1200,
        height: 630,
        alt: "Mafia Ferry – Official Transport to Mafia Island | Usafiri Rasmi Kisiwa cha Mafia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MafiaFerry – Book Your Trip to Mafia Island",
    description:
      "Book your official ferry to Mafia Island. Safe, daily transportation from Nyamisati to Kilindoni. Fast booking & reliable service.",
    images: ["/mafia_ferry.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
  alternates: {
    canonical: "https://mafiaferry.vercel.app",
    languages: {
      en: "https://mafiaferry.vercel.app",
      sw: "https://mafiaferry.vercel.app",
      "x-default": "https://mafiaferry.vercel.app",
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <GoogleAnalyticsScript />
        <StructuredData />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
