const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const { TARGET_ORDER, SPECS } = require("./post_midterm_specs");
const { buildSite: buildStaticSite } = require("./build_site");

const ROOT_DIR = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT_DIR, "manifest", "readings.json");
const STATUS_PATH = path.join(ROOT_DIR, "Status.md");
const PLAN_PATH = path.join(ROOT_DIR, "Plan.md");
const PROMPT_PATH = path.join(ROOT_DIR, "Prompt.md");
const FAILURE_LOG_PATH = path.join(ROOT_DIR, "FailureLog.md");
const SITE_INDEX_PATH = path.join(ROOT_DIR, "docs", "index.html");
const DEFAULT_FOLLOWUPS = [
  "그게 뭐야?",
  "왜 그렇게 보는데?",
  "뭐가 새로웠는데?",
  "다시 말해봐.",
  "그게 왜 중요한데?",
  "연구에서는 뭐라고 하는데?",
  "한국에서는 어떻게 보이는데?",
  "그 설명의 한계는 뭐야?",
];
const BASE_PAGE_FILES = [
  "index.html",
  "full.html",
  "summary.html",
  "concepts.html",
  "pitfalls.html",
  "review-sheet.html",
  "professor-prep.html",
  "quiz-ox.html",
  "quiz-short.html",
  "quiz-mcq.html",
];

let pdfjsPromise = null;

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
}

function loadManifest() {
  return JSON.parse(readText(MANIFEST_PATH));
}

