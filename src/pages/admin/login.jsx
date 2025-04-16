import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../../contexts/AuthContext"
import { toast } from "react-hot-toast"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Checkbox } from "../../components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Icons } from "../../components/ui/icons"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Initialize dark mode
    const savedTheme = localStorage.getItem("theme") ?? "dark"
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    }

    // Check for remembered email
    const rememberedEmail = localStorage.getItem("rememberedEmail")
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(email, password)
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }
      
      toast.success("Logged in successfully")
      navigate("/admin")
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.message || "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full opacity-20"
        animate={{
          y: [0, 20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 rounded-full opacity-20"
        animate={{
          y: [0, -20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <Card className="w-full shadow-xl border-0 bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left side - Quote Section */}
              <div className="hidden lg:block w-1/2 bg-primary/5 p-8 lg:p-12">
                <div className="relative h-full">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full translate-x-1/2 translate-y-1/2" />
                  
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-1 bg-primary/30 rounded-full" />
                      <span className="text-primary text-sm font-medium">Testimonial</span>
                    </div>

                    <blockquote className="space-y-6">
                      <p className="text-2xl lg:text-3xl font-medium text-foreground leading-relaxed">
                        "Mafia Island is a hidden gem in the Indian Ocean, where time slows down and nature's beauty takes center stage. The crystal-clear waters and pristine beaches create an unforgettable paradise experience."
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                          <img
                            src="https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//Runway%202025-02-12T17_59_48.795Z%20Erase%20and%20Replace%20remove%20this%20icons.png"
                            alt="Bucca Rasta"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Bucca Rasta</p>
                          <p className="text-sm text-muted-foreground">CEO, MafiaFerry</p>
                        </div>
                      </div>
                    </blockquote>

                    <div className="mt-8 flex items-center gap-4">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-sm text-muted-foreground">Mafia Island</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Login Form */}
              <div className="w-full lg:w-1/2 p-8 lg:p-12">
                <CardHeader className="space-y-1 p-0">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CardTitle className="text-2xl lg:text-3xl font-bold text-center text-primary">
                      Welcome Back!
                    </CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                      Enter your credentials to access the admin dashboard
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent className="p-0 pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border-2 focus:border-primary transition-colors"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border-2 focus:border-primary transition-colors"
                      />
                    </motion.div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked)}
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </Label>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
                <CardFooter className="p-0 pt-6 flex flex-col space-y-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm text-center text-muted-foreground"
                  >
                    <Link
                      to="/"
                      className="hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <Icons.arrowLeft className="h-4 w-4" />
                      Back to Home
                    </Link>
                  </motion.div>
                </CardFooter>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 