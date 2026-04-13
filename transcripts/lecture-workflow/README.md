# Lecture Workflow Bundles

This folder stores derived lecture-recording workflow artifacts after raw files are normalized.

- Keep one bundle per `class_date` x `reading_slug`.
- Bundle directory format is `YYYY-MM-DD-<reading-slug>/`.
- Raw audio does not live here. Store it under `source_audio/class-recordings/`.
- Raw STT does not live here. Store it under `transcripts/class-stt/`.
- Corrected STT lives here as part of the bundle, after the raw STT has been normalized.
- Use `session.json` as the bundle manifest and canonical local reference map.

## Required bundle files

- `session.json`
- `stt-correction.md`
- `pdf-grounded-correction.md`
- `questions.json`
- `preferred-answer-rules.json`
- `disliked-answer-rules.json`
- `answer-candidates.json`
- `review.md`

## Current bundles

| Class date | Reading slug | Bundle |
| --- | --- | --- |
| 2026-03-05 | `ch01-gerontology` | `2026-03-05-ch01-gerontology/` |
| 2026-03-10 | `ch02-gerontology` | `2026-03-10-ch02-gerontology/` |
| 2026-03-12 | `beck-2016` | `2026-03-12-beck-2016/` |
| 2026-03-17 | `ch03-gerontology` | `2026-03-17-ch03-gerontology/` |
| 2026-03-19 | `ch04-gerontology` | `2026-03-19-ch04-gerontology/` |
| 2026-03-24 | `hulur-et-al-2019` | `2026-03-24-hulur-et-al-2019/` |
| 2026-03-26 | `ch05-gerontology` | `2026-03-26-ch05-gerontology/` |
| 2026-04-09 | `ch07-gerontology` | `2026-04-09-ch07-gerontology/` |

## Working notes

- `date-wise-professor-style.md` is a cross-bundle summary for date-by-date professor-style extraction.
- `professor-style-general-rules.md` is the merged professor-wide reusable guidance synthesized from the dated bundles.
- If a bundle only reflects raw transcript evidence, keep preferred-answer guidance provisional until `stt-correction.md` and `pdf-grounded-correction.md` are completed.

