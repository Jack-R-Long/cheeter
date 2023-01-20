interface Tweet {
  id: string;
  text: string;
  edit_history_tweet_ids: string[];
}

export async function onRequestPost(context) {
  // Parse the request body
  const data = await context.request.json();
  const text = data.text as string;
  const tweets = data.tweets as Tweet[];

  // Input validation
  if (!text || !tweets) {
    console.log("Missing required fields");
    return new Response("Missing required fields", { status: 400 });
  }

  // OpenAI API key and config
  const apiKey = context.env.OPEN_API_KEY;
  if (!apiKey) {
    return new Response("Missing OPEN_API_KEY environment variable", {
      status: 500,
    });
  }
  const model = "text-davinci-003";
  const endpoint = "https://api.openai.com/v1/completions";

  console.log(generatePrompt(text, tweets));

  // Set up the request body
  const body = {
    model,
    prompt: generatePrompt(text, tweets),
    temperature: 0.7,
    max_tokens: 256,
  };

  // Set up the request options
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  };

  // Send the request to the OpenAI API
  try {
    const response = await fetch(endpoint, options);
    const data = await response.json();
    // @ts-ignore
    return new Response(data.choices[0].text, { status: 200 });
  } catch (err) {
    return new Response(`Error calling OpenAI API ${err}`, { status: 500 });
  }
}

function generatePrompt(text: string, tweets: Tweet[]) {
  let tweetBlob = "";
  for (let i = 0; i < tweets.length; i++) {
    tweetBlob += tweets[i].text;
  }
  return `Here are my last ten tweets\n\n${tweetBlob}\n\nWrite a new tweet about ${text}`;
}

export default onRequestPost;