function saveManifest(manifest) {
  writeText(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
}

function todayLabel() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function markdownList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function cyclingPool(pool, startIndex, count, exclude) {
  const picked = [];
  for (let offset = 0; offset < pool.length && picked.length < count; offset += 1) {
    const value = pool[(startIndex + offset) % pool.length];
    if (value === exclude || picked.includes(value)) {
      continue;
    }
    picked.push(value);
  }
  return picked;
}

function buildSummaryMarkdown(spec) {
  const sections = spec.summary.sections
    .map((section) => `### ${section.title}\n\n${markdownList(section.bullets)}`)
    .join("\n\n");
  return [
    "# 핵심 요약",
    "",
    "## 한 줄 핵심",
    "",
    spec.summary.one_line,
    "",
    "## 핵심 내용",
    "",
    sections,
    "",
    "## 결론 정리",
    "",
    markdownList(spec.summary.conclusion),
    "",
  ].join("\n");
}

function buildTranslationMarkdown(spec) {
  if (!spec.translation) {
    return null;
  }
  const sections = spec.translation.sections
    .map((section) => [`## ${section.title}`, "", ...section.paragraphs, ""].join("\n"))
    .join("\n");
  return [
    "# 한국어 번역",
    "",
    `> 학습용 번역 정리: \`source_pdfs/${spec.source_filename}\`의 핵심 구조와 문장을 한국어로 따라갈 수 있게 다시 풀어 썼다.`,
    "",
    sections,
  ].join("\n");
}

function buildConceptsMarkdown(spec) {
  const sections = spec.concepts
    .map((concept, index) => [
      `## ${index + 1}. ${concept.term}`,
      "",
      `${concept.definition}`,
      "",
      `- 왜 중요한가: ${concept.significance}`,
      `- 연결 지점: ${concept.source}`,
      "",
    ].join("\n"))
    .join("\n");
  return ["# 핵심 개념 / 용어", "", sections].join("\n");
}

function buildPitfallsMarkdown(spec) {
  const sections = spec.pitfalls
    .map((pitfall, index) => [
      `## ${index + 1}. 자주 틀리는 말`,
      `- 오해: ${pitfall.wrong}`,
      `- 바로잡기: ${pitfall.right}`,
      `- 왜 중요한가: ${pitfall.importance}`,
      "",
    ].join("\n"))
    .join("\n");
  return ["# 헷갈리는 포인트", "", sections].join("\n");
}

function buildReviewSheetMarkdown(spec) {
  const summaryAnchors = spec.summary.sections.slice(0, 5).map((section) => `${section.title}: ${section.bullets[0]}`);
  const quickTerms = spec.concepts.slice(0, 6).map((concept) => `${concept.term}: ${concept.definition}`);
  const oralLines = spec.oral_cards.slice(0, 3).map((card) => `${card.question} -> ${card.core}`);
  return [
    "# 시험 직전 정리",
    "",
    "## 반드시 붙잡을 축",
    "",
    markdownList(summaryAnchors),
    "",
    "## 핵심 용어 빠른 복습",
    "",
    markdownList(quickTerms),
    "",
    "## 교수님께 바로 할 문장",
    "",
    markdownList(oralLines),
    "",
  ].join("\n");
}

function buildShortQuiz(spec) {
  const conceptItems = spec.concepts.map((concept) => ({
    question: `다음 설명에 해당하는 용어는? ${concept.definition}`,
    accepted_answers: concept.answers || [concept.term],
    answer_type: "term",
    explanation: `${concept.term}은(는) ${concept.significance}`,
    source: concept.source,
  }));
  const items = conceptItems.concat(spec.facts).slice(0, 15);
  assert(items.length === 15, `${spec.slug}: quiz-short items must be exactly 15`);
  return {
    title: `${spec.title} 단답형 퀴즈`,
    instructions: "각 문항은 한 용어, 한 짧은 구, 한 이름, 한 숫자처럼 짧게 답하세요.",
    items,
  };
}

function buildOxQuiz(spec) {
  const trueItems = spec.concepts
    .slice(0, 8)
    .map((concept) => ({
      prompt: `${concept.term}은(는) ${concept.definition}`,
      answer: "O",
      explanation: concept.significance,
      source: concept.source,
    }))
    .concat(spec.ox_true.slice(0, 2));
  const falseItems = spec.pitfalls
    .map((pitfall) => ({
      prompt: pitfall.wrong,
      answer: "X",
      explanation: pitfall.right,
      source: "헷갈리는 포인트",
    }))
    .concat(spec.ox_false || []);
  const items = trueItems.concat(falseItems).slice(0, 15);
  assert(items.length === 15, `${spec.slug}: quiz-ox items must be exactly 15`);
  return {
    title: `${spec.title} OX 퀴즈`,
    instructions: "문장이 맞으면 O, 틀리면 X를 고른 뒤 바로 아래 설명으로 이유를 확인하세요.",
    items,
  };
}

function buildMcqQuiz(spec) {
  const termPool = spec.concepts.map((concept) => concept.term);
  const factPool = spec.facts.map((fact) => fact.accepted_answers[0]);
  const conceptItems = spec.concepts.map((concept, index) => ({
    prompt: `다음 설명에 해당하는 용어는 무엇인가? ${concept.definition}`,
    options: [concept.term].concat(cyclingPool(termPool, index + 1, 3, concept.term)),
    answer: concept.term,
    explanation: `${concept.term}: ${concept.significance}`,
    source: concept.source,
  }));
  const factItems = spec.facts.map((fact, index) => ({
    prompt: fact.mcq_prompt || fact.question,
    options: [fact.accepted_answers[0]].concat(cyclingPool(factPool, index + 1, 3, fact.accepted_answers[0])),
    answer: fact.accepted_answers[0],
    explanation: fact.explanation,
    source: fact.source,
  }));
  const items = conceptItems
    .concat(factItems)
    .slice(0, 15)
    .map((item) => ({ ...item, options: item.options.slice(0, 4) }));
  assert(items.length === 15, `${spec.slug}: quiz-mcq items must be exactly 15`);
  return {
    title: `${spec.title} 객관식 퀴즈`,
    instructions: "보기 4개 중 가장 맞는 답을 고르고, 설명으로 왜 맞는지 확인하세요.",
    items,
  };
}

function buildProfessorPrep(spec) {
  const cards = spec.oral_cards.map((card) => ({
    question: card.question,
    answer_10s: card.core,
    answer_30s: `${card.core} ${card.expansion}`.trim(),
    answer_60s: `${card.core} ${card.expansion} ${card.implication} 한계는 ${card.limit}`.trim(),
    must_include_keywords: card.keywords,
    evidence_from_reading: card.evidence,
    likely_followups: card.followups || DEFAULT_FOLLOWUPS.slice(0, 4),
    followup_answers: [
      { question: "그게 뭐야?", answer: card.core },
      { question: "왜 그렇게 보는데?", answer: card.evidence[0] },
      { question: "한국에서는 어떻게 보이는데?", answer: card.korea },
      { question: "그 설명의 한계는 뭐야?", answer: card.limit },
    ],
    korean_context_link: card.korea,
    personal_connection_hint: card.personal,
    avoid_bad_answers: [
      "질문보다 넓은 일반론으로 흐리지 않기",
      `키워드 ${card.keywords[0]}만 던지고 설명을 멈추지 않기`,
      "한계를 말하지 않은 채 단정적으로 끝내지 않기",
    ],
  }));
  assert(cards.length >= 8 && cards.length <= 12, `${spec.slug}: professor prep cards must be 8 to 12`);
  return {
    title: `${spec.title} 교수님 구술 대비`,
    instructions: "질문에 먼저 직답한 뒤, 10초·30초·60초 답변과 꼬리질문 대응을 비교하세요. 추상적인 감상보다 개념, 근거, 한계, 한국 맥락을 붙이는 연습에 맞춰져 있습니다.",
    followup_bank: DEFAULT_FOLLOWUPS,
    cards,
  };
}

function getReadingPaths(spec) {
  const contentDir = path.join(ROOT_DIR, "content", "readings", spec.slug);
  return {
    raw: path.join(contentDir, "raw.txt"),
    full: path.join(contentDir, "full.md"),
    summary: path.join(contentDir, "summary.md"),
    translation: path.join(contentDir, "translation.md"),
    concepts: path.join(contentDir, "concepts.md"),
    pitfalls: path.join(contentDir, "pitfalls.md"),
    review: path.join(contentDir, "review-sheet.md"),
    quizOx: path.join(contentDir, "quiz-ox.json"),
    quizShort: path.join(contentDir, "quiz_short.json"),
    quizMcq: path.join(contentDir, "quiz-mcq.json"),
    professorPrep: path.join(contentDir, "professor_prep.json"),
  };
}

async function getPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist/legacy/build/pdf.mjs");
  }
  return pdfjsPromise;
}

