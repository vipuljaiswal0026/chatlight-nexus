
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-project.supabase.co';
// Note: This is the public key, not a secret
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
