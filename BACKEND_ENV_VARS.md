# Variables d'environnement pour le Backend (Edge Functions)

Ce document décrit les variables d'environnement nécessaires pour les fonctions edge Supabase qui constituent le backend de l'application.

## Emplacement de configuration

Ces variables sont définies dans `docker-compose.edge-functions.yml` et sont injectées dans le conteneur des edge functions au moment de l'exécution.

**IMPORTANT** : Ces variables contiennent des informations sensibles et ne doivent jamais être stockées dans des fichiers commités sur Git.

## Variables requises

### Variables d'authentification et de connexion Supabase

| Variable | Description | Exemple |
|---------|-------------|---------|
| `JWT_SECRET` | Clé secrète utilisée pour signer les JWT (JSON Web Tokens) | `votre-secret-jwt-complexe` |
| `SUPABASE_URL` | URL de l'API Supabase | `https://api.obdexpress.fr` |
| `SUPABASE_ANON_KEY` | Clé anonyme Supabase (même que dans le frontend) | `eyJ0...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé de service Supabase (accès administrateur) | `eyJ0...` |
| `SUPABASE_DB_URL` | URL de connexion à la base de données PostgreSQL | `postgresql://postgres:password@supabase-db:5432/postgres` |

### Paramètres de configuration des Edge Functions

| Variable | Description | Valeur par défaut |
|---------|-------------|-------------------|
| `VERIFY_JWT` | Valider les JWT pour les requêtes aux edge functions | `false` |
| `DEBUG` | Activer le mode débogage avec logs verbeux | `false` |



## Configuration dans Coolify

Dans l'interface Coolify pour le service Edge Functions :

1. Accédez à la configuration du service backend
2. Dans la section des variables d'environnement, ajoutez chacune des variables ci-dessus avec leurs valeurs appropriées
3. Assurez-vous que le service peut accéder à la base de données PostgreSQL via les paramètres fournis

## Bonnes pratiques

- Ne stockez jamais les secrets (JWT_SECRET, SUPABASE_SERVICE_ROLE_KEY, etc.) dans des fichiers versionnés
- Utilisez des secrets différents pour les environnements de développement, staging et production
- Limitez l'accès à ces informations sensibles uniquement aux personnes qui en ont besoin
