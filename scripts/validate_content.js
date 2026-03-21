const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");

const PAGE_STATUS = Object.freeze({
  MISSING: "missing",
  SCHEMA_FAIL: "schema_fail",
  SCHEMA_PASS: "schema_pass",
  APPROVED: "approved",
  NOT_APPLICABLE: "not_applicable",
});

const READING_STATUS = Object.freeze({
  BLOCKED: "blocked",
  PARTIAL: "partial",
  MANUAL_REVIEW_REQUIRED: "manual_review_required",
  APPROVED: "approved",
});

const ARTICLE_PAGE_KEYS = new Set(["full", "translation", "summary", "concepts", "pitfalls", "review-sheet"]);
const QUIZ_PAGE_KEYS = new Set(["quiz-ox", "quiz-short", "quiz-mcq"]);
const NOTEBOOKLM_VIDEO_CANDIDATES = ["notebooklm.mp4", "notebooklm.webm", "notebooklm.mov", "notebooklm.m4v"];
const STAGE2_PAGE_KEYS = ["summary", "concepts", "pitfalls", "review-sheet", "professor-prep", "quiz-ox", "quiz-short", "quiz-mcq"];
const SHORT_ANSWER_TYPES = new Set(["term", "person", "number", "short_phrase"]);

const SUMMARY_BANNED_PATTERNS = [
  /이 읽기에서 .*어떻게 연결되는지 보여 주는 핵심 축이다/,
  /발표에서는 .*한 문장으로 정의한 뒤 바로 근거와 함의를 붙이는 방식이 안전하다/,
  /읽을 때는 .*같은 말인지, 다른 수준의 개념인지 구분해서 따라가면 구조가 잡힌다/,
];

const CONCEPTS_BANNED_PATTERNS = [
  /반복적으로 확인해야 하는 핵심 개념 또는 쟁점이다/,
  /정의, 근거, 함의 순서로 연결해 말하면 수업 답변이 흔들리지 않는다/,
  /원문 용어 확인 필요/,
  /헷갈리는 포인트 확인 필요/,
  /왜 중요한지 설명 보강 필요/,
];

const PITFALLS_BANNED_PATTERNS = [
  /자주 틀리는 말만 반복하고 구체 구분이 없다/,
];

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
}

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(readText(filePath));
}

function toText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function wordCount(value) {
  return toText(value).split(/\s+/).filter(Boolean).length;
}

function countMatches(value, pattern) {
  return [...toText(value).matchAll(pattern)].length;
}

