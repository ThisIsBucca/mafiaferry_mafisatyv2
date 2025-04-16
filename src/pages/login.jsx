import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "react-hot-toast"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Icons } from "../components/ui/icons"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(email, password)
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
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full opacity-20"
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
        className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-200 rounded-full opacity-20"
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

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center min-h-screen">
        {/* Left side - Image and Welcome */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:pr-8"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent z-10" />
            <img
              src="https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//ChatGPT%20Image%20Apr%2015,%202025,%2001_15_46%20AM.png"
              alt="Mafia Island"
              className="w-full h-[400px] lg:h-[600px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl lg:text-4xl font-bold mb-2"
              >
                Welcome to Mafia Island
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg lg:text-xl opacity-90"
              >
                Your gateway to paradise
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 flex items-center justify-center"
        >
          <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
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
            <CardContent>
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 transition-colors"
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
            <CardFooter className="flex flex-col space-y-4">
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
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 