Static gerontology reading site built from manifest-driven source content and published from `docs/` as deployable static output.

## Document Map
- [README.md](README.md): onboarding and common commands
- [AGENTS.md](AGENTS.md): collaborator-facing checklist
- [CONTENT_RULES.md](CONTENT_RULES.md): detailed workflow, validation, homepage order, and page rules

When docs conflict on detailed policy, follow [CONTENT_RULES.md](CONTENT_RULES.md).

## What This Repo Is
- Static HTML, CSS, and vanilla JavaScript only
- Homepage is a responsive reading-card grid with one card per reading
- Manifest-driven from `manifest/readings.json`
- Authored reading content lives under `content/readings/<slug>/`
- Final generated site output goes to `docs/` only
- Links stay relative so the output works from local preview and static hosting

## Key Paths
- `manifest/readings.json`: reading inventory and build metadata
- `content/readings/<slug>/`: authored reading content and structured study assets
- `source_audio/`: source/input lecture recordings
- `source_pdfs/`: source/input PDFs when available
- `scripts/`: build and validation utilities
- `docs/`: final generated static site output and deployable public assets

Common authored files in a reading folder include:

- `meta.json`
- `full.md`
- `summary.md`
- `translation.md` for English readings
- `translation_alignment.json` for approved reveal-enabled English translations
- `translation_work_log.md` when Stage 2 spans multiple sessions or contributors
- `stage3_work_log.md` when Stage 3 spans multiple sessions or contributors
- `concepts.md`
- `pitfalls.md`
- `review-sheet.md`
- `professor_prep.json`
- quiz source JSON files for OX, short-answer, and MCQ pages

Lecture-workflow bundles live under:

- `transcripts/lecture-workflow/YYYY-MM-DD-<reading-slug>/`
- keep `session.json` there as the workflow-status source of truth for lecture-informed refresh work

## Workflow At A Glance
- Work one reading at a time.
- Treat extraction, translation, study-package pages, and lecture-recording analysis as separate stages.
- Keep `full.html` as full original text and `translation.html` as full Korean translation for English readings.
- Use the long-form reading layout only on `full.html` and `translation.html`.
- Use `summary.html` as the only summarized page.
- Never do a full-reading all-at-once batch.
- For Stage 2, keep the public pass model at `Pass 1 / Pass 2 / Pass 3`, but do the real translation work in smaller micro-chunks and merge them in source order.
- `source words` for Stage 2 chunk sizing means words from the current normalized `full.md`, not raw PDF OCR.
- If Stage 2 spans multiple sessions, keep `translation_work_log.md` with chunk coverage, source-only QA status, and remaining work.
- For Stage 3, also work one page family at a time in smaller micro-chunks and merge them back into the canonical source file in order.
- If Stage 3 spans multiple sessions, keep `stage3_work_log.md` with chunk coverage, evidence basis, QA status, and reopen notes.
- Stage 3 expansion is gated: review the first chunk for `summary`, `concepts`, `pitfalls`, and `review-sheet`; review the first batch for quizzes; review the first `3` to `5` cards for `professor-prep`.
- Some approved English `translation.html` pages may expose original-text reveal by `paragraph`, `sentence_group`, or `context_block` using `translation_alignment.json`.
- If `translation original reveal` is enabled, finalize the translation body first, then refresh `translation_alignment.json`, then build, then validate.
- Lecture-informed refresh for `professor-prep` or quizzes requires an approved dated lecture bundle first; reading/PDF facts remain the source of truth, while lecture evidence only changes priority, distractors, follow-up pressure, and preferred answer shape.
- Visible tabs/pages are not approval evidence. Final approval follows artifact-inclusive validation plus `manual_review` in `meta.json`.

Use [CONTENT_RULES.md](CONTENT_RULES.md) for:
- exact Stage 1 / Stage 2 / Stage 3 rules
- workflow-only rules vs machine-enforced gates
- validation thresholds and status meanings
- Stage 3 micro-chunk thresholds and manual checkpoints
- lecture-recording workflow, evidence hierarchy, and professor-prep rules
- homepage ordering and syllabus date conflict handling

## Build And Validate
Build one reading:

```powershell
node scripts/build_site.js --slug hulur-et-al-2019
```

Run source-only QA while work is still in progress:

```powershell
node scripts/validate_content.js --slug hulur-et-al-2019 --source-only
```

Run publish-candidate validation:

```powershell
node scripts/validate_content.js --slug hulur-et-al-2019
```

`--require-built-artifacts` is already the default behavior. Use it for explicitness if you want, but the real opt-out is `--source-only`.

Full-site rebuild is for repo-wide refreshes:

```powershell
node scripts/build_site.js
```

Manual approval is stored in:

```powershell
content\readings\<slug>\meta.json
```

Generated approval summary is written to:

```powershell
APPROVAL_STATUS.md
```

Then open:

```powershell
start docs\index.html
```

## Homepage Chatbot
- The homepage supports a floating chatbot widget in the lower-right corner.
- This is a static-site UI only. Do not put `OPENAI_API_KEY` in browser code.
- Configure the public proxy URL in `scripts/site_chatbot_config.js`, then rebuild.
- Setup details and a serverless proxy example live in [CHATBOT_SETUP.md](CHATBOT_SETUP.md).

## Notes
- The site is Korean-first, while original English titles, author names, and source text stay in English where needed.
- Missing content should still produce a valid placeholder page.
- For detailed workflow, validation, translation, lecture-recording, homepage, and professor-prep rules, use [CONTENT_RULES.md](CONTENT_RULES.md).
