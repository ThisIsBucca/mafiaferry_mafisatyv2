import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView, trackSession } from '../lib/analytics'
import { initGA, trackPageViewGA, trackDeviceInfoGA, trackSessionDurationGA } from '../lib/ga'

export function AnalyticsProvider({ children }) {
  const location = useLocation()

  useEffect(() => {
    // Initialize Google Analytics
    initGA()
    // Track device information
    trackDeviceInfoGA()
  }, [])

  useEffect(() => {
    // Track page view on route change
    trackPageView()
    trackPageViewGA(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    // Track session on component mount
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