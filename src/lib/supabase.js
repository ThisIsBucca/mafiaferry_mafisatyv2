import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Add error handling and logging
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials')
}

// Make sure we're using the anon key for public access
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Don't persist auth state for public queries
  }
}) 