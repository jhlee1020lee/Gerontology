# Content Rule Appendix

## 1. Repository / build / PDF rules
- `docs/` is the only final generated site output folder.
- `site/` must not exist as a parallel build target.
- Keep all generated links relative so the site works from local files and from static hosting.
- `source_pdfs/` is source/input material. It may exist locally and may or may not be version-controlled.
- `source_audio/` is source/input lecture-recording material. It may exist locally and may or may not be version-controlled.
- Do not assume source PDFs are unavailable for version control.
- Do not assume source audio is public or deployable.
- Do not confuse source/input PDFs with deployable public PDFs.
- When a reading supports public PDF access, the deployable PDF should live under a stable `docs/` path such as `docs/pdfs/<slug>.pdf`.
- In metadata terms:
  - `source_pdf` points to source/input material
  - `pdf_visibility` controls whether deploy HTML may expose a public PDF
  - `public_pdf` points to deployable public output under `docs/`
  - `landing_video_policy` controls whether a missing landing video is treated as optional or required
- `CONTENT_RULES.md` is the single source of truth for detailed workflow, validation gates, homepage ordering, and page-family rules.
- `AGENTS.md` is the collaborator-facing summary/checklist and should point back to this appendix instead of restating detailed policy.
- `README.md` is the onboarding entry point and should summarize and link to this appendix rather than redefine detailed policy.
- If documents conflict on detailed policy, follow this appendix and then update the summary docs.

## 2. Workflow model
- Stop treating the project as one giant all-at-once generation task.
- Preferred workflow is one reading at a time.
- Future automation should finish one reading before moving to the next reading.
- Use stage-based completion with explicit validation gates.
- For English readings, original-text extraction and Korean translation must be separate stages.
- Do not interleave translation, quizzes, professor-prep, and site-polish in one low-quality generation step.
- Prefer staged completion over one huge low-quality batch.
- Default working unit is `1 reading x 1 stage x 1 pass`.
- Absolute batching ban: never try to finish an entire reading, multiple stages, or the whole Stage 3 package in one pass.
- Performance/context safety rule: if a pass starts to approach context or token limits, split it into a smaller validated pass before continuing.
- For Stage 2, keep the published pass model at `Pass 1 / Pass 2 / Pass 3`, but allow and expect many smaller internal translation chunks inside each pass.
- Treat pass boundaries and micro-chunk planning as workflow rules. The current validator checks the merged output, not the historical chunk plan, so keep explicit human work logs when translation spans multiple sessions.
- Do not mix generation, review, rewrite, and site polish in the same pass when a smaller pass can be validated first.
- If Stage 3 is in progress, default to `1 page family at a time` instead of generating the entire study package in one batch.

## 2.1 Terminology convention
- In prose, use the published Korean page-family names: `전체 글`, `한국어 번역`, `교수님 구술 대비`.
- Use `full`, `translation`, and `professor-prep` only for filenames, page keys, routes, or schema/file references.
- When a sentence needs both, write the Korean name first and the file/page key in parentheses.

## 2.2 Status and approval terminology
- `page_status` means the state of one generated page family such as `full`, `translation`, or `summary`.
- `stage1_status`, `stage2_status`, and `stage3_status` mean stage-level approval states for one reading.
- `reading_status` means the overall reading-package approval state for one reading.
- `landing_video_status` means the landing-page / explanation-video enhancement state and must be tracked separately from Stage 1, Stage 2, and Stage 3 completion.
- `lecture_workflow_status` means the lecture-recording workflow state for transcript/evidence bundles and must not be used as shorthand for reading approval.
- Do not use `전체` as a shorthand for whole-reading approval, because `전체 글` already has a published page-family meaning.
- In prose, prefer explicit phrases such as `reading_status`, `Stage 1 approval`, or `전체 글 (full)` instead of ambiguous shorthand.

## 2.3 Workflow-only rules vs machine-enforced rules
- `workflow-only` rules describe how collaborators must execute the work, even when the current scripts do not reconstruct every step automatically.
- `machine-enforced` rules are the checks currently performed by `node scripts/validate_content.js`, `node scripts/build_site.js`, and the `manual_review` hash-matching logic in `meta.json`.
- Examples of `workflow-only` rules today include contiguous pass planning, micro-chunk logs, and human review sequencing.
- Examples of `machine-enforced` rules today include schema checks, built-artifact checks, and approval-hash invalidation when content changes.
- If a workflow rule is stricter than the current code, still follow the workflow rule. Do not claim a rule is machine-enforced unless the current scripts actually gate on it.
- If the user explicitly corrects the workflow, quality bar, chunking strategy, review sequencing, or answer shape in a way that clearly generalizes beyond the current reading, promote that correction into the global rules before continuing substantial new generation work.
- Do not leave repeated user process corrections only in one reading's work log or only in ephemeral chat context when they are clearly meant as standing policy.
- After such a user correction, do a short `policy sync pass`: update `CONTENT_RULES.md`, update `AGENTS.md`, update any reusable lecture-style rule file if relevant, and only then continue the affected reading work.
- If a user correction is intentionally reading-specific rather than global, record that decision explicitly in the reading work log instead of silently assuming it will generalize later.

## 3. Hulur benchmark rule
- `hulur-et-al-2019` is the current workflow and quality benchmark reading.
- Use Hulur as the model for:
  - Stage 1 before Stage 2 before Stage 3 sequencing
  - complete original-text extraction for English readings
  - complete contiguous translation for English readings
  - deployable public PDF exposure
  - reading-hub completeness
  - validation discipline
  - minimal professor-prep published schema
- Do not generalize Hulur-specific subject matter into global rules.

## 4. Stage model

### 4.1 Stage 1 = original extraction
- `개요`
- `전체 글`
- deployable online PDF access when public PDF access is supported

Stage 1 content meaning:
- Stage 1 must be executed in three contiguous passes:
- Prefer topic/section boundaries over raw PDF page boundaries when the reading has named sections.
- Do not describe public progress or public pages as `Page 1-2`, `Page 3-4`, and so on when a topic-based section split is available.
  - Pass 1: front third extraction
  - Pass 2: middle third extraction
  - Pass 3: final third extraction plus end-to-end extraction QA
- Explanation videos may be added later as landing-page enhancements, but they are not part of Stage 1 completion or validation.
- `전체 글` must contain the full original text only.
- `전체 글` must not use summary-style rewriting, compression, or a clean-overview substitute.
- `전체 글` must preserve section order and the readable full body.
- Photos, tables, figures, and graphs from the source reading must be inserted directly into `전체 글` as image assets, not omitted and not replaced with text-only placeholders.

