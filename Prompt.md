# Overnight Batch Prompt

This repository run is constrained to the exact pre-midterm reading set only.

Target source files in required processing order:

1. `[CH1]Gerontology.pdf`
2. `[CH2]Gerontology.pdf`
3. `Beck, 2016.pdf`
4. `[CH3]Gerontology.pdf`
5. `[CH4]Gerontology.pdf`
6. `Hülür et al., 2019.pdf`
7. `[CH5]Gerontology.pdf`
8. `Olshansky & Carnes, 2019.pdf`
9. `Kerrigan, 2018.pdf`
10. `[CH6]Gerontology.pdf`
11. `Park & McDonough, 2013.pdf`
12. `[CH7]Gerontology.pdf`
13. `Wagner et al., 2016.pdf`

Core repository rules:

- `docs/` is the only final generated build output folder.
- Keep everything offline and relative-path only.
- Homepage and shared UI stay Korean-first unless original English should remain.
- `manifest/readings.json` is the source of truth.
- Do not hardcode content into HTML when avoidable.
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

Content requirements:

- Cleaned full text
- Korean summary
- Korean translation for English readings
- Concepts
- Pitfalls
- Review sheet
- Professor prep with 8 to 12 cards
- 15 OX
- 15 true short-answer items
- 15 multiple-choice items with 4 options, answer, explanation

Validation focus:

- Short-answer stays truly short-answer
- Professor-prep stays direct, concept-based, and follow-up resistant
- Reading hub links all generated pages
- Builds do not break existing good pages
- `docs/index.html` remains authoritative

Stop condition:

Process every processable target reading in the list above, or log blockers clearly and continue until the list is exhausted.
