/goals

너는 이 저장소의 “성인발달과 노화 논문 읽기 사이트”를 개선하는 프론트엔드/콘텐츠 파이프라인 설계자다.

이번 작업의 핵심은 단순히 예쁜 UI를 만드는 것이 아니다. 이 사이트는 날짜별로 논문 원문, 번역본, 요약, 핵심 개념, 교수님 질문 대비, 퀴즈를 제공하는 학습용 사이트다. 현재 문제는 두 가지다.

1. 논문/번역본 읽기 화면이 긴 텍스트 덩어리 중심이라 가독성이 낮다.
2. 논문 원문 추출과 번역 과정에서 AI가 임의로 내용을 누락하거나 축약하는 문제가 있다.

이번 작업은 반드시 “전문가들이 실제로 쓰는 공개 기준/작업물/가이드”를 참고해서 진행하라. 단, 라이선스가 불명확한 내용을 그대로 복사하지 말고, 구조와 원칙을 참고하여 이 저장소에 맞게 재구성하라. 외부 자료를 참고한 경우 docs/references/EXTERNAL_REFERENCES.md에 출처, 참고한 이유, 적용 방식, 복사 여부, 라이선스 확인 여부를 남겨라.

============================================================
0. 반드시 참고할 외부 기준
============================================================

가능하면 웹에서 직접 확인하라. 웹 접근이 불가능하면, 아래 목록을 docs/references/EXTERNAL_REFERENCES.md에 “확인 필요”로 남기고, 현재 지식으로 임시 초안을 만들되 최종 확정처럼 말하지 마라.

A. AI 에이전트 지침 파일 참고

1. AGENTS.md official
- https://agents.md/
- 목적: AI coding agent를 위한 README 형식 참고
- 적용: 루트 AGENTS.md 구조, setup/test/check 명령, 금지사항, 프로젝트 컨텍스트 정리 방식

2. OpenAI Codex AGENTS.md guide
- https://developers.openai.com/codex/guides/agents-md
- 목적: Codex가 AGENTS.md를 어떻게 읽는지 확인
- 적용: Codex가 반복 작업에서 반드시 따라야 할 저장소 지침 작성

3. OpenAI Codex Skills / SKILL.md
- https://developers.openai.com/codex/skills
- https://github.com/openai/skills
- 목적: 반복 작업을 SKILL.md로 패키징하는 방식 참고
- 적용: 논문 추출, 번역 검수, 퀴즈 생성 같은 반복 작업을 skill-like markdown으로 구조화

4. awesome-claude-md / CLAUDE.md 예시
- https://github.com/josix/awesome-claude-md
- 목적: Claude/Codex 계열 프로젝트 지침 파일 사례 참고
- 적용: 사람도 읽기 쉬운 프로젝트 지침 파일 구성

B. DESIGN.md / UI 지침 참고

5. getdesign.md
- https://getdesign.md/
- 목적: DESIGN.md로 UI 스타일을 명시하는 방식 참고
- 적용: 이 사이트 전용 DESIGN.md 또는 READING_UI_RULES.md 작성

6. awesome-design-md
- https://github.com/VoltAgent/awesome-design-md
- 목적: 인기 서비스 스타일을 DESIGN.md로 정리하는 방식 참고
- 적용: 색상, 타이포그래피, spacing, layout, component rules의 문서 구조 참고
- 주의: 특정 브랜드 스타일을 그대로 베끼지 말 것. “논문 읽기 사이트”에 맞게 차분하고 학술적인 방향으로 재구성할 것.

7. GOV.UK Design System
- https://design-system.service.gov.uk/
- https://design-system.service.gov.uk/styles/
- 목적: 공공 서비스 수준의 명확한 레이아웃, 타이포그래피, spacing, 접근성 참고
- 적용: 본문 구조, 제목 계층, spacing, 페이지 레이아웃

8. GOV.UK Writing for GOV.UK
- https://www.gov.uk/guidance/content-design/writing-for-gov-uk
- 목적: 명확하고 이해하기 쉬운 콘텐츠 작성 방식 참고
- 적용: UI 문구, 버튼명, 안내문, 경고문 작성

