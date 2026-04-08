export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, topic, history } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
  {
    role: "system",
    content: "You are a confident, sharp, slightly witty dating coach. Keep responses concise and actionable."
  },
  ...history.map(m => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.text
  })),
  {
    role: "user",
    content: `${topic}\n\n${message}`
  }
],
        max_tokens: 200
      }),
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "Something went wrong.";

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
