import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { Navbar } from "./components/navbar"
import { Hero } from "./components/hero"
import { Schedule } from "./components/schedule"
import { NewsUpdates } from "./components/news-updates"
import { Contact } from "./components/contact"
import { Footer } from "./components/footer"
import { ScrollToTop } from "./components/scroll-to-top"
import { SupportBanner } from "./components/support-banner"
import { Toaster } from "react-hot-toast"

// Add this near the top of your App.jsx, before the App component
const initializeTheme = `
  if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
  }
`

export function App() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: initializeTheme }} />
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
          success: {
            iconTheme: {
              primary: 'hsl(var(--primary))',
              secondary: 'hsl(var(--primary-foreground))',
            },
          },
        }}
      />
    </>
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

export default App
