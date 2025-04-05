import { Link } from "react-router-dom"

export function NewsUpdates() {
  // Sample news data
  const news = [
    {
      id: 1,
      title: "New Ferry Service to Pemba Island",
      excerpt: "We are excited to announce our new route to Pemba Island starting next month.",
      date: "2024-04-01",
      image: "/news-1.jpg",
    },
    {
      id: 2,
      title: "Special Discount for Students",
      excerpt: "Students can now enjoy 20% discount on all ferry tickets with valid ID.",
      date: "2024-03-28",
      image: "/news-2.jpg",
    },
    {
      id: 3,
      title: "Improved Safety Measures",
      excerpt: "We have implemented new safety protocols to ensure a safe journey for all passengers.",
      date: "2024-03-25",
      image: "/news-3.jpg",
    },
  ]

  return (
    <section className="py-12 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Latest News & Updates
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-muted-foreground sm:mt-4">
            Stay informed about our latest services and announcements
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-background"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-48 w-full object-cover"
                  src={item.image}
                  alt={item.title}
                />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <Link to={`/news/${item.id}`} className="block mt-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-base text-muted-foreground">
                      {item.excerpt}
                    </p>
                  </Link>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/news/${item.id}`}
                    className="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90"
          >
            View All News
          </Link>
        </div>
      </div>
    </section>
  )
} 