#!/bin/sh
set -e

# Fonction pour remplacer les variables d'environnement dans le HTML/JS
replace_env_vars() {
  # Générer un fichier JS avec les variables d'environnement
  echo "window.env = {" > /usr/share/nginx/html/env-config.js
  
  # Utiliser les variables VITE_ pour Supabase (format de Vite)
  if [ ! -z "$VITE_SUPABASE_URL" ]; then
    echo "  VITE_SUPABASE_URL: \"$VITE_SUPABASE_URL\"," >> /usr/share/nginx/html/env-config.js
  fi
  if [ ! -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "  VITE_SUPABASE_ANON_KEY: \"$VITE_SUPABASE_ANON_KEY\"," >> /usr/share/nginx/html/env-config.js
  fi
  
  # Support pour les anciennes variables NEXT_PUBLIC_ (compatibilité)
  if [ ! -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "  NEXT_PUBLIC_SUPABASE_URL: \"$NEXT_PUBLIC_SUPABASE_URL\"," >> /usr/share/nginx/html/env-config.js
  fi
  if [ ! -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY: \"$NEXT_PUBLIC_SUPABASE_ANON_KEY\"," >> /usr/share/nginx/html/env-config.js
  fi
  
  # Ajouter d'autres variables d'environnement importantes
  if [ ! -z "$VITE_PUBLIC_SITE_URL" ]; then
    echo "  VITE_PUBLIC_SITE_URL: \"$VITE_PUBLIC_SITE_URL\"," >> /usr/share/nginx/html/env-config.js
  fi
  
  # Fermer l'objet
  echo "};" >> /usr/share/nginx/html/env-config.js
  
  # Afficher les variables pour débogage
  echo "Variables d'environnement chargées dans env-config.js:"
  cat /usr/share/nginx/html/env-config.js
}

# Remplacer les variables d'environnement
replace_env_vars

# Exécuter la commande passée
exec "$@"
