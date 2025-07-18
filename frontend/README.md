# Frontend - Azur Auto Reserve

Cette partie du projet contient l'interface utilisateur de l'application Azur Auto Reserve, développée avec React, Vite et Shadcn UI.

## Structure des dossiers

```
frontend/
├── public/             # Assets statiques
├── src/                # Code source React
│   ├── components/     # Composants réutilisables
│   ├── hooks/          # Custom hooks React
│   ├── pages/          # Pages de l'application
│   ├── utils/          # Utilitaires
│   └── ...
├── index.html          # Point d'entrée HTML
├── vite.config.ts      # Configuration Vite
├── tsconfig.json       # Configuration TypeScript
├── tailwind.config.ts  # Configuration Tailwind
└── ...
```

## Variables d'environnement

Les variables d'environnement frontend doivent être préfixées par `VITE_` pour être accessibles dans le code React. Elles sont définies dans le fichier `.env` à la racine du dossier frontend.

Exemple :
```
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Développement

Pour lancer l'application en mode développement :

```bash
npm install   # Installer les dépendances
npm run dev   # Démarrer le serveur de développement
```

## Build et déploiement

Pour construire l'application pour la production :

```bash
npm run build
```

Ou utiliser Docker :

```bash
docker-compose up -d
```
