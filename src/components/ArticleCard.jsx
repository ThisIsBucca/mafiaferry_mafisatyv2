'use client'

import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { useI18n } from "../lib/i18n"

export function ArticleCard({ article, featured }) {
  const { t } = useI18n()
  return (
    <Link href={`/blog/${article.slug}`} className="group block h-full">
      <div className={`relative h-full rounded-3xl overflow-hidden border border-border/10 shadow-sm transition-all duration-500 hover:shadow-xl ${featured ? 'lg:flex lg:flex-row-reverse hover:-translate-y-1' : 'hover:-translate-y-1.5'}`}>
        {/* Glass shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        {/* Gradient border glow */}
        <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/0 via-accent/0 to-primary/0 group-hover:from-primary/30 group-hover:via-accent/20 group-hover:to-primary/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10" />

        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2 lg:min-h-full' : 'aspect-[16/10]'} ${!featured && 'shrink-0'}`}>
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />

          {/* Category pill */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-full bg-background/70 text-foreground border border-border/20 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {article.category}
            </span>
          </div>

          {/* Bottom metadata */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-foreground/80 bg-background/60 px-2.5 py-1 rounded-full border border-border/10">
              <Calendar className="w-3 h-3" />
              <span>{new Date(article.created_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            {article.read_time && (
              <div className="flex items-center gap-1.5 text-[11px] text-foreground/80 bg-background/60 px-2.5 py-1 rounded-full border border-border/10">
                <Clock className="w-3 h-3" />
                <span>{article.read_time}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={`p-5 flex flex-col justify-between ${featured ? 'lg:w-1/2' : ''}`}>
          <div>
            <h3 className={`font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 ${featured ? 'text-2xl lg:text-3xl leading-tight' : 'text-[15px] leading-snug'}`}>
              {article.title}
            </h3>
            <p className={`mt-2 text-muted-foreground/80 line-clamp-2 leading-relaxed ${featured ? 'text-base' : 'text-sm'}`}>
              {article.excerpt}
            </p>
          </div>

          {/* Author & CTA */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/5">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className={`rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ring-2 ring-background shadow-md ${featured ? 'w-9 h-9' : 'w-7 h-7'}`}>
                  <span className={`font-bold text-primary-foreground ${featured ? 'text-sm' : 'text-[10px]'}`}>
                    {(article.author && article.author.charAt(0)) || 'M'}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
              </div>
              <div className="flex flex-col">
                <span className={`font-semibold leading-tight text-foreground ${featured ? 'text-sm' : 'text-xs'}`}>{article.author || 'Mafia Ferry'}</span>
                <span className={`text-muted-foreground ${featured ? 'text-[11px]' : 'text-[10px]'}`}>{t("news.author")}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              {t("news.read_more")}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
