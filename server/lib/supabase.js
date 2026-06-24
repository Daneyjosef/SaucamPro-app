import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment");
}

const clientOptions = {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
};

// Anon client — used for JWT verification (respects RLS)
export const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, clientOptions);

// Admin/service-role client — bypasses RLS (alert engine, reading auth.users)
// Only used server-side. Never expose the service role key to clients.
export const adminClient = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, clientOptions)
  : null;
