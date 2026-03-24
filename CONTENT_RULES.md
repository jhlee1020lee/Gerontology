# Content Rule Appendix

## 1. Repository / build / PDF rules
- `docs/` is the only final generated site output folder.
- `site/` must not exist as a parallel build target.
- Keep all generated links relative so the site works from local files and from static hosting.
- `source_pdfs/` is source/input material. It may exist locally and may or may not be version-controlled.
- Do not assume source PDFs are unavailable for version control.
- Do not confuse source/input PDFs with deployable public PDFs.
- When a reading supports public PDF access, the deployable PDF should live under a stable `docs/` path such as `docs/pdfs/<slug>.pdf`.
- In metadata terms:
  - `source_pdf` points to source/input material
  - `public_pdf` points to deployable public output under `docs/`

## 2. Workflow model
- Stop treating the project as one giant all-at-once generation task.
- Preferred workflow is one reading at a time.
- Future automation should finish one reading before moving to the next reading.
- Use stage-based completion with explicit validation gates.
- For English readings, original-text extraction and Korean translation must be separate stages.
- Do not interleave translation, quizzes, professor-prep, and site-polish in one low-quality generation step.
- Prefer staged completion over one huge low-quality batch.

## 3. Hulur benchmark rule
- `hulur-et-al-2019` is the current workflow and quality benchmark reading.
- Use Hulur as the model for:
  - Stage 1 before Stage 2 before Stage 3 sequencing
  - complete original-text extraction for English readings
  - complete contiguous translation for English readings
  - deployable public PDF exposure
  - reading-hub completeness
  - validation discipline
  - minimal professor-prep published schema
- Do not generalize Hulur-specific subject matter into global rules.

## 4. Stage model

### 4.1 Stage 1 = original extraction
- `개요`
- `설명 영상`
- `전체 글`
- `한국어 번역` for English readings only
- deployable online PDF access when public PDF access is supported

Stage 1 content meaning:
- Stage 1 must be executed in three contiguous passes:
  - Pass 1: front third extraction
  - Pass 2: middle third extraction
  - Pass 3: final third extraction plus end-to-end extraction QA
- `설명 영상` must have a public notebookLM video or equivalent deployable video asset on the landing page.
- `전체 글` must contain the full original text only.
- `전체 글` must not use summary-style rewriting, compression, or a clean-overview substitute.
- `전체 글` must preserve section order and the readable full body.
- Photos, tables, figures, and graphs from the source reading must be inserted directly into `전체 글` as image assets, not omitted and not replaced with text-only placeholders.
- `한국어 번역` must contain the full Korean translation of the original reading.
- `한국어 번역` must not use summary-style translation, abridged translation, selective excerpts, or patchy translation.
- `한국어 번역` must preserve section order and heading structure.
- Photos, tables, figures, and graphs from the source reading must also be inserted directly into `한국어 번역` as image assets in the corresponding positions.

### 4.2 Stage 2 = Korean translation
- `?쒓뎅??踰덉뿭` for English readings only

Stage 2 content meaning:
- `?쒓뎅??踰덉뿭` must contain the full Korean translation of the original reading.
- `?쒓뎅??踰덉뿭` must not use summary-style translation, abridged translation, selective excerpts, or patchy translation.
- `?쒓뎅??踰덉뿭` must preserve section order and heading structure.
- Photos, tables, figures, and graphs from the source reading must also be inserted directly into `?쒓뎅??踰덉뿭` as image assets in the corresponding positions.
- Stage 2 must be executed in three contiguous passes:
  - Pass 1: front third translation
  - Pass 2: middle third translation
  - Pass 3: final third translation plus end-to-end translation QA

### 4.3 Stage 3 = study package
- `핵심 요약`
- `핵심 개념`
- `헷갈리는 포인트`
- `OX 퀴즈`
- `단답형 퀴즈`
- `객관식 퀴즈`
- `시험 직전 정리`
- `교수님 구술 대비`

### 4.4 Stage ordering rule
- Finish and validate Stage 1 before starting Stage 2 for a reading.
- Finish and validate Stage 2 before starting Stage 3 for a reading.
- Do not leave Stage 1 or Stage 2 incomplete and then move to later readings.

