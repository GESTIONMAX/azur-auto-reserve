# Configuration de déploiement Coolify pour azur-auto-reserve

Ce document décrit la configuration nécessaire pour déployer l'application azur-auto-reserve via Coolify, en utilisant une configuration optimisée pour les applications SPA React avec Vite.

## 1. Structure de déploiement

Le déploiement s'appuie sur trois fichiers principaux :

- `Dockerfile` : Pour la construction de l'image Docker
- `docker-compose.yaml` : Pour la configuration des services et réseaux
- `nginx.conf` : Pour la configuration du serveur web qui sert l'application

## 2. Variables d'environnement requises

Pour que le déploiement fonctionne correctement, vous devez configurer les variables d'environnement suivantes dans Coolify :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | URL de votre instance Supabase | https://api.exemple.com |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase | eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI... |
| `DOMAIN` | Le nom de domaine pour votre application | www.exemple.fr |
| `COMPOSE_PROJECT_NAME` | Nom du projet (utilisé pour les labels Traefik) | azur-auto-reserve |

## 3. Particularités de la configuration

### Dockerfile

- Construction en deux étapes (build et production)
- Injection des variables d'environnement au moment du build via ARG
- Création d'un fichier .env.production pour Vite
- Utilisation du script docker-entrypoint.sh pour les variables d'environnement à l'exécution

### docker-compose.yaml

- Intégration avec le réseau `traefik-public` (doit exister dans Coolify)
- Configuration des labels Traefik pour le routage HTTPS et la gestion des certificats
- Middleware SPA pour rediriger les 404 vers l'application React
- Compression des réponses pour de meilleures performances

### nginx.conf

- Configuration optimisée pour une Single Page Application (SPA)
- Gestion des types MIME pour JavaScript modules
- Cache longue durée pour les assets statiques
- En-têtes de sécurité (X-Frame-Options, X-Content-Type-Options, etc.)

## 4. Instructions de déploiement sur Coolify

1. Assurez-vous que les trois fichiers (`Dockerfile`, `docker-compose.yaml`, `nginx.conf`) sont à la racine du projet
2. Créez un nouveau déploiement dans Coolify et pointez vers votre dépôt Git
3. Configurez les variables d'environnement mentionnées ci-dessus
4. Vérifiez que le réseau `traefik-public` existe (créez-le si nécessaire)
5. Lancez le déploiement

## 5. Vérification après déploiement

Après le déploiement, vérifiez les points suivants :

- Le site est accessible via HTTPS à l'adresse configurée (DOMAIN)
- Les fichiers statiques sont correctement mis en cache (vérifiable dans les DevTools du navigateur)
- L'application SPA gère correctement les routes (pas de 404 lors de la navigation)
- Les variables d'environnement sont correctement injectées (vérifier les logs Docker)
