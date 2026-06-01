'use client'

import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useI18n } from "../../lib/i18n"
import Script from "next/script"
import { PublicLayout } from "../../components/PublicLayout"

export default function FAQPage() {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    document.title = `${t("faq.title")} | MafiaFerry`
  }, [t])

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
    { q: t("faq.q7"), a: t("faq.a7") },
    { q: t("faq.q8"), a: t("faq.a8") },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }

  return (
    <PublicLayout>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("faq.title")}</h1>
              <p className="text-xl text-muted-foreground mb-8">{t("faq.subtitle")}</p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder={t("blog.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {filteredFaqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group rounded-xl bg-card shadow-sm overflow-hidden open:ring-1 open:ring-primary/20"
                  >
                    <summary className="flex items-center justify-between p-5 cursor-pointer font-medium hover:bg-primary/5 transition-colors text-foreground">
                      <span className="pr-4">{faq.q}</span>
                      <svg
                        className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{faq.a}</div>
                  </details>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>{t("news.no_articles")}</p>
                </div>
              )}

              <div className="mt-12 p-8 rounded-2xl bg-card shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-2">{t("faq.contact")}</h2>
                <p className="text-muted-foreground mb-6">{t("faq.contact_desc")}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
                  >
                    {t("nav.home")}
                  </Link>
                  <a
                    href="tel:0776986840"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary rounded-xl hover:bg-primary/5 transition-colors font-medium"
                  >
                    {t("contact.phone_desc")} 0776 986 840
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      </PublicLayout>
  )
}
