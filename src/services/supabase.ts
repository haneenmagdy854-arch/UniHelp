import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Check backend connection status and return diagnostic info
 */
export async function checkBackendConnection(): Promise<{
  connected: boolean;
  message: string;
  isMock: boolean;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      message: 'Supabase credentials are not configured in .env.',
      isMock: false,
    };
  }

  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      return {
        connected: false,
        message: `Supabase error: ${error.message}`,
        isMock: true,
      };
    }
    return {
      connected: true,
      message: 'Connected to Supabase PostgreSQL backend.',
      isMock: false,
    };
  } catch (err: unknown) {
    return {
      connected: false,
      message: `Failed to reach Supabase: ${err instanceof Error ? err.message : 'Network error'}`,
      isMock: false,
    };
  }
}
