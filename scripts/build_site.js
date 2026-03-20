const fs=require("fs");
const path=require("path");

const rootDir=path.resolve(__dirname,"..");
const manifestPath=path.join(rootDir,"manifest","readings.json");
const siteDir=path.join(rootDir,"docs");
const styleSource=path.join(__dirname,"site_styles.css");
const appSource=path.join(__dirname,"site_app.js");

const PAGE_DEFS=[
  {key:"summary",label:"핵심 요약",filename:"summary.html",type:"article",description:"읽기 전 전체 흐름을 빠르게 잡는 요약 페이지입니다."},
  {key:"full",label:"전체 글",filename:"full.html",type:"article",description:"정리된 본문을 읽기 편한 글 레이아웃으로 제공합니다."},
  {key:"translation",label:"한국어 번역",filename:"translation.html",type:"article",description:"영문 읽기 자료를 한국어로 다시 따라갈 수 있는 번역 페이지입니다.",englishOnly:true},
  {key:"concepts",label:"핵심 개념",filename:"concepts.html",type:"article",description:"핵심 개념과 용어를 빠르게 복습하는 페이지입니다."},
  {key:"pitfalls",label:"헷갈리는 포인트",filename:"pitfalls.html",type:"article",description:"헷갈리기 쉬운 구분과 자주 틀리는 포인트를 정리하는 페이지입니다."},
  {key:"quiz-ox",label:"OX 퀴즈",filename:"quiz-ox.html",type:"quiz",description:"맞다/틀리다 형식으로 핵심 내용을 점검하는 퀴즈입니다."},
  {key:"quiz-short",label:"단답형 퀴즈",filename:"quiz-short.html",type:"quiz",description:"한 용어, 이름, 숫자, 짧은 구로만 답하는 진짜 단답형 퀴즈입니다."},
  {key:"quiz-mcq",label:"객관식 퀴즈",filename:"quiz-mcq.html",type:"quiz",description:"선지를 비교하며 이해를 점검하는 객관식 퀴즈입니다."},
  {key:"review-sheet",label:"시험 직전 정리",filename:"review-sheet.html",type:"article",description:"시험 직전에 빠르게 훑을 수 있도록 압축한 정리 페이지입니다."},
  {key:"professor-prep",label:"교수님 구술 대비",filename:"professor-prep.html",type:"professor-prep",description:"질문에 바로 답하고 꼬리질문까지 대비하는 구술형 수업 대비 페이지입니다."}
];

const FLOW_STEPS=[
  {step:1,mode:"page",key:"summary",title:"핵심 요약",blurb:"먼저 큰 흐름을 잡고 읽기 전체의 프레임을 세웁니다."},
  {step:2,mode:"page",key:"full",title:"전체 글",blurb:"핵심 요약 이후 본문을 차분하게 읽습니다."},
  {step:3,mode:"page",key:"translation",title:"한국어 번역",blurb:"영문 읽기 자료라면 번역 페이지로 다시 한 번 구조를 확인합니다.",optional:true},
  {step:4,mode:"page",key:"concepts",title:"핵심 개념",blurb:"수업과 시험에 자주 나오는 개념과 용어를 정리합니다."},
  {step:5,mode:"page",key:"pitfalls",title:"헷갈리는 포인트",blurb:"비슷해 보여 헷갈리기 쉬운 구분을 다시 점검합니다."},
  {step:6,mode:"quiz-group",title:"퀴즈",blurb:"OX, 단답형, 객관식으로 기억과 이해를 확인합니다.",keys:["quiz-ox","quiz-short","quiz-mcq"]},
  {step:7,mode:"page",key:"review-sheet",title:"시험 직전 정리",blurb:"시험 직전에 마지막으로 훑을 압축 정리를 확인합니다."},
  {step:8,mode:"page",key:"professor-prep",title:"교수님 구술 대비",blurb:"질문에 바로 답하고, 왜 중요한지와 한계까지 말하는 구술 답변을 준비합니다."}
];

const COMMON_TEXT_MAP={
  "Filename-derived placeholder metadata.":"파일명 기준으로 만든 임시 메타데이터입니다.",
  "Placeholder record created from the source filename only.":"현재 로컬 파일명만 기준으로 만든 임시 기록입니다.",
  "Placeholder record created from the source filename only. Chapter title, author, and language need confirmation.":"현재 로컬 파일명만 기준으로 만든 임시 기록입니다. 장 제목, 저자, 언어는 추가 확인이 필요합니다.",
  "Title is copied from the filename.":"제목은 현재 파일명 기준으로만 입력되어 있습니다.",
  "Author metadata is not available from the filename.":"파일명만으로는 저자 정보를 확인할 수 없습니다.",
  "Language is not confirmed from the filename alone.":"파일명만으로는 언어를 확정할 수 없습니다.",
  "Metadata incomplete":"메타데이터 미완료",
  "Filename only":"파일명 기준",
  "Chapter PDF":"교재 PDF",
  "Article PDF":"기사 PDF",
  "Paper PDF":"논문 PDF"
};

const SHORT_ANSWER_TYPES=new Set(["term","person","number","short_phrase"]);
const SHORT_ANSWER_TYPE_LABELS={term:"용어",person:"인물",number:"숫자",short_phrase:"짧은 구"};
const PROFESSOR_FOLLOWUP_BANK=["그게 뭐야?","왜 그렇게 보는데?","뭐가 새로웠는데?","다시 말해봐.","그게 왜 중요한데?","연구에서는 뭐라고 하는데?","한국에서는 어떻게 보이는데?","그 설명의 한계는 뭐야?"];
const PROFESSOR_STYLE={
  prefers:["질문에서 묻는 핵심을 먼저 한 문장으로 바로 답하기","핵심 개념을 자기 말로 분명하게 정의하기","왜 중요한지, 무엇이 새로운지까지 설명하기","추상어 대신 읽기 속 사례나 문장을 근거로 들기","한국 사회나 학생 경험과 연결할 때는 구체적으로 연결하기","반론이나 한계를 짧게 인정하고 다시 핵심으로 돌아오기"],
  avoids:["흥미롭다, 복잡하다, 다양하다처럼 내용 없는 형용사만 반복하기","질문과 다른 이야기로 새어나가기","읽기 근거 없이 교과서식 정의만 길게 말하기","무조건 '상황에 따라 다르다'고 끝내기","AI 문장처럼 균일하고 밋밋한 표현만 늘어놓기"]
};

