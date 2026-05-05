# Project: Adult Aging Reading Site

## Goal
Maintain a static study website for gerontology course readings that is previewed locally from `docs/` and published from `docs/` as deployable static output.

## Document Roles
- `CONTENT_RULES.md` is the detailed source of truth.
- `AGENTS.md` is the collaborator-facing checklist.
- `README.md` is onboarding only.
- If they conflict, follow `CONTENT_RULES.md` first and then update the summary docs.
- `docs/guides/` contains focused execution guides for extraction, segmentation, translation QA, quizzes, professor-prep, and reading UI.
- `docs/references/EXTERNAL_REFERENCES.md` records external standards consulted for pipeline/UI work.

## Quality Guide Map
- Reading workflow: `docs/guides/READING_WORKFLOW.md`
- Paper extraction: `docs/guides/PAPER_EXTRACTION_RULES.md`
- Source segmentation: `docs/guides/SOURCE_SEGMENTATION_RULES.md`
- Translation style: `docs/guides/TRANSLATION_RULES.md`
- Segment alignment QA: `docs/guides/TRANSLATION_ALIGNMENT_QA.md`
- Coverage report template: `docs/guides/EXTRACTION_COVERAGE_REPORT.md`
- Quiz evidence rules: `docs/guides/QUIZ_RULES.md`
- Professor-prep answer rules: `docs/guides/PROFESSOR_PREP_RULES.md`
- Reading UI rules: `docs/guides/READING_UI_RULES.md`
- Rendering component rules: `docs/guides/ARTICLE_RENDERING_RULES.md`
- Readability checklist: `docs/guides/READABILITY_CHECKLIST.md`

## Non-Negotiables
- Static HTML, CSS, and vanilla JavaScript only.
- No React, no database, no server framework.
- `docs/` is the only final build target.
- Keep links relative so local preview and static hosting both work.
- Homepage stays a YouTube-style card grid with one card per reading.
- Homepage top featured reading follows the closest upcoming published class date: choose the earliest reading on or after today, respecting `publish_cutoff_date`; if no later published date exists, fall back to the latest reading on or before `min(today, publish_cutoff_date)`.
- `manifest/readings.json` remains the reading inventory/build source of truth.
- Work from `content/readings/<slug>/`; do not collapse the repo to a sample subset.

## Default Working Unit
- Work one reading at a time.
- Default unit is `1 reading x 1 stage x 1 pass`.
- Do not finish multiple stages or the whole Stage 3 package in one pass.
- For English readings, keep `전체 글` and `한국어 번역` as separate stages.
- For Stage 3, default to one page family at a time.
- In prose, prefer `전체 글`, `한국어 번역`, `교수님 구술 대비`; use `full`, `translation`, `professor-prep` only for file/key references.

## Workflow-Only vs Machine-Enforced
- `workflow-only` rules describe how collaborators must execute the work, even when current scripts do not reconstruct every step automatically.
- `machine-enforced` rules are the checks currently performed by `build_site.js`, `validate_content.js`, and `manual_review` hash matching in `meta.json`.
- Visible tabs/pages are not approval evidence. The builder may still render some content from `source_page_results`; final approval follows `page_results` plus `manual_review`.
- Validator success is not enough by itself. If reveal alignment is wrong or a Stage 3 page family is still generic, repetitive, weakly grounded, or quiz-poor, reopen it even when the build and validator pass.
- If the user gives a repeated workflow or quality correction that clearly applies beyond one reading, stop and promote it into the shared rules before continuing major generation work.
- Do not keep standing user corrections only in a single reading log or only in chat memory.
- Minimum policy-sync target after such a correction: `CONTENT_RULES.md`, then `AGENTS.md`, and lecture-style reusable rules when applicable.

