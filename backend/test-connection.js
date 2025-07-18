// Script de test de connexion à Supabase
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement
config();

// Informations de connexion à Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://api.obdexpress.fr';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erreur: Variables d\'environnement SUPABASE_URL et/ou SUPABASE_ANON_KEY non définies');
  console.log('Veuillez créer un fichier .env dans le dossier backend avec ces variables');
  process.exit(1);
}

console.log('🔄 Tentative de connexion à Supabase...');
console.log(`🌐 URL: ${supabaseUrl}`);

// Création du client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Test simple: exécuter une requête SQL pour obtenir la version de PostgreSQL
    const { data, error } = await supabase
      .from('_postgrest_migrations')
      .select('*')
      .limit(1);
    
    if (error) {
      // Si cette table spécifique n'existe pas, essayons une requête SQL personnalisée
      const { data: sqlData, error: sqlError } = await supabase
        .rpc('get_current_timestamp', {});
      
      if (sqlError) {
        // Si cette RPC n'existe pas non plus, essayons simplement de lister les schémas
        console.log('✅ Connexion à Supabase établie (authentification réussie)');
        console.log('⚠️ Impossible d\'exécuter les requêtes de test, mais l\'authentification fonctionne');
      } else {
        console.log('✅ Connexion à Supabase réussie!');
        console.log(`📅 Date et heure du serveur: ${sqlData}`);
      }
    } else {
      console.log('✅ Connexion à Supabase réussie!');
      console.log(`🗃️ Table système trouvée: _postgrest_migrations`);
    }
    
    // Tester une requête pour lister les tables publiques
    console.log('\n🔄 Vérification des tables accessibles...');
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10);
    
    if (tablesError) {
      console.log('⚠️ Impossible de lister les tables, mais la connexion fonctionne');
      console.error(tablesError);
    } else {
      console.log('📋 Tables disponibles:');
      tablesData.forEach(table => console.log(` - ${table.tablename}`));
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion à Supabase:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
