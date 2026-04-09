# Translation Original Reveal Design

Status: proposed pilot

## Purpose

Add a low-error way to inspect original English text from `translation.html` without leaving the page.

The first request sounded like sentence-by-sentence hover. After review, that is not the safest first implementation. The current repo stores `full.md` and `translation.md` as separate markdown documents, and many readings are not structurally parallel enough for reliable automatic sentence alignment.

The design below chooses:

- explicit alignment data
- build-time rendering
- translation-page-only scope
- click/tap disclosure as the primary interaction

Desktop hover can be added later as a visual enhancement, but not as the only interaction.

## Decision Summary

- Scope this feature to `translation.html` only.
- Enable it only for English readings whose Stage 2 is already approved.
- Keep `translation.md` and `full.md` as the canonical authored sources.
- Add a sidecar alignment file per reading instead of embedding bilingual markup into markdown.
- Use paragraph or short meaning-unit alignment by default, not automatic sentence-by-sentence pairing.
- Fail closed: if a mapping is uncertain, do not publish that mapping.
- Render the reveal UI at build time. Runtime JS may only handle open/close behavior.

## Non-Goals

- No support for `summary.html`, quizzes, `review-sheet.html`, or `professor-prep.html`.
- No automatic full-page bilingual alignment.
- No word-level or phrase-level hover dictionary.
- No matching based on DOM order, text similarity, or runtime scraping of `full.html`.

## Activation Model

This feature must be metadata-gated, not hardcoded by slug.

Add a new optional block in `content/readings/<slug>/meta.json`:

```json
{
  "translation_original_reveal": {
    "enabled": true,
    "alignment_file": "translation_alignment.json",
    "mode": "details"
  }
}
```

Build-time enablement rules:

- reading language is English
- page key is `translation`
- Stage 2 is approved
- `translation_original_reveal.enabled` is `true`
- the referenced alignment file exists and passes validation

If any condition fails, `translation.html` renders normally with no reveal UI.

## Data Model

File location:

- `content/readings/<slug>/translation_alignment.json`

Canonical content sources remain:

- `content/readings/<slug>/translation.md`
- `content/readings/<slug>/full.md`

The alignment file is an additive publish-time map from a Korean translation block to a revealable English source block.

### Allowed Units

Version 1 allows only:

- `paragraph`
- `sentence_group`

Version 1 excludes:

- figures
- tables
- captions
- editor notes
- frontmatter
- references
- publication history
- list-only blocks
- quote-only blocks
- translation-added explanatory blocks that do not correspond directly to source prose

### Schema Sketch

```json
{
  "version": 1,
  "reading_slug": "hulur-et-al-2019",
  "page": "translation",
  "entries": [
    {
      "id": "intro-p1",
      "status": "verified",
      "unit": "paragraph",
      "ko_anchor": {
        "heading_path": ["서론"],
        "block_index": 0,
        "block_type": "paragraph",
        "excerpt": "지난 한 세기 동안 같은 연령에서 후발 코호트가 선발 코호트보다"
      },
      "en_anchor": {
        "heading_path": ["Introduction"],
        "block_index": 0,
        "block_type": "paragraph",
        "excerpt": "It is well documented that later-born cohorts"
      },
      "source_text": [
        "It is well documented that later-born cohorts outperform earlier-born cohorts on tests of fluid cognitive performance at the same age over the last century."
      ]
    }
  ]
}
```

### Data Rules

- `id` must be unique per reading.
- Only `status: "verified"` may ship in a feature-enabled reading.
- `ko_anchor` is the primary published anchor.
- `en_anchor` exists for validation and maintenance, not for runtime lookup.
- `source_text` must be exact original English text, not a paraphrase.
- If a translated block is too mixed or too long to map cleanly, leave it unmapped.

## Authoring Workflow

1. Finish `full.md`.
2. Finish and approve `translation.md`.
3. Create `translation_alignment.json` only for sections that can be matched cleanly.
4. Review every entry manually against both markdown sources.
5. Build and inspect `translation.html`.
6. Approve the feature only after pilot review passes.

Working rule:

- translation completeness is a prerequisite
- alignment is an optional enhancement
- unmapped translated prose remains normal translation text

## Rendering Architecture

## Parser Refactor

The current markdown renderer is string-first. For this feature, split it into two stages:

