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
          className="w-full flex flex-col md:flex-row items-stretch justify-center text-center max-w-5xl mx-auto gap-4 md:gap-12 md:rounded-3xl md:shadow-xl transition-all duration-300"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Left: Title, subtitle, description */}
          <div className="w-full md:w-1/2 mb-4 md:mb-0 bg-glass card shadow-lg md:shadow-2xl p-4 sm:p-8 md:p-10 rounded-2xl flex flex-col items-center justify-center min-h-[320px]">
            <motion.div
              variants={itemVariants}
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={currentImageIndex}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm text-primary text-sm font-medium shadow">
                {images[currentImageIndex].caption}
              </span>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="relative mb-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary-foreground relative z-10 font-display drop-shadow-lg">
                Mafiaferry
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground/90 font-display mt-2 drop-shadow-md">
                Habari za Usafiri wa Majini Kisiwa cha Mafia Online
              </h2>
              <p className="mt-4 text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
                Taarifa za Vyombo vya Usafiri wa Majini Kati ya Mafia na Bara
              </p>
              <motion.div
                className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary/30 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent/20 rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.2, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
          {/* Right: Feature grid with carousel */}
          <div className="w-full md:w-1/2 bg-glass card shadow-lg md:shadow-2xl p-4 sm:p-8 md:p-10 rounded-2xl flex flex-col items-center justify-center min-h-[380px] relative overflow-visible">
            {/* Carousel UI moved inside feature grid card */}
            <div className="w-full flex flex-col items-center mb-6 relative z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 dark:bg-black/60 border border-primary/40 shadow-lg hover:bg-primary/20 hover:dark:bg-primary/30 transition-colors duration-200 text-primary dark:text-accent focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)}
                  aria-label="Previous image"
                  disabled={images.length <= 1}
                  type="button"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3.2" viewBox="0 0 24 24" className="mx-auto drop-shadow-md">
                    <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.2" />
                  </svg>
                </button>
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full border border-primary/30 transition-all duration-200 mx-1 ${
                      index === currentImageIndex ? 'bg-primary shadow-lg shadow-primary/30 scale-110' : 'bg-accent/40'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                    type="button"
                  />
                ))}
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 dark:bg-black/60 border border-primary/40 shadow-lg hover:bg-primary/20 hover:dark:bg-primary/30 transition-colors duration-200 text-primary dark:text-accent focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
                  aria-label="Next image"
                  disabled={images.length <= 1}
                  type="button"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3.2" viewBox="0 0 24 24" className="mx-auto drop-shadow-md">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.2" />
                  </svg>
                </button>
              </div>
              <div className="mt-1 text-xs text-foreground/70 font-medium bg-background/80 px-3 py-1 rounded-full shadow backdrop-blur-sm">
                {images[currentImageIndex].caption}
              </div>
              {/* Decorative circle behind carousel for depth */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary/10 blur-2xl z-0"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.13, 0.22, 0.13],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            {/* Feature grid below carousel */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 gap-3 sm:gap-4 mb-0 w-full z-10"
            >
              {[
                { icon: Ship, text: "Meli za Kisasa" },
                { icon: Calendar, text: "Ratiba za Kila Siku" },
                { icon: Clock, text: "Huduma ya Wakati" },
                { icon: MapPin, text: "Njia Nyingi" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-glass border border-primary/10 shadow-lg rounded-xl p-4 cursor-pointer hover:bg-primary/20 hover:shadow-2xl transition-all duration-200 flex flex-col items-center group"
                  whileHover={{ 
                    scale: 1.07,
                    y: -2
                  }}
                  transition={{ duration: 0.22 }}
                >
                  <item.icon className="w-9 h-9 mx-auto mb-2 text-primary drop-shadow group-hover:text-accent transition-colors duration-200" />
                  <p className="text-foreground/90 text-sm font-semibold tracking-wide group-hover:text-primary transition-colors duration-200 text-center">
                    {item.text}
                  </p>
                </motion.div>
              ))}
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