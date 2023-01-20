/** * POST /api/getTweets */

export interface Env {
  TWITTER_BEARER_TOKEN: string;
}

interface TwitterResponse {
  data: {
    id: string;
    name: string;
    username: string;
  };
  errors: {
    parameters: any;
    message: string;
  }[];
}

export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) {
  // Parse the request body
  let handle: string;
  try {
    const data = await request.json();
    // @ts-ignore
    handle = data.handle;
  } catch (err) {
    return new Response(`Error parsing request body ${err}`, { status: 500 });
  }

  // Input validation
  if (!handle) {
    console.log("Missing required fields");
    return new Response("Missing required fields", { status: 400 });
  }

  // Twitter bearer token
  const bearerToken = env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) {
    return new Response("Missing TWITTER_BEARER_TOKEN environment variable", {
      status: 500,
    });
  }

  const userIdEndpoint = `https://api.twitter.com/2/users/by/username/${handle}`;

  // Set up the request options
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
  };

  // Send the request to Twitter
  const twitterUser = { id: "", name: "", username: "" };
  try {
    const response = await fetch(userIdEndpoint, options);
    const data = (await response.json()) as TwitterResponse;
    console.log(data);

    if (data.errors) {
      return new Response(`Twitter handle not found`, { status: 404 });
    }

    twitterUser.id = data.data.id;
  } catch (err) {
    return new Response(`Error calling Twitter API /username ${err}`, {
      status: 500,
    });
  }

  // Get the user's tweets
  const tweetsEndpoint = `https://api.twitter.com/2/users/${twitterUser.id}/tweets`;

  try {
    const response = await fetch(tweetsEndpoint, options)
    const data = await response.json();
    // @ts-ignore
    return new Response(JSON.stringify(data.data), { status: 200 });
  } catch (err) {
    return new Response(`Error calling Twitter API /tweets ${err}`, { status: 500 });
  }
}