function splitLevelTwoSections(markdown) {
  const text = toText(markdown);
  const matches = [...text.matchAll(/^##\s+(.+)$/gm)];
  if (!matches.length) {
    return [];
  }
  return matches.map((match, index) => {
    const bodyStart = match.index + match[0].length;
    const bodyEnd = index + 1 < matches.length ? matches[index + 1].index : text.length;
    return {
      title: toText(match[1]),
      body: text.slice(bodyStart, bodyEnd).trim(),
    };
  });
}

function statusKeyForPage(pageKey) {
  return pageKey.replace(/-/g, "_");
}

function isEnglishLike(value) {
  return /^[A-Za-z][A-Za-z0-9+ /().,:&'-]*$/.test(toText(value));
}

function isExternalUrl(value) {
  return /^https?:\/\//i.test(toText(value));
}

function detectLocalNotebooklmVideo(rootDir, reading) {
  const contentDir = path.join(rootDir, reading.content_dir);
  for (const filename of NOTEBOOKLM_VIDEO_CANDIDATES) {
    const candidate = path.join(contentDir, filename);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return "";
}

function publicNotebooklmVideoPath(reading, sourcePath) {
  if (!sourcePath) {
    return "";
  }
  return path.posix.join("assets", "videos", reading.slug, path.basename(sourcePath));
}

function resolveNotebooklmVideo(rootDir, reading, existingMeta = {}) {
  const localPath = detectLocalNotebooklmVideo(rootDir, reading);
  const explicitUrl = toText(reading.notebooklm_video_url || existingMeta.notebooklm_video_url);
  const videoUrl = explicitUrl || publicNotebooklmVideoPath(reading, localPath);
  return {
    localPath,
    videoUrl,
    isExternal: isExternalUrl(videoUrl),
  };
}

function normalizeManualReview(value) {
  const manual = value && typeof value === "object" ? value : {};
  return {
    approved_pages: Array.isArray(manual.approved_pages)
      ? manual.approved_pages.map((item) => toText(item)).filter(Boolean)
      : [],
    reviewer: toText(manual.reviewer),
    reviewed_at: toText(manual.reviewed_at) || null,
    notes: Array.isArray(manual.notes) ? manual.notes.map((item) => toText(item)).filter(Boolean) : [],
    blocked_reason: toText(manual.blocked_reason),
  };
}

function withApproval(pageKey, baseStatus, manualReview) {
  if (baseStatus === PAGE_STATUS.SCHEMA_PASS && manualReview.approved_pages.includes(pageKey)) {
    return PAGE_STATUS.APPROVED;
  }
  return baseStatus;
}

function makeResult(status, errors = [], warnings = [], metrics = {}) {
  return { status, errors, warnings, metrics };
}

function missingResult() {
  return makeResult(PAGE_STATUS.MISSING, ["source file is missing"], []);
}

function baseMarkdownChecks(text, minWords) {
  const errors = [];
  const warnings = [];
  const metrics = {
    word_count: wordCount(text),
    section_count: countMatches(text, /^##\s+/gm),
    sub_section_count: countMatches(text, /^###\s+/gm),
    bullet_count: countMatches(text, /^\s*-\s+/gm),
  };
  if (metrics.word_count < minWords) {
    errors.push(`content is too short (<${minWords} words)`);
  }
  return { errors, warnings, metrics };
}

function validateSummaryMarkdown(text) {
  if (!text) {
    return missingResult();
  }
  const { errors, warnings, metrics } = baseMarkdownChecks(text, 120);
  if (metrics.section_count < 3) {
    errors.push("summary needs at least 3 second-level sections");
  }
  if (metrics.bullet_count < 6) {
    errors.push("summary needs at least 6 bullet points");
  }
  if (!/^##\s+(한 줄 핵심|핵심 주장|한눈에 보기)$/m.test(text)) {
    errors.push("summary is missing a lead section such as '한 줄 핵심' or '핵심 주장'");
  }
  if (!/^##\s+(결론 정리|왜 중요한지|논증 흐름|수업에서 잡힐 가능성이 큰 포인트|수업에서 바로 잡힐 포인트)$/m.test(text)) {
    warnings.push("summary should include a dedicated implication, conclusion, or class-facing section");
  }
  SUMMARY_BANNED_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      errors.push(`summary contains banned template phrase: ${pattern}`);
    }
  });
  return makeResult(errors.length ? PAGE_STATUS.SCHEMA_FAIL : PAGE_STATUS.SCHEMA_PASS, errors, warnings, metrics);
}

function validateConceptsMarkdown(text) {
  if (!text) {
    return missingResult();
  }
  const { errors, warnings, metrics } = baseMarkdownChecks(text, 180);
  const sections = splitLevelTwoSections(text);
  metrics.concept_count = sections.length;
  if (sections.length < 5) {
    errors.push("concepts page needs at least 5 concept sections");
  }
  sections.forEach((section, index) => {
    const prefix = `section ${index + 1} (${section.title || "untitled"})`;
    if (!/^- 한국어 개념명:/m.test(section.body)) {
      errors.push(`${prefix}: missing '한국어 개념명'`);
    }
    if (!/^- Original English term:/m.test(section.body)) {
      errors.push(`${prefix}: missing 'Original English term'`);
    }
    if (!/^- 정확한 한 줄 정의:/m.test(section.body)) {
      errors.push(`${prefix}: missing '정확한 한 줄 정의'`);
    }
    if (!/^- 학생 말투로 풀어쓴 설명:/m.test(section.body)) {
      errors.push(`${prefix}: missing '학생 말투로 풀어쓴 설명'`);
    }
    if (!/^- 왜 이 (논문|읽기|장|글)에서 중요한지:/m.test(section.body)) {
      errors.push(`${prefix}: missing '왜 이 ...에서 중요한지'`);
    }
    if (!/^- 자주 헷갈리는 포인트:/m.test(section.body)) {
      errors.push(`${prefix}: missing '자주 헷갈리는 포인트'`);
    }
  });
  CONCEPTS_BANNED_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      errors.push(`concepts page contains banned placeholder or template phrase: ${pattern}`);
    }
  });
  return makeResult(errors.length ? PAGE_STATUS.SCHEMA_FAIL : PAGE_STATUS.SCHEMA_PASS, errors, warnings, metrics);
}

