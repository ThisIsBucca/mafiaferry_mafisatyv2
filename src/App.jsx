import { RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./contexts/AuthContext"
import { router } from "./router"
import { Toaster } from "react-hot-toast"
import { Navbar } from "./components/navbar"
import { Hero } from "./components/hero"
import { Schedule } from "./components/schedule"
import { NewsUpdates } from "./components/news-updates"
import { Contact } from "./components/contact"
import { Footer } from "./components/footer"
import { ScrollToTop } from "./components/scroll-to-top"
import { SupportBanner } from "./components/support-banner"
import { initializeDatabase } from "./lib/initDb"
import { useEffect } from "react"
import { AnalyticsProvider } from './components/AnalyticsProvider'

const queryClient = new QueryClient()

export default function App() {
  useEffect(() => {
    initializeDatabase()
  }, [])

  return (
    <AnalyticsProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </AnalyticsProvider>
  )
}

export function MainContent() {
  return (
    <>
      <SupportBanner />
      <Navbar />
      <main>
        <Hero />
        <Schedule />
        <NewsUpdates />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
