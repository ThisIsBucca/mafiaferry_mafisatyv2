import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Calendar, Clock, ArrowRight, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'

export function Blog() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const featuredPost = {
    title: "New Express Ferry Service Launches Between Mafia and Nyamisati",
    category: "⛴️ Transportation",
    date: "2024-03-15",
    excerpt: "We're excited to announce the launch of our new express ferry service, reducing travel time between Mafia Island and Nyamisati by 30%. This development marks a significant improvement in our transportation network.",
    author: "John Mwangi",
    readingTime: "5 min read",
    image: "/images/blog/blog2.jpg",
    link: "/blog/new-express-ferry-service",
  }

  const blogPosts = [
    {
      title: "Port Upgrade Project: What to Expect",
      category: "🏗️ Infrastructure",
      date: "2024-03-10",
      excerpt: "Major port expansion project to improve passenger experience and cargo handling capacity. Learn about the planned improvements and timeline.",
      readingTime: "4 min read",
      icon: "🏗️",
      link: "/blog/port-upgrade-project",
    },
    {
      title: "Weather Advisory: Monsoon Season Guide",
      category: "🌤️ Travel Alert",
      date: "2024-03-08",
      excerpt: "Heavy monsoon season expected - travelers advised to check schedules before departure. Essential tips for safe travel during monsoon season.",
      readingTime: "3 min read",
      icon: "🌤️",
      link: "/blog/monsoon-season-guide",
    },
    {
      title: "Coral Reef Protection Initiative",
      category: "🐠 Conservation",
      date: "2024-03-12",
      excerpt: "New marine protected area established to preserve Mafia Island's coral reefs. How this affects local tourism and marine life.",
      readingTime: "6 min read",
      icon: "🐠",
      link: "/blog/coral-reef-protection",
    },
    {
      title: "Cultural Festival 2024",
      category: "🎉 Events",
      date: "2024-03-05",
      excerpt: "Annual Mafia Island Cultural Festival celebrates local traditions and heritage. Complete guide to this year's festivities.",
      readingTime: "4 min read",
      icon: "🎉",
      link: "/blog/cultural-festival-2024",
    },
    {
      title: "Eco-Tourism: Sustainable Travel Guide",
      category: "🌴 Tourism",
      date: "2024-03-01",
      excerpt: "New sustainable tourism program promotes responsible travel practices. Tips for eco-friendly island exploration.",
      readingTime: "5 min read",
      icon: "🌴",
      link: "/blog/eco-tourism-guide",
    },
    {
      title: "Local Fishing Communities",
      category: "🐟 Community",
      date: "2024-02-28",
      excerpt: "Meet the local fishing communities of Mafia Island and learn about their traditional practices and modern challenges.",
      readingTime: "7 min read",
      icon: "🐟",
      link: "/blog/fishing-communities",
    },
  ]

  const categories = [
    { name: "Transportation", icon: "⛴️", count: 12 },
    { name: "Infrastructure", icon: "🏗️", count: 8 },
    { name: "Travel Tips", icon: "🌤️", count: 15 },
    { name: "Conservation", icon: "🐠", count: 10 },
    { name: "Events", icon: "🎉", count: 6 },
    { name: "Tourism", icon: "🌴", count: 9 },
    { name: "Community", icon: "🐟", count: 7 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/images/blog/blog1.jpg"
            alt="Mafia Island Transport"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/60" />
        </div>
        <div className="relative container px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          >
            Mafia Island Transport & Travel Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            News, updates and travel tips for routes between Mafia, Nyamisati and beyond
          </motion.p>
        </div>
      </section>

      <div className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Featured Post */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <div className="relative rounded-2xl overflow-hidden group">
                <img
                  src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/blog/${featuredPost.image}`}
                  alt={featuredPost.title}
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg'
                    console.error('Failed to load image:', featuredPost.image)
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/50" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{featuredPost.category}</span>
                    <span className="text-sm font-medium text-primary">{featuredPost.category}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readingTime}</span>
                      </div>
                    </div>
                    <Link
                      to={featuredPost.link}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Blog Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative rounded-2xl border bg-card/50 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{post.icon}</span>
                      <span className="text-sm font-medium text-primary">{post.category}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <Link
                        to={post.link}
                        className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Categories */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
              <p className="text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest updates and travel tips.
              </p>
              <form className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 