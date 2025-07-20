// Simple function to test Edge Functions infrastructure
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Simple handler that returns environment variable status
async function handleRequest(req: Request) {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Check if environment variables exist (without revealing values)
    const envVars = {
      VINDECODER_API_KEY: !!Deno.env.get("VINDECODER_API_KEY"),
      VINDECODER_SECRET_KEY: !!Deno.env.get("VINDECODER_SECRET_KEY"),
      SUPABASE_URL: !!Deno.env.get("SUPABASE_URL"),
      SUPABASE_SERVICE_ROLE_KEY: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    };

    return new Response(
      JSON.stringify({
        status: "ok",
        message: "Edge Function is working!",
        timestamp: new Date().toISOString(),
        environment: envVars,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error in ping handler: ${error.message}`);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
        success: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

// Export handler for import by main.ts
const handler = handleRequest;
export { handler };

// Call serve() only when this file is executed directly
if (import.meta.main) {
  serve(handleRequest);
}
