import { motion } from "framer-motion"
import { useParams, Link, useLocation } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { Calendar, Clock, ChevronLeft, Search, Rss, Home } from "lucide-react"
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

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

  // Debug logging
  useEffect(() => {
    console.log('=== Blog Component Debug ===')
    console.log('Current slug:', slug)
    console.log('Loading state:', isLoading)
    console.log('Error state:', isError)
    console.log('Articles:', articles)
  }, [slug, isLoading, isError, articles])

  const filteredArticles = articles?.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Common header component
  const BlogHeader = () => (
    <div className="border-b">
      <div className="container px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Return Home</span>
          </Link>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Mafia Island Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover stories, travel tips, and updates about Mafia Island's transportation and community
          </p>
          <div className="relative w-full max-w-xl mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
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
    console.log('Looking for article with slug:', slug)
    const article = articles.find(a => a.slug === slug)
    console.log('Found article:', article)

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

    const articleStructuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.excerpt || article.content.substring(0, 160),
      "image": article.image_url,
      "datePublished": article.created_at,
      "dateModified": article.updated_at || article.created_at,
      "author": {
        "@type": "Organization",
        "name": "Mafia Ferry"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Mafia Ferry",
        "logo": {
          "@type": "ImageObject",
          "url": "/images/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      }
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
          <script type="application/ld+json">
            {JSON.stringify(articleStructuredData)}
          </script>
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
              <h1 className="text-4xl font-bold mb-4 text-foreground">{article.title}</h1>
              {article.category && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  {article.category}
                </div>
              )}
            </header>

            {article.image_url && (
              <img 
                src={article.image_url} 
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}
            
            <div className="text-foreground" dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>
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
        <title>News & Updates | Mafia Island Blog</title>
        <meta name="description" content="Stay informed with the latest news, updates, and travel information about Mafia Island and its surrounding areas." />
        <meta property="og:title" content="News & Updates | Mafia Island Blog" />
        <meta property="og:description" content="Stay informed with the latest news, updates, and travel information about Mafia Island and its surrounding areas." />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Mafia Island Blog" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="News & Updates | Mafia Island Blog" />
        <meta name="twitter:description" content="Stay informed with the latest news, updates, and travel information about Mafia Island and its surrounding areas." />
        <script type="application/ld+json">
          {JSON.stringify(blogStructuredData)}
        </script>
      </Helmet>
      <BlogHeader />
      <div className="container px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Latest Articles</h2>
          <p className="text-muted-foreground">
            Stay informed with the latest news, updates, and travel information about Mafia Island and its surrounding areas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg shadow-md overflow-hidden border"
            >
              {article.image_url && (
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-foreground">{article.title}</h2>
                {article.excerpt && (
                  <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {article.read_time || '5 min read'}
                  </span>
                  <Link 
                    to={`/blog/${article.slug}`}
                    className="text-primary hover:text-primary/80"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      <BlogFooter />
    </>
  )
} 