function itemsToParagraphs(items) {
  const lines = [];
  let currentLine = [];
  let currentY = null;
  let previousY = null;
  for (const item of items) {
    const raw = String(item.str || "").trim();
    if (!raw) {
      continue;
    }
    const y = Number(item.transform?.[5] || 0);
    if (currentY !== null && Math.abs(y - currentY) > 2) {
      lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim());
      if (previousY !== null && Math.abs(previousY - currentY) > 16) {
        lines.push("");
      }
      currentLine = [];
      previousY = currentY;
    }
    currentLine.push(raw);
    currentY = y;
  }
  if (currentLine.length) {
    lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim());
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

async function extractPdfPages(sourcePdf) {
  const pdfjs = await getPdfjs();
  const pdfPath = path.join(ROOT_DIR, sourcePdf);
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const standardFontDataUrl = `${pathToFileURL(path.join(ROOT_DIR, "node_modules", "pdfjs-dist", "standard_fonts")).href}/`;
  const doc = await pdfjs.getDocument({
    data,
    standardFontDataUrl,
    disableFontFace: true,
    useSystemFonts: true,
  }).promise;
  const pages = [];
  for (let index = 1; index <= doc.numPages; index += 1) {
    const page = await doc.getPage(index);
    const text = await page.getTextContent();
    pages.push(itemsToParagraphs(text.items));
  }
  return pages;
}

async function writeRawAndFull(spec) {
  const paths = getReadingPaths(spec);
  const pages = await extractPdfPages(`source_pdfs/${spec.source_filename}`);
  const rawBody = pages.map((pageText, index) => `## Page ${index + 1}\n\n${pageText}`).join("\n\n");
  writeText(paths.raw, [
    `Title: ${spec.title}`,
    `Source PDF: source_pdfs/${spec.source_filename}`,
    "Extractor: pdfjs-dist",
    "",
    rawBody,
    "",
  ].join("\n"));
  writeText(paths.full, [
    `# ${spec.title}`,
    "",
    `> source: \`source_pdfs/${spec.source_filename}\``,
    "",
    rawBody,
    "",
  ].join("\n"));
}

function writeContentFiles(spec) {
  const paths = getReadingPaths(spec);
  writeText(paths.summary, buildSummaryMarkdown(spec));
  writeText(paths.concepts, buildConceptsMarkdown(spec));
  writeText(paths.pitfalls, buildPitfallsMarkdown(spec));
  writeText(paths.review, buildReviewSheetMarkdown(spec));
  writeText(paths.quizOx, `${JSON.stringify(buildOxQuiz(spec), null, 2)}\n`);
  writeText(paths.quizShort, `${JSON.stringify(buildShortQuiz(spec), null, 2)}\n`);
  writeText(paths.quizMcq, `${JSON.stringify(buildMcqQuiz(spec), null, 2)}\n`);
  writeText(paths.professorPrep, `${JSON.stringify(buildProfessorPrep(spec), null, 2)}\n`);
  const translation = buildTranslationMarkdown(spec);
  if (translation) {
    writeText(paths.translation, translation);
  }
}

