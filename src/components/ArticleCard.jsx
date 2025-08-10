import { Link } from "react-router-dom"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export function ArticleCard({ article }) {
  return (
    <div className="group relative bg-card hover:bg-card/80 rounded-xl overflow-hidden border border-border/10 backdrop-blur-sm transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
          <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary backdrop-blur-md border border-primary/10 shadow-sm">
            {article.category}
          </span>
          <div className="flex items-center gap-4 text-xs text-white/90 backdrop-blur-sm px-2 py-1 rounded-full bg-black/20">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{article.read_time}m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        
        <p className="text-muted-foreground/80 text-sm mb-4 line-clamp-2">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center ring-2 ring-background shadow-sm">
              <span className="text-sm font-semibold text-primary">
                {(article.author && article.author.charAt(0)) || 'A'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-snug">{article.author || 'Admin'}</span>
              <span className="text-xs text-muted-foreground/60">Author</span>
            </div>
          </div>

          <Link
            to={`/blog/${article.slug}`}
            className="group/link inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
          >
            Read More
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// No changes needed here for ArticleCard itself. The change is in the home/news section to render both static and dynamic articles.