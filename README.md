# Adult Aging Reading Site

Local-only static study website scaffold for gerontology readings. The project is manifest-driven, stores source content under `content/readings/<slug>/`, and builds an offline site into `site/` from the current real local reading inventory.

## Structure

- `AGENTS.md`: project rules
- `source_pdfs/`: local source PDFs placed here manually
- `manifest/readings.json`: source of truth for reading metadata and date-based organization
- `content/readings/<slug>/`: authored content files for each reading
- `scripts/`: local utilities for extraction, cleaning, thumbnails, and site generation
- `site/`: generated static HTML/CSS/JS output

## Content Model

Each reading lives in `content/readings/<slug>/` and can contain:

- `full.md`
- `summary.md`
- `translation.md` for English readings
- `concepts.md`
- `pitfalls.md`
- `review-sheet.md`
- `professor-prep.md`
- `quiz-ox.json`
- `quiz-short.json`
- `quiz-mcq.json`

Missing files still generate valid placeholder pages so links never break.

## Manifest Notes

`manifest/readings.json` remains the source of truth. Entries can now carry optional date-oriented fields:

- `class_date`
- `reading_date`
- `sort_date`
- `display_date_label`

Unknown dates should stay `null`, empty, or explicit TODO placeholders. The home page sorts chronologically when those fields exist and otherwise falls back to manifest order.

## Rebuild Locally

1. Put source PDFs into `source_pdfs/` using the filenames referenced in `manifest/readings.json`.
2. Build the site:

```powershell
node scripts/build_site.js
```

3. Open the generated home page locally:

```powershell
start site\index.html
```

## Optional Preprocessing Workflow

Extract raw text from PDFs into each reading folder:

```powershell
python scripts/extract_text.py --all
```

Clean extracted text into draft markdown:

```powershell
python scripts/clean_text.py --all
```

Generate thumbnail images from the first PDF page when possible:

```powershell
python scripts/make_thumbnails.py
```

Then rebuild:

```powershell
node scripts/build_site.js
```

## Notes

- The site uses only static HTML, CSS, and vanilla JavaScript.
- All generated links are relative and work offline.
- Reading landing pages are study-flow pages, not flat link lists.
- Article pages include client-side table of contents, font controls, dark mode, saved reading position, and bookmark / important-mark UI in `localStorage`.
- `site/` is treated as build output and can be regenerated at any time.
