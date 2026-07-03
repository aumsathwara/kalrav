import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for Server Actions (Admin full access)
export const createAdminClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey)
}
