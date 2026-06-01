'use client'

import Link from "next/link"
import { useEffect } from "react"
import { ArrowLeft, Waves, Clock, DollarSign, Check, Package, Info } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useI18n } from "../../lib/i18n"
import { PublicLayout } from "../../components/PublicLayout"

export default function WhaleSharkTours() {
  const { t } = useI18n()

  useEffect(() => {
    document.title = `${t("whaleshark.title")} | MafiaFerry`
  }, [t])

  const includes = [1, 2, 3, 4].map((i) => ({ text: t(`whaleshark.include${i}`) }))
  const bring = [1, 2, 3, 4].map((i) => ({ text: t(`whaleshark.bring${i}`) }))

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

      <section className="py-16 bg-gradient-to-b from-blue-500/10 to-background">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("whaleshark.title")}</h1>
            <p className="text-xl text-muted-foreground">{t("whaleshark.subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg leading-relaxed mb-8">{t("whaleshark.desc")}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatCard icon={<Waves className="w-6 h-6" />} label={t("whaleshark.best_time")} />
              <StatCard icon={<Clock className="w-6 h-6" />} label={t("whaleshark.duration")} />
              <StatCard icon={<DollarSign className="w-6 h-6" />} label={t("whaleshark.price")} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="rounded-2xl bg-card p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Check className="w-5 h-5 text-green-500" />
                  <h2 className="text-xl font-bold">{t("whaleshark.includes")}</h2>
                </div>
                <ul className="space-y-3">
                  {includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-card p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">{t("whaleshark.bring")}</h2>
                </div>
                <ul className="space-y-3">
                  {bring.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">{t("guide.tips")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("guide.tip2")}<br />
                    {t("guide.tip3")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-card/50">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">{t("faq.contact")}</h2>
            <p className="text-muted-foreground mb-6">{t("faq.contact_desc")}</p>
            <Link href="/faq" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
              {t("footer.faq")} &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
    </PublicLayout>
  )
}

function StatCard({ icon, label }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl bg-card shadow-lg text-center"
    >
      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
      <p className="text-sm font-medium text-muted-foreground leading-tight">{label}</p>
    </motion.div>
  )
}
