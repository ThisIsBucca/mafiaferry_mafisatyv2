import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  useEffect(() => {
    const toggleVisibility = () => {
      // Calculate the scroll progress
      const winScroll = window.pageYOffset
      const height = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (winScroll / height) * 100
      
      setScrollProgress(Math.min(scrolled, 100))
      setIsVisible(winScroll > 200)
    }

    window.addEventListener("scroll", toggleVisibility)
    toggleVisibility() // Initial calculation
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="relative group">
            {/* Progress circle */}
            <svg
              className="absolute inset-0 transform -rotate-90 bg-white dark:bg-background/80 backdrop-blur-sm border border-gray-200 dark:border-primary/10 rounded-full transition-all duration-300 group-hover:bg-primary/95 group-hover:border-primary/20"
              width="64"
              height="64"
            >
              <circle
                cx="32"
                cy="32"
                r="28"
                className="fill-none stroke-gray-200/50 dark:stroke-primary/10 transition-colors duration-300 group-hover:stroke-white/20"
                strokeWidth="6"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                className="fill-none stroke-gray-600 dark:stroke-primary transition-colors duration-300 group-hover:stroke-white"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: scrollProgress / 100 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </svg>
            
            <button
              onClick={scrollToTop}
              className="relative z-10 p-4 rounded-full bg-white dark:bg-background/80 backdrop-blur-sm border border-gray-200 dark:border-primary/10 text-gray-600 dark:text-primary transition-all duration-300 group-hover:text-white group-hover:bg-primary group-hover:border-primary/20 shadow-lg group-hover:shadow-primary/25 focus:outline-none"
              style={{
                width: '64px',
                height: '64px'
              }}
              aria-label="Scroll to top"
            >
              <ArrowUp 
                className="h-6 w-6 mx-auto transform transition-transform duration-300 group-hover:-translate-y-1" 
              />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}