// Chargement manuel des variables d'environnement
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Chemin relatif pour trouver le fichier .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env');

// Lecture et parsing du fichier .env
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmedLine = line.trim();
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const [key, value] = trimmedLine.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  }
});

// Export des variables
export const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
