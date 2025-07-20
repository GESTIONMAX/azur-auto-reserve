#!/bin/sh
set -e

# Fonction pour remplacer les variables d'environnement dans le HTML/JS
replace_env_vars() {
  ENV_CONFIG_FILE="/usr/share/nginx/html/env-config.js"
  echo "[INFO] Génération du fichier $ENV_CONFIG_FILE"
  
  # Vérifier si les variables d'environnement Supabase sont définies
  if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "[WARN] VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY non défini!"
    echo "[WARN] Valeurs actuelles:"
    echo "[WARN] VITE_SUPABASE_URL=$VITE_SUPABASE_URL"
    echo "[WARN] VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY"
    echo "[WARN] Création d'un fichier env-config.js avec des valeurs par défaut!"
  fi
  
  # Générer un fichier JS avec les variables d'environnement
  echo "// Configuration des variables d'environnement - généré automatiquement" > "$ENV_CONFIG_FILE"
  echo "window.env = {" >> "$ENV_CONFIG_FILE"
  
  # Utiliser les variables VITE_ et les mapper aussi en NEXT_PUBLIC_
  # SUPABASE URL
  if [ ! -z "$VITE_SUPABASE_URL" ]; then
    echo "  VITE_SUPABASE_URL: \"$VITE_SUPABASE_URL\"," >> "$ENV_CONFIG_FILE"
    echo "  NEXT_PUBLIC_SUPABASE_URL: \"$VITE_SUPABASE_URL\"," >> "$ENV_CONFIG_FILE"
  else
    # Valeur par défaut si absente
    echo "  VITE_SUPABASE_URL: \"https://api.obdexpress.fr\"," >> "$ENV_CONFIG_FILE"
    echo "  NEXT_PUBLIC_SUPABASE_URL: \"https://api.obdexpress.fr\"," >> "$ENV_CONFIG_FILE"
  fi
  
  # SUPABASE ANON KEY
  if [ ! -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "  VITE_SUPABASE_ANON_KEY: \"$VITE_SUPABASE_ANON_KEY\"," >> "$ENV_CONFIG_FILE"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY: \"$VITE_SUPABASE_ANON_KEY\"," >> "$ENV_CONFIG_FILE"
  else
    # Valeur par défaut si absente
    echo "  VITE_SUPABASE_ANON_KEY: \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MjY2NTg4MCwiZXhwIjo0OTA4MzM5NDgwLCJyb2xlIjoiYW5vbiJ9.vzVhy6cNeBDLCWkAZCskjTS7m7VfkuUUELc5cOH_7as\"," >> "$ENV_CONFIG_FILE"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY: \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MjY2NTg4MCwiZXhwIjo0OTA4MzM5NDgwLCJyb2xlIjoiYW5vbiJ9.vzVhy6cNeBDLCWkAZCskjTS7m7VfkuUUELc5cOH_7as\"," >> "$ENV_CONFIG_FILE"
  fi
  
  # Configurations supplémentaires peuvent être ajoutées ici si nécessaire
  
  # Autres variables
  if [ ! -z "$VITE_PUBLIC_SITE_URL" ]; then
    echo "  VITE_PUBLIC_SITE_URL: \"$VITE_PUBLIC_SITE_URL\"," >> "$ENV_CONFIG_FILE"
  fi
  
  # Fermer l'objet
  echo "};" >> "$ENV_CONFIG_FILE"
  
  # S'assurer que le fichier a les bonnes permissions
  chmod 644 "$ENV_CONFIG_FILE"
  
  # Vérifier le contenu du fichier
  echo "[INFO] Variables d'environnement chargées dans env-config.js:"
  cat "$ENV_CONFIG_FILE"
  
  # Créer un .htaccess pour forcer le bon MIME type
  echo "[INFO] Création du fichier .htaccess pour forcer le bon MIME type"
  cat > "/usr/share/nginx/html/.htaccess" << EOF
# Force JavaScript MIME type
<FilesMatch "\.(js|mjs|jsx|ts|tsx)$">
AddType text/javascript .js .mjs .jsx .ts .tsx
</FilesMatch>
EOF
  
  # Créer aussi un fichier vide main.js au cas où
  echo "// Fichier de secours" > "/usr/share/nginx/html/main.js"
  chmod 644 "/usr/share/nginx/html/main.js"
}

# Fonction pour vérifier les fichiers cruciaux
check_critical_files() {
  echo "[INFO] Vérification des fichiers critiques dans /usr/share/nginx/html:"
  ls -la /usr/share/nginx/html/ | grep -E 'index.html|env-config.js|main|assets'
}

# Remplacer les variables d'environnement
replace_env_vars

# Vérifier les fichiers critiques
check_critical_files

# Exécuter la commande passée
echo "[INFO] Démarrage du serveur Nginx..."
exec "$@"
