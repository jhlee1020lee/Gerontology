# Adult Aging Reading Site

Local-only static study website for gerontology course readings.

## What this repo is
- Static HTML, CSS, and vanilla JavaScript only.
- Offline and relative-path only.
- Homepage is a responsive reading-card grid with one card per reading.
- Manifest-driven from `manifest/readings.json`.
- Authored reading content lives under `content/readings/<slug>/`.
- Final generated site output goes to `docs/` only.

## Build / local file rules
- `docs/` is the only final generated site folder.
- `site/` must not exist as a parallel build target.
- `source_pdfs/` is local-only input and is not assumed to be version-controlled.
- Local preview should open `docs/index.html`.

## Current repo structure
- [AGENTS.md](AGENTS.md): repository work rules
- [CONTENT_RULES.md](CONTENT_RULES.md): detailed syllabus/date/content/professor-style rules
- `manifest/readings.json`: reading inventory and build metadata source of truth
- `content/readings/<slug>/`: authored reading content and structured quiz/prep data
- `source_pdfs/`: local source PDFs placed manually when available
- `scripts/`: build and content-processing utilities
- `docs/`: final generated static site output

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

Current authored source files in a reading folder may include:

- `full.md`
- `summary.md`
- `translation.md` for English readings
- `concepts.md`
- `pitfalls.md`
- `review-sheet.md`
- `professor_prep.json`
- `quiz_ox.json`
- `quiz_short.json`
- `quiz_mcq.json`
- `meta.json`

## Workflow
- Do not treat future generation as one huge batch.
- Prefer one reading at a time, or one section type at a time when quality requires it.
- Translation for English readings should be its own dedicated per-reading pass.
- Do not mix translation, quizzes, professor-prep, and UI polish in the same weak batch.
- Prefer staged completion and explicit partial/blocked status over pretending a reading is complete.

## Homepage / date rules
- Homepage order and displayed dates must follow syllabus class-date order.
- Weekly class schedule is the primary truth source for dates.
- If the reading appendix conflicts with the weekly schedule, prefer the weekly schedule.
- Homepage UI should read like a clean reading dashboard only, not build/admin documentation.
- Exact ordering and conflict-resolution details are documented in [CONTENT_RULES.md](CONTENT_RULES.md).

## Professor-prep direction
- Future professor-prep work must follow the real professor's question style.
- Optimize for direct answers, precise concepts, concrete explanation, and natural spoken tone.
- Avoid vague, filler-heavy, generic textbook, or AI-sounding answers.
- Detailed rules are in [CONTENT_RULES.md](CONTENT_RULES.md).

## Build locally
```powershell
node scripts/build_site.js
```

Then open:

```powershell
start docs\index.html
```

## Notes
- The site is Korean-first, while original English titles, author names, and source text stay in English where needed.
- Missing content should still produce a valid placeholder page.
- For the full content, translation, QA, and page-by-page rules, use [CONTENT_RULES.md](CONTENT_RULES.md).
