const storage={
  get(key,fallback){
    try{
      const raw=localStorage.getItem(key);
      return raw?JSON.parse(raw):fallback;
    }catch(error){
      return fallback;
    }
  },
  set(key,value){
    try{localStorage.setItem(key,JSON.stringify(value));}catch(error){}
  }
};

const THEME_KEY="aa-theme";
const FONT_KEY="aa-font-scale";
const CHATBOT_STORAGE_KEY="aa-home-chatbot-history";
const UI_TEXT={
  darkMode:"다크 모드",
  lightMode:"라이트 모드",
  bookmark:"북마크",
  bookmarked:"북마크됨",
  resume:"이어서 보기",
  savedResume:"마지막 읽은 위치를 이 기기에 저장했습니다.",
  savedPosition:"읽던 위치를 저장했습니다.",
  noHeadings:"표시할 제목이 아직 없습니다.",
  noImportant:"중요 표시한 제목이 여기에 모입니다.",
  noHeadingList:"제목이 아직 없습니다.",
  mark:"중요",
  prepDifficult:"표시",
  prepDifficultActive:"표시됨",
  prepNoDifficult:"표시한 답변 카드가 여기에 모입니다."
};

const DEFAULT_CHATBOT_CONFIG={
  enabled:true,
  endpoint:"",
  title:"AI 챗봇",
  welcomeMessage:"",
  disconnectedMessage:"아직 API 엔드포인트가 연결되지 않았습니다. scripts/site_chatbot_config.js 에서 endpoint를 설정한 뒤 다시 빌드하세요.",
  requestTimeoutMs:45000,
  maxMaterials:6
};

