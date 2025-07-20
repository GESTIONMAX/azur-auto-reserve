// main.ts - Point d'entrée principal pour les Edge Functions
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { corsHeaders } from "./_shared/cors.ts";

// Ce fichier sert de point d'entrée central et redirige les requêtes
// vers les fonctions spécifiques en fonction du chemin

serve(async (req) => {
  // Gérer les requêtes CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  // Extraire le chemin de la demande
  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();
  
  // Rediriger vers les fonctions spécifiques
  try {
    if (path === "vindecoder") {
      // Importer dynamiquement le handler vindecoder
      const { handler } = await import("./vindecoder/index.ts");
      return await handler(req);
    }
    
    // Fonction non trouvée
    return new Response(JSON.stringify({ 
      error: `Function not found: ${path}` 
    }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(`Error handling request: ${error.message}`);
    return new Response(JSON.stringify({ 
      error: "Internal Server Error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
