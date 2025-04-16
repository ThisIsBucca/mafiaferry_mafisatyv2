import { supabase } from './supabase'
import { useAuth } from '../contexts/AuthContext'

// Create a custom fetch function with token refresh
export async function fetchWithAuth(url, options = {}) {
  const { refreshToken, isTokenExpired } = useAuth()

  // Check if token is expired and refresh if needed
  if (isTokenExpired()) {
    await refreshToken()
  }

  // Get the current session
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('No active session')
  }

  // Add authorization header
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${session.access_token}`,
  }

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle 401 Unauthorized responses
  if (response.status === 401) {
    // Try to refresh the token
    await refreshToken()
    
    // Get the new session
    const { data: { session: newSession } } = await supabase.auth.getSession()
    if (!newSession) {
      throw new Error('Failed to refresh session')
    }

    // Retry the request with the new token
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newSession.access_token}`,
      },
    })
  }

  return response
}

// Create a Supabase client with token refresh
export function createSupabaseClient() {
  const { refreshToken, isTokenExpired } = useAuth()

  // Add token refresh middleware to Supabase client
  const client = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed successfully')
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out')
    }
  })

  return client
}

// Helper function to handle API errors
export function handleApiError(error) {
  console.error('API Error:', error)
  if (error.status === 401) {
    // Token expired or invalid
    return { error: 'Session expired. Please log in again.' }
  }
  return { error: error.message || 'An error occurred' }
} 