function escapeHtmlText(value){
  return String(value??"")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/\"/g,"&quot;")
    .replace(/'/g,"&#39;");
}

function renderPlainTextBlocks(text){
  return String(text||"")
    .trim()
    .split(/\n{2,}/)
    .map((block)=>`<p>${escapeHtmlText(block).replace(/\n/g,"<br />")}</p>`)
    .join("");
}

function getHomeChatbotConfig(){
  const configured=window.AA_CHATBOT_CONFIG&&typeof window.AA_CHATBOT_CONFIG==="object"
    ? window.AA_CHATBOT_CONFIG
    : {};
  return {...DEFAULT_CHATBOT_CONFIG,...configured};
}

function normalizeChatbotMessages(messages){
  if(!Array.isArray(messages))return [];
  return messages
    .map((message)=>({
      role:message?.role==="user"?"user":"assistant",
      content:String(message?.content||"").trim()
    }))
    .filter((message)=>message.content)
    .slice(-20);
}

function tokenizeChatbotSearch(text){
  const matches=String(text||"").toLowerCase().match(/[0-9a-z\uac00-\ud7a3]+/g)||[];
  return Array.from(new Set(matches.filter((token)=>token.length>1)));
}

function getChatbotCorpusChunks(){
  const payload=window.AA_CHATBOT_CORPUS;
  return Array.isArray(payload?.chunks)?payload.chunks:[];
}

function scoreChatbotChunk(chunk,queryTokens,queryText){
  const haystack=String(chunk?.searchText||"").toLowerCase();
  if(!haystack)return 0;
  let score=0;

  queryTokens.forEach((token)=>{
    if(!haystack.includes(token))return;
    score+=token.length>=4?4:2;
    if(String(chunk?.readingTitle||"").toLowerCase().includes(token))score+=4;
    if(String(chunk?.pageLabel||"").toLowerCase().includes(token))score+=2;
  });

  const readingTitle=String(chunk?.readingTitle||"").toLowerCase();
  const pageLabel=String(chunk?.pageLabel||"").toLowerCase();
  if(readingTitle&&queryText.includes(readingTitle))score+=10;
  if(pageLabel&&queryText.includes(pageLabel))score+=6;
  if(String(chunk?.slug||"").toLowerCase()&&queryText.includes(String(chunk.slug).toLowerCase()))score+=6;
  return score;
}

function selectChatbotMaterials(query,maxItems){
  const queryText=String(query||"").trim().toLowerCase();
  const queryTokens=tokenizeChatbotSearch(queryText);
  if(!queryTokens.length)return [];
  return getChatbotCorpusChunks()
    .map((chunk)=>({chunk,score:scoreChatbotChunk(chunk,queryTokens,queryText)}))
    .filter((entry)=>entry.score>0)
    .sort((a,b)=>b.score-a.score||String(a.chunk.id||"").localeCompare(String(b.chunk.id||"")))
    .slice(0,maxItems)
    .map((entry)=>({
      id:entry.chunk.id,
      slug:entry.chunk.slug,
      readingTitle:entry.chunk.readingTitle,
      pageKey:entry.chunk.pageKey,
      pageLabel:entry.chunk.pageLabel,
      href:entry.chunk.href?new URL(entry.chunk.href,window.location.href).href:"",
      text:String(entry.chunk.text||"").trim()
    }))
    .filter((entry)=>entry.text);
}

function buildChatbotMaterialPrompt(materials){
  if(!materials.length){
    return [
      "Answer only from published site materials.",
      "No relevant material snippet was found for this question.",
      "If the answer is not supported by the site's published materials or reading cards, say that you cannot answer from the current materials."
    ].join("\n");
  }

  const materialText=materials
    .map((item,index)=>[
      `[Material ${index+1}]`,
      `Reading: ${item.readingTitle}`,
      `Page: ${item.pageLabel}`,
      item.href?`URL: ${item.href}`:"",
      item.text
    ].filter(Boolean).join("\n"))
    .join("\n\n");

  return [
    "Answer only from the published site materials below.",
    "If the answer is not directly supported by these materials or the reading-card metadata, say that you cannot answer from the current site materials.",
    materialText
  ].join("\n\n");
}

function setTheme(theme){
  document.documentElement.dataset.theme=theme;
  try{localStorage.setItem(THEME_KEY,theme);}catch(error){}
  document.querySelectorAll("[data-theme-toggle]").forEach((button)=>{
    button.textContent=theme==="dark"?UI_TEXT.lightMode:UI_TEXT.darkMode;
  });
}

function initTheme(){
  const saved=(()=>{try{return localStorage.getItem(THEME_KEY);}catch(error){return null;}})();
  setTheme(saved||document.documentElement.dataset.theme||"light");
  document.querySelectorAll("[data-theme-toggle]").forEach((button)=>{
    button.addEventListener("click",()=>{
      setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark");
    });
  });
}

function ensureGateToast(){
  let toast=document.querySelector("[data-gate-toast]");
  if(toast)return toast;
  toast=document.createElement("div");
  toast.className="gate-toast";
  toast.hidden=true;
  toast.setAttribute("data-gate-toast","");
  document.body.appendChild(toast);
  return toast;
}

function showGateToast(message){
  const toast=ensureGateToast();
  const text=(message||"준비중입니다.").trim();
  toast.textContent=text;
  toast.hidden=false;
  if(showGateToast.timer)window.clearTimeout(showGateToast.timer);
  showGateToast.timer=window.setTimeout(()=>{
    toast.hidden=true;
  },1800);
}

function initGatedLinks(){
  document.querySelectorAll("[data-gated-link]").forEach((element)=>{
    element.addEventListener("click",(event)=>{
      event.preventDefault();
      showGateToast(element.dataset.gatedMessage||"준비중입니다.");
    });
  });
}

function initHomeFilters(){
  const controls=document.querySelector("[data-home-controls]");
  if(!controls)return;
  const input=controls.querySelector("[data-reading-search]");
  const typeSelect=controls.querySelector("[data-reading-type]");
  const tagSelect=controls.querySelector("[data-reading-tag]");
  const grid=document.querySelector("[data-reading-grid]");
  const cards=Array.from(document.querySelectorAll("[data-reading-card]"));
  const empty=document.querySelector("[data-empty-state]");

  const apply=()=>{
    const query=(input?.value||"").trim().toLowerCase();
    const type=(typeSelect?.value||"").trim().toLowerCase();
    const tag=(tagSelect?.value||"").trim().toLowerCase();
    const visible=cards.filter((card)=>{
      const search=(card.dataset.search||"").toLowerCase();
      const cardType=(card.dataset.type||"").toLowerCase();
      const tags=(card.dataset.tags||"").toLowerCase().split("||").filter(Boolean);
      return (!query||search.includes(query))&&(!type||cardType===type)&&(!tag||tags.includes(tag));
    });

    cards.forEach((card)=>{card.hidden=!visible.includes(card);});
    visible.forEach((card)=>grid?.appendChild(card));
    if(empty)empty.hidden=visible.length!==0;
  };

  [input,typeSelect,tagSelect].forEach((element)=>element&&element.addEventListener("input",apply));
  [typeSelect,tagSelect].forEach((element)=>element&&element.addEventListener("change",apply));
  apply();
}

function buildHomeChatbotCatalog(){
  return Array.from(document.querySelectorAll("[data-reading-card]"))
    .map((card)=>{
      const link=card.querySelector("a.card-link");
      const href=link?.getAttribute("href");
      return{
        slug:(card.dataset.readingSlug||"").trim(),
        title:(card.querySelector(".title")?.textContent||"").trim(),
        subtitle:(card.querySelector(".card-subtitle")?.textContent||"").trim(),
        date:(card.querySelector(".card-date")?.textContent||"").trim(),
        type:(card.dataset.type||"").trim(),
        state:(card.dataset.cardState||"").trim(),
        href:href?new URL(href,window.location.href).href:"",
        visible:!card.hidden
      };
    })
    .filter((reading)=>reading.title);
}

function extractTextFromContentBlocks(blocks){
  if(!Array.isArray(blocks))return "";
  return blocks
    .map((block)=>{
      if(typeof block==="string")return block;
      if(typeof block?.text==="string")return block.text;
      if(typeof block?.content==="string")return block.content;
      return "";
    })
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

function extractChatbotReply(payload){
  if(typeof payload==="string")return payload.trim();
  if(!payload||typeof payload!=="object")return "";

  const direct=[
    payload.reply,
    payload.output_text,
    payload.text,
    payload.message,
    payload.answer,
    payload.error?.message
  ].find((value)=>typeof value==="string"&&value.trim());
  if(direct)return direct.trim();

  if(Array.isArray(payload.content)){
    const contentText=extractTextFromContentBlocks(payload.content);
    if(contentText)return contentText;
  }

  if(Array.isArray(payload.output)){
    for(const item of payload.output){
      if(item?.role==="assistant"&&Array.isArray(item.content)){
        const outputText=extractTextFromContentBlocks(item.content);
        if(outputText)return outputText;
      }
      if(Array.isArray(item?.content)){
        const contentText=extractTextFromContentBlocks(item.content);
        if(contentText)return contentText;
      }
    }
  }

  if(Array.isArray(payload.messages)){
    const assistantMessage=[...payload.messages].reverse().find((item)=>item?.role==="assistant");
    if(assistantMessage){
      const messageText=extractChatbotReply(assistantMessage);
      if(messageText)return messageText;
    }
  }

  if(Array.isArray(payload.choices)){
    for(const choice of payload.choices){
      const choiceText=choice?.message?.content||choice?.text;
      if(typeof choiceText==="string"&&choiceText.trim())return choiceText.trim();
    }
  }

  return "";
}

function renderChatbotMessageHtml(message){
  const role=message.role==="user"?"user":"assistant";
  const label=role==="user"?"질문":"답변";
  return `
    <article class="home-chatbot-message is-${role}">
      <p class="home-chatbot-message-role">${label}</p>
      <div class="home-chatbot-bubble">${renderPlainTextBlocks(message.content)}</div>
    </article>
  `;
}

function initHomeChatbot(){
  const root=document.querySelector("[data-home-chatbot]");
  if(!root||document.body.dataset.pageKind!=="home")return;

  const config=getHomeChatbotConfig();
  if(config.enabled===false){
    root.remove();
    return;
  }

  const toggle=root.querySelector("[data-chatbot-toggle]");
  const panel=root.querySelector("[data-chatbot-panel]");
  const backdrop=root.querySelector("[data-chatbot-backdrop]");
  const closeButton=root.querySelector("[data-chatbot-close]");
  const viewport=root.querySelector("[data-chatbot-messages]");
  const form=root.querySelector("[data-chatbot-form]");
  const input=root.querySelector("[data-chatbot-input]");
  const submit=root.querySelector("[data-chatbot-submit]");
  if(!toggle||!panel||!viewport||!form||!input||!submit)return;

  const state={
    open:false,
    loading:false,
    controller:null,
    messages:normalizeChatbotMessages(storage.get(CHATBOT_STORAGE_KEY,[]))
  };

  const idleSubmitLabel=submit.textContent;
  if(String(config.placeholder||"").trim())input.placeholder=String(config.placeholder).trim();

  if(!state.messages.length&&String(config.welcomeMessage||"").trim()){
    state.messages=[{role:"assistant",content:String(config.welcomeMessage||DEFAULT_CHATBOT_CONFIG.welcomeMessage).trim()}];
  }

  function persistMessages(){
    storage.set(CHATBOT_STORAGE_KEY,state.messages.slice(-20));
  }

  function scrollMessagesToEnd(){
    window.requestAnimationFrame(()=>{
      viewport.scrollTop=viewport.scrollHeight;
    });
  }

  function renderMessages(){
    const loadingHtml=state.loading
      ? `
        <article class="home-chatbot-message is-assistant is-loading">
          <p class="home-chatbot-message-role">챗봇</p>
          <div class="home-chatbot-bubble">
            <p>응답을 만드는 중입니다...</p>
          </div>
        </article>
      `
      : "";
    viewport.innerHTML=state.messages.map(renderChatbotMessageHtml).join("")+loadingHtml;
    scrollMessagesToEnd();
  }

  function setOpen(nextOpen){
    state.open=Boolean(nextOpen);
    root.classList.toggle("is-open",state.open);
    root.classList.toggle("is-collapsed",!state.open);
    panel.hidden=!state.open;
    if(backdrop)backdrop.hidden=!state.open;
    toggle.setAttribute("aria-expanded",String(state.open));
    if(state.open){
      window.requestAnimationFrame(()=>input.focus());
    }
  }

  function setLoading(nextLoading){
    state.loading=Boolean(nextLoading);
    submit.disabled=state.loading;
    submit.textContent=state.loading?"전송 중..." : idleSubmitLabel;
    root.classList.toggle("is-loading",state.loading);
    renderMessages();
  }

  async function sendMessage(rawText){
    const text=String(rawText||"").trim();
    if(!text||state.loading)return;

    state.messages.push({role:"user",content:text});
    input.value="";
    persistMessages();
    renderMessages();
    setOpen(true);

    const endpoint=String(config.endpoint||"").trim();
    const materials=selectChatbotMaterials(text,Math.max(1,Number(config.maxMaterials)||DEFAULT_CHATBOT_CONFIG.maxMaterials));
    const requestMessages=state.messages
      .slice(0,-1)
      .concat({role:"assistant",content:buildChatbotMaterialPrompt(materials)},state.messages.slice(-1));
    if(!endpoint){
      state.messages.push({
        role:"assistant",
        content:String(config.disconnectedMessage||DEFAULT_CHATBOT_CONFIG.disconnectedMessage)
      });
      persistMessages();
      renderMessages();
      return;
    }

    setLoading(true);
    const controller=typeof AbortController==="function"?new AbortController():null;
    state.controller=controller;
    const timeoutMs=Math.max(1000,Number(config.requestTimeoutMs)||DEFAULT_CHATBOT_CONFIG.requestTimeoutMs);
    const timeoutId=controller?window.setTimeout(()=>controller.abort(),timeoutMs):null;

    try{
      const response=await fetch(endpoint,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          messages:requestMessages,
          site:{
            title:(document.querySelector(".brand-title")?.textContent||document.title).trim()
          },
          page:{
            kind:document.body.dataset.pageKind||"",
            title:document.title,
            url:window.location.href
          },
          readings:buildHomeChatbotCatalog(),
          materials
        }),
        signal:controller?.signal
      });

      const rawBody=await response.text();
      let payload={};
      try{
        payload=rawBody?JSON.parse(rawBody):{};
      }catch(error){
        payload={text:rawBody};
      }

      const reply=extractChatbotReply(payload);
      if(!response.ok){
        throw new Error(reply||`요청 실패 (${response.status})`);
      }
      if(!reply){
        throw new Error("응답 본문이 비어 있습니다.");
      }

      state.messages.push({role:"assistant",content:reply});
    }catch(error){
      const fallbackMessage=error?.name==="AbortError"
        ? "응답 시간이 길어져 요청을 중단했습니다. 서버 프록시나 모델 설정을 다시 확인해 주세요."
        : `연결 중 오류가 발생했습니다. ${error?.message||"서버 응답을 확인해 주세요."}`;
      state.messages.push({role:"assistant",content:fallbackMessage});
    }finally{
      if(timeoutId)window.clearTimeout(timeoutId);
      state.controller=null;
      persistMessages();
      setLoading(false);
    }
  }

  toggle.addEventListener("click",()=>{setOpen(!state.open);});
  closeButton&&closeButton.addEventListener("click",()=>{setOpen(false);});
  backdrop&&backdrop.addEventListener("click",()=>{setOpen(false);});
  document.addEventListener("keydown",(event)=>{
    if(event.key==="Escape"&&state.open){
      setOpen(false);
    }
  });

  form.addEventListener("submit",(event)=>{
    event.preventDefault();
    sendMessage(input.value);
  });

  input.addEventListener("keydown",(event)=>{
    if(event.key==="Enter"&&!event.shiftKey){
      event.preventDefault();
      if(form.requestSubmit)form.requestSubmit();
      else sendMessage(input.value);
    }
  });

  setOpen(false);
  renderMessages();
}

