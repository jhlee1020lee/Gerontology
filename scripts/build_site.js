const fs=require("fs");
const path=require("path");

const rootDir=path.resolve(__dirname,"..");
const manifestPath=path.join(rootDir,"manifest","readings.json");
const siteDir=path.join(rootDir,"docs");
const styleSource=path.join(__dirname,"site_styles.css");
const appSource=path.join(__dirname,"site_app.js");
const brandLogoSource=path.join(__dirname,"assets","branding","snu.png");
const LANDING_TAB_LABEL="설명 영상";
const NOTEBOOKLM_VIDEO_CANDIDATES=["notebooklm.mp4","notebooklm.webm","notebooklm.mov","notebooklm.m4v"];

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
  {key:"professor-prep",label:"읽기 답변 준비",filename:"professor-prep.html",type:"professor-prep",description:"이 글을 어떻게 읽었는지 바로 말할 수 있도록 답변을 정리하는 페이지입니다."}
];

const FLOW_STEPS=[
  {step:1,mode:"page",key:"summary",title:"핵심 요약",blurb:"먼저 큰 흐름을 잡고 읽기 전체의 프레임을 세웁니다."},
  {step:2,mode:"page",key:"full",title:"전체 글",blurb:"핵심 요약 이후 본문을 차분하게 읽습니다."},
  {step:3,mode:"page",key:"translation",title:"한국어 번역",blurb:"영문 읽기 자료라면 번역 페이지로 다시 한 번 구조를 확인합니다.",optional:true},
  {step:4,mode:"page",key:"concepts",title:"핵심 개념",blurb:"수업과 시험에 자주 나오는 개념과 용어를 정리합니다."},
  {step:5,mode:"page",key:"pitfalls",title:"헷갈리는 포인트",blurb:"비슷해 보여 헷갈리기 쉬운 구분을 다시 점검합니다."},
  {step:6,mode:"quiz-group",title:"퀴즈",blurb:"OX, 단답형, 객관식으로 기억과 이해를 확인합니다.",keys:["quiz-ox","quiz-short","quiz-mcq"]},
  {step:7,mode:"page",key:"review-sheet",title:"시험 직전 정리",blurb:"시험 직전에 마지막으로 훑을 압축 정리를 확인합니다."},
  {step:8,mode:"page",key:"professor-prep",title:"읽기 답변 준비",blurb:"이 글을 어떻게 읽었는지 자연스럽게 말할 수 있도록 답변을 준비합니다."}
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
const SYLLABUS_HOME_ORDER=[
  "[CH1]Gerontology.pdf",
  "[CH2]Gerontology.pdf",
  "Beck, 2016.pdf",
  "[CH3]Gerontology.pdf",
  "[CH4]Gerontology.pdf",
  "Hülür et al., 2019.pdf",
  "[CH5]Gerontology.pdf",
  "Olshansky & Carnes, 2019.pdf",
  "Kerrigan, 2018.pdf",
  "[CH6]Gerontology.pdf",
  "Park & McDonough, 2013.pdf",
  "[CH7]Gerontology.pdf",
  "Wagner et al., 2016.pdf",
  "[CH8]Gerontology.pdf",
  "Suitor et al., 2014.pdf",
  "[CH9]Gerontology.pdf",
  "[CH10]Gerontology.pdf",
  "Blieszner, 2014.pdf",
  "[CH11]Gerontology.pdf",
  "Calvo et al., 2018.pdf",
  "[CH12]Gerontology.pdf",
  "Leggett et al., 2020.pdf",
  "[CH13]Gerontology.pdf",
  "Konrath et al., 2012.pdf",
  "[CH14]Gerontology.pdf",
  "[CH15]Gerontology.pdf",
  "Carr & Fang, 2021.pdf"
];
const PREP_EXTRA_VARIANTS=["importance","korea","limit","evidence"];
const PREP_TARGET_CARD_COUNT=12;

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
  let codeLines=null;

  const flushParagraph=()=>{if(paragraph.length){parts.push(`<p>${renderInline(paragraph.join(" ").trim())}</p>`);paragraph=[];}};
  const flushList=()=>{if(listItems.length){parts.push(`<ul>${listItems.map((item)=>`<li>${renderInline(item)}</li>`).join("")}</ul>`);listItems=[];}};
  const flushQuote=()=>{if(quoteLines.length){parts.push(`<blockquote>${renderInline(quoteLines.join(" ").trim())}</blockquote>`);quoteLines=[];}};
  const flushCode=()=>{if(codeLines){parts.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);codeLines=null;}};

  for(const rawLine of lines){
    if(codeLines){
      if(rawLine.trim().startsWith("```")){flushCode();continue;}
      codeLines.push(rawLine);
      continue;
    }
    const line=rawLine.trim();
    if(!line){flushParagraph();flushList();flushQuote();continue;}
    if(line===">"){flushParagraph();flushList();flushQuote();continue;}
    if(line.startsWith("```")){flushParagraph();flushList();flushQuote();codeLines=[];continue;}
    if(line.startsWith("#### ")){flushParagraph();flushList();flushQuote();parts.push(`<h4>${renderInline(line.slice(5))}</h4>`);continue;}
    if(line.startsWith("### ")){flushParagraph();flushList();flushQuote();parts.push(`<h3>${renderInline(line.slice(4))}</h3>`);continue;}
    if(line.startsWith("## ")){flushParagraph();flushList();flushQuote();parts.push(`<h2>${renderInline(line.slice(3))}</h2>`);continue;}
    if(line.startsWith("# ")){flushParagraph();flushList();flushQuote();parts.push(`<h1>${renderInline(line.slice(2))}</h1>`);continue;}
    if(line.startsWith("- ")){flushParagraph();flushQuote();listItems.push(line.slice(2).trim());continue;}
    if(line.startsWith("> ")){flushParagraph();flushList();quoteLines.push(line.slice(2).trim());continue;}
    flushList();flushQuote();paragraph.push(line);
  }

  flushParagraph();flushList();flushQuote();flushCode();
  return parts.join("\n");
}

