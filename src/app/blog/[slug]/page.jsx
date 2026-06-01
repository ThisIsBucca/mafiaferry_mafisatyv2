'use client'

import Link from "next/link"
import { ChevronLeft, Calendar, Clock, Share2, Copy, Check, ChevronRight, Sparkles, BookOpen, User } from "lucide-react"
import { useArticles } from '../../../hooks/useArticles'
import { useI18n } from '../../../lib/i18n'
import { staticArticles } from '../../../data/staticArticles'
import { getLocalizedArticle, getLocalizedArticles } from '../../../lib/localizeArticle'
import { useEffect, useState, useRef, useMemo } from 'react'
import Image from "next/image"
import { PublicLayout } from '../../../components/PublicLayout'

function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight * 100, 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[60]">
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-150 ease-out shadow-lg shadow-primary/30"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function ShareButton() {
  const [copied, setCopied] = useState(false)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const shareNative = async () => {
    if (navigator.share) {
      try { await navigator.share({ url: shareUrl }) } catch {}
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={copyLink}
        className="p-2.5 rounded-xl bg-background/60 border border-border/20 hover:bg-primary/10 hover:border-primary/30 transition-all text-muted-foreground hover:text-primary"
        title="Copy link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2.5 rounded-xl bg-background/60 border border-border/20 hover:bg-primary/10 hover:border-primary/30 transition-all text-muted-foreground hover:text-primary"
        title="Share on X"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2.5 rounded-xl bg-background/60 border border-border/20 hover:bg-primary/10 hover:border-primary/30 transition-all text-muted-foreground hover:text-primary"
        title="Share on Facebook"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>
      {typeof navigator !== 'undefined' && navigator.share && (
        <button
          onClick={shareNative}
          className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

function RelatedCard({ article }) {
  return (
    <Link href={`/blog/${article.slug}`} className="group block">
      <div className="rounded-2xl overflow-hidden border border-border/10 shadow-sm transition-all duration-400 hover:shadow-lg hover:-translate-y-1 bg-card">
        <div className="aspect-[16/9] relative overflow-hidden">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-background/70 border border-border/20 text-foreground">
              {article.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {new Date(article.created_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function BlogPost({ params }) {
  const { t, locale } = useI18n()
  const { slug } = params
  const { articles } = useArticles()
  const contentRef = useRef(null)

  let article = useMemo(() => {
    let found = getLocalizedArticle((articles || []).find(a => a.slug === slug), locale)
    if (!found) {
      found = getLocalizedArticle(staticArticles.find(a => a.slug === slug), locale)
    }
    return found
  }, [articles, slug, locale])

  const related = useMemo(() => article 
    ? getLocalizedArticles(staticArticles.filter(a => a.slug !== slug && a.category === article.category).slice(0, 3), locale)
    : [], [article, slug, locale])

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Mafia Island Blog`
    }
  }, [article])

  if (!article) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <ChevronLeft className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">{t("blog.not_found")}</h2>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm font-medium transition-colors">
              <ChevronLeft className="w-4 h-4" /> {t("blog.back")}
            </Link>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <ReadingProgress />

      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 border-b border-border/10 bg-background/90">
        <div className="container px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t("blog.back")}
          </Link>
          <ShareButton />
        </div>
      </div>

      {/* Article */}
      <article className="py-8 sm:py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div ref={contentRef}>
              {/* Header */}
              <header className="mb-8 sm:mb-10">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-5">
                  {article.category && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                      <Sparkles className="w-3 h-3" />
                      {article.category}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(article.created_at).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs">
                    <BookOpen className="w-3.5 h-3.5" />
                    {article.read_time || '5 min read'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] tracking-tight mb-6">
                  {article.title}
                </h1>

                {/* Author card */}
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/10 shadow-sm">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ring-2 ring-background shadow-md">
                      <span className="text-lg font-bold text-primary-foreground">
                        {(article.author && article.author.charAt(0)) || 'M'}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{article.author || 'Mafia Ferry Team'}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="w-3 h-3" /> {t("news.author")}
                    </p>
                  </div>
                </div>
              </header>

              {/* Featured image */}
              {article.image_url && (
                <div className="relative rounded-3xl overflow-hidden mb-10 shadow-lg h-[260px] sm:h-[380px] lg:h-[460px]">
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 768px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div
                  className="text-foreground/80 space-y-6 text-base sm:text-lg leading-[1.8] sm:leading-[1.8] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:tracking-tight [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-5 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-primary/30 [&_a:hover]:decoration-primary [&_a:hover]:text-primary/80 [&_table]:w-full [&_table]:border-collapse [&_th]:bg-muted/30 [&_th]:p-3 [&_th]:text-left [&_th]:font-semibold [&_td]:p-3 [&_td]:border-b [&_td]:border-border/20 [&_tr:hover]:bg-muted/10 [&_strong]:text-foreground [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>

              {/* Share footer */}
              <div className="mt-12 p-6 rounded-2xl bg-card border border-border/10 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-primary" />
                      Share this article
                    </h4>
                    <p className="text-sm text-muted-foreground/70">Help others discover Mafia Island</p>
                  </div>
                  <ShareButton />
                </div>
              </div>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
            <div className="mt-16 sm:mt-20"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Related Articles
                  </h2>
                  <Link href="/blog" className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                    View all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map((rel) => (
                    <RelatedCard key={rel.id} article={rel} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </PublicLayout>
  )
}
