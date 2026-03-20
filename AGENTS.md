# Project: Adult Aging Reading Site

## Goal
Build a local-only static study website for course readings.

## Non-negotiable rules
- Use only static HTML, CSS, and vanilla JavaScript.
- No React, no database, no server framework.
- Keep everything offline and relative-path only.
- Home page must look like a YouTube-style responsive card grid.
- One card = one reading.
- Keep the current real local reading inventory as the source of truth. Do not collapse the project back to any sample subset.
- Use `manifest/readings.json` as the source of truth for the reading inventory and build organization.
- Do not hardcode content directly into HTML when avoidable.
- Store authored reading content in `/content/readings/<slug>/` and generate pages from it.
- Missing content must show a graceful placeholder page, not a broken link.

## Build and output rules
- Scripts go into `/scripts`.
- Final built site goes into `/docs`.
- `/docs` is the only final generated static-site output folder.
- Do not generate or maintain a parallel `/site` output tree.
- Local preview must open `docs/index.html`.
- Keep organization date-based, not week-based.
- Manifest entries may include optional fields such as:
  - `class_date`
  - `reading_date`
  - `sort_date`
  - `display_date_label`
- Do not invent unknown dates. Use `null`, empty values, or TODO placeholders.

## Page architecture
Each reading must support separate pages for:
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

Reading landing pages should use a study-flow layout that guides this order:
- quick overview
- full text
- translation if applicable
- concepts
- pitfalls
- quizzes
- review sheet
- professor prep

Overview and `index.html` pages should visually match the cleaner article-style reading pages, not feel like a separate rough landing screen.

## Reading/page behavior
- Render text in a readable article layout:
  - max width around 820px
  - line-height at least 1.8
  - readable heading hierarchy
- Article pages should support offline reading-comfort features with static HTML/CSS/vanilla JS only:
  - auto-generated table of contents from headings
  - font size controls
  - dark mode toggle
  - save last reading position in `localStorage`
  - bookmark / mark-important UI in `localStorage`
- For thumbnails, render the first page of the source PDF to PNG if possible.

## Content rules
- Korean textbook PDFs:
  - create cleaned Korean full text
  - create key points / quick overview
  - create concepts
  - create pitfalls
  - create review sheet
  - create professor prep notes
  - create 15 OX, 15 short-answer, 15 multiple-choice questions
- English papers/articles:
  - create cleaned English full text
  - create Korean translation
  - create key points in Korean
  - create concepts
  - create pitfalls
  - create review sheet
  - create professor prep notes
  - create 15 OX, 15 short-answer, 15 multiple-choice questions
- Each quiz item must include answer and explanation.
- Keep source section/page metadata when possible.

## Short-answer quiz rule
- Short-answer means true short-answer only.
- Never use mini-essay or descriptive prompts in `quiz-short`.
- Answers must be one term, one short phrase, one number, one name, or otherwise under 8 words.

## Professor-prep rule
- `professor-prep` is a serious oral-answer training system, not a light reflection page.
- Optimize it for a professor who asks how the student read the text, what was interesting or new, pushes with aggressive follow-ups, dislikes vague/generic/AI-sounding answers, and prefers direct concept-based answers in the student's own words.
- `professor-prep` entries should support:
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

## UI and language rules
- Homepage and shared UI should be Korean-first.
- Preserve English only where original English reading titles, authors, or content are intentionally shown.
- Keep shared navigation, labels, and helper UI aligned with the Korean-first interface unless the original source content specifically requires English.

## Privacy rule
- Keep everything local/private. Do not add deployment config.