9. IBM Carbon Design System Content Guidelines
- https://carbondesignsystem.com/guidelines/content/overview/
- https://carbondesignsystem.com/guidelines/content/writing-style/
- 목적: 제품 UI에서 일관된 문구와 콘텐츠 규칙을 만드는 방식 참고
- 적용: 버튼, 탭, 카드 제목, 안내 문구의 일관성

10. Apple Human Interface Guidelines - Typography
- https://developer.apple.com/design/human-interface-guidelines/typography
- 목적: 읽기 쉬운 폰트 크기, 굵기, 대비, 가독성 기준 참고
- 적용: 본문, 제목, 캡션, 태그의 시각 계층

11. W3C WCAG Text Spacing
- https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- 목적: 접근 가능한 줄간격, 문단 간격 기준 참고
- 적용: 본문 line-height, paragraph spacing, letter spacing, 모바일 접근성

12. Baymard Institute - Readability line length
- https://baymard.com/blog/line-length-readability
- 목적: 긴 텍스트 읽기에서 적절한 line length 참고
- 적용: 논문 본문 최대 너비, 한 줄 글자 수 제한

C. 논문 구조/추출 기준 참고

13. APA Journal Article Reporting Standards, JARS
- https://apastyle.apa.org/jars
- 목적: 논문에서 반드시 확인해야 하는 연구 질문, 방법, 표본, 분석, 결과, 한계 항목 참고
- 적용: PAPER_EXTRACTION_RULES.md와 EXTRACTION_QA_CHECKLIST.md 작성

14. EQUATOR Network Reporting Guidelines
- https://www.equator-network.org/reporting-guidelines/
- 목적: 연구보고의 투명성, 누락 방지 체크리스트 방식 참고
- 적용: 연구 설계별 추출 체크리스트 작성

15. PRISMA 2020 Checklist
- https://www.prisma-statement.org/prisma-2020-checklist
- 목적: 리뷰 논문/체계적 문헌고찰 논문을 처리할 때 누락 방지 기준 참고
- 적용: 리뷰 논문일 경우 검색 전략, 포함/제외 기준, 연구 수, 종합 방식 추출

16. IMRaD structure
- https://libguides.umn.edu/StructureResearchPaper
- 목적: Introduction, Methods, Results, Discussion 구조 참고
- 적용: 실증 논문 섹션 추출과 화면 섹션 구성

D. 번역/로컬라이제이션/검수 기준 참고

17. ISO 17100 Translation Services
- https://www.iso.org/standard/59149.html
- 목적: 번역 서비스의 핵심 프로세스, 검토, 품질 관리 기준 참고
- 적용: 번역 → 검토 → 품질확인 → 최종 승인 흐름 만들기

18. Google Developer Documentation Style Guide - Write for a global audience
- https://developers.google.com/style/translation
- 목적: 번역 가능한 문장, 명확한 문장, 용어 일관성 참고
- 적용: TRANSLATION_RULES.md 작성

19. Microsoft Localization Style Guides
- https://learn.microsoft.com/en-us/globalization/reference/microsoft-style-guides
- 목적: 언어별 스타일 가이드, 용어 일관성, 로컬라이제이션 규칙 참고
- 적용: 한국어 번역 스타일, 용어표, UI 문구 일관성

E. 퀴즈/학습자료 기준 참고

20. Moodle GIFT format
- https://docs.moodle.org/en/GIFT_format
- 목적: Markdown/텍스트 기반 퀴즈 문항 구조 참고
- 적용: OX, 단답, 객관식 퀴즈 저장 구조 개선

21. 1EdTech QTI specification
- https://www.1edtech.org/standards/qti/index
- 목적: 평가 문항의 교환 가능한 구조 참고
- 적용: quiz JSON schema 설계 시 참고

22. LiaScript
- https://liascript.github.io/
- https://github.com/LiaScript/LiaScript
- 목적: Markdown 기반 인터랙티브 학습자료 구조 참고
- 적용: inline quiz, concept check, self-test UI 참고

