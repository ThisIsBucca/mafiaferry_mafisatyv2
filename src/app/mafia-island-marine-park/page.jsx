'use client'

import Link from "next/link"
import { useEffect } from "react"
import { ArrowLeft, Waves, Fish, Shell, TreePine, Camera } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useI18n } from "../../lib/i18n"
import { PublicLayout } from "../../components/PublicLayout"

export default function MarineParkPage() {
  const { t } = useI18n()

  useEffect(() => {
    document.title = `${t("marine.title")} | MafiaFerry`
  }, [t])

  const activities = [
    { icon: <Waves className="w-6 h-6" />, text: t("marine.activity1") },
    { icon: <Fish className="w-6 h-6" />, text: t("marine.activity2") },
    { icon: <Shell className="w-6 h-6" />, text: t("marine.activity3") },
    { icon: <Camera className="w-6 h-6" />, text: t("marine.activity4") },
    { icon: <TreePine className="w-6 h-6" />, text: t("marine.activity5") },
  ]

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("marine.title")}</h1>
            <p className="text-xl text-muted-foreground">{t("marine.subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg leading-relaxed mb-8">{t("marine.desc")}</p>

            <h2 className="text-2xl font-bold mb-6">{t("marine.activities")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {activities.map((activity, i) => (
                <ActivityCard key={i} icon={activity.icon} text={activity.text} index={i} />
              ))}
            </div>

            <div className="rounded-2xl bg-card p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">{t("marine.fees")}</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {t("marine.fee_adult")}
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {t("marine.fee_child")}
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {t("marine.fee_citizen")}
                </li>
              </ul>
              <p className="mt-4 text-sm text-primary font-medium">{t("marine.best_time")}</p>
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

function ActivityCard({ icon, text, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-sm"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <p className="text-muted-foreground pt-3">{text}</p>
    </motion.div>
  )
}
