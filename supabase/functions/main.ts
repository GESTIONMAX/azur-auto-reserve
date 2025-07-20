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
  
  // La fonction vindecoder peut être appelée directement
  // ou via le chemin /functions/v1/vindecoder
  const isVinDecoder = fullPath.includes('vindecoder');
  
  try {
    if (isVinDecoder) {
      console.log("Routing to vindecoder function");
      // Vérifier d'abord si le fichier existe
      try {
        // Test direct pour vérifier les variables d'environnement
        const apiKey = Deno.env.get('VINDECODER_API_KEY');
        const secretKey = Deno.env.get('VINDECODER_SECRET_KEY');
        console.log(`API Key available: ${!!apiKey}, Secret Key available: ${!!secretKey}`);
        
        // Importer directement le module vindecoder
        const decoderModule = await import("./vindecoder/index.ts");
        if (decoderModule.default) {
          return await decoderModule.default(req);
        } else if (typeof decoderModule === 'function') {
          return await decoderModule(req);
        } else {
          console.log("Using decoderModule.serve handler");
          return await decoderModule.serve(req);
        }
      } catch (importError) {
        console.error(`Failed to import vindecoder module: ${importError.message}`);
        return new Response(JSON.stringify({ 
          error: `Failed to import vindecoder module: ${importError.message}`,
          path: fullPath,
          env: Object.keys(Deno.env.toObject()).join(", ")
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
