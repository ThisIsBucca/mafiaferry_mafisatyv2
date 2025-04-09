import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        // First check localStorage for a stored session
        const storedSession = localStorage.getItem('session')
        if (storedSession) {
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            setUser(session.user)
            setLoading(false)
            return
          }
        }

        // If no stored session, try to refresh
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          localStorage.setItem('session', JSON.stringify(session))
          setUser(session.user)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        localStorage.setItem('session', JSON.stringify(session))
        setUser(session.user)
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('session')
        setUser(null)
      } else if (event === 'INITIAL_SESSION') {
        setUser(session?.user ?? null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: async () => {
      await supabase.auth.signOut()
      localStorage.removeItem('session')
    },
    user,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 