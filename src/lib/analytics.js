import { supabase } from './supabase'

// Track page view
export async function trackPageView(path) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || 'anonymous'
    
    const { error } = await supabase
      .from('analytics_pageviews')
      .insert({
        path,
        user_id: userId,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        is_authenticated: !!session?.user
      })

    if (error) {
      console.error('Error tracking page view:', error)
    }
  } catch (error) {
    console.error('Error in trackPageView:', error)
  }
}

// Track custom event
export async function trackEvent(category, action, label) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || 'anonymous'
    
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        category,
        action,
        label,
        user_id: userId,
        is_authenticated: !!session?.user
      })

    if (error) {
      console.error('Error tracking event:', error)
    }
  } catch (error) {
    console.error('Error in trackEvent:', error)
  }
}

// Track session
export async function trackSession(userId) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const currentUserId = userId || session?.user?.id || 'anonymous'
    
    const { error } = await supabase
      .from('analytics_sessions')
      .insert({
        user_id: currentUserId,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        is_authenticated: !!session?.user
      })

    if (error) {
      console.error('Error tracking session:', error)
    }
  } catch (error) {
    console.error('Error in trackSession:', error)
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
  console.log('Tracking form submission:', { formId, formData })
  trackEvent('form_submission', {
    form_id: formId,
    form_data: formData
  })
}

// Track button clicks
export function trackButtonClick(buttonId, buttonText) {
  console.log('Tracking button click:', { buttonId, buttonText })
  trackEvent('button_click', {
    button_id: buttonId,
    button_text: buttonText
  })
}

// Track link clicks
export function trackLinkClick(linkUrl, linkText) {
  console.log('Tracking link click:', { linkUrl, linkText })
  trackEvent('link_click', {
    link_url: linkUrl,
    link_text: linkText
  })
} 