function initTabMenus(){
  const menus=Array.from(document.querySelectorAll("[data-tab-more]"));
  if(!menus.length)return;

  const closeMenu=(menu)=>{
    if(menu?.open)menu.open=false;
  };

  const closeAll=(except=null)=>{
    menus.forEach((menu)=>{
      if(menu!==except)closeMenu(menu);
    });
  };

  menus.forEach((menu)=>{
    const links=Array.from(menu.querySelectorAll("[data-tab-more-link]"));
    menu.addEventListener("toggle",()=>{
      if(menu.open)closeAll(menu);
    });
    links.forEach((link)=>{
      link.addEventListener("click",()=>{
        closeMenu(menu);
      });
    });
  });

  document.querySelectorAll("[data-tab-link]").forEach((link)=>{
    link.addEventListener("click",()=>{
      closeAll();
    });
  });

  document.addEventListener("click",(event)=>{
    menus.forEach((menu)=>{
      if(menu.open&&!menu.contains(event.target))closeMenu(menu);
    });
  });

  document.addEventListener("keydown",(event)=>{
    if(event.key!=="Escape")return;
    closeAll();
  });
}

function slugify(value){
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"")||"section";
}

function cleanHeadingText(text){
  return String(text||"").replace(/\s*중요\s*$/," ").trim();
}

