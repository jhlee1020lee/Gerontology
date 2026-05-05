# Stage 3 Work Log

## 2026-05-05 - summary rebuild after source approval

- Target page family: `summary`
- Reason: the prior summary was schema-valid but too thin for approval; it did not preserve the paper's comparison groups, hypotheses, interaction pattern, cause-specific mortality nuance, and limitations.
- Working unit: `1 reading x 1 page family x 1 rebuild pass`
- Scope: replaced `summary.md` with a reading-grounded summary covering caregiver mortality benefit, Healthy Caregiver Hypothesis, HRS sample and caregiving definitions, Cox/competing-risk methods, all-cause mortality, self-rated-health interaction, cause-specific results, and observational limitations.
- Evidence basis: approved `full.md` abstract, introduction, method, results, discussion, limitations, and conclusion.
- QA status: source-only validation completed; `summary` approval hash pinned in `meta.json`.

## 2026-05-05 - pitfalls rebuild after summary approval

- Target page family: `pitfalls`
- Reason: the prior pitfalls page used generic corrections and did not explicitly defend the paper's comparison groups, interaction logic, cause-specific mortality nuance, or observational limits.
- Working unit: `1 reading x 1 page family x 1 rebuild pass`
- First micro-chunk P1: pitfalls 1-4 drafted around caregiving burden versus mortality benefit, dementia versus nondementia caregiving groups, Healthy Caregiver Hypothesis, and main effect versus interaction.
- P1 review: includes concrete anchors such as dementia caregiver HR 0.71, poor-health noncaregiver HR 4.78, poor-health dementia caregiver HR 1.51, and F(4,52)=38.61.
- Expansion P2: pitfalls 5-8 drafted around all-cause versus cause-specific mortality, protective direction versus statistical certainty, self-rated health versus objective health, and observational association versus causality.
- Evidence basis: approved `full.md` method, results, discussion, limitations, approved `summary.md`, and `concepts.md`.
- QA status: source-only validation completed; `pitfalls` approval hash pinned in `meta.json`.

## 2026-05-05 - review-sheet rebuild after pitfalls approval

- Target page family: `review-sheet`
- Reason: the prior review sheet was too generic for last-minute recovery and omitted the paper's concrete numbers, contrast pairs, quiz traps, English terms, and causal caveats.
- Working unit: `1 reading x 1 page family x 1 rebuild pass`
- First micro-chunk R1: sections for 1-minute framing, must-memorize numbers, and required contrast pairs.
- R1 review: preserves the paper's HRS sample, dementia caregiver count, all-cause HR, interaction test, poor-health HR contrast, and cause-specific mortality nuance.
- Expansion R2: sections for popup-quiz points and English terms.
- Evidence basis: approved `full.md`, approved `summary.md`, approved `pitfalls.md`, and `concepts.md`.
- QA status: source-only validation completed; `review-sheet` approval hash pinned in `meta.json`.

## 2026-05-04 - concepts schema refresh

- Target page family: `concepts`
- Reason: continue the validated 4/30 and 5/07 concepts refresh workflow to the next unfinished date, 5/21.
- Working unit: `1 reading x 1 page family x 1 micro-chunk`
- Micro-chunk C1: concepts 1-4, drafted and merged into `concepts.md`.
- Evidence basis: `full.md` abstract, introduction, HRS sample definition, self-rated health effect-modifier section, and mortality-benefit discussion.
- C1 source-only QA: validator now reports only the expected remaining schema errors for concepts 5-8.
- C1 review: structure holds. The entries preserve the tension between caregiver burden, survival advantage, and the Healthy Caregiver Hypothesis.
- Micro-chunk C2: concepts 5-8, drafted and merged into `concepts.md`.
- C2 evidence basis: `full.md` method and results sections for Cox models, all-cause mortality, cause-specific mortality, competing risks, and the dementia caregiving by self-rated health interaction.
- C2 source-only QA: complete `concepts` page family passes schema validation with 8 concept sections and 48 required bullet fields.
- Build/validation: `node scripts/build_site.js --slug leggett-et-al-2020` completed, then default validation confirmed `concepts` remains `schema_pass`.
- Remaining work: unrelated Stage 2 artifact status and Stage 3 families still require review/rebuild; source-only remaining schema failures are `professor_prep`, `quiz_ox`, `quiz_short`, and `quiz_mcq`.

## 2026-05-04 - quiz_ox particle-template repair

