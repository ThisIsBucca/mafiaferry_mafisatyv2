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
import { AnalyticsProvider } from './components/AnalyticsProvider'
import { initializeDatabase } from "./lib/initDb"
import { useEffect } from "react"

const queryClient = new QueryClient()

export default function App() {
  useEffect(() => {
    initializeDatabase()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}>
          <AnalyticsProvider>
            <Toaster position="top-right" />
          </AnalyticsProvider>
        </RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
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
