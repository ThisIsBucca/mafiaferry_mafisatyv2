import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  throw new Error('Missing Supabase environment variables')
}

// Common options for all requests
const commonOptions = {
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      'apikey': supabaseKey
    }
  }
}

// Create a single instance of the Supabase client for authenticated operations
export const supabase = createClient(supabaseUrl, supabaseKey, {
  ...commonOptions,
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token'
  }
})

// Set up auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear any cached data when user signs out
    console.log('User signed out, clearing cached data')
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Auth token refreshed')
  }
})

// Create a read-only client for public data
export const publicSupabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    ...commonOptions,
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
)