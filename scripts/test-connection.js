// Script pour tester la connexion à la nouvelle instance Supabase
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env.js';

// Récupération des variables d'environnement
const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies');
  process.exit(1);
}

console.log('URL Supabase:', supabaseUrl);

// Création du client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Test de la connexion à Supabase...');

    // Test 1: Vérifier si la table reservations existe
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('*')
      .limit(1);

    if (reservationsError) {
      console.error('Erreur lors de la requête sur la table reservations:', reservationsError.message);
    } else {
      console.log('✓ Connexion à la table reservations réussie');
      console.log(`  Nombre d'enregistrements récupérés: ${reservations.length}`);
    }

    // Test 2: Vérifier si la table demandes_sav existe
    const { data: demandesSav, error: demandesSavError } = await supabase
      .from('demandes_sav')
      .select('*')
      .limit(1);

    if (demandesSavError) {
      console.error('Erreur lors de la requête sur la table demandes_sav:', demandesSavError.message);
    } else {
      console.log('✓ Connexion à la table demandes_sav réussie');
      console.log(`  Nombre d'enregistrements récupérés: ${demandesSav.length}`);
    }

    // Test 3: Vérifier si le bucket de stockage existe
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.error('Erreur lors de la récupération des buckets:', bucketsError.message);
    } else {
      console.log('✓ Connexion au service de stockage réussie');
      console.log(`  Buckets disponibles: ${buckets.map(b => b.name).join(', ')}`);
    }

    console.log('\n✅ Tests terminés');
  } catch (error) {
    console.error('Erreur inattendue:', error);
  }
}

testConnection();
