# Stage 1: Build the application
FROM node:20-alpine as build

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm ci

# Copie des fichiers du projet
COPY . .

# Création d'un fichier .env.production avec les variables d'environnement
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_PUBLIC_SITE_URL

ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
ENV VITE_PUBLIC_SITE_URL=${VITE_PUBLIC_SITE_URL}

RUN echo "VITE_SUPABASE_URL=${VITE_SUPABASE_URL}" > .env.production
RUN echo "VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}" >> .env.production
RUN echo "VITE_PUBLIC_SITE_URL=${VITE_PUBLIC_SITE_URL}" >> .env.production

# Force Vite à utiliser le mode production
ENV NODE_ENV=production

# Build de l'application
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add runtime environment variable support with a custom entrypoint
COPY ../docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Set entrypoint to our custom script
ENTRYPOINT ["/docker-entrypoint.sh"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
