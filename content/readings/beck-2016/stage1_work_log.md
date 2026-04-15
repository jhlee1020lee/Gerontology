# Beck (2016) Stage 1 rebuild log

- updated_at: `2026-04-15`
- slug: `beck-2016`
- source_pdf: `source_pdfs/Beck, 2016.pdf`
- canonical_output: `content/readings/beck-2016/full.md`
- current_status: `Stage 1 approved`

## Source basis

- The local PDF text layer is usable only for the first-page header/deck and printed source metadata.
- `content/readings/beck-2016/raw.txt` records the original recovery source as:
  - `https://www.theatlantic.com/health/archive/2016/01/when-are-you-really-an-adult/422487/`
- The rebuilt `full.md` was recovered from the article page's structured content payload rather than from the previously authored study-prose version.
- Site-side insertions such as `Read Follow-Up Notes` and `Recommended Reading` were excluded from the reading body.

## Rebuild actions

- Rebuilt `full.md` from the Atlantic article body in source order.
- Preserved the article's reader-response blockquote flow inside the markdown body.
- Downloaded and inserted the source visual assets used in the article body:
  - `content/readings/beck-2016/figures/lead-art.gif`
  - `content/readings/beck-2016/figures/image-01.jpg`
  - `content/readings/beck-2016/figures/image-02.jpg`
- Rebuilt `translation.md` from the new Stage 1 source body, preserving the same image positions.

## QA

- Source-only validation:
  - command: `node scripts/validate_content.js --slug beck-2016 --source-only`
  - result after Stage 1 rebuild only: reading `partial`, Stage 1 `manual_review_required`, Stage 2 `partial`, Stage 3 `approved`
  - result after Stage 2 rebuild: reading `manual_review_required`, Stage 1 `manual_review_required`, Stage 2 `manual_review_required`, Stage 3 `approved`
- Artifact-inclusive validation:
  - command: `node scripts/validate_content.js --slug beck-2016`
  - final result: reading `approved`, Stage 1 `approved`, Stage 2 `approved`, Stage 3 `approved`
- Build:
  - command: `node scripts/build_site.js --slug beck-2016`
  - final output pages: `docs/readings/beck-2016/index.html`, `full.html`, `translation.html`
- Manual spot checks completed:
  - article title, author, and date against `raw.txt`
  - opening Henry Thoreau section against the Atlantic source page
  - body-only filtering for non-reading modules
  - inline image positions and counts

## Remaining work

- None for the current `full + translation` scope.

## Notes

- This reading is now intentionally limited to `full` and `translation` via `enabled_page_keys` in `meta.json`.
- Manual approval hashes for `full` and `translation` are now recorded in `meta.json`.
- Stage 3 study-page families remain disabled for this slug and should not be regenerated unless the reading scope changes again.