function setFontScale(scale){
  const clamped=Math.min(1.35,Math.max(0.9,Number(scale.toFixed(2))));
  document.documentElement.style.setProperty("--reader-font-scale",String(clamped));
  try{localStorage.setItem(FONT_KEY,String(clamped));}catch(error){}
  return clamped;
}

function initReader(){
  const root=document.querySelector("[data-reader-root]");
  if(!root)return;
  const articleBody=root.querySelector("[data-article-body]");
  if(!articleBody)return;

  const pagePath=root.dataset.pagePath||window.location.pathname;
  const scrollKey=`aa-scroll:${pagePath}`;
  const marksKey=`aa-marks:${pagePath}`;
  const bookmarksKey="aa-bookmarked-pages";
  const note=root.querySelector("[data-reading-status]");
  const resume=root.querySelector("[data-resume-position]");
  const bookmarkButton=root.querySelector("[data-page-bookmark]");
  const importantList=root.querySelector("[data-important-list]");
  const toc=root.querySelector("[data-generated-toc]");
  const marked=new Set(storage.get(marksKey,[]));
  const savedScale=Number((()=>{try{return localStorage.getItem(FONT_KEY);}catch(error){return 1;}})()||1);

  setFontScale(savedScale||1);
  root.querySelectorAll("[data-font-action]").forEach((button)=>{
    button.addEventListener("click",()=>{
      const action=button.dataset.fontAction;
      const current=Number(getComputedStyle(document.documentElement).getPropertyValue("--reader-font-scale")||1);
      if(action==="decrease")setFontScale(current-0.05);
      if(action==="increase")setFontScale(current+0.05);
      if(action==="reset")setFontScale(1);
    });
  });

  const bookmarked=new Set(storage.get(bookmarksKey,[]));
  const updateBookmark=()=>{
    const active=bookmarked.has(pagePath);
    if(bookmarkButton){
      bookmarkButton.textContent=active?UI_TEXT.bookmarked:UI_TEXT.bookmark;
      bookmarkButton.classList.toggle("is-active",active);
    }
  };

  if(bookmarkButton){
    bookmarkButton.addEventListener("click",()=>{
      if(bookmarked.has(pagePath))bookmarked.delete(pagePath);
      else bookmarked.add(pagePath);
      storage.set(bookmarksKey,Array.from(bookmarked));
      updateBookmark();
    });
    updateBookmark();
  }

  const headings=Array.from(articleBody.querySelectorAll("h2,h3,h4"));
  const renderImportantList=()=>{
    if(!importantList)return;
    if(!headings.length){
      importantList.innerHTML=`<p class="meta">${UI_TEXT.noHeadingList}</p>`;
      return;
    }
    const markedHeadings=headings.filter((heading)=>marked.has(heading.id));
    importantList.innerHTML=markedHeadings.length
      ? markedHeadings.map((heading)=>`<a class="important-link" href="#${heading.id}">${cleanHeadingText(heading.textContent)}</a>`).join("")
      : `<p class="meta">${UI_TEXT.noImportant}</p>`;
  };

  if(!headings.length&&toc)toc.innerHTML=`<p class="meta">${UI_TEXT.noHeadings}</p>`;
  const tocLinks=headings.map((heading,index)=>{
    if(!heading.id)heading.id=`${slugify(heading.textContent)}-${index+1}`;
    heading.classList.add("markable-heading");
    let marker=heading.querySelector(".mark-btn");
    if(!marker){
      marker=document.createElement("button");
      marker.type="button";
      marker.className="mark-btn";
      marker.textContent=UI_TEXT.mark;
      heading.appendChild(marker);
    }

    const syncMarker=()=>{
      const active=marked.has(heading.id);
      marker.classList.toggle("is-active",active);
      marker.setAttribute("aria-pressed",String(active));
    };

    marker.addEventListener("click",()=>{
      if(marked.has(heading.id))marked.delete(heading.id);
      else marked.add(heading.id);
      storage.set(marksKey,Array.from(marked));
      syncMarker();
      renderImportantList();
      if(toc){
        const tocLink=toc.querySelector(`[href="#${heading.id}"]`);
        tocLink&&tocLink.classList.toggle("is-important",marked.has(heading.id));
      }
    });

    syncMarker();
    return `<a class="toc-link toc-${heading.tagName.toLowerCase()} ${marked.has(heading.id)?"is-important":""}" href="#${heading.id}">${cleanHeadingText(heading.textContent)}</a>`;
  });

  if(toc&&tocLinks.length)toc.innerHTML=tocLinks.join("");
  renderImportantList();

  const saved=storage.get(scrollKey,null);
  if(saved&&typeof saved.y==="number"&&saved.y>120&&resume){
    resume.hidden=false;
    resume.addEventListener("click",()=>{window.scrollTo({top:saved.y,behavior:"smooth"});});
    if(note)note.textContent=UI_TEXT.savedResume;
  }

  let ticking=false;
  const saveScroll=()=>{
    storage.set(scrollKey,{y:window.scrollY,t:Date.now()});
    if(note)note.textContent=UI_TEXT.savedPosition;
    ticking=false;
  };

  window.addEventListener("scroll",()=>{
    if(ticking)return;
    ticking=true;
    window.requestAnimationFrame(saveScroll);
  },{passive:true});
  window.addEventListener("beforeunload",saveScroll);
}

