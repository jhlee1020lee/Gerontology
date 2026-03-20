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
  prepShowAnswers:"모범답안 보기",
  prepHideAnswers:"모범답안 숨기기",
  prepRandomOn:"랜덤 꼬리질문 끄기",
  prepRandomOff:"랜덤 꼬리질문 켜기",
  prepDifficult:"어려움 표시",
  prepDifficultActive:"어려운 카드",
  prepNoDifficult:"어려움 표시한 카드가 여기에 모입니다.",
  prepStatusDefault:"먼저 질문에 직접 답한 뒤 모범답안을 확인하세요.",
  prepStatusRandom:"랜덤 꼬리질문 모드로 실전 꼬리질문을 연습 중입니다."
};

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

function initHomeFilters(){
  const controls=document.querySelector("[data-home-controls]");
  if(!controls)return;
  const input=controls.querySelector("[data-reading-search]");
  const typeSelect=controls.querySelector("[data-reading-type]");
  const tagSelect=controls.querySelector("[data-reading-tag]");
  const sortSelect=controls.querySelector("[data-reading-sort]");
  const grid=document.querySelector("[data-reading-grid]");
  const cards=Array.from(document.querySelectorAll("[data-reading-card]"));
  const counter=document.querySelector("[data-reading-counter]");
  const empty=document.querySelector("[data-empty-state]");

  const compare=(a,b)=>{
    if((sortSelect?.value||"chronological")==="chronological"){
      const dateA=a.dataset.sortDate||"";
      const dateB=b.dataset.sortDate||"";
      const hasA=Boolean(dateA);
      const hasB=Boolean(dateB);
      if(hasA&&hasB&&dateA!==dateB)return dateA.localeCompare(dateB);
      if(hasA!==hasB)return hasA?-1:1;
    }
    return Number(a.dataset.sequence||0)-Number(b.dataset.sequence||0);
  };

  const apply=()=>{
    const query=(input?.value||"").trim().toLowerCase();
    const type=(typeSelect?.value||"").trim().toLowerCase();
    const tag=(tagSelect?.value||"").trim().toLowerCase();
    const visible=cards.filter((card)=>{
      const search=(card.dataset.search||"").toLowerCase();
      const cardType=(card.dataset.type||"").toLowerCase();
      const tags=(card.dataset.tags||"").toLowerCase().split("||").filter(Boolean);
      return (!query||search.includes(query))&&(!type||cardType===type)&&(!tag||tags.includes(tag));
    }).sort(compare);

    cards.forEach((card)=>{card.hidden=!visible.includes(card);});
    visible.forEach((card)=>grid?.appendChild(card));
    if(counter)counter.textContent=`${visible.length}개 / 전체 ${cards.length}개`;
    if(empty)empty.hidden=visible.length!==0;
  };

  [input,typeSelect,tagSelect,sortSelect].forEach((element)=>element&&element.addEventListener("input",apply));
  [typeSelect,tagSelect,sortSelect].forEach((element)=>element&&element.addEventListener("change",apply));
  apply();
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
  const state={
    level:["10s","30s","60s"].includes(saved.level)?saved.level:"30s",
    answersVisible:Boolean(saved.answersVisible),
    randomMode:Boolean(saved.randomMode),
    difficultIds:new Set(Array.isArray(saved.difficultIds)?saved.difficultIds:[]),
    followupIndexById:saved.followupIndexById&&typeof saved.followupIndexById==="object"?saved.followupIndexById:{}
  };

  const levelButtons=Array.from(root.querySelectorAll("[data-prep-level]"));
  const answerToggle=root.querySelector("[data-prep-answer-toggle]");
  const randomToggle=root.querySelector("[data-prep-random-toggle]");
  const status=root.querySelector("[data-prep-status]");
  const difficultList=document.querySelector("[data-prep-difficult-list]");

  const cards=Array.from(root.querySelectorAll("[data-prep-card]")).map((card)=>{
    const id=card.dataset.cardId||card.id;
    const title=(card.querySelector("h2")?.textContent||id).replace(/^Q\.\s*/,"").trim();
    return{
      id,
      card,
      title,
      answerShell:card.querySelector("[data-prep-answer-shell]"),
      answerPanels:Array.from(card.querySelectorAll("[data-prep-answer]")),
      difficultButton:card.querySelector("[data-prep-difficult]"),
      followupList:card.querySelector("[data-prep-followup-list]"),
      randomBox:card.querySelector("[data-prep-random-box]"),
      randomQuestion:card.querySelector("[data-prep-random-question]"),
      randomAnswer:card.querySelector("[data-prep-random-answer]"),
      rerollButton:card.querySelector("[data-prep-reroll]"),
      followups:Array.from(card.querySelectorAll("[data-followup-item]"))
        .map((item)=>({question:item.dataset.question||"",answer:item.dataset.answer||""}))
        .filter((item)=>item.question&&item.answer)
    };
  });

  const persist=()=>{
    storage.set(stateKey,{
      level:state.level,
      answersVisible:state.answersVisible,
      randomMode:state.randomMode,
      difficultIds:Array.from(state.difficultIds),
      followupIndexById:state.followupIndexById
    });
  };

  const pickFollowup=(card,forceNew=false)=>{
    if(!card.followups.length)return null;
    let current=Number(state.followupIndexById[card.id]);
    if(!Number.isInteger(current)||current<0||current>=card.followups.length)current=-1;
    let next=current;
    if(forceNew||current===-1){
      if(card.followups.length===1)next=0;
      else{
        do{next=Math.floor(Math.random()*card.followups.length);}while(next===current);
      }
      state.followupIndexById[card.id]=next;
    }
    return card.followups[state.followupIndexById[card.id]];
  };

  const syncStatus=()=>{
    if(!status)return;
    if(state.randomMode){
      status.textContent=UI_TEXT.prepStatusRandom;
      return;
    }
    if(state.answersVisible){
      status.textContent=`현재 ${state.level.replace("s","초")} 답변 길이의 모범답안을 보고 있습니다.`;
      return;
    }
    status.textContent=UI_TEXT.prepStatusDefault;
  };

  const renderAnswers=()=>{
    if(answerToggle){
      answerToggle.textContent=state.answersVisible?UI_TEXT.prepHideAnswers:UI_TEXT.prepShowAnswers;
      answerToggle.classList.toggle("is-active",state.answersVisible);
    }
    levelButtons.forEach((button)=>{
      const active=button.dataset.prepLevel===state.level;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-pressed",String(active));
    });
    cards.forEach((card)=>{
      if(card.answerShell)card.answerShell.hidden=!state.answersVisible;
      card.answerPanels.forEach((panel)=>{
        panel.hidden=!state.answersVisible||panel.dataset.prepAnswer!==state.level;
      });
    });
  };

  const renderRandomMode=()=>{
    if(randomToggle){
      randomToggle.textContent=state.randomMode?UI_TEXT.prepRandomOn:UI_TEXT.prepRandomOff;
      randomToggle.classList.toggle("is-active",state.randomMode);
    }
    cards.forEach((card)=>{
      const hasFollowups=card.followups.length>0;
      if(card.followupList)card.followupList.hidden=state.randomMode&&hasFollowups;
      if(card.randomBox)card.randomBox.hidden=!(state.randomMode&&hasFollowups);
      if(card.rerollButton)card.rerollButton.hidden=!(state.randomMode&&hasFollowups);
      if(state.randomMode&&hasFollowups){
        const choice=pickFollowup(card,false)||pickFollowup(card,true);
        if(choice){
          if(card.randomQuestion)card.randomQuestion.textContent=choice.question;
          if(card.randomAnswer)card.randomAnswer.textContent=choice.answer;
        }
      }
    });
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

  levelButtons.forEach((button)=>{
    button.addEventListener("click",()=>{
      state.level=button.dataset.prepLevel||"30s";
      renderAnswers();
      syncStatus();
      persist();
    });
  });

  if(answerToggle){
    answerToggle.addEventListener("click",()=>{
      state.answersVisible=!state.answersVisible;
      renderAnswers();
      syncStatus();
      persist();
    });
  }

  if(randomToggle){
    randomToggle.addEventListener("click",()=>{
      state.randomMode=!state.randomMode;
      if(state.randomMode){
        cards.forEach((card)=>{pickFollowup(card,true);});
      }
      renderRandomMode();
      syncStatus();
      persist();
    });
  }

  cards.forEach((card)=>{
    if(card.difficultButton){
      card.difficultButton.addEventListener("click",()=>{
        if(state.difficultIds.has(card.id))state.difficultIds.delete(card.id);
        else state.difficultIds.add(card.id);
        renderDifficult();
        persist();
      });
    }
    if(card.rerollButton){
      card.rerollButton.addEventListener("click",()=>{
        pickFollowup(card,true);
        renderRandomMode();
        persist();
      });
    }
  });

  renderAnswers();
  renderRandomMode();
  renderDifficult();
  syncStatus();
}

document.addEventListener("DOMContentLoaded",()=>{
  initTheme();
  initHomeFilters();
  initReader();
  initProfessorPrep();
});
