import ferryImage from './assets/mafiaFerry.png';


export const defaultMetadata = {
  title: 'MafiaFerry – Book the Official Ferry to Mafia Island, Tanzania',
  description:
    'Book safe and reliable ferry services to Mafia Island from Nyamisati, Tanzania. Check daily schedules, modern vessels, secure booking, and trusted transport to Kilindoni, Mafia Island.',
  keywords:
    'mafia island ferry, ferry to mafia island, mafia island transport, nyamisati to mafia island, kilindoni ferry, how to get to mafia island, mafia island travel, mafia island tickets, mafia island tours, mafia island whalesharks, mafia ferry booking, Tanzania ferry service, MafiaFerry, usafiri wa mafia, safari mafia island, boat to mafia island',
  openGraph: {
    title: 'MafiaFerry – Official Ferry to Mafia Island | Safe & Reliable',
    description:
      'Travel to Mafia Island with the official ferry service. Modern vessels, professional crew, and daily departures. Smooth and safe transport from Nyamisati to Kilindoni.',
    images: [
      {
        url: ferryImage,
        width: 1200,
        height: 630,
        alt: 'MV Kilindoni – Ferry to Mafia Island',
      },
    ],
    locale: 'en_US',
    type: 'website',
    siteName: 'MafiaFerry',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MafiaFerry – Book Your Ferry to Mafia Island',
    description:
      'Reserve your ferry to Mafia Island. Fast, safe, and reliable maritime transport with daily schedules.',
    images: [
      ferryImage,
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'add-your-google-site-verification-here',
  },
};