function initProfessorPrep(){
  const root=document.querySelector("[data-prep-root]");
  if(!root)return;
  const readerRoot=root.closest("[data-reader-root]");
  const pagePath=readerRoot?.dataset.pagePath||window.location.pathname;
  const stateKey=`aa-prep:${pagePath}`;
  const saved=storage.get(stateKey,{});
  const state={difficultIds:new Set(Array.isArray(saved.difficultIds)?saved.difficultIds:[])};
  const difficultList=document.querySelector("[data-prep-difficult-list]");

  const cards=Array.from(root.querySelectorAll("[data-prep-card]")).map((card)=>{
    const id=card.dataset.cardId||card.id;
    const title=(card.querySelector("[data-prep-title]")?.textContent||card.querySelector("h3, h2")?.textContent||id).trim();
    return{
      id,
      card,
      title,
      difficultButton:card.querySelector("[data-prep-difficult]")
    };
  });

  const persist=()=>{
    storage.set(stateKey,{difficultIds:Array.from(state.difficultIds)});
  };

  const renderDifficult=()=>{
    cards.forEach((card)=>{
      const active=state.difficultIds.has(card.id);
      card.card.classList.toggle("is-difficult",active);
      if(card.difficultButton){
        card.difficultButton.textContent=active?UI_TEXT.prepDifficultActive:UI_TEXT.prepDifficult;
        card.difficultButton.classList.toggle("is-active",active);
      }
    });

    if(difficultList){
      const activeCards=cards.filter((card)=>state.difficultIds.has(card.id));
      difficultList.innerHTML=activeCards.length
        ? activeCards.map((card)=>`<a class="important-link" href="#${card.id}">${card.title}</a>`).join("")
        : `<p class="meta">${UI_TEXT.prepNoDifficult}</p>`;
    }
  };

  cards.forEach((card)=>{
    if(card.difficultButton){
      card.difficultButton.addEventListener("click",()=>{
        if(state.difficultIds.has(card.id))state.difficultIds.delete(card.id);
        else state.difficultIds.add(card.id);
        renderDifficult();
        persist();
      });
    }
  });

  renderDifficult();
}

document.addEventListener("DOMContentLoaded",()=>{
  initTheme();
  initGatedLinks();
  initHomeFilters();
  initHomeChatbot();
  initTabMenus();
  initReader();
  initProfessorPrep();
});
