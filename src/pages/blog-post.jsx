import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Calendar, Clock } from "lucide-react"

export default function BlogPost() {
  const { id } = useParams()
  const navigate = useNavigate()

  // This would typically come from an API or database
  const post = {
    title: "Complete Guide to Mafia Island Ferries",
    date: "2024-03-15",
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
    category: "Travel Guide",
    readingTime: "5 min read",
  }

  return (
    <article className="container px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl"
      >
        <header className="mb-8">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readingTime}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
            {post.category}
          </div>
        </header>

        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.div>
    </article>
  )
} 