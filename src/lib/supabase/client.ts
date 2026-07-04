import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let globalBrowserClient: SupabaseClient | null = null

export const createBrowserClient = () => {
  if (!globalBrowserClient) {
    globalBrowserClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return globalBrowserClient
}

export const supabase = createBrowserClient()
