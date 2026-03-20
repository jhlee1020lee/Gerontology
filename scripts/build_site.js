const fs=require("fs");
const path=require("path");
const rootDir=path.resolve(__dirname,"..");
const manifestPath=path.join(rootDir,"manifest","readings.json");
const siteDir=path.join(rootDir,"site");
const styleSource=path.join(__dirname,"site_styles.css");
const appSource=path.join(__dirname,"site_app.js");
const PAGE_DEFS=[
  {key:"summary",label:"Quick Overview",filename:"summary.html",type:"article",description:"Fast orientation notes for the reading before you move into the full text."},
  {key:"full",label:"Full Text",filename:"full.html",type:"article",description:"Readable article layout for the cleaned primary text."},
  {key:"translation",label:"Korean Translation",filename:"translation.html",type:"article",description:"Korean translation page for English readings.",englishOnly:true},
  {key:"concepts",label:"Concepts",filename:"concepts.html",type:"article",description:"핵심 개념과 용어를 빠르게 복습하는 페이지."},
  {key:"pitfalls",label:"Pitfalls",filename:"pitfalls.html",type:"article",description:"헷갈리는 포인트와 자주 틀리는 구분을 정리하는 페이지."},
  {key:"quiz-ox",label:"OX Quiz",filename:"quiz-ox.html",type:"quiz",description:"True-or-false review questions."},
  {key:"quiz-short",label:"Short Answer Quiz",filename:"quiz-short.html",type:"quiz",description:"Short written-response practice."},
  {key:"quiz-mcq",label:"Multiple Choice Quiz",filename:"quiz-mcq.html",type:"quiz",description:"Multiple-choice review questions."},
  {key:"review-sheet",label:"Review Sheet",filename:"review-sheet.html",type:"article",description:"시험 직전 1장 정리용 압축 노트 페이지."},
  {key:"professor-prep",label:"Professor Prep",filename:"professor-prep.html",type:"article",description:"수업 발언, 인상 깊은 점, 비판 포인트, 토론 질문을 준비하는 페이지."}
];
const FLOW_STEPS=[
  {step:1,mode:"page",key:"summary",title:"Quick overview",blurb:"Start with a short orientation so the rest of the reading has a frame."},
  {step:2,mode:"page",key:"full",title:"Full text",blurb:"Move into the full reading once the core purpose is clear."},
  {step:3,mode:"page",key:"translation",title:"Translation",blurb:"Use the Korean translation for English readings when you need a second pass.",optional:true},
  {step:4,mode:"page",key:"concepts",title:"Concepts",blurb:"Lock down 핵심 개념/용어 before moving to common traps."},
  {step:5,mode:"page",key:"pitfalls",title:"Pitfalls",blurb:"Review the confusing distinctions that are easy to miss in class or on exams."},
  {step:6,mode:"quiz-group",title:"Quizzes",blurb:"Check recall with OX, short-answer, and multiple-choice practice.",keys:["quiz-ox","quiz-short","quiz-mcq"]},
  {step:7,mode:"page",key:"review-sheet",title:"Review sheet",blurb:"Compress the reading into a final one-page exam review."},
  {step:8,mode:"page",key:"professor-prep",title:"Professor prep",blurb:"Prepare speaking points, critique angles, and discussion questions."}
];
function readText(filePath){return fs.readFileSync(filePath,"utf8").replace(/^\uFEFF/,"");}
function writeText(filePath,text){fs.mkdirSync(path.dirname(filePath),{recursive:true});fs.writeFileSync(filePath,text,"utf8");}
function loadManifest(){return JSON.parse(readText(manifestPath));}
function relHref(fromPath,toPath){return path.relative(path.dirname(fromPath),toPath).split(path.sep).join("/");}
function escapeHtml(value){return String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;");}
function renderInline(text){return escapeHtml(text).replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>");}
function markdownToHtml(text){const lines=text.replace(/\r\n/g,"\n").split("\n");const parts=[];let paragraph=[];let listItems=[];let quoteLines=[];const flushParagraph=()=>{if(paragraph.length){parts.push(`<p>${renderInline(paragraph.join(" ").trim())}</p>`);paragraph=[];}};const flushList=()=>{if(listItems.length){parts.push(`<ul>${listItems.map((item)=>`<li>${renderInline(item)}</li>`).join("")}</ul>`);listItems=[];}};const flushQuote=()=>{if(quoteLines.length){parts.push(`<blockquote>${renderInline(quoteLines.join(" ").trim())}</blockquote>`);quoteLines=[];}};for(const rawLine of lines){const line=rawLine.trim();if(!line){flushParagraph();flushList();flushQuote();continue;}if(line.startsWith("### ")){flushParagraph();flushList();flushQuote();parts.push(`<h3>${renderInline(line.slice(4))}</h3>`);continue;}if(line.startsWith("## ")){flushParagraph();flushList();flushQuote();parts.push(`<h2>${renderInline(line.slice(3))}</h2>`);continue;}if(line.startsWith("# ")){flushParagraph();flushList();flushQuote();parts.push(`<h1>${renderInline(line.slice(2))}</h1>`);continue;}if(line.startsWith("- ")){flushParagraph();flushQuote();listItems.push(line.slice(2).trim());continue;}if(line.startsWith("> ")){flushParagraph();flushList();quoteLines.push(line.slice(2).trim());continue;}flushList();flushQuote();paragraph.push(line);}flushParagraph();flushList();flushQuote();return parts.join("\n");}
function loadMarkdown(filePath){if(!fs.existsSync(filePath))return null;const text=readText(filePath).trim();return text||null;}
function loadQuiz(filePath){if(!fs.existsSync(filePath))return null;const payload=JSON.parse(readText(filePath));const items=payload.items||[];return items.length?payload:null;}
function detectType(reading){if(reading.type)return reading.type;const kind=String(reading.kind||"").toLowerCase();if(kind.includes("chapter"))return"chapter";if(kind.includes("article"))return"article";return"reading";}
function typeLabel(type){return({article:"Article",chapter:"Chapter",reading:"Reading"})[type]||"Reading";}
function yearLabel(year){return year?String(year):"Year unconfirmed";}
function languageLabel(language){return({en:"English",ko:"Korean",unknown:"Unconfirmed"})[language]||String(language||"").toUpperCase();}
function authorsLabel(authors){return authors&&authors.length?authors.join(", "):"Author metadata incomplete";}
function firstValue(...values){for(const value of values){if(value===null||value===undefined)continue;const text=String(value).trim();if(text)return text;}return"";}
function effectiveSortDate(reading){return firstValue(reading.sort_date,reading.reading_date,reading.class_date);}
function displayDateLabel(reading){return firstValue(reading.display_date_label,reading.reading_date,reading.class_date,reading.sort_date)||"Date TBD";}
function statusKeyForPage(pageKey){return pageKey.replace(/-/g,"_");}
function contentPath(reading,page){const contentDir=path.join(rootDir,reading.content_dir);if(page.key==="full"){const preferred=path.join(contentDir,"full.md");const fallback=path.join(contentDir,"cleaned.md");return fs.existsSync(preferred)?preferred:(fs.existsSync(fallback)?fallback:preferred);}if(page.type==="article")return path.join(contentDir,`${page.key}.md`);return path.join(contentDir,`${page.key}.json`);}
function pageState(reading,page){const sourcePath=contentPath(reading,page);if(page.type==="article")return{sourcePath,available:Boolean(loadMarkdown(sourcePath)),count:null};const quiz=loadQuiz(sourcePath);return{sourcePath,available:Boolean(quiz),count:quiz?quiz.items.length:0};}
function metadataStatusHtml(status){return status==="complete"?'<span class="status ready">Metadata confirmed</span>':'<span class="status placeholder">Metadata incomplete</span>';}
function normalizeReading(reading,sequence){const language=reading.language||"unknown";const type=detectType(reading);const tags=Array.isArray(reading.tags)&&reading.tags.length?reading.tags:["Metadata incomplete"];const sortDate=effectiveSortDate(reading);return{...reading,sequence,subtitle:reading.subtitle||"Filename-derived placeholder metadata.",authors:reading.authors||[],authors_label:authorsLabel(reading.authors||[]),year_label:yearLabel(reading.year),language,language_label:languageLabel(language),kind:reading.kind||`${type} pdf`,kind_label:reading.kind||`${type} pdf`,type,type_label:typeLabel(type),source_filename:reading.source_filename||path.basename(reading.source_pdf),tags,description:reading.description||"Placeholder record created from the source filename only.",metadata_status:reading.metadata_status||"incomplete",metadata_notes:reading.metadata_notes||[],class_date:reading.class_date??null,reading_date:reading.reading_date??null,sort_date:reading.sort_date??null,display_date_label:reading.display_date_label??null,effective_sort_date:sortDate,display_date:displayDateLabel(reading),translation_required:language==="en"};}
function buildContentStatus(reading){const contentStatus={};for(const page of PAGE_DEFS){const key=statusKeyForPage(page.key);if(page.englishOnly&&reading.language!=="en"){contentStatus[key]="not_applicable";continue;}const state=pageState(reading,page);contentStatus[key]=state.available?"ready":"missing";}return contentStatus;}
function ensureContentPlaceholders(manifest){manifest.readings.forEach((rawReading,index)=>{const reading=normalizeReading(rawReading,index+1);const contentDir=path.join(rootDir,reading.content_dir);fs.mkdirSync(contentDir,{recursive:true});const metaPath=path.join(contentDir,"meta.json");let existing={};if(fs.existsSync(metaPath)){try{existing=JSON.parse(readText(metaPath));}catch(error){existing={};}}const payload={...existing,slug:reading.slug,source_filename:reading.source_filename,source_pdf:reading.source_pdf,content_dir:reading.content_dir,title:reading.title,subtitle:reading.subtitle,authors:reading.authors,year:reading.year??null,language:reading.language,type:reading.type,kind:reading.kind,class_date:reading.class_date,reading_date:reading.reading_date,sort_date:reading.sort_date,display_date_label:reading.display_date_label,description:reading.description,metadata_status:reading.metadata_status,metadata_notes:reading.metadata_notes,content_status:buildContentStatus(reading)};writeText(metaPath,`${JSON.stringify(payload,null,2)}\n`);});}
function prepareReadings(manifest){return manifest.readings.map((rawReading,index)=>{const reading=normalizeReading(rawReading,index+1);const pages=PAGE_DEFS.filter((page)=>!(page.englishOnly&&reading.language!=="en")).map((page)=>({...page,...pageState(reading,page)}));return{...reading,pages};});}
function compareReadings(a,b,mode){if(mode==="chronological"){const aHasDate=Boolean(a.effective_sort_date);const bHasDate=Boolean(b.effective_sort_date);if(aHasDate&&bHasDate&&a.effective_sort_date!==b.effective_sort_date)return a.effective_sort_date.localeCompare(b.effective_sort_date);if(aHasDate!==bHasDate)return aHasDate?-1:1;}return a.sequence-b.sequence;}
function searchBlob(reading){return[reading.slug,reading.title,reading.subtitle,reading.source_filename,reading.language,reading.type,reading.kind,reading.year_label,reading.display_date,...(reading.authors||[]),...(reading.tags||[]),...(reading.metadata_notes||[])].filter(Boolean).join(" ");}
function buildTagOptions(readings){return Array.from(new Set(readings.flatMap((reading)=>reading.tags||[]).filter(Boolean))).sort((a,b)=>a.localeCompare(b));}
function statusHtml(available){return `<span class="status ${available?"ready":"placeholder"}">${available?"Ready":"Placeholder"}</span>`;}
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
    <button class="ghost-btn" type="button" data-theme-toggle>Dark mode</button>
  </div>
</header>
`;}
function renderDocument(siteMeta,outputPath,title,body,description,bodyAttrs=""){const cssHref=relHref(outputPath,path.join(siteDir,"assets","styles.css"));const jsHref=relHref(outputPath,path.join(siteDir,"assets","app.js"));return `<!DOCTYPE html>
<html lang="en">
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
function pageTabs(outputPath,reading,activeKey){const base=path.join(siteDir,"readings",reading.slug);const tabs=[{key:"index",label:"Overview",target:path.join(base,"index.html")}].concat(reading.pages.map((page)=>({key:page.key,label:page.label,target:path.join(base,page.filename)})));return `<nav class="tab-row">${tabs.map((tab)=>`<a class="tab${tab.key===activeKey?" active":""}" href="${escapeHtml(relHref(outputPath,tab.target))}">${escapeHtml(tab.label)}</a>`).join("")}</nav>`;}
function placeholderArticleHtml(reading,page,sourcePath){const relSource=path.relative(rootDir,sourcePath).split(path.sep).join("/");return `
<section class="placeholder article-placeholder">
  <h2>Placeholder scaffold</h2>
  <p>No authored content found at ${escapeHtml(relSource)}. This page stays live so the study flow remains intact while content is being authored.</p>
  <h3>Expected source file</h3>
  <p><code>${escapeHtml(relSource)}</code></p>
  <h3>Planned role in the study flow</h3>
  <p>${escapeHtml(page.description)}</p>
  <h3>Current metadata context</h3>
  <p>${escapeHtml(reading.display_date)} | ${escapeHtml(reading.type_label)} | ${escapeHtml(reading.language_label)}</p>
</section>
`;}
function placeholderQuizHtml(page,sourcePath){const relSource=path.relative(rootDir,sourcePath).split(path.sep).join("/");return `
<section class="placeholder">
  <h2>Placeholder scaffold</h2>
  <p>No quiz data found at ${escapeHtml(relSource)}. The link remains active so the reading flow never breaks.</p>
  <h3>Expected source file</h3>
  <p><code>${escapeHtml(relSource)}</code></p>
  <h3>Planned role in the study flow</h3>
  <p>${escapeHtml(page.description)}</p>
</section>
`;}
function metadataNotesHtml(reading){if(!reading.metadata_notes||!reading.metadata_notes.length)return"";return `<div class="meta-notes"><h3>Metadata Notes</h3><ul>${reading.metadata_notes.map((note)=>`<li>${escapeHtml(note)}</li>`).join("")}</ul></div>`;}
function pageDetailText(page){if(page.type==="quiz")return page.available?`${page.count} items detected`:"Placeholder quiz page active";return page.available?"Content detected":"Placeholder article page active";}
function pageMap(pages){return Object.fromEntries(pages.map((page)=>[page.key,page]));}
function renderFlowStep(outputPath,reading,pagesByKey,step){if(step.mode==="quiz-group"){const quizPages=step.keys.map((key)=>pagesByKey[key]).filter(Boolean);const readyCount=quizPages.filter((page)=>page.available).length;const links=quizPages.map((page)=>{const target=relHref(outputPath,path.join(siteDir,"readings",reading.slug,page.filename));return `<a class="sub-link" href="${escapeHtml(target)}"><span>${escapeHtml(page.label)}</span><span>${escapeHtml(page.available?`${page.count} items`:"Placeholder")}</span></a>`;}).join("");return `
<article class="flow-card quiz-flow-card">
  <p class="step-index">Step ${step.step}</p>
  <h3>${escapeHtml(step.title)}</h3>
  <p class="meta">${escapeHtml(step.blurb)}</p>
  <div class="page-footer">
    <span class="status ${readyCount?"ready":"placeholder"}">${readyCount}/${quizPages.length} quiz pages ready</span>
    <span class="chip">quiz-block</span>
  </div>
  <div class="sub-link-list">${links}</div>
</article>
`;}
const page=pagesByKey[step.key];if(!page){return `
<article class="flow-card muted">
  <p class="step-index">Step ${step.step}</p>
  <h3>${escapeHtml(step.title)}</h3>
  <p class="meta">${escapeHtml(step.blurb)}</p>
  <p class="muted-note">Not applicable for this reading.</p>
</article>
`;}
const target=relHref(outputPath,path.join(siteDir,"readings",reading.slug,page.filename));return `
<article class="flow-card">
  <p class="step-index">Step ${step.step}</p>
  <h3>${escapeHtml(step.title)}</h3>
  <p class="meta">${escapeHtml(step.blurb)}</p>
  <p class="flow-desc">${escapeHtml(page.description)}</p>
  <div class="page-footer">
    ${statusHtml(page.available)}
    <a class="chip" href="${escapeHtml(target)}">${escapeHtml(pageDetailText(page))}</a>
  </div>
</article>
`;}
function writePlaceholderSvg(reading,svgPath){const slug=escapeHtml(reading.slug);const title=escapeHtml(reading.title||reading.slug);const subtitle=escapeHtml(reading.subtitle||"Filename-derived placeholder metadata.");const dateLabel=escapeHtml(displayDateLabel(reading));const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
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
  <text x="84" y="604" fill="#ffffff" font-size="28" font-family="'Segoe UI', 'Noto Sans KR', sans-serif">${dateLabel} · PDF thumbnail placeholder</text>
</svg>
`;writeText(svgPath,svg);}
function buildThumbnails(manifest){const thumbnailDir=path.join(siteDir,"assets","thumbnails");fs.mkdirSync(thumbnailDir,{recursive:true});const results={};for(const reading of manifest.readings){const svgPath=path.join(thumbnailDir,`${reading.slug}.svg`);writePlaceholderSvg(reading,svgPath);results[reading.slug]=path.posix.join("assets","thumbnails",`${reading.slug}.svg`);}return results;}
function buildIndex(siteMeta,readings,thumbnails){const outputPath=path.join(siteDir,"index.html");const totalPages=readings.reduce((sum,reading)=>sum+reading.pages.length,0);const readyPages=readings.reduce((sum,reading)=>sum+reading.pages.filter((page)=>page.available).length,0);const tagOptions=buildTagOptions(readings);const typeOptions=Array.from(new Set(readings.map((reading)=>reading.type))).sort((a,b)=>a.localeCompare(b));const sortedReadings=[...readings].sort((a,b)=>compareReadings(a,b,"chronological"));const cards=sortedReadings.map((reading)=>{const thumbHref=relHref(outputPath,path.join(siteDir,thumbnails[reading.slug]));const targetHref=relHref(outputPath,path.join(siteDir,"readings",reading.slug,"index.html"));const tags=reading.tags.map((tag)=>`<span class="chip">${escapeHtml(tag)}</span>`).join("");const readyCount=reading.pages.filter((page)=>page.available).length;return `
<article class="video-card" data-reading-card data-search="${escapeHtml(searchBlob(reading))}" data-type="${escapeHtml(reading.type)}" data-tags="${escapeHtml(reading.tags.map((tag)=>tag.toLowerCase()).join("||"))}" data-sort-date="${escapeHtml(reading.effective_sort_date||"")}" data-sequence="${reading.sequence}">
  <a class="card-link" href="${escapeHtml(targetHref)}">
    <div class="thumb">
      <img src="${escapeHtml(thumbHref)}" alt="${escapeHtml(reading.title)} thumbnail" />
      <span class="badge">${escapeHtml(reading.type_label)}</span>
      <span class="thumb-date">${escapeHtml(reading.display_date)}</span>
    </div>
    <div class="card-body">
      <div class="card-topline">
        <span class="status ${readyCount?"ready":"placeholder"}">${readyCount}/${reading.pages.length} ready</span>
        <span class="chip">Reading ${String(reading.sequence).padStart(2,"0")}</span>
      </div>
      <h2 class="title">${escapeHtml(reading.title)}</h2>
      <p class="meta">${escapeHtml(reading.authors_label)}</p>
      <p class="meta">${escapeHtml(reading.subtitle)}</p>
      <p class="meta">${escapeHtml(reading.kind_label)} | ${escapeHtml(reading.language_label)} | ${escapeHtml(reading.year_label)}</p>
      <div class="chip-row">${tags}</div>
    </div>
  </a>
</article>
`;}).join("");const tagSelect=[`<option value="">All tags</option>`].concat(tagOptions.map((tag)=>`<option value="${escapeHtml(tag.toLowerCase())}">${escapeHtml(tag)}</option>`)).join("");const typeSelect=[`<option value="">All types</option>`].concat(typeOptions.map((type)=>`<option value="${escapeHtml(type)}">${escapeHtml(typeLabel(type))}</option>`)).join("");const body=`
${siteHeader(siteMeta,outputPath)}
<main class="home-shell" data-page-kind="home">
  <section class="panel hero home-hero">
    <div>
      <span class="chip">Date-based reading inventory</span>
      <h1>${escapeHtml(siteMeta.title)}</h1>
      <p>${escapeHtml(siteMeta.description)}</p>
    </div>
    <div class="metric-row">
      <div class="metric"><p class="metric-label">Source</p><p class="metric-value">manifest/readings.json</p></div>
      <div class="metric"><p class="metric-label">Inventory</p><p class="metric-value">${readings.length} readings</p></div>
      <div class="metric"><p class="metric-label">Pages</p><p class="metric-value">${readyPages}/${totalPages}</p></div>
      <div class="metric"><p class="metric-label">Mode</p><p class="metric-value">Offline only</p></div>
    </div>
  </section>
  <section class="panel filter-panel" data-home-controls>
    <div class="filter-grid">
      <label class="field wide"><span>Search</span><input class="search-input" type="search" placeholder="Search title, subtitle, author, or tags" data-reading-search /></label>
      <label class="field"><span>Type</span><select class="filter-select" data-reading-type>${typeSelect}</select></label>
      <label class="field"><span>Tag</span><select class="filter-select" data-reading-tag>${tagSelect}</select></label>
      <label class="field"><span>Sort</span><select class="filter-select" data-reading-sort><option value="chronological">Chronological</option><option value="manifest">Manifest order</option></select></label>
    </div>
    <p class="meta">Search covers title, subtitle, author, and tags. Chronological sorting uses <code>sort_date</code>, then <code>reading_date</code>, then <code>class_date</code> when those fields exist.</p>
  </section>
  <section class="home-content">
    <aside class="panel home-side">
      <h2>Study Queue</h2>
      <p class="meta">The current local manifest is the source of truth. Unknown dates stay null in the manifest and render as placeholders in the UI.</p>
      <div class="metric-stack">
        <div class="metric slim"><p class="metric-label">Visible</p><p class="metric-value" data-reading-counter>${readings.length} of ${readings.length}</p></div>
        <div class="metric slim"><p class="metric-label">Chapters</p><p class="metric-value">${readings.filter((reading)=>reading.type==="chapter").length}</p></div>
        <div class="metric slim"><p class="metric-label">Articles</p><p class="metric-value">${readings.filter((reading)=>reading.type==="article").length}</p></div>
      </div>
      <p class="meta">Tags come from the manifest and remain filterable offline.</p>
    </aside>
    <div>
      <div class="section-head"><div><h2>Reading Library</h2><p class="meta">Responsive card grid with local-only filtering and sorting.</p></div></div>
      <div class="video-grid" data-reading-grid>${cards}</div>
      <section class="panel empty-state" data-empty-state hidden><h2>No readings matched</h2><p>Adjust the search, type, or tag filters to restore cards.</p></section>
    </div>
  </section>
  <p class="footer-note">Generated from <code>manifest/readings.json</code> and <code>content/readings/&lt;slug&gt;/</code>.</p>
</main>
`;writeText(outputPath,renderDocument(siteMeta,outputPath,siteMeta.title,body,siteMeta.description,'data-page-kind="home"'));}
function buildLanding(siteMeta,reading){const outputPath=path.join(siteDir,"readings",reading.slug,"index.html");const sourcePath=path.join(rootDir,reading.source_pdf);const sourceHref=relHref(outputPath,sourcePath);const sourceState=fs.existsSync(sourcePath)?"PDF available locally":"PDF missing, placeholder thumbnail in use";const tags=reading.tags.map((tag)=>`<span class="chip">${escapeHtml(tag)}</span>`).join("");const pagesByKey=pageMap(reading.pages);const flowCards=FLOW_STEPS.map((step)=>renderFlowStep(outputPath,reading,pagesByKey,step)).join("");const summaryPage=pagesByKey.summary;const summaryHref=summaryPage?relHref(outputPath,path.join(siteDir,"readings",reading.slug,summaryPage.filename)):"#";const body=`
${siteHeader(siteMeta,outputPath)}
<main class="landing-shell">
  <section class="panel hero reading-hero">
    <span class="chip">${escapeHtml(reading.type_label)} | ${escapeHtml(reading.display_date)}</span>
    <h1>${escapeHtml(reading.title)}</h1>
    <p>${escapeHtml(reading.subtitle)}</p>
    <div class="chip-row">${tags}</div>
    ${pageTabs(outputPath,reading,"index")}
  </section>
  <section class="landing-grid">
    <section class="panel start-panel">
      <p class="section-kicker">Study flow</p>
      <h2>Recommended order for this reading</h2>
      <p class="meta">Quick overview -> full text -> translation if applicable -> concepts -> pitfalls -> quizzes -> review sheet -> professor prep.</p>
      <div class="metric-row">
        <div class="metric"><p class="metric-label">Language</p><p class="metric-value">${escapeHtml(reading.language_label)}</p></div>
        <div class="metric"><p class="metric-label">Type</p><p class="metric-value">${escapeHtml(reading.type_label)}</p></div>
        <div class="metric"><p class="metric-label">Date</p><p class="metric-value">${escapeHtml(reading.display_date)}</p></div>
      </div>
      <p class="meta">${escapeHtml(reading.authors_label)}</p>
      <div class="action-row"><a class="ghost-btn link-btn" href="${escapeHtml(summaryHref)}">Open quick overview</a><a class="ghost-btn link-btn" href="${escapeHtml(sourceHref)}">Open source PDF</a></div>
    </section>
    <section class="panel source-panel"><h2>Reading context</h2><p class="meta">${escapeHtml(reading.description)}</p><p class="meta">${metadataStatusHtml(reading.metadata_status)}</p><p class="meta">${escapeHtml(reading.source_filename)}</p><p class="meta">${escapeHtml(reading.source_pdf)}</p><p class="meta">${escapeHtml(sourceState)}</p>${metadataNotesHtml(reading)}</section>
  </section>
  <section class="section"><div class="section-head"><div><h2>Study Flow Cards</h2><p class="meta">Each step stays live even when the underlying content is still a placeholder scaffold.</p></div></div><div class="study-flow-grid">${flowCards}</div></section>
</main>
`;writeText(outputPath,renderDocument(siteMeta,outputPath,reading.title,body,reading.description,'data-page-kind="landing"'));}
function buildArticle(siteMeta,reading,page){const outputPath=path.join(siteDir,"readings",reading.slug,page.filename);const text=loadMarkdown(page.sourcePath);const content=text?markdownToHtml(text):placeholderArticleHtml(reading,page,page.sourcePath);const pagePath=path.posix.join("readings",reading.slug,page.filename);const body=`
${siteHeader(siteMeta,outputPath)}
<main class="reader-shell" data-reader-root data-reading-slug="${escapeHtml(reading.slug)}" data-page-key="${escapeHtml(page.key)}" data-page-path="${escapeHtml(pagePath)}">
  <article class="article panel">
    <header class="article-header">
      <div class="article-header-top">
        <div>
          <p class="section-kicker">Reading ${String(reading.sequence).padStart(2,"0")}</p>
          <h1>${escapeHtml(reading.title)}</h1>
          <p>${escapeHtml(page.label)} | ${escapeHtml(reading.display_date)} | ${escapeHtml(reading.authors_label)}</p>
        </div>
        <span class="chip">${escapeHtml(page.label)}</span>
      </div>
      ${pageTabs(outputPath,reading,page.key)}
      <div class="reader-toolbar" role="toolbar" aria-label="Reading controls">
        <div class="toolbar-group"><button class="reader-btn" type="button" data-font-action="decrease">A-</button><button class="reader-btn" type="button" data-font-action="reset">A</button><button class="reader-btn" type="button" data-font-action="increase">A+</button></div>
        <div class="toolbar-group"><button class="reader-btn" type="button" data-page-bookmark>Bookmark page</button><button class="reader-btn" type="button" data-resume-position hidden>Resume position</button></div>
        <p class="reader-note" data-reading-status>Position saves locally on this device.</p>
      </div>
    </header>
    <section class="article-body" data-article-body>${content}</section>
  </article>
  <aside class="reader-aside">
    <section class="panel side-panel"><h2>Table of Contents</h2><nav class="toc-list" data-generated-toc></nav></section>
    <section class="panel side-panel"><h2>Important Marks</h2><div class="important-list" data-important-list></div></section>
    <section class="panel side-panel"><h2>Flow</h2><p class="meta">Return to the landing page to move through the full study order.</p><p><a class="ghost-btn link-btn" href="${escapeHtml(relHref(outputPath,path.join(siteDir,"readings",reading.slug,"index.html")))}">Back to study flow</a></p></section>
  </aside>
</main>
`;writeText(outputPath,renderDocument(siteMeta,outputPath,`${reading.title} - ${page.label}`,body,reading.description,'data-page-kind="article"'));}
function buildQuiz(siteMeta,reading,page){const outputPath=path.join(siteDir,"readings",reading.slug,page.filename);const quiz=loadQuiz(page.sourcePath);let content="";if(!quiz){content=placeholderQuizHtml(page,page.sourcePath);}else{const cards=quiz.items.map((item,index)=>{const optionsHtml=item.options&&item.options.length?`<ol class="choices">${item.options.map((option)=>`<li>${renderInline(option)}</li>`).join("")}</ol>`:"";const sourceHtml=item.source?`<p><strong>Source:</strong> ${renderInline(item.source)}</p>`:"";return `
<article class="quiz-card">
  <h3>${index+1}. ${renderInline(item.prompt)}</h3>
  ${optionsHtml}
  <details class="answer">
    <summary>Show answer</summary>
    <p><strong>Answer:</strong> ${renderInline(item.answer)}</p>
    <p><strong>Explanation:</strong> ${renderInline(item.explanation)}</p>
    ${sourceHtml}
  </details>
</article>
`;}).join("");content=`<section class="panel quiz-intro"><h2>${escapeHtml(quiz.title||page.label)}</h2><p class="meta">${escapeHtml(quiz.instructions||"")}</p><p class="meta">${quiz.items.length} questions</p></section><section class="quiz-list">${cards}</section>`;}const body=`
${siteHeader(siteMeta,outputPath)}
<main class="quiz-shell">
  <article class="article panel">
    <header class="article-header">
      <div class="article-header-top">
        <div>
          <p class="section-kicker">Reading ${String(reading.sequence).padStart(2,"0")}</p>
          <h1>${escapeHtml(reading.title)}</h1>
          <p>${escapeHtml(page.label)} | ${escapeHtml(reading.display_date)} | ${escapeHtml(reading.authors_label)}</p>
        </div>
        <span class="chip">Quiz page</span>
      </div>
      ${pageTabs(outputPath,reading,page.key)}
    </header>
    <section class="article-body">${content}</section>
  </article>
</main>
`;writeText(outputPath,renderDocument(siteMeta,outputPath,`${reading.title} - ${page.label}`,body,reading.description,'data-page-kind="quiz"'));}
function writeAssets(){writeText(path.join(siteDir,"assets","styles.css"),readText(styleSource));writeText(path.join(siteDir,"assets","app.js"),readText(appSource));}
function parseArgs(){const slugIndex=process.argv.indexOf("--slug");return{slug:slugIndex!==-1?process.argv[slugIndex+1]:null};}
function buildSite(options={}){const manifest=loadManifest();ensureContentPlaceholders(manifest);const siteMeta=manifest.site;const readings=prepareReadings(manifest);if(options.slug){const target=readings.find((reading)=>reading.slug===options.slug);if(!target)throw new Error(`Unknown slug: ${options.slug}`);fs.mkdirSync(siteDir,{recursive:true});const thumbnails=buildThumbnails(manifest);writeAssets();buildIndex(siteMeta,readings,thumbnails);const readingDir=path.join(siteDir,"readings",target.slug);if(fs.existsSync(readingDir))fs.rmSync(readingDir,{recursive:true,force:true});buildLanding(siteMeta,target);for(const page of target.pages){if(page.type==="article")buildArticle(siteMeta,target,page);else buildQuiz(siteMeta,target,page);}return;}
if(fs.existsSync(siteDir))fs.rmSync(siteDir,{recursive:true,force:true});const thumbnails=buildThumbnails(manifest);writeAssets();buildIndex(siteMeta,readings,thumbnails);for(const reading of readings){buildLanding(siteMeta,reading);for(const page of reading.pages){if(page.type==="article")buildArticle(siteMeta,reading,page);else buildQuiz(siteMeta,reading,page);}}}
const options=parseArgs();
buildSite(options);
console.log(options.slug?`[built] reading ${options.slug} + home`:"[built] site");
