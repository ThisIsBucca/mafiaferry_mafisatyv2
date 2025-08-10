import { motion } from "framer-motion"
import { useParams, Link, useLocation } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { Calendar, Clock, ChevronLeft, Search, Rss, Home } from "lucide-react"
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import BlogPost from './blog-post'

export const staticArticles = [
  {
    id: 'static-mafia-ferry-guide',
    slug: 'mafia-ferry-guide',
    title: 'Complete Guide to Mafia Island Ferries',
    created_at: '2024-03-15',
    content: `
      <p>Planning your trip to Mafia Island? Here's everything you need to know about ferry services between Mafia Island and Nyamisati.</p>
      <h2>Available Services</h2>
      <p>Currently, there are two main ferry services operating between Mafia Island and Nyamisati:</p>
      <ul>
        <li>MV. Songosongo - Faster service with cargo focus</li>
        <li>MV. Kilindoni - More passenger-friendly with larger capacity</li>
      </ul>
      <h2>Schedule Information</h2>
      <p>Both ferries operate on specific days of the week, with schedules designed to accommodate both passenger and cargo needs. Check our main schedule page for detailed timings.</p>
      <h2>Booking Tips</h2>
      <ul>
        <li>Book in advance during peak season</li>
        <li>Arrive at least 30 minutes before departure</li>
        <li>Check weather conditions before travel</li>
        <li>Consider cargo ferry for larger items</li>
      </ul>
      <h2>What to Expect</h2>
      <p>The journey typically takes 4-5 hours, depending on the vessel and conditions. Both ferries offer basic amenities and comfortable seating arrangements.</p>
    `,
    category: 'Travel Guide',
    read_time: '5 min read',
    excerpt: "Planning your trip to Mafia Island? Here's everything you need to know about ferry services between Mafia Island and Nyamisati.",
    author: 'Mafia Ferry',
    image_url: '/images/placeholder.jpg',
    isStatic: true,
  },
]

