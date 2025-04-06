import { useArticles } from "../hooks/useArticles"
import { format } from "date-fns"
import { Calendar, Clock, Newspaper } from "lucide-react"

export function NewsUpdates() {
  const { articles, isLoading } = useArticles()

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Newspaper className="w-12 h-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No News Available</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            There are currently no news articles available. Please check back later for updates.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article key={article.id} className="rounded-lg border bg-card overflow-hidden">
            <div className="relative h-48">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x400?text=No+Image"
                }}
              />
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(article.created_at), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{format(new Date(article.created_at), "h:mm a")}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold">{article.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {article.content}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
} 