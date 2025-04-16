import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Google Analytics measurement ID
const GA_MEASUREMENT_ID = 'G-TKFV5E8GLS'

// Initialize Google Analytics
export function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    // Load Google Analytics script
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    script.async = true
    document.head.appendChild(script)

    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname,
      send_page_view: false // We'll handle page views manually
    })

    return () => {
      // Clean up script when component unmounts
      document.head.removeChild(script)
    }
  }, [])

  // Track page views when location changes
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname,
        page_title: document.title
      })
    }
  }, [location.pathname])

  return null
} 