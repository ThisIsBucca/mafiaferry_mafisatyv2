import { useParams } from "react-router-dom"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function NewsArticle() {
  const { id } = useParams()
  
  // In a real app, this would be fetched from an API
  const article = {
    id: 1,
    title: "New Ferry Terminal Opening in Tema",
    content: `
      <p>We are excited to announce the opening of our new ferry terminal in Tema. This state-of-the-art facility represents a significant milestone in our commitment to providing world-class maritime transportation services in Ghana.</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Modern passenger waiting areas</li>
        <li>Enhanced security systems</li>
        <li>Improved boarding facilities</li>
        <li>Expanded parking capacity</li>
        <li>New retail and dining options</li>
      </ul>
      
      <p>The new terminal is designed to accommodate our growing passenger numbers while maintaining the highest standards of safety and comfort. We look forward to welcoming you to our new facility.</p>
    `,
    date: "2024-03-15",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        to="/blog"
        className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to News
      </Link>

      <article className="max-w-3xl mx-auto">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <div className="flex items-center mr-4">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{article.readTime}</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-6">{article.title}</h1>
        
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  )
} 