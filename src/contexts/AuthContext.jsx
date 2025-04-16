import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored session
    const storedSession = localStorage.getItem('supabase.auth.token')
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession)
        setUser(session.user)
      } catch (error) {
        console.error('Error parsing stored session:', error)
        localStorage.removeItem('supabase.auth.token')
      }
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user)
        localStorage.setItem('supabase.auth.token', JSON.stringify(session))
      } else {
        setUser(null)
        localStorage.removeItem('supabase.auth.token')
      }
      setLoading(false)
    })

    // Set up token refresh
    const refreshToken = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error refreshing token:', error)
        return
      }

      if (session) {
        setUser(session.user)
        localStorage.setItem('supabase.auth.token', JSON.stringify(session))
      }
    }

    // Refresh token every 30 minutes
    const refreshInterval = setInterval(refreshToken, 30 * 60 * 1000)

    return () => {
      subscription.unsubscribe()
      clearInterval(refreshInterval)
    }
  }, [])

  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  const signIn = async (email, password, rememberMe = false) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      // Set session persistence based on remember me
      if (rememberMe) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
      }

      setUser(data.user)
      localStorage.setItem('supabase.auth.token', JSON.stringify(data.session))
      return data
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('supabase.auth.token')
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear user state
      setUser(null)
      
      // Show success message
      console.log('Successfully signed out')
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const isTokenExpired = () => {
    const storedSession = localStorage.getItem('supabase.auth.token')
    if (!storedSession) return true

    try {
      const session = JSON.parse(storedSession)
      const expiresAt = session.expires_at * 1000 // Convert to milliseconds
      return Date.now() >= expiresAt
    } catch (error) {
      console.error('Error checking token expiration:', error)
      return true
    }
  }

  const refreshToken = async () => {
    if (isTokenExpired()) {
      try {
        const { data: { session }, error } = await supabase.auth.refreshSession()
        if (error) throw error
        if (session) {
          setUser(session.user)
          localStorage.setItem('supabase.auth.token', JSON.stringify(session))
        }
      } catch (error) {
        console.error('Error refreshing token:', error)
        await signOut()
      }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    refreshToken,
    isTokenExpired,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 