23. University multiple-choice question writing guides
- https://ctl.utexas.edu/multiple-choice-questions
- https://www.eoas.ubc.ca/research/cwsei/resources/mc-guidelines.html
- 목적: 좋은 객관식 문항과 오답 선택지 작성 기준 참고
- 적용: QUIZ_RULES.md 작성
- 특히 오답은 그럴듯하지만 명확히 틀려야 하며, “모두 정답”, “위 내용 모두 아님”은 남발하지 말 것.

============================================================
1. 저장소 구조 파악
============================================================

먼저 저장소 구조를 확인하라. 특히 다음을 확인하라.

- README.md
- AGENTS.md
- CONTENT_RULES.md
- docs/
- docs/index.html
- docs/manifest/readings.json
- docs/readings/ 또는 실제 읽기 자료 폴더
- 논문 원문/번역본 markdown 또는 JSON 저장 위치
- 현재 논문/번역본 렌더링 JS/CSS
- 현재 퀴즈 렌더링 JS/CSS
- 빌드/검증 스크립트
- GitHub Pages 배포 구조

기존 구조를 함부로 갈아엎지 마라. manifest/readings.json 스키마와 GitHub Pages 배포 구조를 깨지 마라. 서버 의존성은 추가하지 마라.

============================================================
2. 이번에 만들거나 정비할 md 파일
============================================================

루트 또는 docs/guides/에 다음 파일을 만들거나, 이미 있으면 보존하면서 개선하라.

1. AGENTS.md
- Codex가 이 프로젝트에서 반드시 따라야 할 전체 지침
- 사이트 목적, 폴더 구조, 실행/검증 명령, 금지사항
- 다른 규칙 파일 링크 포함

2. CONTENT_RULES.md
- 논문 기반 콘텐츠 작성 원칙
- 원문 근거 우선
- 과장 금지
- 인과 표현 주의
- 수업 연결 방식
- 한국어 문체 기준

3. READING_WORKFLOW.md
- 날짜별 논문 추가 절차
- 논문 정보 확인 → 원문 추출 → 원문 세그먼트화 → 번역 → 정렬 검수 → 요약 → 개념 → 교수님 질문 대비 → 퀴즈 → manifest 등록 → 로컬 검증

4. PAPER_EXTRACTION_RULES.md
- 논문 원문 추출 규칙
- 초록, 도입, 이론, 방법, 결과, 논의, 한계, 표, 그림, 참고문헌 처리 기준
- 실증 논문, 리뷰 논문, 이론 논문 구분 기준
- APA JARS, EQUATOR, PRISMA, IMRaD를 참고해서 항목화

5. SOURCE_SEGMENTATION_RULES.md
- 원문을 절대 통째로 대충 요약하지 말고, 섹션/문단 단위로 segment_id를 붙이는 규칙
- 예:
  - ABS-001
  - INTRO-001
  - THEORY-001
  - METHOD-001
  - RESULT-001
  - DISCUSSION-001
  - LIMIT-001
  - TABLE-001
  - FIGURE-001
  - REF-001
- 각 segment에는 section, paragraph_index, original_text, word_count, char_count, page_or_location, notes를 둔다.

6. TRANSLATION_RULES.md
- 영어 논문을 한국어로 번역할 때의 원칙
- 원문 논리 순서 유지
- 학술 용어 첫 등장 시 영어 병기
- 자연스러운 한국어
- 임의 생략 금지
- 요약 번역 금지
- 과도한 의역 금지
- 표/그림/수치/인용/괄호 안 정보 누락 금지
- 노년학/성인발달 용어표 포함

7. TRANSLATION_ALIGNMENT_QA.md
- 가장 중요하다.
- 원문 segment_id와 번역 segment_id가 1:1로 대응하는지 검수하는 규칙
- 번역문이 원문을 요약하거나 합치거나 생략했는지 확인하는 절차
- 누락, 축약, 병합, 순서 변경, 수치 누락, 인용 누락, 표/그림 누락을 탐지하는 체크리스트
- 검수 실패 조건을 명확히 적는다.