1. `parseMarkdownBlocks(text, options)` -> structured block list
2. `renderBlocks(blocks, options)` -> HTML

Required block types:

- heading
- paragraph
- list
- quote
- figure
- inline_label
- code

This refactor should preserve current HTML output before the feature is turned on.

## Translation Rendering Path

For `translation.html` with the feature enabled:

1. Parse translation markdown into blocks.
2. Parse original markdown into blocks.
3. Load `translation_alignment.json`.
4. Resolve anchors against the parsed block lists.
5. Mark only matched translation prose blocks as reveal-enabled.
6. Render reveal UI directly into generated HTML.

Do not:

- derive matches from rendered DOM
- wrap nodes after load
- match by paragraph position alone
- fetch local files at runtime

## DOM Shape

Mapped translation blocks render like this:

```html
<section class="translation-segment" data-segment-id="intro-p1">
  <p class="translation-segment-text">...</p>
  <details class="source-reveal">
    <summary>원문 보기</summary>
    <div class="source-reveal-body" lang="en">
      <p>It is well documented that later-born cohorts ...</p>
    </div>
  </details>
</section>
```

Rules:

- the reveal block sits immediately after the mapped Korean block
- no headings inside `.source-reveal-body`
- no TOC participation from reveal markup
- non-mapped blocks render exactly as they do today

## UX and Accessibility

Primary interaction:

- click/tap `원문 보기`

Desktop enhancement:

- optional hover styling on the trigger
- no hover-only reveal behavior

Reasons:

- mobile must work
- keyboard users must work
- screen readers must work
- long English source blocks do not fit well in floating tooltips

Accessibility rules:

- use native `details/summary` for v1
- visible `:focus-visible` styling is required
- revealed English content must use `lang="en"`
- do not steal focus when opening
- keep DOM order as Korean block first, English reveal second

Visual rules:

- low-emphasis trigger
- collapsed by default
- keep the reveal visually tied to the Korean block that opened it
- do not move revealed source into the right rail
- do not add icon-only triggers

## Quality Control

The feature is only as good as the alignment data.

Default mapping granularity:

- paragraph
- short meaning-unit only when clearly safer than full-paragraph mapping

Review checklist for each entry:

- variables and names match
- numbers and dates match
- polarity and negation match
- causal direction does not drift
- hedges and uncertainty remain intact
- no translation-added pedagogy is mislabeled as source text

If any of the above is uncertain, do not publish that entry.

## Validation

Extend `scripts/validate_content.js` with a translation-original-reveal validator.

Source validation:

- feature config is well-formed
- alignment file exists when enabled
- ids are unique
- allowed `unit` values only
- allowed `status` values only
- all `ko_anchor` locators resolve exactly one translation block
- all `en_anchor` locators resolve exactly one original block
- `source_text` matches the referenced source content exactly
- excluded block types are rejected

Build validation:

- reveal markup appears only on `translation.html`
- reveal markup is absent when the feature is disabled
- reveal content does not create TOC entries
- page still renders without layout breakage on narrow screens

Approval rule:

- invalid alignment data must block feature publication for that reading
- it must not silently downgrade into guessed mappings

## Pilot Plan

Pilot target:

- `hulur-et-al-2019`

Pilot page:

- `translation.html`

Pilot sections:

- `초록`
- `서론`
- `현재 연구`

These sections are prose-heavy and cleaner than table-heavy sections.

Pilot exclusions:

- editor note blocks
- all figure and table regions
- reference list
- translation-added table summaries

Pilot size target:

- around `10` to `15` verified mappings

## Promotion Criteria

Promote beyond pilot only if all are true:

- no incorrect mappings found in review
- no mobile usability break
- no TOC pollution
- no significant readability regression
- validation catches intentionally broken test entries
- authoring overhead is acceptable

## Rollback Criteria

Rollback or pause if any of the following happens:

- reviewers find wrong mappings in published blocks
- authors start guessing mappings to fill coverage
- the feature encourages sentence-by-sentence false precision
- generated page weight or clutter becomes unacceptable
- hidden or revealed source text noticeably harms find-in-page or copy behavior

## Open Question

Version 1 uses inline `details` because it is the safest static/offline-friendly pattern.

If pilot feedback shows that closed source text inside the DOM creates too much search noise, keep the same alignment schema but switch the reveal body to a template-backed lazy insertion model later.