## 5. Validation gates

### 5.1 Stage 1 validation
Stage 1 is valid only if all of the following are true:

- Translation completeness is not part of Stage 1. It is validated only in Stage 2.
- Stage 1 Pass 1-3 are all complete, contiguous, and merged into one readable `full` body
- `전체 글` contains the full original text, preserving section order and the readable full body
- `한국어 번역` is a complete full Korean translation for English readings, preserving section order and heading structure
- photos, tables, figures, and graphs from the source reading are present in `전체 글` and `한국어 번역` as direct image inserts where applicable
- deployable PDF path exists when public PDF access is supported
- reading-hub links work

Failure handling:
- Translation gaps belong to Stage 2 failure handling, not Stage 1.
- If any Stage 1 pass is missing or patchy, the reading is not complete.
- If `전체 글` is not full text, the reading is not complete.
- If `한국어 번역` is not a complete full translation, the reading is not complete.
- Such readings must be marked `partial` or `blocked`, not done.

### 5.2 Stage 2 validation
Stage 2 is valid only if all of the following are true:

- `translation` is a complete full Korean translation for English readings, preserving section order and heading structure
- Stage 2 Pass 1-3 are all complete, contiguous, and merged into one readable `translation` body
- photos, tables, figures, and graphs from the source reading are present in `translation` as direct image inserts where applicable
- reading-hub links work

Failure handling:
- If `translation` is not a complete full translation, the reading is not complete.
- If any Stage 2 pass is missing, compressed, or patchy, the reading is not complete.
- Such readings must be marked `partial` or `blocked`, not done.

### 5.3 Stage 3 validation
Stage 3 is valid only if all of the following are true:

- `summary` exists and passes schema validation
- `concepts` exists and passes schema validation
- `pitfalls` exists
- `review-sheet` exists
- `professor-prep` exists
- OX count = `15`
- short-answer count = `15`
- MCQ count = `15`
- all Stage 3 pages are linked from the reading hub

Schema validation expectations:

- `summary` must include a clear lead section and enough structured bullet content to show the major claims and why they matter.
- `concepts` must include, for each concept:
  - Korean label
  - original English term
  - one-sentence exact definition
  - plain-language explanation
  - why it matters in this reading
  - one common confusion point
- `professor-prep` must publish at least `15` cards using the minimal shape:
  - `title`
  - `answer_30s`

### 5.4 Incomplete readings
- If any required part is incomplete, mark the reading `partial` or `blocked`.
- Do not present incomplete work as complete.

### 5.5 Status model
- Page status values:
  - `missing`
  - `schema_fail`
  - `schema_pass`
  - `approved`
  - `not_applicable`
- Reading/workflow status values:
  - `blocked`
  - `partial`
  - `manual_review_required`
  - `approved`
- `schema_pass` means the generated page cleared the structural validator but still needs manual review.
- Automation should stop after the first reading that is not `approved`.
- Use `node scripts/validate_content.js` as the local validation gate before moving on to the next reading.

## 6. Date / order rules
- Homepage reading order and displayed dates must follow syllabus class-date order.
- Weekly class schedule is the primary truth source for dates.
- If the reading appendix conflicts with the weekly schedule, prefer the weekly schedule.
- Preserve the local source filename when a syllabus citation label differs from the local filename.

Important conflict resolution:
- Use `3/17` for Chapter 3, not `3/18`.
- Use `4/30` for Chapter 10, not `4/31`.
- Do not show `5/05` as a reading date because it is a holiday / no-class day.

Exact homepage order:

