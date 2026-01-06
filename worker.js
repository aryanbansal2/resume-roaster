export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { resume } = await request.json();

    const prompt = `
You are a brutally honest resume reviewer.
Roast the resume humorously but helpfully.
End with a hire score out of 10.

Resume:
${resume}
    `;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await res.json();

    return new Response(
      JSON.stringify({
        roast:
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Gemini refused to roast."
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
};
