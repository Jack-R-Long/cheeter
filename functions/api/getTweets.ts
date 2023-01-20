/** * POST /api/submit */

export interface Env {
    OPEN_API_KEY: string;
}

export async function onRequestPost({request, env}: {request: Request, env: Env}) {
    // Parse the request body
    console.log("request", request);

    console.log("env", env);

    let handle: string;
    try {
        const data = await request.json();
        // @ts-ignore
        handle = data.handle;
    } catch (err) {
        return new Response(`Error parsing request body ${err}`, { status: 500 });
    }
  
    // Input validation
    // if (!text) {
    //   console.log("Missing required fields");
    //   return new Response("Missing required fields", { status: 400 });
    // }
  
    // OpenAI API key and config
    // const apiKey = env.OPEN_API_KEY;
    // if (!apiKey) {
    //   return new Response("Missing OPEN_API_KEY environment variable", {
    //     status: 500,
    //   });
    // }

    return new Response(`Hello ${handle}`, { status: 200 });
}