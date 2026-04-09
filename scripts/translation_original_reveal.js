function toText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeTranslationOriginalRevealConfig(value) {
  const config = value && typeof value === "object" ? value : {};
  return {
    enabled: Boolean(config.enabled),
    alignment_file: toText(config.alignment_file) || "translation_alignment.json",
    mode: toText(config.mode) || "details",
  };
}

const REVEAL_UNITS = new Set(["paragraph", "sentence_group", "context_block"]);

function normalizeRevealUnit(value) {
  const unit = toText(value) || "paragraph";
  return REVEAL_UNITS.has(unit) ? unit : "";
}

function slugifyHeading(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\uac00-\ud7a3\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "section";
}

function isSupplementFigureLabel(value) {
  return /^(table|figure)\s+\d+(?:[\s.:_-].*)?$|^(표|그림)\s*\d+(?:[\s.:_-].*)?$/i.test(toText(value));
}

function isReaderMetaHeading(value) {
  return /^(editor'?s note(?: and author information)?|편집자 주(?: 및 저자 정보)?)$/i.test(toText(value));
}

function isReaderBackmatterHeading(value) {
  return /^(references|publication history|참고문헌|출판 이력)$/i.test(toText(value));
}

function buildHeadingBlock(level, text, usedIds) {
  const label = toText(text);
  if (isSupplementFigureLabel(label)) {
    return {
      type: "inline_label",
      text: label,
      tocExcluded: true,
    };
  }
  const baseId = slugifyHeading(label);
  let id = baseId;
  let suffix = 2;
  while (usedIds.has(id)) {
    id = `${baseId}-${suffix++}`;
  }
  usedIds.add(id);
  const classes = [];
  let tocExcluded = false;
  if (isReaderMetaHeading(label)) {
    tocExcluded = true;
    classes.push("article-meta-heading");
  }
  if (isReaderBackmatterHeading(label)) {
    tocExcluded = true;
    classes.push("article-backmatter-heading");
  }
  return {
    type: "heading",
    level,
    text: label,
    id,
    classes,
    tocExcluded,
  };
}

function figureBlockFromLine(line) {
  const match = String(line || "").match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (!match) {
    return null;
  }
  return {
    type: "figure",
    caption: toText(match[1]),
    assetTarget: toText(match[2]),
  };
}

function parseMarkdownDocument(text, options = {}) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const frontmatterBlocks = [];
  const blocks = [];
  const usedHeadingIds = new Set();
  const collectFrontmatter = Boolean(options.collectFrontmatter);
  const skipFirstTitleHeading = Boolean(options.skipFirstTitleHeading);
  let skippedTitleHeading = false;
  let encounteredContentHeading = false;
  let paragraph = [];
  let listItems = [];
  let quoteLines = [];
  let codeLines = null;

  const pushBlock = (block, preferFrontmatter = false) => {
    if (!block) {
      return;
    }
    if (collectFrontmatter && preferFrontmatter && !encounteredContentHeading) {
      frontmatterBlocks.push(block);
      return;
    }
    blocks.push(block);
  };

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }
    pushBlock({
      type: "paragraph",
      text: paragraph.join(" ").trim(),
    }, true);
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) {
      return;
    }
    pushBlock({
      type: "list",
      items: [...listItems],
    }, true);
    listItems = [];
  };

  const flushQuote = () => {
    if (!quoteLines.length) {
      return;
    }
    pushBlock({
      type: "quote",
      text: quoteLines.join(" ").trim(),
    }, true);
    quoteLines = [];
  };

  const flushCode = () => {
    if (!codeLines) {
      return;
    }
    pushBlock({
      type: "code",
      text: codeLines.join("\n"),
    }, true);
    codeLines = null;
  };

  const pushHeading = (level, textLabel) => {
    encounteredContentHeading = true;
    pushBlock(buildHeadingBlock(level, textLabel, usedHeadingIds));
  };

  for (const rawLine of lines) {
    if (codeLines) {
      if (rawLine.trim().startsWith("```")) {
        flushCode();
        continue;
      }
      codeLines.push(rawLine);
      continue;
    }
    const line = rawLine.trim();
    if (!line || line === ">") {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }
    if (line.startsWith("```")) {
      flushParagraph();
      flushList();
      flushQuote();
      codeLines = [];
      continue;
    }
    const figureBlock = figureBlockFromLine(line);
    if (figureBlock) {
      flushParagraph();
      flushList();
      flushQuote();
      pushBlock(figureBlock, true);
      continue;
    }
    if (line.startsWith("#### ")) {
      flushParagraph();
      flushList();
      flushQuote();
      pushHeading(4, line.slice(5));
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      flushQuote();
      pushHeading(3, line.slice(4));
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      flushQuote();
      pushHeading(2, line.slice(3));
      continue;
    }
    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      flushQuote();
      if (skipFirstTitleHeading && !skippedTitleHeading) {
        skippedTitleHeading = true;
        continue;
      }
      pushHeading(1, line.slice(2));
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      flushQuote();
      listItems.push(line.slice(2).trim());
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      quoteLines.push(line.slice(2).trim());
      continue;
    }
    flushList();
    flushQuote();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  flushQuote();
  flushCode();

  return {
    frontmatterBlocks,
    blocks,
  };
}