1. `3/05`  `[CH1]Gerontology.pdf`
2. `3/10`  `[CH2]Gerontology.pdf`
3. `3/12`  `Beck, 2016.pdf`
4. `3/17`  `[CH3]Gerontology.pdf`
5. `3/19`  `[CH4]Gerontology.pdf`
6. `3/24`  `Hülür et al., 2019.pdf`
7. `3/26`  `[CH5]Gerontology.pdf`
8. `3/31`  `Olshansky & Carnes, 2019.pdf`
9. `3/31`  `Kerrigan, 2018.pdf`
10. `4/02` `[CH6]Gerontology.pdf`
11. `4/07` `Park & McDonough, 2013.pdf`
12. `4/09` `[CH7]Gerontology.pdf`
13. `4/14` `Wagner et al., 2016.pdf`
14. `4/21` `[CH8]Gerontology.pdf`
15. `4/23` `Suitor et al., 2014.pdf`
16. `4/28` `[CH9]Gerontology.pdf`
17. `4/30` `[CH10]Gerontology.pdf`
18. `5/07` `Blieszner, 2014.pdf`
19. `5/12` `[CH11]Gerontology.pdf`
20. `5/14` `Calvo et al., 2018.pdf`
21. `5/19` `[CH12]Gerontology.pdf`
22. `5/21` `Leggett et al., 2020.pdf`
23. `5/26` `[CH13]Gerontology.pdf`
24. `5/28` `Konrath et al., 2012.pdf`
25. `6/02` `[CH14]Gerontology.pdf`
26. `6/09` `[CH15]Gerontology.pdf`
27. `6/09` `Carr & Fang, 2021.pdf`

## 7. Homepage rules
- Homepage must not read like build documentation or admin output.
- Remove or forbid helper/admin copy such as:
  - build counters
  - generator notes
  - manifest file references shown as UI copy
  - reading-count summaries
  - page-count summaries
  - offline/build/admin helper notes
- The homepage should feel like a clean reading dashboard only.

## 8. Global content style rules
- Korean-first UI and content framing by default.
- Preserve English only where the original English title, author name, or source text itself must be shown.
- Do not write only in stiff lecture-note style.
- Do not write in flashy AI-dashboard style.
- Keep the site calm, plain, academic, and readable.

## 9. Professor style analysis rules
Derived from lecture-transcript review dated `2026-03-05`, `2026-03-10`, `2026-03-12`, `2026-03-17`, and `2026-03-19`.

The professor strongly prefers:

1. directly answering the exact question
2. saying exactly what was interesting, new, or important
3. defining the key concept clearly
4. explaining why it matters
5. paraphrasing in the student's own words
6. using concrete examples
7. connecting to Korean context, student context, or real class context when relevant
8. giving balanced, research-based interpretations rather than stereotypes

The professor strongly dislikes:

1. vague answers like `흥미로웠다`, `복합적이다`, `다양하다` without explanation
2. drifting away from the exact question
3. filler and delay
4. generic textbook tone
5. AI-sounding answers
6. concept-name dropping without actual explanation

The professor frequently asks:

- `그게 뭐야?`
- `왜 그렇게 보는데?`
- `뭐가 새로웠는데?`
- `다시 말해봐.`
- `다시 한번 다르게 말해봐.`
- `구체적으로 말해봐.`
- `그게 왜 중요한데?`
- `연구에서는 뭐라고 하는데?`
- `한국에서는 어떻게 보이는데?`
- `그 설명의 한계는 뭐야?`
- `영어로 뭐지?`
- `질문을 똑바로 듣고 답해봐.`
- `본인은 어떻게 생각하는데?`

Therefore future content should optimize for:

- precise concept understanding
- follow-up resistance
- natural spoken answers
- exact rather than vague wording

### 9.1 Answer contract derived from the recordings
- If the prompt asks `무엇이 인상적이었나`, answer with:
  - one exact point
  - why it was new, surprising, or assumption-breaking
  - what that changed in your reading of the text
- If the prompt asks `왜`, give mechanism or reasoning, not a synonym for the first sentence.
- If the prompt asks `그게 뭐야`, define the concept in one exact sentence first, then explain it in plain Korean.
- If the prompt asks `영어로 뭐지`, give the exact English term, not a rough paraphrase.
- If the prompt asks for a reaction or opinion, distinguish:
  - what the reading argues
  - what research evidence supports
  - what you personally took from it
- Do not answer with only a label such as `흥미로웠다`, `복합적이다`, `다양하다`, `중요하다`.
- Do not give broad categories without content such as `장점도 있고 단점도 있다`.
- Do not drift into a different question because the asked one is harder.
- Do not stall with filler while searching for the point. Answer first, then elaborate.
- Prefer exact anchors:
  - age
  - year
  - scholar
  - variable
  - method
  - comparison pair
  - Korean or class context when relevant
