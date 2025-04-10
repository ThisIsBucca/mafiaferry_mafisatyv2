import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Calendar, Clock, MapPin, Ship, ChevronDown, ArrowRight } from "lucide-react"
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
      caption: 'Utende Beach'
    },
    {
      url: 'https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//openart-image_qq2r6JCc_1743214522482_raw.jpg',
      caption: 'River Rufiji'
    },
    {
      url: 'https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//Runway%202025-02-12T17_59_48.795Z%20Erase%20and%20Replace%20remove%20this%20icons.png',
      caption: 'Bucca the CEO 😎'
    },
    {
      url: 'https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//image%20(6).jpg',
      caption: 'Ship on way to Mafia Island'
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
    <section className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden pt-16 sm:pt-0 pb-8 sm:pb-0">
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

      {/* Image navigation dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {images.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentImageIndex ? 'bg-primary' : 'bg-white/50'
            }`}
            whileHover={{ scale: 1.2 }}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
      
      {/* Overlay gradient with interactive hover effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/60 to-background/90"
        animate={{
          opacity: isHovering ? 0.7 : 1
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Enhanced animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
            x: [0, -20, 0],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content with enhanced interactions */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Image caption back in original position */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentImageIndex}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white/90 text-sm font-medium">
              {images[currentImageIndex].caption}
            </span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white relative z-10 font-display">
              Your Gateway
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-primary-foreground font-display mt-2">
              to Mafia Island
            </h1>
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary/20 rounded-full blur-3xl"
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
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
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

          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-white/90 mb-8 relative z-10"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            Experience the beauty of Tanzania's hidden gem with our reliable ferry services
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
          >
            {[
              { icon: Ship, text: "Modern Ferries" },
              { icon: Calendar, text: "Daily Schedules" },
              { icon: Clock, text: "On Time Service" },
              { icon: MapPin, text: "Multiple Routes" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.15)"
                }}
                transition={{ duration: 0.2 }}
              >
                <item.icon className="w-8 h-8 mx-auto mb-2 text-white" />
                <p className="text-white text-sm">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer"
            animate={{
              y: [0, 10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            onClick={scrollToContent}
          >
            <ChevronDown className="w-8 h-8 text-white/60 hover:text-white transition-colors" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 