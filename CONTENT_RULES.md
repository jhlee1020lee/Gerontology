# Content Rule Appendix

## 1. Repository / build / local file rules
- `docs/` is the only final generated site output folder.
- `site/` must not exist as a parallel build target.
- `source_pdfs/` is local-only input and may be absent from git uploads.
- Do not assume source PDFs are version-controlled.
- Keep everything offline and relative-path only.

## 2. Workflow rules
- Stop treating the project as one giant all-at-once generation task.
- Future content generation should be done in small batches.
- Preferred batch shapes:
  - one reading at a time
  - one section type at a time when quality requires it
- Translation must be a dedicated per-reading pass for each English reading.
- Do not interleave translation, quizzes, professor-prep, and site-polish in the same generation step if that hurts quality.
- Prefer staged completion over one huge low-quality batch.

## 3. Date / order rules
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

## 4. Homepage rules
- Homepage must not read like build documentation or admin output.
- Remove or forbid helper/admin copy such as:
  - build counters
  - generator notes
  - manifest file references shown as UI copy
  - reading-count summaries
  - page-count summaries
  - offline/build/admin helper notes
- The homepage should feel like a clean reading dashboard only.

## 5. Professor style analysis rules
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
- `그게 왜 중요한데?`
- `연구에서는 뭐라고 하는데?`
- `한국에서는 어떻게 보이는데?`
- `그 설명의 한계는 뭐야?`
- `영어로 뭐지?`

Therefore future content should optimize for:

- precise concept understanding
- follow-up resistance
- natural spoken answers
- exact rather than vague wording

## 6. Global content style rules
- Korean-first UI and content framing by default.
- Preserve English only where the original English title, author name, or source text itself must be shown.
- Do not write only in stiff lecture-note style.
- Do not write in flashy AI-dashboard style.
- Keep the site calm, plain, academic, and readable.

## 7. Page-specific content rules

### 7.1 개요
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

### 7.2 핵심 요약
- Not a generic abstract.
- Focus on:
  - what exactly is interesting
  - what is actually new or unexpected
  - why the point matters
- Each major point should be written as:
  - claim
  - why it is interesting, new, or important
- Avoid vague summary lines such as `다양한 측면을 보여준다.`

### 7.3 전체 글
- Must be complete, not partial.
- Must preserve section order.
- Must be cleaned into readable article-style HTML.
- Do not silently skip major sections.
- If extraction quality is poor, fix extraction first instead of publishing obviously broken text.

### 7.4 한국어 번역
- English readings must be translated in a dedicated per-reading translation pass.
- Translation must be complete and contiguous, not patchy.
- The translation pass must cover the whole readable main body before moving on.
- Preserve section order and headings.
- If translation cannot be completed cleanly, mark it blocked rather than pretending the page is finished.
- Translation quality matters more than raw batch speed.

### 7.5 핵심 개념
For each major concept, include:

- Korean label
- original English term
- one-sentence exact definition
- plain-language explanation in the student's own words
- why the concept matters in this reading
- one common confusion point

This page should especially support the professor's habit of asking for English terms and exact concept definitions.

### 7.6 헷갈리는 포인트
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

### 7.7 OX 퀴즈
- Keep `15` items.
- Test meaningful conceptual distinctions, not trivia only.
- Many items should target common classroom misconceptions.
- Every item must include answer and explanation.

### 7.8 단답형 퀴즈
- This must be true short-answer only.
- Never use mini-essay prompts.
- Allowed answer types only:
  - one term
  - one short phrase
  - one name
  - one number
  - under 8 words
- Prefer exact concepts, scholars, English terms, ages, years, theories, methods, and key labels.
- Every item must include `accepted_answers` and explanation.
- No range answers.

### 7.9 객관식 퀴즈
- Keep `15` items.
- Always use `4` options.
- Use distractors based on actual classroom confusions.
- Explanations must tell:
  - why the correct option is correct
  - why the tempting wrong idea is wrong

### 7.10 시험 직전 정리
- Must be compact, not bloated.
- Build it like a last-minute recovery page.
- Include:
  - 핵심 정의
  - 꼭 구분해야 하는 대비쌍
  - 자주 틀리는 포인트
  - 팝업퀴즈용 핵심 OX / 객관식 포인트
  - 영어 용어 암기 포인트

### 7.11 교수님 구술 대비
- This page must be designed around the professor's real class style.
- Do not treat it as a broad oral-exam essay page.
- The primary unit is a `30-second model answer`.
- Each reading should eventually have at least `10` model answers.
- Prefer `12` to `20` when quality allows.

Prompts should be built around questions such as:

- `뭐가 흥미로웠어?`
- `뭐가 새로웠어?`
- `왜 그게 인상 깊었어?`
- `그게 왜 중요해?`
- `너는 이 글을 어떻게 읽었어?`

Each professor-prep card must include:

- title
- likely professor prompt
- 30-second model answer
- why this answer works
- bad vague answer to avoid
- one likely follow-up question
- one short recovery answer for that follow-up

Angle variety should cover:

- conceptually interesting
- methodologically interesting
- socially important
- surprising finding
- Korean-context relevance
- student-life relevance
- theory vs reality tension
- limitation that was interesting
- what changed how the student reads the topic

Tone rules:

- natural spoken student tone
- direct and specific
- not stiff
- not textbook-summary tone
- not AI-sounding
- must sound like someone who actually read the text

Repository note:

- The current repo may keep structured professor-prep source fields such as `answer_10s`, `answer_30s`, and `answer_60s`.
- If that source schema is retained, `answer_30s` should be treated as the primary published model answer, while other durations are drafting/support material rather than the page's main unit.

## 8. Translation / completeness QA rules
Future generation should validate per-reading completeness explicitly.

For each reading, especially English readings, check:

- full text coverage
- translation coverage when required
- concepts present
- pitfalls present
- OX 15 present
- short-answer 15 present
- MCQ 15 present
- review sheet present
- professor-prep present

If incomplete:

- mark the reading `partial` or `blocked`
- do not present it as complete