## Status Quick Guide
- `partial`: normal incompleteness, patchy work, or active rewrite.
- `manual_review_required`: structure is complete enough for review, but approval has not been granted yet.
- `blocked`: external dependency, policy decision, or explicit manual intervention is required.
- `approved`: manual review cleared and the approval hash still matches current content.

## Approval Recording
- Manual approval source of truth is `content/readings/<slug>/meta.json`.
- Record page approval in `manual_review.approved_pages`.
- Record pinned hashes in `manual_review.approved_page_hashes`.
- `APPROVAL_STATUS.md` is generated output only; never hand-edit it.
- If source content changes, old approval hashes are stale. Re-run validation and re-record approval instead of carrying it forward.

## Stage 1 Extraction Checklist
- `전체 글` must be full original text, not summary, cleanup-only overview, or patchwork extraction.
- Keep the public pass model at `Pass 1 / Pass 2 / Pass 3`.
- Do the actual extraction and cleanup in smaller micro-chunks and merge them in source order.
- Split OCR-noisy regions, tables, figure-caption runs, appendices, references, and other backmatter into separate micro-chunks.
- If Stage 1 spans multiple sessions or contributors, keep `content/readings/<slug>/stage1_work_log.md` with chunk ranges, source-only QA status, and remaining work.
- Use `node scripts/validate_content.js --slug <slug> --source-only` for in-progress chunk QA.
- If extraction is incomplete, patchy, or under rewrite, mark `partial`. Use `blocked` only for an actual external blocker.

## Stage 2 Translation Checklist
- `한국어 번역` must be full translation, not summary, excerpt, or patchwork.
- Keep the public pass model at `Pass 1 / Pass 2 / Pass 3`.
- Do the actual translation in smaller micro-chunks and merge them in source order.
- `source words` means the current normalized `full.md` text, not raw PDF OCR.
- Split `references`, appendices, tables, and dense methods/results blocks into separate micro-chunks.
- If Stage 2 spans multiple sessions or contributors, keep `content/readings/<slug>/translation_work_log.md` with chunk ranges, source-only QA status, and remaining work.
- Use `node scripts/validate_content.js --slug <slug> --source-only` for in-progress chunk QA.
- Use default `node scripts/validate_content.js --slug <slug>` for publish-candidate validation; built-artifact checks are on by default.
- If translation is incomplete or under rewrite, mark `partial`. Use `blocked` only for an actual external blocker.

## Stage 3 Execution Checklist
- Work on `1` page family at a time and keep only `1` active micro-chunk in flight when the family still needs substantive review.
- Keep the public page-family order from `CONTENT_RULES.md`; do not draft the whole study package in one batch.
- Merge each approved micro-chunk back into the canonical page-family source file before moving on.
- If Stage 3 spans multiple sessions or contributors, keep `content/readings/<slug>/stage3_work_log.md` with chunk IDs, coverage, evidence basis, QA status, and reopen reasons.
- While a page family is still under construction, use `node scripts/validate_content.js --slug <slug> --source-only`.
- Only after the whole page family is merged and stable should it move to build plus artifact-inclusive validation.
- `summary`, `concepts`, `pitfalls`, and `review-sheet` require a first-chunk review before expansion.
- `quiz-ox`, `quiz-short`, and `quiz-mcq` require a first-batch review before drafting the remaining items.
- `professor-prep` requires the existing `3` to `5` card draft checkpoint before expansion.
- `summary` must keep the paper's final interpretation and major caveats, not just the easiest headline result.
- `concepts` must cover the paper's main comparison frame rather than one convenient subset.
- `pitfalls` and `review-sheet` must name paper-specific traps and effect patterns; generic study-guide prose is not approval-ready.
- `professor-prep` must stay in `학생이 이 글을 어떻게 읽었는지` voice; if it reads like `핵심 개념`을 문장으로 늘인 설명문 or chapter-summary prose, reopen it.
- Strong `professor-prep` cards foreground a distinction, changed expectation, or reading angle first, then anchor it with at least one concrete reading detail such as a term, statistic, role/type distinction, or Korean-context implication.
- If most `professor-prep` cards could be pasted into `concepts.md` with little change, the page family is not approval-ready even when card count and validator checks pass.
- Quiz families should complement each other instead of largely repeating the same fact set across OX, short-answer, and MCQ forms.
- MCQ distractors must be plausible confusions from the reading, and explanations must rebut at least the most tempting wrong option.
- Short-answer accepted answers should include obvious English-term variants when the reading itself uses them.

