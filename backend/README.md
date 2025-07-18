# Backend - Azur Auto Reserve

Cette partie du projet contient les fonctions Edge de Supabase et les services backend pour l'application Azur Auto Reserve.

## Structure des dossiers

```
backend/
├── supabase/           # Configuration et fonctions Supabase
│   ├── functions/      # Fonctions Edge serverless
│   └── ...             # Autres fichiers de configuration Supabase
├── package.json        # Dépendances du backend
├── Dockerfile          # Configuration Docker pour le backend
└── ...
```

## Variables d'environnement

Les variables d'environnement du backend sont définies dans le fichier `.env` à la racine du dossier backend. Contrairement au frontend, ces variables ne nécessitent pas de préfixe particulier.

Exemple :
```
JWT_SECRET=your_jwt_secret_here
SUPABASE_URL=https://your-project-url.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_DB_URL=postgres://postgres:postgres@db:5432/postgres
```

## Développement

Pour travailler sur les fonctions Edge :

```bash
npm install                # Installer les dépendances
supabase functions serve   # Démarrer le serveur de développement des fonctions Edge
```

## Déploiement

Pour déployer le backend :

```bash
# Utiliser Docker
docker-compose up -d
```

Ou pour déployer uniquement les fonctions Edge sur Supabase :

```bash
supabase functions deploy nom-de-la-fonction
```
