# Project: Adult Aging Reading Site

## Goal
Build a local-only static study website for course readings.

## Non-negotiable rules
- Use only static HTML, CSS, and vanilla JavaScript.
- No React, no database, no server framework.
- All links must be relative paths and work offline.
- Home page must look like a YouTube-style responsive card grid.
- One card = one reading.
- Keep the current real local reading inventory as the source of truth. Do not collapse the project back to any sample subset.
- Each reading has its own landing page and separate HTML pages for:
  - `full.html`
  - `summary.html`
  - `translation.html` for English readings only
  - `concepts.html`
  - `pitfalls.html`
  - `quiz-ox.html`
  - `quiz-short.html`
  - `quiz-mcq.html`
  - `review-sheet.html`
  - `professor-prep.html`
- Reading landing pages should use a study-flow layout that guides this order:
  - quick overview
  - full text
  - translation if applicable
  - concepts
  - pitfalls
  - quizzes
  - review sheet
  - professor prep
- Do not hardcode content directly into HTML when possible.
- Store content in `/content/readings/<slug>/` and generate pages from it.
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
- Keep everything local/private. Do not add deployment config.
- Missing content must show a graceful placeholder page, not a broken link.

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

## Build rules
- Scripts go into `/scripts`
- Final built site goes into `/docs`
- Use `manifest/readings.json` as source of truth
- Keep organization date-based, not week-based
- Manifest entries may include optional fields such as:
  - `class_date`
  - `reading_date`
  - `sort_date`
  - `display_date_label`
- Do not invent unknown dates. Use `null`, empty values, or TODO placeholders.