- Target page family: `quiz_ox`
- Reason: extend the validated `quiz_ox` repair workflow to the next unfinished date, 5/21.
- Working unit: `1 reading x 1 page family x 1 repair pass`
- Scope: preserved the existing 15 OX item set and converted the affected English-term prompts into Korean concept labels with English terms in parentheses.
- Evidence basis: existing `quiz-ox.json` item prompts and explanations, aligned with the paper's dementia caregiving, self-rated health, mortality benefit, Healthy Caregiver Hypothesis, Cox model, all-cause mortality, cause-specific mortality, and interaction concepts.
- QA status: source-only validation reports `quiz_ox` as `schema_pass`; missing `evidence_segment_id` warnings remain legacy/non-approval-ready warnings and other Stage 3 families remain out of scope for this pass.

## 2026-05-04 - quiz_short particle-template repair

- Target page family: `quiz_short`
- Reason: extend the validated `quiz_short` repair workflow to 5/21; validator flagged unresolved Korean particle templates in item explanations 1-8 and an accepted-answer leak in item 13.
- Working unit: `1 reading x 1 page family x 1 repair pass`
- Scope: preserved the existing 15 short-answer item set, converted affected explanation labels to Korean concept labels plus English terms, added Korean accepted-answer variants for key English terms, and revised items 6, 7, and 13 so accepted answers are not embedded in the questions.
- Evidence basis: existing `quiz_short.json` item prompts, accepted answers, and explanations for dementia caregiving, self-rated health, mortality benefit, Healthy Caregiver Hypothesis, Cox model, all-cause mortality, cause-specific mortality, and interaction.
- QA status: source-only validation reports `quiz_short` as `schema_pass`; missing `evidence_segment_id` warnings remain legacy/non-approval-ready warnings and other Stage 3 families remain out of scope for this pass.

## 2026-05-04 - quiz_mcq answer-position repair

- Target page family: `quiz_mcq`
- Reason: extend the validated MCQ repair workflow to 5/21; validator flagged that every item used the same answer position.
- Working unit: `1 reading x 1 page family x 1 repair pass`
- First batch Q1: items 1-5 reviewed around dementia caregiving, self-rated health, mortality benefit, Healthy Caregiver Hypothesis, and Cox survival models.
- Q1 review: answer positions now vary and explanations distinguish exposure, modifier, outcome, hypothesis, and method concepts.
- Scope: preserved the existing 15 MCQ item topics, varied correct-answer positions, replaced an over-compressed result answer with a meaningful phrase, removed a potential multi-answer distractor in the cause-specific mortality item, and strengthened explanations to rebut tempting wrong options.
- Evidence basis: existing `quiz-mcq.json` prompts and options, cross-checked with `concepts.md` sections 1-8 and the validated `quiz_short`/`quiz_ox` coverage.
- QA status: source-only validation reports `quiz_mcq` as `schema_pass`; missing `evidence_segment_id` warnings remain legacy/non-approval-ready warnings and other Stage 3 families remain out of scope for this pass.

## 2026-05-04 - professor_prep schema rewrite

- Target page family: `professor_prep`
- Reason: continue the new Stage 3 professor-prep cleanup for 5/21; the old file used a legacy verbose schema, had only 8 cards, and did not meet the current 15-card gate.
- Working unit: `1 reading x 1 page family x 1 rebuild pass`
- First checkpoint batch PP1: cards 1-5 drafted around the burden-versus-mortality-benefit tension, dementia spousal caregiving definition, HRS sample, comparison groups, and self-rated health.
- PP1 review: cards keep the article's student answer shape by starting from what was surprising in the reading rather than reciting definitions.
- Expansion PP2: cards 6-10 drafted around the Healthy Caregiver Hypothesis, Cox survival models, all-cause mortality HR, the poor-health interaction contrast, and cause-specific mortality.
- Expansion PP3: cards 11-15 drafted around burden plus benefit, possible health-maintenance mechanism, caregiver system model, observational limits, and Korean family-care transfer.
- Evidence basis: `full.md` abstract, sample/method, Cox-model results, interaction result, cause-specific mortality section, discussion, and limitations; checked against `summary.md`, `concepts.md`, `pitfalls.md`, and `review-sheet.md`.
- QA status: source-only validation reports `professor_prep` as `schema_pass` with 15 cards; other Stage 3 families remain out of scope for this pass.

## 2026-05-06 - professor-prep reading-lens refresh
- Target page family: `professor-prep`
- Reason: user corrected the answer shape; oral answers should foreground how the student read the text and what they focused on, not neutral concept summary.
- Working unit: repository-wide policy-sync refresh requested by the user; this reading's page family was updated and re-approved.
- Scope: revised 13 card opening(s) to foreground reading lens, changed expectation, distinction, or study focus while preserving existing concrete reading anchors.
- QA status: source schema, build, and artifact-inclusive validation pending after this rewrite.

## 2026-05-06 - professor-prep opening variety refinement
- Target page family: `professor-prep`
- Scope: replaced 11 repeated generic reading-lens opening(s) with card-title-specific openings.
- QA status: source schema, build, and artifact-inclusive validation pending after refinement.
