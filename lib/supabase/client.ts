import { createBrowserClient } from "@supabase/ssr";

export const DEFAULT_SUPABASE_URL = "https://ojrnfhdxilsecmqqbfrp.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qcm5maGR4aWxzZWNtcXFiZnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMTgyNjMsImV4cCI6MjEwMzg5NDI2M30.aJXzHGetuVrlzpcvSrCRnlMIV7Atr1sQJ9QzPwyA_-k";

export function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  const isConfigured =
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseAnonKey !== "placeholder-anon-key";

  return { supabaseUrl, supabaseAnonKey, isConfigured };
}

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}