검수 실패 조건:
- 원문 segment_id 중 번역이 없는 항목이 하나라도 있으면 실패
- 번역 segment_id가 원문 segment_id와 다르면 실패
- 원문 문단 2개 이상을 하나의 번역문으로 병합했는데 이유가 없으면 실패
- 표, 그림, 수치, 괄호 안 조건, 인용, 연구대상 수, 분석방법이 빠지면 실패
- 번역문이 “요약하면”, “전반적으로”, “핵심은” 같은 요약형 표현으로 원문을 대체하면 실패
- 원문에는 있는 제한점/한계/주의 표현이 빠지면 실패
- 인과가 아닌 표현을 인과처럼 번역하면 실패
- 번역자가 임의로 수업 해석을 끼워 넣으면 실패

8. EXTRACTION_COVERAGE_REPORT.md
- 각 논문 처리 후 자동 또는 수동으로 남길 보고서 형식
- 전체 섹션 수
- 전체 segment 수
- 추출된 segment 수
- 번역 완료 segment 수
- 누락 segment 목록
- 표/그림/참고문헌 처리 여부
- 검수 통과/실패
- 남은 TODO

9. QUIZ_RULES.md
- OX, 단답, 객관식 퀴즈 생성 규칙
- 단순 암기보다 오해 방지형 문항 우선
- 모든 문항은 근거 segment_id를 가져야 함
- 정답 해설에는 근거 segment_id를 남김
- 객관식 오답은 그럴듯하지만 명확히 틀려야 함
- “모두 정답”, “위 내용 모두 아님” 남발 금지

10. PROFESSOR_PREP_RULES.md
- 교수님 질문 대비 답변 생성 규칙
- “이 논문을 왜 읽는가”
- “수업 개념과 어떻게 연결되는가”
- “이 연구의 핵심 한계는 무엇인가”
- “이 결과를 과장하면 어떤 오류가 생기는가”
- 답변은 20~40초 발표 가능한 분량
- 모든 답변은 근거 segment_id를 가져야 함

11. READING_UI_RULES.md
- 논문 원문/번역본 읽기 화면의 UI 원칙
- 목표는 장식이 아니라 가독성, 집중도, 복습 효율
- GOV.UK, IBM Carbon, Apple HIG, W3C WCAG, Baymard 기준을 참고
- 본문 최대 너비
- line-height
- paragraph spacing
- 제목 계층
- 초록/핵심 질문/연구방법/핵심 결과/주의할 해석의 시각적 구분
- 원문 보기 방식
- 번역문 보기 방식
- 긴 문단 쪼개기
- 우측 목차
- 읽기 진행률
- 키워드/태그
- 모바일 대응
- 프린트/PDF 저장 가능성

12. ARTICLE_RENDERING_RULES.md
- markdown 또는 JSON 콘텐츠를 HTML로 렌더링하는 컴포넌트 규칙
- 다음 컴포넌트 정의:
  - article-header
  - abstract-card
  - section-block
  - original-toggle
  - original-translation-pair
  - translation-block
  - key-concept-callout
  - method-note
  - caution-note
  - quote-block
  - table-note
  - figure-note
  - professor-question-card
  - inline-quiz-card
  - reading-progress
  - sticky-toc
  - source-segment-anchor

13. READABILITY_CHECKLIST.md
- 새 논문 페이지 추가 후 확인할 체크리스트
- 한 화면에 텍스트가 너무 빽빽하지 않은가
- 본문 한 줄이 과도하게 길지 않은가
- 문단이 5~7줄 이상 계속되지 않는가
- 제목 계층이 명확한가
- 원문과 번역문이 헷갈리지 않는가
- 원문 보기 토글이 실제 segment와 연결되는가
- 모바일에서 목차가 본문을 방해하지 않는가
- 태그가 단순 장식이 아니라 복습 키워드 역할을 하는가

14. docs/references/EXTERNAL_REFERENCES.md
- 참고한 외부 자료 목록
- 각 자료별:
  - URL
  - 자료 성격
  - 참고한 이유
  - 이 프로젝트에 적용한 부분
  - 직접 복사 여부
  - 라이선스/저작권 확인 여부
