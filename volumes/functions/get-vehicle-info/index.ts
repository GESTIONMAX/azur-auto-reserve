// Suivant exactement la documentation Supabase Edge Functions
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

serve(async (req) => {
  const data = {
    message: "Hello from Supabase Edge Functions!"
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})
