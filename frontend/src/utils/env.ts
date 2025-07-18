/**
 * Utilitaire pour récupérer les variables d'environnement en développement et en production
 * Fonctionne avec Vite en développement et avec Docker en production via window.env
 */

declare global {
  interface Window {
    env?: Record<string, string>;
  }
}

/**
 * Récupère une variable d'environnement, en cherchant d'abord dans window.env (Docker)
 * puis dans import.meta.env (Vite)
 */
export const getEnv = (key: string): string | undefined => {
  // En production via Docker
  if (typeof window !== 'undefined' && window.env && window.env[key]) {
    return window.env[key];
  }
  
  // En développement via Vite
  // Vite remplace dynamiquement import.meta.env par les variables d'environnement
  // On utilise une syntaxe qui fonctionne en TypeScript même si le type exact n'est pas connu
  return import.meta.env[key as keyof ImportMetaEnv] as string | undefined;
};

/**
 * Variables d'environnement pour Supabase
 */
export const ENV = {
  SUPABASE_URL: getEnv('VITE_SUPABASE_URL') || '',
  SUPABASE_ANON_KEY: getEnv('VITE_SUPABASE_ANON_KEY') || '',
  SITE_URL: getEnv('VITE_PUBLIC_SITE_URL') || window.location.origin
};
