// Supabase Edge Function pour vindecoder.eu
// Sécurise les clés API et secret côté serveur

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createHash } from 'https://deno.land/std@0.119.0/hash/mod.ts';

// Récupérer les variables d'environnement (à configurer dans Supabase)
const apiKey = Deno.env.get('VINDECODER_API_KEY') || '';
const secretKey = Deno.env.get('VINDECODER_SECRET_KEY') || '';
const apiPrefix = 'https://api.vindecoder.eu/3.2';
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Calcul du SHA1 pour l'API VIN Decoder
function calculateControlSum(vin: string, id: string): string {
  const data = `${vin}|${id}|${apiKey}|${secretKey}`;
  const hash = createHash('sha1').update(data).toString();
  return hash.substring(0, 10);
}

serve(async (req) => {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Vérifier si les clés API sont configurées
    if (!apiKey || !secretKey) {
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
    const { vin } = await req.json();
    
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
    const controlSum = calculateControlSum(normalizedVin, id);
    
    // Construction de l'URL de l'API
    const apiUrl = `${apiPrefix}/${apiKey}/${controlSum}/decode/info/${normalizedVin}.json`;
    
    console.log(`Calling VIN Decoder API: ${apiUrl}`);
    
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
      const decodeControlSum = calculateControlSum(normalizedVin, decodeId);
      const decodeUrl = `${apiPrefix}/${apiKey}/${decodeControlSum}/decode/${normalizedVin}.json`;
      
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
})
