'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { Anchor, Home, ArrowLeft, Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"
import { useI18n } from "../lib/i18n"

export default function NotFound() {
  const { t } = useI18n()
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") ?? "dark"
    setIsDark(savedTheme === "dark")
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    localStorage.setItem("theme", !isDark ? "dark" : "light")
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 rounded-full bg-card hover:bg-accent transition-colors" aria-label="Toggle theme">
        {isDark ? <Sun className="h-5 w-5 text-foreground" /> : <Moon className="h-5 w-5 text-foreground" />}
      </button>

      <div className="max-w-2xl w-full text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="relative inline-block">
            <Anchor className="w-24 h-24 text-primary" />
            <div className="absolute inset-0 bg-primary/20 blur-xl -z-10 rounded-full" />
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          404
        </motion.h1>

        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="text-2xl font-semibold mb-6 text-foreground">
          {t("404.title")}
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="text-muted-foreground mb-8">
          {t("404.desc")}
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Home className="w-4 h-4" />
            {t("404.home")}
          </Link>
          <button onClick={() => window.history.back()} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t("404.back")}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