### 4.2 Stage 2 = Korean translation
- `한국어 번역` for English readings only

Stage 2 content meaning:
- `한국어 번역` must contain the full Korean translation of the original reading.
- `한국어 번역` must not use summary-style translation, abridged translation, selective excerpts, or patchy translation.
- `한국어 번역` must preserve section order and heading structure.
- Photos, tables, figures, and graphs from the source reading must also be inserted directly into `한국어 번역` as image assets in the corresponding positions.
- Stage 2 must be executed in three contiguous passes:
- Prefer topic/section boundaries over raw PDF page boundaries when the reading has named sections.
- Do not describe public progress or public pages as `Page 1-2`, `Page 3-4`, and so on when a topic-based section split is available.
  - Treat `front third`, `middle third`, and `final third` as approximate contiguous source-order spans adjusted to the nearest section/topic boundary.
  - Pass 1: front third translation
  - Pass 2: middle third translation
  - Pass 3: final third translation plus end-to-end translation QA
- Internal Stage 2 generation must use smaller micro-chunks whenever a full pass would be too large or unstable to translate cleanly in one shot.
- `source words` means words counted from the current normalized `full.md` text for the reading, not raw PDF OCR, screenshots, or ad hoc copied source text.
- Default Stage 2 micro-chunk sizes:
  - standard article or review prose: `300-600` source words or `1-3` dense original paragraphs
  - OCR-noisy text or readings that already use `translation original reveal`: `250-450` source words or `1-2` dense original paragraphs
  - chapter-like prose with short paragraphs: `400-700` source words or `2-4` short original paragraphs
  - methods/results/statistical interpretation/table discussion: `150-300` source words or one measurement/stat block
- Hard cap: do not translate more than `800` source words in one micro-chunk; if a chunk still feels unstable, split it again before translating.
- Handle `references`, `appendices`, tables, and figure-label runs as separate micro-chunks; never collapse them into a summary sentence.
- When Stage 2 work spans more than one session, pass, or contributor, keep `content/readings/<slug>/translation_work_log.md` as a workflow log. Record planned pass coverage, micro-chunk IDs/ranges, special reference/table/appendix chunks, source-order merge status, source-only QA status, and remaining work.
- Merge each completed micro-chunk into `translation.md` in source order before moving to the next micro-chunk.
- After each merged micro-chunk, do a source-order spot check and run `node scripts/validate_content.js --slug <slug> --source-only` before declaring that chunk stable.
- Do not present a Stage 2 pass as complete until every micro-chunk inside that pass has been merged and checked in order.

### 4.3 Stage 3 = study package
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
- Validate each page family before moving to the next one.
- If `professor-prep` is being rebuilt from lecture evidence, finish the evidence bundle first, then generate only `3` to `5` draft cards, review them, and expand only after approval.
- Inside one Stage 3 page family, use smaller micro-chunks whenever a full-page draft would be too large, too generic, too evidence-heavy, or too unstable to review cleanly in one shot.
- Default Stage 3 micro-chunk unit is one coherent output block, not an arbitrary token window.
- Default Stage 3 micro-chunk sizes:
  - `summary`: `1` to `2` second-level sections per micro-chunk
  - `concepts`: `2` to `4` concept sections per micro-chunk
  - `pitfalls`: `2` to `4` confusion pairs per micro-chunk
  - `quiz-ox`: `5` items per micro-chunk
  - `quiz-short`: `5` items per micro-chunk
  - `quiz-mcq`: `3` to `5` items per micro-chunk
  - `review-sheet`: `2` to `4` recap blocks per micro-chunk
  - `professor-prep`: `3` to `5` cards per micro-chunk, or one evidence theme if that is smaller
- Hard cap: do not draft more than `1` page family and more than `1` active micro-chunk in a single unstable generation shot when the page family still needs substantive review.
- Keep each page family's final source file as the single canonical merged output. Merge completed micro-chunks back into the final page file in published order before moving on.
- Do not present a Stage 3 page family as complete until every planned micro-chunk for that page family has been merged, reviewed, and validated in order.
- If a micro-chunk fails review, revise only that micro-chunk first. Do not restart the whole page family unless the failure is structural or evidence-wide.
- Mandatory Stage 3 manual checkpoints:
  - `summary`, `concepts`, `pitfalls`, and `review-sheet`: review the first micro-chunk before expanding to the rest of the page family
  - `quiz-ox`, `quiz-short`, and `quiz-mcq`: review the first batch before drafting the remaining items
  - `professor-prep`: keep the current `3` to `5` draft-card checkpoint and do not expand until those cards are reviewed for specificity, spoken naturalness, and follow-up resistance
- Do not artifact-validate Stage 3 after every micro-chunk. Use `--source-only` while the page family is still under construction, then build and run artifact-inclusive validation only when that page family is ready for approval review.
- When Stage 3 work spans more than one session, pass, or contributor, keep `content/readings/<slug>/stage3_work_log.md` as a workflow log.
- Record, at minimum:
  - target page family
  - planned micro-chunk IDs and output order
  - coverage scope
  - evidence basis when applicable
  - drafted / merged / source-only QA / manual review / artifact validation status
  - remaining work, reopen reasons, and whether the page family is a partial refresh or a full rebuild

### 4.4 Lecture recording workflow
- Treat lecture recordings as a separate workflow from reading-page generation.
- Process one lecture recording at a time.
- Use the weekly PDF and the reading's Stage 1 text as the content anchor.
- Use the lecture transcript as evidence for professor question style, preferred answer shape, and disliked answer patterns.
- For reading content authority, the weekly PDF and the reading's Stage 1 `full` remain the top anchors. Lecture evidence refines question priority, follow-up pressure, answer shape, and common confusions; it does not replace reading-grounded facts.
- Split lecture-recording work into these steps:
  - transcript
  - STT correction
  - PDF-grounded correction
  - question extraction
  - preferred-answer rule extraction
  - disliked-answer rule extraction
  - limited answer generation
  - review and expansion
- `STT correction` means fixing recognizer errors in the raw STT before evidence extraction, while preserving the spoken meaning, sequence, and uncertainty where needed.
- Do not infer professor style from raw audio or raw STT alone.
- Evidence hierarchy for lecture-informed Stage 3 refresh:
  - same-reading approved dated bundle with `pdf-grounded correction`
  - merged `transcripts/lecture-workflow/professor-style-general-rules.md` as the default style prior
  - raw audio or raw STT only for spot-checking, never as approval-grade evidence
