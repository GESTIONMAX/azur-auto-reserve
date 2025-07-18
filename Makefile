# Makefile pour orchestrer les services Docker

# Démarrage complet (frontend + backend + supabase)
up:
	docker-compose -f docker-compose.unified.yml up --build

# Démarrage en mode détaché
up-d:
	docker-compose -f docker-compose.unified.yml up -d --build

# Arrêter tous les conteneurs
down:
	docker-compose -f docker-compose.unified.yml down

# Voir les logs de tous les services
logs:
	docker-compose -f docker-compose.unified.yml logs -f --tail=100

# Démarrer uniquement le frontend
frontend:
	cd frontend && docker-compose up --build

# Démarrer uniquement le frontend en mode détaché
frontend-d:
	cd frontend && docker-compose up -d --build

# Démarrer uniquement le backend
backend:
	cd backend && docker-compose up --build

# Démarrer uniquement le backend en mode détaché
backend-d:
	cd backend && docker-compose up -d --build

# Afficher uniquement les logs du frontend
frontend-logs:
	docker-compose -f docker-compose.unified.yml logs -f --tail=100 frontend

# Afficher uniquement les logs du backend
backend-logs:
	docker-compose -f docker-compose.unified.yml logs -f --tail=100 backend

# Afficher uniquement les logs de supabase
supabase-logs:
	docker-compose -f docker-compose.unified.yml logs -f --tail=100 supabase

# Nettoyer les conteneurs et volumes (attention: supprime les données)
clean:
	docker-compose -f docker-compose.unified.yml down -v
