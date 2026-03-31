const OPENAI_API_URL="https://api.openai.com/v1/responses";
const DEFAULT_MODEL=process.env.OPENAI_MODEL||"gpt-5.4-mini";
const DEFAULT_SITE_TITLE="성인발달과노화 읽기 사이트";
const MAX_MESSAGES=12;
const MAX_READINGS=50;

function setCorsHeaders(response){
  response.setHeader("Access-Control-Allow-Origin",process.env.ALLOWED_ORIGIN||"*");
  response.setHeader("Access-Control-Allow-Methods","POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers","Content-Type");
}

function normalizeMessages(messages){
  return Array.isArray(messages)
    ? messages
        .map((message)=>({
          role:message?.role==="user"?"user":"assistant",
          content:String(message?.content||"").trim()
        }))
        .filter((message)=>message.content)
        .slice(-MAX_MESSAGES)
    : [];
}

function normalizeReadings(readings){
  return Array.isArray(readings)
    ? readings
        .map((reading)=>({
          date:String(reading?.date||"날짜 미정").trim(),
          title:String(reading?.title||"제목 없음").trim(),
          state:String(reading?.state||"unknown").trim(),
          type:String(reading?.type||"reading").trim(),
          href:String(reading?.href||"").trim()
        }))
        .filter((reading)=>reading.title)
        .slice(0,MAX_READINGS)
    : [];
}

function buildCatalogText(readings){
  if(!readings.length)return "- reading cards unavailable";
  return readings
    .map((reading)=>{
      const availability=reading.state==="ready"?"열람 가능":"준비 중";
      const parts=[
        reading.date,
        reading.title,
        availability,
        reading.type
      ];
      if(reading.href)parts.push(reading.href);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");
}

function buildConversationText(messages){
  if(!messages.length)return "assistant: 아직 대화 없음";
  return messages
    .map((message)=>`${message.role}: ${message.content}`)
    .join("\n\n");
}

function extractTextFromOutputContent(content){
  if(!Array.isArray(content))return "";
  return content
    .map((item)=>{
      if(typeof item?.text==="string")return item.text;
      if(typeof item?.content==="string")return item.content;
      if(typeof item==="string")return item;
      return "";
    })
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

function extractReply(payload){
  if(typeof payload?.output_text==="string"&&payload.output_text.trim())return payload.output_text.trim();
  if(Array.isArray(payload?.output)){
    for(const item of payload.output){
      if(Array.isArray(item?.content)){
        const text=extractTextFromOutputContent(item.content);
        if(text)return text;
      }
    }
  }
  if(Array.isArray(payload?.choices)){
    for(const choice of payload.choices){
      const text=choice?.message?.content||choice?.text;
      if(typeof text==="string"&&text.trim())return text.trim();
    }
  }
  return "";
}

module.exports=async(request,response)=>{
  setCorsHeaders(response);

  if(request.method==="OPTIONS"){
    response.status(204).end();
    return;
  }

  if(request.method!=="POST"){
    response.status(405).json({error:"Method not allowed"});
    return;
  }

  if(!process.env.OPENAI_API_KEY){
    response.status(500).json({error:"OPENAI_API_KEY is not configured"});
    return;
  }

  let body=request.body;
  if(typeof body==="string"){
    try{
      body=JSON.parse(body);
    }catch(error){
      response.status(400).json({error:"Invalid JSON body"});
      return;
    }
  }
  body=body&&typeof body==="object"?body:{};

  const messages=normalizeMessages(body.messages);
  const readings=normalizeReadings(body.readings);
  const page=body.page&&typeof body.page==="object"?body.page:{};
  const site=body.site&&typeof body.site==="object"?body.site:{};
  const model=String(process.env.OPENAI_MODEL||DEFAULT_MODEL).trim();

  const promptSections=[
    `Site title: ${String(site.title||DEFAULT_SITE_TITLE).trim()}`,
    `Current page: ${String(page.title||"homepage").trim()}`,
    `Current URL: ${String(page.url||"").trim()||"unknown"}`,
    "Reading cards:",
    buildCatalogText(readings),
    "",
    "Conversation:",
    buildConversationText(messages)
  ];

  let openaiResponse;
  try{
    openaiResponse=await fetch(OPENAI_API_URL,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${process.env.OPENAI_API_KEY}`
      },
      body:JSON.stringify({
        model,
        reasoning:{effort:"low"},
        max_output_tokens:700,
        instructions:[
          "You are a Korean study assistant for a gerontology course homepage.",
          "Answer in Korean unless the user explicitly asks for another language.",
          "Use the provided reading-card catalog as your source of truth.",
          "If a reading is marked as locked, unavailable, or not ready, say that it is not yet open.",
          "Do not invent details from reading pages that were not provided in the request.",
          "Prefer short, practical answers."
        ].join("\n"),
        input:promptSections.join("\n")
      })
    });
  }catch(error){
    response.status(502).json({error:`OpenAI request failed: ${error.message}`});
    return;
  }

  let payload={};
  try{
    payload=await openaiResponse.json();
  }catch(error){
    response.status(502).json({error:"OpenAI returned a non-JSON response"});
    return;
  }

  const reply=extractReply(payload);
  if(!openaiResponse.ok){
    const apiMessage=payload?.error?.message||reply||"OpenAI returned an error";
    response.status(openaiResponse.status).json({error:apiMessage});
    return;
  }

  if(!reply){
    response.status(502).json({error:"OpenAI returned an empty reply"});
    return;
  }

  response.status(200).json({reply,model});
};
