'use client'

import Image from "next/image"
import Link from "next/link"
import { Search, Rss, Home, Calendar, Sparkles, TrendingUp, Tag, ArrowRight, Clock, BookOpen, ChevronRight } from "lucide-react"
import { useState, useRef, useMemo } from 'react'
import { useArticles } from '../../hooks/useArticles'
import { useI18n } from '../../lib/i18n'
import { staticArticles } from '../../data/staticArticles'
import { getLocalizedArticles } from '../../lib/localizeArticle'
import { PublicLayout } from '../../components/PublicLayout'

const categories = ['Travel Guide', 'Wildlife', 'Marine Park', 'Travel Tips', 'Destination Guide', 'Ferry Guide']

function ArticleGridCard({ article }) {
  const { t, locale } = useI18n()
  return (
    <div>
      <Link href={`/blog/${article.slug}`} className="group block h-full">
        <div className="relative h-full rounded-3xl overflow-hidden bg-card border border-border/10 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5">
          {/* Gradient border glow */}
          <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/0 via-accent/0 to-primary/0 group-hover:from-primary/25 group-hover:via-accent/15 group-hover:to-primary/25 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10" />
          
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
            
            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-full bg-background/70 text-foreground border border-border/20 shadow-sm backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {article.category}
              </span>
            </div>

            {/* Bottom metadata on image */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-foreground/80 bg-background/60 px-2.5 py-1 rounded-full border border-border/10">
                <Calendar className="w-3 h-3" />
                {new Date(article.created_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
              </span>
              {article.read_time && (
                <span className="flex items-center gap-1.5 text-[11px] text-foreground/80 bg-background/60 px-2.5 py-1 rounded-full border border-border/10">
                  <Clock className="w-3 h-3" />
                  {article.read_time}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug text-[15px]">
              {article.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
              {article.excerpt || article.content?.substring(0, 120)}...
            </p>
            
            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[9px] font-bold text-primary-foreground">
                  {(article.author && article.author.charAt(0)) || 'M'}
                </div>
                <span className="text-xs text-muted-foreground">{article.author || 'Mafia Ferry'}</span>
              </div>
              <span className="text-xs font-semibold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                {t("news.read_more")} <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function BlogListing() {
  const { t, locale } = useI18n()
  const { articles } = useArticles()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState(null)
  const scrollRef = useRef(null)

  const allArticles = useMemo(() => getLocalizedArticles([
    ...staticArticles,
    ...(articles || [])
  ], locale), [articles, locale])

  const filteredArticles = useMemo(() => allArticles?.filter(article => {
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !activeCategory || article.category === activeCategory
    return matchesSearch && matchesCategory
  }), [allArticles, searchQuery, activeCategory])

  const featured = filteredArticles?.[0]
  const rest = filteredArticles?.slice(1) || []

  return (
    <PublicLayout>
      {/* Hero Header */}
      <section className="relative pt-20 pb-16 sm:pb-20 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid-primary/3 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]" />
        
        <div className="container relative px-4 sm:px-6 lg:px-8">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-primary transition-colors">{t("blog.home")}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{t("blog.title")}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t("hero.premium_picks")}
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
                  {t("blog.title")}
                </h1>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground/80 max-w-xl leading-relaxed">
                  {t("news.subtitle")}
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-80 shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder={t("blog.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl border border-border/20 bg-background/60 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-muted-foreground/50" />
              <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">{t("blog.categories")}</span>
            </div>
            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <button
                onClick={() => setActiveCategory(null)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  !activeCategory
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                    : 'bg-background/60 text-muted-foreground border-border/20 hover:border-primary/30 hover:text-foreground hover:bg-background/80'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 inline mr-1.5" />
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                  className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                      : 'bg-background/60 text-muted-foreground border-border/20 hover:border-primary/30 hover:text-foreground hover:bg-background/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-20">
        <div className="container px-4 sm:px-6 lg:px-8">
          {filteredArticles?.length === 0 ? (
            <div className="text-center py-24"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Search className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t("news.no_articles")}</h3>
                <p className="text-muted-foreground/70 text-sm max-w-sm mx-auto">{t("news.no_articles_desc")}</p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Featured Article */}
                {featured && (
                  <div>
                    <Link href={`/blog/${featured.slug}`} className="group block">
                      <div className="relative rounded-3xl overflow-hidden bg-card border border-border/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                        <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10" />
                        <div className="grid sm:grid-cols-2">
                          {/* Image */}
                          <div className="relative overflow-hidden min-h-[260px] sm:min-h-full">
                            <Image
                              src={featured.image_url}
                              alt={featured.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent sm:bg-gradient-to-r sm:from-background/90 sm:via-background/10 sm:to-transparent" />
                            
                            {/* Floating badges on image */}
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-background/70 border border-border/20 text-foreground">
                                {featured.category}
                              </span>
                            </div>
                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                              <span className="flex items-center gap-1.5 text-[11px] text-foreground/80 bg-background/60 px-2.5 py-1 rounded-full border border-border/10">
                                <Calendar className="w-3 h-3" />
                                {new Date(featured.created_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              {featured.read_time && (
                                <span className="flex items-center gap-1.5 text-[11px] text-foreground/80 bg-background/60 px-2.5 py-1 rounded-full border border-border/10">
                                  <BookOpen className="w-3 h-3" />
                                  {featured.read_time}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-4 w-fit">
                              <Sparkles className="w-3 h-3" />
                              Featured
                            </div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                              {featured.title}
                            </h2>
                            <p className="mt-3 text-sm sm:text-base text-muted-foreground/80 line-clamp-2 leading-relaxed">
                              {featured.excerpt}
                            </p>
                            <div className="mt-6 flex items-center gap-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ring-2 ring-background text-xs font-bold text-primary-foreground">
                                  {(featured.author && featured.author.charAt(0)) || 'M'}
                                </div>
                                <div>
                                  <span className="text-sm font-semibold text-foreground block leading-tight">{featured.author || 'Mafia Ferry'}</span>
                                  <span className="text-[11px] text-muted-foreground">{t("news.author")}</span>
                                </div>
                              </div>
                              <span className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                {t("news.read_more")} <ArrowRight className="w-4 h-4" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Article Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {rest.map((article) => (
                    <ArticleGridCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}
          </div>
      </section>
    </PublicLayout>
  )
}
