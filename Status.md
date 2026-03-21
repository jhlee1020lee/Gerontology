# Documentation / Spec Alignment Pass

Date: 2026-03-21

Completed:

- Updated `AGENTS.md`, `README.md`, and `CONTENT_RULES.md` to match the current repository state.
- Replaced outdated local-only wording with the current `docs/` deployable-output model.
- Clarified the distinction between source/input PDFs and deployable public PDFs under `docs/`.
- Documented the preferred one-reading-at-a-time, Stage 1 then Stage 2 workflow.
- Added explicit Stage 1 and Stage 2 validation gates.
- Updated professor-prep guidance to the current default model: `이 글을 어떻게 읽었는지`, `15` to `20` answers preferred, and minimal published schema of `title` plus `answer_30s`.
- Strengthened the true short-answer rule and translation completeness rule.
- Recorded Hulur as the workflow/quality benchmark only, not a subject-matter template.

Not done in this pass:

- No reading content regeneration.
- No whole-site rebuild.
- No rewrite of already-good Hulur study content.

# Final Polish Status

Run date: 2026-03-21

Summary:

- Homepage UI flattened and cleaned to a calmer academic reading-site style.
- Homepage cards now follow fixed syllabus class-date order with explicit date labels.
- Homepage helper/admin/build-status copy removed.
- `professor-prep` rebuilt around short oral model answers to “뭐가 흥미로웠어?” style prompts.
- All readings now render populated `professor-prep` pages with 12 model-answer cards each.
- Full site rebuilt into `docs/` only.

Validation:

- `docs/index.html` rebuilt successfully.
- Homepage order matches the 27-item syllabus order.
- Homepage date labels use class dates and do not show `5/05`.
- Every reading has `docs/readings/<slug>/professor-prep.html`.
- Every professor-prep page renders at least 10 model answers.

## Hulur Reading Pass

Date: 2026-03-21

Completed:

- Processed only `hulur-et-al-2019` for this pass.
- Replaced the reading's `full.md` with a cleaned section-ordered main-text view.
- Replaced the reading's `translation.md` with a contiguous Korean translation covering the same main-body sections.
- Added deployable PDF metadata and generated `docs/pdfs/hulur-et-al-2019.pdf`.
- Added visible shared-header PDF buttons for Hulur on `index.html`, `full.html`, and `translation.html`.
- Updated the Hulur overview page to show class date `3/24`, reading type `논문`, a one-sentence hook, and five classroom points.

Coverage:

- Full text coverage: complete for the readable main body.
- Translation coverage: complete for the readable main body.
- Deployable PDF access: complete.

Manual review still needed:

- Read through the cleaned English full text once more against the PDF for sentence-level fidelity in methods/results wording.
- Spot-check the Korean translation for preferred terminology and speaking tone before using it in class discussion.
- Confirm whether the summary page should be rewritten in a later dedicated pass so it matches the stronger full-text/translation quality.

## Hulur Study Package Pass

Date: 2026-03-21

Completed:

- Rewrote `summary.md` as a real study summary focused on the paper's question, significance, and likely class follow-up points.
- Rewrote `concepts.md` with exact concept definitions, English terms, student-language explanations, why-each-matters notes, and confusion points.
- Rebuilt `pitfalls.md` around actual confusions in this paper: cohort vs age, level vs decline, work vs education, association vs causation, selection vs environment, subjective vs objective, control vs autonomy.
- Replaced all three quiz sources with 15-item sets each:
  - OX 15
  - short-answer 15
  - multiple-choice 15
- Rebuilt `review-sheet.md` into a compact exam-recovery page.
- Rebuilt `professor_prep.json` into a 10-card source deck that renders as 12 model-answer cards and is tuned to direct class-style prompts.
- Preserved deployable PDF access and confirmed header PDF buttons still render on `index.html`, `summary.html`, `full.html`, `translation.html`, and `review-sheet.html`.

Validation:

- `docs/readings/hulur-et-al-2019/summary.html` exists.
- `docs/readings/hulur-et-al-2019/concepts.html` exists.
- `docs/readings/hulur-et-al-2019/pitfalls.html` exists.
- `docs/readings/hulur-et-al-2019/quiz-ox.html` exists.
- `docs/readings/hulur-et-al-2019/quiz-short.html` exists.
- `docs/readings/hulur-et-al-2019/quiz-mcq.html` exists.
- `docs/readings/hulur-et-al-2019/review-sheet.html` exists.
- `docs/readings/hulur-et-al-2019/professor-prep.html` exists.
- `docs/pdfs/hulur-et-al-2019.pdf` still exists.
- Reading-hub links point to all required study pages.
- Deployable PDF access is intact.

