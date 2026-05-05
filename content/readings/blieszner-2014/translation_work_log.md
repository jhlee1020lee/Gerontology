# Translation Work Log

## 2026-05-05 - Stage 2 alignment rebuild

- Target stage: `한국어 번역`
- Working unit: `1 reading x 1 stage x 1 pass`
- Source basis: cleaned `full.md` and `source_segments.json`
- Scope: rebuilt `translation.md` and created `translation_segments.json` so every source segment has one matching Korean translation segment.

## Changes

- Reordered the opening pull-quote translation to match the cleaned source order.
- Rebuilt translation paragraphs around the same 71 segment IDs used by `source_segments.json`.
- Reordered references to match the cleaned source reference order.
- Corrected stale reference/title/name issues found during review, including `She'll Be On My Heart`, `Café`, `Véronneau`, and `Schüz`.
- Restored the ASA publisher copyright notice and retained the EBSCO/Generations copyright notice.
- Marked photo/page references in a way the alignment checker can verify.

## QA

- `node scripts/check_alignment.js --slug blieszner-2014 --strict --write-report`: `PASS blieszner-2014 (71/71)`.
- `node scripts/validate_content.js --slug blieszner-2014 --source-only`: Stage 2 remains approval-gated until the manual hash is pinned.
- Manual spot-check recorded in `translation_qa_checklist.md`.

## Remaining Work

- Run build and artifact-inclusive validation after the Stage 2 approval hash is pinned.
- Stage 3 page families must be rechecked against the new source/translation segment files before approval.