- For the same reading, the latest approved dated bundle outranks the merged professor-wide prior on reading-specific emphasis, likely follow-up pressure, and preferred answer shape, but not on reading content itself.
- Promote a pattern into `professor-style-general-rules.md` only after it repeats across multiple approved dated bundles.
- `summary`, `concepts`, `pitfalls`, `review-sheet`, and baseline reading-grounded quiz drafting do not need to wait on lecture workflow unless they are explicitly being refreshed from lecture evidence.
- When generating oral-practice answers from a new recording, start with `3` to `5` answers, review them, and only then expand.
- Do not generate or refresh published `content/readings/<slug>/professor_prep.json`, `quiz_ox.json`, `quiz_short.json`, or `quiz_mcq.json` from a new recording until `stt_correction`, `pdf_grounded_correction`, `question_extraction`, `preferred_answer_rule_extraction`, and `disliked_answer_rule_extraction` are all `approved` in that bundle's `session.json`.
- For lecture-informed quiz refresh, keep the reading and anchored PDF as the source of factual truth. Use lecture evidence only to reprioritize likely asked distinctions, likely distractors, common confusions, and professor-style traps.
- Before touching published quiz page families from new lecture evidence, draft only `3` to `5` candidate items for the affected quiz page family, review them, and only then expand.
- `limited answer generation` means exactly one draft batch of `3` to `5` cards in `answer-candidates.json`, not a hidden full rebuild.
- `review and expansion` starts only after the draft batch is reviewed against the new evidence and judged acceptable in tone, specificity, and professor-style fit.
- Default update mode is partial replacement of only the published cards or quiz items directly supported by the newly approved recording evidence.
- Use a full-page rebuild only when the new evidence changes the overall answer frame, likely follow-up pattern, preferred answer shape, evaluation emphasis, recurring confusion map, or question-type distribution for the reading.
- If new lecture evidence contradicts existing published `professor-prep` or lecture-informed quiz content, record that contradiction in the bundle `review.md` and the reading's `stage3_work_log.md` before replacing the affected page family.
- Keep date-wise extraction notes separate from professor-wide reusable rules.
- After repeated patterns have been observed across multiple dated bundles, merge them into `transcripts/lecture-workflow/professor-style-general-rules.md`.
- Use that merged file as the default prior for future `professor-prep` generation, oral-practice answer drafting, and likely follow-up prediction unless a new dated bundle provides stronger contradictory evidence.

Storage convention:
- `/UserInput` is temporary intake only. Rename and move incoming files before transcript review starts.
- Keep one lecture bundle per `class_date` x `reading_slug`.
- Store original audio under `source_audio/class-recordings/YYYY-MM-DD-<reading-slug>-class-recording.<ext>`.
- Store raw STT under `transcripts/class-stt/YYYY-MM-DD-<reading-slug>-class-stt.txt`.
- Store corrected STT under `transcripts/lecture-workflow/YYYY-MM-DD-<reading-slug>/stt-correction.md`.
- Store derived workflow files under `transcripts/lecture-workflow/YYYY-MM-DD-<reading-slug>/`.
- Do not scatter lecture workflow artifacts across `content/readings/<slug>/`.
- `content/readings/<slug>/professor_prep.json` remains the published reading output, not the raw lecture-workflow bundle.

Required bundle files inside `transcripts/lecture-workflow/YYYY-MM-DD-<reading-slug>/`:
- `session.json`
- `stt-correction.md`
- `pdf-grounded-correction.md`
- `questions.json`
- `preferred-answer-rules.json`
- `disliked-answer-rules.json`
- `answer-candidates.json`
- `review.md`

`session.json` bundle manifest:
- `class_date`
- `reading_slug`
- `source_audio`
- `source_stt`
- `source_pdf`
- `stage1_full`
- `workflow_status`

`workflow_status` keys:
- `transcript`
- `stt_correction`
- `pdf_grounded_correction`
- `question_extraction`
- `preferred_answer_rule_extraction`
- `disliked_answer_rule_extraction`
- `limited_answer_generation`
- `review_and_expansion`

Allowed `workflow_status` values:
- `missing`
- `in_progress`
- `complete`
- `approved`

`questions.json` shape:
- top-level: `class_date`, `reading_slug`, `items`
- each item: `question`, `question_type`, `transcript_evidence`, `pdf_evidence`, `notes`

`preferred-answer-rules.json` shape:
- top-level: `class_date`, `reading_slug`, `rules`
- each rule: `rule`, `reason`, `transcript_evidence`, `priority`

`disliked-answer-rules.json` shape:
- top-level: `class_date`, `reading_slug`, `rules`
- each rule: `anti_pattern`, `reason`, `transcript_evidence`, `priority`

`answer-candidates.json` shape:
- top-level: `class_date`, `reading_slug`, `cards`
- each card: `title`, `answer_30s`, `evidence_refs`, `status`
- Start with `3` to `5` cards during limited answer generation, then expand only after review.
- Before expansion, mark reviewed draft cards clearly and decide whether the new evidence supports partial replacement or a full rebuild.

`stt-correction.md` structure:
- `## Correction summary`
- `## Notable STT fixes`
- `## Corrected transcript`

`pdf-grounded-correction.md` structure:
- `## Correction summary`
- `## Corrections against PDF`
- `## Reading-grounded notes`

### 4.5 Stage ordering rule
- Finish and validate Stage 1 before starting Stage 2 for a reading.
- Finish and validate Stage 2 before starting Stage 3 for a reading.
- Do not leave Stage 1 or Stage 2 incomplete and then move to later readings.

## 5. Validation gates

### 5.1 Stage 1 validation
Stage 1 is valid only if all of the following are true:

- Translation completeness is not part of Stage 1. It is validated only in Stage 2.
- Stage 1 Pass 1-3 are all complete, contiguous, and merged into one readable `전체 글` (`full`) body
- `전체 글` (`full`) contains the full original text, preserving section order and the readable full body
- photos, tables, figures, and graphs from the source reading are present in `전체 글` as direct image inserts where applicable
- deployable PDF path exists when public PDF access is supported
- reading-hub links work

Failure handling:
- Translation gaps belong to Stage 2 failure handling, not Stage 1.
- If any Stage 1 pass is missing or patchy, the reading is not complete.
- If `전체 글` is not full text, the reading is not complete.
- Such readings must be marked `partial` or `blocked`, not done.

### 5.2 Stage 2 validation
Stage 2 is valid only if all of the following are true:

