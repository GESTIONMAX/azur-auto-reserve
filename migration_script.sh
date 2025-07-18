#!/bin/bash
# Script de migration des données Supabase

# Dossier pour stocker les fichiers de sauvegarde
BACKUP_DIR="./migration_data"
mkdir -p $BACKUP_DIR

echo "Migration des données Supabase vers la nouvelle instance..."

# Ancienne base (remplacer par les bonnes valeurs)
OLD_DB_HOST="localhost"  # ou l'adresse de l'ancienne DB
OLD_DB_PORT="5432"       # port postgres standard
OLD_DB_USER="postgres"   # utilisateur par défaut
OLD_DB_NAME="postgres"   # nom de la base par défaut
# OLD_DB_PASSWORD doit être fourni lors de l'exécution ou configuré dans ~/.pgpass

# Nouvelle base (remplacer par les bonnes valeurs)
NEW_DB_HOST="localhost"  # ou l'adresse de la nouvelle DB
NEW_DB_PORT="5432"       # port postgres standard
NEW_DB_USER="postgres"   # utilisateur par défaut
NEW_DB_NAME="postgres"   # nom de la base par défaut
# NEW_DB_PASSWORD doit être fourni lors de l'exécution ou configuré dans ~/.pgpass

# Liste des tables à migrer (ajoutez toutes vos tables)
TABLES=(
  "disponibilites"
  "villes"
  "vehicle_info"
  "demandes_sav"
  # Ajoutez d'autres tables selon besoin
)

echo "Phase 1: Exportation des données de l'ancienne base"
for TABLE in "${TABLES[@]}"; do
  echo "Exportation de la table: $TABLE"
  PGPASSWORD="$OLD_DB_PASSWORD" pg_dump -h $OLD_DB_HOST -p $OLD_DB_PORT -U $OLD_DB_USER -d $OLD_DB_NAME -t public.$TABLE -F c -f "$BACKUP_DIR/$TABLE.dump" || echo "Échec d'exportation pour $TABLE"
done

echo "Phase 2: Importation des données dans la nouvelle base"
for TABLE in "${TABLES[@]}"; do
  echo "Importation de la table: $TABLE"
  PGPASSWORD="$NEW_DB_PASSWORD" pg_restore -h $NEW_DB_HOST -p $NEW_DB_PORT -U $NEW_DB_USER -d $NEW_DB_NAME -t public.$TABLE --clean --if-exists "$BACKUP_DIR/$TABLE.dump" || echo "Échec d'importation pour $TABLE"
done

echo "Migration terminée!"
