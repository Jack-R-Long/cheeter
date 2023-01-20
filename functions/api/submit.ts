/** * POST /api/submit */
export async function onRequestPost(context) {
  // Parse the request body
  const data = await context.request.json();
  const text = data.text;

  // Input validation
  if (!text) {
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

  // Set up the request body
  const body = {
    model,
    prompt: text,
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

export default onRequestPost;
