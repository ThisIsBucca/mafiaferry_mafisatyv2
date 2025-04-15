import { supabase } from './supabase'
import { useAuth } from '../contexts/AuthContext'

// Track page view
export async function trackPageView() {
  const { user } = useAuth()
  const pagePath = window.location.pathname
  const referrer = document.referrer
  const userAgent = navigator.userAgent
  const deviceType = getDeviceType()

  try {
    await supabase.from('analytics_pageviews').insert({
      user_id: user?.id,
      page_path: pagePath,
      referrer,
      user_agent: userAgent,
      device_type: deviceType
    })
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

// Track custom event
export async function trackEvent(eventType, eventData = {}) {
  const { user } = useAuth()
  const pagePath = window.location.pathname

  try {
    await supabase.from('analytics_events').insert({
      user_id: user?.id,
      event_type: eventType,
      event_data: eventData,
      page_path: pagePath
    })
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

// Track session
export async function trackSession() {
  const { user } = useAuth()
  const sessionStart = new Date()

  try {
    const { data: session } = await supabase.from('analytics_sessions').insert({
      user_id: user?.id,
      session_start: sessionStart
    }).select().single()

    // Store session ID for later updates
    window.sessionId = session.id

    // Track session end when user leaves
    window.addEventListener('beforeunload', () => {
      const sessionEnd = new Date()
      const duration = Math.floor((sessionEnd - sessionStart) / 1000)
      
      supabase.from('analytics_sessions').update({
        session_end: sessionEnd,
        duration_seconds: duration
      }).eq('id', session.id)
    })
  } catch (error) {
    console.error('Error tracking session:', error)
  }
}

// Helper function to determine device type
function getDeviceType() {
  const ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile'
  }
  return 'desktop'
}

// Track form submissions
export function trackFormSubmission(formId, formData) {
  trackEvent('form_submission', {
    form_id: formId,
    form_data: formData
  })
}

// Track button clicks
export function trackButtonClick(buttonId, buttonText) {
  trackEvent('button_click', {
    button_id: buttonId,
    button_text: buttonText
  })
}

// Track link clicks
export function trackLinkClick(linkUrl, linkText) {
  trackEvent('link_click', {
    link_url: linkUrl,
    link_text: linkText
  })
} 