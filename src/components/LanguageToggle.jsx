'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../lib/i18n'

const FLAG = {
  en: 'https://flagcdn.com/w20/gb.png',
  sw: 'https://flagcdn.com/w20/tz.png',
}

export function LanguageToggle() {
  const { locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const isEn = locale === 'en'

  const toggle = (lang) => {
    setLocale(lang)
    setOpen(false)
  }

  return (
    <div className="fixed left-3 md:left-5 top-[180px] md:top-[170px] z-[999]">
      {/* Desktop: vertical pill */}
      <div className="hidden md:block">
        <motion.button
          onClick={() => setLocale(isEn ? 'sw' : 'en')}
          className="relative flex flex-col items-stretch gap-0 rounded-2xl overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle language"
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'var(--glass)',
              backdropFilter: 'var(--glass-blur)',
              border: '1.5px solid hsl(var(--border) / 0.4)',
              boxShadow: 'var(--shadow-card)',
            }}
          />
          <div
            className="absolute h-1/2 w-full rounded-xl transition-all duration-500"
            style={{
              top: isEn ? '3px' : 'calc(50% + 8px)',
              background: 'var(--gradient-accent)',
              boxShadow: 'var(--shadow-btn-glow)',
              left: '3px',
              width: 'calc(100% - 6px)',
            }}
          />
          {['en', 'sw'].map((lang) => {
            const active = locale === lang
            return (
              <div
                key={lang}
                className="relative flex items-center gap-2 px-3 py-2.5 z-10 transition-all duration-300"
              >
                <img src={FLAG[lang]} alt="" className="w-4 h-3 rounded-sm object-cover" />
                <span
                  className={`text-[10px] font-black uppercase tracking-wider leading-none transition-all duration-300 ${
                    active ? 'text-white' : 'text-muted-foreground/50'
                  }`}
                >
                  {lang}
                </span>
              </div>
            )
          })}
        </motion.button>
      </div>

      {/* Mobile: collapsible */}
      <div className="md:hidden">
        <AnimatePresence>
          {open ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.9, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative flex flex-col gap-1 rounded-2xl overflow-hidden p-1.5"
              style={{
                background: 'var(--glass)',
                backdropFilter: 'var(--glass-blur)',
                border: '1.5px solid hsl(var(--border) / 0.4)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {['sw', 'en'].map((lang) => {
                const active = locale === lang
                return (
                  <button
                    key={lang}
                    onClick={() => toggle(lang)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'text-white'
                        : 'text-muted-foreground/60 hover:text-foreground'
                    }`}
                    style={active ? { background: 'var(--gradient-accent)' } : {}}
                  >
                    <img src={FLAG[lang]} alt="" className="w-6 h-4.5 rounded object-cover" />
                    <span className="text-sm font-bold uppercase tracking-wider">
                      {lang === 'en' ? 'English' : 'Kiswahili'}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="mobile-check"
                        className="ml-auto"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </motion.div>
                    )}
                  </button>
                )
              })}
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              onClick={() => setOpen(true)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl"
              style={{
                background: 'var(--glass)',
                backdropFilter: 'var(--glass-blur)',
                border: '1.5px solid hsl(var(--border) / 0.4)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <img src={FLAG[locale]} alt="" className="w-6 h-4.5 rounded object-cover" />
              <span className="text-sm font-bold uppercase tracking-wider text-foreground">
                {locale}
              </span>
              <svg className="w-3.5 h-3.5 text-muted-foreground/60 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
