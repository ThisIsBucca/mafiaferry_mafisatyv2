'use client'

import Link from "next/link"
import { useEffect } from "react"
import { ArrowLeft, Ship, Clock, DollarSign, MapPin, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useI18n } from "../../lib/i18n"
import { PublicLayout } from "../../components/PublicLayout"

export default function NyamisatiFerry() {
  const { t } = useI18n()

  useEffect(() => {
    document.title = `${t("nyamisati.title")} | MafiaFerry`
  }, [t])

  const schedule = [
    { icon: <Clock className="w-5 h-5" />, text: t("nyamisati.departure") },
    { icon: <MapPin className="w-5 h-5" />, text: t("nyamisati.arrival") },
    { icon: <Ship className="w-5 h-5" />, text: t("nyamisati.duration") },
  ]

  const prices = [
    { label: t("nyamisati.price_adult") },
    { label: t("nyamisati.price_cargo") },
    { label: t("nyamisati.price_vehicle") },
  ]

  const facilities = [1, 2, 3, 4].map((i) => ({ text: t(`nyamisati.facility${i}`) }))
  const tips = [1, 2, 3, 4].map((i) => ({ text: t(`nyamisati.tip${i}`) }))

  return (
    <PublicLayout>
      <div className="min-h-screen">
      <div className="border-b">
        <div className="container px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t("blog.back")}
          </Link>
        </div>
      </div>

      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("nyamisati.title")}</h1>
            <p className="text-xl text-muted-foreground">{t("nyamisati.subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg leading-relaxed mb-8">{t("nyamisati.desc")}</p>

            <h2 className="text-2xl font-bold mb-6">{t("nyamisati.schedule")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {schedule.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-muted-foreground text-sm">{item.text}</p>
                </motion.div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6">{t("nyamisati.prices")}</h2>
            <div className="rounded-2xl bg-card p-6 shadow-lg mb-12">
              <ul className="space-y-4">
                {prices.map((price, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
                    {price.label}
                  </li>
                ))}
              </ul>
            </div>

            <h2 className="text-2xl font-bold mb-6">{t("nyamisati.facilities")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {facilities.map((facility, i) => (
                <FacilityCard key={i} text={facility.text} index={i} />
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6">{t("nyamisati.tips")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {tips.map((tip, i) => (
                <TipCard key={i} text={tip.text} index={i} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium">
                <Ship className="w-5 h-5" />
                {t("nyamisati.schedule")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </PublicLayout>
  )
}

function FacilityCard({ text, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex items-start gap-3 p-4 rounded-xl bg-card shadow-sm"
    >
      <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
      <p className="text-muted-foreground">{text}</p>
    </motion.div>
  )
}

function TipCard({ text, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex items-start gap-3 p-4 rounded-xl bg-background shadow-sm border border-primary/10"
    >
      <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
      <p className="text-muted-foreground text-sm">{text}</p>
    </motion.div>
  )
}
