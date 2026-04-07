# Project: Adult Aging Reading Site

## Goal
Maintain a static study website for gerontology course readings that can be previewed locally and shipped from `docs/` as deployable static output.

## Documentation roles
- `CONTENT_RULES.md` is the single source of truth for detailed workflow, validation gates, homepage ordering, and page-family rules.
- `AGENTS.md` is the collaborator-facing summary/checklist and should point back to `CONTENT_RULES.md` instead of restating detailed policy.
- `README.md` is the onboarding entry point and should summarize and link to `CONTENT_RULES.md` rather than redefine detailed policy.
- If documents conflict on detailed policy, follow `CONTENT_RULES.md` and then update the summary docs.

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
- `source_audio/` is source/input lecture-recording material. It may exist locally and may or may not be version-controlled.
- Do not assume source PDFs are unavailable for version control, and do not assume they are public deploy targets.
- Do not assume source audio is public or deployable.
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
- Default working unit is `1 reading x 1 stage x 1 pass`.
- Absolute batching ban: never try to finish an entire reading, multiple stages, or the whole Stage 3 package in one pass.
- Performance/context safety rule: if a pass starts to approach context or token limits, split it into a smaller validated pass before continuing.
- Do not mix generation, review, rewrite, and site polish in the same pass when a smaller pass can be validated first.
- If Stage 3 is in progress, default to `1 page family at a time` rather than generating the whole study package in one shot.

## Terminology convention
- In prose, use the published Korean page-family names: `전체 글`, `한국어 번역`, `교수님 구술 대비`.
- Use `full`, `translation`, and `professor-prep` only for filenames, page keys, routes, or schema/file references.
- When a sentence needs both, write the Korean name first and the file/page key in parentheses.

### Stage 1 = original extraction
- `개요`
- `전체 글`
- deployable online PDF access when public PDF access is supported

Stage 1 content meaning:
- Explanation videos may be added later as landing-page enhancements, but they are not part of Stage 1 completion or validation.
- `전체 글` must contain the full original text only.
- `전체 글` must not use summary-style rewriting, compression, or a clean-overview substitute.
- `전체 글` must preserve section order and the readable full body.
- Photos, tables, figures, and graphs from the source reading must be inserted directly into `전체 글` as image assets.
- Stage 1 must be completed in three contiguous passes:
- Prefer topic/section boundaries over raw PDF page boundaries when the reading has named sections.
- Do not describe public progress or public pages as `Page 1-2`, `Page 3-4`, and so on when a topic-based section split is available.
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
- Prefer topic/section boundaries over raw PDF page boundaries when the reading has named sections.
- Do not describe public progress or public pages as `Page 1-2`, `Page 3-4`, and so on when a topic-based section split is available.
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

Stage 3 execution rule:
- Do not generate the entire Stage 3 package in one pass.
- Preferred Stage 3 order is:
  - `summary`
  - `concepts`
  - `pitfalls`
  - `quiz-ox`
  - `quiz-short`
  - `quiz-mcq`
  - `review-sheet`
  - `professor-prep`
- Validate each Stage 3 page family before moving to the next one.
- If `professor-prep` is being rebuilt from lecture evidence, finish the evidence bundle first, then generate only `3` to `5` draft cards, review them, and expand only after approval.

### Lecture recording workflow
- Treat lecture recordings as a separate workflow from reading-page generation.
- Process one lecture recording at a time.
- Use the weekly PDF and the reading's Stage 1 text as the content anchor.
- Use the lecture transcript as evidence for professor question style, preferred answer shape, and disliked answer patterns.
- Split lecture-recording work into these steps:
  - transcript
  - STT correction
  - PDF-grounded correction
  - question extraction
  - preferred-answer rule extraction
  - disliked-answer rule extraction
  - limited answer generation
  - review and expansion
