# Adult Aging Reading Site

Static gerontology reading site built from manifest-driven source content and published from `docs/` as deployable static output.

## What this repo is
- Static HTML, CSS, and vanilla JavaScript only.
- Homepage is a responsive reading-card grid with one card per reading.
- Manifest-driven from `manifest/readings.json`.
- Authored reading content lives under `content/readings/<slug>/`.
- Final generated site output goes to `docs/` only.
- The final output should work both from local file preview and from static hosting because links stay relative.

## Current repo structure
- [AGENTS.md](AGENTS.md): collaborator-facing work-rule summary
- [CONTENT_RULES.md](CONTENT_RULES.md): detailed source of truth for workflow, validation, date-order, and page rules
- `manifest/readings.json`: reading inventory and build metadata source of truth
- `content/readings/<slug>/`: authored reading content and structured quiz/prep data
- `source_audio/`: source/input lecture recordings
- `source_pdfs/`: source/input PDFs when available
- `scripts/`: build and content-processing utilities
- `docs/`: final generated static site output and deployable public assets

When docs conflict on detailed policy, follow [CONTENT_RULES.md](CONTENT_RULES.md).
Treat this README as onboarding only; do not use it to override detailed workflow or approval policy.

## Output and PDF model
- `docs/` is the only final generated site folder.
- `site/` must not exist as a parallel build target.
- `source_pdfs/` should be treated as source/input material. It may exist locally and may or may not be version-controlled.
- Public PDF access is allowed when a reading supports it.
- When a reading exposes a public PDF, the deployable file should live under a stable `docs/` path such as `docs/pdfs/<slug>.pdf`.
- Keep the distinction clear between:
  - source/input PDFs referenced by fields like `source_pdf`
  - deployable public PDFs referenced by fields like `public_pdf`

## Reading/page family
Each reading supports:

- `index.html`
- `summary.html`
- `full.html`
- `translation.html` for English readings only
- `concepts.html`
- `pitfalls.html`
- `quiz-ox.html`
- `quiz-short.html`
- `quiz-mcq.html`
- `review-sheet.html`
- `professor-prep.html`

Common authored source files in a reading folder include:

- `meta.json`
- `full.md`
- `summary.md`
- `translation.md` for English readings
- `concepts.md`
- `pitfalls.md`
- `review-sheet.md`
- `professor_prep.json`
- quiz source JSON files for OX, short-answer, and MCQ pages

## Workflow at a Glance
- Work one reading at a time.
- Treat extraction, translation, study-package pages, and lecture-recording analysis as separate stages.
- Keep `full.html` as full original text and `translation.html` as full Korean translation for English readings.
- Use the long-form reading layout only on `full.html` and `translation.html`; keep summary, quiz, review, and professor-prep pages on their lighter page templates.
- Some approved English `translation.html` pages may also expose per-paragraph original-text reveal using `translation_alignment.json`; treat the detailed rules and approval gate as part of [CONTENT_RULES.md](CONTENT_RULES.md), not README policy.
- Use `summary.html` as the only summarized page.
- Validate each stage before moving to the next one.
- Never do a full-reading all-at-once batch; if a pass starts spanning multiple stages, page families, or context limits, split it again before continuing.
- When a reading has named sections, split work and public-facing structure by topic/section first, not by raw PDF page number.
- Lecture-recording analysis should normally run as `raw STT -> STT correction -> PDF-grounded correction -> evidence extraction -> 3-5 draft answer cards`.
- In prose, prefer `전체 글`, `한국어 번역`, `교수님 구술 대비`; reserve `full`, `translation`, `professor-prep` for file/key references.

Use [CONTENT_RULES.md](CONTENT_RULES.md) for:
- exact Stage 1 / Stage 2 / Stage 3 rules
- validation gates and status meanings
- lecture-recording workflow, bundle files, and refresh rules
- homepage ordering and syllabus date conflict handling
- page-specific content rules and professor-prep rules

## Benchmark
- `hulur-et-al-2019` is the current workflow and quality benchmark reading.
- Use it as a benchmark for completeness and validation discipline, not as a subject-matter template.

## Build locally
```powershell
node scripts/build_site.js
```

Validate content quality/status for one reading:

```powershell
node scripts/validate_content.js --slug hulur-et-al-2019
```

Validate with built HTML/PDF artifacts too:

```powershell
node scripts/validate_content.js --slug hulur-et-al-2019 --require-built-artifacts
```

Approval summary is written to:

```powershell
APPROVAL_STATUS.md
```

Then open:

```powershell
start docs\index.html
```

## Homepage chatbot
- The homepage now supports a floating chatbot widget in the lower-right corner.
- This is a static-site UI only. Do not put `OPENAI_API_KEY` in browser code.
- Configure the public proxy URL in `scripts/site_chatbot_config.js`, then rebuild.
- Setup details and a serverless proxy example live in [CHATBOT_SETUP.md](CHATBOT_SETUP.md).

## Notes
- The site is Korean-first, while original English titles, author names, and source text stay in English where needed.
- Missing content should still produce a valid placeholder page.
- For the full workflow, validation, translation, lecture-recording, homepage, and professor-prep rules, use [CONTENT_RULES.md](CONTENT_RULES.md).
