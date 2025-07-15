// mod.ts
// Version ultra-minimale sans import

Deno.serve(async (req) => {
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
