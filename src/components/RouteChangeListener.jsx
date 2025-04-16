import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../lib/analytics'
import { trackPageViewGA } from '../lib/ga'

export function RouteChangeListener() {
  const location = useLocation()

  useEffect(() => {
    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(() => {
      console.log('Route changed to:', location.pathname)
      trackPageView()
      trackPageViewGA(location.pathname)
    }, 100)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return null
} 