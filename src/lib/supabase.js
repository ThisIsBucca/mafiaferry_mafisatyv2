import { createClient } from '@supabase/supabase-js'

function getCommonOptions(key) {
  return {
    global: {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        'apikey': key || ''
      }
    }
  }
}

let supabaseInstance = null
let publicSupabaseInstance = null

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || ''
}

function getSupabaseKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
}

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance

  const url = getSupabaseUrl()
  const key = getSupabaseKey()

  if (!url || !key) {
    console.warn('Supabase env vars not set — creating dummy client')
  }

  supabaseInstance = createClient(url, key, {
    ...getCommonOptions(key),
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.token'
    }
  })

  supabaseInstance.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      console.log('User signed out, clearing cached data')
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('Auth token refreshed')
    }
  })

  return supabaseInstance
}

export function getPublicSupabase() {
  if (publicSupabaseInstance) return publicSupabaseInstance

  const url = getSupabaseUrl()
  const key = getSupabaseKey()

  if (!url || !key) {
    console.warn('Supabase env vars not set — creating dummy client')
  }

  publicSupabaseInstance = createClient(url, key, {
    ...getCommonOptions(key),
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })

  return publicSupabaseInstance
}