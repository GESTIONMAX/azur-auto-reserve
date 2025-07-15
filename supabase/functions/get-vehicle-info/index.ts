import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// En-têtes pour autoriser les appels depuis votre site web (CORS)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

console.log("Fonction get-vehicle-info prête.");

serve(async (req) => {
  // Gérer la requête preflight CORS qui est envoyée par le navigateur
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    // Extraire la plaque d'immatriculation de la requête
    const plaque = body?.plaque;

    if (!plaque) {
      return new Response(
        JSON.stringify({
          error: "La plaque d'immatriculation est requise"
        }),
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }
    
    // Pour compatibilité avec RapidAPI qui utilise 'plaque' comme nom de paramètre
    console.log("Recherche des variables d'environnement...");
    const allEnvVars = Object.keys(Deno.env.toObject());
    console.log("Variables d'environnement disponibles:", allEnvVars);
    
    // Essayer différentes variantes de noms de variables d'environnement
    const possibleKeyNames = [
      "RAPIDAPI_KEY",
      "SUPABASE_FUNCTIONS_RAPIDAPI_KEY",
      "RAPID_API_KEY",
      "RAPID_KEY",
      "SUPABASE_RAPIDAPI_KEY",
      "X_RAPIDAPI_KEY"
    ];
    
    const possibleHostNames = [
      "RAPIDAPI_HOST",
      "SUPABASE_FUNCTIONS_RAPIDAPI_HOST",
      "RAPID_API_HOST",
      "RAPID_HOST",
      "SUPABASE_RAPIDAPI_HOST",
      "X_RAPIDAPI_HOST"
    ];
    
    // Variables pour stocker les valeurs trouvées
    let RAPIDAPI_KEY: string | undefined = undefined;
    let RAPIDAPI_HOST: string | undefined = undefined;
    
    // Chercher la clé API
    for (const keyName of possibleKeyNames) {
      const value = Deno.env.get(keyName);
      if (value) {
        console.log(`Clé API trouvée dans la variable: ${keyName}`);
        RAPIDAPI_KEY = value;
        break;
      }
    }
    
    // Chercher le host API
    for (const hostName of possibleHostNames) {
      const value = Deno.env.get(hostName);
      if (value) {
        console.log(`Host API trouvé dans la variable: ${hostName}`);
        RAPIDAPI_HOST = value;
        break;
      }
    }
    
    // Utiliser des valeurs par défaut pour les tests si rien n'est trouvé
    if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
      console.log("ATTENTION: Variables d'environnement non trouvées, utilisation de valeurs par défaut pour le débogage");
      
      // Valeurs par défaut pour le débogage uniquement - avec vos vraies valeurs
      // ⚠️ Utilisation de clés en dur uniquement pour les tests
      RAPIDAPI_KEY = "896c121791mshe86537ec96cd73fp1c1688jsn8d185c30ae28"; // Votre nouvelle clé OBDXPRESS
      RAPIDAPI_HOST = "api-de-plaque-d-immatriculation-france.p.rapidapi.com";
      
      console.log("Variables de test utilisées pour le débogage - NE PAS UTILISER EN PRODUCTION");
    }
    
    console.log("RAPIDAPI_KEY existe:", Boolean(RAPIDAPI_KEY));
    console.log("RAPIDAPI_HOST existe:", Boolean(RAPIDAPI_HOST));

    // Afficher les valeurs finales utilisées (masquer la clé pour la sécurité)
    console.log(`Utilisation du host API: ${RAPIDAPI_HOST}`);
    console.log(`Clé API disponible: ${RAPIDAPI_KEY ? 'Oui (masquée)' : 'Non'}`);
    
    // Construire l'URL de l'API RapidAPI en suivant l'exemple exact de RapidAPI
    const apiUrl = `https://api-de-plaque-d-immatriculation-france.p.rapidapi.com/?plaque=FH-634-DO`;
    // Remplacer la plaque d'immatriculation dans l'URL avec celle fournie
    const finalUrl = apiUrl.replace('FH-634-DO', plaque);
    console.log(`URL de l'API: ${finalUrl}`);

    // Créer les en-têtes pour l'API RapidAPI - utiliser les noms exacts des en-têtes
    const headers: HeadersInit = {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": "api-de-plaque-d-immatriculation-france.p.rapidapi.com"
    };
    
    // Appeler l'API tierce en utilisant fetch
    const response = await fetch(finalUrl, {
      method: "GET",
      headers: headers,
    });
    
    // Vérifier si la réponse de l'API est correcte
    if (!response.ok) {
        throw new Error(`Erreur de l'API externe: ${response.statusText}`);
    }

    const data = await response.json();

    // Retourner les données au client avec les en-têtes CORS
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    // Gérer les erreurs et les retourner au client
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