- 외부 문구를 길게 복사하지 말 것.

============================================================
3. 원문 추출/번역 누락 방지 시스템 만들기
============================================================

현재 가장 중요한 문제는 “AI가 논문을 번역할 때 지 혼자 누락하거나 축약하는 것”이다. 이 문제를 해결하기 위해, 번역을 자유 작성 방식으로 만들지 말고 반드시 segment alignment 기반으로 바꿔라.

필수 설계:

A. source_segments.json 또는 source_segments.md
- 논문 원문을 섹션/문단 단위로 쪼갠다.
- 각 segment에 고유 ID를 붙인다.
- 원문 텍스트를 보존한다.
- 표/그림/주석/참고문헌도 가능하면 별도 segment로 둔다.

예시 schema:

{
  "paper_id": "string",
  "title": "string",
  "segments": [
    {
      "segment_id": "ABS-001",
      "section": "Abstract",
      "paragraph_index": 1,
      "source_location": "p.1",
      "original_text": "...",
      "word_count": 120,
      "char_count": 740,
      "contains_numbers": true,
      "contains_citations": true,
      "contains_table_or_figure_reference": false,
      "notes": ""
    }
  ]
}

B. translation_segments.json 또는 translation_segments.md
- 원문 segment_id와 동일한 ID를 사용한다.
- 번역은 절대 요약하지 않는다.
- 원문 한 segment에 번역 한 segment를 대응시킨다.
- 부득이하게 나누거나 합칠 경우 split_from 또는 merged_from을 명시하고 이유를 쓴다.

예시 schema:

{
  "paper_id": "string",
  "translations": [
    {
      "segment_id": "ABS-001",
      "ko_translation": "...",
      "translator_note": "",
      "is_summary": false,
      "review_status": "pending"
    }
  ]
}

C. alignment_report.md
- 원문 segment 수와 번역 segment 수 비교
- 누락된 segment_id 목록
- 번역만 있고 원문이 없는 segment_id 목록
- 순서가 바뀐 segment 목록
- 너무 짧아진 번역 의심 목록
- 수치/인용/표/그림 누락 의심 목록
- 최종 판정: PASS 또는 FAIL

D. translation_qa_checklist.md
- 각 논문마다 생성되는 검수 체크리스트
- 항목:
  - 모든 segment_id가 번역되었는가
  - 표/그림/수치가 유지되었는가
  - 인용이 빠지지 않았는가
  - 한계/주의 표현이 빠지지 않았는가
  - 원문에 없는 해석이 추가되지 않았는가
  - 번역이 요약문으로 바뀌지 않았는가
  - 인과 표현이 과장되지 않았는가
  - 핵심 용어가 용어표와 일치하는가

E. 실패 시 동작
- 검수 실패 시 최종 콘텐츠로 등록하지 마라.
- manifest/readings.json에 final로 표시하지 마라.
- FAIL 상태와 이유를 보고하라.
- 누락 segment를 먼저 보완한 뒤 다시 검수하라.

============================================================
4. 현재 읽기 화면 UI 개선
============================================================

현재 화면은 긴 텍스트를 그대로 보여주는 구조에 가깝다. 다음 방향으로 개선하라.

필수 개선:
- 본문 최대 너비를 읽기 적합하게 제한
- line-height 확대
- 문단 간격 확대
- 제목 계층 강화
- 초록/핵심어/섹션/원문 보기 토글을 명확히 구분
- 원문과 번역문을 segment_id 기준으로 연결
- “이 부분에 대응하는 원문 보기” 버튼을 segment 단위로 작동하게 개선
- 우측 목차에 현재 섹션 active 상태 제공
- 모바일에서는 목차를 접이식 또는 본문 아래로 이동
- 읽기 진행률 제공 가능성 검토
- 키워드/태그를 복습용 정보로 보이게 개선
- 과한 카드/그림자/색상 남발 금지
- 베이지/아이보리/차분한 회색 계열 유지
- 학술 사이트답게 차분하고 밀도 있게 구성

