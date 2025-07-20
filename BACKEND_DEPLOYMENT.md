# Déploiement Backend (Edge Functions) sur Coolify

Ce document explique comment déployer les Edge Functions Supabase sur Coolify pour le projet azur-auto-reserve.

## Structure

Le backend est constitué de Edge Functions Supabase qui sont déployées via:
- `Dockerfile.backend` - Image Docker pour exécuter les Edge Functions
- `docker-compose.backend.yaml` - Configuration des services pour Coolify

## Variables d'environnement requises

Pour un déploiement réussi, définissez les variables d'environnement suivantes dans Coolify:

### Variables d'environnement obligatoires
| Variable | Description | Exemple |
|----------|-------------|---------|
| `JWT_SECRET` | Clé secrète pour la validation des tokens JWT | `votre_jwt_secret` |
| `SUPABASE_URL` | URL de votre instance Supabase | `https://votre-projet.supabase.co` |
| `SUPABASE_ANON_KEY` | Clé anonyme Supabase (publique) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé de service Supabase (privée) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `DOMAIN` | Domaine pour le déploiement | `votre-domaine.com` |
| `COMPOSE_PROJECT_NAME` | Nom du projet (pour les labels et containers) | `azur-auto-reserve` |

### Variables d'environnement optionnelles
| Variable | Description | Valeur par défaut |
|----------|-------------|------------------|
| `VERIFY_JWT` | Vérifier les JWT sur les requêtes | `false` |
| `DEBUG` | Activer le mode debug | `false` |

| `SUPABASE_DB_URL` | URL de connexion à la base de données Supabase (rarement nécessaire) | - |

## Procédure de déploiement sur Coolify

1. Dans Coolify, créez un nouveau service en pointant vers le dépôt Git du projet
2. Spécifiez le `Dockerfile` à utiliser: `Dockerfile.backend`
3. Spécifiez le fichier `docker-compose`: `docker-compose.backend.yaml`
4. Configurez toutes les variables d'environnement mentionnées ci-dessus
5. Déployez le service

## Vérification du déploiement

Après le déploiement, vérifiez que les Edge Functions fonctionnent correctement:

```bash
curl https://votre-domaine.com/functions/v1/hello
```

Cette requête devrait renvoyer: `"Hello from Edge Functions!"`

## Dépannage

### Problèmes courants

1. **Erreur 502 Bad Gateway**:
   - Vérifiez les logs du container avec `docker logs <container_id>`
   - Assurez-vous que les Edge Functions sont correctement démarrées

2. **Erreur d'authentification**:
   - Vérifiez que `JWT_SECRET`, `SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY` sont correctement définis
   - Assurez-vous que la variable `VERIFY_JWT` est configurée selon vos besoins

3. **Edge Functions non accessibles**:
   - Vérifiez la configuration Traefik dans `docker-compose.backend.yaml`
   - Assurez-vous que le réseau `traefik-public` existe et est correctement configuré

## Architecture

Cette configuration backend déploie uniquement les Edge Functions de Supabase, qui se connectent ensuite à votre instance Supabase existante pour l'authentification, la base de données, le stockage, etc.

C'est une approche hybride qui permet de:
1. Déployer rapidement vos fonctions backend personnalisées
2. Utiliser les services Supabase existants pour la base de données, l'authentification, etc.
3. Éviter de déployer la stack Supabase complète sur Coolify
