import { useEffect, useRef, useState } from 'react'
import { Anchor, Ship, Calendar, MapPin, Phone, Clock, Info } from 'lucide-react'
import { motion, useAnimation, useScroll } from 'framer-motion'

export function ScrollingBanner() {
  const containerRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)
  const controls = useAnimation()
  const { scrollY } = useScroll()

  const announcements = [
    {
      icon: <Anchor className="h-4 w-4" />,
      text: "Karibu Mafiaferry",
      highlight: true
    },
    {
      icon: <Ship className="h-4 w-4" />,
      text: "Ratiba za Meli"
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      text: "Kila Siku Kiswani Mafia"
    },
    {
      icon: <Phone className="h-4 w-4" />,
      text: "Tupigie: 0776986840"
    },
    {
      icon: <Clock className="h-4 w-4" />,
      text: "Tupo Tayari Kuwahudumia"
    },
    {
      icon: <Info className="h-4 w-4" />,
      text: "Safari za Uhakika na Salama"
    }
  ]

  useEffect(() => {
    let timeoutId
    
    const startAnimation = () => {
      controls.start({
        x: "-50%",
        transition: {
          duration: 30,
          ease: "linear",
          repeat: Infinity
        }
      })
    }

    if (!isPaused) {
      timeoutId = setTimeout(startAnimation, 0)
    } else {
      controls.stop()
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [controls, isPaused])

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { top, bottom } = containerRef.current.getBoundingClientRect()
        const isVisible = top < window.innerHeight && bottom > 0
        setIsPaused(!isVisible)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  const renderAnnouncements = () => {
    return announcements.map((item, index) => (
      <div
        key={index}
        className="flex items-center px-4 py-1"
      >
        <div className={`flex items-center gap-2 ${
          item.highlight 
            ? 'text-primary font-semibold' 
            : 'text-foreground/90'
        }`}>
          {item.icon}
          <span>{item.text}</span>
        </div>
        {index < announcements.length - 1 && (
          <div className="mx-4 h-4 w-px bg-primary/20" />
        )}
      </div>
    ))
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gradient-to-r from-primary/5 via-background to-primary/5"
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
      
      {/* Banner content */}
      <div 
        className="relative py-3 border-y border-primary/10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div 
          className="inline-flex whitespace-nowrap items-center"
          animate={controls}
        >
          {/* First set of announcements */}
          <div className="flex items-center">{renderAnnouncements()}</div>
          
          {/* Duplicate for seamless loop */}          <div className="flex items-center">{renderAnnouncements()}</div>
        </motion.div>
      </div>
    </div>
  )
} 