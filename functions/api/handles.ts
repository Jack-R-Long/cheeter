interface Env {
  TWITTER_BEARER_TOKEN: string;
}

interface TwitterResponse {
    id: number;
    id_str: string;
    name: string;
    screen_name: string;
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const { searchParams } = new URL(request.url);
  let query = searchParams.get("query");

  // Input validation
  if (!query) {
    return new Response("Missing required fields", { status: 400 });
  }

  // Twitter bearer token
  const bearerToken = env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) {
    return new Response("Missing TWITTER_BEARER_TOKEN environment variable", {
      status: 500,
    });
  }

  const endpointURL = `https://api.twitter.com/1.1/users/search.json?q=${query}&count=3`

  // Set up the request options
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
  };

    // Send the request to Twitter
    try {
        const response = await fetch(endpointURL, options);
        const data = await response.json() as TwitterResponse[];
        // TODO -- send both id and handle to avoid extra call
        const handleOnly = data.map(({ screen_name }) => ({ screen_name }));
        return new Response(JSON.stringify(handleOnly), { status: 200 });
    } catch (err) {
        console.log(err);
        return new Response(`Error fetching tweets ${err}`, { status: 500 });
    }
}
