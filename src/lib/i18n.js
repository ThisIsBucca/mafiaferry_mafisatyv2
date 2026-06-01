'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import translations from './translations'

const I18nContext = createContext()

function getInitialLocale() {
  if (typeof window === 'undefined') return 'sw'
  const stored = localStorage.getItem('locale')
  if (stored === 'en' || stored === 'sw') return stored
  const browserLang = navigator.language?.split('-')[0]
  return browserLang === 'en' ? 'en' : 'sw'
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState('sw')

  useEffect(() => {
    setLocaleState(getInitialLocale())
  }, [])

  const setLocale = useCallback((newLocale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    document.documentElement.lang = newLocale === 'en' ? 'en' : 'sw'
  }, [])

  const t = useCallback((key) => {
    return translations[locale]?.[key] ?? translations.en?.[key] ?? key
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export { translations }
