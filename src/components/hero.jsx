import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Star, Moon } from "lucide-react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

export function Hero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const particlesOptions = {
    fullScreen: { enable: false },
    fpsLimit: 120,
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"],
      },
      shape: {
        type: ["circle", "star", "polygon"],
        options: {
          polygon: {
            sides: 6,
          },
          star: {
            sides: 5,
          },
        },
      },
      opacity: {
        value: 0.8,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 6,
        random: true,
        anim: {
          enable: true,
          speed: 4,
          size_min: 0.3,
          sync: false,
        },
      },
      line_linked: {
        enable: false,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "top",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
    },
    retina_detect: true,
  }

  return (
    <section className="relative py-12 sm:py-20 overflow-hidden">
      {init && <Particles id="tsparticles" className="absolute inset-0 z-0" options={particlesOptions} />}

      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Eid Celebration Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary"
          >
            <Moon className="h-4 w-4" />
            <span className="text-sm font-medium">Eid Mubarak! Happy Eid al-Fitr</span>
            <Star className="h-4 w-4" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
          >
            Your Gateway to
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              {" "}
              Mafia Island
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 px-4"
          >
            Experience reliable ferry services connecting Mafia Island with mainland Tanzania
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#schedule"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              View Schedule
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto px-6 py-3 rounded-lg border hover:bg-muted transition-colors"
            >
              Contact Us
            </a>
          </motion.div>

          {/* Eid Special Offer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 p-4 border border-primary/20 rounded-lg bg-primary/5 inline-block"
          >
            <p className="text-sm font-medium">
              🎉 Eid Special: 20% off all ferry bookings until the end of the week! 🎉
            </p>
          </motion.div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-primary/20 rounded-full blur-3xl" />
      </div>
    </section>
  )
} 