# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/53b76233-5b99-4702-866f-14528ed8cf81

## Structure du projet

Le projet est divisé en deux parties principales :

- **`/frontend`** : Contient l'interface utilisateur React/Vite
- **`/backend`** : Contient les fonctions Edge de Supabase et services backend

Chaque dossier possède son propre README.md avec des instructions spécifiques.

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

# Step 3: Installation des dépendances et lancement du frontend
cd frontend
npm i
npm run dev

# Step 4: Dans un autre terminal, installation des dépendances et lancement du backend (si nécessaire)
cd ../backend
npm i
supabase functions serve
```

### Utilisation avec Docker

Pour démarrer l'ensemble du projet (frontend et backend) avec Docker :

```sh
docker-compose -f docker-compose.unified.yml up -d
```

Ou pour démarrer uniquement le frontend ou le backend :

```sh
# Uniquement frontend
cd frontend
docker-compose up -d

# Uniquement backend
cd backend
docker-compose up -d
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

### Intégration du décodeur VIN avec vindecoder.eu

L'application intègre un service de recherche de véhicules par numéro VIN utilisant l'API vindecoder.eu. Cette fonctionnalité permet d'identifier automatiquement la marque, le modèle et l'année d'un véhicule à partir de son VIN.

#### Architecture et sécurité

L'intégration suit une architecture sécurisée en deux parties :

1. **Backend (Edge Function Supabase)** : Gère l'authentification et les appels API sécurisés
2. **Frontend (VehicleSelector)** : Interface utilisateur pour saisir le VIN et afficher les résultats

Cette séparation garantit que les clés API sensibles restent sur le serveur.

#### Edge Function Supabase

L'Edge Function `vindecoder` (`/supabase/functions/vindecoder/index.ts`) gère :

- **L'authentification sécurisée** : Clés API stockées dans les variables d'environnement Supabase
- **Le calcul SHA1** : Génération du contrôle de somme selon les spécifications de vindecoder.eu
- **Les appels API** : Requêtes vers l'API vindecoder.eu pour obtenir les informations du véhicule
- **La normalisation des données** : Formatage des réponses pour le frontend

##### Calcul SHA1 pour l'authentification

```typescript
function calculateControlSum(vin: string, id: string): string {
  const data = `${vin}|${id}|${apiKey}|${secretKey}`;
  const hash = createHash('sha1').update(data).toString();
  return hash.substring(0, 10);
}
```

Ce calcul suit la documentation de vindecoder.eu :
1. Concaténation de VIN + ID + API_KEY + SECRET_KEY avec des pipes (`|`)
2. Calcul du hash SHA1
3. Extraction des 10 premiers caractères du hash

#### Composant frontend VehicleSelector

Le composant VehicleSelector (`/frontend/src/components/VehicleSelector.tsx`) intègre :

- Un champ de saisie pour le VIN avec validation
- Un bouton de recherche qui appelle l'Edge Function
- Des indicateurs visuels pendant le chargement
- L'affichage des erreurs éventuelles
- Le remplissage automatique des sélecteurs (marque, modèle, année) avec les données trouvées

#### Déploiement et configuration

##### Pour l'auto-hébergement avec Coolify

1. **Ajouter les variables d'environnement** dans votre configuration Coolify pour le service Edge Functions :
   ```
   VINDECODER_API_KEY=votre_clé_api
   VINDECODER_SECRET_KEY=votre_clé_secrète
   ```

2. **Mettre à jour le fichier `docker-compose.edge-functions.yml`** pour inclure ces variables :
   ```yaml
   environment:
     # Variables existantes...
     # Variables pour vindecoder.eu
     VINDECODER_API_KEY: ${VINDECODER_API_KEY}
     VINDECODER_SECRET_KEY: ${VINDECODER_SECRET_KEY}
   ```

3. **Redéployer le service Edge Functions** dans Coolify :
   - Accédez à votre tableau de bord Coolify
   - Sélectionnez le service Edge Functions
   - Cliquez sur "Redeploy" pour appliquer les modifications

4. **Vérifier que le routage est correctement configuré** pour que les appels à `/functions/v1/vindecoder` soient dirigés vers le service Edge Functions

##### Pour Supabase Cloud (méthode standard)

1. **Configurer les variables d'environnement** dans Supabase :
   ```
   VINDECODER_API_KEY=votre_clé_api
   VINDECODER_SECRET_KEY=votre_clé_secrète
   ```

2. **Déployer l'Edge Function** avec la CLI Supabase :
   ```bash
   supabase functions deploy vindecoder --project-ref <VOTRE_REF_PROJET>
   ```

3. **Activer CORS** pour permettre les appels depuis votre frontend :
   ```bash
   supabase functions cors set --config '{ "origin": ["*"], "credentials": false }' --function-name vindecoder
   ```

#### Flux d'utilisation

1. L'utilisateur saisit un numéro VIN (minimum 10 caractères)
2. Le frontend appelle l'Edge Function avec le VIN
3. L'Edge Function calcule le SHA1 et fait les appels API
4. Les données du véhicule sont retournées au frontend
5. Les sélecteurs de marque/modèle/année sont automatiquement remplis
6. L'utilisateur peut compléter le reste du formulaire

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