## Lecture-Evidence Refresh Checklist
- Reading facts stay anchored to the weekly PDF and the reading's Stage 1 `full`; lecture evidence does not override reading-grounded facts.
- Lecture-informed refresh is mainly for `교수님 구술 대비` and, when needed, quiz reprioritization/distractor tuning.
- Do not refresh published `professor_prep.json`, `quiz_ox.json`, `quiz_short.json`, or `quiz_mcq.json` from a new recording until the bundle `session.json` marks `stt_correction`, `pdf_grounded_correction`, `question_extraction`, `preferred_answer_rule_extraction`, and `disliked_answer_rule_extraction` as `approved`.
- For lecture-informed quiz refresh, draft only `3` to `5` candidate items first and review them before expansion.
- For lecture-informed `professor-prep` refresh, draft only `3` to `5` cards first and review them before expansion.
- If approved lecture bundles include strong student-answer wording or reviewed `answer-candidates.json`, use that student-answer shape as the first template for future `교수님 구술 대비` rewrites.
- Keep `교수님 구술 대비` in `학생이 이 글을 어떻게 읽었는지` voice; do not just turn the reading summary into first-person prose.
- When no same-reading lecture bundle exists yet, prefer the strongest existing student-answer shape in the repo over neutral summary prose; do not fall back to concept-definition cards.
- If new approved lecture evidence changes question frame, answer shape, recurring confusion, or quiz emphasis, reopen the affected page family and treat it as `partial` until rebuilt.

## Translation Original Reveal
- Allowed only on English `translation.html`.
- Keep reveal data in `translation_alignment.json`.
- Freeze `translation.md` first, then update alignment, then build, then validate.
- If `full.md` block structure or figure placement changes, refresh alignment in the same reading pass because anchors may be stale immediately.
- Publish only `verified` entries.
- Keep published translation headings at `####` or shallower in the current workflow; do not leave `#####` lines in `translation.md` at publish time.
- Supported units are `paragraph`, `sentence_group`, and `context_block`.
- If several Korean paragraphs share one original block, split the reveal by paragraph-matched chunks when reliable instead of repeating the whole English block.
- Do not approve reveal output that shows only a loosely related larger block. The opened English must match the Korean paragraph's local topic span closely enough to be worth checking.
- Before approving `translation`, spot-check reveal alignment in the abstract, a methods area, a results or discussion area, and any included appendix or backmatter region.
- Reveal labels should tell the user whether they are opening a matched part or the whole block; avoid vague `원문 일부 보기` wording.

## Build / Validate Defaults
- Prefer single-reading work:
  - `node scripts/build_site.js --slug <slug>`
  - `node scripts/validate_content.js --slug <slug>`
- For segment-aligned English translation QA:
  - `node scripts/check-alignment.js --slug <slug> --strict --write-report`
- Use `--source-only` only for in-progress source QA before publish review.
- Full-site build is for repo-wide refreshes, not the default for a small reading edit.

## See CONTENT_RULES.md For
- exact stage rules and page-family requirements
- machine-enforced validator gates and status meanings
- Stage 1 micro-chunk thresholds and extraction work-log rules
- Stage 2 micro-chunk thresholds and reveal rules
- Stage 3 micro-chunk thresholds, checkpoints, and work-log rules
- lecture-recording workflow, evidence hierarchy, and professor-prep guidance
- homepage ordering and syllabus date conflict handling
