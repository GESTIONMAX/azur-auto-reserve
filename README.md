# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/53b76233-5b99-4702-866f-14528ed8cf81

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/53b76233-5b99-4702-866f-14528ed8cf81) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- React Router v6
- Supabase (self-hosted)
- shadcn-ui
- Tailwind CSS
- Docker
- react-helmet-async (pour le SEO)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/53b76233-5b99-4702-866f-14528ed8cf81) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Fonctionnalités principales

### Programmatic SEO avec Supabase

Ce projet implémente une approche de SEO programmatique pour générer automatiquement des landing pages par ville pour le service de diagnostic automobile à domicile.

- **Table `villes`** : stocke les données spécifiques à chaque ville (méta-titres, descriptions, contenus, prix, etc.)
- **Pages dynamiques** : générées avec React Router v6 en utilisant le composant `VilleDetail.tsx`
- **Meta tags SEO** : implémentés avec `react-helmet-async` pour une indexation optimale par les moteurs de recherche
- **Analytics intégrés** : compteur de visites par ville dans la base de données

### Base de données Supabase auto-hébergée

Le projet est connecté à une instance Supabase auto-hébergée configurée avec :

- **SMTP Brevo** : pour l'envoi d'e-mails de confirmation et de notifications
- **RLS (Row Level Security)** : pour sécuriser l'accès aux données
- **Migrations SQL** : pour le versionnement de la base de données
- **TypeScript types** : générés depuis le schéma Supabase

Pour lancer l'instance Supabase localement :

```bash
cd supabase
docker-compose up -d
```

L'interface d'administration sera disponible sur http://localhost:3000

### Dockerisation de l'application React

L'application peut être déployée via Docker pour un environnement de production :

```bash
# Construction de l'image
docker build -t azur-auto-reserve .

# Démarrage du conteneur avec les variables d'environnement
docker run -p 8080:80 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://votre-url-supabase \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon \
  -e VITE_PUBLIC_SITE_URL=https://votre-site.com \
  azur-auto-reserve
```

L'application sera accessible sur http://localhost:8080