function upsertManifestEntry(manifest, spec) {
  const existingIndex = manifest.readings.findIndex((reading) => reading.source_filename === spec.source_filename);
  const nextEntry = {
    slug: spec.slug,
    title: spec.title,
    subtitle: spec.subtitle,
    authors: spec.authors,
    year: spec.year,
    language: spec.language,
    kind: spec.kind,
    source_filename: spec.source_filename,
    source_pdf: `source_pdfs/${spec.source_filename}`,
    content_dir: `content/readings/${spec.slug}`,
    tags: spec.tags,
    description: spec.description,
    metadata_status: "complete",
    metadata_notes: [
      "제목과 저자 정보는 현재 로컬 PDF 1페이지 기준으로 보정했다.",
      "수업 날짜 관련 필드는 확인되지 않아 null을 유지했다.",
    ],
    type: spec.type,
    class_date: null,
    reading_date: null,
    sort_date: null,
    display_date_label: null,
  };
  if (existingIndex === -1) {
    manifest.readings.push(nextEntry);
  } else {
    manifest.readings[existingIndex] = {
      ...manifest.readings[existingIndex],
      ...nextEntry,
    };
  }
}

function buildSite() {
  buildStaticSite();
}

function expectedPageFiles(language) {
  const files = BASE_PAGE_FILES.slice();
  if (language === "en") {
    files.splice(3, 0, "translation.html");
  }
  return files;
}

function verifyReadingBuild(spec) {
  const readingDir = path.join(ROOT_DIR, "docs", "readings", spec.slug);
  const files = expectedPageFiles(spec.language);
  for (const file of files) {
    const fullPath = path.join(readingDir, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`missing built page: ${path.relative(ROOT_DIR, fullPath)}`);
    }
  }
  return files.length;
}

function renderPrompt() {
  const lines = [
    "# Post-midterm Batch Prompt",
    "",
    "This repository run is constrained to the exact post-midterm reading set only.",
    "",
    "Target source files in required processing order:",
    "",
  ];
  TARGET_ORDER.forEach((item, index) => {
    lines.push(`${index + 1}. \`${item.source_filename}\``);
  });
  lines.push(
    "",
    "Core repository rules:",
    "",
    "- `docs/` is the only final generated build output folder.",
    "- Keep everything offline and relative-path only.",
    "- Homepage and shared UI stay Korean-first unless original English should remain.",
    "- `manifest/readings.json` is the source of truth.",
    "- Do not hardcode content directly into HTML when avoidable.",
    "- Keep reading overview pages visually aligned with article pages.",
    "",
    "Per-reading deliverables:",
    "",
    "- `index.html`",
    "- `full.html`",
    "- `summary.html`",
    "- `translation.html` for English readings only",
    "- `concepts.html`",
    "- `pitfalls.html`",
    "- `review-sheet.html`",
    "- `professor-prep.html`",
    "- `quiz-ox.html`",
    "- `quiz-short.html`",
    "- `quiz-mcq.html`",
    "",
    "Stop condition:",
    "",
    "Process every processable target reading in the list above, or log blockers clearly and continue until the list is exhausted.",
    ""
  );
  return lines.join("\n");
}

function renderPlan() {
  const lines = [
    "# Post-midterm Batch Plan",
    "",
    "Milestones in exact target source-file order:",
    "",
  ];
  TARGET_ORDER.forEach((item, index) => {
    lines.push(`${index + 1}. \`${item.source_filename}\` -> \`${item.slug}\``);
  });
  lines.push(
    "",
    "Execution sequence:",
    "",
    "1. Ensure durable memory files reflect the fixed post-midterm scope.",
    "2. Extract `raw.txt` and `full.md` for target readings only.",
    "3. Update manifest metadata conservatively from the current local PDFs.",
    "4. Generate or update reading content in the order above.",
    "5. After each reading:",
    "   - rebuild `docs`",
    "   - verify required page files exist",
    "   - update `Status.md`",
    "6. If a source PDF is missing or extraction quality is too poor:",
    "   - log the exact blocker to `FailureLog.md`",
    "   - continue with the next target reading",
    "7. Finish with a full rebuild and concise batch summary.",
    ""
  );
  return lines.join("\n");
}

