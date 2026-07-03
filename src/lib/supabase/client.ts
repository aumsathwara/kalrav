import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client for browser usage (Parents / public read-only access)
export const createBrowserClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createBrowserClient()