function blockPlainText(block) {
  if (!block || typeof block !== "object") {
    return "";
  }
  if (block.type === "paragraph" || block.type === "quote" || block.type === "code" || block.type === "heading" || block.type === "inline_label") {
    return toText(block.text);
  }
  if (block.type === "list") {
    return Array.isArray(block.items) ? block.items.map((item) => toText(item)).filter(Boolean).join(" ") : "";
  }
  if (block.type === "figure") {
    return toText(block.caption);
  }
  return "";
}

function collectLocatableBlocks(document) {
  const blocks = Array.isArray(document?.blocks) ? document.blocks : [];
  const headingStack = [];
  const counters = new Map();
  const locatable = [];

  blocks.forEach((block, flatIndex) => {
    if (block.type === "heading") {
      while (headingStack.length && headingStack[headingStack.length - 1].level >= block.level) {
        headingStack.pop();
      }
      headingStack.push({
        level: block.level,
        text: block.text,
        tocExcluded: Boolean(block.tocExcluded),
      });
      return;
    }
    const headingPath = headingStack.map((item) => item.text);
    const headingMeta = headingStack.map((item) => ({
      level: item.level,
      text: item.text,
      tocExcluded: item.tocExcluded,
    }));
    const counterKey = `${headingPath.join(" > ")}||${block.type}`;
    const blockIndex = counters.get(counterKey) || 0;
    counters.set(counterKey, blockIndex + 1);
    locatable.push({
      ...block,
      flatIndex,
      headingPath,
      headingMeta,
      blockIndex,
      plainText: blockPlainText(block),
    });
  });

  return locatable;
}

function normalizeForMatch(value) {
  return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
}

function normalizedHeadingPath(value) {
  return (Array.isArray(value) ? value : [])
    .map((item) => normalizeForMatch(item))
    .filter(Boolean);
}

function sourceTextForEntry(entry) {
  if (Array.isArray(entry?.source_text)) {
    return entry.source_text.map((item) => toText(item)).filter(Boolean).join("\n\n");
  }
  return toText(entry?.source_text || entry?.hover_text);
}

function locatorForEntry(entry, key) {
  if (!entry || typeof entry !== "object") {
    return {};
  }
  return entry[`${key}_anchor`] || entry[`${key}_locator`] || {};
}

function matchesLocator(block, locator) {
  if (typeof locator.flat_index === "number" && locator.flat_index !== block.flatIndex) {
    return false;
  }
  const normalizedPath = normalizedHeadingPath(locator.heading_path);
  if (normalizedPath.length) {
    const blockPath = normalizedHeadingPath(block.headingPath);
    if (blockPath.length !== normalizedPath.length) {
      return false;
    }
    if (!blockPath.every((item, index) => item === normalizedPath[index])) {
      return false;
    }
  }
  const blockType = toText(locator.block_type || locator.type);
  if (blockType && blockType !== block.type) {
    return false;
  }
  if (typeof locator.block_index === "number" && locator.block_index !== block.blockIndex) {
    return false;
  }
  const excerpt = normalizeForMatch(locator.excerpt || locator.match_text);
  if (excerpt && !normalizeForMatch(block.plainText).includes(excerpt)) {
    return false;
  }
  return true;
}

