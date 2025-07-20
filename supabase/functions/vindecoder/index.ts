// Supabase Edge Function pour vindecoder.eu
// Sécurise les clés API et secret côté serveur

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createHash } from 'https://deno.land/std@0.119.0/hash/mod.ts';

// Variables d'environnement 
// IMPORTANT: Différer l'accès aux variables d'environnement pour éviter les erreurs au chargement
function getEnvVars() {
  return {
    apiKey: Deno.env.get('VINDECODER_API_KEY') || '',
    secretKey: Deno.env.get('VINDECODER_SECRET_KEY') || '',
    apiPrefix: 'https://api.vindecoder.eu/3.2',
    supabaseUrl: Deno.env.get('SUPABASE_URL') || '',
    supabaseKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  };
}

// Calcul du SHA1 pour l'API VIN Decoder
function calculateControlSum(vin: string, id: string, apiKey: string, secretKey: string): string {
  const data = `${vin}|${id}|${apiKey}|${secretKey}`;
  console.log(`Calculating hash for: ${vin}|${id}|[API_KEY]|[SECRET]`);
  const hash = createHash('sha1').update(data).digest('hex');
  return hash.substring(0, 10);
}

// La fonction principale qui traite les requêtes
async function handleRequest(req: Request) {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Récupérer les variables d'environnement
    const env = getEnvVars();
    console.log(`VINDECODER_API_KEY available: ${!!env.apiKey}`);
    console.log(`VINDECODER_SECRET_KEY available: ${!!env.secretKey}`);
    
    // Vérifier si les clés API sont configurées
    if (!env.apiKey || !env.secretKey) {
      return new Response(
        JSON.stringify({ 
          error: 'API keys not configured. Please set VINDECODER_API_KEY and VINDECODER_SECRET_KEY in environment variables.'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Récupérer le VIN depuis le corps de la requête
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error('Error parsing request JSON:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const { vin } = requestData;
    console.log(`Received VIN request for: ${vin}`);
    
    // Validation du VIN
    if (!vin || typeof vin !== 'string' || vin.length < 10 || vin.length > 17) {
      return new Response(
        JSON.stringify({ error: 'Invalid VIN number provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Paramètres pour l'appel API
    const normalizedVin = vin.toUpperCase();
    const id = 'info';  // info = VIN Decode Info (liste des données disponibles)
    const controlSum = calculateControlSum(normalizedVin, id, env.apiKey, env.secretKey);
    
    // Construction de l'URL de l'API
    const apiUrl = `${env.apiPrefix}/${env.apiKey}/${controlSum}/decode/info/${normalizedVin}.json`;
    
    console.log(`Calling VIN Decoder API for info: ${normalizedVin}`);
    
    // Appel à l'API vindecoder.eu
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`VIN Decoder API error: ${response.status} ${errorText}`);
    }
    
    // Récupérer les informations basiques (liste des champs disponibles)
    const infoData = await response.json();
    
    // Si la réponse info est OK, faire l'appel API "decode" pour obtenir les données détaillées
    if (infoData && infoData.decode) {
      const decodeId = 'decode';
      const decodeControlSum = calculateControlSum(normalizedVin, decodeId, env.apiKey, env.secretKey);
      const decodeUrl = `${env.apiPrefix}/${env.apiKey}/${decodeControlSum}/decode/${normalizedVin}.json`;
      
      console.log(`Calling VIN Decoder API for decode: ${normalizedVin}`);
      const decodeResponse = await fetch(decodeUrl);
      
      if (!decodeResponse.ok) {
        const errorText = await decodeResponse.text();
        throw new Error(`VIN Decode API error: ${decodeResponse.status} ${errorText}`);
      }
      
      const vehicleData = await decodeResponse.json();
      
      // Retourner les données du véhicule avec les champs mappés pour notre application
      return new Response(
        JSON.stringify({
          success: true,
          data: vehicleData,
          vehicle_info: {
            make: vehicleData.decode?.['Make'] || '',
            model: vehicleData.decode?.['Model'] || '',
            year: vehicleData.decode?.['Model Year'] || '',
            fuel_type: vehicleData.decode?.['Fuel Type - Primary'] || '',
            engine: `${vehicleData.decode?.['Engine Power (kW)']} kW ${vehicleData.decode?.['Engine (full)']}` || '',
            vin: normalizedVin
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
    
    // Si on ne peut pas obtenir les données détaillées, retourner uniquement les infos de base
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: infoData,
        message: 'Only basic VIN info available'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    // Gérer les erreurs
    console.error(`Error in vindecoder handler: ${error.message}`);
    console.error(error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}

// Exporter la fonction serve pour compatibilité avec les Edge Functions Deno
const handler = handleRequest;
export { handler };

// Appeler serve() uniquement quand ce fichier est exécuté directement, pas quand il est importé
if (import.meta.main) {
  serve(handleRequest);
}
