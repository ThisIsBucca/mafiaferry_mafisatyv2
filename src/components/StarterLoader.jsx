'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  const saved = localStorage.getItem('theme') ?? 'dark'
  if (saved === 'dark') document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
  return saved
}

export default function StarterLoader({ onFinish }) {
  const [isVisible, setIsVisible] = useState(true)
  const [ready, setReady] = useState(false)
  const [theme] = useState(getInitialTheme)

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true)
      setTimeout(() => {
        setIsVisible(false)
        onFinish?.()
      }, 500)
    }, 2200)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            transition={{ duration: 1.5 }}
          >
            <div
              className="absolute -top-1/2 -left-1/2 w-full h-full"
              style={{
                background:
                  theme === 'dark'
                    ? 'radial-gradient(ellipse at 30% 50%, hsl(var(--primary) / 0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, hsl(var(--accent) / 0.2) 0%, transparent 60%)'
                    : 'radial-gradient(ellipse at 30% 50%, hsl(var(--primary) / 0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, hsl(var(--accent) / 0.08) 0%, transparent 60%)',
              }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            <svg
              viewBox="0 0 1440 200"
              preserveAspectRatio="none"
              className="absolute bottom-0 w-full h-full"
            >
              <defs>
                <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={theme === 'dark' ? 0.2 : 0.1} />
                  <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity={theme === 'dark' ? 0.15 : 0.08} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={theme === 'dark' ? 0.2 : 0.1} />
                </linearGradient>
              </defs>
              <motion.path
                fill="url(#waveGrad)"
                d="M0,128 C360,160 1080,96 1440,128 L1440,200 L0,200 Z"
                animate={{
                  d: [
                    'M0,128 C360,160 1080,96 1440,128 L1440,200 L0,200 Z',
                    'M0,140 C360,100 1080,160 1440,140 L1440,200 L0,200 Z',
                    'M0,128 C360,160 1080,96 1440,128 L1440,200 L0,200 Z',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.path
                fill="url(#waveGrad)"
                d="M0,148 C240,180 600,120 1440,148 L1440,200 L0,200 Z"
                animate={{
                  d: [
                    'M0,148 C240,180 600,120 1440,148 L1440,200 L0,200 Z',
                    'M0,160 C240,130 600,170 1440,160 L1440,200 L0,200 Z',
                    'M0,148 C240,180 600,120 1440,148 L1440,200 L0,200 Z',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
            </svg>
          </motion.div>

          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', type: 'spring', stiffness: 100 }}
              className="relative"
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, hsl(var(--primary) / 0.25) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              <motion.div
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden"
                style={{
                  boxShadow: '0 0 40px hsl(var(--primary) / 0.25), 0 0 80px hsl(var(--primary) / 0.08)',
                  border: '2px solid hsl(var(--primary) / 0.15)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 40px hsl(var(--primary) / 0.25), 0 0 80px hsl(var(--primary) / 0.08)',
                    '0 0 60px hsl(var(--primary) / 0.4), 0 0 120px hsl(var(--primary) / 0.15)',
                    '0 0 40px hsl(var(--primary) / 0.25), 0 0 80px hsl(var(--primary) / 0.08)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.img
                  src="/mafia_ferry.png"
                  alt="MafiaFerry"
                  className="w-full h-full object-cover"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.h1
                className="text-2xl md:text-3xl font-bold tracking-wider font-display"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                MafiaFerry
              </motion.h1>

              <span className="text-xs text-muted-foreground/60 tracking-[0.2em] uppercase font-light">
                Official Ferry to Mafia Island
              </span>
            </motion.div>

            <motion.div
              className="flex gap-1.5"
              animate={{ opacity: ready ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary/60"
                  animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
