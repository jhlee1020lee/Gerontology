const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const { TARGET_ORDER, SPECS } = require("./post_midterm_specs");
const { buildSite: buildStaticSite } = require("./build_site");
const {
  READING_STATUS,
  buildValidationSnapshot,
  mergeValidationFields,
  validateBuildArtifacts,
} = require("./validate_content");

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

function toText(value) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function firstNonEmpty(...values) {
  for (const value of values) {
    const text = toText(value);
    if (text) {
      return text;
    }
  }
  return "";
}

function ensureSentence(value) {
  const text = toText(value);
  if (!text) {
    return "";
  }
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function isEnglishLike(value) {
  return /^[A-Za-z][A-Za-z0-9+ /().,:&'-]*$/.test(toText(value));
}

function englishTermForConcept(concept) {
  if (isEnglishLike(concept.term)) {
    return toText(concept.term);
  }
  const answers = Array.isArray(concept.answers) ? concept.answers : [];
  const englishAnswer = answers.find((answer) => isEnglishLike(answer));
  return firstNonEmpty(englishAnswer, concept.term);
}

function koreanLabelForConcept(concept) {
  return firstNonEmpty(concept.korean_label, concept.korean_term, concept.label_ko, concept.term);
}

function studentExplanationForConcept(concept) {
  const definition = toText(concept.definition);
  const significance = toText(concept.significance);
  if (!definition && !significance) {
    return "정의와 사례를 같이 붙여서 자기 말로 다시 설명할 필요가 있다.";
  }
  if (!significance) {
    return `쉽게 말해 ${definition}라는 뜻이다.`;
  }
  return `쉽게 말해 ${definition}라는 뜻이고, 이 읽기에서는 ${ensureSentence(significance).replace(/[.!?]$/, "")}는 점까지 같이 잡아야 한다.`;
}

function confusionPointForConcept(concept) {
  const source = toText(concept.source);
  const englishTerm = englishTermForConcept(concept);
  if (source) {
    return `${englishTerm}을(를) 일반 상식 수준으로 넓게 외우지 말고, 이 읽기에서는 ${source} 맥락의 개념으로 붙여서 이해해야 한다.`;
  }
  return `${englishTerm}과(와) 비슷한 표현을 섞지 말고 정의와 쓰인 맥락을 함께 외워야 한다.`;
}

function summaryImportanceLine(spec, section, index) {
  return firstNonEmpty(
    section.bullets[1],
    spec.summary.conclusion[index],
    spec.summary.conclusion[0],
    spec.summary.one_line
  );
}

function summaryClassroomLine(spec, section, index) {
  return firstNonEmpty(
    section.bullets[2],
    spec.summary.conclusion[index + 1],
    spec.summary.conclusion[index],
    spec.summary.conclusion[0],
    spec.summary.one_line
  );
}

function dedupeProfessorPrepCards(cards) {
  const seen = new Set();
  return cards.filter((card) => {
    const title = toText(card.title);
    const answer_30s = toText(card.answer_30s);
    if (!title || !answer_30s) {
      return false;
    }
    const key = `${title}::${answer_30s}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function buildSummaryMarkdown(spec) {
  {
    const sections = spec.summary.sections
      .map((section, index) => {
        const claim = firstNonEmpty(section.bullets[0], spec.summary.one_line);
        const importance = summaryImportanceLine(spec, section, index);
        const classroomPoint = summaryClassroomLine(spec, section, index);
        return [
          `## ${index + 1}. ${section.title}`,
          "",
          `- 핵심 주장: ${claim}`,
          `- 왜 중요한지: ${importance}`,
          `- 수업에서 붙일 포인트: ${classroomPoint}`,
        ].join("\n");
      })
      .join("\n\n");
    return [
      "# 핵심 요약",
      "",
      "## 핵심 주장",
      "",
      `- ${spec.summary.one_line}`,
      "",
      sections,
      "",
      "## 결론 정리",
      "",
      markdownList(spec.summary.conclusion),
      "",
    ].join("\n");
  }
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
  {
    const sections = spec.concepts
      .map((concept, index) => [
        `## ${index + 1}. ${koreanLabelForConcept(concept)}`,
        "",
        `- 한국어 개념명: ${koreanLabelForConcept(concept)}`,
        `- Original English term: ${englishTermForConcept(concept)}`,
        `- 정확한 한 줄 정의: ${ensureSentence(concept.definition)}`,
        `- 학생 말투로 풀어쓴 설명: ${studentExplanationForConcept(concept)}`,
        `- 왜 이 글에서 중요한지: ${ensureSentence(concept.significance)}`,
        `- 자주 헷갈리는 포인트: ${confusionPointForConcept(concept)}`,
        "",
      ].join("\n"))
      .join("\n");
    return [
      "# 핵심 개념",
      "",
      "영어 용어, 정확한 정의, 학생 말투 설명, 중요 포인트를 한 번에 다시 확인할 수 있게 정리한다.",
      "",
      sections,
    ].join("\n");
  }
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
  {
    const generatedCards = [];
    spec.oral_cards.forEach((card, index) => {
      const keyword = firstNonEmpty(card.keywords?.[0], `핵심 포인트 ${index + 1}`);
      const baseAnswer = [card.core, card.expansion].map(toText).filter(Boolean).join(" ");
      const implicationAnswer = [card.implication, card.core].map(toText).filter(Boolean).join(" ");
      const koreaAnswer = [card.korea, card.core].map(toText).filter(Boolean).join(" ");
      const limitAnswer = [card.limit, card.core].map(toText).filter(Boolean).join(" ");
      const evidenceAnswer = [card.evidence?.[0], card.core].map(toText).filter(Boolean).join(" ");

      generatedCards.push({
        title: toText(card.question),
        answer_30s: baseAnswer,
      });
      if (implicationAnswer) {
        generatedCards.push({
          title: `${keyword}가 왜 중요한가?`,
          answer_30s: implicationAnswer,
        });
      }
      if (koreaAnswer) {
        generatedCards.push({
          title: `${keyword}를 한국 맥락에 붙이면?`,
          answer_30s: koreaAnswer,
        });
      }
      if (limitAnswer) {
        generatedCards.push({
          title: `${keyword}를 읽을 때 한계는?`,
          answer_30s: limitAnswer,
        });
      }
      if (evidenceAnswer) {
        generatedCards.push({
          title: `${keyword}를 뒷받침하는 근거는?`,
          answer_30s: evidenceAnswer,
        });
      }
    });

    spec.concepts.forEach((concept) => {
      generatedCards.push({
        title: `${koreanLabelForConcept(concept)}를 한 문장으로 설명해보면?`,
        answer_30s: `${ensureSentence(concept.definition)} ${ensureSentence(concept.significance)}`.trim(),
      });
    });

    const cards = dedupeProfessorPrepCards(generatedCards).slice(0, 20);
    assert(cards.length >= 15, `${spec.slug}: professor prep cards must be at least 15`);
    return {
      title: `${spec.title} 교수님 구술 대비`,
      instructions: "각 항목은 '이 글을 어떻게 읽었는지'를 30초 안에 바로 말할 수 있도록 만든 모델 답변이다.",
      cards,
    };
  }
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

function loadJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(readText(filePath));
}

