import { createHashRouter } from "react-router-dom"
import { MainContent } from "./App"
import { Blog } from "./pages/blog"
import { Navbar } from "./components/navbar"
import { Footer } from "./components/footer"
import BlogPost from "./pages/blog-post"
import { ArticlePage } from "./pages/news/article"
import { AdminLayout } from "./components/admin/AdminLayout"
import Dashboard from "./pages/admin/dashboard"
import SchedulesAdmin from "./pages/admin/schedules"
import { ArticlesAdmin } from "./pages/admin/articles"
import { LoginPage } from "./pages/admin/login"
import { ProtectedRoute } from './components/ProtectedRoute'

export const router = createHashRouter([
  {
    path: "/",
    element: <MainContent />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/news/:id",
    element: <ArticlePage />,
  },
  {
    path: "/blog/:id",
    element: (
      <div className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <BlogPost />
        <Footer />
      </div>
    ),
  },
  {
    path: "/admin/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "schedules",
        element: <SchedulesAdmin />,
      },
      {
        path: "articles",
        element: <ArticlesAdmin />,
      },
    ],
  },
]) 