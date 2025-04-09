import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase"
import { Lock, Loader2, Ship, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        ...credentials,
        options: {
          persistSession: true
        }
      })
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      localStorage.setItem('session', JSON.stringify(data.session))
      
      if (rememberMe) {
        const session = data.session
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 30)
        localStorage.setItem('session_expires_at', expiresAt.toISOString())
      }

      toast.success('Welcome back!')
      navigate("/admin", { replace: true })
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to sign in')
    }
  })

  useEffect(() => {
    const checkSession = async () => {
      const storedSession = localStorage.getItem('session')
      const expiresAt = localStorage.getItem('session_expires_at')
      
      if (storedSession && expiresAt) {
        const expirationDate = new Date(expiresAt)
        if (expirationDate > new Date()) {
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            navigate("/admin", { replace: true })
          }
        } else {
          localStorage.removeItem('session')
          localStorage.removeItem('session_expires_at')
        }
      }
    }

    checkSession()
  }, [navigate])

  const handleLogin = (e) => {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background p-4 sm:p-8">
      <div className="w-full max-w-md transform transition-all">
        <div className="bg-card rounded-2xl shadow-xl border p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="relative inline-flex">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 ring-4 ring-primary/30">
                <Ship className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mt-6">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to access your admin dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <label className="block text-sm font-medium mb-2 text-foreground/60">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="relative group">
                <label className="block text-sm font-medium mb-2 text-foreground/60">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <p>Protected admin access only</p>
          </div>
        </div>
      </div>
    </div>
  )
} 