function validatePitfallsMarkdown(text) {
  if (!text) {
    return missingResult();
  }
  const { errors, warnings, metrics } = baseMarkdownChecks(text, 80);
  if (countMatches(text, /^##\s+/gm) < 3) {
    errors.push("pitfalls page needs at least 3 contrast sections");
  }
  const contrastLines = countMatches(text, /^\s*-\s+(오해|바로잡기|왜 중요한가|A vs B|짧은 구분|왜 헷갈리는지|이 글에서 어떻게 읽어야 하는지):/gm);
  if (contrastLines < 9) {
    errors.push("pitfalls page should include explicit contrast labels such as A vs B, 짧은 구분, 오해, 바로잡기, or 왜 중요한가");
  }
  PITFALLS_BANNED_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      errors.push(`pitfalls page contains banned template phrase: ${pattern}`);
    }
  });
  return makeResult(errors.length ? PAGE_STATUS.SCHEMA_FAIL : PAGE_STATUS.SCHEMA_PASS, errors, warnings, metrics);
}

function validateReviewSheetMarkdown(text) {
  if (!text) {
    return missingResult();
  }
  const { errors, warnings, metrics } = baseMarkdownChecks(text, 80);
  if (countMatches(text, /^##\s+/gm) < 3) {
    warnings.push("review sheet should usually have at least 3 second-level sections");
  }
  return makeResult(errors.length ? PAGE_STATUS.SCHEMA_FAIL : PAGE_STATUS.SCHEMA_PASS, errors, warnings, metrics);
}

function validateFullMarkdown(text) {
  if (!text) {
    return missingResult();
  }
  const { errors, warnings, metrics } = baseMarkdownChecks(text, 400);
  return makeResult(errors.length ? PAGE_STATUS.SCHEMA_FAIL : PAGE_STATUS.SCHEMA_PASS, errors, warnings, metrics);
}

function validateTranslationMarkdown(text, fullText) {
  if (!text) {
    return missingResult();
  }
  const { errors, warnings, metrics } = baseMarkdownChecks(text, 200);
  const fullWords = wordCount(fullText);
  if (fullWords) {
    metrics.full_word_count = fullWords;
    metrics.translation_ratio = Number((metrics.word_count / fullWords).toFixed(3));
    if (metrics.translation_ratio < 0.25) {
      errors.push("translation is suspiciously short relative to full text");
    }
  }
  return makeResult(errors.length ? PAGE_STATUS.SCHEMA_FAIL : PAGE_STATUS.SCHEMA_PASS, errors, warnings, metrics);
}

function validateProfessorPrepJson(payload) {
  if (!payload) {
    return missingResult();
  }
  const cards = Array.isArray(payload.cards) ? payload.cards : [];
  const errors = [];
  const warnings = [];
  const metrics = { card_count: cards.length };
  if (cards.length < 15) {
    errors.push("professor-prep needs at least 15 cards");
  }
  cards.forEach((card, index) => {
    if (!card || typeof card !== "object") {
      errors.push(`card ${index + 1} is not an object`);
      return;
    }
    if (!toText(card.title)) {
      errors.push(`card ${index + 1} is missing title`);
    }
    if (!toText(card.answer_30s || card.answer || card.model_answer)) {
      errors.push(`card ${index + 1} is missing answer_30s`);
    }
  });
  return makeResult(errors.length ? PAGE_STATUS.SCHEMA_FAIL : PAGE_STATUS.SCHEMA_PASS, errors, warnings, metrics);
}

function validateQuizPayload(pageKey, payload) {
  if (!payload) {
    return missingResult();
  }
  const items = Array.isArray(payload.items) ? payload.items : [];
  const errors = [];
  const warnings = [];
  const metrics = { item_count: items.length };
  if (items.length !== 15) {
    errors.push(`${pageKey} must contain exactly 15 items`);
  }
  if (pageKey === "quiz-short") {
    items.forEach((item, index) => {
      const acceptedAnswers = Array.isArray(item.accepted_answers)
        ? item.accepted_answers.map((answer) => toText(answer)).filter(Boolean)
        : [];
      if (!acceptedAnswers.length) {
        errors.push(`quiz-short item ${index + 1} is missing accepted_answers`);
      }
      if (!SHORT_ANSWER_TYPES.has(toText(item.answer_type))) {
        errors.push(`quiz-short item ${index + 1} has invalid answer_type`);
      }
      acceptedAnswers.forEach((answer, answerIndex) => {
        if (wordCount(answer) > 7) {
          errors.push(`quiz-short item ${index + 1} answer ${answerIndex + 1} exceeds 7 words`);
        }
      });
    });
  } else {
    items.forEach((item, index) => {
      if (!toText(item.prompt)) {
        errors.push(`${pageKey} item ${index + 1} is missing prompt`);
      }
      if (!toText(item.answer)) {
        errors.push(`${pageKey} item ${index + 1} is missing answer`);
      }
      if (!toText(item.explanation)) {
        errors.push(`${pageKey} item ${index + 1} is missing explanation`);
      }
    });
  }
  return makeResult(errors.length ? PAGE_STATUS.SCHEMA_FAIL : PAGE_STATUS.SCHEMA_PASS, errors, warnings, metrics);
}

function validateLandingVideo(rootDir, reading, existingMeta = {}, options = {}) {
  const { localPath, videoUrl, isExternal } = resolveNotebooklmVideo(rootDir, reading, existingMeta);
  const errors = [];
  const warnings = [];
  const metrics = {
    has_video: Boolean(videoUrl),
    source: localPath ? "local" : (isExternal ? "external" : "missing"),
  };
  if (!videoUrl) {
    errors.push("missing notebooklm video");
  }
  if (options.requireBuiltArtifacts && videoUrl && !isExternal) {
    const builtVideoPath = path.join(rootDir, "docs", ...videoUrl.split("/"));
    if (!fs.existsSync(builtVideoPath)) {
      errors.push(`missing built notebooklm video: ${videoUrl}`);
    }
  }
  return makeResult(errors.length ? PAGE_STATUS.SCHEMA_FAIL : PAGE_STATUS.APPROVED, errors, warnings, metrics);
}

function contentPathForPage(rootDir, reading, pageKey) {
  const contentDir = path.join(rootDir, reading.content_dir);
  if (pageKey === "full") {
    const preferred = path.join(contentDir, "full.md");
    const fallback = path.join(contentDir, "cleaned.md");
    return fs.existsSync(preferred) ? preferred : fallback;
  }
  if (pageKey === "translation") {
    return path.join(contentDir, "translation.md");
  }
  if (pageKey === "summary") {
    return path.join(contentDir, "summary.md");
  }
  if (pageKey === "concepts") {
    return path.join(contentDir, "concepts.md");
  }
  if (pageKey === "pitfalls") {
    return path.join(contentDir, "pitfalls.md");
  }
  if (pageKey === "review-sheet") {
    return path.join(contentDir, "review-sheet.md");
  }
  if (pageKey === "professor-prep") {
    return path.join(contentDir, "professor_prep.json");
  }
  if (pageKey === "quiz-short") {
    return path.join(contentDir, "quiz_short.json");
  }
  return path.join(contentDir, `${pageKey}.json`);
}

function validatePage(rootDir, reading, pageKey, manualReview) {
  if (pageKey === "translation" && reading.language !== "en") {
    return makeResult(PAGE_STATUS.NOT_APPLICABLE, [], [], {});
  }
  const sourcePath = contentPathForPage(rootDir, reading, pageKey);
  if (!fs.existsSync(sourcePath)) {
    return missingResult();
  }
  if (ARTICLE_PAGE_KEYS.has(pageKey)) {
    const text = readText(sourcePath);
    let result;
    if (pageKey === "summary") {
      result = validateSummaryMarkdown(text);
    } else if (pageKey === "concepts") {
      result = validateConceptsMarkdown(text);
    } else if (pageKey === "pitfalls") {
      result = validatePitfallsMarkdown(text);
    } else if (pageKey === "review-sheet") {
      result = validateReviewSheetMarkdown(text);
    } else if (pageKey === "translation") {
      const fullPath = contentPathForPage(rootDir, reading, "full");
      const fullText = fs.existsSync(fullPath) ? readText(fullPath) : "";
      result = validateTranslationMarkdown(text, fullText);
    } else {
      result = validateFullMarkdown(text);
    }
    return { ...result, status: withApproval(pageKey, result.status, manualReview) };
  }
  if (pageKey === "professor-prep") {
    const payload = loadJson(sourcePath);
    const result = validateProfessorPrepJson(payload);
    return { ...result, status: withApproval(pageKey, result.status, manualReview) };
  }
  if (QUIZ_PAGE_KEYS.has(pageKey)) {
    const payload = loadJson(sourcePath);
    const result = validateQuizPayload(pageKey, payload);
    return { ...result, status: withApproval(pageKey, result.status, manualReview) };
  }
  return missingResult();
}

function isPassingStatus(status) {
  return status === PAGE_STATUS.SCHEMA_PASS || status === PAGE_STATUS.APPROVED;
}

function stageStatusFromPages(pageResults, requiredKeys, options = {}) {
  const notes = [];
  let hasFailure = false;
  requiredKeys.forEach((key) => {
    const page = pageResults[key];
    if (!page || page.status === PAGE_STATUS.MISSING || page.status === PAGE_STATUS.SCHEMA_FAIL) {
      hasFailure = true;
      const problems = page ? page.errors : ["missing validator result"];
      notes.push(`${key}: ${problems.join("; ")}`);
    }
  });
  if (options.extraNotes && options.extraNotes.length) {
    hasFailure = true;
    notes.push(...options.extraNotes);
  }
  if (hasFailure) {
    return { status: READING_STATUS.PARTIAL, notes };
  }
  const allApproved = requiredKeys.every((key) => pageResults[key] && pageResults[key].status === PAGE_STATUS.APPROVED);
  if (allApproved) {
    return { status: READING_STATUS.APPROVED, notes: [] };
  }
  return { status: READING_STATUS.MANUAL_REVIEW_REQUIRED, notes: [] };
}

function validateBuildArtifacts(rootDir, reading) {
  const errors = [];
  const readingDir = path.join(rootDir, "docs", "readings", reading.slug);
  const requiredPages = ["index.html", "full.html", "summary.html", "concepts.html", "pitfalls.html", "review-sheet.html", "professor-prep.html", "quiz-ox.html", "quiz-short.html", "quiz-mcq.html"];
  if (reading.language === "en") {
    requiredPages.splice(3, 0, "translation.html");
  }
  requiredPages.forEach((file) => {
    if (!fs.existsSync(path.join(readingDir, file))) {
      errors.push(`missing built page: docs/readings/${reading.slug}/${file}`);
    }
  });
  if (toText(reading.public_pdf)) {
    const publicPdfPath = path.join(rootDir, "docs", ...reading.public_pdf.split("/"));
    if (!fs.existsSync(publicPdfPath)) {
      errors.push(`missing built public pdf: ${reading.public_pdf}`);
    }
  }
  return { errors, page_count: requiredPages.length };
}

function buildValidationSnapshot(rootDir, reading, existingMeta = {}, options = {}) {
  const manualReview = normalizeManualReview(existingMeta.manual_review);
  const landing = validateLandingVideo(rootDir, reading, existingMeta, options);
  const pageResults = {
    full: validatePage(rootDir, reading, "full", manualReview),
    translation: validatePage(rootDir, reading, "translation", manualReview),
    summary: validatePage(rootDir, reading, "summary", manualReview),
    concepts: validatePage(rootDir, reading, "concepts", manualReview),
    pitfalls: validatePage(rootDir, reading, "pitfalls", manualReview),
    "review-sheet": validatePage(rootDir, reading, "review-sheet", manualReview),
    "professor-prep": validatePage(rootDir, reading, "professor-prep", manualReview),
    "quiz-ox": validatePage(rootDir, reading, "quiz-ox", manualReview),
    "quiz-short": validatePage(rootDir, reading, "quiz-short", manualReview),
    "quiz-mcq": validatePage(rootDir, reading, "quiz-mcq", manualReview),
  };

  const stage1Extra = [];
  if (options.requireBuiltArtifacts) {
    const artifactResult = validateBuildArtifacts(rootDir, reading);
    if (artifactResult.errors.length) {
      stage1Extra.push(...artifactResult.errors.filter((message) => message.includes("public pdf")));
    }
  }
  if (landing.status !== PAGE_STATUS.APPROVED) {
    stage1Extra.push(...landing.errors);
  }
  const stage1Required = ["full"].concat(reading.language === "en" ? ["translation"] : []);
  const stage2 = stageStatusFromPages(pageResults, STAGE2_PAGE_KEYS);
  const stage1 = stageStatusFromPages(pageResults, stage1Required, { extraNotes: stage1Extra });

  let readingStatus = READING_STATUS.PARTIAL;
  const readingNotes = [];
  if (manualReview.blocked_reason) {
    readingStatus = READING_STATUS.BLOCKED;
    readingNotes.push(manualReview.blocked_reason);
  } else if (stage1.status === READING_STATUS.PARTIAL || stage2.status === READING_STATUS.PARTIAL) {
    readingStatus = READING_STATUS.PARTIAL;
    readingNotes.push(...stage1.notes, ...stage2.notes);
  } else if (stage1.status === READING_STATUS.APPROVED && stage2.status === READING_STATUS.APPROVED) {
    readingStatus = READING_STATUS.APPROVED;
  } else {
    readingStatus = READING_STATUS.MANUAL_REVIEW_REQUIRED;
  }

  const contentStatus = Object.fromEntries(
    Object.entries(pageResults).map(([pageKey, result]) => [statusKeyForPage(pageKey), result.status])
  );
  contentStatus.index = landing.status;

  const validationStatus = {
    updated_at: new Date().toISOString(),
    require_built_artifacts: Boolean(options.requireBuiltArtifacts),
    landing: {
      status: landing.status,
      errors: landing.errors,
      warnings: landing.warnings,
      metrics: landing.metrics,
    },
    page_results: Object.fromEntries(
      Object.entries(pageResults).map(([pageKey, result]) => [
        statusKeyForPage(pageKey),
        {
          status: result.status,
          errors: result.errors,
          warnings: result.warnings,
          metrics: result.metrics,
        },
      ])
    ),
    stage1,
    stage2,
    reading: {
      status: readingStatus,
      notes: readingNotes,
    },
  };

  return {
    manual_review: manualReview,
    content_status: contentStatus,
    validation_status: validationStatus,
    workflow_status: readingStatus,
    workflow_notes: readingNotes,
  };
}

function mergeValidationFields(basePayload, snapshot) {
  return {
    ...basePayload,
    manual_review: snapshot.manual_review,
    content_status: snapshot.content_status,
    validation_status: snapshot.validation_status,
    workflow_status: snapshot.workflow_status,
    workflow_notes: snapshot.workflow_notes,
  };
}

function loadManifest(rootDir = ROOT_DIR) {
  return loadJson(path.join(rootDir, "manifest", "readings.json"));
}

function validateManifestReadings(rootDir = ROOT_DIR, slugFilter = null, options = {}) {
  const manifest = loadManifest(rootDir);
  const readings = Array.isArray(manifest?.readings) ? manifest.readings : [];
  return readings
    .filter((reading) => !slugFilter || reading.slug === slugFilter)
    .map((reading) => {
      const metaPath = path.join(rootDir, reading.content_dir, "meta.json");
      const existingMeta = loadJson(metaPath) || {};
      return {
        slug: reading.slug,
        snapshot: buildValidationSnapshot(rootDir, reading, existingMeta, options),
      };
    });
}

function renderCliReport(results) {
  const lines = [];
  results.forEach(({ slug, snapshot }) => {
    lines.push(`- ${slug}: ${snapshot.workflow_status}`);
    lines.push(`  - stage1: ${snapshot.validation_status.stage1.status}`);
    lines.push(`  - stage2: ${snapshot.validation_status.stage2.status}`);
  });
  return lines.join("\n");
}

function parseArgs(argv) {
  const args = { slug: null, json: false, requireBuiltArtifacts: false };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--slug") {
      args.slug = argv[index + 1] || null;
      index += 1;
    } else if (token === "--json") {
      args.json = true;
    } else if (token === "--require-built-artifacts") {
      args.requireBuiltArtifacts = true;
    }
  }
  return args;
}

module.exports = {
  PAGE_STATUS,
  READING_STATUS,
  buildValidationSnapshot,
  mergeValidationFields,
  validateBuildArtifacts,
  validateManifestReadings,
};

if (require.main === module) {
  const options = parseArgs(process.argv.slice(2));
  const results = validateManifestReadings(ROOT_DIR, options.slug, {
    requireBuiltArtifacts: options.requireBuiltArtifacts,
  });
  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(renderCliReport(results));
  }
}
