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
- [AGENTS.md](AGENTS.md): repository work rules
- [CONTENT_RULES.md](CONTENT_RULES.md): detailed workflow, validation, date-order, and content appendix
- `manifest/readings.json`: reading inventory and build metadata source of truth
- `content/readings/<slug>/`: authored reading content and structured quiz/prep data
- `source_pdfs/`: source/input PDFs when available
- `scripts/`: build and content-processing utilities
- `docs/`: final generated static site output and deployable public assets

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

Content contract for the main reading pages:
- `full.html` / `전체 글` must contain the full original text only.
- `full.html` must not contain summary-style rewriting, compression, or a clean-overview substitute.
- `full.html` must preserve section order and the readable full body.
- `translation.html` / `한국어 번역` for English readings must contain the full Korean translation of the original reading.
- `translation.html` must not contain summary-style translation, abridged translation, selective excerpts, or patchy translation.
- `translation.html` must preserve section order and heading structure.
- `summary.html` / `핵심 요약` is the only page where summarization is allowed.
- Never substitute summary content into `full.html` or `translation.html`.

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

## Preferred workflow
- Do not treat generation as one huge all-at-once batch.
- Preferred workflow is one reading at a time.
- Future automation should finish one reading before moving to the next reading.
- Use stage-based completion with validation before advancing.

### Stage 1 = content completeness
- `개요`
- `설명 영상`
- `전체 글`
- `한국어 번역` for English readings only
- deployable online PDF access when public PDF access is supported

### Stage 2 = study package
- `핵심 요약`
- `핵심 개념`
- `헷갈리는 포인트`
- `OX 퀴즈`
- `단답형 퀴즈`
- `객관식 퀴즈`
- `시험 직전 정리`
- `교수님 구술 대비`

### Validation gates
- Finish and validate Stage 1 before starting Stage 2 for a reading.
- Stage 1 validation:
  - `설명 영상` exists and is approved for public release
  - `전체 글` contains the full original text, preserving section order and the readable full body
  - `한국어 번역` is a complete full Korean translation for English readings, preserving section order and heading structure
  - deployable PDF path exists when public PDF access is supported
  - reading-hub links work
- If `전체 글` is not full text, the reading is not complete.
- If `한국어 번역` is not a complete full translation, the reading is not complete.
- Such readings must be marked `partial` or `blocked`, not done.
- Stage 2 validation:
  - `summary`, `concepts`, `pitfalls`, `review-sheet`, and `professor-prep` exist and pass schema validation
  - `quiz-ox`, `quiz-short`, and `quiz-mcq` each have `15` items
  - all study pages are linked from the reading hub

### Status model
- Page status uses:
  - `missing`
  - `schema_fail`
  - `schema_pass`
  - `approved`
  - `not_applicable`
- Reading/workflow status uses:
  - `blocked`
  - `partial`
  - `manual_review_required`
  - `approved`
- Automation should stop after the first reading that is not `approved`.
- `schema_pass` means the generated page cleared structural validation, but it still needs manual review before the reading is treated as complete.

## Hulur benchmark
- `hulur-et-al-2019` is the current workflow and quality benchmark reading.
- Future automation should emulate its workflow completeness, translation completeness, public PDF exposure, reading-hub completeness, and validation discipline.
- Hulur is a benchmark for workflow and quality, not for subject matter.

## Key content rules
- Translation for English readings should be a dedicated completeness pass.
- `full.html` / `전체 글` must contain the full original text only.
- `한국어 번역` must be complete full translation, contiguous and unabridged.
- If translation is partial, mark the reading partial/blocked rather than pretending it is complete.
- Never substitute summary content into `full.html` or `translation.html`.
- `summary.html` / `핵심 요약` is the only page where summarization is allowed.
- `quiz-short` must be true short-answer only:
  - one term
  - one short phrase
  - one name
  - one number
  - under 8 words
- Never use mini-essay prompts or range answers in `quiz-short`.
- Professor-prep is only for model answers to `이 글을 어떻게 읽었는지`.
- Future default professor-prep generation should target the minimal published schema:
  - `title`
  - `answer_30s`

## Homepage / date rules
- Homepage order and displayed dates must follow syllabus class-date order.
- Weekly class schedule is the primary truth source for dates.
- If the reading appendix conflicts with the weekly schedule, prefer the weekly schedule.
- Homepage UI should read like a clean reading dashboard only, not build/admin documentation.
- Exact ordering and conflict-resolution details are documented in [CONTENT_RULES.md](CONTENT_RULES.md).

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

## Notes
- The site is Korean-first, while original English titles, author names, and source text stay in English where needed.
- Missing content should still produce a valid placeholder page.
- For the full workflow, validation, translation, homepage, and professor-prep rules, use [CONTENT_RULES.md](CONTENT_RULES.md).
