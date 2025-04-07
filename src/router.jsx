import { createBrowserRouter } from "react-router-dom"
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
import { MainContent } from "./App"

export const router = createBrowserRouter(
  [
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
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
) 