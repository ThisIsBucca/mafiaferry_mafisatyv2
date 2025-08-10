import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Calendar, Clock, MapPin, Ship } from "lucide-react"
import { useEffect, useState } from "react"

export function Hero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const images = [
    {
      url: 'https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//ferrydaw.jpg',
      caption: 'Pwani ya Utende'
    },
    {
      url: 'https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//openart-image_qq2r6JCc_1743214522482_raw.jpg',
      caption: 'Mto wa Rufiji'
    },
    {
      url: 'https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//image%20(6).jpg',
      caption: 'Meli ya Kisasa'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const scrollToContent = () => {
    const nextSection = document.getElementById('schedule')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden pt-16 sm:pt-0 pb-8 sm:pb-0 bg-gradient-to-br from-background via-primary/10 to-accent/10">
      {/* Background images with parallax effect */}
      {images.map((image, index) => (
        <motion.div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('${image.url}')`,
            filter: 'brightness(0.6)'
          }}
          animate={{
            scale: index === currentImageIndex ? 1.05 : 1,
          }}
          transition={{
            duration: 6,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Content with improved layout and theme correspondence */}
      <div className="container mx-auto px-2 sm:px-4 relative z-10 flex flex-col items-center justify-center h-full">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="w-full flex flex-col items-stretch justify-center text-center max-w-5xl mx-auto gap-4 md:gap-12 md:rounded-3xl md:shadow-xl transition-all duration-300"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Redesigned Hero Content: Modern, minimal, glassmorphic, mobile-first */}
          <div className="w-full max-w-lg mx-auto mb-8 bg-white/20 dark:bg-black/30 backdrop-blur-3xl rounded-3xl flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 relative shadow-2xl border-0" style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.12)' }}>
            <motion.div
              variants={itemVariants}
              className="mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={currentImageIndex}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-background/60 backdrop-blur text-primary text-xs font-semibold shadow border border-primary/10">
                {images[currentImageIndex].caption}
              </span>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="relative mb-2 w-full"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary-foreground drop-shadow-xl tracking-tight font-display mb-2">
                Mafiaferry
              </h1>
              <h2 className="text-lg sm:text-2xl font-semibold text-foreground/90 font-display mb-3 drop-shadow-md tracking-tight">
                Habari za Usafiri wa Majini Kisiwa cha Mafia Online
              </h2>
              <p className="text-base sm:text-lg text-foreground/80 max-w-md mx-auto font-medium mb-4">
                Taarifa za Vyombo vya Usafiri wa Majini Kati ya Mafia na Bara
              </p>
              {/* Feature list for visual appeal */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-5">
                <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-3 py-1 text-primary text-xs sm:text-sm font-semibold shadow-sm">
                  <Ship className="w-4 h-4 sm:w-5 sm:h-5" /> Meli za Kisasa
                </div>
                <div className="flex items-center gap-2 bg-accent/10 rounded-xl px-3 py-1 text-accent text-xs sm:text-sm font-semibold shadow-sm">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" /> Ratiba za Kila Siku
                </div>
                <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-3 py-1 text-primary text-xs sm:text-sm font-semibold shadow-sm">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> Huduma ya Wakati
                </div>
              </div>
              <button
                onClick={scrollToContent}
                className="mt-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-bold shadow-lg hover:bg-primary/90 transition-colors text-base sm:text-lg"
              >
                Jifunze Zaidi
              </button>
              {/* Animated accent circles for depth */}
              <motion.div
                className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary/30 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.13, 0.22, 0.13],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-accent/20 rounded-full blur-2xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.18, 0.10, 0.18],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
      {/* Overlay gradient with interactive hover effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-background/90 via-primary/30 to-accent/20 pointer-events-none z-0"
        animate={{
          opacity: isHovering ? 0.7 : 1
        }}
        transition={{ duration: 0.3 }}
      />
    </section>
  )
}