- `STT correction` means fixing recognizer errors in the raw STT before evidence extraction, while preserving the spoken meaning and sequence.
- Do not infer professor style from raw audio or raw STT alone.
- When generating oral-practice answers from a new recording, start with `3` to `5` answers, review them, and only then expand.
- Do not generate or refresh published `professor_prep.json` from a new recording until `STT correction`, `pdf-grounded correction`, `question extraction`, `preferred-answer rule extraction`, and `disliked-answer rule extraction` are complete.
- After those evidence steps are complete, create only `3` to `5` draft cards first and review them before any larger rebuild.
- Default update mode is partial replacement of only the cards directly supported by the newly approved recording evidence.
- Use a full-page rebuild only when the new evidence changes the overall answer frame, likely follow-up pattern, or preferred answer shape for the reading.
- `/UserInput` is a temporary intake folder only. Rename and move incoming lecture files before analysis starts.
- Store original audio under `source_audio/class-recordings/YYYY-MM-DD-<reading-slug>-class-recording.<ext>`.
- Store raw STT under `transcripts/class-stt/YYYY-MM-DD-<reading-slug>-class-stt.txt`.
- Store corrected STT and downstream evidence files under `transcripts/lecture-workflow/YYYY-MM-DD-<reading-slug>/`.
- Store derived workflow files under `transcripts/lecture-workflow/YYYY-MM-DD-<reading-slug>/`.
- Use `session.json` as the bundle manifest for canonical references and workflow status.

### Validation gates
- Stage 1 must be complete and validated before Stage 2 starts for a reading.
- Stage 2 must be complete and validated before Stage 3 starts for a reading.
- Stage 1 validation requires:
  - `전체 글` (`full`) contains the full original text, preserving section order and the readable full body
  - Stage 1 Pass 1-3 are all complete, contiguous, and merged into one readable `전체 글` (`full`) body
  - photos, tables, figures, and graphs from the source reading are directly inserted as images
  - deployable PDF path exists when public PDF access is supported
  - reading-hub links work
- Stage 2 validation requires:
  - `한국어 번역` (`translation`) is a complete full Korean translation for English readings, preserving section order and heading structure
  - Stage 2 Pass 1-3 are all complete, contiguous, and merged into one readable `한국어 번역` (`translation`) body
  - photos, tables, figures, and graphs from the source reading are directly inserted as images
  - reading-hub links work
- If `전체 글` is not full text, the reading is not complete.
- If `한국어 번역` is not a complete full translation, the reading is not complete.
- Such readings must be marked `partial` or `blocked`, not done.
- Stage 3 validation requires:
  - `핵심 요약` (`summary`), `핵심 개념` (`concepts`), `헷갈리는 포인트` (`pitfalls`), `시험 직전 정리` (`review-sheet`), and `교수님 구술 대비` (`professor-prep`) exist
  - `quiz-ox`, `quiz-short`, and `quiz-mcq` each contain `15` items
  - all Stage 3 pages are linked from the reading hub
- Structural schema checks are useful QA, but they are not the sole definition of Stage 3 completion.

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
- `교수님 구술 대비` (`professor-prep`) is for model answers to `이 글을 어떻게 읽었는지`.
- Default target is at least `15` model answers per reading.
- Prefer `15` to `20` when quality allows.
- Each answer should land at about `30` seconds when spoken.
- Do not organize the published page as a broad oral-exam framework.
- Default published item shape is only:
  - `title`
  - `answer_30s`
- Use `answer_30s` as the canonical field name. Phrases like `30-second model answer` are descriptive labels, not schema keys.
- Existing source schemas may retain extra historical fields in some readings, but future default generation should target the minimal published schema above.
- Prefer natural spoken Korean, direct explanation, concrete specificity, and class-realistic phrasing over generic summary language.
- Use the merged professor-wide rules from `transcripts/lecture-workflow/professor-style-general-rules.md` as the default prior for future `professor-prep` generation and oral-practice question prediction.
- The current professor-wide answer shape is:
  - answer the exact question that was asked
  - open with the point, not with filler
  - move from label to meaning, mechanism, or interpretation
  - use exact terms and distinguish nearby concepts precisely
  - include at least one concrete anchor such as a variable, age, year, method, or context
  - if you mention a reaction or opinion, tie it back to the text immediately
  - for research articles, explain design, variables, findings, and limitations rather than only the conclusion
- The current professor-wide likely follow-up pattern is:
  - `What exactly do you mean?`
  - `Why does that matter?`
  - `What is the difference between A and B?`
  - `Which variable / design / effect are you talking about exactly?`
  - `Is that age difference, cohort difference, period effect, level difference, change rate, or causality?`
  - `What limitation or alternative explanation remains?`
- The detailed professor-style and page-specific rules live in [CONTENT_RULES.md](CONTENT_RULES.md).

## Detailed spec
- Exact syllabus date order, conflict resolution, homepage-noise rules, page-by-page content rules, translation workflow rules, validation gates, and professor-style guidance are defined in [CONTENT_RULES.md](CONTENT_RULES.md).
- README entry-point documentation is in [README.md](README.md).

## Scope rule
- This repository produces static output only.
- Do not add a server framework or a second deployment/build system.