- `한국어 번역` (`translation`) is a complete full Korean translation for English readings, preserving section order and heading structure
- Stage 2 Pass 1-3 are all complete, contiguous, and merged into one readable `한국어 번역` (`translation`) body
- photos, tables, figures, and graphs from the source reading are present in `한국어 번역` (`translation`) as direct image inserts where applicable
- reading-hub links work
- The current validator also requires a usable `full.md`, non-empty translated sections, heading coverage that remains aligned across source and translation, and figure/table counts that do not materially drop from the source
- The current validator also enforces a minimum overall translation-length floor plus a stricter references/backmatter coverage floor; treat those as machine-enforced approval gates even though they are not sufficient by themselves to prove full translation quality
- If `translation original reveal` is enabled for the reading, `content/readings/<slug>/translation_alignment.json` exists, matches the reading slug, and publishes at least one `verified` entry
- If `translation original reveal` is enabled for the reading, the built `docs/readings/<slug>/translation.html` output includes the reveal marker and built reveal wrapper counts that exactly match the published alignment entry count
- If the reading uses `translation original reveal`, any material rewrite of `translation.md` requires the alignment file to be checked and regenerated before approval can return
- Stage 2 artifact approval must be run sequentially as `build -> validate --require-built-artifacts`; do not treat parallel build and validation as valid approval evidence
- Default `node scripts/validate_content.js --slug <slug>` already includes built-artifact checks. Use `--source-only` only for in-progress source QA before the publish-candidate build.

Failure handling:
- If `한국어 번역` (`translation`) is not a complete full translation, the reading is not complete.
- If any Stage 2 pass is missing, compressed, or patchy, the reading is not complete.
- If enabled reveal alignment is missing, invalid, stale, or built-artifact counts do not match, Stage 2 is not complete.
- Such readings must be marked `partial` or `blocked`, not done.

### 5.3 Stage 3 validation
Stage 3 is valid only if all of the following are true:

- `핵심 요약` (`summary`) exists
- `핵심 개념` (`concepts`) exists
- `헷갈리는 포인트` (`pitfalls`) exists
- `시험 직전 정리` (`review-sheet`) exists
- `교수님 구술 대비` (`professor-prep`) exists
- OX count = `15`
- short-answer count = `15`
- MCQ count = `15`
- all Stage 3 pages are linked from the reading hub
- each approved Stage 3 page family has all planned micro-chunks merged into one canonical source file before approval review
- if `content/readings/<slug>/stage3_work_log.md` is used, the log shows no unmerged or unchecked micro-chunks for any approved Stage 3 page family
- if `professor-prep` or any quiz page family is being refreshed from lecture evidence, the supporting dated lecture bundle shows `approved` for `stt_correction`, `pdf_grounded_correction`, `question_extraction`, `preferred_answer_rule_extraction`, and `disliked_answer_rule_extraction` before published approval can return

Additional QA expectations:

- Run `node scripts/validate_content.js` to surface structural issues before approval, but schema validation is a QA aid rather than the sole definition of Stage 3 completion.
- The current validator also checks page-specific structure such as summary lead/section density, pitfalls contrast density, short-answer leakage/duplication, and MCQ answer-position repetition. Treat those as machine-enforced QA gates even when this document summarizes them briefly.
- Stage 3 page families are not approval-ready if they remain generic, template-like, or interchangeable across readings.
- Stage 3 page families should point at the same core distinctions in the reading rather than functioning as disconnected mini-pages.
- `summary` must include a clear lead section and enough structured bullet content to show the major claims and why they matter.
- `summary` must preserve the reading's final interpretation hierarchy. Do not headline an intermediate result while omitting the paper's later qualification, conditional-model takeaway, or major selection/generalizability caveat.
- `concepts` must include, for each concept:
  - Korean label
  - original English term
  - one-sentence exact definition
  - plain-language explanation
  - why it matters in this reading
  - one common confusion point
- `concepts` must cover the reading's central comparison frame rather than a convenient subset. If the paper repeatedly treats several traits, variables, or resource domains as a set, do not publish only one of them as if it represented the whole frame.
- `summary`, `concepts`, `pitfalls`, and `review-sheet` must clear the first-chunk checkpoint before the rest of the page family is drafted.
- `quiz-ox`, `quiz-short`, and `quiz-mcq` must clear the first-batch checkpoint before the remaining items are drafted.
- `교수님 구술 대비` (`professor-prep`) should normally publish at least `15` cards, and prefer `15` to `20` when quality allows, using the minimal shape:
  - `title`
  - `answer_30s`
- `교수님 구술 대비` (`professor-prep`) must first clear the `3` to `5` card draft checkpoint before expansion to the full published set.
- `교수님 구술 대비` answers should be specific enough to survive at least one obvious follow-up from the professor-style list; cards that collapse under `What exactly do you mean?` are not approval-ready.
- Quiz page families should test reading-specific distinctions, not only generic definition recall.
- `pitfalls` and `review-sheet` are not allowed to stay at generic template level. They must name paper-specific traps, contrasts, ages, moderators, time windows, or effect-pattern distinctions that a student could actually be pressed on in follow-up questioning.
- Different quiz families should complement each other instead of recycling the same fact set in multiple formats. Limited overlap for one or two anchor facts is acceptable, but broad duplication across `quiz-ox`, `quiz-short`, and `quiz-mcq` is a reopen reason.
- Lecture-informed quiz refresh can change priority, distractor design, and confusion targeting, but it must not introduce factual claims that the reading or anchored PDF does not support.

### 5.4 Incomplete readings
- If any required part is incomplete, mark the reading `partial` or `blocked`.
- Do not present incomplete work as complete.

### 5.5 Status model
- Page status values:
  - `missing`
  - `schema_fail`
  - `schema_pass`
  - `approved`
  - `not_applicable`
- Stage / reading status values:
  - `blocked`
  - `partial`
  - `manual_review_required`
  - `approved`
