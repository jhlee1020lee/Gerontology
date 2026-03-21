# Project: Adult Aging Reading Site

## Goal
Maintain a local-only static study website for gerontology course readings.

## Core rules
- Use only static HTML, CSS, and vanilla JavaScript.
- No React, no database, no server framework.
- Keep everything offline and relative-path only.
- Home page must remain a YouTube-style responsive card grid.
- One card equals one reading.
- `manifest/readings.json` is the source of truth for reading inventory and build organization.
- Keep the real local reading inventory; do not collapse the project to a sample subset.
- Store authored reading content in `content/readings/<slug>/`.
- Generate final site output into `docs/` only.
- Do not create or maintain a parallel `site/` build target.
- Missing content must render a graceful placeholder page, not a broken link.

## Repository and local-file rules
- `docs/` is the only final generated site folder.
- `source_pdfs/` is local-only input. It may exist locally but be absent from git uploads.
- Do not assume source PDFs are version-controlled.
- Keep all generated links relative so the site works fully offline.
- Local preview must open `docs/index.html`.

## Workflow rules
- Do not treat the project as one giant all-at-once generation task.
- Prefer small staged passes:
  - one reading at a time, or
  - one section type at a time when quality requires it.
- Translation for English readings must be handled as its own dedicated per-reading pass.
- Do not combine translation, quizzes, professor-prep, and UI/site polish in one low-quality batch.
- Prefer staged completion over one huge weak batch.

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
- `quiz-short` is true short-answer only. Never use mini-essay prompts there.
- If a page is incomplete, mark the reading partial/blocked instead of pretending it is complete.
- For English readings, translation completeness is more important than batch speed.
- Validate per-reading completeness for full text, translation when required, concepts, pitfalls, all three quiz types, review sheet, and professor-prep.

## Professor-prep direction
- Future professor-prep content must follow the real class style, not a generic oral-exam template.
- Optimize for exact answers to what was interesting, new, important, and how the student read the text.
- Prefer natural spoken Korean, precise concepts, follow-up resistance, and concrete explanation over generic summary language.
- The detailed professor-style and page-specific rules live in [CONTENT_RULES.md](CONTENT_RULES.md).

## Detailed spec
- Exact syllabus date order, conflict resolution, homepage-noise rules, page-by-page content rules, translation workflow rules, and professor-style guidance are defined in [CONTENT_RULES.md](CONTENT_RULES.md).
- README entry-point documentation is in [README.md](README.md).

## Privacy rule
- Keep everything local/private. Do not add deployment config.
