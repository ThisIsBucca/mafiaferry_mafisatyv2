'use client'

import Link from "next/link"
import { useEffect } from "react"
import { ArrowLeft, Ship, Plane, Bus, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useI18n } from "../../lib/i18n"
import { PublicLayout } from "../../components/PublicLayout"

const tips = [
  { key: 1 },
  { key: 2 },
  { key: 3 },
  { key: 4 },
]

const faqs = [
  { key: 1 },
  { key: 2 },
  { key: 3 },
  { key: 4 },
  { key: 5 },
  { key: 6 },
  { key: 7 },
  { key: 8 },
]

export default function HowToGetToMafiaIsland() {
  const { t } = useI18n()

  useEffect(() => {
    document.title = `${t("guide.title")} | MafiaFerry`
  }, [t])

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("guide.title")}</h1>
            <p className="text-xl text-muted-foreground">{t("guide.subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/#schedule" className="block">
              <GuideCard icon={<Ship className="w-8 h-8" />} title={t("guide.by_ferry")} desc={t("guide.ferry_desc")} />
            </Link>
            <GuideCard icon={<Plane className="w-8 h-8" />} title={t("guide.by_flight")} desc={t("guide.flight_desc")} />
            <GuideCard icon={<Bus className="w-8 h-8" />} title={t("guide.bus")} desc={t("guide.bus_desc")} />
          </div>
        </div>
      </section>

      <section className="py-12 bg-card/50">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">{t("guide.tips")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip) => (
                <div key={tip.key} className="flex items-start gap-3 p-4 rounded-lg bg-background shadow-sm">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{tip.key}</span>
                  <p className="text-muted-foreground">{t(`guide.tip${tip.key}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{t("faq.title")}</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <FaqItem key={faq.key} question={t(`faq.q${faq.key}`)} answer={t(`faq.a${faq.key}`)} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/faq" className="text-primary hover:text-primary/80 font-medium">
                {t("faq.contact")} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </PublicLayout>
  )
}

function GuideCard({ icon, title, desc }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl bg-card shadow-lg text-center"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </motion.div>
  )
}

function FaqItem({ question, answer }) {
  return (
    <details className="group rounded-xl bg-card shadow-sm overflow-hidden">
      <summary className="flex items-center justify-between p-4 cursor-pointer font-medium hover:bg-primary/5 transition-colors">
        {question}
        <svg className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="p-4 pt-0 text-muted-foreground">{answer}</div>
    </details>
  )
}
