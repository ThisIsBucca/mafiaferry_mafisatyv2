import { Outlet, Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

export function AdminLayout() {
  const { logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === `/admin${path}`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-primary mb-8">Admin Panel</h1>
            <nav className="space-y-2">
              <Link
                to="/admin"
                className={`block px-4 py-2 rounded-lg ${
                  isActive("")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/schedules"
                className={`block px-4 py-2 rounded-lg ${
                  isActive("/schedules")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                Schedules
              </Link>
              <Link
                to="/admin/articles"
                className={`block px-4 py-2 rounded-lg ${
                  isActive("/articles")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                Articles
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 rounded-lg text-foreground hover:bg-accent"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="ml-64 flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
} 