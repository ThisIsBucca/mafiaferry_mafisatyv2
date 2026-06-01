'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, Calendar, FileText, Package, Menu, X, Home, LogOut, ChevronRight } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

const navItems = [
  { path: "", label: "Dashboard", icon: LayoutDashboard },
  { path: "/schedules", label: "Schedules", icon: Calendar },
  { path: "/articles", label: "Articles", icon: FileText },
  { path: "/products", label: "Products", icon: Package },
]

const iconMap = {
  LayoutDashboard, Calendar, FileText, Package,
}

export default function AdminLayout({ children }) {
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (!isLoginPage && !loading && !user) {
      router.push("/admin/login")
    }
  }, [user, loading, router, isLoginPage])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (loading || !user) {
    return null
  }

  const isActive = (path) => pathname === `/admin${path}`

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error during sign out:', error)
    }
  }

  const NavLink = ({ item, mobile, onClick }) => {
    const active = isActive(item.path)
    const Icon = item.icon
    return (
      <Link
        href={`/admin${item.path}`}
        onClick={onClick}
        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          active
            ? "bg-primary/10 text-primary shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        } ${mobile ? "text-base" : ""}`}
      >
        {active && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 rounded-xl bg-primary/10"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <div className={`relative flex items-center gap-3 ${mobile ? "w-full" : ""}`}>
          <div className={`p-1.5 rounded-lg transition-colors duration-200 ${
            active ? "bg-primary/15 text-primary" : "text-muted-foreground group-hover:text-foreground"
          }`}>
            <Icon className="h-4 w-4" strokeWidth={2} />
          </div>
          <span className="relative">{item.label}</span>
          {active && (
            <motion.div
              layoutId="activeDot"
              className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </div>
      </Link>
    )
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center justify-between px-4 pt-5 pb-6">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
            <span className="text-white font-bold text-sm">MF</span>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">MafiaFerry</p>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Admin Panel</p>
          </div>
        </Link>
        <Link
          href="/"
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
          title="Return to Home"
        >
          <Home className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.path} item={item} />
        ))}
      </nav>

      {/* User & Logout */}
      <div className="px-3 pb-4 pt-4 border-t border-border/30 mt-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
            {user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.email || "Admin"}</p>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all duration-200 group"
        >
          <div className="p-1.5 rounded-lg group-hover:bg-red-500/10 transition-colors">
            <LogOut className="h-4 w-4" strokeWidth={2} />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">MF</span>
            </div>
            <span className="text-sm font-bold text-foreground">MafiaFerry</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              title="Return to Home"
            >
              <Home className="h-4 w-4" strokeWidth={2} />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <Menu className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 z-50 w-72 bg-card border-l border-border/40 shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 h-14 border-b border-border/20">
                <span className="text-sm font-bold text-foreground">Navigation</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
              <div className="p-3 space-y-1 mt-2">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                >
                  <div className="p-1.5 rounded-lg">
                    <Home className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <span>Return to Home</span>
                </Link>
                <div className="h-px bg-border/30 my-2" />
                {navItems.map((item) => (
                  <NavLink key={item.path} item={item} mobile onClick={() => setIsMobileMenuOpen(false)} />
                ))}
                <div className="h-px bg-border/30 my-2" />
                <button
                  onClick={() => { handleSignOut(); setIsMobileMenuOpen(false) }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all"
                >
                  <div className="p-1.5 rounded-lg">
                    <LogOut className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 h-screen fixed left-0 top-0 bg-card/60 backdrop-blur-xl border-r border-border/40 z-30">
          {sidebar}
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="pt-14 lg:pt-0">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