function resolveLocator(blocks, locator) {
  const matches = blocks.filter((block) => matchesLocator(block, locator));
  if (!matches.length) {
    return { block: null, error: "locator did not match any block" };
  }
  if (matches.length > 1) {
    return { block: null, error: "locator matched multiple blocks" };
  }
  return { block: matches[0], error: "" };
}

function resolveTranslationAlignment(payload, translationDocument, originalDocument, options = {}) {
  const translationBlocks = collectLocatableBlocks(translationDocument);
  const originalBlocks = collectLocatableBlocks(originalDocument);
  const allowedStatuses = new Set((Array.isArray(options.allowedStatuses) && options.allowedStatuses.length ? options.allowedStatuses : ["verified"]).map((item) => toText(item)).filter(Boolean));
  const entries = Array.isArray(payload?.entries) ? payload.entries : [];
  const resolvedEntries = [];
  const errors = [];
  const usedTranslationBlocks = new Set();

  entries.forEach((entry, index) => {
    if (!entry || typeof entry !== "object") {
      errors.push(`entries[${index}] must be an object`);
      return;
    }
    const status = toText(entry.status || "verified");
    if (!allowedStatuses.has(status)) {
      return;
    }
    const id = toText(entry.id);
    if (!id) {
      errors.push(`entries[${index}] is missing id`);
      return;
    }
    const unit = normalizeRevealUnit(entry.unit);
    if (!unit) {
      errors.push(`entries[${index}] (${id}) has unsupported unit`);
      return;
    }
    const translationMatch = resolveLocator(translationBlocks, locatorForEntry(entry, "ko"));
    if (translationMatch.error) {
      errors.push(`entries[${index}] (${id}) ko locator: ${translationMatch.error}`);
      return;
    }
    const originalMatch = resolveLocator(originalBlocks, locatorForEntry(entry, "en"));
    if (originalMatch.error) {
      errors.push(`entries[${index}] (${id}) en locator: ${originalMatch.error}`);
      return;
    }
    const translationBlock = translationMatch.block;
    if (translationBlock.type !== "paragraph") {
      errors.push(`entries[${index}] (${id}) must target a translation paragraph block`);
      return;
    }
    if (usedTranslationBlocks.has(translationBlock.flatIndex)) {
      errors.push(`entries[${index}] (${id}) targets a translation block that is already mapped`);
      return;
    }
    const normalizedOriginalText = normalizeForMatch(originalMatch.block.plainText);
    let sourceText = sourceTextForEntry(entry);
    if (unit === "context_block" && !sourceText) {
      sourceText = originalMatch.block.plainText;
    }
    if (!sourceText) {
      errors.push(`entries[${index}] (${id}) is missing source_text`);
      return;
    }
    const normalizedSourceText = normalizeForMatch(sourceText);
    if (unit === "paragraph" && normalizedOriginalText !== normalizedSourceText) {
      errors.push(`entries[${index}] (${id}) paragraph unit must match the entire referenced original block`);
      return;
    }
    if (unit === "sentence_group" && !normalizedOriginalText.includes(normalizedSourceText)) {
      errors.push(`entries[${index}] (${id}) source_text does not match the referenced original block`);
      return;
    }
    if (unit === "context_block" && normalizedOriginalText !== normalizedSourceText) {
      errors.push(`entries[${index}] (${id}) context_block unit must match the entire referenced original block`);
      return;
    }
    usedTranslationBlocks.add(translationBlock.flatIndex);
    resolvedEntries.push({
      id,
      unit,
      sourceText,
      translationBlock,
      originalBlock: originalMatch.block,
    });
  });

  return {
    translationBlocks,
    originalBlocks,
    entries: resolvedEntries,
    errors,
  };
}

module.exports = {
  normalizeTranslationOriginalRevealConfig,
  parseMarkdownDocument,
  collectLocatableBlocks,
  resolveTranslationAlignment,
  sourceTextForEntry,
};
