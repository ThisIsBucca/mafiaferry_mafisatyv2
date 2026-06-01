'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const GA_MEASUREMENT_ID = 'G-TKFV5E8GLS'

export function GoogleAnalyticsScript() {
  const pathname = usePathname()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    script.async = true
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pathname,
      send_page_view: true,
    })

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
        page_title: document.title,
      })
    }
  }, [pathname])

  return null
}
