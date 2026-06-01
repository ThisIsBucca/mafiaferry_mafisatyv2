'use client'

import Link from "next/link"
import { HelpCircle, ChevronDown, MessageCircle, ArrowRight, ExternalLink, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useI18n } from "../lib/i18n"
import Script from "next/script"

const faqKeys = [1, 2, 3, 4, 5]

export function FaqSection() {
  const { t, locale } = useI18n()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  const faqList = faqKeys.map((key) => ({
    q: t(`faq.q${key}`),
    a: t(`faq.a${key}`),
  }))

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }

  return (
    <>
      <Script
        id="homepage-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section
        ref={ref}
        className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      >
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/20 to-transparent" />

        <div className="container px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 sm:mb-14"
            >
              {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                FAQ
              </div> */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight leading-[1.1]">
                {t("faq.title")}
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                {t("faq.subtitle")}
              </p>
            </motion.div>

            {/* FAQ items */}
            <div className="space-y-3 sm:space-y-4">
              {faqKeys.map((key, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.07 }}
                >
                  <details
                    className="group rounded-2xl bg-card/80 border border-border/10 shadow-sm overflow-hidden open:border-primary/25 open:shadow-md open:shadow-primary/5 transition-all duration-300 ease-out"
                  >
                    <summary className="flex items-center gap-4 p-4 sm:p-5 lg:p-6 cursor-pointer font-medium text-foreground hover:bg-primary/[0.02] transition-colors text-sm sm:text-base leading-snug list-none [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 text-primary font-bold text-xs sm:text-sm shrink-0 group-open:bg-primary group-open:text-primary-foreground transition-colors duration-300">
                        {String(key).padStart(2, "0")}
                      </span>
                      <span className="flex-1 pr-2 font-semibold text-foreground/90 group-open:text-foreground transition-colors">
                        {t(`faq.q${key}`)}
                      </span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground/60 group-open:rotate-180 transition-all duration-300 shrink-0 group-open:text-primary" />
                    </summary>
                    <div className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 text-muted-foreground text-sm sm:text-base leading-relaxed border-t border-border/5 pt-4 ml-[52px] sm:ml-[60px]">
                      <span className="block pl-1 border-l-2 border-primary/20 pl-4 italic">
                        {t(`faq.a${key}`)}
                      </span>
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-10 sm:mt-12 text-center"
            >
              <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-card via-card to-primary/[0.03] border border-border/10 shadow-sm overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.04] rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/[0.04] rounded-full blur-2xl pointer-events-none" />

                <div className="relative">
                  <div className="flex items-center justify-center gap-2.5 mb-3">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {t("faq.contact")}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-md mx-auto">
                    {t("faq.contact_desc")}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <Link
                      href="/faq"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 active:scale-[0.97]"
                    >
                      {locale === "sw" ? "Maswali Yote" : "All FAQs"}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href="https://wa.me/255776986840"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary/25 text-primary text-sm font-semibold hover:bg-primary/5 hover:border-primary/40 transition-all active:scale-[0.97]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {locale === "sw" ? "Uliza WhatsApp" : "Ask on WhatsApp"}
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
