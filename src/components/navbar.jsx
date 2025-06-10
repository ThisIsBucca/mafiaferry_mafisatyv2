import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Sun, Moon, Anchor, Ship, Phone, MessageSquare } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("/")
  const location = useLocation()

  // Theme and scroll handling
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") ?? "dark"
    setIsDark(savedTheme === "dark")
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Section observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-80px 0px -20% 0px",
      threshold: [0.2, 0.5, 0.8]
    }

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0.5) {
          const sectionId = entry.target.id
          setActiveSection(sectionId ? `/#${sectionId}` : "/")
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, options)

    // Observe the home section differently
    const homeSection = document.querySelector('main > section:first-child')
    if (homeSection && !homeSection.id) {
      homeSection.id = "home"
      observer.observe(homeSection)
    }

    // Observe all other sections
    const sections = document.querySelectorAll('section[id]')
    sections.forEach(section => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    localStorage.setItem("theme", !isDark ? "dark" : "light")
    document.documentElement.classList.toggle("dark")
  }
  const navItems = [
    { href: "/", label: "Home", icon: <Anchor className="w-4 h-4" /> },
    { href: "/#schedule", label: "Schedule", icon: <Ship className="w-4 h-4" /> },
    { href: "/#news", label: "News", icon: <MessageSquare className="w-4 h-4" /> },
    { href: "/#contact", label: "Contact", icon: <Phone className="w-4 h-4" /> },
  ]
  const scrollToSection = (elementId) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }
  const handleNavClick = (e, href) => {
    e.preventDefault()
    
    const scrollToTarget = () => {
      if (href === "/") {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
      } else {
        const sectionId = href.replace("/#", "")
        const element = document.getElementById(sectionId)
        if (element) {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          })
        }
      }
    }

    // For mobile: close menu first, then scroll after animation
    if (window.innerWidth < 768) {
      setIsOpen(false)
      // Wait for menu close animation to complete
      setTimeout(scrollToTarget, 300)
    } else {
      // For desktop: scroll immediately
      scrollToTarget()
    }
  }

  const isActive = (path) => {
    // Handle news pages specially
    if (path === "/#news" && location.pathname.startsWith("/news")) {
      return true
    }

    // For home
    if (path === "/" && activeSection === "/") {
      return true
    }

    // For other sections
    return path === activeSection
  }

  // Add scroll event listener to update active state
  useEffect(() => {
    const handleScroll = () => {
      // Force re-render on scroll to update active states
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? "bg-background/95 backdrop-blur-lg shadow-sm" 
        : "bg-background/50 backdrop-blur-sm"
    }`}>
      <div className="container flex h-16 items-center justify-between px-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="relative">
            <Anchor className="w-8 h-8 text-primary" />
            <div className="absolute inset-0 bg-primary/20 blur-lg -z-10" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Mafia Ferry
          </span>
        </Link>        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <div className="flex items-center bg-muted/50 rounded-full p-1">
            {navItems.map((item) => (              <Link
                key={item.href}
                to={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-full group"
              >
                <span className={`flex items-center justify-center gap-2 relative z-10 transition-colors duration-200 ${
                  isActive(item.href)
                    ? "text-white"
                    : "text-muted-foreground group-hover:text-primary"
                }`}>
                  <span className="flex items-center justify-center w-4 h-4">
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                {isActive(item.href) && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ 
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                      duration: 0.3 
                    }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="w-px h-6 bg-border mx-2" />
            <motion.button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-muted/50 hover:bg-primary/10 transition-colors relative overflow-hidden"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isDark ? "dark" : "light"}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-foreground" />
                ) : (
                  <Moon className="h-5 w-5 text-foreground" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </nav>

        {/* Mobile Menu Button */}        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="text-foreground dark:text-foreground">
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </span>
        </button>
      </div>      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t bg-background/95 backdrop-blur-lg overflow-hidden"
          >
            <nav className="container py-4 space-y-2 px-4">
              {navItems.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={item.href}
                >                  <Link
                    to={item.href}
                    className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-primary text-white"
                        : "text-foreground dark:text-foreground hover:bg-muted"
                    }`}
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    <span className="flex items-center justify-center w-5 h-5">
                      <span className={`${isActive(item.href) ? "text-white" : "text-primary dark:text-primary"}`}>
                        {item.icon}
                      </span>
                    </span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
              >                <button
                  onClick={() => {
                    toggleTheme()
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground dark:text-foreground hover:bg-muted transition-all duration-200"
                >
                  <span className="flex items-center justify-center w-5 h-5 text-primary dark:text-primary">
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </span>
                  {isDark ? "Light Mode" : "Dark Mode"}
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}