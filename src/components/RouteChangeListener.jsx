import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../lib/analytics'
import { trackPageViewGA } from '../lib/ga'

export function RouteChangeListener() {
  const location = useLocation()

  useEffect(() => {
    trackPageView()
    trackPageViewGA(location.pathname)
  }, [location.pathname])

  return null
} 