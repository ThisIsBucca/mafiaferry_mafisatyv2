'use client'

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Play, Youtube } from "lucide-react"
import { useI18n } from "../lib/i18n"

const videos = [
  {
    id: 1,
    src: "https://www.youtube.com/embed/gDufYclBtoE",
    link: "https://youtu.be/gDufYclBtoE",
    title: "Mafia Island Adventure",
    thumbnail: "https://img.youtube.com/vi/gDufYclBtoE/maxresdefault.jpg",
  },
  {
    id: 2,
    src: "https://www.youtube.com/embed/knuJ3zVx69g",
    link: "https://youtu.be/knuJ3zVx69g",
    title: "Mafia Island Adventure",
    thumbnail: "https://img.youtube.com/vi/knuJ3zVx69g/maxresdefault.jpg",
  },
  {
    id: 3,
    src: "https://www.youtube.com/embed/FDGLZRbyIhY",
    link: "https://youtu.be/FDGLZRbyIhY",
    title: "Mafia Island Tour",
    thumbnail: "https://img.youtube.com/vi/FDGLZRbyIhY/maxresdefault.jpg",
  },
  {
    id: 4,
    src: "https://www.youtube.com/embed/KAsyMzZCPw4",
    link: "https://youtu.be/KAsyMzZCPw4",
    title: "Mafia Island Experience",
    thumbnail: "https://img.youtube.com/vi/KAsyMzZCPw4/maxresdefault.jpg",
  },
  {
    id: 5,
    src: "https://www.youtube.com/embed/Mx_0xt5q4VE",
    link: "https://youtu.be/Mx_0xt5q4VE",
    title: "Mafia Island Adventure",
    thumbnail: "https://img.youtube.com/vi/Mx_0xt5q4VE/maxresdefault.jpg",
  },
  {
    id: 6,
    src: "https://www.youtube.com/embed/zKXLDBgHe58",
    link: "https://youtu.be/zKXLDBgHe58",
    title: "Mafia Island Adventure",
    thumbnail: "https://img.youtube.com/vi/zKXLDBgHe58/maxresdefault.jpg",
  },
]

const MOBILE_LIMIT = 3

export function FeaturedVideos() {
  const { t } = useI18n()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [playing, setPlaying] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const visible = showAll || !isMobile ? videos : videos.slice(0, MOBILE_LIMIT)

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />
      <div className="absolute inset-0 bg-grid-primary/[0.03] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="container relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <Youtube className="w-4 h-4 text-red-500" />
            <span>{t("videos.badge")}</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary mb-4 leading-tight">
            {t("videos.title")}
          </h2>

          <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg leading-relaxed">
            {t("videos.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {visible.map((video) => (
            <div key={video.id}>
              {playing === video.id ? (
                <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-xl border border-border/40">
                  <iframe
                    src={`${video.src}?autoplay=1&rel=0`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div
                  onClick={() => setPlaying(video.id)}
                  className="group relative aspect-video rounded-2xl overflow-hidden bg-black cursor-pointer border border-border/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center transition-all duration-300 group-hover:bg-red-600/80 group-hover:border-red-500">
                        <Play className="w-7 h-7 text-white ml-0.5" fill="white" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-red-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                      <Youtube className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-[10px] font-semibold text-white/80">YouTube</span>
                    </div>
                    <span className="text-[10px] font-medium text-white/60 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">HD</span>
                  </div>

                  <div className="absolute top-3 left-3 right-3">
                    <h3 className="text-sm font-bold text-white drop-shadow-md line-clamp-1">{video.title}</h3>
                  </div>

                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/0 group-hover:ring-red-500/30 transition-all duration-500 pointer-events-none" />
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {videos.length > MOBILE_LIMIT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center mt-8"
          >
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-sm font-semibold text-primary transition-all hover:scale-105 active:scale-95"
            >
              {showAll ? "View Less" : "View All Videos"}
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-14 max-w-2xl mx-auto"
        >
          <p className="text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight">
            Ready to Experience Mafia Island?
          </p>
          <p className="text-muted-foreground/80 mb-7 leading-relaxed">
            Book your excursion, cheap flights, and ferry tickets — we handle everything so you just enjoy paradise.
          </p>
          <a
            href="https://wa.me/255776986840"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Book Your Trip Now
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
