FROM supabase/edge-runtime:v1.67.4

# Installation des outils de diagnostic
RUN apt-get update && apt-get install -y curl jq && apt-get clean

# Créer le répertoire pour les fonctions
WORKDIR /home/deno

# Créer les répertoires de fonctions
RUN mkdir -p /home/deno/functions

# Copier les fonctions depuis le répertoire local
COPY ./supabase/functions/ /home/deno/functions/

# Exposer le port utilisé par Edge Functions
EXPOSE 9000

# Script de démarrage pour les fonctions
COPY <<'EOF' /home/deno/start.sh
#!/bin/sh
set -e

# Liste les variables d'environnement disponibles
if [ "$DEBUG" = "true" ]; then
  echo "Variables d'environnement disponibles:"
  env | grep -v PASSWORD | grep -v KEY
fi

# Démarrer le service Edge Functions
exec deno run --allow-net --allow-env --allow-read /home/deno/functions/main/index.ts
EOF

RUN chmod +x /home/deno/start.sh

# Commande de démarrage
CMD ["/home/deno/start.sh"]
