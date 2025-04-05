import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase"

export function ArticlePage() {
  const { id } = useParams()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container px-4 text-center">
          Loading article...
        </div>
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen py-16">
        <div className="container px-4 text-center">
          <p className="text-red-500">Error loading article. Please try again later.</p>
          <Link 
            to="/news" 
            className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="min-h-screen py-16">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link 
            to="/news"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>

          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {article.image_url && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div className="space-y-4">
              <h1 className="text-4xl font-bold">{article.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(article.published_at), 'MMMM dd, yyyy')}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.read_time || '3 min read'}
                </span>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                {article.content}
              </div>

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-muted-foreground">
                  Written by <span className="font-medium">{article.author}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </article>
  )
} 