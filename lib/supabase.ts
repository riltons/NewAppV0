import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey

let supabase: ReturnType<typeof createClient> | null = null

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl!, supabaseAnonKey!)
} else {
  console.warn("Supabase environment variables are missing. Some features may not work.")
}

export { supabase }

