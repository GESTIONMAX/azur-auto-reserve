// Ultra minimal Deno Edge Function
Deno.serve(async (req) => {
  return new Response(JSON.stringify({ msg: "Hello from Edge Function!" }), {
    headers: { "Content-Type": "application/json" },
  })
});
