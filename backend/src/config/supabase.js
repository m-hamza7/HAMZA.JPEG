/**
 * supabase.js
 * Initialises and exports the Supabase client (service-role, server-side only).
 * Uses the SERVICE_ROLE key so the backend can bypass RLS when needed.
 */

const { createClient } = require('@supabase/supabase-js');

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    '[config/supabase] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env'
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    // Service-role key — never expose to the browser
    persistSession: false,
    autoRefreshToken: false,
  },
});

module.exports = supabase;
