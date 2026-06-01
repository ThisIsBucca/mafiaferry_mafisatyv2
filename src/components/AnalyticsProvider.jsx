'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { trackPageView, trackEvent, trackSession } from '../lib/analytics'

export function AnalyticsProvider({ children }) {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname)
    }

    // Track session
    const trackUserSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          trackSession(session.user.id)
        }
      } catch (error) {
        console.error('Error tracking session:', error)
      }
    }
    trackUserSession()

    // Track events
    const handleClick = (e) => {
      const target = e.target.closest('[data-analytics]')
      if (target) {
        const { category, action, label } = target.dataset
        if (category && action) {
          trackEvent(category, action, label)
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname])

  return children
} 