function renderFailureLog(blockers) {
  return [
    "# Failure Log",
    "",
    "Use this file to capture exact blockers without stopping the batch.",
    "",
    "Current blockers:",
    "",
    ...(blockers.length ? blockers : ["- None logged."]),
    "",
  ].join("\n");
}

function renderStatus(statusMap, blockers, summary) {
  const lines = [
    "# Post-midterm Batch Status",
    "",
    `Run date: ${todayLabel()}`,
    "",
    "Current phase:",
    "",
    "- Post-midterm target batch in progress or complete",
    "- Site rebuild and page verification are performed after each processed reading",
    "",
    "Per-reading status:",
    "",
  ];
  TARGET_ORDER.forEach((item) => {
    lines.push(`- \`${item.slug}\`: ${statusMap[item.slug] || "pending"}`);
  });
  lines.push("", "Batch summary:", "");
  if (summary) {
    lines.push(`- completed readings: ${summary.completed.join(", ") || "none"}`);
    lines.push(`- blocked readings: ${summary.blocked.join(", ") || "none"}`);
    lines.push(`- files changed: ${summary.files_changed.join(", ")}`);
    lines.push(`- pages generated: ${summary.pages_generated}`);
    lines.push("- top items needing manual review:");
    summary.manual_review.forEach((item) => lines.push(`- ${item}`));
  } else {
    lines.push("- completed readings: in progress");
    lines.push(`- blocked readings: ${blockers.length ? blockers.length : "none"}`);
    lines.push("- files changed: in progress");
    lines.push("- pages generated: in progress");
    lines.push("- top items needing manual review:");
    lines.push("- pending final summary");
  }
  lines.push("");
  return lines.join("\n");
}

function writeMemoryFiles(statusMap, blockers, summary = null) {
  writeText(PROMPT_PATH, renderPrompt());
  writeText(PLAN_PATH, renderPlan());
  writeText(FAILURE_LOG_PATH, renderFailureLog(blockers));
  writeText(STATUS_PATH, renderStatus(statusMap, blockers, summary));
}

async function main() {
  const manifest = loadManifest();
  const statusMap = Object.fromEntries(TARGET_ORDER.map((item) => [item.slug, "pending"]));
  const blockers = [];
  let pagesGenerated = 0;

  writeMemoryFiles(statusMap, blockers, null);

  for (const item of TARGET_ORDER) {
    const spec = SPECS[item.slug];
    assert(spec, `Missing content spec for ${item.slug}`);
    try {
      upsertManifestEntry(manifest, spec);
      saveManifest(manifest);
      await writeRawAndFull(spec);
      writeContentFiles(spec);
      buildSite();
      pagesGenerated += verifyReadingBuild(spec);
      statusMap[item.slug] = "needs-review";
      writeMemoryFiles(statusMap, blockers, null);
    } catch (error) {
      statusMap[item.slug] = "blocked";
      blockers.push(`- \`${item.slug}\`: ${error.message}`);
      writeMemoryFiles(statusMap, blockers, null);
    }
  }

  buildSite();
  assert(fs.existsSync(SITE_INDEX_PATH), "missing docs/index.html after final build");

  const completed = TARGET_ORDER.filter((item) => statusMap[item.slug] !== "blocked").map((item) => item.slug);
  const blocked = TARGET_ORDER.filter((item) => statusMap[item.slug] === "blocked").map((item) => item.slug);
  const summary = {
    completed,
    blocked,
    files_changed: [
      "Prompt.md",
      "Plan.md",
      "Status.md",
      "FailureLog.md",
      "manifest/readings.json",
      "scripts/post_midterm_batch.js",
      "scripts/post_midterm_specs.js",
      "content/readings/<target-slug>/*",
      "docs/index.html",
      "docs/readings/<target-slug>/*",
    ],
    pages_generated: `${pagesGenerated + 1} pages including docs/index.html`,
    manual_review: [
      "영어 읽기의 translation 페이지는 학습용 한국어 번역이므로 시험 전 원문과 주요 문장을 대조해 보는 것이 안전하다.",
      "자동 추출한 full 페이지는 PDF 레이아웃 영향을 받아 문단 경계가 완벽하지 않을 수 있다.",
      "교수님 구술 대비 카드는 공격적인 후속 질문에 맞춰 작성했지만, 실제 수업 어조에 맞게 한 번 소리 내어 다듬는 편이 좋다.",
    ],
  };
  writeMemoryFiles(statusMap, blockers, summary);
  console.log("[done] post-midterm batch complete");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
