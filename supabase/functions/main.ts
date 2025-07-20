// main.ts - Point d'entrée principal pour les Edge Functions
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { corsHeaders } from "./_shared/cors.ts";

// Ce fichier sert de point d'entrée central et redirige les requêtes
// vers les fonctions spécifiques en fonction du chemin

const handler = async (req: Request) => {
  console.log(`Edge Function received request: ${req.url}, method: ${req.method}`);
  
  // Gérer les requêtes CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  // Extraire le chemin de la demande
  const url = new URL(req.url);
  const fullPath = url.pathname;
  console.log(`Request path: ${fullPath}`);
  
  // Déterminer quelle fonction appeler en fonction du chemin
  const isPing = fullPath.includes('ping');
  const isVinDecoder = fullPath.includes('vindecoder');
  
  try {
    // Test endpoint simple pour vérifier l'infrastructure
    if (isPing) {
      console.log("Routing to ping function");
      try {
        const pingModule = await import("./ping/index.ts");
        if (pingModule.handler && typeof pingModule.handler === 'function') {
          console.log("Using pingModule.handler");
          return await pingModule.handler(req);
        } else {
          console.log("Ping handler not found");
          return new Response(JSON.stringify({ 
            error: "Ping handler not found",
            availableExports: Object.keys(pingModule)
          }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      } catch (importError) {
        console.error(`Failed to import ping module: ${importError.message}`);
        return new Response(JSON.stringify({ 
          error: `Failed to import ping module: ${importError.message}`
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    // Décodage VIN
    else if (isVinDecoder) {
      console.log("Routing to vindecoder function");
      try {
        // Vérification des variables d'environnement
        const envVars = {
          VINDECODER_API_KEY: !!Deno.env.get('VINDECODER_API_KEY'),
          VINDECODER_SECRET_KEY: !!Deno.env.get('VINDECODER_SECRET_KEY'),
          SUPABASE_URL: !!Deno.env.get('SUPABASE_URL'),
          SUPABASE_SERVICE_ROLE_KEY: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        };
        console.log(`Environment variables status: ${JSON.stringify(envVars)}`);
        
        // Importer directement le module vindecoder
        const decoderModule = await import("./vindecoder/index.ts");
        console.log(`Module vindecoder loaded, exports: ${Object.keys(decoderModule).join(', ')}`);
        
        if (decoderModule.handler && typeof decoderModule.handler === 'function') {
          console.log("Using decoderModule.handler");
          return await decoderModule.handler(req);
        } else {
          console.log("VIN decoder handler not found or not properly exported");
          return new Response(JSON.stringify({ 
            error: "VIN decoder handler not found or not properly exported",
            availableExports: Object.keys(decoderModule)
          }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      } catch (importError) {
        console.error(`Failed to import vindecoder module: ${importError.message}`);
        return new Response(JSON.stringify({ 
          error: `Failed to import vindecoder module: ${importError.message}`
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    
    // Fonction non trouvée
    console.log(`Function not found for path: ${fullPath}`);
    return new Response(JSON.stringify({ 
      error: `Function not found: ${fullPath}`,
      availableFunctions: ['vindecoder']
    }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(`Error handling request: ${error.message}`);
    console.error(error.stack);
    return new Response(JSON.stringify({ 
      error: "Internal Server Error",
      message: error.message,
      path: fullPath
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
};

serve(handler);