- Landing/video status should be tracked separately from Stage 1, Stage 2, Stage 3, and overall reading approval.
- `missing` means the required content or generated output does not exist yet.
- `schema_fail` means a generated page exists but failed structural validation.
- `schema_pass` means the generated page cleared the structural validator but still needs manual review.
- `approved` means the page, stage, or reading package cleared manual review.
- `not_applicable` means the page family does not apply to the reading, for example `translation` on a Korean reading.
- `partial` means required work is still missing, patchy, or under active rework. Use this for normal incompleteness.
- `manual_review_required` means the structural and staging checks are complete enough for human review, but approval has not been granted yet.
- `blocked` means work cannot continue without an external dependency, policy decision, or explicit manual intervention. Do not use `blocked` for ordinary incompleteness.
- For chunked Stage 3 work, keep the page family or stage `partial` while later micro-chunks are still missing, while required first-batch review has not happened, or while the merged page is still under active rewrite.
- For chunked Stage 3 work, use `manual_review_required` only after the whole page family has finished its planned micro-chunks and required checkpoints.
- Store source-only validation snapshots in `source_page_results` and artifact-inclusive approval snapshots in `page_results`.
- The current builder may still use `source_page_results` to decide whether some page tabs or page bodies render. Treat visible output as preview behavior only; final page, stage, and reading approval must follow the artifact-inclusive `page_results` plus manual review.
- A page or reading can still be structurally `approved` while failing manual quality review. If repeated user feedback identifies wrong reveal alignment, generic Stage 3 content, weak distractors, or omitted reading-specific distinctions, reopen that page family instead of treating validator success as sufficient.
- If a page family is only `schema_pass`, do not promote the containing stage or reading to `approved`.
- If Stage 1, Stage 2, or Stage 3 is waiting on manual review after structural completion, prefer `manual_review_required` over `partial`.
- Automation should stop after the first reading whose `reading_status` is not `approved`.
- Use `node scripts/validate_content.js` as the local structural QA gate before moving on to the next reading, but do not treat schema validation as a substitute for manual approval.

### 5.6 Manual approval recording
- The manual approval source of truth is `content/readings/<slug>/meta.json`, inside `manual_review`.
- Record page-level manual approval in `manual_review.approved_pages`.
- Record pinned source hashes for those pages in `manual_review.approved_page_hashes`.
- Use `manual_review.reviewer`, `manual_review.reviewed_at`, and `manual_review.notes` for audit context.
- Use `manual_review.blocked_reason` only when the reading is truly `blocked`.
- `APPROVAL_STATUS.md` is a generated summary report, not the source of truth. Do not hand-edit it.
- A page becomes `approved` only when its base result is `schema_pass`, the page key is present in `manual_review.approved_pages`, and the stored hash still matches the current `source_hash`.
- Any source change that changes the page hash automatically reopens that approval. Do not carry old approval forward by hand after the content changed.
- Recommended publish-candidate approval sequence:
  - finish the source edit
  - if the work is chunked Stage 3 work, plan the page family's micro-chunks first and merge each completed micro-chunk into the canonical source file before moving on
  - run `node scripts/validate_content.js --slug <slug> --source-only` while work is still in progress
  - if the work is chunked Stage 3 work, complete the required first-batch manual checkpoint before expanding the page family
  - if the work is a lecture-informed `professor-prep` or quiz refresh, make sure the supporting lecture bundle has already reached the required `approved` workflow states before publish approval review starts
  - once the whole page family is merged and stable, build the reading
  - run `node scripts/validate_content.js --slug <slug>` for artifact-inclusive validation
  - record manual approval in `meta.json` only after the whole page family, not just an early draft batch, has passed the approval sequence
  - rebuild or refresh generated status outputs such as `APPROVAL_STATUS.md`
- If `full.md` text, paragraph boundaries, figure placement, or source-side visual assets change after Stage 2 approval, reopen `translation`, `translation_alignment.json`, and any dependent publish review. Use `partial` if the translation/alignment is now stale or incomplete; use `manual_review_required` only after the dependent pages were refreshed and are waiting on re-approval.
- If a new approved lecture bundle materially changes the likely question frame, preferred answer shape, recurring confusion pattern, or lecture-driven quiz emphasis for a reading, reopen the affected `professor-prep` and any lecture-informed quiz page family. Use `partial` while the refresh is in progress and `manual_review_required` only after the refreshed page family is rebuilt and awaiting re-approval.

## 6. Date / order rules
- Homepage reading order and displayed dates must follow syllabus class-date order.
- Weekly class schedule is the primary truth source for dates.
- If the reading appendix conflicts with the weekly schedule, prefer the weekly schedule.
- Preserve the local source filename when a syllabus citation label differs from the local filename.

Important conflict resolution:
- Use `3/17` for Chapter 3, not `3/18`.
- Use `4/30` for Chapter 10, not `4/31`.
- Do not show `5/05` as a reading date because it is a holiday / no-class day.

Exact homepage order:

1. `3/05`  `[CH1]Gerontology.pdf`
2. `3/10`  `[CH2]Gerontology.pdf`
3. `3/12`  `Beck, 2016.pdf`
4. `3/17`  `[CH3]Gerontology.pdf`
5. `3/19`  `[CH4]Gerontology.pdf`
6. `3/24`  `Hülür et al., 2019.pdf`
7. `3/26`  `[CH5]Gerontology.pdf`
8. `3/31`  `Olshansky & Carnes, 2019.pdf`
9. `3/31`  `Kerrigan, 2018.pdf`
10. `4/02` `[CH6]Gerontology.pdf`
11. `4/07` `Park & McDonough, 2013.pdf`
12. `4/09` `[CH7]Gerontology.pdf`
13. `4/14` `Wagner et al., 2016.pdf`
14. `4/21` `[CH8]Gerontology.pdf`
15. `4/23` `Suitor et al., 2014.pdf`
16. `4/28` `[CH9]Gerontology.pdf`
17. `4/30` `[CH10]Gerontology.pdf`
18. `5/07` `Blieszner, 2014.pdf`
19. `5/12` `[CH11]Gerontology.pdf`
20. `5/14` `Calvo et al., 2018.pdf`
21. `5/19` `[CH12]Gerontology.pdf`
22. `5/21` `Leggett et al., 2020.pdf`
23. `5/26` `[CH13]Gerontology.pdf`
24. `5/28` `Konrath et al., 2012.pdf`
25. `6/02` `[CH14]Gerontology.pdf`
26. `6/09` `[CH15]Gerontology.pdf`
27. `6/09` `Carr & Fang, 2021.pdf`

## 7. Homepage rules
- Homepage must not read like build documentation or admin output.
- Remove or forbid helper/admin copy such as:
  - build counters
  - generator notes
  - manifest file references shown as UI copy
  - reading-count summaries
  - page-count summaries
  - offline/build/admin helper notes
- The homepage should feel like a clean reading dashboard only.

## 8. Global content style rules
- Korean-first UI and content framing by default.
- Preserve English only where the original English title, author name, or source text itself must be shown.
- Do not write only in stiff lecture-note style.
- Do not write in flashy AI-dashboard style.
- Keep the site calm, plain, academic, and readable.

