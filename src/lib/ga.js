// Google Analytics 4 Measurement ID
const GA_MEASUREMENT_ID = 'G-TKFV5E8GLS' // Updated Measurement ID

// Initialize Google Analytics
export function initGA() {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', GA_MEASUREMENT_ID)
  }
}

// Track page views
export function trackPageViewGA(path) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href
    })
  }
}

// Track custom events
export function trackEventGA(eventName, eventParams = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams)
  }
}

// Track user engagement
export function trackUserEngagementGA(engagementType, details = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'user_engagement', {
      engagement_type: engagementType,
      ...details
    })
  }
}

// Track form submissions
export function trackFormSubmissionGA(formId, formData) {
  trackEventGA('form_submit', {
    form_id: formId,
    form_name: formData.name || 'unnamed_form',
    form_data: JSON.stringify(formData)
  })
}

// Track button clicks
export function trackButtonClickGA(buttonId, buttonText) {
  trackEventGA('button_click', {
    button_id: buttonId,
    button_text: buttonText
  })
}

// Track link clicks
export function trackLinkClickGA(linkUrl, linkText) {
  trackEventGA('link_click', {
    link_url: linkUrl,
    link_text: linkText
  })
}

// Track session duration
export function trackSessionDurationGA(duration) {
  trackEventGA('session_duration', {
    duration_seconds: duration
  })
}

// Track device information
export function trackDeviceInfoGA() {
  const deviceInfo = {
    device_type: getDeviceType(),
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    user_agent: navigator.userAgent
  }
  
  trackEventGA('device_info', deviceInfo)
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