- The professor repeatedly pushes students to move from:
  - vague reaction
  - to exact concept
  - to why it matters
  - to what follows from it

### 9.2 Strong default spoken template
Use this default shape for oral-style answers unless the prompt clearly needs a different order:

1. `저는 이 글을 X 중심으로 읽었습니다.`
2. `가장 인상적이었던 건 Y였습니다.`
3. `왜냐하면 Z라는 통념/예상과 달랐기 때문입니다.`
4. `이게 중요한 이유는 A이기 때문입니다.`
5. `그래서 저는 이 글을 B라고 이해했습니다.`

Good expansions inside the template:

- exact concept definition
- exact English term when useful
- one concrete example
- one contrast pair
- one limitation or boundary condition
- one Korean-context or student-context implication when genuinely relevant

Bad expansions inside the template:

- generic praise
- dictionary-style abstraction with no claim
- personal anecdote unrelated to the reading
- AI-sounding balanced-but-empty wording
- textbook recap that never reaches a position

## 10. Page-specific content rules

### 10.1 개요
- This is not a decorative landing page.
- It should immediately tell the student:
  - what the reading is about
  - why it matters for the course
  - what kind of reading it is: `교재`, `기사`, or `논문`
  - what the likely class-discussion angle is
- It should include:
  - class date
  - reading title
  - one-sentence reading hook
  - 3 to 5 `수업에서 바로 잡힐 포인트`
- It must not include build/admin noise.
- Stage 1 reading-hub links must work from this page.

### 10.2 핵심 요약
- This is the only page where summarization is allowed.
- Not a generic abstract.
- Focus on:
  - what exactly is interesting
  - what is actually new or unexpected
  - why the point matters
- Each major point should be written as:
  - claim
  - why it is interesting, new, or important
- Avoid vague summary lines such as `다양한 측면을 보여준다.`

### 10.3 전체 글
- Must contain the full original text only.
- Must be complete, not partial.
- Do not use summary-style rewriting.
- Do not compress the reading.
- Do not substitute a clean overview for the original text.
- Must preserve section order.
- Must be cleaned into readable article-style HTML.
- Complete extraction in three contiguous passes: front third, middle third, final third.
- Do not skip ahead and backfill later.
- Do not mark extraction complete until the third pass and end-to-end QA are done.
- Photos, tables, figures, and graphs from the source reading must be inserted directly as image assets in the reading flow.
- Do not drop visual materials that carry original content.
- Do not convert tables, figures, or graphs into summary prose as a substitute for the original visual.
- Do not silently skip major sections.
- Stage 1 validation requires the readable full body, not a shortened substitute.
- Stage 1 validation also requires the landing-page explanation video to exist and be approved for public release.
- If extraction quality is poor, fix extraction first instead of publishing obviously broken text.
- Never substitute summary content into `full.html`.

### 10.4 한국어 번역
- English readings must be translated only after Stage 1 extraction is complete.
- Translation is its own dedicated stage, separate from extraction.
- Translation must contain the full Korean translation of the original reading.
- Translation must be complete and contiguous, not patchy.
- Do not use summary-style translation.
- Do not publish abridged translation.
- Do not publish selective excerpt translation.
- Complete translation in three contiguous passes: front third, middle third, final third.
- The translation stage is not complete until the third pass and end-to-end QA are done.
- Preserve section order and headings.
- Photos, tables, figures, and graphs from the source reading must also appear directly as image assets in the translated reading flow.
- Do not omit original visual materials from `translation.html` just because the surrounding text is translated.
- If translation cannot be completed cleanly, mark the reading blocked rather than pretending the page is finished.
- Translation quality matters more than raw batch speed.
- Never substitute summary content into `translation.html`.

### 10.5 핵심 개념
For each major concept, include:

- Korean label
- original English term
- one-sentence exact definition
- plain-language explanation in the student's own words
- why the concept matters in this reading
- one common confusion point

