# Déploiement Unifié Frontend/Backend sur Coolify

Ce document explique comment déployer à la fois le frontend React/Vite et le backend Supabase Edge Functions dans une seule instance Coolify pour le projet azur-auto-reserve.

## Architecture

Cette configuration utilise une approche de type "monorepo" où :
- Le **frontend** (React/Vite) répond sur la racine du domaine (`https://votre-domaine.com/`)
- Le **backend** (Edge Functions) répond uniquement aux chemins `/functions/v1/*` (`https://votre-domaine.com/functions/v1/...`)

Traefik agit comme un proxy intelligent qui route les requêtes vers le service approprié en fonction du chemin d'accès.

## Fichiers de Configuration

- `Dockerfile` - Pour le build du frontend
- `Dockerfile.backend` - Pour le build du backend (Edge Functions)
- `docker-compose.unified.yaml` - Configuration unifiée pour déployer les deux services

## Variables d'Environnement

### Variables Frontend (côté client)
| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | URL publique de votre instance Supabase | `https://votre-projet.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase (publique) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Variables Backend (côté serveur)
| Variable | Description | Exemple |
|----------|-------------|---------|
| `JWT_SECRET` | Clé secrète pour la validation des tokens JWT | `votre_jwt_secret` |
| `SUPABASE_URL` | URL de votre instance Supabase | `https://votre-projet.supabase.co` |
| `SUPABASE_ANON_KEY` | Clé anonyme Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé de service Supabase (privée) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_DB_URL` | URL de connexion à la base de données (optionnel) | `postgresql://...` |
| `VERIFY_JWT` | Vérifier les JWT sur les requêtes | `false` |
| `DEBUG` | Activer le mode debug | `false` |

### Variables Communes
| Variable | Description | Exemple |
|----------|-------------|---------|
| `DOMAIN` | Domaine pour le déploiement | `votre-domaine.com` |
| `COMPOSE_PROJECT_NAME` | Nom du projet (pour les labels et containers) | `azur-auto-reserve` |

### Note de Sécurité
⚠️ **Important** : Les variables avec préfixe `VITE_` sont exposées au client (navigateur). Ne stockez jamais d'informations sensibles dans ces variables. Utilisez les variables backend sans préfixe pour les secrets.

## Procédure de Déploiement sur Coolify

### 1. Préparation du Projet
- Assurez-vous que votre dépôt contient tous les fichiers nécessaires :
  - `Dockerfile`
  - `Dockerfile.backend`
  - `docker-compose.unified.yaml`
  - Structure du projet frontend
  - Dossier `supabase/functions/` avec vos Edge Functions

### 2. Création/Modification de l'Instance Coolify
1. Dans Coolify, accédez à la page "Applications"
2. Cliquez sur "New Application" (ou modifiez une instance existante)
3. Sélectionnez "Docker Compose"
4. Pointez vers votre dépôt Git
5. Spécifiez la branche à déployer (généralement `main` ou `master`)
6. Dans les options avancées :
   - Spécifiez `docker-compose.unified.yaml` comme fichier docker-compose

### 3. Configuration des Variables d'Environnement
1. Dans l'onglet "Environment Variables", ajoutez toutes les variables requises :
   - Variables frontend avec préfixe `VITE_`
   - Variables backend sans préfixe
   - Variables communes (`DOMAIN`, `COMPOSE_PROJECT_NAME`)
2. Assurez-vous que les valeurs de `VITE_SUPABASE_URL`/`SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`/`SUPABASE_ANON_KEY` sont cohérentes

### 4. Déploiement et Vérification
1. Lancez le déploiement depuis Coolify
2. Une fois terminé, vérifiez :
   - Le frontend : `https://votre-domaine.com/`
   - Le backend : `https://votre-domaine.com/functions/v1/hello`

## Dépannage

### Problèmes Courants et Solutions

#### Le Frontend ne charge pas correctement
- Vérifiez les logs du container frontend
- Assurez-vous que les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont correctement définies
- Vérifiez la configuration Traefik dans `docker-compose.unified.yaml`

#### Les Edge Functions ne répondent pas
- Vérifiez que vos fonctions sont correctement copiées dans l'image (chemin `/home/deno/functions/`)
- Assurez-vous que la variable `JWT_SECRET` correspond à celle de votre instance Supabase
- Vérifiez les logs du container backend pour tout message d'erreur

#### Erreurs JSON Invalides ou IDs Dupliqués
- Ces erreurs sont souvent liées à des problèmes de connexion entre le frontend et le backend
- Vérifiez que le frontend utilise les bonnes URLs pour appeler les Edge Functions
- Validez que votre configuration Supabase est correcte et accessible

## Mise à Jour du Déploiement

Pour mettre à jour votre déploiement :
1. Committez et poussez vos changements vers votre dépôt Git
2. Dans Coolify, accédez à votre instance
3. Cliquez sur "Redeploy" pour déployer les derniers changements

## Surveillance et Maintenance

- Consultez régulièrement les logs des containers via l'interface Coolify
- Surveillez l'utilisation des ressources (CPU, mémoire) pour optimiser si nécessaire
- Envisagez de mettre en place un système de monitoring comme Prometheus/Grafana pour une surveillance plus avancée