function findManifestEntry(manifest, slug) {
  return manifest.readings.find((reading) => reading.slug === slug);
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

function syncValidationState(manifest, slug, options = {}) {
  const reading = findManifestEntry(manifest, slug);
  assert(reading, `Missing manifest entry for ${slug}`);
  const metaPath = path.join(ROOT_DIR, reading.content_dir, "meta.json");
  const existingMeta = loadJsonIfExists(metaPath) || {};
  const snapshot = buildValidationSnapshot(ROOT_DIR, reading, existingMeta, options);
  const nextMeta = mergeValidationFields(existingMeta, snapshot);
  writeText(metaPath, `${JSON.stringify(nextMeta, null, 2)}\n`);
  Object.assign(reading, {
    content_status: snapshot.content_status,
    workflow_status: snapshot.workflow_status,
    workflow_notes: snapshot.workflow_notes,
    validation_stage1_status: snapshot.validation_status.stage1.status,
    validation_stage2_status: snapshot.validation_status.stage2.status,
    manual_review: snapshot.manual_review,
  });
  return snapshot;
}

function buildSite(options = {}) {
  return buildStaticSite(options);
}

function verifyReadingBuild(reading) {
  const result = validateBuildArtifacts(ROOT_DIR, reading);
  if (result.errors.length) {
    throw new Error(result.errors.join("; "));
  }
  return result.page_count;
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
    "Process one reading, run schema validation plus build-artifact validation, and stop immediately unless the reading reaches `approved`.",
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
    "4. Generate or update reading content in the order above with strengthened `summary`, `concepts`, and professor-prep schema.",
    "5. After each reading:",
    "   - rebuild `docs` for the reading and home page",
    "   - verify built HTML/PDF artifacts",
    "   - run schema validation and write `content_status` / `workflow_status`",
    "   - stop unless the reading reaches `approved`",
    "6. If validation returns `manual_review_required`, `partial`, or `blocked`:",
    "   - write the exact reason to `Status.md` and `FailureLog.md` when needed",
    "   - hand off to manual review or source-data fixes before moving on",
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
    "- Site rebuild, artifact verification, and schema validation are performed after each processed reading",
    "- The batch stops at the first reading that is not `approved`",
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
    lines.push(`- manual review queue: ${summary.manual_review_slugs.join(", ") || "none"}`);
    lines.push(`- partial readings: ${summary.partial.join(", ") || "none"}`);
    lines.push(`- blocked readings: ${summary.blocked.join(", ") || "none"}`);
    lines.push(`- stopped at: ${summary.stopped_at || "none"}`);
    lines.push(`- files changed: ${summary.files_changed.join(", ")}`);
    lines.push(`- pages generated: ${summary.pages_generated}`);
    lines.push("- top items needing manual review:");
    if (summary.manual_review.length) {
      summary.manual_review.forEach((item) => lines.push(`- ${item}`));
    } else {
      lines.push("- none");
    }
  } else {
    lines.push("- completed readings: in progress");
    lines.push("- manual review queue: in progress");
    lines.push("- partial readings: in progress");
    lines.push(`- blocked readings: ${blockers.length ? blockers.length : "none"}`);
    lines.push("- stopped at: in progress");
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
  {
    const manifest = loadManifest();
    const statusMap = Object.fromEntries(TARGET_ORDER.map((item) => [item.slug, "pending"]));
    const blockers = [];
    let pagesGenerated = 0;
    let stoppedAt = null;

    writeMemoryFiles(statusMap, blockers, null);

    for (const item of TARGET_ORDER) {
      const spec = SPECS[item.slug];
      assert(spec, `Missing content spec for ${item.slug}`);
      try {
        upsertManifestEntry(manifest, spec);
        saveManifest(manifest);
        await writeRawAndFull(spec);
        writeContentFiles(spec);
        buildSite({ slug: spec.slug });
        const reading = findManifestEntry(manifest, spec.slug);
        pagesGenerated += verifyReadingBuild(reading);
        const snapshot = syncValidationState(manifest, spec.slug, { requireBuiltArtifacts: true });
        saveManifest(manifest);
        statusMap[item.slug] = snapshot.workflow_status;
        writeMemoryFiles(statusMap, blockers, null);
        if (snapshot.workflow_status !== READING_STATUS.APPROVED) {
          stoppedAt = spec.slug;
          if (
            snapshot.workflow_status === READING_STATUS.PARTIAL ||
            snapshot.workflow_status === READING_STATUS.BLOCKED
          ) {
            snapshot.workflow_notes.forEach((note) => blockers.push(`- \`${spec.slug}\`: ${note}`));
          }
          writeMemoryFiles(statusMap, blockers, null);
          break;
        }
      } catch (error) {
        statusMap[item.slug] = READING_STATUS.BLOCKED;
        blockers.push(`- \`${item.slug}\`: ${error.message}`);
        stoppedAt = item.slug;
        writeMemoryFiles(statusMap, blockers, null);
        break;
      }
    }

    buildSite();
    assert(fs.existsSync(SITE_INDEX_PATH), "missing docs/index.html after final build");

    const completed = TARGET_ORDER.filter((item) => statusMap[item.slug] === READING_STATUS.APPROVED).map((item) => item.slug);
    const manualReviewSlugs = TARGET_ORDER
      .filter((item) => statusMap[item.slug] === READING_STATUS.MANUAL_REVIEW_REQUIRED)
      .map((item) => item.slug);
    const partial = TARGET_ORDER.filter((item) => statusMap[item.slug] === READING_STATUS.PARTIAL).map((item) => item.slug);
    const blocked = TARGET_ORDER.filter((item) => statusMap[item.slug] === READING_STATUS.BLOCKED).map((item) => item.slug);
    const summary = {
      completed,
      manual_review_slugs: manualReviewSlugs,
      partial,
      blocked,
      stopped_at: stoppedAt,
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
      pages_generated: `${pagesGenerated} reading pages validated during the batch`,
      manual_review: manualReviewSlugs.flatMap((slug) => {
        const reading = findManifestEntry(manifest, slug);
        const notes = Array.isArray(reading?.workflow_notes) ? reading.workflow_notes : [];
        if (!notes.length) {
          return [`\`${slug}\`: schema passed but manual review is still required`];
        }
        return notes.map((note) => `\`${slug}\`: ${note}`);
      }),
    };
    writeMemoryFiles(statusMap, blockers, summary);
    console.log("[done] post-midterm batch complete");
    return;
  }
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
