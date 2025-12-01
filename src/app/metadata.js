// Import your images from src/assets
import ferryImage from "./assets/mafiaFerry.png";
import logoImage from "./assets/mafiaFerry.png";

export const defaultMetadata = {
  // ---- BASIC SEO ----
  title: "MafiaFerry – Official Partner to Mafia Island, Tanzania",
  description:
    "Book the official ferry to Mafia Island from Nyamisati, Tanzania. Safe, reliable daily trips with modern vessels, verified crew, and secure online booking.",
  keywords:
    "mafia ferry, mafia island ferry, ferry to mafia island, nyamisati ferry, kilindoni ferry, mafia island transport, boat to mafia island, mafia ferry booking, tanzania ferry, mafia island travel, how to get to mafia island",

  // ---- BASE URL ----
  metadataBase: "https://www.mafiaferry.vercel.app",

  // ---- OPEN GRAPH ----
  openGraph: {
    title: "MafiaFerry – Safe & Reliable Ferry to Mafia Island",
    description:
      "Travel safely to Mafia Island with the official ferry service. Daily departures, modern vessels, professional crew, and trusted booking.",
    url: "https://www.mafiaferry.vercel.app",
    siteName: "MafiaFerry",
    type: "website",
    locale: "en_US",

    images: [
      {
        url: ferryImage,
        width: 1200,
        height: 630,
        alt: "Mafia Ferry – Official Transport to Mafia Island",
      },
    ],
  },

  // ---- TWITTER ----
  twitter: {
    card: "summary_large_image",
    title: "MafiaFerry – Book Your Trip to Mafia Island",
    description:
      "Book your official ferry to Mafia Island. Safe, daily transportation from Nyamisati to Kilindoni. Fast booking & reliable service.",
    images: [ferryImage],
    creator: "@mafiaferry", // leave empty if no account
  },

  // ---- ROBOTS ----
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

  // ---- VERIFICATION ----
  verification: {
    google: "",
    pinterest: "",
    yandex: "",
  },

  // ---- ALTERNATE / CANONICAL ----
  alternates: {
    canonical: "https://www.mafiaferry.vercel.app",
    languages: {
      en: "https://www.mafiaferry.vercel.app",
      "x-default": "https://www.mafiaferry.vercel.app",
    },
  },

  // ---- ORGANIZATION (for schema) ----
  organization: {
    name: "MafiaFerry",
    legalName: "Mafia Island Ferry Services",
    url: "https://www.mafiaferry.vercel.app",
    logo: logoImage,
  },
};