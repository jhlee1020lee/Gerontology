# Homepage Chatbot Setup

The homepage chatbot UI is static and lives inside the generated site. The OpenAI API key must not be exposed in the browser, so the site is designed to call an external serverless or backend proxy.

The homepage now sends only relevant snippets from published site materials plus reading-card metadata. The proxy should preserve that constraint and refuse answers that are not supported by those materials.

## Repo-side files

- `scripts/site_chatbot_config.js`: public runtime config copied to `docs/assets/chatbot-config.js`
- `scripts/site_app.js`: homepage chatbot client logic
- `scripts/site_styles.css`: chatbot styles
- `scripts/build_site.js`: injects the widget into the homepage and copies the config asset

## How to turn it on

1. Deploy a small API proxy somewhere outside this repo.
2. Put that public HTTPS URL into `scripts/site_chatbot_config.js` as `endpoint`.
3. Rebuild the site with `node scripts/build_site.js`.
4. Open `docs/index.html` and test the floating chatbot in the lower-right corner.

## Why a proxy is required

This repo is a static site only. If you call OpenAI directly from browser JavaScript, your secret API key is exposed to anyone who opens the page or DevTools. OpenAI's API key safety guidance explicitly says not to deploy secret keys in client-side code:

- API key safety: <https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety>
- Responses API migration guide: <https://platform.openai.com/docs/guides/responses-vs-chat-completions>
- Models page: <https://developers.openai.com/api/docs/models/compare>

## Example proxy

The sample below is for a separate Node-based serverless function. It uses the Responses API and keeps `OPENAI_API_KEY` on the server side.

As of March 31, 2026, `gpt-5.4-mini` is a good low-latency choice for this kind of homepage assistant. If your account does not have access to it, swap in another currently available model from the models page above.

```js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body ?? {};
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const readings = Array.isArray(body.readings) ? body.readings : [];
  const page = body.page ?? {};
  const site = body.site ?? {};

  const catalogText = readings
    .slice(0, 50)
    .map((reading) => {
      const parts = [
        reading.date || "날짜 미정",
        reading.title || "제목 없음",
        reading.state === "ready" ? "열람 가능" : "준비 중",
        reading.type || "reading",
      ];
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");

  const conversationText = messages
    .slice(-12)
    .map((message) => `${message.role === "user" ? "user" : "assistant"}: ${message.content}`)
    .join("\n\n");

  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    reasoning: { effort: "low" },
    max_output_tokens: 700,
    instructions: [
      "You are a Korean study assistant for a gerontology course homepage.",
      "Answer in Korean unless the user explicitly asks for another language.",
      "Use the provided reading-card catalog as your source of truth.",
      "If a reading is marked locked or not ready, say that it is not yet available.",
      "Do not invent details from reading pages that were not provided.",
      "Be concise and helpful."
    ].join("\n"),
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Site title: ${site.title || "성인발달과노화 읽기 사이트"}`
          },
          {
            type: "input_text",
            text: `Current page: ${page.title || "homepage"}`
          },
          {
            type: "input_text",
            text: `Reading cards:\n${catalogText}`
          },
          {
            type: "input_text",
            text: `Conversation:\n${conversationText}`
          }
        ]
      }
    ]
  });

  res.status(200).json({ reply: response.output_text });
}
```

## Notes

- If the proxy is on another domain, configure CORS there.
- If you open the site as `file:///.../docs/index.html`, use an absolute `https://...` endpoint. A relative path like `/api/chat` only works when the site is served over HTTP(S).
- The homepage widget sends reading-card metadata, not the full reading body.
- If you later want page-aware answers inside reading pages too, the same widget pattern can be extended beyond the homepage.
