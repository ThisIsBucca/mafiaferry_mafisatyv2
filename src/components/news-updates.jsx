import { useArticles } from "../hooks/useArticles"
import { format } from "date-fns"
import { Calendar, Clock, Newspaper, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export function NewsUpdates() {
  const { articles, defaultArticle, isLoading } = useArticles()

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Habari na Matukio ya Hivi Karibuni</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fahamu habari mpya, matukio, na taarifa za usafiri kuhusu Kisiwa cha Mafia na maeneo yake.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border bg-card animate-pulse">
                <div className="h-48 bg-muted rounded-t-xl" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const displayArticles = articles.length > 0 ? articles : defaultArticle ? [defaultArticle] : []

  if (displayArticles.length === 0) {
    return (
      <section className="py-16 bg-muted/20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Habari na Matukio ya Hivi Karibuni</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fahamu habari mpya, matukio, na taarifa za usafiri kuhusu Kisiwa cha Mafia na maeneo yake.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <Newspaper className="w-12 h-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">Hakuna Habari Zilizopatikana</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Kwa sasa hakuna makala za habari zinazopatikana. Tafadhali rudi tena baadae kwa habari mpya.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Habari na Matukio ya Hivi Karibuni</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fahamu habari mpya, matukio, na taarifa za usafiri kuhusu Kisiwa cha Mafia na maeneo yake.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayArticles.map((article) => (
            <article key={article.id} className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x400?text=Hakuna+Picha"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
              <div className="p-6 space-y-4">
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
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{article.title}</h3>
                <p className="text-muted-foreground line-clamp-3">
                  {article.content}
                </p>
                {article.slug && (
                  <Link
                    to={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    Soma Zaidi
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
} 