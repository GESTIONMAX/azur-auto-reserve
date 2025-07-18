// mod.ts
// Version ultra-minimale sans import

// Déclaration de type pour éviter l'erreur TypeScript dans l'IDE
// (Cette déclaration est ignorée par Deno runtime)
declare namespace Deno {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

Deno.serve(async (req: Request) => {
  return new Response(
    JSON.stringify({
      message: "Hello from minimal Edge Function",
      date: new Date().toISOString()
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }
  );
});
