import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useState } from "react"
import { Menu, X, Home } from "lucide-react"

export function AdminLayout() {
  const { signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === `/admin${path}`
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error during sign out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="p-2 rounded-lg hover:bg-accent"
              title="Return to Home"
            >
              <Home className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-accent"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 bg-card border-r border-border h-screen fixed left-0 top-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
              <Link
                to="/"
                className="p-2 rounded-lg hover:bg-accent"
                title="Return to Home"
              >
                <Home className="h-5 w-5" />
              </Link>
            </div>
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
              <Link
                to="/admin/products"
                className={`block px-4 py-2 rounded-lg ${
                  isActive("/products")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                Products
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 rounded-lg text-foreground hover:bg-accent"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-64 bg-card border-l border-border">
              <div className="p-4">
                <nav className="space-y-2">
                  <Link
                    to="/"
                    className="block px-4 py-2 rounded-lg text-foreground hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Return to Home
                  </Link>
                  <Link
                    to="/admin"
                    className={`block px-4 py-2 rounded-lg ${
                      isActive("")
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
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
                    onClick={() => setIsMobileMenuOpen(false)}
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
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Articles
                  </Link>
                  <Link
                    to="/admin/products"
                    className={`block px-4 py-2 rounded-lg ${
                      isActive("/products")
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-foreground hover:bg-accent"
                  >
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="lg:ml-64 flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}