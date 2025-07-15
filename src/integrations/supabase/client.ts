import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/utils/env';
import type { Database } from './database.types';

// Vérifier que les variables d'environnement sont définies
if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
  throw new Error('Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies');
}

// Crée le client Supabase avec les variables d'environnement qui fonctionnent
// à la fois en développement (via Vite) et en production (via Docker)
export const supabase = createClient<Database>(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";