# Stage 1 Work Log

## 2026-05-05 - full text cleanup

- Target page family: `full`
- Working unit: `1 reading x 1 stage x 1 pass`
- Source: `content/readings/calvo-et-al-2018/full.md`, checked against `raw.txt` and the extracted article structure.
- Scope: removed repeated journal page headers, page numbers, and citation furniture; normalized the article title/author block; joined wrapped prose paragraphs; repaired common PDF hyphenation artifacts such as broken `destandardization`, `unconventional`, `full-time`, `part-time`, and `Madero-Cabib`.
- Preservation note: tables and figure captions remain as extracted text rather than reconstructed image/table assets, so the validator's standalone figure/table-label warning is expected for this pass.
- QA status: source-only validation reports `full` as `schema_pass` with 7,751 words, 11 second-level sections, 16 third-level sections, and the expected figure/table warning only.
