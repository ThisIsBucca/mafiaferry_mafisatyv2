import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Add error handling and logging
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
}

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey) 