Still needs review:

- Spoken-Korean tuning on the professor-prep answers should be tested once in an actual class-style rehearsal.
- Distractor quality in the multiple-choice quiz is solid enough to ship, but one more refinement pass could make a few wrong options even more deceptively classroom-realistic.
- A few answers on the professor-prep page are intentionally compact; if the instructor pushes for longer back-and-forth, those recovery lines may need a second spoken-style pass.

Weak sections needing possible second pass:

- Professor-prep can still be sharpened further if the goal shifts from strong static study aid to highly performative spoken delivery.
- Review-sheet is intentionally compact; if the course turns more exam-heavy, it may need one denser cram version later.

## Hulur Study Package Refinement Pass

Date: 2026-03-21

Completed:

- Processed only `hulur-et-al-2019` in this pass.
- Rewrote `summary.md` so the page now centers the real research question, the main finding, why it matters, and likely class follow-up points.
- Rewrote `concepts.md` with exact definitions, English terms, student-language explanations, why-each-matters notes, and confusion points.
- Rewrote `pitfalls.md` around paper-specific confusions: cohort vs age, level vs decline, education vs work environment, control vs autonomy, association vs causation, selection vs environment, subjective vs objective.
- Replaced all three quiz source files with 15-item sets each and kept the short-answer file within the repository rule set.
- Rebuilt `review-sheet.md` as a compact exam-facing recovery page.
- Replaced `professor_prep.json` with a 16-card source deck made only of `title` and `answer_30s`, all within the single frame of “이 글을 어떻게 읽었는지”.
- Adjusted the shared professor-prep build logic so minimal 30-second-answer cards render cleanly without breaking older professor-prep sources.
- Rebuilt Hulur plus the homepage into `docs/` only.

Validation:

- `docs/readings/hulur-et-al-2019/summary.html` exists.
- `docs/readings/hulur-et-al-2019/concepts.html` exists.
- `docs/readings/hulur-et-al-2019/pitfalls.html` exists.
- `docs/readings/hulur-et-al-2019/quiz-ox.html` exists.
- `docs/readings/hulur-et-al-2019/quiz-short.html` exists.
- `docs/readings/hulur-et-al-2019/quiz-mcq.html` exists.
- `docs/readings/hulur-et-al-2019/review-sheet.html` exists.
- `docs/readings/hulur-et-al-2019/professor-prep.html` exists.
- `docs/pdfs/hulur-et-al-2019.pdf` still exists.
- Hulur reading-hub links point to all required study pages.
- Header PDF buttons still render on `index.html`, `full.html`, `translation.html`, `summary.html`, and `review-sheet.html`.
- Professor-prep now renders 16 model-answer cards.

Still needs review:

- One spoken rehearsal pass would still help trim a few professor-prep answers into even more natural class-speed Korean.
- A few multiple-choice distractors are already classroom-realistic, but they could still be made slightly trickier in a later polish pass.

Deployable PDF access:

- Intact.

Weak sections needing possible second pass:

- Professor-prep answers are strong and specific, but several are still slightly text-like rather than fully oral-performance tuned.
- The review sheet is intentionally compact; if the course shifts toward denser written exams, a higher-density cram version may still be useful later.

## Hulur Stage 1 Correction Pass

Date: 2026-03-21

Processed:

- Processed only `hulur-et-al-2019` in this pass.
- Removed the old abridged `full.md` so the reading now builds `full.html` from the extracted source text in `cleaned.md`.
- Replaced `translation.md` with a fuller Korean translation that restores method, matching, robustness-check, and limitation details that had been compressed away.
- Left `summary.md` untouched so the summary page remains separate from the full-text and translation pages.

Stage 1 status:

- Full original text: complete in `docs/readings/hulur-et-al-2019/full.html` as extracted source-text view.
- Full Korean translation: complete for the readable main-body section flow in `docs/readings/hulur-et-al-2019/translation.html`.
- Summary separation: maintained. `summary.html` remains a distinct page from `full.html` and `translation.html`.

Manual review still needed:

- Compare `full.html` against the PDF once more for page-break noise, table carryover, and figure-caption placement in the extracted source text.
- Spot-check `translation.html` against the PDF for sentence-level fidelity in dense methods/results passages.
- Reference formatting is preserved through the PDF; citation layout in the HTML translation view is intentionally lighter and should be treated as a reading aid, not the canonical citation layout.
