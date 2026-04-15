# Post-midterm Batch Prompt

This repository run is constrained to the exact post-midterm reading set only.

Target source files in required processing order:

1. `[CH8]Gerontology.pdf`
2. `Suitor et al., 2014.pdf`
3. `[CH9]Gerontology.pdf`
4. `[CH10]Gerontology.pdf`
5. `Blieszner, 2014.pdf`
6. `[CH11]Gerontology.pdf`
7. `Calvo et al., 2018.pdf`
8. `[CH12]Gerontology.pdf`
9. `Leggett et al., 2020.pdf`
10. `[CH13]Gerontology.pdf`
11. `Konrath et al., 2012.pdf`
12. `[CH14]Gerontology.pdf`
13. `[CH15]Gerontology.pdf`
14. `Carr & Fang, 2021.pdf`

Core repository rules:

- `docs/` is the only final generated build output folder.
- Keep everything offline and relative-path only.
- Homepage and shared UI stay Korean-first unless original English should remain.
- `manifest/readings.json` is the source of truth.
- Do not hardcode content directly into HTML when avoidable.
- Keep reading overview pages visually aligned with article pages.

Per-reading deliverables:

- `index.html`
- `full.html`
- `summary.html`
- `translation.html` for English readings only
- `concepts.html`
- `pitfalls.html`
- `review-sheet.html`
- `professor-prep.html`
- `quiz-ox.html`
- `quiz-short.html`
- `quiz-mcq.html`

Stop condition:

Process every processable target reading in the list above, or log blockers clearly and continue until the list is exhausted.