## 9. Professor style analysis rules
Derived from lecture-transcript review dated `2026-03-05`, `2026-03-10`, `2026-03-12`, `2026-03-17`, and `2026-03-19`.

The professor strongly prefers:

1. directly answering the exact question
2. saying exactly what was interesting, new, or important
3. defining the key concept clearly
4. explaining why it matters
5. paraphrasing in the student's own words
6. using concrete examples
7. connecting to Korean context, student context, or real class context when relevant
8. giving balanced, research-based interpretations rather than stereotypes

The professor strongly dislikes:

1. vague answers like `흥미로웠다`, `복합적이다`, `다양하다` without explanation
2. drifting away from the exact question
3. filler and delay
4. generic textbook tone
5. AI-sounding answers
6. concept-name dropping without actual explanation

The professor frequently asks:

- `그게 뭐야?`
- `왜 그렇게 보는데?`
- `뭐가 새로웠는데?`
- `다시 말해봐.`
- `다시 한번 다르게 말해봐.`
- `구체적으로 말해봐.`
- `그게 왜 중요한데?`
- `연구에서는 뭐라고 하는데?`
- `한국에서는 어떻게 보이는데?`
- `그 설명의 한계는 뭐야?`
- `영어로 뭐지?`
- `질문을 똑바로 듣고 답해봐.`
- `본인은 어떻게 생각하는데?`

Therefore future content should optimize for:

- precise concept understanding
- follow-up resistance
- natural spoken answers
- exact rather than vague wording

### 9.1 Answer contract derived from the recordings
- If the prompt asks `무엇이 인상적이었나`, answer with:
  - one exact point
  - why it was new, surprising, or assumption-breaking
  - what that changed in your reading of the text
- If the prompt asks `왜`, give mechanism or reasoning, not a synonym for the first sentence.
- If the prompt asks `그게 뭐야`, define the concept in one exact sentence first, then explain it in plain Korean.
- If the prompt asks `영어로 뭐지`, give the exact English term, not a rough paraphrase.
- If the prompt asks for a reaction or opinion, distinguish:
  - what the reading argues
  - what research evidence supports
  - what you personally took from it
- Do not answer with only a label such as `흥미로웠다`, `복합적이다`, `다양하다`, `중요하다`.
- Do not give broad categories without content such as `장점도 있고 단점도 있다`.
- Do not drift into a different question because the asked one is harder.
- Do not stall with filler while searching for the point. Answer first, then elaborate.
- Prefer exact anchors:
  - age
  - year
  - scholar
  - variable
  - method
  - comparison pair
  - Korean or class context when relevant
- The professor repeatedly pushes students to move from:
  - vague reaction
  - to exact concept
  - to why it matters
  - to what follows from it

### 9.2 Strong default spoken template
Use this default shape for oral-style answers unless the prompt clearly needs a different order:

1. `저는 이 글을 X 중심으로 읽었습니다.`
2. `가장 인상적이었던 건 Y였습니다.`
3. `왜냐하면 Z라는 통념/예상과 달랐기 때문입니다.`
4. `이게 중요한 이유는 A이기 때문입니다.`
5. `그래서 저는 이 글을 B라고 이해했습니다.`

Good expansions inside the template:

- exact concept definition
- exact English term when useful
- one concrete example
- one contrast pair
- one limitation or boundary condition
- one Korean-context or student-context implication when genuinely relevant

Bad expansions inside the template:

- generic praise
- dictionary-style abstraction with no claim
- personal anecdote unrelated to the reading
- AI-sounding balanced-but-empty wording
- textbook recap that never reaches a position

## 10. Page-specific content rules

### 10.1 개요
- This is not a decorative landing page.
- It should immediately tell the student:
  - what the reading is about
  - why it matters for the course
  - what kind of reading it is: `교재`, `기사`, or `논문`
  - what the likely class-discussion angle is
- It should include:
  - class date
  - reading title
  - one-sentence reading hook
  - 3 to 5 `수업에서 바로 잡힐 포인트`
- It must not include build/admin noise.
- Stage 1 reading-hub links must work from this page.

### 10.2 핵심 요약
- This is the only page where summarization is allowed.
- Not a generic abstract.
- Focus on:
  - what exactly is interesting
  - what is actually new or unexpected
  - why the point matters
- Each major point should be written as:
  - claim
  - why it is interesting, new, or important
- Avoid vague summary lines such as `다양한 측면을 보여준다.`

### 10.3 전체 글
- Must contain the full original text only.
- Must be complete, not partial.
- Do not use summary-style rewriting.
- Do not compress the reading.
- Do not substitute a clean overview for the original text.
- Must preserve section order.
- Must be cleaned into readable article-style HTML.
- Complete extraction in three contiguous passes: front third, middle third, final third.
- Do not skip ahead and backfill later.
- Do not mark extraction complete until the third pass and end-to-end QA are done.
- Photos, tables, figures, and graphs from the source reading must be inserted directly as image assets in the reading flow.
- Do not drop visual materials that carry original content.
- Treat content-bearing figures, tables, graphs, diagrams, photos, and appendixed visuals as required visual materials.
- Repeating running heads, page numbers, publisher logos, scan borders, crop marks, and other decorative page furniture are not required visual inserts unless the reading itself discusses them.
- Do not convert tables, figures, or graphs into summary prose as a substitute for the original visual.
- Do not silently skip major sections.
- Stage 1 validation requires the readable full body, not a shortened substitute.
- Landing-page explanation videos may be added later, but they are not part of Stage 1 validation.
- If extraction quality is poor, fix extraction first instead of publishing obviously broken text.
- Never substitute summary content into `full.html`.
- `full.html` is a long-form reading page and must use the reading-only reader shell.
- The reader shell for `full.html` must stay focused on reading: build-time TOC, narrow reading measure, figure/table open action, and no font-size/bookmark/resume controls.
- Build the TOC from content headings, not from runtime DOM mutation.
- Exclude frontmatter, backmatter (`References`, `Publication History`, and equivalents), and table/figure labels from the TOC.
- Prefer topic/section headings in the TOC; do not turn table/figure labels into navigational headings.
- On narrow screens, move reading navigation above the article body rather than leaving it below the full text.

