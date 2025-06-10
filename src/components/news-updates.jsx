import { useArticles } from "../hooks/useArticles"
import { format } from "date-fns"
import { Calendar, Clock, Newspaper, ArrowRight, User, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"

export function NewsUpdates() {
  const { articles, defaultArticle, isLoading, error } = useArticles()

  // Handle errors gracefully
  if (error) {
    return (
      <section className="relative py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="container relative">
          <div className="text-center p-8 rounded-lg border border-destructive/20 bg-destructive/5">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Samahani, kuna hitilafu imetokea</h3>
            <p className="text-muted-foreground">Tafadhali jaribu tena baadae.</p>
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
              Habari na Matukio ya Hivi Karibuni
            </h2>
            <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg">
              Fahamu habari mpya, matukio, na taarifa za usafiri kuhusu Kisiwa cha Mafia na maeneo yake.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="group rounded-2xl border bg-card/50 backdrop-blur-sm animate-pulse overflow-hidden">
                <div className="h-52 bg-muted/50 rounded-t-2xl" />
                <div className="p-6 space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="h-4 w-24 bg-muted/50 rounded-full" />
                    <div className="h-4 w-24 bg-muted/50 rounded-full" />
                  </div>
                  <div className="h-6 bg-muted/50 rounded-lg w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted/50 rounded-lg w-full" />
                    <div className="h-4 bg-muted/50 rounded-lg w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const displayArticles = articles?.length > 0 ? articles : defaultArticle ? [defaultArticle] : []

  if (displayArticles.length === 0) {
    return (
      <section className="relative py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="container relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 mb-4">
              Habari na Matukio ya Hivi Karibuni
            </h2>
            <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg">
              Fahamu habari mpya, matukio, na taarifa za usafiri kuhusu Kisiwa cha Mafia na maeneo yake.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto p-8 rounded-2xl bg-card/50 backdrop-blur-sm border">
            <div className="p-4 rounded-full bg-primary/10">
              <Newspaper className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-medium text-foreground/90">Hakuna Habari Zilizopatikana</h3>
            <p className="text-sm text-muted-foreground/80">
              Kwa sasa hakuna makala za habari zinazopatikana. Tafadhali rudi tena baadae kwa habari mpya.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="container relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 mb-4">
            Habari na Matukio ya Hivi Karibuni
          </h2>
          <p className="text-muted-foreground/80 max-w-2xl mx-auto text-lg">
            Fahamu habari mpya, matukio, na taarifa za usafiri kuhusu Kisiwa cha Mafia na maeneo yake.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayArticles.map((article) => (
            <article key={article.id} className="group relative rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-52 overflow-hidden">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x400?text=Hakuna+Picha"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/20 text-primary backdrop-blur-sm px-3 py-1 rounded-full border border-primary/10">
                    {article.category || "Habari"}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground/80">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(article.created_at), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{format(new Date(article.created_at), "h:mm a")}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground/80 text-sm line-clamp-3">
                    {article.content}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground/80">
                      {article.author || "Admin"}
                    </span>
                  </div>
                  {article.slug && (
                    <Link
                      to={`/blog/${article.slug}`}
                      className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Soma Zaidi
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}