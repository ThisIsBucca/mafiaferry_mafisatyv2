'use client'

import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { FloatingActions } from "./FloatingActions"
import { SupportBanner } from "./support-banner"
import { ScrollingBanner } from "./ScrollingBanner"
import { AnalyticsProvider } from "./AnalyticsProvider"
import { LanguageToggle } from "./LanguageToggle"

export function PublicLayout({ children }) {
  return (
    <AnalyticsProvider>
      <LanguageToggle />
      <SupportBanner />
      <Navbar />
      <ScrollingBanner />
      <main>
        {children}
      </main>
      <Footer />
      <FloatingActions />
    </AnalyticsProvider>
  )
}