### 10.4 한국어 번역
- English readings must be translated only after Stage 1 extraction is complete.
- Translation is its own dedicated stage, separate from extraction.
- Translation must contain the full Korean translation of the original reading.
- Translation must be complete and contiguous, not patchy.
- Do not use summary-style translation.
- Do not publish abridged translation.
- Do not publish selective excerpt translation.
- Complete translation in three contiguous passes: front third, middle third, final third.
- The translation stage is not complete until the third pass and end-to-end QA are done.
- Preserve section order and headings.
- Photos, tables, figures, and graphs from the source reading must also appear directly as image assets in the translated reading flow.
- Do not omit original visual materials from `translation.html` just because the surrounding text is translated.
- If translation is incomplete, patchy, or under active rewrite, mark the reading `partial` rather than pretending the page is finished.
- Use `blocked` only when an external dependency, policy decision, or explicit manual intervention prevents translation from continuing.
- Translation quality matters more than raw batch speed.
- Never substitute summary content into `translation.html`.
- `translation.html` uses the same long-form reading shell as `full.html`, and that shell applies only to these reading-text pages.
- Keep translation navigation static and build-time generated, using the translated heading structure as the TOC source.
- Exclude frontmatter, backmatter (`참고문헌`, `출판 이력`, and equivalents), and table/figure labels from the TOC.
- When a translated page already supplies Korean table/figure explanation immediately around the asset, do not repeat the original English figcaption in the visible reading flow.

#### Translation Original Reveal
- `translation original reveal` is an optional translation-stage enhancement, not a standalone page family.
- Allow it only on English readings and only on `translation.html`.
- Do not spread it to `full.html`, summary pages, quiz pages, `review-sheet`, or `professor-prep`.
- Store reveal data in `content/readings/<slug>/translation_alignment.json`; do not embed bilingual reveal markup directly into `translation.md`.
- Do not create or refresh `translation_alignment.json` while the translation body is still being materially rewritten chunk by chunk.
- For translation-side work, freeze the Korean body first, then update alignment entries in a later stability pass, then build, then validate built artifacts.
- Alignment entries must include stable identifiers plus `status`, `unit`, `ko_anchor`, and `en_anchor`.
- Anchors may use explicit locators such as heading-path locators or `flat_index`, but they must resolve to one stable block only.
- Publish only `verified` reveal entries.
- Keep published translation markdown at heading depth `####` or shallower while using the current reading-shell/reveal workflow. Do not leave `#####` lines in `translation.md`; they render as unstable structure for TOC/alignment work and should be refactored before publish review.
- At least one `verified` entry is only the machine minimum. Policy-level approval expects reveal coverage across the stable translated body wherever reliable alignment can actually be verified.
- Supported reveal units are `paragraph`, `sentence_group`, and `context_block` only.
- Use `paragraph` only when the Korean paragraph corresponds to the full referenced original block.
- Use `sentence_group` only when a smaller, exact subset of the referenced original block can be shown accurately.
- Use `context_block` when exact smaller matching is not reliable and the UI should show the referenced original block as reading context.
- If multiple Korean paragraphs map into one original block, split the published reveal into paragraph-matched `sentence_group` chunks whenever that can be done reliably; do not keep showing the same full original block for every paragraph when a finer split is available.
- Do not approve reveal output that is merely nearby or loosely related English. The opened source text must match the Korean paragraph's local topic span closely enough that the user can actually verify that paragraph.
- If sentence-level precision is uncertain, downgrade to `context_block`; do not fake sentence-by-sentence precision.
- Treat `context_block` as a safe context disclosure mode, not as a claim of one-to-one sentence alignment.
- Use click/tap-friendly built-time `details` / `summary` disclosure as the default interaction; do not rely on hover-only reveal behavior.
- Reveal summary wording must reflect precision level, clearly distinguishing full-block correspondence, partial correspondence, and context-only disclosure.
- Keep reveal behavior inside the same long-form reading shell used by `translation.html`.
- `References`, `Publication History`, and similar backmatter are low-priority reveal targets; omit them by default, and if they are included for a specific reading, use `context_block` only.
- Before approving `translation`, manually spot-check reveal alignment across at least the abstract, one methods region, one results or discussion region, and any included appendix or backmatter region. If drift appears in any sampled region, reopen the page and treat the reveal mapping as unfinished.
- If `full.md` paragraph boundaries, block order, or figure placement change, update the same reading's `translation_alignment.json` in the same reading pass that changed the source, then rebuild before approval. Source-side edits can stale anchors immediately, so do not defer this to an unrelated later pass.

### 10.5 핵심 개념
For each major concept, include:

- Korean label
- original English term
- one-sentence exact definition
- plain-language explanation in the student's own words
- why the concept matters in this reading
- one common confusion point

This page should especially support the professor's habit of asking for English terms and exact concept definitions.

### 10.6 헷갈리는 포인트
This page must explicitly contrast commonly confused pairs.

Each item should include:

- `A vs B`
- short distinction
- why students confuse them
- one example

Typical pairs include:

- `Gerontology vs Geriatrics`
- `chronological age vs biological age vs subjective age`
- `age effect vs cohort effect vs period effect`
- `cross-sectional vs longitudinal`
- `disengagement theory vs activity theory vs continuity theory`
- `positive aging vs unrealistic fantasy about aging`
- `내가 원하는 나이 vs 사회가 적절하다고 보는 나이`

This page should be built for follow-up defense.
- Do not stop at polished summary prose. Each item should surface a concrete reading-specific trap such as a particular moderator, age threshold, time-to-death window, or conditional-versus-unconditional result that students are likely to blur.

### 10.7 OX 퀴즈
- Keep `15` items.
- Test meaningful conceptual distinctions, not trivia only.
- Many items should target common classroom misconceptions.
- Every item must include answer and explanation.
- Correctness must be grounded in the reading and anchored PDF, not in lecture memory alone.
- Lecture evidence may reprioritize which distinctions are worth asking and which false statements are tempting, but it must not create unsupported factual items.
- If this page family is being refreshed from lecture evidence, draft the first `3` to `5` items, review them, and only then expand to the full set.

### 10.8 단답형 퀴즈
- This must be true short-answer only.
- Allowed answer types only:
  - one term
  - one short phrase
  - one name
  - one number
  - under 8 words
- Never use mini-essay prompts.
- Never use range answers.
- Prefer exact concepts, scholars, English terms, ages, years, theories, methods, and key labels.
- Every item must include `accepted_answers` and explanation.
- `accepted_answers` should include obvious English-term variants and standard synonym forms when the reading itself uses those labels and a student could reasonably answer with them.
- Correctness must be grounded in the reading and anchored PDF, not in lecture memory alone.
- Lecture evidence may reprioritize likely asked labels, English terms, and confusion-prone distinctions, but it must not add unsupported answer keys.
- If this page family is being refreshed from lecture evidence, draft the first `3` to `5` items, review them, and only then expand to the full set.

