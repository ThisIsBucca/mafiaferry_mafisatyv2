import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView, trackSession } from '../lib/analytics'
import { initGA, trackPageViewGA, trackDeviceInfoGA, trackSessionDurationGA } from '../lib/ga'

export function AnalyticsProvider({ children }) {
  // Initialize Google Analytics and device tracking
  useEffect(() => {
    initGA()
    trackDeviceInfoGA()
  }, [])

  // Track page views and sessions
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined') {
      trackPageView()
      trackPageViewGA(window.location.pathname)
    }

    // Track session
    const sessionStart = new Date()
    trackSession()

    // Track session end when user leaves
    const handleBeforeUnload = () => {
      const sessionEnd = new Date()
      const duration = Math.floor((sessionEnd - sessionStart) / 1000)
      trackSessionDurationGA(duration)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return children
} 