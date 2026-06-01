'use client'

import { Navbar } from "../components/navbar"
import { Hero } from "../components/hero"
import { Schedule } from "../components/schedule"
import { NewsUpdates } from "../components/news-updates"
import { FaqSection } from "../components/FaqSection"
import { Contact } from "../components/contact"
import { Footer } from "../components/footer"
import { FloatingActions } from "../components/FloatingActions"
import { SupportBanner } from "../components/support-banner"
import { ScrollingBanner } from "../components/ScrollingBanner"
import { AnalyticsProvider } from "../components/AnalyticsProvider"
import { LanguageToggle } from "../components/LanguageToggle"

export default function HomePage() {
  return (
    <AnalyticsProvider>
      <LanguageToggle />
      <SupportBanner />
      <Navbar />
      <ScrollingBanner />
      <main>
        <Hero />
        <Schedule />
        <NewsUpdates />
        <FaqSection />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </AnalyticsProvider>
  )
}