function loadMarkdown(filePath){if(!fs.existsSync(filePath))return null;const text=readText(filePath).trim();return text||null;}
function loadJson(filePath){if(!fs.existsSync(filePath))return null;return JSON.parse(readText(filePath));}
function fileLabel(filePath){return path.relative(rootDir,filePath).split(path.sep).join("/");}
function toText(value){return typeof value==="string"?value.trim():"";}
function textArray(value){return(Array.isArray(value)?value:[value]).map((item)=>toText(item)).filter(Boolean);}
function wordCount(value){return toText(value).split(/\s+/).filter(Boolean).length;}
function truncateWords(value,maxWords){const words=toText(value).replace(/\s+/g," ").split(" ").filter(Boolean);if(words.length<=maxWords)return words.join(" ");return `${words.slice(0,maxWords).join(" ")}…`;}
function sentenceList(value){return toText(value).replace(/\s+/g," ").split(/(?<=[.!?])\s+/).map((item)=>item.trim()).filter(Boolean);}
function cleanQuestionLabel(value){return toText(value).replace(/[?？]\s*$/,"");}
function requireText(value,label,filePath){const text=toText(value);if(!text)throw new Error(`[invalid] ${fileLabel(filePath)}: ${label} is required`);return text;}
function loadQuiz(page,filePath){const payload=loadJson(filePath);if(!payload)return null;const items=Array.isArray(payload.items)?payload.items:[];if(!items.length)return null;if(page.key==="quiz-short"){if(items.length!==15)throw new Error(`[invalid] ${fileLabel(filePath)}: quiz_short.json must contain exactly 15 items`);const normalizedItems=items.map((item,index)=>{const question=requireText(item.question,`items[${index}].question`,filePath);const accepted_answers=textArray(item.accepted_answers);const answer_type=requireText(item.answer_type,`items[${index}].answer_type`,filePath);const explanation=requireText(item.explanation,`items[${index}].explanation`,filePath);const source=toText(item.source);if(!accepted_answers.length)throw new Error(`[invalid] ${fileLabel(filePath)}: items[${index}].accepted_answers must be a non-empty array`);if(!SHORT_ANSWER_TYPES.has(answer_type))throw new Error(`[invalid] ${fileLabel(filePath)}: items[${index}].answer_type must be one of ${Array.from(SHORT_ANSWER_TYPES).join(", ")}`);accepted_answers.forEach((answer,answerIndex)=>{if(wordCount(answer)>7)throw new Error(`[invalid] ${fileLabel(filePath)}: items[${index}].accepted_answers[${answerIndex}] must stay under 8 words`);});return{question,accepted_answers,answer_type,explanation,source};});return{...payload,items:normalizedItems};}const normalizedItems=items.map((item,index)=>{const prompt=requireText(item.prompt,`items[${index}].prompt`,filePath);const answer=requireText(item.answer,`items[${index}].answer`,filePath);const explanation=requireText(item.explanation,`items[${index}].explanation`,filePath);const options=Array.isArray(item.options)?item.options.map((option)=>toText(option)).filter(Boolean):[];const source=toText(item.source);return{prompt,answer,explanation,options,source};});return{...payload,items:normalizedItems};}
function loadProfessorPrep(filePath){const payload=loadJson(filePath);if(!payload)return null;const cards=Array.isArray(payload.cards)?payload.cards:[];if(!cards.length)return null;const normalizedCards=cards.map((card,index)=>{if(!card||typeof card!=="object")throw new Error(`[invalid] ${fileLabel(filePath)}: cards[${index}] must be an object`);const fallbackTitle=cleanQuestionLabel(card.question);const title=requireText(card.title||fallbackTitle,`cards[${index}].title`,filePath);const answer_30s=requireText(card.answer_30s||card.answer||card.model_answer,`cards[${index}].answer_30s`,filePath);return{title,answer_30s};});return{title:toText(payload.title)||"읽기 답변 준비",instructions:toText(payload.instructions)||"모든 답변은 '이 글을 어떻게 읽었는지'에 초점을 맞춘 30초 모델 답변입니다.",cards:normalizedCards};}
function translateCommonText(text){return COMMON_TEXT_MAP[text]||text;}
function loadReadingMeta(contentDir){const metaPath=path.join(rootDir,contentDir,"meta.json");const payload=loadJson(metaPath);return payload&&typeof payload==="object"?payload:{};}
function detectNotebooklmVideoSource(contentDir){const baseDir=path.join(rootDir,contentDir);for(const filename of NOTEBOOKLM_VIDEO_CANDIDATES){const candidate=path.join(baseDir,filename);if(fs.existsSync(candidate))return candidate;}return"";}
function publicNotebooklmVideoPath(reading,sourcePath){if(!sourcePath)return"";return path.posix.join("assets","videos",reading.slug,path.basename(sourcePath));}
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
function syllabusOrderIndex(reading){const index=SYLLABUS_HOME_ORDER.indexOf(reading.source_filename||"");return index===-1?Number.MAX_SAFE_INTEGER:index;}
function statusKeyForPage(pageKey){return pageKey.replace(/-/g,"_");}
function contentPath(reading,page){const contentDir=path.join(rootDir,reading.content_dir);if(page.key==="full"){const preferred=path.join(contentDir,"full.md");const fallback=path.join(contentDir,"cleaned.md");return fs.existsSync(preferred)?preferred:(fs.existsSync(fallback)?fallback:preferred);}if(page.key==="quiz-short")return path.join(contentDir,"quiz_short.json");if(page.key==="professor-prep")return path.join(contentDir,"professor_prep.json");if(page.type==="article")return path.join(contentDir,`${page.key}.md`);return path.join(contentDir,`${page.key}.json`);}
function pageState(reading,page){const sourcePath=contentPath(reading,page);if(page.type==="article")return{sourcePath,available:Boolean(loadMarkdown(sourcePath)),count:null};if(page.type==="professor-prep"){const prep=loadProfessorPrep(sourcePath);return{sourcePath,available:Boolean(prep),count:prep?prep.cards.length:0};}const quiz=loadQuiz(page,sourcePath);return{sourcePath,available:Boolean(quiz),count:quiz?quiz.items.length:0};}
function metadataStatusHtml(status){return status==="complete"?'<span class="status ready">메타데이터 확인됨</span>':'<span class="status placeholder">메타데이터 확인 필요</span>';}
function normalizeReading(reading,sequence){const supplemental=loadReadingMeta(reading.content_dir);const localNotebooklmVideo=detectNotebooklmVideoSource(reading.content_dir);const language=reading.language||"unknown";const type=detectType(reading);const rawTags=Array.isArray(reading.tags)&&reading.tags.length?reading.tags:["Metadata incomplete"];const source_filename=reading.source_filename||path.basename(reading.source_pdf);const sortDate=effectiveSortDate(reading);const classroom_points=(Array.isArray(reading.classroom_points)?reading.classroom_points:[]).map((item)=>translateCommonText(item)).filter(Boolean);return{...reading,sequence,subtitle:translateCommonText(reading.subtitle||"Filename-derived placeholder metadata."),authors:reading.authors||[],authors_label:authorsLabel(reading.authors||[]),year_label:yearLabel(reading.year),language,language_label:languageLabel(language),kind:reading.kind||`${type} pdf`,kind_label:kindLabel(reading.kind||`${type} pdf`,type),type,type_label:typeLabel(type),source_filename,tags:rawTags.map(translateTag),description:translateCommonText(reading.description||"Placeholder record created from the source filename only."),metadata_status:reading.metadata_status||"incomplete",metadata_notes:(reading.metadata_notes||[]).map(translateCommonText),class_date:reading.class_date??null,reading_date:reading.reading_date??null,sort_date:reading.sort_date??null,display_date_label:reading.display_date_label??null,effective_sort_date:sortDate,display_date:displayDateLabel(reading),translation_required:language==="en",home_order_index:syllabusOrderIndex({source_filename}),public_pdf:toText(reading.public_pdf)||"",overview_hook:translateCommonText(reading.overview_hook||""),classroom_points,notebooklm_video_source:localNotebooklmVideo,notebooklm_video_url:toText(reading.notebooklm_video_url||supplemental.notebooklm_video_url||publicNotebooklmVideoPath(reading,localNotebooklmVideo)||""),notebooklm_video_note:toText(reading.notebooklm_video_note||supplemental.notebooklm_video_note||""),notebooklm_video_poster:toText(reading.notebooklm_video_poster||supplemental.notebooklm_video_poster||"")};}
function buildContentStatus(reading){const contentStatus={};for(const page of PAGE_DEFS){const key=statusKeyForPage(page.key);if(page.englishOnly&&reading.language!=="en"){contentStatus[key]="not_applicable";continue;}const state=pageState(reading,page);contentStatus[key]=state.available?"ready":"missing";}return contentStatus;}
function ensureContentPlaceholders(manifest,slugFilter=null){manifest.readings.forEach((rawReading,index)=>{const reading=normalizeReading(rawReading,index+1);if(slugFilter&&reading.slug!==slugFilter)return;const contentDir=path.join(rootDir,reading.content_dir);fs.mkdirSync(contentDir,{recursive:true});const metaPath=path.join(contentDir,"meta.json");let existing={};if(fs.existsSync(metaPath)){try{existing=JSON.parse(readText(metaPath));}catch(error){existing={};}}const payload={...existing,slug:reading.slug,source_filename:reading.source_filename,source_pdf:reading.source_pdf,content_dir:reading.content_dir,title:reading.title,subtitle:reading.subtitle,authors:reading.authors,year:reading.year??null,language:reading.language,type:reading.type,kind:reading.kind,class_date:reading.class_date,reading_date:reading.reading_date,sort_date:reading.sort_date,display_date_label:reading.display_date_label,description:reading.description,metadata_status:reading.metadata_status,metadata_notes:reading.metadata_notes,public_pdf:reading.public_pdf||null,overview_hook:reading.overview_hook||null,classroom_points:reading.classroom_points||[],notebooklm_video_url:reading.notebooklm_video_url||null,notebooklm_video_note:reading.notebooklm_video_note||null,notebooklm_video_poster:reading.notebooklm_video_poster||null,content_status:buildContentStatus(reading)};writeText(metaPath,`${JSON.stringify(payload,null,2)}\n`);});}
function prepareReadings(manifest){return manifest.readings.map((rawReading,index)=>{const reading=normalizeReading(rawReading,index+1);const pages=PAGE_DEFS.filter((page)=>!(page.englishOnly&&reading.language!=="en")).map((page)=>({...page,...pageState(reading,page)}));return{...reading,pages};});}
function compareReadings(a,b,mode){if(mode==="chronological"){const aHasDate=Boolean(a.effective_sort_date);const bHasDate=Boolean(b.effective_sort_date);if(aHasDate&&bHasDate&&a.effective_sort_date!==b.effective_sort_date)return a.effective_sort_date.localeCompare(b.effective_sort_date);if(aHasDate!==bHasDate)return aHasDate?-1:1;if(a.home_order_index!==b.home_order_index)return a.home_order_index-b.home_order_index;}return a.sequence-b.sequence;}
function searchBlob(reading){return[reading.slug,reading.title,reading.subtitle,reading.source_filename,reading.language,reading.type,reading.kind,reading.year_label,reading.display_date,...(reading.authors||[]),...(reading.tags||[]),...(reading.metadata_notes||[])].filter(Boolean).join(" ");}
function buildTagOptions(readings){return Array.from(new Set(readings.flatMap((reading)=>reading.tags||[]).filter(Boolean))).sort((a,b)=>a.localeCompare(b,"ko"));}
function statusHtml(available){return `<span class="status ${available?"ready":"placeholder"}">${available?"준비됨":"임시 안내"}</span>`;}
function readingSequenceLabel(sequence){return `읽기 ${String(sequence).padStart(2,"0")}`;}
function studyOrderText(reading){const steps=[LANDING_TAB_LABEL,"전체 글"];if(reading.translation_required)steps.push("한국어 번역");steps.push("읽기 답변 준비");return steps.join(" -> ");}
function actionIntroText(reading){if(reading.translation_required)return"이 글은 핵심 요약으로 큰 흐름을 먼저 잡고, 전체 글과 한국어 번역을 오가며 원문 구조와 핵심 용어를 다시 확인하면 가장 안정적으로 읽힙니다.";if(reading.type==="paper")return"이 글은 핵심 요약으로 큰 흐름을 먼저 잡고, 전체 글을 따라가며 논문의 질문, 방법, 결과를 다시 확인하면 가장 안정적으로 읽힙니다.";return"이 글은 핵심 요약으로 큰 흐름을 먼저 잡고, 전체 글을 따라가며 장의 구조와 핵심 개념을 다시 확인하면 가장 안정적으로 읽힙니다.";}
function publicPdfTargetPath(reading){if(!reading.public_pdf)return"";return path.join(siteDir,...reading.public_pdf.split("/"));}
function pdfHref(outputPath,reading){if(reading.public_pdf){return relHref(outputPath,publicPdfTargetPath(reading));}const sourcePath=path.join(rootDir,reading.source_pdf);return fs.existsSync(sourcePath)?relHref(outputPath,sourcePath):"";}
function pdfStatusText(reading){if(reading.public_pdf&&fs.existsSync(path.join(rootDir,reading.source_pdf)))return"배포용 원문 PDF를 바로 열거나 내려받을 수 있습니다.";const sourcePath=path.join(rootDir,reading.source_pdf);return fs.existsSync(sourcePath)?"원문 PDF를 로컬에서 바로 열 수 있습니다.":"원문 PDF가 없어 임시 썸네일만 사용 중입니다.";}
function renderPdfActions(outputPath,reading,className="pdf-actions"){const href=pdfHref(outputPath,reading);if(!href)return"";return`<div class="${escapeHtml(className)}"><a class="ghost-btn link-btn pdf-btn" href="${escapeHtml(href)}" target="_blank" rel="noopener">원문 PDF 보기</a><a class="ghost-btn link-btn pdf-btn" href="${escapeHtml(href)}" download>PDF 다운로드</a></div>`;}
function isExternalUrl(value){return /^https?:\/\//i.test(toText(value));}
function resolveSiteAssetHref(outputPath,value){const text=toText(value);if(!text)return"";if(isExternalUrl(text))return text;const normalized=text.replace(/^\.?\//,"");return relHref(outputPath,path.join(siteDir,...normalized.split("/")));}
function toEmbedUrl(value){const text=toText(value);if(!text)return"";try{const url=new URL(text);if(url.hostname.includes("youtu.be")){const id=url.pathname.replace(/^\/+/,"").split("/")[0];return id?`https://www.youtube.com/embed/${id}`:text;}if(url.hostname.includes("youtube.com")&&url.searchParams.get("v"))return `https://www.youtube.com/embed/${url.searchParams.get("v")}`;return text;}catch(error){return text;}}
function isDirectVideoFile(value){return /\.(mp4|webm|ogg)(\?.*)?$/i.test(toText(value));}
function renderNotebookLmVideo(outputPath,reading){const rawUrl=reading.notebooklm_video_url;if(!rawUrl)return `<div class="video-placeholder"><div><p class="section-kicker">NotebookLM 설명영상</p><h2>영상 준비 중</h2><p class="meta"><code>content/readings/${escapeHtml(reading.slug)}/meta.json</code>에 <code>notebooklm_video_url</code>을 넣으면 이 자리에 바로 표시됩니다.</p></div></div>`;const href=resolveSiteAssetHref(outputPath,rawUrl);if(isDirectVideoFile(rawUrl)){const poster=resolveSiteAssetHref(outputPath,reading.notebooklm_video_poster);return `<video class="video-media" controls preload="metadata"${poster?` poster="${escapeHtml(poster)}"`:""}><source src="${escapeHtml(href)}" /></video>`;}return `<iframe class="video-media" src="${escapeHtml(toEmbedUrl(href))}" title="${escapeHtml(reading.title)} NotebookLM 설명영상" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;}
function renderBrandMarkSvg(){return `
<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <defs>
    <path id="brand-ring-top" d="M 12 32 A 20 20 0 0 1 52 32" />
    <path id="brand-ring-bottom" d="M 52 32 A 20 20 0 0 1 12 32" />
  </defs>
  <circle cx="32" cy="32" r="31" fill="#0f2f6b" />
  <circle cx="32" cy="32" r="25.5" fill="none" stroke="#ffffff" stroke-width="1.8" opacity=".92" />
  <circle cx="32" cy="32" r="16.5" fill="#ffffff" />
  <path d="M32 18.8c3.8 4.3 5.7 8 5.7 11.4 0 3.8-2.4 6.2-5.7 8.5-3.3-2.3-5.7-4.7-5.7-8.5 0-3.4 1.9-7.1 5.7-11.4Z" fill="#0f2f6b" />
  <path d="M26.6 40.4h10.8" stroke="#0f2f6b" stroke-width="2.2" stroke-linecap="round" />
  <path d="M29.1 44.7h5.8" stroke="#0f2f6b" stroke-width="2.2" stroke-linecap="round" />
  <text fill="#ffffff" font-size="5" font-weight="700" letter-spacing=".14em">
    <textPath href="#brand-ring-top" startOffset="50%" text-anchor="middle">SEOUL NATIONAL</textPath>
  </text>
  <text fill="#ffffff" font-size="5.2" font-weight="700" letter-spacing=".12em">
    <textPath href="#brand-ring-bottom" startOffset="50%" text-anchor="middle">UNIVERSITY</textPath>
  </text>
</svg>`;}
function renderBrandMark(outputPath){if(fs.existsSync(brandLogoSource)){const logoHref=relHref(outputPath,path.join(siteDir,"assets","branding","snu.png"));return `<img src="${escapeHtml(logoHref)}" alt="" />`;}return renderBrandMarkSvg();}
function siteHeader(siteMeta,outputPath){const homeHref=relHref(outputPath,path.join(siteDir,"index.html"));return `
<header class="topbar">
  <div class="brand">
    <a class="brand-mark" href="${escapeHtml(homeHref)}" aria-label="Home">${renderBrandMark(outputPath)}</a>
    <div>
      <p class="brand-title">2026-1 성인발달과노화</p>
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
function pageTabs(outputPath,reading,activeKey){const base=path.join(siteDir,"readings",reading.slug);const tabs=[{key:"index",label:LANDING_TAB_LABEL,target:path.join(base,"index.html")}].concat(reading.pages.map((page)=>({key:page.key,label:page.label,target:path.join(base,page.filename)})));const primaryKeys=new Set(["index","full","translation","professor-prep"]);const primaryTabs=tabs.filter((tab)=>primaryKeys.has(tab.key));const hiddenTabs=tabs.filter((tab)=>!primaryKeys.has(tab.key));const hiddenActive=hiddenTabs.find((tab)=>tab.key===activeKey)||null;const hiddenSummary=hiddenActive?hiddenActive.label:"더보기";const hiddenMarkup=!hiddenTabs.length?"":`<details class="tab-more"${hiddenActive?" open":""}><summary class="tab-more-toggle">${escapeHtml(hiddenSummary)}</summary><div class="tab-more-list">${hiddenTabs.map((tab)=>`<a class="tab${tab.key===activeKey?" active":""}" href="${escapeHtml(relHref(outputPath,tab.target))}">${escapeHtml(tab.label)}</a>`).join("")}</div></details>`;return `<nav class="tab-row">${primaryTabs.map((tab)=>`<a class="tab${tab.key===activeKey?" active":""}" href="${escapeHtml(relHref(outputPath,tab.target))}">${escapeHtml(tab.label)}</a>`).join("")}${hiddenMarkup}</nav>`;}
function renderBreadcrumbs(outputPath,reading,currentLabel=""){const homeHref=relHref(outputPath,path.join(siteDir,"index.html"));const overviewHref=relHref(outputPath,path.join(siteDir,"readings",reading.slug,"index.html"));const crumbs=[`<a href="${escapeHtml(homeHref)}">홈</a>`];if(currentLabel){crumbs.push(`<a href="${escapeHtml(overviewHref)}">${escapeHtml(reading.title)}</a>`);crumbs.push(`<span aria-current="page">${escapeHtml(currentLabel)}</span>`);}else{crumbs.push(`<span aria-current="page">${escapeHtml(reading.title)}</span>`);}return `<nav class="breadcrumbs" aria-label="breadcrumb">${crumbs.map((item,index)=>`${index?'<span class="crumb-sep">/</span>':""}${item}`).join("")}</nav>`;}
function renderArticleMeta(reading,options={}){const bits=[options.pageLabel||"",reading.display_date,reading.type_label,options.includeLanguage?reading.language_label:"",reading.authors_label].filter(Boolean);return `<div class="article-meta-row">${bits.map((bit)=>`<span>${escapeHtml(bit)}</span>`).join("")}</div>`;}
function renderArticleHeader(outputPath,reading,options){const currentLabel=options.breadcrumbLabel===undefined?(options.activeKey==="index"?"":options.label):options.breadcrumbLabel;return `<header class="article-header"><div class="article-header-top"><div class="article-header-copy">${renderBreadcrumbs(outputPath,reading,currentLabel)}<p class="section-kicker">${escapeHtml(readingSequenceLabel(reading.sequence))}</p><h1>${escapeHtml(reading.title)}</h1>${renderArticleMeta(reading,{pageLabel:options.metaPageLabel||"",includeLanguage:Boolean(options.includeLanguage)})}</div></div>${options.includePdf===false?"":renderPdfActions(outputPath,reading,"pdf-actions header-pdf-actions")}${pageTabs(outputPath,reading,options.activeKey)}</header>`;}
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
  <p>${escapeHtml(relSource)}에 아직 읽기 답변 준비 카드가 없습니다. 링크는 유지하고, 페이지 역할만 먼저 안내합니다.</p>
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
function prepKeyword(card){return card.must_include_keywords[0]||"핵심 포인트";}
function prepKeywordText(card){return card.must_include_keywords.slice(0,2).join(", ")||prepKeyword(card);}
function prepEvidenceText(card){return truncateWords(firstValue(sentenceList(card.evidence_from_reading[0])[0],card.evidence_from_reading[0],card.answer_10s),18);}
function prepFollowupAnswer(card,tokens){return card.followup_answers.find((entry)=>tokens.some((token)=>entry.question.includes(token)||entry.answer.includes(token)))||null;}
function buildProfessorPrepDeck(prep){return prep.cards.map((card,index)=>({...card,card_id:`prep-card-${String(index+1).padStart(2,"0")}`}));}
function writePlaceholderSvg(reading,svgPath){const slug=escapeHtml(reading.slug);const title=escapeHtml(reading.title||reading.slug);const subtitle=escapeHtml(reading.subtitle||"파일명 기준으로 만든 임시 메타데이터입니다.");const dateLabel=escapeHtml(displayDateLabel(reading));const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="#e9e2d8" />
  <rect x="44" y="44" width="1192" height="632" fill="#f8f5f0" stroke="#cbbcab" stroke-width="4" rx="18" />
  <rect x="84" y="88" width="170" height="42" fill="#ede6dc" rx="8" />
  <text x="104" y="117" fill="#5f564c" font-size="24" font-family="'Segoe UI', 'Noto Sans KR', sans-serif">${dateLabel}</text>
  <text x="84" y="172" fill="#8d826f" font-size="24" font-family="'Segoe UI', 'Noto Sans KR', sans-serif">${slug}</text>
  <text x="84" y="280" fill="#1f1b17" font-size="66" font-weight="700" font-family="'Segoe UI', 'Noto Sans KR', sans-serif">${title}</text>
  <text x="84" y="350" fill="#61584e" font-size="32" font-family="'Segoe UI', 'Noto Sans KR', sans-serif">${subtitle}</text>
  <line x1="84" y1="558" x2="1196" y2="558" stroke="#d8cfc4" stroke-width="3" />
  <text x="84" y="612" fill="#6d6459" font-size="26" font-family="'Segoe UI', 'Noto Sans KR', sans-serif">PDF 첫 페이지 이미지가 없을 때 사용하는 로컬 대체 썸네일</text>
</svg>
`;writeText(svgPath,svg);}
function buildThumbnails(manifest,slugFilter=null){const thumbnailDir=path.join(siteDir,"assets","thumbnails");fs.mkdirSync(thumbnailDir,{recursive:true});const results={};for(const reading of manifest.readings){const svgPath=path.join(thumbnailDir,`${reading.slug}.svg`);if(!slugFilter||reading.slug===slugFilter||!fs.existsSync(svgPath))writePlaceholderSvg(reading,svgPath);results[reading.slug]=path.posix.join("assets","thumbnails",`${reading.slug}.svg`);}return results;}
function buildIndex(siteMeta,readings,thumbnails){const outputPath=path.join(siteDir,"index.html");const sortedReadings=[...readings].sort((a,b)=>compareReadings(a,b,"chronological"));const cards=sortedReadings.map((reading,index)=>{const thumbHref=relHref(outputPath,path.join(siteDir,thumbnails[reading.slug]));const targetHref=relHref(outputPath,path.join(siteDir,"readings",reading.slug,"index.html"));const metaBits=[reading.type_label,reading.language_label,reading.year?reading.year_label:null].filter(Boolean).join(" · ");const authorLine=reading.authors.length?`<p class="meta card-authors">${escapeHtml(reading.authors_label)}</p>`:"";return `
<article class="video-card" data-reading-card data-search="${escapeHtml(searchBlob(reading))}" data-type="${escapeHtml(reading.type)}" data-tags="${escapeHtml(reading.tags.map((tag)=>tag.toLowerCase()).join("||"))}" data-sort-date="${escapeHtml(reading.effective_sort_date||"")}" data-sequence="${index+1}">
  <a class="card-link" href="${escapeHtml(targetHref)}">
    <div class="thumb">
      <img src="${escapeHtml(thumbHref)}" alt="${escapeHtml(reading.title)} 썸네일" />
    </div>
    <div class="card-body">
      <p class="card-date">${escapeHtml(reading.display_date)}</p>
      <h2 class="title">${escapeHtml(reading.title)}</h2>
      ${authorLine}
      <p class="meta card-meta">${escapeHtml(metaBits)}</p>
      <p class="meta card-subtitle">${escapeHtml(reading.subtitle)}</p>
    </div>
  </a>
</article>
`;}).join("");const body=`
${siteHeader(siteMeta,outputPath)}
<main class="home-shell home-grid-shell" data-page-kind="home">
  <div class="video-grid" data-reading-grid>${cards}</div>
</main>
`;writeText(outputPath,renderDocument(siteMeta,outputPath,siteMeta.title,body,siteMeta.description,'data-page-kind="home"',"ko"));}
function buildLanding(siteMeta,reading){const outputPath=path.join(siteDir,"readings",reading.slug,"index.html");const body=`
${siteHeader(siteMeta,outputPath)}
<main class="video-shell">
  <article class="article panel video-article">
    ${renderArticleHeader(outputPath,reading,{activeKey:"index",label:LANDING_TAB_LABEL,metaPageLabel:LANDING_TAB_LABEL,includeLanguage:true,breadcrumbLabel:LANDING_TAB_LABEL})}
    <section class="article-body video-body">
      <section class="video-stage">
        <div class="video-frame">
          ${renderNotebookLmVideo(outputPath,reading)}
        </div>
      </section>
    </section>
  </article>
</main>
`;writeText(outputPath,renderDocument(siteMeta,outputPath,reading.title,body,reading.description,'data-page-kind="landing"',reading.language==="en"?"en":"ko"));}
function buildArticle(siteMeta,reading,page){const outputPath=path.join(siteDir,"readings",reading.slug,page.filename);const text=loadMarkdown(page.sourcePath);const content=text?markdownToHtml(text):placeholderArticleHtml(reading,page,page.sourcePath);const body=`
${siteHeader(siteMeta,outputPath)}
<main class="reader-shell">
  <article class="article panel">
    ${renderArticleHeader(outputPath,reading,{activeKey:page.key,label:page.label})}
    <section class="article-body">${content}</section>
  </article>
</main>
`;writeText(outputPath,renderDocument(siteMeta,outputPath,`${reading.title} - ${page.label}`,body,reading.description,'data-page-kind="article"',page.key==="full"&&reading.language==="en"?"en":"ko"));}
function writePublicPdf(reading){if(!reading.public_pdf)return false;const sourcePath=path.join(rootDir,reading.source_pdf);if(!fs.existsSync(sourcePath))return false;const targetPath=publicPdfTargetPath(reading);fs.mkdirSync(path.dirname(targetPath),{recursive:true});fs.copyFileSync(sourcePath,targetPath);return true;}
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
  <h3>${index+1}. ${renderInline(item.question)}</h3>
  <details class="answer">
    <summary>정답 보기</summary>
    <p><strong>허용 정답:</strong> ${answers}</p>
    <p><strong>답 유형:</strong> ${escapeHtml(SHORT_ANSWER_TYPE_LABELS[item.answer_type]||item.answer_type)}</p>
    <p><strong>해설:</strong> ${renderInline(item.explanation)}</p>
    ${sourceHtml}
  </details>
</article>
`;}
function buildQuiz(siteMeta,reading,page){const outputPath=path.join(siteDir,"readings",reading.slug,page.filename);const quiz=loadQuiz(page,page.sourcePath);let content="";if(!quiz){content=placeholderQuizHtml(page,page.sourcePath);}else{const cards=quiz.items.map((item,index)=>page.key==="quiz-short"?renderShortAnswerQuizCard(item,index):renderStandardQuizCard(item,index)).join("");content=`<section class="quiz-list">${cards}</section>`;}const body=`
${siteHeader(siteMeta,outputPath)}
<main class="quiz-shell">
  <article class="article panel">
    ${renderArticleHeader(outputPath,reading,{activeKey:page.key,label:page.label})}
    <section class="article-body">${content}</section>
  </article>
</main>
`;writeText(outputPath,renderDocument(siteMeta,outputPath,`${reading.title} - ${page.label}`,body,reading.description,'data-page-kind="quiz"',"ko"));}
function renderProfessorPrepCard(card,index){return `
<article class="panel prep-card" id="${escapeHtml(card.card_id)}" data-prep-card data-card-id="${escapeHtml(card.card_id)}">
  <div class="prep-card-head">
    <div>
      <p class="section-kicker">모델 답변 ${String(index+1).padStart(2,"0")}</p>
      <h3 data-prep-title>${renderInline(card.title)}</h3>
    </div>
  </div>
  <section class="prep-block prep-answer-block">
    <h4>30초 모델 답변</h4>
    <p class="prep-answer-copy">${renderInline(card.answer_30s)}</p>
  </section>
</article>
`;}
function buildProfessorPrep(siteMeta,reading,page){const outputPath=path.join(siteDir,"readings",reading.slug,page.filename);const prep=loadProfessorPrep(page.sourcePath);const deck=prep?buildProfessorPrepDeck(prep):null;const content=prep?`
<section class="panel prep-intro">
  <p class="section-kicker">이 글을 어떻게 읽었는지</p>
  <h2>${deck.length}개 모델 답변</h2>
  <p class="meta">${escapeHtml(prep.instructions||"")}</p>
</section>
<section class="prep-card-list">
  ${deck.map((card,index)=>renderProfessorPrepCard(card,index)).join("")}
</section>
`:placeholderProfessorPrepHtml(page,page.sourcePath);const body=`
${siteHeader(siteMeta,outputPath)}
<main class="quiz-shell">
  <article class="article panel">
    ${renderArticleHeader(outputPath,reading,{activeKey:page.key,label:page.label})}
    <section class="article-body prep-body">${content}</section>
  </article>
</main>
`;writeText(outputPath,renderDocument(siteMeta,outputPath,`${reading.title} - ${page.label}`,body,reading.description,'data-page-kind="prep"',"ko"));}
function copyNotebooklmVideo(reading){if(!reading.notebooklm_video_source||!reading.notebooklm_video_url)return;const target=path.join(siteDir,...reading.notebooklm_video_url.split("/"));fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(reading.notebooklm_video_source,target);}
function writeAssets(){writeText(path.join(siteDir,"assets","styles.css"),readText(styleSource));writeText(path.join(siteDir,"assets","app.js"),readText(appSource));if(fs.existsSync(brandLogoSource)){const target=path.join(siteDir,"assets","branding","snu.png");fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(brandLogoSource,target);}}
function parseArgs(){const slugIndex=process.argv.indexOf("--slug");return{slug:slugIndex!==-1?process.argv[slugIndex+1]:null};}
function buildPage(siteMeta,reading,page){if(page.type==="article"){buildArticle(siteMeta,reading,page);return;}if(page.type==="professor-prep"){buildProfessorPrep(siteMeta,reading,page);return;}buildQuiz(siteMeta,reading,page);}
function buildSite(options={}){const manifest=loadManifest();ensureContentPlaceholders(manifest,options.slug||null);const siteMeta=manifest.site;const readings=prepareReadings(manifest);if(options.slug){const target=readings.find((reading)=>reading.slug===options.slug);if(!target)throw new Error(`Unknown slug: ${options.slug}`);fs.mkdirSync(siteDir,{recursive:true});const thumbnails=buildThumbnails(manifest,target.slug);writeAssets();buildIndex(siteMeta,readings,thumbnails);writePublicPdf(target);copyNotebooklmVideo(target);const readingDir=path.join(siteDir,"readings",target.slug);if(fs.existsSync(readingDir))fs.rmSync(readingDir,{recursive:true,force:true});buildLanding(siteMeta,target);for(const page of target.pages){buildPage(siteMeta,target,page);}return{siteMeta,readings};}if(fs.existsSync(siteDir))fs.rmSync(siteDir,{recursive:true,force:true});const thumbnails=buildThumbnails(manifest);writeAssets();buildIndex(siteMeta,readings,thumbnails);for(const reading of readings){writePublicPdf(reading);copyNotebooklmVideo(reading);buildLanding(siteMeta,reading);for(const page of reading.pages){buildPage(siteMeta,reading,page);}}return{siteMeta,readings};}
module.exports={buildSite};
if(require.main===module){const options=parseArgs();buildSite(options);console.log(options.slug?`[built] reading ${options.slug} + home`:"[built] docs" );}













