'use client'

import { Coffee, Heart, Lock, ExternalLink, Code } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useI18n } from "../lib/i18n"

export function SupportBanner() {
  const { t } = useI18n()
  return (
    <div className="relative bg-gradient-to-r from-primary/5 via-background to-primary/5 border-b">
      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-grid-primary/5" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
      </div>

      <div className="container relative px-4 py-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs sm:text-sm">
        <motion.div 
          className="flex items-center gap-1.5"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary/70" />
          <span className="text-muted-foreground">{t("support.developed")}</span>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
          </motion.div>          <span className="text-muted-foreground">{t("support.by")}</span>
          <span 
            className="font-medium bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent"
          >
            thisisbucca
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-3"
        >          <div className="hidden sm:block w-px h-4 bg-primary/20" />
            {/* <a 
            href="https://buymeacoffee.com/buccaphiloy"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffcd00] hover:bg-[#eebf00] text-black font-medium transition-all duration-300 hover:scale-105 shadow-sm hover:shadow"
          >
            <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:rotate-12 stroke-[2.5]" />
            <span className="font-semibold text-[13px]">{t("support.buy_coffee")}</span>
          </a> */}

          <div className="hidden sm:block w-px h-4 bg-primary/20" />
          
          <Link 
            href="/admin/login" 
            className="group inline-flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-300"
          >
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" />
            <span>{t("support.login")}</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 