/** * POST /api/submit */

export interface Env {
    OPEN_API_KEY: string;
}

export async function onRequestPost(request: Request, env: Env, ctx: ExecutionContext) {
    // Parse the request body
    const data = await request.json();
    console.log(data)
  
    // Input validation
    // if (!text) {
    //   console.log("Missing required fields");
    //   return new Response("Missing required fields", { status: 400 });
    // }
  
    // OpenAI API key and config
    const apiKey = env.OPEN_API_KEY;
    if (!apiKey) {
      return new Response("Missing OPEN_API_KEY environment variable", {
        status: 500,
      });
    }

    return new Response("Hello World", { status: 200 });
}