This page should especially support the professor's habit of asking for English terms and exact concept definitions.

### 10.6 헷갈리는 포인트
This page must explicitly contrast commonly confused pairs.

Each item should include:

- `A vs B`
- short distinction
- why students confuse them
- one example

Typical pairs include:

- `Gerontology vs Geriatrics`
- `chronological age vs biological age vs subjective age`
- `age effect vs cohort effect vs period effect`
- `cross-sectional vs longitudinal`
- `disengagement theory vs activity theory vs continuity theory`
- `positive aging vs unrealistic fantasy about aging`
- `내가 원하는 나이 vs 사회가 적절하다고 보는 나이`

This page should be built for follow-up defense.

### 10.7 OX 퀴즈
- Keep `15` items.
- Test meaningful conceptual distinctions, not trivia only.
- Many items should target common classroom misconceptions.
- Every item must include answer and explanation.

### 10.8 단답형 퀴즈
- This must be true short-answer only.
- Allowed answer types only:
  - one term
  - one short phrase
  - one name
  - one number
  - under 8 words
- Never use mini-essay prompts.
- Never use range answers.
- Prefer exact concepts, scholars, English terms, ages, years, theories, methods, and key labels.
- Every item must include `accepted_answers` and explanation.

### 10.9 객관식 퀴즈
- Keep `15` items.
- Always use `4` options.
- Use distractors based on actual classroom confusions.
- Explanations must tell:
  - why the correct option is correct
  - why the tempting wrong idea is wrong

### 10.10 시험 직전 정리
- Must be compact, not bloated.
- Build it like a last-minute recovery page.
- Include:
  - 핵심 정의
  - 꼭 구분해야 하는 대비쌍
  - 자주 틀리는 포인트
  - 팝업퀴즈용 핵심 OX / 객관식 포인트
  - 영어 용어 암기 포인트

### 10.11 교수님 구술 대비
- This page is only for model answers to `이 글을 어떻게 읽었는지`.
- Do not treat it as a broad oral-exam framework.
- Do not require `likely professor prompt`, `why this works`, `bad answer`, `follow-up`, or `recovery` as the default published schema.
- Default published item shape should be only:
  - `title`
  - `30-second model answer`
- Each reading should have at least `15` model answers by default.
- Prefer `15` to `20` when quality allows.
- Each answer should be around `30` seconds when spoken.

Intended spoken logic:

- `나는 이 글을 무엇 중심으로 읽었다`
- `왜 그 포인트가 중요하거나 새로웠다`
- `그래서 이 글의 핵심을 어떻게 이해했다`

Required answer features derived from the recordings:

- open with the answer, not with throat-clearing
- mention one exact concept, finding, distinction, or question
- explain `왜` in a causal or interpretive way
- include at least one concrete anchor such as:
  - age
  - year
  - variable
  - method
  - theory contrast
  - Korean-context implication
- be defensible against likely follow-up questions:
  - `그게 뭐야?`
  - `왜 중요한데?`
  - `연구에서는 뭐라고 하는데?`
  - `영어로 뭐지?`
- if the answer contains a personal reaction, tie it back to the text immediately
- avoid broad praise without content
- avoid empty `장단점` listing unless each side is specified
- avoid `요약체` narration that sounds like a book report rather than a class answer

Default micro-structure for each `answer_30s`:

- 1 sentence: what you focused on
- 1 sentence: what exactly was new / surprising / important
- 1 sentence: why it matters for this reading or course
- 1 sentence: one concrete distinction, example, or implication

Tone rules:

- natural spoken student tone
- direct
- specific
- not vague
- not textbook-summary style
- not AI-sounding
- must sound like someone who actually read the text

Angle variety within the single frame of `어떻게 읽었는지` can include:

- concept-centered
- research-question-centered
- method-centered
- finding-centered
- limitation-aware
- Korean-context-centered
- changed-my-view-centered
- theory-vs-reality-centered

Repository compatibility note:

- Existing source schemas may retain extra historical fields in some readings.
- Future default generation should target the minimal published schema of:
  - `title`
  - `answer_30s`
- If extra fields still exist in older readings, treat them as legacy support material rather than the default published contract.
