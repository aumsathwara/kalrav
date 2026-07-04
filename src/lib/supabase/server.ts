import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

let globalAdminClient: SupabaseClient | null = null

// Client for Server Actions (Admin full access)
export const createAdminClient = () => {
  if (!globalAdminClient) {
    globalAdminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  }
  return globalAdminClient
}