function readText(filePath){return fs.readFileSync(filePath,"utf8").replace(/^\uFEFF/,"");}
function writeText(filePath,text){fs.mkdirSync(path.dirname(filePath),{recursive:true});fs.writeFileSync(filePath,text,"utf8");}
function loadManifest(){return JSON.parse(readText(manifestPath));}
function relHref(fromPath,toPath){return path.relative(path.dirname(fromPath),toPath).split(path.sep).join("/");}
function escapeHtml(value){return String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;");}
function renderInline(text){return escapeHtml(text).replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>");}

function markdownToHtml(text){
  const lines=text.replace(/\r\n/g,"\n").split("\n");
  const parts=[];
  let paragraph=[];
  let listItems=[];
  let quoteLines=[];

  const flushParagraph=()=>{if(paragraph.length){parts.push(`<p>${renderInline(paragraph.join(" ").trim())}</p>`);paragraph=[];}};
  const flushList=()=>{if(listItems.length){parts.push(`<ul>${listItems.map((item)=>`<li>${renderInline(item)}</li>`).join("")}</ul>`);listItems=[];}};
  const flushQuote=()=>{if(quoteLines.length){parts.push(`<blockquote>${renderInline(quoteLines.join(" ").trim())}</blockquote>`);quoteLines=[];}};

  for(const rawLine of lines){
    const line=rawLine.trim();
    if(!line){flushParagraph();flushList();flushQuote();continue;}
    if(line.startsWith("### ")){flushParagraph();flushList();flushQuote();parts.push(`<h3>${renderInline(line.slice(4))}</h3>`);continue;}
    if(line.startsWith("## ")){flushParagraph();flushList();flushQuote();parts.push(`<h2>${renderInline(line.slice(3))}</h2>`);continue;}
    if(line.startsWith("# ")){flushParagraph();flushList();flushQuote();parts.push(`<h1>${renderInline(line.slice(2))}</h1>`);continue;}
    if(line.startsWith("- ")){flushParagraph();flushQuote();listItems.push(line.slice(2).trim());continue;}
    if(line.startsWith("> ")){flushParagraph();flushList();quoteLines.push(line.slice(2).trim());continue;}
    flushList();flushQuote();paragraph.push(line);
  }

  flushParagraph();flushList();flushQuote();
  return parts.join("\n");
}

function loadMarkdown(filePath){if(!fs.existsSync(filePath))return null;const text=readText(filePath).trim();return text||null;}
function loadJson(filePath){if(!fs.existsSync(filePath))return null;return JSON.parse(readText(filePath));}
function fileLabel(filePath){return path.relative(rootDir,filePath).split(path.sep).join("/");}
function toText(value){return typeof value==="string"?value.trim():"";}
function textArray(value){return(Array.isArray(value)?value:[value]).map((item)=>toText(item)).filter(Boolean);}
function wordCount(value){return toText(value).split(/\s+/).filter(Boolean).length;}
function requireText(value,label,filePath){const text=toText(value);if(!text)throw new Error(`[invalid] ${fileLabel(filePath)}: ${label} is required`);return text;}
function loadQuiz(page,filePath){const payload=loadJson(filePath);if(!payload)return null;const items=Array.isArray(payload.items)?payload.items:[];if(!items.length)return null;if(page.key==="quiz-short"){if(items.length!==15)throw new Error(`[invalid] ${fileLabel(filePath)}: quiz_short.json must contain exactly 15 items`);const normalizedItems=items.map((item,index)=>{const question=requireText(item.question,`items[${index}].question`,filePath);const accepted_answers=textArray(item.accepted_answers);const answer_type=requireText(item.answer_type,`items[${index}].answer_type`,filePath);const explanation=requireText(item.explanation,`items[${index}].explanation`,filePath);const source=toText(item.source);if(!accepted_answers.length)throw new Error(`[invalid] ${fileLabel(filePath)}: items[${index}].accepted_answers must be a non-empty array`);if(!SHORT_ANSWER_TYPES.has(answer_type))throw new Error(`[invalid] ${fileLabel(filePath)}: items[${index}].answer_type must be one of ${Array.from(SHORT_ANSWER_TYPES).join(", ")}`);accepted_answers.forEach((answer,answerIndex)=>{if(wordCount(answer)>7)throw new Error(`[invalid] ${fileLabel(filePath)}: items[${index}].accepted_answers[${answerIndex}] must stay under 8 words`);});return{question,accepted_answers,answer_type,explanation,source};});return{...payload,items:normalizedItems};}const normalizedItems=items.map((item,index)=>{const prompt=requireText(item.prompt,`items[${index}].prompt`,filePath);const answer=requireText(item.answer,`items[${index}].answer`,filePath);const explanation=requireText(item.explanation,`items[${index}].explanation`,filePath);const options=Array.isArray(item.options)?item.options.map((option)=>toText(option)).filter(Boolean):[];const source=toText(item.source);return{prompt,answer,explanation,options,source};});return{...payload,items:normalizedItems};}
function loadProfessorPrep(filePath){const payload=loadJson(filePath);if(!payload)return null;const cards=Array.isArray(payload.cards)?payload.cards:[];if(!cards.length)return null;if(cards.length<8||cards.length>12)throw new Error(`[invalid] ${fileLabel(filePath)}: professor_prep.json must contain 8 to 12 cards`);const normalizedCards=cards.map((card,index)=>{const question=requireText(card.question,`cards[${index}].question`,filePath);const answer_10s=requireText(card.answer_10s,`cards[${index}].answer_10s`,filePath);const answer_30s=requireText(card.answer_30s,`cards[${index}].answer_30s`,filePath);const answer_60s=requireText(card.answer_60s,`cards[${index}].answer_60s`,filePath);const must_include_keywords=textArray(card.must_include_keywords);const evidence_from_reading=textArray(card.evidence_from_reading);const likely_followups=textArray(card.likely_followups);const followup_answers=(Array.isArray(card.followup_answers)?card.followup_answers:[]).map((entry,entryIndex)=>{if(!entry||typeof entry!=="object")throw new Error(`[invalid] ${fileLabel(filePath)}: cards[${index}].followup_answers[${entryIndex}] must be an object`);return{question:requireText(entry.question,`cards[${index}].followup_answers[${entryIndex}].question`,filePath),answer:requireText(entry.answer,`cards[${index}].followup_answers[${entryIndex}].answer`,filePath)};});const korean_context_link=requireText(card.korean_context_link,`cards[${index}].korean_context_link`,filePath);const personal_connection_hint=requireText(card.personal_connection_hint,`cards[${index}].personal_connection_hint`,filePath);const avoid_bad_answers=textArray(card.avoid_bad_answers);if(!must_include_keywords.length)throw new Error(`[invalid] ${fileLabel(filePath)}: cards[${index}].must_include_keywords must be non-empty`);if(!evidence_from_reading.length)throw new Error(`[invalid] ${fileLabel(filePath)}: cards[${index}].evidence_from_reading must be non-empty`);if(!likely_followups.length)throw new Error(`[invalid] ${fileLabel(filePath)}: cards[${index}].likely_followups must be non-empty`);if(!followup_answers.length)throw new Error(`[invalid] ${fileLabel(filePath)}: cards[${index}].followup_answers must be non-empty`);if(!avoid_bad_answers.length)throw new Error(`[invalid] ${fileLabel(filePath)}: cards[${index}].avoid_bad_answers must be non-empty`);return{question,answer_10s,answer_30s,answer_60s,must_include_keywords,evidence_from_reading,likely_followups,followup_answers,korean_context_link,personal_connection_hint,avoid_bad_answers};});const followup_bank=textArray(payload.followup_bank);return{title:toText(payload.title)||"교수님 구술 대비",instructions:toText(payload.instructions)||"질문을 먼저 입으로 답한 뒤, 10초·30초·60초 모범답안과 꼬리질문을 비교하세요.",followup_bank:followup_bank.length?followup_bank:PROFESSOR_FOLLOWUP_BANK,cards:normalizedCards};}
function translateCommonText(text){return COMMON_TEXT_MAP[text]||text;}
function detectType(reading){if(reading.type)return reading.type;const kind=String(reading.kind||"").toLowerCase();if(kind.includes("chapter"))return"chapter";if(kind.includes("paper"))return"paper";if(kind.includes("article"))return"article";return"reading";}
function typeLabel(type){return({article:"기사",paper:"논문",chapter:"교재 장",reading:"읽기 자료"})[type]||"읽기 자료";}
function yearLabel(year){return year?`${year}년`:"연도 미확인";}
function languageLabel(language){return({en:"영어",ko:"한국어",unknown:"미확인"})[language]||String(language||"").toUpperCase();}
function authorsLabel(authors){return authors&&authors.length?authors.join(", "):"저자 정보 미확인";}
function kindLabel(kind,type){const normalized=String(kind||"").trim().toLowerCase();if(!normalized){return type==="chapter"?"교재 PDF":type==="paper"?"논문 PDF":type==="article"?"기사 PDF":"읽기 자료 PDF";}if(normalized==="chapter pdf")return"교재 PDF";if(normalized==="paper pdf")return"논문 PDF";if(normalized==="article pdf")return"기사 PDF";return translateCommonText(kind);}
function translateTag(tag){return translateCommonText(tag);}
function firstValue(...values){for(const value of values){if(value===null||value===undefined)continue;const text=String(value).trim();if(text)return text;}return"";}
function effectiveSortDate(reading){return firstValue(reading.sort_date,reading.reading_date,reading.class_date);}
function displayDateLabel(reading){return firstValue(reading.display_date_label,reading.reading_date,reading.class_date,reading.sort_date)||"날짜 미정";}
function statusKeyForPage(pageKey){return pageKey.replace(/-/g,"_");}
function contentPath(reading,page){const contentDir=path.join(rootDir,reading.content_dir);if(page.key==="full"){const preferred=path.join(contentDir,"full.md");const fallback=path.join(contentDir,"cleaned.md");return fs.existsSync(preferred)?preferred:(fs.existsSync(fallback)?fallback:preferred);}if(page.key==="quiz-short")return path.join(contentDir,"quiz_short.json");if(page.key==="professor-prep")return path.join(contentDir,"professor_prep.json");if(page.type==="article")return path.join(contentDir,`${page.key}.md`);return path.join(contentDir,`${page.key}.json`);}
function pageState(reading,page){const sourcePath=contentPath(reading,page);if(page.type==="article")return{sourcePath,available:Boolean(loadMarkdown(sourcePath)),count:null};if(page.type==="professor-prep"){const prep=loadProfessorPrep(sourcePath);return{sourcePath,available:Boolean(prep),count:prep?prep.cards.length:0};}const quiz=loadQuiz(page,sourcePath);return{sourcePath,available:Boolean(quiz),count:quiz?quiz.items.length:0};}
function metadataStatusHtml(status){return status==="complete"?'<span class="status ready">메타데이터 확인됨</span>':'<span class="status placeholder">메타데이터 확인 필요</span>';}
function normalizeReading(reading,sequence){const language=reading.language||"unknown";const type=detectType(reading);const rawTags=Array.isArray(reading.tags)&&reading.tags.length?reading.tags:["Metadata incomplete"];const sortDate=effectiveSortDate(reading);return{...reading,sequence,subtitle:translateCommonText(reading.subtitle||"Filename-derived placeholder metadata."),authors:reading.authors||[],authors_label:authorsLabel(reading.authors||[]),year_label:yearLabel(reading.year),language,language_label:languageLabel(language),kind:reading.kind||`${type} pdf`,kind_label:kindLabel(reading.kind||`${type} pdf`,type),type,type_label:typeLabel(type),source_filename:reading.source_filename||path.basename(reading.source_pdf),tags:rawTags.map(translateTag),description:translateCommonText(reading.description||"Placeholder record created from the source filename only."),metadata_status:reading.metadata_status||"incomplete",metadata_notes:(reading.metadata_notes||[]).map(translateCommonText),class_date:reading.class_date??null,reading_date:reading.reading_date??null,sort_date:reading.sort_date??null,display_date_label:reading.display_date_label??null,effective_sort_date:sortDate,display_date:displayDateLabel(reading),translation_required:language==="en"};}
function buildContentStatus(reading){const contentStatus={};for(const page of PAGE_DEFS){const key=statusKeyForPage(page.key);if(page.englishOnly&&reading.language!=="en"){contentStatus[key]="not_applicable";continue;}const state=pageState(reading,page);contentStatus[key]=state.available?"ready":"missing";}return contentStatus;}
function ensureContentPlaceholders(manifest){manifest.readings.forEach((rawReading,index)=>{const reading=normalizeReading(rawReading,index+1);const contentDir=path.join(rootDir,reading.content_dir);fs.mkdirSync(contentDir,{recursive:true});const metaPath=path.join(contentDir,"meta.json");let existing={};if(fs.existsSync(metaPath)){try{existing=JSON.parse(readText(metaPath));}catch(error){existing={};}}const payload={...existing,slug:reading.slug,source_filename:reading.source_filename,source_pdf:reading.source_pdf,content_dir:reading.content_dir,title:reading.title,subtitle:reading.subtitle,authors:reading.authors,year:reading.year??null,language:reading.language,type:reading.type,kind:reading.kind,class_date:reading.class_date,reading_date:reading.reading_date,sort_date:reading.sort_date,display_date_label:reading.display_date_label,description:reading.description,metadata_status:reading.metadata_status,metadata_notes:reading.metadata_notes,content_status:buildContentStatus(reading)};writeText(metaPath,`${JSON.stringify(payload,null,2)}\n`);});}
function prepareReadings(manifest){return manifest.readings.map((rawReading,index)=>{const reading=normalizeReading(rawReading,index+1);const pages=PAGE_DEFS.filter((page)=>!(page.englishOnly&&reading.language!=="en")).map((page)=>({...page,...pageState(reading,page)}));return{...reading,pages};});}
function compareReadings(a,b,mode){if(mode==="chronological"){const aHasDate=Boolean(a.effective_sort_date);const bHasDate=Boolean(b.effective_sort_date);if(aHasDate&&bHasDate&&a.effective_sort_date!==b.effective_sort_date)return a.effective_sort_date.localeCompare(b.effective_sort_date);if(aHasDate!==bHasDate)return aHasDate?-1:1;}return a.sequence-b.sequence;}
function searchBlob(reading){return[reading.slug,reading.title,reading.subtitle,reading.source_filename,reading.language,reading.type,reading.kind,reading.year_label,reading.display_date,...(reading.authors||[]),...(reading.tags||[]),...(reading.metadata_notes||[])].filter(Boolean).join(" ");}
function buildTagOptions(readings){return Array.from(new Set(readings.flatMap((reading)=>reading.tags||[]).filter(Boolean))).sort((a,b)=>a.localeCompare(b,"ko"));}
function statusHtml(available){return `<span class="status ${available?"ready":"placeholder"}">${available?"준비됨":"임시 안내"}</span>`;}
function readingSequenceLabel(sequence){return `읽기 ${String(sequence).padStart(2,"0")}`;}
function studyOrderText(reading){const steps=["핵심 요약","전체 글"];if(reading.translation_required)steps.push("한국어 번역");steps.push("핵심 개념","헷갈리는 포인트","퀴즈","시험 직전 정리","교수님 구술 대비");return steps.join(" -> ");}
function siteHeader(siteMeta,outputPath){const homeHref=relHref(outputPath,path.join(siteDir,"index.html"));return `
<header class="topbar">
  <div class="brand">
    <a class="brand-mark" href="${escapeHtml(homeHref)}">AA</a>
    <div>
      <p class="brand-title">${escapeHtml(siteMeta.title)}</p>
      <p class="brand-sub">${escapeHtml(siteMeta.tagline)}</p>
    </div>
  </div>
  <div class="topbar-actions">
    <button class="ghost-btn" type="button" data-theme-toggle>다크 모드</button>
  </div>
</header>
`;}
function renderDocument(siteMeta,outputPath,title,body,description,bodyAttrs="",lang="ko"){const cssHref=relHref(outputPath,path.join(siteDir,"assets","styles.css"));const jsHref=relHref(outputPath,path.join(siteDir,"assets","app.js"));return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} | ${escapeHtml(siteMeta.title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <script>
    (() => {
      try {
        const theme=localStorage.getItem("aa-theme");
        if(theme) document.documentElement.dataset.theme=theme;
        const fontScale=localStorage.getItem("aa-font-scale");
        if(fontScale) document.documentElement.style.setProperty("--reader-font-scale",fontScale);
      } catch (error) {}
    })();
  </script>
  <link rel="stylesheet" href="${escapeHtml(cssHref)}" />
</head>
<body ${bodyAttrs}>
${body}
<script src="${escapeHtml(jsHref)}"></script>
</body>
</html>
`;}
function pageTabs(outputPath,reading,activeKey){const base=path.join(siteDir,"readings",reading.slug);const tabs=[{key:"index",label:"개요",target:path.join(base,"index.html")}].concat(reading.pages.map((page)=>({key:page.key,label:page.label,target:path.join(base,page.filename)})));return `<nav class="tab-row">${tabs.map((tab)=>`<a class="tab${tab.key===activeKey?" active":""}" href="${escapeHtml(relHref(outputPath,tab.target))}">${escapeHtml(tab.label)}</a>`).join("")}</nav>`;}
function placeholderArticleHtml(reading,page,sourcePath){const relSource=fileLabel(sourcePath);return `
<section class="placeholder article-placeholder">
  <h2>임시 안내 페이지</h2>
  <p>${escapeHtml(relSource)}에 아직 작성된 콘텐츠가 없습니다. 읽기 흐름이 끊기지 않도록 링크는 유지한 상태로 안내 페이지를 보여 줍니다.</p>
  <h3>예상 소스 파일</h3>
  <p><code>${escapeHtml(relSource)}</code></p>
  <h3>이 페이지의 역할</h3>
  <p>${escapeHtml(page.description)}</p>
  <h3>현재 읽기 정보</h3>
  <p>${escapeHtml(reading.display_date)} | ${escapeHtml(reading.type_label)} | ${escapeHtml(reading.language_label)}</p>
</section>
`;}
function placeholderQuizHtml(page,sourcePath){const relSource=fileLabel(sourcePath);return `
<section class="placeholder">
  <h2>임시 안내 페이지</h2>
  <p>${escapeHtml(relSource)}에 아직 퀴즈 데이터가 없습니다. 전체 학습 흐름이 끊기지 않도록 링크는 그대로 유지합니다.</p>
  <h3>예상 소스 파일</h3>
  <p><code>${escapeHtml(relSource)}</code></p>
  <h3>이 페이지의 역할</h3>
  <p>${escapeHtml(page.description)}</p>
</section>
`;}
function placeholderProfessorPrepHtml(page,sourcePath){const relSource=fileLabel(sourcePath);return `
<section class="placeholder">
  <h2>임시 안내 페이지</h2>
  <p>${escapeHtml(relSource)}에 아직 교수님 구술 대비 카드가 없습니다. 링크는 유지하고, 페이지 역할만 먼저 안내합니다.</p>
  <h3>예상 소스 파일</h3>
  <p><code>${escapeHtml(relSource)}</code></p>
  <h3>이 페이지의 역할</h3>
  <p>${escapeHtml(page.description)}</p>
</section>
`;}
function metadataNotesHtml(reading){if(!reading.metadata_notes||!reading.metadata_notes.length)return"";return `<div class="meta-notes"><h3>메타데이터 메모</h3><ul>${reading.metadata_notes.map((note)=>`<li>${escapeHtml(note)}</li>`).join("")}</ul></div>`;}
function pageDetailText(page){if(page.type==="quiz")return page.available?`${page.count}문항`:"임시 안내";if(page.type==="professor-prep")return page.available?`${page.count}카드`:"임시 안내";return page.available?"바로 열기":"임시 안내";}
function pageMap(pages){return Object.fromEntries(pages.map((page)=>[page.key,page]));}
function pageLink(outputPath,reading,page,labelOverride){const target=relHref(outputPath,path.join(siteDir,"readings",reading.slug,page.filename));return `<a class="ghost-btn link-btn" href="${escapeHtml(target)}">${escapeHtml(labelOverride||page.label)}</a>`;}
function readerToolbar(){return `
<div class="reader-toolbar" role="toolbar" aria-label="읽기 조절">
  <div class="toolbar-group">
    <button class="reader-btn" type="button" data-font-action="decrease">A-</button>
    <button class="reader-btn" type="button" data-font-action="reset">A</button>
    <button class="reader-btn" type="button" data-font-action="increase">A+</button>
  </div>
  <div class="toolbar-group">
    <button class="reader-btn" type="button" data-page-bookmark>북마크</button>
    <button class="reader-btn" type="button" data-resume-position hidden>이어서 보기</button>
  </div>
  <p class="reader-note" data-reading-status>읽던 위치는 이 기기에만 저장됩니다.</p>
</div>
`;}
function renderFlowStep(outputPath,reading,pagesByKey,step){
  if(step.mode==="quiz-group"){
    const quizPages=step.keys.map((key)=>pagesByKey[key]).filter(Boolean);
    const readyCount=quizPages.filter((page)=>page.available).length;
    const links=quizPages.map((page)=>{const target=relHref(outputPath,path.join(siteDir,"readings",reading.slug,page.filename));return `<a class="sub-link" href="${escapeHtml(target)}"><span>${escapeHtml(page.label)}</span><span>${escapeHtml(page.available?`${page.count}문항`:"임시 안내")}</span></a>`;}).join("");
    return `
<article class="flow-card quiz-flow-card">
  <p class="step-index">단계 ${step.step}</p>
  <h3>${escapeHtml(step.title)}</h3>
  <p class="meta">${escapeHtml(step.blurb)}</p>
  <div class="page-footer">
    <span class="status ${readyCount?"ready":"placeholder"}">${readyCount}/${quizPages.length}개 준비됨</span>
    <span class="chip">퀴즈 묶음</span>
  </div>
  <div class="sub-link-list">${links}</div>
</article>
`;
  }
  const page=pagesByKey[step.key];
  if(!page){return `
<article class="flow-card muted">
  <p class="step-index">단계 ${step.step}</p>
  <h3>${escapeHtml(step.title)}</h3>
  <p class="meta">${escapeHtml(step.blurb)}</p>
  <p class="muted-note">이 읽기 자료에는 해당하지 않습니다.</p>
</article>
`;}
  const target=relHref(outputPath,path.join(siteDir,"readings",reading.slug,page.filename));
  return `
<article class="flow-card">
  <p class="step-index">단계 ${step.step}</p>
  <h3>${escapeHtml(step.title)}</h3>
  <p class="meta">${escapeHtml(step.blurb)}</p>
  <p class="flow-desc">${escapeHtml(page.description)}</p>
  <div class="page-footer">
    ${statusHtml(page.available)}
    <a class="chip" href="${escapeHtml(target)}">${escapeHtml(pageDetailText(page))}</a>
  </div>
</article>
`;}
function renderList(items){return `<ul>${items.map((item)=>`<li>${renderInline(item)}</li>`).join("")}</ul>`;}
function renderChipRow(items,className="chip-row"){return `<div class="${escapeHtml(className)}">${items.map((item)=>`<span class="chip">${escapeHtml(item)}</span>`).join("")}</div>`;}
function writePlaceholderSvg(reading,svgPath){const slug=escapeHtml(reading.slug);const title=escapeHtml(reading.title||reading.slug);const subtitle=escapeHtml(reading.subtitle||"파일명 기준으로 만든 임시 메타데이터입니다.");const dateLabel=escapeHtml(displayDateLabel(reading));const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14334c" />
      <stop offset="100%" stop-color="#b06a34" />
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)" rx="36" />
  <rect x="56" y="56" width="1168" height="608" fill="rgba(255,255,255,0.08)" rx="28" />
  <text x="84" y="138" fill="#f7f1e8" font-size="36" font-family="'Segoe UI', 'Noto Sans KR', sans-serif">${slug}</text>
  <text x="84" y="248" fill="#ffffff" font-size="74" font-weight="700" font-family="'Segoe UI', 'Noto Sans KR', sans-serif">${title}</text>
  <text x="84" y="330" fill="#e9d9c9" font-size="34" font-family="'Segoe UI', 'Noto Sans KR', sans-serif">${subtitle}</text>
  <text x="84" y="604" fill="#ffffff" font-size="28" font-family="'Segoe UI', 'Noto Sans KR', sans-serif">${dateLabel} · PDF 썸네일 임시 이미지</text>
</svg>
`;writeText(svgPath,svg);}
function buildThumbnails(manifest){const thumbnailDir=path.join(siteDir,"assets","thumbnails");fs.mkdirSync(thumbnailDir,{recursive:true});const results={};for(const reading of manifest.readings){const svgPath=path.join(thumbnailDir,`${reading.slug}.svg`);writePlaceholderSvg(reading,svgPath);results[reading.slug]=path.posix.join("assets","thumbnails",`${reading.slug}.svg`);}return results;}
function buildIndex(siteMeta,readings,thumbnails){const outputPath=path.join(siteDir,"index.html");const totalPages=readings.reduce((sum,reading)=>sum+reading.pages.length,0);const readyPages=readings.reduce((sum,reading)=>sum+reading.pages.filter((page)=>page.available).length,0);const tagOptions=buildTagOptions(readings);const typeOptions=Array.from(new Set(readings.map((reading)=>reading.type))).sort((a,b)=>a.localeCompare(b,"ko"));const sortedReadings=[...readings].sort((a,b)=>compareReadings(a,b,"chronological"));const cards=sortedReadings.map((reading)=>{const thumbHref=relHref(outputPath,path.join(siteDir,thumbnails[reading.slug]));const targetHref=relHref(outputPath,path.join(siteDir,"readings",reading.slug,"index.html"));const tags=reading.tags.map((tag)=>`<span class="chip">${escapeHtml(tag)}</span>`).join("");const readyCount=reading.pages.filter((page)=>page.available).length;return `
<article class="video-card" data-reading-card data-search="${escapeHtml(searchBlob(reading))}" data-type="${escapeHtml(reading.type)}" data-tags="${escapeHtml(reading.tags.map((tag)=>tag.toLowerCase()).join("||"))}" data-sort-date="${escapeHtml(reading.effective_sort_date||"")}" data-sequence="${reading.sequence}">
  <a class="card-link" href="${escapeHtml(targetHref)}">
    <div class="thumb">
      <img src="${escapeHtml(thumbHref)}" alt="${escapeHtml(reading.title)} 썸네일" />
      <span class="badge">${escapeHtml(reading.type_label)}</span>
      <span class="thumb-date">${escapeHtml(reading.display_date)}</span>
    </div>
    <div class="card-body">
      <div class="card-topline">
        <span class="status ${readyCount?"ready":"placeholder"}">${readyCount}/${reading.pages.length} 준비됨</span>
        <span class="chip">${escapeHtml(readingSequenceLabel(reading.sequence))}</span>
      </div>
      <h2 class="title">${escapeHtml(reading.title)}</h2>
      <p class="meta">${escapeHtml(reading.authors_label)}</p>
      <p class="meta">${escapeHtml(reading.subtitle)}</p>
      <p class="meta">${escapeHtml(reading.kind_label)} | ${escapeHtml(reading.language_label)} | ${escapeHtml(reading.year_label)}</p>
      <div class="chip-row">${tags}</div>
    </div>
  </a>
</article>
`;}).join("");const tagSelect=[`<option value="">전체 태그</option>`].concat(tagOptions.map((tag)=>`<option value="${escapeHtml(tag.toLowerCase())}">${escapeHtml(tag)}</option>`)).join("");const typeSelect=[`<option value="">전체 유형</option>`].concat(typeOptions.map((type)=>`<option value="${escapeHtml(type)}">${escapeHtml(typeLabel(type))}</option>`)).join("");const body=`
${siteHeader(siteMeta,outputPath)}
<main class="home-shell" data-page-kind="home">
  <section class="panel hero home-hero">
    <div>
      <span class="chip">날짜 기준 읽기 목록</span>
      <h1>${escapeHtml(siteMeta.title)}</h1>
      <p>${escapeHtml(siteMeta.description)}</p>
    </div>
    <div class="metric-row">
      <div class="metric"><p class="metric-label">기준 파일</p><p class="metric-value">manifest/readings.json</p></div>
      <div class="metric"><p class="metric-label">읽기 자료</p><p class="metric-value">${readings.length}개</p></div>
      <div class="metric"><p class="metric-label">생성 페이지</p><p class="metric-value">${readyPages}/${totalPages}</p></div>
      <div class="metric"><p class="metric-label">동작 방식</p><p class="metric-value">오프라인 전용</p></div>
    </div>
  </section>
  <section class="panel filter-panel" data-home-controls>
    <div class="filter-grid">
      <label class="field wide"><span>검색</span><input class="search-input" type="search" placeholder="제목, 부제, 저자, 태그 검색" data-reading-search /></label>
      <label class="field"><span>유형</span><select class="filter-select" data-reading-type>${typeSelect}</select></label>
      <label class="field"><span>태그</span><select class="filter-select" data-reading-tag>${tagSelect}</select></label>
      <label class="field"><span>정렬</span><select class="filter-select" data-reading-sort><option value="chronological">날짜순</option><option value="manifest">목록 순서</option></select></label>
    </div>
    <p class="meta">검색은 제목, 부제, 저자, 태그를 함께 대상으로 합니다. 날짜순 정렬은 <code>sort_date</code>, <code>reading_date</code>, <code>class_date</code> 순으로 값을 사용합니다.</p>
  </section>
  <section class="home-content">
    <aside class="panel home-side">
      <h2>읽기 현황</h2>
      <p class="meta">현재 로컬 매니페스트를 기준으로 카드와 페이지를 생성합니다. 날짜가 비어 있으면 UI에는 임시 표시만 노출합니다.</p>
      <div class="metric-stack">
        <div class="metric slim"><p class="metric-label">현재 표시</p><p class="metric-value" data-reading-counter>${readings.length}개 / 전체 ${readings.length}개</p></div>
        <div class="metric slim"><p class="metric-label">교재 장</p><p class="metric-value">${readings.filter((reading)=>reading.type==="chapter").length}</p></div>
        <div class="metric slim"><p class="metric-label">논문/기사</p><p class="metric-value">${readings.filter((reading)=>reading.type==="article"||reading.type==="paper").length}</p></div>
      </div>
      <p class="meta">태그는 매니페스트 값을 그대로 사용하며 오프라인에서도 필터링됩니다.</p>
    </aside>
    <div>
      <div class="section-head"><div><h2>읽기 라이브러리</h2><p class="meta">유튜브 스타일 카드 그리드에서 로컬 검색과 정렬을 바로 사용할 수 있습니다.</p></div></div>
      <div class="video-grid" data-reading-grid>${cards}</div>
      <section class="panel empty-state" data-empty-state hidden><h2>조건에 맞는 읽기 자료가 없습니다</h2><p>검색어, 유형, 태그 조건을 조정해 다시 확인해 주세요.</p></section>
    </div>
  </section>
  <p class="footer-note"><code>manifest/readings.json</code>과 <code>content/readings/&lt;slug&gt;/</code>를 기준으로 생성했습니다.</p>
</main>
`;writeText(outputPath,renderDocument(siteMeta,outputPath,siteMeta.title,body,siteMeta.description,'data-page-kind="home"',"ko"));}
function buildLanding(siteMeta,reading){const outputPath=path.join(siteDir,"readings",reading.slug,"index.html");const sourcePath=path.join(rootDir,reading.source_pdf);const sourceHref=relHref(outputPath,sourcePath);const sourceState=fs.existsSync(sourcePath)?"원문 PDF를 로컬에서 바로 열 수 있습니다.":"원문 PDF가 없어 임시 썸네일만 사용 중입니다.";const tags=reading.tags.map((tag)=>`<span class="chip">${escapeHtml(tag)}</span>`).join("");const pagesByKey=pageMap(reading.pages);const flowCards=FLOW_STEPS.map((step)=>renderFlowStep(outputPath,reading,pagesByKey,step)).join("");const summaryPage=pagesByKey.summary;const fullPage=pagesByKey.full;const translationPage=pagesByKey.translation;const actionLinks=[summaryPage?pageLink(outputPath,reading,summaryPage,"핵심 요약 열기"):"",fullPage?pageLink(outputPath,reading,fullPage,"전체 글 열기"):"",translationPage?pageLink(outputPath,reading,translationPage,"한국어 번역 열기"):"",`<a class="ghost-btn link-btn" href="${escapeHtml(sourceHref)}">원문 PDF 열기</a>`].filter(Boolean).join("");const quickJumpPages=["summary","full","translation","concepts","pitfalls","review-sheet","professor-prep"].map((key)=>pagesByKey[key]).filter(Boolean).map((page)=>`<a class="sub-link" href="${escapeHtml(relHref(outputPath,path.join(siteDir,"readings",reading.slug,page.filename)))}"><span>${escapeHtml(page.label)}</span><span>${escapeHtml(page.available?"바로 열기":"임시 안내")}</span></a>`).join("");const pageStatusLinks=reading.pages.map((page)=>`<a class="sub-link" href="${escapeHtml(relHref(outputPath,path.join(siteDir,"readings",reading.slug,page.filename)))}"><span>${escapeHtml(page.label)}</span><span>${escapeHtml(pageDetailText(page))}</span></a>`).join("");const body=`
${siteHeader(siteMeta,outputPath)}
<main class="reader-shell" data-reader-root data-reading-slug="${escapeHtml(reading.slug)}" data-page-key="index" data-page-path="${escapeHtml(path.posix.join("readings",reading.slug,"index.html"))}">
  <article class="article panel">
    <header class="article-header">
      <div class="article-header-top">
        <div>
          <p class="section-kicker">${escapeHtml(readingSequenceLabel(reading.sequence))}</p>
          <h1>${escapeHtml(reading.title)}</h1>
          <p>개요 | ${escapeHtml(reading.display_date)} | ${escapeHtml(reading.authors_label)}</p>
        </div>
        <span class="chip">개요</span>
      </div>
      ${pageTabs(outputPath,reading,"index")}
      ${readerToolbar()}
    </header>
    <section class="article-body overview-body" data-article-body>
      <section class="overview-section">
        <h2>빠른 시작</h2>
        <p>이 페이지는 이 읽기 자료의 학습 허브입니다. 아래 흐름대로 이동하면 핵심 요약부터 퀴즈, 시험 직전 정리, 수업 대비까지 같은 레이아웃 안에서 이어서 볼 수 있습니다.</p>
        <div class="action-row">${actionLinks}</div>
      </section>
      <section class="overview-section">
        <h2>읽기 정보</h2>
        <div class="metric-row">
          <div class="metric"><p class="metric-label">언어</p><p class="metric-value">${escapeHtml(reading.language_label)}</p></div>
          <div class="metric"><p class="metric-label">유형</p><p class="metric-value">${escapeHtml(reading.type_label)}</p></div>
          <div class="metric"><p class="metric-label">날짜</p><p class="metric-value">${escapeHtml(reading.display_date)}</p></div>
          <div class="metric"><p class="metric-label">저자</p><p class="metric-value">${escapeHtml(reading.authors_label)}</p></div>
        </div>
        <p class="meta">${escapeHtml(reading.description)}</p>
        <p class="meta">${metadataStatusHtml(reading.metadata_status)}</p>
        <div class="chip-row">${tags}</div>
      </section>
      <section class="overview-section">
        <h2>학습 순서</h2>
        <p>추천 순서: ${escapeHtml(studyOrderText(reading))}</p>
        <div class="study-flow-grid">${flowCards}</div>
      </section>
      <section class="overview-section">
        <h2>페이지 현황</h2>
        <p class="meta">각 링크는 콘텐츠가 아직 비어 있어도 항상 열리며, 비어 있는 경우에는 임시 안내 페이지를 보여 줍니다.</p>
        <div class="sub-link-list overview-link-list">${pageStatusLinks}</div>
      </section>
      <section class="overview-section">
        <h2>읽기 맥락</h2>
        <p class="meta">${escapeHtml(reading.source_filename)}</p>
        <p class="meta">${escapeHtml(reading.source_pdf)}</p>
        <p class="meta">${escapeHtml(sourceState)}</p>
        ${metadataNotesHtml(reading)}
      </section>
    </section>
  </article>
  <aside class="reader-aside">
    <section class="panel side-panel"><h2>목차</h2><nav class="toc-list" data-generated-toc></nav></section>
    <section class="panel side-panel"><h2>중요 표시</h2><div class="important-list" data-important-list></div></section>
    <section class="panel side-panel"><h2>바로 이동</h2><p class="meta">가장 자주 여는 페이지를 바로 이동합니다.</p><div class="sub-link-list">${quickJumpPages}</div></section>
    <section class="panel side-panel"><h2>원문 자료</h2><p class="meta">${escapeHtml(sourceState)}</p><p><a class="ghost-btn link-btn" href="${escapeHtml(sourceHref)}">원문 PDF 열기</a></p></section>
  </aside>
</main>
`;writeText(outputPath,renderDocument(siteMeta,outputPath,reading.title,body,reading.description,'data-page-kind="landing"',reading.language==="en"?"en":"ko"));}
function buildArticle(siteMeta,reading,page){const outputPath=path.join(siteDir,"readings",reading.slug,page.filename);const text=loadMarkdown(page.sourcePath);const content=text?markdownToHtml(text):placeholderArticleHtml(reading,page,page.sourcePath);const pagePath=path.posix.join("readings",reading.slug,page.filename);const body=`
${siteHeader(siteMeta,outputPath)}
<main class="reader-shell" data-reader-root data-reading-slug="${escapeHtml(reading.slug)}" data-page-key="${escapeHtml(page.key)}" data-page-path="${escapeHtml(pagePath)}">
  <article class="article panel">
    <header class="article-header">
      <div class="article-header-top">
        <div>
          <p class="section-kicker">${escapeHtml(readingSequenceLabel(reading.sequence))}</p>
          <h1>${escapeHtml(reading.title)}</h1>
          <p>${escapeHtml(page.label)} | ${escapeHtml(reading.display_date)} | ${escapeHtml(reading.authors_label)}</p>
        </div>
        <span class="chip">${escapeHtml(page.label)}</span>
      </div>
      ${pageTabs(outputPath,reading,page.key)}
      ${readerToolbar()}
    </header>
    <section class="article-body" data-article-body>${content}</section>
  </article>
  <aside class="reader-aside">
    <section class="panel side-panel"><h2>목차</h2><nav class="toc-list" data-generated-toc></nav></section>
    <section class="panel side-panel"><h2>중요 표시</h2><div class="important-list" data-important-list></div></section>
    <section class="panel side-panel"><h2>학습 흐름</h2><p class="meta">전체 순서를 다시 확인하려면 개요 페이지로 돌아가세요.</p><p><a class="ghost-btn link-btn" href="${escapeHtml(relHref(outputPath,path.join(siteDir,"readings",reading.slug,"index.html")))}">개요로 돌아가기</a></p></section>
  </aside>
</main>
`;writeText(outputPath,renderDocument(siteMeta,outputPath,`${reading.title} - ${page.label}`,body,reading.description,'data-page-kind="article"',page.key==="full"&&reading.language==="en"?"en":"ko"));}
function renderStandardQuizCard(item,index){const optionsHtml=item.options&&item.options.length?`<ol class="choices">${item.options.map((option)=>`<li>${renderInline(option)}</li>`).join("")}</ol>`:"";const sourceHtml=item.source?`<p><strong>출처:</strong> ${renderInline(item.source)}</p>`:"";return `
<article class="quiz-card">
  <h3>${index+1}. ${renderInline(item.prompt)}</h3>
  ${optionsHtml}
  <details class="answer">
    <summary>정답 보기</summary>
    <p><strong>정답:</strong> ${renderInline(item.answer)}</p>
    <p><strong>해설:</strong> ${renderInline(item.explanation)}</p>
    ${sourceHtml}
  </details>
</article>
`;}
function renderShortAnswerQuizCard(item,index){const answers=item.accepted_answers.map((answer)=>renderInline(answer)).join(" / ");const sourceHtml=item.source?`<p><strong>출처:</strong> ${renderInline(item.source)}</p>`:"";return `
<article class="quiz-card short-answer-card">
  <div class="quiz-card-head">
    <h3>${index+1}. ${renderInline(item.question)}</h3>
    <span class="chip">${escapeHtml(SHORT_ANSWER_TYPE_LABELS[item.answer_type]||item.answer_type)}</span>
  </div>
  <p class="meta">한 단어, 이름, 숫자, 또는 8단어 미만의 짧은 구로 답하세요.</p>
  <details class="answer">
    <summary>정답 보기</summary>
    <p><strong>허용 정답:</strong> ${answers}</p>
    <p><strong>답 유형:</strong> ${escapeHtml(SHORT_ANSWER_TYPE_LABELS[item.answer_type]||item.answer_type)}</p>
    <p><strong>해설:</strong> ${renderInline(item.explanation)}</p>
    ${sourceHtml}
  </details>
</article>
`;}
function buildQuiz(siteMeta,reading,page){const outputPath=path.join(siteDir,"readings",reading.slug,page.filename);const quiz=loadQuiz(page,page.sourcePath);let content="";if(!quiz){content=placeholderQuizHtml(page,page.sourcePath);}else{const cards=quiz.items.map((item,index)=>page.key==="quiz-short"?renderShortAnswerQuizCard(item,index):renderStandardQuizCard(item,index)).join("");content=`<section class="panel quiz-intro"><h2>${escapeHtml(quiz.title||page.label)}</h2><p class="meta">${escapeHtml(quiz.instructions||"")}</p><p class="meta">${quiz.items.length}문항</p></section><section class="quiz-list">${cards}</section>`;}const body=`
${siteHeader(siteMeta,outputPath)}
<main class="quiz-shell">
  <article class="article panel">
    <header class="article-header">
      <div class="article-header-top">
        <div>
          <p class="section-kicker">${escapeHtml(readingSequenceLabel(reading.sequence))}</p>
          <h1>${escapeHtml(reading.title)}</h1>
          <p>${escapeHtml(page.label)} | ${escapeHtml(reading.display_date)} | ${escapeHtml(reading.authors_label)}</p>
        </div>
        <span class="chip">퀴즈</span>
      </div>
      ${pageTabs(outputPath,reading,page.key)}
    </header>
    <section class="article-body">${content}</section>
  </article>
</main>
`;writeText(outputPath,renderDocument(siteMeta,outputPath,`${reading.title} - ${page.label}`,body,reading.description,'data-page-kind="quiz"',"ko"));}
function renderProfessorPrepCard(card,index){const cardId=`prep-card-${index+1}`;const answerPanels=["10s","30s","60s"].map((level)=>`<div class="prep-answer-copy" data-prep-answer="${level}" ${level==="30s"?"":"hidden"}><p>${renderInline(card[`answer_${level}`])}</p></div>`).join("");const followupStore=card.followup_answers.map((entry)=>`<div data-followup-item data-question="${escapeHtml(entry.question)}" data-answer="${escapeHtml(entry.answer)}"></div>`).join("");return `
<article class="panel prep-card" id="${escapeHtml(cardId)}" data-prep-card data-card-id="${escapeHtml(cardId)}">
  <div class="prep-card-head">
    <div>
      <p class="section-kicker">구술 카드 ${String(index+1).padStart(2,"0")}</p>
      <h2>Q. ${renderInline(card.question)}</h2>
    </div>
    <button class="ghost-btn link-btn prep-difficult-btn" type="button" data-prep-difficult>어려움 표시</button>
  </div>
  <section class="prep-answer-shell" data-prep-answer-shell hidden>
    <p class="prep-answer-label">모범답안</p>
    ${answerPanels}
  </section>
  <div class="prep-detail-grid">
    <section class="prep-block">
      <h3>반드시 넣을 키워드</h3>
      ${renderChipRow(card.must_include_keywords,"chip-row prep-keywords")}
    </section>
    <section class="prep-block">
      <h3>읽기 근거</h3>
      ${renderList(card.evidence_from_reading)}
    </section>
    <section class="prep-block prep-followup-block">
      <div class="prep-block-head">
        <h3>예상 꼬리질문</h3>
        <button class="reader-btn prep-mini-btn" type="button" data-prep-reroll hidden>다른 질문</button>
      </div>
      <ul class="prep-followup-list" data-prep-followup-list>${card.likely_followups.map((item)=>`<li>${renderInline(item)}</li>`).join("")}</ul>
      <div class="prep-random-box" data-prep-random-box hidden>
        <p class="prep-random-label">랜덤 꼬리질문</p>
        <p class="prep-random-question" data-prep-random-question></p>
        <p class="prep-random-answer" data-prep-random-answer></p>
      </div>
      <div hidden>${followupStore}</div>
    </section>
    <section class="prep-block">
      <h3>한국 맥락 연결</h3>
      <p>${renderInline(card.korean_context_link)}</p>
    </section>
    <section class="prep-block">
      <h3>내 경험 연결 힌트</h3>
      <p>${renderInline(card.personal_connection_hint)}</p>
    </section>
    <section class="prep-block">
      <h3>피해야 할 답</h3>
      ${renderList(card.avoid_bad_answers)}
    </section>
  </div>
</article>
`;}
function buildProfessorPrep(siteMeta,reading,page){const outputPath=path.join(siteDir,"readings",reading.slug,page.filename);const prep=loadProfessorPrep(page.sourcePath);const pagePath=path.posix.join("readings",reading.slug,page.filename);const content=prep?`
<section class="panel prep-intro">
  <h2>${escapeHtml(prep.title||page.label)}</h2>
  <p class="meta">${escapeHtml(prep.instructions)}</p>
  <p class="meta">${prep.cards.length}개 카드 | 공통 꼬리질문 ${prep.followup_bank.length}개</p>
  <div class="prep-toolbar" role="toolbar" aria-label="구술 대비 조절">
    <div class="toolbar-group">
      <button class="reader-btn" type="button" data-prep-level="10s">10초</button>
      <button class="reader-btn is-active" type="button" data-prep-level="30s">30초</button>
      <button class="reader-btn" type="button" data-prep-level="60s">60초</button>
    </div>
    <div class="toolbar-group">
      <button class="reader-btn" type="button" data-prep-answer-toggle>모범답안 보기</button>
      <button class="reader-btn" type="button" data-prep-random-toggle>랜덤 꼬리질문 켜기</button>
    </div>
    <p class="reader-note" data-prep-status>먼저 질문에 직접 답한 뒤 모범답안을 확인하세요.</p>
  </div>
  <div class="prep-style-grid">
    <section class="prep-style-card">
      <h3>교수님이 좋아하는 답</h3>
      ${renderList(PROFESSOR_STYLE.prefers)}
    </section>
    <section class="prep-style-card">
      <h3>피해야 할 답</h3>
      ${renderList(PROFESSOR_STYLE.avoids)}
    </section>
    <section class="prep-style-card">
      <h3>공통 꼬리질문</h3>
      ${renderList(prep.followup_bank)}
    </section>
  </div>
</section>
<section class="prep-card-list">
  ${prep.cards.map((card,index)=>renderProfessorPrepCard(card,index)).join("")}
</section>
`:placeholderProfessorPrepHtml(page,page.sourcePath);const body=`
${siteHeader(siteMeta,outputPath)}
<main class="reader-shell" data-reader-root data-reading-slug="${escapeHtml(reading.slug)}" data-page-key="${escapeHtml(page.key)}" data-page-path="${escapeHtml(pagePath)}">
  <article class="article panel">
    <header class="article-header">
      <div class="article-header-top">
        <div>
          <p class="section-kicker">${escapeHtml(readingSequenceLabel(reading.sequence))}</p>
          <h1>${escapeHtml(reading.title)}</h1>
          <p>${escapeHtml(page.label)} | ${escapeHtml(reading.display_date)} | ${escapeHtml(reading.authors_label)}</p>
        </div>
        <span class="chip">${escapeHtml(page.label)}</span>
      </div>
      ${pageTabs(outputPath,reading,page.key)}
      ${readerToolbar()}
    </header>
    <section class="article-body prep-body" data-article-body data-prep-root>${content}</section>
  </article>
  <aside class="reader-aside">
    <section class="panel side-panel"><h2>목차</h2><nav class="toc-list" data-generated-toc></nav></section>
    <section class="panel side-panel"><h2>어려운 카드</h2><div class="important-list" data-prep-difficult-list></div></section>
    <section class="panel side-panel"><h2>중요 표시</h2><div class="important-list" data-important-list></div></section>
    <section class="panel side-panel"><h2>학습 흐름</h2><p class="meta">전체 순서를 다시 확인하려면 개요 페이지로 돌아가세요.</p><p><a class="ghost-btn link-btn" href="${escapeHtml(relHref(outputPath,path.join(siteDir,"readings",reading.slug,"index.html")))}">개요로 돌아가기</a></p></section>
  </aside>
</main>
`;writeText(outputPath,renderDocument(siteMeta,outputPath,`${reading.title} - ${page.label}`,body,reading.description,'data-page-kind="prep"',"ko"));}
function writeAssets(){writeText(path.join(siteDir,"assets","styles.css"),readText(styleSource));writeText(path.join(siteDir,"assets","app.js"),readText(appSource));}
function parseArgs(){const slugIndex=process.argv.indexOf("--slug");return{slug:slugIndex!==-1?process.argv[slugIndex+1]:null};}
function buildPage(siteMeta,reading,page){if(page.type==="article"){buildArticle(siteMeta,reading,page);return;}if(page.type==="professor-prep"){buildProfessorPrep(siteMeta,reading,page);return;}buildQuiz(siteMeta,reading,page);}
function buildSite(options={}){const manifest=loadManifest();ensureContentPlaceholders(manifest);const siteMeta=manifest.site;const readings=prepareReadings(manifest);if(options.slug){const target=readings.find((reading)=>reading.slug===options.slug);if(!target)throw new Error(`Unknown slug: ${options.slug}`);fs.mkdirSync(siteDir,{recursive:true});const thumbnails=buildThumbnails(manifest);writeAssets();buildIndex(siteMeta,readings,thumbnails);const readingDir=path.join(siteDir,"readings",target.slug);if(fs.existsSync(readingDir))fs.rmSync(readingDir,{recursive:true,force:true});buildLanding(siteMeta,target);for(const page of target.pages){buildPage(siteMeta,target,page);}return;}if(fs.existsSync(siteDir))fs.rmSync(siteDir,{recursive:true,force:true});const thumbnails=buildThumbnails(manifest);writeAssets();buildIndex(siteMeta,readings,thumbnails);for(const reading of readings){buildLanding(siteMeta,reading);for(const page of reading.pages){buildPage(siteMeta,reading,page);}}}
const options=parseArgs();
buildSite(options);
console.log(options.slug?`[built] reading ${options.slug} + home`:"[built] docs" );













