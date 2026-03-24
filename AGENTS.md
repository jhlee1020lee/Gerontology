# Project: Adult Aging Reading Site

## Goal
Maintain a static study website for gerontology course readings that can be previewed locally and shipped from `docs/` as deployable static output.

## Core rules
- Use only static HTML, CSS, and vanilla JavaScript.
- No React, no database, no server framework.
- Keep all generated links relative so the site works offline and from static hosting.
- Home page must remain a YouTube-style responsive card grid.
- One card equals one reading.
- `manifest/readings.json` is the source of truth for reading inventory and build organization.
- Keep the real reading inventory; do not collapse the project to a sample subset.
- Store authored reading content in `content/readings/<slug>/`.
- Generate final site output into `docs/` only.
- Do not create or maintain a parallel `site/` build target.
- Missing content must render a graceful placeholder page, not a broken link.

## Repository and PDF rules
- `docs/` is the only final generated site folder.
- `source_pdfs/` is source/input material. It may exist locally and may or may not be version-controlled.
- Do not assume source PDFs are unavailable for version control, and do not assume they are public deploy targets.
- Distinguish clearly between:
  - source/input PDFs under `source_pdfs/`
  - deployable public PDFs exposed under stable `docs/` paths
- When a reading supports public PDF access, expose the deployable PDF under `docs/` in a stable public path such as `docs/pdfs/<slug>.pdf`.
- Local preview must open `docs/index.html`.

## Workflow rules
- Do not treat the project as one giant all-at-once generation task.
- Preferred workflow is one reading at a time.
- Preferred completion model is staged completion with a validation gate before moving on.
- Future automation should finish one reading before moving to the next reading.
- For English readings, original-text extraction and Korean translation must be handled as separate stages.
- Do not combine extraction, translation, quizzes, professor-prep, and UI/site polish in one low-quality batch.
- Prefer staged completion over one huge weak batch.

### Stage 1 = original extraction
- `개요`
- `전체 글`
- deployable online PDF access when public PDF access is supported

Stage 1 content meaning:
- `전체 글` must contain the full original text only.
- `전체 글` must not use summary-style rewriting, compression, or a clean-overview substitute.
- `전체 글` must preserve section order and the readable full body.
- Photos, tables, figures, and graphs from the source reading must be inserted directly into `전체 글` as image assets.
- Stage 1 must be completed in three contiguous passes:
  - Pass 1: front third of the reading
  - Pass 2: middle third of the reading
  - Pass 3: final third of the reading plus end-to-end extraction QA

### Stage 2 = Korean translation
- `한국어 번역` for English readings only

Stage 2 content meaning:
- `한국어 번역` must contain the full Korean translation of the original reading for English readings.
- `한국어 번역` must not use summary-style translation, abridged translation, selective excerpts, or patchy translation.
- `한국어 번역` must preserve section order and heading structure.
- Photos, tables, figures, and graphs from the source reading must also be inserted directly into `한국어 번역` as image assets in the matching positions.
- Stage 2 must be completed in three contiguous passes:
  - Pass 1: front third translation
  - Pass 2: middle third translation
  - Pass 3: final third translation plus end-to-end translation QA

### Stage 3 = study package
- `핵심 요약`
- `핵심 개념`
- `헷갈리는 포인트`
- `OX 퀴즈`
- `단답형 퀴즈`
- `객관식 퀴즈`
- `시험 직전 정리`
- `교수님 구술 대비`

### Validation gates
- Stage 1 must be complete and validated before Stage 2 starts for a reading.
- Stage 2 must be complete and validated before Stage 3 starts for a reading.
- Stage 1 validation requires:
  - `전체 글` contains the full original text, preserving section order and the readable full body
  - Stage 1 Pass 1-3 are all complete, contiguous, and merged into one readable `full` body
  - photos, tables, figures, and graphs from the source reading are directly inserted as images
  - deployable PDF path exists when public PDF access is supported
  - reading-hub links work
- Stage 2 validation requires:
  - `한국어 번역` is a complete full Korean translation for English readings, preserving section order and heading structure
  - Stage 2 Pass 1-3 are all complete, contiguous, and merged into one readable `translation` body
  - photos, tables, figures, and graphs from the source reading are directly inserted as images
  - reading-hub links work
- If `전체 글` is not full text, the reading is not complete.
- If `한국어 번역` is not a complete full translation, the reading is not complete.
- Such readings must be marked `partial` or `blocked`, not done.
- Stage 3 validation requires:
  - `summary`, `concepts`, `pitfalls`, `review-sheet`, and `professor-prep` exist
  - `quiz-ox`, `quiz-short`, and `quiz-mcq` each contain `15` items
  - all Stage 3 pages are linked from the reading hub

## Hulur benchmark
- `hulur-et-al-2019` is the current workflow and quality benchmark.
- Use Hulur as the model for workflow completeness, extraction completeness, translation completeness, deployable PDF exposure, validation discipline, and professor-prep shape.
- Do not generalize Hulur-specific subject matter into global rules.

## Homepage / ordering rules
- Homepage cards must follow syllabus class-date order, not arbitrary manifest order and not filename order.
- Use weekly class schedule as the primary date source.
- If a reading-list appendix conflicts with the weekly schedule, prefer the weekly schedule.
- Homepage copy must read like a clean reading dashboard only, not build/admin documentation.
- Do not add helper/admin noise such as build counters, generator notes, or manifest references to the homepage UI.

## Page family
Each reading supports the following generated pages:

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

## Content and QA rules
- `summary.html` / `핵심 요약` is the only page where summarization is allowed.
- Never substitute summary content into `full.html`.
- Never substitute summary content into `translation.html`.
- In `full.html` and `translation.html`, do not replace photos, tables, figures, or graphs with text-only placeholders.
- `quiz-short` is true short-answer only.
- Allowed short-answer outputs are:
  - one term
  - one short phrase
  - one name
  - one number
  - under 8 words
- Never use mini-essay prompts in `quiz-short`.
- Never use range answers in `quiz-short`.
- If a page is incomplete, mark the reading partial/blocked instead of pretending it is complete.
- For English readings, translation completeness matters more than batch speed.

## Professor-prep direction
- Professor-prep is for model answers to `이 글을 어떻게 읽었는지`.
- Default target is at least `15` model answers per reading.
- Prefer `15` to `20` when quality allows.
- Each answer should land at about `30` seconds when spoken.
- Do not organize the published page as a broad oral-exam framework.
- Default published item shape is only:
  - `title`
  - `answer_30s`
- Existing source schemas may retain extra historical fields in some readings, but future default generation should target the minimal published schema above.
- Prefer natural spoken Korean, direct explanation, concrete specificity, and class-realistic phrasing over generic summary language.
- The detailed professor-style and page-specific rules live in [CONTENT_RULES.md](CONTENT_RULES.md).

## Detailed spec
- Exact syllabus date order, conflict resolution, homepage-noise rules, page-by-page content rules, translation workflow rules, validation gates, and professor-style guidance are defined in [CONTENT_RULES.md](CONTENT_RULES.md).
- README entry-point documentation is in [README.md](README.md).

## Scope rule
- This repository produces static output only.
- Do not add a server framework or a second deployment/build system.
