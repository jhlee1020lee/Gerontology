# Beck (2016) Stage 2 translation log

- updated_at: `2026-04-15`
- slug: `beck-2016`
- source: `content/readings/beck-2016/full.md`
- canonical_output: `content/readings/beck-2016/translation.md`
- current_status: `Stage 2 approved`
- workflow_note: current `translation.md` already exists and is approved; this log is a retroactive chunk-safe map so future revisions can reopen one pass/chunk at a time instead of touching the whole file at once

## Pass Plan

- `Pass 1`
  - scope: title/deck through the early legal/biological/cultural-transition discussion and the first brain-development section
  - target source span: opening through the first inline image and the voting/maturity discussion

- `Pass 2`
  - scope: the "flailing" section through `emerging adulthood`, `Big Three`, identity, purpose, and the Taylor Swift quotation
  - target source span: post-brain anonymous reader quote through the end of the mid-body developmental discussion

- `Pass 3`
  - scope: traditional adulthood markers, parenthood/caregiving, privilege, resistance to the word `adult`, and the ending interpretation
  - target source span: `Leave it to Beaver` discussion through the Impressionist-painting conclusion

## Micro-chunk Map

- `P1-C1`
  - target span: title/deck, Henry Thoreau opening, Maria reader quote, adulthood as social construct, legal adulthood, biological maturity
  - current merged state: `present in translation.md`
  - current QA state: `approved in merged file`
  - latest note: `2026-04-15 refresh` - opening title/lead phrasing and early-body wording tightened against `full.md`
  - reopen trigger: quote tone, proper-name handling, or age/legal-threshold wording issues

- `P1-C2`
  - target span: Stephen reader quote, cultural transitions, schooling, brain maturation, first inline image, voting/maturity discussion
  - current merged state: `present in translation.md`
  - current QA state: `approved in merged file`
  - latest note: `2026-04-15 refresh` - ceremony / schooling / brain-maturation wording tightened and visible `---` separators removed across Pass 1
  - reopen trigger: neuroscience wording, ceremony examples, or image-position drift

- `P2-C1`
  - target span: anonymous OB/GYN quote, `flailing`, definition and debate over `emerging adulthood`
  - current merged state: `present in translation.md`
  - current QA state: `approved in merged file`
  - latest note: `2026-04-15 refresh` - anonymous OB/GYN quote, `flailing`, and `emerging adulthood` debate wording tightened; visible `---` separators removed entering Pass 2
  - reopen trigger: life-stage terminology, quote tone, or age-boundary phrasing

- `P2-C2`
  - target span: `Big Three`, Erikson, identity/purpose, exploration costs, Taylor Swift quote
  - current merged state: `present in translation.md`
  - current QA state: `approved in merged file`
  - latest note: `2026-04-15 refresh` - `Big Three`, Erikson, purpose/exploration discussion, and Taylor Swift quote wording tightened; trailing visible `---` separator removed at the end of Pass 2
  - reopen trigger: concept-term consistency, list logic, or quote rendering

- `P3-C1`
  - target span: harsh anonymous doctor quote, Havighurst, `Leave it to Beaver`, historical anomaly, second inline image, wedding / dirty-dishes section
  - current merged state: `present in translation.md`
  - current QA state: `approved in merged file`
  - latest note: `2026-04-15 refresh` - harsh anonymous doctor quote, `Leave it to Beaver` comparison, historical-anomaly discussion, and wedding / dirty-dishes wording tightened; visible `---` separators removed around the chunk
  - reopen trigger: historical-comparison wording, sarcasm/tone handling, or image-position drift

- `P3-C2`
  - target span: Deb Bissen quote, caregiving quote, parenthood as marker, `quiet thing` section
  - current merged state: `present in translation.md`
  - current QA state: `approved in merged file`
  - latest note: `2026-04-15 refresh` - Deb Bissen quote, caregiving quote, parenthood marker, and `quiet thing` section wording tightened; visible `---` separators removed around the chunk
  - reopen trigger: quote compression risk or responsibility/caregiving nuance

- `P3-C3`
  - target span: privilege discussion, child-question reversal, resistance to the word `adult`, devalued adulthood, closing metaphor
  - current merged state: `present in translation.md`
  - current QA state: `approved in merged file`
  - latest note: `2026-04-15 refresh` - privilege discussion, `adult`-resistance quotes, devalued-adulthood framing, and the closing fish / Impressionist metaphor wording tightened; visible `---` separators removed around the chunk
  - reopen trigger: social-class nuance, closing metaphor, or final-paragraph interpretation drift

## QA

- source-only validation:
  - command: `node scripts/validate_content.js --slug beck-2016 --source-only`
  - result: reading `approved`, Stage 1 `approved`, Stage 2 `approved`, Stage 3 `approved`

- artifact-inclusive validation:
  - command: `node scripts/validate_content.js --slug beck-2016`
  - result: reading `approved`, Stage 1 `approved`, Stage 2 `approved`, Stage 3 `approved`

- build:
  - command: `node scripts/build_site.js --slug beck-2016`
  - result: `docs/readings/beck-2016/full.html`, `index.html`, `translation.html` rebuilt

## How To Reopen Safely

- Reopen only `1` pass and `1` chunk at a time.
- Do not wipe the whole `translation.md` unless the user explicitly asks for a full Stage 2 restart.
- If a terminology rule changes, patch only the affected chunk first and rerun `--source-only` before touching later spans.
- If `full.md` changes, stop Stage 2 edits, re-anchor the affected chunk spans to the new source, and only then continue.

## Remaining Work

- None for the current approved `beck-2016` Stage 2 body.
- If the user wants a stricter chunk-by-chunk retranslation from scratch, start by reopening `P1-C1` and resetting Stage 2 approval in `meta.json`.
