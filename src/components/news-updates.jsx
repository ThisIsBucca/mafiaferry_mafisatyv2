import { useArticles } from "../hooks/useArticles"
import { format } from "date-fns"
import { Calendar, Clock, Newspaper, ArrowRight, User, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { staticArticles } from '../pages/blog';
import { ArticleCard } from './ArticleCard';

export function NewsUpdates() {
  const { articles, isLoading, error } = useArticles()
  // Merge static and dynamic articles, static first
  const allArticles = [
    ...staticArticles,
    ...(articles || [])
  ];

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

  if (allArticles.length === 0) {
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
          {allArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}