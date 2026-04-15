# Stage 1 Work Log Template

- start_date: `YYYY-MM-DD`
- slug: `<reading-slug>`
- source_pdf: `source_pdfs/<filename>.pdf`
- reason: `why Stage 1 is starting or restarting`
- status: `Stage 1 partial`
- canonical output: `content/readings/<slug>/full.md`

## Pass Plan

- `Pass 1`: `front third coverage by topic/section`
- `Pass 2`: `middle third coverage by topic/section`
- `Pass 3`: `final third coverage + end-to-end extraction QA`

## Micro-chunk Plan

- `P1-C1`
  - source span: `named section or contiguous PDF/source range`
  - extraction focus: `plain prose / OCR cleanup / table / figure captions / appendix / references`

- `P1-C2`
  - source span: `named section or contiguous PDF/source range`
  - extraction focus: `plain prose / OCR cleanup / table / figure captions / appendix / references`

- `P2-C1`
  - source span: `named section or contiguous PDF/source range`
  - extraction focus: `plain prose / OCR cleanup / table / figure captions / appendix / references`

- `P3-C1`
  - source span: `named section or contiguous PDF/source range`
  - extraction focus: `plain prose / OCR cleanup / table / figure captions / appendix / references`

## Micro-chunk Status

- `P1-C1`
  - source span: `named section or contiguous PDF/source range`
  - status: `drafted | merged | reopened`
  - source-order merge: `complete | pending`
  - PDF/source spot check: `complete | pending`
  - source-only QA: `command run + short result`
  - notes: `OCR issues, figure insertion notes, page-break cleanup, unresolved risks`

- `P1-C2`
  - source span: `named section or contiguous PDF/source range`
  - status: `drafted | merged | reopened`
  - source-order merge: `complete | pending`
  - PDF/source spot check: `complete | pending`
  - source-only QA: `command run + short result`
  - notes: `OCR issues, figure insertion notes, page-break cleanup, unresolved risks`

- `P2-C1`
  - source span: `named section or contiguous PDF/source range`
  - status: `drafted | merged | reopened`
  - source-order merge: `complete | pending`
  - PDF/source spot check: `complete | pending`
  - source-only QA: `command run + short result`
  - notes: `OCR issues, figure insertion notes, page-break cleanup, unresolved risks`

- `P3-C1`
  - source span: `named section or contiguous PDF/source range`
  - status: `drafted | merged | reopened`
  - source-order merge: `complete | pending`
  - PDF/source spot check: `complete | pending`
  - source-only QA: `command run + short result`
  - notes: `OCR issues, figure insertion notes, page-break cleanup, unresolved risks`

## Pass Checkpoints

- `Pass 1`
  - all planned chunks merged: `yes | no`
  - source-order continuity checked: `yes | no`
  - tables/figures for this pass inserted: `yes | no | not_applicable`
  - remaining reopen items: `none | short list`

- `Pass 2`
  - all planned chunks merged: `yes | no`
  - source-order continuity checked: `yes | no`
  - tables/figures for this pass inserted: `yes | no | not_applicable`
  - remaining reopen items: `none | short list`

- `Pass 3`
  - all planned chunks merged: `yes | no`
  - source-order continuity checked: `yes | no`
  - tables/figures for this pass inserted: `yes | no | not_applicable`
  - end-to-end extraction QA: `pending | complete`

## QA

- source-only validation:
  - `node scripts/validate_content.js --slug <slug> --source-only`
  - result: `full = schema_pass | approved | schema_fail`
- PDF/manual check:
  - abstract/introduction: `checked | pending`
  - methods/body middle: `checked | pending`
  - results/discussion or later body: `checked | pending`
  - references/backmatter: `checked | pending`
- figure/table parity:
  - expected from source: `<count or note>`
  - inserted in `full.md`: `<count or note>`

## Remaining Work

- `list unfinished chunks, reopen regions, or unresolved OCR problems`

## Reopen Notes

- `record confirmed omissions, ordering errors, broken captions, or stale figure placement here`

## Approval Handoff

- build command: `node scripts/build_site.js --slug <slug>`
- publish-candidate validation: `node scripts/validate_content.js --slug <slug>`
- manual review ready: `yes | no`
- final handoff note: `what still needs human approval attention`
