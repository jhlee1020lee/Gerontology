# Stage 3 Work Log

## 2026-05-05 - summary, pitfalls, review-sheet rebuild

- Target page family: `summary`, `pitfalls`, `review-sheet`
- Reason: the previous three page families were schema-valid but too generic for the newly cleaned Stage 1 source.
- Working unit: `1 reading x 1 page-family group x 1 rebuild pass`, limited to the weak shared study-note pages while leaving already approved concepts, quizzes, and professor-prep unchanged.
- Evidence basis: cleaned `full.md` sections on friendship voluntariness/homogeneity, neighbor geographic proximity, 2017 Korean survey figures, gender and residence differences, structural/function social-network distinction, convoy model, support-provider models, social support effects, social engagement, social influence, and Rowe/Kahn conclusions.
- Scope: rebuilt `summary.md`, `pitfalls.md`, and `review-sheet.md` with concrete reading-specific distinctions, numbers, and comparison frames.
- QA status: source-only validation reports the reading as schema-valid; final build and artifact-inclusive validation remain pending.

## 2026-05-04 - concepts schema refresh

- Target page family: `concepts`
- Reason: apply the new guide/schema requirements to the 4/30 reading before expanding the same workflow to 5/07.
- Working unit: `1 reading x 1 page family x 1 micro-chunk`
- Evidence basis: `full.md` pages 3-6 for friendship, voluntariness, homogeneity, and neighbor relationships.
- Micro-chunk C1: concepts 1-4, drafted and merged into `concepts.md`.
- C1 source-only QA: validator now reports only the expected remaining schema errors for concepts 5-8; concepts 1-4 have the required labels and reading-specific explanations.
- C1 review: structure holds. The entries distinguish friendship from neighbor ties and foreground voluntariness/homogeneity rather than generic relationship prose.
- Micro-chunk C2: concepts 5-8, drafted and merged into `concepts.md`.
- C2 evidence basis: `full.md` pages 9-16 and pages 19-21 for social network structure, convoy model, functional characteristics, and social support.
- QA status: source-only validation pending for the complete `concepts` page family.
- Remaining work: run source-only QA, then build and artifact-inclusive validation if the page family is stable.

## 2026-05-04 - quiz_ox particle-template repair

- Target page family: `quiz_ox`
- Reason: continue the new page-family cleanup after `concepts`; the validator flagged unresolved Korean particle templates in items 1-8.
- Working unit: `1 reading x 1 page family x 1 repair pass`
- Scope: preserved the existing 15 OX item set, corrected the visible `은(는)` particle templates in item prompts, and rewrote one duplicate social-network prompt to cover relationship tension and role structure.
- Evidence basis: existing `quiz-ox.json` item prompts and explanations, which are already anchored to the reading's friendship, neighbor relationship, social network, and social support sections.
- QA status: source-only validation reports `quiz_ox` as `schema_pass`; missing `evidence_segment_id` warnings remain legacy/non-approval-ready warnings and other Stage 3 families remain out of scope for this pass.

## 2026-05-04 - quiz_short particle-template repair

- Target page family: `quiz_short`
- Reason: start the next Stage 3 quiz family from the 4/30 pilot reading; validator flagged unresolved Korean particle templates in item explanations 1-8.
- Working unit: `1 reading x 1 page family x 1 repair pass`
- Scope: preserved the existing 15 short-answer item set and corrected only the visible `은(는)` particle templates in explanations.
- Evidence basis: existing `quiz_short.json` item prompts, accepted answers, and explanations for friendship, neighbor relationships, social networks, structural/functional characteristics, and social support.
- QA status: source-only validation reports `quiz_short` as `schema_pass`; missing `evidence_segment_id` warnings remain legacy/non-approval-ready warnings and other Stage 3 families remain out of scope for this pass.

## 2026-05-04 - quiz_mcq answer-position repair

- Target page family: `quiz_mcq`
- Reason: start the MCQ pass from the 4/30 pilot reading; validator flagged that every item used the same answer position.
- Working unit: `1 reading x 1 page family x 1 repair pass`
- First batch Q1: items 1-5 reviewed around friendship, neighbor relationships, voluntariness, homogeneity, and social networks.
- Q1 review: distractors are neighboring concepts from the same reading, and explanations now identify at least one tempting wrong option.
- Scope: preserved the existing 15 MCQ item topics, varied correct-answer positions across options, and strengthened explanations to distinguish close distractors.
- Evidence basis: existing `quiz-mcq.json` prompts and options, cross-checked with `concepts.md` sections 1-8 and the validated `quiz_short`/`quiz_ox` coverage.
- QA status: source-only validation reports `quiz_mcq` as `schema_pass`; missing `evidence_segment_id` warnings remain legacy/non-approval-ready warnings and other Stage 3 families remain out of scope for this pass.

## 2026-05-04 - professor_prep rewrite

- Target page family: `professor_prep`
- Reason: continue the new Stage 3 professor-prep cleanup; the old file used a legacy verbose schema, had only 8 cards, and did not meet the current 15-card gate.
- Working unit: `1 reading x 1 page family x 1 rebuild pass`
- First checkpoint batch PP1: cards 1-5 drafted around family-outside relationships, friendship as voluntary and homogeneous, ambiguous friendship measurement, neighbor proximity, and urban neighbor interactions.
- PP1 review: cards foreground reading angles rather than definition-only prose and include concrete anchors such as the 2009 urban-neighbor survey.
- Expansion PP2: cards 6-10 drafted around Korean friend/neighbor scale measures, gendered friendship functions, social networks as whole relationship systems, structural/functional characteristics, and the convoy model.
- Expansion PP3: cards 11-15 drafted around selective network shrinkage, social support versus social network, hierarchical compensatory and task-specific models, friend/neighbor support specialization, and health/social-participation links.
- Evidence basis: `full.md` friendship, neighbor relationship, Korean survey, gender difference, social network, convoy model, social support, support-provider model, and health/social-participation sections; checked against `summary.md`, `concepts.md`, `pitfalls.md`, and `review-sheet.md`.
- QA status: source-only validation reports `professor_prep` as `schema_pass`; other Stage 3 families remain out of scope for this pass.

## 2026-05-06 - professor-prep reading-lens refresh
- Target page family: `professor-prep`
- Reason: user corrected the answer shape; oral answers should foreground how the student read the text and what they focused on, not neutral concept summary.
- Working unit: repository-wide policy-sync refresh requested by the user; this reading's page family was updated and re-approved.
- Scope: revised 10 card opening(s) to foreground reading lens, changed expectation, distinction, or study focus while preserving existing concrete reading anchors.
- QA status: source schema, build, and artifact-inclusive validation pending after this rewrite.

## 2026-05-06 - professor-prep opening variety refinement
- Target page family: `professor-prep`
- Scope: replaced 10 repeated generic reading-lens opening(s) with card-title-specific openings.
- QA status: source schema, build, and artifact-inclusive validation pending after refinement.
