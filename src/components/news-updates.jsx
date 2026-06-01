'use client'

import { useArticles } from "../hooks/useArticles"
import { Newspaper, AlertCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { staticArticles } from '../data/staticArticles';
import { ArticleCard } from './ArticleCard';
import { useI18n } from "../lib/i18n";
import { getLocalizedArticles } from '../lib/localizeArticle';

export function NewsUpdates() {
  const { t, locale } = useI18n()
  const { articles, isLoading, error } = useArticles()
  const allArticles = getLocalizedArticles([
    ...staticArticles,
    ...(articles || [])
  ], locale);
  const featured = allArticles[0]
  const rest = allArticles.slice(1)

  if (error) {
    return (
      <section className="relative py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="container relative">
          <div className="text-center p-8 rounded-2xl border border-destructive/20 bg-destructive/5 shadow-card">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("news.error")}</h3>
            <p className="text-muted-foreground">{t("news.error_desc")}</p>
          </div>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="relative py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="container relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 mb-4">
              {t("news.title")}
            </h2>
            <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg">
              {t("news.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-card/50 animate-pulse overflow-hidden shadow-card">
                <div className="h-48 bg-muted/50" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-24 bg-muted/50 rounded-full" />
                  <div className="h-5 bg-muted/50 rounded-lg w-3/4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-muted/50 rounded-lg" />
                    <div className="h-3 bg-muted/50 rounded-lg w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (allArticles.length === 0) {
    return (
      <section className="relative py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="container relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 mb-4">
              {t("news.title")}
            </h2>
            <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg">
              {t("news.subtitle")}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto p-8 rounded-2xl bg-card/50 border shadow-card">
            <div className="p-4 rounded-full bg-primary/10">
              <Newspaper className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-medium">{t("news.no_articles")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("news.no_articles_desc")}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span>{t("hero.premium_picks")}</span>
          </div> */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary mb-4 leading-tight">
            {t("news.title")}
          </h2>
          <p className="text-muted-foreground/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            {t("news.subtitle")}
          </p>
        </motion.div>

        {/* Featured article */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 lg:mb-12"
          >
            <ArticleCard article={featured} featured />
          </motion.div>
        )}

        {/* Bento grid for rest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {rest.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary font-semibold transition-all hover:scale-105 active:scale-95"
          >
            {t("hero.premium_picks") === "Our Premium Picks" ? "View All Articles" : "Tazama Makala Zote"}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}