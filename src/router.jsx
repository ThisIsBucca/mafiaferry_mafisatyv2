import { createBrowserRouter } from "react-router-dom"
import Blog from "./pages/blog"
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
import { RouteChangeListener } from "./components/RouteChangeListener"
import NotFound from "./pages/NotFound"

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <>
          <RouteChangeListener />
          <MainContent />
        </>
      ),
    },
    {
      path: "/blog",
      element: (
        <div className="min-h-screen bg-background font-sans antialiased">
          <Navbar />
          <Blog />
          <Footer />
        </div>
      ),
    },
    {
      path: "/blog/:slug",
      element: (
        <div className="min-h-screen bg-background font-sans antialiased">
          <Navbar />
          <Blog />
          <Footer />
        </div>
      ),
    },
    {
      path: "/news/:id",
      element: <ArticlePage />,
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
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
) 