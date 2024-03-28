import { createClient } from "@supabase/supabase-js";
import { Podcast } from '../../lib/types/podcast'; // Assuming your schema is in 'podcast.ts'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.toString();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.toString();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables!');
}

let supabaseClient: any;

try {
  // Move the assignment outside the try block
  supabaseClient = createClient<Podcast>(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error('Error connecting to Supabase: ', error);
}

export const SupabaseClient = {
  getSupabaseClient() {
    if (!supabaseClient) {
      throw new Error('Supabase client is not connected');
    }
    return supabaseClient;
  },
};
