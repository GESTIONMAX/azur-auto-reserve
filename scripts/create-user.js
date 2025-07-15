#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement depuis le fichier .env
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = envContent.split('\n').reduce((acc, line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    acc[key] = value;
  }
  return acc;
}, {});

// Créer une interface de lecture pour les entrées utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction pour poser une question et obtenir une réponse
const question = (query) => new Promise((resolve) => {
  rl.question(query, resolve);
});

// Fonction principale asynchrone
async function main() {
  try {
    console.log('=== Création d\'un nouvel utilisateur Supabase ===');
    
    // Vérifier les variables d'environnement
    if (!envVars.VITE_SUPABASE_URL || !envVars.SUPABASE_SERVICE_KEY) {
      console.error('Erreur: Variables d\'environnement VITE_SUPABASE_URL ou SUPABASE_SERVICE_KEY manquantes.');
      process.exit(1);
    }
    
    // Créer le client Supabase avec la clé de service pour les opérations administratives
    const supabase = createClient(
      envVars.VITE_SUPABASE_URL,
      envVars.SUPABASE_SERVICE_KEY
    );
    
    // Demander les informations de l'utilisateur
    const email = await question('Email de l\'utilisateur: ');
    const password = await question('Mot de passe (minimum 8 caractères): ');
    const isAdmin = (await question('Créer comme administrateur? (o/N): ')).toLowerCase() === 'o';
    
    console.log(`\nCréation de l'utilisateur ${email}...`);
    
    // Créer l'utilisateur
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmer l'email
      user_metadata: {
        is_admin: isAdmin
      }
    });
    
    if (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error.message);
      process.exit(1);
    }
    
    console.log('\nUtilisateur créé avec succès:');
    console.log('---------------------------');
    console.log(`ID: ${data.user.id}`);
    console.log(`Email: ${data.user.email}`);
    console.log(`Admin: ${isAdmin ? 'Oui' : 'Non'}`);
    console.log('---------------------------');
    
    // Si l'utilisateur est admin, lui donner des droits supplémentaires dans la base de données
    if (isAdmin) {
      console.log('\nConfiguration des droits administrateur...');
      // Ici vous pourriez exécuter une requête SQL pour ajouter l'utilisateur à une table "admins" par exemple
    }
    
    console.log('\nL\'utilisateur peut maintenant se connecter à l\'application.');
    
  } catch (err) {
    console.error('Une erreur est survenue:', err);
  } finally {
    rl.close();
  }
}

main();
