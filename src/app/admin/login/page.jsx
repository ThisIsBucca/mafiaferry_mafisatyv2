'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "../../../contexts/AuthContext"
import { toast } from "react-hot-toast"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Checkbox } from "../../../components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Icons } from "../../../components/ui/icons"
import { Anchor } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") ?? "dark"
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    }
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
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }
      toast.success("Logged in successfully")
      router.push("/admin")
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.message || "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden p-4">
      {/* Animated background shapes */}
      <motion.div
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 w-full max-w-md lg:max-w-5xl">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6 items-stretch">
          {/* Desktop testimonial panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden lg:flex lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/10 p-8 flex-col justify-between min-h-[500px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_60%)]" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-lg p-1.5">
                  <img src="/mafia_ferry.png" alt="MafiaFerry" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">MafiaFerry</p>
                  <p className="text-xs text-muted-foreground">Admin Portal</p>
                </div>
              </div>
              <div className="space-y-1 mb-8">
                <div className="w-16 h-1 rounded-full bg-primary/40" />
                <p className="text-xs font-medium text-primary tracking-widest uppercase">Testimonial</p>
              </div>
              <blockquote className="space-y-6">
                <div className="relative">
                  <span className="absolute -top-4 -left-2 text-5xl text-primary/20 font-serif leading-none">&ldquo;</span>
                  <p className="text-xl leading-relaxed text-foreground/90 font-medium pl-4">
                    Mafia Island is a hidden gem in the Indian Ocean, where time slows down and nature&apos;s beauty takes center stage. The crystal-clear waters and pristine beaches create an unforgettable paradise experience.
                  </p>
                </div>
              </blockquote>
            </div>
            <div className="relative z-10 mt-auto pt-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background/40 backdrop-blur-sm border border-primary/5">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0">
                  <img
                    src="https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//Runway%202025-02-12T17_59_48.795Z%20Erase%20and%20Replace%20remove%20this%20icons.png"
                    alt="Bucca Rasta"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Bucca Rasta</p>
                  <p className="text-xs text-muted-foreground">CEO, MafiaFerry</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <Card className="w-full border border-border/50 bg-card/70 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden">
              <div className="p-6 sm:p-8 lg:p-10">
                {/* Mobile branding */}
                <div className="flex flex-col items-center mb-8 lg:hidden">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-black/10 mb-4 p-2"
                  >
                    <img src="/mafia_ferry.png" alt="MafiaFerry" className="w-full h-full object-contain" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-center text-foreground">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-center text-muted-foreground mt-1 max-w-xs">
                    Sign in to manage your MafiaFerry dashboard
                  </CardDescription>
                </div>

                {/* Desktop heading */}
                <div className="hidden lg:block mb-8">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                        <Anchor className="h-5 w-5 text-white" strokeWidth={2} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-foreground">
                          Welcome Back
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-sm">
                          Sign in to manage your dashboard
                        </CardDescription>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="email" className="text-sm font-medium text-foreground/90">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@maisiaferry.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 px-4 text-base border-2 focus:border-primary transition-all duration-200 bg-background/50"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground/90">
                        Password
                      </Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 px-4 text-base border-2 focus:border-primary transition-all duration-200 bg-background/50"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked)}
                    />
                    <Label htmlFor="remember" className="text-sm font-medium text-foreground/80 cursor-pointer select-none">
                      Remember me
                    </Label>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Icons.spinner className="h-5 w-5 animate-spin" />
                          Logging in...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Sign In
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 pt-6 border-t border-border/40"
                >
                  <Link
                    href="/"
                    className="group flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    <Icons.arrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                    Back to Home
                  </Link>
                </motion.div>
              </div>
            </Card>

            {/* Mobile testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 p-5 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 lg:hidden"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-5 rounded-full bg-primary/40" />
                <p className="text-xs font-medium text-primary tracking-widest uppercase">Testimonial</p>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                &ldquo;Mafia Island is a hidden gem in the Indian Ocean, where time slows down and nature&apos;s beauty takes center stage.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0">
                  <img
                    src="https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//Runway%202025-02-12T17_59_48.795Z%20Erase%20and%20Replace%20remove%20this%20icons.png"
                    alt="Bucca Rasta"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Bucca Rasta</p>
                  <p className="text-xs text-muted-foreground">CEO, MafiaFerry</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
