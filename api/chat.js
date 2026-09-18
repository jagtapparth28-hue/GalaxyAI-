export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    } 

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.error?.message || "OpenAI API error" },
        { status: response.status }
      );
    }

const reply =
  data.output
    ?.flatMap(item => item.content || [])
    ?.filter(part => part.type === "output_text")
    ?.map(part => part.text)
    ?.join("") || "";

    return Response.json({
      reply: reply || "No response received."
    });

  } catch (error) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
