import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Calendar, Clock, MapPin, Ship } from "lucide-react"

export function Hero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

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

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
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
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container relative px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 sm:mb-8">
            <Ship className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">Mafia Island Ferry</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
          >
            <span className="text-foreground">
              Your Gateway to Mafia Island
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto"
          >
            Experience seamless travel between Mafia Island and Nyamisati with our reliable ferry services. Book your journey today and discover the beauty of Tanzania's hidden gem.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto"
          >
            <div className="flex flex-col items-center p-4 sm:p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <Calendar className="w-6 h-6 text-primary mb-2" />
              <h3 className="text-sm sm:text-base font-medium mb-1">Daily Schedules</h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center">Regular departures throughout the week</p>
            </div>

            <div className="flex flex-col items-center p-4 sm:p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <Clock className="w-6 h-6 text-primary mb-2" />
              <h3 className="text-sm sm:text-base font-medium mb-1">On-Time Service</h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center">Reliable and punctual departures</p>
            </div>

            <div className="flex flex-col items-center p-4 sm:p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <MapPin className="w-6 h-6 text-primary mb-2" />
              <h3 className="text-sm sm:text-base font-medium mb-1">Convenient Routes</h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center">Direct connections to key destinations</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 