### 10.9 객관식 퀴즈
- Keep `15` items.
- Always use `4` options.
- Use distractors based on actual classroom confusions.
- Avoid absurd or obviously out-of-scope distractors that can be removed without reading the paper. Wrong options should be plausibly tempting to someone who partly understood the reading.
- Explanations must tell:
  - why the correct option is correct
  - why the tempting wrong idea is wrong
- Correctness must be grounded in the reading and anchored PDF, not in lecture memory alone.
- Lecture evidence may reprioritize what gets asked and how distractors are shaped, but it must not inject unsupported claims or pseudo-evidence.
- If this page family is being refreshed from lecture evidence, draft the first `3` to `5` items, review them, and only then expand to the full set.

### 10.10 시험 직전 정리
- Must be compact, not bloated.
- Build it like a last-minute recovery page.
- Do not hide behind vague labels such as `자원`, `취약한 궤적`, or `어떤 요인은 수준, 어떤 요인은 변화율` without naming the concrete variables and effect pattern that make this reading distinctive.
- Include:
  - 핵심 정의
  - 꼭 구분해야 하는 대비쌍
  - 자주 틀리는 포인트
  - 팝업퀴즈용 핵심 OX / 객관식 포인트
  - 영어 용어 암기 포인트

### 10.11 교수님 구술 대비
- This page is only for model answers to `이 글을 어떻게 읽었는지`.
- Do not treat it as a broad oral-exam framework.
- Do not require `likely professor prompt`, `why this works`, `bad answer`, `follow-up`, or `recovery` as the default published schema.
- Default published item shape should be only:
  - `title`
  - `answer_30s`
- Use `answer_30s` as the canonical field name. `30-second model answer` is descriptive copy only and must not be used as a schema key.
- Each reading should have at least `15` model answers by default.
- Prefer `15` to `20` when quality allows.
- Each answer should be around `30` seconds when spoken.
- Future answer generation should use the merged professor-wide rules in `transcripts/lecture-workflow/professor-style-general-rules.md` as the default prior.
- Treat those merged rules as reusable answer-style guidance, not as subject-matter content that overrides the actual reading.
- When a same-reading approved dated lecture bundle exists, use that bundle to override the merged professor-wide prior on reading-specific emphasis, likely follow-up pressure, and preferred answer shape.
- When approved dated lecture bundles preserve strong student answers or reviewed `answer-candidates.json`, use those student-answer shapes as high-priority local templates for future `professor-prep` refresh of the same reading family or nearby reading type.
- Default answer frame should sound like a student explaining how they read the text, not like a paper summary rewritten in first person.
- Strong default opening frames include:
  - `저는 이 글을 X와 Y를 구분해서 읽었습니다`
  - `처음에는 A라고 생각했는데 읽고 나서는 B가 더 중요하다고 봤습니다`
- Do not publish cards that merely restate the article summary with `저는`, `이 글은`, or similar first-person wrappers unless the card also makes clear what distinction, changed expectation, or reading angle the student is foregrounding.
- Do not use raw audio, raw STT, or uncorrected transcript fragments as publish-grade evidence for new cards.
- Every `answer_30s` should include at least one concrete reading anchor such as a concept, variable, method, finding, limitation, year, age group, or comparison pair from the actual reading.
- When refreshing from lecture evidence, first draft only `3` to `5` cards, review them against the approved bundle and the reading, and only then expand.
- Default refresh mode is partial replacement of only the cards directly supported by the new approved lecture evidence.
- Use a full-page rebuild only when the new lecture evidence changes the overall answer frame, likely follow-up pattern, preferred answer shape, evaluation emphasis, or recurring confusion map for that reading.
- Do not silently overwrite unrelated approved cards that still fit the current evidence.

Intended spoken logic:

- `나는 이 글을 무엇 중심으로 읽었다`
- `왜 그 포인트가 중요하거나 새로웠다`
- `그래서 이 글의 핵심을 어떻게 이해했다`

Required answer features derived from the recordings:

- open with the answer, not with throat-clearing
- answer the exact question that was asked, not a nearby question
- mention one exact concept, finding, distinction, or question
- explain `왜` in a causal, comparative, or interpretive way
- move from label to meaning, mechanism, or implication rather than stopping at the label
- distinguish nearby concepts, variables, designs, or effects precisely rather than collapsing them into one vague category
- include at least one concrete anchor such as:
  - age
  - year
  - variable
  - method
  - theory contrast
  - Korean-context implication
- if the reading is a research article, explain the design implementation, measured variables, core findings, and at least one limitation or causal-direction caution
- if the answer includes a reaction such as `interesting`, `new`, or `surprising`, immediately state what prior expectation changed
- be defensible against likely follow-up questions:
  - `그게 뭐야?`
  - `왜 중요한데?`
  - `연구에서는 뭐라고 하는데?`
  - `영어로 뭐지?`
- be ready for recurring follow-up categories such as:
  - `What exactly do you mean?`
  - `Who or what is doing the explaining here?`
  - `What is the difference between A and B?`
  - `Which variable / design / effect are you talking about exactly?`
  - `Is this age difference, cohort difference, period effect, level difference, change rate, or causality?`
  - `What limitation or alternative explanation remains?`
- if the answer contains a personal reaction, tie it back to the text immediately
- avoid broad praise without content
- avoid empty `장단점` listing unless each side is specified
- avoid `요약체` narration that sounds like a book report rather than a class answer

Default micro-structure for each `answer_30s`:

- 1 sentence: what you focused on
- 1 sentence: what exactly was new / surprising / important
- 1 sentence: why it matters for this reading or course
- 1 sentence: one concrete distinction, example, or implication

Tone rules:

- natural spoken student tone
- direct
- specific
- not vague
- not textbook-summary style
- not AI-sounding
- must sound like someone who actually read the text

Angle variety within the single frame of `어떻게 읽었는지` can include:

- concept-centered
- research-question-centered
- method-centered
- finding-centered
- limitation-aware
- Korean-context-centered
- changed-my-view-centered
- theory-vs-reality-centered

Repository compatibility note:

- Existing source schemas may retain extra historical fields in some readings.
- Future default generation should target the minimal published schema of:
  - `title`
  - `answer_30s`
- Legacy aliases such as `answer` or `model_answer` may be read during migration, but validation and new content should use `answer_30s`.
- If extra fields still exist in older readings, treat them as legacy support material rather than the default published contract.
