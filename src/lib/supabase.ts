import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ueyggkgbdedfjvreqkmm.supabase.co';
// Provide a fallback string to prevent the app from crashing on load if the secret is missing.
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'missing_anon_key_please_set_in_secrets';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