가능하면 다음 컴포넌트를 실제 코드에 반영하라.

- article-header
- abstract-card
- section-block
- original-toggle
- original-translation-pair
- caution-note
- method-note
- key-concept-callout
- sticky-toc
- reading-progress
- quiz-entry-card

============================================================
5. 퀴즈 생성 검수
============================================================

퀴즈도 원문 근거 없이 만들면 안 된다.

필수 조건:
- 모든 퀴즈 문항은 evidence_segment_id를 가져야 한다.
- OX 문항은 정답이 명확해야 한다.
- 객관식은 정답 1개만 명확해야 한다.
- 오답은 그럴듯해야 하지만, 원문 근거상 틀려야 한다.
- 단답형 정답은 너무 길지 않게 한다.
- 해설은 짧게 쓰되, 근거 segment_id를 남긴다.
- 논문에 없는 내용을 수업 상식으로 끼워 넣지 않는다.
- 논문 결과를 과장하지 않는다.

quiz schema가 있다면 다음 필드를 추가하거나 반영 가능성을 검토하라.

{
  "question_id": "string",
  "type": "ox | mcq | short",
  "question": "string",
  "choices": [],
  "answer": "string",
  "explanation": "string",
  "evidence_segment_id": "RESULT-003",
  "difficulty": "basic | medium | hard",
  "misconception_targeted": "string"
}

============================================================
6. 검증
============================================================

작업 후 반드시 검증하라.

A. 문서 검증
- 생성/수정한 md 파일이 서로 충돌하지 않는지 확인
- AGENTS.md가 다른 지침 파일을 참조하는지 확인
- EXTERNAL_REFERENCES.md에 참고자료가 정리되었는지 확인

B. 데이터 검증
- source_segments와 translation_segments가 있다면 segment_id가 1:1 대응하는지 확인
- 누락 segment가 없는지 확인
- alignment_report.md를 생성하거나 생성 방법을 문서화
- 검수 실패 조건을 테스트할 수 있으면 테스트

C. 사이트 검증
- 로컬에서 정적 사이트 실행
- index.html 정상 로드
- readings.json 파싱 정상
- 날짜별 읽기 페이지 정상
- 원문 보기 토글 정상
- 목차 active 상태 정상
- 모바일 폭에서 레이아웃 정상
- 퀴즈 영역 정상

D. 가능하면 자동화
- scripts/check-alignment.js 또는 scripts/check-alignment.py 작성 검토
- scripts/check-readings.js 작성 검토
- npm script 또는 간단한 명령으로 검수 가능하게 만들기

============================================================
7. 결과 보고 형식
============================================================

마지막에 다음 형식으로 보고하라.

## 참고한 외부 기준
- 자료명: 적용한 부분
- 확인 실패한 자료가 있으면 명시

## 생성/수정한 md 파일
- 파일명: 역할 요약

## 생성/수정한 코드 파일
- 파일명: 수정 내용 요약

## 원문 추출/번역 누락 방지 개선
- segment_id 방식
- alignment 검수 방식
- 실패 조건
- 자동화 여부

## 읽기 화면 UI 개선
- 가독성
- 원문/번역문 연결
- 목차
- 모바일
- 퀴즈/복습 연결

## 검증 결과
- 실행한 명령
- 확인한 페이지
- 발견한 문제
- 남은 TODO

절대 금지:
- 외부 사이트 문구를 라이선스 확인 없이 길게 복사하지 마라.
- 논문 원문을 요약해서 번역문처럼 만들지 마라.
- 번역 중 누락된 부분을 “자연스러운 번역”이라고 합리화하지 마라.
- 검수 실패를 PASS로 표시하지 마라.
- 논문에 없는 수업 해석이나 정책적 함의를 추가하지 마라.
- 기존 GitHub Pages 배포 구조를 깨지 마라.

이번 작업의 최우선순위는 다음 순서다.

1. 원문 추출/번역 누락 방지
2. 원문-번역 segment alignment 검수
3. 읽기 화면 가독성 개선
4. 퀴즈 근거 연결
5. 디자인 polish