export default function Blog() {
  const { slug } = useParams()
  const location = useLocation()
  const { 
    articles, 
    isLoading, 
    isError, 
    error 
  } = useArticles()
  const [searchQuery, setSearchQuery] = useState("")

  // Scroll to top when navigating to an article
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Merge static and dynamic articles for listing
  const allArticles = [
    ...staticArticles,
    ...(articles || [])
  ]

  const filteredArticles = allArticles?.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Common header component
  const BlogHeader = () => (
    <div className="border-b">
      <div className="container px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm">Home</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              News & Updates
            </h1>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  )

  // Common blog footer component
  const BlogFooter = () => (
    <div className="border-t">
      <div className="container px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-4">About Our Blog</h3>
            <p className="text-muted-foreground">
              Your source for the latest updates, travel information, and stories about Mafia Island's transportation services.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-4">Categories</h3>
            <div className="space-y-2">
              {Array.from(new Set(articles?.map(a => a.category) || [])).map(category => (
                <div key={category} className="text-muted-foreground hover:text-primary cursor-pointer">
                  {category || 'General'}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-4">Subscribe</h3>
            <p className="text-muted-foreground mb-4">
              Stay updated with our latest posts and announcements.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                <Rss className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Common SEO component
  const CommonSEO = () => (
    <Helmet>
      <html lang="en" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={window.location.href} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Mafia Ferry" />
      <meta name="keywords" content="Mafia Island, ferry service, transportation, travel updates, Tanzania tourism, boat schedule" />
    </Helmet>
  )

  if (isLoading) {
    return (
      <>
        <CommonSEO />
        <Helmet>
          <title>Loading... | Mafia Island Blog</title>
          <meta name="description" content="Loading the latest news and updates about Mafia Island's transportation services." />
        </Helmet>
        <BlogHeader />
        <div className="container px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-foreground">Loading...</div>
        </div>
        <BlogFooter />
      </>
    )
  }

  if (isError) {
    return (
      <>
        <CommonSEO />
        <Helmet>
          <title>Error | Mafia Island Blog</title>
          <meta name="description" content="An error occurred while loading the blog content." />
        </Helmet>
        <BlogHeader />
        <div className="container px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-destructive">
            Error: {error.message}
          </div>
        </div>
        <BlogFooter />
      </>
    )
  }

  // If we have a slug, show the single article view
  if (slug) {
    // Try dynamic first
    let article = (articles || []).find(a => a.slug === slug)
    // If not found, try static
    if (!article) {
      article = staticArticles.find(a => a.slug === slug)
    }
    if (!article) {
      return (
        <>
          <CommonSEO />
          <Helmet>
            <title>Article Not Found | Mafia Island Blog</title>
            <meta name="description" content="The requested article could not be found." />
          </Helmet>
          <BlogHeader />
          <div className="container px-4 sm:px-6 lg:px-8 py-12">
            <Link 
              to="/blog"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            <div className="text-center text-foreground">Article not found</div>
          </div>
          <BlogFooter />
        </>
      )
    }

    return (
      <>
        <CommonSEO />
        <Helmet>
          <title>{article.title} | Mafia Island Blog</title>
          <meta name="description" content={article.excerpt || article.content.substring(0, 160)} />
          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={article.excerpt || article.content.substring(0, 160)} />
          <meta property="og:url" content={window.location.href} />
          {article.image_url && <meta property="og:image" content={article.image_url} />}
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="Mafia Island Blog" />
          <meta property="article:published_time" content={article.created_at} />
          <meta property="article:modified_time" content={article.updated_at || article.created_at} />
          <meta property="article:section" content={article.category || 'General'} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={article.title} />
          <meta name="twitter:description" content={article.excerpt || article.content.substring(0, 160)} />
          {article.image_url && <meta name="twitter:image" content={article.image_url} />}
        </Helmet>
        <BlogHeader />
        <div className="container px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <Link 
              to="/blog"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-8 group"
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            <article className="prose prose-lg dark:prose-invert max-w-none">
              <header className="mb-8">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.read_time || '5 min read'}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight">
                  {article.title}
                </h1>
                {article.category && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    {article.category}
                  </div>
                )}
              </header>

              {article.image_url && (
                <div className="relative rounded-xl overflow-hidden mb-8">
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                </div>
              )}
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div 
                  className="text-foreground/80 space-y-8 text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.content }} 
                />
              </div>

              <style jsx global>{`
                .prose p {
                  margin-top: 1.5em;
                  margin-bottom: 1.5em;
                  line-height: 1.8;
                  max-width: 65ch;
                }

                .prose p:first-of-type {
                  margin-top: 0;
                }

                .prose p:last-of-type {
                  margin-bottom: 0;
                }
              `}</style>

              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                      <img
                        src="https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//Runway%202025-02-12T17_59_48.795Z%20Erase%20and%20Replace%20remove%20this%20icons.png"
                        alt="Bucca Rasta"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Bucca Rasta</p>
                      <p className="text-sm text-muted-foreground">CEO, MafiaFerry</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                      </svg>
                    </button>
                    <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                      </svg>
                    </button>
                    <button className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
        <BlogFooter />
      </>
    )
  }

  // Blog listing view
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Mafia Island Blog",
    "description": "Stay informed with the latest news, updates, and travel information about Mafia Island and its surrounding areas.",
    "url": window.location.href,
    "publisher": {
      "@type": "Organization",
      "name": "Mafia Ferry",
      "logo": {
        "@type": "ImageObject",
        "url": "/images/logo.png"
      }
    },
    "blogPost": filteredArticles.map(article => ({
      "@type": "BlogPosting",
      "headline": article.title,
      "description": article.excerpt || article.content.substring(0, 160),
      "datePublished": article.created_at,
      "dateModified": article.updated_at || article.created_at,
      "url": `${window.location.origin}/blog/${article.slug}`
    }))
  }

  return (
    <>
      <CommonSEO />
      <Helmet>
        <title>News & Updates | Mafia Island</title>
        <meta name="description" content="Latest news and updates about Mafia Island's transportation services and community." />
      </Helmet>
      <BlogHeader />
      <div className="container px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredArticles?.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="col-span-1"
                >
                  <Link to={`/blog/${article.slug}`} className="group block h-full">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-card h-full">
                      <div className="aspect-[16/9] relative">
                        <img
                          src={article.image_url || '/images/placeholder.jpg'}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {article.category || 'General'}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(article.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {article.title}
                        </h2>
                        <p className="mt-2 text-muted-foreground line-clamp-2">
                          {article.excerpt || article.content.substring(0, 150)}...
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              {/* Categories */}
              <div className="rounded-2xl bg-card p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
                <div className="space-y-2">
                  {Array.from(new Set(articles?.map(a => a.category) || [])).map(category => (
                    <div
                      key={category}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                    >
                      <span className="text-muted-foreground">{category || 'General'}</span>
                      <span className="text-sm text-primary">
                        {articles?.filter(a => a.category === category).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscribe */}
              <div className="rounded-2xl bg-card p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">Stay Updated</h3>
                <p className="text-muted-foreground mb-4">
                  Subscribe to receive the latest news and updates directly to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Rss className="h-4 w-4" />
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BlogFooter />
    </>
  )
}