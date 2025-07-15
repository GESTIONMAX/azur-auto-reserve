// Version absolument minimaliste
export default async function handler(req) {
  return new Response(JSON.stringify({ message: "Hello World" }));
}
