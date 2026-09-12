import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

/**
 * Utility function to verify if real Supabase credentials are configured.
 * Services can use this flag to seamlessly fall back to mock datasets when offline or during demo testing.
 */
export const isSupabaseConfigured = () => {
  return (
    Boolean(import.meta.env.VITE_SUPABASE_URL) &&
    Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-supabase-project-id.supabase.co' &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your-supabase-anon-key-here'
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
