# Adult Aging Reading Site

Local-only static study website scaffold for gerontology readings. The project is manifest-driven, stores authored content under `content/readings/<slug>/`, and builds the offline site into `docs/` as the only final generated output folder.

## Final project rules

- Build with static HTML, CSS, and vanilla JavaScript only.
- Keep everything offline and relative-path only.
- Use `manifest/readings.json` as the source of truth for the reading inventory and build organization.
- Do not hardcode content directly into HTML when avoidable.
- Do not treat `site/` as a parallel build output. `docs/` is the only final generated site folder.
- Local preview must open `docs/index.html`.
- Homepage and shared UI are Korean-first, while original English titles, authors, and source content stay in English where intentionally shown.
- Overview and reading `index.html` pages should visually match the cleaner article-style reading pages.

## Structure

- `AGENTS.md`: project rules for repository work
- `manifest/readings.json`: source of truth for reading metadata and ordering
- `content/readings/<slug>/`: authored content and structured quiz/prep data
- `source_pdfs/`: local source PDFs placed here manually
- `scripts/`: extraction, cleaning, thumbnails, and site generation utilities
- `docs/`: the only generated static HTML/CSS/JS output

## Reading page architecture

Each reading supports separate generated pages:

- `index.html`
- `full.html`
- `summary.html`
- `translation.html` for English readings only
- `concepts.html`
- `pitfalls.html`
- `review-sheet.html`
- `professor-prep.html`
- `quiz-ox.html`
- `quiz-short.html`
- `quiz-mcq.html`

The intended study flow is:

1. quick overview
2. full text
3. translation if applicable
4. concepts
5. pitfalls
6. quizzes
7. review sheet
8. professor prep

Missing content still generates valid placeholder pages so links never break.

## Content model

Each reading lives in `content/readings/<slug>/` and may include:

- `full.md`
- `summary.md`
- `translation.md` for English readings
- `concepts.md`
- `pitfalls.md`
- `review-sheet.md`
- `professor-prep.md`
- `quiz-ox.json`
- `quiz-short.json`
- `quiz-mcq.json`
- `meta.json`

## Short-answer quiz rule

- `quiz-short` is for true short-answer only.
- Do not use mini-essay or descriptive prompts there.
- Accepted answers must be one term, one short phrase, one number, one name, or otherwise under 8 words.

## Professor-prep rule

`professor-prep` is a serious oral-answer training system, not a light reflection page. It should be optimized for a professor who asks how the student read the text, what was interesting or new, pushes with aggressive follow-ups, dislikes vague/generic/AI-sounding answers, and prefers direct concept-based answers in the student's own words.

Professor-prep entries should support:

- `question`
- `answer_10s`
- `answer_30s`
- `answer_60s`
- `must_include_keywords`
- `evidence_from_reading`
- `likely_followups`
- `followup_answers`
- `korean_context_link`
- `personal_connection_hint`
- `avoid_bad_answers`

## Manifest notes

`manifest/readings.json` remains the source of truth. Entries may include optional date-oriented fields:

- `class_date`
- `reading_date`
- `sort_date`
- `display_date_label`

Unknown dates should stay `null`, empty, or explicit TODO placeholders. The home page sorts chronologically when those fields exist and otherwise falls back to manifest order.

## Rebuild locally

1. Put source PDFs into `source_pdfs/` using the filenames referenced in `manifest/readings.json`.
2. Build the site:

```powershell
node scripts/build_site.js
```

3. Open the authoritative generated home page:

```powershell
start docs\\index.html
```

## Optional preprocessing workflow

Extract raw text from PDFs into each reading folder:

```powershell
python scripts/extract_text.py --all
```

Clean extracted text into draft markdown:

```powershell
python scripts/clean_text.py --all
```

Generate thumbnail images from the first PDF page when possible:

```powershell
python scripts/make_thumbnails.py
```

Then rebuild:

```powershell
node scripts/build_site.js
```

## Notes

- The site uses only static HTML, CSS, and vanilla JavaScript.
- All generated links are relative and work offline.
- Reading landing pages are study-flow pages rather than flat link lists.
- Article pages include a generated table of contents, font controls, dark mode, saved reading position, and bookmark / important-mark UI in `localStorage`.
- `docs/` is the only final build output folder and can be regenerated at any time.
